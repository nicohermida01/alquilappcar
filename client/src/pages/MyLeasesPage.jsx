import UserAlquileres from '../components/UserAlquileres'
import { UserProfileLayout } from '../components/UserProfileLayout'

function MyLeasesPage() {
	return (
		<UserProfileLayout title='Mis alquileres'>
			<UserAlquileres />
		</UserProfileLayout>
	)
}

export default MyLeasesPage
