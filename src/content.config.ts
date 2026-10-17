import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Svaka YAML datoteka je jedna kolekcija s jednim zapisom (id = ime datoteke).
const iz = (datoteka: string) => glob({ pattern: datoteka, base: './src/content' });

const tekst = z.string().min(1);

const stranica = defineCollection({
  loader: iz('stranica.yml'),
  schema: z.object({
    naziv: tekst,
    slogan: tekst,
    telefon: tekst,
    email: tekst,
    vlasnik: tekst,
    adresa: tekst,
    seo_opis: tekst,
    uvod: z.object({ naslov: tekst, tekst: tekst }),
    kvaliteta: z.object({ naslov: tekst, tekst: tekst }),
    projekti_naslov: tekst,
    kontakt_tekst: tekst,
  }),
});

const usluge = defineCollection({
  loader: iz('usluge.yml'),
  schema: z.object({
    usluge: z.array(
      z.object({
        naslov: tekst.max(40),
        istaknuto: tekst,
        opis: tekst,
      }),
    ),
  }),
});

const galerija = defineCollection({
  loader: iz('galerija.yml'),
  schema: ({ image }) =>
    z.object({
      slike: z.array(z.object({ slika: image(), opis: tekst })).max(16),
      prije_poslije: z.array(
        z.object({
          naslov: tekst,
          prije: image(),
          tijekom: image().optional(),
          poslije: image(),
          opis: tekst,
        }),
      ),
    }),
});

const cjenik = defineCollection({
  loader: iz('cjenik.yml'),
  schema: z.object({
    napomena: tekst,
    naslov_cijena: tekst,
    // Optional second price column (e.g. prices valid from a date). Shown only if this heading is set.
    naslov_druga_cijena: z.string().optional(),
    stavke: z.array(
      z.object({
        usluga: tekst,
        jedinica: z.enum(['m²', 'm¹', 'sat', 'kom']),
        cijena: tekst,
        druga_cijena: z.string().optional(),
      }),
    ),
  }),
});

export const collections = { stranica, usluge, galerija, cjenik };
