import RegisterVehicleForm from "./RegisterVehicleForm";
import { Modal, ModalContent, ModalHeader, ModalBody } from "@heroui/react";

export default function ModifyVehicleModal({
    vehicleInfo,
    databaseInfo,
    isOpen,
    onOpenChange,
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
                                vehicleInfo={vehicleInfo}
                            />
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
