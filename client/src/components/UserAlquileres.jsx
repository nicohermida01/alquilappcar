import { usersApi } from '../services/users.api'
import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useDisclosure, Spinner, Accordion, AccordionItem } from '@heroui/react'
import { addToast } from '@heroui/react'
import { RentCard } from './RentCard'
import {
	CANCELLED_RENT,
	FINISHED_RENT,
	IN_PROGRESS_RENT,
	PENDING_RENT,
} from '../constants/rentStatus'
import { ModalConfirmCancelRent } from './ModalConfirmCancelRent'
import { leasesApi } from '../services/leases.api'
import { formatAmount } from '../utils/formatAmount'

function UserAlquileres() {
	const [pendingRents, setPendingRents] = useState([])
	const [inProgressRents, setInProgressRents] = useState([])
	const [finishedRents, setFinishedRents] = useState([])
	const [cancelledRents, setCancelledRents] = useState([])
	/* const [deletedRents, setDeletedRents] = useState([]) */
	const [selectedRent, setSelectedRent] = useState(null)
	const [isLoading, setIsLoading] = useState(true)
	const [refreshValue, setRefreshValue] = useState(0)

	const { user } = useAuth()
	const handleCancelModal = useDisclosure()

	const generateRentCard = rent => {
		return (
			<RentCard
				key={rent.id}
				rentId={rent.id}
				cancelFunction={() => handleCancelRent(rent)}
			/>
		)
	}

	const handleCancelRent = rent => {
		setSelectedRent(rent)
		handleCancelModal.onOpen()
	}

	const confirmCancel = (id, refundAmount) => {
		leasesApi
			.cancelLease(id, refundAmount)
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

	useEffect(() => {
		setIsLoading(true)
		usersApi
			.getAlquileresByUserId(user.clientId)
			.then(response => {
				setPendingRents(response.filter(rent => rent.status === PENDING_RENT))
				setInProgressRents(
					response.filter(rent => rent.status === IN_PROGRESS_RENT)
				)
				setFinishedRents(response.filter(rent => rent.status === FINISHED_RENT))
				setCancelledRents(
					response.filter(rent => rent.status === CANCELLED_RENT)
				)
				/* setDeletedRents(response.filter(rent => rent.status === DELETED_RENT)) */
			})
			.catch(error => console.error(error))
			.finally(() => setIsLoading(false))
	}, [user, refreshValue])

	return (
		<div>
			<ModalConfirmCancelRent
				isOpen={handleCancelModal.isOpen}
				onOpenChange={handleCancelModal.onOpenChange}
				rent={selectedRent}
				handleConfirm={confirmCancel}
			/>

			{isLoading && <Spinner />}

			{!isLoading && (
				<Accordion selectionMode='multiple'>
					<AccordionItem key='1' title={`Pendientes (${pendingRents.length})`}>
						<div className='flex gap-4 flex-wrap pb-4'>
							{pendingRents.length > 0 &&
								pendingRents.map(rent => generateRentCard(rent))}
							{pendingRents.length === 0 && <p>No hay alquileres pendientes</p>}
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
					{/* 
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
					</AccordionItem> */}
				</Accordion>
			)}
		</div>
	)
}
export default UserAlquileres
