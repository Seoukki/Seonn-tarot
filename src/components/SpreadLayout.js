'use client';
// Menyusun item dalam baris-baris sesuai definisi spread (rows), mis. [3,1,3].
const WIDTH = { 1: 'w-[min(52vw,190px)]', 2: 'w-[min(36vw,150px)]', 3: 'w-[min(27vw,128px)]' };

export default function SpreadLayout({ rows, items, className = '' }) {
  let idx = 0;
  const max = Math.max(...rows);
  const w = WIDTH[Math.min(max, 3)] || WIDTH[3];
  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      {rows.map((count, r) => {
        const slice = items.slice(idx, idx + count);
        idx += count;
        return (
          <div key={r} className="flex justify-center gap-3 sm:gap-5">
            {slice.map((it, i) => (
              <div key={i} className={`${w} shrink-0`}>{it}</div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
