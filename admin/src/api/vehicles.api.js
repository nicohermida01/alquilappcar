import { get } from "react-hook-form";
import { api } from "./main";

const getAllVehicles = async () => {
    const response = await api.get("vehiculos/");
    return response.data;
};

const createVehicle = async (vehicleData) => {
    const response = await api.post("vehiculos/", vehicleData);
    return response.data;
};

const updateVehicle = async (vehicleData, id) => {
    const response = await api.put(`vehiculos/${id}/`, vehicleData);
    return response.data;
};

const deleteVehicle = async (id) => {
    const response = await api.delete(`vehiculos/${id}/`);
    return response.data;
};

const getAllBrands = async () => {
    const response = await api.get("marcas/");
    return response.data;
};

const updateBrand = async (brandData, id) => {
    const response = await api.put(`marcas/${id}/`, brandData);
    return response.data;
};

const createBrand = async (brandData) => {
    const response = await api.post("marcas/", brandData);
    return response.data;
};

const deleteBrand = async (id) => {
    const response = await api.delete(`marcas/${id}/`);
    return response.data;
};

const getBrandById = async (id) => {
    const response = await api.get(`marcas/${id}/`);
    return response.data;
};

const getAllLocalidades = async () => {
    const response = await api.get("localidades/");
    return response.data;
};

const createLocalidad = async (localidadData) => {
    const response = await api.post("localidades/", localidadData);
    return response.data;
};

const updateLocalidad = async (localidadData, id) => {
    const response = await api.put(`localidades/${id}/`, localidadData);
    return response.data;
};

const deleteLocalidad = async (id) => {
    const response = await api.delete(`localidades/${id}/`);
    return response.data;
};

const getAllSucursales = async () => {
    const response = await api.get("sucursales/");
    return response.data;
};

const getSucursalById = async (id) => {
    const response = await api.get(`sucursales/${id}/`);
    return response.data;
};

const createSucursal = async (sucursalData) => {
    const response = await api.post("sucursales/", sucursalData);
    return response.data;
};

const updateSucursal = async (sucursalData, id) => {
    const response = await api.put(`sucursales/${id}/`, sucursalData);
    return response.data;
};

const deleteSucursal = async (id) => {
    const response = await api.delete(`sucursales/${id}/`);
    return response.data;
};

const getAllCategorias = async () => {
    const response = await api.get("categorias/");
    return response.data;
};

const updateCategoria = async (categoryData, id) => {
    const response = await api.put(`categorias/${id}/`, categoryData);
    return response.data;
};

const createCategoria = async (categoryData) => {
    const response = await api.post("categorias/", categoryData);
    return response.data;
};

const deleteCategoria = async (id) => {
    const response = await api.delete(`categorias/${id}/`);
    return response.data;
};

const getCategoriaById = async (id) => {
    const response = await api.get(`categorias/${id}/`);
    return response.data;
};

const getAllCancelaciones = async () => {
    const response = await api.get("cancelaciones/");
    return response.data;
};

const createCancelacion = async (cancelacionData) => {
    const response = await api.post("cancelaciones/", cancelacionData);
    return response.data;
};

const updateCancelacion = async (cancelacionData, id) => {
    const response = await api.put(`cancelaciones/${id}/`, cancelacionData);
    return response.data;
};

const deleteCancelacion = async (id) => {
    const response = await api.delete(`cancelaciones/${id}/`);
    return response.data;
};

const getCancelacionById = async (id) => {
    const response = await api.get(`cancelaciones/${id}/`);
    return response.data;
};

const getAllPackages = async () => {
    const response = await api.get("paquetes/");
    return response.data;
};

const createPackage = async (packageData) => {
    const response = await api.post("paquetes/", packageData);
    return response.data;
};

const updatePackage = async (packageData, id) => {
    const response = await api.put(`paquetes/${id}/`, packageData);
    return response.data;
};

export const vehiclesApi = {
    getAllVehicles,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    getAllBrands,
    updateBrand,
    createBrand,
    deleteBrand,
    getBrandById,
    getAllLocalidades,
    createLocalidad,
    updateLocalidad,
    deleteLocalidad,
    getAllSucursales,
    getSucursalById,
    createSucursal,
    updateSucursal,
    deleteSucursal,
    getAllCategorias,
    updateCategoria,
    createCategoria,
    deleteCategoria,
    getCategoriaById,
    getAllCancelaciones,
    createCancelacion,
    updateCancelacion,
    deleteCancelacion,
    getCancelacionById,
    getAllPackages,
    createPackage,
    updatePackage,
};
