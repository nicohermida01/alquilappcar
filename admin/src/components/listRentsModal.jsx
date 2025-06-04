import {
	addToast,
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
} from '@heroui/react'
import { useEffect, useState } from 'react'
import { clientApi } from '../api/client.api'
import { rentApi } from '../api/rent.api'

const opcionesFecha = {
	day: '2-digit',
	month: '2-digit',
	year: 'numeric',
	hour: '2-digit',
	minute: '2-digit',
	hour12: false,
	timeZone: 'America/Argentina/Buenos_Aires',
}

const RentValue = ({ clave, valor }) => {
	return (
		<p>
			<span className='font-semibold'>{clave}:</span>{' '}
			<span className='text-sm'>{valor}</span>
		</p>
	)
}

export function ListRentsModal({ isOpen, onOpenChange, client }) {
	const [rents, setRents] = useState([])

	useEffect(() => {
		// fetch rents for the client when the modal opens
		if (client) {
			clientApi
				.getAlquileresByUserId(client.id)
				.then(res => {
					setRents(res)
				})
				.catch(error => {
					console.error('Error fetching rents:', error)
				})
		}
	}, [client])

	const handleCancelRent = rent => {
		rentApi
			.cancel(rent.id)
			.then(() => {
				setRents(prevRents => prevRents.filter(r => r.id !== rent.id))

				const refundAmount =
					(rent.precio_total * rent.categoria_vehiculo.cancelacion.porcentaje) /
					100

				addToast({
					title: `Reserva cancelada correctamente.`,
					variant: 'bordered',
					description: `Se han devuelto $${refundAmount}`,
					color: 'success',
					duration: 4000,
				})
			})
			.catch(error => {
				addToast({
					title: 'Error al dar de baja la reserva.',
					description: 'No se pudo cancelar la reserva, intente nuevamente.',
					color: 'danger',
					duration: 4000,
				})
				console.error('Error canceling rent:', error)
			})
	}

	return (
		<Modal isOpen={isOpen} onOpenChange={onOpenChange} size='4xl'>
			<ModalContent>
				{onClose => (
					<>
						<ModalHeader className='flex flex-col gap-1'>
							{`Alquileres de ${client.nombre} ${client.apellido}`}
						</ModalHeader>
						<ModalBody className='max-h-[400px] overflow-y-auto'>
							{rents.length > 0 && (
								<div className='flex flex-col gap-4'>
									{rents.map(rent => {
										const fechaInicio = new Date(rent.fecha_inicio)
										const fechaDevolucion = new Date(rent.fecha_devolucion)
										const canCancel = fechaInicio > new Date()

										return (
											<div
												key={rent.id}
												className='flex flex-col gap-1 border-1 border-primary rounded-lg p-4 relative'
											>
												{canCancel && (
													<div className='absolute right-4'>
														<Button
															color='primary'
															size='sm'
															onPress={() => handleCancelRent(rent)}
														>
															Cancelar reserva
														</Button>
													</div>
												)}

												<RentValue
													clave='Fecha de Inicio'
													valor={fechaInicio.toLocaleString(
														'es-AR',
														opcionesFecha
													)}
												/>
												<RentValue
													clave='Fecha de devolución'
													valor={fechaDevolucion.toLocaleString(
														'es-AR',
														opcionesFecha
													)}
												/>
												<RentValue clave='Precio' valor={rent.precio_total} />
												<RentValue
													clave='Sucursal de retiro'
													valor={`${rent.sucursal_retiro.localidad.nombre} - ${rent.sucursal_retiro.direccion}`}
												/>
												<RentValue
													clave='Categoria'
													valor={rent.categoria_vehiculo.nombre}
												/>
												<RentValue
													clave='Vehiculo asignado'
													valor={rent.vehiculo_asignado || 'Sin asignar'}
												/>
												<div className='flex gap-1'>
													<p className='font-semibold'>Paquetes adicionales:</p>
													{rent.paquetealquiler_set.length > 0 && (
														<div>
															{rent.paquetealquiler_set.map((elem, index) => {
																return (
																	<p key={index} className='text-sm'>
																		{elem.paquete.nombre} -{' '}
																		{elem.paquete.descripcion}
																	</p>
																)
															})}
														</div>
													)}
													{rent.paquetealquiler_set.length === 0 && (
														<p className='text-sm'>
															No hay paquetes adicionales.
														</p>
													)}
												</div>
											</div>
										)
									})}
								</div>
							)}
							{rents.length === 0 && 'Este cliente no tiene alquileres.'}
						</ModalBody>
						<ModalFooter>
							<Button color='danger' variant='light' onPress={onClose}>
								Close
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	)
}
