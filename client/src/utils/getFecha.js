const opcionesFecha = {
	day: '2-digit',
	month: '2-digit',
	year: 'numeric',
	hour: '2-digit',
	minute: '2-digit',
	hour12: false,
	timeZone: 'America/Argentina/Buenos_Aires',
}

export const getFecha = fecha => {
	return new Date(fecha).toLocaleString('es-AR', opcionesFecha)
}
