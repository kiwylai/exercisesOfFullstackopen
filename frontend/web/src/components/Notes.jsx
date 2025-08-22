import Note from "./Note.jsx";
import {useState, useEffect, useRef} from "react";
import noteService from "../services/notes";
import Togglable from "./Togglable";
import NoteForm from "./NoteForm.jsx";
import RenderOnCondition from "./RenderOnCondition.jsx";
import loginService from "../services/login.js";

const Notes = ({emitError}) => {
    const [notes, setNotes] = useState([])
    const [newNote, setNewNote] = useState('')
    const [showAll, setShowAll] = useState(true)
    const noteFormRef = useRef()
    const loggedUser = loginService.getUser()

    useEffect(() => {
        noteService.getAll().then((initialNotes) => {
            setNotes(initialNotes);
        });
    }, []);

    const toggleImportanceOf = (id) => () => {
        const note = notes.find((n) => n.id === id);
        const changedNote = {...note, important: !note.important};
        noteService
            .update(id, changedNote)
            .then((returnedNote) => {
                setNotes(notes.map((note) => (note.id === id ? returnedNote : note)));
            })
            .catch((error) => {
                if (error.response.status === 401) {
                    emitError(`Note could not be changed without being logged in. Please log in.`);
                } else {
                    emitError(`Note '${note.content}' could not be changed because of error: ${error.errorMessage}`);
                }

                // setNotes(notes.filter((n) => n.id !== id));
            });
    };

    const addNote = (event) => {
        event.preventDefault();
        const noteObject = {
            content: newNote,
            important: Math.random() > 0.5,
        };
        noteFormRef.current.toggleVisibility()

        noteService.create(noteObject).then((returnedNote) => {
            setNotes(notes.concat(returnedNote));
            setNewNote("");
        });
    };

    const handleNoteChange = (event) => {
        setNewNote(event.target.value)
    }
    const notesToRender = showAll ? notes : notes.filter(note => note.important)

    return (
        <div>
            <h1>Notes</h1>
            <div>
                <RenderOnCondition condition={loggedUser}>
                    <Togglable showLabel="new note" hideLabel="cancel" ref={noteFormRef} legend={ <h2>create a new note</h2>}>
                        <NoteForm
                            onSubmit={addNote}
                            value={newNote}
                            handleChange={handleNoteChange}
                        />
                    </Togglable>
                </RenderOnCondition>
            </div>

            <div>
                <button onClick={() => setShowAll(!showAll)}>
                    show {showAll ? "important" : "all"}
                </button>
            </div>
            <ul>
                {notesToRender.map(note =>
                    <Note key={note.id}
                          note={note}
                          toggleImportance={toggleImportanceOf(note.id)}
                    />
                )}
            </ul>
        </div>
    )
}

export default Notes