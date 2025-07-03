import { useEffect } from 'react'
import { PageLayout } from './PageLayout'
import SideMenu from './SideMenu'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export function UserProfileLayout({ children, title }) {
	const { isAuthenticated, loadingAuth } = useAuth()
	let navigate = useNavigate()

	useEffect(() => {
		if (loadingAuth) return

		if (!isAuthenticated) {
			navigate('/login')
		}
	}, [isAuthenticated, loadingAuth, navigate])

	if (loadingAuth) return 'Cargando...'

	return (
		<PageLayout>
			<div className='grid grid-cols-5 min-h-screen'>
				<SideMenu />
				<main className='bg-gray-100 col-span-4 mt-[64px] p-8'>
					<h1 className='text-3xl font-bold mb-4'>{title}</h1>
					{children}
				</main>
			</div>
		</PageLayout>
	)
}
