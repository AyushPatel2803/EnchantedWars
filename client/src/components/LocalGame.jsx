import React, { useState, useEffect } from "react";
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
    // Define your actual card data with types and affinities
    const cardList = [
        { id: 1, image: MooseDruid, type: "Hero", affinity: "Druid" }, // Moose Druid has Druid affinity
        { id: 2, image: DarkGoblin, type: "Hero", affinity: "Dark" }, // Dark Goblin has Dark affinity
        { id: 3, image: DruidMask, type: "Item", affinity: null }, // Items and spells have no affinity
        { id: 4, image: DecoyDoll, type: "Spell", affinity: null },
        { id: 5, image: CriticalBoost, type: "Spell", affinity: null },
    ];

    // Helper function to generate a random hand of 5 cards
    const generateHand = () => {
        let hand = [];
        for (let i = 0; i < 5; i++) {
            const randomCard = cardList[Math.floor(Math.random() * cardList.length)];
            hand.push(randomCard);
        }
        return hand;
    };

    // State variables
    const [player1Hand, setPlayer1Hand] = useState(generateHand());
    const [player2Hand, setPlayer2Hand] = useState(generateHand());
    const [playedCards, setPlayedCards] = useState(Array(10).fill(null)); // 10 slots for played cards (2x5 grid)
    const [discardPile, setDiscardPile] = useState([]);
    const [player1ActionPoints, setPlayer1ActionPoints] = useState(3); // Initial action points for player 1
    const [player2ActionPoints, setPlayer2ActionPoints] = useState(3); // Initial action points for player 2
    const [currentPlayer, setCurrentPlayer] = useState(1); // Initial player turn

    // Function to handle drawing a card
    const handleDrawCard = () => {
        const currentHand = currentPlayer === 1 ? player1Hand : player2Hand;
        const currentActionPoints = currentPlayer === 1 ? player1ActionPoints : player2ActionPoints;
        const setCurrentHand = currentPlayer === 1 ? setPlayer1Hand : setPlayer2Hand;
        const setCurrentActionPoints = currentPlayer === 1 ? setPlayer1ActionPoints : setPlayer2ActionPoints;

        // Check if the current player's hand already has 8 cards
        if (currentHand.length >= 8) {
            alert("You cannot have more than 8 cards in your hand!");
            return;
        }

        if (currentActionPoints > 0) {
            // Generate a random card
            const randomCard = cardList[Math.floor(Math.random() * cardList.length)];

            // Add the random card to the current player's hand
            setCurrentHand((prevHand) => [...prevHand, randomCard]);
            setCurrentActionPoints((prev) => prev - 1);
        }

        if (currentActionPoints - 1 === 0) {
            switchTurn();
        }
    };

    // Function to discard the entire hand
    const discardAllCards = () => {
        const currentHand = currentPlayer === 1 ? player1Hand : player2Hand;
        const setCurrentHand = currentPlayer === 1 ? setPlayer1Hand : setPlayer2Hand;

        if (currentHand.length === 0) {
            alert("No cards to discard!");
            return;
        }

        // Move all cards from the current player's hand to the discard pile
        setDiscardPile((prevDiscardPile) => [
            ...prevDiscardPile,
            ...currentHand,
        ]);

        // Clear the current player's hand
        setCurrentHand([]);
    };

    // Drag-and-drop handlers
    const handleDragStart = (e, card) => {
        e.dataTransfer.setData("card", JSON.stringify(card)); // Store the card data
    };

    const handleDragOver = (e) => {
        e.preventDefault(); // Allow dropping
    };

    const handleDrop = (e, slotIndex) => {
        const currentActionPoints = currentPlayer === 1 ? player1ActionPoints : player2ActionPoints;
        const setCurrentHand = currentPlayer === 1 ? setPlayer1Hand : setPlayer2Hand;
        const currentHand = currentPlayer === 1 ? player1Hand : player2Hand;
        const setCurrentActionPoints = currentPlayer === 1 ? setPlayer1ActionPoints : setPlayer2ActionPoints;

        if (currentActionPoints > 0) {
            e.preventDefault();
            const card = JSON.parse(e.dataTransfer.getData("card")); // Retrieve the card data

            // Determine if the slot is accessible by the current player
            if ((currentPlayer === 1 && slotIndex >= 5) || (currentPlayer === 2 && slotIndex < 5)) {
                // Move the card from the current player's hand to the play area
                setCurrentHand((prevHand) => prevHand.filter((c) => c.id !== card.id));

                setPlayedCards((prevPlayed) => {
                    const newPlayed = [...prevPlayed];
                    newPlayed[slotIndex] = card; // Place the card in the specified slot
                    return newPlayed;
                });

                setCurrentActionPoints((prev) => prev - 1);
            }
        }

        if (currentActionPoints - 1 === 0) {
            switchTurn();
        }
    };

    // Function to switch to the next player's turn
    const switchTurn = () => {
        setCurrentPlayer((prev) => (prev === 1 ? 2 : 1));
        // Reset action points for the next player
        setPlayer1ActionPoints(3);
        setPlayer2ActionPoints(3);
    };

    // Get the last discarded card (or null if the discard pile is empty)
    const lastDiscardedCard = discardPile.length > 0 ? discardPile[discardPile.length - 1] : null;

    return (
        <div style={styles.gameBoard}>
            <Timer />
            <ActionPoints points={currentPlayer === 1 ? player1ActionPoints : player2ActionPoints} />
            <DrawCard onClick={handleDrawCard} />

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

            {/* Player Hands */}
            <h2>Player {currentPlayer} Hand</h2>
            <div style={styles.hand}>
                {(currentPlayer === 1 ? player1Hand : player2Hand).map((card) => (
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
        height: "1000px",
    },
    playerName: {
        position: "absolute",
        top: "20px",
        right: "20px",
        color: "#fff",
        fontSize: "20px",
        fontWeight: "bold",
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
        objectFit: "cover", // Ensure the image fits within the card
    },
    playArea: {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "space-between", // Space out the cards evenly
        width: "800px", // Fixed width to accommodate two rows of five cards
        margin: "0 auto", // Center the play area horizontally
        gap: "5px", // Adjusts the gap between cards
        marginTop: "2px",
    },
    slot: {
        width: "150px",
        height: "200px",
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

