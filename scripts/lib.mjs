// Pustaka ilustrasi SVG orisinal bergaya cetak vintage (terinspirasi ikonografi klasik Rider–Waite–Smith).
// Kanvas kartu 300×520. Jendela gambar: x14–286, y34–468. Pita atas/bawah dikosongkan untuk teks HTML.
export const W = 300, H = 520, CX = 150;
export const WIN = { x: 14, y: 34, w: 272, h: 434 };

export const C = {
  ink: '#2a1a10', cream: '#f0e4c4', paper: '#e9d9ae', yellow: '#e3bc54', yellowLight: '#f0d27a',
  gold: '#c79b3b', goldDark: '#97721f', red: '#a53f2d', redDark: '#74291d', orange: '#c9702f', pink: '#d99a86',
  olive: '#6d6c34', oliveDark: '#4b4a24', green: '#7f9446', blue: '#4b7595', blueLight: '#a5c0c9', blueDark: '#2d4f69',
  brown: '#7b4e2c', brownDark: '#4a301d', tan: '#c9a26a', skin: '#e8be94', skinShade: '#c99466', white: '#f6efdc',
  grey: '#8d8c82', greyDark: '#55534d', charcoal: '#2b2724', plum: '#6d4b6a', black: '#1c1612',
};

const f = (n) => Math.round(n * 10) / 10;
const rad = (d) => (d * Math.PI) / 180;

// ---------- primitif ----------
export const path = (d, fill = C.paper, o = {}) =>
  `<path d="${d}" fill="${fill}"${o.stroke === 'none' ? '' : ` stroke="${o.stroke || C.ink}" stroke-width="${o.sw ?? 1.8}" stroke-linejoin="round" stroke-linecap="round"`}${o.opacity !== undefined ? ` opacity="${o.opacity}"` : ''}/>`;
export const circle = (cx, cy, r, fill = C.paper, o = {}) =>
  `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" fill="${fill}"${o.stroke === 'none' ? '' : ` stroke="${o.stroke || C.ink}" stroke-width="${o.sw ?? 1.8}"`}${o.opacity !== undefined ? ` opacity="${o.opacity}"` : ''}/>`;
export const ellipse = (cx, cy, rx, ry, fill = C.paper, o = {}) =>
  `<ellipse cx="${f(cx)}" cy="${f(cy)}" rx="${f(rx)}" ry="${f(ry)}" fill="${fill}"${o.stroke === 'none' ? '' : ` stroke="${o.stroke || C.ink}" stroke-width="${o.sw ?? 1.8}"`}/>`;
export const rect = (x, y, w, h, fill = C.paper, o = {}) =>
  `<rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}"${o.rx ? ` rx="${o.rx}"` : ''} fill="${fill}"${o.stroke === 'none' ? '' : ` stroke="${o.stroke || C.ink}" stroke-width="${o.sw ?? 1.8}"`}/>`;
export const poly = (pts, fill = C.paper, o = {}) => path('M' + pts.map((p) => `${f(p[0])},${f(p[1])}`).join('L') + 'Z', fill, o);
export const line = (x1, y1, x2, y2, o = {}) =>
  `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke="${o.stroke || C.ink}" stroke-width="${o.sw ?? 1.8}" stroke-linecap="round"/>`;
export const g = (inner, t = '') => `<g${t ? ` transform="${t}"` : ''}>${inner}</g>`;
export const at = (x = 0, y = 0, s = 1, rot = 0, flip = false) =>
  `translate(${f(x)} ${f(y)})${rot ? ` rotate(${f(rot)})` : ''} scale(${flip ? -s : s} ${s})`;
// gabungan lingkaran dengan satu kontur luar (awan, semak, rambut)
export const blob = (cs, fill = C.white, sw = 1.8) =>
  cs.map(([x, y, r]) => circle(x, y, r, fill, { sw: sw * 2, stroke: C.ink })).join('') +
  cs.map(([x, y, r]) => circle(x, y, r, fill, { stroke: 'none' })).join('');
export const hatch = (d, op = 0.3) => `<path d="${d}" fill="url(#hatch)" opacity="${op}" stroke="none"/>`;

