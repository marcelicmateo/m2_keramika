# 05 — Content model and copy edits

All editable content lives in `src/content/*.yml`. Each file appears as one item in the Pages CMS sidebar, with Croatian labels. Schemas in `src/content.config.ts` validate every file at build time.

## Sidebar Marin sees

| Sidebar label | File | What he edits |
|---|---|---|
| 🏠 **Osnovni podaci** | `osnovno.yml` | Business name, slogan, phone, email, owner, address, OIB, hero photo, Google description |
| ✍️ **Tekstovi** | `tekstovi.yml` | Headings and paragraphs of the intro, quality and contact sections |
| 🔧 **Usluge** | `usluge.yml` | Services: add, remove, reorder, edit |
| 📷 **Galerija** | `galerija.yml` | Project photos and short descriptions |
| 🔄 **Prije i poslije** | `prije-poslije.yml` | Before / during / after sets |
| 💶 **Cjenik** | `cjenik.yml` | Price list rows, footnote, optional new prices and their date |

The logo, background photos and layout are **not** in the CMS. Those are developer-managed in `src/assets/brand/`.

## Files and fields

`*` = required. Limits are enforced by the schema and shown as help text in the CMS.

### `osnovno.yml` — Osnovni podaci

| Field | CMS label | Type | Rules |
|---|---|---|---|
| `naziv`* | Naziv obrta | string | ≤ 40 |
| `slogan`* | Kratki opis (ispod naslova) | string | ≤ 80 |
| `telefon`* | Broj mobitela | string | Must match `+385…`. Shown formatted `+385 95 512 7986` |
| `email`* | E-mail | string | Valid email |
| `vlasnik`* | Vlasnik | string | |
| `adresa`* | Adresa | string | |
| `grad`* | Grad | string | |
| `oib` | OIB | string | 11 digits. Hidden on site if empty |
| `hero_slika`* | Glavna fotografija | image | Landscape, ≥ 1600 px wide recommended |
| `seo_opis`* | Opis za Google (1–2 rečenice) | text | 70–160 chars |

### `tekstovi.yml` — Tekstovi

| Field | CMS label | Type |
|---|---|---|
| `uvod.naslov`*, `uvod.tekst`* | Uvod – naslov / tekst | string / text |
| `kvaliteta.naslov`*, `kvaliteta.tekst`* | Kvaliteta – naslov / tekst | string / text |
| `projekti_naslov`* | Naslov galerije | string |
| `kontakt.tekst`* | Kontakt – poruka | text (line breaks kept) |

### `usluge.yml` — Usluge (list, 1–8 items, reorderable)

| Field | CMS label | Type | Rules |
|---|---|---|---|
| `naslov`* | Naziv usluge | string | ≤ 40 |
| `istaknuto`* | Kratki uvod (podebljano) | string | ≤ 90. Full stop added automatically if missing |
| `opis`* | Opis | text | ≤ 600 |

### `galerija.yml` — Galerija (list, 0–24 items, reorderable)

| Field | CMS label | Type | Rules |
|---|---|---|---|
| `slika`* | Fotografija | image | jpg/png/webp/heic→ see note |
| `opis`* | Što je na slici? (za slabovidne i Google) | string | 5–120. Becomes `alt` |
| `prikazi_opis` | Prikaži opis ispod slike | boolean | default `false` |

> HEIC (iPhone default) isn't supported by sharp's prebuilt binaries. The help text tells Marin to share photos as JPG. When an iPhone uploads through a web form, Safari usually converts to JPEG anyway. **Verify in the M0 spike.**

### `prije-poslije.yml` — Prije i poslije (list, 0–6 sets)

