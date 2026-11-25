import { C, bg, band, hills, ground, water, mountain, cloud, sun, crescent, moon, star, starfield, tree, pine, flower, rose, sunflower, grass, pillar, curtain, tower, castle, throne, wall, halo, crown, wings, wand, cup, sword, pentacle, figure, horse, dog, bird, lion, circle, ellipse, rect, poly, path, line, g, at, checkerFloor, blob } from '../lib.mjs';

const nude = { robe: C.skin, sleeve: C.skin, trim: null, hose: C.skin, boots: C.skin, belt: false };

export const scenes = {
  'the-lovers': () => {
    const a = figure({ x: 82, y: 420, s: 1.5, ...nude, hair: { style: 'long', color: C.orange }, face: 1, hands: [[-18, -50], [20, -50]] });
    const b = figure({ x: 218, y: 420, s: 1.5, ...nude, hair: { style: 'curly', color: C.brownDark }, face: -1, hands: [[-20, -50], [18, -50]] });
    return bg(C.blueLight) + mountain(150, 330, 150, 160, C.brown, false) + sun(150, 80, 24, {}) + wings(150, 150, 1.2, C.red) + figure({ x: 150, y: 190, s: 0.9, robe: C.red, sleeve: C.red, hair: { style: 'curly', color: C.orange }, hands: [[-30, -86], [30, -86]], belt: false }).svg +
      ground(400, C.olive) + tree(40, 400, 1.6, C.green) + rose(40, 330, 1, C.red) + tree(262, 400, 1.6, C.oliveDark) + a.svg + b.svg + flower(130, 440) + flower(176, 448, 1, C.red);
  },
  'the-chariot': () => {
    const p = figure({ x: 150, y: 372, s: 1.5, robe: C.blue, sleeve: C.cream, trim: C.gold, hat: { kind: 'helmet', color: C.grey }, hair: { style: 'short', color: C.brownDark }, hands: [[-24, -56], [24, -56]], belt: C.gold });
    return bg(C.blueDark) + starfield(5, 12, 40, 160) + wall(300, 60, C.tan) + water(330, 50, C.blueLight) + band(380, 90, C.olive) + rect(66, 360, 168, 76, C.blue) + rect(66, 360, 168, 12, C.gold) + rect(62, 330, 176, 70, 'none', { stroke: 'none' }) +
      p.svg + path('M70,316 L230,316 L224,336 L76,336Z', C.cream) + [0, 1, 2, 3].map((i) => star(94 + i * 38, 326, 5)).join('') + crescent(70, 372, 10) + crescent(230, 372, 10, C.cream, true) + circle(150, 410, 16, C.gold) + path('M142,410 h16 M150,402 v16', 'none', { sw: 1.4 }) +
      lion(80, 456, 1.2) + lion(220, 456, 1.2, true) + wand(150 + 26, 312, 46, 0, false);
  },
  'strength': () => {
    const p = figure({ x: 130, y: 430, s: 1.8, robe: C.white, sleeve: C.white, trim: C.gold, hair: { style: 'long', color: C.orange }, hands: [[24, -46], [40, -34]], belt: C.green });
    return bg(C.yellow) + mountain(220, 330, 160, 100, C.blueLight) + hills(330, C.olive, 10) + ground(380, C.olive) + g(lion(0, 0, 2.4, true), at(210, 440)) + p.svg +
      path('M118,248 c-10,-12 -26,-4 -22,6 c4,10 22,2 22,-6 m0,0 c10,-12 26,-4 22,6 c-4,10 -22,2 -22,-6', 'none', { stroke: C.goldDark, sw: 3 }) + path('M108,350 q22,22 44,0', 'none', { stroke: C.red, sw: 4 });
  },
  'the-hermit': () => {
    const p = figure({ x: 150, y: 400, s: 1.8, robe: C.grey, sleeve: C.grey, trim: null, hat: { kind: 'hood', color: C.greyDark }, beard: C.white, hair: { style: 'bald' }, hands: [[-30, -60], [30, -34]], belt: C.white });
    return bg(C.blueDark) + starfield(2, 14, 40, 180, C.cream) + mountain(70, 460, 200, 220, C.blueLight) + mountain(230, 460, 190, 160, C.white) + band(400, 70, C.white) + hills(400, C.white, 10) + p.svg +
      line(p.hands[1][0], p.hands[1][1] + 40, p.hands[1][0], p.hands[1][1] - 120, { sw: 3.4, stroke: C.brown }) + g(path('M0,-12 L8,-12 L10,2 L-10,2 L-8,-12Z', C.yellowLight) + star(0, -3, 7, { n: 6, fill: C.white }), at(p.hands[0][0], p.hands[0][1])) + path('M80,500', 'none');
  },
  'wheel-of-fortune': () => {
    const cx = 150, cy = 250;
    let spokes = '';
    for (let i = 0; i < 8; i++) { const a = (i * Math.PI) / 4; spokes += line(cx, cy, cx + 78 * Math.cos(a), cy + 78 * Math.sin(a), { sw: 3 }) + circle(cx + 70 * Math.cos(a + 0.4), cy + 70 * Math.sin(a + 0.4), 3.4, C.ink, { stroke: 'none' }); }
    return bg(C.blue) + cloud(40, 100, 1.4) + cloud(220, 110, 1.4) + cloud(60, 420, 1.4) + cloud(210, 430, 1.4) + circle(cx, cy, 96, C.yellow) + circle(cx, cy, 80, C.cream) + circle(cx, cy, 82, 'none', { stroke: C.gold, sw: 3 }) + spokes + circle(cx, cy, 20, C.red) + star(cx, cy, 12, { n: 4, fill: C.yellowLight }) +
      lion(150, 130, 0.9) + path('M70,300 q20,40 50,30 q-10,-20 -30,-26Z', C.green) + figure({ x: 218, y: 360, s: 0.7, robe: C.brown, hair: { style: 'bald' }, hands: [[-20, -60], [20, -40]] }).svg + wings(60, 360, 0.7, C.white) + wings(244, 130, 0.7, C.white) + bird(80, 170, 1.4, C.charcoal) +
      path('M232,330 q10,-24 20,-10 q-4,10 -2,22', 'none', { stroke: C.charcoal, sw: 3 });
  },
  'justice': () => {
    const p = figure({ x: 150, y: 420, s: 1.8, sit: true, robe: C.red, sleeve: C.red, trim: C.gold, hat: { kind: 'crown' }, hair: { style: 'short', color: C.brownDark }, hands: [[-34, -64], [34, -70]], belt: false });
    return bg(C.yellow) + curtain(60, 240, 50, 330, C.plum) + pillar(42, 90, 28, 340, C.grey) + pillar(258, 90, 28, 340, C.grey) + rect(14, 420, 272, 48, C.greyDark, { stroke: 'none' }) + p.svg +
      sword(p.hands[1][0], p.hands[1][1] + 18, 100, 0) + g(line(-26, 0, 26, 0, { sw: 2.4 }) + path('M-26,0 l-8,18 h16Z M26,0 l-8,18 h16Z', C.gold, { sw: 1.2 }) + line(0, 0, 0, -10, { sw: 2.4 }), at(p.hands[0][0], p.hands[0][1]));
  },
  'the-hanged-man': () => {
    return bg(C.blueLight) + rect(50, 120, 200, 14, C.brown) + rect(40, 120, 16, 330, C.brownDark, { rx: 4 }) + rect(244, 120, 16, 330, C.brownDark, { rx: 4 }) + [0, 1, 2].map((i) => path(`M${50 + i * 90},134 q10,10 0,20 q-10,-6 0,-20`, C.green)).join('') + hills(450, C.olive, 6) +
      line(150, 134, 150, 190, { sw: 3, stroke: C.brown }) + g(figure({ x: 0, y: 0, s: 1.5, robe: C.blue, sleeve: C.blue, trim: null, hose: C.red, boots: C.yellow, hair: { style: 'curly', color: C.orange }, hands: [[-6, -50], [6, -50]] }).svg + halo(0, -88, 26), at(150, 196, 1, 180));
  },
  'death': () => {
    const h = horse({ x: 70, y: 322, s: 1.6, color: C.white, cloth: C.red });
    const p = figure({ x: h.seat[0] - 10, y: h.seat[1] + 58, s: 1.5, sit: true, robe: C.charcoal, sleeve: C.charcoal, trim: C.grey, skin: C.white, hair: { style: 'bald' }, hat: { kind: 'helmet', color: C.charcoal }, hands: [[-20, -50], [30, -80]] });
    return bg(C.yellowLight) + mountain(70, 330, 100, 70, C.blueLight) + tower(30, 340, 24, 70, C.tan) + tower(60, 340, 24, 76, C.tan) + sun(60, 316, 26, { face: false }) + water(330, 30, C.blue) + ground(360, C.olive) + h.svg + p.svg +
      line(p.hands[1][0], p.hands[1][1] + 30, p.hands[1][0], p.hands[1][1] - 90, { sw: 3, stroke: C.brown }) + poly([[p.hands[1][0], p.hands[1][1] - 90], [p.hands[1][0] + 44, p.hands[1][1] - 78], [p.hands[1][0], p.hands[1][1] - 54]], C.black) + circle(p.hands[1][0] + 14, p.hands[1][1] - 72, 6, C.white, { sw: 1 }) +
      g(figure({ x: 0, y: 0, s: 1, sit: true, robe: C.red, hat: { kind: 'crown' }, hair: { style: 'short', color: C.white }, hands: [[-30, -40], [30, -40]] }).svg, at(220, 452, 1, 80)) + figure({ x: 244, y: 440, s: 0.9, kneel: true, robe: C.white, hat: { kind: 'mitre', color: C.white }, hair: { style: 'bald' } }).svg;
  },
  'temperance': () => {
    const p = figure({ x: 150, y: 400, s: 1.8, robe: C.white, sleeve: C.white, trim: C.gold, hair: { style: 'long', color: C.orange }, hands: [[-30, -52], [26, -34]], belt: false });
    return bg(C.yellowLight) + sun(150, 120, 20, { face: false }) + mountain(190, 330, 160, 110, C.blueLight) + path('M120,360 Q150,310 175,340 Q195,310 220,350 L200,468 L110,468Z', C.tan) + water(400, 68, C.blueLight) + [0, 1, 2].map((i) => flower(40 + i * 24, 420 + i * 6, 1.2, C.blueDark, C.yellow)).join('') +
      wings(150, 280, 1.3, C.blue) + p.svg + cup(p.hands[0][0], p.hands[0][1] + 16, 0.9) + cup(p.hands[1][0], p.hands[1][1] + 16, 0.9) + path(`M${p.hands[0][0] + 4},${p.hands[0][1] - 4} Q${(p.hands[0][0] + p.hands[1][0]) / 2},${p.hands[0][1] - 34} ${p.hands[1][0] - 4},${p.hands[1][1] - 4}`, 'none', { stroke: C.blueLight, sw: 3 }) + halo(150, 290, 16) + star(150, 290, 8, { n: 4 });
  },
  'the-devil': () => {
    const a = figure({ x: 80, y: 440, s: 1.2, ...nude, hair: { style: 'long', color: C.orange }, hands: [[-20, -36], [20, -36]] });
    const b = figure({ x: 220, y: 440, s: 1.2, ...nude, hair: { style: 'short', color: C.brownDark }, hands: [[-20, -36], [20, -36]] });
    return bg(C.black) + starfield(6, 8, 50, 140, C.red) + rect(80, 330, 140, 110, C.greyDark) + wings(150, 190, 1.4, C.charcoal) + circle(150, 210, 30, C.charcoal) + poly([[126, 190], [118, 150], [140, 180]], C.charcoal) + poly([[174, 190], [182, 150], [160, 180]], C.charcoal) + circle(140, 208, 3.4, C.yellow, { stroke: 'none' }) + circle(160, 208, 3.4, C.yellow, { stroke: 'none' }) + path('M138,226 q12,8 24,0', 'none', { stroke: C.red, sw: 2 }) + rect(122, 242, 56, 70, C.charcoal) +
      star(150, 160, 14, { n: 5, fill: 'none' }) + line(216, 270, 216, 320, { sw: 3, stroke: C.brown }) + path('M216,260 q10,-14 0,-24 q-10,10 0,24Z', C.orange) + a.svg + b.svg + path('M90,410 Q120,360 150,348 Q180,360 210,410', 'none', { stroke: C.grey, sw: 3 });
  },
  'the-tower': () => {
    return bg(C.black) + starfield(4, 10, 40, 120, C.yellow) + path('M168,40 L140,130 L172,130 L132,230 L190,150 L158,150 L196,60Z', C.yellowLight) + mountain(60, 468, 160, 120, C.greyDark, false) + mountain(250, 468, 160, 100, C.greyDark, false) + tower(150, 440, 70, 260, C.tan) + poly([[112, 180], [150, 130], [188, 180], [180, 186], [120, 186]], C.red, { sw: 1.8 }) +
      [[142, 260], [142, 340]].map(([x, y]) => rect(x, y, 16, 22, C.black) + path(`M${x},${y} q8,-26 16,0`, C.orange)).join('') + g(figure({ x: 0, y: 0, s: 0.7, robe: C.red, hat: { kind: 'crown' }, hands: [[-26, -80], [26, -80]] }).svg, at(70, 200, 1, 160)) + g(figure({ x: 0, y: 0, s: 0.7, robe: C.blue, hands: [[-26, -80], [26, -80]], hair: { style: 'long', color: C.yellow } }).svg, at(232, 280, 1, -150)) +
      [[56, 120], [90, 180], [220, 100], [254, 200], [40, 300], [262, 360]].map(([x, y]) => path(`M${x},${y} q6,-10 12,0 q-6,10 -12,0Z`, C.yellow, { sw: 1 })).join('');
  },
  'the-star': () => {
    const p = figure({ x: 130, y: 410, s: 1.5, kneel: true, ...nude, hair: { style: 'long', color: C.yellow }, hands: [[-24, -34], [26, -30]] });
    return bg(C.blueDark) + starfield(8, 10, 40, 200, C.cream) + star(150, 110, 32, { n: 8, inner: 0.4, fill: C.yellowLight }) + [[60, 80], [240, 80], [40, 170], [260, 170], [80, 230], [220, 230], [150, 200]].map(([x, y]) => star(x, y, 11, { n: 8, inner: 0.4, fill: C.cream })).join('') + hills(330, C.olive, 10) + water(380, 88, C.blue) + path('M60,380 q90,-14 180,0 L240,468 L60,468Z', C.olive, { stroke: 'none' }) + water(410, 58, C.blueLight) + p.svg +
      cup(p.hands[0][0], p.hands[0][1] + 14, 1, C.blueLight) + cup(p.hands[1][0], p.hands[1][1] + 14, 1, C.blueLight) + tree(240, 360, 1.4, C.olive) + bird(236, 296, 1, C.charcoal) + path(`M${p.hands[1][0]},${p.hands[1][1] + 20} q10,40 20,20`, 'none', { stroke: C.blueLight, sw: 3 });
  },
  'the-moon': () => {
    return bg(C.blueDark) + starfield(9, 10, 40, 150, C.cream) + moon(150, 120, 46, C.cream) + [0, 1, 2, 3, 4, 5, 6].map((i) => path(`M${40 + i * 36},${170 + (i % 2) * 20} l0,12`, 'none', { stroke: C.yellow, sw: 2.4 })).join('') + tower(40, 330, 44, 130, C.greyDark) + tower(260, 330, 44, 130, C.greyDark) + band(330, 140, C.olive) + path('M150,330 Q110,380 160,420 Q200,450 150,468 L180,468 Q230,440 190,410 Q150,380 170,330Z', C.tan) +
      water(430, 38, C.blue) + path('M120,440 q-6,-14 4,-18 l8,8 l8,-8 q10,4 4,18Z', C.red, { sw: 1.4 }) + dog(70, 400, 1.6, false, C.greyDark) + dog(236, 400, 1.6, true, C.brown) + mountain(150, 340, 80, 40, C.greyDark, false);
  },
  'the-sun': () => {
    const h = horse({ x: 70, y: 322, s: 1.6, color: C.white });
    const kid = figure({ x: h.seat[0] - 6, y: h.seat[1] + 52, s: 1.1, sit: true, ...nude, hair: { style: 'curly', color: C.yellow }, hat: { kind: 'wreath' }, hands: [[-24, -48], [28, -66]] });
    return bg(C.yellowLight) + sun(150, 100, 34) + wall(280, 80, C.red) + ground(360, C.olive) + [0, 1, 2, 3].map((i) => sunflower(36 + i * 76, 270 - (i % 2) * 14, 1.1)).join('') + h.svg + kid.svg + line(kid.hands[1][0], kid.hands[1][1] + 6, kid.hands[1][0], kid.hands[1][1] - 62, { sw: 3, stroke: C.brown }) + poly([[kid.hands[1][0], kid.hands[1][1] - 62], [kid.hands[1][0] + 40, kid.hands[1][1] - 52], [kid.hands[1][0], kid.hands[1][1] - 38]], C.red) + grass(220, 460, 6);
  },
  'judgement': () => {
    const rise = (x, col) => figure({ x, y: 440, s: 0.95, ...nude, robe: C.grey, sleeve: C.grey, hose: C.grey, hair: { style: 'short', color: col }, hands: [[-18, -88], [18, -88]] });
    return bg(C.blueLight) + mountain(60, 380, 140, 130, C.blueDark) + mountain(240, 380, 140, 150, C.blueDark) + water(380, 88, C.blue) + cloud(30, 70, 1.8) + cloud(220, 76, 1.8) + wings(150, 130, 1.7, C.white) + figure({ x: 150, y: 190, s: 0.9, robe: C.blue, sleeve: C.blue, hair: { style: 'curly', color: C.yellow }, hands: [[-22, -80], [22, -60]] }).svg +
      path('M130,160 L120,240 L180,240 L170,160Z', C.gold, { opacity: 0.0 }) + [0, 1, 2].map((i) => rect(36 + i * 90, 430, 64, 28, C.cream, { sw: 1.6 })).join('') + rise(68, C.brownDark).svg + rise(158, C.yellow).svg + rise(248, C.brownDark).svg + path('M186,200 L226,184 L226,206Z', C.gold);
  },
  'the-world': () => {
    const p = figure({ x: 150, y: 372, s: 1.6, ...nude, robe: C.pink, hair: { style: 'long', color: C.orange }, hands: [[-28, -90], [28, -30]] });
    let wreath = '';
    for (let i = 0; i < 28; i++) { const a = (i / 28) * Math.PI * 2; wreath += ellipse(150 + 92 * Math.cos(a), 250 + 142 * Math.sin(a), 8, 4, C.olive, { sw: 1 }).replace('/>', ` transform="rotate(${(a * 180) / Math.PI + 90} ${150 + 92 * Math.cos(a)} ${250 + 142 * Math.sin(a)})"/>`); }
    return bg(C.blueLight) + wreath + p.svg + wand(p.hands[0][0], p.hands[0][1] + 10, 34, 20, false) + wand(p.hands[1][0], p.hands[1][1] + 10, 34, -20, false) + path('M122,420 Q150,440 178,420', 'none', { stroke: C.red, sw: 3 }) +
      figure({ x: 46, y: 118, s: 0.45, robe: C.blue, hair: { style: 'curly', color: C.yellow }, hands: [[-20, -60], [20, -60]] }).svg + bird(254, 100, 1.6, C.charcoal) + lion(46, 456, 0.8) + g(path('M0,0 Q10,-14 24,-10 L34,-18 L38,-4 L30,6 L2,6Z', C.brown) + wings(14, -2, 0.4, C.white), at(244, 450, 1)) + star(150, 250, 7, { n: 5, fill: C.yellowLight });
  },
};
