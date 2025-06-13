import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { Button } from "@heroui/button";
import { useAuth } from "../contexts/AuthContext";
import { useState, useEffect } from "react";
import { usersApi } from "../services/users.api";
import axios from "axios";
import { addToast } from "@heroui/toast";

function UserEditSettings() {
    const { user } = useAuth();
    const [clientInfo, setClientInfo] = useState([]);
    const [newClientInfo, setNewClientInfo] = useState(null);

    useEffect(() => {
        usersApi
            .getUserById(user.clientId)
            .then((ret) => setClientInfo(ret))
            .catch((error) => alert(error));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setClientInfo((prev) => ({
            ...prev,
            [name]: value,
        }));

        setNewClientInfo((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        if (newClientInfo === null) {
            addToast({
                title: "No se realizaron cambios.",
            });

            return;
        }

        try {
            await axios.patch(
                `http://localhost:8000/alquilapp/api/v1/clientes/${user.clientId}/`,
                newClientInfo
            );
            addToast({
                title: "Se actualizo la informacion.",
                color: "success",
            });
        } catch (error) {
            if (error.response.data.email) {
                addToast({
                    title: "Error al actualizar el email.",
                    description: "El email especificado ya esta en uso.",
                    color: "danger",
                });
                console.log(error.response);
            }
        }
    };

    return (
        <Form
            className="ml-[300px] mt-[10%] w-[600px] h-[500px]"
            onSubmit={onSubmit}
        >
            <div className="p-4 flex flex-col justify-center gap-6 h-full w-full items-center border border-grey rounded-xl bg-white">
                <h2 className="font-bold text-3xl">Editar informacion</h2>
                <div className="w-full flex gap-10 justify-between">
                    <Input
                        label="Nombre"
                        onChange={handleChange}
                        value={clientInfo.nombre}
                        name="nombre"
                        size="lg"
                        isRequired
                        errorMessage="Este campo no puede estar vacio."
                    />
                    <Input
                        label="Apellido"
                        onChange={handleChange}
                        value={clientInfo.apellido}
                        name="apellido"
                        isRequired
                        errorMessage="Este campo no puede estar vacio."
                    />
                </div>
                <div className="w-full flex gap-10 justify-between">
                    <Input
                        label="E-mail"
                        onChange={handleChange}
                        value={clientInfo.email}
                        name="email"
                        type="email"
                        isRequired
                        errorMessage={(validate) => {
                            if (validate.validationErrors[0]?.includes("@"))
                                return "E-mail invalido.";
                            return validate.validationErrors[0];
                        }}
                    />
                    <Input
                        label="Contacto"
                        onChange={handleChange}
                        value={clientInfo.contacto}
                        name="contacto"
                    />
                </div>
            </div>
            <div className="flex justify-end w-full">
                <Button color="secondary" type="submit" className="text-white">
                    Guardar
                </Button>
            </div>
        </Form>
    );
}

export default UserEditSettings;
