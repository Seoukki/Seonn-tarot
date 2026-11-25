// Kategori permasalahan + kamus kata kunci untuk deteksi TANPA AI.
// Deteksi hanya mencocokkan kata kunci dan frasa — bukan memahami konteks cerita.
// Bobot: strong = 3, normal = 2, weak = 1, phrases = 3 (frasa lebih spesifik).
// Semua kata sudah dalam bentuk ternormalisasi (huruf kecil, tanpa tanda baca/diakritik).

export const CATEGORIES = [
  {
    id: 'relationship',
    label: 'Relationship',
    title: 'Percintaan',
    description: 'Hubungan romantis: pasangan, gebetan, mantan, komitmen, dan perasaan di antara dua orang.',
    strong: [
      'pacar', 'pasangan', 'kekasih', 'gebetan', 'mantan', 'suami', 'istri', 'tunangan', 'jodoh',
      'pacaran', 'selingkuh', 'perselingkuhan', 'cinta', 'pernikahan', 'menikah', 'nikah', 'cemburu',
      'pdkt', 'jadian', 'ldr', 'kencan', 'taaruf', 'naksir', 'balikan', 'bucin',
      'boyfriend', 'girlfriend', 'husband', 'wife', 'crush', 'dating', 'breakup', 'marriage', 'lover',
    ],
    normal: [
      'sayang', 'rindu', 'kangen', 'romantis', 'setia', 'kesetiaan', 'komitmen', 'cerai', 'perceraian',
      'berpisah', 'putus', 'ghosting', 'baper', 'doi', 'calon', 'relationship', 'partner', 'love',
    ],
    weak: ['hubungan', 'dekat', 'perasaan', 'chat', 'dibalas'],
    phrases: [
      'putus cinta', 'jatuh cinta', 'kembali ke mantan', 'hubungan jarak jauh', 'pasangan hidup',
      'orang yang aku suka', 'suka sama dia', 'dia tidak membalas', 'tidak dibalas', 'calon suami',
      'calon istri', 'hubungan kami', 'dia berubah',
    ],
  },
  {
    id: 'friendship',
    label: 'Friendship',
    title: 'Pertemanan',
    description: 'Teman dan sahabat, lingkaran sosial, komunitas, serta dinamika persahabatan.',
    strong: [
      'teman', 'sahabat', 'pertemanan', 'persahabatan', 'tongkrongan', 'nongkrong', 'geng', 'circle',
      'friend', 'friends', 'friendship', 'bestfriend', 'buddy', 'squad',
    ],
    normal: [
      'dijauhi', 'menjauh', 'musuhan', 'bertengkar', 'reuni', 'komunitas', 'kelompok', 'grup',
      'kesepian', 'renggang', 'diabaikan', 'kecewa', 'undangan', 'sepi',
    ],
    weak: ['kami', 'kita', 'bareng', 'bersama'],
    phrases: [
      'teman dekat', 'sahabat lama', 'teman lama', 'lingkaran pertemanan', 'grup teman',
      'mulai menjauh', 'dijauhi teman', 'teman kuliah', 'teman sekolah', 'teman kerja', 'teman satu geng',
    ],
  },
  {
    id: 'career',
    label: 'Career',
    title: 'Karier',
    description: 'Pekerjaan, studi, bisnis, jalur profesional, dan hubungan di tempat kerja atau kampus.',
    strong: [
      'kerja', 'pekerjaan', 'karier', 'karir', 'kantor', 'bos', 'atasan', 'rekan', 'kolega', 'promosi',
      'resign', 'phk', 'wawancara', 'interview', 'magang', 'perusahaan', 'jabatan', 'profesi',
      'freelance', 'karyawan', 'pegawai', 'lembur', 'deadline', 'kontrak',
      'job', 'career', 'boss', 'office', 'promotion', 'colleague', 'workplace',
    ],
    normal: [
      'bisnis', 'usaha', 'proyek', 'kuliah', 'skripsi', 'tesis', 'jurusan', 'dosen', 'kampus', 'sekolah',
      'ujian', 'lulus', 'ipk', 'beasiswa', 'burnout', 'gaji', 'cv', 'lamaran', 'startup', 'bekerja',
      'rapat', 'klien', 'client', 'business', 'work',
    ],
    weak: ['target', 'tugas', 'belajar', 'ambisi'],
    phrases: [
      'rekan kerja', 'lamaran kerja', 'mengundurkan diri', 'pindah kerja', 'ganti kerja', 'cari kerja',
      'dapat kerja', 'kehilangan pekerjaan', 'naik jabatan', 'wawancara kerja', 'dunia kerja',
      'tempat kerja', 'jalur karier', 'mau resign', 'dunia kuliah',
    ],
  },
  {
    id: 'finance',
    label: 'Finance',
    title: 'Keuangan',
    description: 'Uang, tabungan, utang, pengeluaran, penghasilan, dan rasa aman secara finansial.',
    strong: [
      'uang', 'keuangan', 'utang', 'tabungan', 'investasi', 'saham', 'kripto', 'pinjaman', 'pinjol',
      'tagihan', 'bangkrut', 'pengeluaran', 'pemasukan', 'penghasilan', 'pendapatan', 'cicilan',
      'finansial', 'dompet', 'kredit', 'boros', 'hemat', 'modal',
      'money', 'debt', 'finance', 'financial', 'savings', 'invest', 'salary', 'budget', 'loan',
    ],
    normal: [
      'gaji', 'biaya', 'dana', 'rugi', 'untung', 'bayar', 'harga', 'rezeki', 'bonus', 'thr',
      'ekonomi', 'kaya', 'miskin', 'cuan', 'saldo', 'bills',
    ],
    weak: ['beli', 'mahal', 'murah', 'cukup'],
    phrases: [
      'gaji bulanan', 'kartu kredit', 'uang tabungan', 'dana darurat', 'tidak cukup uang',
      'kesulitan keuangan', 'pinjaman online', 'bayar cicilan', 'kondisi keuangan', 'keuangan keluarga',
      'uang bulanan', 'bayar utang',
    ],
  },
  {
    id: 'family',
    label: 'Family',
    title: 'Keluarga',
    description: 'Orang tua, saudara, anak, rumah tangga, dan dinamika di dalam keluarga.',
    strong: [
      'keluarga', 'ayah', 'ibu', 'bapak', 'papa', 'mama', 'ortu', 'orangtua', 'kakak', 'adik', 'saudara',
      'anak', 'mertua', 'nenek', 'kakek', 'paman', 'bibi', 'tante', 'sepupu', 'warisan', 'ipar',
      'family', 'mother', 'father', 'parents', 'sister', 'brother', 'son', 'daughter',
    ],
    normal: ['rumah', 'pulang', 'kampung', 'cucu', 'keponakan', 'rumahtangga', 'bunda', 'ayahanda', 'ibunda'],
    weak: ['dirumah', 'pengasuhan'],
    phrases: [
      'orang tua', 'keluarga besar', 'rumah tangga', 'anak anak', 'adik kakak', 'kakak adik',
      'orang tuaku', 'keluarga kecil', 'pulang kampung', 'mengurus anak',
    ],
  },
  {
    id: 'self-discovery',
    label: 'Self-discovery',
    title: 'Mengenal Diri',
    description: 'Jati diri, perasaan terdalam, intuisi, makna hidup, dan hubungan dengan diri sendiri.',
    strong: [
      'identitas', 'insecure', 'minder', 'overthinking', 'introspeksi', 'refleksi', 'spiritual', 'batin',
      'jiwa', 'intuisi', 'hampa', 'cemas', 'anxiety', 'stres', 'emosi', 'trauma', 'passion', 'panggilan',
      'identity', 'purpose', 'meaning', 'lonely', 'empty',
    ],
    normal: [
      'sendirian', 'kosong', 'tersesat', 'mental', 'perasaanku', 'sensitif', 'lelah', 'capek', 'bimbang',
      'galau', 'bingung', 'ragu', 'jujur', 'diriku', 'kepribadian', 'ketakutan', 'takut',
    ],
    weak: ['merasa', 'sedih', 'entah', 'tenang'],
    phrases: [
      'jati diri', 'diri sendiri', 'siapa diriku', 'siapa aku', 'makna hidup', 'tujuan hidup',
      'kehilangan arah', 'merasa kosong', 'tidak percaya diri', 'rendah diri', 'mengenal diri',
      'cinta diri', 'nilai diri', 'merasa tersesat', 'tidak tahu apa yang aku mau', 'self love',
      'self worth', 'bingung dengan diri',
    ],
  },
  {
    id: 'personal-growth',
    label: 'Personal Growth',
    title: 'Pertumbuhan Diri',
    description: 'Kebiasaan, disiplin, penyembuhan, keterampilan, dan proses menjadi versi diri yang lebih baik.',
    strong: [
      'berkembang', 'pertumbuhan', 'kebiasaan', 'disiplin', 'produktif', 'produktivitas', 'motivasi',
      'habit', 'bangkit', 'healing', 'sembuh', 'mindset', 'skill', 'potensi', 'kemajuan', 'evaluasi',
      'prokrastinasi', 'malas', 'growth', 'improve', 'discipline', 'motivation',
    ],
    normal: [
      'belajar', 'berubah', 'perubahan', 'target', 'tujuan', 'kemampuan', 'latihan', 'konsisten',
      'pulih', 'maju', 'meningkat', 'bertumbuh', 'rutinitas', 'goal', 'learn',
    ],
    weak: ['lebih', 'baik', 'mulai', 'mencoba'],
    phrases: [
      'jadi lebih baik', 'menjadi lebih baik', 'ingin berubah', 'ingin berkembang', 'kebiasaan buruk',
      'kebiasaan baik', 'bangkit kembali', 'move on', 'zona nyaman', 'menunda nunda', 'tidak disiplin',
      'versi terbaik', 'proses penyembuhan',
    ],
  },
  {
    id: 'life-decisions',
    label: 'Life Decisions',
    title: 'Keputusan Hidup',
    description: 'Pilihan penting, persimpangan jalan, waktu yang tepat, dan arah hidup ke depan.',
    strong: [
      'keputusan', 'memutuskan', 'memilih', 'pilihan', 'dilema', 'persimpangan', 'merantau', 'tawaran',
      'decision', 'decide', 'choice', 'choose', 'dilemma',
    ],
    normal: [
      'pindah', 'menolak', 'menerima', 'sebaiknya', 'timing', 'langkah', 'arah', 'bertahan', 'berhenti',
      'lanjut', 'mundur', 'maju', 'jalan', 'kesempatan', 'risiko', 'nekat',
    ],
    weak: ['harus', 'bagaimana', 'apakah', 'antara', 'atau'],
    phrases: [
      'harus memilih', 'bingung memilih', 'ambil keputusan', 'mengambil keputusan', 'pilih yang mana',
      'lanjut atau berhenti', 'bertahan atau pergi', 'pergi atau bertahan', 'pindah kota', 'pindah negara',
      'menerima tawaran', 'menolak tawaran', 'di persimpangan', 'langkah selanjutnya', 'jalan mana',
      'jalan hidup', 'arah hidup', 'apa yang harus aku lakukan', 'harus bagaimana',
    ],
  },
];

