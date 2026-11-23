# soho — predlozi zajedničkih izmena

Sve ispod je za sada rešeno unutar `src/teme/soho/` (tema.css / komponente), ali
pravo mesto je zajednički kod — i druge teme imaju iste probleme.

## 1. Kontrast: `opacity-60` na tekstu (Cenovnik, Zakazivanje, O nama)

- **Gde:** `src/stranice/Cenovnik.jsx` (trajanje, „od”, „Za koga?”, PDV napomena),
  `src/stranice/Zakazivanje.jsx` (koraci, „Izabrano”, „Ukupno”, nazivi kategorija,
  „Korak 1 od 4”), `src/stranice/ONama.jsx` („Radimo sa profesionalnim linijama”).
- **Zašto:** tinta `#1E1E1E` sa providnošću .6 na krem `#FFFCF5` = **4.38:1** (< 4.5).
  Pogađa svaku svetlu temu sa sličnom tintom.
- **Predlog:** `opacity-60` → `opacity-70` na tekstu (≈ 6:1). Soho privremeno:
  `[data-tema='soho'] .opacity-60 { opacity: .7 }`.

## 2. `IzborJezika` — neaktivni jezik `opacity-55`

- **Gde:** `src/components/delovi.jsx`, `IzborJezika`.
- **Zašto:** tinta na .55 preko krem ≈ 3.9:1 (< 4.5) kad se ne izuzme.
- **Predlog:** `opacity-55` → `opacity-70`. Soho privremeno prepisuje u tema.css.

## 3. Visina headera zakucana na 76px

- **Gde:** `src/stranice/Cenovnik.jsx` (`sticky top-[76px]`),
  `src/stranice/Zakazivanje.jsx` (`sticky top-[76px]`, `pt-[92px] md:pt-[140px]`).
- **Zašto:** Soho header je 32 + 79 px (telefon 32 + 63 = 95 px), pa lepljiva traka i
  naslov zakazivanja zalaze ispod headera.
- **Predlog:** `top-[var(--header-lepljivo,76px)]` i `pt-[calc(var(--header-h,76px)+16px)]`;
  tema postavlja `--header-lepljivo`. Soho privremeno: selektori
  `[data-tema='soho'] .sticky.top-\[76px\]` i `main > .kontejner.pt-\[92px\]`.

## 4. Prelaz stranice „zavesa” u `App.jsx`

- **Gde:** `src/App.jsx` (`prelazStranice`).
- **Zašto:** referenca prvo navuče crni panel preko stare stranice, pa ga odvuče
  udesno (`x: 0→100%`, 0.5 s, `power1.out`, kašnjenje 0.2 s). Iz teme se može uraditi
  samo drugi deo (panel se pojavi u istom kadru kad se nova stranica iscrta i odlazi) —
  to je urađeno u `soho/Header.jsx` (`Zavesa`, `useLayoutEffect` na promenu putanje).
- **Predlog:** u `App.jsx` podrška `prelazStranice: 'zavesa'` koja odloži zamenu
  `<Stranica />` dok panel ne prekrije ekran (npr. `useTransition`/stanje „izlaz”),
  sa trajanjem i krivom iz `tema.pokret.prelazTrajanje/prelazEasing`.

## 5. `useMeni` ne zaustavlja Lenis

- **Gde:** `src/components/Header.jsx`, `useMeni`.
- **Zašto:** `html.bez-skrola` ne sprečava Lenis da skroluje stranicu ispod otvorenog
  menija (točkić na tabletu/desktopu sa uskim prozorom).
- **Predlog:** u efektu `useMeni`: `window.__lenis?.stop()` pri otvaranju, `start()` pri
  zatvaranju. Soho to radi u svom headeru.

## 6. `Logo` — veličina teksta zakucana Tailwind klasama

- **Gde:** `src/components/Header.jsx`, `Logo` (`text-[1.55rem] md:text-[1.7rem]` na `<span>`).
- **Zašto:** `tipografija.logo` (→ `--logo-fs`) ne može da ga promeni.
- **Predlog:** veličinu staviti na `.logo-tekst` preko `var(--logo-fs, …)` umesto na span.
  Soho koristi svoj `LogoS` (soho/delovi.jsx).

## 7. Ključevi `tipografija` se ne pretvaraju u kebab-case

- **Gde:** `src/config/teme.js`, `cssTeme` (`--${nivo}-${kratko}`).
- **Zašto:** `footerNaslov` postaje `--footerNaslov-fs` (radi, ali odudara od
  `boje` gde je `hoverForma` → `--c-hover-forma`).
- **Predlog:** isti `replace(/[A-Z]/g, …)` kao za boje (soho bi onda prešao na `--footer-naslov-fs`).

## Napomena o proveri

Tokom snimanja (`slikaj-temu.mjs`) Vite HMR ponekad ponovo učita stranicu jer
druge teme paralelno menjaju fajlove (npr. `src/index.css`, `src/teme/menhetn/*`) —
tada snimak „skoči” na vrh stranice. To nije greška teme; ponovljeno snimanje je čisto.
