import { Input, Button, addToast } from "@heroui/react";
import { useForm } from "react-hook-form";
import { vehiclesApi } from "../api/vehicles.api";

export default function RegisterPackageForm({
    itemInfo,
    updateItemList,
    onClose,
}) {
    const { register, handleSubmit, reset, getValues } = useForm();

    const onSubmit = (data) => {
        itemInfo
            ? vehiclesApi
                  .updatePackage(data, itemInfo.id)
                  .then(() => {
                      addToast({
                          title: "Paquete actualizado",
                          description:
                              "El paquete ha sido actualizado correctamente",
                          color: "success",
                      });
                      updateItemList();
                  })
                  .catch((error) => {
                      addToast({
                          title: "Error",
                          description:
                              "No se ha podido actualizar el paquete. " + error,
                          color: "danger",
                      });
                  })
            : (vehiclesApi
                  .createPackage(data)
                  .then(() => {
                      addToast({
                          title: "Paquete creada",
                          description:
                              "El paquete ha sido creado correctamente",
                          color: "success",
                      });
                      updateItemList();
                      onClose();
                  })
                  .catch((error) => {
                      addToast({
                          title: "Error",
                          description:
                              "No se ha podido crear el paquete. " + error,
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
                    {itemInfo ? "Modificar paquete" : "Registrar paquete"}
                </h2>
            </div>

            <Input
                type="text"
                label="Nombre"
                defaultValue={itemInfo?.nombre}
                {...register("nombre", { required: true })}
                isRequired
            />

            <Input
                type="text"
                label="Descripción"
                defaultValue={itemInfo?.descripcion}
                {...register("descripcion", { required: true })}
                isRequired
            />

            <Input
                type="number"
                label="Costo"
                defaultValue={itemInfo?.costo}
                {...register("costo", { required: true })}
                isRequired
            />

            <Button type="submit" color="primary" className="text-white">
                Confirmar
            </Button>
        </form>
    );
}
