// Agregator data kartu: katalog (id, nama, suit) + konten Indonesia + interpretasi turunan.
// Kategori inti (relationship, friendship, career, finance, self-discovery) ditulis manual per kartu.
// Kategori family, personal-growth, life-decisions diturunkan dari kata kunci + tone memakai template di bawah.
import { CATALOG } from '../catalog.js';
import { CATEGORY_IDS } from '../categories.js';
import majorA from './major-a.js';
import majorB from './major-b.js';
import wands from './wands.js';
import cups from './cups.js';
import swords from './swords.js';
import pentacles from './pentacles.js';

const CONTENT = { ...majorA, ...majorB, ...wands, ...cups, ...swords, ...pentacles };
const DERIVED_IDS = ['family', 'personal-growth', 'life-decisions'];

const hash = (s) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
};

// Template turunan: [tone positif, netral, menantang], masing-masing 3 variasi.
const DERIVED_TEMPLATES = {
  family: [
    [
      'Dalam hubungan keluarga, {a} dan {b} menjadi nada utama. Suasananya cenderung mendukung untuk mempererat ikatan lewat obrolan yang tulus dan waktu bersama.',
      'Untuk urusan keluarga, kartu ini menonjolkan {a} serta {b}. Ini bisa menjadi saat yang baik untuk menyampaikan apresiasi atau meluruskan kesalahpahaman lama.',
      'Di lingkup keluarga, energi {a} dan {b} terasa kuat. Manfaatkan untuk membangun kebiasaan kecil yang menghangatkan rumah.',
    ],
    [
      'Di lingkup keluarga, kartu ini menyoroti {a} dan {b}. Kamu mungkin sedang berada di fase menimbang; dengarkan dulu sebelum menyimpulkan.',
      'Untuk urusan keluarga, tema {a} dan {b} muncul tanpa arah yang tegas. Amati dinamika yang ada dan beri ruang bagi setiap pihak untuk bicara.',
      'Dalam keluarga, {a} dan {b} sedang bergerak pelan. Tidak perlu terburu-buru; konsistensi kecil lebih berarti daripada keputusan besar.',
    ],
    [
      'Dalam urusan keluarga, {a} dan {b} menandakan ada hal yang perlu ditangani pelan-pelan. Pilih waktu yang tenang untuk bicara dan jaga batas yang sehat bagi dirimu.',
      'Di lingkup keluarga, kartu ini menyorot {a} serta {b}, tanda adanya ketegangan atau beban yang belum terucap. Mulailah dari mendengarkan, bukan membela diri.',
      'Untuk urusan keluarga, {a} dan {b} bisa terasa berat. Kamu tidak harus menyelesaikan semuanya sekaligus; satu percakapan jujur sudah merupakan awal.',
    ],
  ],
  'personal-growth': [
    [
      'Untuk pertumbuhan pribadi, {a} dan {b} menunjukkan momentum yang baik. Pilih satu kebiasaan kecil yang selaras dengan arah ini dan jalani secara konsisten.',
      'Dalam perjalanan berkembang, kartu ini menonjolkan {a} serta {b}. Kemajuanmu mungkin lebih besar dari yang kamu sadari; akui itu.',
      'Di jalur pertumbuhan, energi {a} dan {b} mendukung. Ini saat yang baik untuk mencoba hal baru dalam langkah yang terukur.',
    ],
    [
      'Dalam pertumbuhan pribadi, kartu ini menyoroti {a} dan {b}. Fase ini lebih tentang mengamati pola diri daripada mengejar hasil.',
      'Untuk proses berkembang, tema {a} dan {b} hadir sebagai bahan refleksi. Catat apa yang berulang, lalu pilih satu hal untuk dicoba berbeda.',
      'Di jalur pertumbuhan, {a} dan {b} bergerak pelan. Kemajuan kecil yang stabil sudah cukup.',
    ],
    [
      'Untuk pertumbuhan pribadi, {a} dan {b} menunjuk pada pola lama yang perlu dilihat dengan jujur. Bersikaplah lembut pada diri sendiri sambil tetap mencoba satu perubahan kecil.',
      'Dalam proses berkembang, kartu ini menyorot {a} serta {b} sebagai hambatan yang bisa dipelajari. Hambatan bukan vonis; ia petunjuk bagian mana yang perlu perhatian.',
      'Di jalur pertumbuhan, {a} dan {b} terasa menantang. Pecah tujuan menjadi langkah yang cukup kecil untuk dijalani hari ini.',
    ],
  ],
  'life-decisions': [
    [
      'Untuk keputusan hidup, {a} dan {b} memberi sinyal yang cukup mendukung. Tetap timbang risikonya, lalu ambil langkah yang bisa kamu pertanggungjawabkan.',
      'Dalam menimbang pilihan, kartu ini menonjolkan {a} serta {b}. Pilihan yang selaras dengan nilai-nilaimu cenderung terasa lebih mantap.',
      'Di persimpangan keputusan, energi {a} dan {b} terasa terbuka. Uji dulu dengan langkah kecil sebelum komitmen besar.',
    ],
    [
      'Untuk keputusan hidup, kartu ini menyoroti {a} dan {b}. Belum ada dorongan yang tegas, jadi kumpulkan informasi dan beri waktu untuk berpikir.',
      'Dalam menimbang pilihan, tema {a} dan {b} muncul seimbang. Tuliskan untung-rugi tiap opsi dan lihat mana yang paling selaras denganmu.',
      'Di persimpangan keputusan, {a} dan {b} menandakan fase menimbang. Tidak memutuskan hari ini pun bisa menjadi keputusan yang sah.',
    ],
    [
      'Untuk keputusan hidup, {a} dan {b} mengingatkan agar tidak tergesa-gesa. Periksa ulang asumsimu dan cari pandangan dari orang yang kamu percaya.',
      'Dalam menimbang pilihan, kartu ini menyorot {a} serta {b} sebagai hal yang perlu dipertimbangkan lebih matang sebelum melangkah.',
      'Di persimpangan keputusan, {a} dan {b} terasa berat. Beri jarak sejenak, lalu kembali dengan kepala yang lebih tenang.',
    ],
  ],
};

