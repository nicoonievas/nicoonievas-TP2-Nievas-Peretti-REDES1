document.addEventListener("DOMContentLoaded", () => {
    const ws = new WebSocket('ws://localhost:3000');
    const temperatureList = document.getElementById('temperature-list');

    ws.onopen = () => {
        console.log('Conectado al servidor');
        random5Segundos(); // Volvemos a llamar a la función para generar temperaturas automáticamente
    };

    ws.onclose = () => {
        console.log('Desconectado del servidor');
    };

    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
    };

    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        const listItem = document.createElement('li');
        listItem.textContent = `User ${data.userId}: ${data.message}°C`;
        temperatureList.appendChild(listItem); // Añadimos el nuevo elemento <li> a la lista <ul>
    };
    

    function random5Segundos() {
        setInterval(() => {
            const random = parseFloat((Math.random() * (24 - 20) + 20).toFixed(1));
            console.log(random);
            sendMessage(random);
        }, 5000);
    }

    function sendMessage(message) {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(message.toString());
        } else {
            console.log('El WebSocket no está abierto. No se puede enviar el mensaje.');
        }
    }
});
