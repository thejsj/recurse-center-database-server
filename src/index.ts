import http from "node:http";

const PORT = 3000;

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ message: "Hello, World!" }));
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