// ---------- latar ----------
export const bg = (fill = C.yellow) => rect(WIN.x - 2, WIN.y - 2, WIN.w + 4, WIN.h + 4, fill, { stroke: 'none' });
export const band = (y, h, fill) => rect(WIN.x - 2, y, WIN.w + 4, h, fill, { stroke: 'none' });
export function hills(y, fill = C.olive, amp = 14, ph = 0, o = {}) {
  let d = `M10,${f(y)}`;
  for (let x = 10; x <= 290; x += 70) d += ` Q${x + 35},${f(y - amp * (((x / 70 + ph) | 0) % 2 ? -0.6 : 1))} ${x + 70},${f(y)}`;
  return path(d + ' L290,480 L10,480Z', fill, o);
}
export const ground = (y, fill = C.olive) => rect(WIN.x - 2, y, WIN.w + 4, 480 - y, fill, { stroke: C.ink });
export function water(y, h, fill = C.blue) {
  let w = rect(WIN.x - 2, y, WIN.w + 4, h, fill, { stroke: 'none' });
  for (let r = 0; r < h / 14; r++) for (let x = 20 + (r % 2) * 18; x < 290; x += 36)
    w += path(`M${x},${f(y + 8 + r * 14)} q6,-5 12,0 q6,5 12,0`, 'none', { stroke: C.blueLight, sw: 1.2 });
  return w;
}
export function mountain(x, base, w, h, fill = C.greyDark, snow = true) {
  let s = poly([[x - w / 2, base], [x, base - h], [x + w / 2, base]], fill);
  if (snow) s += poly([[x - w * 0.14, base - h * 0.74], [x, base - h], [x + w * 0.14, base - h * 0.74], [x + w * 0.05, base - h * 0.68], [x - w * 0.03, base - h * 0.74]], C.white, { sw: 1.2 });
  return s;
}
export const cloud = (x, y, s = 1, fill = C.white) => blob([[x, y, 10 * s], [x + 12 * s, y - 6 * s, 12 * s], [x + 26 * s, y - 1 * s, 10 * s], [x + 13 * s, y + 4 * s, 11 * s]], fill, 1.4);
export const checkerFloor = (y, h, c1 = C.cream, c2 = C.brownDark) => {
  let o = '';
  for (let r = 0; r < h / 16; r++) for (let c = 0; c < 18; c++) o += rect(10 + c * 16 + 0, y + r * 16, 16, 16, (r + c) % 2 ? c1 : c2, { sw: 0.8 });
  return o;
};

// ---------- benda langit ----------
export function sun(cx, cy, r = 22, o = {}) {
  const n = o.rays ?? 16;
  let out = '';
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2, a1 = a - 0.18 * (Math.PI * 2) / n * 1.4, a2 = a + 0.18 * (Math.PI * 2) / n * 1.4;
    const r2 = r * (i % 2 ? 1.5 : 1.85);
    out += poly([[cx + r * 1.05 * Math.cos(a1), cy + r * 1.05 * Math.sin(a1)], [cx + r2 * Math.cos(a), cy + r2 * Math.sin(a)], [cx + r * 1.05 * Math.cos(a2), cy + r * 1.05 * Math.sin(a2)]], i % 2 ? C.yellow : C.orange, { sw: 1.2 });
  }
  out += circle(cx, cy, r, C.yellowLight);
  if (o.face !== false) out += circle(cx - r * 0.35, cy - r * 0.1, r * 0.07, C.ink, { stroke: 'none' }) + circle(cx + r * 0.35, cy - r * 0.1, r * 0.07, C.ink, { stroke: 'none' }) + path(`M${f(cx - r * 0.3)},${f(cy + r * 0.35)} q${f(r * 0.3)},${f(r * 0.2)} ${f(r * 0.6)},0`, 'none', { sw: 1.4 });
  return out;
}
export const crescent = (cx, cy, r = 16, fill = C.cream, flip = false) =>
  g(path(`M0,${-r} A${r},${r} 0 0 0 0,${r} A${f(r * 0.62)},${r} 0 0 1 0,${-r}Z`, fill), at(cx, cy, 1, 0, flip));
