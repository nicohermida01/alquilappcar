import { useState } from 'react'

import Topbar from '../components/Topbar'
import { Button, Card, CardBody, Form, Input } from '@heroui/react'

function HomePage() {
	const [action, setAction] = useState(null)

	return (
		<div
			id='body'
			className='bg-[url(/../commons/obi-aZKJEvydrNM-unsplash.jpg)] min-h-screen bg-cover flex items-center relative'
		>
			<div className='absolute top-0 left-0 w-full h-full bg-black/40 ' />
			<Topbar />
			<div className='w-[70%] mx-auto z-10'>
				<h1 className='text-white font-bold text-left text-5xl mb-4'>
					Maneja tu camino <br /> con nostros
				</h1>
				<Card className='bg-background/60' isBlurred>
					<CardBody className='gap-4 p-10'>
						<h2 className='font-bold text-2xl'>¡Alquila tu vehículo ya!</h2>
						<Form
							className='w-full flex flex-col gap-4'
							onReset={() => setAction('reset')}
							onSubmit={e => {
								e.preventDefault()
								let data = Object.fromEntries(new FormData(e.currentTarget))

								setAction(`submit ${JSON.stringify(data)}`)
							}}
						>
							<Input
								isRequired
								errorMessage='Ingrese una sucursal válida'
								label='Sucursal de entrega'
								labelPlacement='outside'
								name='sucursal'
								placeholder='Ingrese una sucursal'
								type='text'
							/>

							<div className='grid grid-cols-2 gap-4 w-full'>
								<Input
									isRequired
									errorMessage='Ingrese una fecha válida'
									label='Fecha y hora de entrega'
									labelPlacement='outside'
									name='fecha_entrega'
									placeholder='Ingrese una fecha'
									type='datetime-local'
								/>

								<Input
									isRequired
									errorMessage='Ingrese una fecha válida'
									label='Fecha y hora de devolución'
									labelPlacement='outside'
									name='fecha_devolucion'
									placeholder='Ingrese una fecha'
									type='datetime-local'
								/>
							</div>

							<div className='relative w-full' style={{ height: '50px' }}>
								<div className='absolute right-0 bottom-0 flex gap-2 '>
									<Button type='reset' variant='flat'>
										Reset
									</Button>
									<Button color='secondary' type='submit'>
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
