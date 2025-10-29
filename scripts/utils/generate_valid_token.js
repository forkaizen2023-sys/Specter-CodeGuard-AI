// generate_valid_token.js
// Uso: node scripts/utils/generate_valid_token.js [sub] [expiry]
// Ejemplo: node scripts/utils/generate_valid_token.js specter-tester 1h

const jwt = require('jsonwebtoken');
const fs = require('fs');
// Usamos dotenv para leer el secreto de prueba
require('dotenv').config({ path: './.env' }); 

const secret = process.env.JWT_SECRET || 'dev-secret'; 
const args = process.argv.slice(2);
const sub = args[0] || 'specter-test-user';
const expiresIn = args[1] || '1h';

// Payload: Incluye claims simples para validación
const payload = {
  sub,
  role: 'tester',
  iss: 'specter-ai-client'
};

try {
  // Generar el token (HS256)
  const token = jwt.sign(payload, secret, { algorithm: 'HS256', expiresIn });
  
  const fullToken = `Bearer ${token}`;

  console.log('=== 🛡️ JWT de prueba generado para Specter Gateway ===\n');
  console.log(fullToken);
  console.log('\n======================================================');
  
  // Guardar en un archivo para fácil copia/uso en el validador
  fs.writeFileSync('jwt_valid_token.txt', fullToken);
  console.log('Token guardado en ./jwt_valid_token.txt');

} catch (err) {
  console.error('Error generando token:', err);
  process.exit(1);
}