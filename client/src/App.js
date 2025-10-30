import React, { useState } from 'react';
import CodeDisplay from './components/CodeDisplay'; // Asumimos que este componente existe
import { NanoIntegrator } from '../nano-api-integrator/NanoIntegrator';
import { runHybridSpecterScan } from '../hybrid-connector/HybridConnector'; 

function SpecterCodeGuardApp() {
    
    const [code, setCode] = useState('');
    const [status, setStatus] = useState('Listo para análisis...');
    const [nanoResults, setNanoResults] = useState(null); 
    const [hybridResults, setHybridResults] = useState(null);
    const [isScanning, setIsScanning] = useState(false);

    // ----------------------------------------------------------------------
    // 2. ANÁLISIS AVANZADO (HÍBRIDO: CLOUD RUN/GEMINI API)
    // ----------------------------------------------------------------------
    const handleHybridScan = async (codeToScan, source = 'MANUAL') => {
        setIsScanning(true);
        setStatus(`☁️ Verificando riesgo con gemini-2.5-pro (${source} trigger)...`);
        setHybridResults(null); 

        try {
            const result = await runHybridSpecterScan(codeToScan); // Llama al backend
            const cvssScore = parseFloat(result.severity); 
            
            if (cvssScore >= 7.0) {
                 setStatus(`🛑 RIESGO CRÍTICO (CVSS: ${result.severity}) - ¡Acción Inmediata Requerida!`);
            } else {
                 setStatus(`⚠️ Auditoría Híbrida Completa (CVSS: ${result.severity})`);
            }
            
            setHybridResults(result);

        } catch (error) {
            const errorMessage = error.message || 'Error de conexión o validación de seguridad.';
            setStatus(`❌ Fallo de Conexión/Seguridad: ${errorMessage}`);
        } finally {
            setIsScanning(false);
        }
    };


    // ----------------------------------------------------------------------
    // 1. LÓGICA DE ESCALADA INTELIGENTE (PUNTO DE ENTRADA HÍBRIDO)
    // ----------------------------------------------------------------------
    const handleLocalScan = async (currentCode) => {
        setCode(currentCode); 
        if (!currentCode.trim()) {
            setStatus('Listo para análisis...');
            setNanoResults(null);
            setHybridResults(null);
            return;
        }

        setStatus('🔍 Analizando localmente con Gemini Nano (Clasificación)...');
        setHybridResults(null); 
        
        // --- PASO 1: CLASIFICACIÓN INSTANTÁNEA ---
        const classificationResult = await NanoIntegrator.classifyRiskPreliminarily(currentCode);
        setNanoResults(classificationResult);
        
        const severity = classificationResult.severity;
        
        // --- PASO 2: LÓGICA DE ESCALADA CONDICIONAL ---
        if (severity === 'POSSIBLE' || severity === 'ERROR') {
            // Escalada: Si Nano detecta riesgo, activamos el proceso avanzado
            setStatus('🚨 NANO ALERTA: Posible riesgo detectado. Iniciando auditoría de alta fidelidad...');
            await handleHybridScan(currentCode, 'NANO_TRIGGER'); 
            
        } else {
            // Finalizado: Riesgo BAJO.
            setStatus('✅ Análisis Nano completado. Riesgo bajo. (Máxima privacidad).');
            setIsScanning(false);
        }
    };

    const handleCodeChange = (event) => {
        handleLocalScan(event.target.value); 
    };
    
    // Función para el botón manual
    const handleManualHybridScan = () => {
        handleHybridScan(code, 'MANUAL');
    };
    
    return (
        <div className="specter-app">
            <h3>Specter CodeGuard AI</h3>
            <p className={`status-bar ${status.startsWith('✅') ? 'green' : status.startsWith('🚨') ? 'red' : 'yellow'}`}>
                {status}
            </p>
            
            <textarea
                value={code}
                onChange={handleCodeChange}
                placeholder="Pega tu código JS/HTML para análisis instantáneo..."
                rows="8"
                disabled={isScanning} 
            />

            {/* Visualización del Riesgo Clasificado por Nano */}
            {nanoResults && (
                <div className="nano-output">
                    <h4>Clasificación Nano</h4>
                    <p>Riesgo Preliminar: **{nanoResults.severity || 'N/A'}**</p>
                </div>
            )}

            {/* Visualización de Resultados Híbridos (CVSS) */}
            {hybridResults && (
                <div className="hybrid-output">
                    <h4>Auditoría Híbrida Specter (CVSS)</h4>
                    <p>Vulnerabilidad: **{hybridResults.vulnerability || 'N/A'}**</p>
                    <p>Puntuación CVSS: **{hybridResults.severity || 'N/A'}**</p>
                    <p>Remediación: **{hybridResults.remediation || 'N/A'}**</p>
                </div>
            )}
            
            <button onClick={handleManualHybridScan} disabled={isScanning || !code}>
                Ejecutar Auditoría CVSS Manual
            </button>
        </div>
    );
}

export default SpecterCodeGuardApp;
