import React from "react";

const ActionPoints = ({ points }) => {
  return (
    <div style={styles.container}>
      <h3 style={styles.h3}>Action Points: {points}</h3>
    </div>
  );
};

const styles = {
    container: {
      position: "absolute",
      left: "20px",
      bottom: "5%",
      // Let width auto-fit the text
      width: "auto",
      padding: "10px 20px",
      // Subtle dark green gradient that blends with #162C24
      background: "linear-gradient(135deg, #2d4036, #162C24)",
      border: "2px solid #3a5b47", // earthy green border
      borderRadius: "8px",
      boxShadow: "0 0 10px rgba(0,0,0,0.5)",
      whiteSpace: "nowrap", // Keep text on one line
      zIndex: 9999,      
      fontFamily: "GreenFuz, sans-serif", // your custom font
      margin: 0,
      fontSize: "40px",
      color: "#e2f1e6", // light, pale green text
      textShadow: "1px 1px 2px rgba(0,0,0,0.7)" // subtle shadow for contrast
     },
  };

export default ActionPoints;