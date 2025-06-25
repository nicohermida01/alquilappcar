import {
	addToast,
	Button,
	Checkbox,
	Chip,
	Divider,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Select,
	SelectItem,
	useDisclosure,
} from '@heroui/react'
import {
	CANCELLED_RENT,
	FINISHED_RENT,
	IN_PROGRESS_RENT,
	PENDING_RENT,
	STATUS_CHIP_COLORS,
	STATUS_TEXT,
	STATUS_TEXT_COLOR,
} from '../constants/rentStatus'
import { useEffect, useState } from 'react'
import { formatAmount } from '../utils/formatAmount'
import { getFormattedDate } from '../utils/getFecha'
import { leasesApi } from '../api/leases.api'
import { vehiclesApi } from '../api/vehicles.api'
import { categoriesApi } from '../api/categories.api'
import { subsidiariesApi } from '../api/subsidiaries.api'

const ItemText = ({ title, value }) => {
	return (
		<p className='text-sm'>
			<span className='font-bold'>{title}</span>: {value}
		</p>
	)
}

const CONFIRM_RETURN_MODAL_TYPE = 'CONFIRM_RETURN'
const CONFIRM_VEHICLE_MODAL_TYPE = 'CONFIRM_VEHICLE'
const CANCEL_RENT_MODAL_TYPE = 'CANCEL_RENT'
const DELETE_RENT_MODAL_TYPE = 'DELETE_RENT'

