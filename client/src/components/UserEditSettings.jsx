import { Form } from "@heroui/form"
import { Input } from "@heroui/input"
import { Button } from "@heroui/button"
import { useAuth } from "../contexts/AuthContext"
import { useState, useEffect } from 'react'
import { usersApi } from '../services/users.api'
import axios from 'axios'

function UserEditSettings() {
    const { user } = useAuth();
    const [clientInfo, setClientInfo] = useState([]);
    const [newClientInfo, setNewClientInfo] = useState({
        nombre: '',
        apellido: '',
        email: '',
        contacto: ''
    })
    const [submitted, switchSubmitted] = useState(false);

    useEffect(() => {
        usersApi.getUserById(user.clientId)
        .then((ret) => setClientInfo(ret))
        .catch(error => alert(error))
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const onSubmit = async (e) => {
        e.preventDefault();

        try {
            await axios.patch(`http://localhost:8000/alquilapp/api/v1/clientes/${user.clientId}/`,
                newClientInfo
            );
        }
        catch (error) {
            console.error("No se pudo actualizar la info del cliente: ", error);
        }
    }

    return (
        <Form className="ml-[35%] mt-[10%] w-max"
            onSubmit={onSubmit}
        >
            <div className="border border-grey rounded-xl w-fit space-y-16 bg-white">
            <Input
                label="Nombre"
                labelPlacement="outside-left"
                onChange={handleChange}
                defaultValue={clientInfo.nombre}
                className="p-2 ml-32 mr-32"
            />
            <Input
                label="Apellido"
                labelPlacement="outside-left"
                onChange={handleChange}
                defaultValue={clientInfo.apellido}
                className="p-2 ml-32 mr-32"
            />
            <Input
                label="E-mail"
                labelPlacement="outside-left"
                onChange={handleChange}
                defaultValue={clientInfo.email}
                className="p-2 ml-32 mr-32"
                type="email"
            />
            <Input
                label="Contacto"
                labelPlacement="outside-left"
                onChange={handleChange}
                defaultValue={clientInfo.contacto}
                className="p-2 ml-32 mr-32"
            />
            </div>
            <div className="flex ml-auto">
                <Button color="secondary" type="submit">Guardar</Button>
            </div>
        </Form>
    )
}

export default UserEditSettings;
