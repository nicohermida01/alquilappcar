import { Divider } from '@heroui/react'
import { formatAmount } from '../utils/formatAmount'

export function CategoryCard({ title, precio, cancelPolicies }) {
	return (
		<div className='bg-white shadow p-4 rounded-md w-[300px]'>
			<div className='flex items-center justify-between'>
				<h4 className='font-bold'>{title}</h4>
				<span className='font-bold'>${formatAmount(precio)}</span>
			</div>

			<img src='/car.png' alt='' height={200} width={300} />

			<div>
				<Divider className='my-4' />
				<p>Políticas de cancelación:</p>
				<div className='mt-1'>
					{cancelPolicies.map((policy, i) => {
						return (
							<p
								key={i}
								className='text-sm bg-gray-100 text-gray-600 p-1 rounded-md flex items-center justify-between'
							>
								<span>{policy.descripcion}</span>
								<span>{Number(policy.porcentaje)}%</span>
							</p>
						)
					})}
				</div>
			</div>
		</div>
	)
}
