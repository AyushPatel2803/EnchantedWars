import React, { useEffect, useState, useRef, useCallback } from "react";
import Timer from "./Timer";
import DrawCard from "./DrawCard";
import PartyLeaderSelection from "./PartyLeaderSelection";
import OpponentCardSlot from "./OpponentCardSlot";
import { io } from "socket.io-client";
import "./GameBoard.css";
import { useLocation } from "react-router-dom";

import Dice1 from "../assets/dice/dice1.png";
import Dice2 from "../assets/dice/dice2.png";
import Dice3 from "../assets/dice/dice3.png";
import Dice4 from "../assets/dice/dice4.png";
import Dice5 from "../assets/dice/dice5.png";
import Dice6 from "../assets/dice/dice6.png";

//heros
import BearCleaver from "../assets/heros/BearCleaver.png";
import Bullseye from "../assets/heros/Bullseye.png";
import Cyborg20xx from "../assets/heros/Cyborg20xx.png";
import DarkGoblin from "../assets/heros/DarkGoblin.png";
import Gargoyle from "../assets/heros/Gargoyle.png";
import GhastlyGhoul from "../assets/heros/GhastlyGhoul.png";
import Gorgon from "../assets/heros/Gorgon.png";
import Hydra from "../assets/heros/Hydra.png";
import LostSoul from "../assets/heros/LostSoul.png";
import MightyOak from "../assets/heros/MightyOak.png";
import MooseDruid from "../assets/heros/MooseDruid.png";
import Ragnarok from "../assets/heros/Ragnarok.png";
import TimeMachine from "../assets/heros/TimeMachine.png";
import TitaniumGiant from "../assets/heros/TitaniumGiant.png";
import Vampire from "../assets/heros/Vampire.png";
import WhiteMage from "../assets/heros/WhiteMage.png";
import WingedSerpent from "../assets/heros/WingedSerpent.png";

const diceImages = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];

const cardList = [
  { id: 1, name: "Bear Cleaver", image: BearCleaver, type: "hero", effect: "bearCleaver", affinity: "druid" },
  { id: 2, name: "Bullseye", image: Bullseye, type: "hero", effect: "bullseye", affinity: "consort" },
  { id: 3, name: "Cyborg 20xx", image: Cyborg20xx, type: "hero", effect: "cyborg20", affinity: "cyborg" },
  { id: 4, name: "Dark Goblin", image: DarkGoblin, type: "hero", effect: "darkgoblin", affinity: "dark" },
  { id: 5, name: "Gargoyle", image: Gargoyle, type: "hero", effect: "gargoyle", affinity: "dark" },
  { id: 6, name: "Ghastly Ghoul", image: GhastlyGhoul, type: "hero", effect: "ghastlyghoul", affinity: "undead" },
  { id: 7, name: "Gorgon", image: Gorgon, type: "hero", effect: "gorgon", affinity: "serpentine" },
  { id: 8, name: "Hydra", image: Hydra, type: "hero", effect: "hydra", affinity: "serpentine" },
  { id: 9, name: "Lost Soul", image: LostSoul, type: "hero", effect: "lostSoul", affinity: "undead" },
  { id: 10, name: "Mighty Oak", image: MightyOak, type: "hero", effect: "mightyOak", affinity: "druid" },
  { id: 11, name: "Moose Druid", image: MooseDruid, type: "hero", effect: "mooseDruid", affinity: "druid" },
  { id: 12, name: "Ragnarok", image: Ragnarok, type: "hero", effect: "ragnarok", affinity: "consort" },
  { id: 13, name: "Time Machine", image: TimeMachine, type: "hero", effect: "timeMachine", affinity: "cyborg" },
  { id: 14, name: "Titanium Giant", image: TitaniumGiant, type: "hero", effect: "titaniumGiant", affinity: "cyborg" },
  { id: 15, name: "Vampire", image: Vampire, type: "hero", effect: "vampire", affinity: "undead" },
  { id: 16, name: "White Mage", image: WhiteMage, type: "hero", effect: "whiteMage", affinity: "consort" },
  { id: 17, name: "Winged Serpent", image: WingedSerpent, type: "hero", effect: "wingedSerpent", affinity: "serpentine" },
];

const injectKeyframes = () => {
  const style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = `
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.1); }
      100% { transform: scale(1); }
    }
    @keyframes roll {
      0% { transform: rotate(0deg) scale(0.5); opacity: 0; }
      50% { transform: rotate(180deg) scale(1.2); opacity: 1; }
      100% { transform: rotate(360deg) scale(1); }
    }
  `;
  document.head.appendChild(style);
};

const HeroSelectionModal = ({ opponentCards, onSelect, onClose }) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: '#1E7149',
        padding: '20px',
        borderRadius: '10px',
        maxWidth: '80%',
        maxHeight: '80%',
        overflow: 'auto',
        border: '3px solid #4CAF50',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
      }}>
        <h3 style={{
          color: 'white',
          textAlign: 'center',
          marginBottom: '20px',
          textShadow: '1px 1px 3px rgba(0, 0, 0, 0.8)',
        }}>Select a Hero to Destroy</h3>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '15px',
          marginBottom: '20px',
        }}>
          {opponentCards.map((card, index) => (
            <div 
              key={index} 
              style={{
                cursor: 'pointer',
                transition: 'transform 0.2s',
                ':hover': {
                  transform: 'scale(1.05)',
                },
              }}
              onClick={() => onSelect(card.index)}
            >
              <img 
                src={card.image} 
                alt={card.name} 
                style={{
                  width: '120px',
                  height: '160px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  border: '2px solid #4CAF50',
                }}
              />
              <p style={{
                color: 'white',
                textAlign: 'center',
                marginTop: '5px',
                fontSize: '0.9rem',
              }}>{card.name}</p>
            </div>
          ))}
        </div>
        <button 
          style={{
            display: 'block',
            margin: '0 auto',
            padding: '8px 20px',
            backgroundColor: '#FF5722',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '1rem',
            ':hover': {
              backgroundColor: '#E64A19',
            },
          }}
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

