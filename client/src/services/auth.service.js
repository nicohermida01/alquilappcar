import { api } from './main'

const register = async userData => {
	const response = await api.post('clientes/', userData)
	return response.data
}

const login = async credentials => {
	const response = await api.post('login/', credentials)
	return response.data
}

const checkActiveness = async (userId) => {
	const response = await api.get(`clientes/${userId}/`);
	console.log(response.data);

	return response.data.activo;
}

export const authService = {
	register,
	login,
	checkActiveness
}
