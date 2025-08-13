import React, { useState, useRef } from "react";

const QAComponent = () => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [history, setHistory] = useState([]);
  const recognitionRef = useRef(null);

  // Voice search
  const startVoiceRecognition = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Voice recognition not supported in this browser");
      return;
    }
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
      setQuestion(spokenText);
      fetchAnswer(spokenText);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  // Fetch AI answer from backend
  const fetchAnswer = async (userQuestion) => {
    if (!userQuestion.trim()) return;

    setAnswer("Thinking...");
    try {
      const res = await fetch("http://localhost:5000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userQuestion }),
      });
      const data = await res.json();
      setAnswer(data.answer);
      setHistory([{ q: userQuestion, a: data.answer }, ...history]);
    } catch (error) {
      setAnswer("Error getting response");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchAnswer(question);
  };

  return (
    <div className="qa-container">
      <h1>Ask AI</h1>

      <form onSubmit={handleSubmit} className="qa-form">
        <input
          type="text"
          placeholder="Type your question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <button type="submit">Ask</button>
        <button type="button" onClick={startVoiceRecognition}>
          🎤
        </button>
      </form>

      <div className="qa-response">
        {answer && (
          <div className="response-box">
            <strong>Answer:</strong> {answer}
          </div>
        )}
      </div>

      <div className="qa-history">
        <h2>Previous Q&A</h2>
        {history.map((item, index) => (
          <div key={index} className="qa-item">
            <p>
              <strong>Q:</strong> {item.q}
            </p>
            <p>
              <strong>A:</strong> {item.a}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QAComponent;
