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

	const onSubmit = async (data) => {
		/*
		Permiso loco. Reescribi esta func para ahorrar todo el quilombo que
		hace JijoScript con la concurrencia y que me ande el chequeo de si
		el empleado esta activo o no. Hace la misma mierda, y realmente no
		entendi como carajo el sistema se da cuenta si esta queriendo entrar
		un armin o un empleado, pero active el sentido aracnido y segui los
		instintos. -Valen
		*/
		try {
			const res = await authService.login(data);
			const isActive = await authService.checkActiveness(res.userId);
			if (res.status === 'pending') {
				setShow2FA(true)
				setUserFor2FA(res.userId)
				toast('Por favor, ingresa el código de verificación de dos pasos', {
					icon: '🔐',
				})
				return
			} else {
				if (isActive) {
					toast.success('¡Bienvenido!')
					reset()
					login(res)
					navigate('/')
				} else {
					toast.error('Esta cuenta de empleado se encuentra deshabilitada');
				}
			}
		} catch (err) {
			toast.error('Credenciales incorrectas')
			console.error(err)
		}

/* 		authService
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
			}) */
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
					<h2 className='text-3xl font-bold text-center'>Iniciar sesión</h2>
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
					<p>
						¿Olvidaste tu contraseña?{' '}
						<a href="/admrecovery" className='text-blue-600 hover:underline'>Recuperala ahora</a>
					</p>
				</form>
			)}
			<Toaster />
		</>
	)
}
