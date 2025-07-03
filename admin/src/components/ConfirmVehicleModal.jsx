import {
	addToast,
	Button,
	Checkbox,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Select,
	SelectItem,
} from '@heroui/react'
import { leasesApi } from '../api/leases.api'
import { vehiclesApi } from '../api/vehicles.api'
import { useEffect, useState } from 'react'
import { categoriesApi } from '../api/categories.api'

export function ConfirmVehicleModal({
	isOpen,
	onOpenChange,
	leaseId,
	onClose,
	refreshData,
	leaseSucursalRetiroId,
	startDate,
	endDate,
}) {
	const [vehicles, setVehicles] = useState([])
	const [selectedVehicle, setSelectedVehicle] = useState(null)
	const [otherCategory, setOtherCategory] = useState(false)
	const [categories, setCategories] = useState([])
	const [selectedCategory, setSelectedCategory] = useState(null)
	const [isVehiclesLoading, setIsVehiclesLoading] = useState(false)
	const [otherVehicles, setOtherVehicles] = useState([])
	const [selectedOtherVehicle, setSelectedOtherVehicle] = useState(null)

	const confirmVehicle = e => {
		e.preventDefault()

		// Validamos que la fecha en que se inicia el alquiler esté dentro del rango permitido (fecha de inicio y fin del alquiler)
		const dateNow = new Date()
		const startDateObj = new Date(startDate)
		const endDateObj = new Date(endDate)

		if (dateNow < startDateObj || dateNow > endDateObj) {
			// si la fecha actual es menor a la fecha de inicio o mayor a la fecha de fin, mostramos un error
			addToast({
				title: 'Error al iniciar el alquiler.',
				description:
					'La fecha de inicio debe estar dentro del rango permitido.',
				color: 'danger',
				duration: 4000,
			})

			return
		}

		// Verificamos si hay algun dia de retraso en iniciar el alquiler
		let isLate = false
		let daysDifference = 0
		if (dateNow > startDateObj) {
			// si la fecha actual es mayor a la fecha de inicio, significa que hay un retraso
			isLate = true
			daysDifference = Math.ceil(
				(dateNow - startDateObj) / (1000 * 60 * 60 * 24)
			)
		}

		// Actualizamos el alquiler con el vehículo seleccionado -> setear el vehiculo asignado y el estado a IN_PROGRESS_RENT
		// Actualizamos el estado del vehiculo elegido a available=false
		const vehicleId = otherCategory
			? Number(selectedOtherVehicle)
			: Number(selectedVehicle)

		leasesApi
			.confirmVehicle(leaseId, vehicleId)
			.then(() => {
				vehiclesApi
					.updateAvailableVehicle(vehicleId, false)
					.then(() => {
						addToast({
							title: isLate
								? `Alquiler #${leaseId} iniciado correctamente con un retraso de ${daysDifference} días.`
								: `Alquiler #${leaseId} iniciado correctamente.`,
							description: 'Vehículo asignado correctamente.',
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
		if (isOpen && otherCategory && selectedCategory) {
			setIsVehiclesLoading(true)
			setSelectedOtherVehicle(null)
			vehiclesApi
				.getBySucursalAndCategory(
					leaseSucursalRetiroId,
					Number(selectedCategory)
				)
				.then(res => {
					setOtherVehicles(res)
				})
				.catch(err => console.error(err))
				.finally(() => setIsVehiclesLoading(false))
		}
	}, [leaseSucursalRetiroId, otherCategory, selectedCategory, isOpen])

	useEffect(() => {
		if (isOpen) {
			vehiclesApi
				.getAvailablesVehicles(leaseId)
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
		}
	}, [isOpen, leaseId])

	return (
		<Modal isOpen={isOpen} onOpenChange={onOpenChange}>
			<ModalContent>
				{onClose => (
					<>
						<ModalHeader>Iniciar alquiler</ModalHeader>
						<ModalBody>
							<p>
								Para dar inicio al alquiler{' '}
								<span className='font-bold'>#{leaseId}</span> seleccione uno de
								los vehículos disponibles:
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
												<p className='font-bold'>{item.data.marca.nombre}</p>
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
												<p className='font-bold'>{vehicle.marca.nombre}</p>
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
														<p className='font-bold'>{vehicle.marca.nombre}</p>
														<p className='text-gray-600'>{`${vehicle.modelo} | ${vehicle.patente}`}</p>
													</div>
												</SelectItem>
											)}
										</Select>
									</div>
								)}
							</form>
						</ModalBody>
						<ModalFooter>
							<Button onPress={onClose} size='sm'>
								Cerrar
							</Button>
							<Button
								size='sm'
								color='success'
								type='submit'
								form='confirm-vehicle-form'
							>
								Confirmar vehículo
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	)
}
