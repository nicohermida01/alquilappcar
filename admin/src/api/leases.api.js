import { api } from "./main";

const createLease = async (data) => {
    const response = await api.post("/alquileres/", data);
    return response.data;
};

export const leasesApi = {
    createLease,
};
