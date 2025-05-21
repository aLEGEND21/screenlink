import { createServer } from "http";
import { parse } from "url";
import next from "next";
import { Server } from "socket.io";

const app = next({ dev: process.env.NODE_ENV !== "production" });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  });

  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    const socketId = socket.id;
    console.log(`[socket.io] User connected: ${socketId}`);

    socket.on("share-started", () => {
      console.log(`[socket.io] User ${socketId} started sharing`);
      socket.broadcast.emit("share-started");
    });

    socket.on("screen-data", (data) => {
      socket.broadcast.emit("screen-data", data);
    });

    socket.on("share-ended", () => {
      console.log(`[socket.io] User ${socketId} ended sharing`);
      socket.broadcast.emit("share-stopped");
    });

    socket.on("disconnect", (reason) => {
      console.log(
        `[socket.io] User disconnected: ${socketId} (Reason: ${reason})`
      );
    });
  });

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log("> Ready on http://localhost:3000");
  });
});
