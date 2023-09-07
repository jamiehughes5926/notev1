import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";

const Main = ({ activeNote, onUpdateNote }) => {
  const [localImages, setLocalImages] = useState([]);
  const [view, setView] = useState("edit"); // New state to keep track of current view

  useEffect(() => {
    const handlePaste = (e) => {
      const clipboardData = e.clipboardData || window.clipboardData;
      if (clipboardData.items) {
        const items = clipboardData.items;
        for (let i = 0; i < items.length; i++) {
          if (items[i].type.indexOf("image") !== -1) {
            const blob = items[i].getAsFile();
            const reader = new FileReader();
            reader.onload = function (event) {
              setLocalImages([...localImages, event.target.result]);

              const imgPlaceholder = `[image:${localImages.length}]`;
              const newBody = `${activeNote.body}\n${imgPlaceholder}`;
              onUpdateNote({
                ...activeNote,
                body: newBody,
                lastModified: Date.now(),
              });
            };
            reader.readAsDataURL(blob);
          }
        }
      }
    };

    window.addEventListener("paste", handlePaste);
    return () => {
      window.removeEventListener("paste", handlePaste);
    };
  }, [activeNote, localImages, onUpdateNote]);

  const onEditField = (field, value) => {
    onUpdateNote({
      ...activeNote,
      [field]: value,
      lastModified: Date.now(),
    });
  };

  if (!activeNote) return <div className="no-active-note">No Active Note</div>;

  return (
    <div className="app-main">
      <button onClick={() => setView(view === "edit" ? "preview" : "edit")}>
        Toggle {view === "edit" ? "Preview" : "Edit"}
      </button>

      {view === "edit" && (
        <div className="app-main-note-edit">
          <input
            type="text"
            id="title"
            placeholder="Note Title"
            value={activeNote.title}
            onChange={(e) => onEditField("title", e.target.value)}
            autoFocus
          />
          <textarea
            id="body"
            placeholder="Write your note here..."
            value={activeNote.body}
            onChange={(e) => onEditField("body", e.target.value)}
          />
        </div>
      )}

      {view === "preview" && (
        <div className="app-main-note-preview">
          <h1 className="preview-title">{activeNote.title}</h1>
          <ReactMarkdown className="markdown-preview">
            {activeNote.body}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
};

export default Main;
