import { api } from './main'

const getSubsidiaries = async () => {
	const response = await api.get('sucursales/')
	return response.data
}

const getSubsidiariesPopulated = async () => {
	const response = await api.get('sucursales/populated/')
	return response.data
}

export const subsidiariesApi = {
	getSubsidiaries,
	getSubsidiariesPopulated,
}
