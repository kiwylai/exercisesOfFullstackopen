import { useState } from 'react'

const handleWith = (handler)=>{ 
  return (event) => {
    console.log(event.target.value)
    handler(event.target.value)
  }}
const Filter = ({ searchTerm, setSearchTerm }) => {
  return (
    <div>filter shown with <input value={searchTerm} onChange={handleWith(setSearchTerm)}/></div>
  )
}

const PersonForm = ({ persons, setPersons }) => {
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const handleSubmit = (event) => {
    event.preventDefault()
    if (persons.find(person => person.name === newName)) {
      alert(`${newName} is already added to phonebook`)
      return
    }
    setPersons(persons.concat({ name: newName, number: newNumber }))
    setNewName('')
    setNewNumber('')
  }
  return (
    <form onSubmit={handleSubmit}>
      name: <input value={newName} onChange={handleWith(setNewName)} /> <br/>
      number: <input value={newNumber} onChange={handleWith(setNewNumber)}/> <br/>
      <button type="submit">add</button>
    </form>
  )
}

const Persons = ({ persons,searchTerm }) => {
  const filteredPersons = searchTerm ? persons.filter(person => person.name.toLowerCase().includes(searchTerm.toLowerCase())) : persons

  return (
    filteredPersons.map(person => <p key={person.name}>{person.name} {person.number}</p>)
  )
}

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ]) 
  const [searchTerm, setSearchTerm] = useState('')
  return (
    <div>     
      <h2>Phonebook</h2>
      <Filter searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <h2>add a new</h2>
      <PersonForm persons={persons} setPersons={setPersons} />
      <h2>Numbers</h2>   
      <Persons persons={persons} searchTerm={searchTerm} />
    </div>
  )
}

export default App