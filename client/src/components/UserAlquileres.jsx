import FieldCard from './FieldCard'
import { usersApi } from '../services/users.api'
import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'
import {
	Modal,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
	useDisclosure,
	Spinner,
} from '@heroui/react'
import { addToast } from '@heroui/react'

import ModalAlquiler from '../components/ModalAlquiler'

function UserAlquileres() {
	// const { toast } = useToast();
	const { isOpen, onOpen, onOpenChange } = useDisclosure()
	const { user } = useAuth()
	const [alquileres, setAlquileres] = useState([])
	const [alquilerSeleccionado, setAlquilerSeleccionado] = useState()
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		setIsLoading(true)
		usersApi
			.getAlquileresByUserId(user.clientId)
			.then(response => setAlquileres(response))
			.catch(error => console.error(error))
			.finally(() => setIsLoading(false))
	}, [])
	const ahora = new Date()
	const opcionesFecha = {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
		hour: '2-digit',
		minute: '2-digit',
		hour12: false,
		timeZone: 'America/Argentina/Buenos_Aires',
	}

	const handleDarDeBaja = async alquiler => {
		try {
			await axios.patch(
				`http://localhost:8000/alquilapp/api/v1/alquileres/${alquiler.id}/`,
				{
					activo: false,
				}
			)
			setAlquileres(prev => prev.filter(alq => alq.id !== alquiler.id))
			let fechaInicio = new Date(alquiler.fecha_inicio)
			let fechaFormateada = fechaInicio.toLocaleString('es-AR', opcionesFecha)

			const refundAmount =
				(alquiler.precio_total *
					alquiler.categoria_vehiculo.cancelacion.porcentaje) /
				100

			addToast({
				title: `Reserva del día ${fechaFormateada} cancelada correctamente.`,
				variant: 'bordered',
				description: `Se han devuelto $${refundAmount}`,
				color: 'success',
				duration: 4000,
			})
		} catch (error) {
			console.error('Error al dar de baja el alquiler', error)
			addToast({
				title: 'Error al dar de baja la reserva.',
				description: 'No se pudo cancelar la reserva, intente nuevamente.',
				color: 'danger',
				duration: 4000,
			})
		}
	}

	const handleOpen = alquiler => {
		setAlquilerSeleccionado(alquiler)
		onOpen()
	}
	return isLoading ? (
		<Spinner />
	) : alquileres.length > 0 ? (
		<div className='mt-16 ml-[10%]'>
			<ModalAlquiler
				alquiler={alquilerSeleccionado}
				isOpen={isOpen}
				onOpenChange={onOpenChange}
				opcionesFecha={opcionesFecha}
			/>
			<div className='flex flex-col gap-3'>
				{alquileres.map(alquiler => {
					const fechaInicio = new Date(alquiler.fecha_inicio)
					const fechaDevolucion = new Date(alquiler.fecha_devolucion)
					const esReserva = fechaInicio > ahora
					const tipo = esReserva ? 'Reserva' : 'Alquiler'
					const fechaFormateadaInicio = fechaInicio.toLocaleString(
						'es-AR',
						opcionesFecha
					)
					const fechaFormateadaDevolucion = fechaDevolucion.toLocaleString(
						'es-AR',
						opcionesFecha
					)
					return (
						<div key={alquiler.id}>
							<div className='flex flex-col rounded-2xl p-4 bg-white'>
								<div className='flex gap-2 items-center text-lg'>
									<h3 className='font-semibold'>{`${tipo} para la fecha ${fechaFormateadaInicio}hs`}</h3>
									<Button
										onPress={() => handleOpen(alquiler)}
										color='primary'
										size='sm'
										className='text-white font-semibold'
									>
										Ver detalle
									</Button>
									{esReserva && (
										<Button
											onPress={() => handleDarDeBaja(alquiler)}
											color='danger'
											size='sm'
											className='text-white font-semibold'
										>
											Cancelar reserva
										</Button>
									)}
								</div>
								<div className='flex flex-col gap-1'>
									<div className='flex gap-5'>
										<div className='flex gap-1 items-center'>
											<p className='font-semibold'>Categoría preferencial:</p>
											<p className='text-sm'>
												{alquiler.categoria_vehiculo.nombre}
											</p>
										</div>
									</div>
									<div className='flex gap-1 items-center'>
										<p className='font-semibold'>Fecha de devolucion:</p>
										<p className='text-sm'>{fechaFormateadaDevolucion}</p>
									</div>
									<div className='flex gap-1 items-center'>
										<p className='font-semibold'>Sucursal de retiro:</p>
										<p className='text-sm'>
											{alquiler.sucursal_retiro.direccion},{' '}
											{alquiler.sucursal_retiro.localidad.nombre}
										</p>
									</div>
								</div>
							</div>
						</div>
					)
				})}
			</div>
		</div>
	) : (
		<p>No se encuentran alquileres realizados.</p>
	)
}
export default UserAlquileres
