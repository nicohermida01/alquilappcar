import FieldCard from "./FieldCard"
import { usersApi } from "../services/users.api"
import { useState, useEffect } from 'react'
import { useAuth } from "../contexts/AuthContext"

function UserAlquileres() {
    const { user } = useAuth();
    const [alquileres, setAlquileres] = useState([]);

    useEffect(() => {
        usersApi.getAlquileresByUserId(user.clientId)
        .then((response) => setAlquileres(response))
        .catch((error) => console.error(error))
    }, []);

    return (
        <div className="mt-16 ml-[25%] justify-center">
            <ul>
                {alquileres.length > 0 ? alquileres.map(alquiler => (
                <FieldCard field={alquiler.id} value={`Alquiler de ${user.email}`}/>
                )) : <p>no ay nada xD</p>}
            </ul>
        </div>
    );
}

export default UserAlquileres;
