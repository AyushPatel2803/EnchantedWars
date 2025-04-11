const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(cors());

// Serve static files (e.g., images)
app.use("/assets", express.static(path.join(__dirname, "assets")));

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

const cardList = [
  { id: 1, name: "Bear Cleaver", type: "hero", effect: "bearCleaver" },
  { id: 2, name: "Bullseye", type: "hero", effect: "bullseye" },
  { id: 3, name: "Cyborg 20xx", type: "hero", effect: "cyborg20" },
  { id: 4, name: "Dark Goblin", type: "hero", effect: "darkgoblin" },
  { id: 5, name: "Gargoyle", type: "hero", effect: "gargoyle" },
  { id: 6, name: "Ghastly Ghoul", type: "hero", effect: "ghastlyghoul" },
  { id: 7, name: "Gorgon", type: "hero", effect: "gorgon" },
  { id: 8, name: "Lost Soul", type: "hero", effect: "lostsoul" },
  { id: 9, name: "Mighty Oak", type: "hero", effect: "mightyoak" },
  { id: 10, name: "Moose Druid", type: "hero", effect: "moosedruid" },
  { id: 11, name: "Ragnarok", type: "hero", effect: "ragnarok" },
  { id: 12, name: "Time Machine", type: "hero", effect: "timemachine" },
  { id: 13, name: "Titanium Giant", type: "hero", effect: "titaniumgiant" },
  { id: 14, name: "Vampire", type: "hero", effect: "vampire" },
  {id: 15, name: "White Mage", type: "hero", effect: "whitemage"},
  {id: 16, name: "Winged Serpent", type: "hero", effect: "wingedserpent"},
  // Add other cards here as needed
];

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
    playerHands: {
      [player1.id]: [],
      [player2.id]: []
    },
    playedCards: {
      [player1.id]: Array(5).fill(null),
      [player2.id]: Array(5).fill(null)
    },
    discardPile: []
  };
  activeGames.set(gameId, gameState);
  return gameState;
}

