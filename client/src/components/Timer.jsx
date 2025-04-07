import React, { useState, useEffect } from "react";

const Timer = ({ onTimeout }) => {
  // Start at 1 second
  const [time, setTime] = useState(1);

  useEffect(() => {
    // When time reaches 60, trigger onTimeout and reset timer to 1
    if (time >= 60) {
      if (onTimeout) {
        onTimeout();
      }
      setTime(1);
      return;
    }
    // Otherwise, set a timeout to increment time by 1 every second
    const timeoutId = setTimeout(() => {
      setTime(time + 1);
    }, 1000);
    return () => clearTimeout(timeoutId);
  }, [time, onTimeout]);

  return (
    <div style={StyleSheet.timer}>
      <h2>Time: {time}s</h2>
    </div>
  );
};

const StyleSheet = {
  timer: {
    position: "absolute",
    left: "20px",
    top: "15%",
    transform: "translateY(-50%)",
    width: "160px",
    height: "60px",

    /* Subtle arcane swirl in greenish-teal tones */
    background: "radial-gradient(circle at center, rgba(88,173,136,0.3), rgba(22,44,36,0))",

    /* A teal border to match the swirl */
    border: "2px solid #58ad88",
    borderRadius: "12px",

    /* Soft parchment-like text color */
    color: "#daf7e2",
    fontSize: "25px",

    /* Use a more fantasy-like font (make sure it's loaded) */
    fontFamily: "GreenFuz, sans-serif",

    /* Center the text and apply a mild glow */
    textAlign: "center",
    textShadow: "0 0 4px #58ad88",
    boxShadow: "0 0 10px rgba(88,173,136,0.4)",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    /* Gentle arcane glow animation */
    animation: "arcaneGlow 3s ease-in-out infinite alternate",
    zIndex: 9999, // Ensure it stays on top
  },
};


export default Timer;