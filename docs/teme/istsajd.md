# istsajd — specifikacija po uzoru na Fringe Salon NY

Izvor: `alati/istrazivanje/izlaz/istsajd/{desktop,telefon}` (1440×900 i 390×844). Sajt je Gatsby 3.15 + Semantic UI; bez GSAP-a, Lenisa, Swipera i paralakse. Pop-up dobrodošlice nije deo teme. Prenose se samo dizajnerske odluke, ne tekst, logo, fotografije ni kod.

## 1. Karakter

Topao, komšijski salon sa Menhetna, bez luksuzne poze: bela strana sa punim trakama mente i korala, a tamnoljubičasta je boja za tekst, ne za površine. Naslovi su u mekom, „kaligrafskom” Cormorant Infantu sa svakom rečju velikim početnim slovom, a sve ostalo je u ravnom, prijateljskom Onestu od 16 px. Uglovi su oštri, a jedino su dugmad i polja zaobljena kao pilule. Pokret je skroman: elementi se samo pretope (0,5 s), a karuseli klize.

## 2. Tokeni

**Boje**
| Uloga | Vrednost |
|---|---|
| Pozadina strane | `#FFFFFF` |
| Alternativna sekcija (O nama, Instagram) | menta `#CEE5DC` |
| Akcentna sekcija / footer / dugme | koral `#F6AFA1` |
| Naslovi, nav, dugme-tekst | `#292145` |
| Tekst pasusa (sekcije, footer) | `#000000` (ne ljubičasta!) |
| Nav neaktivan | `rgba(41,33,69,.86)` |
| Hover linka | `#FF765B` |
| Kartica hover/aktivna – pozadina | `#C4E0D5` |
| Kartica hover/aktivna – prsten | `0 0 0 2px #8D3E2B` |
| Strelice tim-karusela | `#F28772` |
| Strelice foto-karusela | krug `rgba(0,0,0,.64)`, ikona `#FFF` |
| Veo preko heroja | `rgba(0,0,0,.35)` |
| Okvir druge stavke u padajućem meniju | `1px solid rgba(41,33,69,.4)` |
| Header | `#FFFFFF`, puna boja, bez senke i blura, isti u svim stanjima |
| Footer | koral `#F6AFA1`, tekst `#000`/`#292145`; donja traka `#000` (procena sa snimka) |

**Fontovi.** Cormorant Infant 400/500/700 i Onest 400/500/700 (to je sve što sajt učitava). Traženih 300 (Onest) i 800 (Cormorant) zato se **iscrtavaju kao 400 i 700**. Preporuka: **`@fontsource/cormorant-infant`** (postoji, ima `cyrillic` i `cyrillic-ext` podskupove) umesto Cormorant Garamonda; Infant ima otvorenije, „pisane” oblike slova (y, g), što je ključno za utisak. Onest (već instaliran) ima ćirilicu.

**Tipografska skala** (veličina / prored / razmak slova / debljina / transformacija)
| Element | Desktop | Telefon |
|---|---|---|
| Hero h1, Cormorant | 64px / 57.14px / normal / 400 / capitalize, bela | 24px / 30px |
| Veliki naslov sekcije (levo, h3) | 48px / 48px / 400 / capitalize | 48px / 48px (isto!) |
| Centriran naslov sekcije (h2) | 34.29px / 41.14px / 800→700 / capitalize | 27.43px / 41.14px |
| Naslov Instagrama | 32px / 32px / 400 | isto |
| Naziv usluge na kartici | 30px / normal / 500 | 27px |
| Ime u timu (preko fotografije, verzal u sadržaju) | 30px / 500 / bela | 27px |
| Naziv lokacije | 24px / 30.86px / 500 | 21.6px / 27.77px |
| Naslov kolone u footeru | 26px / 25.6px / 500, `#000` | isto |
| Nadnaslov (eyebrow), Onest | 16px / 16px / 300→400 / capitalize, `#292145` | isto |
| Tekst | 16px / 25.6px (1.6) / 400, `#000` | isto |
| Adresa, telefon | 16px / 25.6px / 300 | isto |
| Nav | 16px / 16px / 400 | 16px (u meniju) |
| Dugme | 16px / 32px / 400 / capitalize; „Book Now” ls 0.8px | isto |
| Footer linkovi | 15px / 18px; tekst 15px / 25.6px, `#000` | isto |

