import { Modal, ModalBody, ModalContent } from '@heroui/react'
import { RentCard } from './RentCard'

export const AlquilerDetailsModal = ({
	isOpen,
	onOpenChange,
	rentId,
	refreshTableFn,
}) => {
	return (
		<Modal
			isOpen={isOpen}
			onOpenChange={onOpenChange}
			className='w-max'
			hideCloseButton
		>
			<ModalContent className='bg-gray-200'>
				<RentCard rentId={rentId} refreshTableFn={refreshTableFn} />
			</ModalContent>
		</Modal>
	)
}
