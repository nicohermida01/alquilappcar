import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Card, CardBody, CardHeader } from "@heroui/react";
import RegisterUsers from "../components/DashboardHomeComponents/RegisterUsers";
import RegisterVehicles from "../components/DashboardHomeComponents/RegisterVehicles";
import EarningsReport from "../components/DashboardHomeComponents/EarningsReport";

export function DashboardPage() {
    const { user, loadingAuth } = useAuth();
    //console.log(user);
    return (
        <section className="w-full flex flex-col p-4 justify-center bg-gray-100">
            <h1 className="text-3xl font-bold">
                Bienvenido, {user?.email.split("@")[0]}
            </h1>
            <div className="flex flex-wrap justify-between gap-4">
                <RegisterUsers />
                <RegisterVehicles />
                {/* <Card className="w-[49%]">
/                     <CardHeader>
//                         <h2 className="text-xl font-bold">
//                             Información del Usuario
//                         </h2>
//                     </CardHeader>
//                     <CardBody>
//                         <p>Email: {user?.email}</p>
//                         {/* Si es admin la API no trae el campo nombre para ser mostrado, 
//                         calculo que esto estaba porque siendo empleado sí lo muestra. }
                         { !user?.isAdmin ? (<p>Nombre: {user?.nombre}</p>):(<p>Administrador</p>)}
                     </CardBody>
                 </Card> */}
                <EarningsReport />
            </div>
        </section>
    );
}
