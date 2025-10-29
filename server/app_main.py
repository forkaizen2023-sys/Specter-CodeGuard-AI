import sys
import os
from flask import Flask, request, jsonify
import json # Necesario si se usa para parseo manual o logging

# Importamos la lógica del Motor Specter (asumiendo que está en la misma ruta Python)
# Nota: La sintaxis de importación es relativa para la ejecución del módulo Python.
try:
    from .specter_engine.gemini_advanced import analyze_high_risk_code
except ImportError:
    # Esto ocurre si el módulo se ejecuta fuera del entorno del contenedor.
    # En Cloud Run, el 'from .specter_engine' debería resolverse correctamente.
    print("WARNING: Could not import specter_engine. Running in local test mode.", file=sys.stderr)

# CRÍTICO: Definición de la variable 'app'
# Gunicorn buscará esta variable 'app' dentro de este módulo (app_main).
app = Flask(__name__)

# Función utilitaria hash (Placeholder)
def hash_snippet(data):
    # Esto debe ser implementado con 'hashlib' en un entorno real.
    return f"hash_{data[:10]}" 

# Middleware para validar que el request es JSON y tiene el snippet de código
def validate_request():
    if not request.is_json:
        # Fallo de tipo de contenido
        return {"error": "Content-Type must be application/json", "status_code": 415}, 415
    data = request.get_json(silent=True)
    if not data or 'code_snippet' not in data:
        # Fallo de formato JSON
        return {"error": "Missing code_snippet or invalid JSON body", "status_code": 400}, 400
    return data, None

# ----------------------------------------------------------------------
# ENDPOINT PRINCIPAL: /hybrid-scan
# ----------------------------------------------------------------------
@app.route('/hybrid-scan', methods=['POST'])
def hybrid_scan_endpoint():
    
    # 1. Validación de Entrada (Middleware de Sanitización de la Aplicación)
    data, error_response = validate_request()
    if error_response:
        return jsonify(error_response), error_response[1]

    code_snippet = data['code_snippet']
    code_language = data.get('language', 'javascript')
    
    # Simulación de la lógica de Sanitización Specter (Control de Longitud/RCE)
    if len(code_snippet) > 5000 or any(c in code_snippet for c in [';', '|', '`']):
        # Este es el punto que Specter-Validator testea para 400
        return jsonify({"message": "Bad Request: Failed length/sanitization validation.", "status_code": 400}), 400

    try:
        # 2. Invocación de la IA (Lógica Real)
        # Esto es donde la lógica de analyze_high_risk_code usaría la clave GEMINI_API_KEY
        analysis_result = analyze_high_risk_code(code_snippet, code_language)
        
        # 3. Respuesta Exitosa
        # Si todo es correcto, devolvemos 200 OK con el score CVSS
        return jsonify(analysis_result), 200

    except Exception as e:
        # 4. Manejo de Fallo de la IA/Servidor (500)
        print(f"Error CRÍTICO en el motor Specter: {e}", file=sys.stderr)
        # Este es el fallo que se manifestaba como 5xx en el log
        return jsonify({"error": "Specter Engine failed to process analysis.", "status_code": 500}), 500

# Esta parte no se ejecuta en Cloud Run (Gunicorn lo maneja), pero es buena práctica.
if __name__ == '__main__':
    # Usar el puerto de la variable de entorno para Cloud Run
    port = int(os.environ.get('PORT', 8080))
    app.run(debug=False, host='0.0.0.0', port=port)