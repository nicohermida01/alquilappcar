import {
    addToast,
    Button,
    DateInput,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from "@heroui/react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { leasesApi } from "../services/leases.api";

const InputField = ({ children }) => {
    return <fieldset className="flex items-center gap-3">{children}</fieldset>;
};

export default function PaymentForm({ isOpen, onOpenChange, alquilerData }) {
    const { register, handleSubmit, control } = useForm();
    const [vencimiento, setVencimiento] = useState(false);
    let closeModal;

    const onSubmit = (data) => {
        const now = new Date();
        if (data.fechaVencimiento.year < now.getFullYear()) {
            setVencimiento(true);
            return;
        } else if (
            data.fechaVencimiento.year === now.getFullYear() &&
            data.fechaVencimiento.month < now.getMonth() + 1
        ) {
            setVencimiento(true);
            return;
        }
        setVencimiento(false);
        if (data.numeroTarjeta === "2222222222222222") {
            addToast({
                title: "Error",
                description: "Fondos insuficientes",
                color: "danger",
            });
            return;
        }
        if (data.numeroTarjeta === "3333333333333333") {
            addToast({
                title: "Error",
                description: "La tarjeta no es de crédito",
                color: "danger",
            });
            return;
        }
        leasesApi
            .createLease(alquilerData)
            .then(() => {
                addToast({
                    title: "Pago realizado",
                    description:
                        "El pago se ha realizado con éxito. Se ha registrado la confirmación del alquiler.",
                    color: "success",
                });
                closeModal();
            })
            .catch((error) => {
                addToast({
                    title: "Error",
                    description:
                        "Ocurrió un error al procesar el pago. " +
                        error.message,
                    color: "danger",
                });
                console.error(error)
            });
    };

    const onError = (errors) => {
        console.error(errors);
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="3xl">
            <ModalContent>
                {(onClose) => (
                    <>
                        {(closeModal = onClose)}
                        <ModalHeader>
                            <h2
                                className="text-xl font-semibold"
                                onClick={() => console.log(alquilerData)}
                            >
                                Registrar pago
                            </h2>
                        </ModalHeader>
                        <ModalBody>
                            <form
                                className="flex flex-col gap-4 p-8 "
                                id="payment-form"
                                onSubmit={handleSubmit(onSubmit, onError)}
                            >
                                <Input
                                    type="text"
                                    label="Nombre del titular"
                                    {...register("nombre", { required: true })}
                                    isRequired
                                />

                                <InputField>
                                    <Input
                                        type="text"
                                        label="Número de tarjeta"
                                        maxLength={16}
                                        minLength={16}
                                        pattern="[0-9]*"
                                        {...register("numeroTarjeta", {
                                            required: true,
                                        })}
                                        isRequired
                                    />
                                    <Input
                                        type="number"
                                        label="CVV"
                                        max={999}
                                        min={100}
                                        {...register("cvv", { required: true })}
                                        isRequired
                                    />
                                </InputField>

                                <Controller
                                    name="fechaVencimiento"
                                    control={control}
                                    render={({ field }) => (
                                        <DateInput
                                            {...field}
                                            label="Fecha de vencimiento"
                                            granularity="month"
                                            isRequired
                                        />
                                    )}
                                />

                                {vencimiento && (
                                    <span className="text-error text-xs">
                                        La tarjeta está vencida.
                                    </span>
                                )}

                                <InputField>
                                    <Input
                                        type="text"
                                        label="Dirección"
                                        {...register("direccion", {
                                            required: true,
                                        })}
                                        isRequired
                                    />
                                    <Input
                                        type="text"
                                        label="Código postal"
                                        {...register("codigoPostal", {
                                            required: true,
                                        })}
                                        isRequired
                                    />
                                </InputField>
                            </form>
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                color="primary"
                                type="submit"
                                form="payment-form"
                                fullWidth
                            >
                                Pagar ${alquilerData.precio_total}
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
