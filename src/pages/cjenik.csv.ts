import type { APIRoute } from 'astro';
import { getEntry } from 'astro:content';

const polje = (s: string) => (/[;"\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s);

export const GET: APIRoute = async () => {
  const { stavke, napomena, naslov_cijena, naslov_druga_cijena } = (await getEntry('cjenik', 'cjenik'))!.data;
  const druga = !!naslov_druga_cijena;
  const redovi = [
    ['Usluga', 'Jedinica', naslov_cijena, ...(druga ? [naslov_druga_cijena!] : [])].map(polje).join(';'),
    ...stavke.map((s) => [s.usluga, s.jedinica, s.cijena, ...(druga ? [s.druga_cijena ?? ''] : [])].map(polje).join(';')),
    '',
    polje(`*${napomena}`),
  ];
  return new Response('﻿' + redovi.join('\r\n') + '\r\n', {
    headers: { 'Content-Type': 'text/csv; charset=utf-8' },
  });
};
