import React, {useState} from "react";
import "./PartyLeaderSelection.css";    

import Chronomancer from "../assets/partyleader/Chronomancer.png";
import MistressOfDarkness from "../assets/partyleader/MistressOfDarkness.png";
import NatureGuardian from "../assets/partyleader/NatureGuardian.png";
import TheSerpent from "../assets/partyleader/SerpentCharmer.png";
import TheSoulKeeper from "../assets/partyleader/TheSoulKeeper.png";
import TheConsort from "../assets/partyleader/TheConsort.png";

const PartyLeaderSelection = ({ onLeaderSelect }) => {
    const [selectedLeader, setSelectedLeader] = useState(null);

    const partyLeaders = [
        { id: 1, name: 'Chronomancer', image: Chronomancer, affinity: 'Future' },
        { id: 2, name: 'Mistress Of Darkness', image: MistressOfDarkness, affinity: 'Dark' },
        { id: 3, name: 'Nature Guardian', image: NatureGuardian, affinity: 'Druid' },
        { id: 4, name: 'The Serpent', image: TheSerpent, affinity: 'Serpentine' },
        { id: 5, name: 'The SoulKeeper', image: TheSoulKeeper, affinity: 'Undead' },
        { id: 6, name: 'The Consort', image: TheConsort, affinity: 'Consort' },
        // Add other party leaders
    ];

    const handleLeaderSelect = (leader) => {
        setSelectedLeader(leader);
    };

    const confirmSelection = () => {
        if (selectedLeader) {
            onLeaderSelect(selectedLeader); // This will now work correctly
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