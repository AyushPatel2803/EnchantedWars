import React, { useEffect, useState } from 'react';

const Timer = ({ currentPlayer, onTimeOut }) => {
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    // Reset timer when player changes
    setTimeLeft(60);
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeOut(); // Trigger the timeout callback
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentPlayer, onTimeOut]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div style={styles.timer}>
      {formatTime(timeLeft)}
    </div>
  );
};

const styles = {
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
  }
};

export default Timer;