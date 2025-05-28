import FieldCard from "./FieldCard.jsx"

function UserData() {
    return (
        <div className="mt-16 ml-[25%] justify-center">
            <ul>
                <li><FieldCard field="Nombre" value="name"/></li>
                <li><FieldCard field="Apellido" value="Lname"/></li>
                <li><FieldCard field="Fecha de nacimiento" value="DoB"/></li>
                <li><FieldCard field="E-mail" value="email"/></li>
                <li><FieldCard field="Contacto" value="contact"/></li>
            </ul>
        </div>
    )
}

export default UserData;
