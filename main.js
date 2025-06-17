
document.addEventListener('DOMContentLoaded', () => {
  const categoria = document.getElementById('categoria');
  const tipo = document.getElementById('tipo');
  const form = document.getElementById('formulario-carga');
  const lista = document.getElementById('lista-registros');

  const tiposPorCategoria = {
    'iluminacion': ['Bombillo incandescente', 'Bombillo fluorescente', 'Bombillo LED', 'Tubo fluorescente', 'Lámpara recargable', 'Luminaria solar'],
    'refrigeracion': ['Nevera doméstica', 'Congelador', 'Refrigerador pequeño', 'Refrigerador grande'],
    'cocina': ['Estufa eléctrica', 'Olla eléctrica', 'Horno microondas', 'Licuadora', 'Cafetera eléctrica', 'Freidora eléctrica', 'Sandwichera / tostadora'],
    'comunicaciones': ['Televisor CRT (tubo)', 'Televisor LED / LCD', 'Radio', 'Equipo de sonido / minicomponente', 'Decodificador / TDT', 'Cargador de celular'],
    'ventilacion': ['Ventilador', 'Extractor de aire', 'Aire acondicionado (split o ventana)', 'Sierra circular / caladora / esmeril'],
    'produccion': ['Máquina de coser eléctrica', 'Herramienta de mano (taladro, pulidora, etc.)', 'Compresor', 'Soldador (eléctrico o inverter)', 'Banco de trabajo con herramientas eléctricas'],
    'computacion': ['Computador de escritorio', 'Portátil', 'Tablet', 'Impresora', 'UPS / Regulador de voltaje'],
    'bombeo': ['Bomba de agua sumergible', 'Bomba periférica', 'Sistema de presión hidroneumático', 'Bomba comunitaria / pozo', 'Sistema de bombeo solar'],
    'otro': ['Otro']
  };




  

  categoria.addEventListener('change', () => {
    const seleccionada = categoria.value;
    tipo.innerHTML = '';
    tipo.disabled = false;

    if (tiposPorCategoria[seleccionada]) {
      tiposPorCategoria[seleccionada].forEach(op => {
        const option = document.createElement('option');
        option.value = op;
        option.textContent = op;
        tipo.appendChild(option);
      });
    }
  });

  // indexedDB: guardarRegistro
  function guardarRegistro(data) {
    const request = indexedDB.open("InventarioModulo3", 1);
    request.onupgradeneeded = function(e) {
      const db = e.target.result;
      if (!db.objectStoreNames.contains("registros")) {
        db.createObjectStore("registros", { keyPath: "fecha" });
      }
    };
    request.onsuccess = function(e) {
      const db = e.target.result;
      const tx = db.transaction("registros", "readwrite");
      const store = tx.objectStore("registros");
      store.put(data);
    };
  }

  // exportarJSON
  function exportarJSON(data) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const 
    a = document.createElement('a');
    a.href = url;
    a.download = 'inventario_modulo3.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  let registros = [];

  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    const obj = {
      categoria: data.get('categoria'),
      tipo: data.get('tipo'),
      cantidad: data.get('cantidad'),
      horas: data.get('horas'),
      dias: data.get('dias'),
      potencia: data.get('potencia'),
      estado: [...form.querySelectorAll('input[name="estado"]:checked')].map(e => e.value),
      fecha: new Date().toISOString()
    };

    guardarRegistro(obj);
    registros.push(obj);
    mostrarLista();
    form.reset();
    tipo.innerHTML = '';
    tipo.disabled = true;
  });

  document.getElementById('finalizar').addEventListener('click', () => {
    exportarJSON(registros);
  });

  function mostrarLista() {
    lista.innerHTML = '<h3>Cargas registradas:</h3>';
    registros.forEach((r, i) => {
      lista.innerHTML += `<p><strong>${i + 1}. ${r.tipo}</strong> - ${r.cantidad} equipos, ${r.potencia}W</p>`;
    });
  }
});
