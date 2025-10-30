/**
 * Módulo Specter para la Orquestación de IA Integrada (Gemini Nano).
 * Implementa la Estrategia Híbrida Inteligente (Clasificación para Escalada).
 */
export const NanoIntegrator = {

    // ----------------------------------------------------------------------
    // 1. FUNCIÓN CRÍTICA: CLASIFICACIÓN DE RIESGO PRELIMINAR (PROMPT API)
    // ----------------------------------------------------------------------
    /**
     * Clasifica el riesgo del código utilizando la Prompt API para decidir si escalar al backend (Cloud Run).
     * @param {string} code - Snippet de código a clasificar.
     * @returns {Promise<{severity: string, message: string}>} 'LOW', 'POSSIBLE', o 'ERROR' riesgo.
     */
    classifyRiskPreliminarily: async (code) => {
        if (!navigator.prompt) return { severity: "ERROR", message: "Nano API no disponible para clasificación." };

        // Prompt de Clasificación Specter: Pedimos un output binario y estricto.
        const classificationPrompt = 
            "Classify the security risk of this code. Output ONLY the word 'LOW' if the code is clean (no DB, no network, no eval) or 'POSSIBLE' if it contains variables, DB access, or functions that need deep review.";

        try {
            const response = await navigator.prompt.prompt({ 
                text: code, 
                prompt: classificationPrompt 
            });
            
            // Normalizamos el resultado para un chequeo limpio en App.js
            const classification = response.text.trim().toUpperCase();
            
            return { 
                severity: classification, 
                message: `Clasificado: ${classification}`
            };

        } catch (e) {
            console.error("Nano Classification Falló:", e);
            return { severity: "ERROR", message: "Fallo de clasificación Nano." };
        }
    },

    // ----------------------------------------------------------------------
    // 2. FUNCIÓN DE CUMPLIMIENTO: Proofreader API 📝
    // ----------------------------------------------------------------------
    proofreadComments: async (text) => {
        if (!navigator.proofreader) return { status: 'ERROR', text: text };
        
        try {
            const result = await navigator.proofreader.proofread({ text });
            return { status: 'OK', text: result.text };
        } catch (e) {
            console.error("Nano Proofreader Falló:", e);
            return { status: 'FAIL', text: text };
        }
    },

    // ----------------------------------------------------------------------
    // 3. FUNCIÓN DE CUMPLIMIENTO: Translator API 🌐
    // ----------------------------------------------------------------------
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

    // ----------------------------------------------------------------------
    // 4. FUNCIÓN DE CUMPLIMIENTO: Rewriter API 🖊️
    // ----------------------------------------------------------------------
    refactorCode: async (code, instruction) => {
        if (!navigator.rewriter) return code;
        try {
            // Ejemplo de instrucción Specter: "Refactoriza este código JS para usar async/await."
            const response = await navigator.rewriter.rewrite({ text: code, prompt: instruction });
            return response.text;
        } catch (e) {
            console.error("Nano Rewriter Falló:", e);
            return code;
        }
    },
    
    // ----------------------------------------------------------------------
    // 5. FUNCIÓN DE CUMPLIMIENTO: Writer API ✏️
    // ----------------------------------------------------------------------
    generateDocstring: async (code) => {
        if (!navigator.writer) return '/* [Docstring no disponible] */\n' + code;
        try {
            const prompt = "Genera un docstring JSDoc completo para la siguiente función JavaScript.";
            const response = await navigator.writer.write({ prompt, context: code });
            return response.text + '\n' + code;
        } catch (e) {
            console.warn("Nano Writer Falló.");
            return code;
        }
    },
    
    // ----------------------------------------------------------------------
    // 6. FUNCIÓN DE CUMPLIMIENTO: Summarizer API 📄
    // ----------------------------------------------------------------------
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
    
    // NOTA: La función analyzeLowRiskSecurity original fue reemplazada por classifyRiskPreliminarily
    // para un flujo híbrido más eficiente.
};