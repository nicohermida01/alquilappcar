import { useNavigate } from 'react-router'
import { DashboardLayout } from '../components/DashboardLayout'
import { RegisterEmployeeForm } from '../components/RegisterEmployeeForm'
import { useAuth } from '../contexts/AuthContext'
import { useEffect } from 'react'

export function DashboardPage() {
	const { isAuthenticated } = useAuth()
	const navigate = useNavigate()

	useEffect(() => {
		if (!isAuthenticated) {
			navigate('/login')
		}
	}, [])

	if (!isAuthenticated) return ''

	return (
		<DashboardLayout>
			<section className='w-full py-[135px] flex items-center justify-center bg-gray-100'>
				<RegisterEmployeeForm />
			</section>
		</DashboardLayout>
	)
}
