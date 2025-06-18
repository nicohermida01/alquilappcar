import React from "react";
import ListItems from "../components/ListPageComponents/ListItems";
import { vehiclesApi } from "../api/vehicles.api";
import RegisterLocalidadForm from "../components/RegisterLocalidadForm";
import ShowLocalidad from "../components/ShowLocalidad";
import { addToast } from "@heroui/react";

export default function LocalidadesPage() {
    const columns = [
        { name: "ID", uid: "id", sortable: true },
        { name: "NOMBRE", uid: "nombre", sortable: true },
        { name: "ACCIONES", uid: "actions" },
    ];

    const deleteFunction = (id) => {
        vehiclesApi
            .deleteLocalidad(id)
            .then(() => {
                addToast({
                    title: "Localidad eliminada",
                    description:
                        "La localidad ha sido eliminada correctamente.",
                    color: "success",
                });
                fetchInfo(); // Refresh the list after deletion
            })
            .catch((error) => {
                console.error("Error deleting localidad:", error);
                addToast({
                    title: "Error al eliminar localidad",
                    description:
                        "No se pudo eliminar la localidad. Inténtelo de nuevo.",
                    color: "danger",
                });
            });
    };

    const INITIAL_VISIBLE_COLUMNS = ["nombre", "actions"];

    const [itemList, setItemList] = React.useState([]);

    function fetchInfo() {
        vehiclesApi
            .getAllLocalidades()
            .then((res) => {
                setItemList(res);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }

    React.useEffect(() => {
        fetchInfo();
    }, []);

    return (
        <section className="w-full py-[135px] flex flex-col items-center justify-center bg-gray-100 gap-10">
            <h2 className="text-3xl font-bold text-center">
                Lista de localidades
            </h2>
            <ListItems
                registerForm={<RegisterLocalidadForm />}
                infoShow={<ShowLocalidad />} // Placeholder for info show component
                columns={columns}
                INITIAL_VISIBLE_COLUMNS={INITIAL_VISIBLE_COLUMNS}
                fetchInfo={fetchInfo}
                itemList={itemList}
                itemName={"localidad"}
                updateItemList={fetchInfo}
                deleteFunction={deleteFunction}
            />
        </section>
    );
}
