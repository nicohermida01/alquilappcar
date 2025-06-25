import { Modal, ModalBody, ModalContent } from '@heroui/react'
import { RentCard } from './RentCard'

export const AlquilerDetailsModal = ({
	isOpen,
	onOpenChange,
	rentId,
	refreshTableFn,
}) => {
	return (
		<Modal isOpen={isOpen} onOpenChange={onOpenChange} size='3xl'>
			<ModalContent className='bg-gray-200'>
				<ModalBody className='flex justify-center items-center py-10'>
					<RentCard rentId={rentId} refreshTableFn={refreshTableFn} />
				</ModalBody>
			</ModalContent>
		</Modal>
	)
}
