const http = require('http');
const fs = require('fs');
const server = http.createServer((req, res) => {
    let url = req.url;
    if(url === '/') url = "/index.html";
    fs.readFile(`../${url}`, (err, data) => {
        if(err) {
            res.end("404: Page not found");
            return;
        }
        let cont = undefined;
        switch(url.slice(url.indexOf('.'))) {
            case '.html':
                cont = "text/html";
                break;
            case '.js':
                cont = "text/javascript";
                break;
            case '.css':
                cont = "text/css";
                break;
            case '.png':
                cont = "image/png";
                break;
        }
        console.log(url);
        if(cont) res.writeHead(200, {"Content-Type": cont});
        res.write(data);
        res.end();
    })
})
server.listen(8000);