export default function ShowVehicle({ itemInfo, databaseInfo }) {
    console.log(itemInfo);
    return (
        <>
            <section className="flex gap-2">
                <p className="font-bold">Patente: </p>
                <p>{itemInfo.patente}</p>
            </section>
            <section className="flex gap-2">
                <p className="font-bold">Modelo: </p>
                <p>{itemInfo.modelo}</p>
            </section>
            <section className="flex gap-2">
                <p className="font-bold">Marca: </p>
                {/* <p>{databaseInfo.brands[itemInfo.marca - 1].nombre}</p> */}
                <p>{itemInfo.marca.nombre}</p>
            </section>
            <section className="flex gap-2">
                <p className="font-bold">Año: </p>
                <p>{itemInfo.año}</p>
            </section>
            <section className="flex gap-2">
                <p className="font-bold">Categoría: </p>
                {/* <p>{databaseInfo.categorias[itemInfo.categoria - 1].nombre}</p> */}
                <p>{itemInfo.categoria.nombre}</p>
            </section>
            <section className="flex gap-2">
                <p className="font-bold">Política de cancelación: </p>
                <p>{itemInfo.categoria.cancelacion.descripcion}</p>
            </section>
            <section className="flex gap-2">
                <p className="font-bold">Sucursal: </p>
                <p>{itemInfo.sucursal.localidad.nombre}, {itemInfo.sucursal.direccion}</p>
            </section>
            <section className="flex gap-2">
                <p className="font-bold">Aptitud para discapacitados: </p>
                <p>{itemInfo.aptitud_discapacidad ? "Apto" : "No apto"}</p>
            </section>
        </>
    );
}