export const moon = (cx, cy, r = 18, fill = C.cream) => circle(cx, cy, r, fill) + circle(cx - r * 0.3, cy - r * 0.2, r * 0.18, C.paper, { stroke: 'none', opacity: 0.7 });
export function star(cx, cy, r = 8, o = {}) {
  const n = o.n ?? 5, inner = o.inner ?? 0.45, pts = [];
  for (let i = 0; i < n * 2; i++) { const a = rad(-90 + (i * 180) / n), rr = i % 2 ? r * inner : r; pts.push([cx + rr * Math.cos(a), cy + rr * Math.sin(a)]); }
  return poly(pts, o.fill ?? C.yellowLight, { sw: o.sw ?? 1.2 });
}
export function starfield(seedN = 1, count = 14, y0 = 40, y1 = 200, fill = C.yellowLight) {
  let o = '', s = seedN * 9301 + 49297;
  const rnd = () => ((s = (s * 9301 + 49297) % 233280) / 233280);
  for (let i = 0; i < count; i++) o += star(20 + rnd() * 260, y0 + rnd() * (y1 - y0), 2.5 + rnd() * 4, { n: 4, inner: 0.4, fill, sw: 0.6 });
  return o;
}

// ---------- alam & arsitektur ----------
export const tree = (x, y, s = 1, fill = C.olive) =>
  rect(x - 3 * s, y - 24 * s, 6 * s, 24 * s, C.brown, { sw: 1.4 }) + blob([[x, y - 38 * s, 13 * s], [x - 11 * s, y - 28 * s, 10 * s], [x + 11 * s, y - 28 * s, 10 * s]], fill, 1.4);
export const pine = (x, y, s = 1, fill = C.oliveDark) =>
  rect(x - 2 * s, y - 8 * s, 4 * s, 8 * s, C.brown, { sw: 1.2 }) + poly([[x - 14 * s, y - 8 * s], [x, y - 40 * s], [x + 14 * s, y - 8 * s]], fill, { sw: 1.4 }) + poly([[x - 11 * s, y - 24 * s], [x, y - 52 * s], [x + 11 * s, y - 24 * s]], fill, { sw: 1.4 });
export function flower(x, y, s = 1, petal = C.white, center = C.yellow) {
  let o = line(x, y, x, y + 14 * s, { stroke: C.oliveDark, sw: 1.4 });
  for (let i = 0; i < 5; i++) { const a = rad(i * 72 - 90); o += circle(x + 5 * s * Math.cos(a), y + 5 * s * Math.sin(a), 3.4 * s, petal, { sw: 1 }); }
  return o + circle(x, y, 2.6 * s, center, { sw: 1 });
}
export const rose = (x, y, s = 1, col = C.red) => circle(x, y, 5 * s, col, { sw: 1.2 }) + path(`M${f(x - 2 * s)},${f(y)} q${2 * s},-${3 * s} ${4 * s},0`, 'none', { stroke: C.redDark, sw: 1 });
export const sunflower = (x, y, s = 1) => {
  let o = line(x, y, x, y + 40 * s, { stroke: C.oliveDark, sw: 2 });
  for (let i = 0; i < 12; i++) { const a = rad(i * 30); o += ellipse(x + 9 * s * Math.cos(a), y + 9 * s * Math.sin(a), 4.6 * s, 2.4 * s, C.yellow, { sw: 0.9 }).replace('/>', ` transform="rotate(${i * 30} ${f(x + 9 * s * Math.cos(a))} ${f(y + 9 * s * Math.sin(a))})"/>`); }
  return o + circle(x, y, 6 * s, C.brownDark, { sw: 1.2 });
};
export const grass = (x, y, n = 5) => Array.from({ length: n }, (_, i) => path(`M${x + i * 6},${y} q-2,-8 -${i % 2 ? 4 : 1},-14`, 'none', { stroke: C.oliveDark, sw: 1.4 })).join('');
export const pillar = (x, y, w = 26, h = 200, fill = C.cream) =>
  rect(x - w / 2, y, w, h, fill) + rect(x - w / 2 - 4, y - 8, w + 8, 10, fill, { sw: 1.6 }) + rect(x - w / 2 - 4, y + h - 4, w + 8, 10, fill, { sw: 1.6 }) +
  [-0.25, 0.25].map((k) => line(x + w * k, y + 4, x + w * k, y + h - 6, { stroke: C.paper, sw: 1.2 })).join('');
