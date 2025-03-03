import React, { useState } from "react";
import axios from "axios";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  const sendMessage = async (message) => {
    if (!message) return;

    const newMessages = [...messages, { role: "user", content: message }];
    setMessages(newMessages);
    setInput("");

    try {
      const response = await axios.post("http://localhost:5000/chat", { message });

      const botMessage = response.data.reply;
      setMessages([...newMessages, { role: "assistant", content: botMessage }]);

      // Text-to-Speech: Make assistant speak the response
      const utterance = new SpeechSynthesisUtterance(botMessage);
      speechSynthesis.speak(utterance);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div style={{ fontFamily: "Arial", textAlign: "center", marginTop: "50px" }}>
      <h2>AI SpeechRecognition</h2>
      <div style={{ height: "300px", overflowY: "auto", border: "1px solid black", padding: "10px", margin: "10px auto", width: "50%" }}>
        {messages.map((msg, index) => (
          <p key={index} style={{ color: msg.role === "user" ? "blue" : "green" }}>
            <strong>{msg.role}:</strong> {msg.content}
          </p>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message"
        style={{ width: "300px", padding: "10px", marginRight: "5px" }}
      />
      <button onClick={() => sendMessage(input)} style={{ padding: "10px" }}>Send</button>
      <br />
      <button onClick={SpeechRecognition.startListening} style={{ marginTop: "10px", padding: "10px" }}>🎙️ Start Talking</button>
      <button onClick={() => sendMessage(transcript)} style={{ marginLeft: "5px", padding: "10px" }}>✅ Send Voice Input</button>
      <p>{listening ? "🎧 Listening..." : "🎙️ Click 'Start Talking' to use your voice"}</p>
    </div>
  );
}

export default App;
