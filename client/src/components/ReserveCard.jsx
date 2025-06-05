import {
    Button,
    Card,
    CardBody,
    Form,
    Input,
    Link,
    Select,
    SelectItem,
} from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import RequiredIcon from "../components/RequiredIcon";
import axios from "axios";
import { useRent } from "../contexts/RentContext";

function ReserveCard() {
    const [sucursales, setSucursales] = useState([]);
    const [isFetching, setIsFetching] = useState(true);
    const [fechaEntrega, setFechaEntrega] = useState("");
    const { isAuthenticated } = useAuth();
    const { setRentBasic } = useRent();

    const fetchSucursales = async () => {
        try {
            setIsFetching(true);
            const response = await axios.get(
                "http://localhost:8000/alquilapp/api/v1/sucursales/populated/"
            );
            return response.data;
        } catch (error) {
            console.error("Error al obtener sucursales:", error);
            throw error;
        } finally {
            setIsFetching(false);
        }
    };

    useEffect(() => {
        const cargarSucursales = async () => {
            try {
                const data = await fetchSucursales();
                setSucursales(data);
                //console.log(data, 'HOLA')
            } catch (error) {
                alert("Error al cargar las sucursales.");
            }
        };
        cargarSucursales();
    }, []);

    const navigate = useNavigate();
    const [action, setAction] = useState(null);

    const [formData, setFormData] = useState({
        fecha_entrega: "",
        fecha_devolucion: "",
        sucursal: "",
    });

    // Cada vez que cambie un input se actualiza el objeto.
    const handleChange = (e) => {
        const { name, value } = e.target;
        console.log(name, value);
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Necesito hacer una funcion que calcule un mínimo para deshabilitar fechas viejas en el input de fecha_entrega.
    const getNowForInput = () => {
        const now = new Date();
        now.setSeconds(0, 0); // limpiamos segundos y milisegundos
        now.setHours(now.getHours() - 3); // retorna una hora en un timezone raro, tengo que restarle 3 para que se acople a la local.
        //console.log(now);
        return now.toISOString().slice(0, 16); // formato: 'YYYY-MM-DDTHH:MM'
    };

    return (
        <Card className="bg-background/60" isBlurred>
            {isFetching ? (
                <p className="text-gray-500 italic">Cargando sucursales...</p>
            ) : (
                <CardBody className="gap-4 p-10">
                    <h2 className="font-bold text-2xl">
                        ¡Alquila tu vehículo ya!
                    </h2>
                    <Form
                        className="w-full flex flex-col gap-4"
                        onReset={() => setAction("reset")}
                        onSubmit={(e) => {
                            e.preventDefault();
                            let data = Object.fromEntries(
                                new FormData(e.currentTarget)
                            );

                            console.log("DATA", data);
                            setRentBasic(data);

                            if (isAuthenticated) {
                                navigate("/alquiler");
                            } else {
                                navigate("/login");
                            }
                        }}
                    >
                        <Select
                            errorMessage="Es necesario que indique una sucursal de retiro."
                            isRequired
                            name="sucursal"
                            aria-label="Seleccionar sucursal"
                            label="Sucursal de retiro"
                            labelPlacement="outside"
                            placeholder="Seleccionar sucursal"
                        >
                            {sucursales.map((s) => {
                                const value = `${s.direccion}, ${s.localidad.nombre}`;
                                return (
                                    <SelectItem key={s.id} value={s.id}>
                                        {value}
                                    </SelectItem>
                                );
                            })}
                        </Select>

                        <div className="grid grid-cols-2 gap-4 w-full">
                            <Input
                                onChange={(e) =>
                                    setFechaEntrega(e.target.value)
                                }
                                name="fecha_entrega"
                                isRequired
                                errorMessage="Ingrese una fecha válida."
                                label={"Fecha y hora de entrega"}
                                labelPlacement="outside"
                                placeholder="Ingrese una fecha"
                                type="datetime-local"
                                min={getNowForInput()}
                            />
                            <Input
                                min={fechaEntrega}
                                disabled={!fechaEntrega}
                                name="fecha_devolucion"
                                className={
                                    !fechaEntrega
                                        ? "opacity-50 cursor-not-allowed"
                                        : ""
                                }
                                isRequired
                                errorMessage="La fecha debe ser válida y posterior a la de inicio."
                                label="Fecha y hora de devolucion"
                                labelPlacement="outside"
                                placeholder="Ingrese una fecha"
                                type="datetime-local"
                            />
                        </div>

                        <div
                            className="relative w-full"
                            style={{ height: "50px" }}
                        >
                            <div className="absolute right-0 bottom-0 flex gap-2 ">
                                <Button
                                    className="text-white"
                                    color="secondary"
                                    variant="shadow"
                                    type="submit"
                                >
                                    Reserve ahora
                                </Button>
                            </div>
                        </div>
                    </Form>
                </CardBody>
            )}
        </Card>
    );
}

export default ReserveCard;
