import React from 'react';
import PropTypes from 'prop-types';


const OpponentCardSlot = ({ card }) => {
    return (
        <div className="opponent-card-slot">
            {card ? (
                <div className="opponent-card">
                    <img src={card.image} alt={`Card ${card.id}`} className="opponent-card-image" />
                </div>
            ) : (
                <div className="opponent-empty-slot">Opponent Slot</div>
            )}
        </div>
    );
};

OpponentCardSlot.propTypes = {
    card: PropTypes.object,
};

export default OpponentCardSlot;