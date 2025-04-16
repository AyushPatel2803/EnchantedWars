import React, { useState, useEffect } from "react";
import ActionPoints from "./ActionPoints";
import DrawCard from "./DrawCard";
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
import RoboMask from"../assets/RoboMask.png"
import SpectreMask from "../assets/SpectreMask.png"
import ChimeraMask from "../assets/ChimeraMask.png"
import SerpentMask from "../assets/SerpentMask.png"
import ConsortArmor from "../assets/ConsortHelmet.png"
import BearCleaver from "../assets/BearCleaver.png"
import Cerberus from "../assets/Cerberus.png"
import Gargoyle from "../assets/Gargoyle.png"
import Ghoul from "../assets/GhastlyGhoul.png"
import Gorgon from "../assets/Gorgon.png"
import MightyOak from "../assets/MightyOak.png"
import Ragnarok from "../assets/Ragnarok.png"
import TimeMachine from "../assets/TimeMachine.png"
import TitaniumGiant from "../assets/TitaniumGiant.png"
import Vampire from "../assets/Vampire.png"
import WhiteMage from "../assets/WhiteMage.png"
import WingedSerpent from "../assets/WingedSerpent.png"


import dice1 from "../assets/dice1.png";
import dice2 from "../assets/dice2.png";
import dice3 from "../assets/dice3.png";
import dice4 from "../assets/dice4.png";
import dice5 from "../assets/dice5.png";
import dice6 from "../assets/dice6.png";

