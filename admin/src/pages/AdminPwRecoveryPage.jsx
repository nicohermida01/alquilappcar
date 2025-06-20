import { Input } from '@heroui/input'
import { Button } from '@heroui/button'
import { useState } from 'react'
import { addToast } from '@heroui/toast'
import {
    Modal,
    ModalBody,
    ModalFooter,
    ModalContent,
    useDisclosure
} from "@heroui/react";
import { employeeApi } from '../api/employee.api.js'
import axios from 'axios'

function AdminPwRecoveryPage() {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    const handleChange = (e) => {
        setEmail(e.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        employeeApi.getEmployeeByEmail(email)
        .then(res => {
            setPassword(res.password);
            onOpen();
        })
        .catch(error => {
            axios.get(`http://localhost:8000/alquilapp/api/v1/admins/by-email/${email}`)
            .then(res => {
                setPassword(res.password);
                onOpen();
            })
            .catch(error => (addToast({
                title: "Se ha producido un error.",
                description: "No se ha encontrado el correo electronico.",
                color: 'danger'
            })));
        });
    }

    return (
        <>
            <section className='flex flex-col items-center gap-5 justify-center min-h-screen bg-gray-100'>
                <form
    			    className='w-[50%] flex flex-col gap-4 p-8 bg-white rounded-lg shadow-lg'
			        onSubmit={handleSubmit}
		        >
        			<h1 className='text-3xl font-bold text-center'>Recuperar contraseña</h1>
                    <p>Ingresa tu correo electronico. Si es valido, en instantes veras la contraseña.</p>
			        <Input
        				type='email'
				        label='Correo electrónico'
				        isRequired
                        errorMessage={(validate) => {
                            if (validate.validationErrors[0]?.includes("@"))
                                return "E-mail invalido.";
                            return "Por favor, completa este campo.";
                        }}
                        onChange={handleChange}
			        />

			        <Button type='submit' color='primary' className='text-white'>
        				Enviar
			        </Button>
		        </form>
            </section>
            <Modal isOpen={isOpen} radius="lg" onOpenChange={onOpenChange}>
                <ModalContent>
                    {onClose => (
                        <>
                            <ModalBody>
                                <p className="font-bold">Contraseña: </p>
                                <p>{password}</p>
                            </ModalBody>
                            <ModalFooter>
                                <Button onPress={onClose}>
                                    Cerrar
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
                
            </Modal>
        </>
    );
}

export default AdminPwRecoveryPage;
