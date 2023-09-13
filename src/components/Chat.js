import React, { useState, useEffect } from 'react';

const Chat = ({ activeChat, onUpdateChat, onDeleteChat }) => {
  const [title, setTitle] = useState(activeChat.title);
  const [body, setBody] = useState(activeChat.body);

  useEffect(() => {
    onUpdateChat({ ...activeChat, title, body });
  }, [title, body]);

  return (
    <div className="chat">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <button onClick={() => onDeleteChat(activeChat.id)}>
        Delete Chat
      </button>
    </div>
  );
};

export default Chat;
