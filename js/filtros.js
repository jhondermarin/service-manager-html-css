/**
 * SISTEMA DE FILTROS AVANZADOS
 * Archivo: js/filtros.js
 * 
 * Filtra registros de tablas por:
 * - Estado (abierta, en proceso, cerrada)
 * - Prioridad (alta, media, baja)
 * - Fecha
 */

document.addEventListener('DOMContentLoaded', () => {
  console.log('✅ Sistema de filtros cargado');
  
  // ============================================
  // 1. OBTENER ELEMENTOS DEL DOM
  // ============================================
  
  const btnFiltros = document.getElementById('btnFiltros');
  const panelFiltros = document.getElementById('panelFiltros');
  const filtrosForm = document.getElementById('filtrosForm');
  
  // Verificar que los elementos existan
  if (!btnFiltros || !panelFiltros || !filtrosForm) {
    console.warn('⚠️ Elementos de filtros no encontrados en esta página');
    return; // Salir si no están los elementos
  }
  
  console.log('📋 Elementos de filtros encontrados');
  
  // ============================================
  // 2. TOGGLE DEL PANEL DE FILTROS
  // ============================================
  
  btnFiltros.addEventListener('click', () => {
    panelFiltros.classList.toggle('hidden');
    
    // Cambiar texto del botón
    if (panelFiltros.classList.contains('hidden')) {
      btnFiltros.textContent = 'Mostrar Filtros';
      console.log('🔽 Panel de filtros oculto');
    } else {
      btnFiltros.textContent = 'Ocultar Filtros';
      console.log('🔼 Panel de filtros visible');
    }
  });
  
  // ============================================
  // 3. APLICAR FILTROS AL ENVIAR FORMULARIO
  // ============================================
  
  filtrosForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Evitar recarga de página
    console.log('🔍 Aplicando filtros...');
    
    // Obtener valores del formulario
    const formData = new FormData(filtrosForm);
    const filtros = {
      estado: formData.get('estado') || '',
      prioridad: formData.get('prioridad') || '',
      fecha: formData.get('fecha') || ''
    };
    
    console.log('Filtros seleccionados:', filtros);
    
    // Aplicar los filtros
    aplicarFiltros(filtros);
  });
  
  // ============================================
  // 4. LIMPIAR FILTROS
  // ============================================
  
  // Agregar botón de limpiar si no existe
  if (!filtrosForm.querySelector('.btn-limpiar')) {
    const btnLimpiar = document.createElement('button');
    btnLimpiar.type = 'button';
    btnLimpiar.className = 'btn-general btn-limpiar';
    btnLimpiar.textContent = 'Limpiar Filtros';
    btnLimpiar.style.backgroundColor = '#95a5a6';
    
    btnLimpiar.addEventListener('click', () => {
      filtrosForm.reset(); // Resetear formulario
      aplicarFiltros({ estado: '', prioridad: '', fecha: '' });
      console.log('🧹 Filtros limpiados');
    });
    
    filtrosForm.appendChild(btnLimpiar);
  }
});

// ============================================
// 5. FUNCIÓN PRINCIPAL: APLICAR FILTROS
// ============================================

function aplicarFiltros(filtros) {
  // Buscar la tabla de incidencias
  const tabla = document.querySelector('.tabla-incidencias tbody');
  
  if (!tabla) {
    console.error('❌ No se encontró la tabla');
    return;
  }
  
  // Obtener todas las filas
  const filas = tabla.querySelectorAll('tr');
  let filasVisibles = 0;
  let filasOcultas = 0;
  
  // Recorrer cada fila
  filas.forEach((fila, index) => {
    // Obtener las celdas de la fila
    const celdas = fila.querySelectorAll('td');
    
    // Verificar que la fila tenga celdas
    if (celdas.length === 0) {
      console.warn(`⚠️ Fila ${index} sin celdas`);
      return;
    }
    
    // Extraer datos de la fila según las columnas
    // IMPORTANTE: Ajustar estos índices según tu tabla
    // Índices: 0=ID, 1=Equipo, 2=SN, 3=Estado, 4=Técnico, 5=Fecha
    const datosFila = {
      id: celdas[0]?.textContent.trim() || '',
      equipo: celdas[1]?.textContent.trim() || '',
      sn: celdas[2]?.textContent.trim() || '',
      estado: celdas[3]?.textContent.trim().toLowerCase() || '',
      tecnico: celdas[4]?.textContent.trim() || '',
      fecha: celdas[5]?.textContent.trim() || ''
    };
    
    console.log(`Fila ${index}:`, datosFila);
    
    // Evaluar si la fila cumple con los filtros
    const cumpleFiltros = evaluarFiltros(datosFila, filtros);
    
    // Mostrar u ocultar la fila
    if (cumpleFiltros) {
      fila.style.display = ''; // Mostrar
      filasVisibles++;
    } else {
      fila.style.display = 'none'; // Ocultar
      filasOcultas++;
    }
  });
  
  console.log(`✅ Filtrado completado: ${filasVisibles} visibles, ${filasOcultas} ocultas`);
  
  // Mostrar mensaje si no hay resultados
  mostrarMensajeFiltrado(tabla, filasVisibles);
}

