import { HYBRID_SCAN_ENDPOINT, getAuthToken } from './config';

/**
 * Función Specter para enviar código a analizar por el backend híbrido.
 * Implementa la autenticación JWT y el manejo de errores de seguridad.
 * @param {string} codeSnippet - El snippet de código a analizar.
 * @returns {Promise<object>} El resultado del análisis (score CVSS y remediación).
 */
export async function runHybridSpecterScan(codeSnippet) {
    const token = getAuthToken();
    const headers = {
        'Content-Type': 'application/json',
        // CRÍTICO: Construcción del Header de Autenticación (Bearer Token)
        'Authorization': `Bearer ${token}` 
    };

    const requestBody = JSON.stringify({
        code_snippet: codeSnippet,
        language: 'javascript' // O el lenguaje detectado automáticamente
    });

    try {
        const response = await fetch(HYBRID_SCAN_ENDPOINT, {
            method: 'POST',
            headers: headers,
            body: requestBody
        });

        // Manejo de la Respuesta del Servidor

        if (response.ok) {
            // CÓDIGO 200: Análisis exitoso. Devolver el resultado de la IA/CVSS.
            return await response.json();
        }

        // Manejo de Errores de Seguridad y Sanitización (respuestas no-200)
        switch (response.status) {
            case 400:
                // ERROR 400: Falla de Sanitización o DoS Lógico (Límite de longitud).
                // El backend rechazó el input (ej. por ser demasiado largo o contener caracteres peligrosos).
                const error400 = await response.text();
                throw new Error(`[SPECTER 400] Fallo de Validación/Sanitización: ${error400}. Revise el código. \n(El backend nos protege de inyecciones!)`);
            
            case 401:
                // ERROR 401: Falla de Autenticación (Token ausente).
                throw new Error("[SPECTER 401] Acceso Denegado: Token de autenticación requerido. Refresque la sesión.");
            
            case 403:
                // ERROR 403: Falla de Autorización (Token inválido o Origen no autorizado).
                throw new Error("[SPECTER 403] Prohibido: El token de seguridad no es válido o el origen de la extensión no está permitido.");
            
            default:
                // Otros errores (5xx del servidor, etc.)
                throw new Error(`Error ${response.status} en el Motor Specter. Intente de nuevo.`);
        }

    } catch (error) {
        // Manejo de errores de red (UX resistente a la red: falla de conexión)
        console.error("Hybrid Scan Error:", error);
        throw new Error(`Fallo de Conexión (Red/CORS): Verifique la URL del endpoint y la red. Detalle: ${error.message}`);
    }
}