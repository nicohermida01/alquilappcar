import FieldCard from "./FieldCard"
import { usersApi } from "../services/users.api"
import { useState, useEffect } from 'react'
import { useAuth } from "../contexts/AuthContext"
import axios from 'axios';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";
import ModalAlquiler from '../components/ModalAlquiler'

function UserAlquileres() {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  const { user } = useAuth();
  const [alquileres, setAlquileres] = useState([]);
  const [alquilerSeleccionado, setAlquilerSeleccionado] = useState();
  
  useEffect(() => {
    usersApi.getAlquileresByUserId(user.clientId)
    .then((response) => setAlquileres(response))
    .catch((error) => console.error(error))
  }, []);
  const ahora = new Date();
  const opcionesFecha = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'America/Argentina/Buenos_Aires'
  };
  
  const handleDarDeBaja = async (idAlquiler) => {
    try {
      await axios.patch(`http://localhost:8000/alquilapp/api/v1/alquileres/${idAlquiler}/`, {
        activo: false,
      });

      alert('Alquiler dado de baja correctamente, DEBERIA HABER UN MODAL DE HEROUI');
      setAlquileres(prev => prev.filter(alq => alq.id !== idAlquiler));
    } catch (error) {
      console.error('Error al dar de baja el alquiler', error);
      alert('Hubo un error al dar de baja el alquiler');
    }
  };

  const handleOpen = (alquiler) => {
    //console.log(alquiler, 'ALQUILER')
    setAlquilerSeleccionado(alquiler);
    onOpen()
  }
    return (
        <div className="mt-16 ml-[10%]">
          <ModalAlquiler alquiler={alquilerSeleccionado} isOpen={isOpen} onOpenChange={onOpenChange} opcionesFecha={opcionesFecha}/>
            <div className="flex flex-col gap-3">
                {alquileres.length > 0 ? alquileres.map(alquiler => {
                    const fechaInicio = new Date(alquiler.fecha_inicio);
                    const fechaDevolucion = new Date(alquiler.fecha_devolucion);
                    const esReserva = fechaInicio > ahora;
                    const tipo = esReserva ? "Reserva" : "Alquiler";
                    const fechaFormateadaInicio = fechaInicio.toLocaleString('es-AR', opcionesFecha);
                    const fechaFormateadaDevolucion = fechaDevolucion.toLocaleString('es-AR', opcionesFecha);
                    return (
                      <div key={alquiler.id}>
                        <div className="flex flex-col rounded-2xl p-4 bg-white">
                          <div className="flex gap-2 items-center text-lg">
                            <h3 className="font-semibold">{`${tipo} para la fecha ${fechaFormateadaInicio}hs`}</h3>
                            <Button onPress={()=> handleOpen(alquiler)} color="primary" size="sm" className="text-white font-semibold">Ver detalle</Button>
                            { esReserva && (
                              <Button onPress={() => handleDarDeBaja(alquiler.id)} color="danger" size="sm" className="text-white font-semibold">Cancelar reserva</Button>
                              )}
                          </div>
                          <div className="flex flex-col gap-1">
                            <div className="flex gap-5">
                              <div className="flex gap-1 items-center">
                                <p className="font-semibold">Categoría preferencial:</p>
                                <p className="text-sm">{alquiler.categoria_vehiculo.nombre}</p>
                              </div>
                            </div>
                            <div className="flex gap-1 items-center">
                                <p className="font-semibold">Fecha de devolucion:</p>
                                <p className="text-sm">{fechaFormateadaDevolucion}</p>
                            </div>
                            <div className="flex gap-1 items-center">
                                <p className="font-semibold">Sucursal de retiro:</p>
                                <p className="text-sm">{alquiler.sucursal_retiro.direccion}, {alquiler.sucursal_retiro.localidad.nombre}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                  )})
                : <p>No se encuentran alquileres realizados.</p>}
            </div>
        </div>
    );
}

export default UserAlquileres;
