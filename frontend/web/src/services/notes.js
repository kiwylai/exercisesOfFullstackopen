import axios from "axios";
const baseUrl = "/api/notes";
import loginService from './login.js'

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const getConfig = () => {
    const config = {
        headers: { Authorization: `Bearer ${loginService.getUser().token}`},
    }
    return config;
}

const create = async newObject => {
    const response = await axios.post(baseUrl, newObject, getConfig())
    return response.data
}

const update = async (id, newObject) => {
    const response =
        await axios.put(`${ baseUrl }/${id}`, newObject, getConfig())
    return response.data
}

export default {
    getAll,
    create,
    update
};
