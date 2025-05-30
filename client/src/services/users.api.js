import { api } from "./main.js"

const getUserById = async (userId) => {
    const response = await api.get(`clientes/${userId}`);

    return response.data;
}

const getAlquileresByUserId = async (userId) => {
    const response = await api.get(`alquileres/cliente/${userId}`);

    return response.data;
}

export const usersApi = {
    getUserById,
    getAlquileresByUserId
};
