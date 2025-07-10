import { Input, Button, addToast, SelectItem, Select,Checkbox } from "@heroui/react";
import { useForm } from "react-hook-form";
import { vehiclesApi } from "../api/vehicles.api";
import { useAuth } from '../contexts/AuthContext'

export default function RegisterSucursalForm({
    itemInfo,
    updateItemList,
    databaseInfo,
    onClose,
}) {
    const { user, logout } = useAuth()
    const { register, handleSubmit, reset } = useForm();

    const onSubmit = (data) => {
        itemInfo
            ? vehiclesApi
                  .updateSucursal(data, itemInfo.id)
                  .then(() => {
                      addToast({
                          title: "Sucursal actualizada",
                          description:
                              "La sucursal ha sido actualizada correctamente",
                          color: "success",
                      });
                      updateItemList();
                  })
                  .catch((error) => {
                      addToast({
                          title: "Error",
                          description:
                              "No se ha podido actualizar la sucursal. " +
                              error,
                          color: "danger",
                      });
                  })
            : vehiclesApi
                  .createSucursal(data)
                  .then(() => {
                      addToast({
                          title: "Sucursal creada",
                          description:
                              "La sucursal ha sido creada correctamente",
                          color: "success",
                      });
                      updateItemList();
                      onClose();
                  })
                  .catch((error) => {
                      addToast({
                          title: "Error",
                          description:
                              "No se ha podido crear la sucursal. " + error,
                          color: "danger",
                      });
                  });
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
                    {itemInfo ? "Modificar sucursal" : "Registrar sucursal"}
                </h2>
            </div>

            <Input
                type="text"
                label="Dirección"
                defaultValue={itemInfo?.direccion}
                {...register("direccion", { required: true })}
                isRequired
            />

            <Select
                label="Localidad"
                isRequired
                defaultSelectedKeys={[itemInfo?.localidad.id.toString()]}
                {...register("localidad_id", {
                    required: true,
                    valueAsNumber: true,
                })}
            >
                {databaseInfo.map((localidad) => (
                    <SelectItem key={localidad.id}>
                        {localidad.nombre}
                    </SelectItem>
                ))}
            </Select>
            { user.isAdmin ? (<Checkbox
              {...register('activo')}
              defaultSelected={itemInfo ? itemInfo.activo : true}
            >
              Activo
            </Checkbox>):(<></>)}
            
            <Button type="submit" color="primary" className="text-white">
                Confirmar
            </Button>
        </form>
    );
}
