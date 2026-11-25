// Mesin interpretasi: hanya data kartu + template JavaScript. Tanpa AI, tanpa penyimpanan.
// Menggabungkan kategori, kartu, posisi, orientasi, makna, dan teks kontekstual menjadi satu pembacaan.
import { SPREADS } from '../data/spreads.js';
import { CATEGORY_BY_ID } from '../data/categories.js';
import { SUIT_INFO, SUIT_LABEL } from '../data/catalog.js';
import { hashString } from './rng.js';
import { joinList } from './format.js';
import { detectCategory } from './detect.js';

const ORI_ID = { upright: 'tegak', reversed: 'terbalik' };
const pickBy = (arr, seed) => arr[hashString(seed) % arr.length];
const fill = (tpl, vars) => tpl.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');

// Kalimat pembuka per posisi (2 variasi tiap posisi).
const FRAMES = {
  daily: ['Untuk hari ini, {card} ({ori}) mengangkat tema {kw}. Jadikan itu bahan perhatian, bukan ramalan.', '{card} ({ori}) hadir sebagai pesan hari ini: perhatikan {kw} dalam keseharianmu.'],
  focus: ['Pada inti pertanyaanmu, {card} ({ori}) menyoroti {kw}.', '{card} ({ori}) menjadi fokus pembacaan ini, dengan tema {kw}.'],
  answer: ['{card} ({ori}) membawa nuansa {kw} terhadap pertanyaanmu.', 'Untuk pertanyaanmu, {card} ({ori}) menekankan {kw}.'],
  past: ['Sebagai latar belakang, {card} ({ori}) menunjukkan bahwa {kw} ikut membentuk situasi ini.', 'Di posisi masa lalu, {card} ({ori}) menggambarkan akar berupa {kw}.'],
  present: ['Pada keadaan saat ini, {card} ({ori}) menggambarkan suasana {kw}.', 'Di posisi kini, {card} ({ori}) menandakan bahwa {kw} sedang berperan besar.'],
  future: ['Sebagai kecenderungan ke depan jika arah sekarang berlanjut, {card} ({ori}) menyiratkan {kw}.', 'Di posisi mendatang, {card} ({ori}) menunjuk pada {kw}; ini kemungkinan, bukan kepastian.'],
  guidance: ['Sebagai arah yang bisa dipertimbangkan, {card} ({ori}) mengajakmu memperhatikan {kw}.', 'Di posisi guidance, {card} ({ori}) menyarankan fokus pada {kw}.'],
  self: ['Dari sisimu, {card} ({ori}) menggambarkan sikap dan perasaan yang diwarnai {kw}.', 'Pada posisi dirimu, {card} ({ori}) menunjukkan energi {kw}.'],
  other: ['Dari sisi yang lain, {card} ({ori}) menggambarkan energi {kw}. Ini gambaran simbolis, bukan pembacaan pikiran orang lain.', 'Pada posisi pihak lain, {card} ({ori}) menyiratkan nuansa {kw}; anggap ini bahan bertanya, bukan kesimpulan tentang mereka.'],
  connection: ['Pada dinamika di antara kalian, {card} ({ori}) menyoroti {kw}.', 'Untuk hubungan itu sendiri, {card} ({ori}) menggambarkan suasana {kw}.'],
  challenge: ['Sebagai tantangan, {card} ({ori}) menunjuk pada {kw} yang perlu diperhatikan.', 'Di posisi tantangan, {card} ({ori}) menandakan bahwa {kw} bisa menjadi ganjalan.'],
  support: ['Sebagai dukungan, {card} ({ori}) menunjukkan sumber daya berupa {kw}.', 'Di posisi dukungan, {card} ({ori}) menyiratkan bahwa {kw} bisa kamu andalkan.'],
  hidden: ['Pada hal yang belum kamu sadari, {card} ({ori}) menyiratkan {kw}.', 'Di posisi tersembunyi, {card} ({ori}) mengisyaratkan {kw} yang mungkin belum kamu perhatikan.'],
};

