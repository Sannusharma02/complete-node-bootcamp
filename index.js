const fs = require('fs');
const http = require('http');
const url = require('url');

const data =fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf8');
const dataObj = JSON.parse(data.toString());

const server = http.createServer((req, res) => {
    const pathName = req.url;
    console.log(pathName);
    if (pathName === '/overview') {
        res.end('This is the Overview');
    } else if (pathName === '/product') {
        res.end('This is the Overview');
    } else if (pathName === '/api'){
        res.writeHead(200,{'Content-Type': 'application/json'});
        res.end(data)
    } else{
        res.writeHead(404, {
            'Content-Type': 'text/html',
            'my-owm-header': 'hello world',
        });
        res.end('<h1>Page not found!</h1>');
    }
})

server.listen(8000, '127.0.0.1', () => {
    console.log('Listening on port 8000');
});
