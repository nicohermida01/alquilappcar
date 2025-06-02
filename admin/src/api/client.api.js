import { api } from "./main";

const getAllClients = () => {
    return api.get("/clientes");
};

const createClient = (clientData) => {
    const response = api.post("/clientes/", clientData);
    return response;
};

const updateClient = (clientId, clientData) => {
    const response = api.put(`/clientes/${clientId}/`, clientData);
    return response;
};

export const clientApi = {
    getAllClients,
    createClient,
    updateClient,
};
