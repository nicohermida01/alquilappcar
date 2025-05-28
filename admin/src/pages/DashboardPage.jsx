import { Link, useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { useEffect } from "react";

export function DashboardPage() {
    const { isAuthenticated, loadingAuth } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (loadingAuth) return;

        if (!isAuthenticated) {
            navigate("/login");
        }
    }, [isAuthenticated, navigate, loadingAuth]);

    if (loadingAuth) {
        return (
            <section className="min-h-screen w-full flex items-center justify-center bg-gray-100">
                <p className="text-lg">Cargando...</p>
            </section>
        );
    }

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
