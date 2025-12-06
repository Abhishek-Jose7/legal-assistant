import { NextResponse } from "next/server";

export async function GET() {
    const API_KEY = process.env.NEWS_API_KEY;

    if (!API_KEY) {
        return NextResponse.json({ error: "API Key missing" }, { status: 500 });
    }

    // Keywords verified by user
    const keywords = [
        "law", "legal", "court", "judgement", "rights",
        "supreme court", "high court"
    ];

    const query = keywords.join(" OR ");

    // Domains verified by user (High quality legal/news sources)
    const domains = "livelaw.in,barandbench.com,ndtv.com,indiatoday.in,indianexpress.com,thehindu.com,legallyindia.com";

    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&domains=${domains}&language=en&sortBy=publishedAt&pageSize=20&apiKey=${API_KEY}`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        if (data.status === "error") {
            throw new Error(data.message);
        }

        const filtered = data.articles?.filter((article: any) =>
            article.title && article.description
        ).map((article: any) => {
            let relevance = "Legal Update";
            const combinedText = (article.title + " " + article.description).toLowerCase();

            if (combinedText.includes("supreme court")) relevance = "Supreme Court";
            else if (combinedText.includes("high court")) relevance = "High Court";
            else if (combinedText.includes("consumer")) relevance = "Consumer Rights";
            else if (combinedText.includes("bail") || combinedText.includes("arrest") || combinedText.includes("fir")) relevance = "Criminal Law";
            else if (combinedText.includes("verdict") || combinedText.includes("judgment")) relevance = "Judgment";
            else if (combinedText.includes("bar council") || combinedText.includes("lawyer")) relevance = "Legal Profession";

            return {
                source: article.source.name,
                author: article.author || "Legal Desk",
                title: article.title,
                description: article.description,
                url: article.url,
                urlToImage: article.urlToImage, // Can be null
                publishedAt: article.publishedAt,
                relevance: relevance
            };
        }) || [];

        // Remove duplicates/spam
        const seen = new Set();
        const uniqueNews = filtered.filter((el: any) => {
            if (el.title === "[Removed]") return false; // NewsAPI specific
            const duplicate = seen.has(el.title);
            seen.add(el.title);
            return !duplicate;
        });

        return NextResponse.json(uniqueNews.slice(0, 10));
    } catch (error) {
        console.error("News API Error:", error);
        return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
    }
}
