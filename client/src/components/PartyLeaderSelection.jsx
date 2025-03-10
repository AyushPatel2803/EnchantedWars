import React, {useState} from "react";
import "./PartyLeaderSelection.css";    

import Chronomancer from "../assets/partyleader/Chronomancer.png";
import MistressOfDarkness from "../assets/partyleader/MistressOfDarkness.png";
import NatureGuardian from "../assets/partyleader/NatureGuardian.png";
import TheSerpent from "../assets/partyleader/TheSerpent.png";
import TheSoulKeeper from "../assets/partyleader/TheSoulKeeper.png";
import TheConcort from "../assets/partyleader/TheConcort.png";

const PartyLeaderSelection = ({ onLeaderSelect }) => {
    const [selectedLeader, setSelectedLeader] = useState(null);

    const partyLeaders = [
        { id: 1, name: 'Chronomancer', image: Chronomancer, class: 'Time' },
        { id: 2, name: 'Mistress Of Darkness', image: MistressOfDarkness, class: 'Dark' },
        { id: 3, name: 'Nature Guardian', image: NatureGuardian, class: 'Druid' },
        { id: 4, name: 'The Serpent', image: TheSerpent, class: 'Poison' },
        { id: 5, name: 'The SoulKeeper', image: TheSoulKeeper, class: 'Soul' },
        { id: 6, name: 'The Concort', image: TheConcort, class: 'Spirit' },
        // Add other party leaders
    ];

    const handleLeaderSelect = (leader) => {
        setSelectedLeader(leader);
    };

    const confirmSelection = () => {
        if (selectedLeader) {
            onLeaderSelect(selectedLeader);
        }
    };

    return (
        <div className="party-leader-selection">
            <h2>Select Your Party Leader</h2>
            <div className="leader-grid">
                {partyLeaders.map((leader) => (
                    <div 
                        key={leader.id}
                        className={`leader-card ${selectedLeader?.id === leader.id ? 'selected' : ''}`}
                        onClick={() => handleLeaderSelect(leader)}
                    >
                        <img src={leader.image} alt={leader.name} />
                        <p>{leader.name}</p>
                    </div>
                ))}
            </div>
            <button 
                className="confirm-button"
                disabled={!selectedLeader}
                onClick={confirmSelection}
            >
                Confirm Selection
            </button>
        </div>
    );
};

export default PartyLeaderSelection;