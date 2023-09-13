import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import CodeBlock from "./CodeBlock"; // Make sure to import your CodeBlock component
import YouTubeBlock from "./YoutubeBlock";

const Main = ({ activeNote, onUpdateNote }) => {
  const [localImages, setLocalImages] = useState([]);
  const [view, setView] = useState("edit");

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

  let htmlCode = "";
  let cssCode = "";
  let jsCode = "";

  if (activeNote) {
    const codeMatch = activeNote.body.match(
      /\[CODE_BLOCK\]\[HTML\]([\s\S]*?)\[CSS\]([\s\S]*?)\[JS\]([\s\S]*?)\[\/CODE_BLOCK\]/
    );
    if (codeMatch) {
      htmlCode = codeMatch[1].trim();
      cssCode = codeMatch[2].trim();
      jsCode = codeMatch[3].trim();
    }
  }

  const onEditField = (field, value) => {
    onUpdateNote({
      ...activeNote,
      [field]: value,
      lastModified: Date.now(),
    });
  };

  const renderContent = () => {
    if (!activeNote)
      return <div className="no-active-note">No Active Note</div>;
    
    if (currentFolderId) {
      const folderNotes = notes.filter(note => note.folderId === currentFolderId);
      return (
        <div className="folder-notes">
          {folderNotes.map(note => (
            <Note note={note} key={note.id} />
          ))}
        </div>
      );
    }

    <Main activeNote={getActiveNote()} onUpdateNote={onUpdateNote} folders={folders} currentFolderId={currentFolderId} />
    const allRegEx =
      /\[CODE_BLOCK\]\[HTML\]([\s\S]*?)\[CSS\]([\s\S]*?)\[JS\]([\s\S]*?)\[\/CODE_BLOCK\]|\[YOUTUBE\s*=\s*(.*?)\]/g;
    let match;
    let lastIndex = 0;
    const parts = [];

    while ((match = allRegEx.exec(activeNote.body)) !== null) {
      parts.push(activeNote.body.substring(lastIndex, match.index));

      // If it's a code block
      if (match[1]) {
        parts.push(
          <CodeBlock
            htmlCode={match[1].trim()}
            cssCode={match[2].trim()}
            jsCode={match[3].trim()}
          />
        );
      }
      // If it's a YouTube block
      else if (match[4]) {
        parts.push(<YouTubeBlock videoUrl={match[4]} />);
      }

      lastIndex = match.index + match[0].length;
    }

    // Append the last chunk of plain text
    parts.push(activeNote.body.substring(lastIndex));

    return (
      <div className="scrollable-container">
        {parts.map((part, index) => {
          if (typeof part === "string") {
            return (
              <ReactMarkdown className="markdown-preview">{part}</ReactMarkdown>
            );
          }
          return part;
        })}
      </div>
    );
  };

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
            value={activeNote?.title || ""}
            onChange={(e) => onEditField("title", e.target.value)}
            autoFocus
          />
          <textarea
            id="body"
            placeholder="Write your note here..."
            value={activeNote?.body || ""}
            onChange={(e) => onEditField("body", e.target.value)}
          />
        </div>
      )}

      {view === "preview" && renderContent()}
    </div>
  );
};

export default Main;
