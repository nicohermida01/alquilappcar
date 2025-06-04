export default function ShowClient({ itemInfo }) {
    return (
        <section className="flex flex-col gap-2">
            <section className="flex gap-2">
                <p className="font-bold">Nombre: </p>
                <p>{itemInfo.nombre}</p>
            </section>
            <section className="flex gap-2">
                <p className="font-bold">Apellido: </p>
                <p>{itemInfo.apellido}</p>
            </section>
            <section className="flex gap-2">
                <p className="font-bold">Fecha de nacimiento: </p>
                <p>{itemInfo.fecha_de_nacimiento}</p>
            </section>
            <section className="flex gap-2">
                <p className="font-bold">DNI: </p>
                <p>{itemInfo.dni}</p>
            </section>
            <section className="flex gap-2">
                <p className="font-bold">Email: </p>
                <p>{itemInfo.email}</p>
            </section>
            <section className="flex gap-2">
                <p className="font-bold">Información de contacto: </p>
                <p>{itemInfo.contacto}</p>
            </section>
        </section>
    );
}
