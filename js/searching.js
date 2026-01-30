/**
 * SISTEMA DE BÚSQUEDA EN TIEMPO REAL
 * Archivo: js/busqueda.js
 * 
 * Permite buscar en tablas mientras el usuario escribe
 * sin necesidad de hacer click en "Buscar"
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log('✅ Sistema de búsqueda cargado');
  
  // Seleccionar TODOS los inputs de búsqueda del documento
  const searchInputs = document.querySelectorAll('input[name="search"]');
  
  // Verificar que existan inputs de búsqueda
  if (searchInputs.length === 0) {
    console.warn('⚠️ No se encontraron inputs de búsqueda');
    return;
  }
  
  // Para cada input de búsqueda encontrado
  searchInputs.forEach((input, index) => {
    console.log(`📝 Input de búsqueda #${index + 1} encontrado`);
    
    // Agregar evento 'input' que se dispara con cada tecla
    input.addEventListener('input', function(e) {
      // 'this' = el input que disparó el evento
      // e.target también funciona
      
      const terminoBusqueda = this.value.toLowerCase().trim();
      // toLowerCase() = convertir a minúsculas para búsqueda sin distinción
      // trim() = eliminar espacios al inicio y final
      
      console.log(`🔍 Buscando: "${terminoBusqueda}"`);
      
      // Buscar la tabla más cercana a este input
      // closest() busca hacia arriba en el DOM
      const contenedor = this.closest('.content') || document;
      const tabla = contenedor.querySelector('.tabla-incidencias tbody, .tabla-mantenimientos tbody');
      
      if (!tabla) {
        console.error('❌ No se encontró tabla para buscar');
        return;
      }
      
      // Obtener todas las filas de la tabla
      const filas = tabla.querySelectorAll('tr');
      let filasEncontradas = 0;
      let filasOcultas = 0;
      
      // Recorrer cada fila
      filas.forEach(fila => {
        // Obtener todo el texto de la fila
        const textoFila = fila.textContent.toLowerCase();
        
        // Verificar si el texto de la fila contiene el término de búsqueda
        if (textoFila.includes(terminoBusqueda)) {
          // Mostrar fila
          fila.style.display = '';
          filasEncontradas++;
        } else {
          // Ocultar fila
          fila.style.display = 'none';
          filasOcultas++;
        }
      });
      
      console.log(`✅ Encontradas: ${filasEncontradas} | Ocultas: ${filasOcultas}`);
      
      // Opcional: Mostrar mensaje si no hay resultados
      mostrarMensajeSinResultados(tabla, filasEncontradas, terminoBusqueda);
    });
    
    // Limpiar búsqueda al hacer focus
    input.addEventListener('focus', function() {
      this.select(); // Seleccionar todo el texto
    });
  });
});

/**
 * Mostrar mensaje cuando no hay resultados
 */
function mostrarMensajeSinResultados(tabla, cantidad, termino) {
  // Buscar si ya existe un mensaje
  let mensaje = tabla.parentElement.querySelector('.sin-resultados');
  
  if (cantidad === 0 && termino !== '') {
    // No hay resultados y hay término de búsqueda
    if (!mensaje) {
      // Crear mensaje si no existe
      mensaje = document.createElement('div');
      mensaje.className = 'sin-resultados';
      mensaje.style.cssText = `
        padding: 2rem;
        text-align: center;
        color: #95a5a6;
        background: #f8f9fa;
        border-radius: 8px;
        margin-top: 1rem;
      `;
      tabla.parentElement.appendChild(mensaje);
    }
    mensaje.innerHTML = `
      <p style="margin: 0; font-size: 1.1rem;">🔍 No se encontraron resultados para "<strong>${termino}</strong>"</p>
      <p style="margin: 0.5rem 0 0 0; font-size: 0.9rem;">Intenta con otros términos de búsqueda</p>
    `;
  } else if (mensaje) {
    // Hay resultados o no hay término, eliminar mensaje
    mensaje.remove();
  }
}