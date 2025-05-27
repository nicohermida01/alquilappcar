import { api } from './main'

const login = async credentials => {
	const response = await api.post('login/admin/', credentials)
	return response.data
}

export const authService = {
	login,
}
