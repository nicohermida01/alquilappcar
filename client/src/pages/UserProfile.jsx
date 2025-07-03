import { Avatar, Spinner } from '@heroui/react'
import UserData from '../components/UserData'
import { UserProfileLayout } from '../components/UserProfileLayout'
import { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { usersApi } from '../services/users.api'
import { getFormattedDate } from '../utils/getFecha'

const FieldWrapper = ({ label, value }) => {
	return (
		<div className='w-full bg-slate-100 p-2 rounded-md'>
			<p className='text-sm text-slate-500'>{label}</p>
			<p>{value}</p>
		</div>
	)
}

function UserProfile() {
	const [clientData, setClientData] = useState(null)
	const [loading, setLoading] = useState(false)

	const { user, loadingAuth } = useAuth()

	useEffect(() => {
		if (loadingAuth) return

		setLoading(true)
		usersApi
			.getUserById(user.clientId)
			.then(res => {
				/* console.log(res) */
				setClientData(res)
			})
			.catch(error => console.error(error))
			.finally(() => {
				setLoading(false)
			})
	}, [user, loadingAuth])

	if (loadingAuth) return 'Cargando...'

	return (
		<UserProfileLayout title={'Mi Perfil'}>
			{loading && <Spinner />}

			{!loading && clientData && (
				<div className='bg-white w-[300px] flex flex-col items-center p-8 rounded-lg shadow-md gap-4'>
					<Avatar isBordered className='w-20 h-20' />
					<div className='text-center'>
						<h2 className='text-xl font-bold'>{`${clientData.nombre} ${clientData.apellido}`}</h2>
						<p className='text-gray-500'>{clientData.email}</p>
					</div>
					<FieldWrapper
						label='Fecha de nacimiento'
						value={getFormattedDate(clientData.fecha_de_nacimiento)}
					/>

					<FieldWrapper label='DNI' value={clientData.dni} />

					<FieldWrapper label='Contacto' value={clientData.contacto || '-'} />
				</div>
			)}
			{/* <UserData /> */}
		</UserProfileLayout>
	)
}

export default UserProfile
