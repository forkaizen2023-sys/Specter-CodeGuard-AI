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
            padding: '5px 10px',
            borderRadius: '3px',
            backgroundColor: color === 'red' ? '#fee2e2' : color === 'orange' ? '#fff3cd' : color === 'yellow' ? '#fffdeb' : '#d1e7dd',
            color: color === 'red' ? '#991b1b' : color === 'orange' ? '#924000' : 'black',
            fontWeight: 'bold',
            marginBottom: '10px',
            borderLeft: `5px solid ${color}`
        })
    };

    // --- Lógica de Visualización de Resultados Híbridos (CVSS) ---

    const renderHybridAnalysis = () => {
        if (!hybridResults || !hybridResults.severity) {
            return null;
        }
        
        const color = getSeverityColor(hybridResults.severity);

        return (
            <div style={styles.panel}>
                <h4 style={{ color: color }}>🛡️ Auditoría Híbrida Specter (Cloud Run)</h4>
                
                <div style={styles.alert(color)}>
                    Riesgo Detectado: **{hybridResults.vulnerability}**
                </div>
                
                <p><strong>Puntuación CVSS:</strong> 
                    <span style={{ fontWeight: 'bold', color: color }}>{hybridResults.severity}</span>
                </p>
                
                <h5 style={styles.header}>Pasos de Remediación Priorizados:</h5>
                <pre style={{ whiteSpace: 'pre-wrap', backgroundColor: '#eee', padding: '8px' }}>
                    {hybridResults.remediation}
                </pre>
            </div>
        );
    };

    // --- Lógica de Visualización de Resultados Nano (Local) ---

    const renderNanoAnalysis = () => {
        if (!nanoResults) {
            return <p>No hay resultados de Nano disponibles. Ingrese código para el análisis instantáneo.</p>;
        }
        
        // Asumimos que nanoResults.proofread contiene el texto corregido
        const isProofread = nanoResults.proofread?.text !== code;
        const securityStatus = nanoResults.lowSecurity?.severity || 'NONE';

        return (
            <div style={styles.panel}>
                <h4>🧠 Análisis Local (Gemini Nano)</h4>
                <p>Corrección Gramatical/Docs: **{isProofread ? 'PENDIENTE (Cambios sugeridos)' : 'OK'}**</p>
                <p>Seguridad Rápida: <span style={{ color: getSeverityColor(securityStatus) }}>**{securityStatus}**</span></p>

                {/* Mostrar código refactorizado si existe */}
                {nanoResults.refactored && nanoResults.refactored !== code && (
                    <>
                        <h5 style={styles.header}>Refactorización Sugerida (Rewriter API):</h5>
                        <pre style={{ backgroundColor: '#fff', border: '1px dashed #ccc', padding: '10px' }}>
                            {nanoResults.refactored}
                        </pre>
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