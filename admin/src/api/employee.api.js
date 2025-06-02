import { api } from "./main";

const register = async (employeeData) => {
    const response = await api.post("empleados/", employeeData);
    return response.data;
};

const update = async (id, employeeData) => {
    const response = await api.put(`empleados/${id}/`, employeeData);
    return response.data;
};

const getAllEmployees = async () => {
    const response = await api.get("empleados/");
    return response.data;
};

export const employeeApi = {
    register,
    update,
    getAllEmployees,
};
