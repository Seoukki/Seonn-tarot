// Pemanggil /api/interpret dari browser.
export const requestReading = async (payload) => {
  let res;
  try {
    res = await fetch('/api/interpret', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
  } catch {
    throw new Error('Tidak bisa terhubung ke server. Periksa koneksimu lalu coba lagi.');
  }
  let data = null;
  try { data = await res.json(); } catch { /* abaikan */ }
  if (!res.ok || !data?.reading) throw new Error(data?.error || 'Gagal menyusun pembacaan. Coba lagi.');
  return data.reading;
};
