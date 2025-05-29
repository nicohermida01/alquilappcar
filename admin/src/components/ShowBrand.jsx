export default function ShowBrand({ itemInfo }) {
    return (
        <section className="flex gap-2">
            <p className="font-bold">Nombre: </p>
            <p>{itemInfo.nombre}</p>
        </section>
    );
}
