// index.js
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
const pollRoutes = require("./routes/pollRoutes");
const registerSocketHandlers = require("./sockets/socketHandlers");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/polls", pollRoutes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

registerSocketHandlers(io);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
