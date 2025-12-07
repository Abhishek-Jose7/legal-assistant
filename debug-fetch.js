const http = require('http');

http.get('http://localhost:3000/api/legal-rights', (res) => {
    console.log('Status:', res.statusCode);
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });
    res.on('end', () => {
        console.log('Body:', data);
    });
}).on('error', (e) => {
    console.error(e);
});
