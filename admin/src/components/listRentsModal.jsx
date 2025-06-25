import {
	Accordion,
	AccordionItem,
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Spinner,
} from '@heroui/react'
import { useEffect, useState } from 'react'
import { clientApi } from '../api/client.api'
import {
	CANCELLED_RENT,
	DELETED_RENT,
	FINISHED_RENT,
	IN_PROGRESS_RENT,
	PENDING_RENT,
} from '../constants/rentStatus'
import { RentCard } from './RentCard'

export function ListRentsModal({ isOpen, onOpenChange, client }) {
	const [pendingRents, setPendingRents] = useState([])
	const [inProgressRents, setInProgressRents] = useState([])
	const [finishedRents, setFinishedRents] = useState([])
	const [cancelledRents, setCancelledRents] = useState([])
	const [deletedRents, setDeletedRents] = useState([])
	const [refreshValue, setRefreshValue] = useState(0)
	const [isLoading, setIsLoading] = useState(true)

	const generateRentCard = rent => {
		return (
			<RentCard
				rentId={rent.id}
				key={rent.id}
				refreshTableFn={() => setRefreshValue(prev => prev + 1)}
			/>
		)
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
