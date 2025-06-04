import { api } from './main'

const cancel = async id => {
	const response = await api.patch(
		`http://localhost:8000/alquilapp/api/v1/alquileres/${id}/`,
		{
			activo: false,
		}
	)
	return response.data
}

export const rentApi = {
	cancel,
}
