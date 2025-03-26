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
import LostSoul from "../assets/Lost Soul.png";
import Bullseye from "../assets/Bullseye.png";
import Hydra from "../assets/Hydra.png";
import Cyborg20xx from "../assets/Cyborg 20xx.png";

import dice1 from "../assets/dice1.png";
import dice2 from "../assets/dice2.png";
import dice3 from "../assets/dice3.png";
import dice4 from "../assets/dice4.png";
import dice5 from "../assets/dice5.png";
import dice6 from "../assets/dice6.png";

const GameBoard = () => {
    // Define your actual card data with types and affinities
    const cardList = [
        { id: 1, image: MooseDruid, type: "Warrior", affinity: "Druid" }, // Moose Druid has Druid affinity
        { id: 2, image: DarkGoblin, type: "Hero", affinity: "Dark" }, // Dark Goblin has Dark affinity
        { id: 3, image: DruidMask, type: "Item", affinity: "Druid" }, // Items and spells have no affinity
        { id: 4, image: DecoyDoll, type: "Item", affinity: null },
        { id: 5, image: CriticalBoost, type: "Spell", affinity: null },
        { id: 6, image: LostSoul, type: "Hero", affinity: "Undead" },
        { id: 7, image: Bullseye, type: "Hero", affinity: "Consort" },
        { id: 8, image: Hydra, type: "Hero", affinity: "Scalian" },
        { id: 9, image: Cyborg20xx, type: "Warrior", affinity: "Future" },
    ];

    // Helper function to generate a random hand of 5 cards
    const generateHand = () => {
        let hand = [];
        for (let i = 0; i < 5; i++) {
            const randomCard = { ...cardList[Math.floor(Math.random() * cardList.length)], uniqueId: i + Date.now() }; // Assign a unique identifier to each card
            hand.push(randomCard);
        }
        return hand;
    };
    const heroEffect = () => {
        
    }
    const castSpell = () => {
        if (!spellSlot) return;
        
        const currentActionPoints = currentPlayer === 1 ? player1ActionPoints : player2ActionPoints;
        const setCurrentActionPoints = currentPlayer === 1 ? setPlayer1ActionPoints : setPlayer2ActionPoints;
        const currentHand = currentPlayer === 1 ? player1Hand : player2Hand;
        const setCurrentHand = currentPlayer === 1 ? setPlayer1Hand : setPlayer2Hand;

        if (currentActionPoints < 1) {
            alert("Not enough action points to cast spell!");
            return;
        }
        // Perform spell effect based on spell type
        performSpellEffect(spellSlot);
        // Remove spell from hand
        setCurrentHand(prevHand => prevHand.filter(c => c.uniqueId !== spellSlot.uniqueId));
        // Add to discard pile
        setDiscardPile(prev => [...prev, spellSlot]);
        // Clear spell slot
        setSpellSlot(null);
        setSpellCastDisabled(true);
        // Deduct action point
        setCurrentActionPoints(prev => prev - 1);

        if (currentActionPoints - 1 === 0) {
            switchTurn();
        }
    }
    const performSpellEffect = (spell) => {
        // Implement different effects based on spell
        switch(spell.id) {
            case 5: // Critical Boost
                alert("Critical Boost spell cast! All heroes gain +1 power this turn.");
                break;
            // Add more cases for other spells
            default:
                alert(`${spell.name} spell cast!`);
        }
    };
    const handleSpellSlotDrop = (e) => {
        e.preventDefault();
        const isSpell = e.dataTransfer.getData("isSpell") === "true";
        
        if (!isSpell) {
            alert("Only spell cards can be placed in the spell slot!");
            return;
        }

        const card = JSON.parse(e.dataTransfer.getData("card"));
        setSpellSlot(card);
        setSpellCastDisabled(false);
    };

    // State variables
    const [player1Hand, setPlayer1Hand] = useState(generateHand());
    const [player2Hand, setPlayer2Hand] = useState(generateHand());
    const [playedCards1, setPlayedCards1] = useState(Array(5).fill(null)); // 5 slots for player 1
    const [playedCards2, setPlayedCards2] = useState(Array(5).fill(null)); // 5 slots for player 2
    const [discardPile, setDiscardPile] = useState([]);
    const [player1ActionPoints, setPlayer1ActionPoints] = useState(3); // Initial action points for player 1
    const [player2ActionPoints, setPlayer2ActionPoints] = useState(3); // Initial action points for player 2 (fixed typo)
    const [currentPlayer, setCurrentPlayer] = useState(1); // Initial player turn
    const [spellSlot, setSpellSlot] = useState(null);
    const [spellCastDisabled, setSpellCastDisabled] = useState(true);

    // Function to check action points and switch turn if necessary
    function checkActionPoints () {
        const currentActionPoints = currentPlayer === 1 ? player1ActionPoints : player2ActionPoints;
        if (currentActionPoints <= 0) {
            switchTurn();
            return false;
        }
        return true;
    };

    let intervalId = setInterval(checkWinCondition, 200);

    function checkWinCondition () {
        const checkPlayerWin = (playedCards) => {
            if (playedCards.every((card) => card && (card.type === "Hero" || card.type === "Warrior"))) {
                const affinities = playedCards.map((card) => card.affinity);
                const uniqueAffinities = new Set(affinities);
                clearInterval(intervalId);
                return uniqueAffinities.size === 5; // Check if all affinities are unique            
            }
            else {
                return false;
            }
        };
        if (checkPlayerWin(playedCards1)) {
            const playAgain = window.confirm("Player 1 wins! Do you want to play again?");
            if (playAgain) {
                window.location.href = "/local-game";
            } 
            else {
                window.location.href = "/"; // Navigate to MainPage.jsx
            }
        } 
        else if (checkPlayerWin(playedCards2)) {
            const playAgain = window.confirm("Player 2 wins! Do you want to play again?");
            if (playAgain) {
                window.location.href = "/local-game";
            } 
            else {
                window.location.href = "/"; // Navigate to MainPage.jsx
            }
        }
    };
    // Function to handle drawing a card
    const handleDrawCard = () => {
        if (!checkActionPoints()) return; // Check action points before proceeding

        const currentHand = currentPlayer === 1 ? player1Hand : player2Hand;
        const currentActionPoints = currentPlayer === 1 ? player1ActionPoints : player2ActionPoints;
        const setCurrentHand = currentPlayer === 1 ? setPlayer1Hand : setPlayer2Hand;
        const setCurrentActionPoints = currentPlayer === 1 ? setPlayer1ActionPoints : setPlayer2ActionPoints;

        // Check if the current player's hand already has 8 cards
        if (currentHand.length >= 8) {
            alert("You cannot have more than 8 cards in your hand!");
            return;
        }

        const randomCard = { ...cardList[Math.floor(Math.random() * cardList.length)], uniqueId: Date.now() }; // Assign a unique identifier

        // Add the random card to the current player's hand
        setCurrentHand((prevHand) => [...prevHand, randomCard]);
        setCurrentActionPoints((prev) => prev - 1);

        if (currentActionPoints - 1 === 0) {
            switchTurn();
        }
    };

    // Function to discard the entire hand
    const discardAllCards = () => {
        const currentActionPoints = currentPlayer === 1 ? player1ActionPoints : player2ActionPoints;
        const setCurrentActionPoints = currentPlayer === 1 ? setPlayer1ActionPoints : setPlayer2ActionPoints;
        const currentHand = currentPlayer === 1 ? player1Hand : player2Hand;
        const setCurrentHand = currentPlayer === 1 ? setPlayer1Hand : setPlayer2Hand;
    
        // Check if the player has at least 2 action points
        if (currentActionPoints < 2) {
            alert("Not enough action points to discard all cards!");
            return;
        }
    
        else if (currentHand.length === 0) {
            alert("No cards to discard!");
            return;
        }
    
        // Deduct 2 action points
        setCurrentActionPoints((prev) => prev - 2);
    
        // Move all cards from the current player's hand to the discard pile
        setDiscardPile((prevDiscardPile) => [
            ...prevDiscardPile,
            ...currentHand,
        ]);
        
        const newCards = generateHand(); // Assume drawNewCards is a function that draws a specified number of cards
        setCurrentHand(newCards);

        if (currentActionPoints - 2 === 0) {
            switchTurn();
        }
    };
    
    // Drag-and-drop handlers
    const handleDragStart = (e, card) => {
        e.dataTransfer.setData("card", JSON.stringify(card));
        e.dataTransfer.setData("isSpell", card.type === "Spell");
    
    };

    const handleDragOver = (e) => {
        e.preventDefault(); // Allow dropping
    };

    const handleDrop = (e, slotIndex) => {

        e.preventDefault();

        const currentActionPoints = currentPlayer === 1 ? player1ActionPoints : player2ActionPoints;
        const currentHand = currentPlayer === 1 ? player1Hand : player2Hand;
        const currentPlayedCards = currentPlayer === 1 ? playedCards1 : playedCards2; 
        const setCurrentHand = currentPlayer === 1 ? setPlayer1Hand : setPlayer2Hand;
        const setCurrentActionPoints = currentPlayer === 1 ? setPlayer1ActionPoints : setPlayer2ActionPoints;
        const setCurrentPlayedCards = currentPlayer === 1 ? setPlayedCards1 : setPlayedCards2;
        
        const card = JSON.parse(e.dataTransfer.getData("card")); // Retrieve the card data
        
        // Track the action points before attempting the play
        const initialActionPoints = currentActionPoints;
        
        // Determine if the slot is accessible by the current player
        if ((currentPlayer === 1 && slotIndex >= 0 && slotIndex < 5) || (currentPlayer === 2 && slotIndex >= 0 && slotIndex < 5)) {
            // Ensure only hero cards or item cards can be placed
            if ((card.type === "Hero" || (card.type === "Item" && currentPlayedCards[slotIndex]?.type === "Hero")) || (card.type === "Warrior" || (card.type === "Item" && currentPlayedCards[slotIndex]?.type === "Warrior"))) {
                setCurrentPlayedCards((prevPlayed) => {
                    const newPlayed = [...prevPlayed];
        
                    if (card.type === "Hero" || card.type === "Warrior") {
                        newPlayed[slotIndex] = { ...card, items: [] }; // Place the hero card in the specified slot with an empty items array
                    } else if (card.type === "Item" && (newPlayed[slotIndex]?.type === "Hero" || newPlayed[slotIndex]?.type === "Warrior")) {
                        // Check if the hero card already has an item attached
                        if (newPlayed[slotIndex].items.length < 1) {
                            newPlayed[slotIndex].items.push(card); // Attach the item to the hero card
                        } else {
                            alert("The hero card already has an item attached!");
                            return prevPlayed; // No need to update action points or hand as play is unsuccessful
                        }
                    } else {
                        alert("You can only place hero cards or attach items to hero cards!");
                        return prevPlayed; // No need to update action points or hand as play is unsuccessful
                    }
                    return newPlayed;
                });
        
                // If the play was successful, update the hand and action points
                if (initialActionPoints === currentActionPoints) {
                    setCurrentHand((prevHand) => prevHand.filter((c) => c.uniqueId !== card.uniqueId));
                    setCurrentActionPoints((prev) => prev - 1);
                    // Check if the action points are zero to switch turn
                    if (currentActionPoints - 1 === 0) {
                        switchTurn();
                    }
                }
            }
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

            {/* Player 2 Card Slots */}
            <div style={styles.playArea}>
                {playedCards2.map((card, index) => (
                    <div
                        key={index}
                        style={styles.slot}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, index)}
                    >
                        {card ? (
                            <div style={styles.card}>
                                <img src={card.image} alt={`Card ${card.id}`} style={styles.cardImage} />
                                {/* Display attached items if any */}
                                {card.items && card.items.length > 0 && (
                                    <div style={styles.items}>
                                    {card.items.map((item, itemIndex) => (
                                        <img key={itemIndex} src={item.image} alt={`Item ${item.id}`} style={styles.itemImage} />
                                    ))}
                                </div>
                                )}
                            </div>
                        ) : (
                            <div style={styles.emptySlot}>Slot {index + 1}</div>
                        )}
                        
                    </div>
                ))}
            </div>
            {/* Player 1 Card Slots */}
            <div style={styles.playArea}>
                {playedCards1.map((card, index) => (
                    <div
                        key={index}
                        style={styles.slot}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, index)}
                    >
                        {card ? (
                            <div style={styles.card}>
                                <img src={card.image} alt={`Card ${card.id}`} style={styles.cardImage} />
                                {/* Display attached items if any */}
                                {card.items && card.items.length > 0 && (
                                    <div style={styles.items}>
                                    {card.items.map((item, itemIndex) => (
                                        <img key={itemIndex} src={item.image} alt={`Item ${item.id}`} style={styles.itemImage} />
                                    ))}
                                </div>
                                )}
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
                    <div key={card.uniqueId} draggable onDragStart={(e) => handleDragStart(e, card)} style={styles.card}>
                        <img src={card.image} alt={`Card ${card.id}`} style={styles.cardImage} />
                    </div>
                ))}
            </div>

            <div style={styles.spellContainer}>
                {/* Spell Slot */}
                <div 
                    style={styles.spellSlot}
                    onDragOver={handleDragOver}
                    onDrop={handleSpellSlotDrop}
                >
                    {spellSlot ? (
                        <div style={styles.card}>
                            <img src={spellSlot.image} alt={`Spell ${spellSlot.id}`} style={styles.cardImage} />
                        </div>
                    ) : (
                        <div style={styles.emptySlot}>Spell Slot</div>
                    )}
                </div>
                
                {/* Cast Spell Button - now outside the slot div */}
                <button 
                    onClick={castSpell} 
                    style={styles.spellButton}
                    disabled={spellCastDisabled}
                >
                    Cast Spell 
                </button>
            </div>

            {/* Discard Pile and Discard Button - remains the same */}
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
                    Discard Deck
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
        height: "920px",
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
        position: "relative", // For positioning item card
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
    spellContainer: {
        position: "absolute",
        bottom: "320px", // Position above discard pile
        right: "20px",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "10px",
    },
    // Updated spell slot style
    spellSlot: {
        width: "150px",
        height: "200px",
        border: "2px dashed #ccc",
        borderRadius: "10px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#1E7149",
    },
    // Updated spell button style
    spellButton: {
        padding: "8px 16px",
        fontSize: "14px",
        cursor: "pointer",
        backgroundColor: "#4CAF50",
        color: "#fff",
        border: "none",
        borderRadius: "5px",
        width: "150px", // Match width with spell slot
    },
    // Adjust discard container to be below
    discardContainer: {
        position: "absolute",
        bottom: "50px",
        right: "20px",
        textAlign: "center",
        marginTop: "20px",
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
    items: {
        position: "absolute",
        bottom: "0",
        right: "0",
        width: "33%", // Quarter of the card size
        height: "33%", // Quarter of the card size
        borderRadius: "5px", // Smaller border radius for item cards
    },
    itemImage: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
    },
};

export default GameBoard
