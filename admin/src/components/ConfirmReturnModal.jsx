import {
	addToast,
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Select,
	SelectItem,
} from '@heroui/react'
import { useEffect, useState } from 'react'
import { subsidiariesApi } from '../api/subsidiaries.api'
import { leasesApi } from '../api/leases.api'
import { vehiclesApi } from '../api/vehicles.api'

export function ConfirmReturnModal({
	isOpen,
	onOpenChange,
	leaseId,
	leaseVehicleId,
	onClose,
	refreshData,
}) {
	const [sucursales, setSucursales] = useState([])
	const [selectedSucursal, setSelectedSucursal] = useState(null)

	const confirmReturn = e => {
		e.preventDefault()

		// Actualizamos el alquiler con el estado a FINISHED_RENT
		// Actualizamos el estado del vehiculo asignado a available=true y la sucursal donde se devolvió el vehículo

		leasesApi
			.confirmReturn(leaseId)
			.then(() => {
				vehiclesApi
					.updateReturnVehicle(leaseVehicleId, Number(selectedSucursal))
					.then(() => {
						addToast({
							title: `Alquiler #${leaseId} finalizado correctamente.`,
							description: `Vehículo devuelto correctamente.`,
							color: 'success',
							duration: 4000,
						})

						onClose()
						refreshData()
					})
					.catch(err => {
						console.error('Error al actualizar el vehículo', err)
						addToast({
							title: 'Error al actualizar el vehículo.',
							description:
								'No se pudo actualizar el vehículo, intente nuevamente.',
							color: 'danger',
							duration: 4000,
						})
					})
			})
			.catch(err => {
				console.error('Error al confirmar la devolución', err)
				addToast({
					title: 'Error al confirmar la devolución.',
					description:
						'No se pudo confirmar la devolución, intente nuevamente.',
					color: 'danger',
					duration: 4000,
				})
			})
	}

	useEffect(() => {
		if (isOpen) {
			subsidiariesApi
				.getSubsidiariesPopulated()
				.then(res => {
					setSucursales(res)
				})
				.catch(err => console.error(err))
		}
	}, [isOpen])

	return (
		<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
			<ModalContent>
				{onClose => (
					<>
						<ModalHeader>Confirmar devolución</ModalHeader>
						<ModalBody>
							<p>
								Para confirmar la finalización del alquiler{' '}
								<span className='font-bold'>#{leaseId}</span>, por favor
								seleccione la sucursal donde se devolvió el vehículo:
							</p>

							<form id='confirm-return-form' onSubmit={confirmReturn}>
								<Select
									label='Sucursal de devolución'
									isRequired
									selectedKeys={selectedSucursal}
									onSelectionChange={keys => {
										setSelectedSucursal(keys.currentKey)
									}}
								>
									{sucursales.map(s => {
										return (
											<SelectItem key={s.id}>
												{`${s.direccion}, ${s.localidad.nombre}`}
											</SelectItem>
										)
									})}
								</Select>
							</form>
						</ModalBody>
						<ModalFooter>
							<Button onPress={onClose} size='sm'>
								Cerrar
							</Button>
							<Button
								size='sm'
								color='secondary'
								type='submit'
								form='confirm-return-form'
							>
								Confirmar devolución
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	)
}
