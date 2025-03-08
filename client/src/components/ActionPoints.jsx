import React from "react";

const ActionPoints = ({ points }) => {
    return (
        <div style={StyleSheet.container}>
            <h3>Action Points: {points}</h3>
        </div>
    );
}

const StyleSheet = {
    container: {
        position: "absolute",
        left: "20px",
        bottom: "10%",
        background: "red",
        color: "white",
        padding: "10px 20px",
        borderRadius: "10px",
        fontSize: "18px",
    }
}

export default ActionPoints;
