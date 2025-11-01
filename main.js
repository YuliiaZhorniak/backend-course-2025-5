const fs = require('fs');
const { program} = require('commander');
const http = require('http');

program
   .requiredOption('-h, --host <host>', 'server host')
   .requiredOption('-p, --port <port>', 'server port')
   .requiredOption('-c, --cache <path>', 'server cache')
program.parse(process.argv);
const options = program.opts();

if (!fs.existsSync(options.cache)) {
fs.mkdirSync(options.cache, { recursive: true});
}

 const server = http.createServer((req, res) => {
res.writeHead(200, {"Content-Type": "text/plain; charset=utf-8"});
res.end("Server is running");
});
server.listen(options.port, options.host, () => {
console.log(`Server is running on http://${options.host}:${options.port}`);
});
