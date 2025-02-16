import React, { useState } from "react";
import "./DrawCard.css";

const DrawCard = ({ onClick }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isClicked, setIsClicked] = useState(false);

    const handleClick = () => {
        setIsClicked(true);
        onClick();
        setTimeout(() => setIsClicked(false), 300);
    };


    return (
        <div
        className={`card ${isHovered ? "hovered" : ""} ${isClicked ? "clicked" : ""}`}
        onClick={handleClick}
        onMouseEnter = {() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        >
            <div className="card-content">
                <h4>Draw card</h4>
            </div>
        </div>
    );
};

export default DrawCard;

