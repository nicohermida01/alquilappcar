import { DashboardLayout } from '../components/DashboardLayout'
import { RegisterEmployeeForm } from '../components/RegisterEmployeeForm'

export function DashboardPage() {
	return (
		<DashboardLayout>
			<section className='w-full py-[135px] flex items-center justify-center bg-gray-100'>
				<RegisterEmployeeForm />
			</section>
		</DashboardLayout>
	)
}
