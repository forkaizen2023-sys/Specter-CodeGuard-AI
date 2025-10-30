import React from 'react';

/**
 * Componente CodeDisplay: Presenta los resultados del análisis Nano y Híbrido
 * de forma estructurada para el desarrollador.
 *
 * Demuestra: Diseño UX para claridad técnica (criterio del desafío).
 */
const CodeDisplay = ({ code, nanoResults, hybridResults }) => {
    
    // Función de utilidad para determinar el color de la alerta
    const getSeverityColor = (severity) => {
        if (!severity) return 'gray';
        const sev = severity.toUpperCase();
        if (sev.includes('CRÍTICO') || sev.includes('8.0')) return 'red';
        if (sev.includes('ALTO') || sev.includes('6.0')) return 'orange';
        if (sev.includes('BAJO') || sev.includes('LOW')) return 'yellow';
        return 'green';
    };

    // Estilos internos (pueden ser movidos a CSS externo si se usa Tailwind)
    const styles = {
        panel: {
            border: '1px solid #ddd',
            borderRadius: '4px',
            marginTop: '15px',
            backgroundColor: '#f9f9f9',
            padding: '10px'
        },
        header: {
            fontWeight: 'bold',
            marginTop: '10px',
            borderBottom: '1px solid #eee',
            paddingBottom: '5px'
        },
        alert: (color) => ({
            padding: '4px 8px',
            borderRadius: '4px',
            backgroundColor: color,
            color: color === 'yellow' ? '#333' : 'white',
            fontWeight: 'bold',
            display: 'inline-block'
        }),
        pre: {
            backgroundColor: '#fff', 
            border: '1px dashed #ccc', 
            padding: '10px',
            whiteSpace: 'pre-wrap', // Asegura el ajuste de línea
            wordBreak: 'break-word',
            maxHeight: '200px', // Limitar la altura para prevenir overflow
            overflowY: 'auto'
        }
    };

    // Renderiza el resultado de la Auditoría Híbrida (Cloud Run)
    const renderHybridAnalysis = () => {
        if (!hybridResults) {
            return null; // Solo se muestra si el análisis híbrido se ejecutó
        }

        // Asumimos que hybridResults incluye 'severity', 'vulnerability', y 'remediation'
        const severity = hybridResults.severity || 'N/A';
        const severityColor = getSeverityColor(severity);

        return (
            <div style={styles.panel}>
                <h3>🛑 Auditoría Híbrida Specter (CVSS)</h3>
                <p>
                    Riesgo Detectado: <span style={styles.alert(severityColor)}>{severity}</span>
                </p>
                <h5 style={styles.header}>Vulnerabilidad Principal:</h5>
                <p>{hybridResults.vulnerability || 'No disponible.'}</p>
                <h5 style={styles.header}>Guía de Remediación (Guido's Zen):</h5>
                <pre style={styles.pre}>
                    {hybridResults.remediation || 'No disponible.'}
                </pre>
            </div>
        );
    };

    // Renderiza los resultados locales de Gemini Nano (6 APIs)
    const renderNanoAnalysis = () => {
        if (!code || !nanoResults) {
            return <p style={{ color: '#666', marginTop: '15px' }}>Ingrese código para el análisis instantáneo.</p>;
        }
        
        // Extracción de datos Nano
        const isProofread = nanoResults.proofread?.text !== code;
        const securityStatus = nanoResults.lowSecurity?.severity || 'NONE';

        // Variables de productividad (Las nuevas APIs)
        const docstring = nanoResults.docstring;
        const summary = nanoResults.summary;
        const translation = nanoResults.translation; // Asumimos que la traducción es un campo separado.
        const refactoredCode = nanoResults.refactored;

        return (
            <div style={styles.panel}>
                <h4>🧠 Análisis Local (Gemini Nano)</h4>
                <p>Clasificación de Escalada: <span style={styles.alert(getSeverityColor(securityStatus))}>{securityStatus}</span></p>
                <p>Corrección de Comentarios (Proofreader): **{isProofread ? 'PENDIENTE (Cambios sugeridos)' : 'OK'}**</p>

                {/* --- 1. Refactorización (Rewriter API) --- */}
                {refactoredCode && refactoredCode !== code && (
                    <>
                        <h5 style={styles.header}>🖊️ Refactorización Sugerida (Rewriter):</h5>
                        <pre style={styles.pre}>
                            {refactoredCode}
                        </pre>
                    </>
                )}

                {/* --- 2. Documentación (Writer API) --- */}
                {docstring && (
                    <>
                        <h5 style={styles.header}>✏️ Docstring/JSDoc Generado (Writer):</h5>
                        <pre style={styles.pre}>
                            {docstring}
                        </pre>
                    </>
                )}

                {/* --- 3. Resumen (Summarizer API) --- */}
                {summary && (
                    <>
                        <h5 style={styles.header}>📄 Propósito de la Función (Summarizer):</h5>
                        <p>{summary}</p>
                    </>
                )}
                
                {/* --- 4. Traducción (Translator API) --- */}
                {translation && (
                    <>
                        <h5 style={styles.header}>🌐 Traducción (Translator):</h5>
                        <p>{translation}</p>
                    </>
                )}
                
            </div>
        );
    };

    return (
        <div>
            {/* Mostrar el análisis híbrido si está disponible */}
            {renderHybridAnalysis()}
            
            {/* Mostrar el análisis Nano siempre */}
            {renderNanoAnalysis()}
        </div>
    );
};

export default CodeDisplay;
