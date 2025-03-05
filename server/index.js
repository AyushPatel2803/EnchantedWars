const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app); // Create an HTTP server

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Adjust based on frontend port
    methods: ["GET", "POST"],
  },
});

app.use(cors());

// WebSocket connection handling
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("join_game", (username) => {
    console.log(`${username} joined the game.`);
    io.emit("player_joined", username);
  });

//   socket.on("play_card", (cardData) => {
//     console.log(`Card played: ${cardData.card}`);
//     io.emit("card_played", cardData); // Broadcast to all players
//   });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

server.listen(3000, () => {
  console.log("Server running on port 3000");
});
