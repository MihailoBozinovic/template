# hjuston — potrebne zajedničke izmene (van src/teme/hjuston/)

Tema radi i bez ovih izmena (sve je privremeno rešeno u `tema.css` / `komponente.jsx`),
ali su ovo ostaci stare hjuston teme i krhka mesta koja bi trebalo srediti centralno.

## 1. src/index.css — stara pravila za hjuston (obrisati)

```css
[data-tema='hjuston'] .na-foto .akcenat { color: #fff; }
[data-tema='hjuston'] .hover-zum:hover .foto, [data-tema='volstrit'] .hover-zum:hover .foto { filter: none; }
```
- Prvo više nije potrebno (tema nema akcenat preko fotografije).
- Drugo skida crno-beli filter na hover — referenca nema hover na slikama. U `tema.css` je
  poništeno (`.hover-zum:hover .foto { filter: var(--filter-slike); transform: none; }`).
- Predlog: iz drugog selektora ukloniti samo `[data-tema='hjuston'] …` deo (volstrit ostaje).

## 2. Ostale hjuston grane u zajedničkim komponentama (mrtav kod — obrisati)

Tema sada ima sopstveni Header/Logo, Hero, sekcije početne i Footer, pa se ovo više ne izvršava:
- `src/components/Header.jsx` → `Logo`: `'hjuston'` u nizu `verzal` i
  `tema.id === 'hjuston' && 'text-base font-bold tracking-[0.12em] md:text-lg'`.
- `src/components/Footer.jsx` → `tamno = … ['hjuston', 'volstrit', 'menhetn']` — ukloniti `'hjuston'`.
- `src/sekcije/Hero.jsx` → `tema.id === 'hjuston' && <Zvezdice …/>` u `puna-centar`.
- `src/sekcije/Sekcije.jsx` → `centar={tema.id === 'hjuston'}` u `Usluge` i `'hjuston'` u nizu `centar` u `Recenzije`.

## 3. Lepljive trake podstranica vezane za header od 76px (krhko)

- `src/stranice/Cenovnik.jsx:31` i `src/stranice/Zakazivanje.jsx:353`: `sticky top-[76px]`.
- `src/stranice/Zakazivanje.jsx:639`: `pt-[92px] md:pt-[140px]` (računa sa fiksiranim headerom na telefonu).

hjuston ima header od 73px na desktopu, a na telefonu header NIJE fiksiran (u toku je
stranice, fiksiran ostaje samo kvadrat menija 46×40 gore desno). Privremeno u `tema.css`:
```css
[data-tema='hjuston'] .sticky.top-\[76px\] { top: 73px; }
@media (max-width: 767.98px) {
    [data-tema='hjuston'] .sticky.top-\[76px\] { top: 0; padding-right: 76px; }
    [data-tema='hjuston'] #sadrzaj > .pt-\[92px\] { padding-top: 36px; }
}
```
Predlog: u zajedničkom kodu umesto `top-[76px]` koristiti `top-[var(--lepljivo-top,76px)]`, a
umesto `pt-[92px] md:pt-[140px]` `pt-[var(--stranica-pt,92px)] md:pt-[var(--stranica-pt,140px)]`;
tema bi tada zadala promenljive (npr. kroz `razmaci`) umesto selektora po imenima klasa.

## 4. Fontovi

`komponente.jsx` uvozi `@fontsource/cormorant-garamond/700.css` i `700-italic.css`
(podebljana imena u citatima, `font-semibold` na podstranicama). Može da pređe u `src/fontovi.js`.

## 5. Alat za snimke (predlog)

`alati/istrazivanje/slikaj-temu.mjs` otvara meni samo na telefonu; hjuston ima isti meni preko
celog ekrana i na desktopu — korisno bi bilo snimiti `meni-otvoren.jpg` i za desktop.
