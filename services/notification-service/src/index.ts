import { Elysia } from "elysia";
import { swagger } from "@elysiajs/swagger";
import { serve } from "bun";
import { startConsumer } from "./consumer";

export const activeConnections = new Set<any>();

serve({
  port: 3004,
  fetch(req, server) {
    if (server.upgrade(req)) {
      return; // do not return a Response
    }
    return new Response("Upgrade failed", { status: 500 });
  },
  websocket: {
    message(ws, message) {},
    open(ws) {
      activeConnections.add(ws);
      console.log("WebSocket connection opened");
    },
    close(ws) {
      activeConnections.delete(ws);
      console.log("WebSocket connection closed");
    },
  },
});

const app = new Elysia()
  .use(swagger())
  .get("/health", () => ({ status: "ok", service: "notification-service" }))
  .listen(3003);

startConsumer().catch(console.error);

console.log(`Notification Service running on port ${app.server?.port}`);
