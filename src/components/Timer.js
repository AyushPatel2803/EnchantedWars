import React, { useState, useEffect } from "react";

const Timer = () => {
  const [time, setTime] = useState(0); // Timer starts at 0 seconds

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prevTime) => prevTime + 1); // Increase time by 1 second
    }, 1000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div style={StyleSheet.timer}>
        <h2>Time: {time}s</h2>
    </div>
  );
}

const StyleSheet = {
    timer: {
        position: "absolute",
        left: "20px", 
        top: "15%",
        transform: "translateY(-50%)",
        background: "#BBB27D",
        color: "black",
        padding: "10px 20px",
        borderRadius: "10px",
        fontSize: "18px"
    },
};

export default Timer;