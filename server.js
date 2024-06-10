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

let userIdCounter = 0;
const users = {};

wss.on('connection', (ws) => {
    const userId = userIdCounter++;
    users[userId] = ws;

    ws.send(JSON.stringify({ message: 'Bienvenido', userId }));

    console.log(`Cliente conectado con ID: ${userId}`);

    ws.on('message', async (message) => {
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

        Object.keys(users).forEach(id => {
            users[id].send(JSON.stringify({ userId, message: temperature }));
        });
    });

    ws.on('close', () => {
        console.log(`Cliente ${userId} desconectado`);
        delete users[userId];
    });
});

server.listen(3000, () => {
    console.log('Servidor escuchando en http://localhost:3000');
});
