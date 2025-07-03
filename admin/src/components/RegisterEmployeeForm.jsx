import { Input, Button, Select, SelectItem, addToast, Checkbox } from "@heroui/react";
import { useForm } from "react-hook-form";
import { InputPassword } from "./InputPassword";
import { employeeApi } from "../api/employee.api";
import { handleApiError } from "../utils/handleApiError";

const InputField = ({ children }) => {
    return <fieldset className="flex items-center gap-3">{children}</fieldset>;
};

export function RegisterEmployeeForm({
    itemInfo,
    databaseInfo,
    updateItemList,
    onClose,
}) {
    const { register, handleSubmit, reset } = useForm();

    const onSubmit = (data) => {
        const { password, ...dataWithoutPassword } = data;

        let employeeData = data;

        itemInfo
            ? employeeApi
                  .update(
                      itemInfo.id,
                      password ? employeeData : dataWithoutPassword
                  )
                  .then(() => {
                      addToast({
                          title: "Empleado actualizado",
                          description:
                              "El empleado ha sido actualizado correctamente",
                          color: "success",
                      });
                      updateItemList();
                  })
                  .catch((err) => {
                      addToast({
                          title: "Error",
                          description: handleApiError(err),
                          color: "danger",
                      });
                  })
            : employeeApi
                  .register(employeeData)
                  .then(() => {
                      addToast({
                          title: "Empleado registrado",
                          description:
                              "El empleado ha sido registrado correctamente",
                          color: "success",
                      });
                      updateItemList();
                      onClose();
                      reset();
                  })
                  .catch((err) => {
                      console.log(employeeData, 'EMPLEADO')
                      addToast({
                          title: "Error",
                          description: handleApiError(err),
                          color: "danger",
                      });
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
        <form
            className="flex flex-col gap-4 p-8 "
            onSubmit={handleSubmit(onSubmit, onError)}
        >
            <div className="text-center mb-4">
                <h2 className="text-3xl font-bold text-center">
                    {itemInfo ? "Modificar empleado" : "Registrar empleado"}
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

            <InputField>
                <Select
                    label="Sucursal"
                    defaultSelectedKeys={[itemInfo?.sucursal.toString()]}
                    {...register("sucursal_id", { required: true })}
                    isRequired
                >
                    {databaseInfo.sucursales.map((elem) => {
                        return (
                            <SelectItem
                                key={elem.id}
                            >{`${elem.localidad.nombre} - ${elem.direccion}`}</SelectItem>
                        );
                    })}
                </Select>

                <InputPassword
                    label="Contraseña"
                    register={{
                        ...register("password", {
                            required: !itemInfo,
                        }),
                    }}
                    hasItemInfo={!!itemInfo}
                />
            </InputField>

            <Checkbox
				{...register('activo')}
				defaultSelected={itemInfo?.activo}
			>
				Activo
			</Checkbox>


            <Button type="submit" color="primary" className="text-white">
                Confirmar
            </Button>
        </form>
    );
}
