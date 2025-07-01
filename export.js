
function exportarDatos() {
  const data = localStorage.getItem("respuestas_modulo1");
  if (!data) return alert("No hay datos guardados.");

  let area = document.getElementById("json-output");
  if (!area) {
    area = document.createElement("textarea");
    area.id = "json-output";
    area.readOnly = true;
    area.style.width = "100%";
    area.style.height = "300px";
    area.style.marginTop = "20px";
    document.querySelector("main").appendChild(area);
  }

  area.value = JSON.stringify(JSON.parse(data), null, 2);

  let copiarBtn = document.getElementById("copiar-json-btn");
  if (!copiarBtn) {
    copiarBtn = document.createElement("button");
    copiarBtn.id = "copiar-json-btn";
    copiarBtn.innerText = "Copiar JSON";
    copiarBtn.style.marginTop = "10px";
    copiarBtn.style.backgroundColor = "#0b6121";
    copiarBtn.style.color = "white";
    copiarBtn.style.border = "none";
    copiarBtn.style.padding = "10px";
    copiarBtn.style.borderRadius = "5px";
    copiarBtn.style.cursor = "pointer";

    copiarBtn.onclick = () => {
      area.select();
      document.execCommand("copy");
      alert("JSON copiado al portapapeles.");
    };

    document.querySelector("main").appendChild(copiarBtn);
  }
}
