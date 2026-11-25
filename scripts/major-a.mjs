import { C, W, bg, band, hills, ground, water, mountain, cloud, sun, crescent, moon, star, starfield, tree, pine, flower, rose, sunflower, grass, pillar, curtain, tower, castle, throne, wall, halo, crown, wings, wand, cup, sword, pentacle, figure, horse, dog, bird, lion, circle, ellipse, rect, poly, path, line, g, at, checkerFloor, blob } from '../lib.mjs';

export const scenes = {
  'the-fool': () => {
    const p = figure({ x: 140, y: 372, s: 1.8, face: 1, robe: C.yellowLight, sleeve: C.white, trim: C.red, hose: C.red, hair: { style: 'curly', color: C.brownDark }, hat: { kind: 'cap', color: C.red }, hands: [[-24, -78], [26, -96]] });
    return bg(C.yellow) + sun(220, 120, 22) + mountain(70, 300, 130, 90, C.blueLight) + mountain(230, 300, 120, 70, C.blueLight) +
      hills(300, C.olive, 6) + path('M14,330 L190,330 L196,336 L196,468 L14,468Z', C.tan) + path('M190,330 L286,330 L286,468 L196,468Z', C.yellow, { stroke: 'none' }) +
      p.svg + line(p.hands[1][0], p.hands[1][1], p.hands[1][0] + 40, p.hands[1][1] + 18, { sw: 3, stroke: C.brown }) + circle(p.hands[1][0] + 42, p.hands[1][1] + 20, 9, C.red) + rose(p.hands[0][0], p.hands[0][1] - 6, 1.4, C.white) +
      dog(205, 410, 1.4, true) + flower(60, 430, 1) + grass(28, 460);
  },
  'the-magician': () => {
    const p = figure({ x: 150, y: 400, s: 1.8, robe: C.white, sleeve: C.red, trim: C.gold, hat: { kind: 'wreath' }, hair: { style: 'short', color: C.brownDark }, hands: [[-30, -100], [28, -48]], belt: C.gold });
    return bg(C.yellow) + rect(14, 400, 272, 70, C.olive, { stroke: 'none' }) + [0, 1, 2, 3, 4, 5].map((i) => flower(30 + i * 46, 440 + (i % 2) * 10, 1.1, i % 2 ? C.red : C.white)).join('') +
      path('M80,380 L220,380 L226,468 L74,468Z', C.brownDark) + cup(104, 380, 0.8) + pentacle(138, 366, 10) + sword(172, 384, 36, 0) + wand(204, 384, 34, 0, false) +
      p.svg + wand(p.hands[0][0], p.hands[0][1] + 6, 56, 8, false) + path(`M${p.head[0] - 14},${p.head[1] - 40} c-10,-10 -22,0 0,0 c22,0 10,-10 0,0 m0,0 c10,-10 22,0 0,0 c-22,0 -10,-10 0,0`, 'none', { stroke: C.goldDark, sw: 3 }) + rose(30, 150, 2) + rose(268, 150, 2);
  },
  'the-high-priestess': () => {
    const p = figure({ x: 150, y: 420, s: 1.8, sit: true, robe: C.blue, sleeve: C.blue, trim: C.cream, hat: { kind: 'hood', color: C.blueDark }, hair: { style: 'long', color: C.brownDark }, hands: [[-10, -40], [10, -40]], belt: false });
    return bg(C.blueDark) + pillar(50, 100, 34, 340, C.charcoal) + pillar(250, 100, 34, 340, C.cream) + curtain(70, 230, 100, 300, C.redDark) + starfield(3, 8, 50, 140, C.cream) +
      water(300, 168, C.blue) + path('M70,430 L230,430 L230,468 L70,468Z', C.greyDark) + p.svg + crescent(150, p.head[1] - 22, 12, C.cream) + circle(150, p.head[1] - 24, 8, C.paper, { opacity: 0.0 }) + rect(128, 366, 44, 36, C.cream, { rx: 3 }) + line(134, 376, 166, 376, { sw: 1.2 }) + line(134, 384, 160, 384, { sw: 1.2 }) + crescent(100, 450, 14, C.cream);
  },
  'the-empress': () => {
    const p = figure({ x: 150, y: 410, s: 1.8, sit: true, robe: C.pink, sleeve: C.pink, trim: C.gold, hat: { kind: 'crown' }, hair: { style: 'long', color: C.orange }, hands: [[-22, -34], [24, -50]], belt: false });
    return bg(C.yellowLight) + [0, 1, 2, 3, 4].map((i) => pine(30 + i * 56, 330, 1.4, C.oliveDark)).join('') + water(290, 40, C.blue) + ground(330, C.yellow) +
      [0, 1, 2, 3, 4, 5, 6].map((i) => path(`M${24 + i * 40},468 l0,-50 M${24 + i * 40},440 l-6,-8 M${24 + i * 40},440 l6,-8`, 'none', { stroke: C.gold, sw: 3 })).join('') +
      rect(88, 380, 124, 60, C.red) + p.svg + [0, 1, 2, 3, 4, 5].map((i) => star(112 + i * 15, p.head[1] - 22 + Math.abs(i - 2.5) * -1.5, 3.4, { n: 5, fill: C.yellowLight })).join('') + circle(222, 400, 12, C.cream) + path('M222,412 v14 M216,420 h12', 'none', { sw: 1.6 });
  },
  'the-emperor': () => {
    const p = figure({ x: 150, y: 430, s: 1.8, sit: true, robe: C.red, sleeve: C.red, trim: C.gold, hat: { kind: 'crown' }, hair: { style: 'short', color: C.white }, beard: C.white, hands: [[-26, -44], [28, -70]], belt: false });
    return bg(C.orange) + mountain(60, 330, 150, 150, C.brownDark, false) + mountain(240, 330, 150, 130, C.brownDark, false) + hills(330, C.brown, 6) + water(380, 30, C.blue) + throne(150, 440, 100, 200, C.greyDark) + [-1, 1].map((k) => rect(150 + k * 48 - 6, 276, 12, 14, C.cream)).join('') + p.svg +
      path(`M${p.hands[1][0]},${p.hands[1][1]} l0,-44`, 'none', { stroke: C.gold, sw: 4 }) + circle(p.hands[1][0], p.hands[1][1] - 48, 6, 'none', { stroke: C.gold, sw: 3 }) + circle(p.hands[0][0], p.hands[0][1], 8, C.gold);
  },
  'the-hierophant': () => {
    const p = figure({ x: 150, y: 400, s: 1.8, sit: true, robe: C.red, sleeve: C.red, trim: C.gold, hat: { kind: 'mitre', color: C.gold }, hair: { style: 'short', color: C.white }, beard: C.white, hands: [[-28, -66], [30, -50]], belt: false });
    const k1 = figure({ x: 90, y: 462, s: 0.85, kneel: true, robe: C.white, hair: { style: 'short', color: C.brownDark } }), k2 = figure({ x: 214, y: 462, s: 0.85, kneel: true, robe: C.olive, hair: { style: 'bald' }, flip: true });
    return bg(C.blueLight) + pillar(46, 70, 36, 330, C.greyDark) + pillar(254, 70, 36, 330, C.greyDark) + rect(14, 400, 272, 68, C.cream, { stroke: 'none' }) + checkerFloor(432, 36, C.cream, C.paper) + p.svg + line(p.hands[1][0], p.hands[1][1] + 30, p.hands[1][0], p.hands[1][1] - 60, { sw: 3, stroke: C.gold }) + k1.svg + k2.svg +
      path('M100,456 l14,-14 l-4,-4 l-14,14Z M190,456 l-14,-14 l4,-4 l14,14Z', C.gold, { sw: 1.2 });
  },
};
