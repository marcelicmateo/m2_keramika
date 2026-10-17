// Hand-drawn majolica tiles as SVG strings, used as CSS backgrounds / border-images and inline emblems.
export const C = { glaze: '#f7f3ea', blue: '#1f4fa3', deep: '#14306b', ochre: '#d9a23a', grout: '#ddd5c4' };
const { glaze, blue, deep, ochre, grout } = C;

// Slight wobble so the line work looks brush-painted rather than vector-perfect.
const wobble = `<filter id='w' x='-5%' y='-5%' width='110%' height='110%'><feTurbulence type='fractalNoise' baseFrequency='0.035' numOctaves='2' seed='7'/><feDisplacementMap in='SourceGraphic' scale='2.2'/></filter>`;
const svg = (size: number, body: string) =>
  `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}' viewBox='0 0 ${size} ${size}'><defs>${wobble}</defs>${body}</svg>`;
const rot = (n: number, el: string, offset = 0) =>
  Array.from({ length: n }, (_, i) => `<g transform='rotate(${offset + (360 / n) * i})'>${el}</g>`).join('');
const petal = (len: number, w: number) => `<path d='M0 ${-len}C${w} ${-len * 0.66} ${w * 0.8} ${-len * 0.25} 0 0C${-w * 0.8} ${-len * 0.25} ${-w} ${-len * 0.66} 0 ${-len}Z'/>`;
const corners = (r: number, el: (x: number, y: number) => string, s = 120) => [[0, 0], [s, 0], [0, s], [s, s]].map(([x, y]) => el(x, y)).join('');

/** Flower with n petals (4, 6, 8 …) centred in a 120×120 tile; quarter rosettes in the corners join across tiles. */
export function tile(n = 4, { joints = true } = {}) {
  const flower = `<g transform='translate(60 60)'>
    <g fill='${blue}'>${rot(n, petal(44, 15))}</g>
    <g fill='${deep}'>${rot(n, petal(26, 8), 180 / n)}</g>
    <g stroke='${glaze}' stroke-width='1.6' stroke-linecap='round'>${rot(n, `<path d='M0 -36V-12'/>`)}</g>
    <circle r='9' fill='${glaze}' stroke='${deep}' stroke-width='2'/><circle r='4.5' fill='${ochre}'/>
  </g>`;
  const mids = [[60, 0], [60, 120], [0, 60], [120, 60]];
  const joint = joints
    ? `<g fill='${deep}'>${corners(0, (x, y) => `<circle cx='${x}' cy='${y}' r='27'/>`)}</g>
       ${corners(0, (x, y) => `<g transform='translate(${x} ${y})' fill='${glaze}'>${rot(8, petal(21, 6))}<circle r='4' fill='${ochre}'/></g>`)}
       <circle cx='60' cy='60' r='50' fill='none' stroke='${blue}' stroke-width='2'/>
       <g fill='${blue}'>${mids.map(([x, y]) => `<path d='M${x} ${y - 11}L${x + 7} ${y}L${x} ${y + 11}L${x - 7} ${y}Z' transform='rotate(${x === 60 ? 90 : 0} ${x} ${y})'/>`).join('')}</g>
       <g fill='${ochre}'>${mids.map(([x, y]) => `<circle cx='${x}' cy='${y}' r='2.5'/>`).join('')}</g>`
    : `<rect x='6' y='6' width='108' height='108' fill='none' stroke='${blue}' stroke-width='2.5'/>`;
  return svg(120, `<rect width='120' height='120' fill='${glaze}'/><g filter='url(#w)'>${joint}${flower}</g><rect x='.5' y='.5' width='119' height='119' fill='none' stroke='${grout}'/>`);
}

/** 4-fold symmetric chain band (cenefa) in a 40×40 cell: works horizontally and vertically. */
const bandCell = (x: number, y: number) => `<g transform='translate(${x} ${y})'>
  <rect width='40' height='40' fill='${blue}'/>
  <circle cx='20' cy='20' r='12' fill='none' stroke='${glaze}' stroke-width='3'/>
  <circle cx='20' cy='20' r='4' fill='${ochre}'/>
  ${[[20, 0], [20, 40], [0, 20], [40, 20]].map(([cx, cy]) => `<path d='M${cx} ${cy - 5}L${cx + 5} ${cy}L${cx} ${cy + 5}L${cx - 5} ${cy}Z' fill='${glaze}'/>`).join('')}
</g>`;
export const band = svg(40, `<g filter='url(#w)'>${bandCell(0, 0)}</g>`);

/** 120×120 border-image source: 40px corner blocks + band edges (slice 40). */
const cornerCell = (x: number, y: number) => `<g transform='translate(${x} ${y})'>
  <rect width='40' height='40' fill='${deep}'/>
  <g transform='translate(20 20)' fill='${glaze}'>${rot(4, petal(15, 6), 45)}</g>
  <circle cx='20' cy='20' r='3.5' fill='${ochre}'/>
</g>`;
export const frame = svg(120, `<g filter='url(#w)'>${cornerCell(0, 0)}${cornerCell(80, 0)}${cornerCell(0, 80)}${cornerCell(80, 80)}${bandCell(40, 0)}${bandCell(40, 80)}${bandCell(0, 40)}${bandCell(80, 40)}</g>`);

/** Quiet blue-on-blue pattern for dark sections. */
export const night = svg(120, `<rect width='120' height='120' fill='${deep}'/><g filter='url(#w)' fill='none' stroke='#2a4f98' stroke-width='2.5'>
  ${corners(0, (x, y) => `<circle cx='${x}' cy='${y}' r='26'/>`)}<g transform='translate(60 60)'>${rot(8, `<path d='M0 -40C10 -28 9 -12 0 0C-9 -12 -10 -28 0 -40Z'/>`)}<circle r='8'/></g></g>`);

export const data = (s: string) => `url("data:image/svg+xml,${encodeURIComponent(s.replace(/\s+/g, ' '))}")`;
