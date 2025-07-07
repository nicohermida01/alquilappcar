import ListItems from "../components/ListPageComponents/ListItems";
import { clientApi } from "../api/client.api";
import React from "react";
import { addToast } from '@heroui/react'
import DeleteBrand from "../components/DeleteBrand";
import { RegisterClientForm } from "../components/RegisterClientForm";
import ShowClient from "../components/ShowClient";

export default function ClientsPage() {
    const columns = [
        { name: "ID", uid: "id", sortable: true },
        { name: "APELLIDO", uid: "apellido", sortable: true },
        { name: "NOMBRE", uid: "nombre", sortable: true },
        { name: "EMAIL", uid: "email", sortable: true },
        { name: "ACTIVO", uid: "activo", sortable: true },
        { name: "ACCIONES", uid: "actions" },
    ];

    const INITIAL_VISIBLE_COLUMNS = ["apellido", "nombre", "email", "activo", "actions"];

    const [itemList, setItemList] = React.useState([]);

    function fetchInfo() {
        clientApi
            .getAllClients()
            .then((res) => {
                setItemList(res.data);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }

    React.useEffect(() => {
        fetchInfo();
    }, []);

    const deleteFunction = (id) => {
      clientApi
          .deleteClient(id)
          .then(() => {
              addToast({
                  title: "Cliente eliminado",
                  description: "El cliente ha sido eliminado correctamente.",
                  color: "success",
              });
              fetchInfo(); // Refresh the list after deletion
          })
          .catch((error) => {
              console.error("Error deleting cliente:", error);
              addToast({
                  title: "Error al eliminar cliente",
                  description:
                      "No se pudo eliminar el cliente. Inténtelo de nuevo.",
                  color: "danger",
              });
          });
  };

    return (
        <section className="w-full py-[135px] flex flex-col items-center justify-center bg-gray-100 gap-10">
            <h2 className="text-3xl font-bold text-center">
                Lista de clientes
            </h2>
            <ListItems
                registerForm={<RegisterClientForm />}
                infoShow={<ShowClient />}
                deleteItem={<DeleteBrand />} // por que pingo aparece un deletebrand en client?
                columns={columns}
                deleteFunction={deleteFunction}
                INITIAL_VISIBLE_COLUMNS={INITIAL_VISIBLE_COLUMNS}
                fetchInfo={fetchInfo}
                itemList={itemList}
                itemName={"cliente"}
            />
        </section>
    );
}
