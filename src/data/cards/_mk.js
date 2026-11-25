// Pembantu ringkas: mengembangkan format tuple menjadi skema kartu penuh.
// kw/rk = keyword upright/reversed; m = [makna up, rev]; d = deskripsi; g = [guidance up, rev];
// t = [tone up, rev]; cat = afinitas kategori; u/r = interpretasi [relationship, friendship, career, finance, self-discovery]
export const mk = ({ kw, rk, m, d, g, t, cat, u, r }) => {
  const ids = ['relationship', 'friendship', 'career', 'finance', 'self-discovery'];
  const pack = (a) => Object.fromEntries(ids.map((id, i) => [id, a[i]]));
  return {
    keywords: { upright: kw, reversed: rk },
    meaning: { upright: m[0], reversed: m[1] },
    description: d,
    guidance: { upright: g[0], reversed: g[1] },
    tone: { upright: t[0], reversed: t[1] },
    categories: cat,
    interpretations: { upright: pack(u), reversed: pack(r) },
  };
};
