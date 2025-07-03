import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Chip,
    DateRangePicker,
    Divider,
    User,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { clientApi } from "../../api/client.api";

export default function RegisterUsers() {
    const [userSelectedDateRange, setuserSelectedDateRange] = useState();
    const [allUserList, setAllUserList] = useState([]);
    const [filteredUserList, setFilteredUserList] = useState([]);

    useEffect(() => {
        clientApi
            .getAllClients()
            .then((response) => {
                setAllUserList(response.data);
            })
            .catch((error) => {
                console.error("Error fetching users:", error);
            });
    }, []);

    function getUserByRange() {
        const data = {
            start: new Date(userSelectedDateRange.start),
            end: new Date(userSelectedDateRange.end),
        };
        const filteredUsers = allUserList.filter((user) => {
            const registrationDate = new Date(user.fecha_de_registro);
            return (
                registrationDate >= data.start && registrationDate <= data.end
            );
        });
        setFilteredUserList(filteredUsers);
    }

    return (
        <Card className="w-[49%]">
            <CardHeader>
                <h2 className="text-xl font-bold">Usuarios registrados</h2>
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
                    onPress={getUserByRange}
                >
                    Consultar
                </Button>
            </CardBody>
            <CardFooter className="flex flex-col gap-4 max-h-[400px] overflow-y-auto items-start">
                {filteredUserList.map((user) => (
                    <div
                        key={user.id}
                        className="flex gap-2 justify-between w-full"
                    >
                        <User
                            name={user.nombre}
                            description={user.email}
                            avatarProps={{ radius: "lg", src: user.avatar }}
                        >
                            {user.email}
                        </User>{" "}
                        <div className="flex flex-col">
                            <p className="text-bold text-sm">
                                <strong>Fecha de registro: </strong>
                                {new Date(
                                    user.fecha_de_registro
                                ).toLocaleDateString()}
                            </p>
                            <p className="text-bold text-sm text-default-400">
                                <strong>DNI: </strong>
                                {user.dni}
                            </p>
                        </div>
                        <Chip
                            className="capitalize"
                            variant="flat"
                            color={user.activo ? "success" : "danger"}
                        >
                            {user.activo ? "Activo" : "Inactivo"}
                        </Chip>
                    </div>
                ))}
                <Divider className="my-4" />
                <p className="text-sm text-gray-500">
                    {filteredUserList.length} usuarios registrados en el rango
                    de fechas
                </p>
            </CardFooter>
        </Card>
    );
}
