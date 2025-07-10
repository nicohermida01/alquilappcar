import React from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Input,
    Button,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Pagination,
    useDisclosure,
    Tooltip,
} from "@heroui/react";
import {
    SearchIcon,
    PlusIcon,
    ChevronDownIcon,
    EyeIcon,
    EditIcon,
    DeleteIcon,
    CarIcon,
} from "../../assets/icons";
import CreateItemModal from "./CreateItemModal";
import ModifyItemModal from "./ModifyItemModal";
import ViewItemModal from "./ViewItemModal";
import DeleteItemModal from "./DeleteItemModal";
import { ListRentsModal } from "../listRentsModal";
import { useAuth } from '../../contexts/AuthContext'

export default function ListItems({
    columns,
    INITIAL_VISIBLE_COLUMNS,
    registerForm,
    infoShow,
    itemList,
    databaseInfo,
    fetchInfo,
    itemName,
    deleteFunction,
}) {
    const { user, logout } = useAuth()
    const [selectedItem, setSelectedItem] = React.useState();

    const {
        isOpen: isOpenCreateItem,
        onOpen: onOpenCreateItem,
        onOpenChange: onOpenChangeCreateItem,
    } = useDisclosure();

    const {
        isOpen: isOpenViewItem,
        onOpen: onOpenViewItem,
        onOpenChange: onOpenChangeViewItem,
    } = useDisclosure();

    const {
        isOpen: isOpenModifyItem,
        onOpen: onOpenModifyItem,
        onOpenChange: onOpenChangeModifyItem,
    } = useDisclosure();

    const {
        isOpen: isOpenDeleteItem,
        onOpen: onOpenDeleteItem,
        onOpenChange: onOpenChangeDeleteItem,
    } = useDisclosure();

    const handleRentModal = useDisclosure();

    function onOpenItemDelete(item) {
        setSelectedItem(item);
        onOpenDeleteItem();
    }

    function onOpenItemView(item) {
        setSelectedItem(item);
        onOpenViewItem();
    }

    function onOpenItemModify(item) {
        setSelectedItem(item);
        onOpenModifyItem();
    }

    const onOpenItemRents = (item) => {
        setSelectedItem(item);
        handleRentModal.onOpen();
    };

    const [filterValue, setFilterValue] = React.useState("");
    const [visibleColumns, setVisibleColumns] = React.useState(
        new Set(INITIAL_VISIBLE_COLUMNS)
    );

    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [sortDescriptor, setSortDescriptor] = React.useState({
        column: "age",
        direction: "ascending",
    });
    const [page, setPage] = React.useState(1);

    const hasSearchFilter = Boolean(filterValue);

    const headerColumns = React.useMemo(() => {
        if (visibleColumns === "all") return columns;

        return columns.filter((column) =>
            Array.from(visibleColumns).includes(column.uid)
        );
    }, [visibleColumns]);

    const filteredItems = React.useMemo(() => {
        let filteredItems = [...itemList];

        if (hasSearchFilter) {
            filteredItems = filteredItems.filter((item) =>
                item[Object.keys(item)[1]]
                    .toLowerCase()
                    .includes(filterValue.toLowerCase())
            );
        }

        return filteredItems;
    }, [itemList, filterValue]);

    const pages = Math.ceil(filteredItems.length / rowsPerPage) || 1;

    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return filteredItems.slice(start, end);
    }, [page, filteredItems, rowsPerPage]);

    const sortedItems = React.useMemo(() => {
        return [...items].sort((a, b) => {
            const first = a[sortDescriptor.column];
            const second = b[sortDescriptor.column];
            const cmp = first < second ? -1 : first > second ? 1 : 0;

            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, items]);

    const entitiesWithActivo = ["vehículo", "alquiler", "cliente", "sucursal", "empleado"]

    const renderCell = React.useCallback((item, columnKey) => {
        //console.log(item, 'ITEM' , columnKey, 'COLUMNKEY')
        const cellValue = item[columnKey];
        // console.log(item, 'ITEM')
        switch (columnKey) {
            case "sucursal":
                return (
                    // <p>
                    //     {databaseInfo?.sucursales[cellValue - 1]?.localidad
                    //         .nombre +
                    //         ", dadsa" +
                    //         databaseInfo?.sucursales[cellValue - 1]?.direccion}
                    // </p>
                    <p>{item.sucursal.localidad.nombre}, {item.sucursal.direccion}</p>
                );
            case "localidad":
                return <p>{item.localidad.nombre}</p>;
            case "marca":
                // return <p>{databaseInfo?.brands[cellValue - 1]?.nombre}</p>;
                return <p>{item?.marca?.nombre}</p>;
            case "categoria":
                // return <p>{databaseInfo.categorias[cellValue - 1]?.nombre}</p>;
                 return <p>{item?.categoria?.nombre}</p>;
            case "cancelacion":
                return <p>{item.cancelacion.descripcion}</p>;
            case "activo":
                // return <p>{item.activo ? 'Sí':'Dado de baja'}</p>
                return typeof item.activo === "boolean" ? (
                  <p>{item.activo ? "Sí" : "Dado de baja"}</p>
                ) : null
            case "actions":
                return (
                    <div className="relative flex justify-end items-center gap-2">
                        {itemName === "cliente" && (
                            <Tooltip content="Alquileres">
                                <span onClick={() => onOpenItemRents(item)}>
                                    <CarIcon className="text-lg text-default-400 cursor-pointer active:opacity-50" />
                                </span>
                            </Tooltip>
                        )}
                        <Tooltip content="Detalles">
                            <span
                                className="text-lg text-default-400 cursor-pointer active:opacity-50"
                                onClick={() => onOpenItemView(item)}
                            >
                                <EyeIcon />
                            </span>
                        </Tooltip>
                        {((["vehículo", 'empleado', 'sucursal', 'paquete', 'categoría', 'marca', 'cancelacion', 'localidad'].includes(itemName) && user.isAdmin) || ['cliente'].includes(itemName)) &&
                        <Tooltip content={"Editar " + itemName}>
                            <span
                                className="text-lg text-default-400 cursor-pointer active:opacity-50"
                                onClick={() => onOpenItemModify(item)}
                            >
                                <EditIcon />
                            </span>
                        </Tooltip>
                        }
                        {/* {["cliente"].includes(itemName) && <Tooltip content={"Editar " + itemName}>
                            <span
                                className="text-lg text-default-400 cursor-pointer active:opacity-50"
                                onClick={() => onOpenItemModify(item)}
                            >
                                <EditIcon />
                            </span>
                        </Tooltip>} */}
                        {/* aaaaaAAAAAAAAAAAAAAAAAAAAAAAA */}
                        {user.isAdmin && ["sucursal", "empleado", "cliente", "vehículo"].includes(itemName) && entitiesWithActivo.includes(itemName) && Number(item.activo) ? (<Tooltip content={"Eliminar " + itemName}>
                            <span
                              className="text-lg text-danger cursor-pointer active:opacity-50"
                              onClick={() => onOpenItemDelete(item)}
                            >
                              <DeleteIcon />
                            </span>
                          </Tooltip>) : (
                          null
                        )}
                    </div>
                );
            default:
                return cellValue;
        }
    }, []);

    const pluralMap = {
      cliente: "clientes",
      vehiculo: "vehículos",
      alquiler: "alquileres",
      localidad: "localidades",
      sucursal: "sucursales",
      categoria: "categorías",
      paquete: "paquetes",
      empleado: "empleados",
      // agregá más si necesitás
    }

    const onNextPage = React.useCallback(() => {
        if (page < pages) {
            setPage(page + 1);
        }
    }, [page, pages]);

    const onPreviousPage = React.useCallback(() => {
        if (page > 1) {
            setPage(page - 1);
        }
    }, [page]);

    const onRowsPerPageChange = React.useCallback((e) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1);
    }, []);

    const onSearchChange = React.useCallback((value) => {
        if (value) {
            setFilterValue(value);
            setPage(1);
        } else {
            setFilterValue("");
        }
    }, []);

    const onClear = React.useCallback(() => {
        setFilterValue("");
        setPage(1);
    }, []);

    const topContent = React.useMemo(() => {
        return (
            <div className="flex flex-col gap-4 ">
                <div className="flex justify-between gap-3">
{/*                     <Input
                        isClearable
                        className="w-full sm:max-w-[44%]"
                        placeholder="Buscar por nombre..."
                        startContent={<SearchIcon />}
                        value={filterValue}
                        onClear={() => onClear()}
                        onValueChange={onSearchChange}
                    /> */}
                    <div className="flex gap-3">
                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button
                                    endContent={
                                        <ChevronDownIcon className="text-small" />
                                    }
                                    variant="flat"
                                >
                                    Columnas
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
                                closeOnSelect={false}
                                selectedKeys={visibleColumns}
                                selectionMode="multiple"
                                onSelectionChange={setVisibleColumns}
                            >
                                {columns.map((column) => (
                                    <DropdownItem
                                        key={column.uid}
                                        className="capitalize"
                                    >
                                        {column.name}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                        {/* hay que hacerlo condicional según la entidad y segun el rol */}
                        {/* <Button
                            color="primary"
                            onPress={onOpenCreateItem}
                            endContent={<PlusIcon />}
                        >
                            Crear nuevo
                        </Button> */}
                        {["sucursal", "empleado", "categoría", "vehículo", "marca", "paquete", 'localidad'].includes(itemName) && user.isAdmin && (
                          <Button
                            color="primary"
                            onPress={onOpenCreateItem}
                            endContent={<PlusIcon />}
                          >
                            Crear nuevo
                          </Button>
                        )}
                        {["cliente"].includes(itemName) && (
                          <Button
                            color="primary"
                            onPress={onOpenCreateItem}
                            endContent={<PlusIcon />}
                          >
                            Crear nuevo
                          </Button>
                        )}
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    {/* <span className="text-default-400 text-small">
                        Total {itemList.length} {itemName}s
                    </span> */}
                    <span className="text-default-400 text-small">
  Total {itemList.length} {pluralMap[itemName] || itemName + "s"}
</span>
                    <label className="flex items-center text-default-400 text-small">
                        Filas por página:
                        <select
                            className="bg-transparent outline-none text-default-400 text-small"
                            onChange={onRowsPerPageChange}
                        >
                            <option value="5">5</option>
                            <option value="10">10</option>
                            <option value="15">15</option>
                        </select>
                    </label>
                </div>
            </div>
        );
    }, [
        filterValue,
        visibleColumns,
        onRowsPerPageChange,
        itemList.length,
        onSearchChange,
        hasSearchFilter,
    ]);

    const bottomContent = React.useMemo(() => {
        return (
            <div className="py-2 px-2 flex justify-between items-center">
                <span className="w-[30%] text-small text-default-400"></span>
                <Pagination
                    isCompact
                    showControls
                    showShadow
                    color="primary"
                    page={page}
                    total={pages}
                    onChange={setPage}
                />
                <div className="hidden sm:flex w-[30%] justify-end gap-2">
                    <Button
                        isDisabled={pages === 1}
                        size="sm"
                        variant="flat"
                        onPress={onPreviousPage}
                    >
                        Siguiente
                    </Button>
                    <Button
                        isDisabled={pages === 1}
                        size="sm"
                        variant="flat"
                        onPress={onNextPage}
                    >
                        Anterior
                    </Button>
                </div>
            </div>
        );
    }, [itemList.length, page, pages, hasSearchFilter]);

    return (
        <>
            <CreateItemModal
                onOpenChange={onOpenChangeCreateItem}
                isOpen={isOpenCreateItem}
                updateItemList={fetchInfo}
                registerForm={registerForm}
                databaseInfo={databaseInfo}
            />
            <ModifyItemModal
                itemInfo={selectedItem}
                isOpen={isOpenModifyItem}
                onOpenChange={onOpenChangeModifyItem}
                updateItemList={fetchInfo}
                registerForm={registerForm}
                databaseInfo={databaseInfo}
            />
            <ViewItemModal
                isOpen={isOpenViewItem}
                onOpenChange={onOpenChangeViewItem}
                infoShow={infoShow}
                itemInfo={selectedItem}
                databaseInfo={databaseInfo}
                itemName={itemName}
            />
            <DeleteItemModal
                onOpenChange={onOpenChangeDeleteItem}
                isOpen={isOpenDeleteItem}
                itemInfo={selectedItem}
                updateItemList={fetchInfo}
                deleteItem={infoShow}
                deleteFunction={deleteFunction}
            />
            {itemName === "cliente" && (
                <ListRentsModal
                    isOpen={handleRentModal.isOpen}
                    onOpenChange={handleRentModal.onOpenChange}
                    client={selectedItem}
                />
            )}
            <Table
                isHeaderSticky
                aria-label="Example table with custom cells, pagination and sorting"
                bottomContent={bottomContent}
                bottomContentPlacement="outside"
                classNames={{
                    wrapper: "max-h-[382px]",
                }}
                className="w-[80%]"
                sortDescriptor={sortDescriptor}
                topContent={topContent}
                topContentPlacement="outside"
                onSortChange={setSortDescriptor}
            >
                <TableHeader columns={headerColumns}>
                    {(column) => (
                        <TableColumn
                            key={column.uid}
                            align={
                                column.uid === "actions" ? "center" : "start"
                            }
                            allowsSorting={column.sortable}
                        >
                            {column.name}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody
                    emptyContent={"No se encontraron " + itemName + "s"}
                    items={sortedItems}
                >
                    {(item) => (
                        <TableRow key={item.id}>
                            {(columnKey) => (
                                <TableCell>
                                    {renderCell(item, columnKey)}
                                </TableCell>
                            )}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </>
    );
}
