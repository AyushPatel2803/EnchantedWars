const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Game management
let waitingPlayer = null;
let activeGames = new Map();
let playerCount = 0;

// Utility function to create a new game
function createGame(player1, player2) {
  const gameId = Math.random().toString(36).substring(7);
  const gameState = {
    id: gameId,
    players: [player1, player2],
    currentPlayerIndex: 0,
    turnTimeLeft: 60,
    isActive: true,
    playedCards: {
      [player1.id]: Array(5).fill(null),
      [player2.id]: Array(5).fill(null)
    }
  };
  activeGames.set(gameId, gameState);
  return gameState;
}

// Utility function to log game state
function logGameState(gameId) {
  const game = activeGames.get(gameId);
  if (game) {
    console.log('\n=== Game State ===');
    console.log(`Game ID: ${gameId}`);
    console.log('Players:');
    game.players.forEach((player, index) => {
      console.log(`Player ${index + 1}. ${player.username} (${player.id})`);
    });
    console.log(`Current Turn: ${game.players[game.currentPlayerIndex].username}`);
    console.log('================\n');
  }
}

io.on("connection", (socket) => {
  playerCount++;
  console.log("\n👤 New connection:", socket.id);
  console.log("📊 Total players connected:", playerCount);

  socket.on("find_match", (username) => {
    console.log(`\n🔍 ${username} (${socket.id}) is searching for a match...`);

    if (waitingPlayer) {
      const player1 = {
        id: waitingPlayer.id,
        username: waitingPlayer.username,
      };

      const player2 = {
        id: socket.id,
        username: username,
      };

      // Create new game
      const game = createGame(player1, player2);

      // Add players to the game room
      socket.join(game.id);
      io.sockets.sockets.get(player1.id)?.join(game.id);

      // Notify both players
      io.to(player1.id).emit("match_found", {
        opponent: player2.username,
        gameId: game.id,
        isFirstPlayer: true,
      });

      io.to(player2.id).emit("match_found", {
        opponent: player1.username,
        gameId: game.id,
        isFirstPlayer: false,
      });

      // Start first player's turn
      io.to(game.id).emit("turn_update", {
        currentPlayerId: player1.id,
        gameId: game.id,
      });

      waitingPlayer = null;
      logGameState(game.id);
    } else {
      waitingPlayer = {
        id: socket.id,
        username: username,
      };
      console.log(`⏳ ${username} added to waiting queue`);
    }
  });

  // Handle turn ending
  socket.on("end_turn", () => {
    for (let [gameId, game] of activeGames) {
      const playerIndex = game.players.findIndex(p => p.id === socket.id);
      
      if (playerIndex !== -1 && playerIndex === game.currentPlayerIndex) {
        // Switch to next player
        game.currentPlayerIndex = (playerIndex + 1) % 2;
        const nextPlayer = game.players[game.currentPlayerIndex];
        
        console.log(`\n🔄 Turn ended in game ${gameId}`);
        console.log(`Next player: ${nextPlayer.username}`);

        // Reset turn timer
        game.turnTimeLeft = 60;

        // Notify players about turn change
        io.to(gameId).emit("turn_update", {
          currentPlayerId: nextPlayer.id,
          gameId: gameId
        });

        logGameState(gameId);
        break;
      }
    }
  });

  // Handle card played
  socket.on("card_played", ({ gameId, slotIndex, card }) => {
    const game = activeGames.get(gameId);
    if (game && game.players[game.currentPlayerIndex].id === socket.id) {
      // Update game state
      game.playedCards[socket.id][slotIndex] = card;
      
      // Broadcast card played to opponent
      socket.to(gameId).emit("card_played", { 
        slotIndex, 
        card,
        playerId: socket.id 
      });
      
      console.log(`\n🃏 Card played in game ${gameId} by ${socket.id}`);
      console.log(`Slot: ${slotIndex}, Card: ${card.name}`);
    }
  });

  // Handle card destruction
  socket.on("destroy_card", ({ gameId, playerId, slotIndex }) => {
    const game = activeGames.get(gameId);
    if (!game) {
      console.error(`Game not found: ${gameId}`);
      return;
    }

    // Find the opponent's ID
    const opponentId = game.players.find(p => p.id !== playerId).id;

    // Update the game state to remove the card
    game.playedCards[opponentId][slotIndex] = null;

    // Notify both players about the card destruction
    io.to(gameId).emit("card_destroyed", { slotIndex, playerId: opponentId });

    console.log(`Card in slot ${slotIndex} destroyed for player ${opponentId} in game ${gameId}`);
  });


  socket.on("player_won", ({ gameId, playerId }) => {
    const game = activeGames.get(gameId);

    if (!game) {
      console.error(`Game not found: ${gameId}`);
      return;
    }

    // Broadcast the win to both players
    io.to(gameId).emit("game_over", { winner: playerId });
    console.log(`Player ${playerId} won the game in game ${gameId}`);

    // Optionally, clean up the game
    activeGames.delete(gameId);
  });

  socket.on("disconnect", () => {
    playerCount--;
    console.log("\n👋 Player disconnected:", socket.id);
    console.log("📊 Total players connected:", playerCount);

    // Remove from waiting queue if applicable
    if (waitingPlayer && waitingPlayer.id === socket.id) {
      console.log("❌ Removed from waiting queue:", waitingPlayer.username);
      waitingPlayer = null;
    }

    // Handle active game disconnection
    activeGames.forEach((game, gameId) => {
      const disconnectedPlayer = game.players.find(p => p.id === socket.id);
      if (disconnectedPlayer) {
        console.log(`\n🚫 Game ${gameId} ended - ${disconnectedPlayer.username} disconnected`);
        
        // Notify other player
        const otherPlayer = game.players.find(p => p.id !== socket.id);
        if (otherPlayer) {
          io.to(otherPlayer.id).emit("opponent_disconnected", {
            message: `${disconnectedPlayer.username} has disconnected`
          });
        }

        // Clean up game
        game.isActive = false;
        io.socketsLeave(gameId); // Remove all sockets from the game room
        activeGames.delete(gameId);
      }
    });
  });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
  console.log("Waiting for players to connect...");
});