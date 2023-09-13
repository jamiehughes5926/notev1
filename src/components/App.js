import uuid from "react-uuid";
import "./App.css";
import Main from "./components/Main";
import Sidebar from "./components/Sidebar";

function App() {
  const [notes, setNotes] = useState(
    localStorage.notes ? JSON.parse(localStorage.notes) : []
  );
  const [folders, setFolders] = useState([]);
  const [activeNote, setActiveNote] = useState(false);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const onAddNote = (folderId) => {
    const newNote = {
      id: uuid(),
      title: "Untitled Note",
      body: "",
      lastModified: Date.now(),
      images: [], // Initialize images array
    };

    if (folderId) {
      setFolders(folders.map(folder => 
        folder.id === folderId 
          ? {...folder, notes: [newNote, ...folder.notes]} 
          : folder
      ));
    } else {
      setNotes([newNote, ...notes]);
    }

    setActiveNote(newNote.id);
  };

  const onAddFolder = () => {
    const newFolder = {
      id: uuid(),
      notes: [],
    };

    setFolders([newFolder, ...folders]);
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
        onAddFolder={onAddFolder}
        onDeleteNote={onDeleteNote}
        activeNote={activeNote}
        setActiveNote={setActiveNote}
      />
      <Main activeNote={getActiveNote()} onUpdateNote={onUpdateNote} />
    </div>
  );
}

export default App;