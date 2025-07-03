import { Button, Chip, Divider, useDisclosure } from '@heroui/react'
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
import { CancelLeaseModal } from './CancelLeaseModal'
import { DeleteLeaseModal } from './DeleteLeaseModal'
import { ConfirmReturnModal } from './ConfirmReturnModal'
import { ConfirmVehicleModal } from './ConfirmVehicleModal'

const WarningContianer = ({ children }) => {
	return (
		<div className='bg-warning-100 border-1 border-warning-600 rounded-md p-4 text-sm text-warning-600 flex flex-col gap-2 mt-2'>
			{children}
		</div>
	)
}

const ItemText = ({ title, value }) => {
	return (
		<p className='text-sm'>
			<span className='font-bold'>{title}</span>: {value}
		</p>
	)
}

export function RentCard({ rentId, refreshTableFn }) {
	const [rent, setRent] = useState(null)
	const [refreshValue, setRefreshValue] = useState(0)

	const cancelLeaseModalController = useDisclosure()
	const deleteLeaseModalController = useDisclosure()
	const confirmReturnModalController = useDisclosure()
	const confirmVehicleModalController = useDisclosure()

	const refreshData = () => {
		setRefreshValue(prev => prev + 1)
		refreshTableFn()
	}

	useEffect(() => {
		leasesApi
			.getLeaseById(rentId)
			.then(data => {
				console.log('Alquiler obtenido:', data)
				setRent(data)
			})
			.catch(err => console.error(err))
	}, [rentId, refreshValue])

	if (!rent) {
		return <div>Cargando...</div>
	}

	return (
		<>
			<div className='bg-white w-[400px] p-4 shadow rounded-md'>
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
							<span className='font-bold'>Costo de la reserva:</span>
							<span>{`$${formatAmount(rent.precio_total)}`}</span>
						</p>

						{rent.reembolso !== '-1.00' && (
							<p className='text-sm flex justify-between  '>
								<span className='font-bold'>Monto devuelto:</span>
								<span>{`$${formatAmount(rent.reembolso)}`}</span>
							</p>
						)}
					</div>

					{rent.montoExtra !== '-1.00' && (
						<WarningContianer>
							<p>
								Este alquiler se devolvio con retraso. Se adicionó un monto
								extra de{' '}
								<span className='font-bold'>
									${formatAmount(rent.montoExtra)}
								</span>
							</p>
						</WarningContianer>
					)}

					{rent.montoDevuelto !== '-1.00' && (
						<WarningContianer>
							<p>
								Este alquiler se devolvio antes de la fecha pactada. Se realizó
								una devolución de{' '}
								<span className='font-bold'>
									${formatAmount(rent.montoDevuelto)}
								</span>
							</p>
						</WarningContianer>
					)}
				</div>
				<Divider className='my-4' />
				<div className='flex items-center gap-2 flex-wrap'>
					{rent.status === IN_PROGRESS_RENT && (
						<Button
							color='secondary'
							size='sm'
							onPress={() => confirmReturnModalController.onOpen()}
						>
							Confirmar devolución
						</Button>
					)}
					{rent.status === PENDING_RENT && (
						<>
							<Button
								color='success'
								size='sm'
								onPress={() => confirmVehicleModalController.onOpen()}
							>
								Iniciar
							</Button>
							<Button
								color='primary'
								size='sm'
								onPress={() => cancelLeaseModalController.onOpen()}
							>
								Cancelar alquiler
							</Button>
						</>
					)}
					{(rent.status === CANCELLED_RENT ||
						rent.status === FINISHED_RENT) && (
						<Button
							color='danger'
							size='sm'
							onPress={() => deleteLeaseModalController.onOpen()}
						>
							Dar de baja
						</Button>
					)}
				</div>
			</div>

			<CancelLeaseModal
				isOpen={cancelLeaseModalController.isOpen}
				onOpenChange={cancelLeaseModalController.onOpenChange}
				leaseId={rent.id}
				leaseAmount={rent.precio_total}
				leaseCategoryPercentage={rent.categoria_vehiculo.cancelacion.porcentaje}
				onClose={cancelLeaseModalController.onClose}
				refreshData={refreshData}
			/>

			<DeleteLeaseModal
				isOpen={deleteLeaseModalController.isOpen}
				onOpenChange={deleteLeaseModalController.onOpenChange}
				leaseId={rent.id}
				onClose={deleteLeaseModalController.onClose}
				refreshData={refreshData}
			/>

			<ConfirmReturnModal
				isOpen={confirmReturnModalController.isOpen}
				onOpenChange={confirmReturnModalController.onOpenChange}
				leaseId={rent.id}
				leaseVehicleId={rent.vehiculo_asignado?.id}
				onClose={confirmReturnModalController.onClose}
				refreshData={refreshData}
				returnDate={rent.fecha_devolucion}
				pricePerDay={rent.categoria_vehiculo.precio}
			/>

			<ConfirmVehicleModal
				isOpen={confirmVehicleModalController.isOpen}
				onOpenChange={confirmVehicleModalController.onOpenChange}
				leaseId={rent.id}
				leaseSucursalRetiroId={rent.sucursal_retiro?.id}
				onClose={confirmVehicleModalController.onClose}
				refreshData={refreshData}
			/>
		</>
	)
}
