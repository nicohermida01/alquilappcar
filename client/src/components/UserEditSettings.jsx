import { Form } from "@heroui/form"
import { Input } from "@heroui/input"
import { Button } from "@heroui/button"
import { useAuth } from "../contexts/AuthContext"
import { useState, useEffect } from 'react'
import { usersApi } from '../services/users.api'
import axios from 'axios'
import { addToast } from '@heroui/toast'

function UserEditSettings() {
    const { user } = useAuth();
    const [clientInfo, setClientInfo] = useState([]);
    const [newClientInfo, setNewClientInfo] = useState(null);

    useEffect(() => {
        usersApi.getUserById(user.clientId)
        .then((ret) => setClientInfo(ret))
        .catch(error => alert(error));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setClientInfo((prev) => ({
            ...prev,
            [name]: value
        }));

        setNewClientInfo((prev) => ({
            ...prev,
            [name]: value
        }));
    }

    const onSubmit = async (e) => {
        e.preventDefault();
        console.log(newClientInfo);

        if (newClientInfo === null) {
            addToast({
                title: "No se realizaron cambios."
            });
            return;
        }

        try {
            await axios.patch(`http://localhost:8000/alquilapp/api/v1/clientes/${user.clientId}/`,
                newClientInfo
            );
            addToast({ 
                title: "Se actualizo la informacion.",
                color: "success"
            })
        }
        catch (error) {
            if (error.response.data.email)
                addToast({
                    title: "Error al actualizar el email.",
                    description: "El email especificado ya esta en uso.",
                    color: "danger"
            });
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
                value={clientInfo.nombre}
                name="nombre"
                className="p-2 ml-32 mr-32"
            />
            <Input
                label="Apellido"
                labelPlacement="outside-left"
                onChange={handleChange}
                value={clientInfo.apellido}
                name="apellido"
                className="p-2 ml-32 mr-32"
            />
            <Input
                label="E-mail"
                labelPlacement="outside-left"
                onChange={handleChange}
                value={clientInfo.email}
                className="p-2 ml-32 mr-32"
                name="email"
                type="email"
            />
            <Input
                label="Contacto"
                labelPlacement="outside-left"
                onChange={handleChange}
                value={clientInfo.contacto}
                name="contacto"
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
