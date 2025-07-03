import { Card, CardBody, CardHeader, Divider } from '@heroui/react'

function FieldCard({ field, value }) {
	return (
		<Card>
			<CardHeader>
				<p className='font-bold'>{field}</p>
			</CardHeader>
			<Divider />
			<CardBody>
				<p>{value}</p>
			</CardBody>
		</Card>
	)
}

export default FieldCard
