const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT3 || 3000; // Valor por defecto para el puerto
const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN = process.env.TOKEN;

app.use(bodyParser.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Verificar el token JWT
const verifyToken = (req, res, next) => {
  const token = TOKEN;

  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Token inválido' });
    }
    req.user = decoded;
    next();
  });
};

// Generar Token
const generateToken = (user) => {
  return jwt.sign(user, JWT_SECRET);
};

// Endpoint para insertar temperatura
app.post('/tempinsert', verifyToken, async (req, res) => {
  const temp = req.body.temperatura;
  //const createdAt = Math.floor(new Date().getTime() / 1000.0);

  const createdAt = Math.floor(new Date().getTime() / 1000); // Obtiene la fecha actual en segundos

  console.log(createdAt);
  // Genera la fecha actual como objeto Date
  console.log(temp, createdAt);

  try {
    const client = await pool.connect();
    await client.query('INSERT INTO temperaturas (timetemp, temperatura) VALUES ($1, $2)', [createdAt, temp]);
    client.release();
    res.status(200).json({ message: 'Temperatura almacenada con éxito' });
  } catch (err) {
    console.error('Error al almacenar la temperatura', err);
    res.status(500).json({ error: 'Error de servidor' });
  }
});


// Endpoint para obtener temperaturas
app.get('/tempget', verifyToken, async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM temperaturas ORDER BY timetemp DESC');
    client.release();
    res.json(result.rows);
  } catch (err) {
    console.error('Error al obtener las temperaturas', err);
    res.status(500).json({ error: 'Error al obtener los registros' });
  }
});

// Endpoint de login
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Lógica de user y pass
  if (username === 'raul' && password === '1234') {
    const token = generateToken({ username });
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Credenciales incorrectas' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
