import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    DateRangePicker,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { leasesApi } from "../../api/leases.api";
import { formatAmount } from '../../utils/formatAmount.js'

export default function EarningsReport() {
    const [userSelectedDateRange, setuserSelectedDateRange] = useState();
    const [allAlquileresList, setAllAlquileresList] = useState([]);
    const [total, setTotal] = useState(0);

    useEffect(() => {
        leasesApi
            .getAllLeases()
            .then((response) => {
                setAllAlquileresList(response);
            })
            .catch((error) => {
                console.error("Error fetching leases:", error);
            });
    }, []);

    function getAlquileresByRange() {
        const data = {
            start: new Date(userSelectedDateRange.start),
            end: new Date(userSelectedDateRange.end),
        };
        const filteredAlquileres = allAlquileresList.filter((alquiler) => {
            const rentalDate = new Date(alquiler.fecha_registro);
            return rentalDate >= data.start && rentalDate <= data.end;
        });
        const totalEarnings = filteredAlquileres.reduce(
            (acc, alquiler) =>
                Number(acc) +
                Number(alquiler.precio_total) -
                Number(alquiler.reembolso) +
                Number(alquiler.montoExtra) -
                Number(alquiler.montoDevuelto),
            0
        );
        setTotal(totalEarnings);
    }

    return (
        <Card className="w-[49%]">
            <CardHeader>
                <h2 className="text-xl font-bold">
                    Ingresos en el rango de fechas
                </h2>
            </CardHeader>
            <CardBody className="gap-2">
                <DateRangePicker
                    label="Selecciona un rango de fechas"
                    value={userSelectedDateRange}
                    onChange={setuserSelectedDateRange}
                />
                <Button
                    color="primary"
                    isDisabled={!userSelectedDateRange}
                    onPress={getAlquileresByRange}
                >
                    Consultar
                </Button>
                Total: <strong>${formatAmount(total)}</strong>
            </CardBody>
        </Card>
    );
}
