import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // For redirecting to the main page
import './Gameboard.css';  // Add this import at the top

class Card {
    constructor(suit, value, effect) {
        this.suit = suit;
        this.value = value;
        this.effect = effect;
    }
}

// Define card configurations
const cardConfigurations = [
    { suit: 'Hero', value: 'Goblin', effect: 'Pull a card from opponent’s deck' },
    { suit: 'Hero', value: 'Cyborg 20xx', effect: 'Destroy an opponent’s hero card' },
    { suit: 'Hero', value: 'Bullseye', effect: 'Look at the top 3 cards in the deck and select 1 of the 3' },
    { suit: 'Hero', value: 'Lost Soul', effect: 'Draw the last hero from the discard pile' },
    { suit: 'Hero', value: 'Moose Druid', effect: 'Destroy an opponent’s hero card' },
    { suit: 'Hero', value: 'Druid Mask', effect: 'No effect' },
    { suit: 'Item', value: 'Decoy Doll', effect: 'Card is sacrificed to save the hero' },
    { suit: 'Spell', value: 'Critical Boost', effect: 'Discard a card and draw three from the deck' },
    // Add more cards here as needed
];

// Create a deck of cards using the configurations
function createDeck() {
    const deck = [];
    for (const config of cardConfigurations) {
        deck.push(new Card(config.suit, config.value, config.effect));
    }
    return deck;
}

