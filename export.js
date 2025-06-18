
async function exportarDatos() {
  const request = indexedDB.open("registrosDB", 1);

  request.onsuccess = function (event) {
    const db = event.target.result;
    const tx = db.transaction("registros", "readonly");
    const store = tx.objectStore("registros");
    const getAll = store.getAll();

    getAll.onsuccess = function () {
      if (!getAll.result || getAll.result.length === 0) {
        alert("⚠ No hay registros para exportar.");
        return;
      }

      const datos = JSON.stringify(getAll.result, null, 2);
      const blob = new Blob([datos], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "modulo4_registros.json";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    };

    getAll.onerror = () => alert("❌ Error al leer los registros");
  };

  request.onerror = () => alert("❌ No se pudo abrir la base de datos");
}

window.exportarDatos = exportarDatos;