export const deriveInterpretation = (card, orientation, catId) => {
  const kws = card.keywords[orientation] || [];
  const a = kws[0] || 'tema kartu ini';
  const b = kws[1] || kws[0] || 'refleksi';
  const tone = card.tone[orientation] ?? 0;
  const band = tone >= 1 ? 0 : tone <= -1 ? 2 : 1;
  const variants = DERIVED_TEMPLATES[catId][band];
  const pick = variants[hash(`${card.id}|${orientation}|${catId}`) % variants.length];
  return pick.replaceAll('{a}', a).replaceAll('{b}', b);
};

const completeInterpretations = (card) => {
  for (const o of ['upright', 'reversed']) {
    card.interpretations[o] = card.interpretations[o] || {};
    for (const cid of DERIVED_IDS) {
      if (!card.interpretations[o][cid]) card.interpretations[o][cid] = deriveInterpretation(card, o, cid);
    }
  }
  return card;
};

export const buildLocalCards = () => {
  const out = {};
  for (const base of CATALOG) {
    const c = CONTENT[base.id];
    if (!c) throw new Error(`Konten kartu hilang: ${base.id}`);
    out[base.id] = completeInterpretations({
      ...base,
      image: `/cards/${base.id}.svg`,
      keywords: { ...c.keywords },
      meaning: { ...c.meaning },
      description: c.description,
      guidance: { ...c.guidance },
      tone: { ...c.tone },
      categories: [...c.categories],
      interpretations: { upright: { ...c.interpretations.upright }, reversed: { ...c.interpretations.reversed } },
    });
  }
  return out;
};

export const LOCAL_CARDS = buildLocalCards();
export const LOCAL_CARD_LIST = CATALOG.map((c) => LOCAL_CARDS[c.id]);
export { DERIVED_IDS, CATEGORY_IDS };

// Memetakan baris Supabase menjadi bentuk kartu yang sama dengan LOCAL_CARDS.
// Kolom yang kosong/hilang di DB selalu diisi dari data lokal sehingga aplikasi tetap utuh.
export const fromDbRows = ({ cards = [], links = [], templates = [] }) => {
  const out = {};
  const byCard = new Map();
  for (const l of links) { if (!byCard.has(l.card_id)) byCard.set(l.card_id, []); byCard.get(l.card_id).push(l); }
  const tplMap = new Map();
  for (const t of templates) tplMap.set(`${t.card_id}|${t.orientation}|${t.category_id}`, t.interpretation);

  for (const base of CATALOG) {
    const loc = LOCAL_CARDS[base.id];
    const row = cards.find((r) => r.id === base.id);
    if (!row) { out[base.id] = loc; continue; }
    const arr = (v, fb) => (Array.isArray(v) && v.length ? v : fb);
    const tone = (v, fb) => (Number.isInteger(v) && v >= -2 && v <= 2 ? v : fb);
    const card = {
      ...loc,
      name: row.name || loc.name,
      keywords: { upright: arr(row.keywords_upright, loc.keywords.upright), reversed: arr(row.keywords_reversed, loc.keywords.reversed) },
      meaning: { upright: row.meaning_upright || loc.meaning.upright, reversed: row.meaning_reversed || loc.meaning.reversed },
      description: row.description || loc.description,
      guidance: { upright: row.guidance_upright || loc.guidance.upright, reversed: row.guidance_reversed || loc.guidance.reversed },
      tone: { upright: tone(row.tone_upright, loc.tone.upright), reversed: tone(row.tone_reversed, loc.tone.reversed) },
      categories: byCard.has(base.id)
        ? byCard.get(base.id).sort((x, y) => (y.weight ?? 0) - (x.weight ?? 0)).map((l) => l.category_id).filter((id) => CATEGORY_IDS.includes(id))
        : loc.categories,
      interpretations: { upright: {}, reversed: {} },
    };
    for (const o of ['upright', 'reversed']) {
      for (const cid of CATEGORY_IDS) {
        card.interpretations[o][cid] = tplMap.get(`${base.id}|${o}|${cid}`) || loc.interpretations[o][cid];
      }
    }
    out[base.id] = card;
  }
  return out;
};
