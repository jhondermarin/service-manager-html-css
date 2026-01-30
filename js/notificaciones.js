// Sistema de Notificaciones para Service Manager
// Guarda este archivo como: js/notificaciones.js

class SistemaNotificaciones {
  constructor() {
    this.notificaciones = this.cargarNotificaciones();
    this.init();
  }

  init() {
    this.crearUI();
    this.actualizarContador();
    this.verificarCalibraciones();
  }

  crearUI() {
    // Crear HTML del sistema de notificaciones
    const headerDiv = document.querySelector('.header');
    if (!headerDiv) return;

    const notifHTML = `
      <div class="notificaciones-container">
        <button class="notif-btn" id="notifBtn" aria-label="Notificaciones">
          🔔
          <span class="notif-badge" id="notifBadge">0</span>
        </button>
        <div class="notif-panel hidden" id="notifPanel">
          <div class="notif-header">
            <h3>Notificaciones</h3>
            <button class="notif-clear" id="clearNotif">Limpiar todas</button>
          </div>
          <div class="notif-list" id="notifList"></div>
        </div>
      </div>
    `;

    // Insertar antes del último elemento del header
    headerDiv.insertAdjacentHTML('beforeend', notifHTML);

    // Agregar CSS dinámicamente
    this.agregarEstilos();

    // Agregar event listeners
    this.agregarEventListeners();
  }

  agregarEstilos() {
    const style = document.createElement('style');
    style.textContent = `
      .notificaciones-container {
        position: relative;
      }

      .notif-btn {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        position: relative;
        padding: 0.5rem;
        transition: transform 0.2s;
      }

      .notif-btn:hover {
        transform: scale(1.1);
      }

      .notif-badge {
        position: absolute;
        top: 0;
        right: 0;
        background: #e74c3c;
        color: white;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 0.75rem;
        font-weight: bold;
      }

      .notif-badge.hidden {
        display: none;
      }

      .notif-panel {
        position: absolute;
        right: 0;
        top: 100%;
        margin-top: 0.5rem;
        width: 350px;
        max-height: 500px;
        background: white;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        overflow: hidden;
        z-index: 1000;
        animation: slideDown 0.3s ease;
      }

      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      .notif-panel.hidden {
        display: none;
      }

      .notif-header {
        padding: 1rem;
        border-bottom: 1px solid #ecf0f1;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .notif-header h3 {
        margin: 0;
        font-size: 1.1rem;
        color: #2c3e50;
      }

      .notif-clear {
        background: none;
        border: none;
        color: #3498db;
        cursor: pointer;
        font-size: 0.85rem;
        font-weight: 600;
      }

      .notif-clear:hover {
        text-decoration: underline;
      }

      .notif-list {
        max-height: 400px;
        overflow-y: auto;
      }

      .notif-item {
        padding: 1rem;
        border-bottom: 1px solid #ecf0f1;
        cursor: pointer;
        transition: background 0.2s;
        position: relative;
      }

      .notif-item:hover {
        background: #f8f9fa;
      }

      .notif-item.no-leida {
        background: #e3f2fd;
      }

      .notif-item.no-leida::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 4px;
        height: 70%;
        background: #3498db;
      }

      .notif-titulo {
        font-weight: 600;
        color: #2c3e50;
        margin-bottom: 0.25rem;
        font-size: 0.95rem;
      }

      .notif-mensaje {
        font-size: 0.85rem;
        color: #7f8c8d;
        margin-bottom: 0.25rem;
      }

      .notif-tiempo {
        font-size: 0.75rem;
        color: #95a5a6;
      }

      .notif-tipo {
        display: inline-block;
        padding: 0.15rem 0.5rem;
        border-radius: 4px;
        font-size: 0.75rem;
        font-weight: 600;
        margin-bottom: 0.5rem;
      }

      .notif-tipo.urgente {
        background: #fee;
        color: #e74c3c;
      }

      .notif-tipo.warning {
        background: #fff3cd;
        color: #856404;
      }

      .notif-tipo.info {
        background: #d1ecf1;
        color: #0c5460;
      }

      .notif-empty {
        padding: 2rem;
        text-align: center;
        color: #95a5a6;
      }

      @media (max-width: 480px) {
        .notif-panel {
          width: 90vw;
          right: -1rem;
        }
      }
    `;
    document.head.appendChild(style);
  }

