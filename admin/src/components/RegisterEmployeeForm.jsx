import { Input, Button, Select, SelectItem } from '@heroui/react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { InputPassword } from './InputPassword'
import { subsidiariesApi } from '../api/subsidiaries.api'
import { employeeApi } from '../api/employee.api'
import toast, { Toaster } from 'react-hot-toast'

const InputField = ({ children }) => {
	return <fieldset className='flex items-center gap-3'>{children}</fieldset>
}

export function RegisterEmployeeForm() {
	const [matchPasswords, setMatchPasswords] = useState(true)
	const [subsidiariesList, setSubsidiariesList] = useState([])

	const { register, handleSubmit, reset, getValues } = useForm()

	const onSubmit = data => {
		const { confirmPassword, ...dataWithoutConfirmPassword } = data
		let employeeData = dataWithoutConfirmPassword

		employeeApi
			.register(employeeData)
			.then(() => {
				toast.success('Empleado registrado correctamente')
				reset()
			})
			.catch(err => {
				toast.error('Parece que hubo un error al registrar el empleado')
				console.error(err)
			})
	}

	const onError = errors => {
		console.error(errors)
	}

	// Este effect reinicia el formulario cada vez que la función reset cambia, asegurando que el formulario esté limpio al montar el componente o cuando reset se actualiza -Nico
	useEffect(() => {
		reset()
	}, [reset])

	useEffect(() => {
		// Este effect es para obtener la lista de sucursales al cargar el formulario -Nico
		subsidiariesApi
			.getSubsidiariesPopulated()
			.then(res => {
				setSubsidiariesList(res)
			})
			.catch(err => console.error(err))
	}, [])

	const validatePassword = () => {
		const password = getValues('password')
		const confirmPassword = getValues('confirmPassword')

		const isValid = password === confirmPassword
		setMatchPasswords(isValid)

		return isValid
	}

	return (
		<>
			<form
				className='w-[50%] flex flex-col gap-4 p-8 bg-white rounded-lg shadow-lg'
				onSubmit={handleSubmit(onSubmit, onError)}
			>
				<div className='text-center mb-4'>
					<h2 className='text-3xl font-bold text-center'>Registrar empleado</h2>
					<span className='text-error'>Solo para administradores</span>
				</div>

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
					<span className='text-error text-xs'>
						Las contraseñas no coinciden
					</span>
				)}

				<Select
					label='Sucursal'
					{...register('sucursal', { required: true })}
					isRequired
				>
					{subsidiariesList.map(elem => {
						return (
							<SelectItem
								key={elem.id}
							>{`${elem.localidad.nombre} - ${elem.direccion}`}</SelectItem>
						)
					})}
				</Select>

				<Button type='submit' color='primary' className='text-white'>
					Confirmar
				</Button>
			</form>
			<Toaster />
		</>
	)
}
