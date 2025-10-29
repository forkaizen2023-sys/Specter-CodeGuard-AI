// ATENCIÓN SPECTER: Reemplazar con la URL real de tu endpoint desplegado
// La URL base debe incluir la ruta del endpoint de la API.
const HYBRID_SCAN_ENDPOINT = "https://your-final-cloud-run-endpoint-example.app/hybrid-scan"; 
//                                                                                   ^^^^^^^^^^^^^^
//                                                                                   SE HA AÑADIDO ESTA RUTA

// CRÍTICO: El token debe ser almacenado de forma segura, idealmente en Chrome Storage
// o generado dinámicamente. Para propósitos de PoC/Desafío, usamos un valor placeholder.
const getAuthToken = () => {
    // En una aplicación real, se usaría chrome.storage.local.get() o Firebase Auth.
    // Usamos el token placeholder definido en el backend para la demostración.
    return "SPECTER_SECURE_TOKEN_2025"; 
};

export { HYBRID_SCAN_ENDPOINT, getAuthToken };