import { RegisterEmployeeForm } from "../components/RegisterEmployeeForm";
import ShowEmployee from "../components/ShowEmployee";
import { useAuth } from "../contexts/AuthContext";
import { employeeApi } from "../api/employee.api";
import React from "react";
import { addToast } from '@heroui/react'
import ListItems from "../components/ListPageComponents/ListItems";
import { subsidiariesApi } from "../api/subsidiaries.api";

export function EmployeePage() {
    const { user } = useAuth();

    const columns = [
        { name: "ID", uid: "id", sortable: true },
        { name: "APELLIDO", uid: "apellido", sortable: true },
        { name: "NOMBRE", uid: "nombre", sortable: true },
        { name: "EMAIL", uid: "email", sortable: true },
        { name: "SUCURSAL", uid: "sucursal", sortable: true },
        { name: "ACTIVO", uid: "activo", sortable: true },
        { name: "ACCIONES", uid: "actions" },
    ];

    const INITIAL_VISIBLE_COLUMNS = [
        "nombre",
        "apellido",
        "email",
        "sucursal",
        'activo',
        "actions",
    ];

    const [itemList, setItemList] = React.useState([]);
    const [databaseInfo, setDatabaseInfo] = React.useState({
        sucursales: [],
    });

    function fetchInfo() {
        employeeApi
            .getAllEmployees()
            .then((res) => {
                setItemList(res);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });

        subsidiariesApi
            .getActiveSubsidiariesPopulated()
            .then((res) => {
                let aux = databaseInfo;
                aux.sucursales = res;
                setDatabaseInfo(aux);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }

    const deleteFunction = (id) => {
      employeeApi
          .deleteEmpleado(id)
          .then(() => {
              addToast({
                  title: "Empleado eliminado",
                  description: "El empleado ha sido eliminado correctamente.",
                  color: "success",
              });
              fetchInfo(); // Refresh the list after deletion
          })
          .catch((error) => {
              console.error("Error deleting empleado:", error);
              addToast({
                  title: "Error al eliminar empleado",
                  description:
                      "No se pudo eliminar el empleado. Inténtelo de nuevo.",
                  color: "danger",
              });
          });
  };

    React.useEffect(() => {
        fetchInfo();
    }, []);

    return (
        <section className="w-full py-[135px] flex flex-col items-center justify-center bg-gray-100 gap-10">
            <h2
                className="text-3xl font-bold text-center"
                onClick={() => console.log(databaseInfo)}
            >
                Lista de empleados
            </h2>
            {user.isAdmin && (
                <ListItems
                    registerForm={<RegisterEmployeeForm />}
                    infoShow={<ShowEmployee />} // Placeholder for info show component
                    deleteItem={<></>} // Placeholder for delete item component
                    columns={columns}
                    INITIAL_VISIBLE_COLUMNS={INITIAL_VISIBLE_COLUMNS}
                    fetchInfo={fetchInfo}
                    itemList={itemList}
                    itemName={"empleado"}
                    deleteFunction={deleteFunction}
                    databaseInfo={databaseInfo}
                />
            )}
        </section>
    );
}
