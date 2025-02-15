// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './MainPage';
import GameBoard from './Gameboard';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" exact component={MainPage} />
                <Route path="/gameboard" component={GameBoard} />
            </Routes>
        </Router>
    );
}

export default App;
