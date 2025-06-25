export const ID_COLUMN_KEY = 'id'
export const CLIENT_COLUMN_KEY = 'cliente'
export const REGISTER_DATE_COLUMN_KEY = 'fecha_registro'
export const INIT_DATE_COLUMN_KEY = 'fecha_inicio'
/* export const END_DATE_COLUMN_KEY = 'fecha_devolucion' */
export const DAYS_COLUMN_KEY = 'cantidad_dias_totales'
export const AMOUNT_COLUMN_KEY = 'precio_total'
export const STATE_COLUMN_KEY = 'status'

export const columns = [
	{ name: 'ID', uid: ID_COLUMN_KEY, sortable: true },
	{ name: 'CLIENTE', uid: CLIENT_COLUMN_KEY, sortable: true },
	{ name: 'FECHA REGISTRO', uid: REGISTER_DATE_COLUMN_KEY, sortable: true },
	{ name: 'DÍAS', uid: DAYS_COLUMN_KEY, sortable: true },
	{ name: 'FECHA INICIO', uid: INIT_DATE_COLUMN_KEY, sortable: true },
	/* { name: 'FECHA FIN', uid: END_DATE_COLUMN_KEY, sortable: true }, */
	{ name: 'MONTO', uid: AMOUNT_COLUMN_KEY },
	{ name: 'ESTADO', uid: STATE_COLUMN_KEY, sortable: true },
	{ name: 'ACCIONES', uid: 'actions' },
]
