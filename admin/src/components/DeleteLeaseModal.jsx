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

export function DeleteLeaseModal({
	isOpen,
	onOpenChange,
	leaseId,
	onClose,
	refreshData,
}) {
	const confirmDelete = () => {
		leasesApi
			.deleteLease(leaseId)
			.then(() => {
				addToast({
					title: `Reserva #${leaseId} eliminada correctamente.`,
					description: 'El alquiler ha sido dado de baja correctamente.',
					color: 'success',
					duration: 4000,
				})

				onClose()
				refreshData()
			})
			.catch(err => {
				console.error('Error al dar de baja el alquiler', err)
				addToast({
					title: 'Error al eliminar el alquiler.',
					description: 'No se pudo eliminar el alquiler, intente nuevamente.',
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
						<ModalHeader>Dar de baja</ModalHeader>
						<ModalBody>
							<p>
								¿Estás seguro de que quieres dar de baja el alquiler{' '}
								<span className='font-bold'>#{leaseId}</span>?
							</p>
							<p>El cliente no podrá ver más este alquiler en su perfil.</p>
						</ModalBody>
						<ModalFooter>
							<Button onPress={onClose} size='sm'>
								Cerrar
							</Button>
							<Button size='sm' color='danger' onPress={confirmDelete}>
								Confirmar baja
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	)
}
