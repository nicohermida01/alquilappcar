export function handleApiError(error) {
    const isApiError = error.response && error.response.data;
    const fallback =
        "Ocurrió un error inesperado. Por favor, inténtalo de nuevo más tarde.";
    var message = fallback;

    const messages = {
        dni: "El DNI ya está en uso.",
        fecha_de_nacimiento: "El cliente debe ser mayor de 18 años.",
        email: "El correo electrónico ya está en uso.",
        patente: "La patente ya está en uso.",
    };

    if (isApiError) {
        const { data } = error.response;
        const firstKey = Object.keys(data)[0];
        message = messages[firstKey] || fallback;
    }

    return message;
}
