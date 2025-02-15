import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Gameboard from './Gameboard';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Gameboard />} />  {/* Now '/' correctly renders Gameboard */}
            </Routes>
        </Router>
    );
}

export default App;