// Saran penutup per kategori & nada (positif / netral / menantang).
const CLOSERS = {
  general: ['Perhatikan hal-hal kecil yang berjalan baik hari ini dan lanjutkan; itu modal yang nyata.', 'Beri dirimu waktu mengamati sebelum menyimpulkan; tidak semua hal perlu dijawab hari ini.', 'Pilih satu hal yang bisa kamu tangani sekarang dan biarkan sisanya menunggu giliran.'],
  relationship: ['Ungkapkan perasaanmu dengan jujur dan tenang; hubungan yang sehat tumbuh dari komunikasi dua arah.', 'Beri ruang untuk mengamati dan jangan menafsirkan diam sebagai jawaban; tanyakan langsung bila perlu.', 'Utamakan kejelasan dan batas yang sehat sebelum mengambil keputusan besar tentang hubungan.'],
  friendship: ['Luangkan waktu untuk menghubungi teman yang berarti bagimu tanpa agenda tersembunyi.', 'Amati dinamika pertemanan tanpa terburu-buru menilai; terkadang jarak hanyalah fase.', 'Sampaikan ketidaknyamananmu dengan bahasa yang tenang dan jaga batas yang membuatmu nyaman.'],
  career: ['Ambil inisiatif pada peluang yang selaras dengan nilai dan kemampuanmu.', 'Kumpulkan informasi dan perkuat dasar sebelum berpindah arah; tidak ada keharusan memutuskan hari ini.', 'Prioritaskan kesehatan dan batas kerja, lalu cari dukungan atau mentor sebelum mengambil langkah besar.'],
  finance: ['Susun rencana sederhana dan konsisten; pertumbuhan yang stabil lebih awet daripada lompatan.', 'Tinjau pemasukan dan pengeluaran dengan tenang sebelum membuat komitmen finansial baru.', 'Tunda keputusan finansial besar yang impulsif dan pertimbangkan masukan dari sumber yang kompeten.'],
  family: ['Manfaatkan suasana baik untuk mempererat ikatan lewat percakapan yang hangat.', 'Dengarkan dahulu sebelum menanggapi; setiap anggota keluarga punya sudut pandangnya.', 'Pilih waktu yang tenang untuk bicara dan jaga batas yang sehat bagi dirimu sendiri.'],
  'self-discovery': ['Catat apa yang membuatmu bersemangat belakangan ini; itu petunjuk tentang dirimu.', 'Luangkan waktu hening untuk bertanya pada diri sendiri tanpa menuntut jawaban cepat.', 'Bersikaplah lembut pada diri sendiri; menyadari pola lama sudah merupakan langkah maju.'],
  'personal-growth': ['Pilih satu kebiasaan kecil yang selaras dengan arah yang kamu inginkan dan jalani konsisten.', 'Amati pola yang berulang, lalu coba satu hal berbeda dalam skala kecil.', 'Pecah tujuan menjadi langkah kecil yang bisa dijalani hari ini dan rayakan kemajuan sekecil apa pun.'],
  'life-decisions': ['Uji pilihan yang menarik dengan langkah kecil sebelum berkomitmen penuh.', 'Tuliskan untung-rugi tiap opsi dan lihat mana yang paling selaras dengan nilai-nilaimu.', 'Beri jarak sejenak, cari pandangan orang tepercaya, lalu kembali memutuskan dengan kepala yang tenang.'],
};

const band = (avg) => (avg >= 0.6 ? 0 : avg <= -0.6 ? 2 : 1);
const toneLabel = (avg) => {
  if (avg >= 1.2) return 'cukup mendukung';
  if (avg >= 0.4) return 'condong mendukung, dengan beberapa catatan';
  if (avg > -0.4) return 'seimbang antara peluang dan hal yang perlu diperhatikan';
  if (avg > -1.2) return 'menuntut kehati-hatian dan kesabaran';
  return 'cukup menantang, sehingga layak dihadapi pelan-pelan';
};

const kwText = (card, o, n = 2) => joinList((card.keywords[o] || []).slice(0, n));

const YESNO = {
  yes: { label: 'Cenderung Ya', head: 'Energi kartu ini condong mendukung' },
  no: { label: 'Cenderung Tidak', head: 'Energi kartu ini condong menyarankan menahan diri' },
  maybe: { label: 'Belum Jelas', head: 'Energi kartu ini belum condong ke satu arah' },
};

