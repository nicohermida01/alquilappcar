import { Button, Chip, Divider } from '@heroui/react'
import {
	CANCELLED_RENT,
	DELETED_RENT,
	FINISHED_RENT,
	IN_PROGRESS_RENT,
	PENDING_RENT,
	STATUS_CHIP_COLORS,
	STATUS_TEXT,
	STATUS_TEXT_COLOR,
} from '../constants/rentStatus'
import { useEffect, useState } from 'react'
import { formatAmount } from '../utils/formatAmount'

const ItemText = ({ title, value }) => {
	return (
		<p className='text-sm'>
			<span className='font-bold'>{title}</span>: {value}
		</p>
	)
}

export function RentCard({
	startDate,
	status,
	category,
	endDate,
	amount,
	vehicle,
	withdrawalSubsidiary,
	id,
	extraPackages = [],
	cancelFunction,
	refundAmount,
}) {
	const [title, setTitle] = useState('')
	const statusChipColor = STATUS_CHIP_COLORS[status]
	const statusTextColor = STATUS_TEXT_COLOR[status]
	const statusText = STATUS_TEXT[status]

	useEffect(() => {
		switch (status) {
			case PENDING_RENT:
				setTitle(`Alquiler para el día ${startDate}hs`)
				break

			case IN_PROGRESS_RENT:
				setTitle(`Alquiler iniciado el día ${startDate}hs`)
				break

			case FINISHED_RENT:
				setTitle(`Alquiler del día ${startDate}hs`)
				break

			case CANCELLED_RENT:
				setTitle(`Alquiler del día ${startDate}hs`)
				break

			case DELETED_RENT:
				setTitle(`Alquiler del día ${startDate}hs`)
				break

			default:
				break
		}
	}, [startDate, status])

	return (
		<div className='bg-white w-max h-[474px] p-4 shadow rounded-md'>
			<div>
				<h3 className='font-bold'>{title}</h3>
				<div className='flex items-center gap-2 mt-1'>
					<Chip color={statusChipColor} size='sm'>
						<span className={statusTextColor}>Estado: {statusText}</span>
					</Chip>
					<p className='text-sm text-gray-500'># {id}</p>
				</div>
			</div>
			<Divider className='my-4' />
			<div>
				<ItemText title='Categoría' value={category} />
				<ItemText title='Vehículo' value={vehicle} />
				<ItemText title='Fecha de devolución' value={`${endDate}hs`} />
				<ItemText title='Sucursal de retiro' value={withdrawalSubsidiary} />
				{extraPackages.length > 0 && (
					<div>
						<p className='text-sm font-bold'>Paquetes extra:</p>
						<div className='flex flex-col gap-1 mt-1'>
							{extraPackages.map((pkg, idx) => (
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
						<span>{`$${formatAmount(amount)}`}</span>
					</p>
				</div>
			</div>
			{status === PENDING_RENT && (
				<>
					<Divider className='my-4' />
					<div>
						<Button
							className='w-full'
							radius='sm'
							color='danger'
							size='sm'
							onPress={cancelFunction}
						>
							Cancelar alquiler
						</Button>
					</div>
				</>
			)}
			{status === CANCELLED_RENT && (
				<>
					<Divider className='my-4' />
					<ItemText
						title='Monto devuelto'
						value={`$${formatAmount(refundAmount)}`}
					/>
				</>
			)}
		</div>
	)
}