export const curtain = (x1, x2, y1, y2, fill = C.red) => {
  let d = `M${x1},${y1} L${x2},${y1} L${x2},${y2}`, n = Math.max(2, Math.round((x2 - x1) / 22)), w = (x2 - x1) / n;
  for (let i = n; i > 0; i--) d += ` q${-w / 2},12 ${-w},0`;
  let o = path(d + 'Z', fill);
  for (let i = 1; i < n; i++) o += line(x1 + i * w, y1 + 2, x1 + i * w, y2 - 4, { stroke: C.redDark, sw: 1.2 });
  return o;
};
export const tower = (x, y, w = 40, h = 90, fill = C.paper) => {
  let o = rect(x - w / 2, y - h, w, h, fill);
  for (let i = 0; i < 4; i++) o += rect(x - w / 2 + i * (w / 4) + 1, y - h - 8, w / 4 - 2, 9, fill, { sw: 1.4 });
  return o + rect(x - 4, y - h * 0.6, 8, 14, C.charcoal, { sw: 1.2 }) + rect(x - 6, y - 16, 12, 16, C.brownDark, { sw: 1.2 });
};
export const castle = (x, y, s = 1) => g(tower(-22, 0, 22, 44, C.paper) + tower(0, 0, 26, 56, C.tan) + tower(24, 0, 20, 40, C.paper) + rect(-34, -12, 70, 12, C.paper, { sw: 1.4 }), at(x, y, s));
export const throne = (cx, y, w = 70, h = 120, fill = C.brown) =>
  rect(cx - w / 2, y - h, w, h, fill) + rect(cx - w / 2 - 8, y - h * 0.5, 10, h * 0.5, C.brownDark, { sw: 1.6 }) + rect(cx + w / 2 - 2, y - h * 0.5, 10, h * 0.5, C.brownDark, { sw: 1.6 }) +
  poly([[cx - w / 2, y - h], [cx - w / 4, y - h - 14], [cx, y - h], [cx + w / 4, y - h - 14], [cx + w / 2, y - h]], fill, { sw: 1.6 });
export const wall = (y, h = 60, fill = C.red) => {
  let o = rect(WIN.x - 2, y, WIN.w + 4, h, fill);
  for (let r = 0; r < h / 12; r++) for (let x = (r % 2) * 14 - 14; x < 290; x += 28) o += rect(x, y + r * 12, 28, 12, fill, { sw: 0.9 });
  return o;
};
export const halo = (x, y, r = 16, col = C.yellowLight) => circle(x, y, r, 'none', { stroke: C.goldDark, sw: 2.4 }) + circle(x, y, r - 2.4, 'none', { stroke: col, sw: 2.2 });
export const crown = (x, y, s = 1, col = C.gold) => poly([[x - 9 * s, y], [x - 10 * s, y - 10 * s], [x - 4 * s, y - 5 * s], [x, y - 12 * s], [x + 4 * s, y - 5 * s], [x + 10 * s, y - 10 * s], [x + 9 * s, y]], col, { sw: 1.4 });
export const wings = (x, y, s = 1, col = C.white, flip = false) =>
  g(path('M0,0 C-14,-26 -48,-44 -74,-34 C-62,-26 -66,-14 -56,-8 C-60,4 -44,8 -34,10 C-26,18 -12,12 0,8Z', col) + path('M-20,0 C-34,-14 -52,-20 -64,-22', 'none', { stroke: C.grey, sw: 1.2 }), at(x, y, s, 0, flip)) +
  g(path('M0,0 C-14,-26 -48,-44 -74,-34 C-62,-26 -66,-14 -56,-8 C-60,4 -44,8 -34,10 C-26,18 -12,12 0,8Z', col) + path('M-20,0 C-34,-14 -52,-20 -64,-22', 'none', { stroke: C.grey, sw: 1.2 }), at(x, y, s, 0, !flip));

// ---------- simbol suit ----------
export function wand(x, y, len = 100, ang = 0, leaves = true) {
  let o = rect(-4, -len, 8, len, C.brown, { rx: 3, sw: 1.6 }) + circle(0, -len, 4.5, C.brown, { sw: 1.4 });
  if (leaves) for (let i = 0; i < 4; i++) o += path(`M${i % 2 ? 3 : -3},${-len + 6 + i * 9} q${i % 2 ? 12 : -12},-5 ${i % 2 ? 11 : -11},-14 q${i % 2 ? -10 : 10},3 ${i % 2 ? -11 : 11},14Z`, C.green, { sw: 1.1 });
  return g(o, at(x, y, 1, ang));
}
export const cup = (x, y, s = 1, fill = C.gold, liquid = null) =>
  g(path('M-13,-26 Q-13,-4 0,-2 Q13,-4 13,-26Z', fill) + (liquid ? ellipse(0, -26, 13, 3.6, liquid, { sw: 1.2 }) : ellipse(0, -26, 13, 3.6, C.goldDark, { sw: 1.2 })) + rect(-2.5, -3, 5, 12, fill, { sw: 1.4 }) + path('M-9,12 Q0,6 9,12 L11,15 L-11,15Z', fill, { sw: 1.4 }), at(x, y, s));
