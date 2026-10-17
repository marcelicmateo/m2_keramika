import type { APIRoute } from 'astro';
import { getEntry } from 'astro:content';

const polje = (s: string) => (/[;"\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s);

export const GET: APIRoute = async () => {
  const { stavke, napomena } = (await getEntry('cjenik', 'cjenik'))!.data;
  const redovi = [
    'Usluga;Jedinica;Cijena',
    ...stavke.map((s) => [s.usluga, s.jedinica, s.cijena].map(polje).join(';')),
    '',
    polje(`*${napomena}`),
  ];
  return new Response('﻿' + redovi.join('\r\n') + '\r\n', {
    headers: { 'Content-Type': 'text/csv; charset=utf-8' },
  });
};
