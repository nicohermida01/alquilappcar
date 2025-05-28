import { Button, Card, CardBody, Form, Input, Link, Select, SelectItem } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from 'axios';

function ReserveCard() {
  const [sucursales, setSucursales] = useState([]);
  const [isFetching, setIsFetching] = useState(true);

  const fetchSucursales = async () => {
    try {
      setIsFetching(true);
      const response = await axios.get('http://localhost:8000/alquilapp/api/v1/sucursales/');
      return response.data;
    } catch (error) {
      console.error('Error al obtener sucursales:', error);
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
      alert('Error al cargar las sucursales.');
    }
  };
  cargarSucursales();
}, []);
  
  const navigate = useNavigate();
  const [action, setAction] = useState(null);

  const [formData, setFormData] = useState({
    fecha_entrega: "",
    fecha_devolucion: "",
    sucursal: ""
  });

  // Cada vez que cambie un input se actualiza el objeto.
  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value)
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Card className="bg-background/60" isBlurred>
      {isFetching ? (
        <p className="text-gray-500 italic">Cargando sucursales...</p>
      ) : (
      <CardBody className="gap-4 p-10">
        <h2 className="font-bold text-2xl">¡Alquila tu vehículo ya!</h2>
        <Form
          className="w-full flex flex-col gap-4"
          onReset={() => setAction("reset")}
          onSubmit={(e) => {
            e.preventDefault();
            let data = Object.fromEntries(new FormData(e.currentTarget));
            //console.log(data)
            //setAction(`submit ${JSON.stringify(data)}`);
            // se envia a la pagina de alquiler con la información seteada.
            navigate("/alquiler", { state: { formData: data } });
          }}
        >
          <label className="block text-sm font-medium mb-1">Sucursal de Retiro</label>
          <Select aria-label="Seleccionar sucursal" label="Seleccione una sucursal">
            {sucursales.map((s)=>(
              <SelectItem key={s.id} value={s.direccion}>{s.direccion}</SelectItem>
            ))}
              </Select>

          <div className="grid grid-cols-2 gap-4 w-full">
            <Input
              isRequired
              errorMessage="Ingrese una fecha válida"
              label="Fecha y hora de entrega"
              labelPlacement="outside"
              name="fecha_entrega"
              placeholder="Ingrese una fecha"
              type="datetime-local"
            />

            <Input
              isRequired
              errorMessage="Ingrese una fecha válida"
              label="Fecha y hora de devolución"
              labelPlacement="outside"
              name="fecha_devolucion"
              placeholder="Ingrese una fecha"
              type="datetime-local"
            />
          </div>

          <div className="relative w-full" style={{ height: "50px" }}>
            <div className="absolute right-0 bottom-0 flex gap-2 ">
              <Button type="reset" variant="flat">
                Limpiar
              </Button>
              
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
      </CardBody>)}
    </Card>
  );
}

export default ReserveCard;
