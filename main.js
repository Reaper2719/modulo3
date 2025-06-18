
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  if (!form) return;

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
      await guardarRegistro(datos);
      alert('✅ Registro guardado localmente');
      form.reset();
    } catch (err) {
      console.error('Error al guardar:', err);
      alert('❌ Error al guardar');
    }
  });
});
