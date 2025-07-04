import express from "express";
import http from "http";
import cors from "cors";
import { Server } from "socket.io";
import registerSocketHandlers from "./sockets/socketHandlers.js";
import pollRoutes from "./routes/pollRoutes.js";
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