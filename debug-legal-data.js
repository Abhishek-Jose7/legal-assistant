const fs = require('fs');
const path = require('path');

const dataDir = path.join(process.cwd(), 'data');
console.log(`Checking data dir: ${dataDir}`);

try {
    const files = fs.readdirSync(dataDir).filter(file => file.endsWith('.json') && file.startsWith('legal_'));
    console.log(`Found ${files.length} files:`, files);

    let allRights = [];
    let categories = new Set();

    files.forEach(file => {
        try {
            const filePath = path.join(dataDir, file);
            const content = fs.readFileSync(filePath, 'utf8');
            const json = JSON.parse(content);

            let rights = [];
            if (json.legal_rights_hub) rights = json.legal_rights_hub;
            else if (json.data) rights = json.data;

            console.log(`File ${file}: Found ${rights.length} rights`);

            rights.forEach(r => {
                if (r.category) categories.add(r.category);
                allRights.push(r);
            });

        } catch (e) {
            console.error(`Error processing ${file}:`, e.message);
        }
    });

    console.log(`Total loaded rights: ${allRights.length}`);
    console.log('Categories found:', Array.from(categories));

} catch (e) {
    console.error("Error reading data directory:", e.message);
}
