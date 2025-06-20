export function BenefitCard({ description, children }) {
	return (
		<div className='w-[280px] h-max flex flex-col items-center'>
			{children}
			<p className='text-center mt-5 text-gray-600'>{description}</p>
		</div>
	)
}
