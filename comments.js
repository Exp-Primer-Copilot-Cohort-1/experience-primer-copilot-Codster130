//Create web server
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const comments = require('./comments.js');
const querystring = require('querystring');

const server = http.createServer((req, res) => {
    //parse the url
    let urlObj = url.parse(req.url);
    let urlPath = urlObj.pathname;
    let query = querystring.parse(urlObj.query);
    //console.log('urlPath:', urlPath);
    //console.log('query:', query);
    //console.log('req.method:', req.method);
    if (urlPath === '/' && req.method === 'GET') {
        fs.readFile(path.join(__dirname, 'public', 'index.html'), 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    } else if (urlPath === '/comments' && req.method === 'GET') {
        comments.getComments((err, comments) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
            } else {
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(comments));
            }
        });
    } else if (urlPath === '/comments' && req.method === 'POST') {
        let data = '';
        req.on('data', (chunk) => {
            data += chunk;
        });
        req.on('end', () => {
            let newComment = querystring.parse(data);
            //console.log('newComment:', newComment);
            comments.addComment(newComment, (err) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Internal Server Error');
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/plain' });
                    res.end('Comment added successfully');
                }
            });
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Page Not Found');
    }
});

server.listen(300);