import {
	addToast,
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from '@heroui/react'
import { leasesApi } from '../api/leases.api'
import { formatAmount } from '../utils/formatAmount'

export function CancelLeaseModal({
	isOpen,
	onOpenChange,
	leaseId,
	leaseAmount,
	onClose,
	refreshData,
}) {
	const confirmCancel = () => {
		leasesApi
			.cancelLease(leaseId, leaseAmount)
			.then(() => {
				addToast({
					title: `Reserva #${leaseId} cancelada correctamente.`,
					variant: 'bordered',
					description: `Se han devuelto $${formatAmount(leaseAmount)}`,
					color: 'success',
					duration: 4000,
				})

				onClose()
				refreshData()
			})
			.catch(err => {
				console.error('Error al cancelar el alquiler', err)
				addToast({
					title: 'Error al cancelar el alquiler.',
					description: 'No se pudo cancelar el alquiler, intente nuevamente.',
					color: 'danger',
					duration: 4000,
				})
			})
	}

	return (
		<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
			<ModalContent>
				{onClose => (
					<>
						<ModalHeader>Cancelar alquiler</ModalHeader>
						<ModalBody>
							<p>
								¿Estás seguro de que quieres cancelar el alquiler{' '}
								<span className='font-bold'>#{leaseId}</span>?
							</p>
							<p className='bg-danger-100 text-danger-500 p-2 rounded-md mt-4'>
								Se realizará un reembolso del{' '}
								<span className='font-bold'>100%</span> del costo total de
								reserva.
							</p>
						</ModalBody>
						<ModalFooter>
							<Button onPress={onClose} size='sm'>
								Cerrar
							</Button>
							<Button size='sm' color='primary' onPress={confirmCancel}>
								Confirmar cancelación
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	)
}
