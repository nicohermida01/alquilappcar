import {
	Button,
	Chip,
	Input,
	Pagination,
	Table,
	TableBody,
	TableCell,
	TableColumn,
	TableHeader,
	TableRow,
	Tooltip,
	useDisclosure,
} from '@heroui/react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { leasesApi } from '../api/leases.api'
import { getFormattedDate } from '../utils/getFecha'
import { formatAmount } from '../utils/formatAmount'
import {
	DELETED_RENT,
	STATUS_CHIP_COLORS,
	STATUS_TEXT,
	STATUS_TEXT_COLOR,
} from '../constants/rentStatus'
import ListClients from '../components/ListClients'
import {
	AMOUNT_COLUMN_KEY,
	CLIENT_COLUMN_KEY,
	columns,
	DAYS_COLUMN_KEY,
	/* END_DATE_COLUMN_KEY, */
	ID_COLUMN_KEY,
	INIT_DATE_COLUMN_KEY,
	REGISTER_DATE_COLUMN_KEY,
	STATE_COLUMN_KEY,
} from '../constants/alquilerTable'
import {
	DeleteIcon,
	EditIcon,
	EyeIcon,
	PlusIcon,
	SearchIcon,
} from '../assets/icons'
import { AlquilerDetailsModal } from '../components/AlquilerDetailsModal'
import { RefreshIcon } from '../components/icons/RefreshIcon'

