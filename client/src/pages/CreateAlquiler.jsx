import { useForm } from 'react-hook-form';
import { useLocation } from "react-router-dom";
import axios from 'axios';
import { useState, useEffect } from 'react'
import Topbar from '../components/Topbar'
import {
  Card,
  CardBody,
  CardHeader,
  Input,
  Button,
  SelectItem,
  Select
} from '@heroui/react';

export default function AlquilerForm() {
  const location = useLocation();
  // En caso de haberse submiteado el formulario de Home, se obtiene la data, Pero si se apretó en el botón de la topbar, no hay data que obtener.
  // Si location.state esta definido lo retorna sino devuelve un objeto vacio, y si no hay un formData dentro del mismo entonces es vacío.
  const { formData = {} } = location.state || {};
  
  // Numero de días entre fecha de inicio y devolucion (calculados) (esto es únicamente a modo de info para el cliente)
  const [diasCalculados, setDiasCalculados] = useState(null);

  // No use nunca useForm, asi que no se muy bien como funciona todo esto. Si formData tiene valores definidos los setea default
  // y sino los deja vacíos.
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      fecha_inicio: formData.fecha_inicio || "",
      fecha_devolucion: formData.fecha_devolucion || "",
      sucursal_retiro: formData.sucursal_retiro || "",
    }});
  
  // watch es una funcion de react-hook-form, no se muy bien qué hace pero watchea valores calculo, se tienen que watchear para que cada vez que cambien actualice un estimado de días.
  const fechaInicio = watch("fecha_inicio");
  const fechaDevolucion = watch("fecha_devolucion");

  // se submitea.
  const onSubmit = async (data) => {
    try {
      await axios.post('http://localhost:8000/alquilapp/api/v1/alquileres/', data);
      alert('Alquiler creado exitosamente');
    } catch (error) {
      console.error('Error al crear alquiler', error);
      alert('Error al crear alquiler');
    }
  };

  // funcion de calculo de días, retorna el número o en todo caso el string de inválido.
  const calcularDias = (inicio, fin) => {
    const start = new Date(inicio);
    const end = new Date(fin);
    const diffTime = end - start;
  
    if (diffTime <= 0) return 'Fecha inválida';
  
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // cada vez que se cambie la fecha de inicio o devolucion, se vuelve a ejecutar la cantidad de dias del alquiler.
  useEffect(() => {
    if (formData.fecha_inicio && formData.fecha_devolucion) {
      const dias = calcularDias(fechaInicio, fechaDevolucion);
      setDiasCalculados(dias);
    }
  }, [fechaInicio, fechaDevolucion]);

  return (
    <div className="bg-[url(/../commons/obi-aZKJEvydrNM-unsplash.jpg)] min-h-screen bg-cover flex items-center relative">
      <div className="absolute top-0 left-0 w-full h-full bg-black/40 " />
      <Topbar />
      <Card className="max-w-2xl mx-auto mt-10 bg-background/60 p-6" isBlurred>
        <CardHeader>
          <h2 className="text-xl font-semibold">{formData.fecha_inicio ? 'Confirmar Alquiler (2/2)' : 'Solicitar Alquiler'}</h2>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Fecha Inicio</label>
                <Input type="datetime-local" {...register("fecha_inicio", { required: true })} />
                {errors.fecha_inicio && (
                  <span className="text-red-500 text-sm">Este campo es requerido</span>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Fecha Devolución
                </label>
                <Input type="datetime-local" {...register("fecha_devolucion", { required: true })}/>
                {errors.fecha_devolucion && (
                  <span className="text-red-500 text-sm">Este campo es requerido</span>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Sucursal de Retiro</label>
              <Input {...register("sucursal_retiro", { required: true })} />
              {errors.sucursal_retiro && (
                <span className="text-red-500 text-sm">Este campo es requerido</span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Categoría de Vehículo</label>
              <Select {...register("categoria_vehiculo", { required: true })} aria-label="Seleccionar categoría">
                <SelectItem key="economico" value="economico">Económico</SelectItem>
                <SelectItem key="intermedio" value="intermedio">Intermedio</SelectItem>
                <SelectItem key="suv" value="suv">SUV</SelectItem>
                <SelectItem key="lujo" value="lujo">Lujo</SelectItem>
              </Select>
              {errors.categoria_vehiculo && (
                <span className="text-red-500 text-sm">Este campo es requerido</span>
              )}
            </div>
            <div className="flex gap-2 justify-content-between">
              <div className="w-full">
                <label className="block text-sm font-medium mb-1">Cantidad de días</label>
                <p className="text-lg font-semibold">{diasCalculados}</p>
              </div>
              <div className="w-full">
                <label className="block text-sm font-medium mb-1">Precio estimado</label>
                <p className="text-lg font-semibold">$9</p>
              </div>
            </div>
              <Button type="submit" className="w-full">
                Confirmar Alquiler
              </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
