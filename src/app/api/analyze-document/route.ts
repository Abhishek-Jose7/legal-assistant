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

        // 1. Extract Text based on file type
        let extractedText = "";

        if (file.type === "application/pdf") {
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const data = await pdf(buffer);
            extractedText = data.text;
        } else if (file.type.startsWith("text/")) {
            extractedText = await file.text();
        } else {
            // For images, we would handle differently using Gemini 1.5 Vision, 
            // but for now let's support PDFs/Text which are most common for legal.
            return NextResponse.json({ error: "Currently only PDF and Text files are supported for analysis." }, { status: 400 });
        }

        // 2. Truncate if too long (to fit context window if needed, though 1.5 has large window)
        // pdf-parse output can be messy, but Gemini handles it well.
        const textContext = extractedText.slice(0, 30000); // 30k chars safe limit for standard

        // 3. AI Analysis
        const randomKey = keys[Math.floor(Math.random() * keys.length)];
        const genAI = new GoogleGenerativeAI(randomKey || "");
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const prompt = `
    Analyze the following legal document content:
    "${textContext}"

    Please provide:
    1. A concise ONE-SENTENCE SUMMARY of what this document is.
    2. KEY RISKS or IMPORTANT CLAUSES the user should be aware of.
    3. SUGESTIONS for next steps.

    Format the output in clear Markdown.
    `;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const analysis = response.text();

        return NextResponse.json({
            summary: analysis,
            extractedText: textContext.slice(0, 500) + "..." // Verification snippet
        });

    } catch (error) {
        console.error("Analysis Error:", error);
        return NextResponse.json({ error: "Failed to analyze document" }, { status: 500 });
    }
}
