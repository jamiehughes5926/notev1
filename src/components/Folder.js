import React from 'react';

const Folder = ({ folder, addNote }) => {
  return (
    <div className="folder">
      <h2>{folder.title}</h2>
      <ul>
        {folder.notes.map(note => (
          <li key={note.id}>
            <h3>{note.title}</h3>
            <p>{note.body}</p>
          </li>
        ))}
      </ul>
      <button onClick={() => addNote(folder.id)}>Add Note</button>
    </div>
  );
};

export default Folder;
