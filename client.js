const WebSocket = require('ws');
const axios = require('axios');

const ws = new WebSocket('ws://localhost:3000');

ws.on('open', () => {
    console.log('Conectado al servidor');
    random5Segundos();
});

function random5Segundos() {
    setInterval(() => {
        const random = parseFloat((Math.random() * 43.0).toFixed(1));
        console.log(random); 
        sendMessage(random);  // Enviar el número aleatorio al servidor
    }, 5000); 
}

ws.on('close', () => {
    console.log('Desconectado del servidor');
});

ws.on('error', (error) => {
    console.error('WebSocket error:', error);
});

function sendMessage(message) {
    if (ws.readyState === WebSocket.OPEN) {
        ws.send(message.toString());  // Convertir el mensaje a cadena antes de enviarlo
    } else {
        console.log('El WebSocket no está abierto. No se puede enviar el mensaje.');
    }
}
