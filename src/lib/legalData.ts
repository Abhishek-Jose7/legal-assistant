// Shared RAG and Data Loading Logic
// Using static imports to ensure data availability in all environments (Vercel/Next.js)

import consumerPolice from "@/data/legal_consumer_police_rights.json";
import cyberFamily from "@/data/legal_cybercrimee_family_rights.json";
import motorDisable from "@/data/legal_motor_services_disable.json";
import spectraComplete from "@/data/legal_spectra_complete.json";
import womenStudent from "@/data/legal_women_student_rights.json";
import workplace from "@/data/legal_workplace_rights.json";

export interface LegalRight {
    id: string;
    title: string;
    category: string;
    summary: string;
    actions: string[];
    tags: string[];
    law_links: { act: string; section?: string; link?: string }[];
    // New Trust & Depth Fields
    source?: { name: string; section?: string; url?: string };
    common_mistakes?: string[];
    risk_level?: "High" | "Medium" | "Low";
    required_documents?: string[];
    example_case?: { title: string; scenario: string; outcome: string };
}

export const loadLegalData = (): LegalRight[] => {
    try {
        const dataFiles = [
            consumerPolice,
            cyberFamily,
            motorDisable,
            spectraComplete,
            womenStudent,
            workplace
        ];

        let allRights: LegalRight[] = [];

        dataFiles.forEach((json: any) => {
            let rawRights: any[] = [];
            if (json.legal_rights_hub && Array.isArray(json.legal_rights_hub)) {
                rawRights = json.legal_rights_hub;
            } else if (json.data && Array.isArray(json.data)) {
                rawRights = json.data;
            }

            const normalized: LegalRight[] = rawRights.map((r: any) => {
                // Heuristic Enrichment for Trust Features
                const titleLower = r.title.toLowerCase();
                let risk: "High" | "Medium" | "Low" = "Medium";
                if (titleLower.includes("arrest") || titleLower.includes("police") || titleLower.includes("fir")) risk = "High";
                if (titleLower.includes("refund") || titleLower.includes("baggage")) risk = "Low";

                // Mocking Source Data if missing (Refine this with real data mapping later)
                const source = {
                    name: r.law_links?.[0]?.act || "Indian Legal Code",
                    section: r.law_links?.[0]?.section || "Relevant Section",
                    url: "https://indiankanoon.org/"
                };

                return {
                    id: r.id,
                    title: r.title,
                    category: r.category,
                    summary: r.short_summary || r.right_summary || r.explanation || "No summary available.",
                    actions: r.actions_if_violated || r.user_actions || [],
                    tags: r.tags || [],
                    law_links: r.law_links || [],

                    // Enriched Data
                    source,
                    risk_level: risk,
                    common_mistakes: [
                        "Delaying formal written complaints",
                        "Not keeping copies of submitted documents",
                        "Signing settlement forms without reading"
                    ],
                    required_documents: [
                        "Identity Proof (Aadhaar/PAN)",
                        "Relevant Invoices/Receipts",
                        "Copy of Complaint/Notice"
                    ],
                    example_case: {
                        title: "Typical Scenerio",
                        scenario: `A citizen faces issues with ${r.category} and is unsure of rights.`,
                        outcome: "Using this right ensures fair treatment and legal remedy."
                    }
                };
            });

            allRights = [...allRights, ...normalized];
        });

        return allRights;
    } catch (error) {
        console.error("Error loading legal data:", error);
        return [];
    }
};
