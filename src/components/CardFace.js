import { ROMAN, SUIT_LABEL } from '@/data/catalog';

// Ilustrasi kartu (SVG di /public/cards) + overlay teks HTML (angka & nama) agar font tetap tajam.
export default function CardFace({ card, reversed = false, eager = false, className = '' }) {
  const top = card.arcana === 'major' ? ROMAN[card.number] : SUIT_LABEL[card.suit];
  return (
    <div className={`tcard ${reversed ? 'is-reversed' : ''} ${className}`} style={{ '--len': card.name.length }}>
      <img src={`/cards/${card.id}.svg`} alt={`${card.name}${reversed ? ' (terbalik)' : ''}`} loading={eager ? 'eager' : 'lazy'} decoding="async" draggable="false" width="300" height="520" />
      <span className="tcard-num" aria-hidden="true">{top}</span>
      <span className="tcard-name" aria-hidden="true">{card.name}</span>
    </div>
  );
}

export function CardBack({ className = '', label = 'Punggung kartu' }) {
  return (
    <div className={`tcard ${className}`}>
      <img src="/cards/back.svg" alt={label} loading="lazy" decoding="async" draggable="false" width="300" height="520" />
    </div>
  );
}

// Kartu yang bisa dibalik (3D). `flipped` = sisi depan terlihat.
export function FlipCard({ card, reversed, flipped, onClick, disabled, label }) {
  const inner = (
    <div className={`flip ${flipped ? 'is-flipped' : ''}`}>
      <div className="flip-inner">
        <div className="flip-face"><CardBack /></div>
        <div className="flip-face flip-back"><CardFace card={card} reversed={reversed} eager /></div>
      </div>
    </div>
  );
  if (!onClick) return inner;
  return (
    <button type="button" onClick={onClick} disabled={disabled} aria-label={label} className="block w-full cursor-pointer border-0 bg-transparent p-0 disabled:cursor-default">
      {inner}
    </button>
  );
}
