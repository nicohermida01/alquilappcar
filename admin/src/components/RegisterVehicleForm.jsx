import {
    Input,
    Button,
    Select,
    SelectItem,
    Checkbox,
    addToast,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { vehiclesApi } from "../api/vehicles.api";

const InputField = ({ children }) => {
    return <fieldset className="flex items-center gap-3">{children}</fieldset>;
};

function RegisterVehicleForm() {
    const { register, handleSubmit, reset, getValues } = useForm();

    const [brands, setBrands] = useState([]);
    const [sucursales, setSucursales] = useState([]);
    const [categorias, setCategorias] = useState([]);
    const [cancelaciones, setCancelaciones] = useState([]);

    const onSubmit = (data) => {
        vehiclesApi
            .createVehicle(data)
            .then(() => {
                addToast({
                    title: "Vehículo creado",
                    description: "El vehículo ha sido creado correctamente",
                    color: "success",
                });
            })
            .catch((error) => {
                addToast({
                    title: "Error",
                    description: "No se ha podido crear el vehículo. " + error,
                    color: "danger",
                });
            });
        console.log(data);
        submitVehicle();
        reset();
    };

    const onError = (errors) => {
        console.error(errors);
    };

    useEffect(() => {
        vehiclesApi.getAllBrands().then((res) => {
            setBrands(res);
        });
        vehiclesApi.getAllSucursales().then((res) => {
            setSucursales(res);
        });
        vehiclesApi.getAllCategorias().then((res) => {
            setCategorias(res);
        });
        vehiclesApi.getAllCancelaciones().then((res) => {
            setCancelaciones(res);
        });

        reset();
    }, [reset]);

    return (
        <form
            className="flex flex-col gap-4 p-8 bg-white rounded-lg shadow-lg"
            onSubmit={handleSubmit(onSubmit, onError)}
        >
            <div className="text-center mb-4">
                <h2 className="text-3xl font-bold text-center">
                    Registrar vehículo
                </h2>
                <span className="text-error">Solo para administradores</span>
            </div>

            <Input
                type="text"
                label="Patente"
                {...register("patente", { required: true })}
                isRequired
            />

            <InputField>
                <Select
                    label="Marca"
                    {...register("marca", {
                        required: true,
                        valueAsNumber: true,
                    })}
                    isRequired
                >
                    {brands.map((brand) => (
                        <SelectItem key={brand.id}>{brand.nombre}</SelectItem>
                    ))}
                </Select>

                <Input
                    type="text"
                    label="Modelo"
                    {...register("modelo", {
                        required: true,
                    })}
                    isRequired
                />
            </InputField>

            <InputField>
                <Select
                    label="Categoría"
                    {...register("categoria", {
                        required: true,
                        valueAsNumber: true,
                    })}
                    isRequired
                >
                    {categorias.map((categoria) => (
                        <SelectItem key={categoria.id}>
                            {categoria.nombre}
                        </SelectItem>
                    ))}
                </Select>

                <Select
                    label="Cancelación"
                    {...register("cancelacion", {
                        required: true,
                        valueAsNumber: true,
                    })}
                    isRequired
                >
                    {cancelaciones.map((cancelacion) => (
                        <SelectItem key={cancelacion.id}>
                            {cancelacion.descripcion}
                        </SelectItem>
                    ))}
                </Select>
            </InputField>

            <InputField>
                <Input
                    type="number"
                    label="Año"
                    {...register("año", {
                        required: true,
                        valueAsNumber: true,
                    })}
                />

                <Input
                    type="number"
                    label="Pasajeros"
                    {...register("max_pasajeros", {
                        required: true,
                        valueAsNumber: true,
                    })}
                />
            </InputField>

            <Select
                label="Localidad"
                {...register("localidad", {
                    required: true,
                    valueAsNumber: true,
                })}
                isRequired
            >
                {sucursales.map((sucursal) => (
                    <SelectItem key={sucursal.id}>{sucursal.nombre}</SelectItem>
                ))}
            </Select>

            <InputField>
                <Input
                    label="Precio"
                    type="number"
                    {...register("precio_dia", {
                        required: true,
                        valueAsNumber: true,
                    })}
                    isRequired
                />
                <Input
                    label="Días minimos de alquiler"
                    type="number"
                    {...register("min_dias_alquiler", {
                        required: true,
                        valueAsNumber: true,
                    })}
                    isRequired
                />
            </InputField>

            <Checkbox {...register("aptitud_discapacidad")}>
                Apto para discapacitados
            </Checkbox>

            <Button type="submit" color="primary" className="text-white">
                Confirmar
            </Button>
        </form>
    );
}

export default RegisterVehicleForm;
