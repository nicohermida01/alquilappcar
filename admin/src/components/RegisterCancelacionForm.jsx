import { Input, Button, addToast } from "@heroui/react";
import { useForm } from "react-hook-form";
import { vehiclesApi } from "../api/vehicles.api";

export default function RegisterCancelacionForm({
    itemInfo,
    updateItemList,
    onClose,
}) {
    const { register, handleSubmit, reset, getValues } = useForm();

    const onSubmit = (data) => {
        itemInfo
            ? vehiclesApi
                  .updateCancelacion(data, itemInfo.id)
                  .then(() => {
                      addToast({
                          title: "Cancelación actualizada",
                          description:
                              "La cancelación ha sido actualizada correctamente",
                          color: "success",
                      });
                      updateItemList();
                  })
                  .catch((error) => {
                      addToast({
                          title: "Error",
                          description:
                              "No se ha podido actualizar la cancelación. " +
                              error,
                          color: "danger",
                      });
                  })
            : (vehiclesApi
                  .createCancelacion(data)
                  .then(() => {
                      addToast({
                          title: "Cancelación creada",
                          description:
                              "La cancelación ha sido creada correctamente",
                          color: "success",
                      });
                      updateItemList();
                      onClose();
                  })
                  .catch((error) => {
                      addToast({
                          title: "Error",
                          description:
                              "No se ha podido crear la cancelación. " + error,
                          color: "danger",
                      });
                  }),
              reset());
    };

    const onError = (errors) => {
        console.error(errors);
    };

    return (
        <form
            className="flex flex-col gap-4 p-8 bg-white rounded-lg shadow-lg"
            onSubmit={handleSubmit(onSubmit, onError)}
        >
            <div className="text-center mb-4">
                <h2 className="text-3xl font-bold text-center">
                    {itemInfo
                        ? "Modificar cancelación"
                        : "Registrar cancelación"}
                </h2>
            </div>

            <Input
                type="text"
                label="Descripción"
                defaultValue={itemInfo?.descripcion}
                {...register("descripcion", { required: true })}
                isRequired
            />

            <Input
                type="number"
                label="Porcentaje"
                defaultValue={itemInfo?.porcentaje}
                {...register("porcentaje", {
                  required: true,
                  valueAsNumber: true
                })}
                max="100"
                min="0"
                errorMessage="El porcentaje debe estar entre el 0 y el 100%"
                isRequired
            />

            <Button type="submit" color="primary" className="text-white">
                Confirmar
            </Button>
        </form>
    );
}
