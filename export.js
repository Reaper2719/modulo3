
async function exportarDatos() {
  const request = indexedDB.open("registrosDB", 1);

  request.onsuccess = function (event) {
    const db = event.target.result;
    const tx = db.transaction("registros", "readonly");
    const store = tx.objectStore("registros");
    const getAll = store.getAll();

    getAll.onsuccess = function () {
      const datos = JSON.stringify(getAll.result, null, 2);
      const blob = new Blob([datos], { type: "application/json" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "modulo4_registros.json";
      a.click();
      URL.revokeObjectURL(url);
    };

    getAll.onerror = function () {
      alert("❌ Error al leer registros");
    };
  };

  request.onerror = function () {
    alert("❌ No se pudo abrir la base de datos");
  };
}

window.exportarDatos = exportarDatos;
