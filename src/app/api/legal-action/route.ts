import { NextResponse } from "next/server";
import { loadLegalData } from "@/lib/legalData";
import Groq from "groq-sdk";

let groqClient: Groq | null = null;
const getGroqClient = () => {
  if (!groqClient) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error("GROQ_API_KEY is not configured.");
    }
    groqClient = new Groq({ apiKey });
  }
  return groqClient;
};

const legalRightsDB = loadLegalData();

const searchLegalRights = (query: string) => {
  if (!query || query.length < 2) return [];
  const lowerQuery = query.trim().toLowerCase();
  const searchTerms = lowerQuery.split(" ").filter((t: string) => t.length > 3);

  return legalRightsDB
    .map((right) => {
      let score = 0;
      if (right.title.toLowerCase().includes(lowerQuery)) score += 10;
      if (right.category.toLowerCase().includes(lowerQuery)) score += 5;
      if (right.tags.some((t: string) => lowerQuery.includes(t.toLowerCase())))
        score += 5;
      searchTerms.forEach((term: string) => {
        if (right.summary.toLowerCase().includes(term)) score += 2;
        if (right.title.toLowerCase().includes(term)) score += 3;
        if (right.category.toLowerCase().includes(term)) score += 2;
      });
      return { ...right, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);
};

async function callGroq(systemPrompt: string, userPrompt: string) {
  const client = getGroqClient();
  const completion = await client.chat.completions.create({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
    model: "llama-3.3-70b-versatile",
    temperature: 0.15,
    response_format: { type: "json_object" },
  });
  return completion.choices[0]?.message?.content || "{}";
}

// ──────────────────────────────────────────
// STAGE 1: CLASSIFY + GENERATE QUESTIONS
// ──────────────────────────────────────────
async function handleClassify(problem: string) {
  const relevantRights = searchLegalRights(problem);
  const ragContext = relevantRights
    .map(
      (r) =>
        `Right: ${r.title} (${r.category})\nSummary: ${r.summary}\nRisk: ${r.risk_level}`
    )
    .join("\n\n");

  const systemPrompt = `You are Nyaaya AI, an expert Indian legal action system (NOT a chatbot). 
Your job is to CLASSIFY legal problems and generate STRUCTURED follow-up questions to build an action plan.

CONTEXT FROM LEGAL DATABASE:
${ragContext}

RETURN VALID JSON ONLY with this EXACT schema:
{
  "classification": {
    "category": "string (e.g. Family Law, Criminal Law, Consumer Protection, Property Law, Labour Law, Cyber Crime, Civil Law)",
    "possible_issues": ["string array of 2-5 specific legal issues identified"],
    "urgency": "low" | "medium" | "high",
    "summary": "A 1-2 sentence plain-language summary of what the user is facing"
  },
  "questions": [
    {
      "id": "unique_id_string",
      "question": "The question text",
      "type": "text" | "select" | "boolean",
      "options": ["only for select type - array of choices"],
      "required": true | false
    }
  ]
}

RULES:
1. Generate 3-6 relevant follow-up questions ONLY. No extra text.
2. Questions must help determine the EXACT legal action path.
3. Use simple, non-legal language the average Indian citizen can understand.
4. For urgency: "high" = safety threat, arrest, domestic violence, eviction. "medium" = financial loss, workplace issue. "low" = general rights info.
5. Always include at least one question about timeline (when did this happen).
6. For family law, ask about children, property, and duration of marriage.
7. For criminal matters, ask if FIR has been filed.
8. For consumer issues, ask about amount involved and proof of purchase.
9. All questions must be India-specific.`;

  const content = await callGroq(systemPrompt, `My legal problem: "${problem}"`);
  return JSON.parse(content);
}

// ──────────────────────────────────────────
// STAGE 2: ANALYZE → DECISION + WORKFLOW + TRACKING
// ──────────────────────────────────────────
async function handleAnalyze(
  problem: string,
  classification: any,
  answers: Record<string, string>
) {
  const answersText = Object.entries(answers)
    .map(([q, a]) => `Q: ${q}\nA: ${a}`)
    .join("\n\n");

  const relevantRights = searchLegalRights(problem);
  const ragContext = relevantRights
    .map(
      (r) =>
        `Right: ${r.title} (${r.category})\nSummary: ${r.summary}\nActions: ${r.actions.join(", ")}\nLaw: ${r.source?.name} (${r.source?.section})`
    )
    .join("\n\n");

  const systemPrompt = `You are Nyaaya AI, an Indian legal EXECUTION system. Based on the user's problem, classification, and answers, generate a COMPLETE legal action plan.

CLASSIFICATION:
Category: ${classification.category}
Issues: ${classification.possible_issues?.join(", ")}
Urgency: ${classification.urgency}

USER ANSWERS:
${answersText}

LEGAL DATABASE CONTEXT:
${ragContext}

RETURN VALID JSON ONLY with this EXACT schema:
{
  "decision": {
    "options": [
      {
        "name": "Option name",
        "description": "What this option involves",
        "pros": ["advantage 1", "advantage 2"],
        "cons": ["disadvantage 1"],
        "estimated_cost": "₹X - ₹Y or Free",
        "estimated_time": "X days/weeks/months"
      }
    ],
    "recommended": "Name of the recommended option",
    "reason": "Why this option is recommended based on the user's specific situation"
  },
  "workflow": [
    {
      "step": 1,
      "title": "Step title",
      "description": "What to do in this step",
      "action_type": "document" | "visit" | "online" | "lawyer" | "call",
      "cta": "Button label text",
      "time_estimate": "X days",
      "required_documents": ["Document 1", "Document 2"],
      "details": "Additional implementation details"
    }
  ],
  "tracking": [
    {
      "id": "unique_task_id",
      "task": "Task description",
      "status": "pending",
      "step_number": 1
    }
  ]
}

RULES:
1. Generate 2-4 legal options. Always include at least one low-cost/free option.
2. Generate 4-8 workflow steps for the RECOMMENDED option.
3. action_type MUST be one of: "document", "visit", "online", "lawyer", "call"
4. Each workflow step must be ACTIONABLE — not vague advice.
5. Include specific Indian courts, tribunals, forums (e.g., "District Consumer Forum", "Family Court", "Labour Commissioner Office").
6. Include specific Indian laws and sections.
7. CTA buttons should be action-oriented: "Generate Legal Notice", "Find Nearest Court", "Draft Complaint", etc.
8. required_documents should list actual Indian documents (Aadhaar, PAN, etc.).
9. Generate tracking items that map 1:1 with workflow steps.
10. All costs should be in ₹ (INR).
11. Be practical and realistic about timeframes in Indian legal system.`;

  const content = await callGroq(
    systemPrompt,
    `Problem: "${problem}"\nPlease generate the complete legal action plan.`
  );
  return JSON.parse(content);
}

// ──────────────────────────────────────────
// STAGE 3: GENERATE LEGAL DOCUMENT
// ──────────────────────────────────────────
async function handleGenerateDocument(
  problem: string,
  classification: any,
  answers: Record<string, string>,
  documentType: string,
  workflowContext: string
) {
  const answersText = Object.entries(answers)
    .map(([q, a]) => `${q}: ${a}`)
    .join("\n");

  const systemPrompt = `You are Nyaaya AI, a legal document drafting system for Indian law.

Generate a FORMAL, LEGALLY STRUCTURED Indian legal document.

USER CONTEXT:
Problem: ${problem}
Category: ${classification.category}
Issues: ${classification.possible_issues?.join(", ")}
User Details:
${answersText}

Workflow Context: ${workflowContext}

RETURN VALID JSON with this schema:
{
  "document": {
    "document_type": "${documentType}",
    "content": "THE FULL LEGAL DOCUMENT TEXT with proper formatting, using \\n for line breaks",
    "instructions": "Step-by-step instructions on how to use this document (filing location, required copies, fees, etc.)"
  }
}

DOCUMENT RULES:
1. Use formal Indian legal language and formatting.
2. Include placeholder fields like [YOUR NAME], [ADDRESS], [DATE], [OPPOSITE PARTY NAME] that the user can fill in.
3. Reference specific Indian Acts and Sections.
4. Include proper salutation, subject line, body, and closing.
5. For Legal Notices: Include Ref number format, "Without Prejudice" header, timeline for response (15 days).
6. For FIR: Use standard FIR format with sections for incident details.
7. For Complaints: Use the format accepted by the relevant Indian forum/tribunal.
8. Make the document READY TO USE after filling placeholders.
9. Instructions must specify WHERE to file, HOW many copies, and any FEES.`;

  const content = await callGroq(
    systemPrompt,
    `Generate a "${documentType}" document for the described legal situation.`
  );
  return JSON.parse(content);
}

// ──────────────────────────────────────────
// MAIN ROUTE HANDLER
// ──────────────────────────────────────────
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, data } = body;

    if (!action || !data) {
      return NextResponse.json(
        { error: "Missing action or data" },
        { status: 400 }
      );
    }

    switch (action) {
      case "classify": {
        if (!data.problem) {
          return NextResponse.json(
            { error: "Missing problem description" },
            { status: 400 }
          );
        }
        const result = await handleClassify(data.problem);
        return NextResponse.json(result);
      }

      case "analyze": {
        if (!data.problem || !data.classification || !data.answers) {
          return NextResponse.json(
            { error: "Missing required fields for analysis" },
            { status: 400 }
          );
        }
        const result = await handleAnalyze(
          data.problem,
          data.classification,
          data.answers
        );
        return NextResponse.json(result);
      }

      case "generate_document": {
        if (!data.problem || !data.classification || !data.documentType) {
          return NextResponse.json(
            { error: "Missing required fields for document generation" },
            { status: 400 }
          );
        }
        const result = await handleGenerateDocument(
          data.problem,
          data.classification,
          data.answers || {},
          data.documentType,
          data.workflowContext || ""
        );
        return NextResponse.json(result);
      }

      default:
        return NextResponse.json(
          { error: `Unknown action: ${action}` },
          { status: 400 }
        );
    }
  } catch (error: any) {
    console.error("Legal Action API Error:", error);
    return NextResponse.json(
      {
        error:
          "Failed to process your legal action request. Please try again.",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
