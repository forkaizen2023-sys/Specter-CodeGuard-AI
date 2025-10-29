// Importa las funciones de Cloud Functions para Node.js
const functions = require('firebase-functions');

// Lista blanca de orígenes permitidos
const ALLOWED_ORIGINS = [
  'chrome-extension://abcd1234efgh5678ijkl9012mnop3456', // reemplaza con el ID real
  'https://nuestro-dominio-de-prueba.com'
];

// Middleware seguro de CORS y control de origen
const secureCors = (req, res, next) => {
  const logger = functions.logger || console; // fallback local

  const origin = req.headers.origin;
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.set('Access-Control-Allow-Origin', origin);
    res.set('Vary', 'Origin');
  } else if (req.method !== 'OPTIONS') {
    logger.warn(`Acceso Denegado: Origen no autorizado: ${origin}`);
    return res.status(403).send('Forbidden: Unauthorized Origin.');
  }

  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    // opcional si usas cookies/tokens con fetch
    // res.set('Access-Control-Allow-Credentials', 'true');
    return res.status(204).send('');
  }

  next();
};

module.exports = { functions, secureCors };
