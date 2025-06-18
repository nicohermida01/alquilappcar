import { LoginForm } from '../components/LoginForm'
import { PageLayout } from '../components/PageLayout'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function LoginPage() {
	const { isAuthenticated } = useAuth()

	return (
		<PageLayout>
			<section className='flex flex-col items-center gap-5 justify-center min-h-screen bg-gray-100'>
				{isAuthenticated && (
					<p>
						Ya tienes una sesión iniciada! <br />
						Para entrar con otra cuenta primero debes cerrar tu sesión.
					</p>
				)}
				{!isAuthenticated && (
					<>
						<LoginForm />
						<p className='text-center text-gray-600'>
							¿No tienes una cuenta?{' '}
							<Link to='/register' className='text-blue-600 hover:underline'>
								Crea una cuenta
							</Link><br/>
							¿Olvidaste tu contraseña?{' '}
							<Link to='/recovery' className='text-blue-600 hover:underline'>
								Recuperala ahora
							</Link>
						</p>
					</>
				)}
			</section>
		</PageLayout>
	)
}
