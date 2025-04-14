import React from 'react';
import PropTypes from 'prop-types';

//heros
import EmberLeaf from "../assets/heros/EmberLeaf.png";
import DarkGoblin from "../assets/heros/DarkGoblin.png";
import LostSoul from "../assets/heros/LostSoul.png";
import Bullseye from "../assets/heros/Bullseye.png";
import TwinSnakes from "../assets/heros/TwinSnakes.png";
import Cyborg20xx from "../assets/heros/Cyborg20xxx.png";
import BearCleaver from "../assets/heros/BearCleaver.png";
import Arachnea from "../assets/heros/Arachnea.png";
import Gorgon from "../assets/heros/Gorgon1.png";
import MightyOak from "../assets/heros/MightyOak.png";
import Ragnarok from "../assets/heros/Ragnarok.png";
import TheInventor from "../assets/heros/TheInventor.png";
import TitaniumGiant from "../assets/heros/TitaniumGiant.png";
import Vampire from "../assets/heros/Vampire.png";
import WhiteMage from "../assets/heros/WhiteMage.png";
import WingedSerpent from "../assets/heros/WingedSerpent.png";
import GhastlyGhoul from "../assets/heros/GhastlyGhoul.png";

//items
import DruidMask from "../assets/items/DruidMask.png";
import RoboMask from "../assets/items/RoboMask.png";
import SerpentMask from "../assets/items/SerpentMask.png";
import SpectreMask from "../assets/items/SpectreMask.png";
import ChimeraMask from "../assets/items/ChimeraMask.png";
import ConsortMask from "../assets/items/ConsortHelmet.png";

//spells
import CriticalBoost from "../assets/spell/CriticalBoost.png";
import DiamondRing from "../assets/spell/DiamondRing.png";
import FreeDraw from "../assets/spell/FreeDraw.png";
// import MAD from "../assets/spell/MAD.png";
// import Switcheroo from "../assets/spell/Switcheroo.png";


// Card image mapping
const cardImageMap = {
  EmberLeaf: EmberLeaf,
  DarkGoblin: DarkGoblin,
  DruidMask: DruidMask,
  CriticalBoost: CriticalBoost,
  LostSoul: LostSoul,
  Bullseye: Bullseye,
  TwinSnakes: TwinSnakes,
  Cyborg20xx: Cyborg20xx,
  BearCleaver: BearCleaver,
  Arachnea: Arachnea,
  Gorgon: Gorgon,
  MightyOak: MightyOak,
  Ragnarok: Ragnarok,
  TheInventor: TheInventor,
  TitaniumGiant: TitaniumGiant,
  Vampire: Vampire,
  WhiteMage: WhiteMage,
  WingedSerpent: WingedSerpent,
  RoboMask: RoboMask,
  SerpentMask: SerpentMask,
  SpectreMask: SpectreMask,
  ChimeraMask: ChimeraMask,
  ConsortMask: ConsortMask,
  // MAD: MAD,
  // Switcheroo: Switcheroo,
  GhastlyGhoul: GhastlyGhoul,
  DiamondRing: DiamondRing,
  FreeDraw: FreeDraw,
};

const OpponentCardSlot = ({ card }) => {
  // Debug log to help with troubleshooting
  if (card && !cardImageMap[card.name]) {
    console.warn(`Missing image for card: ${card.name}`);
  }

  return (
    <div style={styles.slot}>
      {card ? (
        <div style={styles.card}>
          <img
            src={cardImageMap[card.name] || DecoyDoll} // Fallback to DecoyDoll if image missing
            alt={card.name || 'Unknown Card'}
            style={styles.cardImage}
            onError={(e) => {
              e.target.src = DecoyDoll; // Fallback image if loading fails
            }}
          />
        </div>
      ) : (
        <div style={styles.emptySlot}>Opponent Slot</div>
      )}
    </div>
  );
};

// Component styles
const styles = {
  slot: {
    width: "calc(120px + 1vw)",
    height: "calc(160px + 1vh)",
    border: "1px dashed #ccc",
    borderRadius: "8px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1E7149",
    maxWidth: "150px",
    maxHeight: "200px",
    position: 'relative',
    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
    transition: 'transform 0.2s ease',
    ':hover': {
      transform: 'translateY(-5px)'
    }
  },
  card: {
    width: "100%",
    height: "100%",
    border: "1px solid #888",
    borderRadius: "8px",
    overflow: "hidden",
    flexShrink: 0,
  },
  cardImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "center",
  },
  emptySlot: {
    color: "#888",
    fontSize: "0.75rem",
    textAlign: "center",
    padding: "8px",
  },
};

// Prop type validation
OpponentCardSlot.propTypes = {
  card: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['Hero', 'Item', 'Spell']),
    affinity: PropTypes.string,
    min: PropTypes.number,
    max: PropTypes.number,
  }),
};

// Default props
OpponentCardSlot.defaultProps = {
  card: null,
};

export default OpponentCardSlot;