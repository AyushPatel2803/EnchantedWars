import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './MainPage'; 
import GameBoard from './components/GameBoard';
import LocalGame from './components/LocalGame';

function App() {
  return (

    <Router>
      <Routes>
        <Route path = "/" element = {<MainPage />} />
        <Route path = "/game" element = {<GameBoard />} />
        <Route path="/local-game" element={<LocalGame />} />
      </Routes>
    </Router>
  );
}

export default App;
