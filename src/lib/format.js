export const orientationLabel = (o) => (o === 'reversed' ? 'Reversed' : 'Upright');
export const orientationId = (o) => (o === 'reversed' ? 'Terbalik' : 'Tegak');

export const formatDate = (iso) => {
  try {
    return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  } catch { return ''; }
};
export const formatDateTime = (iso) => {
  try {
    return new Date(iso).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch { return ''; }
};
export const joinList = (arr) => {
  const a = arr.filter(Boolean);
  if (a.length <= 1) return a.join('');
  return `${a.slice(0, -1).join(', ')} dan ${a[a.length - 1]}`;
};
