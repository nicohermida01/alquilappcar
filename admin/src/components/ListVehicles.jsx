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
    Chip,
    User,
    Pagination,
    useDisclosure,
    Tooltip,
} from "@heroui/react";
import { vehiclesApi } from "../api/vehicles.api";
import {
    SearchIcon,
    PlusIcon,
    ChevronDownIcon,
    EyeIcon,
    EditIcon,
    DeleteIcon,
} from "../assets/icons";
import CreateVehicleModal from "./CreateVehicleModal";
import ViewVehicleModal from "./ViewVehicleModal";
import ModifyVehicleModal from "./ModifyVehicleModal";

const columns = [
    { name: "ID", uid: "id", sortable: true },
    { name: "MODELO", uid: "modelo", sortable: true },
    { name: "PATENTE", uid: "patente", sortable: true },
    { name: "MARCA", uid: "marca", sortable: true },
    { name: "AÑO", uid: "año", sortable: true },
    { name: "ACCIONES", uid: "actions" },
];

const statusOptions = [
    { name: "Active", uid: "active" },
    { name: "Paused", uid: "paused" },
    { name: "Vacation", uid: "vacation" },
];

const statusColorMap = {
    active: "success",
    paused: "warning",
    vacation: "danger",
};

const INITIAL_VISIBLE_COLUMNS = ["marca", "modelo", "patente", "actions"];

