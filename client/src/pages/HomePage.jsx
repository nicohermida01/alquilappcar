import { Button } from '@heroui/react'
import ReserveCard from '../components/ReserveCard'
import { PageLayout } from '../components/PageLayout'
import { TrustBenefitIcon } from '../components/icons/TrustBenefitIcon'
import { TargetIcon } from '../components/icons/TargetIcon'
import { RecordIcon } from '../components/icons/RecordIcon'
import { useAuth } from '../contexts/AuthContext'
import { useEffect, useState } from 'react'
import { categoriesService } from '../services/categories.service'
import { sucursalesService } from '../services/sucursales.service'
import { BenefitCard } from '../components/BenefitCard'
import { CategoryCard } from '../components/CategoryCard'
import { SucursalCard } from '../components/SucursalCard'
import { Link } from 'react-router-dom'

function HomePage() {
	const [categories, setCategories] = useState([])
	const [sucursales, setSucursales] = useState([])

	const { isAuthenticated } = useAuth()

	useEffect(() => {
		categoriesService
			.getAllCategories()
			.then(res => {
				setCategories(res)
			})
			.catch(err => {
				console.error('Error fetching categories:', err)
			})

		sucursalesService
			.getActiveSubsidiariesPopulated()
			.then(res => {
				setSucursales(res)
			})
			.catch(err => {
				console.error('Error fetching sucursales:', err)
			})
	}, [])

	return (
		<PageLayout>
			<section className='bg-[url(/../commons/obi-aZKJEvydrNM-unsplash.jpg)] w-full min-h-screen bg-cover relative flex items-center'>
				<div className='absolute top-0 left-0 w-full h-full bg-black/50 ' />

				<div className='w-[70%] max-w-[1200px] mx-auto z-10 flex flex-col gap-5'>
					<div className='flex items-center gap-5 justify-center'>
						<img
							src='/alquilappcar_logo.png'
							alt='Alquilapp Car logo'
							className='w-[200px] h-auto'
						/>
						<h1 className='text-white font-bold text-5xl mb-4'>
							Manejá tu camino con <br /> nosotros
						</h1>
					</div>
					<ReserveCard />
				</div>
			</section>

			<section className='bg-gray-100 w-full'>
				<div className='w-full max-w-[1200px] mx-auto py-20 px-5'>
					<h2 className='font-bold text-2xl text-center'>
						Nuestros beneficios
					</h2>

					<div className='flex gap-10 justify-center mt-[100px]'>
						<BenefitCard
							description='Creamos una forma simple y confiable de alquilar vehículos para
								quienes quieren viajar sin complicaciones. Sin letra chica, sin
								intermediarios confusos'
						>
							<TargetIcon className='w-[50px]' />
						</BenefitCard>

						<BenefitCard
							description='Nos enfocamos en brindarte confianza, flexibilidad y un trato
								humano'
						>
							<TrustBenefitIcon className='w-[50px]' />
						</BenefitCard>

						<BenefitCard
							description='Podés buscar tu sucursal más cercana, elegir las fechas que
								necesitás, y coordinar la entrega directamente desde nuestra
								plataforma'
						>
							<RecordIcon className='w-[50px]' />
						</BenefitCard>
					</div>
				</div>
			</section>

			<section className='w-full bg-gray-200'>
				<div className='w-full max-w-[1400px] mx-auto py-20 px-5'>
					<h2 className='font-bold text-2xl text-center'>Nuestra flota</h2>

					<div className='flex gap-5 flex-wrap justify-center mt-[60px]'>
						{categories.length > 0 &&
							categories.map((cat, i) => {
								return (
									<CategoryCard
										key={i}
										title={cat.nombre}
										precio={cat.precio}
										cancelPolicies={[{ ...cat.cancelacion }]}
									/>
								)
							})}
					</div>
				</div>
			</section>

			<section className='w-full bg-gray-100 '>
				<div className='w-full max-w-[1600px] mx-auto py-20 px-5'>
					<h2 className='font-bold text-2xl text-center'>
						Nuestras sucursales
					</h2>

					<div className='flex gap-5 flex-wrap justify-center mt-[60px]'>
						{sucursales.length > 0 &&
							sucursales.map((suc, i) => {
								return (
									<SucursalCard
										key={i}
										location={suc.localidad.nombre}
										address={suc.direccion}
									/>
								)
							})}
					</div>
				</div>
			</section>

			<section className='w-full bg-gray-200 '>
				<div className='w-full max-w-[1200px] mx-auto py-20 px-5'>
					<h2 className='font-bold text-2xl text-center'>
						¿Listo para comenzar?
					</h2>
					<p className='text-center mt-4 text-gray-600'>
						Alquila tu auto de manera fácil y rápida.
					</p>
					<div className='flex justify-center mt-4'>
						<Link to={`${isAuthenticated ? '/alquiler' : '/login'}`}>
							<Button className='text-white' color='secondary' type='submit'>
								Reserve ahora
							</Button>
						</Link>
					</div>
				</div>
			</section>
		</PageLayout>
	)
}

export default HomePage
