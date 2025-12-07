import { NextResponse } from 'next/server';
import Tesseract from 'tesseract.js';
import Groq from 'groq-sdk';

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

        // 1. EXTRACT TEXT
        console.log(`Processing file type: ${file.type}, size: ${file.size}`);

        try {
            if (file.type.startsWith("image/")) {
                // Use Tesseract for OCR on Images
                console.log("Starting OCR...");
                const { data: { text } } = await Tesseract.recognize(
                    buffer,
                    'eng',
                    // { logger: m => console.log(m) } // Reduce noise
                );
                extractedText = text;
            }
            else if (file.type === "application/pdf") {
                // Use PDF-Parse for Text-Based PDFs
                console.log("Parsing PDF...");
                const pdf = require('pdf-parse');
                const data = await pdf(buffer);
                extractedText = data.text;
                console.log(`PDF Parsed. Length: ${extractedText.length}`);
            }
            else if (file.type === "text/plain") {
                extractedText = buffer.toString('utf-8');
            }
            else {
                return NextResponse.json({ error: "Unsupported file type. Use .pdf, .jpg, .png, or .txt" }, { status: 400 });
            }
        } catch (parseError: any) {
            console.error("Text Extraction Error:", parseError);
            return NextResponse.json({
                error: `Failed to read file text. If this is a PDF, ensure it is not password protected or corrupted. Error: ${parseError.message}`
            }, { status: 422 });
        }

        // Validate Extraction
        if (!extractedText || extractedText.trim().length < 10) {
            return NextResponse.json({
                error: "Could not extract legible text. If this is a scanned PDF (image-only), please convert it to an image (JPG/PNG) or use a text-searchable PDF."
            }, { status: 422 });
        }

        // 2. ATTEMPT AI ANALYSIS
        try {
            const apiKey = process.env.GROQ_API_KEY;

            // Prioritize AI analysis
            if (apiKey) {
                const groq = new Groq({ apiKey });

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

                console.log("Sending to Groq AI...");
                const completion = await groq.chat.completions.create({
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: `Analyze this text (limit 15k chars):\n\n${extractedText.slice(0, 15000)}` }
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
                    console.error("JSON Parse Error from Groq", e);
                    // Attempt regex recovery
                    const match = aiContent.match(/\{[\s\S]*\}/);
                    analysisData = match ? JSON.parse(match[0]) : {
                        summary: "Analysis completed but format was raw.",
                        category: "Unknown",
                        risks: ["Could not parse structured risks."],
                        clauses: [],
                        actions: ["Consult a lawyer manually."]
                    };
                }

                return NextResponse.json({ analysis: analysisData, extractedText });
            } else {
                console.warn("GROQ_API_KEY missing. Falling back to heuristics.");
            }
        } catch (aiError: any) {
            console.error("AI Analysis Failed:", aiError);
            // Don't error out, fall through to heuristics so user gets *something*
        }

        // 3. FALLBACK: HEURISTIC ANALYSIS
        console.log("Performing Heuristic Fallback Analysis...");

        const lowerText = extractedText.toLowerCase();
        const risks = [];
        const clauses = [];
        let category = "General Legal Document";

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

        const heuristicData = {
            summary: `Automated scan extracted ${extractedText.length} characters. Identified as likely ${category}.`,
            category,
            clauses: clauses.length > 0 ? clauses : ["No specific clauses flagged by basic scan."],
            risks: risks.length > 0 ? risks : ["No obvious keywords found. Manual review recommended."],
            actions: ["Review highlighted clauses with a lawyer.", "Verify all dates and monetary figures."],
            lawyer_recommended: risks.length > 0
        };

        return NextResponse.json({ analysis: heuristicData, extractedText });

    } catch (error: any) {
        console.error("Critical Analysis Error:", error);
        return NextResponse.json({ error: `Server Error: ${error.message}` }, { status: 500 });
    }
}
