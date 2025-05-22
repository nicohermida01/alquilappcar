import { api } from './main'

const register = async userData => {
	const response = await api.post('clientes/', userData)
	return response.data
}

export const authService = {
	register,
}