// ============================================
// 6. EVALUAR SI UNA FILA CUMPLE LOS FILTROS
// ============================================

function evaluarFiltros(datosFila, filtros) {
  let cumple = true; // Empieza asumiendo que cumple
  
  // Filtro de ESTADO
  if (filtros.estado !== '') {
    const estadoFiltro = filtros.estado.toLowerCase();
    
    // Normalizar estados para mejor comparación
    const estadosEquivalentes = {
      'abierta': ['abierta', 'abierto', 'pendiente'],
      'proceso': ['en progreso', 'en proceso', 'progreso'],
      'cerrada': ['cerrada', 'cerrado', 'completada', 'completo', 'resuelta']
    };
    
    const estadosValidos = estadosEquivalentes[estadoFiltro] || [estadoFiltro];
    const cumpleEstado = estadosValidos.some(estado => 
      datosFila.estado.includes(estado)
    );
    
    if (!cumpleEstado) {
      cumple = false;
      console.log(`❌ No cumple filtro de estado: "${datosFila.estado}" vs "${estadoFiltro}"`);
    }
  }
  
  // Filtro de PRIORIDAD (si existe en tu tabla)
  if (filtros.prioridad !== '' && datosFila.prioridad) {
    if (!datosFila.prioridad.toLowerCase().includes(filtros.prioridad.toLowerCase())) {
      cumple = false;
      console.log(`❌ No cumple filtro de prioridad`);
    }
  }
  
  // Filtro de FECHA
  if (filtros.fecha !== '') {
    const cumpleFecha = compararFechas(datosFila.fecha, filtros.fecha);
    if (!cumpleFecha) {
      cumple = false;
      console.log(`❌ No cumple filtro de fecha: "${datosFila.fecha}" vs "${filtros.fecha}"`);
    }
  }
  
  return cumple;
}

// ============================================
// 7. COMPARAR FECHAS
// ============================================

function compararFechas(fechaTabla, fechaFiltro) {
  // fechaTabla viene en formato DD/MM/YYYY
  // fechaFiltro viene en formato YYYY-MM-DD (del input date)
  
  if (!fechaTabla || !fechaFiltro) return true;
  
  try {
    // Separar la fecha de la tabla
    const partes = fechaTabla.split('/');
    if (partes.length !== 3) {
      console.warn(`⚠️ Formato de fecha incorrecto: ${fechaTabla}`);
      return true; // No filtrar si el formato es inválido
    }
    
    const dia = parseInt(partes[0], 10);
    const mes = parseInt(partes[1], 10) - 1; // Los meses en JS van de 0-11
    const año = parseInt(partes[2], 10);
    
    // Crear objeto Date de la tabla
    const fechaTablaObj = new Date(año, mes, dia);
    
    // Crear objeto Date del filtro
    const fechaFiltroObj = new Date(fechaFiltro);
    
    // Comparar solo la fecha (sin hora)
    const fechaTablaStr = fechaTablaObj.toDateString();
    const fechaFiltroStr = fechaFiltroObj.toDateString();
    
    console.log(`📅 Comparando: ${fechaTablaStr} === ${fechaFiltroStr}`);
    
    return fechaTablaStr === fechaFiltroStr;
  } catch (error) {
    console.error('❌ Error al comparar fechas:', error);
    return true; // No filtrar si hay error
  }
}

// ============================================
// 8. MENSAJE CUANDO NO HAY RESULTADOS
// ============================================

function mostrarMensajeFiltrado(tabla, cantidad) {
  // Buscar si ya existe un mensaje
  let mensaje = tabla.parentElement.querySelector('.mensaje-filtrado');
  
  if (cantidad === 0) {
    // No hay resultados
    if (!mensaje) {
      // Crear mensaje si no existe
      mensaje = document.createElement('div');
      mensaje.className = 'mensaje-filtrado';
      mensaje.style.cssText = `
        padding: 2rem;
        text-align: center;
        color: #95a5a6;
        background: #fff3cd;
        border: 1px solid #ffeaa7;
        border-radius: 8px;
        margin-top: 1rem;
      `;
      tabla.parentElement.appendChild(mensaje);
    }
    mensaje.innerHTML = `
      <p style="margin: 0; font-size: 1.1rem; color: #856404;">
        ⚠️ No se encontraron registros con los filtros seleccionados
      </p>
      <p style="margin: 0.5rem 0 0 0; font-size: 0.9rem; color: #856404;">
        Intenta cambiar o limpiar los filtros
      </p>
    `;
  } else if (mensaje) {
    // Hay resultados, eliminar mensaje
    mensaje.remove();
  }
}

// ============================================
// 9. EXPORTAR FUNCIONES (OPCIONAL)
// ============================================

// Si quieres usar estas funciones desde otros archivos
window.FiltrosService = {
  aplicarFiltros,
  evaluarFiltros,
  compararFechas
};
