import { useAuth } from "../contexts/AuthContext";

export function DashboardPage() {
    const { user, loadingAuth } = useAuth();

    return (
        <section className="w-full flex items-center justify-center bg-gray-100">
            <h1 className="text-3xl font-bold">
                Bienvenido, {user?.email.split("@")[0]}
            </h1>
        </section>
    );
}
