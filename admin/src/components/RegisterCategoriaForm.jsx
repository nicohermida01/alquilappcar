import { Input, Button, addToast } from "@heroui/react";
import { useForm } from "react-hook-form";
import { vehiclesApi } from "../api/vehicles.api";

export default function RegisterCategoriaForm({
    itemInfo,
    updateItemList,
    onClose,
}) {
    const { register, handleSubmit, reset, getValues } = useForm();

    const onSubmit = (data) => {
        itemInfo
            ? vehiclesApi
                  .updateCategoria(data, itemInfo.id)
                  .then(() => {
                      addToast({
                          title: "Categoría actualizada",
                          description:
                              "La categoría ha sido actualizada correctamente",
                          color: "success",
                      });
                      updateItemList();
                  })
                  .catch((error) => {
                      addToast({
                          title: "Error",
                          description:
                              "No se ha podido actualizar la categoría. " +
                              error,
                          color: "danger",
                      });
                  })
            : (vehiclesApi
                  .createCategoria(data)
                  .then(() => {
                      addToast({
                          title: "Categoría creada",
                          description:
                              "La categoría ha sido creada correctamente",
                          color: "success",
                      });
                      updateItemList();
                      onClose();
                  })
                  .catch((error) => {
                      addToast({
                          title: "Error",
                          description:
                              "No se ha podido crear la categoría. " + error,
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
                    {itemInfo ? "Modificar categoría" : "Registrar categoría"}
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
                type="number"
                label="Precio"
                defaultValue={itemInfo?.precio}
                {...register("precio", { required: true, valueAsNumber: true })}
                isRequired
            />

            <Button type="submit" color="primary" className="text-white">
                Confirmar
            </Button>
        </form>
    );
}
