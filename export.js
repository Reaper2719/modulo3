function exportarDatos() {
  const data = localStorage.getItem("respuestas_modulo2");
  if (!data) return alert("No hay datos guardados.");
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "respuestas_modulo2.json";
  a.click();
  URL.revokeObjectURL(url);
}
