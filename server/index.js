const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());
app.use("/assets", express.static(path.join(__dirname, "assets")));

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
  { id: 21, name: "TheInventor", type: "Hero", affinity: "Cyborg", min: 0, max: 11 },
  { id: 22, name: "TitaniumGiant", type: "Hero", affinity: "Cyborg", min: 0, max: 8 },
  { id: 23, name: "MightyOak", type: "Hero", affinity: "Druid", min: 0, max: 0 },
  { id: 24, name: "BearCleaver", type: "Hero", affinity: "Druid", min: 0, max: 8 },
  { id: 25, name: "Arachnea", type: "Hero", affinity: "Dark", min: 6, max: 8 },
  { id: 26, name: "Gargoyle", type: "Hero", affinity: "Dark", min: 0, max: 9 },
  { id: 27, name: "Vampire", type: "Hero", affinity: "Undead", min: 0, max: 6 },
  { id: 28, name: "GhastlyGhoul", type: "Hero", affinity: "Undead", min: 0, max: 10 },
];

function createGame(player1, player2) {
  const gameId = Math.random().toString(36).substring(7);
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
    deck: shuffledDeck,
  };

  gameState.playerHands[player1.id] = dealCardsFromDeck(gameState.deck, 5);
  gameState.playerHands[player2.id] = dealCardsFromDeck(gameState.deck, 5);

  activeGames.set(gameId, gameState);
  return gameState;
}

function dealCardsFromDeck(deck, count) {
  return deck.splice(0, count).map(card => ({
    ...card,
    uniqueId: Date.now() + Math.random()
  }));
}

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

