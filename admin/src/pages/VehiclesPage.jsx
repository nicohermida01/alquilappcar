import { DashboardLayout } from "../components/DashboardLayout";
import ListVehicles from "../components/ListVehicles";

function VehiclesPage() {
    return (
        <DashboardLayout>
            <section className="w-full py-[135px] flex flex-col items-center justify-center bg-gray-100 gap-10">
                <h2 className="text-3xl font-bold text-center">
                    Lista de vehículos
                </h2>
                <ListVehicles />
            </section>
        </DashboardLayout>
    );
}

export default VehiclesPage;
