import React, { useState } from 'react';
import TitlePNG from './assets/Enchanted Wars.png';
import './MainPage.css';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000'); // Adjust as needed

function MainPage() {
  const [isSearching, setIsSearching] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const navigate = useNavigate();

  const handleFindMatch = () => {
    setIsSearching(true);
    socket.emit('join_game', playerName);
    setTimeout(() => {
      setIsSearching(false);
      navigate('/game', { state: { playerName } });
    }, 2000);
  };

  const handleLocalMatch = () => {
    navigate('/local-game');
  };

  return (
    <div className="background-wrapper">
      {/* Existing glowing orbs using pseudo-elements are already set via CSS (::before and ::after) */}

      {/* Add two new glowing orbs */}
      <div className="glowing-orb orb-3"></div>
      <div className="glowing-orb orb-4"></div>
      <div className="glowing-orb orb-5"></div>
      <div className="glowing-orb orb-6"></div>
      <div className="main-container">
        {/* Title, input, and buttons go here */}
        <img src={TitlePNG} alt="Enchanted Wars" className="title-image" />
        <div className="actions">
          <div className="center-content">
            <input
              type="text"
              placeholder="Enter Your Name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="name-input"
            />
            <div className="button-row">
              <button
                className="modern-button"
                onClick={handleFindMatch}
                disabled={isSearching || !playerName}
              >
                {isSearching ? 'Searching...' : 'Find Match'}
              </button>
              <button className="modern-button" onClick={handleLocalMatch}>
                Local Match
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainPage;
