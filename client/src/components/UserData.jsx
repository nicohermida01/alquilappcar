import CustomLi from "./CustomLi.jsx"

function UserData() {
    return (
        <div className="mt-16 ml-[40vh]">
            <ul>
                <CustomLi campo="Nombre" value="Valentrix"/>
                <CustomLi campo="Apellido"/>
                <CustomLi campo="Fecha de nacimiento"/>
                <CustomLi campo="E-mail"/>
                <CustomLi campo="Contacto"/>
            </ul>
        </div>
    )
}

export default UserData;
