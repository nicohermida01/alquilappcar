import {Card, CardBody, CardHeader, Divider} from "@heroui/react"

function FieldCard({field, value}) {
    return (
    <Card className="max-w-[75vh] m-8">
        <CardHeader>
            <p className="font-bold text-3xl">{field}</p>
        </CardHeader>
        <Divider/>
        <CardBody>
            <p>{value}</p>
        </CardBody>
    </Card>
    )
}

export default FieldCard;
