import { NextResponse } from "next/server";
import { loadLegalData } from "@/lib/legalData";
import { supabase } from "@/lib/supabaseClient";
import Groq from "groq-sdk";
import fs from 'fs';
import path from 'path';

// Initialize Groq
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "gsk_...", // Fallback or env
});

// Load data using shared lib
const legalRightsDB = loadLegalData();

// Helper to clean query
const cleanQuery = (q: string) => q.trim().toLowerCase();

// Simple CSV Parser
const parseCSV = (csvText: string) => {
  const lines = csvText.split('\n').filter(l => l.trim());
  const headers = lines[0].split(',').map(h => h.trim());

  return lines.slice(1).map(line => {
    // Regex to match CSV fields, handling quotes
    const matches = line.match(/(?:^|,)(?:"([^"]*)"|([^",]*))/g);
    if (!matches) return null;

    const row: any = {};
    let colIndex = 0;

    // Quick and dirty manual split that respects quotes better than simple regex global match
    // Actually, a simple state machine is more reliable for "val, val", val
    let currentVal = '';
    let inQuotes = false;
    let values = [];
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(currentVal.trim());
        currentVal = '';
      } else {
        currentVal += char;
      }
    }
    values.push(currentVal.trim()); // Last val

    headers.forEach((h, i) => {
      let val = values[i] || '';
      // Remove surrounding quotes if present
      if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
      row[h] = val;
    });
    return row;
  }).filter(r => r);
};

// Lawyer RAG Search
const searchLawyerType = (query: string): any => {
  try {
    const filePath = path.join(process.cwd(), 'lawyer_expertise.csv');
    if (!fs.existsSync(filePath)) return null;

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const data = parseCSV(fileContent);

    const lowerQuery = cleanQuery(query);
    const terms = lowerQuery.split(' ').filter(t => t.length > 3);

    let bestMatch = null;
    let maxScore = 0;

    data.forEach((row: any) => {
      let score = 0;
      const textToSearch = `${row.lawyer_category} ${row.specialization} ${row.specific_issues_handled} ${row.legal_keywords}`.toLowerCase();

      if (row.lawyer_category.toLowerCase().includes(lowerQuery)) score += 10;

      terms.forEach(term => {
        if (textToSearch.includes(term)) score += 3;
      });

      if (score > maxScore) {
        maxScore = score;
        bestMatch = row;
      }
    });

    return maxScore > 0 ? bestMatch : null;
  } catch (e) {
    console.error("CSV Search Error", e);
    return null;
  }
}

const searchLegalRights = (query: string) => {
  if (!query || query.length < 2) return [];
  if (legalRightsDB.length === 0) return [];

  const lowerQuery = cleanQuery(query);
  const searchTerms = lowerQuery.split(" ").filter((t: string) => t.length > 3);

  return legalRightsDB.map((right) => {
    let score = 0;
    // Exact/Strong matches
    if (right.title.toLowerCase().includes(lowerQuery)) score += 10;
    if (right.category.toLowerCase().includes(lowerQuery)) score += 5;

    // Tag matches
    if (right.tags.some((t: string) => lowerQuery.includes(t.toLowerCase()))) score += 5;

    // Keyword matches
    searchTerms.forEach((term: string) => {
      if (right.summary.toLowerCase().includes(term)) score += 2;
      if (right.title.toLowerCase().includes(term)) score += 3;
      if (right.category.toLowerCase().includes(term)) score += 2;
    });

    return { ...right, score };
  })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
};

