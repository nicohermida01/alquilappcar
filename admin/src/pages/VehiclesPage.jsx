import React from "react";
import ListItems from "../components/ListPageComponents/ListItems";
import { vehiclesApi } from "../api/vehicles.api";
import RegisterVehicleForm from "../components/RegisterVehicleForm";
import ShowVehicle from "../components/ShowVehicle";

function VehiclesPage() {
    const columns = [
        { name: "ID", uid: "id", sortable: true },
        { name: "PATENTE", uid: "patente", sortable: true },
        { name: "MARCA", uid: "marca", sortable: true },
        { name: "MODELO", uid: "modelo", sortable: true },
        { name: "CATEGORÍA", uid: "categoria", sortable: true },
        { name: "ACCIONES", uid: "actions" },
    ];

    const INITIAL_VISIBLE_COLUMNS = ["patente", "modelo", "actions"];

    const [itemList, setItemList] = React.useState([]);
    const [databaseInfo, setDatabaseInfo] = React.useState({
        brands: [],
        sucursales: [],
        categorias: [],
        cancelaciones: [],
    });

    function fetchInfo() {
        vehiclesApi
            .getAllVehicles()
            .then((res) => {
                setItemList(res);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });

        vehiclesApi
            .getAllBrands()
            .then((res) => {
                let aux = databaseInfo;
                aux.brands = res;
                setDatabaseInfo(aux);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });

        vehiclesApi
            .getAllSucursales()
            .then((res) => {
                let aux = databaseInfo;
                aux.sucursales = res;
                setDatabaseInfo(aux);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });

        vehiclesApi
            .getAllCategorias()
            .then((res) => {
                let aux = databaseInfo;
                aux.categorias = res;
                setDatabaseInfo(aux);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });

        vehiclesApi
            .getAllCancelaciones()
            .then((res) => {
                let aux = databaseInfo;
                aux.cancelaciones = res;
                setDatabaseInfo(aux);
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
            <h2
                className="text-3xl font-bold text-center"
                onClick={() => console.log(databaseInfo)}
            >
                Lista de vehículos
            </h2>
            <ListItems
                registerForm={<RegisterVehicleForm />}
                infoShow={<ShowVehicle />} // Placeholder for info show component
                deleteItem={<></>} // Placeholder for delete item component
                columns={columns}
                INITIAL_VISIBLE_COLUMNS={INITIAL_VISIBLE_COLUMNS}
                fetchInfo={fetchInfo}
                itemList={itemList}
                itemName={"vehículo"}
                databaseInfo={databaseInfo}
                updateItemList={fetchInfo}
            />
        </section>
    );
}

export default VehiclesPage;
