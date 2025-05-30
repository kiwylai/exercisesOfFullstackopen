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

const PersonForm = ({ persons, setPersons, displayMessage }) => {
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const addPerson = () => {
    personService
      .create({ name: newName, number: newNumber })
      .then(person => {
        setPersons(persons.concat(person))
        displayMessage(`Added ${person.name}`)
      }
    )
  }

  const updatePerson = (existingPerson) => {
    if (window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)){
      personService
        .update(existingPerson.id, { name: newName, number: newNumber })
        .then(updatedPerson => {
          setPersons(persons.map(p => p.id !== updatedPerson.id ? p : updatedPerson))
          displayMessage(`Updated ${newName} `)
        })
        .catch(error => {
          console.error('Error updating person:', error)
        })
      return true
    } 
    return false
  }

  const clearInputFields = () => {
    setNewName('')
    setNewNumber('')
  }
  const handleSubmit = (event) => {
    event.preventDefault()
    const existingPerson = persons.find(person => person.name === newName)
    let operationSuccessful = false
    if (existingPerson) {
      operationSuccessful = updatePerson(existingPerson)   
    } else {
      addPerson(event)
      operationSuccessful = true
    }
    if (operationSuccessful) {
      clearInputFields() 
    }
  }
  
  return (
    <form onSubmit={handleSubmit}>
      name: <input value={newName} onChange={handleWith(setNewName)} /> <br/>
      number: <input value={newNumber} onChange={handleWith(setNewNumber)}/> <br/>
      <button type="submit">add</button>
    </form>
  )
}

const Persons = ({ persons, searchTerm, setPersons, displayMessage }) => {
  const filteredPersons = searchTerm ? persons.filter(person => person.name.toLowerCase().includes(searchTerm.toLowerCase())) : persons
  const handleDelete = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService
        .remove(id)
        .then(() => {
          setPersons(persons.filter(p => p.id !== id))
          displayMessage(`Deleted ${name}`)
        })
        .catch(error => {
          console.error('Error deleting person:', error)
        })
  }}

  return (
    filteredPersons.map(person => <p key={person.name}>{person.name} {person.number}
    <button onClick={() => handleDelete(person.id, person.name)}>delete</button></p>)
  )
  }

const Notification = ({message }) => { 
  if (message === null) {
    return ''
  }

  return (
    <div className='success'>
      {message} 
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [searchTerm, setSearchTerm] = useState('')
  const [message, setMessage] = useState(null)

  useEffect(() => {
    console.log('effect')
    personService
      .getAll()
      .then(allPersons => {
        console.log('promise fulfilled')
        setPersons(allPersons)
      })
  }, [])

   const displayMessage = (message) => {
    setMessage(message)
    setTimeout(() => {
      setMessage(null)
    }, 5000)
  }

  return (
    <div>     
      <h2>Phonebook</h2>
      <Notification message={message} />
      <Filter searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <h2>add a new</h2>
      <PersonForm persons={persons} setPersons={setPersons} displayMessage={displayMessage}/>
      <h2>Numbers</h2>   
      <Persons persons={persons} searchTerm={searchTerm} setPersons={setPersons} displayMessage={displayMessage} />
    </div>
  )
}

export default App