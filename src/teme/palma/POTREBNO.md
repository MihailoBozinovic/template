# palma — predlozi zajedničkih izmena

Sve je rešeno unutar `src/teme/palma/`; ovo su izmene van fascikle koje bi
uklonile zaobilaznice ili mrtav kod. Ništa od ovoga nije neophodno da tema radi.

1. **`src/components/Header.jsx` → `Logo`**: grana
   `tema.id === 'palma' && 'text-base font-semibold tracking-[0.04em] md:text-xl'`
   (i `'palma'` u nizu `verzal`) više se ne koristi — palma ima svoj logo
   (`PalmaLogo`, Oswald 600 preko `tipografija.logo`). Te Tailwind klase bi
   pregazile `--logo-fs`, pa ih treba obrisati za palmu.

2. **`src/index.css`, red ~124**:
   `[data-tema='palma'] .dugme-primarno:hover:not(:disabled) { background: transparent; color: rgb(var(--c-ink)); }`
   je suprotno specifikaciji (obris se na hover popunjava). Tema to poništava u
   `tema.css`; predlog: izbaciti `[data-tema='palma']` iz tog selektora.

3. **`src/sekcije/Hero.jsx`, grana `dupla`**: pravljena za staru palmu
   (`pt-[76px]`, kvadrati `min(62%,26rem)`, paralaksa, h1 blok ispod). Palma
   sada ima svoj `Hero` (polja 57 % × .835, polovine 720/761). Ako grana ostaje
   za druge teme — u redu; inače može da se uprosti ili obriše.

4. **Lepljive trake na podstranicama** (`Cenovnik.jsx` red 31,
   `Zakazivanje.jsx` red 353) imaju `top-[76px]` zakucano. Palma ima header
   80 / 46 px i to rešava sa `[data-tema='palma'] .top-\[76px\] { top: var(--header-h) }`.
   Predlog: `top-[var(--header-h,76px)]` u tim stranicama.

5. **Prigušen sitan tekst na zajedničkim stranicama** (`opacity-60` /
   `opacity-55` na `.nadnaslov`, „od”, trajanje, koraci zakazivanja): sa
   papirom #FAFAF8 i tekstom #252523 to je 4.1 : 1 (< 4.5). Palma to diže na
   .67 sa `[data-tema='palma'] main .opacity-50/55/60`. Predlog: zajednička
   promenljiva `--prigusen` (podrazumevano .6, tema je može podići) umesto
   fiksnih `opacity-60` klasa.

6. **Opcioni font**: `@fontsource/inter-tight` (ćirilica ✓) bliži je
   SF Pro Display na velikim veličinama (spec, §2). Nije instaliran — tema
   koristi Inter 400.

7. **`alati/istrazivanje/slikaj-temu.mjs`**: kad na zadatom portu već radi
   drugi Vite server (npr. pokrenut ranije), skripta ne javlja grešku nego
   snima taj server, a u `greske.txt` stigne
   `WebSocket connection to 'ws://localhost:<port>/' failed` (HMR klijent).
   To nije greška teme. Predlog: proveriti da je spawn uspeo (izlaz procesa)
   ili ignorisati poruke `WebSocket connection to 'ws://localhost`.
