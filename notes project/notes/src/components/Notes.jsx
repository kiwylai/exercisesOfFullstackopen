import {Note} from "./components/Note.jsx";
import {useState, useEffect} from "react";
import axios from "axios";

const Notes = () => {
    const [notes, setNotes] = useState([])
    const [newNote, setNewNote] = useState('')
    const [showAll, setShowAll] = useState(true)

    useEffect(() => {
        console.log('effect')
        axios
            .get('http://localhost:3001/notes')
            .then(response => {
                console.log('promise fulfilled')
                setNotes(response.data)
            })
    })
    console.log('render', notes.length, 'notes')

    const addNote = (event) => {
        event.preventDefault()
        const noteObject = {
            content: newNote,
            important: Math.random() < 0.5,
        }

        axios
    .post('http://localhost:3001/notes', noteObject)
    .then(response => {
      console.log(response)
    })
        setNotes(notes.concat(noteObject))
        setNewNote('')
    }

    const handleNoteChange = (event) => {
        setNewNote(event.target.value)
    }
    const notesToRender = showAll? notes : notes.filter(note => note.important)
    return (
        <div>
            <h1>Notes</h1>
            <button onClick={() => setShowAll(!showAll)}>show {showAll? 'only important':'all'}</button>
            <ul>
                {notesToRender.map(note => <Note key={note.id} note={note}/>)}
            </ul>
            <form onSubmit={addNote}>
                <input id="newNoteInputField" defaultValue={newNote} onChange={handleNoteChange}/>
                <button type="submit">save</button>
            </form>
        </div>
    )
}

export default Notes