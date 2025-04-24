import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { Server } from "socket.io";

// Initalize a Next.js app
const app = next({ dev: process.env.NODE_ENV !== "production" });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  // Create an HTTP server and forward all requests to Next.js
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  // Initialize Socket.IO on the HTTP server
  // This allows it to work with the same Next.js server instance
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  // Handle new users connecting to the Socket.IO server
  io.on("connection", (socket) => {
    console.log("[socket.io] User connected");

    socket.on("disconnect", () => {
      console.log("[socket.io] User disconnected");
    });

    socket.on("message-send", (message) => {
      console.log("[socket.io] Message received:", message);
      socket.broadcast.emit("message-receive", message);
    });
  });

  // Start the HTTP server on port 3000
  server.listen(3000, (err) => {
    if (err) throw err;
    console.log("> Ready on http://localhost:3000");
  });
});
