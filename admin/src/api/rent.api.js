import { CANCELLED_RENT, DELETED_RENT } from '../constants/rentStatus'
import { api } from './main'

const confirmCancel = async (id, refundAmount) => {
	const response = await api.patch(`/alquileres/${id}/`, {
		status: CANCELLED_RENT,
		reembolso: refundAmount,
	})
	return response.data
}

const deleteRent = async (id, refundAmount) => {
	const response = await api.patch(`/alquileres/${id}/`, {
		status: DELETED_RENT
	})
	return response.data
}


export const rentApi = {
	confirmCancel, deleteRent
}
