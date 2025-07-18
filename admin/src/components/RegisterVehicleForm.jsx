import {
	Input,
	Button,
	Select,
	SelectItem,
	Checkbox,
	addToast,
} from '@heroui/react'
import { useForm } from 'react-hook-form'
import { vehiclesApi } from '../api/vehicles.api'
import { handleApiError } from '../utils/handleApiError'

const InputField = ({ children }) => {
	return <fieldset className='flex items-center gap-3'>{children}</fieldset>
}

function RegisterVehicleForm({
	itemInfo: vehicleInfo,
	databaseInfo,
	updateItemList,
	onClose,
}) {
	const { brands, sucursales, categorias } = databaseInfo

  console.log(vehicleInfo, 'VEHICULO')
	const { register, handleSubmit, reset, getValues } = useForm()

	const onSubmit = data => {
		console.log(data)
		vehicleInfo
			? vehiclesApi
					.updateVehicle(data, vehicleInfo.id)
					.then(() => {
						addToast({
							title: 'Vehículo actualizado',
							description: 'El vehículo ha sido actualizado correctamente',
							color: 'success',
						})
						updateItemList()
					})
					.catch(error => {
						addToast({
							title: 'Error',
							description: handleApiError(error),
							color: 'danger',
						})
					})
			: vehiclesApi
					.createVehicle(data)
					.then(() => {
						addToast({
							title: 'Vehículo creado',
							description: 'El vehículo ha sido creado correctamente',
							color: 'success',
						})
						updateItemList()
						reset()
						onClose()
					})
					.catch(error => {
						addToast({
							title: 'Error',
							description: handleApiError(error),
							color: 'danger',
						})
						console.error(error)
					})
	}

	const onError = errors => {
		console.error(errors)
	}

	return (
		<form
			className='flex flex-col gap-4 p-8 bg-white rounded-lg shadow-lg'
			onSubmit={handleSubmit(onSubmit, onError)}
		>
			<div className='text-center mb-4'>
				<h2 className='text-3xl font-bold text-center'>
					{vehicleInfo ? 'Modificar vehículo' : 'Registrar vehículo'}
				</h2>
			</div>

			<Input
				type='text'
				label='Patente'
				defaultValue={vehicleInfo?.patente}
				{...register('patente', { required: true })}
				isRequired
			/>

			<InputField>
				<Select
					label='Marca'
					{...register('marca_id', {
						required: true,
						valueAsNumber: true,
					})}
					defaultSelectedKeys={[vehicleInfo?.marca.id.toString()]}
					isRequired
				>
					{brands.map(brand => (
						<SelectItem key={brand.id}>{brand.nombre}</SelectItem>
					))}
				</Select>

				<Input
					type='text'
					label='Modelo'
					defaultValue={vehicleInfo?.modelo}
					{...register('modelo', {
						required: true,
					})}
					isRequired
				/>
			</InputField>

			<InputField>
				<Select
					label='Categoría'
					defaultSelectedKeys={[vehicleInfo?.categoria.id.toString()]}
					{...register('categoria_id', {
						required: true,
						valueAsNumber: true,
					})}
					isRequired
				>
					{categorias.map(categoria => (
						<SelectItem key={categoria.id}>{categoria.nombre}</SelectItem>
					))}
				</Select>
			</InputField>

			<InputField>
				<Input
					type='number'
					label='Año'
					min={1900}
					defaultValue={vehicleInfo?.año}
					{...register('año', {
						required: true,
						valueAsNumber: true,
					})}
					isRequired
				/>

				<Input
					type='number'
					label='Pasajeros'
					min={1}
					defaultValue={vehicleInfo?.max_pasajeros}
					{...register('max_pasajeros', {
						required: true,
						valueAsNumber: true,
					})}
					isRequired
				/>
			</InputField>

			<Select
				label='Sucursal'
				defaultSelectedKeys={[vehicleInfo?.sucursal.id.toString()]}
				{...register('sucursal_id', {
					required: true,
					valueAsNumber: true,
				})}
				isRequired
			>
				{sucursales.map(sucursal => (
					<SelectItem key={sucursal.id}>
						{sucursal.direccion + ', ' + sucursal.localidad.nombre}
					</SelectItem>
				))}
			</Select>

			<InputField>
				<Input
					label='Días minimos de alquiler'
					type='number'
					min={0}
					defaultValue={vehicleInfo?.min_dias_alquiler}
					{...register('min_dias_alquiler', {
						required: true,
						valueAsNumber: true,
					})}
					isRequired
				/>
			</InputField>

			<Checkbox
				{...register('aptitud_discapacidad')}
				defaultSelected={vehicleInfo?.aptitud_discapacidad}
			>
				Apto para discapacitados
			</Checkbox>

      		<Checkbox
				{...register('activo')}
				defaultSelected={vehicleInfo ? vehicleInfo.activo : true }
			>
				Activo
			</Checkbox>

			<Button type='submit' color='primary' className='text-white'>
				Confirmar
			</Button>
		</form>
	)
}

export default RegisterVehicleForm
