# Kako se radi tema (uputstvo za izradu i doradu)

Projekat: template sajta za frizerske salone i berbernice (React 18 + Vite + Tailwind,
prerender za SEO, jezici sr/en/ru). Svi podaci salona su u `src/config/salon.js` i
čitaju se kroz `useSajt()` (`salon`, `t` rečnik, `tx()` prevod polja, `p(kljuc)` putanja,
`jezik`, `tema`).

## Šta pripada temi `<id>` — i SAMO to se menja

```
src/teme/<id>/tema.js         podaci teme (boje, fontovi, tipografija, razmaci, header, hero, pokret…)
src/teme/<id>/tema.css        CSS samo za temu — SVAKI selektor počinje sa [data-tema='<id>']
src/teme/<id>/komponente.jsx  izvozi { Header, Footer, Hero, pocetna: [Sekcija, …], ZaglavljeStranice }
src/teme/<id>/*.jsx|*.js      dodatne komponente i tekstovi teme (npr. tekstovi.js sa { sr, en, ru })
```

Fajlovi van `src/teme/<id>/` se NE menjaju (druge teme rade paralelno). Ako je za
nešto neophodna zajednička izmena (bug u zajedničkoj komponenti, pravilo u
`src/index.css` koje smeta, nova promenljiva), upiši je u `src/teme/<id>/POTREBNO.md`
(šta, gde, zašto, tačan predlog izmene) i reši privremeno u svojoj fascikli ako može.

## Šta tema može da zada u tema.js (pored postojećih polja)

- `tipografija: { hero, h1, h2, h3, telo, uvod, oznaka, nav, dugme, meni, footer, logo }` —
  svaki nivo `{ velicina, visina, razmak, tezina, transform, stil, font }`, svaka vrednost
  može biti niz `[desktop, telefon]` (prelom 768px). `font`: 'naslov' | 'tekst' | 'oznaka' |
  'logo' ili ceo CSS niz fontova. Postaje `--hero-fs`, `--h2-lh`, `--nav-ls`… i koriste ga
  klase `.naslov-hero/-1/-2/-3`, `.tekst-telo`, `.tekst-uvod`, `.nadnaslov`,
  `.link-nav.nadnaslov`, `.dugme`, `.logo-tekst`. Vlastite klase mogu koristiti iste promenljive.
- `razmaci: { kontejner, gutter: [d, t], sekcija: [d, t], header: [d, t] }` →
  `--kontejner`, `--gutter`, `--sekcija-py`, `--header-h` (koriste `.kontejner` i `.sekcija`,
  tj. komponente `Kontejner` i `Sekcija`).
- `boje.<bilo_koje_ime>: '#hex'` → `--c-<ime-kebab>` (npr. `telo`, `footer`, `najava`…),
  upotreba `rgb(var(--c-telo))` ili `rgb(var(--c-telo) / .6)`.
- `slike.heroFilter: 'grayscale'` → `--filter-hero` (filter samo za hero; `--filter-slike` ostalo).
- Nova polja po želji (srpski camelCase) — čitaju ih komponente teme preko `useSajt().tema`.

## Gradivni blokovi (uvezi, ne kopiraj)

- `src/components/primitivi.jsx`: `Dugme` (varijante primarno/sekundarno/foto/fotoObris,
  `strelica`), `Naslov` (nivo hero/1/2/3, `akcenat`, reveal po temi, `odmah` za prvi ekran),
  `Nadnaslov`, `Pojava` (reveal pri skrolu, `i` = kaskada), `Foto` (srcset, filter, rezerva,
  `paralaksa`), `Kontejner`, `Sekcija`, `LinkStrelica`, `cx`, ikonice mreža.
- `src/components/Header.jsx`: `Logo`, `NavLinkovi` (`stavke`, `klasaLinka`), `STAVKE`,
  `STAVKE_MENIJA`, `useSkrol()` (`skrolovano`, `smer`, `sakrij`), `useMeni()`,
  `DugmeMenija`, `MobilniMeni` (`className`, `klasaLinka`, `dodatak`), `useZakaziLink()`,
  `HEROJ_ISPOD_HEADERA`; podrazumevani `Header`.
