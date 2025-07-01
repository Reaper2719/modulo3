const dbName = 'Modulo3_DB';
const storeName = 'cargas';

let db;
const request = indexedDB.open(dbName, 1);
request.onupgradeneeded = function (e) {
  db = e.target.result;
  db.createObjectStore(storeName, { autoIncrement: true });
};
request.onsuccess = function (e) {
  db = e.target.result;
};
request.onerror = function (e) {
  alert('Error al abrir IndexedDB');
};

document.getElementById('formulario-carga').addEventListener('submit', function (e) {
  e.preventDefault();
  const data = {};
  new FormData(e.target).forEach((v, k) => {
    if (k === "estado") {
      data[k] = data[k] ? [...data[k], v] : [v];
    } else {
      data[k] = v;
    }
  });

  const tx = db.transaction([storeName], 'readwrite');
  const store = tx.objectStore(storeName);
  store.add(data);
  tx.oncomplete = () => {
    alert("Carga guardada.");
    e.target.reset();
  };
});

document.getElementById('exportar').addEventListener('click', async () => {
  const tx = db.transaction([storeName], 'readonly');
  const store = tx.objectStore(storeName);
  const all = store.getAll();
  all.onsuccess = () => {
    document.getElementById('resultado-json').value = JSON.stringify(all.result, null, 2);
  };
});

function copiarJSON() {
  const textarea = document.getElementById("resultado-json");
  textarea.select();
  document.execCommand("copy");
  alert("Copiado al portapapeles");
}