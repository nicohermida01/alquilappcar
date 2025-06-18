export default function ShowCategoria({ itemInfo }) {
    return (
        <div className="flex flex-col gap-4">
            <section className="flex gap-2">
                <p className="font-bold">Nombre: </p>
                <p>{itemInfo.nombre}</p>
            </section>
            <section className="flex gap-2">
                <p className="font-bold">Precio: </p>
                <p>{itemInfo.precio}</p>
            </section>
            <section className="flex gap-2">
                <p className="font-bold">Cancelación: </p>
                <p>{itemInfo.cancelacion.descripcion}</p>
            </section>
        </div>
    );
}
