import { LoginForm } from '../components/LoginForm'
import { PageLayout } from '../components/PageLayout'
import { Link } from 'react-router-dom'

export default function LoginPage() {
	return (
		<PageLayout>
			<section className='flex flex-col items-center gap-5 justify-center min-h-screen bg-gray-100'>
				<LoginForm />
				<p className='text-center text-gray-600'>
					No tienes una cuenta?{' '}
					<Link to='/register' className='text-blue-600 hover:underline'>
						Crea una cuenta
					</Link>
				</p>
			</section>
		</PageLayout>
	)
}
