import { Elysia } from "elysia";
import { ws } from "@elysiajs/websocket";

const app = new Elysia()
  .use(ws())
  .ws("/ws", {
    message(ws, msg) {
      ws.send(msg);
    }
  })
  .listen(3004);
console.log("ws ok");
process.exit(0);
