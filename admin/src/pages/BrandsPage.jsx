import ListItems from "../components/ListItems";
import RegisterBrandForm from "../components/RegisterBrandForm";
import ShowBrand from "../components/ShowBrand";
import { vehiclesApi } from "../api/vehicles.api";
import React from "react";
import DeleteBrand from "../components/DeleteBrand";

export default function BrandsPage() {
    const columns = [
        { name: "ID", uid: "id", sortable: true },
        { name: "NOMBRE", uid: "nombre", sortable: true },
        { name: "ACCIONES", uid: "actions" },
    ];

    const INITIAL_VISIBLE_COLUMNS = ["id", "nombre", "actions"];

    const [itemList, setItemList] = React.useState([]);

    function fetchInfo() {
        vehiclesApi
            .getAllBrands()
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
            <h2 className="text-3xl font-bold text-center">Lista de marcas</h2>
            <ListItems
                registerForm={<RegisterBrandForm />}
                infoShow={<ShowBrand />}
                deleteItem={<DeleteBrand />}
                columns={columns}
                INITIAL_VISIBLE_COLUMNS={INITIAL_VISIBLE_COLUMNS}
                fetchInfo={fetchInfo}
                itemList={itemList}
                itemName={"marca"}
            />
        </section>
    );
}
