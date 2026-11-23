# volstrit — specifikacija (po uzoru na Fabio Doti Salon, Squarespace)

Izvor: Playwright merenje 1440×900 i 390×844 (`alati/istrazivanje/izlaz/volstrit/`). Vrednosti su computed style / Squarespace tweak JSON; „(procena sa snimka)” = očitano sa slike. Kopiraju se samo dizajnerske odluke — ne tekst, logotipi ni fotografije.

## 1. Karakter

Hladan, uzdržan njujorški „financial district” salon: sivobela podloga `#F5F5F5`, grafitni Didone verzal i nijedan ukras. Jedini kontrast su crno-beli hero sa kosom donjom ivicom i četiri tamne studijske fotografije **u boji** sa serifnim natpisom. Sajt je statičan: bez reveal animacija, bez hovera, bez paralakse, header nije fiksiran.

## 2. Tokeni

### Boje po ulozi
| Uloga | Vrednost |
|---|---|
| Podloga stranice i headera | `#F5F5F5` |
| Naslovi, nav, ikonice | `#3B3B3B` |
| Telo teksta i serifni „lead” (h2) | `rgba(0,0,0,.6)` ≈ `#626262` na podlozi |
| Tekst na fotografiji (hero, pločice) | `#F5F5F5` |
| Dugme | pozadina `#C0BFAA`, tekst `#000000`, okvir 0 |
| Footer | pozadina `#1C1C1C`, tekst `rgba(245,245,245,.61)` ≈ `#A0A0A0` |
| Stavke mobilnog menija | `rgba(59,59,59,.85)` ≈ `#575757` |
| Info-traka (telefon) | ≈ `#222222`, tekst `#FFFFFF` (procena sa snimka) |

### Fontovi
| Uloga | Referenca | Kod nas | Ćirilica |
|---|---|---|---|
| Naslovi | Bodoni Moda 400 | Bodoni Moda → rezerva Playfair Display | BM nema, PD ima |
| Nav, dugmad, meni | futura-pt 500/600 | **Jost** | ima |
| Telo | Poppins 400 | Poppins → rezerva Jost | P nema, Jost ima |
| Freight Big Pro | učitan, na početnoj se ne koristi | Cormorant Garamond (ako zatreba) | ima |

Novi `@fontsource` nije potreban: Jost pokriva Futuru i ćirilicu, Playfair Display je postojeća ćirilička rezerva za Bodoni.

### Tipografska skala
| Element | Desktop 1440 | Telefon 390 | Zajedničko |
|---|---|---|---|
| Hero h1 | 72.906px / lh 82.512 (1.1317) / ls 1.458px | 48.767 / 55.193 / 0.975 | Bodoni 400, uppercase, ls .02em, centrirano |
| Veliki naslov levo (h1) | isto kao hero | isto | boja `#3B3B3B`, levo |
| h2 lead / natpis pločice | 30.824 / 38.789 (1.258) / 0.616 | 24.102 / 30.331 / 0.482 | Bodoni 400, uppercase, ls .02em |
| Podnaslov heroja | Poppins 20.456 / 32.730 (1.6) | 18.026 / 28.841 | ls 0.305px, `#F5F5F5` |
| Telo | Poppins 15.272 / 24.435 (1.6) | 14.987 / 23.980 | ls .02em |
| Nav | Jost 12.934 / 600 / lh 23.281 (1.8) / ls 0.776px (.06em) | (u meniju, v. §3) | uppercase, `#3B3B3B` |
| Dugme | Jost 10.901 / 500 / ls 3.270px (.3em) | 12.425 / ls 3.728 | uppercase |
| Footer | Poppins 15.272 / 1.6 | 14.987 | linkovi podvučeni |
| Nadnaslov (eyebrow) | ne postoji | — | — |

Fluidne vrednosti (linearno 390→1440): hero/h1 `clamp(3.048rem, 2.488rem + 2.299vw, 4.557rem)`; h2/h3 `clamp(1.506rem, 1.351rem + 0.64vw, 1.927rem)`; podnaslov `clamp(1.127rem, 1.07rem + 0.231vw, 1.279rem)`; telo `0.95rem`.

