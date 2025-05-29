import FieldCard from "./FieldCard.jsx"
import { useAuth } from "../contexts/AuthContext.jsx"

function UserData() {
    const { user } = useAuth();

    if (!user)
        return <p>Cargando tus datos...</p>;

    return (
        <div className="mt-16 ml-[25%] justify-center">
            <ul>
                <li><FieldCard field="Nombre" value={user.nombre}/></li>
                <li><FieldCard field="Apellido" value={user.apellido}/></li>
                <li><FieldCard field="Fecha de nacimiento" value={user.fecha_de_nacimiento}/></li>
                <li><FieldCard field="E-mail" value={user.email}/></li>
                <li><FieldCard field="Contacto" value={user.contacto}/></li>
            </ul>
        </div>
    );
}

export default UserData;
