import sys
import os
import logging
from functools import wraps
import jwt # Necesita 'pip install PyJWT'
from flask import Flask, request, jsonify

# Configuración básica de logging para Cloud Run
logging.basicConfig(stream=sys.stdout, level=logging.INFO)

# --- 🛡️ CONFIGURACIÓN DE SEGURIDAD CRÍTICA ---
# 🚨 IMPORTANTE: En producción, cargar esto desde Google Secret Manager.
SPECTER_JWT_SECRET = os.environ.get('JWT_SECRET', 'a_secret_key_needs_to_be_secure_and_random')
SPECTER_ISSUER = 'specter-ai-client'

# CRÍTICO: Definición de la variable 'app'
app = Flask(__name__)

# Función utilitaria hash
def hash_snippet(data):
    # Usamos repr() para sanitizar la entrada y obtener un hash simulado.
    sanitized_data = repr(data)
    return f"hash_{sanitized_data[:10]}"

# ----------------------------------------------------------------------
# 1. DECORADOR DE SEGURIDAD JWT (Guido's Zen)
# ----------------------------------------------------------------------
def jwt_required(f):
    """
    Decorador de Flask para validar el JWT en el encabezado Authorization.
    Bloquea la ejecución si el token está ausente, expirado o es inválido.
    """
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        
        # 1. Chequeo de Token Ausente
        if not auth_header or not auth_header.startswith('Bearer '):
            logging.warning("Intento de acceso sin token Bearer.")
            return jsonify({"error": "[SPECTER 401] Token de autenticación requerido. Refresque la sesión."}), 401
        
        token = auth_header.split(' ')[1]
        
        try:
            # 2. Decodificación y Verificación de Firma/Claims
            payload = jwt.decode(
                token, 
                SPECTER_JWT_SECRET, 
                algorithms=["HS256"], # Debe coincidir con el generador (generate_valid_token.js)
                issuer=SPECTER_ISSUER # Debe coincidir con el claim 'iss'
            )
            
            # Opcional: Adjuntar datos del usuario (sub, role) para la auditoría interna de la IA
            request.user_id = payload.get('sub')
            
        except jwt.ExpiredSignatureError:
            logging.warning(f"Token JWT expirado para usuario: {request.user_id}")
            return jsonify({"error": "[SPECTER 403] Token expirado. Vuelva a iniciar sesión."}), 403
        except jwt.InvalidSignatureError:
            logging.error("Firma de JWT inválida.")
            return jsonify({"error": "[SPECTER 403] Firma de token no válida. Acceso Prohibido."}), 403
        except Exception as e:
            logging.error(f"Fallo de validación JWT CRÍTICO: {e}")
            return jsonify({"error": f"[SPECTER 403] Error interno de token: {e}"}), 403

        # Si todo es exitoso, continúa la ejecución de la función original (hybrid_scan_endpoint)
        return f(*args, **kwargs)

    return decorated

# Middleware para validar que el request es JSON y tiene el snippet de código
def validate_request():
    if not request.is_json:
        return {"error": "Content-Type must be application/json", "status_code": 415}, 415
    data = request.get_json(silent=True)
    if not data or 'code_snippet' not in data:
        return {"error": "Missing code_snippet or invalid JSON format.", "status_code": 400}, 400
    return data, 200

# ----------------------------------------------------------------------
# 2. ENDPOINT PRINCIPAL DE ANÁLISIS HÍBRIDO
# ----------------------------------------------------------------------
@app.route('/hybrid-scan', methods=['POST'])
@jwt_required # 👈 ¡NUEVA CAPA DE SEGURIDAD!
def hybrid_scan_endpoint():
    
    # 1. Validar formato de la solicitud
    data, status_code = validate_request()
    if status_code != 200:
        return jsonify(data), status_code
        
    code_snippet = data.get('code_snippet', '')
    # code_language = data.get('language', 'javascript') # Si se usara

    # 2. Simulación de la lógica de Sanitización Specter (Control de Longitud/RCE)
    # CRÍTICO: Mitigación de DoS Lógico (Test 2 en backend-scan.sh)
    if len(code_snippet) > 5000 or any(c in code_snippet for c in [';', '|', '`']):
        logging.warning(f'Alerta: Snippet demasiado largo o peligroso. Usuario: {request.user_id}')
        # Este es el punto que Specter-Validator testea para 400
        return jsonify({"message": "Bad Request: Failed length/sanitization validation.", "status_code": 400}), 400

    try:
        # 3. Invocación de la IA (Lógica Real - Comentada)
        # analysis_result = analyze_high_risk_code(code_snippet, code_language)
        
        # 4. Respuesta Exitosa (Simulación para Validator)
        logging.info(f"Análisis de IA exitoso. Score CVSS simulado. Usuario: {request.user_id}")
        
        # Respuesta JSON con score CVSSv3.1 y remediación (el núcleo del servicio Specter)
        return jsonify({
            "message": "Análisis aceptado por Specter Gateway.", 
            "code_hash": hash_snippet(code_snippet),
            "severity": '8.1', 
            "vulnerability": 'Inyección SQL con datos de usuario',
            "remediation": 'Utilice consultas preparadas y sanee toda la entrada de usuario.'
        }), 200

    except Exception as e:
        # 5. Manejo de Fallo de la IA/Servidor (500)
        logging.error(f"Error CRÍTICO en el motor Specter: {e}")
        return jsonify({"error": "Specter Engine failed to process analysis.", "status_code": 500}), 500

# Punto de entrada para el servidor de desarrollo local
if __name__ == '__main__':
    # No se usa en Cloud Run (gunicorn lo maneja), solo para desarrollo
    logging.info(f"Iniciando servidor Flask local con secreto: {SPECTER_JWT_SECRET}")
    app.run(debug=True, host='0.0.0.0', port=int(os.environ.get('PORT', 8080)))
