import { api } from './main'

const getAllSucursales = async () => {
	const response = await api.get('sucursales/')
	return response.data
}

const getActiveSubsidiariesPopulated = async () => {
	const response = await api.get('sucursales/populated_activas/')
	return response.data
}

export const sucursalesService = {
	getAllSucursales,
	getActiveSubsidiariesPopulated
}
