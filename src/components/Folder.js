import React from 'react';
import uuid from 'react-uuid';

class Folder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      notes: [],
    };
  }

  addNote = () => {
    const newNote = {
      id: uuid(),
      title: "Untitled Note",
      body: "",
      lastModified: Date.now(),
    };
    this.setState(prevState => ({
      notes: [newNote, ...prevState.notes],
    }));
    // Add logic to handle the addition of the new note to the parent component
    this.props.onAddNote(newNote);
  };

  removeNote = (noteId) => {
    this.setState(prevState => ({
      notes: prevState.notes.filter(note => note.id !== noteId),
    }));
    // Add logic to handle the removal of the note from the parent component
    this.props.onRemoveNote(noteId);
  };

  render() {
    return (
      <div className="folder">
        {this.state.notes.map(note => (
          <div key={note.id} className="note">
            <h2>{note.title}</h2>
            <p>{note.body}</p>
          </div>
        ))}
      </div>
    );
  }
}

export default Folder;