export default function AlquileresPage() {
	const [selectedAlquiler, setSelectedAlquiler] = useState(null)
	const [searchValue, setSearchValue] = useState('')
	const [alquileres, setAlquileres] = useState([])
	const [refreshValue, setRefreshValue] = useState(0)
	const [isLoading, setIsLoading] = useState(true)
	const [page, setPage] = useState(1)
	const [totalPages, setTotalPages] = useState(1)
	const [sortDescriptor, setSortDescriptor] = useState({
		column: REGISTER_DATE_COLUMN_KEY,
		direction: 'descending',
	})

	const newAlquilerModalHandler = useDisclosure()
	const detailsAlquilerModalHander = useDisclosure()

	const rowsPerPage = 6

	const filteredItems = useMemo(() => {
		let filteredItems = alquileres
		const hasSearchFilter = searchValue.trim() !== ''

		if (hasSearchFilter) {
			// Filtramos por nombre o apellido del cliente
			filteredItems = filteredItems.filter(item => {
				const fullName = `${item[CLIENT_COLUMN_KEY].nombre} ${item[CLIENT_COLUMN_KEY].apellido}`
				return fullName.toLowerCase().includes(searchValue.toLowerCase())
			})
		}

		return filteredItems
	}, [alquileres, searchValue])

	const sortedItems = useMemo(() => {
		return [...filteredItems].sort((a, b) => {
			const first = a[sortDescriptor.column]
			const second = b[sortDescriptor.column]
			const cmp = first < second ? -1 : first > second ? 1 : 0

			return sortDescriptor.direction === 'descending' ? -cmp : cmp
		})
	}, [sortDescriptor, filteredItems])

	const itemsToShow = useMemo(() => {
		const start = (page - 1) * rowsPerPage
		const end = start + rowsPerPage

		return sortedItems.slice(start, end)
	}, [page, sortedItems, rowsPerPage])

	const renderCell = useCallback(
		(item, columnKey) => {
			switch (columnKey) {
				case ID_COLUMN_KEY:
					return `#${item[ID_COLUMN_KEY]}`
				case CLIENT_COLUMN_KEY:
					return `${item[CLIENT_COLUMN_KEY].nombre} ${item[CLIENT_COLUMN_KEY].apellido}`
				case REGISTER_DATE_COLUMN_KEY:
					return getFormattedDate(item[REGISTER_DATE_COLUMN_KEY])
				case INIT_DATE_COLUMN_KEY:
					return getFormattedDate(item[INIT_DATE_COLUMN_KEY])
				/* case END_DATE_COLUMN_KEY:
					return getFormattedDate(item[END_DATE_COLUMN_KEY]) */
				case DAYS_COLUMN_KEY:
					return item[DAYS_COLUMN_KEY]
				case AMOUNT_COLUMN_KEY:
					return `$${formatAmount(item[AMOUNT_COLUMN_KEY])}`
				case STATE_COLUMN_KEY:
					return (
						<Chip
							size='sm'
							color={STATUS_CHIP_COLORS[item[STATE_COLUMN_KEY]]}
							className={STATUS_TEXT_COLOR[item[STATE_COLUMN_KEY]]}
						>
							{STATUS_TEXT[item[STATE_COLUMN_KEY]]}
						</Chip>
					)
				case 'actions':
					return (
						<div className='flex items-center gap-2 text-lg'>
							<Tooltip content='Ver' size='sm'>
								<button
									className='hover:scale-125 transition-transform duration-200'
									onClick={() => {
										setSelectedAlquiler(item)
										detailsAlquilerModalHander.onOpen()
									}}
								>
									<EyeIcon />
								</button>
							</Tooltip>
							<Tooltip content='Editar' size='sm'>
								<button
									className='hover:scale-125 transition-transform duration-200'
									disabled={item.status === DELETED_RENT}
								>
									<EditIcon />
								</button>
							</Tooltip>
						</div>
					)
				default:
					return null
			}
		},
		[detailsAlquilerModalHander]
	)

	const onPreviousPage = useCallback(() => {
		if (page > 1) {
			setPage(page - 1)
		}
	}, [page])

	const onNextPage = useCallback(() => {
		if (page < totalPages) {
			setPage(page + 1)
		}
	}, [page, totalPages])

	const onSearchChange = useCallback(value => {
		if (value) {
			setSearchValue(value)
			setPage(1)
		} else {
			setSearchValue('')
		}
	}, [])

	const onClear = useCallback(() => {
		setSearchValue('')
		setPage(1)
	}, [])

	const topContent = useMemo(() => {
		return (
			<div className='flex flex-col gap-4 '>
				<div className='flex justify-between gap-3'>
					<Input
						isClearable
						type='search'
						variant='flat'
						className='w-full sm:max-w-[44%]'
						placeholder='Buscar por cliente...'
						startContent={<SearchIcon />}
						value={searchValue}
						onClear={() => onClear()}
						onValueChange={onSearchChange}
					/>

					<div className='flex gap-2 items-center'>
						<Button
							color='primary'
							onPress={() => newAlquilerModalHandler.onOpen()}
							endContent={<PlusIcon />}
						>
							Nuevo alquler
						</Button>

						<Button
							onPress={() => setRefreshValue(prev => prev + 1)}
							isLoading={isLoading}
						>
							{!isLoading && <RefreshIcon className='w-10 text-white' />}
						</Button>
					</div>
				</div>

				<div className='flex justify-between items-center'>
					<span className='text-default-400 text-small'>
						Resultado: {filteredItems.length} alquileres
					</span>
					<span className='text-default-400 text-small'>
						Filas por página: {rowsPerPage}
					</span>
				</div>
			</div>
		)
	}, [
		filteredItems.length,
		onClear,
		onSearchChange,
		rowsPerPage,
		newAlquilerModalHandler,
		searchValue,
		isLoading,
	])

	const bottomContent = useMemo(() => {
		return (
			<div className='py-2 px-2 flex justify-between items-center'>
				<Pagination
					isCompact
					showControls
					showShadow
					color='primary'
					page={page}
					total={totalPages}
					onChange={setPage}
				/>
				<div className='hidden sm:flex w-[30%] justify-end gap-2'>
					<Button
						isDisabled={totalPages === 1 || page === 1}
						size='sm'
						variant='flat'
						onPress={onPreviousPage}
					>
						Anterior
					</Button>
					<Button
						isDisabled={totalPages === 1 || page === totalPages}
						size='sm'
						variant='flat'
						onPress={onNextPage}
					>
						Siguiente
					</Button>
				</div>
			</div>
		)
	}, [onNextPage, onPreviousPage, page, totalPages])

	useEffect(() => {
		// Actualizamos el total de páginas cuando cambia el arreglo de items filtrados

		setTotalPages(Math.ceil(filteredItems.length / rowsPerPage))
	}, [filteredItems])

	useEffect(() => {
		// Traemos todos los alquileres al cargar la página
		setIsLoading(true)
		leasesApi
			.getAllLeases()
			.then(res => {
				/* console.log(res) */
				setAlquileres(res)
			})
			.catch(err => console.error('Error fetching leases:', err))
			.finally(() => setIsLoading(false))
	}, [refreshValue])

	return (
		<section className='w-full py-[135px] flex flex-col items-center justify-center bg-gray-100 gap-10'>
			<h2 className='text-3xl font-bold'>Lista de Alquileres</h2>

			<Table
				className='w-[90%]'
				classNames={{
					wrapper: 'h-[317px]',
				}}
				aria-label='Tabla de Alquileres'
				isHeaderSticky
				sortDescriptor={sortDescriptor}
				onSortChange={setSortDescriptor}
				topContent={topContent}
				topContentPlacement='outside'
				bottomContent={bottomContent}
				bottomContentPlacement='outside'
			>
				<TableHeader columns={columns}>
					{column => (
						<TableColumn key={column.uid} allowsSorting={column.sortable}>
							{column.name}
						</TableColumn>
					)}
				</TableHeader>
				<TableBody items={itemsToShow} isLoading={isLoading}>
					{item => (
						<TableRow key={item.id}>
							{columnKey => (
								<TableCell>{renderCell(item, columnKey)}</TableCell>
							)}
						</TableRow>
					)}
				</TableBody>
			</Table>

			<ListClients
				isOpen={newAlquilerModalHandler.isOpen}
				onOpenChange={newAlquilerModalHandler.onOpenChange}
			/>

			{selectedAlquiler && (
				<AlquilerDetailsModal
					isOpen={detailsAlquilerModalHander.isOpen}
					onOpenChange={detailsAlquilerModalHander.onOpenChange}
					rentId={selectedAlquiler.id}
					refreshTableFn={() => setRefreshValue(prev => prev + 1)}
				/>
			)}
		</section>
	)
}
