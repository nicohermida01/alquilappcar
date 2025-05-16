import { Input, Button } from '@heroui/react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { InputPassword } from './InputPassword'

export function LoginForm() {
	const { register, handleSubmit, reset } = useForm()

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

	return (
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
	)
}
