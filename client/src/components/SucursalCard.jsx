import { Divider } from '@heroui/react'
import { LocationIcon } from './icons/LocationIcon'

export function SucursalCard({ location, address }) {
	return (
		<div className='bg-white shadow p-4 rounded-md w-[500px]'>
			<img
				src='/sucursal.png'
				alt=''
				height={200}
				width={500}
				className='rounded'
			/>
			<div>
				<Divider className='my-4' />
				<h4 className='font-bold text-xl'>{location}</h4>
				<p className='flex items-center gap-2 text-gray-600 mt-2'>
					<LocationIcon className='w-[30px]' /> {address}
				</p>
			</div>
		</div>
	)
}
