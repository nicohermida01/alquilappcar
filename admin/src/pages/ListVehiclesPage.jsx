import { DashboardLayout } from "../components/DashboardLayout";
import ListVehicles from "../components/ListVehicles";

function ListVehiclesPage() {
    return (
        <DashboardLayout>
            <section className="w-full py-[135px] flex items-center justify-center bg-gray-100 gap-10">
                <ListVehicles />
            </section>
        </DashboardLayout>
    );
}

export default ListVehiclesPage;
