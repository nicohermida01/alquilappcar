import { Input, Button, addToast } from "@heroui/react";
import { useForm } from "react-hook-form";
import { vehiclesApi } from "../api/vehicles.api";

export default function RegisterLocalidadForm({
    itemInfo,
    updateItemList,
    onClose,
}) {
    const { register, handleSubmit, reset } = useForm();

    const onSubmit = (data) => {
        itemInfo
            ? vehiclesApi
                  .updateLocalidad(data, itemInfo.id)
                  .then(() => {
                      addToast({
                          title: "Localidad actualizada",
                          description:
                              "La localidad ha sido actualizada correctamente",
                          color: "success",
                      });
                      updateItemList();
                  })
                  .catch((error) => {
                      addToast({
                          title: "Error",
                          description:
                              "No se ha podido actualizar la localidad. " +
                              error,
                          color: "danger",
                      });
                  })
            : (vehiclesApi
                  .createLocalidad(data)
                  .then(() => {
                      addToast({
                          title: "Localidad creada",
                          description:
                              "La localidad ha sido creada correctamente",
                          color: "success",
                      });
                      updateItemList();
                      onClose();
                  })
                  .catch((error) => {
                      addToast({
                          title: "Error",
                          description:
                              "No se ha podido crear la localidad. " + error,
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
                    {itemInfo ? "Modificar localidad" : "Registrar localidad"}
                </h2>
            </div>

            <Input
                type="text"
                label="Nombre"
                defaultValue={itemInfo?.nombre}
                {...register("nombre", { required: true })}
                isRequired
            />

            <Button type="submit" color="primary" className="text-white">
                Confirmar
            </Button>
        </form>
    );
}
