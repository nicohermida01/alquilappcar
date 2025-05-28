import React from "react";
import ListItems from "../components/ListPageComponents/ListItems";
import { vehiclesApi } from "../api/vehicles.api";
import RegisterCancelacionForm from "../components/RegisterCancelacionForm";

export default function CancelacionesPage() {
    const columns = [
        { name: "ID", uid: "id", sortable: true },
        { name: "DESCRIPCIÓN", uid: "descripcion", sortable: true },
        { name: "PORCENTAJE", uid: "porcentaje", sortable: true },
        { name: "ACCIONES", uid: "actions" },
    ];

    const INITIAL_VISIBLE_COLUMNS = ["descripcion", "porcentaje", "actions"];

    const [itemList, setItemList] = React.useState([]);

    function fetchInfo() {
        vehiclesApi
            .getAllCancelaciones()
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
                Lista de cancelaciones
            </h2>
            <ListItems
                registerForm={<RegisterCancelacionForm />}
                infoShow={<></>} // Placeholder for info show component
                deleteItem={<></>} // Placeholder for delete item component
                columns={columns}
                INITIAL_VISIBLE_COLUMNS={INITIAL_VISIBLE_COLUMNS}
                fetchInfo={fetchInfo}
                itemList={itemList}
                itemName={"categoría"}
                updateItemList={fetchInfo}
            />
        </section>
    );
}
