import React, { useState } from 'react';
import './MainPage.css';
import ProfileIcon from './assets/profile.png'; // Default profile picture
import SettingsIcon from './assets/setting.png'; // Settings icon

function MainPage() {
    // State for managing profile image, name, email, and modal visibility
    const [profileImage, setProfileImage] = useState(null); // To store the uploaded profile picture
    const [name, setName] = useState("Ayush Patel"); // To store user's name
    const [email, setEmail] = useState("ayush@example.com"); // To store user's email
    const [showProfile, setShowProfile] = useState(false); // Show/Hide Profile Modal
    const [showRules, setShowRules] = useState(false); // Show/Hide Rules Modal
    const [isSearching, setIsSearching] = useState(false); // Searching for match state

    // Handle Profile Image Change
    const handleImageChange = (event) => {
        const file = event.target.files[0]; // Get the first uploaded file
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result); // Set the uploaded profile picture
            };
            reader.readAsDataURL(file); // Read the file as data URL
        }
    };
    
    // Handle Find Match Button Click
    const handleFindMatch = () => {
        setIsSearching(true);
        console.log('Searching for match...');
        setTimeout(() => {
            setIsSearching(false);
            console.log('Match found!');
        }, 3000); // Simulate a search being performed
    };

    return (
        <div className="main-container">
            {/* Profile Button */}
            <button className="logo-button" onClick={() => setShowProfile(true)}>
                {/* Show the profile image if uploaded, otherwise show default */}
                <img src={profileImage || ProfileIcon} alt="Profile" style={{ width: '100%', height: '100%' }} />
            </button>

            {/* Profile Modal */}
            <ProfileModal 
                show={showProfile} 
                onClose={() => setShowProfile(false)} 
                profileImage={profileImage} 
                setProfileImage={setProfileImage}
                name={name}
                setName={setName}
                email={email}
                setEmail={setEmail}
                handleImageChange={handleImageChange}
            />

            <div className="header">
                <h1 style={{ fontFamily: 'Climate Crisis', fontSize: '48px' }}>Enchanted Wars</h1>
            </div>

            <div className="button-container">
                {/* Find Match Button */}
                <button onClick={handleFindMatch} disabled={isSearching}>
                    {isSearching ? <div className="spinner"></div> : 'Find Match'}
                </button>

                {/* How To Play Button */}
                <button onClick={() => setShowRules(true)}>How To Play</button>
            </div>

            {/* Settings Button */}
            <button className="settings-button" onClick={() => console.log('Settings clicked')}>
                <img src={SettingsIcon} alt="Settings" style={{ width: '100%', height: '100%' }} />
            </button>

            {/* Rules Modal */}
            <RulesModal show={showRules} onClose={() => setShowRules(false)} />
        </div>
    );
}

// Profile Modal Component
function ProfileModal({ onClose, show, profileImage, setProfileImage, name, setName, email, setEmail, handleImageChange }) {
    const modalStyle = {
        display: show ? 'block' : 'none', // Show the modal only if show is true
        position: 'fixed',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        padding: '20px',
        zIndex: 1000,
        overflowY: 'auto',
        maxHeight: '80vh',
        width: '80%',
        border: '2px solid black'
    };

    return (
        <div style={modalStyle}>
            <h2>Edit Profile</h2>
            
            {/* Profile Picture Upload */}
            <div>
                {profileImage ? (
                    <img src={profileImage} alt="Profile" style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
                ) : (
                    <p>No profile picture</p>
                )}
                <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange}
                    style={{ marginBottom: '10px' }} 
                />
            </div>

            {/* Editable Name */}
            <p><strong>Name:</strong> 
                <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    placeholder="Enter your name" 
                />
            </p>

            {/* Editable Email */}
            <p><strong>Email:</strong> 
                <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    placeholder="Enter your email" 
                />
            </p>

            <button onClick={onClose} style={{ backgroundColor: '#FFD700', border: 'none', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer' }}>Close</button>
        </div>
    );
}

// Rules Modal Component
function RulesModal({ onClose, show }) {
    const modalStyle = {
        display: show ? 'block' : 'none', 
        position: 'fixed',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        padding: '20px',
        zIndex: 1000,
        overflowY: 'auto',
        maxHeight: '80vh',
        width: '80%',
        border: '2px solid black'
    };

    return (
        <div style={modalStyle}>
            <h2>Ruleset:</h2>
            <p><strong>Objective:</strong> The first player to assemble a full Party of 6 different classes (including their Party Leader) wins.</p>
            <p><strong>Setup:</strong></p>
            <ol>
                <li>Each player selects a Party Leader card and places it in their play area (their Party).</li>
                <li>Shuffle the deck and deal 5 cards to each player.</li>
                <li>Place the remaining stack as the main deck and designate a discard pile.</li>
            </ol>
            <p><strong>Turn Structure:</strong> Each turn, players have 3 action points to spend. Actions can be performed in any order and repeated as long as enough points remain. Unused action points do not carry over.</p>
            <button onClick={onClose} style={{ backgroundColor: '#FFD700', border: 'none', padding: '10px 20px', borderRadius: '10px', cursor: 'pointer' }}>Close</button>
        </div>
    );
}

export default MainPage;
