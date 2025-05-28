import {Card, Input, CardHeader, Divider} from "@heroui/react"

function EditFieldCard({field, pHolder}) {
    return (
    <Card className="max-w-[75vh] m-8">
        <CardHeader>
            <p className="font-bold text-3xl">{field}</p>
        </CardHeader>
        <Divider/>
        <Input radius="none" placeholder={pHolder}/>
    </Card>
    )
}

export default EditFieldCard;
