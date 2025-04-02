import React, { useEffect, useState } from "react";

const Timer = ({ timeLeft }) => {
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (timeLeft === 10) {
            setIsAnimating(true); // Trigger animation
            setTimeout(() => setIsAnimating(false), 1000); // Reset animation after 1 second
        }
    }, [timeLeft]);

    return (
        <div
            style={{
                ...styles.timerContainer,
                backgroundColor: timeLeft <= 10 ? "#FF0000" : "#4CAF50", // Change to red when <= 10 seconds
                animation: isAnimating ? "shake 0.5s ease" : "none", // Apply animation
            }}
        >
            <h2 style={styles.timerText}>{timeLeft}s</h2>
        </div>
    );
};

const styles = {
    timerContainer: {
        position: "absolute",
        top: "100px",
        left: "10px",
        width: "80px",
        height: "80px",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        color: "white",
        fontSize: "18px",
        fontWeight: "bold",
        border: "3px solid #1B5E20",
        transition: "background-color 0.3s ease",
    },
    timerText: {
        margin: 0,
        fontSize: "20px",
        fontWeight: "bold",
        fontFamily: "'Roboto', sans-serif",
    },
};

export default Timer;