const DiscardSelectionModal = ({ cards, cardImages, onSelect, onClose }) => {
  // Safeguard against undefined/null cards array
  if (!cards || cards.length === 0) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}>
        <div style={{
          backgroundColor: '#1E7149',
          padding: '20px',
          borderRadius: '10px',
          maxWidth: '80%',
          maxHeight: '80%',
          overflow: 'auto',
          border: '3px solid #4CAF50',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
        }}>
          <h3 style={{
            color: 'white',
            textAlign: 'center',
            marginBottom: '20px',
            textShadow: '1px 1px 3px rgba(0, 0, 0, 0.8)',
          }}>No cards available in discard pile</h3>
          <button 
            style={{
              display: 'block',
              margin: '0 auto',
              padding: '8px 20px',
              backgroundColor: '#FF5722',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: '#1E7149',
        padding: '20px',
        borderRadius: '10px',
        maxWidth: '80%',
        maxHeight: '80%',
        overflow: 'auto',
        border: '3px solid #4CAF50',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
      }}>
        <h3 style={{
          color: 'white',
          textAlign: 'center',
          marginBottom: '20px',
          textShadow: '1px 1px 3px rgba(0, 0, 0, 0.8)',
        }}>Select a Card to Add to Your Hand</h3>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '15px',
          marginBottom: '20px',
        }}>
          {cards.map((card, index) => (
            <div 
              key={index} 
              style={{
                cursor: 'pointer',
                transition: 'transform 0.2s',
              }}
              onClick={() => onSelect(index)}
            >
              <img 
                src={cardImages[card.name] || card.image || ''} // Use cardImages prop
                alt={card.name || 'Card'} 
                style={{
                  width: '120px',
                  height: '160px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  border: '2px solid #4CAF50',
                }}
                onError={(e) => {
                  e.target.src = ''; // Handle image loading errors
                }}
              />
              <p style={{
                color: 'white',
                textAlign: 'center',
                marginTop: '5px',
                fontSize: '0.9rem',
              }}>{card.name || 'Unknown Card'}</p>
            </div>
          ))}
        </div>
        <button 
          style={{
            display: 'block',
            margin: '0 auto',
            padding: '8px 20px',
            backgroundColor: '#FF5722',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '1rem',
          }}
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

const HandSelectionModal = ({ cards, onSelect, onClose }) => {
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: '#1E7149',
        padding: '20px',
        borderRadius: '10px',
        maxWidth: '80%',
        maxHeight: '80%',
        overflow: 'auto',
        border: '3px solid #4CAF50',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
      }}>
        <h3 style={{
          color: 'white',
          textAlign: 'center',
          marginBottom: '20px',
          textShadow: '1px 1px 3px rgba(0, 0, 0, 0.8)',
        }}>Select 2 Cards to Discard</h3>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '15px',
          marginBottom: '20px',
        }}>
          {cards.map((card, index) => (
            <div 
              key={index} 
              style={{
                cursor: 'pointer',
                transition: 'transform 0.2s',
                ':hover': {
                  transform: 'scale(1.05)',
                },
              }}
              onClick={() => onSelect(index)}
            >
              <img 
                src={card.image} 
                alt={card.name} 
                style={{
                  width: '120px',
                  height: '160px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  border: '2px solid #4CAF50',
                }}
              />
              <p style={{
                color: 'white',
                textAlign: 'center',
                marginTop: '5px',
                fontSize: '0.9rem',
              }}>{card.name}</p>
            </div>
          ))}
        </div>
        <button 
          style={{
            display: 'block',
            margin: '0 auto',
            padding: '8px 20px',
            backgroundColor: '#FF5722',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '1rem',
            ':hover': {
              backgroundColor: '#E64A19',
            },
          }}
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

