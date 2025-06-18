
document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector('form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const datos = {};
      const elementos = form.querySelectorAll('input, select, textarea');
      elementos.forEach(el => {
        if (el.type === 'radio' && el.checked) {
          datos[el.name] = el.value;
        } else if (el.type === 'checkbox') {
          if (!datos[el.name]) datos[el.name] = [];
          if (el.checked) datos[el.name].push(el.value);
        } else if (el.type !== 'submit') {
          datos[el.name] = el.value;
        }
      });

      try {
        await window.guardarRegistro(datos);
        alert('✅ Registro guardado localmente');
        form.reset();
      } catch (err) {
        console.error('Error al guardar:', err);
        alert('❌ Error al guardar');
      }
    });
  }

  const exportBtn = document.getElementById("btn-exportar");
  if (exportBtn) {
    exportBtn.addEventListener("click", () => {
      console.log("🟢 Botón exportar presionado");
      if (typeof exportarDatos === "function") {
        exportarDatos();
      } else {
        console.error("❌ exportarDatos no está disponible.");
      }
    });
  }
});
