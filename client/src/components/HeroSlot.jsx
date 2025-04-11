import React from "react";
import PropTypes from "prop-types";

const HeroSlot = ({ hero, items, isActive, onRoll }) => {
    const handleRoll = () => {
        if (onRoll) {
            onRoll(hero);
        }
    };

    return (
        <div className={`hero-slot ${isActive ? "active" : ""}`} onClick={handleRoll}>
            {hero ? (
                <>
                    <div className="hero-info">
                        <h3>{hero.name}</h3>
                        <p>Class: {hero.class}</p>
                        <p>Level: {hero.level}</p>
                        <p>Health: {hero.health}</p>
                    </div>
                    <div className="hero-items">
                        {items && items.map((item, index) => (
                            <div key={index} className="hero-item" title={item.name}>
                                <img src={item.image} alt={item.name} />
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div className="empty-slot">No Hero</div>
            )}
        </div>
    );
};

HeroSlot.propTypes = {
    hero: PropTypes.shape({
        name: PropTypes.string.isRequired,
        class: PropTypes.string.isRequired,
        level: PropTypes.number.isRequired,
        health: PropTypes.number.isRequired,
    }),
    items: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
            image: PropTypes.string.isRequired,
        })
    ),
    isActive: PropTypes.bool,
    onRoll: PropTypes.func,
};

HeroSlot.defaultProps = {
    items: [],
    isActive: false,
    onRoll: null,
};

export default HeroSlot;

// Styles
const styles = `
.hero-slot {
    border: 2px solid #ccc;
    border-radius: 10px;
    padding: 10px;
    text-align: center;
    cursor: pointer;
    transition: border-color 0.3s;
}

.hero-slot.active {
    border-color: #4CAF50;
}

.hero-info {
    margin-bottom: 10px;
}

.hero-items {
    display: flex;
    justify-content: center;
    gap: 5px;
}

.hero-item img {
    width: 30px;
    height: 30px;
}

.empty-slot {
    color: #888;
    font-size: 14px;
}
`;

// Inject styles into the document head
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);