export function RentCard({ rentId, refreshTableFn }) {
	const [rent, setRent] = useState(null)
	const [refreshValue, setRefreshValue] = useState(0)

	const modalActionHandler = useDisclosure()
	const [modalActionTitle, setModalActionTitle] = useState('')
	const [modalActionType, setModalActionType] = useState(null)
	const [refundAmount, setRefundAmount] = useState(0)
	const [vehicles, setVehicles] = useState([])
	const [selectedVehicle, setSelectedVehicle] = useState(null)
	const [otherCategory, setOtherCategory] = useState(false)
	const [categories, setCategories] = useState([])
	const [selectedCategory, setSelectedCategory] = useState(null)
	const [isVehiclesLoading, setIsVehiclesLoading] = useState(false)
	const [otherVehicles, setOtherVehicles] = useState([])
	const [selectedOtherVehicle, setSelectedOtherVehicle] = useState(null)
	const [sucursales, setSucursales] = useState([])
	const [selectedSucursal, setSelectedSucursal] = useState(null)

	console.log(rent)

	const handleCancel = () => {
		setModalActionTitle('Cancelar alquiler')
		setModalActionType(CANCEL_RENT_MODAL_TYPE)
		const amount =
			(rent.precio_total * rent.categoria_vehiculo.cancelacion.porcentaje) / 100
		setRefundAmount(amount)
		modalActionHandler.onOpen()
	}

	const handleDelete = () => {
		setModalActionTitle('Dar de baja')
		setModalActionType(DELETE_RENT_MODAL_TYPE)
		modalActionHandler.onOpen()
	}

	const handleConfirmReturn = () => {
		setModalActionTitle('Confirmar devolución')
		setModalActionType(CONFIRM_RETURN_MODAL_TYPE)
		subsidiariesApi
			.getSubsidiariesPopulated()
			.then(res => {
				setSucursales(res)
			})
			.catch(err => console.error(err))
		modalActionHandler.onOpen()
	}

	const handleConfirmVehicle = () => {
		setModalActionTitle('Iniciar alquiler')
		setModalActionType(CONFIRM_VEHICLE_MODAL_TYPE)
		vehiclesApi
			.getAvailablesVehicles(rent.id)
			.then(res => {
				setVehicles(res)
			})
			.catch(err => console.error(err))

		categoriesApi
			.getAllCategories()
			.then(res => {
				setCategories(res)
			})
			.catch(err => console.error(err))

		modalActionHandler.onOpen()
	}

	const confirmCancel = () => {
		leasesApi
			.cancelLease(rent.id, refundAmount)
			.then(() => {
				addToast({
					title: `Reserva #${rent.id} cancelada correctamente.`,
					variant: 'bordered',
					description: `Se han devuelto $${formatAmount(refundAmount)}`,
					color: 'success',
					duration: 4000,
				})

				modalActionHandler.onClose()
				setRefreshValue(prev => prev + 1) // Esto genera que se ejecute el useEffect y se actualice el alquiler
				refreshTableFn()
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

	const confirmDelete = () => {
		leasesApi
			.deleteLease(rent.id)
			.then(() => {
				addToast({
					title: `Reserva #${rent.id} eliminada correctamente.`,
					description: 'El alquiler ha sido dado de baja correctamente.',
					color: 'success',
					duration: 4000,
				})

				modalActionHandler.onClose()
				setRefreshValue(prev => prev + 1)
				refreshTableFn()
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

	const confirmReturn = e => {
		e.preventDefault()

		// Actualizamos el alquiler con el estado a FINISHED_RENT
		// Actualizamos el estado del vehiculo asignado a available=true y la sucursal donde se devolvió el vehículo

		leasesApi
			.confirmReturn(rent.id)
			.then(() => {
				vehiclesApi
					.updateReturnVehicle(
						rent.vehiculo_asignado.id,
						Number(selectedSucursal)
					)
					.then(() => {
						addToast({
							title: `Alquiler #${rent.id} finalizado correctamente.`,
							description: `Vehículo devuelto correctamente.`,
							color: 'success',
							duration: 4000,
						})

						modalActionHandler.onClose()
						setRefreshValue(prev => prev + 1)
						refreshTableFn()
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

	const confirmVehicle = e => {
		e.preventDefault()

		// Actualizamos el alquiler con el vehículo seleccionado -> setear el vehiculo asignado y el estado a IN_PROGRESS_RENT
		// Actualizamos el estado del vehiculo elegido a available=false

		const vehicleId = otherCategory
			? Number(selectedOtherVehicle)
			: Number(selectedVehicle)

		leasesApi
			.confirmVehicle(rent.id, vehicleId)
			.then(() => {
				vehiclesApi
					.updateAvailableVehicle(vehicleId, false)
					.then(() => {
						addToast({
							title: `Alquiler #${rent.id} iniciado correctamente.`,
							description: `Vehículo asignado correctamente.`,
							color: 'success',
							duration: 4000,
						})

						modalActionHandler.onClose()
						setRefreshValue(prev => prev + 1)
						refreshTableFn()
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
				console.error('Error al confirmar el vehículo', err)
				addToast({
					title: 'Error al confirmar el vehículo.',
					description: 'No se pudo confirmar el vehículo, intente nuevamente.',
					color: 'danger',
					duration: 4000,
				})
			})
	}

	useEffect(() => {
		leasesApi
			.getLeaseById(rentId)
			.then(data => {
				setRent(data)
			})
			.catch(err => console.error(err))
	}, [rentId, refreshValue])

	useEffect(() => {
		if (otherCategory && selectedCategory) {
			setIsVehiclesLoading(true)
			setSelectedOtherVehicle(null)
			vehiclesApi
				.getBySucursalAndCategory(
					rent.sucursal_retiro.id,
					Number(selectedCategory)
				)
				.then(res => {
					setOtherVehicles(res)
				})
				.catch(err => console.error(err))
				.finally(() => setIsVehiclesLoading(false))
		}
	}, [selectedCategory, otherCategory, rent])

	if (!rent) {
		return <div>Cargando...</div>
	}

	return (
		<>
			<div className='bg-white w-max  p-4 shadow rounded-md'>
				<div className='flex items-center justify-between'>
					<h3 className='font-bold'>Alquiler #{rent.id}</h3>
					<Chip color={STATUS_CHIP_COLORS[rent.status]} size='sm'>
						<span className={STATUS_TEXT_COLOR[rent.status]}>
							Estado: {STATUS_TEXT[rent.status]}
						</span>
					</Chip>
				</div>
				<Divider className='my-4' />
				<div>
					<ItemText title='Cliente' value={`${rent.cliente.email}`} />
					<ItemText
						title='Fecha de registro'
						value={`${getFormattedDate(rent.fecha_registro)}`}
					/>
					<ItemText
						title='Fecha de inicio'
						value={`${getFormattedDate(rent.fecha_inicio)}`}
					/>
					<ItemText
						title='Fecha de devolución'
						value={`${getFormattedDate(rent.fecha_devolucion)}`}
					/>
					<ItemText
						title='Categoría elegida'
						value={rent.categoria_vehiculo.nombre}
					/>
					<ItemText title='Politica de cancelación' value='' />
					<p className='text-sm bg-gray-100 text-gray-600 p-1 mb-1 rounded-md flex items-center justify-between'>
						<span>{rent.categoria_vehiculo.cancelacion.descripcion}</span>
						<span>
							{Number(rent.categoria_vehiculo.cancelacion.porcentaje)}%
						</span>
					</p>
					{rent.vehiculo_asignado ? (
						<>
							<ItemText title='Vehiculo asignado' value='' />
							<div className='text-sm bg-gray-100 p-1 mb-1 rounded-md'>
								<p className='font-bold flex items-center justify-between'>
									{rent.vehiculo_asignado.marca.nombre}{' '}
									<span className='text-gray-600 text-xs mr-1'>
										{rent.vehiculo_asignado.categoria.nombre}
									</span>
								</p>
								<p className='text-gray-600'>{`${rent.vehiculo_asignado.modelo} | ${rent.vehiculo_asignado.patente}`}</p>
							</div>
						</>
					) : (
						<ItemText title='Vehículo' value='Sin confirmar' />
					)}

					<ItemText
						title='Sucursal de retiro'
						value={`${rent.sucursal_retiro.direccion}, ${rent.sucursal_retiro.localidad.nombre}`}
					/>
					{rent.paquetealquiler_set.length > 0 && (
						<div>
							<p className='text-sm font-bold'>Paquetes extra:</p>
							<div className='flex flex-col gap-1 mt-1'>
								{rent.paquetealquiler_set.map((pkg, idx) => (
									<p
										key={idx}
										className='text-sm bg-gray-100 text-gray-600 p-1 rounded-md'
									>
										<span className='font-semibold'>
											{pkg.paquete.nombre} - ${formatAmount(pkg.paquete.costo)}
										</span>
										<br />
										{pkg.paquete.descripcion}
									</p>
								))}
							</div>
						</div>
					)}
					<div className='mt-4'>
						<p className='text-sm flex justify-between  '>
							<span className='font-bold'>Precio total:</span>
							<span>{`$${formatAmount(rent.precio_total)}`}</span>
						</p>

						{rent.reembolso !== '-1.00' && (
							<p className='text-sm flex justify-between  '>
								<span className='font-bold'>Monto devuelto:</span>
								<span>{`$${formatAmount(rent.reembolso)}`}</span>
							</p>
						)}
					</div>
				</div>
				<Divider className='my-4' />
				<div className='flex items-center gap-2 flex-wrap'>
					{rent.status === IN_PROGRESS_RENT && (
						<Button color='secondary' size='sm' onPress={handleConfirmReturn}>
							Confirmar devolución
						</Button>
					)}
					{rent.status === PENDING_RENT && (
						<>
							<Button color='success' size='sm' onPress={handleConfirmVehicle}>
								Iniciar
							</Button>
							<Button color='primary' size='sm' onPress={handleCancel}>
								Cancelar alquiler
							</Button>
						</>
					)}
					{(rent.status === CANCELLED_RENT ||
						rent.status === FINISHED_RENT) && (
						<Button color='danger' size='sm' onPress={handleDelete}>
							Dar de baja
						</Button>
					)}
				</div>
			</div>

			<Modal
				isOpen={modalActionHandler.isOpen}
				onOpenChange={modalActionHandler.onOpenChange}
			>
				<ModalContent>
					{onClose => (
						<>
							<ModalHeader>{modalActionTitle}</ModalHeader>
							<ModalBody>
								{modalActionType === CANCEL_RENT_MODAL_TYPE && (
									<>
										<p>
											¿Estás seguro de que quieres cancelar el alquiler{' '}
											<span className='font-bold'>#{rent.id}</span>?
										</p>
										<p className='bg-danger-100 text-danger-500 p-2 rounded-md mt-4'>
											Según la política de cancelación de este alquiler, se hará
											un reembolso de{' '}
											<span className='font-bold'>
												${formatAmount(refundAmount)}
											</span>
										</p>
									</>
								)}
								{modalActionType === DELETE_RENT_MODAL_TYPE && (
									<>
										<p>
											¿Estás seguro de que quieres dar de baja el alquiler{' '}
											<span className='font-bold'>#{rent.id}</span>?
										</p>
									</>
								)}
								{modalActionType === CONFIRM_VEHICLE_MODAL_TYPE && (
									<>
										<p>
											Para iniciar el alquiler{' '}
											<span className='font-bold'>#{rent.id}</span> seleccione
											uno de los vehículos disponibles:
										</p>

										<form id='confirm-vehicle-form' onSubmit={confirmVehicle}>
											<Select
												placeholder='Seleccione un vehículo'
												aria-label='Vehículo'
												isRequired={!otherCategory}
												disabled={otherCategory}
												selectedKeys={selectedVehicle}
												onSelectionChange={keys => {
													setSelectedVehicle(keys.currentKey)
												}}
												items={vehicles}
												renderValue={items => {
													return items.map(item => (
														<div className='flex flex-col' key={item.key}>
															<p className='font-bold'>
																{item.data.marca.nombre}
															</p>
															<p className='text-gray-600'>{`${item.data.modelo} | ${item.data.patente}`}</p>
														</div>
													))
												}}
											>
												{vehicle => (
													<SelectItem
														key={vehicle.id}
														textValue={`${vehicle.marca.nombre} - ${vehicle.modelo} - ${vehicle.patente}`}
													>
														<div className='flex flex-col'>
															<p className='font-bold'>
																{vehicle.marca.nombre}
															</p>
															<p className='text-gray-600'>{`${vehicle.modelo} | ${vehicle.patente}`}</p>
														</div>
													</SelectItem>
												)}
											</Select>
											{vehicles.length === 0 && (
												<>
													<p className='text-xs text-danger-500 mt-2'>
														No hay vehículos disponibles para este alquiler.
													</p>
													<Checkbox
														size='sm'
														isSelected={otherCategory}
														onValueChange={setOtherCategory}
													>
														Seleccionar de otra categoria
													</Checkbox>
												</>
											)}
											{otherCategory && (
												<div className='mt-2 flex flex-col gap-2'>
													<Select
														placeholder='Seleccione una categoría'
														aria-label='Categoría'
														isRequired={otherCategory}
														selectedKeys={selectedCategory}
														onSelectionChange={keys => {
															setSelectedCategory(keys.currentKey)
														}}
													>
														{categories.map(c => (
															<SelectItem key={c.id}>{c.nombre}</SelectItem>
														))}
													</Select>

													<Select
														placeholder='Seleccione un vehículo'
														aria-label='Vehículo'
														isRequired={otherCategory}
														isLoading={isVehiclesLoading}
														selectedKeys={selectedOtherVehicle}
														onSelectionChange={keys => {
															setSelectedOtherVehicle(keys.currentKey)
														}}
														items={otherVehicles}
														renderValue={items => {
															return items.map(item => (
																<div className='flex flex-col' key={item.key}>
																	<p className='font-bold'>
																		{item.data.marca.nombre}
																	</p>
																	<p className='text-gray-600'>{`${item.data.modelo} | ${item.data.patente}`}</p>
																</div>
															))
														}}
													>
														{vehicle => (
															<SelectItem
																key={vehicle.id}
																textValue={`${vehicle.marca.nombre} - ${vehicle.modelo} - ${vehicle.patente}`}
															>
																<div className='flex flex-col'>
																	<p className='font-bold'>
																		{vehicle.marca.nombre}
																	</p>
																	<p className='text-gray-600'>{`${vehicle.modelo} | ${vehicle.patente}`}</p>
																</div>
															</SelectItem>
														)}
													</Select>
												</div>
											)}
										</form>
									</>
								)}
								{modalActionType === CONFIRM_RETURN_MODAL_TYPE && (
									<>
										<p>
											Para confirmar la finalización del alquiler{' '}
											<span className='font-bold'>#{rent.id}</span>, por favor
											seleccione la sucursal donde se devolvio el vehículo:
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
									</>
								)}
							</ModalBody>
							<ModalFooter>
								<Button onPress={onClose} size='sm'>
									Cerrar
								</Button>
								{modalActionType === CANCEL_RENT_MODAL_TYPE && (
									<Button size='sm' color='primary' onPress={confirmCancel}>
										Confirmar cancelación
									</Button>
								)}
								{modalActionType === DELETE_RENT_MODAL_TYPE && (
									<Button size='sm' color='danger' onPress={confirmDelete}>
										Confirmar baja
									</Button>
								)}
								{modalActionType === CONFIRM_VEHICLE_MODAL_TYPE && (
									<Button
										size='sm'
										color='success'
										type='submit'
										form='confirm-vehicle-form'
									>
										Confirmar vehículo
									</Button>
								)}
								{modalActionType === CONFIRM_RETURN_MODAL_TYPE && (
									<Button
										size='sm'
										color='secondary'
										type='submit'
										form='confirm-return-form'
									>
										Confirmar devolución
									</Button>
								)}
							</ModalFooter>
						</>
					)}
				</ModalContent>
			</Modal>
		</>
	)
}
