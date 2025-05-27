import { Input, Button } from '@heroui/react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { InputPassword } from './InputPassword'
import { authService } from '../api/auth'
import toast, { Toaster } from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router'

export function LoginForm() {
	const { login } = useAuth()

	const navigate = useNavigate()

	const { register, handleSubmit, reset } = useForm()

	const onSubmit = data => {
		authService
			.login(data)
			.then(res => {
				toast.success('¡Bienvenido!')
				reset()
				login(res)
				navigate('/')
			})
			.catch(err => {
				toast.error('Credenciales incorrectas')
				console.error(err)
			})
	}

	const onError = errors => {
		console.error(errors)
	}

	useEffect(() => {
		reset()
	}, [reset])

	return (
		<>
			<form
				className='w-[50%] flex flex-col gap-4 p-8 bg-white rounded-lg shadow-lg'
				onSubmit={handleSubmit(onSubmit, onError)}
			>
				<Input
					type='email'
					label='Correo electrónico'
					{...register('email', { required: true })}
					isRequired
				/>

				<InputPassword
					label='Contraseña'
					register={{ ...register('password', { required: true }) }}
				/>

				<Button type='submit' color='primary' className='text-white'>
					Ingresar
				</Button>
			</form>
			<Toaster />
		</>
	)
}
