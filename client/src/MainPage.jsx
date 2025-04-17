import React, { useState, useEffect } from "react";
import "./MainPage.css";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import TitlePNG from "./assets/Enchanted Wars.png";

const socket = io("http://localhost:3000"); // Connect to backend

function MainPage() {
  const [isSearching, setIsSearching] = useState(false); // Searching for match state
  const [playerName, setPlayerName] = useState(""); // Player name state
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for match_found event from server
    socket.on("match_found", () => {
      setIsSearching(false); // Stop searching
      navigate("/game", { state: { playerName } }); // Pass only playerName
    });

    return () => socket.off("match_found"); // Cleanup listener
  }, [playerName, navigate]);

  // Handle Find Match Click
  const handleFindMatch = () => {
    if (!playerName.trim()) {
      alert("Enter your name before finding a match!");
      return;
    }

    setIsSearching(true);
    socket.emit("find_match", playerName); // Send matchmaking request
  };
  const handleLocalMatch = () => {
    navigate("/local-game")
  }

  return (
    <div className="background-wrapper">
    <div className="main-container">
    <img src={TitlePNG} alt="Enchanted Wars" className="title-image" />      <div className="actions">
        <input
          type="text"
          placeholder="Enter your name"
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
            {isSearching ? "Searching..." : "Find Match"}
          </button>
        
          <button
            className="modern-button"
            onClick={handleLocalMatch}
          >
            Local Match
        </button>
      </div>
    </div>
  </div>
</div>
  );
}

export default MainPage;