// Utility function to deal cards
function dealCards(count) {
  return Array(count).fill().map(() => {
    const card = { ...cardList[Math.floor(Math.random() * cardList.length)] };
    return {
      ...card,
      uniqueId: Date.now() + Math.random(), // Generate a unique ID
      image: `/assets/heros/${card.name.replace(/\s+/g, '')}.png`, // Dynamically generate image path
    };
  });
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

      // Deal 5 cards to each player
      game.playerHands[player1.id] = dealCards(5);
      game.playerHands[player2.id] = dealCards(5);

      // Add players to the game room
      socket.join(game.id);
      io.sockets.sockets.get(player1.id)?.join(game.id);

      // Notify both players with their initial hands
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

      // Also send opponent hand counts
      io.to(player1.id).emit("update_hands", {
        yourHand: game.playerHands[player1.id],
        opponentHand: game.playerHands[player2.id],
      });

      io.to(player2.id).emit("update_hands", {
        yourHand: game.playerHands[player2.id],
        opponentHand: game.playerHands[player1.id],
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

  socket.on("card_destroyed", ({ gameId, slotIndex }) => {
    const game = activeGames.get(gameId);
    if (game) {
      // Find the opponent's ID
      const opponentId = game.players.find(p => p.id !== socket.id)?.id;

      if (opponentId) {
        // Update the game state to remove the destroyed card
        game.playedCards[opponentId][slotIndex] = null;

        // Notify both players about the destroyed card
        io.to(gameId).emit("card_destroyed", { slotIndex, playerId: opponentId });
      }
    }
  });

  // Handle card stealing
  socket.on("card_stolen", ({ gameId, stolenCard }) => {
    const game = activeGames.get(gameId);
    if (!game) return;

    const thiefId = socket.id;
    const victimId = game.players.find(p => p.id !== thiefId)?.id;

    if (!victimId) return;

    // Verify the card exists in victim's hand
    const victimHand = game.playerHands[victimId];
    const cardIndex = victimHand.findIndex(c => c.uniqueId === stolenCard.uniqueId);
    
    if (cardIndex === -1) {
      console.log("Invalid card steal attempt - card not found");
      return;
    }

    // Update hands
    game.playerHands[thiefId].push(victimHand[cardIndex]);
    game.playerHands[victimId].splice(cardIndex, 1);

    // Debug logging
    console.log(`Thief hand: ${game.playerHands[thiefId].length} cards`);
    console.log(`Victim hand: ${game.playerHands[victimId].length} cards`);

    // Sync with clients
    io.to(thiefId).emit("update_hands", {
      yourHand: game.playerHands[thiefId],
      opponentHand: game.playerHands[victimId]
    });

    io.to(victimId).emit("update_hands", {
      yourHand: game.playerHands[victimId],
      opponentHand: game.playerHands[thiefId]
    });
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
      game.playerHands[socket.id] = game.playerHands[socket.id].filter(
        (c) => c.uniqueId !== card.uniqueId
      );
      game.playedCards[socket.id][slotIndex] = card;

      // Broadcast updates
      const opponentId = game.players.find((p) => p.id !== socket.id).id;

      io.to(socket.id).emit("update_hands", {
        yourHand: game.playerHands[socket.id],
        opponentHand: game.playerHands[opponentId],
      });

      io.to(opponentId).emit("update_hands", {
        yourHand: game.playerHands[opponentId],
        opponentHand: game.playerHands[socket.id],
      });

      // Notify all players in the game about the played card
      socket.to(gameId).emit("card_played", {
        slotIndex,
        card, // Now includes full card data with image
        playerId: socket.id,
      });

      console.log(`\n🃏 Card played in game ${gameId} by ${socket.id}`);
      console.log(`Slot: ${slotIndex}, Card: ${card.name}`);
    }
  });

  // Handle hero roll - Updated version
  socket.on("hero_rolled", ({ gameId, slotIndex, originalRoll, playerId }) => {
    const game = activeGames.get(gameId);
    if (!game) return;

    const opponentId = game.players.find((p) => p.id !== playerId)?.id;
    if (!opponentId) return;

    // Calculate facing slot index (assuming 5 slots: 0-4)
    const facingSlotIndex = 4 - slotIndex;
    const facingCard = game.playedCards[opponentId][facingSlotIndex];

    let modifiedRoll = originalRoll;
    let gorgonEffectApplied = false;
    let hydraEffectApplied = false;

    // Apply Gorgon effect if facing a Gorgon
    if (facingCard && facingCard.effect === "gorgon") {
      modifiedRoll = Math.max(2, originalRoll - 2); // Ensure minimum roll of 2 (1+1)
      gorgonEffectApplied = true;
      console.log(`Gorgon effect: Roll reduced from ${originalRoll} to ${modifiedRoll}`);
    }

    // Apply Hydra effect if card is Hydra
    const rolledCard = game.playedCards[playerId][slotIndex];
    if (rolledCard && rolledCard.effect === "hydra") {
      modifiedRoll = originalRoll + 1;
      hydraEffectApplied = true;
      console.log(`Hydra effect: Roll increased from ${originalRoll} to ${modifiedRoll}`);
    }

    // Notify both players
    io.to(gameId).emit("hero_roll_result", {
      slotIndex,
      playerId,
      originalRoll,
      modifiedRoll,
      gorgonEffectApplied,
      hydraEffectApplied,
      facingCardEffect: facingCard?.effect, // Send facing card effect for client-side handling
      cardEffect: rolledCard?.effect // Send the rolled card's effect
    });

    // Process card effects based on the modified roll
    if (rolledCard) {
      processCardEffect(game, playerId, opponentId, rolledCard, modifiedRoll, slotIndex);
    }
  });

  // Helper function to process card effects
  function processCardEffect(game, playerId, opponentId, card, modifiedRoll, slotIndex) {
    switch (card.effect) {
      case "bearCleaver":
        if (modifiedRoll >= 8) {
          // Draw 2 cards
          const newCards = dealCards(2);
          game.playerHands[playerId].push(...newCards);
          io.to(playerId).emit("update_hands", {
            yourHand: game.playerHands[playerId],
            opponentHand: game.playerHands[opponentId],
          });
          console.log(`Bear Cleaver effect: Player ${playerId} drew 2 cards.`);
        }
        break;

      case "gorgon":
        // Gorgon effect is handled during roll calculation
        break;

      case "darkgoblin":
        if (modifiedRoll >= 6) {
          // Steal a random card from the opponent's hand
          const opponentHand = game.playerHands[opponentId];
          if (opponentHand.length > 0) {
            const randomIndex = Math.floor(Math.random() * opponentHand.length);
            const stolenCard = opponentHand.splice(randomIndex, 1)[0];
            game.playerHands[playerId].push(stolenCard);

            // Notify both players
            io.to(playerId).emit("update_hands", {
              yourHand: game.playerHands[playerId],
              opponentHand: game.playerHands[opponentId],
            });
            io.to(opponentId).emit("update_hands", {
              yourHand: game.playerHands[opponentId],
              opponentHand: game.playerHands[playerId],
            });
            console.log(`Dark Goblin effect: Player ${playerId} stole a card from ${opponentId}.`);
          }
        }
        break;

      case "gargoyle":
        if (modifiedRoll >= 9) {
          // Trigger Gargoyle effect
          const opponentHand = game.playerHands[opponentId];
          const discardedHeroes = opponentHand.filter((card) => card.type === "hero");
          game.playerHands[opponentId] = opponentHand.filter((card) => card.type !== "hero");

          // Notify players
          io.to(opponentId).emit("gargoyle_discard", {
            discardedHeroes,
            newHand: game.playerHands[opponentId],
          });
          io.to(playerId).emit("opponent_discarded_heroes", {
            count: discardedHeroes.length,
          });
          console.log(`Gargoyle effect: ${discardedHeroes.length} hero(es) discarded from ${opponentId}'s hand.`);
        }
        break;

      case "ghastlyghoul":
        if (modifiedRoll >= 10) {
          // Steal a hero card from the opponent's hand
          const opponentHeroCards = game.playerHands[opponentId].filter((card) => card.type === "hero");
          if (opponentHeroCards.length > 0) {
            const randomIndex = Math.floor(Math.random() * opponentHeroCards.length);
            const stolenCard = opponentHeroCards[randomIndex];
            game.playerHands[opponentId] = game.playerHands[opponentId].filter(
              (card) => card.uniqueId !== stolenCard.uniqueId
            );
            game.playerHands[playerId].push(stolenCard);

            // Notify players
            io.to(playerId).emit("ghastlyghoul_success", {
              stolenCard,
              message: `You stole ${stolenCard.name} from your opponent!`,
            });
            io.to(opponentId).emit("ghastlyghoul_stolen", {
              stolenCard,
              message: `Your ${stolenCard.name} was stolen!`,
            });
            console.log(`Ghastly Ghoul effect: Player ${playerId} stole ${stolenCard.name} from ${opponentId}.`);
          } else {
            io.to(playerId).emit("ghastlyghoul_failure", {
              message: "Opponent has no hero cards to steal.",
            });
            console.log("Ghastly Ghoul effect failed: No hero cards to steal.");
          }
        }
        break;

      case "moosedruid":
        if (modifiedRoll >= 8) {
          // Show opponent's heroes to destroy
          const opponentHeroCards = game.playedCards[opponentId]
            .map((card, index) => (card?.type === "hero" ? { ...card, index } : null))
            .filter(card => card !== null);
          
          if (opponentHeroCards.length > 0) {
            io.to(playerId).emit("moosedruid_select_hero", {
              opponentHeroCards
            });
            console.log(`Moose Druid effect: Player ${playerId} can select an opponent hero to destroy.`);
          } else {
            io.to(playerId).emit("moosedruid_no_heroes", {
              message: "No opponent heroes to destroy!"
            });
          }
        } else if (modifiedRoll <= 4) {
          // Destroy Moose Druid
          game.playedCards[playerId][slotIndex] = null;
          io.to(game.id).emit("card_destroyed", {
            slotIndex,
            playerId
          });
          console.log(`Moose Druid effect: Player ${playerId}'s Moose Druid was destroyed due to low roll.`);
        } else {
          io.to(playerId).emit("moosedruid_no_effect", {
            message: "Moose Druid: No effect triggered (rolled between 5 and 7)"
          });
        }
        break;

      default:
        console.log(`No effect for card: ${card.name}`);
        break;
    }
  }

  // Handle Moose Druid hero selection
  socket.on("moosedruid_destroy_hero", ({ gameId, slotIndex }) => {
    const game = activeGames.get(gameId);
    if (!game) return;

    const playerId = socket.id;
    const opponentId = game.players.find(p => p.id !== playerId)?.id;
    
    if (!opponentId) return;

    // Destroy the selected hero
    game.playedCards[opponentId][slotIndex] = null;
    
    // Notify both players
    io.to(gameId).emit("card_destroyed", {
      slotIndex,
      playerId: opponentId
    });
    
    console.log(`Moose Druid effect: Player ${playerId} destroyed opponent's hero in slot ${slotIndex}`);
  });

  // Handle Gargoyle effect
  socket.on("gargoyle_effect", ({ gameId }) => {
    const game = activeGames.get(gameId);
    if (!game) return;

    const senderId = socket.id;
    const opponentId = game.players.find((p) => p.id !== senderId)?.id;

    if (!opponentId) return;

    // Filter out hero cards from opponent's hand
    const opponentHand = game.playerHands[opponentId];
    const discardedHeroes = opponentHand.filter((card) => card.type === "hero");
    const remainingCards = opponentHand.filter((card) => card.type !== "hero");

    if (discardedHeroes.length > 0) {
      // Update opponent's hand
      game.playerHands[opponentId] = remainingCards;

      // Add discarded cards to discard pile
      game.discardPile = [...game.discardPile, ...discardedHeroes];

      // Notify players
      io.to(opponentId).emit("gargoyle_discard", {
        discardedHeroes: discardedHeroes,
        newHand: remainingCards,
      });

      io.to(senderId).emit("opponent_discarded_heroes", {
        count: discardedHeroes.length,
      });

      console.log(
        `Gargoyle effect: ${discardedHeroes.length} hero(es) discarded from ${opponentId}'s hand`
      );
    } else {
      io.to(senderId).emit("no_heroes_to_discard");
    }

    // Sync hands
    io.to(gameId).emit("update_hands", {
      yourHand: game.playerHands[senderId],
      opponentHand: game.playerHands[opponentId],
    });
  });

  // Handle Ghastly Ghoul effect
  socket.on("ghastlyghoul_effect", ({ gameId, rollValue, stolenCard }) => {
    const game = activeGames.get(gameId);
    if (!game) return;

    const currentPlayerId = socket.id;
    const opponentId = game.players.find((p) => p.id !== currentPlayerId)?.id;

    if (!opponentId) return;

    console.log(`\n👻 Ghastly Ghoul effect triggered by ${currentPlayerId}`);
    console.log(`Rolled: ${rollValue}`);

    if (rollValue >= 10 && stolenCard) {
      // Verify the card exists in opponent's hand
      const opponentHand = game.playerHands[opponentId];
      const cardIndex = opponentHand.findIndex((c) => c.uniqueId === stolenCard.uniqueId);

      if (cardIndex === -1) {
        console.log("Invalid card steal attempt - card not found");
        io.to(currentPlayerId).emit("ghastlyghoul_failure", {
          message: "Card no longer available to steal",
        });
        return;
      }

      // Update hands
      game.playerHands[currentPlayerId].push(opponentHand[cardIndex]);
      game.playerHands[opponentId].splice(cardIndex, 1);

      console.log(`Stolen card: ${stolenCard.name}`);

      // Notify players
      io.to(currentPlayerId).emit("ghastlyghoul_success", {
        stolenCard: stolenCard,
        message: `You stole ${stolenCard.name} from your opponent!`,
      });

      io.to(opponentId).emit("ghastlyghoul_stolen", {
        stolenCard: stolenCard,
        message: `Your ${stolenCard.name} was stolen!`,
      });

      // Sync hands
      io.to(currentPlayerId).emit("update_hands", {
        yourHand: game.playerHands[currentPlayerId],
        opponentHand: game.playerHands[opponentId],
      });

      io.to(opponentId).emit("update_hands", {
        yourHand: game.playerHands[opponentId],
        opponentHand: game.playerHands[currentPlayerId],
      });
    } else {
      const message =
        rollValue < 10
          ? "Ghastly Ghoul effect failed (rolled less than 10)"
          : "Opponent has no hero cards to steal";

      io.to(currentPlayerId).emit("ghastlyghoul_failure", { message });
      console.log(message);
    }
  });

  // Handle Bullseye effect
  socket.on("bullseye_effect", ({ gameId, selectedCardIndex, selectedCard }) => {
    const game = activeGames.get(gameId);
    if (!game) return;

    const playerId = socket.id;
    const opponentId = game.players.find(p => p.id !== playerId)?.id;
    
    if (!opponentId) return;

    // Verify the card exists in discard pile
    if (selectedCardIndex >= game.discardPile.length) {
      socket.emit("bullseye_failed", { message: "Invalid card selection" });
      return;
    }

    // Remove from discard pile
    game.discardPile.splice(selectedCardIndex, 1);
    
    // Add to player's hand
    game.playerHands[playerId].push(selectedCard);

    // Notify both players
    io.to(playerId).emit("bullseye_effect_processed", {
      yourHand: game.playerHands[playerId],
      opponentHand: game.playerHands[opponentId],
      discardPile: game.discardPile
    });

    io.to(opponentId).emit("update_hands", {
      yourHand: game.playerHands[opponentId],
      opponentHand: game.playerHands[playerId]
    });

    console.log(`Bullseye effect: Player ${playerId} added card to hand from discard`);
  });

  socket.on("request_discard_pile", ({ gameId }) => {
    const game = activeGames.get(gameId);
    if (game) {
      socket.emit("update_discard_pile", { discardPile: game.discardPile });
    }
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