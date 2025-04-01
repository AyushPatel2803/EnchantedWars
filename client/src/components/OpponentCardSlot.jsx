import React from 'react';
import PropTypes from 'prop-types';

const OpponentCardSlot = ({ card }) => {
    return (
        <div style={styles.slot}>
            {card ? (
                <div style={styles.card}>
                    <img src={card.image} alt={`Card ${card.id}`} style={styles.cardImage} />
                </div>
            ) : (
                <div style={styles.emptySlot}>Opponent Slot</div>
            )}
        </div>
    );
};

const styles = {
    slot: {
        width: "calc(120px + 1vw)", // Slot width
        height: "calc(160px + 1vh)", // Slot height
        border: "1px dashed #ccc", // Dashed border
        borderRadius: "8px", // Rounded corners
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#1E7149", // Background color
        maxWidth: "150px", // Max width
        maxHeight: "200px", // Max height
    },
    card: {
        width: "calc(120px + 1vw)",
        height: "calc(160px + 1vh)",
        border: "1px solid #888",
        borderRadius: "8px",
        overflow: "hidden",
        cursor: "grab",
        flexShrink: 0,
        maxWidth: "150px",
        maxHeight: "200px",
    },
    cardImage: {
        width: "100%",
        height: "100%",
        objectFit: "cover",
    },
    emptySlot: {
        color: "#888",
        fontSize: "0.75rem", // Font size for empty slot text
    },
};

OpponentCardSlot.propTypes = {
    card: PropTypes.object,
};

export default OpponentCardSlot;