**Razmaci.** Sekcija: 112px gore i dole (desktop), 48px (telefon). Bočna margina: 48px (desktop), 16px (telefon). Širina sadržaja: 1344px. Uvodni tekst usluga ima max 700px i centriran je. O nama: dve kolone po 652px sa razmakom od 40px. Usluge: 4 kolone po ~325px sa razmakom od ~16px (procena sa snimka). Tim: kolona teksta 383px, kartice 320×400 sa razmakom od 20px (procena sa snimka). Telefon: kartice usluga su visoke 500px, a razmak između njih je 80px.

**Zaobljenja.** Dugme: 40px. Polje: `16px 0 0 16px` (spoljni okvir je pilula, procena sa snimka). Strelica karusela: 18px (krug od 34px). **Fotografije i kartice: 0px.**

**Senke.** Kartica tima na hover: `rgba(0,0,0,.08) 0 0 1rem`. Kartica usluge: prsten `0 0 0 2px #8D3E2B`. Drugih senki nema.

**Fotografije.** Bez filtera, `object-fit: cover`, bez zuma na hover. Fotografije u karuselima imaju ručno nacrtane „scrapbook” okvire (koral/menta, cvetovi u uglovima). To je deo samih slika, ne CSS.

## 3. Komponente

**Header.** Fiksiran, bela pozadina, visina 110px (telefon 100px). Levo je okrugli znak-logo Ø≈72px (procena sa snimka). Nav je **desno**, a ne centriran: 8 stavki, razmak ≈40px (procena sa snimka). „Usluge” ima strelicu i otvara mega-meni od 3 bele kolone; stavke imaju donju liniju i strelicu ›. Aktivna stavka: boja `#292145`, `text-shadow: 0 0 1px #292145` (lažni bold) i podvlaka ≈2px ispod (`::before` sa `transform: scaleX(0→1)`). Desno su dve koral pilule visine 42px: „Zakaži ▾” i „Poklon-kartice”. „Zakaži ▾” je padajući meni **po lokaciji**: bele stavke, padding `13.6px 16px`, radius 0, tekst `rgba(41,33,69,.86)`, tranzicija `color, background, text-shadow .75s`. Header je isti na vrhu, posle skrola i pri skrolu nagore (procena sa snimka): nema sakrivanja ni promene boje.

**Mobilni meni.** `fixed`, ceo ekran 390×844, bela pozadina, **bez animacije**: snimci „tokom otvaranja” i „otvoren” su identični. Stavke su Onest 16px/400 `rgba(41,33,69,.86)`, poravnate levo (x≈20px) u redovima od ≈48px (procena sa snimka). Aktivna stavka ima podvlaku. „Usluge” je harmonika sa strelicom. Ispod su koral pilule „Zakaži ›” i „Poklon-kartice”, a gore desno je ✕. Header na telefonu: logo levo, a desno tri ikonice `#292145` (telefon, kalendar = zakazivanje, hamburger), bez tekstualnog dugmeta.

**Hero.** Video preko cele širine sa velom `rgba(0,0,0,.35)`, **ispod** headera. Visina je 810px na desktopu (≈`100vh − 90px`), a na telefonu samo **219px (16:9)**. Sadržaj je centriran po obe ose: h1, podnaslov (Onest 16/25.6, bela) i koral pilula „Zakaži ▾” sa izborom lokacije. Nema slajdera ni nadnaslova.

