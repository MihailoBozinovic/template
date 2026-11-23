# menhetn — predlozi za zajedničke izmene

Ništa od ovoga ne blokira temu (sve je privremeno rešeno u `src/teme/menhetn/`), ali bi trebalo srediti u zajedničkom kodu.

1. **`src/index.css` (oko reda 246): ukloniti zastarelo pravilo**
   `[data-tema='menhetn'] .na-foto .akcenat { color: rgb(var(--c-akcenat)); }`
   Nova tema nema akcentovanu reč (`naslov.akcenat: 'nista'`). Privremeno rešenje: `tema.css` vraća `color: inherit`.

2. **Lepljive trake ispod headera su vezane za 76 px.** U `src/stranice/Cenovnik.jsx` (red 31) i `src/stranice/Zakazivanje.jsx` (red 353) stoji `sticky top-[76px]`. Predlog: `top-[var(--header-h,76px)]`, jer teme sad zadaju visinu headera kroz `razmaci.header`. Privremeno rešenje u temi: `[data-tema='menhetn'] .sticky.top-\[76px\] { top: var(--header-h); }`.

3. **Zakazivanje na telefonu: fiksna traka koraka na dnu (`fixed bottom-0 … lg:hidden`) prekriva kraj footera** (copyright i jezik), jer `pb-24` važi samo za `<main>`. Predlog: dok je traka vidljiva, postaviti `--donja-traka: <visina>px` na `<html>`, a footeri da dodaju `padding-bottom: var(--donja-traka, 0)`. Privremeno rešenje: footer teme na `/zakazivanje` dobija `pb-[120px] lg:pb-10`.

4. **`HeroSlajdovi` (`src/sekcije/Hero.jsx`): tempo, pauza i Ken Burns.**
   - Smena ide na `heroTrajanje × 0.75`; predlog je `pokret.heroInterval + heroPrelaz`, kad je `heroInterval` zadat.
   - Pauza na hover treba da bude opciona.
   - `@keyframes ken-burns` ima fiksno `scale(1.12)`; predlog je `scale(var(--hero-zum, 1.12))`, uz `--hero-zum` iz `pokret.heroZum` u `cssTeme`.

   Tema za sada ima sopstveni slideshow (`Hero.jsx`): CSS prelaz `transform 20s linear` → `scale(1.3)`, kao Elementor Ken Burns.

5. **Brendovi su samo tekst.** Referenca u marquee traci ima logotipe (slike visine 50 px). Predlog: `salon.brendovi` neka prima i `{ naziv, logo: '/slike/brend-x.svg' }`. Tema bi tada prikazivala sliku, a tekst samo kad slike nema. Do tada tema crta nazive brendova različitim instaliranim fontovima, kao „wordmark”.

6. **`alati/istrazivanje/proveri-kontrast.mjs --dev` ume da padne na prvom pokretanju** sa `page.evaluate: Execution context was destroyed`: Vite pri prvom učitavanju optimizuje zavisnosti i osveži stranicu. Ponovno pokretanje prolazi. Predlog: `try/catch` oko `page.evaluate` u petlji, uz ponovni pokušaj posle `waitForLoadState`.

7. **Zakazivanje (`src/stranice/Zakazivanje.jsx`): naslovi koraka imaju `className="naslov naslov-3 m-0 md:naslov-2"`**, ali `md:naslov-2` nije Tailwind klasa i nema efekta. Ako je namera bila veći naslov na desktopu, treba ga rešiti CSS-om.
