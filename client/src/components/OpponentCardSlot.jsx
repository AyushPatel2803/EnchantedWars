import React from 'react';
import PropTypes from 'prop-types';

// Import all card images
import MooseDruid from '../assets/heros/MooseDruid.png';
import DarkGoblin from '../assets/heros/DarkGoblin.png';
import LostSoul from '../assets/heros/LostSoul.png';
import Bullseye from '../assets/heros/Bullseye.png';
import Hydra from '../assets/heros/Hydra.png';
import Cyborg20xx from '../assets/heros/Cyborg20xx.png';
import BearCleaver from '../assets/heros/BearCleaver.png';
import Cerberus from '../assets/heros/Cerberus.png';
import Gargoyle from '../assets/heros/Gargoyle.png';
import Gorgon from '../assets/heros/Gorgon.png';
import MightyOak from '../assets/heros/MightyOak.png';
import Ragnarok from '../assets/heros/Ragnarok.png';
import TimeMachine from '../assets/heros/TimeMachine.png';
import TitaniumGiant from '../assets/heros/TitaniumGiant.png';
import Vampire from '../assets/heros/Vampire.png';
import WhiteMage from '../assets/heros/WhiteMage.png';
import WingedSerpent from '../assets/heros/WingedSerpent.png';
import DruidMask from '../assets/items/DruidMask.png';
import DecoyDoll from '../assets/items/DecoyDoll.png';
import RoboMask from '../assets/items/RoboMask.png';
import SerpentMask from '../assets/items/SerpentMask.png';
import SpectreMask from '../assets/items/SpectreMask.png';
import CriticalBoost from '../assets/spell/CriticalBoost.png';
import MAD from '../assets/spell/MAD.png';
import Switcheroo from '../assets/spell/Switcheroo.png';

// Card image mapping
const cardImageMap = {
  MooseDruid,
  DarkGoblin,
  LostSoul,
  Bullseye,
  Hydra,
  Cyborg20xx,
  BearCleaver,
  Cerberus,
  Gargoyle,
  Gorgon,
  MightyOak,
  Ragnarok,
  TimeMachine,
  TitaniumGiant,
  Vampire,
  WhiteMage,
  WingedSerpent,
  DruidMask,
  DecoyDoll,
  RoboMask,
  SerpentMask,
  SpectreMask,
  CriticalBoost,
  MAD,
  Switcheroo,
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