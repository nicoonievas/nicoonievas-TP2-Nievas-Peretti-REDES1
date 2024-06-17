const temperatureList = document.getElementById('temperature-list');
const ctx = document.getElementById('temperature-chart').getContext('2d');
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

const data = [];
const labels = [];
const temperatureData = {
    labels: labels,
    datasets: [{
        label: 'Temperatura',
        data: data,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        fill: false,
        tension: 0.1
    }]
};

const config = {
    type: 'line',
    data: temperatureData,
    options: {
        responsive: true,
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'minute'
                },
                title: {
                    display: true,
                    text: 'Fecha y Hora'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Temperatura (°C)'
                },
                suggestedMin: 20,
                suggestedMax: 24
            }
        }
    }
};

const temperatureChart = new Chart(ctx, config);

function generateRandomTemperature() {
    setInterval(() => {
        const now = new Date();
        const fechaHora = now.toISOString();
        const random = parseFloat((Math.random() * (24 - 20) + 20).toFixed(1));

        ws.send(random.toString());
        console.log(`Enviando temperatura al servidor: ${random}`);

        data.push({ x: now, y: random });
        labels.push(fechaHora);

        // Actualiza el gráfico
        temperatureChart.update();

        // Crear elemento de lista y agregar la información
        const li = document.createElement('li');
        li.textContent = `Temperatura Enviada: ${random} - ${now.toLocaleString()}`;
        temperatureList.appendChild(li);
    }, 5000);
}

generateRandomTemperature();
