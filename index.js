const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');
const replaceTemplate = require('./modules/replaceTemplate');

const tempOverview =fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf8');
const tempCard =fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf8');
const tempProduct =fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf8');
const dataObj = JSON.parse(data);

const slugs = dataObj.map(el=>({
    slug: slugify(el.productName,{lower:true}),
    id: el.id
}));

//SERVER
const server = http.createServer((req, res) => {
const { query, pathname} = url.parse(req.url, true);

    //OVERVIEW PAGE
    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });
        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARD%}',cardsHtml);
        res.end(output);

    //PRODUCT PAGE
    } else if (pathname === '/product') {
        res.writeHead(200, {'Content-Type': 'text/html'});
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product);
        res.end(output);

    //API
    } else if (pathname === '/api'){
        res.writeHead(200,{'Content-Type': 'application/json'});
        res.end(data);

    // NOT FOUND
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
