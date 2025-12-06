import { NextResponse } from "next/server";
import { loadLegalData } from "@/lib/legalData";
import Groq from "groq-sdk";

// Initialize Groq
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "gsk_...", // Fallback or env
});

// Load data using shared lib
const legalRightsDB = loadLegalData();

const searchLegalRights = (query: string) => {
  if (legalRightsDB.length === 0) return [];
  const lowerQuery = query.toLowerCase();
  const searchTerms = lowerQuery.split(" ").filter((t: string) => t.length > 3);

  return legalRightsDB.map((right) => {
    let score = 0;
    if (right.title.toLowerCase().includes(lowerQuery)) score += 10;
    if (right.category.toLowerCase().includes(lowerQuery)) score += 5;
    if (right.tags.some((t: string) => lowerQuery.includes(t.toLowerCase()))) score += 5;
    searchTerms.forEach((term: string) => {
      if (right.summary.toLowerCase().includes(term)) score += 2;
      if (right.title.toLowerCase().includes(term)) score += 3;
    });
    return { ...right, score };
  })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
};

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    // 1. Simple Guard for Greetings
    const greetings = ["hi", "hello", "hey", "greetings"];
    if (greetings.includes(message.trim().toLowerCase())) {
      return NextResponse.json({
        type: "simple",
        message: "Hello! I'm Lexi, your AI legal assistant. I can help you understand your rights, draft documents, or find the right lawyer. How may I help you today?"
      });
    }

    // 2. Perform Search on Legal DB (RAG Context)
    const relevantRights = searchLegalRights(message);
    const contextStr = relevantRights.map(r => `Right: ${r.title} (${r.category})\nSummary: ${r.summary}\nActions: ${r.actions.join(", ")}`).join("\n\n");

    // 3. Construct System Prompt for Structure
    const systemPrompt = `
    You are Lexi, an advanced expert legal AI assistant.
    The user asked: "${message}"

    Based on the following known legal rights from our database:
    ${contextStr}

    RETURN XML/JSON ONLY.
    If the question is legal, you MUST output a VALID JSON object adhering strictly to this schema:
    {
      "type": "structured",
      "topic": "Detected Legal Topic (e.g., Divorce Law, Tenant Rights)",
      "sub_topics": [
         { "label": "Short label e.g., Documents", "detail": "Paragraph explaining this sub-topic..." },
         { "label": "Process", "detail": "Step by step process..." }
      ],
      "rights_cards": [
         {
           "title": "Title of the right",
           "summary": "One sentence summary",
           "full_details": {
              "what_it_means": "Explanation...",
              "when_applicable": ["Condition 1", "Condition 2"],
              "requirements": [ {"item": "Req Name", "example": "Example"} ],
              "steps": ["Step 1", "Step 2"],
              "timeframe": "Estimated time",
              "action_buttons": ["Draft Notice", "Find Lawyer"]
           }
         }
      ],
      "emotional_tone": "Optional reassuring message if topic is sensitive (divorce, harassment)."
    }

    If the known rights are empty, use your general legal knowledge to fill the JSON, but mention "General Legal Info" in topic.
    If the user asks for a specific template/draft, set "type" to "simple" and provide the draft in "message".
    `;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful legal AI. Output valid JSON only." },
        { role: "user", content: systemPrompt }
      ],
      model: "llama3-70b-8192",
      temperature: 0.1,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content || "{}";
    let parsedData = {};
    try {
      parsedData = JSON.parse(content);
    } catch (e) {
      console.error("JSON Parse Error", e);
      // Fallback
      return NextResponse.json({
        type: "simple",
        message: content // Return raw text if JSON fails
      });
    }

    return NextResponse.json(parsedResponseWrapper(parsedData));

  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      { message: "Sorry, I encountered an error processing your request." },
      { status: 500 }
    );
  }
}

// Helper to normalize response for frontend
function parsedResponseWrapper(data: any) {
  // If LLM returned a simple message format or just text
  if (data.type === "simple") return data;
  if (data.message && !data.rights_cards) return { type: "simple", ...data };

  // Ensure it matches frontend expectations
  return {
    type: "structured",
    topic: data.topic || "Legal Topic",
    sub_topics: data.sub_topics || [],
    rights_cards: data.rights_cards || [],
    emotional_tone: data.emotional_tone || null,
    message: data.message // Optional fallthrough
  };
}
