import { useEffect, useState } from "react";
import uuid from "react-uuid";
import "./App.css";
import Main from "./components/Main";
import Sidebar from "./components/Sidebar";

function App() {
  const [notes, setNotes] = useState(
    localStorage.notes ? JSON.parse(localStorage.notes) : [],
  );
  const [folders, setFolders] = useState([]);

  useEffect(() => {
    const storedFolders = localStorage.getItem("folders");
    if (storedFolders) {
      setFolders(JSON.parse(storedFolders));
    }
  }, []);
  const [activeNote, setActiveNote] = useState(false);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const onAddNote = () => {
    const newNote = {
      id: uuid(),
      title: "Untitled Note",
      body: "",
      lastModified: Date.now(),
      images: [], // Initialize images array
    };

    setNotes([newNote, ...notes]);
    setActiveNote(newNote.id);
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

  const onAddFolder = () => {
    const newFolder = {
      id: uuid(),
      name: "Untitled Folder",
      notes: [],
    };

    setFolders([newFolder, ...folders]);
    localStorage.setItem("folders", JSON.stringify([newFolder, ...folders]));
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
        onAddFolder={onAddFolder}
      />
      <Main activeNote={getActiveNote()} onUpdateNote={onUpdateNote} />
    </div>
  );
}

export default App;