### Razmaci
- Hero: padding `61.016px / 86.4px` (gore = visina headera, strane 6vw); telefon `83.781px / 23.4px` (6vw).
- Sadržaj desktop: bočni rub 37px (≈2.57vw), širina headera „Full”; telefon 23.4px (6vw), kolona 343px.
- Pločice: razmak 11px (370→381).
- Dve kolone: leva 37→~710, desna 725→1403 (razmak ~15px, procena sa snimka).
- Vertikalno desktop: hero→pločice 48px; pločice→blok naslova ~180px (procena sa snimka); logotipi→footer 48px.
- Vertikalno telefon: hero→1. pločica 28px; pločice 11px, pa 53px, 52px; →naslov 87px; naslov→lead 11px; →logotipi 81px; logotip→logotip 11px; →footer 28px.

### Radijusi i fotografije
- Svi radijusi 0px (slike, dugmad).
- Hero: crno-bela fotografija; `filter: none` — fotografija je već crno-bela, bez vela.
- Pločice i logotipi: `filter: none`, **u boji**, bez vidljivog vela (tamna studijska pozadina daje kontrast).

## 3. Komponente

**Header (desktop)** — visina 61px = 2 × 0.8vw (`header-vert-padding`) + logo 38px; `position: absolute`, pozadina `#F5F5F5`, bez senke i okvira. Logo-wordmark (slika 260×38) levo na x=37; nav **centriran** (SERVICES je padajuća fascikla, ABOUT, STAFF, BOOK NOW — zakazivanje je običan nav link, ne dugme), razmak ~19px (procena sa snimka); desno četiri ikonice mreža ~20px, korak ~41px (procena sa snimka). Ponašanje: `tweak-fixed-header: false` — otskroluje se sa stranicom (top −810 pri skrolu 810) i **ne vraća se** pri skrolu nagore. `transition: transform .14s ease-in-out`. Hover nav: bez izmerene promene.

**Mobilni meni** — `position: fixed`, 390×844, pozadina `#F5F5F5`; `transition: visibility .6s cubic-bezier(.4,0,.2,1), opacity .4s cubic-bezier(.4,0,.2,1)`, bez transform-a. Logo ostaje centriran, hamburger (3 tanke linije) postaje tanak X. Stavke centrirane: Jost 33.15px / lh 33.15px / 600 / uppercase / ls 1.079px (.0326em), `rgba(59,59,59,.85)`, korak ~56px (procena sa snimka). Fascikla ima tanku strelicu `>` i otvara podpanel (BACK + usluge). Ikonice mreža na dnu (procena sa snimka).

**Hero** — počinje ispod headera; fotografija puna širina, visina 100svh − header; centriran verzalni serif (2 reda), podnaslov 55px ispod (procena sa snimka). Bez nadnaslova, dugmadi i vela. Donja ivica **kosa** (`has-section-divider`): levo niže, desno ~83px više (≈5.8vw; telefon ~21px ≈5.4vw), uz tanku belu liniju ~3px (procena sa snimka).

**Pločice usluga** — 4 kolone, 333×312 (odnos 1.07), razmak 11px, bez zaglavlja sekcije. Natpis: Bodoni 30.824px, `#F5F5F5`, uppercase, centriran po obe ose. Hover: bez izmerene promene (bez zuma, bez vela).

**Dve kolone** — levo ogroman verzalni naslov (h1, `#3B3B3B`, levo); desno serifni verzalni lead (h2, `rgba(0,0,0,.6)`), ~45px razmak (procena sa snimka), pa dva pasusa tela. Telefon: sve jedno ispod drugog.

**Logotipi brendova** — statični, u levoj koloni ispod naslova, visina 110px (276×110, 218×110), razmak ~30px (procena sa snimka). Bez marquee-a.

