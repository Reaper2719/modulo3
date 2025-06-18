
document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('form-zonas');
  const lista = document.getElementById('lista-observaciones');
  const exportarBtn = document.getElementById('exportar');
  const registros = [];

  if (!form || !exportarBtn) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    data.fecha = new Date().toISOString();
    registros.push(data);
    guardarEnIndexedDB(data);
    mostrar(data);
    form.reset();
  });

  exportarBtn.addEventListener('click', function () {
    exportarJSON(registros);
  });

  function mostrar(data) {
    const div = document.createElement('div');
    div.textContent = "Observación guardada: " + data.fecha;
    lista.appendChild(div);
  }

  // Service Worker solo si NO estás en file://
  if ('serviceWorker' in navigator && window.location.protocol !== 'file:') {
    navigator.serviceWorker.register('service-worker.js')
      .then(reg => console.log('✅ Service Worker registrado:', reg.scope))
      .catch(err => console.error('❌ Error registrando Service Worker:', err));
  }
});
