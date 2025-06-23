import { api } from './main'

const getAllClients = () => {
	return api.get('/clientes')
}

const createClient = clientData => {
	const response = api.post('/clientes/', clientData)
	return response
}

const updateClient = (clientId, clientData) => {
	const response = api.patch(`/clientes/${clientId}/`, clientData)
	return response
}

const deleteClient = (clientId) => {
	const response = api.patch(`/clientes/${clientId}/`,{
    activo: 0
  })
	return response
}

const getAlquileresByUserId = async userId => {
	const response = await api.get(`alquileres/cliente/${userId}`)

	return response.data
}

export const clientApi = {
	getAllClients,
	createClient,
	updateClient,
	getAlquileresByUserId,
  deleteClient
}
