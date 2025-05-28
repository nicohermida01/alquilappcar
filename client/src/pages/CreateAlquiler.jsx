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
import { useAuth } from '../contexts/AuthContext';

export default function AlquilerForm() {
  const [sucursales, setSucursales] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const { isAuthenticated, user } = useAuth();

  const fetchSucursales = async () => {
    try {
      setIsFetching(true);
      const response = await axios.get('http://localhost:8000/alquilapp/api/v1/sucursales/populated/');
      return response.data;
    } catch (error) {
      console.error('Error al obtener sucursales:', error);
      throw error;
    } finally {
      setIsFetching(false);
    }
  };

 useEffect(() => {
  const cargarSucursales = async () => {
    try {
      const data = await fetchSucursales();
      setSucursales(data);
      console.log(data, 'HOLA')
    } catch (error) {
      alert('Error al cargar las sucursales.');
    }
  };
  cargarSucursales();
}, []);

  // En caso de haberse submiteado el formulario de Home, se obtiene la data, Pero si se apretó en el botón de la topbar, no hay data que obtener.
  // Si location.state esta definido lo retorna sino devuelve un objeto vacio, y si no hay un formData dentro del mismo entonces es vacío.
  const location = useLocation();
  const { formData = {} } = location.state || {};
  
  // Numero de días entre fecha de inicio y devolucion (esto es únicamente a modo de info para el cliente).
  // Además, calcula el precio estimado según categoria de vehículo, paquetes seleccionados (FALTA), y cantidad de días calculados.
  const [diasCalculados, setDiasCalculados] = useState(null);
  const [precioEstimado, setPrecioEstimado] = useState(null);

  // Si formData tiene valores definidos los setea default el useForm (a partir de aca ya se usa el react-hook-form, formData es sólo la parte "anterior")
  // y sino los deja vacíos.
  const { register, handleSubmit, watch, formState: { errors } } = useForm({
    defaultValues: {
      fecha_entrega: formData.fecha_entrega || "",
      fecha_devolucion: formData.fecha_devolucion || "",
      sucursal: formData.sucursal || "",
      categoria_vehiculo: ""
    }});
  
  // watch es una funcion de react-hook-form, necesito watchear estos elementos para que cada vez que cambien, se reactualicen precios, etc.
  const fechaInicio = watch("fecha_entrega");
  const fechaDevolucion = watch("fecha_devolucion");
  const categoriaVehiculo = watch("categoria_vehiculo");

  // se submitea.
  const onSubmit = async (data) => {
    const now = new Date();
    const start = new Date(data.fecha_entrega);
    const end = new Date(data.fecha_devolucion);
    if (start && end) {
      if (start < now) {
        alert("La fecha de entrega no puede ser anterior a la fecha actual.");
        return;
      }
      if (end <= start) {
        alert("La fecha de devolución debe ser posterior a la de entrega.");
        return;
      }
      //const dias = calcularDias(fechaInicio, fechaDevolucion);
      //setDiasCalculados(dias);
      const precio = calcularPrecio(diasCalculados, formData.categoria_vehiculo);
      setPrecioEstimado(precio);
      if (diasCalculados > 0 && formData.categoria_vehiculo) {
      }
    }
    //console.log(data, 'INFO FORM')
    // TRAER EL ID DE LA SESION Y PONERLO EN DATA.
    console.log(user,'UYSER')
    data['client_id'] = user.clientId;
    console.log(data, 'INFOFORM');
    try {
      // ACA VA LA LOGICA DEL PAGO.
      // CUANDO SEA SUCCESS, SE HACE EL POST.
      //await axios.post('http://localhost:8000/alquilapp/api/v1/alquileres/', data);
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

  // cada vez que se cambie la fecha de inicio, devolucion, o categoría seleccionada se vuelve a ejecutar:
  // La cantidad de días del alquiler.
  // El precio estimado.
  useEffect(() => {
    if (fechaInicio && fechaDevolucion) {
      const dias = calcularDias(fechaInicio, fechaDevolucion);
      console.log(dias, 'DIAS CALCULADOS')
      setDiasCalculados(dias);
    }
    if (diasCalculados > 0 && categoriaVehiculo) {
      const precio = calcularPrecio(diasCalculados, categoriaVehiculo);
      console.log(precio, 'HOLAAA')
      setPrecioEstimado(precio);
    }
  }, [fechaInicio, fechaDevolucion, categoriaVehiculo]);

  const calcularPrecio = (dias, categoria = "economico") => {
    // EJEMPLO DE PRECIOS, HAY QUE FETCHEAR PRECIO DE CATEGORIA.
    // HAY QUE FETCHEAR Y CALCULAR TAMBIEN PAQUETES EXTRA.
    const preciosBase = {
      economico: 5000,
      intermedio: 7500,
      suv: 10000,
      lujo: 15000
    };
  
    const precioPorDia = preciosBase[categoria] || 5000;
    return diasCalculados * precioPorDia;
  };

  // Necesito hacer una funcion que calcule un mínimo para deshabilitar fechas viejas en el input de fecha_entrega.
  const getNowForInput = () => {
    const now = new Date();
    now.setSeconds(0, 0); // limpiamos segundos y milisegundos
    now.setHours(now.getHours() - 3); // retorna una hora en un timezone raro, tengo que restarle 3 para que se acople a la local.
    return now.toISOString().slice(0, 16); // formato: 'YYYY-MM-DDTHH:MM'
  };
  //if(!isAuthenticated) return 'No estas logueado'
  return (
    <div className="bg-[url(/../commons/obi-aZKJEvydrNM-unsplash.jpg)] min-h-screen bg-cover flex items-center relative">
      <div className="absolute top-0 left-0 w-full h-full bg-black/40 " />
      <Topbar />
      {isAuthenticated ? (<Card className="max-w-2xl mx-auto mt-10 bg-background/60 p-6" isBlurred>
        <CardHeader>
          {/* Si formData estaba cargado, Se muestra mostrar alquiler, sino se muestra otro titulo más acorde. */}
          <h2 className="text-xl font-semibold">{formData.fecha_entrega ? 'Confirmar Alquiler' : 'Solicitar Alquiler'}</h2>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Fecha Inicio</label>
                <Input type="datetime-local" min={getNowForInput()} {...register("fecha_entrega", { required: true,
                  validate: value => {
                    const now = new Date();
                    const selected = new Date(value);
                    return selected >= now || "La fecha de entrega no puede ser anterior a hoy";
                  },
                 })} />
                {errors.fecha_entrega && (
                  <span className="text-red-500 text-sm">Este campo es requerido</span>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Fecha Devolución
                </label>
                <Input type="datetime-local" min={fechaInicio} disabled={!fechaInicio} className={!fechaInicio ? "opacity-50 cursor-not-allowed" : ""} {...register("fecha_devolucion", { required: true, 
                  validate: value => {
                    const start = new Date(fechaInicio);
                    const end = new Date(value);
                    return end > start || "La devolución debe ser posterior a la entrega";
                  }
                })}/>
                {errors.fecha_devolucion && (
                  <span className="text-red-500 text-sm">Este campo es requerido</span>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Sucursal de Retiro</label>
              {/* <Select {...register("sucursal", { required: true })} aria-label="Seleccionar sucursal">
                <SelectItem key="Tolosa" value="Tolosa">Tolosa</SelectItem>
                <SelectItem key="Avellaneda" value="Avellaneda">Avellaneda</SelectItem>
                <SelectItem key="Mar del Plata" value="Mar del Plata">Mar del Plata</SelectItem>
              </Select> */}
               <Select {...register("sucursal", { required: true })} aria-label="Seleccionar sucursal" label="Seleccione una sucursal" selectedKeys={formData.sucursal}>
                {sucursales.map((s)=>{
                  console.log(s.id == formData.sucursal, 'AAA');
                    const value = `${s.direccion}, ${s.localidad.nombre}`;
                  return <SelectItem key={s.id} value={s.id}>{value}</SelectItem>
                }
                )}
                <SelectItem value="hola">test</SelectItem>
          </Select>
              {errors.sucursal && (
                <span className="text-red-500 text-sm">Este campo es requerido</span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Categoría de Vehículo</label>
              <Select {...register("categoria_vehiculo", { required: true })} aria-label="Seleccionar categoría">
                <SelectItem key="chico" value="Chico">Chico</SelectItem>
                <SelectItem key="mediano" value="Mediano">Mediano</SelectItem>
                <SelectItem key="suv" value="SUV">SUV</SelectItem>
                <SelectItem key="deportivo" value="Deportivo">Deportivo</SelectItem>
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
                <p className="text-lg font-semibold">{precioEstimado}</p>
              </div>
            </div>
              <Button className='text-white w-full' color='secondary' type='submit'>
                Confirmar Alquiler
              </Button>
          </form>
        </CardBody>
      </Card>):(<Card className="p-5">No tenes permisos</Card>)}
    </div>
  );
}
