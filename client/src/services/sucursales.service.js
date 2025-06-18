import { api } from './main'

const getAllSucursales = async () => {
	const response = await api.get('sucursales/')
	return response.data
}

export const sucursalesService = {
	getAllSucursales,
}
