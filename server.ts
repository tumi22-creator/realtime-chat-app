import express from "express";
import http from "http";
import { Server } from "socket.io";
import next from "next";

const dev = process.env.NODE_ENV !== "production";

const hostname = "localhost";

const port = 3000;

const app = next({
  dev,
  hostname,
  port,
});

const handle = app.getRequestHandler();

app.prepare().then(() => {
  const expressApp = express();

  const server = http.createServer(expressApp);

  const io = new Server(server, {
    cors: {
      origin: "*",
    },
  });

  const onlineUsers = new Map();

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Join
    socket.on("join", (userId) => {
      onlineUsers.set(userId, socket.id);

      io.emit(
        "online-users",
        Array.from(onlineUsers.keys())
      );
    });

    // Send Message
    socket.on("send-message", (message) => {
      io.emit("receive-message", message);
    });

    // Typing
    socket.on("typing", (username) => {
      socket.broadcast.emit(
        "user-typing",
        username
      );
    });

    // Disconnect
    socket.on("disconnect", () => {
      for (const [
        userId,
        socketId,
      ] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
        }
      }

      io.emit(
        "online-users",
        Array.from(onlineUsers.keys())
      );

      console.log("User disconnected");
    });
  });

  expressApp.use((req, res) => {
    return handle(req, res);
  });

  server.listen(port, () => {
    console.log(
      `🚀 Server ready on http://${hostname}:${port}`
    );
  });
});