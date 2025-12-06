import { NextResponse } from "next/server";

export async function GET() {
    // Fallback data: Educational/Static content defined first so it's available for early returns
    const fallbackNews = [
        {
            source: "Legal Education Series",
            title: "Know Your Rights: What to do if arrested?",
            description: "Understanding the D.K. Basu guidelines on arrest. You have the right to inform a relative, right to a lawyer, and right to medical examination.",
            url: "/rights",
            urlToImage: null,
            publishedAt: new Date().toISOString(),
            relevance: "Constitutional Rights"
        },
        {
            source: "Consumer Awareness",
            title: "Deficiency in Service? How to file a Consumer Complaint online",
            description: "The E-Daakhil portal allows consumers to file complaints from home. Learn the step-by-step process to seek redressal for defective products.",
            url: "/templates",
            urlToImage: null,
            publishedAt: new Date().toISOString(),
            relevance: "Consumer Rights"
        },
        {
            source: "Supreme Court Updates",
            title: "Landmark Judgment on Right to Privacy",
            description: "Revisiting the Puttaswamy judgment: Privacy is a fundamental right. How this impacts data protection laws in India today.",
            url: "https://main.sci.gov.in/",
            urlToImage: null,
            publishedAt: new Date().toISOString(),
            relevance: "Supreme Court"
        },
        {
            source: "Tenant Guide",
            title: "Model Tenancy Act: Key changes for Landlords and Tenants",
            description: "New rules regarding security deposits, eviction grounds, and rent agreements. Ensure your rental contract is compliant.",
            url: "/rights",
            urlToImage: null,
            publishedAt: new Date().toISOString(),
            relevance: "Property Law"
        }
    ];

    // Use environment variable or the fallback key provided by the user to ensure it works immediately
    const API_KEY = process.env.NEWS_API_KEY || "a4b28c3ac072405d9f2c61af711775ea";

    if (!API_KEY) {
        console.warn("No API Key found, returning fallback.");
        return NextResponse.json(fallbackNews);
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

        if (!res.ok) {
            console.warn("News API failed, using fallback data.");
            return NextResponse.json(fallbackNews);
        }

        const data = await res.json();

        if (data.status === "error" || !data.articles || data.articles.length === 0) {
            console.warn("News API returned error or no rights, using fallback.");
            return NextResponse.json(fallbackNews);
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

        // Use fallback if filtering removed everything
        if (uniqueNews.length === 0) {
            return NextResponse.json(fallbackNews);
        }

        return NextResponse.json(uniqueNews.slice(0, 10));
    } catch (error) {
        console.error("News API Error:", error);
        // Fallback on error ensures UI doesn't break
        return NextResponse.json(fallbackNews);
    }
}
