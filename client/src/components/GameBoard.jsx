import React, { useEffect, useState } from "react";
import Timer from "./Timer";
import ActionPoints from "./ActionPoints";
import DrawCard from "./DrawCard";
import PartyLeaderSelection from "./PartyLeaderSelection"; // Import the new component
import OpponentCardSlot from "./OpponentCardSlot"; // Import the new component
import { io } from "socket.io-client";
import { useLocation } from "react-router-dom";
import "./GameBoard.css";

// Import Card Images
import MooseDruid from "../assets/MooseDruid.png";
import DarkGoblin from "../assets/DarkGoblin.png";
import DruidMask from "../assets/DruidMask.png";
import DecoyDoll from "../assets/DecoyDoll.png";
import CriticalBoost from "../assets/CriticalBoost.png";

const socket = io("http://localhost:3000"); // Adjust based on your backend port

const GameBoard = () => {
    const location = useLocation();
    const { playerName } = location.state || { playerName: "Unknown Player" }; // Default to 'Unknown Player' if no name is provided

    // Define your actual card data
    const initialCards = [
        { id: 1, image: MooseDruid },
        { id: 2, image: DarkGoblin },
        { id: 3, image: DruidMask },
        { id: 4, image: DecoyDoll },
        { id: 5, image: CriticalBoost },
    ];

    // State variables
    const [playerHand, setPlayerHand] = useState(initialCards);
    const [playedCards, setPlayedCards] = useState(Array(5).fill(null)); // 5 slots for played cards
    const [opponentPlayedCards, setOpponentPlayedCards] = useState(Array(5).fill(null)); // 5 slots for opponent played cards
    const [discardPile, setDiscardPile] = useState([]);
    const [selectedLeader, setSelectedLeader] = useState(null); // State for selected party leader
    const [timeLeft, setTimeLeft] = useState(60); // State for countdown timer

    useEffect(() => {
        socket.on("connect", () => {
            console.log(`Connected to server with ID: ${socket.id}`);
        });

        socket.on("disconnect", () => {
            console.log(`Disconnected from server`);
        });

        socket.on("turn_start", () => {
            setTimeLeft(60); // Reset the timer to 60 seconds at the start of each turn
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        if (timeLeft > 0) {
            const timerId = setTimeout(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
            return () => clearTimeout(timerId);
        } else {
            socket.emit("end_turn"); // Automatically end the turn when the timer runs out
        }
    }, [timeLeft]);

    // Function to discard the entire hand
    const discardAllCards = () => {
        if (playerHand.length === 0) {
            alert("No cards to discard!");
            return;
        }

        // Move all cards from the player's hand to the discard pile
        setDiscardPile((prevDiscardPile) => [...prevDiscardPile, ...playerHand]);
        setPlayerHand([]); // Clear the player's hand
    };

    // Drag-and-drop handlers
    const handleDragStart = (e, card) => {
        e.dataTransfer.setData("card", JSON.stringify(card)); // Store the card data
    };

    const handleDragOver = (e) => {
        e.preventDefault(); // Allow dropping
    };

    const handleDrop = (e, slotIndex) => {
        e.preventDefault();
        const card = JSON.parse(e.dataTransfer.getData("card")); // Retrieve the card data

        // Move the card from the player's hand to the play area
        setPlayerHand((prevHand) => prevHand.filter((c) => c.id !== card.id));
        setPlayedCards((prevPlayed) => {
            const newPlayed = [...prevPlayed];
            newPlayed[slotIndex] = card; // Place the card in the specified slot
            return newPlayed;
        });
    };

    // Handle party leader selection
    const handleLeaderSelect = (leader) => {
        setSelectedLeader(leader);
    };

    // Get the last discarded card (or null if the discard pile is empty)
    const lastDiscardedCard = discardPile.length > 0 ? discardPile[discardPile.length - 1] : null;

    return (
        <div className="game-board-container">
            {!selectedLeader ? (
                <PartyLeaderSelection onLeaderSelect={handleLeaderSelect} />
            ) : (
                <div style={styles.gameBoard}>
                    <Timer timeLeft={timeLeft} />
                    <ActionPoints />
                    <div style={styles.drawCardContainer}>
                        <DrawCard />
                    </div>

                    {/* Player's name and selected leader in the top right corner */}
                    <div style={styles.playerInfo}>
                        <div style={styles.playerName}>{playerName}</div>
                        {selectedLeader && (
                            <div style={styles.leader}>
                                <img src={selectedLeader.image} alt={selectedLeader.name} style={styles.leaderImage} />
                            </div>
                        )}
                    </div>

                    {/* Opponent Play Area */}
                    <div style={styles.opponentPlayArea}>
                        {opponentPlayedCards.map((card, index) => (
                            <OpponentCardSlot key={index} card={card} />
                        ))}
                    </div>

                    {/* Play Area */}
                    <div style={styles.playArea}>
                        {playedCards.map((card, index) => (
                            <div
                                key={index}
                                style={styles.slot}
                                onDragOver={handleDragOver}
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

                    {/* Player Hand */}
                    <h2>Player Hand</h2>
                    <div style={styles.hand}>
                        {playerHand.map((card) => (
                            <div key={card.id} draggable onDragStart={(e) => handleDragStart(e, card)} style={styles.card}>
                                <img src={card.image} alt={`Card ${card.id}`} style={styles.cardImage} />
                            </div>
                        ))}
                    </div>

                    {/* Discard Pile and Discard Button */}
                    <div style={styles.discardContainer}>
                        <div style={styles.discardPile}>
                            {lastDiscardedCard ? (
                                <div style={styles.card}>
                                    <img src={lastDiscardedCard.image} alt={`Card ${lastDiscardedCard.id}`} style={styles.cardImage} />
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
                </div>
            )}
        </div>
    );
};

// Styles
// ... (keep the imports and initial code the same)

const styles = {
    gameBoard: {
        position: "relative",
        textAlign: "center",
        padding: "1vh", // Reduce padding
        border: "3px solid black", // Reduce border size
        background: "#162C24",
        height: "90vh", // Reduce height
        maxWidth: "1400px", // Reduce max-width
        margin: "0 auto", // Center the game board
        display: "flex",
        flexDirection: "column",
    },
    playerInfo: {
        position: "absolute",
        top: "1vh", // Reduce top margin
        right: "1vw", // Reduce right margin
        color: "#fff",
        textAlign: "right",
    },
    playerName: {
        fontSize: "1rem", // Reduce font size
        fontWeight: "bold",
    },
    leader: {
        marginTop: "0.5vh", // Reduce top margin
    },
    leaderImage: {
        width: "80px", // Reduce size
        height: "120px", // Reduce size
    },
    drawCardContainer: {
        transform: "scale(0.7)", // Scale down the DrawCard component further
        transformOrigin: "top left",
    },
    opponentPlayArea: {
        display: "flex",
        justifyContent: "center",
        gap: "0.5vw", // Reduce gap
        margin: "1vh 0", // Reduce margin
        flexWrap: "wrap",
        padding: "0 1vw", // Reduce padding
    },
    hand: {
        display: "flex",
        justifyContent: "center",
        gap: "0.5vw", // Reduce gap
        flexWrap: "wrap",
        margin: "1vh 0", // Reduce margin
        padding: "0 1vw", // Reduce padding
    },
    card: {
        width: "calc(120px + 1vw)", // Reduce card width
        height: "calc(160px + 1vh)", // Reduce card height
        border: "1px solid #888", // Reduce border size
        borderRadius: "8px", // Reduce border radius
        overflow: "hidden",
        cursor: "grab",
        flexShrink: 0,
        maxWidth: "150px", // Reduce max width
        maxHeight: "200px", // Reduce max height
    },
    cardImage: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
    },
    playArea: {
        display: "flex",
        justifyContent: "center",
        gap: "0.5vw", // Reduce gap
        margin: "1vh 0", // Reduce margin
        flexWrap: "wrap",
        padding: "0 1vw", // Reduce padding
    },
    slot: {
        width: "calc(120px + 1vw)", // Reduce slot width
        height: "calc(160px + 1vh)", // Reduce slot height
        border: "1px dashed #ccc", // Reduce border size
        borderRadius: "8px", // Reduce border radius
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#1E7149",
        maxWidth: "150px", // Reduce max width
        maxHeight: "200px", // Reduce max height
    },
    emptySlot: {
        color: "#888",
        fontSize: "0.75rem", // Reduce font size
    },
    discardContainer: {
        position: "absolute",
        bottom: "1vh", // Reduce bottom margin
        right: "1vw", // Reduce right margin
        textAlign: "center",
    },
    discardPile: {
        marginBottom: "0.5vh", // Reduce bottom margin
    },
    discardButton: {
        padding: "0.5vh 1vw", // Reduce padding
        fontSize: "0.8rem", // Reduce font size
        cursor: "pointer",
        backgroundColor: "#4CAF50",
        color: "#fff",
        border: "none",
        borderRadius: "4px", // Reduce border radius
        minWidth: "80px", // Reduce min width
    },
};

// Add media queries for different screen sizes
const mediaQueries = {
    '@media (max-width: 1200px)': {
        card: {
            width: "calc(100px + 1vw)",
            height: "calc(133px + 1vh)",
        },
        slot: {
            width: "calc(100px + 1vw)",
            height: "calc(133px + 1vh)",
        },
    },
    '@media (max-width: 768px)': {
        card: {
            width: "calc(80px + 1vw)",
            height: "calc(106px + 1vh)",
        },
        slot: {
            width: "calc(80px + 1vw)",
            height: "calc(106px + 1vh)",
        },
    },
};

// You might also want to add some CSS in your GameBoard.css file:

export default GameBoard;
