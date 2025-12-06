import fs from 'fs';
import path from 'path';

// Shared RAG and Data Loading Logic

export interface LegalRight {
    id: string;
    title: string;
    category: string;
    summary: string;
    actions: string[];
    tags: string[];
}

export const loadLegalData = (): LegalRight[] => {
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

        return allRights;
    } catch (error) {
        console.error("Error loading legal data:", error);
        return [];
    }
};
