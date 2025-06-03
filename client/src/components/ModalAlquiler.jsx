import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";
import {useEffect, useState } from 'react'

const ModalAlquiler = ({alquiler, isOpen, onOpenChange, opcionesFecha}) => {
  const ahora = new Date();
  const [esReserva, setEsReserva] = useState()
  const [fechaFormateadaInicio, setFechaFormateadaInicio] = useState()
  const [fechaFormateadaDevolucion, setFechaFormateadaDevolucion] = useState()
  const [tipo, setTipo] = useState()

  useEffect(() => {
    if (alquiler){
      let fechaInicio = new Date(alquiler.fecha_inicio);
      setEsReserva(fechaInicio > ahora)
      setTipo(esReserva ? "Reserva" : "Alquiler")
      setFechaFormateadaInicio(fechaInicio.toLocaleString('es-AR', opcionesFecha));
      let fechaDevolucion = new Date(alquiler.fecha_devolucion);
      setFechaFormateadaDevolucion(fechaDevolucion.toLocaleString('es-AR', opcionesFecha));
    }
  }, [alquiler])

  return (
    <Modal backdrop="transparent" className="shadow- bg-slate-100" isOpen={isOpen} onOpenChange={onOpenChange}>
                            <ModalContent>
                              {(onClose) => (
                                <>
                                  <ModalHeader className="flex flex-col gap-1">{`${tipo} para el día ${fechaFormateadaInicio}hs`}</ModalHeader>
                                  <ModalBody>
                                  <div className="flex flex-col gap-1">
                                    <div className="flex gap-1 items-center">
                                      <p className="font-semibold">Categoría preferencial:</p>
                                      <p className="text-sm">{alquiler?.categoria_vehiculo.nombre}</p>
                                    </div>
                                    <div className="flex gap-1 items-center">
                                      <p className="font-semibold">Auto asignado:</p>
                                      <p className="text-sm">{alquiler?.vehiculo_asignado ? alquiler.vehiculo_asignado : 'No se confirmó aún el vehículo'}</p>
                                    </div>
                                    <div className="flex gap-1 items-center">
                                      <p className="font-semibold">Fecha de devolucion:</p>
                                      <p className="text-sm">{fechaFormateadaDevolucion}</p>
                                    </div>
                                    <div className="flex gap-1 items-center">
                                      <p className="font-semibold">Precio:</p>
                                      <p className="text-sm">${alquiler?.precio_total}</p>
                                    </div>
                                    <div className="flex gap-1 items-center">
                                      <p className="font-semibold">Sucursal de retiro:</p>
                                      <p className="text-sm">{alquiler?.sucursal_retiro.direccion}, {alquiler?.sucursal_retiro.localidad.nombre}</p>
                                    </div>
                                    { alquiler?.paquetealquiler_set.length > 0 ? (<> <p className="font-semibold">Paquetes asignados:</p>
                                      {alquiler?.paquetealquiler_set.map((e,idx)=>(
                                        <p key={idx} className="text-sm text-grey-800">{e.paquete.nombre}</p>
                                      ))}</>):(<p className="font-semibold text-sm">No se asignaron paquetes de servicio adicionales.</p>)}
                                   
                                  </div>
                                  </ModalBody>
                                  <ModalFooter>
                                    <Button color="danger" variant="light" onPress={onClose}>
                                      Cerrar
                                    </Button>
                                  </ModalFooter>
                                </>
                              )}
                            </ModalContent>
                          </Modal>
  )
}

export default ModalAlquiler