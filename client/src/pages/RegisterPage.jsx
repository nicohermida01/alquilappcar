import { PageLayout } from '../components/PageLayout'
import { RegisterForm } from '../components/RegisterForm'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function RegisterPage() {
	const { isAuthenticated } = useAuth()

	return (
		<PageLayout>
			<section className='w-full min-h-screen flex flex-col items-center gap-5 pt-32 pb-20 bg-gray-100'>
				{isAuthenticated && (
					<p>
						Ups, parece que ya tienes una cuenta. <br />
						Para entrar con otra cuenta primero debes cerrar tu sesión.
					</p>
				)}
				{!isAuthenticated && (
					<>
						<RegisterForm />
						<p className='text-center text-gray-600'>
							Ya tienes una cuenta?{' '}
							<Link to='/login' className='text-blue-600 hover:underline'>
								Inicia sesión
							</Link>
						</p>
					</>
				)}
			</section>
		</PageLayout>
	)
}
