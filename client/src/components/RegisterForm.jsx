import { Input, Button, Textarea, addToast } from '@heroui/react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { InputPassword } from './InputPassword'
import { authService } from '../services/auth.service'
import { format } from 'date-fns'
import { handleApiError } from '../utils/handleApiError'
import { useNavigate } from 'react-router-dom'

const InputField = ({ children }) => {
	return <fieldset className='flex items-center gap-3'>{children}</fieldset>
}

export function RegisterForm() {
	const [matchPasswords, setMatchPasswords] = useState(true)

	var navigate = useNavigate()

	const { register, handleSubmit, reset, getValues } = useForm()

	const onSubmit = data => {
		const { confirmPassword: _confirmPassword, ...dataWithoutConfirm } = data
		let userData = dataWithoutConfirm

		if (dataWithoutConfirm.contacto === '') {
			const { contacto: _contacto, ...dataWithoutContact } = dataWithoutConfirm
			userData = dataWithoutContact
		}

		// Django: Date has wrong format. Use one of these formats instead: YYYY-MM-DD. -Nico
		userData.fecha_de_nacimiento = format(
			userData.fecha_de_nacimiento,
			'yyyy-MM-dd'
		)

		authService
			.register(userData)
			.then(() => {
				addToast({
					title: 'Cuenta creada con éxito',
					description: 'Ahora puedes iniciar sesión.',
					variant: 'flat',
					color: 'success',
				})
				reset()
				navigate('/login')
			})
			.catch(err => {
				addToast({
					title: 'Error al crear la cuenta',
					description: handleApiError(err),
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

	const validatePassword = () => {
		const password = getValues('password')
		const confirmPassword = getValues('confirmPassword')

		const isValid = password === confirmPassword
		setMatchPasswords(isValid)

		return isValid
	}

	return (
		<form
			className='w-[50%] flex flex-col gap-4 p-8 bg-white rounded-lg shadow-lg'
			onSubmit={handleSubmit(onSubmit, onError)}
		>
			<h1 className='text-3xl font-bold text-center'>Crear cuenta</h1>

			<InputField>
				<Input
					type='text'
					label='Nombre'
					{...register('nombre', { required: true })}
					isRequired
				/>

				<Input
					type='text'
					label='Apellido'
					{...register('apellido', { required: true })}
					isRequired
				/>
			</InputField>

			<InputField>
				<Input
					type='email'
					label='Correo electrónico'
					{...register('email', { required: true })}
					isRequired
				/>

				<Input
					type='number'
					label='DNI'
					{...register('dni', {
						required: true,
						valueAsNumber: true,
					})}
					isRequired
				/>
			</InputField>

			<Input
				type='date'
				label='Fecha de nacimiento'
				{...register('fecha_de_nacimiento', {
					valueAsDate: true,
					required: true,
				})}
				isRequired
			/>

			<Textarea
				label='Información de contacto'
				resize='none'
				size='lg'
				{...register('contacto')}
			/>

			<InputField>
				<InputPassword
					label='Contraseña'
					register={{
						...register('password', {
							required: true,
							validate: validatePassword,
						}),
					}}
				/>

				<InputPassword
					label='Confirmar contraseña'
					register={{
						...register('confirmPassword', {
							required: true,
							validate: validatePassword,
						}),
					}}
				/>
			</InputField>

			{!matchPasswords && (
				<span className='text-error text-sm bg-red-100 w-max px-4 py-2 rounded-md'>
					Las contraseñas no coinciden
				</span>
			)}

			<Button type='submit' color='primary' className='text-white'>
				Confirmar
			</Button>
		</form>
	)
}
