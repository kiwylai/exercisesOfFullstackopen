import { useState, useEffect } from 'react'
import personService from './services/person'

const handleWith = (handler)=>{ 
  return (event) => {
    console.log(event.target.value)
    handler(event.target.value)
  }
}

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
    personService
      .create({ name: newName, number: newNumber })
      .then(person => setPersons(persons.concat(person)))
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
  const [persons, setPersons] = useState([]) 
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    console.log('effect')
    personService
      .getAll()
      .then(allPersons => {
        console.log('promise fulfilled')
        setPersons(allPersons)
      })
  }, [])

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