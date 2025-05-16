import { Link } from 'react-router-dom'
import { Navbar, NavbarBrand, NavbarContent, NavbarItem } from '@heroui/navbar'
import { Button } from '@heroui/button'

import { useLocation } from 'react-router-dom'

function Topbar() {
	const { pathname } = useLocation()

	return (
		<Navbar className='absolute top-0 bg-background/60'>
			<NavbarBrand>
				<Link to='/'>
					<img src='/alquilappcar_logo.png' alt='Logo' style={{ width: 72 }} />
				</Link>
			</NavbarBrand>
			<NavbarContent className='hidden sm:flex gap-14' justify='center'>
				<NavbarItem>
					<Link to='/'>Home</Link>
				</NavbarItem>
				<NavbarItem>
					<Link to='/flota'>Flota</Link>
				</NavbarItem>
				<NavbarItem>
					<Link to='/sucursales'>Sucursales</Link>
				</NavbarItem>
			</NavbarContent>
			<NavbarContent justify='end'>
				<NavbarItem>
					<Button className='text-white' color='secondary'>
						Reserve ahora
					</Button>
				</NavbarItem>
				<NavbarItem>
					<Button className='text-white' color='primary'>
						{pathname === '/login' ? (
							<Link to='/register'>Crear cuenta</Link>
						) : (
							<Link to='/login'>Iniciar sesión</Link>
						)}
					</Button>
				</NavbarItem>
			</NavbarContent>
		</Navbar>
	)
}

export default Topbar
