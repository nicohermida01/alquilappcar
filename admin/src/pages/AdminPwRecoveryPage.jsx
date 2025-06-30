import { Input } from '@heroui/input'
import { Button } from '@heroui/button'
import { Link } from '@heroui/link'
import { useState } from 'react'
import { addToast } from '@heroui/toast'
import { employeeApi } from '../api/employee.api.js'
import axios from 'axios'

function AdminPwRecoveryPage() {
    const [email, setEmail] = useState();
    const [queried, isQueried] = useState(false);

    const handleChange = (e) => {
        setEmail(e.target.value);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        employeeApi.getEmployeeByEmail(email)
        .then(res => {
            axios.patch(`http://localhost:8000/alquilapp/api/v1/empleados/${res.id}/`, { password: "123456" });
            isQueried(true);
        })
        .catch(error => {
            axios.get(`http://localhost:8000/alquilapp/api/v1/admins/by-email/${email}`)
            .then(res => {
                axios.patch(`http://localhost:8000/alquilapp/api/v1/admins/${res.data.id}/`, { password: "123456" });
                isQueried(true);
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
                <>
                {
                queried ?
                <div>
                    <p>
                        Se ha enviado una contraseña temporal a tu<br/>
                        direccion de correo electronico para que<br/>
                        puedas acceder a tu cuenta. Recorda revisar<br/>
                        la casilla de correo no deseado.
                    </p>
                    <Button color="primary" 
                    as={Link} 
                    href="/login" 
                    className="text-white m-6 ml-[70px]"
                    >
                    Ir a inicio de sesion
                    </Button>
                </div>
                :
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
                }
                </>
            </section>
        </>
    );
}

export default AdminPwRecoveryPage;
