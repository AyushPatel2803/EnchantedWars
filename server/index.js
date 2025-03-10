const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // Adjust based on frontend port
    methods: ["GET", "POST"],
  },
});

let waitingPlayer = null; // Stores the first player waiting for a match

// WebSocket connection handling
io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("find_match", (username) => {
    if (waitingPlayer) {
      // Pair the two players
      const opponent = waitingPlayer;
      io.to(opponent.id).emit("match_found", { opponent: username });
      io.to(socket.id).emit("match_found", { opponent: opponent.username });

      waitingPlayer = null; // Reset queue
    } else {
      waitingPlayer = { id: socket.id, username }; // Store the first player
    }
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);

    // Remove from queue if they were waiting
    if (waitingPlayer && waitingPlayer.id === socket.id) {
      waitingPlayer = null;
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
