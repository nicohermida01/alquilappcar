import {
    Button,
    DateInput,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from "@heroui/react";
import { Controller, useForm } from "react-hook-form";

const InputField = ({ children }) => {
    return <fieldset className="flex items-center gap-3">{children}</fieldset>;
};

export default function PaymentForm({ isOpen, onOpenChange, alquilerData }) {
    const { register, handleSubmit, control } = useForm();

    const onSubmit = (data) => {
        const now = new Date();
        if (
            data.fechaVencimiento.year < now.getFullYear() ||
            data.fechaVencimiento.month < now.getMonth() + 1
        ) {
            console.log(
                "La fecha de vencimiento no puede ser anterior al mes actual"
            );
            return;
        }
        if (data.numeroTarjeta === "2222222222222222") {
            console.log("Fondos insuficientes");
            return;
        }
        console.log("Pago realizado con éxito", data);
    };

    const onError = (errors) => {
        console.error(errors);
    };

    return (
        <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="3xl">
            <ModalContent>
                {(onClose) => (
                    <>
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
                                        />
                                    )}
                                />

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
                                onPress={handleSubmit(onSubmit)}
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
