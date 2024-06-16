const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const axios = require('axios');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'temp.html'));
});

const clients = new Map();
let nextClientId = 1;

wss.on('connection', (ws) => {
    console.log('Cliente WebSocket conectado.');

    const clientId = nextClientId++; // Asignar un ID único al cliente
    clients.set(clientId, ws); // Agregar la conexión al mapa

    ws.on('message', async (message) => {
        var temperature = parseFloat(message);
        console.log(`Mensaje recibido de ${clientId}: ${temperature}`);

        try {
            const response = await axios.post('http://localhost:5002/verifytemp', { temperatura: temperature });
            console.log('Respuesta del servidor:', response.data);
        } catch (error) {
            console.error('Error interno del servidor:', error);
        }
        clients.forEach((client) => {
            if (WebSocket.OPEN) {
                console.log(`Enviando a Cliente ${temperature}`);
                client.send(`Cliente dice: ${temperature}`);
            }
        });
    });
    // Enviar el mensaje a todos los usuarios conectados

    ws.on('close', () => {
        console.log(`Cliente ${clientId} desconectado`);
        clients.delete(clientId);
    });
});

server.listen(3000, () => {
    console.log('Servidor escuchando en http://localhost:3000');
});
