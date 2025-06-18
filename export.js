
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

      // ✅ Usar método seguro y confiable para descarga
      const a = document.createElement("a");
      const url = window.URL.createObjectURL(blob);

      a.href = url;
      a.setAttribute("download", "modulo4_registros.json");
      a.style.display = "none";

      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

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

window.exportarDatos = exportarDatos;
