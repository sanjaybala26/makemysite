// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import Main from './Main';
import ReactConverted from './ReactConverted';

function App() {
  const [apiKey, setApiKey] = useState('');

  const handleLogin = (key) => {
    setApiKey(key);
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={apiKey ? <Main /> : <Login onLogin={handleLogin} />}
          />
          <Route path="/react-converted" element={<ReactConverted />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;