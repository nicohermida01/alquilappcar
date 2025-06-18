export const formatAmount = amount => {
	const num = Number(amount)
	if (isNaN(num)) return 'valor no válido'
	return num
		.toFixed(2) // dos decimales
		.replace('.', ',') // coma decimal
		.replace(/\B(?=(\d{3})+(?!\d))/g, '.') // puntos de miles
}