export const CATEGORY_IDS = CATEGORIES.map((c) => c.id);
export const CATEGORY_BY_ID = Object.fromEntries(CATEGORIES.map((c) => [c.id, c]));

// Lensa "umum": tidak memakai interpretasi per kategori, hanya makna kartu itu sendiri.
export const GENERAL_CATEGORY = {
  id: 'general',
  label: 'General',
  title: 'Umum',
  description: 'Pembacaan tanpa fokus khusus: makna kartu apa adanya.',
};

// Kategori yang punya lensa pada pembacaan satu kartu (Daily / One Card).
export const LENS_IDS = ['general', 'relationship', 'friendship', 'career', 'finance', 'self-discovery'];

// Variasi ejaan / bahasa gaul → bentuk baku yang ada di daftar kata kunci.
export const SYNONYMS = {
  temen: 'teman', tmn: 'teman', temenan: 'pertemanan', sohib: 'sahabat', sobat: 'sahabat', kawan: 'teman',
  bestie: 'sahabat', bff: 'sahabat', sahabatan: 'persahabatan',
  bokin: 'pacar', pacarku: 'pacar', selingkuhan: 'selingkuh', ngegebet: 'gebetan', doi: 'doi',
  kerjaan: 'kerja', ngantor: 'kantor', dipecat: 'phk', pecat: 'phk', gajian: 'gaji', ngelamar: 'lamaran',
  duit: 'uang', doku: 'uang', nabung: 'tabungan', menabung: 'tabungan', ngutang: 'utang', hutang: 'utang',
  bokek: 'bangkrut', ngirit: 'hemat', investasinya: 'investasi',
  ortu: 'ortu', orgtua: 'orangtua', ayahku: 'ayah', ibuku: 'ibu', emak: 'ibu', bokap: 'ayah', nyokap: 'ibu',
  gak: 'tidak', ga: 'tidak', nggak: 'tidak', ngga: 'tidak', enggak: 'tidak', engga: 'tidak', gk: 'tidak', tak: 'tidak',
  udah: 'sudah', dah: 'sudah', sdh: 'sudah', udh: 'sudah', banget: 'sekali', bgt: 'sekali',
  gimana: 'bagaimana', gmn: 'bagaimana', bgmn: 'bagaimana', gmana: 'bagaimana',
  yg: 'yang', dr: 'dari', utk: 'untuk', krn: 'karena', tp: 'tapi', jd: 'jadi', dgn: 'dengan', sm: 'sama',
  gue: 'aku', gw: 'aku', saya: 'aku', ku: 'aku', gua: 'aku',
  bingungg: 'bingung', galauu: 'galau', overthink: 'overthinking', insekyur: 'insecure', insecurity: 'insecure',
  kuliahan: 'kuliah', skripsian: 'skripsi', ngerantau: 'merantau', rantau: 'merantau',
  mikirin: 'memikirkan', ngerasa: 'merasa', kepikiran: 'memikirkan',
};

// Frasa yang menandakan krisis / keinginan menyakiti diri. Jika ada, UI menampilkan catatan peduli.
export const SENSITIVE_PHRASES = [
  'bunuh diri', 'mengakhiri hidup', 'akhiri hidup', 'ingin mati', 'pengen mati', 'mau mati',
  'tidak ingin hidup', 'tidak mau hidup', 'lebih baik mati', 'menyakiti diri', 'melukai diri',
  'self harm', 'selfharm', 'suicide', 'kill myself', 'end my life', 'tidak sanggup hidup',
];