**Redosled** — header → hero → [pločice → dve kolone → logotipi] (jedna sekcija `#F5F5F5`) → footer.

**Dugmad** — primarno: `#C0BFAA`/`#000`, 0px radius, bez okvira, Jost 500, .3em, padding `17px 22.1px` (telefon `16px 20.8px`), visina 47px, `transition: opacity .1s linear` → hover = smanjena providnost (iznos nije izmeren, ~.8 procena). Sekundarno: obris (`secondary-button-style-outline`); tercijarno: obris + oblik „underline”.

**Linkovi** — u tekstu i footeru stalno podvučeni, boja nasleđena; hover bez izmerene promene.

**Footer** — `#1C1C1C`, visina 188px (telefon 280px); centriran red linkova (Poppins, podvučeni, razmak ~13px, procena sa snimka), ispod centriran copyright; nema kolona, logotipa ni CTA naslova.

**Forme** — na početnoj nema polja; tema deklariše `form-field-hover-focus-opacity` (hover/fokus menja providnost), checkbox/radio „outline”, boje forme iz teme.

## 4. Pokret

- Globalne Squarespace animacije **isključene** (`tweak-global-animations-enabled: false`, `animation-type: none`); podešenja `fade / ease / 0.1s / delay 0.1s` se ne primenjuju. `fluid-image-animation-wrapper` (6×) dobija samo `animation-loaded` — slike se ne pomeraju.
- Tranzicije: dugme `opacity .1s linear`; header `transform .14s ease-in-out`; meni `opacity .4s` + `visibility .6s`, `cubic-bezier(.4,0,.2,1)`.
- Paralaksa: nema. Keyframes: samo `fonts-loading`. Hover merenja (nav, dugme, 2 pločice): bez razlike.

## 5. Telefon (390px)

- Header 84px (6vw padding), logo 205×30 **centriran**, hamburger desno, bez ikonica mreža.
- Hero ceo ekran (844px), h1 48.767px (5 redova), podnaslov 18.026px.
- Pločice jedna ispod druge, 343×380 (0.90) pa 343×374 (0.92). Natpis se vidi samo na prvoj (procena sa snimka — greška Fluid Engine-a, ne preuzimati).
- Logotipi jedan ispod drugog, 343×129.
- **Info-traka** fiksirana dole, ~64px: tri stavke (Email, Call, Hours), linijska ikona + Helvetica Neue 10px / lh 10px / ls .5px / uppercase / bela; vidi se na vrhu i u meniju, nestaje pri skrolu (procena sa snimka).
- Dugme veće nego na desktopu (12.425px, padding 16/20.8px).

## 6. Mapiranje na naš template

### (a) Objekat teme

