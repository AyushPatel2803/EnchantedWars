import React, { useState } from "react";
import Timer from "./Timer";
import ActionPoints from "./ActionPoints";
import DrawCard from "./DrawCard";
import "./GameBoard.css";

// Import Card Images
import MooseDruid from "../assets/MooseDruid.png";
import DarkGoblin from "../assets/DarkGoblin.png";
import DruidMask from "../assets/DruidMask.png";
import DecoyDoll from "../assets/DecoyDoll.png";
import CriticalBoost from "../assets/CriticalBoost.png";

const GameBoard = () => {
    // Define your actual card data
    const initialCards = [
        {
            id: 1,
            image: MooseDruid,
        },
        {
            id: 2,
            image: DarkGoblin,
        },
        {
            id: 3,
            image: DruidMask,
        },
        {
            id: 4,
            image: DecoyDoll,
        },
        {
            id: 5,
            image: CriticalBoost,
        },
    ];

    // State variables
    const [playerHand, setPlayerHand] = useState(initialCards);
    const [playedCards, setPlayedCards] = useState(Array(5).fill(null)); // 5 slots for played cards
    const [discardPile, setDiscardPile] = useState([]);

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

    // Get the last discarded card (or null if the discard pile is empty)
    const lastDiscardedCard = discardPile.length > 0 ? discardPile[discardPile.length - 1] : null;

    return (
        <div style={styles.gameBoard}>
            <Timer />
            <ActionPoints />
            <DrawCard />
            <h1>GameBoard</h1>

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
                                <img
                                    src={card.image}
                                    alt={`Card ${card.id}`}
                                    style={styles.cardImage}
                                />
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
                    <div
                        key={card.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, card)}
                        style={styles.card}
                    >
                        <img
                            src={card.image}
                            alt={`Card ${card.id}`}
                            style={styles.cardImage}
                        />
                    </div>
                ))}
            </div>

            {/* Discard Pile and Discard Button */}
            <div style={styles.discardContainer}>

                <div style={styles.discardPile}>
                    {lastDiscardedCard ? (
                        <div style={styles.card}>
                            <img
                                src={lastDiscardedCard.image}
                                alt={`Card ${lastDiscardedCard.id}`}
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
        </div>
    );
};

// Styles
const styles = {
    gameBoard: {
        position: "relative",
        textAlign: "center",
        padding: "20px",
        border: "4px solid black",
        background: "#162C24",
        height: "800px",
    },
    hand: {
        display: "flex",
        justifyContent: "center",
        gap: "10px",
        flexWrap: "wrap", // Allow cards to wrap to the next line if necessary
    },
    card: {
        width: "150px", // Fixed width for cards
        height: "200px", // Fixed height for cards
        border: "2px solid #888",
        borderRadius: "10px",
        overflow: "hidden",
        cursor: "grab",
        flexShrink: 0, // Prevent cards from shrinking
    },
    cardImage: {
        width: "100%",
        height: "100%",
        objectFit: "cover",// Ensure the image fits within the card
    },
    playArea: {
        display: "flex",
        justifyContent: "center",
        gap: "10px",
        marginTop: "20px",
    },
    slot: {
        width: "150px", // Same size as cards
        height: "200px", // Same size as cards
        border: "2px dashed #ccc",
        borderRadius: "10px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#1E7149",
    },
    emptySlot: {
        color: "#888",
        fontSize: "14px",
    },
    discardContainer: {
        position: "absolute",
        bottom: "20px",
        right: "20px",
        textAlign: "center",
    },
    discardPile: {
        marginBottom: "10px", // Space between discard pile and button
    },
    discardButton: {
        padding: "10px 20px",
        fontSize: "16px",
        cursor: "pointer",
        backgroundColor: "#4CAF50",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
    },
};

export default GameBoard;