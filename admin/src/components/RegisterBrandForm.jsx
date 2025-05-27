import { Input, Button, addToast } from "@heroui/react";
import { useForm } from "react-hook-form";
import { vehiclesApi } from "../api/vehicles.api";

export default function RegisterBrandForm({
    itemInfo,
    updateBrandList,
    onClose,
}) {
    const { register, handleSubmit, reset, getValues } = useForm();

    const onSubmit = (data) => {
        itemInfo
            ? vehiclesApi
                  .updateBrand(data, itemInfo.id)
                  .then(() => {
                      addToast({
                          title: "Marca actualizada",
                          description:
                              "La marca ha sido actualizada correctamente",
                          color: "success",
                      });
                      updateBrandList();
                  })
                  .catch((error) => {
                      addToast({
                          title: "Error",
                          description:
                              "No se ha podido actualizar la marca. " + error,
                          color: "danger",
                      });
                  })
            : (vehiclesApi
                  .createBrand(data)
                  .then(() => {
                      addToast({
                          title: "Marca creada",
                          description: "La marca ha sido creada correctamente",
                          color: "success",
                      });
                      updateBrandList();
                      onClose();
                  })
                  .catch((error) => {
                      addToast({
                          title: "Error",
                          description:
                              "No se ha podido crear la marca. " + error,
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
                    {itemInfo ? "Modificar marca" : "Registrar marca"}
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
