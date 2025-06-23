import React from "react";
import ListItems from "../components/ListPageComponents/ListItems";
import { vehiclesApi } from "../api/vehicles.api";
import { subsidiariesApi } from "../api/subsidiaries.api";
import RegisterSucursalForm from "../components/RegisterSucursalForm";
import ShowSucursal from "../components/ShowSucursal";
import { addToast } from "@heroui/react";

export default function SucursalesPage() {
    const columns = [
        { name: "ID", uid: "id", sortable: true },
        { name: "LOCALIDAD", uid: "localidad", sortable: true },
        { name: "DIRECCION", uid: "direccion", sortable: true },
        { name: 'ACTIVO', uid: 'activo', sortable: true},
        { name: "ACCIONES", uid: "actions"}
    ];

    const deleteFunction = (id) => {
        subsidiariesApi
            .deleteSucursal(id)
            .then(() => {
                addToast({
                    title: "Sucursal eliminada",
                    description: "La sucursal ha sido eliminada correctamente.",
                    color: "success",
                });
                fetchInfo(); // Refresh the list after deletion
            })
            .catch((error) => {
                console.error("Error deleting sucursal:", error);
                addToast({
                    title: "Error al eliminar sucursal",
                    description:
                        "No se pudo eliminar la sucursal. Inténtelo de nuevo.",
                    color: "danger",
                });
            });
    };

    const INITIAL_VISIBLE_COLUMNS = ["localidad", "direccion", 'activo', "actions"];

    const [itemList, setItemList] = React.useState([]);
    const [databaseInfo, setDatabaseInfo] = React.useState();

    function fetchInfo() {
        vehiclesApi
            .getAllSucursales()
            .then((res) => {
                setItemList(res);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });

        vehiclesApi
            .getAllLocalidades()
            .then((res) => {
                setDatabaseInfo(res);
            })
            .catch((error) => {
                console.error("Error fetching localidades:", error);
            });
    }

    React.useEffect(() => {
        fetchInfo();
    }, []);

    return (
        <section className="w-full py-[135px] flex flex-col items-center justify-center bg-gray-100 gap-10">
            <h2 className="text-3xl font-bold text-center">
                Lista de sucursales
            </h2>
            <ListItems
                registerForm={<RegisterSucursalForm />}
                infoShow={<ShowSucursal />}
                columns={columns}
                INITIAL_VISIBLE_COLUMNS={INITIAL_VISIBLE_COLUMNS}
                fetchInfo={fetchInfo}
                itemList={itemList}
                itemName={"sucursal"}
                updateItemList={fetchInfo}
                databaseInfo={databaseInfo}
                deleteFunction={deleteFunction}
            />
        </section>
    );
}
