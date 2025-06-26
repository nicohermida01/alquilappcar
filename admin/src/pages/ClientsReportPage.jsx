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
import { clientApi } from '../api/client.api.js'
import { useState, useEffect } from 'react'

function ClientsReportPage() {
    const columns = [
        { name: "ID", uid: "id", sortable: true },
        { name: "APELLIDO", uid: "apellido", sortable: true },
        { name: "NOMBRE", uid: "nombre", sortable: true },
        { name: "EMAIL", uid: "email", sortable: true },
        { name: "ACTIVO", uid: "activo", sortable: true },
        { name: "ACCIONES", uid: "actions" },
    ];

    const [clientes, setClientes] = useState([]);

    function fetchClients() {
        clientApi.getAllClients()
        .then(res => {
            setClientes(res);
        })
        .catch(err => {
            console.log(`Could not retrieve clients from DB. ${err}`)
        });
    }

    useEffect(() => {
        fetchClients();
    }, []);

    return (
        <section className='w-full py-[135px] flex flex-col items-center justify-center bg-gray-100 gap-10'>
            <h2 className='text-3xl font-bold'>Reporte de clientes</h2>

            <Table
                className='w-[90%]'
                classNames={{
                    wrapper: 'h-[317px]',
                }}
                aria-label='Reporte de clientes'
                isHeaderSticky
                topContentPlacement='outside'
                bottomContentPlacement='outside'
            >
                <TableHeader columns={columns}>
					{column => (
						<TableColumn key={column.uid} allowsSorting={column.sortable}>
							{column.name}
						</TableColumn>
					)}
                </TableHeader>
                <TableBody emptyContent={"No se encontraron clientes que coincidan con el criterio."}>

                </TableBody>
            </Table>
        </section>
    );
}

export default ClientsReportPage;