export const sword = (x, y, len = 110, ang = 0) =>
  g(poly([[-5, -len + 12], [0, -len], [5, -len + 12], [5, -26], [-5, -26]], C.blueLight) + line(0, -len + 8, 0, -28, { stroke: C.grey, sw: 1 }) + rect(-14, -28, 28, 6, C.gold, { sw: 1.5 }) + rect(-2.5, -22, 5, 18, C.brownDark, { sw: 1.3 }) + circle(0, -2, 4, C.gold, { sw: 1.3 }), at(x, y, 1, ang));
export const pentacle = (x, y, r = 18, fill = C.gold) => {
  const pts = [0, 2, 4, 1, 3].map((i) => { const a = rad(-90 + i * 72); return [x + r * 0.7 * Math.cos(a), y + r * 0.7 * Math.sin(a)]; });
  return circle(x, y, r, fill) + circle(x, y, r * 0.8, 'none', { stroke: C.goldDark, sw: 1.2 }) + path('M' + pts.map((p) => p.map(f).join(',')).join('L') + 'Z', 'none', { stroke: C.brownDark, sw: 1.3 });
};
export const cloudHand = (x, y, s = 1, flip = false) => {
  const svg = g(cloud(0, 20, 1.6, C.white) + path('M-4,10 L-4,-18 Q-4,-26 4,-26 L12,-26 Q18,-26 18,-18 L18,10Z', C.skin) + rect(-6, -34, 24, 14, C.skin, { rx: 5 }) + line(2, -30, 2, -22, { sw: 1.2 }) + line(7, -30, 7, -22, { sw: 1.2 }) + line(12, -30, 12, -22, { sw: 1.2 }), at(x, y, s, 0, flip));
  return { svg, grip: [x + (flip ? -6 : 6) * s, y - 28 * s] };
};

