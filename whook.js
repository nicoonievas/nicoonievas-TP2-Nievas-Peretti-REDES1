const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const axios = require('axios');
const app = express();
const PORT2 = process.env.PORT2;


app.use(bodyParser.json());

app.post('/verifytemp', async (req, res) => {
  //const tempchecked = req.body;
  console.log(req.body);
  try {
    await axios.post('http://localhost:5003/tempinsert', req.body);
    // res.status(200).json({ message: "Temperatura enviada con éxito" });
    
  } catch (err) {
    console.error('Error en el envío de la temperatura', err);
    res.status(500).json({ error: 'Error de servidor' });
  }
});


app.listen(PORT2, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT2}`);
});
