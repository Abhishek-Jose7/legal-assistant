import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const openRouterKey = process.env.OPENROUTER_API_KEY;
        if (!openRouterKey) {
            return NextResponse.json({ error: "Service unavailable (Key Config Missing)" }, { status: 503 });
        }

        let contentPayload: any[] = [];
        let model = "meta-llama/llama-3-8b-instruct:free";

        // 1. Handle Images (Snap & Audit)
        if (file.type.startsWith("image/")) {
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const base64 = buffer.toString('base64');
            const dataUrl = `data:${file.type};base64,${base64}`;

            contentPayload = [
                { type: "text", text: "Analyze this legal document image. Extract the text and risk factors." },
                { type: "image_url", image_url: { url: dataUrl } }
            ];
            model = "meta-llama/llama-3.2-11b-vision-instruct:free";
        }
        // 2. Handle Text
        else if (file.type === "text/plain") {
            const text = await file.text();
            contentPayload = [{ type: "text", text: `Analyze this legal document text:\n\n${text.slice(0, 20000)}` }];
        }
        else {
            return NextResponse.json({ error: "Supported formats: .txt, .jpg, .png" }, { status: 400 });
        }

        // 3. AI Analysis via OpenRouter
        const systemPrompt = `
        You are an expert legal AI. Analyze the provided document (text or image).
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

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${openRouterKey}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "http://localhost:3000",
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: contentPayload }
                ],
                response_format: { type: "json_object" }
            })
        });

        if (!response.ok) {
            throw new Error(`OpenRouter Error: ${await response.text()}`);
        }

        const data = await response.json();
        const textResponse = data.choices[0]?.message?.content || "{}";

        let analysisData;
        try {
            analysisData = JSON.parse(textResponse);
        } catch (e) {
            // Fuzzy parse
            const match = textResponse.match(/\{[\s\S]*\}/);
            analysisData = match ? JSON.parse(match[0]) : { summary: "Raw Analysis: " + textResponse, risks: [] };
        }

        return NextResponse.json({
            analysis: analysisData,
            extractedText: "Text extracted from document/image" // Simplified for now
        });

    } catch (error) {
        console.error("Analysis Error:", error);
        return NextResponse.json({ error: "Failed to analyze document. Please try again." }, { status: 500 });
    }
}
