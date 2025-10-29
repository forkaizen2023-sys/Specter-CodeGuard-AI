# Este código se ejecuta en el contenedor Linux seguro (Cloud Run)
import os
import json
from google import genai 
from .cvss_calculator import calculate_cvss # Importamos nuestra lógica CVSS

# Inicialización segura (la API Key se obtiene de forma segura del entorno)
client = genai.Client(api_key=os.environ.get("GEMINI_API_KEY"))

def analyze_high_risk_code(code_snippet: str, code_language: str):
    """
    Usa la Gemini API para el análisis profundo de patrones de seguridad.
    """
    # Prompt de Ingeniería Specter para Gemini: busca vulnerabilidades lógicas.
    specter_prompt = f"""
    Eres un analista de ciberseguridad experto. Analiza el siguiente código 
    escrito en {code_language}. Identifica vulnerabilidades críticas de 
    OWASP Top 10 (especialmente IDOR, Broken Access Control, o RCE potencial).
    Devuelve la vulnerabilidad, el impacto y la dificultad de explotación en formato JSON.
    CÓDIGO: {code_snippet}
    """
    
    response = client.models.generate_content(
        model='gemini-2.5-flash', # Un modelo rápido y potente para análisis
        contents=specter_prompt
    )
    
    # Suponemos que Gemini devuelve una estructura parseable
    try:
        ia_result = json.loads(response.text)
        # En base al resultado de la IA, calculamos el CVSS score
        cvss_score, remediation_steps = calculate_cvss(ia_result)
        
        return {
            "vulnerability": ia_result.get("vulnerability", "Unknown logic flaw"),
            "severity": f"{cvss_score:.1f}",
            "remediation": remediation_steps
        }
    except Exception as e:
        # Manejo de errores seguro
        return {"error": "Internal Specter Engine error", "details": str(e)}

# El endpoint de Firebase Functions llamaría a esta función.