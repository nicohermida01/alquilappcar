import {
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalHeader,
} from "@heroui/react";
import { useForm } from "react-hook-form";

const InputField = ({ children }) => {
    return <fieldset className="flex items-center gap-3">{children}</fieldset>;
};

export default function PaymentForm({ isOpen, onOpenChange, alquilerData }) {
    const { register, handleSubmit, reset } = useForm();

    const onSubmit = (data) => {
        console.log(data);
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
                            </form>
                        </ModalBody>
                    </>
                )}
            </ModalContent>
        </Modal>
    );
}
