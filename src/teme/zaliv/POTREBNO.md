# zaliv — zajedničke izmene koje bi pomogle (nisu neophodne, sve je rešeno u fascikli teme)

## 1. Zajedničke stranice pretpostavljaju fiksni header od 76px
Zaliv ima header koji NIJE fiksiran (u toku strane, 263px / 84px). Stranice imaju
tvrdo zakucane odmake za fiksni header:

| fajl | klasa | problem bez nefiksnog headera |
|---|---|---|
| `src/stranice/Cenovnik.jsx:31` | `sticky top-[76px]` | lepljiva traka filtera ostavlja 76px praznine iznad sebe |
| `src/stranice/Zakazivanje.jsx:353` | `sticky top-[76px]` | isto (telefon) |
| `src/stranice/Zakazivanje.jsx:639` | `pt-[92px] md:pt-[140px]` | naslov zakazivanja 92/140px ispod headera koji već zauzima mesto |
| `src/stranice/Zakazivanje.jsx:280`, `NijePronadjeno.jsx:10` | `pt-28 md:pt-36` | isto |
| `Zakazivanje.jsx` (aside), `Kontakt.jsx` (mapa) | `sticky top-28` / `lg:top-28` | lepljivo 112px od vrha |

Privremeno rešeno u `src/teme/zaliv/tema.css` (selektori `#sadrzaj .sticky.top-\[76px\]`,
`#sadrzaj > .pt-\[92px\]`, `#sadrzaj > .pt-28`, `.top-28`).

**Predlog:** jedna promenljiva za visinu fiksnog headera, npr. u `src/index.css`
`:where(:root){ --header-fiksni: 76px; }` i u stranicama `top-[var(--header-fiksni)]`,
`pt-[calc(var(--header-fiksni)+16px)] md:pt-[calc(var(--header-fiksni)+64px)]` itd.
Tema sa nefiksnim headerom tada postavlja `--header-fiksni: 0px` (npr. novo polje
`header.fiksiran: false` u `cssTeme`).

## 2. Ostatak zaliv-specifičnog koda u podrazumevanom headeru
`src/components/Header.jsx` (`Logo`: grana `tema.id === 'zaliv'` sa `text-5xl … md:text-7xl`,
i `velikiLogo` / `'levo-veliki'` u `Header`) više se ne koristi — zaliv ima svoj Header
(`src/teme/zaliv/komponente.jsx`). Može da se ukloni kad nijedna druga tema ne koristi
`header.logo: 'levo-veliki'`.

## 3. docs/TEME.md
Za „Zaliv” navodi nav u verzalu 0.74rem/0.19em — to je stil CTA dugmeta; nav je
17.728px / 300 bez verzala (vidi docs/teme/zaliv.md). Opis teme treba ažurirati.