const buildYesNo = (entry, card, seed) => {
  const tone = card.tone[entry.orientation] ?? 0;
  const key = tone >= 1 ? 'yes' : tone <= -1 ? 'no' : 'maybe';
  const strength = Math.abs(tone) >= 2 ? 'kuat' : Math.abs(tone) === 1 ? 'sedang' : 'netral';
  const tail = {
    yes: ['Jika hatimu juga merasa selaras, ini bisa menjadi dukungan untuk melangkah. Tetap periksa fakta dan risikonya.', 'Gunakan ini sebagai penguat keyakinan, bukan pengganti pertimbangan matang.'],
    no: ['Pertimbangkan untuk menunda, menambah informasi, atau mencari pilihan lain sebelum melangkah.', 'Ini bukan larangan, tetapi ajakan memeriksa ulang sebelum memutuskan.'],
    maybe: ['Jawabannya mungkin tergantung pada hal yang belum kamu ketahui. Kumpulkan informasi atau jelaskan pertanyaanmu lebih spesifik.', 'Coba rumuskan ulang pertanyaan atau tunggu informasi tambahan sebelum memutuskan.'],
  }[key];
  return {
    answer: key,
    label: YESNO[key].label,
    strength,
    explanation: `${YESNO[key].head} (kekuatan: ${strength}). ${entry.name} (${ORI_ID[entry.orientation]}) bernuansa ${kwText(card, entry.orientation, 3)}. ${pickBy(tail, seed + 'yn')} Ini cermin untuk refleksi, bukan jawaban mutlak.`,
  };
};

const SENSITIVE_NOTE = 'Kamu menyebut sesuatu yang terdengar berat. Pembacaan kartu hanyalah bahan refleksi dan tidak bisa menggantikan dukungan nyata. Jika kamu merasa tidak aman atau ingin menyakiti diri sendiri, segera hubungi orang yang kamu percaya, tenaga profesional, atau layanan darurat di wilayahmu. Kamu tidak perlu menghadapinya sendirian.';

