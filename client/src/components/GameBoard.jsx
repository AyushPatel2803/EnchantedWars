import React, { useEffect, useState } from "react";
import Timer from "./Timer";
import ActionPoints from "./ActionPoints";
import DrawCard from "./DrawCard";
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
    const [discardPile, setDiscardPile] = useState([]);
    const [partyLeaderChosen, setPartyLeaderChosen] = useState(false);
    const [partyLeader, setPlayerLeader] = useState(null);

    useEffect(() => {
        socket.on("connect", () => {
            console.log(`Connected to server with ID: ${socket.id}`);
        });

        socket.on("disconnect", () => {
            console.log(`Disconnected from server`);
        });

        return () => {
            socket.disconnect();
        };
    }, []);

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

    const choosePartyLeader = (card) => {
        setPartyLeaderChosen
        setPlayerLeader(card);
    }

    // Get the last discarded card (or null if the discard pile is empty)
    const lastDiscardedCard = discardPile.length > 0 ? discardPile[discardPile.length - 1] : null;

    return (
    <div className="game-board-container"> 
        <div style={styles.gameBoard}>
            <Timer />
            <ActionPoints />
            <DrawCard />

            {/* Player's name in the top right corner */}
            <div style={styles.playerName}>{playerName}</div>

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
      </div>  
    );
};

// Styles
// ... (keep the imports and initial code the same)

const styles = {
    gameBoard: {
        position: "relative",
        textAlign: "center",
        padding: "2vh",
        border: "4px solid black",
        background: "#162C24",
        height: "100vh", // Use viewport height instead of fixed pixels
        maxWidth: "1600px", // Add a max-width
        margin: "0 auto", // Center the game board
        display: "flex",
        flexDirection: "column",
    },
    playerName: {
        position: "absolute",
        top: "2vh",
        right: "2vw",
        color: "#fff",
        fontSize: "1.2rem",
        fontWeight: "bold",
    },
    hand: {
        display: "flex",
        justifyContent: "center",
        gap: "1vw",
        flexWrap: "wrap",
        margin: "2vh 0",
        padding: "0 2vw",
    },
    card: {
        width: "calc(150px + 2vw)", // Responsive card width
        height: "calc(200px + 2vh)", // Responsive card height
        border: "2px solid #888",
        borderRadius: "10px",
        overflow: "hidden",
        cursor: "grab",
        flexShrink: 0,
        maxWidth: "180px", // Add maximum width
        maxHeight: "240px", // Add maximum height
    },
    cardImage: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
    },
    playArea: {
        display: "flex",
        justifyContent: "center",
        gap: "1vw",
        margin: "2vh 0",
        flexWrap: "wrap",
        padding: "0 2vw",
    },
    slot: {
        width: "calc(150px + 2vw)", // Match card dimensions
        height: "calc(200px + 2vh)",
        border: "2px dashed #ccc",
        borderRadius: "10px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#1E7149",
        maxWidth: "180px",
        maxHeight: "240px",
    },
    emptySlot: {
        color: "#888",
        fontSize: "0.875rem",
    },
    discardContainer: {
        position: "absolute",
        bottom: "2vh",
        right: "2vw",
        textAlign: "center",
    },
    discardPile: {
        marginBottom: "1vh",
    },
    discardButton: {
        padding: "1vh 2vw",
        fontSize: "1rem",
        cursor: "pointer",
        backgroundColor: "#4CAF50",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        minWidth: "100px",
    },
};

// Add media queries for different screen sizes
const mediaQueries = {
    '@media (max-width: 1200px)': {
        card: {
            width: "calc(120px + 1vw)",
            height: "calc(160px + 1vh)",
        },
        slot: {
            width: "calc(120px + 1vw)",
            height: "calc(160px + 1vh)",
        },
    },
    '@media (max-width: 768px)': {
        card: {
            width: "calc(100px + 1vw)",
            height: "calc(133px + 1vh)",
        },
        slot: {
            width: "calc(100px + 1vw)",
            height: "calc(133px + 1vh)",
        },
    },
};

// You might also want to add some CSS in your GameBoard.css file:

export default GameBoard;
