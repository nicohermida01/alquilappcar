import { api } from './main'

const register = async employeeData => {
	const response = await api.post('empleados/', employeeData)
	return response.data
}

export const employeeApi = {
	register,
}
