import { NextResponse } from 'next/server';
import Tesseract from 'tesseract.js';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    let extractedText = "";

    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());

        // 1. EXTRACT TEXT using Local Libraries (Reliable)
        console.log(`Processing file type: ${file.type}`);

        if (file.type.startsWith("image/")) {
            // Use Tesseract for OCR
            const { data: { text } } = await Tesseract.recognize(
                buffer,
                'eng',
                { logger: m => console.log(m) }
            );
            extractedText = text;
        }
        else if (file.type === "application/pdf") {
            // Use PDF-Parse
            // @ts-ignore
            const pdf = require('pdf-parse');
            const data = await pdf(buffer);
            extractedText = data.text;
        }
        else if (file.type === "text/plain") {
            extractedText = buffer.toString('utf-8');
        }
        else {
            return NextResponse.json({ error: "Unsupported file type. Use .pdf, .jpg, .png, or .txt" }, { status: 400 });
        }

        if (!extractedText || extractedText.length < 10) {
            throw new Error("Could not extract legible text from this file.");
        }

        // 2. ATTEMPT AI ANALYSIS
        try {
            const groqApiKey = process.env.GROQ_API_KEY;
            // If we have a key, try the smart analysis
            if (groqApiKey) {
                const Groq = require("groq-sdk");
                const groq = new Groq({ apiKey: groqApiKey });

                const systemPrompt = `
                You are an expert legal AI. Analyze the following legal document text.
                Identify key clauses, potential risks ("danger clauses"), and actionable advice.
                
                Output stricly valid JSON:
                {
                  "summary": "Brief summary of the document",
                  "category": "Legal Category (e.g. Tenancy, Employment)",
                  "clauses": ["Key Clause 1", "Key Clause 2"],
                  "risks": ["Risk 1 (High Severity)", "Risk 2"],
                  "actions": ["Recommended Action 1", "Recommended Action 2"],
                  "lawyer_recommended": boolean
                }
                `;

                const completion = await groq.chat.completions.create({
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: `Analyze this text:\n\n${extractedText.slice(0, 15000)}` }
                    ],
                    model: "llama-3.3-70b-versatile",
                    temperature: 0.1,
                    response_format: { type: "json_object" },
                });

                const aiContent = completion.choices[0]?.message?.content || "{}";
                let analysisData;
                try {
                    analysisData = JSON.parse(aiContent);
                } catch (e) {
                    // Fuzzy parse or default to simple summary if JSON is broken
                    console.error("JSON Parse Error from Groq", e);
                    const match = aiContent.match(/\{[\s\S]*\}/);
                    analysisData = match ? JSON.parse(match[0]) : { summary: "Analysis completed but format was raw.", risks: [] };
                }

                return NextResponse.json({ analysis: analysisData, extractedText });
            }
        } catch (aiError) {
            console.error("AI Analysis Failed, falling back to heuristics:", aiError);
        }

        // 3. FALLBACK: HEURISTIC ANALYSIS (Regex/Keyword)
        // If AI fails (no key, or error), we perform manual analysis so the user gets a result.
        console.log("Performing Heuristic Fallback Analysis...");

        const lowerText = extractedText.toLowerCase();
        const risks = [];
        const clauses = [];
        let category = "General Legal Document";
        let summary = "A text document containing legal terms.";

        // Detect Category
        if (lowerText.includes("tenant") || lowerText.includes("landlord") || lowerText.includes("rent")) category = "Tenancy Agreement";
        else if (lowerText.includes("employer") || lowerText.includes("salary") || lowerText.includes("work")) category = "Employment Contract";
        else if (lowerText.includes("service") || lowerText.includes("client") || lowerText.includes("contractor")) category = "Service Agreement";

        // Detect Risks
        if (lowerText.includes("terminate") || lowerText.includes("termination")) risks.push("Review 'Termination Clause' carefully for notice periods.");
        if (lowerText.includes("indemnify") || lowerText.includes("indemnity")) risks.push("Contains 'Indemnity' clause - you may be liable for damages.");
        if (lowerText.includes("arbitration") || lowerText.includes("jurisdiction")) clauses.push("Dispute Resolution / Jurisdiction Clause Detected.");
        if (lowerText.includes("penalty") || lowerText.includes("interest")) risks.push("Contains financial penalty clauses for delays/breaches.");
        if (lowerText.includes("non-compete")) risks.push("Restrictive 'Non-Compete' clause found.");

        summary = `Extracted ${extractedText.length} characters from a ${category}. Content appears to discuss ${category.split(" ")[0]} terms.`;

        const heuristicData = {
            summary,
            category,
            clauses: clauses.length > 0 ? clauses : ["Standard general terms detected."],
            risks: risks.length > 0 ? risks : ["No obvious high-risk keywords found (Check manually)."],
            actions: ["Review highlighted clauses with a lawyer.", "Ensure all dates and amounts match verbal agreements."],
            lawyer_recommended: risks.length > 0
        };

        return NextResponse.json({ analysis: heuristicData, extractedText });

    } catch (error) {
        console.error("Critical Analysis Error:", error);
        return NextResponse.json({ error: "Failed to process document. Ensure specific file format." }, { status: 500 });
    }
}