const GameBoard = () => {
const [hoveredCardId, setHoveredCardId] = useState(null);

    // Define your actual card data with types and affinities
    const cardList = [
        { id: 1, image: MooseDruid, type: "Hero", affinity: "Druid", min: 4, max: 8}, 
        { id: 2, image: DarkGoblin, type: "Hero", affinity: "Dark" , min: 0, max: 6}, 
        { id: 3, image: DruidMask, type: "Item", affinity: "Druid"}, 
        { id: 4, image: DecoyDoll, type: "Item", affinity: null },
        { id: 5, image: CriticalBoost, type: "Spell", affinity: null },
        { id: 6, image: LostSoul, type: "Hero", affinity: "Undead" , min: 0, max: 6},
        { id: 7, image: Bullseye, type: "Hero", affinity: "Consort" , min: 0, max: 4},
        { id: 8, image: Hydra, type: "Hero", affinity: "Serpentine" , min: 0, max: 0},
        { id: 9, image: Cyborg20xx, type: "Hero", affinity: "Cyborg", min: 4, max: 10},
        { id: 10, image: Switcheroo, type: "Spell"},
        { id: 11, image: MAD, type: "Spell"},
        { id: 12, image: RoboMask, type: "Item", affinity: "Cyborg"},
        { id: 13, image: SpectreMask, type: "Item", affinity: "Undead"},
        { id: 14, image: ChimeraMask, type: "Item", affinity: "Dark"},
        { id: 15, image: SerpentMask, type: "Item", affinity: "Serpentine"},
        { id: 16, image: ConsortArmor, type: "Item", affinity: "Consort"},
        { id: 17, image: Gorgon, type: "Hero", affinity: "Serpentine", min: 0, max: 0},
        { id: 18, image: WingedSerpent, type: "Hero", affinity: "Serpentine", min: 0, max: 7},
        { id: 19, image: Ragnarok, type: "Hero", affinity: "Consort" , min: 0, max: 6},
        { id: 20, image: WhiteMage, type: "Hero", affinity: "Consort" , min: 0, max: 7},
        { id: 21, image: TimeMachine, type: "Hero", affinity: "Cyborg", min: 0, max: 11},
        { id: 22, image: TitaniumGiant, type: "Hero", affinity: "Cyborg", min: 0, max: 8},
        { id: 23, image: MightyOak, type: "Hero", affinity: "Druid" , min: 0, max: 0},
        { id: 24, image: BearCleaver, type: "Hero", affinity: "Druid" , min: 0, max: 8},
        { id: 25, image: Cerberus, type: "Hero", affinity: "Dark" , min: 6, max: 8}, 
        { id: 26, image: Gargoyle, type: "Hero", affinity: "Dark" , min: 0, max: 9}, 
        { id: 27, image: Vampire, type: "Hero", affinity: "Undead" , min: 0, max: 6},
        { id: 28, image: Ghoul, type: "Hero", affinity: "Undead" , min: 0, max: 10},

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
    const [diceRolls, setDiceRolls] = useState({ first: null, second: null, bonus: null });
    const [hoveredSpell, setHoveredSpell] = useState(null);
    const [swapSpellActive, setSwapSpellActive] = useState(false);
    const [selectedOwnHero, setSelectedOwnHero] = useState(null);
    const [selectedOpponentHero, setSelectedOpponentHero] = useState(null);
    const [destroyMode, setDestroyMode] = useState(false);
    const [selectingFromDeck, setSelectingFromDeck] = useState(false);
    const [topCards, setTopCards] = useState([]);
    const [turnModifier, setTurnModifier] = useState(false);
    const opponentPlayedCards = currentPlayer === 1 ? playedCards2 : playedCards1;
    const hasHero = opponentPlayedCards.some(card => card && card.type === "Hero");
    const [stealMode, setStealMode] = useState(false);
    const [selectedOpponentCard, setSelectedOpponentCard] = useState(null);
    const [timer, setTimer] = useState(60); // 60 seconds
    const [timerActive, setTimerActive] = useState(true);
    const [gameStarted, setGameStarted] = useState(false);
    const [showAIPrompt, setShowAIPrompt] = useState(true);
    const [isAIEnabled, setIsAIEnabled] = useState(false);

    useEffect(() => {
        let interval;
        
        if (timerActive && timer > 0) {
            interval = setInterval(() => {
                setTimer(prev => prev - 1);
            }, 1000);
        } else if (timer <= 0) {
            switchTurn();
            setTimer(60); // Reset timer for next player
        }
        
        return () => clearInterval(interval);
    }, [timer, timerActive]);

    useEffect(() => {
        setTimer(60); // Reset timer when player changes
    }, [currentPlayer]);

    function getBonus(slotIndex) {
        const currentPlayedCards = currentPlayer === 1 ? playedCards1 : playedCards2;
        const opponentPlayedCards = currentPlayer === 1 ? playedCards2 : playedCards1;
        let bonus = 0;
    
        // 1. Hydra Bonus 
        currentPlayedCards.forEach(card => {
            if (card?.id === 8) bonus += 1;
        });
    
        // 2. Mighty Oak Adjacency 
        if (slotIndex !== undefined) {
            if (currentPlayedCards[slotIndex] && (currentPlayedCards[slotIndex - 1]?.id === 23)) {
                bonus += 2;
            }
            if (currentPlayedCards[slotIndex] && (currentPlayedCards[slotIndex + 1]?.id === 23)) {
                bonus += 2;
            }
        }
    
        // 3. Gorgon 
        if (slotIndex !== undefined) {
            if (currentPlayedCards[slotIndex] && opponentPlayedCards[slotIndex]?.id === 17) {
                bonus -= 2;
            }
        }
    
        // 4. Turn Modifier
        if (turnModifier) bonus += 3;
    
        return bonus;
    }
    // Add this useEffect for AI moves
    useEffect(() => {
        if (gameStarted && currentPlayer === 2 && isAIEnabled) {
          const aiDelay = setTimeout(() => {
            if (player2ActionPoints > 0) {
              makeAIMove();
            } else {
              switchTurn();
            }
          }, 1500); // 1.5 second delay for AI "thinking"
      
          return () => clearTimeout(aiDelay);
        }
      }, [currentPlayer, player2ActionPoints, isAIEnabled, gameStarted, player2Hand, playedCards2]);

    // Function to place a random hero in an opponent's slot
    const placeRandHero = () => {
        // Find empty slots
        const emptySlots = playedCards2
          .map((card, index) => ({ card, index }))
          .filter(slot => slot.card === null);
      
        if (emptySlots.length === 0) return;
      
        // Get random hero from hand
        const heroesInHand = player2Hand.filter(card => card.type === "Hero");
        if (heroesInHand.length === 0) return;
      
        const randomHero = heroesInHand[Math.floor(Math.random() * heroesInHand.length)];
        const randomSlot = emptySlots[Math.floor(Math.random() * emptySlots.length)];
      
        setPlayedCards2(prev => {
          const newPlayed = [...prev];
          newPlayed[randomSlot.index] = { ...randomHero, items: [] };
          return newPlayed;
        });
      
        // Remove from hand
        setPlayer2Hand(prev => prev.filter(card => card.uniqueId !== randomHero.uniqueId));
        
        // Deduct action point
        setPlayer2ActionPoints(prev => prev - 1);
      };
      
      const placeRandItem = () => {
        // Find heroes without items
        const eligibleHeroes = playedCards2
          .map((card, index) => ({ card, index }))
          .filter(slot => 
            slot.card?.type === "Hero" && 
            (!slot.card.items || slot.card.items.length === 0)
          );
      
        if (eligibleHeroes.length === 0) return;
      
        // Get random item from hand
        const itemsInHand = player2Hand.filter(card => card.type === "Item");
        if (itemsInHand.length === 0) return;
      
        const randomItem = itemsInHand[Math.floor(Math.random() * itemsInHand.length)];
        const randomHero = eligibleHeroes[Math.floor(Math.random() * eligibleHeroes.length)];
      
        setPlayedCards2(prev => {
          const newPlayed = [...prev];
          newPlayed[randomHero.index] = {
            ...newPlayed[randomHero.index],
            items: [...(newPlayed[randomHero.index].items || []), randomItem]
          };
          return newPlayed;
        });
      
        // Remove from hand
        setPlayer2Hand(prev => prev.filter(card => card.uniqueId !== randomItem.uniqueId));
        
        // Deduct action point
        setPlayer2ActionPoints(prev => prev - 1);
      };
    
  const makeAIMove = () => {
    if (currentPlayer !== 2 || !isAIEnabled) return;
  
    const possibleActions = [];
    
    // Add possible actions with weights
    if (player2Hand.length > 0) {
      possibleActions.push('playCard', 'playCard', 'playCard');
    }
    if (player2Hand.some(card => card.type === 'Spell')) {
      possibleActions.push('castSpell', 'castSpell');
    }
    possibleActions.push('drawCard');
    if (player2Hand.length > 0) {
      possibleActions.push('replaceHand');
    }
    if (playedCards2.some(card => card?.type === 'Hero' && card.max !== 0)) {
      possibleActions.push('useHeroAbility', 'useHeroAbility');
    }
  
    if (possibleActions.length === 0) {
      switchTurn();
      return;
    }
  
    const randomAction = possibleActions[
      Math.floor(Math.random() * possibleActions.length)
    ];
  
    // Execute the chosen action
    switch(randomAction) {
      case 'playCard':
        if (player2Hand.length > 0) {
          const randomCardIndex = Math.floor(Math.random() * player2Hand.length);
          const cardToPlay = player2Hand[randomCardIndex];
          
          if (cardToPlay.type === 'Hero' || cardToPlay.type === 'Item') {
            const availableSlots = playedCards2
              .map((card, index) => ({ card, index }))
              .filter(slot => {
                if (cardToPlay.type === 'Hero') return slot.card === null;
                if (cardToPlay.type === 'Item') {
                  return slot.card !== null && slot.card.type === 'Hero' && 
                        (!slot.card.items || slot.card.items.length === 0);
                }
                return false;
              });
            
            if (availableSlots.length > 0) {
              const targetSlot = availableSlots[Math.floor(Math.random() * availableSlots.length)];
              handleDrop({
                dataTransfer: {
                  getData: () => JSON.stringify(cardToPlay)
                },
                preventDefault: () => {}
              }, targetSlot.index);
            }
          }
        }
        break;
        
      case 'castSpell':
        const spells = player2Hand.filter(card => card.type === 'Spell');
        if (spells.length > 0) {
          const randomSpell = spells[Math.floor(Math.random() * spells.length)];
          castSpell(randomSpell);
        }
        break;
        
      case 'drawCard':
        handleDrawCard();
        break;
        
      case 'replaceHand':
        if (player2Hand.length > 0 && Math.random() < 0.5) {
          discardAllCards();
        }
        break;
        
      case 'useHeroAbility':
        const heroesWithAbilities = playedCards2
          .filter(card => card?.type === 'Hero' && card.max !== 0)
          .map((card, index) => ({ card, index }));
        
        if (heroesWithAbilities.length > 0) {
          const randomHero = heroesWithAbilities[
            Math.floor(Math.random() * heroesWithAbilities.length)
          ];
          heroEffect(randomHero.card, randomHero.index);
        }
        break;
    }
  };

    const heroEffect = (card, slotIndex) => {
        if (!card || (card.type !== "Hero")) return;
        
        const bonus = getBonus(slotIndex);

        const currentActionPoints = currentPlayer === 1 ? player1ActionPoints : player2ActionPoints;
        const setCurrentActionPoints = currentPlayer === 1 ? setPlayer1ActionPoints : setPlayer2ActionPoints;
        const currentPlayedCards = currentPlayer === 1 ? playedCards1 : playedCards2;
        const setCurrentPlayedCards = currentPlayer === 1 ? setPlayedCards1 : setPlayedCards2;

        // Rest of the function remains the same...
        const roll1 = Math.floor(Math.random() * 6) + 1;
        const roll2 = Math.floor(Math.random() * 6) + 1;
        
        setDiceRolls({ first: roll1, second: roll2, bonus });
        // Calculate total roll with bonus
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
            case 2: // Dark Goblin
                if (totalRoll >= card.max) {
                    pullFromOpponent()
                }
                break;
            case 6: // Lost Soul
                if (totalRoll >= card.max) {
                    drawFromDiscard()
                }
                break;
            case 7: // Bullseye
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
            case 18: // Winged Serpent
                if (totalRoll >= card.max) {
                    const currentHand = currentPlayer === 1 ? player1Hand : player2Hand;
                    const setCurrentHand = currentPlayer === 1 ? setPlayer1Hand : setPlayer2Hand;
                    
                    // Create a temporary array to hold new cards
                    const newCards = [...currentHand];
                    
                    // Draw until we have 7 cards
                    while (newCards.length < 7) {
                        const randomCard = { 
                            ...cardList[Math.floor(Math.random() * cardList.length)], 
                            uniqueId: Date.now() + newCards.length 
                        };
                        newCards.push(randomCard);
                    }
                    
                    // Update state once with all new cards
                    setCurrentHand(newCards);
                    break;
                }
            case 19: // Ragnarok
                if (totalRoll >= card.max) {
                    setTurnModifier(true)
                }
                break;
            case 20: //White Mage
                drawLastDiscardedHero()
                break;
            case 21: // Time Machine
                if (totalRoll >= card.max) {
                    // Discard all played Heroes (both players)
                    const allPlayedHeroes = [...playedCards1, ...playedCards2]
                        .filter(card => card?.type === "Hero");

                    if (allPlayedHeroes.length === 0) {
                        alert("No Heroes on the field to discard!");
                        break;
                    }

                    // Add all Heroes to discard pile
                    setDiscardPile(prev => [...prev, ...allPlayedHeroes]);

                    // Clear all Hero slots
                    setPlayedCards1(prev => prev.map(card => card?.type === "Hero" ? null : card));
                    setPlayedCards2(prev => prev.map(card => card?.type === "Hero" ? null : card));

                    alert("Time Machine activated! All Heroes have been discarded.");
                }
                break;
            case 22: // Titanium Giant
                if (totalRoll >= card.max) {
                    // Check hand size first
                    const currentHand = currentPlayer === 1 ? player1Hand : player2Hand;
                    if (currentHand.length >= 7) { // Because we're adding 2 cards
                        alert('Your hand is too full to draw 2 cards!');
                        return;
                    }
                    
                    // Draw two cards
                    const card1 = drawCardwithAffinity();
                    const card2 = drawCardwithAffinity();
                    
                    // Check if either card is a spell
                    if (card1 === "Cyborg" || card2 === "Cyborg") {
                        activateDestroyMode();
                        return
                    }
                }
                break;
            case 24: 
                if (totalRoll >= card.max) {
                    // Check hand size first
                    const currentHand = currentPlayer === 1 ? player1Hand : player2Hand;
                    if (currentHand.length >= 7) { // Because we're adding 2 cards
                        alert('Your hand is too full to draw 2 cards!');
                        return;
                    }
                    
                    // Draw two cards
                    const card1 = drawCardwithType();
                    const card2 = drawCardwithType();
                    
                    // Check if either card is a spell
                    if (card1 === "Spell" || card2 === "Spell") {
                        activateDestroyMode();
                        return;
                    }
                }
                break;
            case 25:
                if (totalRoll >= card.max) {
                    destroyOpponentsMods();
                }
                else if (totalRoll <= card.min) {
                    destroyUserMods();
                }
                break
            case 26:
                if (totalRoll >= card.max) {
                    forceOpponentDiscardHeroes()
                }
                break;
            case 27:
                if (totalRoll >= card.max) {
                const currentHand = currentPlayer === 1 ? player1Hand : player2Hand;
                    if (currentHand.length >= 7) { // Because we're adding 2 cards
                        alert('Your hand is too full to draw 2 cards!');
                        return;
                    }
                    
                    // Draw two cards
                    const card1 = drawCardwithType();
                    const card2 = drawCardwithType();
                }
                break;
            case 28:
                if (totalRoll >= card.max) {
                    activateStealMode();
                    return
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
                    setCurrentHand(prevHand => prevHand.filter(c => c.uniqueId !== spellCard.uniqueId));
                    setDiscardPile(prev => [...prev, spellCard]);
                    discardCard();
                    discardCard();
                    activateDestroyMode();
                    return;
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

        setCurrentActionPoints((prev) => prev - 1);
            
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
    function drawCardwithType() {
    const currentHand = currentPlayer === 1 ? player1Hand : player2Hand;
    const setCurrentHand = currentPlayer === 1 ? setPlayer1Hand : setPlayer2Hand;

    // Check if the current player's hand already has 8 cards
    if (currentHand.length >= 8) {
        alert("You cannot have more than 8 cards in your hand!");
        return null; // Return null to indicate failure
    }

    const randomCard = { 
        ...cardList[Math.floor(Math.random() * cardList.length)], 
        uniqueId: Date.now() + Math.random() // More unique identifier
    };

    // Add the random card to the current player's hand
    setCurrentHand((prevHand) => [...prevHand, randomCard]);

    return randomCard.type;
    };
    const destroyUserMods = () => {
        const currentPlayedCards = currentPlayer === 1 ? [...playedCards1] : [...playedCards2];
        const setCurrentPlayedCards = currentPlayer === 1 ? setPlayedCards1 : setPlayedCards2;
        let destroyedAny = false;
    
        const newPlayedCards = currentPlayedCards.map(card => {
            if (card && card.type === "Hero" && card.min === 0 && card.max === 0) {
                setDiscardPile(prev => [...prev, card]);
                destroyedAny = true;
                return null;
            }
            return card;
        });
    
        if (destroyedAny) {
            setCurrentPlayedCards(newPlayedCards);
        } 
    };
    
    const destroyOpponentsMods = () => {
        const opponentPlayedCards = currentPlayer === 1 ? [...playedCards2] : [...playedCards1];
        const setOpponentPlayedCards = currentPlayer === 1 ? setPlayedCards2 : setPlayedCards1;
        let destroyedAny = false;
    
        const newPlayedCards = opponentPlayedCards.map(card => {
            if (card && card.type === "Hero" && card.min === 0 && card.max === 0) {
                setDiscardPile(prev => [...prev, card]);
                destroyedAny = true;
                return null;
            }
            return card;
        });
    
        if (destroyedAny) {
            setOpponentPlayedCards(newPlayedCards);
        } 
    };

    function drawCardwithAffinity() {
        const currentHand = currentPlayer === 1 ? player1Hand : player2Hand;
        const setCurrentHand = currentPlayer === 1 ? setPlayer1Hand : setPlayer2Hand;

        // Check if the current player's hand already has 8 cards
        if (currentHand.length >= 8) {
            alert("You cannot have more than 8 cards in your hand!");
            return null; // Return null to indicate failure
        }

        const randomCard = { 
            ...cardList[Math.floor(Math.random() * cardList.length)], 
            uniqueId: Date.now() + Math.random() // More unique identifier
        };

        // Add the random card to the current player's hand
        setCurrentHand((prevHand) => [...prevHand, randomCard]);

        return randomCard.affinity;
    };

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
        setTurnModifier(false);
        setCurrentPlayer(prev => (prev === 1 ? 2 : 1));
        setPlayer1ActionPoints(3);
        setPlayer2ActionPoints(3);
    };

    const activateSwapSpell = () => {
        setTimerActive(false);
        setSwapSpellActive(true);
        setSelectedOwnHero(null);
        setSelectedOpponentHero(null);
    };
    
    const cancelSwapSpell = () => {
        setTimerActive(true);
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
        setTimerActive(false);
        setDestroyMode(true);
    };

    const forceOpponentDiscardHeroes = () => {
        // Determine opponent's hand based on current player
        const opponentHand = currentPlayer === 1 ? [...player2Hand] : [...player1Hand];
        const setOpponentHand = currentPlayer === 1 ? setPlayer2Hand : setPlayer1Hand;
        
        // Filter out Hero cards
        const heroesDiscarded = opponentHand.filter(card => card.type === "Hero");
        const remainingCards = opponentHand.filter(card => card.type !== "Hero");
        
        if (heroesDiscarded.length > 0) {
            // Update opponent's hand
            setOpponentHand(remainingCards);
            
            // Add discarded Heroes to discard pile
            setDiscardPile(prev => [...prev, ...heroesDiscarded]);
            
            alert(`Opponent discarded ${heroesDiscarded.length} Hero card(s)!`);
        } else {
            alert("Opponent had no Hero cards to discard!");
        }
        
        // Return number of cards discarded (could be useful)
        return heroesDiscarded.length;
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
        setDestroyMode(false);
        // Deduct action point only after successful destruction
        setCurrentActionPoints(prev => prev - 1);

        if ((currentPlayer === 1 ? player1ActionPoints : player2ActionPoints) - 1 === 0) {
            switchTurn();
        }

        setTimerActive(true)

    };
    const activateStealMode = () => {
        if ((currentPlayer === 1 ? player1ActionPoints : player2ActionPoints) < 1) {
            return;
        }
        setStealMode(true);
        setTimerActive(false)
        setSelectedOpponentHero(null);
    };
    
    const stealOpponentHero = () => {
        if (selectedOpponentHero === null) return;
    
        const opponentPlayedCards = currentPlayer === 1 ? playedCards2 : playedCards1;
        const setOpponentPlayedCards = currentPlayer === 1 ? setPlayedCards2 : setPlayedCards1;
        const setCurrentPlayedCards = currentPlayer === 1 ? setPlayedCards1 : setPlayedCards2;
    
        // Find first empty slot in current player's area
        const currentPlayedCards = currentPlayer === 1 ? playedCards1 : playedCards2;
        const emptySlotIndex = currentPlayedCards.findIndex(card => card === null);
    
        if (emptySlotIndex === -1) {
            alert("No empty slot to place stolen hero!");
            return;
        }
    
        // Perform the steal
        const stolenHero = opponentPlayedCards[selectedOpponentHero];
        
        setOpponentPlayedCards(prev => {
            const newCards = [...prev];
            newCards[selectedOpponentHero] = null;
            return newCards;
        });
    
        setCurrentPlayedCards(prev => {
            const newCards = [...prev];
            newCards[emptySlotIndex] = stolenHero;
            return newCards;
        });
    
        // Deduct action points
        currentPlayer === 1 
            ? setPlayer1ActionPoints(prev => prev - 1)
            : setPlayer2ActionPoints(prev => prev - 1);
    
        setStealMode(false);
        alert(`Stolen ${stolenHero.id} placed in slot ${emptySlotIndex + 1}!`);
    };
    const drawLastDiscardedHero = () => {
        const currentHand = currentPlayer === 1 ? player1Hand : player2Hand;
        const setCurrentHand = currentPlayer === 1 ? setPlayer1Hand : setPlayer2Hand;
        const setCurrentActionPoints = currentPlayer === 1 ? setPlayer1ActionPoints : setPlayer2ActionPoints;
    
        // Check if hand is full
        if (currentHand.length >= 8) {
            alert("Your hand is full (max 8 cards)!");
            return;
        }
    
        // Find the last discarded Hero (search from the end of the discard pile)
        let lastHeroIndex = -1;
        for (let i = discardPile.length - 1; i >= 0; i--) {
            if (discardPile[i].type === "Hero") {
                lastHeroIndex = i;
                break;
            }
        }
    
        if (lastHeroIndex === -1) {
            alert("No Hero cards in discard pile!");
            return;
        }
    
        // Get the last discarded Hero
        const lastHero = discardPile[lastHeroIndex];
    
        // Add to hand with new unique ID
        setCurrentHand(prev => [...prev, {
            ...lastHero,
            uniqueId: Date.now() // Assign new unique ID
        }]);
    
        // Remove from discard pile
        setDiscardPile(prev => [
            ...prev.slice(0, lastHeroIndex),
            ...prev.slice(lastHeroIndex + 1)
        ]);
    
        // Deduct action point
        setCurrentActionPoints(prev => prev - 1);
    
        // Check if turn should switch
        if ((currentPlayer === 1 ? player1ActionPoints : player2ActionPoints) - 1 === 0) {
            switchTurn();
        }

        setTimerActive(false);
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
        <div style={{ width: "100vw", height: "120vh", overflow: "hidden", margin: 0, padding: 0 }}>
        {showAIPrompt && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}>
            <h2>Game Mode Selection</h2>
            <p>Choose your opponent:</p>
            <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
              <button 
                onClick={() => {
                  setIsAIEnabled(true);
                  setShowAIPrompt(false);
                  setGameStarted(true);
                }}
                style={styles.modeButton}
              >
                Play vs AI
              </button>
              <button 
                onClick={() => {
                  setIsAIEnabled(false);
                  setShowAIPrompt(false);
                  setGameStarted(true);
                }}
                style={styles.modeButton}
              >
                Play vs Human
              </button>
            </div>
          </div>
        )}
          
        {gameStarted && (
        <div style={styles.gameBoard}>
                <ActionPoints 
                points={currentPlayer === 1 ? player1ActionPoints : player2ActionPoints} 
                isAI={currentPlayer === 2 && isAIEnabled}
                />
                <DrawCard 
                onDrawCard={handleDrawCard} 
                disabled={currentPlayer === 2 && isAIEnabled}
                />
                <div style={styles.timer}>
                {timer}s
                </div>
                {currentPlayer === 2 && isAIEnabled && (
                    <div style={{
                        position: 'fixed',
                        top: '20px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        color: 'white',
                        padding: '10px 20px',
                        borderRadius: '20px',
                        zIndex: 100,
                        fontSize: '18px'
                    }}>
                        AI is thinking... (Actions left: {player2ActionPoints})
                    </div>
                    )}

            {/* Add interaction blocker during AI turn */}
                {currentPlayer === 2 && isAIEnabled && (
                    <div style={styles.aiBlocker} />
                )}

            {/* Player 2 Card Slots */}
            <div style={styles.playArea}>
                {playedCards2.map((card, index) => (
                    <div
                        key={`player2-${index}`}
                        style={styles.slot}
                        onDragOver={handleDragOver}
                        onDrop={(e) => currentPlayer === 2 && handleDrop(e, index)}
                        onMouseEnter={() => currentPlayer === 2 && card?.type === "Hero" && card.max !== 0 && setHoveredCard({ card, slotIndex: index })}
                        onMouseLeave={() => currentPlayer === 2 && setHoveredCard(null)}
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
                                            <span style={{ color: getBonus(index) < 0 ? '#ff4444' : '#ffffff' }}>
                                                ({getBonus(index) > 0 ? `+${getBonus(index)}` : getBonus(index)})
                                            </span>
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
                        onMouseEnter={() => currentPlayer === 1 && card?.type === "Hero" && card.max !== 0 && setHoveredCard({ card, slotIndex: index })}
                        onMouseLeave={() => currentPlayer === 1 && setHoveredCard(null)}
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
                                            <span style={{ color: getBonus(index) < 0 ? '#ff4444' : '#ffffff' }}>
                                                ({getBonus(index) > 0 ? `+${getBonus(index)}` : getBonus(index)})
                                            </span>
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
                        
            {/* Player Hand Section */}
            <h2 style={{ textAlign: "center" }}>Player {currentPlayer} Hand</h2>
                {!isAIEnabled && currentPlayer === 1 && (
                    <div style={{ position: "relative", width: "600px", height: "250px", margin: "0 auto", marginBottom: "40px" }}>
                        {player1Hand.map((card, i, arr) => {
                            const middleIndex = (arr.length - 1) / 2;
                            const rotation = (i - middleIndex) * 25;
                            const offsetX = (i - middleIndex) * 30 + 220;
                            const offsetY = 10;
                            const isHovered = hoveredCardId === card.uniqueId;
                            return (
                                <div
                                    key={`hand-${card.uniqueId}`}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, card)}
                                    onMouseEnter={() => {
                                        setHoveredCardId(card.uniqueId);
                                        if (card.type === "Spell") {
                                            setHoveredSpell(card);
                                        }
                                    }}
                                    onMouseLeave={() => {
                                        setHoveredCardId(null);
                                        if (card.type === "Spell") {
                                            setHoveredSpell(null);
                                        }
                                    }}
                                    style={{
                                        position: "absolute",
                                        width: "150px",
                                        height: "200px",
                                        border: "2px solid #888",
                                        borderRadius: "10px",
                                        overflow: "hidden",
                                        cursor: "grab",
                                        transition: "transform 0.2s ease",
                                        transform: `translate(${offsetX}px, ${offsetY}px) rotate(${rotation}deg) scale(${isHovered ? 1.1 : 1})`,
                                        transformOrigin: "bottom center"
                                    }}
                                >
                                    <img
                                        src={card.image}
                                        alt={`Card ${card.id}`}
                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    />
                                    {card.type === "Spell" && hoveredSpell?.uniqueId === card.uniqueId && (
                                        <div style={styles.spellEffectContainer}>
                                            <button onClick={() => castSpell(card)} style={styles.spellEffectButton}>
                                                Cast Spell
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
                {!isAIEnabled && currentPlayer === 2 && (
                    <div style={{ position: "relative", width: "600px", height: "250px", margin: "0 auto", marginBottom: "40px" }}>
                        {player2Hand.map((card, i, arr) => {
                            const middleIndex = (arr.length - 1) / 2;
                            const rotation = (i - middleIndex) * 25;
                            const offsetX = (i - middleIndex) * 30 + 220;
                            const offsetY = 10;
                            const isHovered = hoveredCardId === card.uniqueId;
                            return (
                                <div
                                    key={`hand-${card.uniqueId}`}
                                    draggable
                                    onDragStart={(e) => handleDragStart(e, card)}
                                    onMouseEnter={() => {
                                        setHoveredCardId(card.uniqueId);
                                        if (card.type === "Spell") {
                                            setHoveredSpell(card);
                                        }
                                    }}
                                    onMouseLeave={() => {
                                        setHoveredCardId(null);
                                        if (card.type === "Spell") {
                                            setHoveredSpell(null);
                                        }
                                    }}
                                    style={{
                                        position: "absolute",
                                        width: "150px",
                                        height: "200px",
                                        border: "2px solid #888",
                                        borderRadius: "10px",
                                        overflow: "hidden",
                                        cursor: "grab",
                                        transition: "transform 0.2s ease",
                                        transform: `translate(${offsetX}px, ${offsetY}px) rotate(${rotation}deg) scale(${isHovered ? 1.1 : 1})`,
                                        transformOrigin: "bottom center"
                                    }}
                                >
                                    <img
                                        src={card.image}
                                        alt={`Card ${card.id}`}
                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                    />
                                    {card.type === "Spell" && hoveredSpell?.uniqueId === card.uniqueId && (
                                        <div style={styles.spellEffectContainer}>
                                            <button onClick={() => castSpell(card)} style={styles.spellEffectButton}>
                                                Cast Spell
                                            </button>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
                
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
                    {stealMode && (
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
                            <h2>Click an opponent Hero to steal it</h2>
                            <div style={styles.playArea}>
                                {(currentPlayer === 1 ? playedCards2 : playedCards1).map((card, index) => (
                                    <div
                                        key={`steal-opponent-${index}`}
                                        style={{
                                            ...styles.slot,
                                            border: card && card.type === "Hero" ? '4px solid red' : '2px dashed #ccc',
                                            cursor: card && card.type === "Hero" ? 'pointer' : 'default'
                                        }}
                                        onClick={() => {
                                            if (card && card.type === "Hero") {
                                                // Find first empty slot in current player's area
                                                const currentPlayedCards = currentPlayer === 1 ? playedCards1 : playedCards2;
                                                const emptySlotIndex = currentPlayedCards.findIndex(card => card === null);
                                                
                                                if (emptySlotIndex === -1) {
                                                    alert("No empty slot to place stolen hero!");
                                                    return;
                                                }
                                                
                                                // Perform the steal
                                                if (currentPlayer === 1) {
                                                    // Player 1 stealing from Player 2
                                                    setPlayedCards2(prev => {
                                                        const newCards = [...prev];
                                                        newCards[index] = null;
                                                        return newCards;
                                                    });
                                                    setPlayedCards1(prev => {
                                                        const newCards = [...prev];
                                                        newCards[emptySlotIndex] = card;
                                                        return newCards;
                                                    });
                                                } else {
                                                    // Player 2 stealing from Player 1
                                                    setPlayedCards1(prev => {
                                                        const newCards = [...prev];
                                                        newCards[index] = null;
                                                        return newCards;
                                                    });
                                                    setPlayedCards2(prev => {
                                                        const newCards = [...prev];
                                                        newCards[emptySlotIndex] = card;
                                                        return newCards;
                                                    });
                                                }
                                                
                                                // Deduct action points
                                                currentPlayer === 1 
                                                    ? setPlayer1ActionPoints(prev => prev - 1)
                                                    : setPlayer2ActionPoints(prev => prev - 1);
                                                
                                                setStealMode(false);
                                                
                                                if ((currentPlayer === 1 ? player1ActionPoints : player2ActionPoints) - 1 === 0) {
                                                    switchTurn();
                                                }
                                            }
                                        }}
                                    >
                                        {card && (
                                            <div style={styles.card}>
                                                <img src={card.image} alt={`Card ${card.id}`} style={styles.cardImage} />
                                                {card.items?.length > 0 && (
                                                    <div style={styles.items}>
                                                        {card.items.map((item, itemIndex) => (
                                                            <img key={`steal-item-${itemIndex}`} src={item.image} alt={`Item ${item.id}`} style={styles.itemImage} />
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
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
          )}
    </div>
    );
}
// Styles
const styles = {
    gameBoard: {
        position: "relative",
        textAlign: "center",
        padding: "20px",
        border: "4px solid black",
        background: "#162C24",
        height: "960px",
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
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
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
    },
    bonusDisplay: {
        color: 'white',
        fontSize: '36px',
        font: 'Luminari'
    },
    stealModal: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.8)',
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white'
    },
    stealButtons: {
        display: 'flex',
        gap: '20px',
        marginTop: '20px'
    },
    confirmButton: {
        padding: '10px 20px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
    },
    cancelButton: {
        padding: '10px 20px',
        backgroundColor: '#f44336',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
    },
    timer: {
        position: "absolute",
        left: "20px",
        top: "5%",
        transform: "translateY(-50%)",
        width: "160px",
        height: "60px",
        background: "radial-gradient(circle at center, rgba(88,173,136,0.3), rgba(22,44,36,0))",
        border: "2px solid #58ad88",
        borderRadius: "12px",
        color: "#daf7e2",
        fontSize: "25px",
        fontFamily: "GreenFuz, sans-serif",
        textAlign: "center",
        textShadow: "0 0 4px #58ad88",
        boxShadow: "0 0 10px rgba(88,173,136,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        animation: "arcaneGlow 3s ease-in-out infinite alternate",
        zIndex: 9999,
      },
      modeButton: {
        padding: '15px 30px',
        fontSize: '18px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        minWidth: '200px',
        transition: 'all 0.3s',
        ':hover': {
          transform: 'scale(1.05)',
          boxShadow: '0 0 15px rgba(76, 175, 80, 0.6)'
        }
      },
    
      gameHeader: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '20px',
        marginBottom: '20px',
        position: 'relative'
      },
    
      aiThinking: {
        position: 'absolute',
        right: '20px',
        backgroundColor: 'rgba(0,0,0,0.7)',
        color: 'white',
        padding: '10px 20px',
        borderRadius: '20px',
        fontSize: '18px'
      },
    
      aiBlocker: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 10,
        cursor: 'not-allowed'
      },
    
      drawButton: {
        padding: '10px 20px',
        fontSize: '16px',
        backgroundColor: '#3F51B5',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'all 0.2s',
        ':hover': {
          backgroundColor: '#303F9F'
        }
      }
};

export default GameBoard
