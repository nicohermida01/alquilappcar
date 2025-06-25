import React from "react";
import { addToast } from '@heroui/react'
import ListItems from "../components/ListPageComponents/ListItems";
import { vehiclesApi } from "../api/vehicles.api";
import { subsidiariesApi } from "../api/subsidiaries.api";
import RegisterVehicleForm from "../components/RegisterVehicleForm";
import ShowVehicle from "../components/ShowVehicle";

function VehiclesPage() {
    const columns = [
        { name: "ID", uid: "id", sortable: true },
        { name: "PATENTE", uid: "patente", sortable: true },
        { name: "MARCA", uid: "marca", sortable: true },
        { name: "MODELO", uid: "modelo", sortable: true },
        { name: "CATEGORÍA", uid: "categoria", sortable: true },
        { name: "SUCURSAL", uid: "sucursal", sortable: true },
        { name: 'ACTIVO', uid: 'activo', sortable: true},
        { name: 'DIAS MIN.' , uid: 'min_dias_alquiler', sortable: true},
        { name: "ACCIONES", uid: "actions" },
    ];

    const INITIAL_VISIBLE_COLUMNS = ["patente", "modelo", 'activo', 'min_dias_alquiler', "actions"];

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

        subsidiariesApi
            .getSubsidiariesPopulated()
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
        console.log(databaseInfo, 'DATABASEINFO AL FETCHEAR DATA DE VEHICULOS')
    }, []);

    
    const deleteFunction = (id) => {
      vehiclesApi
          .deleteVehicle(id)
          .then(() => {
              addToast({
                  title: "Vehículo eliminado",
                  description: "El vehículo ha sido eliminado correctamente.",
                  color: "success",
              });
              fetchInfo(); // Refresh the list after deletion
          })
          .catch((error) => {
              console.error("Error deleting vehicle:", error);
              addToast({
                  title: "Error al eliminar vehículo",
                  description:
                      "No se pudo eliminar el vehículo. Inténtelo de nuevo.",
                  color: "danger",
              });
          });
  };

    return (
        <section className="w-full py-[135px] flex flex-col items-center justify-center bg-gray-100 gap-10">
            <h2 className="text-3xl font-bold text-center">
                Lista de vehículos
            </h2>
            <ListItems
                registerForm={<RegisterVehicleForm />}
                infoShow={<ShowVehicle />} // Placeholder for info show component
                deleteItem={<></>} // Placeholder for delete item component
                deleteFunction={deleteFunction}
                columns={columns}
                INITIAL_VISIBLE_COLUMNS={INITIAL_VISIBLE_COLUMNS}
                fetchInfo={fetchInfo}
                itemList={itemList}
                itemName={"vehículo"}
                databaseInfo={databaseInfo}
            />
        </section>
    );
}

export default VehiclesPage;
