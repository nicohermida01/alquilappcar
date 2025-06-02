import { Form } from "@heroui/form"
import { Input } from "@heroui/input"
import { Button } from "@heroui/button"
import { useAuth } from "../contexts/AuthContext"
import { useState, useEffect } from 'react'
import { usersApi } from '../services/users.api'

function UserEditSettings() {
    const { user } = useAuth();
    const [clientInfo, setClientInfo] = useState([]);
    const [submitted, switchSubmitted] = useState(false);

    useEffect(() => {
        usersApi.getUserById(user.clientId)
        .then((ret) => setClientInfo(ret))
        .catch(error => alert(error))
    }, []);

    const onSubmit = () => {
        alert("se submitio");
    }

    return (
        <Form className="ml-[35%] mt-[10%] w-max"
            onReset={null}
            onSubmit={onSubmit}
        >
            <div className="border border-grey rounded-xl w-fit space-y-16 bg-white">
            <Input
                label="Nombre"
                labelPlacement="outside-left"
                defaultValue={clientInfo.nombre}
                className="p-2 ml-32 mr-32"
            />
            <Input
                label="Apellido"
                labelPlacement="outside-left"
                defaultValue={clientInfo.apellido}
                className="p-2 ml-32 mr-322"
            />
            <Input
                label="E-mail"
                labelPlacement="outside-left"
                defaultValue={clientInfo.email}
                className="p-2 ml-32 mr-32"
            />
            <Input
                label="Contacto"
                labelPlacement="outside-left"
                defaultValue={clientInfo.contacto}
                className="p-2 ml-32 mr-32"
            />
            </div>
            <div className="flex ml-auto">
                <Button color="secondary" type="submit">Guardar</Button>
                <Button type="reset" className="ml-2">Descartar</Button>
            </div>
        </Form>
    )
}

export default UserEditSettings;
