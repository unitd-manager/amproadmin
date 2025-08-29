/* eslint-disable */
import React, { useEffect, useState, useRef } from 'react';
import './PolarisAgent.css';

const PolarisAgent = () => {
  const [messages, setMessages] = useState([]);
  const [listening, setListening] = useState(false);
  const [inCall, setInCall] = useState(false);
  const [waveHeight, setWaveHeight] = useState([5, 10, 7, 10, 6]);
  const [currentSpeaker, setCurrentSpeaker] = useState(null); // "user" | "ai" | null

  const recognitionRef = useRef(null);
  const synthRef = useRef(window.speechSynthesis);

  // Simulate waveform animation
  useEffect(() => {
    const interval = setInterval(() => {
      if (inCall && currentSpeaker) {
        const newHeights = Array(5).fill(0).map(() => Math.floor(Math.random() * 20 + 5));
        setWaveHeight(newHeights);
      }
    }, 300);
    return () => clearInterval(interval);
  }, [inCall, currentSpeaker]);

  useEffect(() => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    alert("Your browser doesn't support speech recognition.");
    return;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.interimResults = false;
  recognition.continuous = true;

  recognition.onstart = () => setListening(true);

  recognition.onend = () => {
    setListening(false);
    // Only restart if in call
    if (inCall) {
      console.log("Restarting recognition...");
      setTimeout(() => recognition.start(), 300); // small delay avoids "already started" errors
    }
  };

  recognition.onerror = (err) => {
    console.error("Speech recognition error:", err);
    setListening(false);
    if (inCall) {
      setTimeout(() => recognition.start(), 500); // retry after error
    }
  };

  recognition.onresult = async (event) => {
    const transcript = event.results[event.results.length - 1][0].transcript;
    setCurrentSpeaker("user");
    addMessage('You', transcript);

    recognition.stop(); // temporarily stop listening while AI talks

    const aiReply = await fetchAIResponse(transcript);

    setCurrentSpeaker("ai");
    addMessage('Qubi', aiReply);
    speak(aiReply, () => {
      if (inCall) {
        recognition.start(); // restart listening after AI finishes speaking
      }
    });
  };

  recognitionRef.current = recognition;
}, [inCall]);

  const startCall = () => {
    setInCall(true);
    setMessages([]);
    if (recognitionRef.current) recognitionRef.current.start();
  };

  const endCall = () => {
    setInCall(false);
    setCurrentSpeaker(null);
    if (recognitionRef.current) recognitionRef.current.stop();
    synthRef.current.cancel();
  };

  const addMessage = (sender, text) => {
    setMessages(prev => [...prev, { id: prev.length + 1, sender, text }]);
  };

  const fetchAIResponse = async (msg) => {
    try {
      const res = await fetch("http://localhost:4000/command", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ command: msg, sessionId: "call-session-123" }),
      });
      console.log('resp',res);
    
      const data = await res.json();
      console.log('data',data);
      return data.summary || "Sorry, I couldn't understand.";
    } catch (err) {
      console.error("Error fetching AI response:", err);
      return "Something went wrong.";
    }
  };

  const speak = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.onend = () => setCurrentSpeaker(null);
    synthRef.current.speak(utterance);
  };

  return (
  <div className="agent-container">
    {/* Split Screen Layout */}
    <div className="main-layout">
      
      {/* Left - Call Status */}
      <div className="call-panel">
        <h2>AI Agent</h2>
        <div className="status">
          {/* User */}
          <div className="status-avatar">
            <div className="avatar">
              🧑
              {currentSpeaker === "user" && (
                <div className="wave-wrapper">
                  {waveHeight.map((h, i) => (
                    <div key={i} className="wave-line" style={{ height: `${h}px` }} />
                  ))}
                </div>
              )}
            </div>
            <div className="name">You</div>
          </div>

          {/* Call Info */}
          <div className="status-info">
            <div className="label">{inCall ? "In Call" : "Idle"}</div>
            <div className="connected">{listening ? 'Listening' : 'Not Listening'}</div>
          </div>

          {/* AI */}
          <div className="status-avatar">
            <div className="avatar">
              🤖
              {currentSpeaker === "ai" && (
                <div className="wave-wrapper">
                  {waveHeight.map((h, i) => (
                    <div key={i} className="wave-line" style={{ height: `${h}px` }} />
                  ))}
                </div>
              )}
            </div>
            <div className="name">Qubi</div>
          </div>
        </div>

        {!inCall ? (
          <button onClick={startCall} className="listen-button">📞 Start Call</button>
        ) : (
          <button onClick={endCall} className="listen-button end-call">🔴 End Call</button>
        )}
      </div>

      {/* Right - Chat Box */}
      <div className="chat-panel">
        <h2>Conversation</h2>
        <div className="chat-box">
          {messages.map((msg) => (
            <div key={msg.id} className={`message ${msg.sender === 'You' ? 'user' : 'agent'}`}>
              <strong>{msg.sender}:</strong> {msg.text}
            </div>
          ))}
        </div>
      </div>

    </div>
  </div>
);

};

export default PolarisAgent;
