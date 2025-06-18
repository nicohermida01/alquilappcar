import { api } from './main'

const getAllCategories = async () => {
	const response = await api.get('categorias/')
	return response.data
}

export const categoriesService = {
	getAllCategories,
}
