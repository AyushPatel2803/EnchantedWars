import React, { useEffect, useState } from "react";
import Timer from "./Timer";
import DrawCard from "./DrawCard";
import PartyLeaderSelection from "./PartyLeaderSelection";
import OpponentCardSlot from "./OpponentCardSlot";
import { io } from "socket.io-client";
import "./GameBoard.css";

import MooseDruid from "../assets/MooseDruid.png";
import DarkGoblin from "../assets/DarkGoblin.png";
import DruidMask from "../assets/DruidMask.png";
import DecoyDoll from "../assets/DecoyDoll.png";
import CriticalBoost from "../assets/CriticalBoost.png";

const socket = io("http://localhost:3000");

const GameBoard = () => {
    const [player1Hand, setPlayer1Hand] = useState([]);
    const [player2Hand, setPlayer2Hand] = useState([]);
    const [player1ActionPoints, setPlayer1ActionPoints] = useState(3);
    const [player2ActionPoints, setPlayer2ActionPoints] = useState(3);
    const [currentPlayer, setCurrentPlayer] = useState(1);
    const [playedCards, setPlayedCards] = useState(Array(5).fill(null));
    const [opponentPlayedCards, setOpponentPlayedCards] = useState(Array(5).fill(null));
    const [discardPile, setDiscardPile] = useState([]);
    const [selectedLeader, setSelectedLeader] = useState(null);
    const [timeLeft, setTimeLeft] = useState(60);
    const [playerId, setPlayerId] = useState(null);

    const cardList = [
        { id: 1, name: "Moose Druid", image: MooseDruid },
        { id: 2, name: "Dark Goblin", image: DarkGoblin },
        { id: 3, name: "Druid Mask", image: DruidMask },
        { id: 4, name: "Decoy Doll", image: DecoyDoll },
        { id: 5, name: "Critical Boost", image: CriticalBoost },
    ];

    useEffect(() => {
        socket.on("connect", () => console.log(`Connected to server with ID: ${socket.id}`));
        socket.on("disconnect", () => console.log("Disconnected from server"));

        socket.on("turn_start", () => {
            setTimeLeft(60);
            setPlayer1ActionPoints(3);
            setPlayer2ActionPoints(3);
        });

        socket.on("turn_update", ({ nextPlayer }) => {
            setCurrentPlayer(nextPlayer);
            setTimeLeft(60);
        });

        socket.on("card_played", ({ slotIndex, card }) => {
            setOpponentPlayedCards((prev) => {
                const newPlayed = [...prev];
                newPlayed[slotIndex] = card;
                return newPlayed;
            });
        });

        socket.on("player_assigned", ({ playerId }) => {
            setPlayerId(playerId);
        });

        return () => {
            socket.off("connect");
            socket.off("disconnect");
            socket.off("turn_start");
            socket.off("turn_update");
            socket.off("card_played");
            socket.off("player_assigned");
        };
    }, []);

    useEffect(() => {
        if (timeLeft > 0) {
            const timerId = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
            return () => clearTimeout(timerId);
        } else {
            socket.emit("end_turn");
        }
    }, [timeLeft]);

    useEffect(() => {
        const getRandomCards = () => {
            const shuffledCards = [...cardList].sort(() => Math.random() - 0.5);
            return shuffledCards.slice(0, 5);
        };

        setPlayer1Hand(getRandomCards());
        setPlayer2Hand(getRandomCards());
    }, []);

    const checkActionPoints = () => {
        const currentActionPoints = currentPlayer === 1 ? player1ActionPoints : player2ActionPoints;

        if (currentActionPoints <= 0) {
            alert(`Player ${currentPlayer}, you have run out of action points! Switching to the other player.`);
            switchTurn();
            return false;
        }
        return true;
    };

    const switchTurn = () => {
        const nextPlayer = currentPlayer === 1 ? 2 : 1;
        setCurrentPlayer(nextPlayer);
        setTimeLeft(60);
        socket.emit("end_turn", { nextPlayer });
    };

    const handleDrawCard = () => {
        if (!checkActionPoints()) return;

        const currentHand = currentPlayer === 1 ? player1Hand : player2Hand;
        const setCurrentHand = currentPlayer === 1 ? setPlayer1Hand : setPlayer2Hand;
        const setCurrentActionPoints = currentPlayer === 1 ? setPlayer1ActionPoints : setPlayer2ActionPoints;

        if (currentHand.length >= 8) {
            alert("You cannot have more than 8 cards in your hand!");
            return;
        }

        const randomCard = { ...cardList[Math.floor(Math.random() * cardList.length)], uniqueId: Date.now() };

        setCurrentHand((prevHand) => [...prevHand, randomCard]);
        setCurrentActionPoints((prev) => prev - 1);

        if (currentPlayer === 1 && player1ActionPoints - 1 === 0) switchTurn();
        if (currentPlayer === 2 && player2ActionPoints - 1 === 0) switchTurn();
    };

    const handleDrop = (e, slotIndex) => {
        e.preventDefault();
        const card = JSON.parse(e.dataTransfer.getData("card"));
        const currentHand = currentPlayer === 1 ? player1Hand : player2Hand;
        const setCurrentHand = currentPlayer === 1 ? setPlayer1Hand : setPlayer2Hand;
        const setCurrentActionPoints = currentPlayer === 1 ? setPlayer1ActionPoints : setPlayer2ActionPoints;

        if (!checkActionPoints()) return;

        setCurrentHand((prev) => prev.filter((c) => c.id !== card.id));
        setPlayedCards((prev) => {
            const newPlayed = [...prev];
            newPlayed[slotIndex] = card;
            return newPlayed;
        });

        socket.emit("card_played", { slotIndex, card });
        setCurrentActionPoints((prev) => prev - 1);
    };

    const discardAllCards = () => {
        const currentHand = currentPlayer === 1 ? player1Hand : player2Hand;
        const setCurrentHand = currentPlayer === 1 ? setPlayer1Hand : setPlayer2Hand;
        const setCurrentActionPoints = currentPlayer === 1 ? setPlayer1ActionPoints : setPlayer2ActionPoints;

        if (!checkActionPoints()) return;

        setDiscardPile((prev) => [...prev, ...currentHand]);

        const getRandomCards = () => {
            const shuffledCards = [...cardList].sort(() => Math.random() - 0.5);
            return shuffledCards.slice(0, 5);
        };

        setCurrentHand(getRandomCards());
        setCurrentActionPoints((prev) => prev - 2);
    };

    return (
        <div className="game-board-container">
            {!selectedLeader ? (
                <PartyLeaderSelection onLeaderSelect={setSelectedLeader} />
            ) : (
                <div style={styles.gameBoard}>
                    <Timer timeLeft={timeLeft} />
                    <div style={styles.drawCardContainer}>
                        <DrawCard onDrawCard={handleDrawCard} />
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
                        {(currentPlayer === 1 ? player1Hand : player2Hand).map((card) => (
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
                        <button onClick={discardAllCards} style={styles.discardButton}>
                            Discard
                        </button>
                    </div>
                    <div style={styles.actionPointsContainer}>
                        <h3 style={styles.actionPointsText}>
                            Action Points: {currentPlayer === 1 ? player1ActionPoints : player2ActionPoints}
                        </h3>
                    </div>
                    <button onClick={switchTurn} style={styles.endTurnButton}>
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
