import { WebSocketServer } from "ws";
import handler from "serve-handler";
import { createServer } from "http";

async function main(opts) {
  if (!opts.port) opts.port = 10209;
  const server = createServer((request, response) => {
    return handler(request, response);
  });
  server.listen(opts.port, () => {
    console.log(`Running at http://localhost:${opts.port}`);
  });
  let wss = new WebSocketServer({
    server
  });
  wss.on("close", () => {
    console.log("WS close");
  });
  wss.on("error", err => {
    console.error("WS Error:", err);
  });
  wss.on("listening", () => {
    console.log("WS listening");
  });
  wss.on("connection", (ws, req) => {
    console.log("WS connection:", req.socket.remoteAddress);
    ws.send("Hello Client!");
    ws.on("message", (data, isBinary) => {
      console.log("WS msg:", data.toString());
    });
    ws.on("close", (code, reason) => {
      console.log("WS disconnect:", req.socket.remoteAddress);
    });
  });
}

main({});