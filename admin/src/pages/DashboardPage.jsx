import { Link, useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";

export function DashboardPage() {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
        }
    }, []);

    if (!isAuthenticated)
        return (
            <section className="min-h-screen w-full flex flex-col items-center justify-center bg-gray-100">
                <p className="text-center text-lg">
                    Parece que no tienes una sesión iniciada. <br />{" "}
                    <Link to="/login" className="underline text-secondary">
                        Primero inicia sesión
                    </Link>
                    !
                </p>
            </section>
        );

    return (
        <section className="w-full py-[135px] flex items-center justify-center bg-gray-100">
            <h1 className="text-3xl font-bold mb-10">Registro de Empleados</h1>
        </section>
    );
}
