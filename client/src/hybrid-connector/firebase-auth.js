/**
 * Módulo firebase-auth.js
 * * Este módulo simula la obtención del token de autenticación (JWT)
 * que se usaría para demostrar que el usuario de la Extensión es legítimo.
 * * En una aplicación real, esto usaría:
 * 1. El SDK de Firebase Auth para iniciar sesión.
 * 2. firebase.auth().currentUser.getIdToken() para generar un JWT dinámico.
 */

// NOTA SPECTER: Este token es el valor compartido que el backend de Cloud Run valida.
const SPECTER_DEMO_TOKEN = "SPECTER_SECURE_TOKEN_2025";

/**
 * Simula la obtención de un JWT válido para autenticar la solicitud al backend.
 * * @returns {Promise<string>} Un token JWT de Firebase simulado.
 */
export async function getFirebaseIdToken() {
    // En un entorno de producción, esta función realizaría la llamada asíncrona a Firebase.
    
    console.log("[Auth] Usando token de autenticación estático para fines de demostración...");

    // Se asume que el usuario ya está autenticado a través del flujo de la extensión.
    
    // Devolvemos el token de seguridad estático que el backend acepta.
    return SPECTER_DEMO_TOKEN;
}

// Nota: El archivo config.js debe ser modificado para usar esta función si se requiere.
// Alternativamente, el HybridConnector.js puede llamar directamente a esta función.