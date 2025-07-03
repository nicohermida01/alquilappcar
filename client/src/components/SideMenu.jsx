import { Link } from 'react-router-dom'

function SideMenu() {
	return (
		<div className='bg-color-2 text-white'>
			<ul className='p-4 space-y-2 sticky top-[70px]'>
				<li>
					<Link to='/mi-perfil'>
						<div className='bg-color-5 hover:bg-color-4 p-2 rounded cursor-pointer'>
							Ver perfil
						</div>
					</Link>
				</li>

				<li>
					<Link to='/editar-perfil'>
						<div className='bg-color-5 hover:bg-color-4 p-2 rounded cursor-pointer'>
							Editar información
						</div>
					</Link>
				</li>

				<li>
					<Link to='/mis-alquileres'>
						<div className='bg-color-5 hover:bg-color-4 p-2 rounded cursor-pointer'>
							Mis alquileres
						</div>
					</Link>
				</li>
			</ul>
		</div>
	)
}

export default SideMenu
