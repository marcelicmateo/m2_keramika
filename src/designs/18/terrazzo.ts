// Seamless terrazzo tile as an SVG data URI: irregular stone chips scattered with a seeded random, wrapped at the edges.
interface Opts {
  seed: number;
  bg: string;
  colors: string[];
  count?: number;
  size?: number;
  min?: number;
  max?: number;
}

export function terrazzo({ seed, bg, colors, count = 90, size = 320, min = 2, max = 11 }: Opts) {
  let s = seed;
  const rnd = () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646;
  const chips: string[] = [];
  for (let n = 0; n < count; n++) {
    const cx = rnd() * size;
    const cy = rnd() * size;
    // Small chips are far more common than big ones.
    const r = min + (max - min) * rnd() ** 2.2;
    const sides = 4 + Math.floor(rnd() * 4);
    const rot = rnd() * Math.PI * 2;
    const pts = Array.from({ length: sides }, (_, k) => {
      const a = rot + (k / sides) * Math.PI * 2 + (rnd() - 0.5) * 0.9;
      const d = r * (0.55 + rnd() * 0.6);
      return [Math.cos(a) * d, Math.sin(a) * d];
    });
    const fill = colors[Math.floor(rnd() * colors.length)];
    for (const dx of [-size, 0, size])
      for (const dy of [-size, 0, size]) {
        const x = cx + dx, y = cy + dy;
        if (x < -max || y < -max || x > size + max || y > size + max) continue;
        chips.push(`<polygon fill="${fill}" points="${pts.map(([px, py]) => `${(x + px).toFixed(1)},${(y + py).toFixed(1)}`).join(' ')}"/>`);
      }
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="100%" height="100%" fill="${bg}"/>${chips.join('')}</svg>`;
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}