**Redosled početne strane**
1. **Usluge** (bela): centriran bold h2, uvodni pasus (max 700px, centriran) i 4 kartice u redu. Kartica: kvadratna fotografija (≈325×343, procena sa snimka), ispod nje Cormorant 30px naziv levo i strelica → desno. Na hover/aktivno kartica dobija pozadinu `#C4E0D5` i prsten 2px `#8D3E2B`, a preko fotografije izlazi sloj sa `backdrop-filter: blur(6px)` i opisom. Na dodirnim ekranima je prsten **uvek** vidljiv. Ispod je centrirana pilula „Saznaj više”.
2. **O nama** (menta): levo nadnaslov, 48px naslov, pasus i pilula; desno karusel fotografija sa tamnim okruglim strelicama na sredini visine.
3. **Recenzije**: pozadinska fotografija (tekstura) sa tamnim velom (procena sa snimka; rezervna boja sekcije je koral). Centriran bold h2 bele boje, **jedna recenzija** po prikazu, centrirana: tekst Onest 16 bele boje, 5 zvezdica + „5 / 5”, autor. Tačkice za stranice i tamne strelice na ivicama. Ispod je bela pilula „Ostavi recenziju” (bela pozadina, tekst `rgba(0,0,0,.64)`).
4. **Tim** (bela): levo kolona od 383px (nadnaslov, 48px naslov, pasus, pilula, koral strelice ← →), desno vodoravni niz portreta 4:5 sa imenom verzalom (Cormorant 30, bela) dole levo. Na hover se natpis podiže: `bottom` 1.5rem → 0.375rem, `opacity` 1.
5. **Instagram** (menta): h2 32px levo i „Prati nas →” desno; karusel od 6 pločica ≈190×260 (procena sa snimka) sa razmakom od 20px; ikonice mreža centrirane ispod, na hover `translateY(-0.5rem)`.
6. **Lokacije** (bela): fotografija levo (652px), desno nadnaslov, 48px naslov, pasus i pilula. Ispod su 2 kartice lokacija u kolonama: naziv Cormorant 24, adresa 300, telefon i radno vreme kao padajuća pilula (okvir 1px `#292145`, dan u boldu).
7. **Footer** (koral).

**Dugmad**
- *Primarno*: pozadina `#F6AFA1`, tekst `#292145`, okvir `1px solid #F6AFA1`, radius 40px, padding `4px 24px`, prored 32px (visina 42px). **Hover**: pozadina `#FFFFFF`, okvir `#CEE5DC`, tekst `#292145`. Tranzicija: `background .5s, border .5s, color .5s, transform .5s` (ease). Izmereno.
- *Na fotografiji*: pozadina `#FFF`, tekst `rgba(0,0,0,.64)`, okvir `#FFF`. Hover: providna pozadina, okvir i tekst beli.
- *Sekundarno* (`.secondary`): hover pozadina `#F6AFA1`, tekst `#292145`.
- *Strelica karusela*: `rgba(0,0,0,.64)`, bela ikona, Onest 18/700, padding 8px, radius 18px, `background .5s, color .5s`. Aktivna: `#F6AFA1`, ikona `#000`.

**Linkovi.** `a:hover { color: #FF765B }`, bez podvlake, tranzicija `color .1s`. Linkovi u markdown tekstu dobijaju bold 700 na hover. Pravne linkove u footeru prati podvlaka.

**Footer.** Pozadina `#F6AFA1`, ≈120px praznog prostora gore (procena sa snimka). U prvom redu levo je naslov newslettera (Cormorant 26) i „Budite u toku”, a desno polje-pilula (okvir 1px `#000`, ikonica slanja). Zatim linija od 1px. Ispod je birač lokacije: crna pilula `#000` sa koral tekstom (Onest 16/500, radius ≈8px, procena sa snimka). Kolone: Kontakt (≈268px), Meni, Info (copyright, pravni linkovi), a desno ikonice mreža i logo na beloj pločici 140×80. Na dnu je crna traka visine 60px.

**Forme.** Polje: pozadina boje okoline, `radius 16px 0 0 16px`, padding 8px, 15px. Checkbox: 16×16, bela pozadina, okvir `1px #292145`, kvačica `#F6AFA1`. Hover stavke u padajućem meniju: `#F2F2F2`.

## 4. Pokret

