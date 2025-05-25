import axios from "axios";

const BASE_URL = "http://localhost:8000/alquilapp/api/v1/";

export const getAllVehicles = () => {
    return axios.get(BASE_URL + "vehiculos/");
};

export const getAllBrands = () => {
    return axios.get(BASE_URL + "marcas/");
};

export const getAllSucursales = () => {
    return axios.get(BASE_URL + "localidades/");
};

export const getAllCategorias = () => {
    return axios.get(BASE_URL + "categorias/");
};

export const getAllCancelaciones = () => {
    return axios.get(BASE_URL + "cancelaciones/");
};

export const createVehicle = (data) => {
    return axios.post(BASE_URL + "vehiculos/", data);
};
