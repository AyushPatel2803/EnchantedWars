import React, { useState, useEffect, useRef } from "react";
import ActionPoints from "./ActionPoints";
import GameBackground from "../assets/background.png"; // Shared background image, used to visually tie this screen to the Main Menu
import DrawCard from "./DrawCard";
// Import Card Images
import MooseDruid from "../assets/heros/MooseDruid.png";
import DarkGoblin from "../assets/heros/DarkGoblin.png";
import DruidMask from "../assets/items/DruidMask.png";
import CriticalBoost from "../assets/spell/CriticalBoost.png";
import LostSoul from "../assets/heros/LostSoul.png";
import Bullseye from "../assets/heros/Bullseye.png";
import Hydra from "../assets/heros/Hydra.png";
import Cyborg20xx from "../assets/heros/Cyborg20xx.png";
import Switcheroo from "../assets/spell/Switcheroo.png";
import MAD from "../assets/spell/MAD.png";
import RoboMask from"../assets/items/RoboMask.png"
import SpectreMask from "../assets/items/SpectreMask.png"
import ChimeraMask from "../assets/items/ChimeraMask.png"
import SerpentMask from "../assets/items/SerpentMask.png"
import ConsortArmor from "../assets/items/ConsortHelmet.png"
import BearCleaver from "../assets/heros/BearCleaver.png"
import Cerberus from "../assets/heros/Cerberus.png"
import Gargoyle from "../assets/heros/Gargoyle.png"
import Ghoul from "../assets/heros/GhastlyGhoul.png"
import Gorgon from "../assets/heros/Gorgon.png"
import MightyOak from "../assets/heros/MightyOak.png"
import Ragnarok from "../assets/heros/Ragnarok.png"
import TimeMachine from "../assets/heros/TimeMachine.png"
import TitaniumGiant from "../assets/heros/TitaniumGiant.png"
import Vampire from "../assets/heros/Vampire.png"
import WhiteMage from "../assets/heros/WhiteMage.png"
import WingedSerpent from "../assets/heros/WingedSerpent.png"


import dice1 from "../assets/dice/dice1.png";
import dice2 from "../assets/dice/dice2.png";
import dice3 from "../assets/dice/dice3.png";
import dice4 from "../assets/dice/dice4.png";
import dice5 from "../assets/dice/dice5.png";
import dice6 from "../assets/dice/dice6.png";