- **Kriva**: nijedna tranzicija nema `timing-function`, pa je sve `ease`. Karuseli koriste `left 1s cubic-bezier(.42,0,.58,1)` (= ease-in-out).
- **Trajanja**: 0.1s (boja linka, opacity), 0.25s (boja, pozadina, text-shadow), **0.5s** (dugmad, `all`, transform), 0.75s (stavke nav-menija), 1s (boja i pozadina sekcija, karusel).
- **Reveal**: klase `reveal fade slide` imaju 73 elementa na desktopu i 37 na telefonu. Izmerena tranzicija je **`opacity 0.5s 250ms`** (76 elemenata): samo opacity, bez transform-tranzicije. Iako postoji klasa `slide`, pomak se ne animira. Kašnjenje je fiksnih 250ms, **bez kaskade**. Snimak telefona 09 hvata naslov koji je napola providan, na svom mestu.
- **Karuseli**: O nama, Recenzije (sa tačkicama), Instagram (6 vidljivih), Tim (vodoravni skrol sa strelicama). Klizanje traje 1s ease-in-out.
- **Hover**: ikonice `translateY(-.5rem)` za .5s; natpis kartice tima se podiže; sloj sa blurom 6px na kartici usluge.
- **Paralaksa, glatki skrol, prelaz stranica, Ken Burns**: nema ih.
- **Telefon**: isti pokret, ali je stanje kartice „aktivno” stalno uključeno (`is-touch-screen-device`), a meni se otvara bez animacije.

## 5. Telefon (390px)

- Header je visok 100px; desno su ikonice telefona i kalendara i hamburger.
- Hero je 390×219 (16:9); h1 je 24/30px, centriran, sa pilulom ispod.
- Centrirani h2 je 27.43px, a veliki h3 **ostaje 48/48px**.
- Usluge su u jednoj koloni, 358px, visine 500px, sa razmakom od 80px. Naziv je 27px, a prsten je uvek vidljiv.
- Sekcije imaju 48px vertikalno i 16px bočno.
- O nama i Lokacije: prvo tekst ili fotografija, pa drugo, u jednoj koloni.
- Tim: kartice ≈200×190 (procena sa snimka) se skroluju vodoravno, ime i uloga se skraćuju sa „…”, a „Upoznaj tim” i koral strelice su u istom redu.
- Instagram: naslov je centriran, „Prati nas →” je desno ispod, prikazana je 1 pločica, a strelice prelaze ivice.
- Footer: prvo logo-pločica, pa newsletter, polje preko cele širine, birač lokacije i kolone jedna ispod druge; ikonice su centrirane.

## 6. Mapiranje na naš šablon

### (a) Objekat teme

