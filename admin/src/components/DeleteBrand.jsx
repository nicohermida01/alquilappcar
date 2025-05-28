import { addToast, Button, ModalBody, ModalFooter } from "@heroui/react";
import { vehiclesApi } from "../api/vehicles.api";

export default function DeleteBrand({ itemInfo, updateItemList, onClose }) {
    return (
        <>
            <ModalBody>
                <section className="flex gap-2">
                    <p className="font-bold">Nombre: </p>
                    <p>{itemInfo.nombre}</p>
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
                            .deleteBrand(itemInfo.id)
                            .then(() => {
                                updateItemList();
                                addToast({
                                    title: "Éxito",
                                    description:
                                        "Vehículo eliminado correctamente.",
                                    color: "success",
                                });
                            })
                            .catch((error) => {
                                console.error("Error deleting vehicle:", error);
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
    );
}
