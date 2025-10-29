// Corrigido: ejemplo funcional y seguro (ajusta valores secretos y política según tu entorno)
const express = require('express');
const app = express();
const functions = require('firebase-functions'); // <-- asegurarse de usar firebase-functions real
const { secureCors } = require('./config'); // secureCors puede venir de tu config
const jwt = require('jsonwebtoken'); // npm install jsonwebtoken
// const sanitize = require('sanitize-html'); // NO usar sanitize-html para código puro
// body-parser innecesario: usar express.json
const rateLimit = require('express-rate-limit'); // npm install express-rate-limit
const helmet = require('helmet');

const JSON_BODY_LIMIT = '50kb'; // ajusta según tus necesidades

app.use(helmet());
app.use(express.json({ limit: JSON_BODY_LIMIT }));
app.use(secureCors);

// Rate limiting básico para mitigar DoS
app.use(rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 60, // max 60 peticiones por IP por minuto (ajustar)
  standardHeaders: true,
  legacyHeaders: false
}));

function hash(data) {
  return `hash_${String(data).substring(0, 10)}`;
}

// Middleware de validación JWT (ejemplo - sustituye SECRET/keys por lo tuyo)
const validateAuth = (req, res, next) => {
  // No dejar un bypass en producción
  const authHeader = req.get('Authorization') || '';
  if (!authHeader.startsWith('Bearer ')) {
    functions.logger.warn('No Authorization header or wrong format');
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const token = authHeader.slice(7);
  try {
    // En producción, verifica con la clave pública/issuer adecuado
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
    req.user = payload;
    next();
  } catch (err) {
    functions.logger.warn('JWT verification failed', err);
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Helper: tratar el snippet como texto plano y normalizar newlines
function normalizeSnippet(snippet) {
  if (typeof snippet !== 'string') return '';
  // reemplazar CRLF por LF, recortar espacios excesivos
  return snippet.replace(/\r\n/g, '\n').trim();
}

// Pattern de "caracteres peligrosos" más selectivo (ejemplo):
// detectar patrones típicos de inyección de shell como '&&', '||', '; rm -rf', backticks, redirecciones, etc.
const shellDangerPattern = /(\&\&)|(\|\|)|(; *rm\s+-rf)|[`<>]|(^\s*curl\s+)/i;

app.post('/hybrid-scan', validateAuth, (req, res) => {
  if (!req.body || typeof req.body.code_snippet === 'undefined') {
    functions.logger.error('Fallo de Input: Cuerpo JSON o code_snippet ausente.');
    return res.status(400).send('Bad Request: Missing code snippet.');
  }

  const rawCodeSnippet = req.body.code_snippet;
  const snippet = normalizeSnippet(rawCodeSnippet);

  // limitación a nivel de negocio
  if (snippet.length === 0) {
    return res.status(400).send('Bad Request: Empty code snippet.');
  }
  if (snippet.length > 5000) {
    functions.logger.warn('Alerta: Snippet demasiado largo.');
    return res.status(400).send('Bad Request: Code snippet length validation failed.');
  }

  // Validación orientada a evitar inyección cuando se vaya a ejecutar en shell
  if (shellDangerPattern.test(snippet)) {
    functions.logger.warn('Alerta: Posible patrón de inyección detectado.');
    return res.status(400).send('Bad Request: Potential Command Injection detected.');
  }

  // NOTA: si vas a ejecutar análisis con un proceso externo, usa spawn() sin shell y args separados,
  // o mejor aún, un sandbox o servicio dedicado (no construir comandos concatenando strings).

  // Respuesta simulada de éxito
  return res.status(200).json({
    message: 'Analysis accepted by Specter Gateway.',
    code_hash: hash(snippet),
    severity: '8.1',
    vulnerability: 'IDOR_HIGH'
  });
});

// Export para Firebase Functions
exports.api = functions.https.onRequest(app);