const GameBoard = () => {
const [hoveredCardId, setHoveredCardId] = useState(null);
const [selectedHandCard, setSelectedHandCard] = useState(null); // the hand card currently "clicked open" for the expand/click-to-place flow

// The board is laid out with fixed pixel sizes (card widths, the 700px hand fan, etc.),
// so on a smaller browser window it's naturally taller/wider than the viewport. Rather
// than letting the page scroll like a website (which it shouldn't -- this is a game
// board, not a document), the whole board is measured at its real/unscaled size and
// shrunk with a CSS transform to always fit inside whatever window it's actually in.
const stageRef = useRef(null);
const [boardScale, setBoardScale] = useState(1);
useEffect(() => {
    let rafId = null;
    const fitToWindow = () => {
        const el = stageRef.current;
        if (!el) return;
        // scrollWidth/scrollHeight reflect the stage's real, untransformed content size
        // -- transform: scale() only changes how it's painted, not its layout box.
        const naturalWidth = el.scrollWidth;
        const naturalHeight = el.scrollHeight;
        if (!naturalWidth || !naturalHeight) return;
        const next = Math.min(window.innerWidth / naturalWidth, window.innerHeight / naturalHeight, 1);
        setBoardScale(prev => (Math.abs(prev - next) > 0.001 ? next : prev));
    };
    const scheduleFit = () => {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(fitToWindow);
    };
    scheduleFit();
    window.addEventListener("resize", scheduleFit);
    // The stage keeps a fixed 100vw/100vh box (see below), so its own size never
    // changes -- only what OVERFLOWS it does, whenever a card is added/removed, a
    // popup opens, the hand's length changes, etc. A plain ResizeObserver on the
    // stage never fires for that (it only watches the element's own box), so a
    // MutationObserver on its subtree is used instead to re-measure on every such
    // DOM change; rAF-scheduling collapses a burst of them into one recheck.
    const mo = new MutationObserver(scheduleFit);
    if (stageRef.current) mo.observe(stageRef.current, { childList: true, subtree: true });
    return () => {
        window.removeEventListener("resize", scheduleFit);
        mo.disconnect();
        if (rafId) cancelAnimationFrame(rafId);
    };
}, []);

    // Define your actual card data with types and affinities
    const cardList = [
        { id: 1, image: MooseDruid, type: "Hero", affinity: "Druid", min: 4, max: 8}, 
        { id: 2, image: DarkGoblin, type: "Hero", affinity: "Dark" , min: 0, max: 6}, 
        { id: 3, image: DruidMask, type: "Item", affinity: "Druid"}, 
        { id: 5, image: CriticalBoost, type: "Spell", affinity: null },
        { id: 6, image: LostSoul, type: "Hero", affinity: "Undead" , min: 0, max: 6},
        { id: 7, image: Bullseye, type: "Hero", affinity: "Consort" , min: 0, max: 4},
        { id: 8, image: Hydra, type: "Hero", affinity: "Serpentine" , min: 0, max: 7}, // was max:0 (unimplemented placeholder); now matches the ported Hydra ability
        { id: 9, image: Cyborg20xx, type: "Hero", affinity: "Cyborg", min: 4, max: 10},
        { id: 10, image: Switcheroo, type: "Spell"},
        { id: 11, image: MAD, type: "Spell"},
        { id: 12, image: RoboMask, type: "Item", affinity: "Cyborg"},
        { id: 13, image: SpectreMask, type: "Item", affinity: "Undead"},
        { id: 14, image: ChimeraMask, type: "Item", affinity: "Dark"},
        { id: 15, image: SerpentMask, type: "Item", affinity: "Serpentine"},
        { id: 16, image: ConsortArmor, type: "Item", affinity: "Consort"},
        { id: 17, image: Gorgon, type: "Hero", affinity: "Serpentine", min: 0, max: 5}, // was max:0 (unimplemented placeholder); now matches the ported Gorgon ability
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

    // Plain-English success/fail text for each Hero's dice-roll ability, shown to the
    // player when they hover a placed Hero card (before they click Hero Roll) -- so
    // the outcome of a roll isn't a mystery, and so this stays one small lookup instead
    // of hand-writing the same descriptions again next to every heroAbilities entry.
    const heroAbilityInfo = {
        1: { name: "Moose Druid", success: "Destroys one of the opponent's placed Heroes.", fail: "This card gets discarded.", normal: "Nothing happens." },
        2: { name: "Dark Goblin", success: "Steals a random card from the opponent's hand.", normal: "Nothing happens." },
        6: { name: "Lost Soul", success: "Draws a random card from the discard pile.", normal: "Nothing happens." },
        7: { name: "Bullseye", success: "Looks at the top 3 cards of the deck and draws one.", normal: "Nothing happens." },
        8: { name: "Hydra", success: "Pulls 2 random cards from the discard pile into your hand.", normal: "Nothing happens.", passive: "Also gives +1 to all of your rolls just by being on the board." },
        9: { name: "Cyborg 20xx", success: "Destroys one of the opponent's placed Heroes.", fail: "Discards 2 cards from your hand.", normal: "Nothing happens." },
        17: { name: "Gorgon", success: "Lets you take an Item card from the discard pile.", normal: "Nothing happens.", passive: "Also gives -2 to the opponent's roll if their Hero lines up with this slot." },
        18: { name: "Winged Serpent", success: "Refills your hand up to 7 cards.", normal: "Nothing happens." },
        19: { name: "Ragnarok", success: "Gives your next roll a bonus.", normal: "Nothing happens." },
        20: { name: "White Mage", always: "Always draws the last Hero that was discarded -- no roll needed." },
        21: { name: "Time Machine", success: "Sends every Hero on the board back to the discard pile.", normal: "Nothing happens." },
        22: { name: "Titanium Giant", success: "Draws 2 cards matching this Hero's affinity.", normal: "Nothing happens." },
        23: { name: "Mighty Oak", always: "Passive -- gives Heroes placed right next to it +2 on their rolls. No roll of its own." },
        24: { name: "Bear Cleaver", success: "Draws 2 cards of the same type.", normal: "Nothing happens." },
        25: { name: "Cerberus", success: "Destroys the opponent's Item cards.", fail: "Destroys your own Item cards.", normal: "Nothing happens." },
        26: { name: "Gargoyle", success: "Forces the opponent to discard a Hero.", normal: "Nothing happens." },
        27: { name: "Vampire", success: "Draws 2 cards of the same type.", normal: "Nothing happens." },
        28: { name: "Ghoul", success: "Steals one of the opponent's placed Heroes.", normal: "Nothing happens." },
    };
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
    const pendingSwitchRef = useRef(false); // Guards against scheduling switchTurn() more than once per depletion
    const [currentPlayer, setCurrentPlayer] = useState(1); // Initial player turn
    const [hoveredCard, setHoveredCard] = useState(null);
    const [diceRolls, setDiceRolls] = useState({ first: null, second: null, bonus: null });
    const [hoveredSpell, setHoveredSpell] = useState(null);
    const [swapSpellActive, setSwapSpellActive] = useState(false);
    const [selectedOwnHero, setSelectedOwnHero] = useState(null);
    const [selectedOpponentHero, setSelectedOpponentHero] = useState(null);
    const [destroyMode, setDestroyMode] = useState(false);
    const [isGorgonPopupOpen, setIsGorgonPopupOpen] = useState(false); // Gorgon's ability: pick an Item card out of the discard pile
    const [itemCardsInDiscard, setItemCardsInDiscard] = useState([]);
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
    const [aiTick, setAiTick] = useState(0); // bumped after every AI move attempt so the AI-turn effect below always gets another chance, even when the randomly-picked action had no valid target and changed nothing

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
            // Always bump the tick, even if the move above was a no-op (e.g. the
            // randomly-chosen action had no valid target). Without this, a wasted
            // pick never changes player2ActionPoints/player2Hand/playedCards2, so
            // this effect would never re-run and the AI would stall indefinitely.
            setAiTick(t => t + 1);
          }, 1500); // 1.5 second delay for AI "thinking"
      
          return () => clearTimeout(aiDelay);
        }
      }, [currentPlayer, player2ActionPoints, isAIEnabled, gameStarted, player2Hand, playedCards2, aiTick]);

    // Destroy Mode, Steal Mode, Gorgon's item-pick popup, Bullseye's top-3-of-the-deck
    // pick, and Switcheroo's item-swap selection all only ever resolved through a human
    // clicking something in the JSX below -- there was never any code path for the AI
    // to finish one of these once its own hero roll or spell opened it, so the AI's
    // turn would just sit there forever "waiting" on a click nobody was going to make.
    // This resolves each one automatically, on a short delay, whenever it's the AI's
    // turn and one of them is open -- using the same target-picking idea throughout
    // (deny/take the opponent's single best Hero; prefer a new affinity for itself).
    useEffect(() => {
        if (!(isAIEnabled && currentPlayer === 2)) return undefined;

        if (destroyMode) {
            const t = setTimeout(() => {
                const targets = playedCards1.map((c, i) => ({ c, i })).filter(s => s.c?.type === "Hero");
                if (targets.length === 0) { setDestroyMode(false); setTimerActive(true); return; }
                // Denies the opponent their single biggest piece.
                const best = targets.slice().sort((a, b) => (b.c.max ?? 0) - (a.c.max ?? 0))[0];
                destroyOpponentHero(best.i);
            }, 900);
            return () => clearTimeout(t);
        }

        if (stealMode) {
            const t = setTimeout(() => {
                const targets = playedCards1.map((c, i) => ({ c, i })).filter(s => s.c?.type === "Hero");
                if (targets.length === 0) { setStealMode(false); setTimerActive(true); return; }
                const best = targets.slice().sort((a, b) => (b.c.max ?? 0) - (a.c.max ?? 0))[0];
                aiResolveSteal(best.i);
            }, 900);
            return () => clearTimeout(t);
        }

        if (isGorgonPopupOpen) {
            const t = setTimeout(() => {
                if (itemCardsInDiscard.length === 0) { setIsGorgonPopupOpen(false); setItemCardsInDiscard([]); setTimerActive(true); return; }
                pickGorgonItem(itemCardsInDiscard[0]);
            }, 900);
            return () => clearTimeout(t);
        }

        if (selectingFromDeck) {
            const t = setTimeout(() => {
                if (topCards.length === 0) { setSelectingFromDeck(false); return; }
                const myAffinities = new Set(playedCards2.filter(Boolean).map(effectiveAffinity));
                const pick = topCards.find(c => c.type === "Hero" && !myAffinities.has(c.affinity)) || topCards[0];
                selectCardFromTopThree(pick);
            }, 900);
            return () => clearTimeout(t);
        }

        if (swapSpellActive) {
            if (selectedOwnHero !== null && selectedOpponentHero !== null) {
                const t = setTimeout(() => swapItems(), 700);
                return () => clearTimeout(t);
            }
            const t = setTimeout(() => {
                const ownIndex = playedCards2.findIndex(c => c?.type === "Hero" && c.items?.length > 0);
                const oppIndex = playedCards1.findIndex(c => c?.type === "Hero" && c.items?.length > 0);
                if (ownIndex === -1 || oppIndex === -1) { cancelSwapSpell(); return; }
                selectOwnHero(ownIndex);
                selectOpponentHero(oppIndex);
            }, 900);
            return () => clearTimeout(t);
        }

        return undefined;
    }, [isAIEnabled, currentPlayer, destroyMode, stealMode, isGorgonPopupOpen, itemCardsInDiscard,
        selectingFromDeck, topCards, swapSpellActive, selectedOwnHero, selectedOpponentHero,
        playedCards1, playedCards2]);

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
    
  // Returns the affinity that will actually count toward the win condition for a
  // played Hero: an equipped Item overrides the Hero's own affinity, exactly like
  // the win-check effect above (and several spells that read a Hero's affinity).
  const effectiveAffinity = (card) => {
    if (!card) return undefined;
    if (card.items && card.items.length > 0 && card.items[0].affinity) {
      return card.items[0].affinity;
    }
    return card.affinity;
  };

  // Estimates the aura bonus a Hero would receive if placed at `slotIndex` on
  // player2's board right now. getBonus() above answers a different question --
  // the bonus an ALREADY-PLACED card at slotIndex is getting -- since it reads
  // currentPlayedCards[slotIndex] itself for the adjacency/mirror checks, so it
  // always comes back 0 for a still-empty slot. This mirrors the same three rules
  // (Hydra self-aura, Mighty Oak adjacency, Gorgon mirror penalty) against a
  // hypothetical placement instead, so empty slots can actually be compared.
  const estimateSlotBonus = (slotIndex) => {
    let bonus = 0;
    playedCards2.forEach(card => { if (card?.id === 8) bonus += 1; }); // Hydra self-aura
    if (playedCards2[slotIndex - 1]?.id === 23) bonus += 2; // Mighty Oak neighbor
    if (playedCards2[slotIndex + 1]?.id === 23) bonus += 2;
    if (playedCards1[slotIndex]?.id === 17) bonus -= 2; // Gorgon mirror penalty
    return bonus;
  };

  // Steal Mode's resolution (see the `stealMode` popup further down) only ever ran
  // from a human clicking an opponent Hero directly in that popup -- there was no
  // function the AI could call to finish its own Steal roll, so the AI's turn just
  // sat there forever "waiting" on a click nobody was going to make. This is that
  // missing function, written to do exactly what that onClick does, just hardcoded
  // for "Player 2 (AI) steals from Player 1" since it only ever runs on the AI's
  // own turn.
  const aiResolveSteal = (targetIndex) => {
    const card = playedCards1[targetIndex];
    if (!card || card.type !== "Hero") { setStealMode(false); setTimerActive(true); return; }
    const emptySlotIndex = playedCards2.findIndex(c => c === null);
    if (emptySlotIndex === -1) { setStealMode(false); setTimerActive(true); return; }

    setPlayedCards1(prev => {
      const newCards = [...prev];
      newCards[targetIndex] = null;
      return newCards;
    });
    setPlayedCards2(prev => {
      const newCards = [...prev];
      newCards[emptySlotIndex] = card;
      return newCards;
    });

    setPlayer2ActionPoints(prev => prev - 1);
    setStealMode(false);
    setTimerActive(true);
    if (player2ActionPoints - 1 === 0) {
      switchTurn();
    }
  };

  // The AI used to just grab a uniformly-random legal-ish action every turn, with
  // zero awareness of the board. This replaces that with real decision-making:
  // it first checks for an immediate win, then scores every action it could take
  // this turn (chasing new affinities and aura bonuses, pressuring a opponent
  // who's close to winning, rolling whichever placed Hero is easiest to succeed
  // with) and takes whichever one scores highest. It also fixes the old
  // `useHeroAbility` case's bug of calling heroEffect with the FILTERED array's
  // index instead of the real board slot index (it built that list by filtering
  // first and mapping second, which renumbers everything 0,1,2... -- this builds
  // it the other way around, map then filter, so the real slot index survives).
  const makeAIMove = () => {
    if (currentPlayer !== 2 || !isAIEnabled) return;

    const emptySlots = [0, 1, 2, 3, 4].filter(i => playedCards2[i] === null);
    const myAffinities = new Set(playedCards2.filter(Boolean).map(effectiveAffinity));
    const oppAffinities = new Set(playedCards1.filter(Boolean).map(effectiveAffinity));
    const bestSlot = (slots) => slots.slice().sort((a, b) => estimateSlotBonus(b) - estimateSlotBonus(a))[0];

    // Immediate win: one slot open, the other four already hold four mutually
    // unique affinities, and hand has a Hero supplying the missing one -- just
    // play it and win, nothing else this turn matters.
    if (emptySlots.length === 1 && myAffinities.size === 4) {
      const winningHero = player2Hand.find(c => c.type === "Hero" && !myAffinities.has(c.affinity));
      if (winningHero) {
        placeCardAt(winningHero, emptySlots[0]);
        return;
      }
    }

    const candidates = [];

    // Play a Hero: prefer one that brings a brand-new affinity (progress toward
    // the win condition) into the empty slot with the best aura bonus available.
    const heroesInHand = player2Hand.filter(c => c.type === "Hero");
    if (emptySlots.length > 0 && heroesInHand.length > 0) {
      const newAffinityHero = heroesInHand.find(c => !myAffinities.has(c.affinity));
      const hero = newAffinityHero || heroesInHand[0];
      candidates.push({ score: newAffinityHero ? 9 : 4, run: () => placeCardAt(hero, bestSlot(emptySlots)) });
    }

    // Equip an Item onto whichever bare Hero stands to gain the most from it
    // (highest card.max, i.e. least likely to trigger its own ability unassisted).
    const itemsInHand = player2Hand.filter(c => c.type === "Item");
    const bareHeroSlots = [0, 1, 2, 3, 4]
      .filter(i => playedCards2[i]?.type === "Hero" && !(playedCards2[i].items?.length > 0));
    if (itemsInHand.length > 0 && bareHeroSlots.length > 0) {
      const targetSlot = bareHeroSlots.slice().sort((a, b) => (playedCards2[b].max ?? 0) - (playedCards2[a].max ?? 0))[0];
      candidates.push({ score: 5, run: () => placeCardAt(itemsInHand[0], targetSlot) });
    }

    // Cast Sacrifice (id 11): discards 3 cards from hand to destroy an opponent
    // Hero -- only worth that trade when the opponent is actually close to
    // winning (3+ unique affinities already down).
    const sacrificeSpell = player2Hand.find(c => c.type === "Spell" && c.id === 11);
    if (sacrificeSpell && hasHero && player2Hand.length - 2 > 0 && oppAffinities.size >= 3) {
      candidates.push({ score: 8, run: () => castSpell(sacrificeSpell) });
    }

    // Cast Critical Boost (id 5): a free draw of 3 with no real downside besides
    // hand size -- a reasonable, low-priority filler move.
    const boostSpell = player2Hand.find(c => c.type === "Spell" && c.id === 5);
    if (boostSpell && player2Hand.length + 3 <= 8) {
      candidates.push({ score: 3, run: () => castSpell(boostSpell) });
    }

    // Cast Switcheroo (id 10): only makes sense once both sides actually have an
    // item-bearing Hero to swap.
    const swapSpell = player2Hand.find(c => c.type === "Spell" && c.id === 10);
    const ownItemHero = playedCards2.some(c => c?.type === "Hero" && c.items?.length > 0);
    const oppItemHero = playedCards1.some(c => c?.type === "Hero" && c.items?.length > 0);
    if (swapSpell && ownItemHero && oppItemHero) {
      candidates.push({ score: 4, run: () => castSpell(swapSpell) });
    }

    // Roll a placed Hero's ability: prefer whichever one is easiest to actually
    // succeed at right now (lowest card.max minus the aura bonus it already has
    // locked in). Built map-then-filter so `i` stays the real board slot index --
    // the old code filtered first and mapped the FILTERED array's index, which is
    // why it used to clear/roll the wrong slot.
    const rollableHeroes = playedCards2
      .map((c, i) => ({ c, i }))
      .filter(s => s.c?.type === "Hero" && s.c.max !== 0);
    if (rollableHeroes.length > 0) {
      const best = rollableHeroes.slice().sort((a, b) =>
        (a.c.max - getBonus(a.i)) - (b.c.max - getBonus(b.i))
      )[0];
      candidates.push({ score: 6, run: () => heroEffect(best.c, best.i) });
    }

    // Replace the whole hand: only when there's nothing worth playing (no Heroes
    // at all in hand) and there's enough AP to actually afford it.
    if (player2ActionPoints >= 2 && heroesInHand.length === 0 && player2Hand.length > 0) {
      candidates.push({ score: 2, run: () => discardAllCards() });
    }

    // Drawing a card is the fallback -- always legal, but the lowest-value option
    // whenever something more productive is available. Guarded by hand size so a
    // full hand with nothing else to do switches the turn instead of alert()-ing
    // on every single AI tick.
    if (player2Hand.length < 8) {
      candidates.push({ score: 1, run: () => handleDrawCard() });
    }

    if (candidates.length === 0) {
      switchTurn();
      return;
    }

    const choice = candidates.reduce((a, b) => (b.score > a.score ? b : a));
    choice.run();
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

        // Every hero used to get its own hand-written case in a giant switch(card.id).
        // That's now a single shared lookup table instead -- one entry per hero, same
        // exact logic as before, just living in one place instead of being copy-pasted.
        // resolve() returns `true` only for the cases that used to `return` early
        // (skipping the action-point charge below because a follow-up popup, like
        // Destroy or Steal mode, charges it once the player finishes picking); every
        // other case keeps charging the action point right away, just like before.
        const heroAbilities = {
            1: { // Moose Druid
                resolve: () => {
                    if (totalRoll >= card.max) {
                        activateDestroyMode();
                        return true;
                    }
                    else if (totalRoll <= card.min) {
                        setDiscardPile(prev => [...prev, card]);
                        setCurrentPlayedCards(prev => {
                            const newPlayed = [...prev];
                            newPlayed[slotIndex] = null;
                            return newPlayed;
                        });
                    }
                    else {
                        alert(`${totalRoll} - Normal roll`);
                    }
                }
            },
            2: { // Dark Goblin
                resolve: () => {
                    if (totalRoll >= card.max) {
                        pullFromOpponent()
                    }
                }
            },
            6: { // Lost Soul
                resolve: () => {
                    if (totalRoll >= card.max) {
                        drawFromDiscard()
                    }
                }
            },
            7: { // Bullseye
                resolve: () => {
                    if (totalRoll >= card.max) {
                        drawFromTopThree()
                        return true;
                    }
                }
            },
            8: { // Hydra -- was unimplemented (fell through to the default case below).
                 // Ported from the online mode's "Twin Snakes" effect in GameBoard.jsx:
                 // rolling 7+ pulls 2 random cards from the discard pile into your hand.
                resolve: () => {
                    if (totalRoll >= card.max) {
                        const currentHand = currentPlayer === 1 ? player1Hand : player2Hand;
                        const setCurrentHand = currentPlayer === 1 ? setPlayer1Hand : setPlayer2Hand;
                        alert("Hydra effect activated! Drawing 2 random cards from the discard pile...");
                        if (discardPile.length >= 2) {
                            const shuffledDiscard = [...discardPile].sort(() => Math.random() - 0.5);
                            const cardsToDraw = shuffledDiscard.slice(0, 2);
                            setCurrentHand([...currentHand, ...cardsToDraw]);
                            setDiscardPile(prev => prev.filter(c => !cardsToDraw.includes(c)));
                        } else if (discardPile.length > 0) {
                            alert("Not enough cards in the discard pile. Drawing all available cards...");
                            setCurrentHand([...currentHand, ...discardPile]);
                            setDiscardPile([]);
                        } else {
                            alert("The discard pile is empty! No cards to draw.");
                        }
                    }
                }
            },
            9: { // Cyborg 20xx
                resolve: () => {
                    if (totalRoll >= card.max) {
                        activateDestroyMode();
                        return true;
                    }
                    else if (totalRoll <= card.min) {
                        discardCard();
                        discardCard();
                        alert("Critical failure! Discarded 2 cards.");
                    }
                    else {
                        alert(`${totalRoll} - Normal roll`);
                    }
                }
            },
            17: { // Gorgon -- was unimplemented (fell through to the default case below).
                  // Ported from the online mode's Gorgon effect in GameBoard.jsx: rolling
                  // 5+ lets you pick an Item card out of the discard pile via a popup.
                resolve: () => {
                    if (totalRoll >= card.max) {
                        const itemCards = discardPile.filter(c => c.type === "Item");
                        if (itemCards.length > 0) {
                            setItemCardsInDiscard(itemCards);
                            setIsGorgonPopupOpen(true);
                            setTimerActive(false);
                            return true; // action point is charged once a card is picked
                        } else {
                            alert("No item cards available in the discard pile!");
                        }
                    } else {
                        alert("Gorgon effect did not activate.");
                    }
                }
            },
            18: { // Winged Serpent -- this case used to be missing a `break`, so a
                  // failed roll silently fell into Ragnarok's case right below it.
                  // Harmless in practice (Ragnarok's own check used this same card's
                  // totalRoll/max, so it always evaluated false), but still a bug.
                  // Moving it into its own resolve() fixes that automatically: a
                  // failed roll here now simply does nothing, exactly as intended.
                resolve: () => {
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
                    }
                }
            },
            19: { // Ragnarok
                resolve: () => {
                    if (totalRoll >= card.max) {
                        setTurnModifier(true)
                    }
                }
            },
            20: { // White Mage -- always triggers, no roll threshold involved
                resolve: () => {
                    drawLastDiscardedHero()
                }
            },
            21: { // Time Machine
                resolve: () => {
                    if (totalRoll >= card.max) {
                        // Discard all played Heroes (both players)
                        const allPlayedHeroes = [...playedCards1, ...playedCards2]
                            .filter(card => card?.type === "Hero");

                        if (allPlayedHeroes.length === 0) {
                            alert("No Heroes on the field to discard!");
                            return;
                        }

                        // Add all Heroes to discard pile
                        setDiscardPile(prev => [...prev, ...allPlayedHeroes]);

                        // Clear all Hero slots
                        setPlayedCards1(prev => prev.map(card => card?.type === "Hero" ? null : card));
                        setPlayedCards2(prev => prev.map(card => card?.type === "Hero" ? null : card));

                        alert("Time Machine activated! All Heroes have been discarded.");
                    }
                }
            },
            22: { // Titanium Giant
                resolve: () => {
                    if (totalRoll >= card.max) {
                        // Check hand size first
                        const currentHand = currentPlayer === 1 ? player1Hand : player2Hand;
                        if (currentHand.length >= 7) { // Because we're adding 2 cards
                            alert('Your hand is too full to draw 2 cards!');
                            return true;
                        }
                        
                        // Draw two cards
                        const card1 = drawCardwithAffinity();
                        const card2 = drawCardwithAffinity();
                        
                        // Check if either card is a spell
                        if (card1 === "Cyborg" || card2 === "Cyborg") {
                            activateDestroyMode();
                            return true;
                        }
                    }
                }
            },
            24: {
                resolve: () => {
                    if (totalRoll >= card.max) {
                        // Check hand size first
                        const currentHand = currentPlayer === 1 ? player1Hand : player2Hand;
                        if (currentHand.length >= 7) { // Because we're adding 2 cards
                            alert('Your hand is too full to draw 2 cards!');
                            return true;
                        }
                        
                        // Draw two cards
                        const card1 = drawCardwithType();
                        const card2 = drawCardwithType();
                        
                        // Check if either card is a spell
                        if (card1 === "Spell" || card2 === "Spell") {
                            activateDestroyMode();
                            return true;
                        }
                    }
                }
            },
            25: {
                resolve: () => {
                    if (totalRoll >= card.max) {
                        destroyOpponentsMods();
                    }
                    else if (totalRoll <= card.min) {
                        destroyUserMods();
                    }
                }
            },
            26: {
                resolve: () => {
                    if (totalRoll >= card.max) {
                        forceOpponentDiscardHeroes()
                    }
                }
            },
            27: {
                resolve: () => {
                    if (totalRoll >= card.max) {
                        const currentHand = currentPlayer === 1 ? player1Hand : player2Hand;
                        if (currentHand.length >= 7) { // Because we're adding 2 cards
                            alert('Your hand is too full to draw 2 cards!');
                            return true;
                        }
                        
                        // Draw two cards
                        const card1 = drawCardwithType();
                        const card2 = drawCardwithType();
                    }
                }
            },
            28: {
                resolve: () => {
                    if (totalRoll >= card.max) {
                        activateStealMode();
                        return true;
                    }
                }
            },
        };

        const ability = heroAbilities[card.id];
        const skipCleanup = ability ? ability.resolve() : (alert(`${totalRoll} - Normal roll`), false);

        if (skipCleanup) return;

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

    // Win detection used to run via `let intervalId = setInterval(checkWinCondition, 200)`
    // declared directly in the component body. Since that line executed on EVERY render
    // (not inside a useEffect, no cleanup), each render spawned a brand-new interval that
    // was never cleared, so leaked intervals piled up over a session and caused the
    // multi-second delay observed when a win actually happened. Moving it into a useEffect
    // keyed on the played-card arrays fixes the leak: at most one interval is ever alive,
    // it's cleared whenever the board changes or the component unmounts, and the win check
    // also runs immediately on every placement instead of waiting for the next 200ms tick.
    useEffect(() => {
        const checkPlayerWin = (playedCards) => {
            if (playedCards.every((card) => card && (card.type === "Hero"))) {
                const affinities = playedCards.map((card) => {
                    // Check if the card has an equipped item with a different affinity
                    if (card.items && card.items.length > 0 && card.items[0].affinity) {
                        return card.items[0].affinity; // Use item's affinity if it exists
                    }
                    return card.affinity; // Otherwise use hero's affinity
                });
                const uniqueAffinities = new Set(affinities);
                return uniqueAffinities.size === 5; // Check if all affinities are unique
            }
            return false;
        };

        const checkWinCondition = () => {
            if (checkPlayerWin(playedCards1)) {
                const playAgain = window.confirm("Player 1 wins! Do you want to play again?");
                window.location.href = playAgain ? "/local-game" : "/";
            } else if (checkPlayerWin(playedCards2)) {
                const playAgain = window.confirm("Player 2 wins! Do you want to play again?");
                window.location.href = playAgain ? "/local-game" : "/";
            }
        };

        checkWinCondition(); // Check immediately so a win is caught the moment it happens
        const intervalId = setInterval(checkWinCondition, 200);
        return () => clearInterval(intervalId);
    }, [playedCards1, playedCards2]);
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

    // The actual placement logic (same exact checks/updates handleDrop always ran),
    // pulled out so both drag-and-drop AND the click-a-card/click-a-slot flow use the
    // one shared implementation -- nothing about what counts as a valid placement changes.
    const placeCardAt = (card, slotIndex) => {
        if (!checkActionPoints()) return; // Enforce action points before allowing a placement

        const currentActionPoints = currentPlayer === 1 ? player1ActionPoints : player2ActionPoints;
        const currentPlayedCards = currentPlayer === 1 ? playedCards1 : playedCards2; 
        const setCurrentHand = currentPlayer === 1 ? setPlayer1Hand : setPlayer2Hand;
        const setCurrentActionPoints = currentPlayer === 1 ? setPlayer1ActionPoints : setPlayer2ActionPoints;
        const setCurrentPlayedCards = currentPlayer === 1 ? setPlayedCards1 : setPlayedCards2;

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
            setCurrentActionPoints((prev) => {
                const next = prev - 1;
                if (next <= 0 && !pendingSwitchRef.current) {
                    pendingSwitchRef.current = true;
                    // Defer so the turn switch runs after this update commits,
                    // instead of deciding off a snapshot that can be stale.
                    setTimeout(() => {
                        pendingSwitchRef.current = false;
                        switchTurn();
                    }, 0);
                }
                return next;
            });
        }
    };

    const handleDrop = (e, slotIndex) => {
        e.preventDefault();
        const card = JSON.parse(e.dataTransfer.getData("card"));
        placeCardAt(card, slotIndex);
    };

    // Whether `card` (a Hero/Item from hand) could legally land on `slotIndex` on the
    // CURRENT player's board right now -- same rules placeCardAt enforces, used to light
    // up valid slots once a card is selected via click, and to auto-pick a slot for the
    // "Play Card" button in the expanded preview. Spells never target a slot.
    const isValidTargetSlotForCurrent = (card, slotIndex) => {
        if (!card) return false;
        const currentPlayedCards = currentPlayer === 1 ? playedCards1 : playedCards2;
        if (card.type === "Hero") {
            return currentPlayedCards[slotIndex] === null;
        }
        if (card.type === "Item") {
            const targetCard = currentPlayedCards[slotIndex];
            return !!targetCard && targetCard.type === "Hero" && !(targetCard.items?.length >= 1);
        }
        return false;
    };

    // "Play Card" button in the expanded hand-card preview: places the selected card
    // on the first slot that's actually valid for it (same rule a drag-drop would need
    // to land on), so the player doesn't have to pick a specific slot by hand.
    const playSelectedToFirstValidSlot = () => {
        if (!selectedHandCard) return;
        const targetIndex = [0, 1, 2, 3, 4].find((idx) => isValidTargetSlotForCurrent(selectedHandCard, idx));
        if (targetIndex === undefined) {
            alert(selectedHandCard.type === "Item" ? "No Hero available to equip this item on!" : "No open slot to place this card!");
            return;
        }
        placeCardAt(selectedHandCard, targetIndex);
        setSelectedHandCard(null);
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

    // Gorgon's ability: player picks one Item card out of the discard pile and
    // adds it straight to their hand. Mirrors destroyOpponentHero/stealOpponentHero
    // below -- the action point is only spent once the player actually picks a card.
    const pickGorgonItem = (itemCard) => {
        const setCurrentHand = currentPlayer === 1 ? setPlayer1Hand : setPlayer2Hand;
        const setCurrentActionPoints = currentPlayer === 1 ? setPlayer1ActionPoints : setPlayer2ActionPoints;
        const currentActionPoints = currentPlayer === 1 ? player1ActionPoints : player2ActionPoints;

        setCurrentHand(prev => [...prev, itemCard]);
        setDiscardPile(prev => prev.filter(c => c !== itemCard));

        setIsGorgonPopupOpen(false);
        setItemCardsInDiscard([]);
        setTimerActive(true);

        setCurrentActionPoints(prev => prev - 1);
        if (currentActionPoints - 1 === 0) {
            switchTurn();
        }
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

    // Renders one player's hand in the wide-fan layout: cards spread out (not the old
    // tight overlapping fan) so nothing stays hidden, a hovered card lifts above its
    // neighbors, and the fan recomputes from the current hand every render -- so when a
    // card is removed (played from the middle or anywhere else), the rest automatically
    // close the gap into a fresh fan instead of leaving dead space, since each card's
    // position is just a function of its current index among whatever cards remain.
    const renderHand = (hand) => {
        const count = hand.length;
        const middleIndex = (count - 1) / 2;
        return (
            <div style={styles.handFanWrap}>
                {/* Floats on top of the fan itself (same box, absolutely positioned)
                    instead of being inserted above it in normal document flow -- that
                    way selecting a card never pushes the fan (or anything below it, like
                    the Discard Pile) down the page or off the bottom of the screen. The
                    fan stays exactly where it was, so the rest of the hand is still right
                    there to click without scrolling. */}
                {selectedHandCard && (
                    <div style={styles.handPreviewWrap}>
                        {/* The preview sits on top of the fan, so the card(s) directly behind
                            it can be out of reach -- this gives a guaranteed way to back out
                            and get the fan back, instead of relying on clicking a (possibly
                            covered) card again. */}
                        <button
                            onClick={() => setSelectedHandCard(null)}
                            style={styles.handPreviewClose}
                            aria-label="Close preview"
                        >
                            &times;
                        </button>
                        <img src={selectedHandCard.image} alt={`Card ${selectedHandCard.id}`} style={styles.handPreviewImage} />
                        {selectedHandCard.type === "Spell" ? (
                            <button
                                onClick={() => { castSpell(selectedHandCard); setSelectedHandCard(null); }}
                                style={styles.spellEffectButton}
                            >
                                Cast Spell
                            </button>
                        ) : (
                            <button onClick={playSelectedToFirstValidSlot} style={styles.heroEffectButton}>
                                Play Card
                            </button>
                        )}
                        {/* Spells are never draggable and never light up a slot (they're
                            always played via the Cast Spell button above), so the hint
                            line is skipped entirely for them. */}
                        {selectedHandCard.type !== "Spell" && (
                            <div style={styles.handPreviewHint}>
                                {selectedHandCard.type === "Item" ? "or click a glowing Hero" : "or click a glowing slot"} &mdash; or drag the card below
                            </div>
                        )}
                        <div style={styles.handPreviewCancelHint}>click &times; to go back</div>
                    </div>
                )}
                {hand.map((card, i) => {
                    const rotation = count > 1 ? (i - middleIndex) * 10 : 0;
                    const offsetX = (i - middleIndex) * 58 + 270;
                    const isHovered = hoveredCardId === card.uniqueId;
                    const isSelected = selectedHandCard?.uniqueId === card.uniqueId;
                    const lift = isHovered ? -24 : 0;
                    const scale = isHovered ? 1.12 : 1;
                    return (
                        <div
                            key={`hand-${card.uniqueId}`}
                            draggable={card.type !== "Spell"}
                            onDragStart={(e) => handleDragStart(e, card)}
                            onMouseEnter={() => setHoveredCardId(card.uniqueId)}
                            onMouseLeave={() => setHoveredCardId(null)}
                            onClick={() => setSelectedHandCard(prev => (prev?.uniqueId === card.uniqueId ? null : card))}
                            style={{
                                position: "absolute",
                                width: "150px",
                                height: "200px",
                                border: isSelected ? "3px solid #ffd400" : "2px solid #888",
                                borderRadius: "10px",
                                overflow: "hidden",
                                cursor: card.type === "Spell" ? "pointer" : "grab",
                                transition: "transform 0.18s ease-out, border-color 0.12s ease-out, box-shadow 0.12s ease-out",
                                transform: `translate(${offsetX}px, ${10 + lift}px) rotate(${rotation}deg) scale(${scale})`,
                                transformOrigin: "bottom center",
                                zIndex: (isHovered || isSelected) ? 50 : i,
                                boxShadow: isHovered ? "0 10px 22px rgba(0,0,0,0.6)" : "none"
                            }}
                        >
                            <img
                                src={card.image}
                                alt={`Card ${card.id}`}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            />
                        </div>
                    );
                })}
            </div>
        );
    };

    return (
        <div style={{ width: "100vw", height: "100vh", overflow: "hidden", margin: 0, padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        {/* The stage keeps an explicit 100vw x 100vh size (same as this used to be,
            minus the old 120vh overshoot) rather than sizing to its content -- several
            full-screen overlays inside it (the mode-select prompt, popups) are
            `position: fixed`, and `position: fixed`/`absolute` children never
            contribute to an auto-sized parent's dimensions, even once a transformed
            ancestor like this one becomes their containing block. Without an explicit
            size here the stage would collapse to 0x0 any time one of those overlays
            was the only thing on screen, which is exactly what happened the first time
            this was tried. Ordinary in-flow content (the board/hand) that's taller or
            wider than 100vw/100vh still correctly grows the stage's *scrollWidth/
            scrollHeight* beyond that even with this explicit size set, which is what
            the fit-to-window effect above actually measures. */}
        <div ref={stageRef} style={{ width: "100vw", height: "100vh", transform: `scale(${boardScale})`, transformOrigin: "center center", flexShrink: 0 }}>
        {showAIPrompt && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#0b1a14',
            isolation: 'isolate',
            overflow: 'hidden',
            zIndex: 1000,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#daf7e2',
          }}>
            <div className="ew-bg-pan" style={{
              background: `linear-gradient(rgba(8,18,14,0.78), rgba(8,18,14,0.92)), url(${GameBackground}) center center / cover no-repeat`,
            }} />
            <div className="ew-bg-smoke" />
            <div className="ew-bg-orb ew-bg-orb-a" />
            <div className="ew-bg-orb ew-bg-orb-b" />
            <div style={styles.modeSelectCard}>
              <h2 style={styles.modeSelectTitle}>Game Mode Selection</h2>
              <p style={styles.modeSelectSubtitle}>Choose your opponent:</p>
              <div style={{ display: 'flex', gap: '20px', marginTop: '28px' }}>
                <button
                  onClick={() => {
                    setIsAIEnabled(true);
                    setShowAIPrompt(false);
                    setGameStarted(true);
                  }}
                  style={styles.modeButton}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 0 18px rgba(88,173,136,0.7)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = styles.modeButton.boxShadow; }}
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
                  onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 0 18px rgba(88,173,136,0.7)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = styles.modeButton.boxShadow; }}
                >
                  Play vs Human
                </button>
              </div>
            </div>
          </div>
        )}
          
        {gameStarted && (
        <div style={styles.gameBoard}>
                <div className="ew-bg-pan" style={{
                  background: `linear-gradient(rgba(8,18,14,0.82), rgba(8,18,14,0.9)), url(${GameBackground}) center center / cover no-repeat`,
                }} />
                <div className="ew-bg-smoke" />
                <div className="ew-bg-orb ew-bg-orb-a" />
                <div className="ew-bg-orb ew-bg-orb-b" />
                <div style={{
                    ...styles.turnBanner,
                    backgroundColor: currentPlayer === 1 ? '#1565C0' : '#C62828',
                }}>
                    {isAIEnabled
                        ? (currentPlayer === 1 ? "Your Turn" : "AI's Turn")
                        : `Player ${currentPlayer}'s Turn`}
                </div>
                <ActionPoints points={currentPlayer === 1 ? player1ActionPoints : player2ActionPoints}/>
                <DrawCard onDrawCard={handleDrawCard}/>
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
            <div style={{...styles.playArea, ...(currentPlayer !== 2 ? styles.inactiveBoard : {})}}>
                {playedCards2.map((card, index) => (
                    <div
                        key={`player2-${index}`}
                        style={{
                            ...styles.slot,
                            ...(currentPlayer === 2 && isValidTargetSlotForCurrent(selectedHandCard, index) ? styles.slotClickable : {})
                        }}
                        onDragOver={handleDragOver}
                        onDrop={(e) => currentPlayer === 2 && handleDrop(e, index)}
                        onClick={() => currentPlayer === 2 && isValidTargetSlotForCurrent(selectedHandCard, index) && (placeCardAt(selectedHandCard, index), setSelectedHandCard(null))}
                        onMouseEnter={() => currentPlayer === 2 && card?.type === "Hero" && card.max !== 0 && setHoveredCard({ card, slotIndex: index })}
                        onMouseLeave={() => currentPlayer === 2 && setHoveredCard(null)}
                    >
                        {card ? (
                            <div style={styles.card}>
                                <img src={card.image} alt={`Card ${card.id}`} style={styles.cardImage} />
                                {card.id === 23 && (
                                    <div style={styles.mightyOakBadge}>+2 to neighbors</div>
                                )}
                                {card.items && card.items.length > 0 && (
                                    <div style={styles.items}>
                                        {card.items.map((item, itemIndex) => (
                                            <img key={`player2-item-${itemIndex}`} src={item.image} alt={`Item ${item.id}`} style={styles.itemImage} />
                                        ))}
                                    </div>
                                )}
                                {card.type === "Hero" && hoveredCard?.slotIndex === index && currentPlayer === 2 && (
                                    <div style={styles.heroEffectContainer}>
                                        {heroAbilityInfo[card.id] && (
                                            <div style={styles.heroAbilityInfo}>
                                                {heroAbilityInfo[card.id].success && (
                                                    <div>Roll {card.max}+: {heroAbilityInfo[card.id].success}</div>
                                                )}
                                                {card.min > 0 && heroAbilityInfo[card.id].fail && (
                                                    <div>Roll {card.min} or less: {heroAbilityInfo[card.id].fail}</div>
                                                )}
                                            </div>
                                        )}
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
            <div style={{...styles.playArea, ...(currentPlayer !== 1 ? styles.inactiveBoard : {})}}>
                {playedCards1.map((card, index) => (
                    <div
                        key={`player1-${index}`}
                        style={{
                            ...styles.slot,
                            ...(currentPlayer === 1 && isValidTargetSlotForCurrent(selectedHandCard, index) ? styles.slotClickable : {})
                        }}
                        onDragOver={handleDragOver}
                        onDrop={(e) => currentPlayer === 1 && handleDrop(e, index)}
                        onClick={() => currentPlayer === 1 && isValidTargetSlotForCurrent(selectedHandCard, index) && (placeCardAt(selectedHandCard, index), setSelectedHandCard(null))}
                        onMouseEnter={() => currentPlayer === 1 && card?.type === "Hero" && card.max !== 0 && setHoveredCard({ card, slotIndex: index })}
                        onMouseLeave={() => currentPlayer === 1 && setHoveredCard(null)}
                    >
                        {card ? (
                            <div style={styles.card}>
                                <img src={card.image} alt={`Card ${card.id}`} style={styles.cardImage} />
                                {card.id === 23 && (
                                    <div style={styles.mightyOakBadge}>+2 to neighbors</div>
                                )}
                                {card.items && card.items.length > 0 && (
                                    <div style={styles.items}>
                                        {card.items.map((item, itemIndex) => (
                                            <img key={`player1-item-${itemIndex}`} src={item.image} alt={`Item ${item.id}`} style={styles.itemImage} />
                                        ))}
                                    </div>
                                )}
                                {card.type === "Hero" && hoveredCard?.slotIndex === index && currentPlayer === 1 && (
                                    <div style={styles.heroEffectContainer}>
                                        {heroAbilityInfo[card.id] && (
                                            <div style={styles.heroAbilityInfo}>
                                                {heroAbilityInfo[card.id].success && (
                                                    <div>Roll {card.max}+: {heroAbilityInfo[card.id].success}</div>
                                                )}
                                                {card.min > 0 && heroAbilityInfo[card.id].fail && (
                                                    <div>Roll {card.min} or less: {heroAbilityInfo[card.id].fail}</div>
                                                )}
                                            </div>
                                        )}
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

            {currentPlayer === 1 && renderHand(player1Hand)}
            {!isAIEnabled && currentPlayer === 2 && renderHand(player2Hand)}

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
                {/* Gorgon's ability: pick an Item card out of the discard pile */}
                {isGorgonPopupOpen && (
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
                            <h2>Pick an Item card from the discard pile</h2>
                            <div style={styles.playArea}>
                                {itemCardsInDiscard.map((card, index) => (
                                    <div
                                        key={`gorgon-item-${index}`}
                                        style={{
                                            ...styles.slot,
                                            border: '4px solid gold',
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => pickGorgonItem(card)}
                                    >
                                        <div style={styles.card}>
                                            <img src={card.image} alt={`Card ${card.id}`} style={styles.cardImage} />
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button 
                                onClick={() => { setIsGorgonPopupOpen(false); setItemCardsInDiscard([]); setTimerActive(true); }} 
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
    </div>
    );
}
// Styles
const styles = {
    gameBoard: {
        position: "relative",
        textAlign: "center",
        padding: "20px",
        border: "2px solid #58ad88",
        backgroundColor: "#0b1a14",
        isolation: "isolate",
        overflow: "hidden",
        boxShadow: "0 0 30px rgba(88,173,136,0.25)",
        height: "960px",
    },
    turnBanner: {
        display: "inline-block",
        margin: "0 auto 10px",
        padding: "10px 28px",
        borderRadius: "24px",
        color: "#fff",
        fontSize: "22px",
        fontWeight: "bold",
        letterSpacing: "0.5px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.4)",
        transition: "background-color 0.3s ease",
    },
    inactiveBoard: {
        opacity: 0.4,
        filter: "grayscale(60%)",
        pointerEvents: "none",
        transition: "opacity 0.3s ease, filter 0.3s ease",
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
        transition: "border-color 0.12s, box-shadow 0.12s",
    },
    // Layered on top of `slot` once a hand card is selected and this slot is a legal
    // place for it (an open slot for a Hero, or a Hero-with-no-item for an Item) --
    // lets the player click the slot directly instead of only being able to drag.
    slotClickable: {
        // Use the same shorthand `border` property as the base `slot` style (not
        // borderStyle/borderColor separately) -- mixing shorthand and longhand border
        // properties across renders is what was spamming React's "Removing borderStyle
        // border" console warnings whenever a slot's highlight toggled on/off.
        border: "2px solid #ffd400",
        boxShadow: "0 0 10px rgba(255, 212, 0, 0.5)",
        cursor: "pointer",
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
    // Shows each Hero's roll thresholds/outcomes above the Hero Roll button, so the
    // player can see what a roll will do before committing to it.
    heroAbilityInfo: {
        color: '#fff',
        fontSize: '11px',
        maxWidth: '140px',
        textAlign: 'center',
        marginBottom: '6px',
        lineHeight: '1.3',
    },
    // Small always-on badge for Mighty Oak, since its +2 buff to neighboring Heroes
    // is passive (no roll, no button) and would otherwise be invisible on the card.
    mightyOakBadge: {
        position: 'absolute',
        top: '4px',
        left: '4px',
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        color: '#7CFC00',
        fontSize: '10px',
        padding: '2px 5px',
        borderRadius: '4px',
        zIndex: 5,
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
        // Was fully transparent (alpha 0), so the Cast Spell button sat directly on
        // top of the card art's own baked-in title/description text with nothing to
        // separate them -- a dark backdrop (matching heroEffectContainer) keeps the
        // button legible instead of visually clashing with the card's own text.
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        padding: '10px',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0,0,0,0.5)',
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
    // Wide-fan hand container: a plain positioning box, same size as the old fan's --
    // each card inside is absolutely positioned/rotated by renderHand().
    handFanWrap: {
        position: "relative",
        width: "700px",
        height: "250px",
        margin: "0 auto",
        marginBottom: "40px",
    },
    // Full-size preview shown above the hand once a card is clicked.
    handPreviewWrap: {
        // Absolutely positioned inside handFanWrap (which is `position: relative`) so it
        // overlays the fan in place instead of pushing it down -- see the comment where
        // it's rendered in renderHand() for why.
        position: "absolute",
        top: 0,
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "6px",
        backgroundColor: "rgba(8, 26, 18, 0.94)",
        padding: "8px 14px 10px",
        borderRadius: "12px",
        border: "1px solid rgba(111,255,176,0.4)",
        boxShadow: "0 8px 20px rgba(0,0,0,0.55)",
        zIndex: 70,
    },
    handPreviewImage: {
        width: "128px",
        height: "170px",
        objectFit: "cover",
        borderRadius: "10px",
        border: "3px solid #6fffb0",
        boxShadow: "0 0 18px rgba(111,255,176,0.55)",
    },
    handPreviewHint: {
        fontSize: "12px",
        color: "#b9d8c7",
    },
    // Small round "x" pinned to the top-right corner of the preview so there's always a
    // guaranteed way to back out of it, even though the preview can sit on top of (and
    // block clicks to) whichever hand cards are directly behind it.
    handPreviewClose: {
        position: "absolute",
        top: "-10px",
        right: "-10px",
        width: "26px",
        height: "26px",
        borderRadius: "50%",
        border: "2px solid #0b1a14",
        backgroundColor: "#ff5a5a",
        color: "#fff",
        fontSize: "16px",
        lineHeight: "1",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 2px 8px rgba(0,0,0,0.5)",
        zIndex: 71,
    },
    handPreviewCancelHint: {
        fontSize: "11px",
        color: "#8aa698",
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
        fontFamily: 'GreenFuz, sans-serif',
        letterSpacing: '0.5px',
        backgroundColor: 'rgba(22,44,36,0.8)',
        color: '#daf7e2',
        border: '2px solid #58ad88',
        borderRadius: '10px',
        cursor: 'pointer',
        minWidth: '200px',
        textShadow: '0 0 4px #58ad88',
        boxShadow: '0 0 10px rgba(88,173,136,0.4)',
        transition: 'all 0.2s ease',
      },
      modeSelectCard: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '40px 60px',
        background: 'rgba(11,26,20,0.85)',
        border: '2px solid #58ad88',
        borderRadius: '16px',
        boxShadow: '0 0 30px rgba(88,173,136,0.3)',
      },
      modeSelectTitle: {
        margin: 0,
        fontFamily: 'GreenFuz, sans-serif',
        fontSize: '36px',
        color: '#daf7e2',
        textShadow: '0 0 8px #58ad88',
      },
      modeSelectSubtitle: {
        margin: '10px 0 0',
        fontSize: '16px',
        color: '#9fd8bb',
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