  agregarEventListeners() {
    const notifBtn = document.getElementById('notifBtn');
    const notifPanel = document.getElementById('notifPanel');
    const clearNotif = document.getElementById('clearNotif');

    // Toggle panel
    notifBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      notifPanel.classList.toggle('hidden');
      this.renderizarNotificaciones();
    });

    // Cerrar panel al hacer click fuera
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.notificaciones-container')) {
        notifPanel.classList.add('hidden');
      }
    });

    // Limpiar todas las notificaciones
    clearNotif?.addEventListener('click', () => {
      this.limpiarTodas();
    });
  }

  cargarNotificaciones() {
    // En una aplicación real, esto vendría del servidor
    return [
      {
        id: 1,
        tipo: 'urgente',
        titulo: 'Calibración Atrasada',
        mensaje: 'El Analizador de Seguridad Eléctrica tiene la calibración vencida desde hace 3 meses',
        tiempo: new Date(Date.now() - 2 * 60 * 60 * 1000),
        leida: false,
        url: 'calibration.html'
      },
      {
        id: 2,
        tipo: 'warning',
        titulo: 'Calibración Próxima',
        mensaje: 'El Osciloscopio Hameg requiere calibración en 15 días',
        tiempo: new Date(Date.now() - 5 * 60 * 60 * 1000),
        leida: false,
        url: 'calibration.html'
      },
      {
        id: 3,
        tipo: 'info',
        titulo: 'Nueva Incidencia',
        mensaje: 'Se ha creado la incidencia #012 para el equipo IPL Advanced',
        tiempo: new Date(Date.now() - 24 * 60 * 60 * 1000),
        leida: false,
        url: 'incidencias.html'
      },
      {
        id: 4,
        tipo: 'info',
        titulo: 'Mantenimiento Completado',
        mensaje: 'El mantenimiento #101 del Laser CO2 ha sido completado',
        tiempo: new Date(Date.now() - 48 * 60 * 60 * 1000),
        leida: true,
        url: 'detalle_mantenimiento_101.html'
      }
    ];
  }

  renderizarNotificaciones() {
    const listContainer = document.getElementById('notifList');
    if (!listContainer) return;

    if (this.notificaciones.length === 0) {
      listContainer.innerHTML = `
        <div class="notif-empty">
          <p>No hay notificaciones</p>
        </div>
      `;
      return;
    }

    listContainer.innerHTML = this.notificaciones
      .sort((a, b) => b.tiempo - a.tiempo)
      .map(notif => `
        <div class="notif-item ${notif.leida ? '' : 'no-leida'}" 
             onclick="notificaciones.marcarComoLeida(${notif.id}, '${notif.url}')">
          <div class="notif-tipo ${notif.tipo}">${this.getTipoTexto(notif.tipo)}</div>
          <div class="notif-titulo">${notif.titulo}</div>
          <div class="notif-mensaje">${notif.mensaje}</div>
          <div class="notif-tiempo">${this.formatearTiempo(notif.tiempo)}</div>
        </div>
      `).join('');
  }

  getTipoTexto(tipo) {
    const tipos = {
      urgente: '🚨 Urgente',
      warning: '⚠️ Aviso',
      info: 'ℹ️ Info'
    };
    return tipos[tipo] || 'Info';
  }

  formatearTiempo(fecha) {
    const ahora = new Date();
    const diff = ahora - fecha;
    const minutos = Math.floor(diff / 60000);
    const horas = Math.floor(minutos / 60);
    const dias = Math.floor(horas / 24);

    if (minutos < 60) return `Hace ${minutos} minuto${minutos !== 1 ? 's' : ''}`;
    if (horas < 24) return `Hace ${horas} hora${horas !== 1 ? 's' : ''}`;
    if (dias < 7) return `Hace ${dias} día${dias !== 1 ? 's' : ''}`;
    return fecha.toLocaleDateString('es-ES');
  }

  actualizarContador() {
    const badge = document.getElementById('notifBadge');
    if (!badge) return;

    const noLeidas = this.notificaciones.filter(n => !n.leida).length;
    badge.textContent = noLeidas;
    badge.classList.toggle('hidden', noLeidas === 0);
  }

  marcarComoLeida(id, url) {
    const notif = this.notificaciones.find(n => n.id === id);
    if (notif) {
      notif.leida = true;
      this.actualizarContador();
      if (url) {
        setTimeout(() => {
          window.location.href = url;
        }, 200);
      }
    }
  }

  limpiarTodas() {
    this.notificaciones = [];
    this.renderizarNotificaciones();
    this.actualizarContador();
  }

  verificarCalibraciones() {
    // Simulación de verificación de calibraciones
    // En una app real, esto consultaría una API
    console.log('Verificando calibraciones pendientes...');
  }

  agregarNotificacion(notif) {
    const nuevaNotif = {
      id: Date.now(),
      tipo: notif.tipo || 'info',
      titulo: notif.titulo,
      mensaje: notif.mensaje,
      tiempo: new Date(),
      leida: false,
      url: notif.url || null
    };
    
    this.notificaciones.unshift(nuevaNotif);
    this.actualizarContador();
    
    // Mostrar toast notification
    this.mostrarToast(nuevaNotif);
  }

  mostrarToast(notif) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = `
      <div class="toast-content">
        <div class="toast-titulo">${notif.titulo}</div>
        <div class="toast-mensaje">${notif.mensaje}</div>
      </div>
    `;

    const style = document.createElement('style');
    style.textContent = `
      .toast-notification {
        position: fixed;
        top: 80px;
        right: 20px;
        background: white;
        padding: 1rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideIn 0.3s ease, slideOut 0.3s ease 3s;
        max-width: 300px;
      }

      @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
      }

      @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
      }

      .toast-titulo {
        font-weight: 600;
        margin-bottom: 0.25rem;
        color: #2c3e50;
      }

      .toast-mensaje {
        font-size: 0.9rem;
        color: #7f8c8d;
      }
    `;
    document.head.appendChild(style);

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3500);
  }
}

// Inicializar sistema de notificaciones cuando se carga la página
let notificaciones;

document.addEventListener('DOMContentLoaded', () => {
  notificaciones = new SistemaNotificaciones();
});

// Exportar para uso global
window.SistemaNotificaciones = SistemaNotificaciones;