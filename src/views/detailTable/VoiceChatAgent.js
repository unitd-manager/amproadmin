// File: VoiceChatAgent.jsx
/*eslint-disable*/
// File: VoiceChatAgent.jsx
import React, { useEffect, useState, useRef } from 'react';
import './VoiceChatAgent.css';

const VoiceChatAgent = () => {
  const [messages, setMessages] = useState([]);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Your browser does not support Speech Recognition. Try Chrome.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = async (event) => {
      const transcript = event.results[0][0].transcript;
      addMessage('You', transcript);
      getAIResponse(transcript);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;
  }, []);

  const addMessage = (sender, text) => {
    setMessages((prev) => [...prev, { sender, text }]);
  };

  const speakText = (text) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.pitch = 1;
    utterance.rate = 1;
    synth.speak(utterance);
  };

const getAIResponse = async (userInput) => {
  addMessage('Qubi', '...'); // Show temporary reply

  try {
    const res = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyDur5pfU0qx7akCMSL9dWxG8O9PHEl7xH0',
      {
        contents: [
          {
            parts: [{ text: userInput }]
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const aiText = res.data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Gemini.';
    setMessages((prev) => [...prev.slice(0, -1), { sender: 'Qubi', text: aiText }]);
    speakText(aiText);
  } catch (err) {
    console.error('Gemini API error:', err.response?.data || err.message);
    setMessages((prev) => [...prev.slice(0, -1), { sender: 'Qubi', text: 'Sorry, Gemini failed to respond.' }]);
  }
};



  const getMockAIResponse = async (input) => {
    if (input.toLowerCase().includes('quote')) return "Sure! Please provide the destination address.";
    if (input.toLowerCase().includes('phoenix')) return "Got it. Phoenix, AZ with ZIP 85001.";
    return "I'm processing that. Could you clarify your request?";
  };

  const handleStart = () => {
    if (recognitionRef.current) {
      setListening(true);
      recognitionRef.current.start();
    }
  };

  return (
    <div className="voice-agent-container">
      <div className="voice-header">
        <h2>Polaris Logistics AI Agent</h2>
        <button onClick={handleStart} disabled={listening}>
          🎤 {listening ? 'Listening...' : 'Start Speaking'}
        </button>
      </div>

      <div className="chat-box">
        {messages.map((msg, i) => (
          <div key={i} className={`message ${msg.sender === 'You' ? 'user' : 'agent'}`}>
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VoiceChatAgent;