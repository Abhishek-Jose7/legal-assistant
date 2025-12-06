
const API_KEY = "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";

async function testOpenRouter() {
    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "http://localhost:3000",
            },
            body: JSON.stringify({
                model: "google/gemini-2.0-flash-exp:free", // OpenRouter supports various models. Using a robust one.
                messages: [
                    { role: "user", content: "Say hello!" }
                ],
            })
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Success! Response:", JSON.stringify(data, null, 2));
        } else {
            console.error("Error:", response.status, response.statusText);
            const text = await response.text();
            console.error("Body:", text);
        }
    } catch (error) {
        console.error("Request failed", error);
    }
}

testOpenRouter();
