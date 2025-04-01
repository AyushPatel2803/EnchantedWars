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
let gameSession = null; // Stores the current game session
let turnTimer = null; // Stores the timer for the current turn
const TURN_DURATION = 60000; // 60 seconds

// WebSocket connection handling
io.on("connection", (socket) => {
  console.log(`Player connected: ${socket.id}`);

  socket.on("card_played", ({ slotIndex, card, currentPlayer }) => {
    console.log(`Player ${currentPlayer} played a card in slot ${slotIndex}`);
    // Broadcast the card placement to all clients
    socket.broadcast.emit("card_played", { slotIndex, card, currentPlayer });
  });

  socket.on("disconnect", () => {
    console.log(`Player disconnected: ${socket.id}`);
  });

  socket.emit("player_assigned", { playerId: socket.id });

  socket.on("find_match", (username) => {
    if (waitingPlayer) {
      // Pair the two players
      const opponent = waitingPlayer;
      io.to(opponent.id).emit("match_found", { opponent: username });
      io.to(socket.id).emit("match_found", { opponent: opponent.username });

      // Start the game session
      gameSession = {
        players: [
          { id: opponent.id, username: opponent.username },
          { id: socket.id, username },
        ],
        currentPlayerIndex: 0,
      };

      waitingPlayer = null; // Reset queue
      startTurn();
    } else {
      waitingPlayer = { id: socket.id, username }; // Store the first player
    }
  });

  socket.on("end_turn", ({ nextPlayer }) => {
    console.log(`Switching to Player ${nextPlayer}`);
    io.emit("turn_update", { nextPlayer }); // Notify all clients of the turn change
  });

  socket.on("card_played", ({ slotIndex, card, currentPlayer }) => {
    console.log(`Player ${currentPlayer} played a card in slot ${slotIndex}`);
    // Broadcast the card placement to all clients
    socket.broadcast.emit("card_played", { slotIndex, card, currentPlayer });
  });

  socket.on("disconnect", () => {
    console.log(`Player disconnected: ${socket.id}`);

    // Remove from queue if they were waiting
    if (waitingPlayer && waitingPlayer.id === socket.id) {
      waitingPlayer = null;
    }

    // End the game session if a player disconnects
    if (gameSession && gameSession.players.some(player => player.id === socket.id)) {
      io.emit("game_end", { message: "A player has disconnected. Game over." });
      gameSession = null;
      clearTimeout(turnTimer);
    }
  });
});

function startTurn() {
  if (!gameSession) return;

  const currentPlayer = gameSession.players[gameSession.currentPlayerIndex];
  io.to(currentPlayer.id).emit("turn_start", { playerId: currentPlayer.id });

  turnTimer = setTimeout(() => {
    endTurn();
  }, TURN_DURATION);
}

function endTurn() {
  if (!gameSession) return;

  clearTimeout(turnTimer);
  gameSession.currentPlayerIndex = (gameSession.currentPlayerIndex + 1) % gameSession.players.length;
  startTurn();
}

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});


