const dbName = 'Modulo4_DB';
const storeName = 'zonas';

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

document.querySelector("form").addEventListener("submit", function (e) {
  e.preventDefault();
  const data = {};
  new FormData(e.target).forEach((v, k) => {
    if (data[k]) {
      if (Array.isArray(data[k])) {
        data[k].push(v);
      } else {
        data[k] = [data[k], v];
      }
    } else {
      data[k] = v;
    }
  });

  const tx = db.transaction([storeName], 'readwrite');
  const store = tx.objectStore(storeName);
  store.add(data);
  tx.oncomplete = () => {
    alert("Observación guardada.");
    e.target.reset();
  };
});

document.getElementById('exportar').addEventListener('click', () => {
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