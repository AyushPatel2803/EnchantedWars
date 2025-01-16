import React, { useState } from 'react';
import './MainPage.css';
import ProfileIcon from './assets/profile.png';
import SettingsIcon from './assets/setting.png';

function MainPage() {
    const [showRules, setShowRules] = useState(false);
    const [isSearching, setIsSearching] = useState(false);

    const handleFindMatch = () => {
        setIsSearching(true);
        console.log('Searching for match...');
        setTimeout(() => {
            setIsSearching(false);
            console.log('Match found!');
        }, 3000); 
    };

    return (
        <div className="main-container">
            <button className="logo-button" onClick={() => console.log('Profile clicked')}>
                <img src={ProfileIcon} alt="Profile" style={{ width: '100%', height: '100%' }} />
            </button>
            <div className="header">
                <div className="icon" style={{ backgroundImage: 'url(/icons/user.svg)' }}></div>
                <h1 style={{ fontFamily: 'Climate Crisis', fontSize: '48px' }}>Enchanted Wars</h1>
                <div className="icon" style={{ backgroundImage: 'url(/icons/settings.svg)' }}></div>
            </div>
            <div className="button-container">
                <div className="button-row">
                    <button onClick={handleFindMatch} disabled={isSearching}>
                        {isSearching ? <div className="spinner"></div> : 'Find Match'}
                    </button>
                    <button onClick={() => setShowRules(true)}>How To Play</button>
                </div>
            </div>
            <button className="settings-button" onClick={() => console.log('Settings clicked')}>
                <img src={SettingsIcon} alt="Settings" style={{ width: '100%', height: '100%' }} />
            </button>
            <RulesModal show={showRules} onClose={() => setShowRules(false)} />
        </div>
    );
}

function RulesModal({ onClose, show }) {
    const modalStyle = {
        display: show ? 'block' : 'none',
        position: 'fixed',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        padding: '20px',
        zIndex: 1000,
        overflowY: 'auto',
        maxHeight: '80vh',
        width: '80%',
        border: '2px solid black'
    };

    return (
        
        <div style={modalStyle}>
            <h2>Ruleset:</h2>
            <p>Here are the basic rules. Make sure this text shows up first.</p>
            <p><strong>Objective:</strong> The first player to assemble a full Party of 6 different classes (including their Party Leader) wins.</p>
            <p><strong>Setup:</strong></p>
            <ol>
                <li>Each player selects a Party Leader card and places it in their play area (their Party).</li>
                <li>Shuffle the deck and deal 5 cards to each player.</li>
                <li>Place the remaining stack as the main deck and designate a discard pile.</li>
            </ol>
            <p><strong>Turn Structure:</strong> Each turn, players have 3 action points to spend. Actions can be performed in any order and repeated as long as enough points remain. Unused action points do not carry over.</p>
            <ul>
                <li><strong>1-Action Point Options:</strong></li>
                <ul>
                    <li>Draw: Draw 1 card from the main deck.</li>
                    <li>Play a card: Play a Hero, Item, or Magic card from your hand.</li>
                    <li>Roll for Hero Effect: Roll to activate a Hero card's ability in your Party (only once per Hero per turn).</li>
                </ul>
                <li><strong>2-Action Point Options:</strong></li>
                <ul>
                    <li>Discard and Refresh: Discard your entire hand and draw 5 new cards.</li>
                </ul>
            </ul>
            <p><strong>Web-Based Features:</strong></p>
            <ul>
                <li>Turn Timers</li>
                <li>Challenge and Modifier Timers</li>
                <li>Notifications and Alerts</li>
            </ul>
            <p><strong>Combat Mechanic:</strong> Challenges and Modifier Cards.</p>
            <p><strong>Winning the Game:</strong> The game ends when a player assembles a full Party of 6 different classes. Stats like total turns, cards played, and modifiers used are displayed.</p>
            <button onClick={onClose} style={{ backgroundColor: '#FFD700', border: 'none', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer' }}>Close</button>
        </div>
    );
}


export default MainPage;
