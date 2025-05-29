import FieldCard from "./FieldCard.jsx"
import { useAuth } from "../contexts/AuthContext.jsx"
import { usersApi } from "../services/users.api.js"
import React from "react";

function UserData() {
    const { user } = useAuth();

    const [clientData, setClientData] = React.useState(null);

    React.useEffect(() => {
            usersApi.getUserById(1)
            .then((res) => {setClientData(res)})
            .catch((error) => console.error(error))
        }, []
    );

    if (!user)
        return <p>Cargando tus datos...</p>;

    return (
        <div className="mt-16 ml-[25%] justify-center">
            <ul>
                <li><FieldCard field="Nombre" value={clientData?.nombre}/></li>
                <li><FieldCard field="Apellido" value={clientData?.apellido}/></li>
                <li><FieldCard field="Fecha de nacimiento" value={clientData?.fecha_de_nacimiento}/></li>
                <li><FieldCard field="E-mail" value={clientData?.email}/></li>
                <li><FieldCard field="Contacto" value={clientData?.contacto}/></li>
            </ul>
        </div>
    );
}

export default UserData;
