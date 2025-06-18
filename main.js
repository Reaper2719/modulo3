
// === indexedDB + guardarRegistro ===
const DB_NAME = "registrosDB";
const DB_VERSION = 1;
const STORE_NAME = "registros";

function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
      }
    };
  });
}

async function guardarRegistro(data) {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  tx.objectStore(STORE_NAME).add(data);
  return tx.complete;
}

async function exportarDatos() {
  console.log("🟡 Intentando abrir la base de datos...");
  const request = indexedDB.open("registrosDB", 1);

  request.onsuccess = function (event) {
    const db = event.target.result;
    const tx = db.transaction("registros", "readonly");
    const store = tx.objectStore("registros");
    const getAll = store.getAll();

    getAll.onsuccess = function () {
      const registros = getAll.result;
      if (!registros || registros.length === 0) {
        alert("⚠ No hay registros para exportar.");
        return;
      }

      const datos = JSON.stringify(registros, null, 2);
      const blob = new Blob([datos], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.setAttribute("download", "modulo4_registros.json");
      a.style.display = "none";

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      console.log("✅ Exportación completada");
    };

    getAll.onerror = function () {
      console.error("❌ Error al leer registros");
      alert("❌ No se pudieron leer los registros");
    };
  };

  request.onerror = function () {
    console.error("❌ No se pudo abrir la base de datos");
    alert("❌ Error abriendo la base de datos");
  };
}

// === Eventos DOM ===
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
        await guardarRegistro(datos);
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
      console.log("🟢 Botón exportar clickeado");
      exportarDatos();
    });
  }
});
