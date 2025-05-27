import RegisterVehicleForm from "./RegisterVehicleForm";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
} from "@heroui/react";

export default function ViewVehicleModal({ isOpen, onOpenChange, vehicle }) {
    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="3xl">
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            Detalles del vehículo
                        </ModalHeader>
                        <ModalBody>
                            <section className="flex gap-2">
                                <p className="font-bold">Patente: </p>
                                <p>{vehicle.patente}</p>
                            </section>
                            <section className="flex gap-2">
                                <p className="font-bold">Modelo: </p>
                                <p>{vehicle.modelo}</p>
                            </section>
                            <section className="flex gap-2">
                                <p className="font-bold">Marca: </p>
                                <p>{vehicle.marca}</p>
                            </section>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                color="danger"
                                variant="light"
                                onPress={onClose}
                            >
                                Close
                            </Button>
                            <Button color="primary" onPress={onClose}>
                                Action
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
