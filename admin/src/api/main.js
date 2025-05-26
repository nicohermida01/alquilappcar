import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000/alquilapp/api/v1/'

export const api = axios.create({
	baseURL: API_BASE_URL,
})
