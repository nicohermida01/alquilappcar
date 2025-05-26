import { RegisterEmployeeForm } from "../components/RegisterEmployeeForm";

export function EmployeePage() {
    return (
        <section className="w-full py-[135px] flex flex-col items-center justify-center bg-gray-100 gap-10">
            <RegisterEmployeeForm />
        </section>
    );
}