const GameBoard = () => {
  const location = useLocation();
  const { playerName } = location.state || { playerName: "Player" };

  const [playerHand, setPlayerHand] = useState([]);
  const [opponentPlayedCards, setOpponentPlayedCards] = useState(Array(5).fill(null));
  const [playedCards, setPlayedCards] = useState(Array(5).fill(null));
  const [discardPile, setDiscardPile] = useState([]);
  const [selectedLeader, setSelectedLeader] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [playerId, setPlayerId] = useState(null);
  const [currentPlayerId, setCurrentPlayerId] = useState(null);
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [turnMessage, setTurnMessage] = useState("");
  const [gameId, setGameId] = useState(null);
  const [opponentName, setOpponentName] = useState("");
  const [actionPoints, setActionPoints] = useState(3);
  const [hoveredCardIndex, setHoveredCardIndex] = useState(null);
  const [isRolling, setIsRolling] = useState(false);
  const [diceResults, setDiceResults] = useState([null, null]);
  const [showHeroSelection, setShowHeroSelection] = useState(false);
  const [showDiscardSelection, setShowDiscardSelection] = useState(false);
  const [showHandSelection, setShowHandSelection] = useState(false);
  const [discardSelectionCards, setDiscardSelectionCards] = useState([]);
  const [selectedCardsToDiscard, setSelectedCardsToDiscard] = useState([]);
  const [opponentHand, setOpponentHand] = useState([]);
  const [rollModifiers, setRollModifiers] = useState(Array(5).fill(0));
  const [ragnarokBonusActive, setRagnarokBonusActive] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    injectKeyframes(); 
  }, []);

  useEffect(() => {
    socketRef.current = io("http://localhost:3000", {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current.on("connect", () => {
      console.log(`Connected to server with ID: ${socketRef.current.id}`);
      setPlayerId(socketRef.current.id);
      socketRef.current.emit("find_match", playerName);
    });

    socketRef.current.on("match_found", ({ opponent, gameId, isFirstPlayer, initialHand }) => {
      setGameId(gameId);
      setOpponentName(opponent);
      setIsMyTurn(isFirstPlayer);
      setTurnMessage(isFirstPlayer ? "Your turn!" : "Opponent's turn");
      setTimeLeft(60);
      setPlayerHand(initialHand);
      setActionPoints(3);
    });

    socketRef.current.on("turn_update", ({ currentPlayerId }) => {
      setCurrentPlayerId(currentPlayerId);
      setIsMyTurn(currentPlayerId === socketRef.current.id);
      setTurnMessage(currentPlayerId === socketRef.current.id ? "Your turn!" : "Opponent's turn");
      setTimeLeft(60);
      setActionPoints(3);
    });

    socketRef.current.on("card_played", ({ slotIndex, card }) => {
      setOpponentPlayedCards((prev) => {
        const newPlayed = [...prev];
        newPlayed[slotIndex] = card;
        return newPlayed;
      });
    });

    socketRef.current.on("update_hands", ({ yourHand, opponentHand }) => {
      if (!Array.isArray(yourHand) || !Array.isArray(opponentHand)) {
        console.error("Invalid hand data received:", { yourHand, opponentHand });
        return;
      }
      setPlayerHand(yourHand);
      setOpponentHand(opponentHand || []);
    });

    socketRef.current.on("card_stolen", ({ stolenCard }) => {
      setPlayerHand((prev) => [...prev, stolenCard]);
      setOpponentHand((prev) => prev.filter((c) => c.uniqueId !== stolenCard.uniqueId));
    });

    socketRef.current.on("card_destroyed", ({ slotIndex }) => {
      setOpponentPlayedCards((prev) => {
        const newPlayed = [...prev];
        newPlayed[slotIndex] = null;
        return newPlayed;
      });
    });

    socketRef.current.on("opponent_disconnected", ({ message }) => {
      alert(message);
    });

    socketRef.current.on("gargoyle_discard", ({ discardedHeroes, newHand }) => {
      alert(`Gargoyle effect! You had to discard ${discardedHeroes.length} hero card(s) from your hand.`);
      setPlayerHand(newHand);
    });

    socketRef.current.on("opponent_discarded_heroes", ({ count }) => {
      alert(`Gargoyle effect succeeded! Opponent discarded ${count} hero card(s).`);
    });

    socketRef.current.on("no_heroes_to_discard", () => {
      alert("Gargoyle effect triggered but opponent had no heroes in hand!");
    });

    socketRef.current.on("ghastlyghoul_success", ({ stolenCard, message }) => {
      alert(message);
      setPlayerHand((prev) => [...prev, stolenCard]);
    });

    socketRef.current.on("ghastlyghoul_stolen", ({ stolenCard, message }) => {
      alert(message);
      setPlayerHand((prev) => prev.filter((card) => card.uniqueId !== stolenCard.uniqueId));
    });

    socketRef.current.on("ghastlyghoul_failure", ({ message }) => {
      alert(message);
    });

    socketRef.current.on("hero_roll_result", ({ 
      slotIndex, 
      originalRoll, 
      modifiedRoll, 
      gorgonEffectApplied,
      hydraEffectApplied,
      facingCardEffect,
      cardEffect
    }) => {
      const card = playedCards[slotIndex];

      if (gorgonEffectApplied) {
        alert(`Gorgon effect! Your roll was reduced from ${originalRoll} to ${modifiedRoll}`);
      }

      if (hydraEffectApplied) {
        alert(`Hydra effect! Your roll was increased from ${originalRoll} to ${modifiedRoll}`);
      }

      // Handle effects based on the modified roll
      if (card.effect === "darkgoblin" && modifiedRoll >= 6) {
        activateDarkGoblinEffect();
      } else if (card.effect === "bearCleaver" && modifiedRoll >= 8) {
        const newCards = [];
        for (let i = 0; i < 2; i++) {
          if (playerHand.length < 8) {
            const randomCard = { 
              ...cardList[Math.floor(Math.random() * cardList.length)], 
              uniqueId: Date.now() + Math.random()
            };
            newCards.push(randomCard);
          }
        }
        setPlayerHand(prev => [...prev, ...newCards]);
        alert("Bear Cleaver effect: Drew 2 cards!");
      } else if (card.effect === "cyborg20") {
        activateCyborgEffect(modifiedRoll);
      } else if (card.effect === "gargoyle" && modifiedRoll >= 9) {
        socketRef.current.emit("gargoyle_effect", { gameId });
        alert("Gargoyle effect triggered! Opponent must discard all heroes from their hand.");
      } else if (card.effect === "ghastlyghoul") {
        activateGhastlyGhoulEffect(modifiedRoll);
      } else if (card.effect === "lostSoul") {
        activateLostSoulEffect();
      } else if (card.effect === "mooseDruid") {
        activateMooseDruidEffect(slotIndex, modifiedRoll);
      } else if (card.effect === "ragnarok" && modifiedRoll >= 6) {
        setRagnarokBonusActive(true); // Activate Ragnarok bonus
        alert("Ragnarok effect activated! +3 to all Hero rolls this turn!");
      } else if (card.effect === "vampire" && modifiedRoll >= 6) {
        const newCards = [];
        for (let i = 0; i < 2; i++) {
          if (playerHand.length < 8) {
            const randomCard = { 
              ...cardList[Math.floor(Math.random() * cardList.length)], 
              uniqueId: Date.now() + Math.random()
            };
            newCards.push(randomCard);
          }
        }
        setPlayerHand(prev => [...prev, ...newCards]);
        alert("Vampire effect: Drew 2 cards!");
      }

      setIsRolling(false);
      setActionPoints(prev => prev - 1);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [playerName]);

  useEffect(() => {
    socketRef.current.on("card_destroyed", ({ slotIndex, playerId }) => {
      setOpponentPlayedCards(prev => {
        const updatedCards = [...prev];
        updatedCards[slotIndex] = null;
        return updatedCards;
      });
    });
  }, []);

  useEffect(() => {
    const newModifiers = [...rollModifiers];

    playedCards.forEach((card, slotIndex) => {
      if (card) {
        const facingSlotIndex = 4 - slotIndex; // Assuming 5 slots (0-4)
        const facingCard = opponentPlayedCards[facingSlotIndex];

        // Reset modifier
        newModifiers[slotIndex] = 0;

        // Apply Gorgon effect if facing a Gorgon
        if (facingCard?.effect === "gorgon") {
          newModifiers[slotIndex] = -2;
        }

        // Apply Hydra effect if Hydra is present
        if (card.effect === "hydra") {
          newModifiers[slotIndex] += 1;
        }
      } else {
        newModifiers[slotIndex] = 0;
      }
    });

    // Apply Mighty Oak effect
    playedCards.forEach((card, slotIndex) => {
      if (card?.effect === "mightyOak") {
        if (slotIndex > 0 && playedCards[slotIndex - 1]) {
          newModifiers[slotIndex - 1] += 2; // Left adjacent hero
        }
        if (slotIndex < playedCards.length - 1 && playedCards[slotIndex + 1]) {
          newModifiers[slotIndex + 1] += 2; // Right adjacent hero
        }
      }
    });

    setRollModifiers(newModifiers);
  }, [opponentPlayedCards, playedCards, rollModifiers]);

  const handleEndTurn = useCallback(() => {
    if (!isMyTurn) return;
    socketRef.current.emit("end_turn");
    setIsMyTurn(false);
    setTurnMessage("Waiting for opponent's turn...");
    setRagnarokBonusActive(false); // Reset Ragnarok bonus
  }, [isMyTurn]);

  useEffect(() => {
    let timer;
    if (isMyTurn && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => prev <= 1 ? (handleEndTurn(), 0) : prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isMyTurn, timeLeft, handleEndTurn]);

  useEffect(() => {
    socketRef.current.on("update_discard_pile", ({ discardPile }) => {
      setDiscardPile(discardPile);
    });

    return () => {
      socketRef.current.off("update_discard_pile");
    };
  }, []);

  useEffect(() => {
    socketRef.current.on("bullseye_effect_processed", ({ yourHand, opponentHand, discardPile }) => {
      setPlayerHand(yourHand);
      setOpponentHand(opponentHand);
      setDiscardPile(discardPile);
    });

    return () => {
      socketRef.current.off("bullseye_effect_processed");
    };
  }, []);

  const getRandomCards = () => {
    const shuffledCards = [...cardList].sort(() => Math.random() - 0.5);
    return shuffledCards.slice(0, 5).map(card => ({
      ...card,
      uniqueId: Date.now() + Math.random(), // Generate a unique ID
      image: cardImages[card.name] || card.image, // Ensure image is included or fallback to existing image
    }));
  };

  const checkActionPoints = () => {
    if (actionPoints <= 0) {
      alert("You have run out of action points!");
      handleEndTurn();
      return false;
    }
    return true;
  };

  const handleDrawCard = () => {
    if (!isMyTurn || !checkActionPoints() || playerHand.length >= 8) return;
    const randomCard = { 
      ...cardList[Math.floor(Math.random() * cardList.length)], 
      uniqueId: Date.now() + Math.random()
    };
    setPlayerHand(prev => [...prev, randomCard]);
    setActionPoints(prev => prev - 1);
  };

  const handleDrop = (e, slotIndex) => {
    if (!isMyTurn || !checkActionPoints()) return;
    e.preventDefault();
    const card = JSON.parse(e.dataTransfer.getData("card"));

    if (card.type === "spell") {
      alert("Spells cannot be played to the board! Activate them from your hand.");
      return;
    }

    const fullCardData = {
      ...card,
      image: cardImages[card.name] || card.image, // Ensure image is set or fallback to existing image
    };

    setPlayerHand(prev => prev.filter(c => c.uniqueId !== card.uniqueId));
    setPlayedCards(prev => {
      const newPlayed = [...prev];
      newPlayed[slotIndex] = fullCardData;
      return newPlayed;
    });

    socketRef.current.emit("card_played", {
      gameId,
      slotIndex,
      card: fullCardData,
    });

    setActionPoints(prev => prev - 1);
  };

  const discardAllCards = () => {
    if (!isMyTurn || !checkActionPoints()) return;
    setDiscardPile(prev => [
      ...prev, 
      ...playerHand.map(card => ({
        ...card,
        image: cardImages[card.name] || card.image // Ensure image is preserved or fallback to existing image
      }))
    ]);
    setPlayerHand(getRandomCards());
    setActionPoints(prev => prev - 2);
  };

  const rollDice = () => Math.floor(Math.random() * 6) + 1;

  const handleDestroyHero = (slotIndex) => {
    if (slotIndex === null || slotIndex === undefined) return;
    const newOpponentCards = [...opponentPlayedCards];
    const destroyedCard = newOpponentCards[slotIndex];
    newOpponentCards[slotIndex] = null;
    setOpponentPlayedCards(newOpponentCards);
    socketRef.current.emit("card_destroyed", { gameId, slotIndex });
    alert(`Destroyed opponent's ${destroyedCard?.name}!`);
    setShowHeroSelection(false);
  };

  const handleSelectFromDiscard = (selectedIndex) => {
    if (selectedIndex === null) return;
    const selectedCard = {
      ...discardSelectionCards[selectedIndex],
      image: cardImages[discardSelectionCards[selectedIndex].name] || discardSelectionCards[selectedIndex].image, // Ensure image is set or fallback
    };

    // Add the selected card to hand
    setPlayerHand((prev) => [...prev, selectedCard]);

    // Remove the card from discard pile
    setDiscardPile((prev) => prev.filter((card) => card.uniqueId !== selectedCard.uniqueId));

    // Check if the White Mage effect is active
    if (selectedCard.effect === "whiteMage") {
      alert(`White Mage effect activated! Added ${selectedCard.name} to your hand and healed all heroes by 2 health points.`);
      // Heal all heroes on the board by 2 health points
      setPlayedCards((prev) =>
        prev.map((card) =>
          card?.type === "hero" ? { ...card, health: (card.health || 0) + 2 } : card
        )
      );
    } else {
      alert(`Added ${selectedCard.name} to your hand!`);
    }


    // Notify server about the Bullseye effect
    socketRef.current.emit("bullseye_effect", {
      gameId,
      selectedCardIndex: selectedIndex,
      selectedCard: selectedCard, // Send the full card data
    });

    // Add the selected card to the player's hand
    setPlayerHand((prev) => [...prev, selectedCard]);

    // Remove the selected card from the discard pile
    setDiscardPile((prev) => prev.filter((card, index) => index !== selectedIndex));

    // Close the modal
    setShowDiscardSelection(false);

    // Deduct 1 action point
    setActionPoints((prev) => prev - 1);

    alert(`Added ${selectedCard.name} to your hand!`);
  };

  const handleSelectFromHand = (index) => {
    const card = playerHand[index];
    setSelectedCardsToDiscard(prev => 
      prev.some(c => c.uniqueId === card.uniqueId) 
        ? prev.filter(c => c.uniqueId !== card.uniqueId)
        : [...prev, card]
    );
  };

  const confirmDiscardSelection = () => {
    if (selectedCardsToDiscard.length !== 2) {
      alert("Please select exactly 2 cards to discard");
      return;
    }
    setPlayerHand(prev => prev.filter(card => 
      !selectedCardsToDiscard.some(selected => selected.uniqueId === card.uniqueId)
    ));
    setDiscardPile(prev => [...prev, ...selectedCardsToDiscard]);
    setShowHandSelection(false);
    setSelectedCardsToDiscard([]);
    alert("Discarded 2 cards from your hand!");
  };

  const activateBullseyeEffect = (slotIndex) => {
    if (!isMyTurn || !checkActionPoints()) return;

    // Skip dice rolling for Bullseye
    setDiceResults([null, null]);

    // Request the latest discard pile state from the server
    socketRef.current.emit("request_discard_pile", { gameId });

    // Listen for the updated discard pile from the server
    socketRef.current.once("update_discard_pile", ({ discardPile }) => {
      if (discardPile.length < 3) {
        alert("Not enough cards in the discard pile to activate Bullseye!");
        return;
      }

      // Show the top 3 cards from the updated discard pile
      const topCards = discardPile.slice(-3).reverse();
      setDiscardSelectionCards(topCards);
      setShowDiscardSelection(true);

      // Deduct 1 action point
      setActionPoints((prev) => prev - 1);
    });
  };

  const activateCyborgEffect = (total) => {
    if (total >= 10) {
      const opponentHeroCards = opponentPlayedCards
        .map((card, index) => (card?.type === "hero" ? { ...card, index } : null))
        .filter(card => card !== null);
      if (opponentHeroCards.length > 0) {
        setShowHeroSelection(true);
      } else {
        alert("No opponent heroes to destroy!");
      }
    } else if (total <= 4) {
      if (playerHand.length < 2) {
        alert("Not enough cards in hand to discard!");
        return;
      }
      setShowHandSelection(true);
    } else {
      alert("No effect triggered (rolled between 5 and 9)");
    }
  };

  const activateDarkGoblinEffect = () => {
    if (opponentHand.length === 0) {
      alert("Opponent has no cards to steal!");
      return;
    }
    const randomIndex = Math.floor(Math.random() * opponentHand.length);
    const stolenCard = opponentHand[randomIndex];
    setPlayerHand(prev => [...prev, stolenCard]);
    setOpponentHand(prev => prev.filter(card => card.uniqueId !== stolenCard.uniqueId));
    socketRef.current.emit("card_stolen", { gameId, stolenCard });
    alert(`Dark Goblin stole ${stolenCard.name} from opponent!`);
  };

  const activateGhastlyGhoulEffect = async (total) => {
    if (total >= 10) {
      const opponentHeroCards = opponentHand.filter(card => card.type === "hero");
      if (opponentHeroCards.length > 0) {
        const stolenCard = opponentHeroCards[Math.floor(Math.random() * opponentHeroCards.length)];
        setPlayerHand(prev => [...prev, stolenCard]);
        setOpponentHand(prev => prev.filter(card => card.uniqueId !== stolenCard.uniqueId));
        socketRef.current.emit("ghastlyghoul_effect", {
          gameId,
          rollValue: total,
          stolenCard,
        });
        alert(`Ghastly Ghoul effect! You stole ${stolenCard.name} from opponent's hand!`);
      } else {
        alert("Ghastly Ghoul effect triggered but opponent has no hero cards in hand!");
        socketRef.current.emit("ghastlyghoul_effect", {
          gameId,
          rollValue: total,
          stolenCard: null,
        });
      }
    } else {
      alert("Ghastly Ghoul effect failed (rolled less than 10)");
    }
  };

  const activateLostSoulEffect = () => {
    if (discardPile.length === 0) {
      alert("No cards in the discard pile to draw!");
      return;
    }

    // Skip dice rolling for Lost Soul
    setDiceResults([null, null]);

    // Draw the top card from the discard pile
    const drawnCard = discardPile[discardPile.length - 1];
    setDiscardPile((prev) => prev.slice(0, -1)); // Remove the card from the discard pile
    setPlayerHand((prev) => [...prev, drawnCard]); // Add the card to the player's hand

    alert(`Lost Soul effect activated! You drew ${drawnCard.name} from the discard pile.`);
  };

  const activateMooseDruidEffect = (slotIndex, total) => {
    if (total >= 8) {
      // Show opponent's heroes to destroy
      const opponentHeroCards = opponentPlayedCards
        .map((card, index) => (card?.type === "hero" ? { ...card, index } : null))
        .filter(card => card !== null);
      
      if (opponentHeroCards.length > 0) {
        setShowHeroSelection(true);
      } else {
        alert("No opponent heroes to destroy!");
      }
    } else if (total <= 4) {
      // Destroy Moose Druid
      setPlayedCards(prev => {
        const newPlayed = [...prev];
        newPlayed[slotIndex] = null;
        return newPlayed;
      });
      alert("Moose Druid was destroyed due to low roll!");
    } else {
      alert("Moose Druid effect: No effect triggered (rolled between 5 and 7)");
    }
  };

  const activateWhiteMageEffect = () => {
    // Find all hero cards in discard pile
    const heroCardsInDiscard = discardPile.filter(card => card.type === "hero");
    
    if (heroCardsInDiscard.length === 0) {
      alert("White Mage effect triggered but no hero cards in discard pile!");
      return;
    }

    // Show discard selection modal with only hero cards
    setDiscardSelectionCards(heroCardsInDiscard);
    setShowDiscardSelection(true);
  };

  const handleHeroRoll = async (slotIndex) => {
    if (!isMyTurn || isRolling || !checkActionPoints()) return;

    const card = playedCards[slotIndex];

    // Cards that don't need a dice roll
    const noRollCards = ["bullseye", "lostSoul"];
    if (noRollCards.includes(card.effect)) {
      // Directly trigger the effect without rolling
      if (card.effect === "bullseye") {
        activateBullseyeEffect(slotIndex);
      } else if (card.effect === "lostSoul") {
        activateLostSoulEffect();
      }
      setActionPoints((prev) => prev - 1);
      return;
    }

    // Rest of the dice rolling logic for other cards
    let modifier = rollModifiers[slotIndex] || 0;
    if (ragnarokBonusActive) modifier += 3;

    setIsRolling(true);
    setDiceResults([null, null]);

    // Animate dice roll
    for (let i = 0; i < 10; i++) {
      setDiceResults([rollDice(), rollDice()]);
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    const finalRoll1 = rollDice();
    const finalRoll2 = rollDice();
    const originalRoll = finalRoll1 + finalRoll2;
    const modifiedRoll = originalRoll + modifier;

    // Show the dice results with the modifier applied
    setDiceResults([finalRoll1, finalRoll2]);

    // Notify the server about the roll
    socketRef.current.emit("hero_rolled", {
      gameId,
      slotIndex,
      originalRoll,
      modifiedRoll,
      playerId: socketRef.current.id,
      gorgonEffectApplied: modifier < 0,
      hydraEffectApplied: modifier > 0,
      facingCardEffect: opponentPlayedCards[4 - slotIndex]?.effect,
      cardEffect: card.effect,
    });

    // Handle effects based on the modified roll
    if (card.effect === "darkgoblin" && modifiedRoll >= 6) {
      activateDarkGoblinEffect();
    } else if (card.effect === "bearCleaver" && modifiedRoll >= 8) {
      const newCards = [];
      for (let i = 0; i < 2; i++) {
        if (playerHand.length < 8) {
          const randomCard = {
            ...cardList[Math.floor(Math.random() * cardList.length)],
            uniqueId: Date.now() + Math.random(),
          };
          newCards.push(randomCard);
        }
      }
      setPlayerHand((prev) => [...prev, ...newCards]);
      alert("Bear Cleaver effect: Drew 2 cards!");
    } else if (card.effect === "cyborg20") {
      activateCyborgEffect(modifiedRoll);
    } else if (card.effect === "gargoyle" && modifiedRoll >= 9) {
      socketRef.current.emit("gargoyle_effect", { gameId });
      alert("Gargoyle effect triggered! Opponent must discard all heroes from their hand.");
    } else if (card.effect === "ghastlyghoul") {
      activateGhastlyGhoulEffect(modifiedRoll);
    } else if (card.effect === "mooseDruid") {
      activateMooseDruidEffect(slotIndex, modifiedRoll);
    } else if (card.effect === "ragnarok" && modifiedRoll >= 6) {
      setRagnarokBonusActive(true);
      alert("Ragnarok effect activated! +3 to all Hero rolls this turn!");
    } else if (card.effect === "vampire" && modifiedRoll >= 6) {
      const newCards = [];
      for (let i = 0; i < 2; i++) {
        if (playerHand.length < 8) {
          const randomCard = {
            ...cardList[Math.floor(Math.random() * cardList.length)],
            uniqueId: Date.now() + Math.random(),
          };
          newCards.push(randomCard);
        }
      }
      setPlayerHand((prev) => [...prev, ...newCards]);
      alert("Vampire effect: Drew 2 cards!");
    } else if (card.effect === "whiteMage" && modifiedRoll >= 7) {
      activateWhiteMageEffect();
      alert("White Mage effect activated! Healed all heroes by 2 health points.");
    } else if (card.effect === "wingedSerpent" && modifiedRoll >= 7) {
      const cardsToDraw = Math.max(0, 7 - playerHand.length);
      const newCards = [];
      for (let i = 0; i < cardsToDraw; i++) {
        const randomCard = {
          ...cardList[Math.floor(Math.random() * cardList.length)],
          uniqueId: Date.now() + Math.random(),
        };
        newCards.push(randomCard);
      }
      setPlayerHand((prev) => [...prev, ...newCards]);
      alert(`Winged Serpent effect: Drew ${cardsToDraw} card(s) to reach 7 cards in hand!`);
    }

    setIsRolling(false);
    setActionPoints((prev) => prev - 1);
  };

  const handleCastSpell = (card) => {
    if (!isMyTurn || !checkActionPoints()) return;
    alert(`Casting ${card.name}!`);
    setPlayerHand(prev => prev.filter(c => c.uniqueId !== card.uniqueId));
    setActionPoints(prev => prev - 1);
  };

  const cardImages = {
    "Bear Cleaver": BearCleaver,
    "Bullseye": Bullseye,
    "Cyborg 20xx": Cyborg20xx,
    "Dark Goblin": DarkGoblin,
    "Gargoyle": Gargoyle,
    "Ghastly Ghoul": GhastlyGhoul,
    "Gorgon": Gorgon,
    "Hydra": Hydra,
    "Lost Soul": LostSoul,
    "Mighty Oak": MightyOak,
    "Moose Druid": MooseDruid,
    "Ragnarok": Ragnarok,
    "Time Machine": TimeMachine,
    "Titanium Giant": TitaniumGiant,
    "Vampire": Vampire,
    "White Mage": WhiteMage,
    "Winged Serpent": WingedSerpent,
  };

  return (
    <div className="game-board-container">
      {!selectedLeader ? (
        <>
          <div style={styles.playerNameContainer}>
            <h2 style={styles.playerNameText}>{playerName}</h2>
          </div>
          <PartyLeaderSelection onLeaderSelect={setSelectedLeader} />
          <div style={styles.opponentHandIndicator}>
            <p style={styles.opponentHandText}>
              Opponent's Hand: {opponentHand.length} cards
            </p>
          </div>
        </>
      ) : (
        <div style={styles.gameBoard}>
          <div style={{ ...styles.playerNameContainer, ...(isMyTurn ? styles.activePlayer : {}) }}>
            <h2 style={styles.playerNameText}>{playerName}</h2>
          </div>
          <Timer timeLeft={timeLeft} />
          <div style={styles.drawCardContainer}>
            <DrawCard onDrawCard={handleDrawCard} disabled={!isMyTurn} />
          </div>
          <div style={styles.playerInfo}>
            {selectedLeader && (
              <div style={styles.leader}>
                <img src={selectedLeader.image} alt={selectedLeader.name} style={styles.leaderImage} />
              </div>
            )}
          </div>
          <div style={styles.opponentHandIndicator}>
            <p style={styles.opponentHandText}>
              Opponent's Hand: {opponentHand.length} cards
            </p>
          </div>
          <div style={styles.opponentPlayArea}>
            {opponentPlayedCards.map((card, index) => (
              <OpponentCardSlot key={index} card={card} />
            ))}
          </div>
          <div style={styles.playArea}>
            {playedCards.map((card, index) => (
              <div
                key={index}
                style={styles.slot}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, index)}
                onMouseEnter={() => card && setHoveredCardIndex(index)}
                onMouseLeave={() => setHoveredCardIndex(null)}
              >
                {card ? (
                  <div style={styles.card}>
                    <img src={card.image} alt={`Card ${card.id}`} style={styles.cardImage} />
                    {hoveredCardIndex === index && isMyTurn && (
                      <div style={styles.cardActionOverlay}>
                        {card.type === "hero" ? (
                          <>
                            <button
                              style={styles.actionButton}
                              onClick={() => {
                                if (card.effect === "bullseye") {
                                  activateBullseyeEffect(index);
                                } else if (card.effect === "lostSoul") {
                                  activateLostSoulEffect();
                                } else {
                                  handleHeroRoll(index);
                                }
                              }}
                              disabled={isRolling}
                            >
                              {card.effect === "bullseye"
                                ? "Use Effect"
                                : card.effect === "lostSoul"
                                ? "Draw Card"
                                : "Hero Roll"}
                            </button>
                            {(rollModifiers[index] !== 0 || ragnarokBonusActive) && (
                              <div style={styles.rollModifier}>
                                {rollModifiers[index]}
                                {ragnarokBonusActive && " +3"}
                              </div>
                            )}
                          </>
                        ) : (
                          <div style={styles.spellIndicator}>Spell</div>
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={styles.emptySlot}>Slot {index + 1}</div>
                )}
              </div>
            ))}
          </div>
          <h2>Player Hand</h2>
          <div style={styles.hand}>
            {playerHand.map(card => (
              <div
                key={card.uniqueId}
                draggable={card.type !== "spell"}
                onDragStart={e => e.dataTransfer.setData("card", JSON.stringify(card))}
                style={styles.card}
              >
                <img 
                  src={cardImages[card.name]} 
                  alt={card.name} 
                  style={styles.cardImage} 
                />
                {card.type === "spell" && isMyTurn && (
                  <div style={styles.cardActionOverlay}>
                    <button 
                      style={styles.spellActionButton}
                      onClick={() => handleCastSpell(card)}
                    >
                      Cast Spell
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
          {(diceResults[0] !== null && diceResults[1] !== null && 
            !["bullseye", "lostSoul"].includes(playedCards[hoveredCardIndex]?.effect)) && (
            <div style={styles.diceContainer}>
              <div style={styles.dicePair}>
                <img 
                  src={diceImages[diceResults[0] - 1]} 
                  alt={`Dice ${diceResults[0]}`} 
                  style={styles.diceImage}
                  className={isRolling ? "rolling" : ""}
                />
                <img 
                  src={diceImages[diceResults[1] - 1]} 
                  alt={`Dice ${diceResults[1]}`} 
                  style={styles.diceImage}
                  className={isRolling ? "rolling" : ""}
                />
              </div>
            </div>
          )}
          <div style={styles.discardContainer}>
            <div style={styles.discardPile}>
              {discardPile.length > 0 ? (
                <div style={styles.card}>
                  <img
                    src={cardImages[discardPile[discardPile.length - 1]?.name] || discardPile[discardPile.length - 1]?.image} 
                    alt={discardPile[discardPile.length - 1]?.name || "Last Discarded Card"} 
                    style={styles.cardImage}
                  />
                </div>
              ) : (
                <div style={styles.emptySlot}>Discard Pile</div>
              )}
            </div>
            <button
              onClick={discardAllCards}
              style={!isMyTurn ? styles.disabledButton : styles.discardButton}
              disabled={!isMyTurn}
            >
              Discard
            </button>
          </div>
          <div style={styles.actionPointsContainer}>
            <h3 style={styles.actionPointsText}>Action Points: {actionPoints}</h3>
          </div>
          {isMyTurn && (
            <button onClick={handleEndTurn} style={styles.endTurnButton}>
              End Turn
            </button>
          )}

          {showHeroSelection && (
            <HeroSelectionModal
              opponentCards={opponentPlayedCards
                .map((card, index) => (card?.type === "hero" ? { ...card, index } : null))
                .filter(card => card !== null)}
              onSelect={handleDestroyHero}
              onClose={() => setShowHeroSelection(false)}
            />
          )}

          {showDiscardSelection && (
            <DiscardSelectionModal
              cards={discardSelectionCards}
              cardImages={cardImages}
              onSelect={handleSelectFromDiscard}
              onClose={() => setShowDiscardSelection(false)}
            />
          )}

          {showHandSelection && (
            <HandSelectionModal
              cards={playerHand}
              onSelect={handleSelectFromHand}
              onClose={() => {
                setShowHandSelection(false);
                setSelectedCardsToDiscard([]);
              }}
            />
          )}

          {showHandSelection && selectedCardsToDiscard.length === 2 && (
            <div style={{
              position: 'fixed',
              bottom: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 1001,
            }}>
              <button
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                }}
                onClick={confirmDiscardSelection}
              >
                Confirm Discard
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  gameBoard: {
    position: "relative",
    textAlign: "center",
    padding: "1vh",
    border: "3px solid black",
    background: "#162C24",
    height: "90vh",
    maxWidth: "1400px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
  },
  playerNameContainer: {
    position: "absolute",
    top: "1vh",
    left: "1vw",
    background: "linear-gradient(90deg, #4CAF50, #2E7D32)",
    color: "white",
    padding: "10px 20px",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)",
    border: "2px solid #1B5E20",
    zIndex: 10,
    fontFamily: "'Roboto', sans-serif",
    transition: "transform 0.3s ease-in-out",
  },
  activePlayer: {
    transform: "scale(1.2)",
    animation: "pulse 1s infinite",
  },
  playerNameText: {
    margin: 0,
    fontSize: "1.4rem",
    fontWeight: "bold",
    color: "white",
    textShadow: "1px 1px 4px rgba(0, 0, 0, 0.6)",
  },
  playerInfo: {
    position: "absolute",
    top: "1vh",
    right: "1vw",
    color: "#fff",
    textAlign: "right",
  },
  leaderImage: {
    width: "80px",
    height: "120px",
  },
  opponentPlayArea: {
    display: "flex",
    justifyContent: "center",
    gap: "0.5vw",
    margin: "1vh 0",
    flexWrap: "wrap",
    padding: "0 1vw",
  },
  hand: {
    display: "flex",
    justifyContent: "center",
    gap: "0.5vw",
    flexWrap: "wrap",
    margin: "1vh 0",
    padding: "0 1vw",
  },
  card: {
    width: "calc(120px + 1vw)",
    height: "calc(160px + 1vh)",
    border: "1px solid #888",
    borderRadius: "8px",
    overflow: "hidden",
    cursor: "grab",
    flexShrink: 0,
    maxWidth: "150px",
    maxHeight: "200px",
    position: "relative",
  },
  disabledButton: {
    padding: "0.5vh 1vw",
    fontSize: "0.8rem",
    cursor: "not-allowed",
    backgroundColor: "#ccc",
    color: "#666",
    border: "none",
    borderRadius: "4px",
    minWidth: "80px",
  },
  cardImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  playArea: {
    display: "flex",
    justifyContent: "center",
    gap: "0.5vw",
    margin: "1vh 0",
    flexWrap: "wrap",
    padding: "0 1vw",
  },
  slot: {
    width: "calc(120px + 1vw)",
    height: "calc(160px + 1vh)",
    border: "1px dashed #ccc",
    borderRadius: "8px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1E7149",
    maxWidth: "150px",
    maxHeight: "200px",
    position: "relative",
  },
  emptySlot: {
    color: "#888",
    fontSize: "0.75rem",
  },
  discardContainer: {
    position: "absolute",
    bottom: "1vh",
    right: "1vw",
    textAlign: "center",
  },
  discardPile: {
    marginBottom: "0.5vh",
  },
  discardButton: {
    padding: "0.5vh 1vw",
    fontSize: "0.8rem",
    cursor: "pointer",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    minWidth: "80px",
  },
  actionPointsContainer: {
    position: "absolute",
    bottom: "10px",
    left: "10px",
    backgroundColor: "#FF0000",
    color: "white",
    padding: "10px 20px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    fontSize: "16px",
    fontWeight: "bold",
    border: "2px solid #B22222",
  },
  actionPointsText: {
    margin: 0,
  },
  endTurnButton: {
    position: "absolute",
    bottom: "10px",
    left: "50%",
    transform: "translateX(-50%)",
    padding: "10px 20px",
    fontSize: "1rem",
    cursor: "pointer",
    backgroundColor: "#FF5722",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  },
  cardActionOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: "5px",
    display: "flex",
    justifyContent: "center",
  },
  actionButton: {
    padding: "5px 10px",
    fontSize: "0.8rem",
    cursor: "pointer",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "4px",
    whiteSpace: "nowrap",
  },
  spellActionButton: {
    padding: "5px 10px",
    fontSize: "0.8rem",
    cursor: "pointer",
    backgroundColor: "#800080",
    color: "white",
    border: "none",
    borderRadius: "4px",
    whiteSpace: "nowrap",
  },
  spellIndicator: {
    color: "white",
    fontSize: "0.8rem",
    padding: "5px",
  },
  diceContainer: {
    position: "absolute",
    top: "60%", // Move the dice lower
    left: "50%",
    transform: "translate(-50%, -50%)",
    zIndex: 100,
  },
  dicePair: {
    display: "flex",
    gap: "20px",
  },
  diceImage: {
    width: "60px", // Make the dice smaller
    height: "60px", // Make the dice smaller
  },
  opponentHandIndicator: {
    marginTop: "10px",
    padding: "5px 10px", // Reduced padding
    backgroundColor: "#1E7149",
    color: "white",
    borderRadius: "6px", // Smaller border radius
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)", // Reduced shadow
    textAlign: "center",
    fontSize: "0.9rem", // Smaller font size
    fontWeight: "bold",
    border: "1px solid #4CAF50", // Thinner border
    maxWidth: "200px", // Reduced width
    marginLeft: "auto",
    marginRight: "auto",
  },
  rollModifier: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: 'rgba(255, 0, 0, 0.8)',
    color: 'white',
    borderRadius: '50%',
    width: '24px',
    height: '24px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontWeight: 'bold',
    fontSize: '0.9rem',
    border: '2px solid white',
  },
};

export default GameBoard;