export async function POST(req: Request) {
  let message = "";
  let userId = null;

  try {
    const body = await req.json();
    message = body.message || "";
    userId = body.userId || null;
  } catch (e) {
    return NextResponse.json({ message: "Invalid Request Body" }, { status: 400 });
  }

  try {
    // 1. Simple Guard for Greetings
    const greetings = ["hi", "hello", "hey", "greetings"];
    if (greetings.includes(message.trim().toLowerCase())) {
      return NextResponse.json({
        type: "simple",
        message: "Hello! I'm Lexi, your AI legal assistant. I can help you understand your rights, draft documents, or find the right lawyer. How may I help you today?"
      });
    }

    // 1.5 Fetch User Context if logged in
    let userContext = "User is anonymous.";
    let userProfile: any = null;
    if (userId) {
      const { data: profile } = await supabase.from('profiles').select('*').eq('clerk_id', userId).single();
      if (profile) {
        userProfile = profile;
        userContext = `User Profile:
            - Type: ${profile.user_type || "General"}
            - Age: ${profile.age || "Unknown"}
            - Gender: ${profile.gender || "Unknown"}
            
            ADJUST YOUR TONE AND ADVICE ACCORDINGLY. 
            For students, focus on educational rights and simple language.
            For tenants/landlords, cite Model Tenancy Act.
            For women, prioritize safety and specific protective laws.
            For elderly (Age > 60), use respectful, clear language.`;
      }
    }

    // 1.7 URL Content Fetching (for Summarization)
    let externalContext = "";
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls = message.match(urlRegex);
    if (urls && urls.length > 0) {
      try {
        const url = urls[0];
        console.log("Fetching content from:", url);
        const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } });
        if (res.ok) {
          const html = await res.text();
          // Naive text extraction
          const text = html.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
            .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
            .replace(/<[^>]+>/g, ' ') // Strip tags
            .replace(/\s+/g, ' ')     // Collapse whitespace
            .trim()
            .slice(0, 15000);         // Limit size
          externalContext = `EXTERNAL ARTICLE CONTENT (${url}):\n${text}\n\n`;
        }
      } catch (e) {
        console.error("Failed to fetch URL:", e);
      }
    }

    // 2. Perform Search on Legal DB (RAG Context)
    const relevantRights = searchLegalRights(message);
    const contextStr = relevantRights.map(r => `Right: ${r.title} (${r.category})\nSummary: ${r.summary}\nActions: ${r.actions.join(", ")}`).join("\n\n");

    // 2.5 Perform Lawyer Match
    const lawyerMatch = searchLawyerType(message);
    let suggestedLawyers: any[] = [];
    if (lawyerMatch) {
      // Query Supabase for lawyers with this specialization/category
      // Note: Assuming 'specialization' is an array of text
      const { data: lawyers } = await supabase
        .from('lawyer_profiles')
        .select(`
                *,
                profiles:clerk_id (first_name, last_name)
            `)
        .contains('specialization', [lawyerMatch.lawyer_category])
        .limit(3);

      if (lawyers) {
        suggestedLawyers = lawyers.map(l => ({
          id: l.id,
          name: l.profiles ? `${l.profiles.first_name} ${l.profiles.last_name || ''}`.trim() : "Verified Lawyer",
          specialization: l.specialization,
          rating: l.rating,
          fee: l.consultation_fee
        }));
      }
    }

    // 3. Construct System Prompt forStructure
    const systemPrompt = `
    You are Lexi, an advanced expert legal AI assistant.
    The user asked: "${message}"

    CONTEXT ON USER:
    ${userContext}

    EXTERNAL CONTEXT (Provided Article/Link):
    ${externalContext}

    Based on the following known legal rights from our database:
    ${contextStr}
    
    LAWYER RECOMMENDATION CONTEXT:
    Matched Category: ${lawyerMatch ? lawyerMatch.lawyer_category : "None"}
    Suggested Lawyers Found: ${suggestedLawyers.length}

    RETURN XML/JSON ONLY.
    If the question is legal or a summary request, you MUST output a VALID JSON object adhering strictly to this schema:
    {
      "type": "structured",
      "topic": "Detected Legal Topic (e.g., Divorce Law, Tenant Rights, Article Summary)",
      "sub_topics": [
         { "label": "Key Insight", "detail": "Paragraph explaining this insight..." },
         { "label": "Relevance to You", "detail": "How this affects the user based on their profile..." }
      ],
      "rights_cards": [
         {
           "title": "Related Right/Topic",
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
      "suggested_lawyers": [],
      "emotional_tone": "Optional reassuring message or summary/takeaway.",
      "message": "The main response text, summary, or answer."
    }

    TASK INSTRUCTIONS:
    1. If the user asks for a SUMMARY of a link or text:
       - Summarize the 'EXTERNAL CONTEXT' or the user's text clearly.
       - In 'sub_topics', explicitly add a section 'Relevance to You' explaining why this matters to a ${userProfile ? userProfile.user_type : 'citizen'}.
       - If the article mentions legal breaches, map them to 'rights_cards'.
    
    2. If the known rights are empty, use your general legal knowledge to fill the JSON, but mention "General Legal Info" in topic.
    3. If the user asks for a specific template/draft, set "type" to "simple" and provide the draft in "message".
    
    IMPORTANT: CITATIONS REQUIRED.
    Where possible, you MUST cite specific sections of Indian Acts (e.g., "Section 21 of the Rent Control Act", "Section 354 IPC").
    If you cite a law, try to format it as: [Section X of Act Y](https://indiankanoon.org/search/?formInput=Section+X+of+Act+Y)
    This builds trust.
    `;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful legal AI. Output valid JSON only." },
        { role: "user", content: systemPrompt }
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.1,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content || "{}";
    let parsedData: any = {};
    try {
      parsedData = JSON.parse(content);
      // Inject the real lawyer data we fetched, overriding whatever hallucination or placeholder LLM might provide
      if (suggestedLawyers.length > 0) {
        parsedData.suggested_lawyers = suggestedLawyers;
      }
    } catch (e) {
      console.error("JSON Parse Error", e);
      // Fallback
      return NextResponse.json({
        type: "simple",
        message: content // Return raw text if JSON fails
      });
    }

    return NextResponse.json(parsedResponseWrapper(parsedData));

  } catch (error: any) {
    console.error("Chat API Error:", error);

    // 1. ATTEMPT OPENROUTER BACKUP
    const openRouterKey = process.env.OPENROUTER_API_KEY;
    if (openRouterKey) {
      try {
        console.log("Attempting OpenRouter Fallback...");

        // RE-RUN SEARCH for OpenRouter Context
        const fallbackRights = searchLegalRights(message);
        const contextStr = fallbackRights.map(r => `Right: ${r.title} (${r.category})\nSummary: ${r.summary}\nActions: ${r.actions.join(", ")}`).join("\n\n");

        const backupPrompt = `
            You are Lexi, an advanced expert legal AI assistant.
            The user asked: "${message}"
            Based on the following known legal rights:
            ${contextStr}
            
            RETURN JSON ONLY.
            {
              "type": "structured",
              "topic": "Detected Legal Topic",
              "sub_topics": [],
              "rights_cards": [ { "title": "Right Title", "summary": "Summary", "full_details": { "what_it_means": "...", "when_applicable": [], "requirements": [], "steps": [], "timeframe": "...", "action_buttons": [] } } ],
              "emotional_tone": "Supportive tone"
            }
            If unsure, just fill rights_cards with the provided rights.
            `;

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${openRouterKey}`,
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:3000",
          },
          body: JSON.stringify({
            model: "meta-llama/llama-3-8b-instruct:free",
            messages: [
              { role: "system", content: "You are a helpful legal AI. Output valid JSON only." },
              { role: "user", content: backupPrompt }
            ],
            response_format: { type: "json_object" }
          })
        });

        if (response.ok) {
          const data = await response.json();
          const content = data.choices[0]?.message?.content || "{}";
          let parsedData = {};
          try {
            parsedData = JSON.parse(content);
          } catch (e) {
            return NextResponse.json({ type: "simple", message: content });
          }
          return NextResponse.json(parsedResponseWrapper(parsedData));
        } else {
          console.error("OpenRouter Error:", await response.text());
        }
      } catch (orError) {
        console.error("OpenRouter Failed:", orError);
      }
    }

    // 2. FALLBACK: Use RAG data if AI fails (e.g., Invalid Key, Rate Limit)
    try {
      // Use the already-parsed 'message' from top scope
      const fallbackRights = searchLegalRights(message);

      if (fallbackRights.length > 0) {
        console.warn("Falling back to RAG data due to AI error.");
        return NextResponse.json({
          type: "structured",
          topic: "Legal Search Results (Offline Mode)",
          message: "I'm having trouble connecting to my creative brain right now, but here are the specific legal rights found in my database that match your query:",
          sub_topics: [],
          rights_cards: fallbackRights.map(r => ({
            title: r.title,
            summary: r.summary,
            full_details: {
              what_it_means: r.summary,
              when_applicable: r.law_links && r.law_links.length > 0
                ? r.law_links.map((l: any) => `${l.act} (Section ${l.section})`)
                : ["As per Indian Law"],
              requirements: r.tags.map(t => ({ item: t, example: "Relevant context" })),
              steps: r.actions,
              timeframe: "Varies",
              action_buttons: ["Consult Expert", "View Templates"]
            }
          })),
          emotional_tone: "I hope this information is helpful despite the connection issue."
        });
      }
    } catch (fallbackError) {
      console.error("Fallback failed:", fallbackError);
    }

    return NextResponse.json(
      { message: "Sorry, I encountered an error processing your request. Please check your API key or try again later." },
      { status: 500 }
    );
  }
} // End POST - Corrected closure block

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
