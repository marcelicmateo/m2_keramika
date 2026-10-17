/** Alternative designs shown in the design bar. Slug 00 is the current site at `/`, the rest live at /dizajn/NN/. */
export const designs = [
  { slug: '00', naziv: 'Trenutni' },
  { slug: '01', naziv: 'Švicarski grid' },
  { slug: '02', naziv: 'Azulejo' },
  { slug: '03', naziv: 'Nacrt' },
  { slug: '04', naziv: 'Wabi-sabi' },
  { slug: '05', naziv: 'Brutalist' },
  { slug: '06', naziv: 'Mediteran' },
  { slug: '07', naziv: 'Art Deco' },
  { slug: '08', naziv: 'Bilježnica majstora' },
  { slug: '09', naziv: 'Editorial magazin' },
  { slug: '10', naziv: 'Neo-brutal veselo' },
  { slug: '11', naziv: 'Radionica' },
  { slug: '12', naziv: 'Bazen' },
  { slug: '13', naziv: 'Bauhaus' },
  { slug: '14', naziv: 'Mozaik bento' },
  { slug: '15', naziv: 'Tamni mramor' },
  { slug: '16', naziv: 'Novine' },
  { slug: '17', naziv: 'Retro 70-e' },
  { slug: '18', naziv: 'Teraco' },
  { slug: '19', naziv: 'Priča u kadrovima' },
  { slug: '20', naziv: 'Foto prvo' },
];

/** Path of a design relative to the site base: '' for the current site, 'dizajn/NN/' otherwise. */
export const designPath = (slug: string) => (slug === '00' ? '' : `dizajn/${slug}/`);
