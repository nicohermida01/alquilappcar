import {
	CANCELLED_RENT,
	DELETED_RENT,
	FINISHED_RENT,
	IN_PROGRESS_RENT,
} from '../constants/rentStatus'
import { api } from './main'

const createLease = async data => {
	const response = await api.post('/alquileres/', data)
	return response.data
}

const getAllLeases = async () => {
	const response = await api.get('/alquileres/')
	return response.data
}

const getLeaseById = async id => {
	const response = await api.get(`/alquileres/${id}/`)
	return response.data
}

const cancelLease = async (id, refundAmount) => {
	const response = await api.patch(`/alquileres/${id}/`, {
		status: CANCELLED_RENT,
		reembolso: refundAmount,
	})
	return response.data
}

const deleteLease = async id => {
	const response = await api.patch(`/alquileres/${id}/`, {
		status: DELETED_RENT,
	})
	return response.data
}

const confirmVehicle = async (id, vehicle) => {
	const response = await api.patch(`/alquileres/${id}/`, {
		vehiculo_asignado_id: vehicle,
		status: IN_PROGRESS_RENT,
	})
	return response.data
}

const confirmReturn = async id => {
	const response = await api.patch(`/alquileres/${id}/`, {
		status: FINISHED_RENT,
	})
	return response.data
}

const confirmAfterReturn = async (id, amount) => {
	const response = await api.patch(`/alquileres/${id}/`, {
		status: FINISHED_RENT,
		montoExtra: amount,
	})
	return response.data
}

const confirmBeforeReturn = async (id, amount) => {
	const response = await api.patch(`/alquileres/${id}/`, {
		status: FINISHED_RENT,
		montoDevuelto: amount,
	})
	return response.data
}

export const leasesApi = {
	createLease,
	getAllLeases,
	cancelLease,
	deleteLease,
	getLeaseById,
	confirmVehicle,
	confirmReturn,
	confirmBeforeReturn,
	confirmAfterReturn,
}