| Field | CMS label | Type |
|---|---|---|
| `naslov` | Naziv projekta (npr. „Kupaonica, Zadar") | string, optional |
| `prije`* | Prije | image |
| `tijekom` | U procesu (nije obavezno) | image |
| `poslije`* | Poslije | image |
| `opis`* | Kratki opis (za slabovidne) | string |

### `cjenik.yml` — Cjenik

| Field | CMS label | Type | Rules |
|---|---|---|---|
| `napomena`* | Napomena ispod cjenika | text | |
| `nove_cijene_od` | Nove cijene vrijede od | date | Column shown only if set **and** any row has `nova_cijena` |
| `stavke`* | Stavke | list (1–40) | reorderable |
| ↳ `usluga`* | Naziv usluge | string | ≤ 70 |
| ↳ `jedinica`* | Jedinica | select | `m²` · `m¹ (dužni metar)` · `sat` · `kom` · `paušal` |
| ↳ `cijena` | Cijena (€) | number | Either `cijena` or `cijena_tekst` is required |
| ↳ `cijena_tekst` | …ili opis cijene (npr. „⅓ cijene postave po m²") | string | |
| ↳ `nova_cijena` | Nova cijena (€) | number | optional |

`/cjenik.csv` is generated from this file at build time: UTF-8 with BOM, `;` separator. Croatian Excel uses `;` as its list separator, so the current comma CSV opens squashed into one column. The file includes the footnote and generation date.

### Example: `cjenik.yml`

```yaml
napomena: >-
  Cjenik je informativnog karaktera, a konačne cijene formiraju se
  nakon pregleda prostora/terena.
nove_cijene_od:
stavke:
  - usluga: Ugradnja pločica do 0,4 m²
    jedinica: m²
    cijena: 30
  - usluga: Postava sokle
    jedinica: m¹
    cijena_tekst: ⅓ cijene postave po m²
```

## `.pages.yml` sketch

Final syntax will be verified against the Pages CMS docs in the M0 spike.

```yaml
media:
  input: src/assets/uploads
  output: ../assets/uploads      # relative to src/content/*.yml, so Astro image() resolves it
  extensions: [jpg, jpeg, png, webp]

settings:
  commit:
    identity: user

content:
  - name: osnovno
    label: Osnovni podaci
    type: file
    path: src/content/osnovno.yml
    format: yaml
    fields:
      - { name: naziv,   label: Naziv obrta, type: string, required: true }
      - { name: telefon, label: Broj mobitela, type: string, required: true,
          description: "Upišite u obliku +385 95 123 4567" }
      # …
  - name: cjenik
    label: Cjenik
    type: file
    path: src/content/cjenik.yml
    format: yaml
    fields:
      - name: stavke
        label: Stavke
        type: object
        list: true
        fields:
          - { name: usluga,  label: Naziv usluge, type: string, required: true }
          - { name: jedinica, label: Jedinica, type: select,
              options: { values: ["m²", "m¹", "sat", "kom", "paušal"] } }
          - { name: cijena,  label: Cijena (€), type: number }
          # …
```

## Proposed copy edits

These need **Marin's approval** before launch. They're grouped so he can say yes or no per group.

### A. Clear fixes (typos, punctuation, units)

| Where | Now | Proposed |
|---|---|---|
| Intro | …sve **priprem** radove… | …sve **pripremne** radove… |
| Hidroizolacija | Sigurna zaštita od vlage i prodora vode Vlaga je… | Sigurna zaštita od vlage i prodora vode**.** Vlaga je… |
| Klupčice | Precizna ugradnja i završna estetika Uz keramičarske… | Precizna ugradnja i završna estetika**.** Uz keramičarske… |
| Header/footer | +385955127986 | +385 95 512 7986 |
| Cjenik | Ugradnja pločica veličine do 0.4m2 | Ugradnja pločica do 0,4 m² |
| Cjenik | …do 0.8m2 | …do 0,8 m² |
| Cjenik | Postava kamena do formata 40X80 na ljepilo | Postava kamena do 40 × 80 cm na ljepilo |
| Cjenik | Izrada gerunga (pločice do 1.2m2) | Izrada gerunga (pločice do 1,2 m²) |
| Cjenik | 50€ | 50 € |
| Cjenik | (empty last row) | removed |

### B. Needs Marin's input

| Where | Issue | Proposal / question |
|---|---|---|
| Hidroizolacija | "…terasa i balkona koristeći." The sentence is cut off | "…koristeći provjerene sustave (npr. Mapei / Sika)." **Which materials does he use?** |
| Cjenik | Two identical price columns; "od 10.09.2026." has passed | Show one "Cijena" column. Use the "nove cijene" field next time prices change |
| Cjenik | "epoxy fugom" | Standard Croatian is "epoksidnom fugom". **His call.** The trade term may be what customers search for |
| Cjenik | "1/3 cijene postave kvadrata" | "⅓ cijene postave po m²" |
| Footer | "Ulica J. Miše, Zadar" | Full street name and number? The CSV filename hints at "Jerolima Miše 8". **Only if he wants the house number public** |
| Footer | No OIB | Add OIB (recommended for a Croatian obrt; see 07) |
| Gallery | No descriptions | We draft `alt` texts (e.g. "Bazen obložen svijetlim kamenim pločama, u izgradnji") and he corrects them |

### C. SEO texts (new)

- `<title>`: **M² Keramika – keramičar Zadar | postavljanje pločica i hidroizolacija**
- Meta description: **Keramičarski obrt iz Zadra: postavljanje pločica, pripremni radovi, hidroizolacija i ugradnja prozorskih klupčica. Pogledajte radove i cjenik.**
- `LocalBusiness` (`HomeAndConstructionBusiness`) JSON-LD: name, phone, email, address, `areaServed: Zadarska županija`, logo, image.

> Whether he works outside the Zadar area changes the SEO text and `areaServed`. Ask him.
