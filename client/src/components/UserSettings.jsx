import EditFieldCard from "./EditFieldCard"
import { Button } from "@heroui/react"

function UserSettings() {
    return (
        <div className="mt-16 ml-[25%] justify-center">
            <ul>
                <li><EditFieldCard field="Editar nombre" pHolder="name"/></li>
                <li><EditFieldCard field="Editar apellido" pHolder="Lname"/></li>
                <li><EditFieldCard field="Editar e-mail" pHolder="email"/></li>
                <li><EditFieldCard field="Editar informacion de contacto" pHolder="contact"/></li>
            </ul>
            <Button color="primary" className="text-white ml-[45it%]">Guardar cambios</Button>
        </div>
    )
}

export default UserSettings;
