import React, { useEffect, useState, useRef, useCallback } from "react";
import Timer from "./Timer";
import DrawCard from "./DrawCard";
import PartyLeaderSelection from "./PartyLeaderSelection";
import OpponentCardSlot from "./OpponentCardSlot";
import { io } from "socket.io-client";
import "./GameBoard.css";
import { useLocation } from "react-router-dom";

import MooseDruid from "../assets/MooseDruid.png";
import DarkGoblin from "../assets/DarkGoblin.png";
import DruidMask from "../assets/DruidMask.png";
import DecoyDoll from "../assets/DecoyDoll.png";
import CriticalBoost from "../assets/CriticalBoost.png";

const cardList = [
  { id: 1, name: "Moose Druid", image: MooseDruid },
  { id: 2, name: "Dark Goblin", image: DarkGoblin },
  { id: 3, name: "Druid Mask", image: DruidMask },
  { id: 4, name: "Decoy Doll", image: DecoyDoll },
  { id: 5, name: "Critical Boost", image: CriticalBoost },
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
  const socketRef = useRef(null);

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

    socketRef.current.on("match_found", ({ opponent, gameId, isFirstPlayer }) => {
      setGameId(gameId);
      setOpponentName(opponent);
      setIsMyTurn(isFirstPlayer);
      setTurnMessage(isFirstPlayer ? "Your turn!" : "Opponent's turn");
      setTimeLeft(60);
      setPlayerHand(getRandomCards());
    });

    socketRef.current.on("turn_update", ({ currentPlayerId }) => {
      setCurrentPlayerId(currentPlayerId);
      setIsMyTurn(currentPlayerId === socketRef.current.id);
      setTurnMessage(currentPlayerId === socketRef.current.id ? "Your turn!" : "Opponent's turn");
      setTimeLeft(60);
    });

    socketRef.current.on("card_played", ({ slotIndex, card }) => {
      setOpponentPlayedCards((prev) => {
        const newPlayed = [...prev];
        newPlayed[slotIndex] = card;
        return newPlayed;
      });
    });

    socketRef.current.on("opponent_disconnected", ({ message }) => {
      alert(message);
      // Handle game end or redirect to another page
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [playerName]);

  const handleEndTurn = useCallback(() => {
    if (!isMyTurn) return;
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

  const getRandomCards = () => {
    const shuffledCards = [...cardList].sort(() => Math.random() - 0.5);
    return shuffledCards.slice(0, 5);
  };

  const checkActionPoints = () => {
    // Implement action points check logic
    return true;
  };

  const handleDrawCard = () => {
    if (!isMyTurn || !checkActionPoints()) return;
    if (playerHand.length >= 8) {
      alert("You cannot have more than 8 cards in your hand!");
      return;
    }
    const randomCard = { ...cardList[Math.floor(Math.random() * cardList.length)], uniqueId: Date.now() };
    setPlayerHand((prevHand) => [...prevHand, randomCard]);
  };

  const handleDrop = (e, slotIndex) => {
    if (!isMyTurn || !checkActionPoints()) return;
    e.preventDefault();
    const card = JSON.parse(e.dataTransfer.getData("card"));
    setPlayerHand((prev) => prev.filter((c) => c.id !== card.id));
    setPlayedCards((prev) => {
      const newPlayed = [...prev];
      newPlayed[slotIndex] = card;
      return newPlayed;
    });
    socketRef.current.emit("card_played", { gameId, slotIndex, card });
  };

  const discardAllCards = () => {
    if (!isMyTurn || !checkActionPoints()) return;
    setDiscardPile((prev) => [...prev, ...playerHand]);
    setPlayerHand(getRandomCards());
  };

  return (
    <div className="game-board-container">
      {!selectedLeader ? (
        <>
          <div style={styles.playerNameContainer}>
            <h2 style={styles.playerNameText}>{playerName}</h2>
          </div>
          <PartyLeaderSelection onLeaderSelect={setSelectedLeader} />
        </>
      ) : (
        <div style={styles.gameBoard}>
          <div style={styles.playerNameContainer}>
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
              >
                {card ? (
                  <div style={styles.card}>
                    <img src={card.image} alt={`Card ${card.id}`} style={styles.cardImage} />
                  </div>
                ) : (
                  <div style={styles.emptySlot}>Slot {index + 1}</div>
                )}
              </div>
            ))}
          </div>
          <h2>Player Hand</h2>
          <div style={styles.hand}>
            {playerHand.map((card) => (
              <div
                key={card.id}
                draggable
                onDragStart={(e) => e.dataTransfer.setData("card", JSON.stringify(card))}
                style={styles.card}
              >
                <img src={card.image} alt={`Card ${card.id}`} style={styles.cardImage} />
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
            <h3 style={styles.actionPointsText}>Action Points: {/* Display action points here */}</h3>
          </div>
          <button onClick={handleEndTurn} style={styles.endTurnButton}>
            End Turn
          </button>
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
};

export default GameBoard;