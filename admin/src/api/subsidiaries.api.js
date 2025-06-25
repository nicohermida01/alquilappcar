import { api } from './main'

const getSubsidiaries = async () => {
	const response = await api.get('sucursales/')
	return response.data
}

const getSubsidiariesPopulated = async () => {
	const response = await api.get('sucursales/populated/')
	return response.data
}


const getActiveSubsidiariesPopulated = async () => {
	const response = await api.get('sucursales/populated_activas/')
	return response.data
}

const deleteSucursal = async (id) => {
  const response = await api.patch(`sucursales/${id}/`,{
    activo: 0
  })
  return response.data
}

export const subsidiariesApi = {
	getSubsidiaries,
	getSubsidiariesPopulated,
  deleteSucursal,
  getActiveSubsidiariesPopulated
}
