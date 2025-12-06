import { NextResponse } from "next/server";
import { loadLegalData } from "@/lib/legalData";

// Load data using shared lib
const legalRightsDB = loadLegalData();

const searchLegalRights = (query: string) => {
  if (legalRightsDB.length === 0) return [];

  const lowerQuery = query.toLowerCase();
  const searchTerms = lowerQuery.split(" ").filter((t: string) => t.length > 3);

  return legalRightsDB.map((right) => {
    let score = 0;
    // Weighted scoring
    if (right.title.toLowerCase().includes(lowerQuery)) score += 10;
    if (right.category.toLowerCase().includes(lowerQuery)) score += 5;
    if (right.tags.some((t: string) => lowerQuery.includes(t.toLowerCase()))) score += 5;

    // Term matching
    searchTerms.forEach((term: string) => {
      if (right.summary.toLowerCase().includes(term)) score += 2;
      if (right.title.toLowerCase().includes(term)) score += 3;
    });

    return { ...right, score };
  })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3); // Top 3
};

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    // 1. Perform Search on Legal DB
    const relevantRights = searchLegalRights(message);

    // 2. Return Direct RAG Response (No External API - Pure Local Intelligence)
    let finalMessage = "";
    let action = "NONE";

    if (relevantRights.length > 0) {
      finalMessage = `### 📌 Relevant Legal Rights Found\n\nI found the following rights in our database that match your query:\n\n`;

      relevantRights.forEach((r: any) => {
        finalMessage += `#### **${r.title}** (${r.category})\n`;
        finalMessage += `> ${r.summary}\n\n`;

        if (r.actions && r.actions.length > 0) {
          finalMessage += `**Recommended Actions:**\n`;
          r.actions.forEach((act: string) => {
            finalMessage += `- ${act}\n`;
          });
          finalMessage += `\n`;
        }
      });

      finalMessage += `\n*Note: This is a direct search result from our legal database.*`;

      // Heuristic for action determination
      const combinedText = JSON.stringify(relevantRights).toLowerCase();
      if (combinedText.includes("lawyer") || combinedText.includes("court")) {
        action = "SHOW_LAWYERS";
      } else if (combinedText.includes("template") || combinedText.includes("form")) {
        action = "SHOW_TEMPLATE";
      }

    } else {
      finalMessage = "I searched our legal database but couldn't find specific rights matching your query. Please try rephrasing or ask about a different topic (e.g., 'Workplace', 'Consumer rights').";
    }

    const parsedResponse = {
      message: finalMessage,
      action: action,
      action_data: {}
    };

    // Simulate network delay for better UX
    await new Promise(resolve => setTimeout(resolve, 500));

    return NextResponse.json(parsedResponse);

  } catch (error) {
    console.error("Chat API Error:", error);
    return NextResponse.json(
      {
        message: "I'm experiencing high traffic right now. Please try again in a moment.",
        error: String(error)
      },
      { status: 500 }
    );
  }
}
