        // Datos de mantenimientos
        const mantenimientos = [
            { fecha: new Date(2026, 0, 15), tipo: 'preventivo', equipo: 'Laser CO2', id: 101 },
            { fecha: new Date(2026, 0, 20), tipo: 'correctivo', equipo: 'Diodo Blue', id: 102 },
            { fecha: new Date(2026, 0, 22), tipo: 'preventivo', equipo: 'Dermalase', id: 103 },
            { fecha: new Date(2026, 0, 25), tipo: 'calibracion', equipo: 'Power Meter', id: '001' },
            { fecha: new Date(2026, 1, 5), tipo: 'preventivo', equipo: 'IPL Advanced', id: 104 },
            { fecha: new Date(2026, 1, 10), tipo: 'correctivo', equipo: 'Radiofrecuencia X', id: 105 }
        ];

        // Estado del calendario
        let mesActual = new Date();

        function renderCalendario() {
            const grid = document.getElementById('calendarioGrid');
            const mesActualSpan = document.getElementById('mesActual');
            
            const año = mesActual.getFullYear();
            const mes = mesActual.getMonth();
            
            // Actualizar título del mes
            mesActualSpan.textContent = mesActual.toLocaleDateString('es-ES', { 
                month: 'long', 
                year: 'numeric' 
            }).toUpperCase();

            // Limpiar grid
            grid.innerHTML = '';

            // Días de la semana
            const diasSemana = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
            diasSemana.forEach(dia => {
                const elem = document.createElement('div');
                elem.className = 'dia-semana';
                elem.textContent = dia;
                grid.appendChild(elem);
            });

            // Primer día del mes y total de días
            const primerDia = new Date(año, mes, 1);
            const ultimoDia = new Date(año, mes + 1, 0);
            const diasMes = ultimoDia.getDate();
            
            // Ajustar para que lunes sea el primer día (getDay() retorna 0 para domingo)
            let primerDiaSemana = primerDia.getDay();
            primerDiaSemana = primerDiaSemana === 0 ? 6 : primerDiaSemana - 1;

            // Días del mes anterior
            const ultimoDiaMesAnterior = new Date(año, mes, 0).getDate();
            for (let i = primerDiaSemana - 1; i >= 0; i--) {
                crearDia(ultimoDiaMesAnterior - i, true);
            }

            // Días del mes actual
            const hoy = new Date();
            for (let dia = 1; dia <= diasMes; dia++) {
                const fecha = new Date(año, mes, dia);
                const esHoy = fecha.toDateString() === hoy.toDateString();
                crearDia(dia, false, esHoy, fecha);
            }

            // Días del mes siguiente
            const diasMostrados = primerDiaSemana + diasMes;
            const diasRestantes = Math.ceil(diasMostrados / 7) * 7 - diasMostrados;
            for (let i = 1; i <= diasRestantes; i++) {
                crearDia(i, true);
            }
        }

        function crearDia(numero, otroMes = false, esHoy = false, fecha = null) {
            const grid = document.getElementById('calendarioGrid');
            const div = document.createElement('div');
            div.className = 'dia';
            
            if (otroMes) div.classList.add('otro-mes');
            if (esHoy) div.classList.add('hoy');

            let eventosHTML = '';
            if (fecha && !otroMes) {
                const eventosDelDia = mantenimientos.filter(m => 
                    m.fecha.toDateString() === fecha.toDateString()
                );
                
                eventosHTML = eventosDelDia.map(e => 
                    `<span class="evento-marker evento-${e.tipo}"></span>`
                ).join('');
            }

            div.innerHTML = `
                <div class="dia-numero">${numero}</div>
                <div class="dia-eventos">${eventosHTML}</div>
            `;

            if (fecha && !otroMes) {
                div.addEventListener('click', () => mostrarEventosDelDia(fecha));
            }

            grid.appendChild(div);
        }

        function mostrarEventosDelDia(fecha) {
            const eventos = mantenimientos.filter(m => 
                m.fecha.toDateString() === fecha.toDateString()
            );

            if (eventos.length === 0) {
                alert('No hay mantenimientos programados para este día');
                return;
            }

            const mensaje = eventos.map(e => 
                `• ${e.equipo} - ${e.tipo.toUpperCase()}`
            ).join('\n');

            alert(`Mantenimientos del ${fecha.toLocaleDateString('es-ES')}:\n\n${mensaje}`);
        }

        function renderProximosMantenimientos() {
            const container = document.getElementById('proximosMantenimientos');
            const hoy = new Date();
            const en7Dias = new Date(hoy);
            en7Dias.setDate(hoy.getDate() + 7);

            const proximos = mantenimientos
                .filter(m => m.fecha >= hoy && m.fecha <= en7Dias)
                .sort((a, b) => a.fecha - b.fecha);

            if (proximos.length === 0) {
                container.innerHTML = '<p style="color: #95a5a6; text-align: center;">No hay mantenimientos programados para los próximos 7 días</p>';
                return;
            }

            container.innerHTML = proximos.map(m => `
                <div class="mantenimiento-item ${m.tipo}">
                    <div class="mantenimiento-fecha">
                        📅 ${m.fecha.toLocaleDateString('es-ES', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                        })}
                    </div>
                    <div class="mantenimiento-equipo">${m.equipo}</div>
                    <span class="mantenimiento-tipo ${m.tipo}">
                        ${m.tipo === 'preventivo' ? '🔧 Preventivo' : 
                          m.tipo === 'correctivo' ? '🔨 Correctivo' : 
                          '📏 Calibración'}
                    </span>
                </div>
            `).join('');
        }

        // Event listeners
        document.getElementById('mesAnterior').addEventListener('click', () => {
            mesActual.setMonth(mesActual.getMonth() - 1);
            renderCalendario();
        });

        document.getElementById('mesSiguiente').addEventListener('click', () => {
            mesActual.setMonth(mesActual.getMonth() + 1);
            renderCalendario();
        });

        // Inicializar
        renderCalendario();
        renderProximosMantenimientos();