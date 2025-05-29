import { Input, Button, InputOtp } from '@heroui/react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { InputPassword } from './InputPassword'
import { authService } from '../api/auth'
import toast, { Toaster } from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router'

export function LoginForm() {
	const [show2FA, setShow2FA] = useState(false)
	const [code2FA, setCode2FA] = useState('')
	const [userFor2FA, setUserFor2FA] = useState(null)

	const { login } = useAuth()

	const navigate = useNavigate()

	const { register, handleSubmit, reset } = useForm()

	const onSubmit = data => {
		authService
			.login(data)
			.then(res => {
				if (res.status === 'pending') {
					setShow2FA(true)
					setUserFor2FA(res.userId)
					toast('Por favor, ingresa el código de verificación de dos pasos', {
						icon: '🔐',
					})
					return
				} else {
					toast.success('¡Bienvenido!')
					reset()
					login(res)
					navigate('/')
				}
			})
			.catch(err => {
				toast.error('Credenciales incorrectas')
				console.error(err)
			})
	}

	const onError = errors => {
		console.error(errors)
	}

	const handle2FA = () => {
		authService
			.confirm2FA(code2FA, userFor2FA)
			.then(res => {
				toast.success('¡Bienvenido!')
				reset()
				login(res)
				navigate('/')
			})
			.catch(err => {
				toast.error('Código de verificación incorrecto')
				console.error(err)
			})
	}

	useEffect(() => {
		reset()
		setShow2FA(false)
		setCode2FA('')
		setUserFor2FA(null)
	}, [reset])

	return (
		<>
			{show2FA && (
				<div className='w-[50%] flex flex-col items-center gap-4 p-8 bg-white rounded-lg shadow-lg'>
					<h3>Ingrese el código de verificación enviado al email</h3>
					<InputOtp length={6} value={code2FA} onValueChange={setCode2FA} />
					<Button color='primary' onPress={handle2FA} className='w-max'>
						Enviar
					</Button>
				</div>
			)}
			{!show2FA && (
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
			)}
			<Toaster />
		</>
	)
}
