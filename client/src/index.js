import React from 'react';
// Usamos el API moderno de React 18+ para el montaje
import { createRoot } from 'react-dom/client'; 
// Importamos el componente principal de orquestación
import App from './App'; 

/**
 * Archivo de inicialización de la Extensión Specter CodeGuard AI.
 * Este script monta el componente principal (<App />) en el raíz del popup.html.
 */

// 1. Localizar el elemento CRÍTICO (#root)
const container = document.getElementById('root');

if (container) {
    // 2. Usar el API moderno de React (createRoot) para el montaje
    const root = createRoot(container); 
    
    // 3. Renderizar el componente principal
    root.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>
    );
} else {
    // 4. Reportar el fallo si el elemento #root no es encontrado (solo ocurre si popup.html está mal)
    console.error("CRÍTICO: El elemento '#root' no fue encontrado en popup.html. La Extensión no pudo montarse.");
}

// Nota: Asegúrate de que tu configuración de Webpack/Bundler apunte a este archivo (index.js) 
// para generar el bundle final (popup.bundle.js) que se carga en el popup.html.