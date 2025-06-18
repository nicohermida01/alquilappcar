import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from '@heroui/react'
import { TriangleAlertIcon } from './icons/TriangleAlertIcon'
import { getFecha } from '../utils/getFecha'
import { useEffect, useState } from 'react'
import { formatAmount } from '../utils/formatAmount'

export function ModalConfirmCancelRent({
	isOpen,
	onOpenChange,
	rent,
	handleConfirm,
}) {
	const [refundAmount, setRefundAmount] = useState(0)

	useEffect(() => {
		if (isOpen && rent) {
			const amount =
				(rent.precio_total * rent.categoria_vehiculo.cancelacion.porcentaje) /
				100
			setRefundAmount(amount)
		}
	}, [isOpen, rent])

	return (
		<Modal isOpen={isOpen} onOpenChange={onOpenChange} size='xl'>
			<ModalContent>
				{onClose => (
					<>
						<ModalHeader>
							<div className='flex flex-col gap-1'>
								<div className='flex items-center gap-2 text-danger'>
									<TriangleAlertIcon />
									<h3>Confirmar cancelación</h3>
								</div>
								<p className='text-sm font-normal text-gray-500'>
									Alquiler #{rent.id}
								</p>
							</div>
						</ModalHeader>
						<ModalBody>
							<p>
								¿Estás seguro de que quieres cancelar el alquiler con fecha de
								inicio:{' '}
								<span className='font-bold'>
									{getFecha(rent.fecha_inicio)}hs
								</span>
								?
							</p>

							<p className='bg-danger-100 text-danger-500 p-2 rounded-md mt-4'>
								Según la política de cancelación de este alquiler, se hará un
								reembolso de{' '}
								<span className='font-bold'>${formatAmount(refundAmount)}</span>
							</p>
						</ModalBody>
						<ModalFooter>
							<div className='flex gap-2'>
								<Button onPress={onClose}>Cancelar</Button>
								<Button
									onPress={() => {
										onClose()
										handleConfirm(rent.id, refundAmount)
									}}
									color='danger'
								>
									Confirmar
								</Button>
							</div>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	)
}
