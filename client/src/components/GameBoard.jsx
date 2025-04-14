import React, { useEffect, useState, useRef, useCallback } from "react";
import Timer from "./Timer";
import DrawCard from "./DrawCard";
import PartyLeaderSelection from "./PartyLeaderSelection";
import OpponentCardSlot from "./OpponentCardSlot";
import { io } from "socket.io-client";
import "./GameBoard.css";
import { useLocation } from "react-router-dom";
import DiscardSelectionModal from './DiscardSelectionModal';

//heros
import MooseDruid from "../assets/heros/MooseDruid.png";
import DarkGoblin from "../assets/heros/DarkGoblin.png";
import LostSoul from "../assets/heros/LostSoul.png";
import Bullseye from "../assets/heros/Bullseye.png";
import Hydra from "../assets/heros/Hydra.png";
import Cyborg20xx from "../assets/heros/Cyborg20xx.png";
import BearCleaver from "../assets/heros/BearCleaver.png";
import Cerberus from "../assets/heros/Cerberus.png";
import Gargoyle from "../assets/heros/Gargoyle.png";
import Gorgon from "../assets/heros/Gorgon.png";
import MightyOak from "../assets/heros/MightyOak.png";
import Ragnarok from "../assets/heros/Ragnarok.png";
import TheInventor from "../assets/heros/TheInventor.png";
import TitaniumGiant from "../assets/heros/TitaniumGiant.png";
import Vampire from "../assets/heros/Vampire.png";
import WhiteMage from "../assets/heros/WhiteMage.png";
import WingedSerpent from "../assets/heros/WingedSerpent.png";

//items
import DruidMask from "../assets/items/DruidMask.png";
import DecoyDoll from "../assets/items/DecoyDoll.png";
import RoboMask from "../assets/items/RoboMask.png";
import SerpentMask from "../assets/items/SerpentMask.png";
import SpectreMask from "../assets/items/SpectreMask.png";

//spells
import CriticalBoost from "../assets/spell/CriticalBoost.png";
import MAD from "../assets/spell/MAD.png";
import Switcheroo from "../assets/spell/Switcheroo.png";

//dice
import dice1 from "../assets/dice/dice1.png";
import dice2 from "../assets/dice/dice2.png";
import dice3 from "../assets/dice/dice3.png";
import dice4 from "../assets/dice/dice4.png";
import dice5 from "../assets/dice/dice5.png";
import dice6 from "../assets/dice/dice6.png";

const cardImageMap = {
  MooseDruid: MooseDruid,
  DarkGoblin: DarkGoblin,
  DruidMask: DruidMask,
  DecoyDoll: DecoyDoll,
  CriticalBoost: CriticalBoost,
  LostSoul: LostSoul,
  Bullseye: Bullseye,
  Hydra: Hydra,
  Cyborg20xx: Cyborg20xx,
  BearCleaver: BearCleaver,
  Cerberus: Cerberus,
  Gargoyle: Gargoyle,
  Gorgon: Gorgon,
  MightyOak: MightyOak,
  Ragnarok: Ragnarok,
  TheInventor: TheInventor,
  TitaniumGiant: TitaniumGiant,
  Vampire: Vampire,
  WhiteMage: WhiteMage,
  WingedSerpent: WingedSerpent,
  RoboMask: RoboMask,
  SerpentMask: SerpentMask,
  SpectreMask: SpectreMask,
  MAD: MAD,
  Switcheroo: Switcheroo,
};

