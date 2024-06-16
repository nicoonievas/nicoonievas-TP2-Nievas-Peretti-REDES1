
const temperatureList = document.getElementById('temperature-list');
// Conexión WebSocket
const ws = new WebSocket('ws://localhost:3000');

ws.onopen = () => {
    console.log('Conectado al servidor');
};

ws.onmessage = (message) => {
    console.log(`Mensaje recibido del servidor: ${message.data}`);
    const li = document.createElement('li');
    li.textContent = `Temperatura Recibida del Servidor: ${message.data}`;
    temperatureList.appendChild(li);
};

ws.onerror = (error) => {
    console.error('Error WebSocket:', error);
};

ws.onclose = () => {
    console.log('Desconectado del servidor');
};

function generateRandomTemperature() {
    // Iniciar el intervalo para generar temperaturas aleatorias
    setInterval(() => {
        const random = parseFloat((Math.random() * (24 - 20) + 20).toFixed(1));
        ws.send(random.toString());
        console.log(`Enviando temperatura al servidor: ${random}`);
        const li = document.createElement('li');
        li.textContent = `Temperatura Enviada: ${random}`;
        temperatureList.appendChild(li);
    }, 5000);
}