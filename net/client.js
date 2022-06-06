import { createPlayer } from "./player.js";
export function resolveAddress(host, port) {
  if (!host) host = window.location.hostname;
  if (!port) port = window.location.port;
  return `ws://${host}:${port}`;
}
export function connect(wsAddress) {
  if (!wsAddress) wsAddress = resolveAddress();
  let ws = new WebSocket(wsAddress);
  ws.addEventListener("open", evt => {
    console.log("WS connected");
  });
  ws.addEventListener("message", evt => {
    console.log("WS msg", evt.data.toString());
  });
  ws.addEventListener("close", evt => {
    console.log("WS closed", evt);
  });
  ws.addEventListener("error", evt => {
    console.error("WS error", evt);
  });
  createPlayer(prompt("Enter your player name", "Player 1"));
}