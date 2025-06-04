import React, { useState } from 'react'
import ListItems from '../components/ListPageComponents/ListItems'
import { vehiclesApi } from '../api/vehicles.api'
import RegisterCategoriaForm from '../components/RegisterCategoriaForm'

export default function CategoriasPage() {
	const columns = [
		{ name: 'ID', uid: 'id', sortable: true },
		{ name: 'NOMBRE', uid: 'nombre', sortable: true },
		{ name: 'PRECIO', uid: 'precio', sortable: true },
		{ name: 'ACCIONES', uid: 'actions' },
	]

	const INITIAL_VISIBLE_COLUMNS = ['nombre', 'precio', 'actions']

	const [itemList, setItemList] = useState([])
	const [databaseInfo, setDatabaseInfo] = useState()

	function fetchInfo() {
		vehiclesApi
			.getAllCategorias()
			.then(res => {
				setItemList(res)
			})
			.catch(error => {
				console.error('Error fetching data:', error)
			})

		vehiclesApi
			.getAllCancelaciones()
			.then(res => {
				setDatabaseInfo(res)
			})
			.catch(error => {
				console.error('Error fetching data:', error)
			})
	}

	React.useEffect(() => {
		fetchInfo()
	}, [])

	return (
		<section className='w-full py-[135px] flex flex-col items-center justify-center bg-gray-100 gap-10'>
			<h2 className='text-3xl font-bold text-center'>Lista de categorías</h2>
			<ListItems
				registerForm={<RegisterCategoriaForm />}
				infoShow={<></>} // Placeholder for info show component
				deleteItem={<></>} // Placeholder for delete item component
				columns={columns}
				INITIAL_VISIBLE_COLUMNS={INITIAL_VISIBLE_COLUMNS}
				fetchInfo={fetchInfo}
				itemList={itemList}
				itemName={'categoría'}
				databaseInfo={databaseInfo}
			/>
		</section>
	)
}