// Handle MooseDruid effect
io.on("connection", (socket) => {
  playerCount++;
  console.log("\n👤 New connection:", socket.id);
  console.log("📊 Total players connected:", playerCount);

  socket.on("find_match", (username) => {
    console.log(`\n🔍 ${username} (${socket.id}) is searching for a match...`);

    if (waitingPlayer) {
      const player1 = { id: waitingPlayer.id, username: waitingPlayer.username };
      const player2 = { id: socket.id, username: username };
      const game = createGame(player1, player2);

      socket.join(game.id);
      io.sockets.sockets.get(player1.id)?.join(game.id);

      io.to(player1.id).emit("match_found", {
        opponent: player2.username,
        gameId: game.id,
        isFirstPlayer: true,
        initialHand: game.playerHands[player1.id],
      });

      io.to(player2.id).emit("match_found", {
        opponent: player1.username,
        gameId: game.id,
        isFirstPlayer: false,
        initialHand: game.playerHands[player2.id],
      });

      io.to(game.id).emit("turn_update", {
        currentPlayerId: player1.id,
        gameId: game.id,
      });

      waitingPlayer = null;
      logGameState(game.id);
    } else {
      waitingPlayer = { id: socket.id, username: username };
      console.log(`⏳ ${username} added to waiting queue`);
    }
  });

  // Handle MooseDruid effect
  socket.on("moosedruid_effect", ({ gameId, playerId, slotIndex }) => {
    const game = activeGames.get(gameId);
    if (!game) {
      console.error(`Game not found: ${gameId}`);
      return;
    }

    const opponentId = game.players.find((p) => p.id !== playerId)?.id;
    if (!opponentId) {
      console.error(`Opponent not found for player ${playerId} in game ${gameId}`);
      return;
    }

    let targetPlayerId, targetSlotIndex;

    if (slotIndex !== undefined) {
      // Destroy an opponent's hero card
      targetPlayerId = opponentId;
      targetSlotIndex = slotIndex;
    } else {
      // Destroy MooseDruid itself
      targetPlayerId = playerId;
      targetSlotIndex = game.playedCards[playerId].findIndex(
        (card) => card?.id === 1 // MooseDruid ID
      );

      if (targetSlotIndex === -1) {
        console.error("MooseDruid not found in player's played cards.");
        return;
      }
    }

    // Update game state
    game.playedCards[targetPlayerId][targetSlotIndex] = null;

    // Notify both players
    io.to(gameId).emit("card_destroyed", {
      slotIndex: targetSlotIndex,
      playerId: targetPlayerId,
      message:
        slotIndex !== undefined
          ? "MooseDruid destroyed an opponent's hero card!"
          : "MooseDruid was destroyed!",
    });

    console.log(
      `MooseDruid effect: Destroyed card in slot ${targetSlotIndex} for player ${targetPlayerId}`
    );
  });

  socket.on("end_turn", () => {
    for (let [gameId, game] of activeGames) {
      const playerIndex = game.players.findIndex(p => p.id === socket.id);
      
      if (playerIndex !== -1 && playerIndex === game.currentPlayerIndex) {
        game.currentPlayerIndex = (playerIndex + 1) % 2;
        const nextPlayer = game.players[game.currentPlayerIndex];
        
        console.log(`\n🔄 Turn ended in game ${gameId}`);
        console.log(`Next player: ${nextPlayer.username}`);

        game.turnTimeLeft = 60;

        io.to(gameId).emit("turn_update", {
          currentPlayerId: nextPlayer.id,
          gameId: gameId
        });

        logGameState(gameId);
        break;
      }
    }
  });

  socket.on("card_played", ({ gameId, slotIndex, card }) => {
    const game = activeGames.get(gameId);
    if (game && game.players[game.currentPlayerIndex].id === socket.id) {
      game.playedCards[socket.id][slotIndex] = card;
      
      socket.to(gameId).emit("card_played", { 
        slotIndex, 
        card,
        playerId: socket.id 
      });
      
      console.log(`\n🃏 Card played in game ${gameId} by ${socket.id}`);
      console.log(`Slot: ${slotIndex}, Card: ${card.name}`);
    }
  });

  socket.on("destroy_card", ({ gameId, playerId, slotIndex }) => {
    const game = activeGames.get(gameId);
    if (!game) {
      console.error(`Game not found: ${gameId}`);
      return;
    }

    const opponentId = game.players.find(p => p.id !== playerId).id;
    game.playedCards[opponentId][slotIndex] = null;

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

    // Steal a random card from the opponent's hand
    const randomIndex = Math.floor(Math.random() * opponentHand.length);
    const stolenCard = opponentHand[randomIndex];
    
    // Update game state
    game.playerHands[opponentId] = opponentHand.filter((_, i) => i !== randomIndex);
    game.playerHands[playerId].push(stolenCard);

    // Notify both players
    io.to(playerId).emit("darkgoblin_success", { stolenCard });
    io.to(opponentId).emit("update_hands", {
      yourHand: game.playerHands[opponentId],
      opponentHand: game.playerHands[playerId],
    });

    console.log(`Dark Goblin effect: Player ${playerId} stole ${stolenCard.name} from ${opponentId}`);
  });

  socket.on("ghastlyghoul_effect", ({ gameId, playerId }) => {
    const game = activeGames.get(gameId);
    if (!game) return;

    const opponentId = game.players.find((p) => p.id !== playerId)?.id;
    if (!opponentId) return;

    const opponentHand = game.playerHands[opponentId];

    if (opponentHand.length === 0) {
      io.to(playerId).emit("ghastlyghoul_failure", {
        message: "Opponent has no cards to steal!",
      });
      return;
    }

    // Steal a random card from the opponent's hand
    const randomIndex = Math.floor(Math.random() * opponentHand.length);
    const stolenCard = opponentHand.splice(randomIndex, 1)[0];

    // Add the stolen card to the player's hand
    game.playerHands[playerId].push(stolenCard);

    // Notify both players
    io.to(playerId).emit("ghastlyghoul_success", { stolenCard });
    io.to(opponentId).emit("update_hands", {
      yourHand: game.playerHands[opponentId],
      opponentHand: game.playerHands[playerId],
    });

    console.log(`Ghastly Ghoul effect: Player ${playerId} stole ${stolenCard.name} from ${opponentId}`);
  });

  socket.on("player_won", ({ gameId, playerId }) => {
    const game = activeGames.get(gameId);
    if (!game) {
      console.error(`Game not found: ${gameId}`);
      return;
    }

    io.to(gameId).emit("game_over", { winner: playerId });
    console.log(`Player ${playerId} won the game in game ${gameId}`);
    activeGames.delete(gameId);
  });

  socket.on("reset_game", ({ gameId, playerId }) => {
    console.log(`Player ${playerId} triggered a game reset for game ${gameId}`);

    const game = activeGames.get(gameId);
    if (game) {
      game.currentPlayerIndex = 0;
      game.turnTimeLeft = 60;
      game.playedCards = {
        [game.players[0].id]: Array(5).fill(null),
        [game.players[1].id]: Array(5).fill(null),
      };
      
      // Reset the deck and deal new hands
      const newDeck = [...cardList].sort(() => Math.random() - 0.5);
      game.deck = newDeck;
      game.playerHands = {
        [game.players[0].id]: dealCardsFromDeck(newDeck, 5),
        [game.players[1].id]: dealCardsFromDeck(newDeck, 5),
      };

      io.to(game.id).emit("game_reset", {
        message: "The game has been reset by Time Machine!",
        initialHand: socket.id === game.players[0].id ? 
          game.playerHands[game.players[0].id] : 
          game.playerHands[game.players[1].id],
      });
      logGameState(gameId);
    }
  });

  socket.on("disconnect", () => {
    playerCount--;
    console.log("\n👋 Player disconnected:", socket.id);
    console.log("📊 Total players connected:", playerCount);

    if (waitingPlayer && waitingPlayer.id === socket.id) {
      console.log("❌ Removed from waiting queue:", waitingPlayer.username);
      waitingPlayer = null;
    }

    activeGames.forEach((game, gameId) => {
      const disconnectedPlayer = game.players.find(p => p.id === socket.id);
      if (disconnectedPlayer) {
        console.log(`\n🚫 Game ${gameId} ended - ${disconnectedPlayer.username} disconnected`);
        
        const otherPlayer = game.players.find(p => p.id !== socket.id);
        if (otherPlayer) {
          io.to(otherPlayer.id).emit("opponent_disconnected", {
            message: `${disconnectedPlayer.username} has disconnected`
          });
        }

        game.isActive = false;
        io.socketsLeave(gameId);
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