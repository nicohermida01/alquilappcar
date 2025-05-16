import { UserMenu } from './UserMenu'

export function Topbar() {
	return (
		<header className='flex items-center justify-between py-2 px-10 bg-gray-200 text-white border-b-1 border-gray-300'>
			<img
				src='/alquilappcar_logo.png'
				alt='AlquilAppCar Logo'
				width='60'
				height='60'
			/>

			<UserMenu />
		</header>
	)
}
