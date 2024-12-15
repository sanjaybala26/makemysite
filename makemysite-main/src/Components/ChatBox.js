import React, { useState, useEffect } from 'react';
import { generateCode } from '../Services/GeminiAI';

function ChatBox({ setCode }) {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [language, setLanguage] = useState('en-US'); // Default to English
  let recognition;

  if (window.SpeechRecognition || window.webkitSpeechRecognition) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SpeechRecognition();
  }

  useEffect(() => {
    if (recognition) {
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = language; // Set language based on user selection

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.trim();
        setInput(transcript);
        handleChat(transcript); // Automatically generate code when speech input finishes
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
      };
    }
  }, [recognition, language]); // Re-run the effect when the language changes

  const handleChat = async (inputText) => {
    const generatedCode = await generateCode(inputText || input, history);
    setCode(generatedCode);
    setHistory(prevHistory => `${prevHistory}\nUser: ${inputText || input}\nAI: ${generatedCode}`);
    setInput(''); // Clear the input after sending
  };

  const handleVoiceInput = () => {
    if (recognition) {
      setIsListening(true);
      recognition.start();
    } else {
      alert('Speech Recognition is not supported in this browser.');
    }
  };

  const handleStopListening = () => {
    if (recognition) {
      setIsListening(false);
      recognition.stop();
    }
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  return (
    <div className="chatbox">
      <div>
        <label>Select Language: </label>
        <select onChange={handleLanguageChange} value={language}>
          <option value="en-US">English</option>
          <option value="ta-IN">Tamil</option>
          <option value="hi-IN">Hindi</option>
          <option value="ml-IN">Malayalam</option>
          <option value="te-IN">Telugu</option>
        </select>
      </div>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask the AI to generate code..."
        rows={4}
        style={{ width: '100%' }}
      />
      <button onClick={() => handleChat()}>Generate Code</button>
      <button onClick={isListening ? handleStopListening : handleVoiceInput}>
        {isListening ? 'Stop Listening' : 'Speak'}
      </button>
    </div>
  );
}

export default ChatBox;
