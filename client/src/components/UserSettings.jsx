import EditFieldCard from "./EditFieldCard"
import { Button } from "@heroui/react"

function UserSettings() {
    return (
        <div className="mt-16 ml-[25%] justify-center">
            <ul>
                <li><EditFieldCard field="Editar nombre" pHolder={"Ej: Juan"}/></li>
                <li><EditFieldCard field="Editar apellido" pHolder="Ej: Perez"/></li>
                <li><EditFieldCard field="Editar e-mail" pHolder="Ej: juanperez@abc.com"/></li>
                <li><EditFieldCard field="Editar informacion de contacto" pHolder="Ej: 2214142211"/></li>
            </ul>
            <Button color="primary" className="text-white ml-[45%]">Guardar cambios</Button>
        </div>
    )
}

export default UserSettings;
