import React from "react";

const ActionPoints = ({ points }) => {
    return (
        <div style={StyleSheet.container}>
            <h3 style={StyleSheet.actionText}>Action Points: {points} 3 </h3>
        </div>
    );
}

const StyleSheet = {
    container: {
        position: "absolute",
        bottom: "10%",
        left: "10px",
        width: "400px",
        height: "80px",
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
    actionText: {
        margin: 0,
        fontSize: "42px",
        fontWeight: "bold",
        fontFamily: "GreenFuz, sans-serif",
    },
}

export default ActionPoints;