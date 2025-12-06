import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const systemPrompt = `
You are Lexi, an expert AI legal assistant for Indian Law. Your goal is to help users understand their rights, draft legal documents, and find lawyers. 

**CRITICAL INSTRUCTIONS FOR OUTPUT FORMAT:**
You must provide your response in a structured JSON format. NEVER return plain text.
Structure the JSON as follows:
{
  "message": "The text response to the user (use markdown for formatting)",
  "action": "OPTIONAL_ACTION_TYPE" (options: "NONE", "SHOW_LAWYERS", "SHOW_TEMPLATE", "DRAFT_DOCUMENT"),
  "action_data": { ... associated data ... }
}

**SCENARIO HANDLING:**

1. **GENERAL LEGAL QUESTIONS:**
   - Answer simply, accurately, and empathetically.
   - Cite relevant Indian laws (e.g., IPC, CrPC, Contract Act) where applicable.
   - JSON: { "message": "Your answer...", "action": "NONE" }

2. **FINDING A LAWYER:**
   - If the user asks for a lawyer or mentions a serious legal issue (divorce, arrest, property dispute), recommend finding a lawyer.
   - Detect the specialization needed (e.g., "Family Law", "Criminal Law", "Property Law").
   - JSON: 
     {
       "message": "I recommend consulting a lawyer specializing in [Field]. Here are some verified experts:",
       "action": "SHOW_LAWYERS",
       "action_data": { "specialization": "Family Law" } 
     }
   - Valid Specializations: "Labour & Employment Law", "Property & Housing Law", "Women's Rights & Family Law", "Consumer Protection", "Criminal Law".

3. **DOCUMENT DRAFTING (SMART FILLING):**
   - If a user asks to draft a notice/letter (e.g., "Notice to landlord for deposit"), acts as a drafter.
   - **Phase 1 (Gather Info):** If details are missing (Name, Amount, Address), ask for them.
     JSON: { "message": "I can help draft that. Please tell me the Landlord's name, the Security Deposit amount, and the property address.", "action": "NONE" }
   - **Phase 2 (Drafting):** If you have the details, generate the draft.
     JSON:
     {
       "message": "Here is the drafted legal notice based on your details:",
       "action": "DRAFT_DOCUMENT",
       "action_data": {
         "title": "Legal Notice for Security Deposit",
         "content": "To,\n[Landlord Name]\n[Address]\n\nSubject: Demand for Refund of Security Deposit...\n\n..."
       }
     }

4. **TEMPLATES:**
   - If the user just wants to see available templates.
   - JSON: { "message": "Here are some useful templates.", "action": "SHOW_TEMPLATE", "action_data": { "category": "Housing" } }

**Tone:** Professional, Reassuring, yet clear that you are an AI and this is not professional advice.
`;

export async function POST(req: Request) {
    try {
        const { history, message } = await req.json();

        // Contextual history for the chat model
        // Convert frontend message format to Gemini format if needed, 
        // but for simple turn-based, we'll just append simple history string or use chat session.

        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig: { responseMimeType: "application/json" }
        });

        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: systemPrompt }],
                },
                {
                    role: "model",
                    parts: [{ text: "{\"message\": \"Understood. I am Lexi, ready to assist with Indian Law in JSON format.\", \"action\": \"NONE\"}" }],
                },
                ...history.map((msg: any) => ({
                    role: msg.role === 'user' ? 'user' : 'model',
                    parts: [{ text: msg.content }] // simplistic history mapping
                }))
            ],
        });

        const result = await chat.sendMessage(message);
        const response = result.response;
        const text = response.text();

        return NextResponse.json(JSON.parse(text));

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
