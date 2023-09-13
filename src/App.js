import { useEffect, useState } from "react";
import uuid from "react-uuid";
import "./App.css";
import Main from "./components/Main";
import Sidebar from "./components/Sidebar";

function App() {
  const [notes, setNotes] = useState(
    localStorage.notes ? JSON.parse(localStorage.notes) : []
  );
  const [activeNote, setActiveNote] = useState(false);
  const [isChatMode, setIsChatMode] = useState(false); // State variable to control whether the user is in chat mode or note mode

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const onAddNote = () => {
    if (isChatMode) {
      const newChat = {
        id: uuid(),
        title: "Untitled Chat",
        body: "",
        lastModified: Date.now(),
      };
  
      setChats([newChat, ...chats]);
      setActiveChat(newChat.id);
    } else {
      const newNote = {
        id: uuid(),
        title: "Untitled Note",
        body: "",
        lastModified: Date.now(),
        images: [], // Initialize images array
      };
  
      setNotes([newNote, ...notes]);
      setActiveNote(newNote.id);
    }
  };

  const onDeleteNote = (noteId) => {
    setNotes(notes.filter(({ id }) => id !== noteId));
  };

  const onUpdateNote = (updatedNote) => {
    const updatedNotesArr = notes.map((note) => {
      if (note.id === updatedNote.id) {
        return {
          ...updatedNote,
          images: updatedNote.images || [], // Add images array if it doesn't exist
        };
      }
      return note;
    });

    setNotes(updatedNotesArr);
  };

  const getActiveNote = () => {
    return notes.find(({ id }) => id === activeNote);
  };

  return (
    <div className="App">
      <Sidebar
        notes={notes}
        onAddNote={onAddNote}
        onDeleteNote={onDeleteNote}
        activeNote={activeNote}
        setActiveNote={setActiveNote}
      />
      <Main activeNote={getActiveNote()} onUpdateNote={onUpdateNote} />
    </div>
  );
}

export default App;
