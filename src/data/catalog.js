// Katalog kanonik 78 kartu tarot (Rider–Waite–Smith).
// Sumber tunggal untuk id, nama, nomor, arcana, dan suit.
// Isi konten (makna, interpretasi, dst.) ada di src/data/cards/*.js

export const SUITS = ['wands', 'cups', 'swords', 'pentacles'];

export const SUIT_LABEL = {
  wands: 'Wands',
  cups: 'Cups',
  swords: 'Swords',
  pentacles: 'Pentacles',
};

// Tema tiap suit — dipakai engine untuk catatan pola pada Overall Interpretation.
export const SUIT_INFO = {
  wands: { element: 'Api', theme: 'tindakan, semangat, dan dorongan berkarya' },
  cups: { element: 'Air', theme: 'perasaan, hubungan, dan dunia batin' },
  swords: { element: 'Udara', theme: 'pikiran, keputusan, dan komunikasi' },
  pentacles: { element: 'Tanah', theme: 'hal-hal nyata: pekerjaan, uang, dan kestabilan' },
};

export const MAJOR_NAMES = [
  'The Fool',
  'The Magician',
  'The High Priestess',
  'The Empress',
  'The Emperor',
  'The Hierophant',
  'The Lovers',
  'The Chariot',
  'Strength',
  'The Hermit',
  'Wheel of Fortune',
  'Justice',
  'The Hanged Man',
  'Death',
  'Temperance',
  'The Devil',
  'The Tower',
  'The Star',
  'The Moon',
  'The Sun',
  'Judgement',
  'The World',
];

export const RANKS = [
  'Ace',
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
  'Eight',
  'Nine',
  'Ten',
  'Page',
  'Knight',
  'Queen',
  'King',
];

export const COURT_RANKS = ['Page', 'Knight', 'Queen', 'King'];

export const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// card_number: Major 0–21. Minor 1–14 (Ace=1 … Ten=10, Page=11, Knight=12, Queen=13, King=14)
export const CATALOG = [
  ...MAJOR_NAMES.map((name, i) => ({
    id: slugify(name),
    name,
    number: i,
    arcana: 'major',
    suit: null,
    sort: i,
  })),
  ...SUITS.flatMap((suit, si) =>
    RANKS.map((rank, ri) => {
      const name = `${rank} of ${cap(suit)}`;
      return {
        id: slugify(name),
        name,
        number: ri + 1,
        arcana: 'minor',
        suit,
        sort: 22 + si * 14 + ri,
      };
    }),
  ),
];

export const CATALOG_BY_ID = Object.fromEntries(CATALOG.map((c) => [c.id, c]));

export const ROMAN = [
  '0', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X',
  'XI', 'XII', 'XIII', 'XIV', 'XV', 'XVI', 'XVII', 'XVIII', 'XIX', 'XX', 'XXI',
];
