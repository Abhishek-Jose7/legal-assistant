import { NextResponse } from 'next/server';
import Groq from "groq-sdk";
const pdf = require('pdf-parse');

// Initialize Groq
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        // 1. Extract Text
        let extractedText = "";
        if (file.type === "application/pdf") {
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const data = await pdf(buffer);
            extractedText = data.text;
        } else if (file.type.startsWith("text/")) {
            extractedText = await file.text();
        } else {
            return NextResponse.json({ error: "Only PDF and Text files supported." }, { status: 400 });
        }

        // 2. Truncate for context window
        const textContext = extractedText.slice(0, 30000);

        // 3. AI Analysis
        const prompt = `
    You are an expert legal AI. Analyze the following legal document content:
    "${textContext}"

    Output the analysis strictly in this JSON format:
    {
      "summary": "2-4 sentence summary",
      "category": "Legal Category (e.g. Tenant Law - Eviction)",
      "clauses": ["Important clause 1", "Deadline: 30 days"],
      "risks": ["Risk 1", "Risk 2"],
      "actions": ["Action 1", "Action 2"],
      "rights": ["Right 1", "Right 2"],
      "lawyer_recommended": true
    }
    `;

        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: "You are a legal document analyzer. Return only valid JSON." },
                { role: "user", content: prompt }
            ],
            model: "llama3-70b-8192",
            temperature: 0.2,
            response_format: { type: "json_object" },
        });

        const text = completion.choices[0]?.message?.content || "{}";

        let analysisData;
        try {
            analysisData = JSON.parse(text);
        } catch (e) {
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                analysisData = JSON.parse(jsonMatch[0]);
            } else {
                analysisData = { summary: "Could not parse analysis.", risks: [] };
            }
        }

        return NextResponse.json({
            analysis: analysisData,
            extractedText: textContext // Send back text for follow-up context
        });

    } catch (error) {
        console.error("Analysis Error:", error);
        return NextResponse.json({ error: "Failed to analyze document" }, { status: 500 });
    }
}
