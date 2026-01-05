const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] },
});

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);
  socket.on("disconnect", () => console.log("Socket disconnected:", socket.id));
});

// Spring Boot will POST here when inventory changes
app.post("/publish/inventory", (req, res) => {
  io.emit("inventory_update", req.body);
  res.json({ ok: true });
});

server.listen(8090, () => console.log("Socket.io server running on http://localhost:8090"));