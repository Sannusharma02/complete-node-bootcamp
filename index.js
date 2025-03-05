const fs = require('fs');
const http = require('http');
const url = require('url');

//SERVER
const replaceTemplate = (temp, product) =>{
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
    output = output.replace(/{%IMAGE%}/g,product.image);
    output = output.replace(/{%PRICE%}/g,product.price);
    output = output.replace(/{%FROM%}/g,product.from);
    output = output.replace(/{%NUTRIENTS%}/g,product.nutrients);
    output = output.replace(/{%QUANTITY%}/g,product.quantity);
    output = output.replace(/{%DESCRIPTION%}/g,product.description);
    output = output.replace(/{%ID%}/g,product.id);
    if(!product.organic) {
        output = output.replace(/{%NOT_ORGANIC%}/g,'not-organic');
    }
    // else{
    //     output = output.replace(/%IMAGE%/g,'organic');
    // }

    return output;
}

const tempOverview =fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf8');
const tempCard =fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf8');
const tempProduct =fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf8');
const dataObj = JSON.parse(data);


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
        res.end(tempProduct);

    //API
    } else if (pathname === '/api'){
        res.writeHead(200,{'Content-Type': 'application/json'});
        res.end(data)

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
