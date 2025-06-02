export default function ShowPackage({ itemInfo }) {
    return (
        <section className="flex flex-col gap-2">
            <section className="flex gap-2">
                <p className="font-bold">Nombre: </p>
                <p>{itemInfo.nombre}</p>
            </section>
            <section className="flex gap-2">
                <p className="font-bold">Descripción: </p>
                <p>{itemInfo.descripcion}</p>
            </section>
            <section className="flex gap-2">
                <p className="font-bold">Costo: </p>
                <p>{itemInfo.costo}</p>
            </section>
        </section>
    );
}
