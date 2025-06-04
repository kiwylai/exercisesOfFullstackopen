import { useState, useEffect } from 'react'
import countriesService from './services/countries'

const SelectedCountry = ({ selectedCountry}) => {
  if (!selectedCountry) return null
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
      <img src={selectedCountry.flags.png} alt='flag' />
    </div>
  ) 
} 

const CountrySelectionList = ({filteredCountries, setSelectedCountry}) => {
  console.log('show countries', filteredCountries)
  if (!filteredCountries) return null

  if (filteredCountries.length > 10) {
    return (
      <p>Too many matches, specify another filter</p>
    )
  } else if (filteredCountries.length > 1) {
    return (
      filteredCountries.map(country => <p key={country.name.official}>{country.name.official}<button onClick={() => setSelectedCountry(country)}>show</button></p>)
    )
  } else return null
}

function App() {
  const [countries, setCountries] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCountry, setSelectedCountry] = useState(null)
  const [countrySelectionList, setCountrySelectionList] = useState([])

  const fetchCountries = () => {
    console.log('fetching countries') 
    countriesService
      .getAll()
      .then(countries => {
        console.log('countries loaded')
        setCountries(countries)
      })
  }
  const calcultateSelectedCountryList = () => {
    if (!countries ) return 
    
    const countryList = countries.filter((country) => {
      const countryName = country.name.official.toLowerCase()
      return countryName.includes(searchTerm.toLowerCase())
    })

    setCountrySelectionList(countryList)

    if (countryList.length === 1) {
      setSelectedCountry(countryList[0])
    } else {
      setSelectedCountry(null)
    }
  }

  useEffect(fetchCountries, [])
  useEffect(calcultateSelectedCountryList, [countries, searchTerm])

  const handleChange = (event) => {
    console.log('keypress', event.target.value)
    setSearchTerm(event.target.value)
  }

  return (
    <div>
      <form>
        find countries <input value={searchTerm} onChange={handleChange}/>
      </form>
      <CountrySelectionList setSelectedCountry={setSelectedCountry} filteredCountries={countrySelectionList}/>
      <SelectedCountry selectedCountry={selectedCountry}/>  
    </div>
  )
}
export default App