// ---------- figur ----------
function elbow(a, b, bend = 1) {
  const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy) || 1;
  const off = Math.max(0, 36 - d) * 0.45 * bend;
  return [mx - (dy / d) * off, my + (dx / d) * off];
}
const limb = (pts, w, col) => {
  const p = pts.map((q) => q.map(f).join(',')).join(' ');
  return `<polyline points="${p}" fill="none" stroke="${C.ink}" stroke-width="${w + 3}" stroke-linecap="round" stroke-linejoin="round"/><polyline points="${p}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
};
// figure: manusia bergaya boneka kertas. Koordinat lokal: telapak kaki (0,0), tinggi ≈ 100.
// opts: x,y,s,flip, robe, sleeve, trim, hose, boots, skin, hair:{style,color}, hat:{kind,color}, beard, face(-1/0/1),
// hands:[[x,y],[x,y]] (lokal), sit, kneel, cloak, legsApart. Mengembalikan {svg, hands, head} (koordinat kartu).
export function figure(o = {}) {
  const { x = 150, y = 400, s = 1, flip = false, robe = C.red, trim = C.gold, hose = C.brownDark, boots = C.brownDark, skin = C.skin, face = 0, sit = false, kneel = false, cloak = null, long = true } = o;
  const sleeve = o.sleeve ?? robe, hands = o.hands ?? [[-24, -46], [24, -46]];
  const hair = o.hair ?? { style: 'short', color: C.brownDark }, hat = o.hat ?? null;
  const top = sit ? -66 : -74, hem = sit ? -18 : long ? -4 : -30;
  let out = '';
  if (cloak) out += path(`M-14,${top} Q-34,-40 -30,${hem + 2} L30,${hem + 2} Q34,-40 14,${top}Z`, cloak);
  // kaki
  if (!kneel) out += limb([[-7, -30], [-8, -12], [-9, -1]], 9, hose) + limb([[7, -30], [8, -12], [9, -1]], 9, hose) + ellipse(-10, 0, 8, 3.6, boots, { sw: 1.4 }) + ellipse(10, 0, 8, 3.6, boots, { sw: 1.4 });
  else out += limb([[-7, -30], [-12, -8], [-24, -3]], 9, hose) + limb([[7, -30], [10, -10], [12, -1]], 9, hose);
  // badan/jubah
  const wide = sit ? 26 : 21;
  out += path(`M-14,${top} Q-17,-50 -${wide},${hem} Q0,${hem + 5} ${wide},${hem} Q17,-50 14,${top} Q0,${top - 5} -14,${top}Z`, robe);
  out += hatch(`M0,${top} L14,${top} Q17,-50 ${wide},${hem} L4,${hem}Z`, 0.22);
  if (trim) out += path(`M-${wide},${hem} Q0,${hem + 5} ${wide},${hem}`, 'none', { stroke: trim, sw: 3 });
  if (o.belt !== false && !sit) out += rect(-14, -48, 28, 4, o.belt || C.brownDark, { sw: 1.2 });
  // lengan
  const sh = [[-14, top + 2], [14, top + 2]], hp = [];
  [0, 1].forEach((i) => { const h = hands[i]; const e = elbow(sh[i], h, i ? 1 : -1); out += limb([sh[i], e, h], 7.5, sleeve) + circle(h[0], h[1], 4.2, skin, { sw: 1.4 }); hp.push(h); });
  // leher & kepala
  const hy = top - 12;
  out += rect(-3.5, top - 6, 7, 8, skin, { stroke: 'none' });
  out += circle(0, hy, 10.5, skin);
  const fx = face * 3;
  out += circle(-3.8 + fx, hy - 1, 1, C.ink, { stroke: 'none' }) + circle(3.8 + fx, hy - 1, 1, C.ink, { stroke: 'none' });
  out += path(`M${fx},${hy} l${face * 1.5 + 0.5},4`, 'none', { sw: 1 }) + path(`M${-2 + fx},${hy + 6} q2,1.6 4,0`, 'none', { sw: 1 });
  if (o.beard) out += path(`M-8,${hy + 3} Q0,${hy + 22} 8,${hy + 3} Q0,${hy + 8} -8,${hy + 3}Z`, o.beard, { sw: 1.3 });
  const hc = hair.color || C.brownDark;
  if (hair.style === 'long') out += path(`M-11,${hy - 2} Q-14,${hy + 22} -9,${hy + 26} L-6,${hy + 8}Z M11,${hy - 2} Q14,${hy + 22} 9,${hy + 26} L6,${hy + 8}Z`, hc, { sw: 1.3 }) + path(`M-11,${hy} Q-12,${hy - 14} 0,${hy - 12} Q12,${hy - 14} 11,${hy} Q4,${hy - 6} -3,${hy - 8} Q-8,${hy - 4} -11,${hy}Z`, hc, { sw: 1.3 });
  else if (hair.style === 'curly') out += blob([[-8, hy - 8, 5], [0, hy - 11, 6], [8, hy - 8, 5], [-11, hy - 2, 4], [11, hy - 2, 4]], hc, 1.2);
  else if (hair.style === 'bun') out += path(`M-11,${hy} Q-12,${hy - 14} 0,${hy - 12} Q12,${hy - 14} 11,${hy} Q4,${hy - 6} -3,${hy - 8} Q-8,${hy - 4} -11,${hy}Z`, hc, { sw: 1.3 }) + circle(0, hy - 15, 5, hc, { sw: 1.3 });
  else if (hair.style !== 'bald') out += path(`M-11,${hy + 1} Q-13,${hy - 14} 0,${hy - 13} Q13,${hy - 14} 11,${hy + 1} Q6,${hy - 6} 0,${hy - 7} Q-7,${hy - 6} -11,${hy + 1}Z`, hc, { sw: 1.3 });
  if (hat) {
    const k = hat.kind, hcol = hat.color || C.red;
    if (k === 'crown') out += crown(0, hy - 9, 1.2);
    else if (k === 'cap') out += path(`M-12,${hy - 4} Q-12,${hy - 20} 4,${hy - 17} Q16,${hy - 12} 12,${hy - 4}Z`, hcol, { sw: 1.5 });
    else if (k === 'wide') out += ellipse(0, hy - 8, 20, 5, hcol, { sw: 1.5 }) + path(`M-9,${hy - 9} Q0,${hy - 24} 9,${hy - 9}Z`, hcol, { sw: 1.5 });
    else if (k === 'hood') out += path(`M-13,${hy + 6} Q-15,${hy - 20} 0,${hy - 18} Q15,${hy - 20} 13,${hy + 6} Q8,${hy - 8} 0,${hy - 9} Q-8,${hy - 8} -13,${hy + 6}Z`, hcol, { sw: 1.5 });
    else if (k === 'helmet') out += path(`M-12,${hy + 1} Q-13,${hy - 17} 0,${hy - 17} Q13,${hy - 17} 12,${hy + 1}Z`, hcol, { sw: 1.5 }) + path(`M0,${hy - 17} Q8,${hy - 30} 2,${hy - 34}`, 'none', { stroke: C.red, sw: 4 });
    else if (k === 'wreath') out += [-9, -3, 3, 9].map((px) => ellipse(px, hy - 10, 3.6, 2.2, C.green, { sw: 1 })).join('');
    else if (k === 'mitre') out += poly([[-10, hy - 7], [0, hy - 30], [10, hy - 7]], hcol, { sw: 1.5 });
    else if (k === 'turban') out += ellipse(0, hy - 9, 13, 8, hcol, { sw: 1.5 }) + path(`M-12,${hy - 9} Q0,${hy - 2} 12,${hy - 9}`, 'none', { sw: 1.2 });
    else if (k === 'laurel') out += [-10, -5, 0, 5, 10].map((px) => ellipse(px, hy - 9 + Math.abs(px) / 4, 3.4, 2, C.olive, { sw: 1 })).join('');
  }
  const T = at(x, y, s, 0, flip);
  const tx = (p) => [x + (flip ? -p[0] : p[0]) * s, y + p[1] * s];
  return { svg: g(out, T), hands: hp.map(tx), head: tx([0, hy]) };
}

// ---------- kuda ----------
// horse: siluet kuda menghadap kanan (flip untuk kiri). Titik duduk penunggang dikembalikan (koordinat kartu).
export function horse(o = {}) {
  const { x = 150, y = 420, s = 1, flip = false, color = C.white, rear = false, mane = C.brownDark } = o;
  const legs = rear
    ? limb([[66, 48], [86, 40], [96, 26]], 9, color) + limb([[56, 50], [78, 46], [92, 36]], 9, color)
    : limb([[66, 48], [68, 66], [70, 84]], 9, color) + limb([[58, 48], [58, 66], [56, 84]], 9, color);
  let out = limb([[22, 46], [16, 66], [16, 84]], 9, color) + limb([[30, 48], [30, 66], [32, 84]], 9, color) + legs;
  out += path('M14,34 Q4,48 6,70 Q10,52 18,44Z', mane, { sw: 1.5 });
  out += path('M10,34 Q8,14 34,12 Q58,10 70,22 L80,6 Q90,2 94,10 L100,22 Q104,30 96,34 L90,32 Q82,40 72,40 Q70,52 62,54 Q40,58 22,54 Q10,50 10,34Z', color);
  out += path('M70,24 Q76,8 80,6 L84,16 Q78,24 74,34Z', mane, { sw: 1.4 });
  out += circle(92, 14, 1.3, C.ink, { stroke: 'none' }) + path('M86,2 l2,-8 l4,8', color, { sw: 1.3 });
  out += path('M30,16 Q52,6 66,18 L64,26 Q46,18 30,26Z', o.cloth ?? 'none', { stroke: o.cloth ? C.ink : 'none', sw: 1.4 });
  const T = at(x, y, s, 0, flip);
  return { svg: g(out, T), seat: [x + (flip ? -(44) : 44) * s, y + 14 * s] };
}
export const dog = (x, y, s = 1, flip = false, col = C.white) =>
  g(path('M0,-14 Q4,-26 14,-24 L22,-30 L24,-22 L30,-18 L24,-14 Q22,-4 14,0 L2,0 L0,-6 L-12,-12 Q-6,-16 0,-14Z', col) + circle(20, -22, 1.2, C.ink, { stroke: 'none' }) + path('M-12,-12 Q-20,-20 -16,-26', 'none', { sw: 1.6 }), at(x, y, s, 0, flip));
export const bird = (x, y, s = 1, col = C.charcoal) => g(path('M-14,0 Q-7,-10 0,0 Q7,-10 14,0 Q7,-4 0,4 Q-7,-4 -14,0Z', col), at(x, y, s));
export const lion = (x, y, s = 1, flip = false) => g(blob([[0, -20, 15], [-10, -14, 8], [10, -14, 8], [-8, -28, 8], [8, -28, 8]], C.orange, 1.2) + circle(0, -20, 9, C.yellow) + circle(-3.5, -22, 1, C.ink, { stroke: 'none' }) + circle(3.5, -22, 1, C.ink, { stroke: 'none' }) + path('M-2,-18 l2,3 l2,-3Z', C.brownDark, { sw: 1 }), at(x, y, s, 0, flip));

// ---------- bingkai kartu ----------
const defs = `<defs><clipPath id="win"><rect x="${WIN.x}" y="${WIN.y}" width="${WIN.w}" height="${WIN.h}"/></clipPath><pattern id="hatch" width="4" height="4" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="4" stroke="${C.ink}" stroke-width="1"/></pattern><pattern id="dots" width="5" height="5" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="0.8" fill="${C.ink}"/></pattern></defs>`;
export function wrapCard(inner, meta = {}) {
  const orn = [[24, 20], [276, 20], [24, 500], [276, 500]].map(([x, y]) => star(x, y, 4.5, { n: 4, inner: 0.35, fill: C.gold, sw: 0.6 })).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 520" width="300" height="520" role="img" aria-label="${meta.name || 'Kartu tarot'}"><title>${meta.name || 'Kartu tarot'}</title>${defs}` +
    `<rect x="1.5" y="1.5" width="297" height="517" rx="14" fill="${C.cream}" stroke="${C.ink}" stroke-width="3"/><rect x="6" y="6" width="288" height="508" rx="10" fill="none" stroke="${C.gold}" stroke-width="1"/>` +
    `<g clip-path="url(#win)">${inner}</g><rect x="${WIN.x}" y="${WIN.y}" width="${WIN.w}" height="${WIN.h}" fill="none" stroke="${C.ink}" stroke-width="2.6"/><rect x="${WIN.x + 4}" y="${WIN.y + 4}" width="${WIN.w - 8}" height="${WIN.h - 8}" fill="none" stroke="${C.cream}" stroke-width="1" opacity="0.7"/>${orn}</svg>`;
}
export function cardBack() {
  let lat = '';
  for (let y = 40; y < 480; y += 40) for (let x = 20; x < 290; x += 40) lat += star(x + ((y / 40) % 2) * 20, y, 4, { n: 4, inner: 0.4, fill: C.gold, sw: 0.5 });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 520" width="300" height="520" role="img" aria-label="Punggung kartu tarot"><title>Punggung kartu tarot</title><defs><clipPath id="w"><rect x="16" y="16" width="268" height="488"/></clipPath><radialGradient id="rg" cx="50%" cy="50%" r="60%"><stop offset="0" stop-color="${C.red}"/><stop offset="1" stop-color="${C.redDark}"/></radialGradient></defs>` +
    `<rect x="1.5" y="1.5" width="297" height="517" rx="14" fill="${C.cream}" stroke="${C.ink}" stroke-width="3"/><rect x="12" y="12" width="276" height="496" rx="6" fill="url(#rg)" stroke="${C.goldDark}" stroke-width="2.5"/><g clip-path="url(#w)">${lat}</g>` +
    `<rect x="20" y="20" width="260" height="480" fill="none" stroke="${C.gold}" stroke-width="1.5"/><rect x="28" y="28" width="244" height="464" fill="none" stroke="${C.gold}" stroke-width="0.8"/>` +
    `<ellipse cx="150" cy="260" rx="78" ry="112" fill="${C.redDark}" stroke="${C.gold}" stroke-width="2.5"/><ellipse cx="150" cy="260" rx="68" ry="102" fill="none" stroke="${C.gold}" stroke-width="1"/>` +
    sun(150, 240, 20, { face: false }).replace(/C9702F/gi, C.gold) + crescent(150, 308, 22, C.cream) + star(150, 186, 8, { n: 8, inner: 0.45, fill: C.cream }) + star(112, 260, 4, { n: 4, fill: C.gold }) + star(188, 260, 4, { n: 4, fill: C.gold }) + `</svg>`;
}
