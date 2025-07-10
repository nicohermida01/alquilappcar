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
              {user.isAdmin && (
                <>
                  <RegisterUsers />
                  <RegisterVehicles />
                  <EarningsReport />
                </>
              )} 
            </div>
        </section>
    );
}
