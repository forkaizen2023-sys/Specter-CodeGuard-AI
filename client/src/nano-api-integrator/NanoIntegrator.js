/**
 * Módulo Specter para la Orquestación de IA Integrada (Gemini Nano).
 * Usa las 6 APIs del desafío para análisis de bajo riesgo, privado e instantáneo.
 */
export const NanoIntegrator = {

    /**
     * 1. API de Corrección de Pruebas (Proofreader API) 📝
     * Usada para corregir errores gramaticales y tipográficos en comentarios/cadenas de código.
     */
    proofreadComments: async (text) => {
        // Asume que la API está disponible en navigator.proofreader
        if (!navigator.proofreader) return { status: 'ERROR', text: text };
        
        try {
            const result = await navigator.proofreader.proofread({ text });
            return { status: 'OK', text: result.text };
        } catch (e) {
            console.error("Nano Proofreader Falló:", e);
            return { status: 'FAIL', text: text };
        }
    },

    /**
     * 2. API de Traductor (Translator API) 🌐
     * Usada para traducir mensajes de error de la API externa o comentarios a un idioma preferido.
     */
    translateError: async (text, targetLang = 'en') => {
        if (!navigator.translator) return text;
        try {
            const translated = await navigator.translator.translate({ text, targetLanguage: targetLang });
            return translated.text;
        } catch (e) {
            console.warn("Nano Translator Falló, devolviendo original.");
            return text;
        }
    },

    /**
     * 3. API de Reescribir (Rewriter API) 🖊️
     * Usada para refactorizar código ineficiente o mejorar la claridad de funciones.
     */
    refactorCode: async (code, instruction) => {
        if (!navigator.rewriter) return code;
        try {
            // Ejemplo de instrucción Specter: "Refactoriza este código JS para usar async/await y evitar callbacks."
            const response = await navigator.rewriter.rewrite({ text: code, prompt: instruction });
            return response.text;
        } catch (e) {
            console.error("Nano Rewriter Falló:", e);
            return code;
        }
    },
    
    /**
     * 4. API de Escritor (Writer API) ✏️
     * Usada para generar documentación rápida (docstrings o JSDoc) para funciones.
     */
    generateDocstring: async (code) => {
        if (!navigator.writer) return '/* [Docstring no disponible] */\n' + code;
        try {
            // Prompt para generar la documentación
            const prompt = "Genera un docstring JSDoc completo para la siguiente función JavaScript.";
            const response = await navigator.writer.write({ prompt, context: code });
            return response.text + '\n' + code;
        } catch (e) {
            console.warn("Nano Writer Falló.");
            return code;
        }
    },
    
    /**
     * 5. API de Resumen (Summarizer API) 📄
     * Usada para resumir el propósito de bloques de código grandes o dependencias.
     */
    summarizeFunction: async (code) => {
        if (!navigator.summarizer) return "Propósito no resumible.";
        try {
            const summary = await navigator.summarizer.summarize({ text: code });
            return summary.text;
        } catch (e) {
            console.error("Nano Summarizer Falló.");
            return "No se pudo resumir el propósito.";
        }
    },

    /**
     * 6. API de Indicaciones (Prompt API) 💭 (CRÍTICA)
     * Usada para el Análisis de Seguridad de Bajo Riesgo con output estructurado.
     */
    analyzeLowRiskSecurity: async (code) => {
        if (!navigator.prompt) return { severity: 'NONE', message: 'Nano API no disponible para análisis.' };

        // Prompt de Ingeniería Specter: Búsqueda de patrones de seguridad sencillos (ej. XSS DOM)
        const securityPrompt = "Busca patrones inseguros (como el uso directo de location.hash o document.write sin sanitizar). Devuelve un JSON estructurado con 'vulnerability' y 'severity' (Low/None).";

        try {
            // Usamos la Prompt API para forzar un resultado JSON estructurado, ideal para la IA local.
            const response = await navigator.prompt.prompt({ 
                text: code, 
                prompt: securityPrompt,
                outputFormat: 'JSON' 
            });
            // CRÍTICO: Aseguramos que la respuesta del Nano sea parseada correctamente
            return JSON.parse(response.text); 
        } catch (e) {
            console.error("Nano Prompt Falló o JSON es inválido:", e);
            return { severity: 'ERROR', message: 'Fallo al procesar el análisis de seguridad local.' };
        }
    }
};