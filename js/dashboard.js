// Actualizar fecha de sincronización
document.getElementById('fecha-sync').textContent = new Date().toLocaleString('es-ES');

// Configuración común para todos los gráficos
const chartColors = {
    primary: '#3498db',
    success: '#2ecc71',
    warning: '#f39c12',
    danger: '#e74c3c',
    info: '#9b59b6',
    secondary: '#95a5a6'
};

// Gráfico de Incidencias por Estado
const ctxEstados = document.getElementById('chartEstados').getContext('2d');
new Chart(ctxEstados, {
    type: 'doughnut',
    data: {
        labels: ['En Progreso', 'Pendientes', 'Completadas'],
        datasets: [{
            data: [8, 15, 120],
            backgroundColor: [
                chartColors.warning,
                chartColors.info,
                chartColors.success
            ],
            borderWidth: 2,
            borderColor: '#fff'
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    padding: 15,
                    font: { size: 12 }
                }
            }
        }
    }
});

// Gráfico de Incidencias Mensuales
const ctxMensuales = document.getElementById('chartMensuales').getContext('2d');
new Chart(ctxMensuales, {
    type: 'line',
    data: {
        labels: ['Sep', 'Oct', 'Nov', 'Dic', 'Ene'],
        datasets: [{
            label: 'Incidencias',
            data: [12, 19, 15, 25, 18],
            borderColor: chartColors.primary,
            backgroundColor: 'rgba(52, 152, 219, 0.1)',
            tension: 0.4,
            fill: true,
            borderWidth: 3
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: { display: false }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: { precision: 0 }
            }
        }
    }
});

// Gráfico de Mantenimientos por Tipo
const ctxMantenimientos = document.getElementById('chartMantenimientos').getContext('2d');
new Chart(ctxMantenimientos, {
    type: 'bar',
    data: {
        labels: ['Preventivo', 'Correctivo'],
        datasets: [{
            label: 'Mantenimientos',
            data: [35, 22],
            backgroundColor: [
                chartColors.success,
                chartColors.danger
            ],
            borderWidth: 0
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: { display: false }
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: { precision: 0 }
            }
        }
    }
});

// Gráfico de Equipos por Estado
const ctxEquipos = document.getElementById('chartEquipos').getContext('2d');
new Chart(ctxEquipos, {
    type: 'pie',
    data: {
        labels: ['Operativos', 'Mantenimiento', 'Fuera de Servicio'],
        datasets: [{
            data: [45, 12, 5],
            backgroundColor: [
                chartColors.success,
                chartColors.warning,
                chartColors.danger
            ],
            borderWidth: 2,
            borderColor: '#fff'
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    padding: 15,
                    font: { size: 12 }
                }
            }
        }
    }
});