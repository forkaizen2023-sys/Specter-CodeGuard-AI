import React, { useState } from 'react';
import { NanoIntegrator } from '../nano-api-integrator/NanoIntegrator';
import { runHybridSpecterScan } from '../hybrid-connector/HybridConnector';

// Definimos los umbrales de riesgo para la UX
const RISK_THRESHOLDS = {
    NANO_HIGH: 'CRÍTICO (Revisión Híbrida Necesaria)', // Nano detectó algo que requiere Cloud
    NANO_LOW: 'BAJO (Corrección Local)',
    HYBRID_CRITIC: 'RIESGO CVSS CRÍTICO',
    HYBRID_OK: 'Auditoría Nube Completa'
};

function SpecterCodeGuardApp() {
    const [code, setCode] = useState('');
    const [status, setStatus] = useState('Listo para análisis...');
    const [nanoResults, setNanoResults] = useState(null);
    const [hybridResults, setHybridResults] = useState(null);

    // 1. ANÁLISIS INSTANTÁNEO (GEMINI NANO)
    const handleLocalScan = async (currentCode) => {
        setStatus('🔍 Analizando localmente con Gemini Nano...');
        setHybridResults(null); // Limpiamos resultados de la nube

        // a) Ejecutar las 6 APIs de Nano en paralelo para velocidad (UX)
        const [proofread, lowSecurity, refactored] = await Promise.all([
            NanoIntegrator.proofreadComments(currentCode),
            NanoIntegrator.analyzeLowRiskSecurity(currentCode),
            NanoIntegrator.refactorCode(currentCode, "Optimiza este código para mejor rendimiento.")
        ]);

        // b) Evaluación Specter de Bajo Riesgo
        let riskStatus = lowSecurity.severity === 'Low' ? RISK_THRESHOLDS.NANO_HIGH : RISK_THRESHOLDS.NANO_LOW;
        
        // Criterio de Elevación (CRÍTICO para la Arquitectura Híbrida)
        if (riskStatus === RISK_THRESHOLDS.NANO_HIGH) {
            setStatus('🚨 NANO ALERTA: Patrón de alto riesgo detectado. ¡Se requiere auditoría híbrida!');
            await handleHybridScan(currentCode); // Llama inmediatamente a la nube
        } else {
            setStatus('✅ Análisis Nano completado (Privado e Instantáneo).');
        }

        setNanoResults({ proofread, lowSecurity, refactored });
    };

    // 2. ANÁLISIS AVANZADO (HÍBRIDO: CLOUD RUN/GEMINI API)
    const handleHybridScan = async (codeToScan) => {
        setStatus('☁️ Enviando código al Motor Specter (Cloud Run) para análisis CVSS avanzado...');
        setHybridResults(null);

        try {
            const result = await runHybridSpecterScan(codeToScan);
            
            // Simulación de procesamiento de resultado CVSS del backend
            const cvssScore = parseFloat(result.severity); 
            
            if (cvssScore >= 7.0) {
                 // Riesgo Alto: Rojo (RCE, Inyección)
                setStatus(`🛑 RIESGO CRÍTICO (CVSS: ${result.severity}) - ¡Acción Inmediata Requerida!`);
            } else {
                 // Riesgo Bajo/Medio: Verde/Amarillo
                setStatus(`⚠️ Auditoría Híbrida Completa (CVSS: ${result.severity})`);
            }
            
            setHybridResults(result);

        } catch (error) {
            // CRÍTICO: Muestra los mensajes de error de seguridad (400, 403) del conector
            setStatus(`❌ Fallo de Conexión/Seguridad: ${error.message}`);
        }
    };

    return (
        <div className="specter-app">
            <h3>Specter CodeGuard AI</h3>
            <p className={`status-bar ${status.startsWith('✅') ? 'green' : status.startsWith('🚨') ? 'red' : 'yellow'}`}>
                {status}
            </p>
            
            <textarea
                value={code}
                onChange={(e) => {
                    setCode(e.target.value);
                    handleLocalScan(e.target.value); // Inicia escaneo Nano al escribir
                }}
                placeholder="Pega tu código JS/HTML para análisis instantáneo..."
            />

            {/* Visualización de Resultados Nano (Instantáneos) */}
            {nanoResults && (
                <div className="nano-output">
                    <h4>Resultados Nano (Instantáneos)</h4>
                    <p>Corrección Gramatical: {nanoResults.proofread.status === 'OK' ? '✅' : '⚠️'}</p>
                    <p>Refactorización Sugerida: **{nanoResults.refactored !== code ? 'Disponible' : 'No necesaria'}**</p>
                    <p>Seguridad Local: **{nanoResults.lowSecurity.severity}**</p>
                </div>
            )}

            {/* Visualización de Resultados Híbridos (Avanzados) */}
            {hybridResults && (
                <div className="hybrid-output">
                    <h4>Auditoría Híbrida Specter (CVSS)</h4>
                    <p>Vulnerabilidad: **{hybridResults.vulnerability || 'N/A'}**</p>
                    <p>Puntuación CVSS: **{hybridResults.severity || 'N/A'}**</p>
                    <p>Remediación: {hybridResults.remediation || 'Consulte la consola.'}</p>
                </div>
            )}
            
            {/* Botón de Ejecución Manual de Híbrido (para código que no dispara el Nano) */}
            <button onClick={() => handleHybridScan(code)} disabled={!code}>
                Ejecutar Auditoría CVSS Manual
            </button>
        </div>
    );
}

export default SpecterCodeGuardApp;