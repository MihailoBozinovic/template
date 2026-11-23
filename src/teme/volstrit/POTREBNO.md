# volstrit — potrebne zajedničke izmene

Sve navedeno je privremeno rešeno u `src/teme/volstrit/` (tema.css / komponente.jsx);
predlozi su da se rešenje prenese u zajednički kod i da se ukloni zaobilaženje.

## 1. `src/index.css` — staro volstrit pravilo za hover fotografije
- Gde: `[data-tema='hjuston'] .hover-zum:hover .foto, [data-tema='volstrit'] .hover-zum:hover .foto { filter: none; }`
- Zašto: volstrit više nema crno-bele fotografije van heroja (`slike.filter: 'none'`, `heroFilter: 'grayscale'`) niti hover efekte.
- Predlog: izbaciti `[data-tema='volstrit'] .hover-zum:hover .foto` iz liste (ostaje samo hjuston).

## 2. `src/index.css` — reveal `'nista'`
- Gde: `.js .pojava { opacity: 0; … }` važi za sve teme, i kad je `pokret.reveal: 'nista'`.
- Zašto: statične teme moraju da gase reveal sa `!important` (volstrit to radi u tema.css).
- Predlog:
  ```css
  .js [data-reveal='nista'] .pojava, .js [data-reveal='nista'] .reci-anim .rec > span { opacity: 1; transform: none; transition: none; }
  [data-reveal='nista'] .ulaz-odmah, [data-reveal='nista'] .reci-odmah .rec > span, [data-reveal='nista'] .animate-fade-up { animation: none; }
  ```

## 3. Prigušen tekst providnošću ne prolazi 4.5:1 kad je `ink` svetliji
- Gde: `opacity-55/60/65/70` na tekstu u `Cenovnik.jsx`, `Zakazivanje.jsx`, `IzborJezika` (delovi.jsx), `.dugme:disabled` (`color: ink / .72`).
- Zašto: sa `ink: #3B3B3B` (izmereno sa reference) daje 2.7–4.2:1 na `#F5F5F5`.
- Privremeno: tema.css podiže te klase na `opacity: .78` (≥ 5:1) i neaktivno dugme na `ink / .88`.
- Predlog: zajednička promenljiva `--c-prigusen` (tema je zadaje, npr. `boje.telo`) umesto `opacity-*` na tekstu; `.dugme:disabled { color: rgb(var(--c-ink) / .85) }`.

## 4. Podstranice računaju sa fiksnim headerom od 76px
- Gde: `Zakazivanje.jsx` (`pt-[92px] md:pt-[140px]`, `sticky top-[76px]`, `sticky top-28`), `Cenovnik.jsx` (`sticky top-[76px]`, `lg:top-44`, `scroll-mt-40`), `Kontakt.jsx` (`lg:top-28`), `NijePronadjeno.jsx`/uspeh zakazivanja (`pt-28`).
- Zašto: volstrit header je statičan (`position: absolute`, 61px / 84px) — lepljivi delovi ostavljaju prazninu od 76px, a zaglavlje zakazivanja na telefonu dolazi 8px ispod headera od 84px.
- Privremeno: tema.css prepisuje te klase (`top: 0` / `1.5rem`, `padding-top: calc(var(--header-h) + …)`).
- Predlog: `pt-[calc(var(--header-h,76px)+1rem)]` i nova promenljiva `--sticky-vrh` (podrazumevano `var(--header-h, 76px)`, statični header je postavlja na `0px`) za sve `sticky top-*`.

## 5. `Logo` u `src/components/Header.jsx` ignoriše `tipografija.logo`
- Gde: Tailwind klase `text-[1.55rem] md:text-[1.7rem]` i `tema.id === 'volstrit' && 'tracking-[0.06em]'` na `<span>` imaju prednost nad `--logo-fs/-ls`.
- Privremeno: volstrit ima svoj `LogoVS` u komponente.jsx.
- Predlog: veličinu/razmak uzimati iz `--logo-fs`/`--logo-ls` kad postoje; izbaciti volstrit iz liste posebnih slučajeva.

## 6. Ostaci volstrit grana u zajedničkim komponentama (više se ne koriste)
- `Footer.jsx`: `['hjuston', 'volstrit', 'menhetn']` u `tamno`; `Sekcije.jsx` (`Recenzije`): `['hjuston', 'volstrit', 'holivud']` u `centar`; `Header.jsx` `Logo`: `verzal` lista. Volstrit ima svoj Footer/Header i ne prikazuje Recenzije — `'volstrit'` se može izbaciti iz tih lista.

## 7. `alati/istrazivanje/proveri-kontrast.mjs` — delimično prekriven tekst
- Gde: `TEKSTOVI()` proverava prekrivenost samo u 3 tačke na srednjoj liniji teksta.
- Zašto: pasus čiji donji redovi zalaze ispod fiksne trake na dnu (info-traka) meri se, pa donji uzorci padnu na traku → lažnih 1.3:1.
- Privremeno: info-traka volstrit teme prikazuje se samo na početnoj (prvi ekran je hero), ne i na podstranicama.
- Predlog: proveravati i tačke na `r.top + 2` i `r.bottom - 2` (tekst se tada meri kad je slobodan); posle toga traka može na sve strane osim zakazivanja (komponente.jsx, `InfoTraka`: uslov `!== 'pocetna'` → `=== 'zakazivanje'`).

## 8. `vite.config.js` uvozi `src/config/teme.js` (→ sve `src/teme/*/tema.js`)
- Zašto: Vite prati zavisnosti konfiguracije, pa svaka izmena bilo kog `tema.js` (druge teme rade paralelno) restartuje dev server; `slikaj-temu.mjs` tada u `greske.txt` upiše `WebSocket connection to 'ws://localhost:<port>/' failed` (HMR klijent), iako stranica nema grešku.
- Predlog: u `upisTeme` validirati id preko `fs.readdirSync('src/teme')` umesto uvoza `TEME`; ili u `slikaj-temu.mjs` ignorisati poruke `WebSocket connection to 'ws://localhost`.
