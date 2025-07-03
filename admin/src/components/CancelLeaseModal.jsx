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
import { useEffect, useState } from 'react'

export function CancelLeaseModal({
	isOpen,
	onOpenChange,
	leaseId,
	leaseAmount,
	leaseCategoryPercentage,
	onClose,
	refreshData,
}) {
	const [refundAmount, setRefundAmount] = useState(0)

	const confirmCancel = () => {
		leasesApi
			.cancelLease(leaseId, refundAmount)
			.then(() => {
				addToast({
					title: `Reserva #${leaseId} cancelada correctamente.`,
					variant: 'bordered',
					description: `Se han devuelto $${formatAmount(refundAmount)}`,
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

	useEffect(() => {
		if (isOpen) {
			const amount = (leaseAmount * leaseCategoryPercentage) / 100
			setRefundAmount(amount)
		}
	}, [isOpen, leaseAmount, leaseCategoryPercentage])

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
								Según la política de cancelación de este alquiler, se hará un
								reembolso de{' '}
								<span className='font-bold'>${formatAmount(refundAmount)}</span>
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
