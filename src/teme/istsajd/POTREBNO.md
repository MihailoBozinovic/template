# istsajd — potrebne zajedničke izmene (van src/teme/istsajd/)

Sve stavke su privremeno rešene u `src/teme/istsajd/tema.css`; kad se zajednički kod
popravi, odgovarajuće pravilo iz tema.css može da se obriše.

1. **`src/index.css`, red ~166 — ukloniti staro pravilo teme:**
   ```css
   [data-tema='istsajd'] .link-nav:hover, [data-tema='istsajd'] .link-nav[aria-current='page'] { … text-decoration: underline; text-decoration-color: rgb(var(--c-brand)); … }
   ```
   Zašto: tema više ne koristi `.link-nav` u headeru (nav je `.ist-nav-link` sa lažnim boldom i
   podvlakom od 2px u boji tinte, po referenci); koral podvlaka je pogrešna. Sada poništeno u tema.css
   (pravilo „Staro pravilo iz src/index.css”).

2. **Visina headera je u zajedničkim stranicama zakucana na 76px.** Tema ima header od 110px
   (telefon 100px) i postavlja `--header-h` (razmaci.header). Predlog:
   - `src/stranice/Cenovnik.jsx:31` i `src/stranice/Zakazivanje.jsx:353`: `top-[76px]` → `top-[var(--header-h,76px)]`
   - `src/stranice/Zakazivanje.jsx:639`: `pt-[92px] md:pt-[140px]` → `pt-[calc(var(--header-h,76px)+16px)] md:pt-[calc(var(--header-h,76px)+64px)]`
   - `src/stranice/Kontakt.jsx:57` (`lg:top-28`) i `src/stranice/Zakazivanje.jsx:654` (`top-28`) →
     `top-[calc(var(--header-h,76px)+24px)]`

3. **Bočna margina na telefonu je zakucana na 20px** (`-mx-5 … px-5`) u `src/stranice/Zakazivanje.jsx:353, 354, 451`;
   tema ima `--gutter` 16px, pa je stranica bila šira od ekrana (394px na 390px). Predlog:
   `-mx-5 px-5` → `-mx-[var(--gutter,1.25rem)] px-[var(--gutter,1.25rem)]` (i `scroll-px-5` isto).

4. **Prigušen tekst `opacity-60` na zajedničkim stranicama** (cenovnik: trajanje, „od”, „Za koga?”;
   zakazivanje: koraci, „Izabrano”, „Ukupno”; o nama: „Radimo sa profesionalnim linijama”) daje sa
   tintom `#292145` samo 4.14:1 na beloj. Predlog: umesto providnosti boja `rgb(var(--c-telo, var(--c-ink)) / .7)`
   ili nova promenljiva `--prigusen: .6` koju tema može da podigne. Sada: `main .opacity-60 { opacity: .7 }` u tema.css.

5. **`pokret.revealKasnjenje` (novo polje teme)** — `Pojava` i `Naslov` u `src/components/primitivi.jsx`
   računaju `--kasnjenje` samo iz `i * stagger`. Predlog:
   `'--kasnjenje': \`${(parseFloat(tema.pokret.revealKasnjenje ?? 0) + i * tema.pokret.stagger).toFixed(2)}s\``.
   Sada: `[data-tema='istsajd'].js .pojava { transition: opacity .5s ease .25s }` u tema.css
   (i `.ulaz-odmah` / `.animate-fade-up` kao čisto pretapanje bez pomaka).

6. (Po želji) **`cssTeme` prihvata samo hex boje** — `boje.veoHeroja: 'rgba(0,0,0,.35)'` se tiho preskače.
   Podrška za rgba (→ `--c-veo-heroja: 0 0 0 / .35` ili sirova vrednost) bi omogućila veo iz teme bez CSS-a.

7. (Po želji) **Video u heroju** — tema podržava `salon.pocetna.hero.video` (putanja do .mp4 u public/,
   prve slike su poster). U `src/config/salon.js` to polje ne postoji; može se dokumentovati u komentaru heroja.
