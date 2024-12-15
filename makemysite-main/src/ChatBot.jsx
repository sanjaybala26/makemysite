import React, { useState } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import './ChatBot.css';

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const genAI = new GoogleGenerativeAI(process.env.REACT_APP_API_KEY);
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

  const getUserIntent = (message) => {
    const lowerCaseMessage = message.toLowerCase();
    if (lowerCaseMessage.includes("brief") || lowerCaseMessage.includes("short") || lowerCaseMessage.includes("summary")) {
      return 'brief';
    } else if (lowerCaseMessage.includes("detailed") || lowerCaseMessage.includes("explain") || lowerCaseMessage.includes("expand")) {
      return 'detailed';
    } else {
      return 'general';
    }
  };

  const handleSendMessage = async () => {
    if (input.trim() === '') return;

    const userMessage = { sender: 'user', text: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    try {
      const userIntent = getUserIntent(input);
      const introductionProvided = messages.some(msg => msg.text.includes("I can help you with math questions"));

      const persona = `Your name is Max. You are a bot for a learning platform software application. You only help students with mathematics-related questions. If the user asks about anything other than mathematics, politely inform them that you only assist with math. Respond based on user intent: provide brief explanations if requested, detailed explanations for more comprehensive queries, and general assistance otherwise.`;

      const conversationHistory = [
        persona,
        ...updatedMessages.map((msg) => `${msg.sender === 'user' ? 'User' : 'Max'}: ${msg.text}`)
      ].join('\n');

      const result = await model.generateContent(conversationHistory);
      const response = await result.response;

      let finalBotMessageText = await response.text();

      if (userIntent === 'brief') {
        finalBotMessageText = "Here's a brief explanation: A matrix is a grid of numbers arranged in rows and columns. Let me know if you need more details! 😊";
      } else if (userIntent === 'detailed') {
        finalBotMessageText = "A matrix is a rectangular array of numbers, symbols, or expressions arranged in rows and columns. It is a fundamental concept in linear algebra and is used to solve systems of linear equations, represent data, and more. If you have specific questions about matrices, feel free to ask! 😊";
      } else if (introductionProvided && finalBotMessageText.includes("I can help you with math questions")) {
        finalBotMessageText = "I'm here to help with your math questions. Feel free to ask more! 😊";
      }

      const botMessage = { sender: 'bot', text: finalBotMessageText };
      setMessages([...updatedMessages, botMessage]);
    } catch (error) {
      console.error('Error generating content:', error.message);
    }

    setInput('');
  };

  return (
    <div>
      <div className="chatbox">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
      />
      <button onClick={handleSendMessage}>Send</button>
    </div>
  );
};

export default Chatbot;
