import RegisterVehicleForm from "./RegisterVehicleForm";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/react";

export default function CreateVehicleModal({
    databaseInfo,
    isOpen,
    onOpenChange,
    updateVehiclesList,
}) {
    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="3xl">
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1"></ModalHeader>
                        <ModalBody>
                            <RegisterVehicleForm
                                databaseInfo={databaseInfo}
                                updateVehicleList={updateVehiclesList}
                                onClose={onClose}
                            />
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
