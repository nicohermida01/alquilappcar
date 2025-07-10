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

const dateOptions = {
	month: 'long',
	day: '2-digit',
	year: 'numeric',
	timeZone: 'America/Argentina/Buenos_Aires',
}

// export const getFormattedDate = fecha => {
// 	return new Date(fecha).toLocaleString('es-AR', dateOptions)
// }

export const getFormattedDate = (fecha) => {
  const date = new Date(fecha);

  const year = date.getUTCFullYear();
  const month = date.getUTCMonth(); // 0-based
  const day = date.getUTCDate();

  const meses = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
  ];

  return `${day.toString().padStart(2, '0')} de ${meses[month]} de ${year}`;
};