import { CANCELLED_RENT } from '../constants/rentStatus'
import { api } from './main'

const createLease = async data => {
	const response = await api.post('/alquileres/', data)
	return response.data
}

const cancelLease = async (id, refundAmount) => {
	const response = await api.patch(`/alquileres/${id}/`, {
		status: CANCELLED_RENT,
		reembolso: refundAmount,
	})
	return response.data
}

export const leasesApi = {
	createLease,
	cancelLease,
}