```js
volstrit: {
    naziv: 'Volstrit',
    inspiracija: 'Fabio Doti',
    opis: 'Njujorški klasik: sivobela podloga, Bodoni verzal, crno-beli hero sa kosom ivicom, pločice u boji, statičan sajt.',
    tamna: false,
    boje: {
        paper: '#F5F5F5', ink: '#3B3B3B', mist: '#EAEAEA', povrsina: '#FFFFFF',
        brand: '#C0BFAA', naBrand: '#000000', linija: '#3B3B3B', tamna: '#1C1C1C', akcenat: '#C0BFAA',
        telo: '#626262', naFoto: '#F5F5F5', footerTekst: '#A0A0A0', meni: '#575757', infoTraka: '#222222',
    },
    fontovi: { naslov: SERIF_BODONI, tekst: 'Poppins, Jost, system-ui, sans-serif', oznaka: 'Jost, system-ui, sans-serif', logo: SERIF_BODONI },
    naslov: {
        tezina: 400, transform: 'uppercase', razmak: '0.02em', visina: 1.1317, skala: 1, akcenat: 'nista',
        velicine: {
            hero: 'clamp(3.048rem, 2.488rem + 2.299vw, 4.557rem)',
            1: 'clamp(3.048rem, 2.488rem + 2.299vw, 4.557rem)',
            2: 'clamp(1.506rem, 1.351rem + 0.64vw, 1.927rem)',
            3: 'clamp(1.506rem, 1.351rem + 0.64vw, 1.927rem)',
        },
        visina2: 1.258,
    },
    oznaka: { transform: 'uppercase', razmak: '0.3em', velicina: '0.681rem', tezina: 500 },
    nav: { velicina: '0.808rem', tezina: 600, razmak: '0.06em', transform: 'uppercase', visina: 1.8 },
    tekst: { tezina: 400, velicina: '0.95rem', visina: 1.6, razmak: '0.02em', uvod: 'clamp(1.127rem, 1.07rem + 0.231vw, 1.279rem)' },
    dugme: { oblik: 'pravo', stil: 'puno', padding: '17px 22.1px', paddingTelefon: '16px 20.8px', velicinaTelefon: '0.777rem', hover: 'providnost', hoverProvidnost: 0.8 },
    radius: { kartica: '0px', slika: '0px' },
    header: {
        tip: 'staticki', logo: 'levo', logoTelefon: 'centar', posleSkrola: 'nista', nav: 'centar',
        visina: '61px', visinaTelefon: '84px', logoVisina: '38px', logoVisinaTelefon: '30px',
        mreze: true, dugmeZakazi: false, prelaz: 'transform .14s ease-in-out',
    },
    hero: 'puna-centar',
    heroOpcije: { ispodHeadera: true, veo: 0, nadnaslov: false, dugmad: false, kosaIvica: '5.8vw', kosaIvicaTelefon: '5.4vw', linijaIvice: '3px' },
    usluge: 'plocice',
    plocice: { odnos: '333 / 312', odnosTelefon: '343 / 374', razmak: '11px', kolonaTelefon: 1, veo: 0, zaglavlje: false, hover: 'nista' },
    izjava: 'dve-kolone',
    brendovi: 'logotipi',
    footer: 'minimalan',
    razmaci: { strana: '37px', stranaTelefon: '6vw', heroStrana: '6vw', sekcija: '48px' },
    slike: { filter: 'none', heroFilter: 'grayscale' },
    mobilniMeni: {
        velicina: '2.072rem', visina: 1, tezina: 600, razmak: '0.0326em', poravnanje: 'centar',
        prelaz: 'opacity .4s cubic-bezier(.4,0,.2,1), visibility .6s cubic-bezier(.4,0,.2,1)',
    },
    infoTraka: { telefon: true, stavke: ['email', 'poziv', 'radnoVreme'], visina: '64px', sakrijNaSkrol: true },
    pokret: {
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)', brzo: '0.1s', srednje: '0.4s', sporo: '0.6s',
        reveal: 'nista', revealPomak: '0px', revealTrajanje: '0s', stagger: 0,
        heroEfekat: 'nista', heroTrajanje: '0s', heroPrelaz: 0,
        hoverSlika: 1, linkHover: 'nista', marquee: 0, marqueePauza: false,
        paralaksa: 0, glatkiSkrol: false, prelazStranice: 'nista',
    },
},
```
`mist` `#EAEAEA` nije u referenci (izvedeno, samo za rezervne površine fotografija).

### (b) Nove mogućnosti (po vizuelnom uticaju)

