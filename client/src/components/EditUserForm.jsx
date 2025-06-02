import { useAuth } from "../contexts/AuthContext"
import { useState, useEffect } from 'react'
import { Form, Input, Button } from "@heroui/react"
import { usersApi } from "../services/users.api"

function EditUserForm() {
    const { user } = useAuth();
    const [clientData, setClientData] = useState(null);

    const [action, setAction] = useState(null)

    useEffect(() => {
            usersApi.getUserById(user.clientId)
            .then((res) => {setClientData(res)})
            .catch((error) => console.error(error))
        }, []
    );

  return (
    <Form
      className="w-full max-w-xs flex flex-col gap-4"
      onReset={() => setAction("reset")}
      onSubmit={(e) => {
        e.preventDefault();
        let data = Object.fromEntries(new FormData(e.currentTarget));

        setAction(`submit ${JSON.stringify(data)}`);
      }}
    >
      <Input 
        label="Nombre"
        labelPlacement="outside-left"
      />
      <Input 
        label="Apellido"
        labelPlacement="outside-left"
      />
      <Input 
        label="Contacto"
        labelPlacement="outside-left"
      />
      <Input 
        label="Email"
        labelPlacement="outside-left"
      />
      <div className="flex gap-2">
        <Button color="primary" type="submit">
          Submit
        </Button>
        <Button type="reset" variant="flat">
          Reset
        </Button>
      </div>
    </Form>
  );
}

export default EditUserForm;
