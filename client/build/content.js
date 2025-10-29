/**
 * SCRIPT DE CONTENIDO PRINCIPAL - client/build/content.js
 *
 * Este script se inyecta en cada página web (definido en manifest.json)
 * y es responsable de:
 * 1. Inicializar la aplicación React/JS (App.js)
 * 2. Inyectar la interfaz de Specter CodeGuard AI en el DOM.
 * 3. Escuchar eventos de entrada del usuario (donde se escribe código).
 */

// --- 1. Definición del Contenedor de la Aplicación ---
const SPECTER_CONTAINER_ID = 'specter-codeguard-ai-root';

/**
 * Crea e inyecta el contenedor raíz donde se montará la aplicación React/JS.
 * Esto asegura que nuestra aplicación esté aislada del resto de la página.
 */
function injectRootContainer() {
    // Evita inyectar el contenedor si ya existe
    if (document.getElementById(SPECTER_CONTAINER_ID)) {
        return;
    }

    const container = document.createElement('div');
    container.id = SPECTER_CONTAINER_ID;
    
    // Estilos básicos para asegurar que la extensión flote sobre el contenido
    container.style.position = 'fixed';
    container.style.top = '10px';
    container.style.right = '10px';
    container.style.zIndex = '999999'; // Alto z-index para estar siempre visible
    container.style.maxWidth = '350px';
    
    document.body.appendChild(container);

    console.log('[Specter AI] Contenedor de la aplicación inyectado con éxito.');
}

/**
 * Función principal para montar la aplicación (simula la función de ReactDOM.render).
 * En un entorno React compilado, esta función contendría el código de montaje.
 */
function mountApplication() {
    // NOTA: En la compilación final (build), el código de App.js y dependencias
    // se fusionarían aquí y se llamarían a las funciones de React/Vue.

    injectRootContainer();
    const rootElement = document.getElementById(SPECTER_CONTAINER_ID);

    if (rootElement) {
        // --- SIMULACIÓN DEL MONTAJE DE App.js ---
        // Aquí iría el código compilado de React para montar <App.js />
        
        // Dado que no podemos usar ReactDOM.render() aquí, simulamos el inicio de la lógica
        rootElement.innerHTML = `
            <div style="background: #282c34; color: white; padding: 10px; border-radius: 5px; font-family: sans-serif;">
                <p><strong>Specter CodeGuard AI:</strong> Listo.</p>
                <textarea id="specter-input-monitor" placeholder="Pega código aquí para iniciar el escaneo..." 
                    style="width: 100%; height: 80px;"></textarea>
                <button id="specter-manual-scan" style="margin-top: 5px;">Auditoría Híbrida Manual</button>
            </div>
        `;
        
        // --- INICIALIZACIÓN DE ESCUCHADORES (Simula la lógica de App.js) ---
        const textarea = document.getElementById('specter-input-monitor');
        if (textarea) {
            textarea.addEventListener('input', (event) => {
                // En un proyecto real, esto llamaría a la lógica NanoIntegrator.js
                // Ej: handleLocalScan(event.target.value);
                console.log('[Nano] Escaneando:', event.target.value.substring(0, 30) + '...');
            });
        }
        
    } else {
        console.error('[Specter AI] Fallo al encontrar el elemento raíz para montar la app.');
    }
}

// --- 2. Iniciar la Extensión ---
document.addEventListener('DOMContentLoaded', mountApplication);

// Si la página ya está cargada, montarla inmediatamente (necesario para algunos SPAs)
if (document.readyState === 'complete') {
    mountApplication();
}