- `src/components/delovi.jsx`: `StatusOtvoreno`, `RadnoVremeTabela`, `NeradniDani`, `Mreze`,
  `KontaktDugmad`, `IzborJezika`, `Marquee`, `useNaKlijentu`.
- `src/sekcije/Hero.jsx`: podrazumevani `Hero`, `HeroSlajdovi`.
- `src/sekcije/Sekcije.jsx`: `Izjava`, `Usluge`, `Brendovi`, `GalerijaTraka`, `TimPregled`,
  `ZastoMi`, `Recenzije`, `Vaucer`, `ZavrsniPoziv`, `ZaglavljeSekcije`.
- `src/components/Footer.jsx`: podrazumevani footer; `src/components/ZaglavljeStranice.jsx`:
  `OsnovnoZaglavlje`.
- Podrazumevani redosled početne: `PODRAZUMEVANE_SEKCIJE` u `src/stranice/Pocetna.jsx`.

## Pravila

1. **Sadržaj je salona, ne reference.** Nikakav tekst, logo, fotografija ili kod sa
   referentnog sajta — samo dizajnerske odluke (vrednosti, raspored, ritam, pokret).
   Prodavnicu, akademiju i sl. ne praviti: prevesti obrazac na salon (usluge, tim,
   galerija, recenzije, radno vreme, zakazivanje).
2. **Tri jezika.** Svaki novi tekst interfejsa u `src/teme/<id>/tekstovi.js` kao
   `{ sr, en, ru }` (ili postojeći ključ iz `src/i18n/*.js`). Ništa hardkodovano na jednom jeziku.
   Ruski mora da se iscrta istim fontom ili rezervom sa ćirilicom.
3. **SSR i hidratacija.** Nema `window`/`document`/`Date.now()`/`Math.random()` u renderu;
   sve što zavisi od browsera ide u `useEffect`. Markup mora biti isti na serveru i klijentu.
4. **Pristupačnost.** Semantika (header/nav/main/footer, h1 samo jedan), tastatura, vidljiv
   fokus, `aria-*` na menijima i karuselima, `prefers-reduced-motion` gasi pokret (CSS).
5. **Kontrast.** Tekst ≥ 4.5:1, veliki (≥ 24px ili ≥ 18.66px bold) ≥ 3:1 — i preko fotografija
   (pojačaj veo ako treba, čak i ako referenca nema veo).
6. **Zakazivanje i sve podstranice moraju da rade** (cenovnik, tim, galerija, o nama,
   zakazivanje, kontakt, pitanja, pravne strane) u novom headeru i footeru, na telefonu i desktopu.
7. **Fontovi**: `@fontsource/*` uvoz u `komponente.jsx` (samo potrebne težine). Instalirani:
   amatic-sc, bodoni-moda, cormorant-garamond, cormorant-infant, cormorant-sc, dm-sans, inter,
   jost, manrope, onest, oswald, playfair-display, poppins, raleway, sofia-sans-extra-condensed.
   Novi paketi se ne instaliraju (upiši u POTREBNO.md).
8. `src/config/salon.js` se ne menja (tema se bira sa `?tema=<id>`).

## Provera (obavezno pre završetka)

```bash
# snimci naše teme (desktop + telefon, ekran po ekran, meni) — SVOJ port
node alati/istrazivanje/slikaj-temu.mjs <id> <port> [--strane pocetna,cenovnik,kontakt,tim,zakazivanje,ru:pocetna] [--samo telefon]
#   → alati/istrazivanje/izlaz/nas/<id>/{desktop,telefon}/*.jpg + greske.txt
# referenca za poređenje: alati/istrazivanje/izlaz/<id>/{desktop,telefon}/*.jpg

# kontrast (dev server, SVOJ drugi port), 10 stranica × telefon/desktop
node alati/istrazivanje/proveri-kontrast.mjs <id> --dev <port2>
#   → alati/istrazivanje/izlaz/kontrast-<id>.md  — cilj: 0 problema
```

Ponavljaj (izmena → snimci → poređenje) dok prvi ekran, header (vrh / posle skrola / skrol
nagore), mobilni meni, sekcije početne, dugmad, hover i footer ne odgovaraju specifikaciji
na oba ekrana. `greske.txt` mora biti bez grešaka.
