const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env.local');

try {
    const content = fs.readFileSync(envPath, 'utf8');
    const lines = content.split('\n');

    console.log(`Analyzing .env.local logic (${lines.length} lines)...`);

    lines.forEach((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) return;

        const [key, ...values] = trimmed.split('=');
        const value = values.join('=');

        if (!key || !value) {
            console.log(`[Line ${idx + 1}] ⚠️ Malformed line: ${trimmed}`);
            return;
        }

        const cleanKey = key.trim();
        let cleanValue = value.trim();

        console.log(`Checking ${cleanKey}...`);

        // Check 1: Leading spaces in value (often copy-paste error)
        if (value.startsWith(' ') || value.endsWith(' ')) {
            console.log(`   ❌ WARNING: Value for ${cleanKey} has leading/trailing spaces. This might invalidate the key.`);
        }

        // Check 2: Quotes
        if (cleanValue.startsWith('"') && cleanValue.endsWith('"')) {
            console.log(`   ℹ️ Value is quoted. Ensure there are no nested quotes.`);
            cleanValue = cleanValue.slice(1, -1);
        } else if (cleanValue.startsWith("'") && cleanValue.endsWith("'")) {
            console.log(`   ℹ️ Value is single-quoted.`);
            cleanValue = cleanValue.slice(1, -1);
        }

        // Check 3: Groq Key Format
        if (cleanKey === 'GROQ_API_KEY') {
            if (!cleanValue.startsWith('gsk_')) {
                console.log(`   ❌ ERROR: GROQ_API_KEY should typically start with 'gsk_'. Found: ${cleanValue.substring(0, 4)}...`);
            } else {
                console.log(`   ✅ Format looks correct (Starts with gsk_). Length: ${cleanValue.length}`);
            }
        }

        // Check 4: OpenRouter Key Format
        if (cleanKey === 'OPENROUTER_API_KEY') {
            if (!cleanValue.startsWith('sk-or-')) {
                console.log(`   ℹ️ NOTE: OpenRouter keys usually start with 'sk-or-'. Found: ${cleanValue.substring(0, 4)}...`);
            }
            console.log(`   ✅ Length: ${cleanValue.length}`);
        }
    });

} catch (e) {
    console.error("Could not read .env.local", e.message);
}
