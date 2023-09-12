import React, { useState } from "react";

const Sidebar = ({
  notes,
  onAddNote,
  onDeleteNote,
  activeNote,
  setActiveNote,
}) => {
  const [isHalfSize, setIsHalfSize] = useState(false); // Local state to control the size
  const [apiKey, setApiKey] = useState(""); // Local state to store API Key
  const [chatInput, setChatInput] = useState(""); // Local state to store chat input
  const [conversation, setConversation] = useState([]); // Local state to store the conversation

  const sortedNotes = notes.sort((a, b) => b.lastModified - a.lastModified);

  const toggleSidebarSize = () => {
    setIsHalfSize(!isHalfSize);
  };

  const setApiKeyAndSave = () => {
    // Save API Key somewhere and/or set it for the GPT-4 call
    console.log(`API Key set: ${apiKey}`);
  };

  const askGPT4 = () => {
    // Make GPT-4 API call and update the conversation state
    // For demonstration purposes, let's assume the chatbot responds with "Hello, how can I help you?"
    setConversation([
      ...conversation,
      { type: "user", text: chatInput },
      { type: "bot", text: "Hello, how can I help you?" },
    ]);
    setChatInput("");
  };

  return (
    <div className={`app-sidebar ${isHalfSize ? "half" : ""}`}>
      <div className="app-sidebar-header">
        <h1>Notes</h1>
        <button onClick={onAddNote}>Add</button>
        <button id="toggleSidebar" onClick={toggleSidebarSize}>
          Toggle Sidebar
        </button>
      </div>
      <div className="app-sidebar-notes">
        {sortedNotes.map(({ id, title, body, lastModified }, i) => (
          <div
            className={`app-sidebar-note ${id === activeNote && "active"}`}
            onClick={() => setActiveNote(id)}
            key={id}
          >
            <div className="sidebar-note-title">
              <strong>{title}</strong>
              <button onClick={(e) => onDeleteNote(id)}>Delete</button>
            </div>
            <p>{body && body.substr(0, 100) + "..."}</p>
            <small className="note-meta">
              Last Modified{" "}
              {new Date(lastModified).toLocaleDateString("en-NZ", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </small>
          </div>
        ))}
      </div>
      {isHalfSize && (
        <div className="chatbot-placeholder">
          <input
            type="text"
            placeholder="Enter API Key"
            onChange={(e) => setApiKey(e.target.value)}
            className="api-input"
          />
          <button className="api-set" onClick={setApiKeyAndSave}>
            Set
          </button>
          <div className="chat-output">
            {conversation.map((msg, index) => (
              <div key={index}>
                <strong>{msg.type === "user" ? "You: " : "GPT-4: "}</strong>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="chat-input">
            <textarea
              rows="1"
              placeholder="Enter your question"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
            />
            <button onClick={askGPT4}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
