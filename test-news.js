
const apiKey = 'a4b28c3ac072405d9f2c61af711775ea';
const keywords = ["law", "supreme court", "high court", "legal", "rights"];
const query = keywords.join(" OR ");
// Let's try a broad query first, then narrow
const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&pageSize=5&apiKey=${apiKey}`;

console.log("Fetching URL:", url);

fetch(url)
    .then(res => res.json())
    .then(data => {
        console.log("Status:", data.status);
        console.log("Total Results:", data.totalResults);
        if (data.articles && data.articles.length > 0) {
            console.log("First Article:", data.articles[0].title);
            console.log("Source:", data.articles[0].source.name);
        } else {
            console.log("No articles found.");
            console.log("Message:", data.message);
        }
    })
    .catch(err => console.error("Error:", err));
