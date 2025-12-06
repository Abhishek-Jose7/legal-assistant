import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Initialize Gemini
// Initialize Gemini inside handler for key rotation

const systemPrompt = `
You are Lexi, an expert AI legal assistant. 

**CORE INSTRUCTIONS:**
1. **Identify the legal issue.**
2. **Tell me which rights apply.**
3. **Tell me what actions the user can take.**
4. **Do NOT invent laws.**
5. **If unsure, say "More information is required".**

**OUTPUT FORMAT:**
Always return a JSON object:
{
  "message": "Markdown response...",
  "action": "NONE" | "SHOW_LAWYERS" | "SHOW_TEMPLATE" | "DRAFT_DOCUMENT",
  "action_data": { ... }
}

**SCENARIOS:**
- **General:** Answer simple questions.
- **Lawyer Needed:** If serious (crime, divorce), set action="SHOW_LAWYERS".
- **Drafting:** If asked to write/draft, set action="DRAFT_DOCUMENT" and put content in action_data.content.
- **Templates:** If asked for templates, set action="SHOW_TEMPLATE".

(Use the previous specialized instructions for lawyer matching and drafting logic logic implicitly)
`;

export async function POST(req: Request) {
  try {
    const { history, message, userId, userProfile, documentContext } = await req.json();

    // ... (rest is same, but we inject doc context)

    let currentSystemPrompt = systemPrompt;

    if (userProfile) {
      currentSystemPrompt += `\n\n**USER CONTEXT:**\nUser is ${userProfile.full_name}, a ${userProfile.user_type}.`
    }

    if (documentContext) {
      currentSystemPrompt += `\n\n**REFERENCE DOCUMENT CONTENT:**\n"${documentContext}"\n\nUse this document as the primary source of truth for answering the user's questions.`
    }


    // Load Balancing Strategy: Randomly select one of the available keys
    const keys = [
      process.env.GEMINI_API_KEY,
      process.env.GEMINI_API_KEY_SECONDARY
    ].filter(Boolean);

    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    const genAI = new GoogleGenerativeAI(randomKey || "");

    const model = genAI.getGenerativeModel({
      model: "gemini-pro", // Using gemini-pro for stability
      generationConfig: { responseMimeType: "application/json" }
    });

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: currentSystemPrompt }],
        },
        {
          role: "model",
          parts: [{ text: "{\"message\": \"Understood. I am Lexi, ready to assist with Indian Law in JSON format.\", \"action\": \"NONE\"}" }],
        },
        ...history.map((msg: any) => ({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.content }]
        }))
      ],
    });

    const result = await chat.sendMessage(message);
    const response = result.response;
    const text = response.text();

    // Robust parsing
    let parsedResponse;
    try {
      parsedResponse = JSON.parse(text);
    } catch (e) {
      // Fallback if model returns Markdown block
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedResponse = JSON.parse(jsonMatch[0]);
      } else {
        parsedResponse = { message: text, action: "NONE" };
      }
    }

    return NextResponse.json(parsedResponse);

  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      {
        message: "I'm experiencing high traffic right now. Please try again in a moment.",
        error: String(error)
      },
      { status: 500 }
    );
  }
}
