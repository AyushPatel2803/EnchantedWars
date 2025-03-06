import React, { useState } from 'react';
import './MainPage.css';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000'); // Adjust based on your backend port

function MainPage() {
    const [isSearching, setIsSearching] = useState(false); // Searching for match state
    const [playerName, setPlayerName] = useState(''); // Player name state
    const navigate = useNavigate();

    // Handle Find Match Click
    const handleFindMatch = () => {
        setIsSearching(true);
        // Emit join_game event to the server
        socket.emit('join_game', playerName);
        // Simulate finding a match
        setTimeout(() => {
            setIsSearching(false);
            navigate('/game', { state: { playerName } }); // Pass player name to game screen
        }, 2000); // Simulate a delay for finding a match
    };

    return (
        <div className="main-page">
            <h1>Welcome to the Game</h1>
            <div className="actions">
                <input
                    type="text"
                    placeholder="Enter your name"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                />
                <button onClick={handleFindMatch} disabled={isSearching || !playerName}>
                    {isSearching ? 'Searching...' : 'Find Match'}
                </button>
            </div>
        </div>
    );
}

export default MainPage;
