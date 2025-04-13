const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const path = require("path");

const app = express(); // Initialize the app first
app.use(cors()); // Use CORS middleware
app.use("/assets", express.static(path.join(__dirname, "assets"))); // Serve static files

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

const cardList = [
  { id: 1, name: "MooseDruid", type: "Hero", affinity: "Druid", min: 4, max: 8 },
  { id: 2, name: "DarkGoblin", type: "Hero", affinity: "Dark", min: 0, max: 6 },
  { id: 3, name: "DruidMask", type: "Item", affinity: "Druid" },
  { id: 4, name: "DecoyDoll", type: "Item", affinity: null },
  { id: 5, name: "CriticalBoost", type: "Spell", affinity: null },
  { id: 6, name: "LostSoul", type: "Hero", affinity: "Undead", min: 0, max: 6 },
  { id: 7, name: "Bullseye", type: "Hero", affinity: "Consort", min: 0, max: 4 },
  { id: 8, name: "Hydra", type: "Hero", affinity: "Serpentine", min: 0, max: 0 },
  { id: 9, name: "Cyborg20xx", type: "Hero", affinity: "Cyborg", min: 4, max: 10 },
  { id: 10, name: "Switcheroo", type: "Spell" },
  { id: 11, name: "MAD", type: "Spell" },
  { id: 12, name: "RoboMask", type: "Item", affinity: "Cyborg" },
  { id: 13, name: "SpectreMask", type: "Item", affinity: "Undead" },
  { id: 15, name: "SerpentMask", type: "Item", affinity: "Serpentine" },
  { id: 17, name: "Gorgon", type: "Hero", affinity: "Serpentine", min: 0, max: 0 },
  { id: 18, name: "WingedSerpent", type: "Hero", affinity: "Serpentine", min: 0, max: 7 },
  { id: 19, name: "Ragnarok", type: "Hero", affinity: "Consort", min: 0, max: 6 },
  { id: 20, name: "WhiteMage", type: "Hero", affinity: "Consort", min: 0, max: 7 },
  { id: 21, name: "TimeMachine", type: "Hero", affinity: "Cyborg", min: 0, max: 11 },
  { id: 22, name: "TitaniumGiant", type: "Hero", affinity: "Cyborg", min: 0, max: 8 },
  { id: 23, name: "MightyOak", type: "Hero", affinity: "Druid", min: 0, max: 0 },
  { id: 24, name: "BearCleaver", type: "Hero", affinity: "Druid", min: 0, max: 8 },
  { id: 25, name: "Cerberus", type: "Hero", affinity: "Dark", min: 6, max: 8 },
  { id: 26, name: "Gargoyle", type: "Hero", affinity: "Dark", min: 0, max: 9 },
  { id: 27, name: "Vampire", type: "Hero", affinity: "Undead", min: 0, max: 6 },
];

// Utility function to create a new game
function createGame(player1, player2) {
  const gameId = Math.random().toString(36).substring(7);

  // Create and shuffle a single deck
  const shuffledDeck = [...cardList].sort(() => Math.random() - 0.5);

  const gameState = {
    id: gameId,
    players: [player1, player2],
    currentPlayerIndex: 0,
    turnTimeLeft: 60,
    isActive: true,
    playedCards: {
      [player1.id]: Array(5).fill(null),
      [player2.id]: Array(5).fill(null),
    },
    playerHands: {
      [player1.id]: [],
      [player2.id]: [],
    },
    deck: shuffledDeck, // Keep track of the remaining cards in the deck
  };

  // Deal cards from the same deck
  gameState.playerHands[player1.id] = dealCardsFromDeck(gameState.deck, 5);
  gameState.playerHands[player2.id] = dealCardsFromDeck(gameState.deck, 5);

  activeGames.set(gameId, gameState);
  return gameState;
}

// Utility function to deal cards
function dealCards(count) {
  const shuffledCards = [...cardList].sort(() => Math.random() - 0.5);
  return shuffledCards.slice(0, count).map(card => ({ 
    ...card, 
    uniqueId: Date.now() + Math.random() // Add a unique ID to each card
  }));
}

// Utility function to deal cards from a deck
function dealCardsFromDeck(deck, count) {
  return deck.splice(0, count).map(card => ({
    ...card,
    uniqueId: Date.now() + Math.random() // Add a unique ID to each card
  }));
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

      // Notify Player 1
      io.to(player1.id).emit("match_found", {
        opponent: player2.username,
        gameId: game.id,
        isFirstPlayer: true,
        initialHand: game.playerHands[player1.id], // Player 1's unique hand
      });

      // Notify Player 2
      io.to(player2.id).emit("match_found", {
        opponent: player1.username,
        gameId: game.id,
        isFirstPlayer: false,
        initialHand: game.playerHands[player2.id], // Player 2's unique hand
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

  socket.on("darkgoblin_effect", ({ gameId, playerId }) => {
    const game = activeGames.get(gameId);
    if (!game) return;

    const opponentId = game.players.find((p) => p.id !== playerId)?.id;
    if (!opponentId) return;

    const opponentHand = game.playerHands[opponentId];

    if (opponentHand.length === 0) {
      io.to(playerId).emit("darkgoblin_failure", {
        message: "Opponent has no cards to steal!",
      });
      return;
    }

    // Steal a random card
    const randomIndex = Math.floor(Math.random() * opponentHand.length);
    const stolenCard = opponentHand[randomIndex];

    // Update hands
    game.playerHands[playerId].push(stolenCard);
    game.playerHands[opponentId].splice(randomIndex, 1);

    // Notify players
    io.to(playerId).emit("darkgoblin_success", { stolenCard });

    // Sync hands
    io.to(playerId).emit("update_hands", {
      yourHand: game.playerHands[playerId],
      opponentHand: game.playerHands[opponentId],
    });

    io.to(opponentId).emit("update_hands", {
      yourHand: game.playerHands[opponentId],
      opponentHand: game.playerHands[playerId],
    });

    console.log(`Dark Goblin: ${playerId} stole ${stolenCard.name} from ${opponentId}`);
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