export default function ListVehicles() {
    const [vehicles, setVehicles] = React.useState([]);
    const [brands, setBrands] = React.useState([]);
    const [sucursales, setSucursales] = React.useState([]);
    const [categorias, setCategorias] = React.useState([]);
    const [cancelaciones, setCancelaciones] = React.useState([]);

    const [selectedVehicle, setSelectedVehicle] = React.useState();

    const {
        isOpen: isOpenCreateVehicle,
        onOpen: onOpenCreateVehicle,
        onOpenChange: onOpenChangeCreateVehicle,
    } = useDisclosure();

    const {
        isOpen: isOpenViewVehicle,
        onOpen: onOpenViewVehicle,
        onOpenChange: onOpenChangeViewVehicle,
    } = useDisclosure();

    const {
        isOpen: isOpenModifyVehicle,
        onOpen: onOpenModifyVehicle,
        onOpenChange: onOpenChangeModifyVehicle,
    } = useDisclosure();

    function onOpenVehicleView(vehicle) {
        setSelectedVehicle(vehicle);
        onOpenViewVehicle();
    }

    function onOpenVehicleModify(vehicle) {
        setSelectedVehicle(vehicle);
        onOpenModifyVehicle();
    }

    React.useEffect(() => {
        vehiclesApi
            .getAllVehicles()
            .then((res) => {
                setVehicles(res);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });

        vehiclesApi
            .getAllBrands()
            .then((res) => {
                setBrands(res);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });

        vehiclesApi
            .getAllSucursales()
            .then((res) => {
                setSucursales(res);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });

        vehiclesApi
            .getAllCategorias()
            .then((res) => {
                setCategorias(res);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });

        vehiclesApi
            .getAllCancelaciones()
            .then((res) => {
                setCancelaciones(res);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);

    const [filterValue, setFilterValue] = React.useState("");
    const [visibleColumns, setVisibleColumns] = React.useState(
        new Set(INITIAL_VISIBLE_COLUMNS)
    );
    const [statusFilter, setStatusFilter] = React.useState("all");
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
        let filteredVehicles = [...vehicles];

        if (hasSearchFilter) {
            filteredVehicles = filteredVehicles.filter((vehicle) =>
                vehicle.patente
                    .toLowerCase()
                    .includes(filterValue.toLowerCase())
            );
        }
        if (
            statusFilter !== "all" &&
            Array.from(statusFilter).length !== statusOptions.length
        ) {
            filteredVehicles = filteredVehicles.filter((vehicle) =>
                Array.from(statusFilter).includes(vehicle.status)
            );
        }

        return filteredVehicles;
    }, [vehicles, filterValue, statusFilter]);

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

    const renderCell = React.useCallback((vehicle, columnKey) => {
        const cellValue = vehicle[columnKey];

        switch (columnKey) {
            case "marca":
                return (
                    <User
                        avatarProps={{ radius: "lg", src: vehicle.avatar }}
                        name={brands.find((b) => b.id === vehicle.marca)?.name}
                        description={vehicle.marca}
                    ></User>
                );
            case "modelo":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-small capitalize">
                            {cellValue}
                        </p>
                        <p className="text-bold text-tiny capitalize text-default-400">
                            {vehicle.modelo}
                        </p>
                    </div>
                );
            case "patente":
                return (
                    <Chip
                        className="capitalize"
                        color={statusColorMap[vehicle.status]}
                        size="sm"
                        variant="flat"
                    >
                        {cellValue}
                    </Chip>
                );
            case "actions":
                return (
                    <div className="relative flex justify-end items-center gap-2">
                        <Tooltip content="Detalles">
                            <span
                                className="text-lg text-default-400  active:opacity-50"
                                onClick={() => onOpenVehicleView(vehicle)}
                            >
                                <EyeIcon />
                            </span>
                        </Tooltip>
                        <Tooltip content="Editar vehículo">
                            <span
                                className="text-lg text-default-400 cursor-pointer active:opacity-50"
                                onClick={() => onOpenVehicleModify(vehicle)}
                            >
                                <EditIcon />
                            </span>
                        </Tooltip>
                        <Tooltip color="danger" content="Eliminar vehículo">
                            <span className="text-lg text-danger cursor-pointer active:opacity-50">
                                <DeleteIcon />
                            </span>
                        </Tooltip>
                    </div>
                );
            default:
                return cellValue;
        }
    }, []);

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
                <div className="flex justify-between gap-3 items-end">
                    <Input
                        isClearable
                        className="w-full sm:max-w-[44%]"
                        placeholder="Buscar por patente..."
                        startContent={<SearchIcon />}
                        value={filterValue}
                        onClear={() => onClear()}
                        onValueChange={onSearchChange}
                    />
                    <div className="flex gap-3">
                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button
                                    endContent={
                                        <ChevronDownIcon className="text-small" />
                                    }
                                    variant="flat"
                                >
                                    Status
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
                                closeOnSelect={false}
                                selectedKeys={statusFilter}
                                selectionMode="multiple"
                                onSelectionChange={setStatusFilter}
                            >
                                {statusOptions.map((status) => (
                                    <DropdownItem
                                        key={status.uid}
                                        className="capitalize"
                                    >
                                        {status.name}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button
                                    endContent={
                                        <ChevronDownIcon className="text-small" />
                                    }
                                    variant="flat"
                                >
                                    Columns
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
                        <Button
                            color="primary"
                            onPress={onOpenCreateVehicle}
                            endContent={<PlusIcon />}
                        >
                            Add New
                        </Button>
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-default-400 text-small">
                        Total {vehicles.length} vehicles
                    </span>
                    <label className="flex items-center text-default-400 text-small">
                        Rows per page:
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
        statusFilter,
        visibleColumns,
        onRowsPerPageChange,
        vehicles.length,
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
                        Previous
                    </Button>
                    <Button
                        isDisabled={pages === 1}
                        size="sm"
                        variant="flat"
                        onPress={onNextPage}
                    >
                        Next
                    </Button>
                </div>
            </div>
        );
    }, [items.length, page, pages, hasSearchFilter]);

    return (
        <>
            <CreateVehicleModal
                onOpenChange={onOpenChangeCreateVehicle}
                isOpen={isOpenCreateVehicle}
                databaseInfo={{
                    brands,
                    sucursales,
                    categorias,
                    cancelaciones,
                }}
            />
            <ViewVehicleModal
                onOpenChange={onOpenChangeViewVehicle}
                isOpen={isOpenViewVehicle}
                vehicle={selectedVehicle}
            />
            <ModifyVehicleModal
                onOpenChange={onOpenChangeModifyVehicle}
                isOpen={isOpenModifyVehicle}
                vehicleInfo={selectedVehicle}
                databaseInfo={{
                    brands,
                    sucursales,
                    categorias,
                    cancelaciones,
                }}
            />
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
                    emptyContent={"No vehicles found"}
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
