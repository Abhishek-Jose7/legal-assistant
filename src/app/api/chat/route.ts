import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

// Initialize Gemini
// Initialize Gemini inside handler for key rotation

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
    const { history, message, userId, userProfile } = await req.json();

    // Fetch User Profile Context if available
    let userContext = "";
    if (userId) {
      // We can't use the client-side supabase client here easily without auth context in server, 
      // but for this demo using the ANON key for public read or service role if needed.
      // Since 'profiles' likely has RLS, we'd ideally need a Service Role key or pass the user's token.
      // For this hackathon/demo scope with provided keys, we'll try to fetch assuming public read or simple RLS.
      // Actually, standard practice: Client passes relevant context or we skip RLS for this specific read if allowed.
      // Let's assume we can fetch by clerk_id.

      // We'll proceed without complex server-side auth for now to avoid breaking changes, 
      // but ideally we'd pass this data from frontend.
      // To make it robust: Frontend should send the profile data in the request body if loaded.
      // Changing strategy: We will expect `userProfile` in the request body.
    }

    // Actually, let's inject a "User Info" section into the system prompt if passed.
    // Actually, let's inject a "User Info" section into the system prompt if passed.
    // userProfile is destructured above.


    let personalizedPrompt = systemPrompt;
    if (userProfile) {
      personalizedPrompt += `
        
**USER CONTEXT:**
The user is ${userProfile.full_name}, a ${userProfile.user_type} based in ${userProfile.address}.
Tailor your legal advice specifically for a ${userProfile.user_type}.
        `
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
          parts: [{ text: systemPrompt }],
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
