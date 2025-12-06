import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";
import pdf from 'pdf-parse';

// Use same key rotation as chat
const keys = [
    process.env.GEMINI_API_KEY,
    process.env.GEMINI_API_KEY_SECONDARY
].filter(Boolean);

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
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        const genAI = new GoogleGenerativeAI(randomKey || "");
        const model = genAI.getGenerativeModel({
            model: "gemini-pro",
            generationConfig: { responseMimeType: "application/json" }
        });

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
      "lawyer_recommended": true (boolean)
    }
    `;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        let analysisData;
        try {
            analysisData = JSON.parse(text);
        } catch (e) {
            // Fallback or regex repair if needed, but responseMimeType usually forces JSON
            analysisData = { summary: "Could not parse analysis.", risks: [] };
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
