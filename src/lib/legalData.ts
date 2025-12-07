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
    law_links: any[];
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

            const normalized: LegalRight[] = rawRights.map((r: any) => ({
                id: r.id,
                title: r.title,
                category: r.category,
                summary: r.short_summary || r.right_summary || r.explanation || "No summary available.",
                actions: r.actions_if_violated || r.user_actions || [],
                tags: r.tags || [],
                law_links: r.law_links || []
            }));

            allRights = [...allRights, ...normalized];
        });

        return allRights;
    } catch (error) {
        console.error("Error loading legal data:", error);
        return [];
    }
};
