import { Link } from 'react-router-dom'
import {
	Navbar,
	NavbarBrand,
	NavbarContent,
	NavbarItem,
	Button,
	Dropdown,
	DropdownTrigger,
	Avatar,
	DropdownMenu,
	DropdownItem,
} from '@heroui/react'
import { useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

function Topbar() {
	const { user, isAuthenticated, logout } = useAuth()

	const { pathname } = useLocation()

	return (
		<Navbar className='fixed top-0 bg-background/60 border-b-1 border-gray-200'>
			<NavbarBrand>
				<Link to='/'>
					<img src='/alquilappcar_logo.png' alt='Logo' style={{ width: 72 }} />
				</Link>
			</NavbarBrand>
			<NavbarContent
				className='hidden sm:flex gap-14'
				justify='start'
			></NavbarContent>
			<NavbarContent justify='end'>
				<NavbarItem>
					<Link to={`${isAuthenticated ? '/alquiler' : '/login'}`}>
						<Button className='text-white' color='secondary' type='submit'>
							Reserve ahora
						</Button>
					</Link>
				</NavbarItem>
				{!isAuthenticated && (
					<NavbarItem>
						<Button className='text-white' color='primary'>
							{pathname === '/login' ? (
								<Link to='/register'>Crear cuenta</Link>
							) : (
								<Link to='/login'>Iniciar sesión</Link>
							)}
						</Button>
					</NavbarItem>
				)}
				{isAuthenticated && (
					<NavbarItem>
						<Dropdown placement='bottom-end'>
							<DropdownTrigger>
								<Avatar
									isBordered
									as='button'
									className='transition-transform'
								/>
							</DropdownTrigger>
							<DropdownMenu aria-label='Profile Actions' variant='flat'>
								<DropdownItem key='profile' className='h-14 gap-2'>
									<p className='font-semibold'>Sesión de:</p>
									<p className='font-semibold'>{user.email}</p>
								</DropdownItem>
								<DropdownItem key='settings'>
									<Link to='/mi-perfil'>Ver perfil</Link>
								</DropdownItem>
								<DropdownItem key='logout' color='danger' onClick={logout}>
									Cerrar sesión
								</DropdownItem>
							</DropdownMenu>
						</Dropdown>
					</NavbarItem>
				)}
			</NavbarContent>
		</Navbar>
	)
}

export default Topbar
