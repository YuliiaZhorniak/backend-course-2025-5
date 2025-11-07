const fs = require('fs');
const { program} = require('commander');
const http = require('http');
const path = require('path');

program
   .requiredOption('-H, --host <host>', 'server host')
   .requiredOption('-p, --port <port>', 'server port')
   .requiredOption('-c, --cache <path>', 'server cache')
program.parse(process.argv);
const options = program.opts();

if (!fs.existsSync(options.cache)) {
fs.mkdirSync(options.cache, { recursive: true});
}

 const server = http.createServer(async (req, res) => {
const fileName = path.basename(req.url);
  const filePath = path.join(options.cache, `${fileName}.jpg`); 

  try {
    switch (req.method) {
      case "GET":
        try {
          const data = await fs.promises.readFile(filePath);
          res.writeHead(200, { "Content-Type": "image/jpeg" });
          res.end(data);
        } catch (err) {
          res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
          res.end("404 Not Found — image not found in cache");
         }
break;
case "PUT":
        const body = [];
        req.on("data", (chunk) => body.push(chunk));
        req.on("end", async () => {
          const buffer = Buffer.concat(body);
          await fs.promises.writeFile(filePath, buffer);
          res.writeHead(201, { "Content-Type": "text/plain; charset=utf-8" });
          res.end("201 Created — image saved to cache");
        });
        break;
case "DELETE":
        try {
          await fs.promises.unlink(filePath);
          res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
          res.end("200 OK — image deleted");
        } catch (err) {
          if (err.code === "ENOENT") {
            res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
            res.end("404 Not Found — image not found");
          } else {
            res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
            res.end("500 Internal Server Error");
          }
        }
        break;
default:
        res.writeHead(405, { "Content-Type": "text/plain; charset=utf-8" });
        res.end("405 Method Not Allowed");
        break;
    }
  } catch (err) {
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("500 Internal Server Error");
  }
});

server.listen(options.port, options.host, () => {
console.log(`Server is running on http://${options.host}:${options.port}`);
});
