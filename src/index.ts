import http from "node:http";

const PORT = 3000;

const respondWithJson = (res: http.ServerResponse, statusCode: number = 200, data?: any ) => {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  if (!!data) {
    res.end(JSON.stringify(data));
  } else {
    res.end(JSON.stringify({ message: "No data" }));
  }
};

const DATA = new Map<string, string>();

const server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
  const urlRaw = req.url;
  if (!urlRaw) {
    return respondWithJson(res, 400, { message: "Bad Request. No URL provided." });
  }
  const url = new URL(urlRaw, `http://${req.headers.host}`);
  if (url.pathname === "/set") {
    for (const [key, value] of url.searchParams.entries()) {
      DATA.set(key, value);
    }
    return respondWithJson(res, 200, { message: "Set operation successful" });
  } 
  if (url.pathname === "/get") {
    const key = url.searchParams.get("key");
    if (!key) {
      return respondWithJson(res, 400, { error: "Bad Request. No key provided." });
    }
    if (!DATA.has(key)) {
      return respondWithJson(res, 404, { message: "Not Found. Key does not exist.", data: null });
    }
    const value = DATA.get(key);
    return respondWithJson(res, 200, { message: "Get operation successful", data: { [key]: value } });
  }
  if (url.pathname === "/del") {
    const key = url.searchParams.get("key");
    if (!key) {
      return respondWithJson(res, 400, { error: "Bad Request. No key provided." });
    }
    DATA.delete(key);
    return respondWithJson(res, 200, { message: "Delete operation successful" });
  }
  return respondWithJson(res, 404, { error: "Not Found" });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
});
