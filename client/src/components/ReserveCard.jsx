import { Button, Card, CardBody, Form, Input } from "@heroui/react";

function ReserveCard() {
  return (
    <Card className="bg-background/60" isBlurred>
      <CardBody className="gap-4 p-10">
        <h2 className="font-bold text-2xl">¡Alquila tu vehículo ya!</h2>
        <Form
          className="w-full flex flex-col gap-4"
          onReset={() => setAction("reset")}
          onSubmit={(e) => {
            e.preventDefault();
            let data = Object.fromEntries(new FormData(e.currentTarget));

            setAction(`submit ${JSON.stringify(data)}`);
          }}
        >
          <Input
            isRequired
            errorMessage="Ingrese una sucursal válida"
            label="Sucursal de entrega"
            labelPlacement="outside"
            name="sucursal"
            placeholder="Ingrese una sucursal"
            type="text"
          />

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
      </CardBody>
    </Card>
  );
}

export default ReserveCard;