const cardList = [
  { id: 1, name: "MooseDruid", image: MooseDruid, type: "Hero", affinity: "Druid", min: 4, max: 8 },
  { id: 2, name: "DarkGoblin", image: DarkGoblin, type: "Hero", affinity: "Dark", min: 0, max: 6 },
  { id: 3, name: "DruidMask", image: DruidMask, type: "Item", affinity: "Druid" },
  { id: 4, name: "DecoyDoll", image: DecoyDoll, type: "Item", affinity: null },
  { id: 5, name: "CriticalBoost", image: CriticalBoost, type: "Spell", affinity: null },
  { id: 6, name: "LostSoul", image: LostSoul, type: "Hero", affinity: "Undead", min: 0, max: 6 },
  { id: 7, name: "Bullseye", image: Bullseye, type: "Hero", affinity: "Consort", min: 0, max: 4 },
  { id: 8, name: "Hydra", image: Hydra, type: "Hero", affinity: "Serpentine", min: 0, max: 0 },
  { id: 9, name: "Cyborg20xx", image: Cyborg20xx, type: "Hero", affinity: "Cyborg", min: 4, max: 10 },
  { id: 10, name: "Switcheroo", image: Switcheroo, type: "Spell" },
  { id: 11, name: "MAD", image: MAD, type: "Spell" },
  { id: 12, name: "RoboMask", image: RoboMask, type: "Item", affinity: "Cyborg" },
  { id: 13, name: "SpectreMask", image: SpectreMask, type: "Item", affinity: "Undead" },
  { id: 15, name: "SerpentMask", image: SerpentMask, type: "Item", affinity: "Serpentine" },
  { id: 17, name: "Gorgon", image: Gorgon, type: "Hero", affinity: "Serpentine", min: 0, max: 0 },
  { id: 18, name: "WingedSerpent", image: WingedSerpent, type: "Hero", affinity: "Serpentine", min: 0, max: 7 },
  { id: 19, name: "Ragnarok", image: Ragnarok, type: "Hero", affinity: "Consort", min: 0, max: 6 },
  { id: 20, name: "WhiteMage", image: WhiteMage, type: "Hero", affinity: "Consort", min: 0, max: 7 },
  { id: 21, name: "TheInventor", image: TheInventor, type: "Hero", affinity: "Cyborg", min: 0, max: 8 },
  { id: 22, name: "TitaniumGiant", image: TitaniumGiant, type: "Hero", affinity: "Cyborg", min: 0, max: 8 },
  { id: 23, name: "MightyOak", image: MightyOak, type: "Hero", affinity: "Druid", min: 0, max: 0 },
  { id: 24, name: "BearCleaver", image: BearCleaver, type: "Hero", affinity: "Druid", min: 0, max: 8 },
  { id: 25, name: "Cerberus", image: Cerberus, type: "Hero", affinity: "Dark", min: 6, max: 8 },
  { id: 26, name: "Gargoyle", image: Gargoyle, type: "Hero", affinity: "Dark", min: 0, max: 9 },
  { id: 27, name: "Vampire", image: Vampire, type: "Hero", affinity: "Undead", min: 0, max: 6 },
];

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
  const socketRef = useRef(null);
  const [diceRolls, setDiceRolls] = useState({ first: null, second: null, bonus: null });
  const [hoveredSpell, setHoveredSpell] = useState(null);
  const [isCriticalBoostPopupOpen, setIsCriticalBoostPopupOpen] = useState(false);
  const [selectedCardToDiscard, setSelectedCardToDiscard] = useState(null);
  const [criticalBoostCard, setCriticalBoostCard] = useState(null);
  const [isMADPopupOpen, setIsMADPopupOpen] = useState(false);
  const [selectedCardsToDiscard, setSelectedCardsToDiscard] = useState([]);
  const [isOpponentHeroPopupOpen, setIsOpponentHeroPopupOpen] = useState(false);
  const [selectedOpponentHero, setSelectedOpponentHero] = useState(null);
  const [madSpellCard, setMADSpellCard] = useState(null);
  const [heroItems, setHeroItems] = useState({});
  const [hoveredCardIndex, setHoveredCardIndex] = useState(null);
  const [opponentHand, setOpponentHand] = useState([]);
  const [isBullseyePopupOpen, setIsBullseyePopupOpen] = useState(false);
  const [discardPreviewCards, setDiscardPreviewCards] = useState([]);
  const [isWhiteMagePopupOpen, setIsWhiteMagePopupOpen] = useState(false);
  const [heroCardsInDiscard, setHeroCardsInDiscard] = useState([]);
  const [boostedHeroes, setBoostedHeroes] = useState([]);
  const [isRagnarokActivated, setIsRagnarokActivated] = useState(false);

  useEffect(() => {
    socketRef.current = io("http://localhost:3000", {
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

    socketRef.current.on("opponent_disconnected", ({ message }) => {
      alert(message);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [playerName]);

  useEffect(() => {
    socketRef.current.on("game_over", ({ winner }) => {
      if (winner === playerId) {
        alert("Congratulations! You win!");
      } else {
        alert(`You have been defeated by ${opponentName}. Better luck next time!`);
      }
    });

    return () => {
      socketRef.current.off("game_over");
    };
  }, [playerId, opponentName]);

  useEffect(() => {
    socketRef.current.on("card_destroyed", ({ slotIndex }) => {
      setOpponentPlayedCards((prev) => {
        const newPlayed = [...prev];
        newPlayed[slotIndex] = null;
        return newPlayed;
      });
    });

    return () => {
      socketRef.current.off("card_destroyed");
    };
  }, []);

  useEffect(() => {
    socketRef.current.on("darkgoblin_success", ({ stolenCard }) => {
      setPlayerHand((prev) => [...prev, stolenCard]);
      alert(`Dark Goblin stole ${stolenCard.name} from opponent!`);
    });

    socketRef.current.on("darkgoblin_failure", ({ message }) => {
      alert(message);
    });

    return () => {
      socketRef.current.off("darkgoblin_success");
      socketRef.current.off("darkgoblin_failure");
    };
  }, []);

  useEffect(() => {
    socketRef.current.on("update_hands", ({ yourHand, opponentHand }) => {
      console.log("Updating hands:");
      console.log("Your hand:", yourHand);
      console.log("Opponent's hand:", opponentHand);

      setPlayerHand(yourHand || []);
      setOpponentHand(opponentHand || []);
    });

    return () => {
      socketRef.current.off("update_hands");
    };
  }, []);

  useEffect(() => {
    socketRef.current.on("card_played", ({ slotIndex, card }) => {
      console.log("Received card played:", card);
      setOpponentPlayedCards((prev) => {
        const newPlayed = [...prev];
        newPlayed[slotIndex] = {
          ...card,
          image: cardImageMap[card.name], // Map the correct image using card name
        };
        return newPlayed;
      });
    });

    return () => {
      socketRef.current.off("card_played");
    };
  }, []);

  useEffect(() => {
    socketRef.current.on("game_reset", ({ message, initialHand }) => {
      alert(message);

      setPlayerHand(initialHand);
      setOpponentPlayedCards(Array(5).fill(null));
      setPlayedCards(Array(5).fill(null));
      setDiscardPile([]);
      setSelectedLeader(null);
      setTimeLeft(60);
      setActionPoints(3);
      setDiceRolls({ first: null, second: null, bonus: null });
      setHoveredSpell(null);
      setHoveredCardIndex(null);
      setTurnMessage("");
    });

    return () => {
      socketRef.current.off("game_reset");
    };
  }, []);

  useEffect(() => {
    socketRef.current.on("turn_update", ({ currentPlayerId }) => {
      setCurrentPlayerId(currentPlayerId);
      setIsMyTurn(currentPlayerId === socketRef.current.id);
      setTurnMessage(currentPlayerId === socketRef.current.id ? "Your turn!" : "Opponent's turn");
      setTimeLeft(60);
      setActionPoints(3);
    });

    return () => {
      socketRef.current.off("turn_update");
    };
  }, []);

  const handleEndTurn = useCallback(() => {
    if (!isMyTurn) return;

    // Reset all boosts to 0 at the end of the turn
    setPlayedCards((prev) =>
      prev.map((hero) =>
        hero && hero.type === "Hero"
          ? { ...hero, boost: 0 } // Reset boost to 0
          : hero
      )
    );

    setBoostedHeroes([]); // Clear the list of boosted heroes
    setIsRagnarokActivated(false); // Reset Ragnarok activation state

    socketRef.current.emit("end_turn");
    setIsMyTurn(false);
    setTurnMessage("Waiting for opponent's turn...");
  }, [isMyTurn]);

  useEffect(() => {
    let timer;
    if (isMyTurn && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleEndTurn();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isMyTurn, timeLeft, handleEndTurn]);

  const getRandomCards = (count = 5) => {
    const shuffledCards = [...cardList].sort(() => Math.random() - 0.5);
    return shuffledCards.slice(0, count).map(card => ({
      ...card,
      uniqueId: Date.now() + Math.random(),
      name: card.name || `Card${card.id}`,
      image: cardImageMap[card.name] || DecoyDoll,
    }));
  };

  const getRandomItemCards = (count = 3) => {
    const itemCards = cardList.filter(card => card.type === "Item");
    const shuffledItems = [...itemCards].sort(() => Math.random() - 0.5);
    return shuffledItems.slice(0, count).map(card => ({
      ...card,
      uniqueId: Date.now() + Math.random(),
      name: card.name || `Card${card.id}`,
      image: cardImageMap[card.name] || DecoyDoll,
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
    if (!isMyTurn) {
      alert("It's not your turn!");
      return;
    }
    if (!checkActionPoints()) return;
    if (playerHand.length >= 8) {
      alert("You cannot have more than 8 cards in your hand!");
      return;
    }
    const randomCard = { ...cardList[Math.floor(Math.random() * cardList.length)], uniqueId: Date.now() + Math.random() };
    setPlayerHand((prevHand) => [...prevHand, randomCard]);
    setActionPoints((prev) => prev - 1);
  };

  const handleDrop = (e, slotIndex) => {
    if (!isMyTurn) {
      alert("It's not your turn!");
      return;
    }
    if (!checkActionPoints()) return;

    e.preventDefault();
    const card = JSON.parse(e.dataTransfer.getData("card"));

    if (card.type === "Item") {
      if (!playedCards[slotIndex] || playedCards[slotIndex].type !== "Hero") {
        alert("You can only apply item cards to hero cards that have been played!");
        return;
      }

      setActionPoints((prev) => prev - 1);

      if (card.id === 13) {
        setPlayedCards((prev) => {
          const newPlayed = [...prev];
          newPlayed[slotIndex] = {
            ...newPlayed[slotIndex],
            affinity: "Undead",
          };
          return newPlayed;
        });
      }

      if (card.id === 15) {
        setPlayedCards((prev) => {
          const newPlayed = [...prev];
          newPlayed[slotIndex] = {
            ...newPlayed[slotIndex],
            affinity: "Serpentine",
          };
          return newPlayed;
        });
      }

      setHeroItems((prev) => ({
        ...prev,
        [slotIndex]: card,
      }));

      setPlayerHand((prev) => prev.filter((c) => c.uniqueId !== card.uniqueId));
      return;
    }

    if (card.type === "Hero") {
      const existingAffinities = playedCards
        .filter((c) => c !== null)
        .map((c) => c.affinity);

      if (existingAffinities.includes(card.affinity)) {
        alert(`You cannot play a card with the same affinity (${card.affinity}) as one already played!`);
        return;
      }

      setPlayerHand((prev) => prev.filter((c) => c.uniqueId !== card.uniqueId));
      setPlayedCards((prev) => {
        const newPlayed = [...prev];
        newPlayed[slotIndex] = {
          ...card,
          boost: isRagnarokActivated ? 3 : 0, // Apply Ragnarok boost if active
        };

        if (card.id === 23) {
          if (slotIndex > 0 && newPlayed[slotIndex - 1]?.type === "Hero") {
            newPlayed[slotIndex - 1].boost = 2;
          }
          if (slotIndex < newPlayed.length - 1 && newPlayed[slotIndex + 1]?.type === "Hero") {
            newPlayed[slotIndex + 1].boost = 2;
          }
        }

        if (card.id === 8) {
          newPlayed.forEach((playedCard, index) => {
            if (playedCard && index !== slotIndex && playedCard.type === "Hero") {
              newPlayed[index] = {
                ...playedCard,
                boost: (playedCard.boost || 0) + 1,
                hydraEffect: true,
              };
            }
          });
          alert("Hydra effect activated! All other heroes gain +1 boost to their rolls.");
        }

        if (checkWinCondition(newPlayed)) {
          alert("You win!");
          socketRef.current.emit("player_won", { gameId, playerId });
        }

        return newPlayed;
      });

      socketRef.current.emit("card_played", { gameId, slotIndex, card });
      setActionPoints((prev) => prev - 1);
    }
  };

  const discardAllCards = () => {
    if (!isMyTurn) {
      alert("It's not your turn!");
      return;
    }

    if (actionPoints < 2) {
      alert("You don't have enough action points to discard cards!");
      return;
    }

    if (!checkActionPoints()) return;

    setDiscardPile((prev) => [...prev, ...playerHand]);
    setPlayerHand(getRandomCards());
    setActionPoints((prev) => prev - 2);
  };

  const checkWinCondition = (playedCards) => {
    const affinities = playedCards
      .filter((card) => card !== null)
      .map((card) => card.affinity);

    const uniqueAffinities = new Set(affinities);
    return uniqueAffinities.size === 5;
  };

  const castSpell = (card) => {
    if (!isMyTurn) {
      alert("It's not your turn!");
      return;
    }

    if (card.id === 5) {
      setIsCriticalBoostPopupOpen(true);
      setCriticalBoostCard(card);
      return;
    }

    if (card.id === 11) {
      setIsMADPopupOpen(true);
      setMADSpellCard(card);
      return;
    }

    alert(`Casting spell: ${card.name}`);
    setHoveredSpell(null);
  };

  const confirmCriticalBoost = () => {
    if (!selectedCardToDiscard) {
      alert("Please select a card to discard!");
      return;
    }

    setPlayerHand((prevHand) =>
      prevHand.filter((card) => card.uniqueId !== selectedCardToDiscard.uniqueId)
    );
    setDiscardPile((prev) => [...prev, selectedCardToDiscard]);

    setPlayerHand((prevHand) =>
      prevHand.filter((card) => card.uniqueId !== criticalBoostCard.uniqueId)
    );
    setDiscardPile((prev) => [...prev, criticalBoostCard]);

    const newCards = getRandomCards(3);
    setPlayerHand((prevHand) => [...prevHand, ...newCards]);

    setIsCriticalBoostPopupOpen(false);
    setSelectedCardToDiscard(null);
    setCriticalBoostCard(null);
  };

  const confirmMADDiscard = () => {
    if (selectedCardsToDiscard.length !== 2) {
      alert("Please select exactly two cards to discard!");
      return;
    }
  
    setPlayerHand((prevHand) =>
      prevHand.filter((card) => !selectedCardsToDiscard.includes(card))
    );
    setDiscardPile((prev) => [...prev, ...selectedCardsToDiscard]);
  
    setDiscardPile((prev) => [...prev, madSpellCard]);
  
    setIsMADPopupOpen(false);
    setIsOpponentHeroPopupOpen(true);
  };

  const confirmMADDestroy = () => {
    if (selectedOpponentHero === null) {
      alert("Please select an opponent's hero card to destroy!");
      return;
    }

    socketRef.current.emit("destroy_card", {
      gameId,
      playerId,
      slotIndex: selectedOpponentHero,
    });

    setOpponentPlayedCards((prev) => {
      const newPlayed = [...prev];
      newPlayed[selectedOpponentHero] = null;
      return newPlayed;
    });

    setIsOpponentHeroPopupOpen(false);
    setSelectedOpponentHero(null);
  };

  const handleHeroRoll = (card, slotIndex) => {
    if (!isMyTurn) {
      alert("It's not your turn!");
      return;
    }
  
    if (actionPoints <= 0) {
      alert("You don't have enough action points to roll!");
      return;
    }
  
    // Deduct 1 action point for the roll
    setActionPoints((prev) => prev - 1);
  
    const boost = card.boost || 0; // Include any boosts
    const firstRoll = Math.floor(Math.random() * 6) + 1;
    const secondRoll = Math.floor(Math.random() * 6) + 1;
    const totalRoll = firstRoll + secondRoll + boost;
  
    setDiceRolls({ first: firstRoll, second: secondRoll });
  
    setTimeout(() => {
      alert(`You rolled a ${totalRoll}${boost > 0 ? ` (including +${boost} boost)` : ''}!`);
  
      // Ragnarok effect (ID 19)
      if (card.id === 19) { // Ragnarok ID
        if (totalRoll >= 6) {
          if (isRagnarokActivated) {
            alert("Ragnarok effect has already been activated this turn!");
            return;
          }
  
          alert("Ragnarok effect activated! +3 to all hero rolls until the end of the turn.");
          setBoostedHeroes((prev) => [...prev, ...playedCards.map((_, index) => index)]); // Track boosted heroes
          setPlayedCards((prev) =>
            prev.map((hero) =>
              hero && hero.type === "Hero"
                ? { ...hero, boost: (hero.boost || 0) + 3 } // Add +3 boost to all heroes
                : hero
            )
          );
          setIsRagnarokActivated(true); // Mark the effect as activated
        } else {
          alert("Ragnarok effect did not activate.");
        }
        return;
      }
  
      // The Inventor effect (ID 21)
      if (card.id === 21) {
        if (totalRoll >= 8) {
          alert("The Inventor effect activated! Drawing 3 item cards...");
          const newItemCards = getRandomItemCards(3);
          setPlayerHand((prevHand) => [...prevHand, ...newItemCards]);
        } else {
          alert("The Inventor effect did not activate.");
        }
        return;
      }
  
      if (card.id === 24) {
        if (totalRoll >= 8) {
          alert("BearCleaver effect activated! Drawing 2 cards...");
          const newCards = getRandomCards(2);
          setPlayerHand((prevHand) => [...prevHand, ...newCards]);
  
          const hasSpell = newCards.some((newCard) => newCard.type === "Spell");
          if (hasSpell) {
            alert("A spell card was drawn! Destroying a random hero card in your hand...");
            const heroCards = playerHand.filter((handCard) => handCard.type === "Hero");
            if (heroCards.length > 0) {
              const randomHeroIndex = Math.floor(Math.random() * heroCards.length);
              const cardToDestroy = heroCards[randomHeroIndex];
  
              setPlayerHand((prevHand) =>
                prevHand.filter((handCard) => handCard.uniqueId !== cardToDestroy.uniqueId)
              );
  
              alert(`Destroyed hero card: ${cardToDestroy.name}`);
            } else {
              alert("No hero cards in your hand to destroy!");
            }
          }
        } else {
          alert("BearCleaver effect did not activate.");
        }
        return;
      }
  
      if (card.id === 18) {
        if (totalRoll >= 7) {
          alert("Winged Serpent effect activated! Drawing cards until you have 7 cards in your hand.");
          setPlayerHand((prevHand) => {
            const cardsNeeded = 7 - prevHand.length;
            if (cardsNeeded > 0) {
              const newCards = getRandomCards(cardsNeeded);
              return [...prevHand, ...newCards];
            }
            return prevHand;
          });
        } else {
          alert("Winged Serpent effect did not activate.");
        }
        return;
      }
  
      if (card.id === 27) {
        if (totalRoll >= 6) {
          alert("Vampire effect activated! Drawing 2 cards...");
          const newCards = getRandomCards(2);
          setPlayerHand((prevHand) => [...prevHand, ...newCards]);
        } else {
          alert("Vampire effect did not activate.");
        }
        return;
      }
  
      if (card.id === 22) {
        if (totalRoll >= 8) {
          alert("TitaniumGiant effect activated! Drawing 2 cards...");
          const newCards = getRandomCards(2);
          setPlayerHand((prevHand) => [...prevHand, ...newCards]);
  
          const hasCyborg = newCards.some((newCard) => newCard.affinity === "Cyborg");
          if (hasCyborg) {
            alert("A Cyborg card was drawn! Destroying a random hero card in your hand...");
            const heroCards = playerHand.filter((handCard) => handCard.type === "Hero");
            if (heroCards.length > 0) {
              const randomHeroIndex = Math.floor(Math.random() * heroCards.length);
              const cardToDestroy = heroCards[randomHeroIndex];
  
              setPlayerHand((prevHand) =>
                prevHand.filter((handCard) => handCard.uniqueId !== cardToDestroy.uniqueId)
              );
  
              alert(`Destroyed hero card: ${cardToDestroy.name}`);
            } else {
              alert("No hero cards in your hand to destroy!");
            }
          }
        } else {
          alert("TitaniumGiant effect did not activate.");
        }
        return;
      }
  
      if (card.id === 6) {
        handleLostSoulEffect();
        return;
      }
  
      if (card.id === 2) {
        if (totalRoll >= 6) {
          activateDarkGoblinEffect();
        } else {
          alert("Dark Goblin failed to steal a card.");
        }
        return;
      }
  
      if (card.id === 1) {
        if (totalRoll >= 8) {
          alert("MooseDruid effect activated! Destroying an opponent's hero card...");
          socketRef.current.emit("moosedruid_effect", { 
            gameId, 
            playerId,
            destroyOpponentCard: true
          });
        } else if (totalRoll <= 4) {
          alert("MooseDruid has been destroyed!");
          socketRef.current.emit("moosedruid_effect", { 
            gameId, 
            playerId,
            slotIndex,
            destroyOpponentCard: false
          });
          setPlayedCards((prev) => {
            const newPlayed = [...prev];
            newPlayed[slotIndex] = null;
            return newPlayed;
          });
        } else {
          alert("Nothing happens.");
        }
        return;
      }
  
      if (card.id === 20) {
        if (totalRoll >= 7) {
          alert("White Mage effect activated! Searching discard pile for a hero card...");
          const heroCards = discardPile.filter((discardedCard) => discardedCard.type === "Hero");
          if (heroCards.length > 0) {
            setHeroCardsInDiscard(heroCards);
            setIsWhiteMagePopupOpen(true);
          } else {
            alert("No hero cards available in the discard pile!");
          }
        } else {
          alert("White Mage effect did not activate.");
        }
        return;
      }
    }, 100);
  };

  const handleLostSoulEffect = () => {
    if (discardPile.length === 0) {
      alert("The discard pile is empty! No card to draw.");
      return;
    }
  
    const lastDiscardedCard = discardPile[discardPile.length - 1];
    setPlayerHand((prevHand) => [...prevHand, lastDiscardedCard]);
    setDiscardPile((prev) => prev.slice(0, -1));
    alert("You have drawn a card from the discard pile!");
  };

  const activateDarkGoblinEffect = () => {
    console.log("Attempting Dark Goblin steal...");
    console.log("Opponent hand:", opponentHand);
  
    if (!opponentHand || opponentHand.length === 0) {
      alert("Opponent has no cards to steal!");
      return;
    }
  
    socketRef.current.emit("darkgoblin_effect", { 
      gameId,
      playerId: socketRef.current.id
    });
  };

  const handleBullseyeEffect = () => {
    if (!isMyTurn) {
      alert("It's not your turn!");
      return;
    }

    if (discardPile.length === 0) {
      alert("The discard pile is empty!");
      return;
    }

    const topCards = discardPile.slice(-3).reverse();
    setDiscardPreviewCards(topCards);
    setIsBullseyePopupOpen(true);
  };

  const handleCardSelect = (selectedIndex) => {
    if (selectedIndex < 0 || selectedIndex >= discardPreviewCards.length) return;

    const selectedCard = discardPreviewCards[selectedIndex];
    setPlayerHand((prev) => [...prev, selectedCard]);

    const newDiscardPile = [...discardPile];
    const selectedCardIndex = newDiscardPile.length - 1 - selectedIndex;
    newDiscardPile.splice(selectedCardIndex, 1);
    
    setDiscardPile(newDiscardPile);
    setIsBullseyePopupOpen(false);
  };

  const handleWhiteMageSelect = (selectedCard) => {
    if (!selectedCard) return;

    setPlayerHand((prev) => [...prev, selectedCard]);
    setDiscardPile((prev) => prev.filter((card) => card.uniqueId !== selectedCard.uniqueId));
    setIsWhiteMagePopupOpen(false);
  };

  if (!selectedLeader) {
    return (
      <PartyLeaderSelection 
        onLeaderSelect={(leader) => {
          setSelectedLeader(leader);
          console.log(`Selected Leader: ${leader.name}`);
        }}
      />
    );
  }

  return (
    <div className="game-board-container">
      <div style={styles.gameBoard}>
        <div
          style={{
            ...styles.playerNameContainer,
            ...(isMyTurn ? styles.activePlayer : {}),
          }}
        >
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
              onMouseEnter={() => setHoveredCardIndex(index)}
              onMouseLeave={() => setHoveredCardIndex(null)}
            >
              {card ? (
                <div style={{ ...styles.card, position: "relative" }}>
                  <img
                    src={cardImageMap[card.name]}
                    alt={card.name}
                    style={styles.cardImage}
                  />
                  {card.boost && (
                    <div style={styles.boostIndicator}>+{card.boost}</div>
                  )}
                  {card.hydraEffect && (
                    <div style={styles.hydraCircle}>+1</div>
                  )}
                  {heroItems[index] && (
                    <div style={styles.itemIndicator}>
                      <img
                        src={cardImageMap[heroItems[index].name]}
                        alt={heroItems[index].name}
                        style={styles.itemImage}
                      />
                    </div>
                  )}
                  {card.type === "Hero" && hoveredCardIndex === index && (
                    <button
                      style={styles.heroActionButton}
                      onClick={() => {
                        if (card.id === 7) {
                          handleBullseyeEffect();
                        } else if (card.id === 8) {
                          alert("Hydra effect is passive and already applied!");
                        } else {
                          handleHeroRoll(card, index);
                        }
                      }}
                    >
                      {card.id === 7 ? "Bullseye" : card.id === 8 ? "Hydra" : "Hero Action"}
                    </button>
                  )}
                </div>
              ) : (
                <div style={styles.emptySlot}>Slot {index + 1}</div>
              )}
            </div>
          ))}
        </div>
        <div style={styles.diceContainer}>
          <div style={styles.dice}>
            {diceRolls.first ? (
              <img
                src={
                  diceRolls.first === 1 ? dice1 :
                  diceRolls.first === 2 ? dice2 :
                  diceRolls.first === 3 ? dice3 :
                  diceRolls.first === 4 ? dice4 :
                  diceRolls.first === 5 ? dice5 : dice6
                }
                alt={`Dice ${diceRolls.first}`}
                style={styles.diceImage}
              />
            ) : (
              <div style={styles.emptyDice}>?</div>
            )}
          </div>
          <div style={styles.dice}>
            {diceRolls.second ? (
              <img
                src={
                  diceRolls.second === 1 ? dice1 :
                  diceRolls.second === 2 ? dice2 :
                  diceRolls.second === 3 ? dice3 :
                  diceRolls.second === 4 ? dice4 :
                  diceRolls.second === 5 ? dice5 : dice6
                }
                alt={`Dice ${diceRolls.second}`}
                style={styles.diceImage}
              />
            ) : (
              <div style={styles.emptyDice}>?</div>
            )}
          </div>
        </div>
        <h2>Player Hand</h2>
        <div style={styles.hand}>
          {playerHand.map((card) => (
            <div
              key={`hand-${card.uniqueId}`}
              draggable
              onDragStart={(e) => e.dataTransfer.setData("card", JSON.stringify(card))}
              style={{ ...styles.card, position: "relative" }}
              onMouseEnter={() => card.type === "Spell" && setHoveredSpell(card)}
              onMouseLeave={() => card.type === "Spell" && setHoveredSpell(null)}
            >
              <img
                src={cardImageMap[card.name]} // Dynamically map card name to image
                alt={card.name}
                style={styles.cardImage}
              />
              {card.type === "Spell" && hoveredSpell?.uniqueId === card.uniqueId && (
                <div style={styles.spellEffectContainer}>
                  <button
                    onClick={() => castSpell(card)}
                    style={styles.spellEffectButton}
                  >
                    Cast Spell
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
        <div style={styles.discardContainer}>
          <div style={styles.discardPile}>
            {discardPile.length > 0 ? (
              <div style={styles.card}>
                <img
                  src={discardPile[discardPile.length - 1].image}
                  alt="Last Discarded Card"
                  style={styles.cardImage}
                />
              </div>
            ) : (
              <div style={styles.slot}>
                <div style={styles.emptySlot}>Discard Pile</div>
              </div>
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
          <button
            onClick={handleEndTurn}
            style={styles.endTurnButton}
          >
            End Turn
          </button>
        )}
        {isCriticalBoostPopupOpen && (
          <div style={styles.popupOverlay}>
            <div style={styles.popupContainer}>
              <h3>Select a card to discard</h3>
              <div style={styles.popupHand}>
                {playerHand.map((card) => (
                  <div
                    key={card.uniqueId}
                    style={{
                      ...styles.card,
                      border:
                        selectedCardToDiscard?.uniqueId === card.uniqueId
                          ? "2px solid red"
                          : "1px solid #888",
                    }}
                    onClick={() => setSelectedCardToDiscard(card)}
                  >
                    <img src={card.image} alt={`Card ${card.id}`} style={styles.cardImage} />
                  </div>
                ))}
              </div>
              <button onClick={confirmCriticalBoost} style={styles.confirmButton}>
                Confirm
              </button>
              <button
                onClick={() => setIsCriticalBoostPopupOpen(false)}
                style={styles.cancelButton}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        {isMADPopupOpen && (
          <div style={styles.popupOverlay}>
            <div style={styles.popupContainer}>
              <h3>Select 2 cards to discard</h3>
              <div style={styles.popupHand}>
                {playerHand.map((card) => (
                  <div
                    key={card.uniqueId}
                    style={{
                      ...styles.card,
                      border: selectedCardsToDiscard.includes(card)
                        ? "2px solid red"
                        : "1px solid #888",
                    }}
                    onClick={() => {
                      if (selectedCardsToDiscard.includes(card)) {
                        setSelectedCardsToDiscard((prev) =>
                          prev.filter((c) => c !== card)
                        );
                      } else if (selectedCardsToDiscard.length < 2) {
                        setSelectedCardsToDiscard((prev) => [...prev, card]);
                      }
                    }}
                  >
                    <img src={card.image} alt={`Card ${card.id}`} style={styles.cardImage} />
                  </div>
                ))}
              </div>
              <button onClick={confirmMADDiscard} style={styles.confirmButton}>
                Confirm
              </button>
              <button
                onClick={() => {
                  setIsMADPopupOpen(false);
                  setSelectedCardsToDiscard([]);
                }}
                style={styles.cancelButton}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        {isOpponentHeroPopupOpen && (
          <div style={styles.popupOverlay}>
            <div style={styles.popupContainer}>
              <h3>Select an opponent's hero card to destroy</h3>
              <div style={styles.popupHand}>
                {opponentPlayedCards.map((card, index) =>
                  card ? (
                    <div
                      key={`opponent-${index}`}
                      style={{
                        ...styles.card,
                        border: selectedOpponentHero === index
                          ? "2px solid red"
                          : "1px solid #888",
                      }}
                      onClick={() => setSelectedOpponentHero(index)}
                    >
                      <img src={card.image} alt={`Card ${card.id}`} style={styles.cardImage} />
                    </div>
                  ) : (
                    <div key={`empty-${index}`} style={styles.emptySlot}>
                      Empty Slot
                    </div>
                  )
                )}
              </div>
              <button
                onClick={confirmMADDestroy}
                style={styles.confirmButton}
              >
                Confirm
              </button>
              <button
                onClick={() => {
                  setIsOpponentHeroPopupOpen(false);
                  setSelectedOpponentHero(null);
                }}
                style={styles.cancelButton}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        {isBullseyePopupOpen && (
          <DiscardSelectionModal
            cards={discardPreviewCards}
            cardImages={cardImageMap}
            onSelect={handleCardSelect}
            onClose={() => setIsBullseyePopupOpen(false)}
          />
        )}
        {isWhiteMagePopupOpen && (
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
              }}>Select a Hero Card from the Discard Pile</h3>
              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '15px',
                marginBottom: '20px',
              }}>
                {heroCardsInDiscard.map((card, index) => (
                  <div 
                    key={index} 
                    style={{
                      cursor: 'pointer',
                      transition: 'transform 0.2s',
                      ':hover': {
                        transform: 'scale(1.05)',
                      }
                    }}
                    onClick={() => handleWhiteMageSelect(card)}
                  >
                    <img 
                      src={cardImageMap[card.name] || card.image || ''}
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
                onClick={() => setIsWhiteMagePopupOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
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
  diceContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    margin: '10px 0',
  },
  dice: {
    width: '50px',
    height: '50px',
    border: '2px solid #888',
    borderRadius: '10px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  diceImage: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
  },
  emptyDice: {
    color: '#888',
    fontSize: '20px',
    fontWeight: 'bold',
  },
  spellEffectContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    color: "white",
    padding: "5px 10px",
    borderRadius: "5px",
    zIndex: 10,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  spellEffectButton: {
    backgroundColor: "linear-gradient(90deg, #4CAF50, #2E7D32)",
    color: "white",
    border: "none",
    padding: "8px 15px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "bold",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    transition: "all 0.3s ease-in-out",
  },
  popupOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  heroActionButton: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)", // Center the button
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    padding: "6px 12px", // Reduced padding for a smaller button
    borderRadius: "50px", // Fully rounded corners for a curved button
    cursor: "pointer",
    fontSize: "0.8rem", // Smaller font size
    fontWeight: "bold",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)", // Subtle shadow for a cleaner look
    transition: "all 0.3s ease",
    textTransform: "uppercase",
    letterSpacing: "0.5px", // Slightly reduced letter spacing
    zIndex: 5, // Ensure it appears above other elements
  },
  heroActionButtonHover: {
    backgroundColor: "#45A049",
    transform: "translate(-50%, -50%) scale(1.1)", // Slightly larger scale on hover
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)", // Enhanced shadow on hover
  },
  boostIndicator: {
    position: "absolute",
    bottom: "5px",
    right: "5px",
    backgroundColor: "#FFD700",
    color: "#000",
    padding: "2px 5px",
    borderRadius: "3px",
    fontSize: "0.8rem",
    fontWeight: "bold",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
  },
  hydraIndicator: {
    position: "absolute",
    top: "5px",
    left: "5px",
    backgroundColor: "#4CAF50",
    color: "#fff",
    padding: "2px 5px",
    borderRadius: "3px",
    fontSize: "0.8rem",
    fontWeight: "bold",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
  },
  hydraCircle: {
    position: "absolute",
    top: "10px",
    left: "10px",
    width: "20px",
    height: "20px",
    borderRadius: "50%",
    backgroundColor: "#4CAF50",
    color: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "0.8rem",
    fontWeight: "bold",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
  },
  itemIndicator: {
    position: "absolute",
    bottom: "5px",
    left: "5px",
    width: "30px",
    height: "30px",
    borderRadius: "50%",
    backgroundColor: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
  },
  itemImage: {
    width: "20px",
    height: "20px",
    objectFit: "contain",
  },
};

// Add CSS keyframes for the pulsing animation
const styleSheet = document.styleSheets[0];
const keyframes =
  `@keyframes pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }`;
styleSheet.insertRule(keyframes, styleSheet.cssRules.length);

export default GameBoard;