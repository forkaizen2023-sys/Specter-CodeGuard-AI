# Archivo: server/src/specter-engine/cvss-calculator.py
# Simulación de un motor de cálculo CVSSv3.1 basado en vectores base.

CVSS_BASE_VECTORS = {
    # CVSS Vector: AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H
    "RCE_CRITICAL": {"score": 9.8, "remediation": "Validación estricta de entrada y uso de APIs seguras (no 'exec')."},
    # CVSS Vector: AV:N/AC:L/PR:L/UI:N/S:U/C:H/I:H/A:N
    "IDOR_HIGH": {"score": 8.1, "remediation": "Implementar chequeos de propiedad (RBAC) en cada acceso a recurso."},
    # CVSS Vector: AV:N/AC:L/PR:N/UI:R/S:C/C:L/I:L/A:N
    "XSS_MEDIUM": {"score": 6.1, "remediation": "Escapar toda salida al DOM o usar frameworks con protección automática (React/Vue)."},
    "LOW_RISK": {"score": 3.0, "remediation": "Revisión menor de buenas prácticas."},
}

def calculate_cvss(ia_result: dict):
    """
    Traduce el resultado de Gemini a un score CVSS y pasos de remediación.
    """
    vulnerability = ia_result.get("vulnerability_type", "LOW_RISK")
    
    vector = CVSS_BASE_VECTORS.get(vulnerability, CVSS_BASE_VECTORS["LOW_RISK"])
    
    # Aquí podríamos modificar la puntuación base según la complejidad del código (IA)
    # Por ahora, usamos el score base.
    
    return vector["score"], vector["remediation"]