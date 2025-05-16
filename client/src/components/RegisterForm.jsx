import { Input, Button, Textarea } from '@heroui/react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { InputPassword } from './InputPassword'

const InputField = ({ children }) => {
	return <fieldset className='flex items-center gap-3'>{children}</fieldset>
}

export function RegisterForm() {
	const [matchPasswords, setMatchPasswords] = useState(true)

	const { register, handleSubmit, reset, getValues } = useForm()

	const onSubmit = data => {
		console.log(data)
		reset()
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
				isRequired
				{...register('contacto', { required: true })}
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
				<span className='text-error text-xs'>Las contraseñas no coinciden</span>
			)}

			<Button type='submit' color='primary' className='text-white'>
				Confirmar
			</Button>
		</form>
	)
}
