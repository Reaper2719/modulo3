
export function exportarJSON(data) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'modulo3_registros.json';
  a.click();
  URL.revokeObjectURL(url);
}
