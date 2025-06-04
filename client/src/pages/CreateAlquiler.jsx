import { useForm, Controller } from 'react-hook-form'
import { useLocation } from 'react-router-dom'
import axios from 'axios'
import { useState, useEffect } from 'react'
import Topbar from '../components/Topbar'
import RequiredIcon from '../components/RequiredIcon'
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
	CheckboxGroup,
	useDisclosure,
} from '@heroui/react'
import { useAuth } from '../contexts/AuthContext'
import PaymentForm from '../components/PaymentForm'
import { useRent } from '../contexts/RentContext'

export default function AlquilerForm() {
	const [sucursales, setSucursales] = useState([])
	const [categorias, setCategorias] = useState([])
	//const [sucursalPrecargada, setSucursalPrecargada] = useState(null)
	const [paquetes, setPaquetes] = useState([])
	const [isFetching, setIsFetching] = useState(true)
	const { isAuthenticated, user } = useAuth()

	const [alquilerData, setAlquilerData] = useState()
	// En caso de haberse submiteado el formulario de Home, se obtiene la data, Pero si se apretó en el botón de la topbar, no hay data que obtener.
	// Si location.state esta definido lo retorna sino devuelve un objeto vacio, y si no hay un formData dentro del mismo entonces es vacío.

	const { rentBasic, haveRentBasic, setRentBasic } = useRent()

	// Numero de días entre fecha de inicio y devolucion (esto es únicamente a modo de info para el cliente).
	// Además, calcula el precio estimado según categoria de vehículo, paquetes seleccionados (FALTA), y cantidad de días calculados.
	const [diasCalculados, setDiasCalculados] = useState(null)
	const [precioEstimado, setPrecioEstimado] = useState(null)
	const [alquilerData, setAlquilerData] = useState()

	const { isOpen, onOpen, onOpenChange } = useDisclosure()

	// Si formData tiene valores definidos los setea default el useForm (a partir de aca ya se usa el react-hook-form, formData es sólo la parte "anterior")
	// y sino los deja vacíos.
	const {
		register,
		handleSubmit,
		watch,
		control,
		formState: { errors },
		setValue,
	} = useForm({
		defaultValues: {
			fecha_inicio: '',
			fecha_devolucion: '',
			sucursal_retiro_id: '', // LA SUCURSAL SE CARGA MANUALMENTE CON EL FORMDATA UNA VEZ HECHO EL GET DE SUCURSALES.
			categoria_vehiculo_id: '',
			paquetes: [],
			precio_total: '',
		},
	})

	// ______ FUNCIONES DE FETCH
	const fetchSucursales = async () => {
		try {
			setIsFetching(true)
			const response = await axios.get(
				'http://localhost:8000/alquilapp/api/v1/sucursales/populated/'
			)
			return response.data
		} catch (error) {
			console.error('Error al obtener sucursales:', error)
			throw error
		} finally {
			setIsFetching(false)
		}
	}
	const fetchCategorias = async () => {
		try {
			setIsFetching(true)
			const response = await axios.get(
				'http://localhost:8000/alquilapp/api/v1/categorias/'
			)
			return response.data
		} catch (error) {
			console.error('Error al obtener paquetes:', error)
			throw error
		} finally {
			setIsFetching(false)
		}
	}
	const fetchPaquetes = async () => {
		try {
			setIsFetching(true)
			const response = await axios.get(
				'http://localhost:8000/alquilapp/api/v1/paquetes/'
			)
			return response.data
		} catch (error) {
			console.error('Error al obtener paquetes:', error)
			throw error
		} finally {
			setIsFetching(false)
		}
	}
	const sucursalRetiro = watch('sucursal_retiro_id')
	// _______ CARGA DE DATOS USANDO LOS FETCH PREVIOS.
	useEffect(() => {
		if (haveRentBasic) {
			//console.log(rentBasic,'RENT')
			setValue('fecha_inicio', rentBasic.fecha_entrega || '')
			setValue('fecha_devolucion', rentBasic.fecha_devolucion || '')
		}
		const valorSucursal = watch('sucursal_retiro_id')
		Promise.all([fetchSucursales(), fetchCategorias(), fetchPaquetes()])
			.then(values => {
				setSucursales(values[0])
				setCategorias(values[1])
				setPaquetes(values[2])
				setValue('sucursal_retiro_id', rentBasic?.sucursal || '')
				// console.log(rentBasic.sucursal, 'VALUE DEL RENTBASIC')
				//console.log(sucursalRetiro, 'VALUE DEL USEFORM')
			})
			.catch(error => {
				console.log(error)
				alert('Ocurrió un error al cargar los datos.')
			})
			.finally(() => {
				setIsFetching(false)
			})
	}, [])
	// YA SE FETCHEO LO NECESARIO, Y YA SE SETEARON EN REACT-HOOK-FORMS LOS VALORES PREVIOS SI ES QUE LOS HUBO, A PARTIR DE AHORA SE REGISTRAN Y SE MANEJAN
	// CAMPOS DE REACT-HOOK-FORM
	// watch es una funcion de react-hook-form, necesito watchear estos elementos para que cada vez que cambien, se reactualicen precios, etc.
	const fechaInicio = watch('fecha_inicio')
	const fechaDevolucion = watch('fecha_devolucion')
	const categoriaVehiculo = watch('categoria_vehiculo_id')
	const paquetesSeleccionados = watch('paquetes')

	// se submitea.
	const onSubmit = async data => {
		data['cliente'] = user.clientId
		setAlquilerData(data)
		console.log(data, 'INFO QUE SE ENVIA')
		try {
			// ACA VA LA LOGICA DEL PAGO.
			// CUANDO SEA SUCCESS, SE HACE EL POST.
			onOpen()
			setRentBasic(null)
		} catch (error) {
			console.error('Error al crear alquiler', error)
			alert('Error al crear alquiler')
		}
	}

	// funcion de calculo de días, retorna el número o en todo caso el string de inválido.
	const calcularDias = (inicio, fin) => {
		const start = new Date(inicio)
		const end = new Date(fin)
		const diffTime = end - start
		if (diffTime <= 0) return 'Fecha inválida'
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
		return diffDays
	}

	const getNowForInput = () => {
		const now = new Date()
		now.setSeconds(0, 0) // limpiamos segundos y milisegundos
		now.setHours(now.getHours() - 3) // retorna una hora en un timezone raro, tengo que restarle 3 para que se acople a la local.
		return now.toISOString().slice(0, 16) // formato: 'YYYY-MM-DDTHH:MM'
	}

	// cada vez que se cambie la fecha de inicio, devolucion, categoría o paquetesSeleccionados se vuelve a ejecutar:
	// La cantidad de días del alquiler calculada.
	// El precio estimado según paquetes seleccionados, categoria seleccionada y cantidad de dias determinado.
	useEffect(() => {
		if (fechaInicio && fechaDevolucion) {
			const dias = calcularDias(fechaInicio, fechaDevolucion)
			setDiasCalculados(dias)
		}
		if (diasCalculados > 0 && categoriaVehiculo) {
			const precio = calcularPrecio(
				diasCalculados,
				categoriaVehiculo,
				paquetesSeleccionados
			)
			setPrecioEstimado(precio)
			setValue('precio_total', precio)
		}
	}, [fechaInicio, fechaDevolucion, categoriaVehiculo, paquetesSeleccionados])

	const calcularPrecio = (dias, categoria, paquetesSeleccionados = []) => {
		// Buscar la categoría en el array de categorías fetcheado
		const categoriaSeleccionada = categorias.find(c => c.id == categoria)
		// Si no se encontró, usamos 0 como precio por día (o lanzar error)
		const precioPorDia = categoriaSeleccionada
			? parseFloat(categoriaSeleccionada.precio)
			: 0
		const precioBase = Number(dias) * precioPorDia
		// FILTRA TODOS LOS PAQUETES SELECCIONADOS, Y SUMA TODO EN PRECIOPAQUETES, LUEGO SE SUMA AL PRECIO BASE CALCULADO.
		const precioPaquetes = paquetes
			.filter(p => paquetesSeleccionados.includes(p.id))
			.reduce((acc, p) => acc + parseFloat(p.costo), 0)
		return precioBase + precioPaquetes
	}

	return (
		<div className='bg-[url(/../commons/obi-aZKJEvydrNM-unsplash.jpg)] min-h-screen bg-cover flex items-center relative'>
			<div className='absolute top-0 left-0 w-full h-full bg-black/40 ' />
			<Topbar />
			{isAuthenticated ? (
				isFetching ? (
					'cargando'
				) : (
					<>
						<PaymentForm
							isOpen={isOpen}
							onOpenChange={onOpenChange}
							alquilerData={alquilerData}
						/>
						<Card
							className='min-w-[500px] max-w-4xl mx-auto mt-[82px] mb-[28px] bg-background/60 p-3'
							isBlurred
						>
							<CardHeader>
								{/* Si formData estaba cargado, Se muestra mostrar alquiler, sino se muestra otro titulo más acorde. */}
								<h2 className='text-xl font-semibold'>
									{rentBasic?.fecha_entrega
										? 'Confirmar Alquiler'
										: 'Solicitar Alquiler'}
								</h2>
							</CardHeader>
							<CardBody>
								<form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
									<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
										<div>
											<label className='block text-sm font-medium mb-1'>
												Fecha Inicio
												<RequiredIcon />
											</label>
											<Input
												type='datetime-local'
												min={getNowForInput()}
												{...register('fecha_inicio', {
													required: true,
													validate: value => {
														const now = new Date()
														const selected = new Date(value)
														return (
															selected >= now ||
															'La fecha de entrega no puede ser anterior a hoy'
														)
													},
												})}
											/>
											{errors.fecha_inicio && (
												<span className='text-red-500 text-sm'>
													Seleccioná una fecha inicial.
												</span>
											)}
										</div>
										<div>
											<label className='block text-sm font-medium mb-1'>
												Fecha Devolución
												<RequiredIcon />
											</label>
											<Input
												type='datetime-local'
												min={fechaInicio}
												disabled={!fechaInicio}
												className={
													!fechaInicio ? 'opacity-50 cursor-not-allowed' : ''
												}
												{...register('fecha_devolucion', {
													required: true,
													validate: value => {
														const start = new Date(fechaInicio)
														const end = new Date(value)
														return (
															end > start ||
															'La devolución debe ser posterior a la entrega'
														)
													},
												})}
											/>
											{errors.fecha_devolucion && (
												<span className='text-red-500 text-sm'>
													Seleccioná una fecha de devolución válida.
												</span>
											)}
										</div>
									</div>
									<div>
										<label className='block text-sm font-medium mb-1'>
											Sucursal de Retiro
											<RequiredIcon />
										</label>
										<Select
											size='sm'
											{...register('sucursal_retiro_id', {
												required: true,
											})}
											aria-label='Seleccionar sucursal'
											label='Seleccione una sucursal'
											// onChange={(e)=>{
											//   console.log(e)
											// }}
											defaultSelectedKeys={[rentBasic?.sucursal.toString()]}
										>
											{sucursales.map(s => {
												const value = `${s.direccion}, ${s.localidad.nombre}`
												return (
													<SelectItem key={s.id} value={s.id}>
														{value}
													</SelectItem>
												)
											})}
										</Select>
										{errors.sucursal_retiro_id && (
											<span className='text-red-500 text-sm'>
												Es necesario que indique una sucursal de retiro.
											</span>
										)}
									</div>
									<div>
										<label className='block text-sm font-medium mb-1'>
											Categoría de Vehículo
											<RequiredIcon />
										</label>
										<Select
											size='sm'
											{...register('categoria_vehiculo_id', { required: true })}
											aria-label='Seleccionar categoría'
											label='Seleccione una categoría preferencial'
										>
											{categorias.map(c => {
												return (
													<SelectItem key={c.id} value={Number(c.id)}>
														{c.nombre}
													</SelectItem>
												)
											})}
										</Select>
										{errors.categoria_vehiculo_id && (
											<span className='text-red-500 text-sm'>
												Es necesario que indique una categoría preferencial.
											</span>
										)}
									</div>
									<div>
										<div className='flex flex-col gap-3'>
											<Controller
												control={control}
												name='paquetes'
												defaultValue={[]} // array de IDs seleccionados
												render={({ field }) => (
													<div>
														<label className='block text-sm font-medium mb-2'>
															Paquetes opcionales
														</label>
														<CheckboxGroup
															color='secondary'
															value={field.value}
															onValueChange={field.onChange}
															className='space-y-2'
														>
															{paquetes.map(paquete => (
																<Checkbox
																	size='sm'
																	key={paquete.id}
																	value={paquete.id}
																	classNames={{
																		base: cn('font-semibold'),
																		label: 'w-full',
																	}}
																>
																	{paquete.nombre} ($
																	{paquete.costo})
																	<p className='text-sm font-normal text-gray-800 pl-5'>
																		{paquete.descripcion}
																	</p>
																</Checkbox>
															))}
														</CheckboxGroup>
													</div>
												)}
											/>
										</div>
									</div>
									<div className='flex gap-2 justify-content-between'>
										<div className='w-full'>
											<label className='block text-sm font-medium mb-1'>
												Cantidad de días
											</label>
											<p className='text-lg font-semibold'>
												{diasCalculados ? diasCalculados : '-'}
											</p>
										</div>
										<div className='w-full'>
											<label className='block text-sm font-medium mb-1'>
												Precio estimado
											</label>
											<p className='text-lg font-semibold'>
												{precioEstimado ? `$${precioEstimado}` : '-'}
											</p>
										</div>
									</div>
									<Button
										className='text-white w-full'
										color='secondary'
										type='submit'
									>
										Proceder al pago
									</Button>
								</form>
							</CardBody>
						</Card>
					</>
				)
			) : (
				<Card className='p-5'>No tenes permisos</Card>
			)}
		</div>
	)
}