1. **`heroOpcije`** — `ispodHeadera`: hero počinje ispod headera (`margin-top: var(--header-visina)`, visina `calc(100svh - header)`), `HEROJ_ISPOD_HEADERA` ga ne sme tretirati kao providan; `veo: 0` uklanja `.veo-ravan`; `nadnaslov/dugmad: false` skrivaju ih; `kosaIvica` = `clip-path: polygon(0 0,100% 0,100% calc(100% - X),0 100%)` na sekciji, plus bela linija `linijaIvice` (pseudo-element iste putanje, pomeren za 3px).
2. **`naslov.velicine`** — CSS promenljive `--naslov-hero/-1/-2/-3` koje, kad postoje, zamenjuju `clamp × skala`; `visina2` za h2/h3.
3. **`slike.heroFilter`** — `--filter-hero`; filter samo na hero fotografiji, ostale u boji (i ukloniti volstrit pravilo `filter: none` na hover).
4. **`plocice`** — `data-plocice-*`: bez zaglavlja i `bg-mist`, `aspect-ratio` iz teme, `gap` 11px, veo 0 (natpis i dalje ≥4.5:1 — merač kontrasta odlučuje da li veo ostaje kao rezerva), hover bez zuma i promene vela, 1 kolona na telefonu.
5. **`izjava: 'dve-kolone'`** — grid 1fr 1fr / razmak 15px: levo `naslov-1`, desno `naslov-2` u boji `telo` + pasusi tela; `brendovi: 'logotipi'` renderuje statične logotipe (visina 110px / 129px na telefonu) ispod leve kolone umesto marquee-a.
6. **`header.tip: 'staticki'`** — `position: absolute` (ne fixed), bez blur-a/senke, pozadina `paper`; `nav: 'centar'` (apsolutno centriran), `mreze: true` (ikonice 20px desno), `dugmeZakazi: false`, `logoTelefon: 'centar'`, visine iz teme.
7. **`footer: 'minimalan'`** — `#1C1C1C`, centriran red podvučenih linkova + copyright, `footerTekst` boja; bez CTA naslova i kolona.
8. **`nav` tipografija** — `--nav-*` odvojeno od `--oznaka-*` (nav .06em/600 ≠ dugme .3em/500).
9. **`mobilniMeni`** — stavke fontom `oznaka` (ne `naslov-2`), centrirane, tok iz teme; fascikla „Usluge” sa strelicom i podpanelom.
10. **`infoTraka`** — fiksna donja traka na telefonu (Email/Poziv/Radno vreme iz `salon.kontakt`), ikonice linijske, sakriva se posle 1. skrola.
11. **Vrednost `'nista'`** za `reveal` (`.pojava` bez opacity 0), `linkHover`, `prelazStranice`, `header.posleSkrola`.
12. **`dugme`** — padding/veličina po uređaju, `hover: 'providnost'` (`opacity` umesto zamene boja), `--tekst-razmak`, `--tekst-visina`.

### (c) Šta trenutna `volstrit` tema radi pogrešno

- `slike.filter: 'grayscale'` gasi boju svuda — u referenci je crno-beo **samo hero**; pločice su u boji.
- `header.tip: 'pun'` je fiksiran, 76px, sa blur-om; referenca: statičan 61px, nav u sredini, ikonice mreža, bez CTA dugmeta.
- `puna-centar` stavlja hero pod providan header, sa velom `.5`, nadnaslovom i dva dugmeta; referenca: ispod headera, bez vela i dugmadi, kosa donja ivica.
- `skala: 1` daje ~92px hero na 1440 (ref. 72.9px) i ~41.6px na telefonu (ref. 48.8px).
- `oznaka` .3em/600 primenjena i na nav; nav je .06em/600, dugme .3em/**500**.
- `naBrand: '#1C1C1C'` → `#000000`; `mist: '#EAEAE6'` nema osnova.
- Pločice: zaglavlje sekcije, `bg-mist`, veo `black/55`, kvadrat, razmak 8–12px, zum i skidanje filtera na hover — referenca nema ništa od toga (1.07, 11px, bez hovera).
- `reveal: 'fade'` 0.6s, `hoverSlika: 1.04`, `linkHover: 'podvuci'`, `prelazStranice: 'fade'` — referenca je bez animacija i bez hover efekata.
- Izjava je jedan naslov `max-w-5xl`; referenca: dve kolone sa ogromnim naslovom levo.
- Brendovi kao tekstualni marquee; referenca: statični logotipi.
- Footer sa CTA naslovom i kolonama; referenca: tamna minimalna traka.
- Mobilni meni koristi serifni `naslov-2`; referenca: Futura/Jost 600 33px centrirano. Nema info-trake.
