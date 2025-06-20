export default function ShowSucursal({ itemInfo }) {
    return (
        <div className="flex flex-col gap-4">
            <section className="flex gap-2">
                <p className="font-bold">Dirección: </p>
                <p>{itemInfo.direccion}</p>
            </section>
            <section className="flex gap-2">
                <p className="font-bold">Localidad: </p>
                <p>{itemInfo.localidad.nombre}</p>
            </section>
        </div>
    );
}