// Shuffle the deck
function shuffleDeck(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

function Gameboard() {
    const navigate = useNavigate(); // For redirecting to the main page
    const [deck, setDeck] = useState([]);
    const [playerHand, setPlayerHand] = useState([]);
    const [discardPile, setDiscardPile] = useState([]);
    const [playerActionPoints, setPlayerActionPoints] = useState(3);
    const [currentPlayer, setCurrentPlayer] = useState('player');
    const [playerSlots, setPlayerSlots] = useState(Array(5).fill(null)); // 5 slots for player's Hero cards
    const [attachedItems, setAttachedItems] = useState(Array(5).fill([])); // Items attached to player's Hero cards
    const [opponentSlots, setOpponentSlots] = useState(Array(5).fill(null)); // 5 slots for opponent's Hero cards
    const [opponentAttachedItems, setOpponentAttachedItems] = useState(Array(5).fill([])); // Items attached to opponent's Hero cards
    const [winner, setWinner] = useState(null); // Track the winner

    useEffect(() => {
        const newDeck = createDeck();
        shuffleDeck(newDeck);
        setDeck(newDeck.slice(10)); // Keep the rest of the deck
        setPlayerHand(newDeck.slice(0, 5)); // Draw initial hand
    }, []);

    // Check for a winner after every state update
    useEffect(() => {
        const winner = checkWinCondition();
        if (winner) {
            setWinner(winner);
            setTimeout(() => {
                navigate('/MainPage'); // Redirect to the main page after 3 seconds
            }, 3000);
        }
    }, [playerSlots, opponentSlots, navigate]);

    function checkWinCondition() {
        // Check if the player has filled all 5 slots
        const playerWins = playerSlots.every(slot => slot !== null);
        if (playerWins) {
            return 'player';
        }

        // Check if the opponent has filled all 5 slots
        const opponentWins = opponentSlots.every(slot => slot !== null);
        if (opponentWins) {
            return 'opponent';
        }

        return null; // No winner yet
    }

    function applyEffect(card) {
        switch (card.value) {
            case 'Goblin':
                console.log("Goblin effect: Pull a card from opponent's deck (not implemented yet)");
                break;
            case 'Cyborg 20xx':
            case 'Moose Druid':
                console.log("Destroy an opponent's hero card");
                // Example: Destroy the first occupied opponent slot
                const slotIndex = opponentSlots.findIndex(slot => slot !== null);
                if (slotIndex !== -1) {
                    destroyOpponentCard(slotIndex);
                } else {
                    console.warn("No opponent cards to destroy.");
                }
                break;
            case 'Bullseye':
                console.log("Look at the top 3 cards and pick one (not implemented yet)");
                break;
            case 'Lost Soul':
                console.log("Draw last hero from discard pile");
                break;
            case 'Decoy Doll':
                console.log("Card is sacrificed to save the hero");
                break;
            case 'Critical Boost':
                console.log("Discard a card and draw three from the deck (not implemented yet)");
                break;
            default:
                console.log("No effect");
                break;
        }
    }

    function destroyOpponentCard(slotIndex) {
        if (slotIndex < 0 || slotIndex >= opponentSlots.length) {
            console.warn("Invalid slot index.");
            return;
        }

        const cardToDestroy = opponentSlots[slotIndex];
        if (!cardToDestroy) {
            console.warn("No card in the specified slot.");
            return;
        }

        // Move the destroyed card to the discard pile
        setDiscardPile([...discardPile, cardToDestroy]);

        // Remove the card from the opponent's slot
        const newOpponentSlots = [...opponentSlots];
        newOpponentSlots[slotIndex] = null;
        setOpponentSlots(newOpponentSlots);

        // Remove any attached items
        const newOpponentAttachedItems = [...opponentAttachedItems];
        newOpponentAttachedItems[slotIndex] = [];
        setOpponentAttachedItems(newOpponentAttachedItems);

        console.log(`Destroyed ${cardToDestroy.value} in opponent's slot ${slotIndex + 1}`);
    }

    function playCard(card, slotIndex = null) {
        if (!card) return;

        if (currentPlayer === 'player' && playerActionPoints > 0) {
            setPlayerActionPoints(playerActionPoints - 1);

            switch (card.suit) {
                case 'Hero':
                    if (slotIndex !== null && !playerSlots[slotIndex]) {
                        // Place Hero card in the specified slot
                        const newPlayerSlots = [...playerSlots];
                        newPlayerSlots[slotIndex] = card;
                        setPlayerSlots(newPlayerSlots);
                        setPlayerHand(playerHand.filter(c => c !== card));
                    } else {
                        console.warn("Invalid slot or slot already occupied.");
                    }
                    break;

                case 'Item':
                    if (slotIndex !== null && playerSlots[slotIndex]) {
                        // Attach Item card to the Hero in the specified slot
                        const newAttachedItems = [...attachedItems];
                        newAttachedItems[slotIndex] = [...newAttachedItems[slotIndex], card];
                        setAttachedItems(newAttachedItems);
                        setPlayerHand(playerHand.filter(c => c !== card));
                    } else {
                        console.warn("Invalid slot or no Hero card in the slot.");
                    }
                    break;

                case 'Spell':
                    // Apply Spell effect and discard the card
                    applyEffect(card);
                    setDiscardPile([...discardPile, card]);
                    setPlayerHand(playerHand.filter(c => c !== card));
                    break;

                default:
                    console.warn("Unknown card type.");
                    break;
            }
        }

        if (playerActionPoints === 1) {
            endTurn();
        }
    }

    function drawCard() {
        if (deck.length === 0) {
            console.warn("Deck is empty, cannot draw a card.");
            return;
        }

        if (currentPlayer === 'player' && playerActionPoints > 0) {
            setPlayerActionPoints(playerActionPoints - 1);
            setPlayerHand([...playerHand, deck[0]]);
            setDeck(deck.slice(1));
        }

        if (playerActionPoints === 1) {
            endTurn();
        }
    }

    function endTurn() {
        checkWinCondition()
        setCurrentPlayer(currentPlayer === 'player' ? 'opponent' : 'player');
        setPlayerActionPoints(3);
    }

    function renderSlotSelection(card) {
        return (
            <div>
                <p>Select a slot for {card.value}:</p>
                {playerSlots.map((slot, index) => (
                    <button
                        key={index}
                        onClick={() => playCard(card, index)}
                        disabled={card.suit === 'Hero' && slot !== null}
                    >
                        Slot {index + 1} {slot ? `(Occupied by ${slot.value})` : "(Empty)"}
                    </button>
                ))}
            </div>
        );
    }

    // Render the victory message if there's a winner
    if (winner) {
        return (
            <div>
                <h1>{winner === 'player' ? 'You Win!' : 'Opponent Wins!'}</h1>
                <p>Redirecting to the main page...</p>
            </div>
        );
    }

    return (
        <div>
            <h1>Enchanted Wars</h1>
            <div>Deck: {deck.length} cards</div>
            <div>Hand: {playerHand.map(card => `${card.value} of ${card.suit} (${card.effect})`).join(', ')}</div>
            <div>Discard Pile: {discardPile.length} cards</div>
            <div>Action Points: {playerActionPoints}</div>
            <button onClick={() => drawCard()}>Draw Card</button>
            {playerHand.map((card, index) => (
                <div key={index}>
                    <button onClick={() => playCard(card)}>Play {card.value}</button>
                    {card.suit === 'Hero' || card.suit === 'Item' ? renderSlotSelection(card) : null}
                </div>
            ))}
            <div>
                <h2>Player Slots</h2>
                {playerSlots.map((slot, index) => (
                    <div key={index}>
                        <strong>Slot {index + 1}:</strong> {slot ? `${slot.value} (${slot.suit})` : "Empty"}
                        {attachedItems[index].length > 0 && (
                            <div>
                                <strong>Attached Items:</strong>
                                {attachedItems[index].map((item, i) => (
                                    <div key={i}>{item.value} (${item.suit})</div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <div>
                <h2>Opponent Slots</h2>
                {opponentSlots.map((slot, index) => (
                    <div key={index}>
                        <strong>Slot {index + 1}:</strong> {slot ? `${slot.value} (${slot.suit})` : "Empty"}
                        {opponentAttachedItems[index].length > 0 && (
                            <div>
                                <strong>Attached Items:</strong>
                                {opponentAttachedItems[index].map((item, i) => (
                                    <div key={i}>{item.value} (${item.suit})</div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Gameboard;