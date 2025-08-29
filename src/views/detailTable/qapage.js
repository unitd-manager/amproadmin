// import React, { useState, useRef } from "react";

// const QAComponent = () => {
//   const [question, setQuestion] = useState("");
//   const [answer, setAnswer] = useState("");
//   const [history, setHistory] = useState([]);
//   const recognitionRef = useRef(null);

//   // Voice search
//   const startVoiceRecognition = () => {
//     if (!("webkitSpeechRecognition" in window)) {
//       alert("Voice recognition not supported in this browser");
//       return;
//     }
//     const recognition = new window.webkitSpeechRecognition();
//     recognition.lang = "en-US";
//     recognition.interimResults = false;
//     recognition.maxAlternatives = 1;

//     recognition.onresult = (event) => {
//       const spokenText = event.results[0][0].transcript;
//       setQuestion(spokenText);
//       fetchAnswer(spokenText);
//     };

//     recognition.start();
//     recognitionRef.current = recognition;
//   };

//   // Fetch AI answer from backend
//   const fetchAnswer = async (userQuestion) => {
//     if (!userQuestion.trim()) return;

//     setAnswer("Thinking...");
//     try {
//       const res = await fetch("http://localhost:5000/ask", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ question: userQuestion }),
//       });
//       const data = await res.json();
//       setAnswer(data.answer);
//       setHistory([{ q: userQuestion, a: data.answer }, ...history]);
//     } catch (error) {
//       setAnswer("Error getting response");
//     }
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     fetchAnswer(question);
//   };

//   return (
//     <div className="qa-container">
//       <h1>Ask AI</h1>

//       <form onSubmit={handleSubmit} className="qa-form">
//         <input
//           type="text"
//           placeholder="Type your question..."
//           value={question}
//           onChange={(e) => setQuestion(e.target.value)}
//         />
//         <button type="submit">Ask</button>
//         <button type="button" onClick={startVoiceRecognition}>
//           🎤
//         </button>
//       </form>

//       <div className="qa-response">
//         {answer && (
//           <div className="response-box">
//             <strong>Answer:</strong> {answer}
//           </div>
//         )}
//       </div>

//       <div className="qa-history">
//         <h2>Previous Q&A</h2>
//         {history.map((item, index) => (
//           <div key={index} className="qa-item">
//             <p>
//               <strong>Q:</strong> {item.q}
//             </p>
//             <p>
//               <strong>A:</strong> {item.a}
//             </p>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default QAComponent;

/*eslint-disable*/
import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  CardBody,
  Input,
  Button,
  ListGroup,
  ListGroupItem,
} from "reactstrap";
import axios from "axios";

function QAComponent() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello! Provide a website URL and ask me about it 🤖" },
  ]);
  const [input, setInput] = useState("");
  // const [url, setUrl] = useState(""); // store website URL

  const handleSend = async () => {
    let url='https://unitdtechnologies.com/'
    if (!input.trim() || !url.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    try {
      const response = await axios.post("http://localhost:5000/api/ask", {
        url,       // ✅ send URL to backend
        question: input, // ✅ send question as "question"
      });
console.log('response',response);
      const botMessage = {
        sender: "bot",
        text: response.data.content || "⚠️ No answer from server",
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Error connecting to AI." },
      ]);
    }

    setInput("");
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col md={{ size: 6, offset: 3 }}>
          <Card style={{ height: "80vh", display: "flex", flexDirection: "column" }}>
            <CardBody style={{ flex: 1, overflowY: "auto" }}>
              {/* Chat Messages */}
              <ListGroup flush>
                {messages.map((msg, idx) => (
                  <ListGroupItem
                    key={idx}
                    className={
                      msg.sender === "user"
                        ? "text-end bg-light"
                        : "text-start bg-white"
                    }
                  >
                    <b>{msg.sender === "user" ? "You" : "AI"}:</b> {msg.text}
                  </ListGroupItem>
                ))}
              </ListGroup>
            </CardBody>

            {/* Website URL Input */}
            {/* <div className="p-2">
              <Input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="Enter website URL (e.g., https://example.com)"
                className="mb-2"
              />
            </div> */}

            {/* Question Input + Send Button */}
            <div className="p-3 d-flex">
              <Input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask a question about the website..."
                className="me-2"
              />
              <Button color="primary" onClick={handleSend}>
                Send
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default QAComponent;
