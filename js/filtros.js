// Esperamos a que el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {

    const btnFiltros = document.getElementById('btnFiltros');
    const panelFiltros = document.getElementById('panelFiltros');
    const filtrosForm = document.getElementById('filtrosForm');

    // Mostrar / ocultar panel de filtros
    btnFiltros.addEventListener('click', () => {
        panelFiltros.classList.toggle('hidden');

        // Cambiar texto del botón (opcional)
        btnFiltros.textContent = panelFiltros.classList.contains('hidden')
            ? 'Filtros'
            : 'Ocultar filtros';
    });

    // Simulación de filtros
    filtrosForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const estado = filtrosForm.estado.value;
        const prioridad = filtrosForm.prioridad.value;
        const fecha = filtrosForm.fecha.value;

        console.log('Filtros aplicados:', {
            estado,
            prioridad,
            fecha
        });

        // Aquí en el futuro:
        // - filtras un array
        // - o llamas al backend con fetch()
    });
});
