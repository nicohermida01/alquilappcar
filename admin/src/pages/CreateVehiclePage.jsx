import { DashboardLayout } from "../components/DashboardLayout";
import { RegisterVehicleForm } from "../components/RegisterVehicleForm";

function CreateVehiclePage() {
    return (
        <DashboardLayout>
            <section className="w-full py-[135px] flex items-center justify-center bg-gray-100">
                <RegisterVehicleForm />
            </section>
        </DashboardLayout>
    );
}

export default CreateVehiclePage;
