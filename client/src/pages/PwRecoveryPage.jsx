import { Input } from '@heroui/input'
import { Button } from '@heroui/button'
import { PageLayout } from '../components/PageLayout.jsx'
import { useState, useEffect } from 'react'
import { usersApi } from '../services/users.api.js'
import { addToast } from '@heroui/toast'

function PwRecoveryPage() {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    const handleChange = (e) => {
        setEmail(e.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        usersApi.getUserByEmail(email)
        .then(res => {
            setPassword(res.password);
            alert(password);
        })
        .catch(error => (addToast({
            title: "Se ha producido un error.",
            description: "No se ha encontrado el correo electronico.",
            color: 'danger'
        })));
    }

    return (
        <PageLayout>
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
        </PageLayout>
    );
}

export default PwRecoveryPage;
