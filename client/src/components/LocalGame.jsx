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
import Switcheroo from "../assets/Switcheroo.png";
import MAD from "../assets/MAD.png";

import dice1 from "../assets/dice1.png";
import dice2 from "../assets/dice2.png";
import dice3 from "../assets/dice3.png";
import dice4 from "../assets/dice4.png";
import dice5 from "../assets/dice5.png";
import dice6 from "../assets/dice6.png";

const GameBoard = () => {
    // Define your actual card data with types and affinities
    const cardList = [
        { id: 1, image: MooseDruid, type: "Hero", affinity: "Druid", min: 5, max: 7}, // Moose Druid has Druid affinity
        { id: 2, image: DarkGoblin, type: "Hero", affinity: "Dark" , min: 0, max: 6}, // Dark Goblin has Dark affinity
        { id: 3, image: DruidMask, type: "Item", affinity: "Druid" , min: 4, max: 10}, // Items and spells have no affinity
        { id: 4, image: DecoyDoll, type: "Item", affinity: null },
        { id: 5, image: CriticalBoost, type: "Spell", affinity: null },
        { id: 6, image: LostSoul, type: "Hero", affinity: "Undead" , min: 0, max: 6},
        { id: 7, image: Bullseye, type: "Hero", affinity: "Consort" , min: 0, max: 4},
        { id: 8, image: Hydra, type: "Hero", affinity: "Serpentine" , min: 0, max: 0},
        { id: 9, image: Cyborg20xx, type: "Hero", affinity: "Future", min: 4, max: 10},
        { id: 10, image: Switcheroo, type: "Spell"},
        { id: 11, image: MAD, type: "Spell"},
    ];
    // State Variables
    const handleMouseEnter = (card, slotIndex) => {
        if (card.type == "Hero" && card.max != 0) {
            setHoveredCard({ card, slotIndex });
        }
    };
    
    const handleMouseLeave = () => {
        setHoveredCard(null);
    };
    // Helper function to generate a random hand of 5 cards
    const generateHand = () => {
        let hand = [];
        for (let i = 0; i < 5; i++) {
            const randomCard = { ...cardList[Math.floor(Math.random() * cardList.length)], uniqueId: i + Date.now() }; // Assign a unique identifier to each card
            hand.push(randomCard);
        }
        return hand;
    };
    //State Variables
    const [player1Hand, setPlayer1Hand] = useState(generateHand());
    const [player2Hand, setPlayer2Hand] = useState(generateHand());
    const [playedCards1, setPlayedCards1] = useState(Array(5).fill(null)); // 5 slots for player 1
    const [playedCards2, setPlayedCards2] = useState(Array(5).fill(null)); // 5 slots for player 2
    const [discardPile, setDiscardPile] = useState([]);
    const [player1ActionPoints, setPlayer1ActionPoints] = useState(3); // Initial action points for player 1
    const [player2ActionPoints, setPlayer2ActionPoints] = useState(3); // Initial action points for player 2 (fixed typo)
    const [currentPlayer, setCurrentPlayer] = useState(1); // Initial player turn
    const [hoveredCard, setHoveredCard] = useState(null);
    const [diceRolls, setDiceRolls] = useState({ first: null, second: null });
    const [hoveredSpell, setHoveredSpell] = useState(null);
    const [swapSpellActive, setSwapSpellActive] = useState(false);
    const [selectedOwnHero, setSelectedOwnHero] = useState(null);
    const [selectedOpponentHero, setSelectedOpponentHero] = useState(null);
    const [destroyMode, setDestroyMode] = useState(false);
    const [selectingFromDeck, setSelectingFromDeck] = useState(false);
    const [topCards, setTopCards] = useState([]);
    const opponentPlayedCards = currentPlayer === 1 ? playedCards2 : playedCards1;
    const hasHero = opponentPlayedCards.some(card => card && card.type === "Hero");

    function getBonus() {
        const currentPlayedCards = currentPlayer === 1 ? playedCards1 : playedCards2;
        // Count how many Hydras (id: 8) are in the current player's slots
        const bonus = currentPlayedCards.filter(card => card && card.id === 8).length;
        return bonus; // Returns 0, 1, 2, etc.
    };

    const heroEffect = (card, slotIndex) => {
        if (!card || (card.type !== "Hero")) return;
        
        const currentActionPoints = currentPlayer === 1 ? player1ActionPoints : player2ActionPoints;
        const setCurrentActionPoints = currentPlayer === 1 ? setPlayer1ActionPoints : setPlayer2ActionPoints;
        const currentPlayedCards = currentPlayer === 1 ? playedCards1 : playedCards2;
        const setCurrentPlayedCards = currentPlayer === 1 ? setPlayedCards1 : setPlayedCards2;
        
        // Get Hydra bonus based on count
        const bonus = getBonus();
        
        // Perform hero-specific effect
        const roll1 = Math.floor(Math.random() * 6) + 1;
        const roll2 = Math.floor(Math.random() * 6) + 1;
        
        setDiceRolls({ first: roll1, second: roll2 });
        // Calculate total roll with Hydra bonus
        const totalRoll = roll1 + roll2 + bonus;
        
        switch(card.id) {
            case 1: // Moose Druid
                if (totalRoll >= card.max) {
                    activateDestroyMode();
                    return;
                }
                else if (totalRoll <= card.min) {
                    setDiscardPile(prev => [...prev, card]);
                    setCurrentPlayedCards(prev => {
                        const newPlayed = [...prev];
                        newPlayed[slotIndex] = null;
                        return newPlayed;
                    });
                    break;
                }
                else {
                    alert(`${totalRoll} - Normal roll`);
                }
                break;
            case 2:
                if (totalRoll >= card.max) {
                    pullFromOpponent()
                }
                break;
            case 6:
                if (totalRoll >= card.max) {
                    drawFromDiscard()
                }
                break;
            case 7:
                if (totalRoll >= card.max) {
                    drawFromTopThree()
                    return;
                }
                break;
            case 9: // Cyborg 20xx
                if (totalRoll >= card.max) {
                    activateDestroyMode();
                    return;
                }
                else if (totalRoll <= card.min) {
                    discardCard();
                    discardCard();
                    alert("Critical failure! Discarded 2 cards.");
                }
                else {
                    alert(`${totalRoll} - Normal roll`);
                }
                break;
            default:
                alert(`${totalRoll} - Normal roll`);
                break;
        }
        
        setCurrentActionPoints(prev => prev - 1);
    
        if (currentActionPoints - 1 === 0) {
            switchTurn();
        }
    };
    const castSpell = (spellCard) => {
        const currentHand = currentPlayer === 1 ? player1Hand : player2Hand;
        const setCurrentHand = currentPlayer === 1 ? setPlayer1Hand : setPlayer2Hand;
        const setCurrentActionPoints = currentPlayer === 1 ? setPlayer1ActionPoints : setPlayer2ActionPoints;
    
        // Handle different spell effects directly
        switch(spellCard.id) {
            case 5: { // Critical Boost
                // Check if player has room for 3 more cards
                if (currentHand.length + 3 > 8 ) {
                    alert("Critical Boost failed! Your hand would exceed 8 cards.");
                    return;
                }
                
                // Draw 3 cards without consuming action points
                for (let i = 0; i < 3; i++) {
                    const randomCard = { 
                        ...cardList[Math.floor(Math.random() * cardList.length)], 
                        uniqueId: Date.now() + i 
                    };
                    setCurrentHand(prevHand => [...prevHand, randomCard]);
                }
                discardCard()

                break;
            }
            case 10: { // Switcheroo
                activateSwapSpell();
                break;
            }
            case 11: {
                if (hasHero && currentHand.length - 2 > 0) {
                    activateDestroyMode();
                    discardCard();
                    discardCard();
                    break;
                }
                else {
                    alert('Not enough cards to make sacrifice')
                    return;
                }
                break;
            }
            default:
                alert(`${spellCard.name} spell cast!`);
        }
        
        // Remove the spell from hand and add to discard pile
        setCurrentHand(prevHand => prevHand.filter(c => c.uniqueId !== spellCard.uniqueId));
        setDiscardPile(prev => [...prev, spellCard]);
            
        if ((currentPlayer === 1 ? player1ActionPoints : player2ActionPoints) - 1 === 0) {
            switchTurn();
        }
    };
    
    // Function to check action points and switch turn if necessary
    function checkActionPoints() {
        if (destroyMode) return true; // Skip turn switching while in destroy mode
        
        const currentActionPoints = currentPlayer === 1 ? player1ActionPoints : player2ActionPoints;
        if (currentActionPoints <= 0) {
            switchTurn();
            return false;
        }
        return true;
    };

    let intervalId = setInterval(checkWinCondition, 200);

    function checkWinCondition() {
        const checkPlayerWin = (playedCards) => {
            if (playedCards.every((card) => card && (card.type === "Hero"))) {
                const affinities = playedCards.map((card) => {
                    // Check if the card has an equipped item with a different affinity
                    if (card.items && card.items.length > 0 && card.items[0].affinity) {
                        clearInterval(intervalId);
                        return card.items[0].affinity; // Use item's affinity if it exists
                    }
                    return card.affinity; // Otherwise use hero's affinity
                });
                const uniqueAffinities = new Set(affinities);
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
                window.location.href = "/";
            }
        } 
        else if (checkPlayerWin(playedCards2)) {
            const playAgain = window.confirm("Player 2 wins! Do you want to play again?");
            if (playAgain) {
                window.location.href = "/local-game";
            } 
            else {
                window.location.href = "/";
            }
        }
    }
    function discardCard() {

        const currentHand = currentPlayer === 1 ? player1Hand : player2Hand;
        const setCurrentHand = currentPlayer === 1 ? setPlayer1Hand : setPlayer2Hand;
    
        // Check if the current player's hand is empty
        if (currentHand.length === 0) {
            alert("No cards to discard!");
            return;
        }
    
        // Select a random card from the hand
        const randomIndex = Math.floor(Math.random() * currentHand.length);
        const cardToDiscard = currentHand[randomIndex];
    
        // Remove the card from hand and add to discard pile
        setCurrentHand(prevHand => prevHand.filter((_, index) => index !== randomIndex));
        setDiscardPile(prev => [...prev, cardToDiscard]);
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
    const drawFromTopThree = () => {
        // Generate 3 random cards to represent the top of the deck
        const newTopCards = [];
        for (let i = 0; i < 3; i++) {
            const randomCard = { 
                ...cardList[Math.floor(Math.random() * cardList.length)], 
                uniqueId: Date.now() + i 
            };
            newTopCards.push(randomCard);
        }
        
        setTopCards(newTopCards);
        setSelectingFromDeck(true);
    };
    
    const selectCardFromTopThree = (selectedCard) => {
        const currentHand = currentPlayer === 1 ? player1Hand : player2Hand;
        const setCurrentHand = currentPlayer === 1 ? setPlayer1Hand : setPlayer2Hand;
        const setCurrentActionPoints = currentPlayer === 1 ? setPlayer1ActionPoints : setPlayer2ActionPoints;
    
        // Check if hand is full
        if (currentHand.length >= 8) {
            alert("Your hand is full (max 8 cards)!");
            setSelectingFromDeck(false);
            return;
        }
    
        // Add selected card to hand
        setCurrentHand(prev => [...prev, selectedCard]);
        
        // Deduct action point
        setCurrentActionPoints(prev => prev - 1);
        
        // Exit selection mode
        setSelectingFromDeck(false);
        
        // Check if turn should switch
        if ((currentPlayer === 1 ? player1ActionPoints : player2ActionPoints) - 1 === 0) {
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
        if (card.type !== "Spell") { // Only allow dragging non-spell cards
            e.dataTransfer.setData("card", JSON.stringify(card));
            e.dataTransfer.setData("isSpell", card.type === "Spell");
        }
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
        
        const card = JSON.parse(e.dataTransfer.getData("card"));
        
        if (card.type !== "Item" && currentPlayedCards[slotIndex] !== null) {
            return;
        }
        // Determine if the slot is accessible by the current player
        if ((currentPlayer === 1 && slotIndex >= 0 && slotIndex < 5) || (currentPlayer === 2 && slotIndex >= 0 && slotIndex < 5)) {
            // Check for invalid placements first
            if (card.type === "Item") {
                const targetCard = currentPlayedCards[slotIndex];
                if (!targetCard || (targetCard.type !== "Hero")) {
                    return;
                }
                if (targetCard.items?.length >= 1) {
                    return;
                }
            }
    
            // If we get here, the placement is valid
            setCurrentPlayedCards((prevPlayed) => {
                const newPlayed = [...prevPlayed];
                if (card.type === "Hero") {
                    newPlayed[slotIndex] = { ...card, items: [] };
                } else if (card.type === "Item") {
                    const updatedCard = { ...newPlayed[slotIndex] };
                    updatedCard.items = [...(updatedCard.items || []), card];
                    newPlayed[slotIndex] = updatedCard;
                }
                
                return newPlayed;
            });
    
            // Only update hand and action points if we actually placed a card
            setCurrentHand((prevHand) => prevHand.filter((c) => c.uniqueId !== card.uniqueId));
            setCurrentActionPoints((prev) => prev - 1);
            
            // Check if the action points are zero to switch turn
            if (currentActionPoints - 1 === 0) {
                switchTurn();
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

    const activateSwapSpell = () => {
        setSwapSpellActive(true);
        setSelectedOwnHero(null);
        setSelectedOpponentHero(null);
    };
    
    const cancelSwapSpell = () => {
        setSwapSpellActive(false);
        setSelectedOwnHero(null);
        setSelectedOpponentHero(null);
    };
    
    const selectOwnHero = (slotIndex) => {
        const currentPlayedCards = currentPlayer === 1 ? playedCards1 : playedCards2;
        const card = currentPlayedCards[slotIndex];
        
        if (card && card.type === "Hero" && card.items?.length > 0) {
            setSelectedOwnHero(slotIndex);
        }
    };
    
    const selectOpponentHero = (slotIndex) => {
        const opponentPlayedCards = currentPlayer === 1 ? playedCards2 : playedCards1;
        const card = opponentPlayedCards[slotIndex];
        
        if (card && card.type === "Hero" && card.items?.length > 0) {
            setSelectedOpponentHero(slotIndex);
        }
    };

    const activateDestroyMode = () => {
        if (!hasHero) {
            alert("Opponent has no Hero cards to destroy!");
            return;
        }
        setDestroyMode(true);
    };

    const destroyOpponentHero = (slotIndex) => {
        const opponentPlayedCards = currentPlayer === 1 ? playedCards2 : playedCards1;
        const setOpponentPlayedCards = currentPlayer === 1 ? setPlayedCards2 : setPlayedCards1;
        const setCurrentActionPoints = currentPlayer === 1 ? setPlayer1ActionPoints : setPlayer2ActionPoints;
        const currentActionPoints = currentPlayer === 1 ? player1ActionPoints : player2ActionPoints;
    
        // Check if the selected slot has a hero card
        if (!opponentPlayedCards[slotIndex] || opponentPlayedCards[slotIndex].type !== "Hero") {
            alert("No Hero card in this slot to destroy!");
            return;
        }
    
        const heroCard = opponentPlayedCards[slotIndex];
        
        // Check if hero has a Decoy Doll equipped
        const hasDecoyDoll = heroCard.items?.some(item => item.id === 4);
    
        if (hasDecoyDoll) {
            // Remove the Decoy Doll instead of the hero
            setOpponentPlayedCards(prev => {
                const newPlayed = [...prev];
                newPlayed[slotIndex] = {
                    ...newPlayed[slotIndex],
                    items: newPlayed[slotIndex].items.filter(item => item.id !== 4)
                };
                return newPlayed;
            });
    
            // Add Decoy Doll to discard pile
            const decoyDoll = heroCard.items.find(item => item.id === 4);
            setDiscardPile(prev => [...prev, decoyDoll]);
            
            alert("Decoy Doll was destroyed instead of the Hero!");
        } else {
            // Move the hero to discard pile
            setDiscardPile(prev => [...prev, heroCard]);
            
            // Remove the hero from opponent's played cards
            setOpponentPlayedCards(prev => {
                const newPlayed = [...prev];
                newPlayed[slotIndex] = null;
                return newPlayed;
            });
        }
        
        // Deduct action point only after successful destruction
        setCurrentActionPoints(prev => prev - 1);
        
        setDestroyMode(false);

        return;
    
    };
    const pullFromOpponent = () => {
        if (!checkActionPoints()) return; // Check if player has action points
        
        const currentHand = currentPlayer === 1 ? player1Hand : player2Hand;
        const setCurrentHand = currentPlayer === 1 ? setPlayer1Hand : setPlayer2Hand;
        const opponentHand = currentPlayer === 1 ? player2Hand : player1Hand;
        const setOpponentHand = currentPlayer === 1 ? setPlayer2Hand : setPlayer1Hand;
        const setCurrentActionPoints = currentPlayer === 1 ? setPlayer1ActionPoints : setPlayer2ActionPoints;
    
        // Check if opponent has cards
        if (opponentHand.length === 0) {
            alert("Opponent has no cards to take!");
            return;
        }
    
        // Check if current player's hand is full
        if (currentHand.length >= 8) {
            alert("Your hand is full (max 8 cards)!");
            return;
        }
    
        // Select random card from opponent's hand
        const randomIndex = Math.floor(Math.random() * opponentHand.length);
        const stolenCard = opponentHand[randomIndex];
    
        // Update both players' hands
        setOpponentHand(prev => prev.filter((_, index) => index !== randomIndex));
        setCurrentHand(prev => [...prev, {
            ...stolenCard,
            uniqueId: Date.now() // Assign new unique ID
        }]);
    };
    const drawFromDiscard = () => {
        
        const currentHand = currentPlayer === 1 ? player1Hand : player2Hand;
        const setCurrentHand = currentPlayer === 1 ? setPlayer1Hand : setPlayer2Hand;
    
        // Check if discard pile is empty
        if (discardPile.length === 0) {
            alert("Discard pile is empty!");
            return;
        }
    
        // Check if hand is full
        if (currentHand.length >= 8) {
            alert("Your hand is full (max 8 cards)!");
            return;
        }
    
        // Get last discarded card
        const lastDiscarded = discardPile[discardPile.length - 1];
        
        // Add to player's hand with new unique ID
        const drawnCard = {
            ...lastDiscarded,
            uniqueId: Date.now() // Assign new unique ID
        };
    
        // Update state
        setCurrentHand(prev => [...prev, drawnCard]);
        setDiscardPile(prev => prev.slice(0, -1)); // Remove from discard pile

    };
    const swapItems = () => {
        if (selectedOwnHero === null || selectedOpponentHero === null) {
            alert("Please select both heroes to swap items!");
            return;
        }
    
        const setCurrentPlayedCards = currentPlayer === 1 ? setPlayedCards1 : setPlayedCards2;
        const setOpponentPlayedCards = currentPlayer === 1 ? setPlayedCards2 : setPlayedCards1;
        
        setCurrentPlayedCards(prev => {
            const newPlayed = [...prev];
            const opponentItems = [...(playedCards2[selectedOpponentHero]?.items || [])];
            
            if (newPlayed[selectedOwnHero]) {
                newPlayed[selectedOwnHero] = {
                    ...newPlayed[selectedOwnHero],
                    items: opponentItems
                };
            }
            return newPlayed;
        });
    
        setOpponentPlayedCards(prev => {
            const newPlayed = [...prev];
            const ownItems = [...(playedCards1[selectedOwnHero]?.items || [])];
            
            if (newPlayed[selectedOpponentHero]) {
                newPlayed[selectedOpponentHero] = {
                    ...newPlayed[selectedOpponentHero],
                    items: ownItems
                };
            }
            return newPlayed;
        });
    
        // Reset after swap
        setSwapSpellActive(false);
        setSelectedOwnHero(null);
        setSelectedOpponentHero(null);
        
        // Deduct action point
        const setCurrentActionPoints = currentPlayer === 1 ? setPlayer1ActionPoints : setPlayer2ActionPoints;
        setCurrentActionPoints(prev => prev - 1);
        
        if ((currentPlayer === 1 ? player1ActionPoints : player2ActionPoints) - 1 === 0) {
            switchTurn();
        }
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
                        key={`player2-${index}`}
                        style={styles.slot}
                        onDragOver={handleDragOver}
                        onDrop={(e) => currentPlayer === 2 && handleDrop(e, index)}
                        onMouseEnter={() => currentPlayer === 2 && handleMouseEnter(card, index)}
                        onMouseLeave={currentPlayer === 2 ? handleMouseLeave : undefined}
                    >
                        {card ? (
                            <div style={styles.card}>
                                <img src={card.image} alt={`Card ${card.id}`} style={styles.cardImage} />
                                {card.items && card.items.length > 0 && (
                                    <div style={styles.items}>
                                        {card.items.map((item, itemIndex) => (
                                            <img key={`player2-item-${itemIndex}`} src={item.image} alt={`Item ${item.id}`} style={styles.itemImage} />
                                        ))}
                                    </div>
                                )}
                                {card.type === "Hero" && hoveredCard?.slotIndex === index && currentPlayer === 2 && (
                                    <div style={styles.heroEffectContainer}>
                                        <button 
                                            onClick={() => heroEffect(card, index)} 
                                            style={styles.heroEffectButton}
                                        >
                                            Hero Roll
                                        </button>
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
                        key={`player1-${index}`}
                        style={styles.slot}
                        onDragOver={handleDragOver}
                        onDrop={(e) => currentPlayer === 1 && handleDrop(e, index)}
                        onMouseEnter={() => currentPlayer === 1 && handleMouseEnter(card, index)}
                        onMouseLeave={currentPlayer === 1 ? handleMouseLeave : undefined}
                    >
                        {card ? (
                            <div style={styles.card}>
                                <img src={card.image} alt={`Card ${card.id}`} style={styles.cardImage} />
                                {card.items && card.items.length > 0 && (
                                    <div style={styles.items}>
                                        {card.items.map((item, itemIndex) => (
                                            <img key={`player1-item-${itemIndex}`} src={item.image} alt={`Item ${item.id}`} style={styles.itemImage} />
                                        ))}
                                    </div>
                                )}
                                {card.type === "Hero" && hoveredCard?.slotIndex === index && currentPlayer === 1 && (
                                    <div style={styles.heroEffectContainer}>
                                        <button 
                                            onClick={() => heroEffect(card, index)} 
                                            style={styles.heroEffectButton}
                                        >
                                            Hero Roll
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div style={styles.emptySlot}>Slot {index + 1}</div>
                        )}
                    </div>
                ))}
            </div>
            {/* Player Hand */}
            <h2>Player {currentPlayer} Hand</h2>
                <div style={styles.hand}>
                    {(currentPlayer === 1 ? player1Hand : player2Hand).map((card) => (
                        <div 
                            key={`hand-${card.uniqueId}`}
                            draggable 
                            onDragStart={(e) => handleDragStart(e, card)} 
                            style={styles.card}
                            onMouseEnter={() => card.type === "Spell" && setHoveredSpell(card)}
                            onMouseLeave={() => card.type === "Spell" && setHoveredSpell(null)}
                        >
                            <img src={card.image} alt={`Card ${card.id}`} style={styles.cardImage} />
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
                    Replace Hand
                </button>
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
            {/* Add this near your other UI elements */}
                {swapSpellActive && (
                    <div style={{ 
                        position: 'fixed', 
                        top: 0, 
                        left: 0, 
                        right: 0, 
                        bottom: 0, 
                        backgroundColor: 'rgba(0,0,0,0.7)', 
                        zIndex: 99,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white'
                    }}>
                        <h2>Select your hero with an item</h2>
                        <div style={styles.playArea}>
                            {(currentPlayer === 1 ? playedCards1 : playedCards2).map((card, index) => (
                                <div
                                    key={`select-own-${index}`}
                                    style={{
                                        ...styles.slot,
                                        border: selectedOwnHero === index ? '4px solid yellow' : '2px dashed #ccc'
                                    }}
                                    onClick={() => selectOwnHero(index)}
                                >
                                    {card && (
                                        <div style={styles.card}>
                                            <img src={card.image} alt={`Card ${card.id}`} style={styles.cardImage} />
                                            {card.items?.length > 0 && (
                                                <div style={styles.items}>
                                                    {card.items.map((item, itemIndex) => (
                                                        <img key={`select-item-${itemIndex}`} src={item.image} alt={`Item ${item.id}`} style={styles.itemImage} />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <h2>Select opponent's hero with an item</h2>
                        <div style={styles.playArea}>
                            {(currentPlayer === 1 ? playedCards2 : playedCards1).map((card, index) => (
                                <div
                                    key={`select-opponent-${index}`}
                                    style={{
                                        ...styles.slot,
                                        border: selectedOpponentHero === index ? '4px solid yellow' : '2px dashed #ccc'
                                    }}
                                    onClick={() => selectOpponentHero(index)}
                                >
                                    {card && (
                                        <div style={styles.card}>
                                            <img src={card.image} alt={`Card ${card.id}`} style={styles.cardImage} />
                                            {card.items?.length > 0 && (
                                                <div style={styles.items}>
                                                    {card.items.map((item, itemIndex) => (
                                                        <img key={`select-opponent-item-${itemIndex}`} src={item.image} alt={`Item ${item.id}`} style={styles.itemImage} />
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <button 
                            onClick={swapItems} 
                            disabled={selectedOwnHero === null || selectedOpponentHero === null}
                            style={styles.spellEffectButton}
                        >
                            Swap Items
                        </button>
                        <button 
                            onClick={cancelSwapSpell} 
                            style={styles.cancelButton}
                        >
                            Cancel
                        </button>
                    </div>
                )}
                {/* Destroy Opponents Hero */}

                {destroyMode && (
                        <div style={{ 
                            position: 'fixed', 
                            top: 0, 
                            left: 0, 
                            right: 0, 
                            bottom: 0, 
                            backgroundColor: 'rgba(0,0,0,0.7)', 
                            zIndex: 99,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white'
                        }}>
                            <h2>Select an opponent Hero to destroy</h2>
                            <div style={styles.playArea}>
                                {(currentPlayer === 1 ? playedCards2 : playedCards1).map((card, index) => (
                                    <div
                                        key={`destroy-opponent-${index}`}
                                        style={{
                                            ...styles.slot,
                                            border: card && card.type === "Hero" ? '4px solid red' : '2px dashed #ccc',
                                            cursor: card && card.type === "Hero" ? 'pointer' : 'default'
                                        }}
                                        onClick={() => card && card.type === "Hero" && destroyOpponentHero(index)}
                                    >
                                        {card && (
                                            <div style={styles.card}>
                                                <img src={card.image} alt={`Card ${card.id}`} style={styles.cardImage} />
                                                {card.items?.length > 0 && (
                                                    <div style={styles.items}>
                                                        {card.items.map((item, itemIndex) => (
                                                            <img key={`destroy-item-${itemIndex}`} src={item.image} alt={`Item ${item.id}`} style={styles.itemImage} />
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                            <button 
                                onClick={() => setDestroyMode(false)} 
                                style={styles.cancelButton}
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                {selectingFromDeck && (
                    <div style={styles.selectionModal}>
                        <h2>Select one card to add to your hand</h2>
                        <div style={styles.cardSelection}>
                            {topCards.map((card, index) => (
                                <div 
                                    key={`top-card-${index}`}
                                    style={styles.selectableCard}
                                    onClick={() => selectCardFromTopThree(card)}
                                >
                                    <img src={card.image} alt={`Card ${card.id}`} style={styles.cardImage} />
                                </div>
                            ))}
                        </div>
                        <button 
                            onClick={() => setSelectingFromDeck(false)} 
                            style={styles.cancelButton}
                        >
                            Cancel
                        </button>
                    </div>
                )}
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
    heroEffectContainer: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        padding: '10px',
        borderRadius: '8px',
    },
    heroEffectButton: {
        padding: '8px 16px',
        fontSize: '14px',
        cursor: 'pointer',
        backgroundColor: '#5FAF50',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        whiteSpace: 'nowrap',
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
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 10,
        backgroundColor: 'rgba(0, 0, 0, 0)',
        padding: '10px',
        borderRadius: '8px',
    },
    spellEffectButton: {
        padding: '8px 16px',
        fontSize: '14px',
        cursor: 'pointer',
        backgroundColor: '#9C27B0',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        whiteSpace: 'nowrap',
    },
    cancelButton: {
        position: 'absolute',
        bottom: '120px',
        right: '20px',
        padding: '10px 20px',
        backgroundColor: '#ff4444',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        zIndex: 100
    },
    selectionModal: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.7)',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white'
    },
    cardSelection: {
        display: 'flex',
        gap: '20px',
        margin: '20px 0'
    },
    selectableCard: {
        width: '150px',
        height: '200px',
        border: '2px solid white',
        borderRadius: '10px',
        cursor: 'pointer',
        transition: 'transform 0.2s',
        ':hover': {
            transform: 'scale(1.05)',
            borderColor: 'yellow'
        }
    },
    actionButton: {
        padding: '10px 20px',
        fontSize: '16px',
        cursor: 'pointer',
        backgroundColor: '#3F51B5',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        margin: '0 10px'
    }
};

export default GameBoard
