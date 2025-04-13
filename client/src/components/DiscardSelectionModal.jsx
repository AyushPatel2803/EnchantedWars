const DiscardSelectionModal = ({ cards, cardImages, onSelect, onClose }) => {
  // Safeguard against undefined/null cards array
  if (!cards || cards.length === 0) {
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}>
        <div style={{
          backgroundColor: '#1E7149',
          padding: '20px',
          borderRadius: '10px',
          maxWidth: '80%',
          maxHeight: '80%',
          overflow: 'auto',
          border: '3px solid #4CAF50',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
        }}>
          <h3 style={{
            color: 'white',
            textAlign: 'center',
            marginBottom: '20px',
            textShadow: '1px 1px 3px rgba(0, 0, 0, 0.8)',
          }}>No cards available in discard pile</h3>
          <button 
            style={{
              display: 'block',
              margin: '0 auto',
              padding: '8px 20px',
              backgroundColor: '#FF5722',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '1rem',
            }}
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
    }}>
      <div style={{
        backgroundColor: '#1E7149',
        padding: '20px',
        borderRadius: '10px',
        maxWidth: '80%',
        maxHeight: '80%',
        overflow: 'auto',
        border: '3px solid #4CAF50',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
      }}>
        <h3 style={{
          color: 'white',
          textAlign: 'center',
          marginBottom: '20px',
          textShadow: '1px 1px 3px rgba(0, 0, 0, 0.8)',
        }}>Select a Card to Add to Your Hand</h3>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '15px',
          marginBottom: '20px',
        }}>
          {cards.map((card, index) => (
            <div 
              key={index} 
              style={{
                cursor: 'pointer',
                transition: 'transform 0.2s',
                ':hover': {
                  transform: 'scale(1.05)',
                }
              }}
              onClick={() => onSelect(index)}
            >
              <img 
                src={cardImages[card.name] || card.image || ''}
                alt={card.name || 'Card'} 
                style={{
                  width: '120px',
                  height: '160px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  border: '2px solid #4CAF50',
                }}
                onError={(e) => {
                  e.target.src = ''; // Handle image loading errors
                }}
              />
              <p style={{
                color: 'white',
                textAlign: 'center',
                marginTop: '5px',
                fontSize: '0.9rem',
              }}>{card.name || 'Unknown Card'}</p>
            </div>
          ))}
        </div>
        <button 
          style={{
            display: 'block',
            margin: '0 auto',
            padding: '8px 20px',
            backgroundColor: '#FF5722',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '1rem',
          }}
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default DiscardSelectionModal;