// Fungsi utama. `cardsById` berisi objek kartu penuh (lihat src/data/cards/index.js).
export const buildReading = ({ type, category, detected = null, question = '', cards }, cardsById) => {
  const spread = SPREADS[type];
  if (!spread) throw new Error('Jenis pembacaan tidak dikenal');
  const lens = category && category !== 'general' && CATEGORY_BY_ID[category] ? category : 'general';
  const catInfo = lens === 'general' ? { id: 'general', title: 'Umum', label: 'General' } : CATEGORY_BY_ID[lens];
  const seed = `${type}|${lens}|${cards.map((c) => `${c.id}:${c.orientation}`).join(',')}|${question}`;

  const entries = cards.map((c, i) => {
    const card = cardsById[c.id];
    const pos = spread.positions[i];
    const o = c.orientation;
    const kw = kwText(card, o, 2);
    const frame = pickBy(FRAMES[pos.id] || FRAMES.focus, `${seed}|${i}`);
    return {
      id: card.id,
      name: card.name,
      number: card.number,
      arcana: card.arcana,
      suit: card.suit,
      image: card.image,
      position: { id: pos.id, label: pos.label, hint: pos.hint },
      orientation: o,
      keywords: card.keywords[o],
      meaning: card.meaning[o],
      positionNote: fill(frame, { card: card.name, ori: ORI_ID[o], kw }),
      contextual: lens === 'general' ? null : card.interpretations[o][lens],
      guidance: card.guidance[o],
      tone: card.tone[o] ?? 0,
    };
  });

  const tones = entries.map((e) => e.tone);
  const avg = tones.reduce((a, b) => a + b, 0) / tones.length;
  const n = entries.length;

  // ---- Overall ----
  const overall = [];
  const focus = lens === 'general' ? '' : ` dengan fokus ${catInfo.title.toLowerCase()}`;
  const q = question ? ' untuk pertanyaan yang kamu tuliskan' : '';
  if (n === 1) {
    overall.push(`${entries[0].name} (${ORI_ID[entries[0].orientation]}) muncul${q}${focus}. ${entries[0].meaning}`);
    overall.push(`Secara keseluruhan nuansanya ${toneLabel(avg)}. Anggap ini cermin untuk melihat situasi dengan lebih jernih, bukan keputusan yang sudah tertulis.`);
  } else {
    overall.push(`Pembacaan ${spread.title}${focus} ini menampilkan ${n} kartu${q}. Secara keseluruhan nuansanya ${toneLabel(avg)}.`);
    const notes = [];
    const majors = entries.filter((e) => e.arcana === 'major').length;
    if (majors / n >= 0.5) notes.push(`${majors} dari ${n} kartu adalah Major Arcana, pertanda tema besar atau titik penting dalam perjalananmu`);
    else if (majors === 0) notes.push('tidak ada Major Arcana, jadi tema yang muncul lebih berkaitan dengan keseharian dan pilihan-pilihan kecil');
    const rev = entries.filter((e) => e.orientation === 'reversed').length;
    if (rev === n) notes.push('semua kartu terbalik, menandakan energi yang sedang terhambat, tertahan, atau berbalik ke dalam');
    else if (rev === 0) notes.push('semua kartu tegak, menandakan energi yang mengalir relatif terbuka');
    else if (rev / n >= 0.5) notes.push(`${rev} kartu terbalik, jadi sebagian energi terasa tertahan atau perlu ditinjau ulang`);
    const suits = {};
    entries.forEach((e) => { if (e.suit) suits[e.suit] = (suits[e.suit] || 0) + 1; });
    const [topSuit, topCount] = Object.entries(suits).sort((a, b) => b[1] - a[1])[0] || [];
    if (topSuit && topCount >= 2 && topCount / n >= 0.4) notes.push(`suit ${SUIT_LABEL[topSuit]} dominan (${topCount} kartu), yang berbicara tentang ${SUIT_INFO[topSuit].theme}`);
    if (notes.length) overall.push(`Pola yang terlihat: ${notes.join('; ')}.`);

    const pos = entries.filter((e) => e.tone >= 1);
    const neg = entries.filter((e) => e.tone <= -1);
    const byPos = (id) => entries.find((e) => e.position.id === id);
    const past = byPos('past'), present = byPos('present'), guide = byPos('guidance');
    if (past && present && guide) {
      overall.push(`Alurnya bergerak dari ${kwText(cardsById[past.id], past.orientation, 1)} (${past.name}), menuju ${kwText(cardsById[present.id], present.orientation, 1)} (${present.name}), lalu mengarah pada ${kwText(cardsById[guide.id], guide.orientation, 1)} (${guide.name}).`);
    }
    if (pos.length && neg.length) {
      const a = pos.sort((x, y) => y.tone - x.tone)[0];
      const b = neg.sort((x, y) => x.tone - y.tone)[0];
      overall.push(`Ada tarikan yang tampak berlawanan: ${a.name} pada posisi ${a.position.label} membawa nada yang lebih ringan, sementara ${b.name} pada posisi ${b.position.label} menyorot hal yang perlu diperhatikan. Keduanya tidak saling meniadakan; anggap saja ini dua sisi dari situasi yang sama. ${a.name} menunjukkan apa yang bisa kamu andalkan, ${b.name} menunjukkan apa yang perlu ditangani.`);
    } else if (neg.length === n) {
      overall.push('Semua kartu bernada menantang. Bukan berarti buruk, hanya mengajakmu bergerak lebih pelan dan memberi ruang bagi dirimu sendiri.');
    } else if (pos.length === n) {
      overall.push('Semua kartu bernada mendukung, tetapi tetap padukan dengan fakta dan pertimbanganmu sendiri.');
    }
  }
  if (lens === 'general' && detected && CATEGORY_BY_ID[detected]) {
    overall.push(`Cerita yang kamu tulis cenderung berkaitan dengan ${CATEGORY_BY_ID[detected].title.toLowerCase()}, jadi bacalah kartu-kartu ini dengan tema tersebut di benakmu.`);
  }

  overall.push(pickBy([
    'Bacalah kartu-kartu ini sebagai satu cerita utuh, lalu perhatikan bagian mana yang paling menggugah perasaanmu; di situlah biasanya letak pesannya.',
    'Tidak semua kartu harus terasa cocok. Ambil yang resonan denganmu dan biarkan sisanya menjadi bahan renungan.',
    'Kartu tidak menentukan hasil; kamulah yang memilih langkah berikutnya. Gunakan gambaran ini untuk melihat pilihanmu dengan lebih tenang.',
  ], seed + 'close'));

  // ---- Guidance ----
  const guidance = [];
  const guideEntry = entries.find((e) => e.position.id === 'guidance') || entries[entries.length - 1];
  guidance.push(guideEntry.guidance);
  const strongest = [...entries].filter((e) => e !== guideEntry).sort((a, b) => Math.abs(b.tone) - Math.abs(a.tone))[0];
  if (strongest && strongest.guidance !== guideEntry.guidance) guidance.push(strongest.guidance);
  guidance.push(CLOSERS[lens][band(avg)]);

  const result = {
    version: 1,
    type: spread.id,
    title: spread.title,
    rows: spread.rows,
    question,
    category: { id: catInfo.id, title: catInfo.title },
    detected,
    cards: entries,
    overall,
    guidance: [...new Set(guidance)],
    notices: [],
  };
  if (spread.id === 'yes-no') result.yesNo = buildYesNo(entries[0], cardsById[entries[0].id], seed);
  if (question && detectCategory(question).sensitive) result.notices.push(SENSITIVE_NOTE);
  return result;
};
