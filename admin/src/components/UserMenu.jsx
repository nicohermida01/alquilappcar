import {
	Dropdown,
	DropdownTrigger,
	DropdownMenu,
	DropdownItem,
	Avatar,
	User,
} from '@heroui/react'
import { useAuth } from '../contexts/AuthContext'

export function UserMenu() {
	const { user, logout } = useAuth()

	return (
		<Dropdown placement='bottom-end'>
			<DropdownTrigger>
				<Avatar
					isBordered
					color={user.isAdmin ? 'secondary' : 'primary'}
					as='button'
					className='transition-transform'
					src='https://i.pinimg.com/736x/cf/1b/9c/cf1b9c414bcd16d6e9f7fcd4ea698dcd.jpg'
				/>
			</DropdownTrigger>
			<DropdownMenu aria-label='Profile Actions' variant='flat'>
				<DropdownItem key='profile' className='h-14 gap-2'>
					<p className='font-semibold'>Sesión iniciada como:</p>
					<p className='font-semibold'>{user?.email}</p>
				</DropdownItem>
				<DropdownItem key='settings'>Ver perfil</DropdownItem>
				<DropdownItem key='logout' color='danger' onClick={logout}>
					Cerrar sesión
				</DropdownItem>
			</DropdownMenu>
		</Dropdown>
	)
}
