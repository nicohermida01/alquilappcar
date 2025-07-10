import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    DateRangePicker,
    Chip
} from "@heroui/react";
import { useEffect, useState } from "react";
import { vehiclesApi } from "../../api/vehicles.api";
import { getFecha } from '../../utils/getFecha.js'

export default function RegisterVehicles() {
    const [vehicleSelectedDateRange, setVehicleSelectedDateRange] = useState();
    const [allVehicleList, setAllVehicleList] = useState([]);
    const [filteredVehicleList, setFilteredVehicleList] = useState([]);

    useEffect(() => {
        vehiclesApi
            .getAllVehicles()
            .then((response) => {
                setAllVehicleList(response);
                //console.log(response);
            })
            .catch((error) => {
                console.error("Error fetching vehicles:", error);
            });
    }, []);

    function getVehicleByRange() {
        const data = {
            start: new Date(vehicleSelectedDateRange.start),
            end: new Date(vehicleSelectedDateRange.end),
        };
        console.log(allVehicleList, 'VEHICULOS');
        const filteredUsers = allVehicleList.filter((vehicle) => {
            const registrationDate = new Date(vehicle.fecha_registro);
            return (
                registrationDate >= data.start && registrationDate <= data.end
            );
        });
        setFilteredVehicleList(filteredUsers);
    }

    return (
        <Card className="w-[49%]">
            <CardHeader>
                <h2 className="text-xl font-bold">Vehículos registrados</h2>
            </CardHeader>
            <CardBody className="gap-2">
                <DateRangePicker
                    label="Selecciona un rango de fechas"
                    value={vehicleSelectedDateRange}
                    onChange={setVehicleSelectedDateRange}
                />
                <Button
                    color="primary"
                    isDisabled={!vehicleSelectedDateRange}
                    onPress={getVehicleByRange}
                >
                    Consultar
                </Button>
            </CardBody>
            <CardFooter className="flex flex-col gap-4 max-h-[400px] overflow-y-auto items-start">
                {filteredVehicleList.length > 0 ? filteredVehicleList.map((vehicle) => (
                    <div
                        key={vehicle.id}
                        className="flex gap-2 justify-between w-full"
                    >
                        
                        <div className="flex flex-col">
                          <p className="text-bold text-sm">
                                <strong>Patente: </strong>
                                {vehicle.patente}
                            </p>
                            <p className="text-bold text-sm">
                                <strong>Fecha de registro: </strong>
                                {vehicle.fecha_registro}
                            </p>
                            <p className="text-bold text-sm">
                                <strong>Marca: </strong>
                                {vehicle.marca.nombre}
                            </p>
                            <p className="text-bold text-sm">
                                <strong>Modelo: </strong>
                                {vehicle.modelo}
                            </p>
                             <p className="text-bold text-sm">
                                <strong>Categoría: </strong>
                                {vehicle.categoria.nombre}
                            </p>
                        </div>
                        <Chip
                            className="capitalize"
                            variant="flat"
                            color={vehicle.activo ? "success" : "danger"}
                        >
                            {vehicle.activo ? "Activo" : "Inactivo"}
                        </Chip>
                    </div>
                )):(<p>No hay vehículos registrados en las fechas seleccionadas.</p>)}
            </CardFooter>
        </Card>
    );
}
