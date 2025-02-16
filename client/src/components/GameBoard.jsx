import React from "react";
import Timer from "./Timer";
import ActionPoints from "./ActionPoints";
import DrawCard from "./DrawCard";
import "./GameBoard.css";

const GameBoard = () => {


    return (
            <div style = {StyleSheet.gameBoard}>
                <Timer />
                <ActionPoints />
                <DrawCard />
                <h1>GameBoard</h1>
                <p>This is where the game will be displayed.</p>
            </div>
    );
};


const StyleSheet = {
    gameBoard: {
        position: "relative",
        textAlign: "center",
        padding: "20px",
        border: "4px solid black ",
        background: "#162C24",
        height: "800px",
    },
};

export default GameBoard;