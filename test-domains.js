
const apiKey = 'a4b28c3ac072405d9f2c61af711775ea';
const domains = "livelaw.in,barandbench.com";
const url = `https://newsapi.org/v2/everything?domains=${domains}&language=en&pageSize=5&apiKey=${apiKey}`;

console.log("Checking Legal Domains:", url);

fetch(url)
    .then(res => res.json())
    .then(data => {
        console.log("Total Results:", data.totalResults);
        if (data.articles && data.articles.length > 0) {
            console.log("First Article:", data.articles[0].title);
        }
    })
    .catch(err => console.error(err));
