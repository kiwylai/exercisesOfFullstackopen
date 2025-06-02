import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'

const ShowCountries = ({countries, searchTerm}) => {
  const filteredCountries = countries.filter(country => country.name.official.toLowerCase().includes(searchTerm.toLowerCase()))

  if (filteredCountries.length > 10) {
    return (
      <p>Too many matches, specify another filter</p>
    )
  } else if (filteredCountries.length > 1) {
    return (
      filteredCountries.map(country => <p key={country.name.official}>{country.name.official}</p>)
    )
  } else if (filteredCountries.length === 1) {
    const selectedCountry = filteredCountries[0]
    const languages = Object.values(selectedCountry.languages)
    return (
      <div>
        <h1>{selectedCountry.name.official}</h1>
        <p>Capital {selectedCountry.capital[0]}</p>
        <p>Area {selectedCountry.area}</p>
        <h3>Languages:</h3>
        <ul>
          {languages.map(language => <li key={language}>{language}</li>)}
        </ul>
        <img src={selectedCountry.flags.png} alt='flag'/>
      </div>
    )
  } else {
    return (
      <p>No matches</p>
    )
  }
}
function App() {
  const [countries, setCountries] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  const fetchCountries = () => {
    console.log('effect')
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        console.log('countries loaded')
        setCountries(response.data)
      })
  }
  useEffect(fetchCountries, [])

  const handleChange = (event) => {
    setSearchTerm(event.target.value)
  }

  return (
    <div>
      <form>
        find countries <input value={searchTerm} onChange={handleChange}/>
      </form>
      <ShowCountries countries={countries} searchTerm={searchTerm}/>
    </div>
  )
}

export default App
