import { LoginForm } from '../components/LoginForm'

export function LoginPage() {
	return (
		<section className='min-h-screen w-full flex flex-col gap-10 items-center justify-center bg-gray-100'>
			<h1 className='text-3xl font-bold text-center flex flex-col items-center'>
				<img
					src='/alquilappcar_logo.png'
					alt='Alquilapp Car Logo'
					width='150'
					height='auto'
				/>
				Iniciar sesión
			</h1>
			<LoginForm />
		</section>
	)
}
