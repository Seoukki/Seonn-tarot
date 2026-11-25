// Definisi jenis pembacaan (spread): jumlah kartu, posisi, tata letak, dan kategori default.
// `rows` = jumlah kartu per baris saat disusun di layar.
export const SPREADS = {
  daily: {
    id: 'daily', title: 'Daily Tarot', short: 'Satu kartu untuk hari ini.', category: 'general', lensChoice: true, rows: [1],
    positions: [{ id: 'daily', label: 'Pesan Hari Ini', hint: 'energi yang bisa kamu perhatikan hari ini' }],
  },
  'one-card': {
    id: 'one-card', title: 'One Card', short: 'Satu kartu untuk satu pertanyaan atau suasana hati.', category: 'general', lensChoice: true, rows: [1],
    positions: [{ id: 'focus', label: 'Fokus', hint: 'inti pesan untuk pertanyaanmu' }],
  },
  'three-card': {
    id: 'three-card', title: 'Three Card', short: 'Past, Present, dan Guidance.', category: 'general', lensChoice: true, rows: [3],
    positions: [
      { id: 'past', label: 'Past', hint: 'akar atau latar belakang situasi' },
      { id: 'present', label: 'Present', hint: 'keadaan yang sedang berjalan' },
      { id: 'guidance', label: 'Guidance', hint: 'arah yang bisa dipertimbangkan' },
    ],
  },
  love: {
    id: 'love', title: 'Love', short: 'Percintaan: dirimu, dia, dan hubungan di antara kalian.', category: 'relationship', rows: [2, 3],
    positions: [
      { id: 'self', label: 'Dirimu', hint: 'perasaan dan sikapmu' },
      { id: 'other', label: 'Dia', hint: 'energi dari sisi yang lain' },
      { id: 'connection', label: 'Hubungan', hint: 'dinamika di antara kalian' },
      { id: 'challenge', label: 'Tantangan', hint: 'hal yang perlu diperhatikan' },
      { id: 'guidance', label: 'Guidance', hint: 'arah yang bisa dipertimbangkan' },
    ],
  },
  friendship: {
    id: 'friendship', title: 'Friendship', short: 'Persahabatan: dirimu, mereka, dan ikatan kalian.', category: 'friendship', rows: [2, 2],
    positions: [
      { id: 'self', label: 'Dirimu', hint: 'peran dan perasaanmu' },
      { id: 'other', label: 'Temanmu', hint: 'energi dari sisi mereka' },
      { id: 'connection', label: 'Ikatan', hint: 'dinamika pertemanan' },
      { id: 'guidance', label: 'Guidance', hint: 'arah yang bisa dipertimbangkan' },
    ],
  },
  career: {
    id: 'career', title: 'Career', short: 'Karier: keadaan, tantangan, dukungan, dan arah.', category: 'career', rows: [2, 2],
    positions: [
      { id: 'present', label: 'Keadaan', hint: 'situasi kerjamu saat ini' },
      { id: 'challenge', label: 'Tantangan', hint: 'hambatan yang terasa' },
      { id: 'support', label: 'Dukungan', hint: 'sumber daya yang bisa kamu andalkan' },
      { id: 'guidance', label: 'Guidance', hint: 'langkah yang bisa dipertimbangkan' },
    ],
  },
  finance: {
    id: 'finance', title: 'Finance', short: 'Keuangan: keadaan, tantangan, dukungan, dan arah.', category: 'finance', rows: [2, 2],
    positions: [
      { id: 'present', label: 'Keadaan', hint: 'kondisi keuanganmu saat ini' },
      { id: 'challenge', label: 'Tantangan', hint: 'hal yang perlu diwaspadai' },
      { id: 'support', label: 'Dukungan', hint: 'sumber daya yang bisa kamu andalkan' },
      { id: 'guidance', label: 'Guidance', hint: 'langkah yang bisa dipertimbangkan' },
    ],
  },
  'yes-no': {
    id: 'yes-no', title: 'Yes / No', short: 'Satu kartu sebagai bahan refleksi, bukan jawaban mutlak.', category: 'general', lensChoice: false, rows: [1],
    positions: [{ id: 'answer', label: 'Jawaban Refleksi', hint: 'kecenderungan energi untuk pertanyaanmu' }],
  },
  deep: {
    id: 'deep', title: 'Deep Reading', short: 'Tujuh kartu untuk gambaran yang lebih utuh.', category: 'general', lensChoice: true, rows: [3, 1, 3],
    positions: [
      { id: 'past', label: 'Past', hint: 'akar situasi' },
      { id: 'present', label: 'Present', hint: 'keadaan saat ini' },
      { id: 'hidden', label: 'Hidden', hint: 'hal yang belum kamu sadari' },
      { id: 'challenge', label: 'Challenge', hint: 'tantangan yang perlu dihadapi' },
      { id: 'support', label: 'Support', hint: 'dukungan di sekitarmu' },
      { id: 'future', label: 'Future', hint: 'kecenderungan jika arah saat ini berlanjut' },
      { id: 'guidance', label: 'Guidance', hint: 'arah yang bisa dipertimbangkan' },
    ],
  },
  'personalized-3': {
    id: 'personalized-3', title: 'Personalized Reading', short: 'Ceritamu dibaca lewat tiga kartu.', category: 'general', rows: [3],
    positions: [
      { id: 'past', label: 'Latar Belakang', hint: 'akar dari yang kamu ceritakan' },
      { id: 'present', label: 'Keadaan Kini', hint: 'inti situasi saat ini' },
      { id: 'guidance', label: 'Guidance', hint: 'arah yang bisa dipertimbangkan' },
    ],
  },
  'personalized-5': {
    id: 'personalized-5', title: 'Personalized Reading', short: 'Ceritamu dibaca lewat lima kartu.', category: 'general', rows: [3, 2],
    positions: [
      { id: 'past', label: 'Latar Belakang', hint: 'akar dari yang kamu ceritakan' },
      { id: 'present', label: 'Keadaan Kini', hint: 'inti situasi saat ini' },
      { id: 'challenge', label: 'Tantangan', hint: 'hal yang perlu diperhatikan' },
      { id: 'support', label: 'Dukungan', hint: 'sumber daya yang bisa kamu andalkan' },
      { id: 'guidance', label: 'Guidance', hint: 'arah yang bisa dipertimbangkan' },
    ],
  },
};

export const SPREAD_IDS = Object.keys(SPREADS);

// Kartu yang tampil di halaman /reading (Personalized dipisah menjadi halamannya sendiri).
export const READING_MENU = [
  { id: 'daily', href: '/daily', icon: '☀' },
  { id: 'one-card', href: '/reading/draw?type=one-card', icon: '①' },
  { id: 'three-card', href: '/reading/draw?type=three-card', icon: '③' },
  { id: 'love', href: '/reading/draw?type=love', icon: '♡' },
  { id: 'friendship', href: '/reading/draw?type=friendship', icon: '❖' },
  { id: 'career', href: '/reading/draw?type=career', icon: '⚒' },
  { id: 'finance', href: '/reading/draw?type=finance', icon: '❂' },
  { id: 'yes-no', href: '/reading/draw?type=yes-no', icon: '⚖' },
  { id: 'deep', href: '/reading/draw?type=deep', icon: '✦' },
  { id: 'personalized', href: '/reading/personalized', icon: '✎', title: 'Personalized', short: 'Ceritakan situasimu; kartu dipilih sesuai kategori yang terdeteksi.' },
];

export const getSpread = (id) => SPREADS[id] || null;
