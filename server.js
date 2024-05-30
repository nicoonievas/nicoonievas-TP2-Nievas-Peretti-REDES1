const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const axios = require('axios');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/temp.html');
  });
let userIdCounter = 0;
const users = {};



wss.on('connection', (ws) => {
    const userId = userIdCounter++;
    users[userId] = ws;

    ws.send(JSON.stringify({ message: 'Bienvenido', userId }));

    console.log(`Cliente conectado con ID: ${userId}`);

    ws.on('message', async (message) => {
        // Convertir el mensaje Buffer a string
        const temperature = Buffer.isBuffer(message) ? message.toString() : message;
        console.log(`Mensaje recibido de ${userId}: ${temperature}`);
        
        try {
            const response = await axios.post('http://localhost:5002/verifytemp', { temperatura: parseFloat(temperature) });
            
            if (response.status === 200) {
                console.log("La temperatura se envió con éxito", temperature);
            } else {
                console.error('Error al verificar la temperatura');
            }
        } catch (error) {
            console.error('Error interno del servidor:', error);
        }

        // Enviar el mensaje a todos los usuarios excepto al remitente
        Object.keys(users).forEach(id => {
            if (id != userId) {
                users[id].send(JSON.stringify({ userId, message: temperature }));
            }
        });
    });

    ws.on('close', () => {
        console.log(`Cliente ${userId} desconectado`);
        delete users[userId];
    });
});

server.listen(3000, () => {
    console.log('Server en el puerto http://localhost:3000');
});