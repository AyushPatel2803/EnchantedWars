import React from "react";

const CardSlot = ({ card }) => {
    return (
        <div style={styles.cardSlot}>
            {card ? (
                <img
                    src={card.image}
                    alt={`Card ${card.id}`}
                    style={styles.cardImage}
                />
            ) : (
                <div style={styles.emptySlot}>Empty Slot</div>
            )}
        </div>
    );
};

const styles = {
    cardSlot: {
        width: "150px",
        height: "200px",
        border: "2px dashed #ccc",
        borderRadius: "10px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f0f0f0",
    },
    cardImage: {
        width: "100%",
        height: "100%",
        borderRadius: "10px",
    },
    emptySlot: {
        color: "#888",
        fontSize: "14px",
    },
};

export default CardSlot;