```js
istsajd: {
    naziv: 'Ist Sajd',
    inspiracija: 'Fringe Salon NY',
    opis: 'Komšijski salon: bela, menta i koral, Cormorant Infant + Onest, oštre fotografije i pill dugmad, tiho pretapanje.',
    tamna: false,
    boje: {
        paper: '#FFFFFF', ink: '#292145', mist: '#CEE5DC', povrsina: '#FFFFFF',
        brand: '#F6AFA1', naBrand: '#292145', linija: '#292145', tamna: '#292145', akcenat: '#F6AFA1',
        tekst: '#000000', linkHover: '#FF765B', karticaAktivna: '#C4E0D5', prstenKartice: '#8D3E2B',
        strelice: '#F28772', veoHeroja: 'rgba(0,0,0,.35)',
    },
    fontovi: {
        naslov: '"Cormorant Infant", "Cormorant Garamond", Georgia, serif',
        tekst: 'Onest, system-ui, sans-serif', oznaka: 'Onest, system-ui, sans-serif',
        logo: '"Cormorant Infant", "Cormorant Garamond", Georgia, serif',
    },
    naslov: {
        tezina: 400, transform: 'capitalize', razmak: '0', visina: 1.0, skala: 0.93, akcenat: 'nista',
        velicine: { hero: 'clamp(1.5rem, 4.45vw, 4rem)', 2: '3rem', 3: 'clamp(1.6875rem, 2.1vw, 1.875rem)' },
        centar: { tezina: 700, velicina: 'clamp(1.714rem, 2.38vw, 2.143rem)', visina: 1.2 },
    },
    oznaka: { transform: 'capitalize', razmak: '0', velicina: '1rem', tezina: 400 },
    tekst: { tezina: 400, velicina: '1rem', visina: 1.6 },
    dugme: {
        oblik: 'pill', stil: 'puno', padding: '4px 24px', prored: '32px', tezina: 400,
        hover: { pozadina: '#FFFFFF', okvir: '#CEE5DC', tekst: '#292145' },
    },
    radius: { kartica: '0px', slika: '0px', polje: '16px' },
    header: {
        tip: 'pun', logo: 'levo', posleSkrola: 'paper',
        visina: '110px', visinaTelefon: '100px', nav: 'desno', blur: false,
        zakaziPoLokaciji: true, ikoniceTelefon: true,
    },
    hero: 'puna-centar',
    heroIspodHeadera: true, heroVisina: 'calc(100svh - 90px)', heroOdnosTelefon: '16 / 9',
    usluge: 'kartice',
    uslugeRaspored: { kolone: 4, odnos: '1 / 1', prsten: true, centrirano: true },
    sekcije: { padding: '112px', paddingTelefon: '48px', gutter: '48px', gutterTelefon: '16px' },
    pocetna: ['hero', 'usluge', 'oNama', 'recenzije', 'tim', 'galerija', 'lokacije'],
    recenzije: 'karusel-foto',
    tim: 'vodoravno',
    footer: { pozadina: 'brand', newsletter: true },
    meni: { stil: 'tekst', kaskada: false },
    slike: { filter: 'none' },
    pokret: {
        easing: 'ease', brzo: '0.25s', srednje: '0.5s', sporo: '0.75s',
        reveal: 'fade', revealPomak: '0px', revealTrajanje: '0.5s', revealKasnjenje: '0.25s', stagger: 0,
        heroEfekat: 'nista', heroTrajanje: '0s', heroPrelaz: 1000,
        karusel: { trajanje: '1s', kriva: 'cubic-bezier(.42,0,.58,1)' },
        hoverSlika: 1, linkHover: 'podvuci', marquee: 40, marqueePauza: false,
        paralaksa: 0, glatkiSkrol: false, prelazStranice: 'nista',
    },
},
```

### (b) Nove mogućnosti (po vizuelnom uticaju)

