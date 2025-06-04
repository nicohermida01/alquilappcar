import { useAuth } from "../contexts/AuthContext";
import React from "react";
import ListItems from "../components/ListPageComponents/ListItems";
import { vehiclesApi } from "../api/vehicles.api";
import RegisterPackageForm from "../components/RegisterPackageForm";
import ShowPackage from "../components/ShowPackage";

export default function PaquetesPage() {
    const { user } = useAuth();

    const columns = [
        { name: "ID", uid: "id", sortable: true },
        { name: "NOMBRE", uid: "nombre", sortable: true },
        { name: "COSTO", uid: "costo", sortable: true },
        { name: "ACCIONES", uid: "actions" },
    ];

    const INITIAL_VISIBLE_COLUMNS = ["nombre", "costo", "actions"];

    const [itemList, setItemList] = React.useState([]);

    function fetchInfo() {
        vehiclesApi
            .getAllPackages()
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
                Lista de paquetes
            </h2>
            {user.isAdmin && (
                <ListItems
                    registerForm={<RegisterPackageForm />}
                    infoShow={<ShowPackage />} // Placeholder for info show component
                    deleteItem={<></>} // Placeholder for delete item component
                    columns={columns}
                    INITIAL_VISIBLE_COLUMNS={INITIAL_VISIBLE_COLUMNS}
                    fetchInfo={fetchInfo}
                    itemList={itemList}
                    itemName={"paquete"}
                />
            )}
        </section>
    );
}
