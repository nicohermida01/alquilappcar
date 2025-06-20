import {
	Accordion,
	AccordionItem,
	addToast,
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Spinner,
	useDisclosure,
} from '@heroui/react'
import { useEffect, useState } from 'react'
import { clientApi } from '../api/client.api'
import { rentApi } from '../api/rent.api'
import { getFecha } from '../utils/getFecha'
import {
	CANCELLED_RENT,
	DELETED_RENT,
	FINISHED_RENT,
	IN_PROGRESS_RENT,
	PENDING_RENT,
} from '../constants/rentStatus'
import { RentCard } from './RentCard'
import { ModalConfirmAction} from './ModalConfirmAction'
import { formatAmount } from '../utils/formatAmount'

export function ListRentsModal({ isOpen, onOpenChange, client }) {
	const [pendingRents, setPendingRents] = useState([])
	const [inProgressRents, setInProgressRents] = useState([])
	const [finishedRents, setFinishedRents] = useState([])
	const [cancelledRents, setCancelledRents] = useState([])
	const [deletedRents, setDeletedRents] = useState([])
	const [selectedRent, setSelectedRent] = useState(null)
	const [refreshValue, setRefreshValue] = useState(0)
	const [isLoading, setIsLoading] = useState(true)

	const handleCancelModal = useDisclosure()

	const generateRentCard = rent => {
		const vehicle = rent.vehiculo_asignado
			? rent.vehiculo_asignado
			: 'Sin confirmar'
		const withdrawalSubsidiary = `${rent.sucursal_retiro.direccion}, ${rent.sucursal_retiro.localidad.nombre}`

		return (
			<RentCard
				key={rent.id}
				startDate={getFecha(rent.fecha_inicio)}
				status={rent.status}
				category={rent.categoria_vehiculo.nombre}
				endDate={getFecha(rent.fecha_devolucion)}
				amount={rent.precio_total}
				vehicle={vehicle}
				withdrawalSubsidiary={withdrawalSubsidiary}
				id={rent.id}
				extraPackages={rent.paquetealquiler_set}
				cancelFunction={() => handleCancelRent(rent)}
        deleteFunction={() => handleDeleteRent(rent)}
				refundAmount={rent.reembolso}
			/>
		)
	}

  const handleDeleteModal = useDisclosure()
const [modalAction, setModalAction] = useState(null) // 'cancel' o 'delete'
const [refundAmount, setRefundAmount] = useState(0)

	const handleCancelRent = rent => {
    setSelectedRent(rent)
  setModalAction('cancel')
  const amount = (rent.precio_total * rent.categoria_vehiculo.cancelacion.porcentaje) / 100
  setRefundAmount(amount)
  handleCancelModal.onOpen()
	}

  const handleDeleteRent = rent => {
    setSelectedRent(rent)
    setModalAction('delete')
    handleCancelModal.onOpen()
  }

	const confirmCancel = (id, refundAmount) => {
		rentApi
			.confirmCancel(id, refundAmount)
			.then(() => {
				setRefreshValue(prev => prev + 1) // esto genera que se ejecute el useEffect y se actualicen los alquileres -Nico

				addToast({
					title: `Reserva #${id} cancelada correctamente.`,
					variant: 'bordered',
					description: `Se han devuelto $${formatAmount(refundAmount)}`,
					color: 'success',
					duration: 4000,
				})
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

  const confirmDelete = (id) => {
		rentApi
			.deleteRent(id, refundAmount)
			.then(() => {
				setRefreshValue(prev => prev + 1) // esto genera que se ejecute el useEffect y se actualicen los alquileres -Nico

				addToast({
					title: `Reserva #${id} eliminada correctamente.`,
					variant: 'bordered',
					// description: `Se han devuelto $${formatAmount(refundAmount)}`,
					color: 'success',
					duration: 4000,
				})
			})
			.catch(err => {
				console.error('Error al cancelar el alquiler', err)
				addToast({
					title: 'Error al eliminar el alquiler.',
					description: 'No se pudo eliminar el alquiler, intente nuevamente.',
					color: 'danger',
					duration: 4000,
				})
			})
	}

	useEffect(() => {
		// fetch rents for the client when the modal opens
		if (client) {
			setIsLoading(true)
			clientApi
				.getAlquileresByUserId(client.id)
				.then(res => {
					setPendingRents(res.filter(rent => rent.status === PENDING_RENT))
					setInProgressRents(
						res.filter(rent => rent.status === IN_PROGRESS_RENT)
					)
					setFinishedRents(res.filter(rent => rent.status === FINISHED_RENT))
					setCancelledRents(res.filter(rent => rent.status === CANCELLED_RENT))
					setDeletedRents(res.filter(rent => rent.status === DELETED_RENT))
				})
				.catch(error => {
					console.error('Error fetching rents:', error)
				})
				.finally(() => setIsLoading(false))
		}
	}, [client, refreshValue])

	return (
		<Modal isOpen={isOpen} onOpenChange={onOpenChange} size='full'>
			<ModalContent>
				{onClose => (
					<>
						<ModalHeader className='flex flex-col gap-1'>
							{`Alquileres de ${client.nombre} ${client.apellido}`}
						</ModalHeader>

						<ModalBody className='overflow-y-auto bg-gray-100'>
            <ModalConfirmAction
  isOpen={handleCancelModal.isOpen}
  onOpenChange={handleCancelModal.onOpenChange}
  rent={selectedRent}
  actionType={modalAction}
  refundAmount={refundAmount}
  onConfirm={
    modalAction === 'cancel'
      ? confirmCancel
      : confirmDelete
  }
/>
							{isLoading && <Spinner />}

							{!isLoading && (
								<Accordion selectionMode='multiple'>
									<AccordionItem
										key='1'
										title={`Pendientes (${pendingRents.length})`}
									>
										<div className='flex gap-4 flex-wrap pb-4'>
											{pendingRents.length > 0 &&
												pendingRents.map(rent => generateRentCard(rent))}
											{pendingRents.length === 0 && (
												<p>No hay alquileres pendientes</p>
											)}
										</div>
									</AccordionItem>

									<AccordionItem
										key='2'
										title={`En progreso (${inProgressRents.length})`}
									>
										<div className='flex gap-4 flex-wrap pb-4'>
											{inProgressRents.length > 0 &&
												inProgressRents.map(rent => generateRentCard(rent))}
											{inProgressRents.length === 0 && (
												<p>No hay alquileres en curso actualmente</p>
											)}
										</div>
									</AccordionItem>

									<AccordionItem
										key='3'
										title={`Finalizados (${finishedRents.length})`}
									>
										<div className='flex gap-4 flex-wrap pb-4'>
											{finishedRents.length > 0 &&
												finishedRents.map(rent => generateRentCard(rent))}
											{finishedRents.length === 0 && (
												<p>No hay alquileres finalizados</p>
											)}
										</div>
									</AccordionItem>

									<AccordionItem
										key='4'
										title={`Cancelados (${cancelledRents.length})`}
									>
										<div className='flex gap-4 flex-wrap pb-4'>
											{cancelledRents.length > 0 &&
												cancelledRents.map(rent => generateRentCard(rent))}
											{cancelledRents.length === 0 && (
												<p>No hay alquileres cancelados</p>
											)}
										</div>
									</AccordionItem>

									<AccordionItem
										key='5'
										title={`Dados de baja (${deletedRents.length})`}
									>
										<div className='flex gap-4 flex-wrap pb-4'>
											{deletedRents.length > 0 &&
												deletedRents.map(rent => generateRentCard(rent))}
											{deletedRents.length === 0 && (
												<p>No hay alquileres dados de baja</p>
											)}
										</div>
									</AccordionItem>
								</Accordion>
							)}
						</ModalBody>

						<ModalFooter>
							<Button
								color='secondary'
								variant='solid'
								radius='sm'
								onPress={onClose}
							>
								Cerrar
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	)
}