1. **`heroIspodHeadera` + `heroVisina` + `heroOdnosTelefon`**: `puna-centar` počinje ispod punog headera (`pt` = visina headera, izbaciti iz `HEROJ_ISPOD_HEADERA`). Visina je `calc(100svh − 90px)`, a na telefonu `aspect-ratio: 16/9` (ne 100svh). Veo je `boje.veoHeroja`, umesto `veo-ravan`. Podržati `<video>` kad se zada `h.video`.
2. **`footer.pozadina: 'brand'`**: koral footer; kad je `newsletter: true`, red sa poljem-pilulom i linijom ispod.
3. **`dugme.hover` / `padding` / `prored` / `tezina`**: promenljive `--dugme-hover-bg/-okvir/-tekst` i `--dugme-padding`; tranzicija `background, border-color, color, transform` na `var(--t-srednje)`. Ukloniti hover u boju tinte za ovu temu.
4. **`naslov.velicine`**: posebna veličina po nivou (`--naslov-hero`, `--naslov-2`, `--naslov-3`) koja zamenjuje `clamp × skala`. **`naslov.centar`**: kad je `ZaglavljeSekcije` `centar`, bez nadnaslova i debljine 700. `centrirano` uključuje taj oblik za Usluge i Recenzije.
5. **`header.nav: 'desno'`, `visina`, `blur: false`**: nav uz desnu ivicu, header 110/100px, puna bela bez `backdrop-filter`. `--header-visina` iz teme.
6. **`header.zakaziPoLokaciji`**: „Zakaži ▾” otvara listu `salon.lokacije[].zakaziLink`. Važi u headeru, heroju i meniju.
7. **`recenzije: 'karusel-foto'`**: jedna centrirana recenzija preko fotografije sa velom, tačkice, okrugle strelice `rgba(0,0,0,.64)`, klizanje `karusel.trajanje/kriva`.
8. **`tim: 'vodoravno'`**: kolona teksta od 383px i vodoravni niz portreta 4:5 sa imenom (verzal) preko fotografije; strelice u boji `boje.strelice`; natpis na hover `bottom 1.5rem → .375rem`. Bela pozadina (ne `bg-mist`).
9. **`uslugeRaspored`**: 4 kolone, kvadrat, ispod naziv i strelica →. `prsten`: hover `box-shadow 0 0 0 2px prstenKartice` + pozadina `karticaAktivna` + sloj sa `backdrop-filter: blur(6px)` i opisom; na `(hover: none)` uvek uključeno.
10. **`pocetna` (redosled i izbor sekcija)**: bez Izjave, Brendova, Zašto mi i Završnog poziva. Nova sekcija **Lokacije** (fotografija + tekst + kartice lokacija sa padajućim radnim vremenom).
11. **`sekcije.padding` / `gutter`**: `--sekcija-py` (112/48px) i `--gutter` (48/16px) umesto `py-20 md:py-28` i `px-5 md:px-10`.
12. **`boje.tekst`, `boje.linkHover`**: pasusi `#000`, naslovi `ink`; `a:hover` `#FF765B`.
13. **`pokret.revealKasnjenje`**: osnovno kašnjenje (`--kasnjenje: calc(0.25s + i*stagger)`).
14. **`meni: { stil: 'tekst', kaskada: false }`**: stavke Onest 16px umesto `naslov-2`, bez `.meni-stavka` animacije, sa pilulama ispod. **`header.ikoniceTelefon`**: ikonice telefona i kalendara pored hamburgera.
15. **`radius.polje`**: polje-pilula (`.polje` radius iz teme).
16. Aktivni nav: `text-shadow: 0 0 1px currentColor` + podvlaka 2px (`data-link='podvuci'`, debljina iz teme). Ukloniti posebno pravilo `[data-tema='istsajd'] .link-nav` iz `index.css`.

### (c) Šta trenutna tema radi pogrešno

- **Hero `split`** sa zaobljenom fotografijom: referenca ima video preko cele širine, centriran tekst i veo .35 ispod belog headera.
- **Zaobljenja 18/16px** na karticama i fotografijama: u referenci su **0px**.
- **Hover dugmeta** prelazi u ljubičastu pozadinu: u referenci prelazi u **belu pozadinu sa okvirom u boji mente**.
- **`akcenat: 'kurziv'`**: referenca nema kurziv. Naslovima nedostaje `capitalize`, a debljina je 500 umesto 400 (veliki) i 700 (centrirani).
- **Nadnaslov** 0.95rem/500/0.02em: u referenci je 16px, 300→400, `capitalize`, bez razmaka slova.
- **Tekst 300 u ljubičastoj**: u referenci je 400, `#000`, prored 1.6.
- **Reveal** `slide` 40px / 0.9s / kaskada 0.1: u referenci je **samo opacity 0.5s sa 250ms kašnjenja**, bez kaskade.
- **`linkHover: 'boja'`** + koral podvlaka: nav u referenci ima ljubičastu podvlaku i lažni bold, a obični linkovi prelaze u `#FF765B`.
- **Header** sa blurom, visine 76px, nav u sredini: u referenci je 110px, ravno beo, nav desno, dve pilule i zakazivanje po lokaciji.
- **Footer** u boji mente: u referenci je **koral**.
- **Tim** kao mreža na menti: u referenci je vodoravni niz na beloj pozadini.
- **`hoverSlika 1.04`**: referenca nema zum; umesto njega ima prsten i blur sloj.
- **Marquee sa pauzom**: u referenci nema marquee.
- **Mobilni meni** sa velikim serifnim slovima i kaskadom: u referenci je mali Onest i otvara se bez animacije.
- Font je **Cormorant Garamond** umesto Cormorant Infanta.
- Razmaci na telefonu su 80px/20px, a u referenci 48px/16px.
