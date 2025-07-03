import UserEditSettings from '../components/UserEditSettings'
import { UserProfileLayout } from '../components/UserProfileLayout'

function EditProfilePage() {
	return (
		<UserProfileLayout title='Editar información'>
			<UserEditSettings />
		</UserProfileLayout>
	)
}

export default EditProfilePage
