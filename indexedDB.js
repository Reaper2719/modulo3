
export function guardarEnIndexedDB(data) {
  const req = indexedDB.open("Modulo3DB", 1);
  req.onupgradeneeded = e => {
    const db = e.target.result;
    if (!db.objectStoreNames.contains("registros")) {
      db.createObjectStore("registros", { keyPath: "fecha" });
    }
  };
  req.onsuccess = e => {
    const db = e.target.result;
    const tx = db.transaction("registros", "readwrite");
    const store = tx.objectStore("registros");
    store.put(data);
  };
}
