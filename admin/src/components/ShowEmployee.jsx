export default function ShowEmployee({ itemInfo }) {
  console.log(itemInfo)
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
              <p className="font-bold">Sucursal donde trabaja: </p>
              {/* <p>{itemInfo.sucursal.nombre}, {itemInfo.sucursal.localidad}</p>
              // FALTA QUE AGREGAR EL SERIALIZAR DE LAS DEMAS ENTIDADES ASI VIENE TODO POPULATED */}
              <p>{itemInfo.sucursal.localidad.nombre}, {itemInfo.sucursal.direccion}</p>
          </section>
          <section className="flex gap-2">
              <p className="font-bold">DNI: </p>
              <p>{itemInfo.dni}</p>
          </section>
          <section className="flex gap-2">
              <p className="font-bold">Email: </p>
              <p>{itemInfo.email}</p>
          </section>
          {/* <section className="flex gap-2">
              <p className="font-bold">Información de contacto: </p>
              <p>{itemInfo.contacto}</p>
          </section> */}
      </section>
  );
}
