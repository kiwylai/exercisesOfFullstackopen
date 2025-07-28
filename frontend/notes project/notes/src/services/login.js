import axios from 'axios'
const baseUrl = '/api/login'

const getUser = ()=>{
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON) {
        return JSON.parse(loggedUserJSON)
    }
    return undefined
}

const login = async (credentials) => {
    const response = await axios.post(baseUrl, credentials)
    return response.data
}
export default {login, getUser}