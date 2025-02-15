// Define the card object with effects
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
        'Goblin': 'Pull a card from opponents deck',
        'Hydra': 'User gets +1 to their hero roll',
        'Cyborg 20xx': 'Destroy an opponents hero card',
        'Bullseye': 'Look at the top 3 cards in the deck and select 1 of the 3',
        'Lost Soul': 'Draw the last hero from the discard pile',
        'Moose Druid': 'Destroy an opponents hero card',
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

// Game state variables
let currentPlayer = 'player';
let playerActionPoints = 3;
let opponentActionPoints = 0;
let playerHand = [];
let opponentHand = [];
let deck = [];
let discardPile = [];

// Apply card effects
function applyEffect(card) {
    switch (card.value) {
        case 'Goblin':
            // Pull a card from opponent's deck
            if (currentPlayer === 'player') {
                playerHand.push(opponentHand.pop());
            } else {
                opponentHand.push(playerHand.pop());
            }
            break;
        case 'Hydra':
            // User gets +1 to their hero roll
            console.log("User gets +1 to their hero roll");
            break;
        case 'Cyborg 20xx':
            // Destroy an opponent's hero card
            if (currentPlayer === 'player') {
                discardPile.push(opponentHand.pop());
            } else {
                discardPile.push(playerHand.pop());
            }
            break;
        case 'Bullseye':
            // Look at the top 3 cards in the deck and select 1 of the 3
            const topCards = deck.splice(0, 3);
            const selectedCard = topCards[0]; // Select the first card for simplicity
            if (currentPlayer === 'player') {
                playerHand.push(selectedCard);
            } else {
                opponentHand.push(selectedCard);
            }
            deck.unshift(...topCards.slice(1)); // Return the other cards to the top of the deck
            break;
        case 'Lost Soul':
            // Draw the last hero from the discard pile
            const lastHero = discardPile.find(card => card.suit === 'Hero');
            if (lastHero) {
                discardPile = discardPile.filter(card => card !== lastHero);
                if (currentPlayer === 'player') {
                    playerHand.push(lastHero);
                } else {
                    opponentHand.push(lastHero);
                }
            }
            break;
        case 'Moose Druid':
            // Destroy an opponent's hero card
            if (currentPlayer === 'player') {
                discardPile.push(opponentHand.pop());
            } else {
                discardPile.push(playerHand.pop());
            }
            break;
        case 'Decoy Doll':
            // Card is sacrificed to save the hero
            console.log("Card is sacrificed to save the hero");
            break;
        case 'Critical Boost':
            // Discard a card and draw three from the deck
            if (currentPlayer === 'player') {
                playerHand.pop();
                playerHand.push(...deck.splice(0, 3));
            } else {
                opponentHand.pop();
                opponentHand.push(...deck.splice(0, 3));
            }
            break;
        default:
            console.log("No effect");
            break;
    }
}

function updateDisplay() {
    document.getElementById('deck').innerText = `Deck: ${deck.length} cards`;
    document.getElementById('player-hand').innerText = `Hand: ${playerHand.map(card => `${card.value} of ${card.suit} (${card.effect})`).join(', ')}`;
    document.getElementById('discard-pile').innerText = `Discard Pile: ${discardPile.length} cards`;
    document.getElementById('action-points').innerText = `Action Points: ${currentPlayer === 'player' ? playerActionPoints : opponentActionPoints}`;
}

// Handle end of turn
function endTurn() {
    currentPlayer = currentPlayer === 'player' ? 'opponent' : 'player';
    playerActionPoints = currentPlayer === 'player' ? 3 : 0;
    opponentActionPoints = currentPlayer === 'opponent' ? 3 : 0;
    updateDisplay();
}

// Play a card (consume 1 action point)
function playCard(card) {
    if (currentPlayer === 'player') {
        if (playerActionPoints > 0) {
            playerActionPoints--;
            applyEffect(card);
            playerHand = playerHand.filter(c => c !== card);
        }
    } else {
        if (opponentActionPoints > 0) {
            opponentActionPoints--;
            applyEffect(card);
            opponentHand = opponentHand.filter(c => c !== card);
        }
    }

    if (playerActionPoints === 0 || opponentActionPoints === 0) {
        endTurn();
    } else {
        updateDisplay();
    }
}

// Draw a card (consume 1 action point)
function drawCard() {
    if (currentPlayer === 'player') {
        if (playerActionPoints > 0) {
            playerActionPoints--;
            playerHand.push(deck.pop());
        }
    } else {
        if (opponentActionPoints > 0) {
            opponentActionPoints--;
            opponentHand.push(deck.pop());
        }
    }

    if (playerActionPoints === 0 || opponentActionPoints === 0) {
        endTurn();
    } else {
        updateDisplay();
    }
}

// Initialize the game
function initializeGame() {
    deck = createDeck();
    shuffleDeck(deck);

    playerHand = deck.splice(0, 5);
    opponentHand = deck.splice(0, 5);

    updateDisplay();
}

// Start the game when the page loads
window.onload = initializeGame;

