import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
} from "@heroui/react";

import { vehiclesApi } from "../api/vehicles.api";
import { addToast } from "@heroui/react";

export default function DeleteVehicleModal({
    isOpen,
    onOpenChange,
    vehicle,
    updateVehicleList,
}) {
    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="3xl">
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">
                            Está seguro que desea elminar el siguiente vehículo?
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
                        </ModalBody>
                        <ModalFooter>
                            <Button variant="light" onPress={onClose}>
                                Cancelar
                            </Button>
                            <Button
                                color="danger"
                                onPress={() =>
                                    vehiclesApi
                                        .deleteVehicle(vehicle.id)
                                        .then(() => {
                                            updateVehicleList();
                                            addToast({
                                                title: "Éxito",
                                                description:
                                                    "Vehículo eliminado correctamente.",
                                                color: "success",
                                            });
                                        })
                                        .catch((error) => {
                                            console.error(
                                                "Error deleting vehicle:",
                                                error
                                            );
                                        })
                                        .finally(() => {
                                            onClose();
                                        })
                                }
                            >
                                Eliminar
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
