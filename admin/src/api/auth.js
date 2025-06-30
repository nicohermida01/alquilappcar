import { api } from './main'

const login = async credentials => {
	const response = await api.post('login/admin/', credentials)
	return response.data
}

const confirm2FA = async (code, userId) => {
	const response = await api.post(`login/admin/2fa/${userId}/`, {
		code2FA: code,
	})
	return response.data
}

const checkActiveness = async (id) => {
	const response = await api.get(`empleados/${id}/`);

	return response.data.activo;
}

export const authService = {
	login,
	confirm2FA,
	checkActiveness
}
