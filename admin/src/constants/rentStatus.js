export const PENDING_RENT = 'pending'
export const IN_PROGRESS_RENT = 'in_progress'
export const FINISHED_RENT = 'finished'
export const CANCELLED_RENT = 'canceled'
export const DELETED_RENT = 'deleted'

export const STATUS_CHIP_COLORS = {
	[PENDING_RENT]: 'default',
	[IN_PROGRESS_RENT]: 'success',
	[FINISHED_RENT]: 'secondary',
	[CANCELLED_RENT]: 'primary',
	[DELETED_RENT]: 'danger',
}

export const STATUS_TEXT_COLOR = {
	[PENDING_RENT]: 'text-gray-600',
	[IN_PROGRESS_RENT]: 'text-green-100',
	[FINISHED_RENT]: 'text-gray-100',
	[CANCELLED_RENT]: 'text-gray-200',
	[DELETED_RENT]: 'text-red-200',
}

export const STATUS_TEXT = {
	[PENDING_RENT]: 'Pendiente',
	[IN_PROGRESS_RENT]: 'En progreso',
	[FINISHED_RENT]: 'Finalizado',
	[CANCELLED_RENT]: 'Cancelado',
	[DELETED_RENT]: 'Dado de baja',
}
