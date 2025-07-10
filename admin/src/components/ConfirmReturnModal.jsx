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
import { TriangleAlertIcon } from './icons/TriangleAlertIcon'
import { getFormattedDate } from '../utils/getFecha'
import { formatAmount } from '../utils/formatAmount'

const WarningContianer = ({ children }) => {
	return (
		<div className='bg-warning-100 border-1 border-warning-600 rounded-md p-4 text-sm text-warning-600 flex flex-col gap-2'>
			{children}
		</div>
	)
}

const leasesApiErrorToastConfig = {
	title: 'Error al confirmar la devolución.',
	description: 'No se pudo confirmar la devolución, intente nuevamente.',
	color: 'danger',
	duration: 4000,
}

const vehiclesApiErrorToastConfig = {
	title: 'Error al actualizar el vehículo.',
	description: 'No se pudo actualizar el vehículo, intente nuevamente.',
	color: 'danger',
	duration: 4000,
}

export function ConfirmReturnModal({
	isOpen,
	onOpenChange,
	leaseId,
	leaseVehicleId,
	returnDate,
	onClose,
	refreshData,
	pricePerDay,
}) {
	const [sucursales, setSucursales] = useState([])
	const [selectedSucursal, setSelectedSucursal] = useState(null)
	const [returnAfter, setReturnAfter] = useState(false)
	const [returnBefore, setReturnBefore] = useState(false)
	const [unusedDays, setUnusedDays] = useState(0)
	const [auxAmount, setAuxAmount] = useState(0)
	const [extraDays, setExtraDays] = useState(0)

	const confirmAfterReturn = () => {
		leasesApi
			.confirmAfterReturn(leaseId, auxAmount)
			.then(() => {
				vehiclesApi
					.updateReturnVehicle(leaseVehicleId, Number(selectedSucursal))
					.then(() => {
						addToast({
							title: `Alquiler #${leaseId} finalizado correctamente.`,
							description: `Se debe abonar en la sucursal $${formatAmount(
								auxAmount
							)}`,
							color: 'success',
							duration: 4000,
						})

						onClose()
						refreshData()
					})
					.catch(err => {
						console.error('Error al actualizar el vehículo', err)
						addToast(vehiclesApiErrorToastConfig)
					})
			})
			.catch(err => {
				console.error(
					'confirmAfterReturn | Error al confirmar la devolución',
					err
				)
				addToast(leasesApiErrorToastConfig)
			})
	}

	const confirmBeforeReturn = () => {
		leasesApi
			.confirmBeforeReturn(leaseId, auxAmount)
			.then(() => {
				vehiclesApi
					.updateReturnVehicle(leaseVehicleId, Number(selectedSucursal))
					.then(() => {
						addToast({
							title: `Alquiler #${leaseId} finalizado correctamente.`,
							description: `Se han devuelto $${formatAmount(auxAmount)}`,
							color: 'success',
							duration: 4000,
						})

						onClose()
						refreshData()
					})
					.catch(err => {
						console.error('Error al actualizar el vehículo', err)
						addToast(vehiclesApiErrorToastConfig)
					})
			})
			.catch(err => {
				console.error(
					'confirmBeforeReturn | Error al confirmar la devolución',
					err
				)
				addToast(leasesApiErrorToastConfig)
			})
	}

	const confirmReturn = e => {
		e.preventDefault()

		// 1. Actualizamos el alquiler con el estado a FINISHED_RENT
		// 1.a Si el alquiler se devuelve después de la fecha de devolución, actualizamos el campo "montoExtra" con el monto adicional
		// 1.b Si el alquiler se devuelve antes de la fecha de devolución, actualizamos el campo "montoDevuelto" con el monto a devolver
		// 2. Actualizamos el estado del vehiculo asignado a available=true y la sucursal donde se devolvió el vehículo

		if (returnAfter) confirmAfterReturn()
		else if (returnBefore) confirmBeforeReturn()
		else {
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
							addToast(vehiclesApiErrorToastConfig)
						})
				})
				.catch(err => {
					console.error('Error al confirmar la devolución', err)
					addToast(leasesApiErrorToastConfig)
				})
		}
	}

	useEffect(() => {
		if (isOpen) {
			subsidiariesApi
				.getActiveSubsidiariesPopulated()
				.then(res => {
					setSucursales(res)
				})
				.catch(err => console.error(err))

			const now = new Date()
			const returnDateObj = new Date(returnDate)
      // console.log(now.getTime(), returnDateObj.getTime(),'FECHAS')
      
      const sameDay =
      now.getFullYear() === returnDateObj.getFullYear() &&
      now.getMonth() === returnDateObj.getMonth() &&
      now.getDate() === returnDateObj.getDate();

      if (!sameDay) {
        if (returnDateObj.getTime() < now.getTime()) {
          // El alquiler se está devolviendo después de la fecha de devolución, es decir, con retraso
          setReturnAfter(true)

          // calcular monto adicional
          const extraDays = Math.ceil(
            (now - returnDateObj) / (1000 * 60 * 60 * 24)
          )
          setExtraDays(extraDays)
          setAuxAmount(extraDays * pricePerDay)
        } else if (returnDateObj > now) {
          // El alquiler se está devolviendo antes de la fecha de devolución
          setReturnBefore(true)

          // calcular monto a devolver (dias no utilizados * precio diario)
          const unusedDays = Math.ceil(
            (returnDateObj - now) / (1000 * 60 * 60 * 24)
          )
          setUnusedDays(unusedDays)
          setAuxAmount(unusedDays * pricePerDay)
        }
      }
		}
	}, [isOpen, returnDate, pricePerDay])

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

							{returnAfter && (
								<WarningContianer>
									<p>
										<TriangleAlertIcon className='inline mr-1' />
										El <span className='font-bold'>
											alquiler #{leaseId}
										</span>{' '}
										está atrasado por{' '}
										<span className='font-bold'>{extraDays}</span> días.
									</p>

									<p>
										Se debe pagar un monto adicional correspondiente a los dias
										extra.
									</p>

									<p>
										Monto adicional:{' '}
										<span className='font-bold'>
											${formatAmount(auxAmount)}
										</span>
									</p>
								</WarningContianer>
							)}

							{returnBefore && (
								<WarningContianer>
									<p>
										<TriangleAlertIcon className='inline mr-1' />
										El <span className='font-bold'>alquiler #{leaseId}</span> se
										está devolviendo{' '}
										<span className='font-bold'>{unusedDays}</span> días antes
										de la fecha de devolución establecida:{' '}
										<span className='font-bold'>
											{getFormattedDate(returnDate)}
										</span>
									</p>

									<p>
										Se devolverá un monto correspondiente a los días no
										utilizados.
									</p>

									<p>
										Monto a devolver:{' '}
										<span className='font-bold'>
											${formatAmount(auxAmount)}
										</span>
									</p>
								</WarningContianer>
							)}
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
