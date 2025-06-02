import { Input, Button, Select, SelectItem, addToast } from "@heroui/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { InputPassword } from "./InputPassword";
import toast, { Toaster } from "react-hot-toast";
import { format } from "date-fns";
import { clientApi } from "../api/client.api";

const InputField = ({ children }) => {
    return <fieldset className="flex items-center gap-3">{children}</fieldset>;
};

export function RegisterClientForm({
    itemInfo,
    databaseInfo,
    updateItemList,
    onClose,
}) {
    const [matchPasswords, setMatchPasswords] = useState(true);

    const { register, handleSubmit, reset, getValues } = useForm();

    const onSubmit = (data) => {
        const { confirmPassword, ...dataWithoutConfirmPassword } = data;
        let clientData = dataWithoutConfirmPassword;

        clientData.fecha_de_nacimiento = format(
            clientData.fecha_de_nacimiento,
            "yyyy-MM-dd"
        );

        itemInfo
            ? clientApi
                  .updateClient(itemInfo.id, clientData)
                  .then(() => {
                      addToast({
                          title: "Cliente actualizado",
                          description:
                              "El cliente ha sido actualizado correctamente",
                          color: "success",
                      });
                      updateItemList();
                  })
                  .catch((err) => {
                      toast.error(
                          "Parece que hubo un error al actualizar el cliente"
                      );
                      console.error(err);
                  })
            : clientApi
                  .createClient(clientData)
                  .then(() => {
                      addToast({
                          title: "Cliente registrado",
                          description:
                              "El cliente ha sido registrado correctamente",
                          color: "success",
                      });
                      updateItemList();
                      onClose();
                      reset();
                  })
                  .catch((err) => {
                      toast.error(
                          "Parece que hubo un error al registrar el cliente"
                      );
                      console.error(err);
                  });
    };

    const onError = (errors) => {
        console.error(errors);
    };

    const validatePassword = () => {
        const password = getValues("password");
        const confirmPassword = getValues("confirmPassword");

        const isValid = password === confirmPassword;
        setMatchPasswords(isValid);

        return isValid;
    };

    return (
        <>
            <form
                className="flex flex-col gap-4 p-8 "
                onSubmit={handleSubmit(onSubmit, onError)}
            >
                <div className="text-center mb-4">
                    <h2 className="text-3xl font-bold text-center">
                        {itemInfo ? "Modificar cliente" : "Registrar cliente"}
                    </h2>
                </div>

                <InputField>
                    <Input
                        type="text"
                        label="Nombre"
                        defaultValue={itemInfo?.nombre}
                        {...register("nombre", { required: true })}
                        isRequired
                    />

                    <Input
                        type="text"
                        label="Apellido"
                        defaultValue={itemInfo?.apellido}
                        {...register("apellido", { required: true })}
                        isRequired
                    />
                </InputField>

                <InputField>
                    <Input
                        type="email"
                        label="Correo electrónico"
                        defaultValue={itemInfo?.email}
                        {...register("email", { required: true })}
                        isRequired
                    />

                    <Input
                        type="number"
                        label="DNI"
                        defaultValue={itemInfo?.dni}
                        {...register("dni", {
                            required: true,
                            valueAsNumber: true,
                        })}
                        isRequired
                    />
                </InputField>

                <Input
                    type="text"
                    label="Contacto"
                    defaultValue={itemInfo?.contacto}
                    {...register("contacto", {})}
                />

                <Input
                    type="date"
                    label="Fecha de nacimiento"
                    defaultValue={itemInfo?.fecha_de_nacimiento}
                    {...register("fecha_de_nacimiento", {
                        valueAsDate: true,
                        required: true,
                    })}
                    isRequired
                />

                <InputField>
                    <InputPassword
                        label="Contraseña"
                        register={{
                            ...register("password", {
                                required: true,
                                validate: validatePassword,
                            }),
                        }}
                    />

                    <InputPassword
                        label="Confirmar contraseña"
                        register={{
                            ...register("confirmPassword", {
                                required: true,
                                validate: validatePassword,
                            }),
                        }}
                    />
                </InputField>

                {!matchPasswords && (
                    <span className="text-error text-xs">
                        Las contraseñas no coinciden
                    </span>
                )}

                <Button type="submit" color="primary" className="text-white">
                    Confirmar
                </Button>
            </form>
            <Toaster />
        </>
    );
}
