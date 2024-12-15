import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Import the CSS file

const Login = ({ onLogin }) => {
  const [apiKey, setApiKey] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate hook

  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem('API_KEY', apiKey);
    onLogin(apiKey); // Notify parent component of the login
    navigate('/'); // Navigate to the Main component
  };

  return (
    <div className="login-container">
      <h2>Login Page</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="apiKey">API_KEY:</label>
          <input
            type="text"
            id="apiKey"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            required
          />
        </div>
        <button type="submit">Submit</button>
      </form>
      
      <p className="reference-text">
        Need help? Check out the <a href="https://ai.google.dev/gemini-api" target="_blank" rel="noopener noreferrer">Gemini API documentation</a>.
      </p>
    </div>
  );
};

export default Login;
