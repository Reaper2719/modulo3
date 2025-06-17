// Activar campos de texto al marcar 'Otro'
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(input => {
    input.addEventListener('change', () => {
      const label = input.parentElement;
      const otroInput = label.querySelector('input[type="text"]');
      if (otroInput) {
        otroInput.disabled = !input.checked;
        if (!input.checked) otroInput.value = '';
      }
    });
  });
});
