import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';

// --- Advanced RAG System ---

interface LegalRight {
  id: string;
  title: string;
  category: string;
  summary: string;
  actions: string[];
  tags: string[];
}

const loadLegalData = (): LegalRight[] => {
  try {
    const dataDir = process.cwd();
    // Read all JSON files starting with 'legal_'
    const files = fs.readdirSync(dataDir).filter(file => file.endsWith('.json') && file.startsWith('legal_'));

    let allRights: LegalRight[] = [];

    files.forEach(file => {
      try {
        const filePath = path.join(dataDir, file);
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const json = JSON.parse(fileContent);

        let rawRights = [];
        if (json.legal_rights_hub) {
          rawRights = json.legal_rights_hub; // Format A (Spectra)
        } else if (json.data) {
          rawRights = json.data; // Format B (New Batch)
        }

        const normalized: LegalRight[] = rawRights.map((r: any) => ({
          id: r.id,
          title: r.title,
          category: r.category,
          summary: r.short_summary || r.right_summary || r.explanation || "No summary available.",
          actions: r.actions_if_violated || r.user_actions || [],
          tags: r.tags || []
        }));

        allRights = [...allRights, ...normalized];
      } catch (e) {
        console.error(`Error parsing file ${file}:`, e);
      }
    });

    console.log(`Loaded ${allRights.length} legal rights from ${files.length} files.`);
    return allRights;
  } catch (error) {
    console.error("Error loading legal data:", error);
    return [];
  }
};

// Load data once at server start
const legalRightsDB = loadLegalData();

const searchLegalRights = (query: string) => {
  if (legalRightsDB.length === 0) return [];

  const lowerQuery = query.toLowerCase();
  const searchTerms = lowerQuery.split(" ").filter(t => t.length > 3);

  return legalRightsDB.map((right) => {
    let score = 0;
    // Weighted scoring
    if (right.title.toLowerCase().includes(lowerQuery)) score += 10;
    if (right.category.toLowerCase().includes(lowerQuery)) score += 5;
    if (right.tags.some((t: string) => lowerQuery.includes(t.toLowerCase()))) score += 5;

    // Term matching
    searchTerms.forEach(term => {
      if (right.summary.toLowerCase().includes(term)) score += 2;
      if (right.title.toLowerCase().includes(term)) score += 3;
    });

    return { ...right, score };
  })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3); // Top 3
};

// --- System Prompt ---

const systemPrompt = `
You are Lexi, an expert AI legal assistant. 

**CORE INSTRUCTIONS:**
1. **Identify the legal issue.**
2. **Tell me which rights apply.**
3. **Tell me what actions the user can take.**
4. **Do NOT invent laws.**
5. **If unsure, say "More information is required".**

**RAG INSTRUCTION: RELEVANT RIGHTS FIRST**
If "RELEVANT LEGAL RIGHTS" are provided in the context below, you MUST:
1. Start your response by explicitly listing these rights under a header "**📌 Relevant Rights**".
2. Explain how they apply to the user's situation.
3. Then proceed with normal advice/actions.

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

// --- API Handler ---

export async function POST(req: Request) {
  try {
    const { history, message, userId, userProfile, documentContext } = await req.json();

    // 1. Perform Search on Legal DB
    const relevantRights = searchLegalRights(message);
    const rightsContext = relevantRights.map((r: LegalRight) =>
      `- Right: ${r.title} (${r.category})\n  Summary: ${r.summary}\n  Action: ${r.actions.join(', ')}`
    ).join('\n\n');

    let currentSystemPrompt = systemPrompt;

    if (rightsContext) {
      currentSystemPrompt += `\n\n**RELEVANT LEGAL RIGHTS FOUND IN DATABASE:**\n${rightsContext}\n\n(Prioritize these rights in your answer!)`;
    }

    if (userProfile) {
      currentSystemPrompt += `\n\n**USER CONTEXT:**\nUser is ${userProfile.full_name}, a ${userProfile.user_type}.`
    }

    if (documentContext) {
      currentSystemPrompt += `\n\n**REFERENCE DOCUMENT CONTENT:**\n"${documentContext}"\n\nUse this document as the primary source of truth for answering the user's questions.`
    }


    // Load Balancing Strategy
    const keys = [
      process.env.GEMINI_API_KEY,
      process.env.GEMINI_API_KEY_SECONDARY
    ].filter(Boolean);

    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    const genAI = new GoogleGenerativeAI(randomKey || "");

    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash-exp",
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
