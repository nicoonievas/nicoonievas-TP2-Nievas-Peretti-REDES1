const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
require('dotenv').config();
const axios = require('axios');


const app = express();
const PORT3 = process.env.PORT3;
app.use(bodyParser.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

app.post('/tempinsert', async (req, res) => {
  const temp = req.body.temperatura;
  const createdAt = new Date(); // Genera la fecha actual
  console.log(temp);

  try {
    const client = await pool.connect();
    await client.query('INSERT INTO temperaturas (timetemp, temperatura) VALUES ($1, $2)', [createdAt, temp]);
    client.release();
    res.status(200).json({ message: "temperatura almacenada con éxito" });
  } catch (err) {
    console.error('Error al almacenar la temperatura', err);
    res.status(500).json({ error: 'Error de servidor' });
  }
});



app.get('/tempget', async (req, res) => {
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



// Verificar el token JWT
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Token inválido' });
    }
    req.user = decoded;
    next();
  });
};




//Genera Token
const generateToken = (user) => {
  return jwt.sign(user, JWT_SECRET, { expiresIn: '1h' });
};

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  //Lógica de user y pass
  if (username === 'raul' && password === '1234') {
    const token = generateToken({ username });
    res.json({ token }); //Devuelve token con 1h. de validez
  } else {
    res.status(401).json({ error: 'Credenciales incorrectas' });
  }
});









app.listen(PORT3, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT3}`);
});
