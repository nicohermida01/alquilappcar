import { DashboardLayout } from "../components/DashboardLayout";
import { Link } from "react-router";

function VehiclesPage() {
    return (
        <DashboardLayout>
            <section className="w-full py-[135px] flex items-center justify-center bg-gray-100 gap-10">
                <Link className="text-xl" to={"/listar-vehiculos"}>
                    Lista de vehículos
                </Link>
                <Link className="text-xl" to={"/crear-vehiculo"}>
                    Crear vehículo
                </Link>
            </section>
        </DashboardLayout>
    );
}

export default VehiclesPage;
