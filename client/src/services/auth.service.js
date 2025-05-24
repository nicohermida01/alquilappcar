import { api } from './main'

const register = async userData => {
	const response = await api.post('clientes/', userData)
	return response.data
}

const login = async credentials => {
	const response = await api.post('login/', credentials)
	return response.data
}

export const authService = {
	register,
	login,
}
