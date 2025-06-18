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
      
      // Detectar si es iOS/iPadOS
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                   (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      
      if (isIOS) {
        // Método para iOS/iPadOS - Mostrar en nueva ventana
        exportarParaIOS(datos);
      } else {
        // Método tradicional para otros dispositivos
        exportarTradicional(datos);
      }

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

function exportarParaIOS(datos) {
  // Crear una nueva ventana con el contenido JSON
  const nuevaVentana = window.open('', '_blank');
  
  if (!nuevaVentana) {
    // Si no se puede abrir ventana, usar método alternativo
    mostrarEnModal(datos);
    return;
  }
  
  const fechaHora = new Date().toLocaleString('es-CO');
  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Exportación Módulo 4 - ${fechaHora}</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                padding: 20px;
                background-color: #f5f5f7;
                color: #1d1d1f;
            }
            .container {
                max-width: 800px;
                margin: 0 auto;
                background: white;
                padding: 30px;
                border-radius: 12px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            }
            .header {
                text-align: center;
                margin-bottom: 30px;
                color: #008751;
            }
            .info {
                background: #e6f2ee;
                padding: 15px;
                border-radius: 8px;
                margin-bottom: 20px;
                border-left: 4px solid #008751;
            }
            .json-content {
                background: #f6f6f6;
                padding: 20px;
                border-radius: 8px;
                white-space: pre-wrap;
                font-family: 'Monaco', 'Menlo', monospace;
                font-size: 12px;
                line-height: 1.4;
                max-height: 400px;
                overflow-y: auto;
                border: 1px solid #d1d1d6;
            }
            .buttons {
                margin-top: 20px;
                text-align: center;
            }
            .btn {
                background: #008751;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                font-size: 16px;
                margin: 0 10px;
                cursor: pointer;
                text-decoration: none;
                display: inline-block;
            }
            .btn:hover {
                background: #006d40;
            }
            .btn-secondary {
                background: #6c757d;
            }
            .btn-secondary:hover {
                background: #545b62;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>📊 Exportación de Datos</h1>
                <h2>Módulo 4: Observación de Zonas Comunes</h2>
                <p>Generado el: ${fechaHora}</p>
            </div>
            
            <div class="info">
                <h3>📱 Instrucciones para iPad:</h3>
                <ol>
                    <li><strong>Seleccionar todo el contenido JSON:</strong> Toca y mantén presionado en el área de texto, luego selecciona "Seleccionar todo"</li>
                    <li><strong>Copiar:</strong> Toca "Copiar" en el menú que aparece</li>
                    <li><strong>Pegar en app de notas:</strong> Abre la app "Notas" y pega el contenido</li>
                    <li><strong>Guardar como archivo:</strong> En Notas, toca el botón "Compartir" y selecciona "Guardar en archivos"</li>
                    <li><strong>Cambiar extensión:</strong> Renombra el archivo con extensión .json</li>
                </ol>
                <p><strong>💡 Tip:</strong> También puedes enviar por email o guardar en iCloud Drive</p>
            </div>

            <div class="buttons">
                <button class="btn" onclick="selectAll()">📋 Seleccionar Todo</button>
                <button class="btn btn-secondary" onclick="window.close()">❌ Cerrar</button>
            </div>
            
            <div class="json-content" id="jsonContent">${datos}</div>
        </div>
        
        <script>
            function selectAll() {
                const content = document.getElementById('jsonContent');
                const range = document.createRange();
                range.selectNode(content);
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
                
                // Intentar copiar automáticamente
                try {
                    document.execCommand('copy');
                    alert('✅ Contenido copiado al portapapeles');
                } catch (err) {
                    alert('📋 Contenido seleccionado. Usa Cmd+C para copiar');
                }
            }
            
            // Auto-seleccionar al cargar (funciona mejor en algunos casos)
            window.addEventListener('load', function() {
                setTimeout(selectAll, 1000);
            });
        </script>
    </body>
    </html>
  `;
  
  nuevaVentana.document.write(html);
  nuevaVentana.document.close();
}

function mostrarEnModal(datos) {
  // Método alternativo si no se puede abrir ventana
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.8);
    z-index: 10000;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    box-sizing: border-box;
  `;
  
  const contenido = document.createElement('div');
  contenido.style.cssText = `
    background: white;
    padding: 30px;
    border-radius: 12px;
    max-width: 90%;
    max-height: 90%;
    overflow-y: auto;
    position: relative;
  `;
  
  const fechaHora = new Date().toLocaleString('es-CO');
  contenido.innerHTML = `
    <h2 style="color: #008751; text-align: center;">📊 Datos Exportados</h2>
    <p style="text-align: center; color: #666;">Generado el: ${fechaHora}</p>
    <div style="background: #e6f2ee; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
      <strong>📱 Para iPad:</strong> Selecciona todo el texto de abajo, cópialo y pégalo en la app Notas
    </div>
    <textarea readonly style="width: 100%; height: 300px; font-family: monospace; font-size: 12px; padding: 10px; border: 1px solid #ccc; border-radius: 6px;">${datos}</textarea>
    <div style="text-align: center; margin-top: 20px;">
      <button onclick="this.parentElement.parentElement.parentElement.remove()" style="background: #008751; color: white; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer;">Cerrar</button>
    </div>
  `;
  
  modal.appendChild(contenido);
  document.body.appendChild(modal);
}

function exportarTradicional(datos) {
  // Método tradicional para navegadores de escritorio
  const blob = new Blob([datos], { type: "application/json" });
  const a = document.createElement("a");
  const url = window.URL.createObjectURL(blob);

  a.href = url;
  a.setAttribute("download", "modulo4_registros.json");
  a.style.display = "none";

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

// Función adicional para compartir (API nativa de iOS si está disponible)
async function compartirDatos() {
  console.log("🟡 Intentando compartir datos...");
  const request = indexedDB.open("registrosDB", 1);

  request.onsuccess = async function (event) {
    const db = event.target.result;
    const tx = db.transaction("registros", "readonly");
    const store = tx.objectStore("registros");
    const getAll = store.getAll();

    getAll.onsuccess = async function () {
      const registros = getAll.result;
      if (!registros || registros.length === 0) {
        alert("⚠ No hay registros para compartir.");
        return;
      }

      const datos = JSON.stringify(registros, null, 2);
      const fechaHora = new Date().toLocaleString('es-CO').replace(/[/:]/g, '-');
      
      if (navigator.share) {
        try {
          await navigator.share({
            title: 'Módulo 4 - Registros',
            text: `Exportación de datos - ${fechaHora}\n\n${datos}`,
          });
        } catch (err) {
          console.log('Error al compartir:', err);
          exportarDatos(); // Fallback al método principal
        }
      } else {
        exportarDatos(); // Fallback si no hay API de compartir
      }
    };
  };
}

// Hacer las funciones globales
window.exportarDatos = exportarDatos;
window.compartirDatos = compartirDatos;