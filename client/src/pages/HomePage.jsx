import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Topbar from '../components/Topbar'
import { Button, Card, CardBody, Form, Input } from '@heroui/react'

function HomePage() {
	// Seteo el navigate de react para poder redireccionar a otra url enviando datos.
	const navigate = useNavigate()

	const [action, setAction] = useState(null)

	// seteo un formData con los valores actuales.
	const [formData, setFormData] = useState({
		fecha_inicio: '',
		fecha_devolucion: '',
		sucursal_retiro: '',
	})

	// Cada vez que cambie un input se actualiza el objeto.
	const handleChange = e => {
		const { name, value } = e.target
		setFormData(prev => ({ ...prev, [name]: value }))
	}

	return (
		<div
			id='body'
			className='bg-[url(/../commons/obi-aZKJEvydrNM-unsplash.jpg)] min-h-screen bg-cover flex items-center relative'
		>
			<div className='absolute top-0 left-0 w-full h-full bg-black/40 ' />
			<Topbar />
			<div className='w-[70%] mx-auto z-10'>
				<h1 className='text-white font-bold text-left text-5xl mb-4'>
					Maneja tu camino <br /> con nosotros
				</h1>
				<Card className='bg-background/60' isBlurred>
					<CardBody className='gap-4 p-10'>
						<h2 className='font-bold text-2xl'>
							¡Alquila tu vehículo ya! (1/2)
						</h2>
						<Form
							className='w-full flex flex-col gap-4'
							onReset={() => setAction('reset')}
							onSubmit={e => {
								e.preventDefault()
								let data = Object.fromEntries(new FormData(e.currentTarget))
								// no se que hacia esto y si es necesario ahora.
								// setAction(`submit ${JSON.stringify(data)}`);
								// se envia a la pagina de alquiler con la información seteada.
								navigate('/alquiler', { state: { formData: data } })
							}}
						>
							<Input
								isRequired
								errorMessage='Ingrese una sucursal válida'
								label='Sucursal de entrega'
								value={formData.sucursal_retiro}
								onChange={handleChange}
								labelPlacement='outside'
								name='sucursal_retiro'
								placeholder='Ingrese una sucursal'
								type='text'
							/>

							<div className='grid grid-cols-2 gap-4 w-full'>
								<Input
									isRequired
									errorMessage='Ingrese una fecha válida'
									label='Fecha y hora de entrega'
									onChange={handleChange}
									value={formData.fecha_inicio}
									labelPlacement='outside'
									name='fecha_inicio'
									placeholder='Ingrese una fecha'
									type='datetime-local'
								/>

								<Input
									isRequired
									errorMessage='Ingrese una fecha válida'
									label='Fecha y hora de devolución'
									labelPlacement='outside'
									onChange={handleChange}
									value={formData.fecha_devolucion}
									name='fecha_devolucion'
									placeholder='Ingrese una fecha'
									type='datetime-local'
								/>
							</div>

							<div className='relative w-full' style={{ height: '50px' }}>
								<div className='absolute right-0 bottom-0 flex gap-2 '>
									<Button type='reset' variant='flat'>
										Limpiar
									</Button>
									<Button
										className='text-white'
										color='secondary'
										variant='shadow'
										type='submit'
									>
										Reserve ahora
									</Button>
								</div>
							</div>
						</Form>
					</CardBody>
				</Card>
			</div>
		</div>
	)
}

export default HomePage
