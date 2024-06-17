// filtered-chart.js

const ctx = document.getElementById('filtered-temperature-chart').getContext('2d');
const dateFilterInput = document.getElementById('date-filter');

const initialConfig = {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Temperatura',
            data: [],
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: false,
            tension: 0.1
        }]
    },
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

const filteredTemperatureChart = new Chart(ctx, initialConfig);

async function fetchAndRenderData() {
    const selectedDate = dateFilterInput.value;
    
    // Realiza la solicitud GET al endpoint con la fecha como parámetro
    const endpoint = `http://localhost:5003/tempget_date?fecha=${selectedDate}`;
    
    try {
        const response = await fetch(endpoint);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Datos filtrados:', data);
        
        // Procesa los datos para actualizar el gráfico
        const labels = [];
        const temperatures = [];
        
        data.forEach(entry => {
            labels.push(new Date(entry.timetemp * 1000)); // Convierte el timestamp en milisegundos
            temperatures.push(entry.temperatura);
        });
        
        filteredTemperatureChart.data.labels = labels;
        filteredTemperatureChart.data.datasets[0].data = temperatures;
        filteredTemperatureChart.update();
        
    } catch (error) {
        console.error('Error al obtener los datos:', error);
    }
}
