import { Input, Button, addToast } from '@heroui/react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { InputPassword } from './InputPassword'
import { authService } from '../services/auth.service'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

export function LoginForm() {
	const { login } = useAuth()

	let navigate = useNavigate()

	const { register, handleSubmit, reset } = useForm()

	const onSubmit = data => {
		authService
			.login(data)
			.then(res => {
				login(res)
				addToast({
					title: 'Sesión iniciada correctamente',
					variant: 'flat',
					color: 'success',
				})
				reset()
				navigate('/')
			})
			.catch(err => {
				addToast({
					title: 'Error al iniciar sesión',
					description: 'Credenciales inválidas',
					variant: 'flat',
					color: 'danger',
				})
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
		<form
			className='w-[50%] flex flex-col gap-4 p-8 bg-white rounded-lg shadow-lg'
			onSubmit={handleSubmit(onSubmit, onError)}
		>
			<h1 className='text-3xl font-bold text-center'>Iniciar sesión</h1>
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
	)
}
