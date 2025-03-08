import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './MainPage'; 
import GameBoard from './components/GameBoard';

function App() {
  return (
    // <div className="App">
    //   <MainPage />
    // </div>

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
