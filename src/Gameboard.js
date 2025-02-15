import React, { useState, useEffect } from 'react';
import './Gameboard.css';  // Add this import at the top

class Card {
    constructor(suit, value, effect) {
        this.suit = suit;
        this.value = value;
        this.effect = effect;
    }
}

// Create a deck of cards with effects
function createDeck() {
    const suits = ['Druid', 'Dark', 'Soul', 'Hero', 'Time', 'Poison', 'Item', 'Spell'];
    const values = ['Goblin', 'Hydra', 'Cyborg 20xx', 'Bullseye', 'Lost Soul', 'Moose Druid', 'Druid Mask', 'Decoy Doll', 'Critical Boost'];
    const effects = {
        'Goblin': 'Pull a card from opponent’s deck',
        'Hydra': 'User gets +1 to their hero roll',
        'Cyborg 20xx': 'Destroy an opponent’s hero card',
        'Bullseye': 'Look at the top 3 cards in the deck and select 1 of the 3',
        'Lost Soul': 'Draw the last hero from the discard pile',
        'Moose Druid': 'Destroy an opponent’s hero card',
        'Decoy Doll': 'Card is sacrificed to save the hero',
        'Critical Boost': 'Discard a card and draw three from the deck'
    };
    const deck = [];

    for (let suit of suits) {
        for (let value of values) {
            const effect = effects[value] || 'No effect';
            deck.push(new Card(suit, value, effect));
        }
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
    const [deck, setDeck] = useState([]);
    const [playerHand, setPlayerHand] = useState([]);
    const [discardPile, setDiscardPile] = useState([]);
    const [playerActionPoints, setPlayerActionPoints] = useState(3);
    const [currentPlayer, setCurrentPlayer] = useState('player');

    useEffect(() => {
        const newDeck = createDeck();
        shuffleDeck(newDeck);
        setDeck(newDeck.slice(10)); // Keep the rest of the deck
        setPlayerHand(newDeck.slice(0, 5)); // Draw initial hand
    }, []);

    function applyEffect(card) {
        switch (card.value) {
            case 'Goblin':
                console.log("Goblin effect: Pull a card from opponent's deck (not implemented yet)");
                break;
            case 'Cyborg 20xx':
            case 'Moose Druid':
                console.log("Destroy an opponent's hero card");
                setDiscardPile([...discardPile, card]);
                setPlayerHand(playerHand.filter(c => c !== card));
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

    function playCard(card) {
        if (!card) return;

        if (currentPlayer === 'player' && playerActionPoints > 0) {
            setPlayerActionPoints(playerActionPoints - 1);
            applyEffect(card);
            setPlayerHand(playerHand.filter(c => c !== card));
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
        setCurrentPlayer(currentPlayer === 'player' ? 'opponent' : 'player');
        setPlayerActionPoints(3);
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
                <button key={index} onClick={() => playCard(card)}>Play {card.value}</button>
            ))}
        </div>
    );
}

export default Gameboard;
