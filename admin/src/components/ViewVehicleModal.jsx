import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
} from "@heroui/react";

export default function ViewVehicleModal({
    isOpen,
    onOpenChange,
    vehicle,
    databaseInfo,
}) {
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
                                <p>
                                    {
                                        databaseInfo.brands[vehicle.marca - 1]
                                            .nombre
                                    }
                                </p>
                            </section>
                            <section className="flex gap-2">
                                <p className="font-bold">Categoría: </p>
                                <p>
                                    {
                                        databaseInfo.categorias[
                                            vehicle.categoria - 1
                                        ].nombre
                                    }
                                </p>
                            </section>
                            <section className="flex gap-2">
                                <p className="font-bold">
                                    Política de cancelación:{" "}
                                </p>
                                <p>
                                    {
                                        databaseInfo.cancelaciones[
                                            vehicle.marca - 1
                                        ].descripcion
                                    }
                                </p>
                            </section>
                            <section className="flex gap-2">
                                <p className="font-bold">Sucursal: </p>
                                <p>
                                    {
                                        databaseInfo.sucursales[
                                            vehicle.localidad - 1
                                        ].nombre
                                    }
                                </p>
                            </section>
                            <section className="flex gap-2">
                                <p className="font-bold">
                                    Aptitud para discapacitados:{" "}
                                </p>
                                <p>
                                    {vehicle.aptitud_discapacidad
                                        ? "Apto"
                                        : "No apto"}
                                </p>
                            </section>
                        </ModalBody>
                        <ModalFooter />
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
