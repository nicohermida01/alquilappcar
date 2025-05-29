import { useForm, Controller } from 'react-hook-form';
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
  Select,
  Checkbox,
  cn,
  CheckboxGroup
} from '@heroui/react';
import { useAuth } from '../contexts/AuthContext';

export default function AlquilerForm() {
  const [sucursales, setSucursales] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [paquetes, setPaquetes] = useState([]);
  // CREO QEU NO ES NECESARIO
  // const [paquetesSeleccionados, setPaquetesSeleccionados] = useState([]);
  // const togglePaquete = (id) => {
  //   setSelectedPaquetes((prev) =>
  //     prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
  //   );
  // };
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

  const fetchCategorias = async () => {
    try {
      setIsFetching(true);
      const response = await axios.get('http://localhost:8000/alquilapp/api/v1/categorias/');
      return response.data;
    } catch (error) {
      console.error('Error al obtener paquetes:', error);
      throw error;
    } finally {
      setIsFetching(false);
    }
  };

  const fetchPaquetes = async () => {
    try {
      setIsFetching(true);
      const response = await axios.get('http://localhost:8000/alquilapp/api/v1/paquetes/');
      return response.data;
    } catch (error) {
      console.error('Error al obtener paquetes:', error);
      throw error;
    } finally {
      setIsFetching(false);
    }
  };

 useEffect(() => {
  const cargarDatos = async () => {
    try {
      const [sucursalesData, categoriasData, paquetesData] = await Promise.all([
        fetchSucursales(),
        fetchCategorias(),
        fetchPaquetes()
      ]);
      setSucursales(sucursalesData);
      setCategorias(categoriasData);
      setPaquetes(paquetesData);
    } catch (error) {
      console.log(error)
      alert('Ocurrió un error al cargar los datos.');
    } finally {
      setIsFetching(false); // Solo se oculta el loader cuando todo termina
    }
  };
  cargarDatos();
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
  const { register, handleSubmit, watch, control, formState: { errors } } = useForm({
    defaultValues: {
      fecha_entrega: formData.fecha_entrega || "",
      fecha_devolucion: formData.fecha_devolucion || "",
      sucursal: formData.sucursal || "",
      categoria_vehiculo: "",
      paquetes: [],
    }});
  
  // watch es una funcion de react-hook-form, necesito watchear estos elementos para que cada vez que cambien, se reactualicen precios, etc.
  const fechaInicio = watch("fecha_entrega");
  const fechaDevolucion = watch("fecha_devolucion");
  const categoriaVehiculo = watch("categoria_vehiculo");
  const paquetesSeleccionados = watch("paquetes");

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
    data['client_id'] = user.clientId;
    console.log(data, 'INFOFORM');
    try {
      // console.log(user,'UYSER')
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
      setDiasCalculados(dias);
    }
    if (diasCalculados > 0 && categoriaVehiculo) {
      const precio = calcularPrecio(diasCalculados, categoriaVehiculo, paquetesSeleccionados);
      setPrecioEstimado(precio);
    }
  }, [fechaInicio, fechaDevolucion, categoriaVehiculo, paquetesSeleccionados]);

  const calcularPrecio = (dias, categoria, paquetesSeleccionados = []) => {
  // Buscar la categoría en el array de categorías fetcheado
  const categoriaSeleccionada = categorias.find((c) => c.id == categoria);
  // Si no se encontró, usamos 0 como precio por día (o podrías lanzar error)
  const precioPorDia = categoriaSeleccionada ? parseFloat(categoriaSeleccionada.precio) : 0;
  // console.log(precioPorDia,'COSTO DIARIO DE CATEGORIA');
  const precioBase = Number(dias) * precioPorDia;
  const precioPaquetes = paquetes
    .filter((p) => paquetesSeleccionados.includes(p.id))
    .reduce((acc, p) => acc + parseFloat(p.costo), 0);
  console.log('PRECIO PAQEUTES SELECCIONADOS ', precioPaquetes);
  console.log(precioBase + precioPaquetes, 'PRECIO TOTAL');
  return precioBase + precioPaquetes;
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
      {isAuthenticated ? isFetching ? ('cargando'):(<Card className="min-w-[500px] max-w-4xl mx-auto mt-[82px] mb-[28px] bg-background/60 p-3" isBlurred>
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
                <Select size="sm" {...register("sucursal", { required: true })} aria-label="Seleccionar sucursal" label="Seleccione una sucursal">
                  {sucursales.map((s)=>{
                      const value = `${s.direccion}, ${s.localidad.nombre}`;
                    return <SelectItem key={s.id} value={s.id}>{value}</SelectItem>
                  }
                  )}
                </Select>
              {errors.sucursal && (
              <span className="text-red-500 text-sm">Este campo es requerido</span>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Categoría de Vehículo</label>
              <Select size="sm" {...register("categoria_vehiculo", { required: true })} aria-label="Seleccionar categoría" label="Seleccione una categoría preferencial">
                {categorias.map((c)=>{
                  return <SelectItem key={c.id} value={Number(c.id)}>{c.nombre}</SelectItem>
                }
                )}
              </Select>
              {errors.categoria_vehiculo && (
                <span className="text-red-500 text-sm">Este campo es requerido</span>
              )}
            </div>
          <div>
            <div className="flex flex-col gap-3">
              <Controller
                control={control}
                name="paquetes"
                defaultValue={[]} // array de IDs seleccionados
                render={({ field }) => (
                  <div>
                    <label className="block text-sm font-medium mb-2">Paquetes opcionales</label>
                    <CheckboxGroup
                      color="secondary"
                      value={field.value}
                      onValueChange={field.onChange}
                      className="space-y-2"
                    >
                      {paquetes.map((paquete) => (
                        <Checkbox size="sm" key={paquete.id} value={paquete.id} classNames={{
                          base: cn(
                            "font-semibold",
                          ),
                          label: "w-full",
                        }}>
                          {paquete.nombre} (${paquete.costo})
                          <p className="text-sm font-normal text-gray-800 pl-5">{paquete.descripcion}</p>
                        </Checkbox>
                      ))}
                    </CheckboxGroup>
                  </div>
                )}
              />
            </div>
          </div>
          <div className="flex gap-2 justify-content-between">
            <div className="w-full">
              <label className="block text-sm font-medium mb-1">Cantidad de días</label>
              <p className="text-lg font-semibold">{diasCalculados ? diasCalculados : '-'}</p>
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium mb-1">Precio estimado</label>
              <p className="text-lg font-semibold">{precioEstimado ? `$${precioEstimado}` : '-'}</p>
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
