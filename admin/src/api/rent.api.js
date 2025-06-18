import { CANCELLED_RENT } from '../constants/rentStatus'
import { api } from './main'

const cancel = async (id, refundAmount) => {
	const response = await api.patch(`/alquileres/${id}/`, {
		status: CANCELLED_RENT,
		reembolso: refundAmount,
	})
	return response.data
}

export const rentApi = {
	cancel,
}
