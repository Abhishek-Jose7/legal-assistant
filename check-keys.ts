import dotenv from 'dotenv';
import Groq from 'groq-sdk';
import fs from 'fs';
import path from 'path';

// Load env
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    for (const k in envConfig) {
        process.env[k] = envConfig[k];
    }
}

async function testKeys() {
    console.log("--- Diagnosing API Keys ---");

    // 1. Test Groq
    const groqKey = process.env.GROQ_API_KEY;
    if (!groqKey) {
        console.log("❌ GROQ_API_KEY is MISSING in .env.local");
    } else {
        console.log(`ℹ️ Checking Groq Key: ${groqKey.slice(0, 5)}...`);
        try {
            const groq = new Groq({ apiKey: groqKey });
            await groq.chat.completions.create({
                messages: [{ role: "user", content: "ping" }],
                model: "llama3-70b-8192",
            });
            console.log("✅ Groq API is WORKING.");
        } catch (e: any) {
            console.log(`❌ Groq API Failed: ${e.status || e.code} - ${e.message}`);
            if (e.message?.includes("401")) console.log("   -> CAUSE: The API Key is invalid or expired.");
        }
    }

    console.log("\n");

    // 2. Test OpenRouter
    const openRouterKey = process.env.OPENROUTER_API_KEY;
    if (!openRouterKey) {
        console.log("❌ OPENROUTER_API_KEY is MISSING in .env.local");
    } else {
        console.log(`ℹ️ Checking OpenRouter Key: ${openRouterKey.slice(0, 5)}...`);
        try {
            const res = await fetch("https://openrouter.ai/api/v1/auth/key", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${openRouterKey}`
                }
            });
            if (res.ok) {
                const data = await res.json();
                console.log(`✅ OpenRouter is WORKING. (Limit: ${data.data?.limit || 'Unknown'}, Usage: ${data.data?.usage || 'Unknown'})`);
            } else {
                console.log(`❌ OpenRouter Failed: ${res.status} - ${await res.text()}`);
                if (res.status === 401) console.log("   -> CAUSE: Key is invalid.");
                if (res.status === 402) console.log("   -> CAUSE: Insufficient credits.");
            }
        } catch (e: any) {
            console.log(`❌ OpenRouter Network Error: ${e.message}`);
        }
    }
}

testKeys();
