import { RegisterEmployeeForm } from '../components/RegisterEmployeeForm'
import { useAuth } from '../contexts/AuthContext'

export function EmployeePage() {
	const { user } = useAuth()

	return (
		<section className='w-full flex items-center justify-center bg-gray-100'>
			{user.isAdmin && <RegisterEmployeeForm />}
		</section>
	)
}
