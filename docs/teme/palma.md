# palma — po uzoru na Palm Sunday (palmsunday.co)

Izvor: Playwright merenje 1440×900 i 390×844 (`alati/istrazivanje/izlaz/palma/`). Sve bez oznake je izmereno (computed style, CSS pravila, `@keyframes`); „(procena sa snimka)” = očitano sa snimka ekrana. Shopify tema „Impact”; bez GSAP-a, Lenis-a i karusel biblioteka.

## 1. Karakter

Hladan galerijski minimalizam: topli „papir” #FAFAF8, gotovo crna #252523 i ogromni tanki grotesk naslovi stegnuti na `line-height .8` i `-0.04em`. Sav ostali tekst je sitan (12 px) verzal sa `0.04em`, pa razlika u veličini (12 px ↔ 115 px) nosi ceo dizajn. Svetle i tamne sekcije se smenjuju bez senki i zaobljenja (osim pill dugmadi), a život daju skrolom vođene stvari: rasute fotografije sa paralaksom i reči koje se pale pri skrolu.

## 2. Tokeni

**Boje**

| Uloga | Vrednost |
|---|---|
| Pozadina stranice | `#FAFAF8` (250 250 248) |
| Tamne sekcije, footer | `#252523` |
| Kartice (na papiru) | `#FFFFFF` (procena sa snimka) |
| Tekst | `#252523`; na tamnom `#FAFAF8` |
| Prigušen tekst | `rgba(37,37,35,.6)`; na tamnom `rgba(250,250,248,.6)` |
| Krem (header preko fotografije, puno dugme na tamnom) | `#F7F5F0` |
| Hero polje 1 / tekst | neprovidno svetloroze `#FDEDEC` / roze `#DDA09C` (procena sa snimka) |
| Hero polje 2 / tekst | providno sivo-bež `rgba(178,158,152,.6)` / `#F7F5F0` (procena sa snimka) |
| Akcenat | `#F7D5D0` |
| Linije na svetlom | `rgba(37,37,35,.12)` (procena sa snimka) |
| Linije/okvir polja na tamnom | `rgba(247,245,240,.15)` |
| Header | vrh: providan, tekst `#F7F5F0`; posle skrola: `#FAFAF8` (procena), tekst `#252523` |
| Veo za modale | `rgba(0,0,0,.4)` + `backdrop-filter: blur(12px)` |

**Fontovi.** Naslovi: `system_ui` (SF Pro / Segoe UI) 400 → **Inter 400** (ćirilica ✓). Opciono, jedan dodatni paket: `@fontsource/inter-tight` (ćirilica ✓) — bliži SF Pro Display na velikim veličinama. Tekst: Inter 400/500/600. Logo: uzan masni grotesk (slika 140×23 px) → **Oswald 600**, verzal (ćirilica ✓). Reči u heroju i „klub” sekciji su slike u Helvetica tipu → Inter 400, `-0.04em`.

**Tipografska skala** (sajt: `clamp(...) × 0.9`)

| Uloga | Desktop 1440 | Telefon 390 | Formula |
|---|---|---|---|
| Prikaz XL (izjava) | 114.92 / lh 91.94 (.8) | 51.31 / 46.18 (.9) | `clamp(3.15rem, 1.73rem + 6.058vw, 9rem)` |
| Prikaz L (veliki linkovi, „tim”) | 99.47 / 79.58 (.8) | 49.32 / 44.39 (.9) | `clamp(3.0375rem, 1.918rem + 4.777vw, 7.65rem)` |
| h2 sekcije | 70.50 / 63.45 (.9) | 43.58 / 39.23 | `clamp(2.7rem, 2.099rem + 2.563vw, 5.175rem)` |
| h3/h4 (naslovi kartica) | 37.61 / lh 1.0 | 25.37 / 1.0 | `clamp(1.575rem, 1.302rem + 1.165vw, 2.7rem)` |
| Reč u hero polju | ≈118 px (procena) | ≈62 px (procena) | ≈71 % širine polja |

Svi naslovi: 400, `letter-spacing: -0.04em`, `text-transform: none`, normal (verzal samo kad ga piše sadržaj).
Tekst: Inter 12 px / 16.8 (1.4), 400, **verzal**, `0.04em` (telefon 11 / 15.4). Nadnaslov: isto, 12 px, ispred **puni kvadrat ≈8×8 px** i razmak ≈12 px (procena). Nav: 12 px verzal `0.04em`. Dugme: 12 px verzal, `letter-spacing: 0`, lh normal. Footer linkovi: 12.8 / 17.92, verzal, `0.04em`. Veći tekst `--text-lg` 0.9375rem.

**Razmaci.** Kontejner `max-width: 100%`, bočni razmak 3rem (48 px) desktop, 1.25rem (20 px) telefon; header 28 px (procena). Vertikalni razmak sekcija 5.5rem (88 px); telefon ≈3rem (procena). Razmak redova u sekciji 3rem. Mreža kartica: razmak 0.25rem (4 px). Blog/urednička mreža: 2 kolone, razmak 48 px.

**Zaobljenja.** Sve 0; dugme `1.875rem` (30 px); polja 0. **Senke:** nema. **Slike:** `object-fit: cover`, bez filtera, odnosi 0.8 (4:5), 0.75, 1.0, 0.96.

## 3. Komponente

**Header.** `position: sticky; top: 0`, visina 80 px (telefon 46 px), **nikad se ne sakriva** (`transform: none` i pri skrolu nadole i nagore). Desktop: nav levo (8 stavki, razmak ≈24 px, prelama se u 2 reda), logo tačno u sredini, desno izbor valute (salon: jezik) + tanka vertikalna crta + ikonice 20 px. Nema CTA dugmeta: „BOOK” je prva nav stavka. Iznad heroja je providan sa tekstom `#F7F5F0`; posle heroja je pun papir, bez senke, bez blura, bez donje linije. Prelaz `transform .2s ease-in-out, visibility .2s ease-in-out`; boje ≈.2s (procena).

**Mobilni meni.** Ispod headera (header ostaje, hamburger od dve crte → X), panel preko celog ekrana, pozadina `#FAFAF8`, ispod headera linija 1 px (procena). Linkovi: Inter 400, **64 / 64 px, `-2.56px`**, normalna slova (ne verzal), levo, poravnati sa bočnim razmakom. Dno: linija, ikonice mreža, linija, red „jezik … NALOG” (12.8 px verzal). Ulaz: panel se pojavi prazan, pa stavke uđu (procena sa snimka: fade, kaskadno).

**Hero („dupla”).** Dve polovine 50/50, svaka `aspect-ratio: 720/761` (desktop 761 px visine), bez veoa. Na sredini svake polovine je polje širine **57 %**, odnosa **0.835** (šire 410 × više 491 px), centrirano. Polje 1 je neprovidno roze sa roze rečju, polje 2 providno sivo-bež sa krem rečju. Reč je jedna, verzal, ≈71 % širine polja. Cela polovina je link. Nema slajdova, kontrola, teksta ispod ni paralakse. Telefon: polovine jedna ispod druge, 390×412 pa 390×390.

**Početna — redosled (prevedeno na salon):**
1. **Hero dupla**: „USLUGE” | „ZAKAŽI”.
2. **Istaknute usluge** (kod njih proizvodi): 4 kolone, razmak 4 px. Prva ćelija je tamna promo kartica (h3 37.6 px, tekst 12 px, obris-dugme krem) = vaučer/akcija. Ostale su bele kartice: kategorija `.6`, naziv, „od X RSD” `.6`, slika 4:5. Hover: druga slika se pretapa (prva `opacity 0; scale(1.05)`, `.2s cubic-bezier(.4,0,.2,1)`). Telefon: vodoravni skrol, 174 px.
3. **Veliki linkovi** (kategorije): nadnaslov sa kvadratom, pa centrirane reči u Prikaz L, kolona ≈600 px (procena), linije 1 px između. Hover: ostale `opacity .3`. Fotografija stavke se pojavljuje iza reči (reč `z-index: 2`).
4. **„Klub” mreža** (tamna, 686 px): mutna fotografija/video preko cele širine; ogromne bele reči u 3 reda (red 155 px, korak 170 px) i između njih 6 fotografija 123×154 sa paralaksom; krem pill CTA. Salon: galerija + slogan + „Zakaži”.
5. **Tim** (tamna, split): levo fotografija 631×655, uz nju **imena teku vertikalno** (12 px verzal, rotirano 90°); desno centrirano h2 Prikaz L, tekst, obris-dugme krem; padding 48 px.
6. **Urednička lista** (kod njih blog; salon: recenzije): h2 sa **punim kvadratom ispred** (procena 48 px), dugme desno. 2 kolone; unos ima gornju liniju 1 px, 48 px razmaka, sliku 280 px levo, a desno datum sa kvadratom i naslov 37.6 px.
7. **Izjava preko fotografije**: sticky fotografija preko celog ekrana; centrirana rečenica u Prikaz XL se pali reč po reč pri skrolu; sekcija ≈2087 px (≈2.3 ekrana).
8. **Traka prednosti** (tamna, 239 px): 4 kolone sa vertikalnim linijama 1 px; ikonica 24 px, naslov 12 px verzal, tekst `.6`. Telefon: karusel sa crticama (aktivna ≈32 px, ostale ≈16; procena).
9. **Footer**.

**Dugmad.** (a) Obris-pill: okvir 1 px (0.8 px), radius 30 px, visina ≈45 px, padding ≈`0 2.5rem` (procena), 12 px verzal. Na svetlom je ink, na tamnom krem. (b) Puno krem: `#F7F5F0` / ink (na fotografiji i na tamnom). Hover: tekst se kotrlja nagore — `.button__content[up-text]` → `translateY(-100%)`, a kopija ulazi odozdo, `transform .55s cubic-bezier(.19,1,.22,1)`. Pozadina i boja menjaju se za `.2s ease-in-out` (procena: obris se popunjava). Ikonice-dugmad: krug iza `scale(1.2)`.

**Linkovi.** Nav: linija 1 px raste sleva (`background-size 0→100% 1px`, izvor levo); pri izlasku se povlači udesno (vidi se na snimku hover-nav0), ostale stavke se **ne** gase. Tekstualni linkovi (`link-faded-reverse`, 724×): hover → boja `.6`. Liste u footeru: hover jedne → ostale boja `.6`. Veliki linkovi: ostali `opacity .3`. Mreže: ostale `opacity .4`. Podvučeni link u tekstu: linija se povlači udesno na hover.

**Kartice/slike.** Urednička: `transform .8s cubic-bezier(.16,1,.3,1), filter .6s`; hover `scale(1.07) rotate(-1deg)` + `brightness(1.1) contrast(1.05)`. Kartice usluga: pretapanje sa 1.05 (gore). Play dugme `scale 1.1`.

**Footer.** `#252523`, tekst `#FAFAF8`. Iznad je traka prednosti, zatim 3 kolone (prijava/kontakt levo, liste linkova), pa **ogroman logo preko cele širine kontejnera** (1344×215, odnos 6.25), na dnu © i pravni linkovi 12.8 px.

**Forme.** Polje: pozadina boje sekcije, okvir `1px solid rgba(247,245,240,.15)`, radius 0, padding 12 / 16 px (telefon 10.4 / 16), 12 px verzal. Oznaka je placeholder `rgba(247,245,240,.7)`. Fokus: `border-color: currentColor`, bez outline-a. Krem pill dugme stoji uz polje. Razmaci: forma 1.25rem, fieldset .75rem, kontrola .5rem.

## 4. Pokret

- **Krive i trajanja:** dominira `0.2s ease-in-out`; još `0.15s`/`0.3s ease-in-out`, kartice `.2s cubic-bezier(.4,0,.2,1)`, slike `.8s cubic-bezier(.16,1,.3,1)`, dugme `.55s cubic-bezier(.19,1,.22,1)`.
- **Reveal:** opšti nije detektovan. Samo ikonice: `textWithIconsItemsScale` (`opacity 0→1, scale .8→1`; trajanje procena .5s, stagger .1s).
- **Paralaksa ćelija:** 11× `data-parallax-direction=vertical`, `cell-vertical-parallax` od `translateY(-offset)` do `+offset`, vođeno skrolom, linear; ćelije imaju različit pomak (procena: reči 0, fotografije 30/60 px). Postoji i horizontalna varijanta.
- **Reči koje se pale:** svaka reč ide od ≈`.2` do `1` (procena sa snimka), dok je fotografija zalepljena. Klasa `clip-inset` (1×) ukazuje na otkrivanje fotografije `clip-path: inset()` (nije izmereno).
- **Marquee:** imena tima — desktop vertikalno (`md:scrolling-content--vertical`), telefon vodoravno. Brzina nije izmerena (procena 30s po krugu).
- **Glatki skrol:** nema. **Prelaz stranica:** nema. **Prilagođen kursor:** detektovan (verovatno krug, `width/height/background-color .3s`).

## 5. Telefon (390)

Header ima 46 px: levo hamburger (2 crte) i pretraga, logo u sredini 130×21, desno korpa (salon: jezik ili „Zakaži”). Tipografija prema tabeli; tekst 11 px. Prikaz linije prelaze na `lh .9`. Hero polovine idu jedna ispod druge. Kartice usluga i urednička lista postaju vodoravni skrol (kartica 285 px, tanka vertikalna linija između). „Više” dugme ide na punu širinu ispod liste. Tim: slika 350×363, imena vodoravno ispod nje, h2 49 px u jednom redu. Traka prednosti je karusel sa crticama. Footer je u jednoj koloni: polje + krem dugme jedno do drugog. Meni ima linkove od 64 px. Lepljivog CTA nema (samo widgeti trećih strana).

## 6. Mapiranje na naš template

**(a) Objekat teme**

```js
palma: {
    naziv: 'Palma',
    inspiracija: 'Palm Sunday',
    opis: 'Galerijski minimalizam: Inter sa lh .8, sitan verzal, providna polja preko dve fotografije, tamne sekcije, paralaksa ćelija.',
    tamna: false,
    boje: {
        paper: '#FAFAF8', ink: '#252523', mist: '#F7F5F0', povrsina: '#FFFFFF',
        brand: '#252523', naBrand: '#FAFAF8', linija: '#252523', tamna: '#252523', akcenat: '#F7D5D0',
        prekoFoto: '#F7F5F0', poljeJedan: '#FDEDEC', tekstJedan: '#DDA09C', poljeDva: '#B29E98', poljeDvaProvidnost: 0.6,
    },
    fontovi: { naslov: SANS_INTER, tekst: SANS_INTER, oznaka: SANS_INTER, logo: 'Oswald, "Arial Narrow", sans-serif' },
    naslov: { tezina: 400, transform: 'none', razmak: '-0.04em', visina: 0.9, skala: 1, akcenat: 'nista', visinaPrikaz: 0.8, kvadrat: true },
    tipografija: {
        hero: 'clamp(3.15rem, 1.73rem + 6.058vw, 9rem)',
        h1: 'clamp(3.0375rem, 1.918rem + 4.777vw, 7.65rem)',
        h2: 'clamp(2.7rem, 2.099rem + 2.563vw, 5.175rem)',
        h3: 'clamp(1.575rem, 1.302rem + 1.165vw, 2.7rem)',
        meni: '4rem', logo: '1.75rem',
    },
    oznaka: { transform: 'uppercase', razmak: '0.04em', velicina: '0.75rem', tezina: 400, kvadrat: '0.5rem' },
    tekst: { tezina: 400, transform: 'uppercase', velicina: '0.75rem', visina: 1.4, razmak: '0.04em' },
    dugme: { oblik: 'pill', stil: 'obris', okvir: '1px', visina: '2.8125rem', padding: '0 2.5rem', razmak: '0', hoverTekst: 'kotrljanje' },
    radius: { kartica: '0px', slika: '0px', polje: '0px' },
    header: { tip: 'providan', logo: 'centar', posleSkrola: 'paper', visina: '80px', visinaTelefon: '46px', senka: false, cta: 'link', sakrivanje: false },
    hero: 'dupla',
    heroPolja: { sirina: '57%', odnos: 0.835, odnosPolovine: '720 / 761', odnosTelefon: ['390 / 412', '1 / 1'], rec: 0.71 },
    usluge: 'veliki-linkovi',
    galerija: 'rasuta',
    timRaspored: 'split-marquee',
    recenzijeRaspored: 'urednicka',
    izjavaRaspored: 'skrol-reci',
    zastoMiRaspored: 'traka-ikonica',
    footer: { tip: 'tamni', velikiLogo: true },
    redosledPocetne: ['hero', 'istaknuto', 'usluge', 'galerija', 'tim', 'recenzije', 'izjava', 'zastoMi'],
    kontejner: { maks: '100%', razmak: '3rem', razmakTelefon: '1.25rem', sekcija: '5.5rem', sekcijaTelefon: '3rem', mreza: '0.25rem' },
    slike: { filter: 'none' },
    pokret: {
        easing: 'ease-in-out', brzo: '0.2s', srednje: '0.3s', sporo: '0.8s',
        reveal: 'fade', revealPomak: '0px', revealTrajanje: '0.6s', stagger: 0.06,
        heroEfekat: 'nista', heroTrajanje: '0s', heroPrelaz: 0,
        hoverSlika: 1.07, hoverSlikaRotacija: '-1deg', hoverSlikaFilter: 'brightness(1.1) contrast(1.05)',
        hoverSlikaTrajanje: '0.8s', hoverSlikaEasing: 'cubic-bezier(0.16, 1, 0.3, 1)',
        dugmeTrajanje: '0.55s', dugmeEasing: 'cubic-bezier(0.19, 1, 0.22, 1)',
        linkHover: 'podvuci', listaHover: 'gasi-ostale', gasenje: 0.3,
        marquee: 30, marqueePauza: false, marqueeSmer: 'vertikalno',
        paralaksa: 0, paralaksaCelija: 60, skrolReciOd: 0.2, ikoniceSkala: 0.8,
        glatkiSkrol: false, prelazStranice: 'fade',
    },
},
```

**(b) Nove mogućnosti (po vizuelnom uticaju)**

1. **`tipografija` + `naslov.visinaPrikaz`**: `.naslov-hero/-1/-2/-3` uzimaju `--tip-hero…--tip-h3` (umesto `clamp × skala`); hero i h1 imaju `line-height .8` od 768 px naviše, ispod `.9`.
2. **`tekst.visina/razmak`** → `--tekst-visina`, `--tekst-razmak` u `.tekst-telo/.tekst-uvod`; uvod je isto 12 px (ne ×1.12).
3. **Header preko `dupla`**: `'dupla'` ide u `HEROJ_ISPOD_HEADERA`, bez `pt-[76px]`; tekst `--c-preko-foto`. Visina 80/46 → `--header-visina`. `senka: false`: puna `rgb(var(--c-paper))` bez `box-shadow`/blura. `cta: 'link'`: „Zakaži” kao prva `link-nav` stavka. Header se puni kad dno heroja prođe header (ne na `scrollY > 30`); prelaz `.2s ease-in-out`.
4. **`heroPolja`**: polje `width 57%; aspect-ratio .835`, polovine `720/761` (telefon `390/412`, `1/1`). Polje 1 `--c-polje-jedan`/`--c-tekst-jedan`, polje 2 `rgb(polje-dva/.6)`/`#F7F5F0`. Reč: `container-type: inline-size`, `font-size: calc(29cqi * min(1, 4.5 / brojSlova))`, verzal. Bez paralakse i zuma; h1 = `sr-only` slogan, blok ispod heroja se briše.
5. **`usluge: 'veliki-linkovi'`**: kolona `max-width 37.5rem`, stavke `--tip-h1` lh .8, padding `1.75rem 0` (procena), `border-bottom 1px rgb(var(--c-linija)/.12)`. Hover (`pointer: fine`): ostale `opacity .3`, `.2s ease-in-out`; fotografija 4:5 (18rem) iza reči `opacity 0→1 .2s`.
6. **`izjavaRaspored: 'skrol-reci'`**: `section{height:230svh}` > sticky `100svh` sa fotografijom i tekstom `--tip-hero`, `max-width 60rem`, bez veoa. Napredak `p` 0→1 od trenutka kad vrh sekcije pređe 50 % ekrana do kraja lepljenja; reč i/n: `opacity = .2 + .8·clamp(p·n − i, 0, 1)`. Uz reduced motion: 1.
7. **`galerija: 'rasuta'`**: tamna, mutna podloga (`blur(24px) scale(1.1)`, procena), mreža 12 kol × 3 reda. Tri reči slogana `clamp(4rem, 13vw, 12.5rem)` lh .8, 6 fotografija `aspect .8`, širine 8.5 % (telefon 36 %), krem pill.
8. **`paralaksaCelija`**: `@keyframes` `translateY(-var(--pomak)) → translateY(var(--pomak))`, `animation-timeline: view()`, linear; `--pomak` 0/30/60 px naizmenično. JS rezerva pomera ceo okvir, bez `scale(1.18)`.
9. **`footer: tamni + velikiLogo`**: `bg-tamna`, na dnu logotip preko cele širine (Oswald 600, odnos ≈6.25:1, veličina preko `cqi`).
10. **`timRaspored: 'split-marquee'`**: 2 kolone `5fr 1.5rem 5fr`; marquee imena `writing-mode: vertical-rl`, `translateY(0→-50%)` linear; desno h2 `--tip-h1` centrirano. Telefon: marquee vodoravno ispod slike.
11. **`recenzijeRaspored: 'urednicka'`**: `naslov.kvadrat` (`::before` `0.68em`, `margin-right .3em`); 2 kolone `gap 3rem`, unos `border-top 1px /.15`, `padding-top 3rem`, grid `17.5rem 1fr`, citat `--tip-h3` lh 1. Telefon: skrol 285 px.
12. **`dugme.*`**: visina 2.8125rem, padding `0 2.5rem`, razmak 0, okvir 1 px. `hoverTekst: 'kotrljanje'`: natpis dupliran u `overflow:hidden`, na hover `translateY(-100%)` `.55s cubic-bezier(.19,1,.22,1)`; obris se popunjava za `.2s`.
13. **`hoverSlika*`**: `scale(1.07) rotate(-1deg)` + `filter: brightness(1.1) contrast(1.05)`, prelaz `transform .8s cubic-bezier(.16,1,.3,1), filter .6s`.
14. **`listaHover`/`gasenje`** odvojeno od `linkHover`: nav = `podvuci`, liste = `gasi-ostale`.
15. **`redosledPocetne`** + sekcija **`istaknuto`** (4 kolone, `gap .25rem`, prva kartica tamna = vaučer).
16. **`zastoMiRaspored: 'traka-ikonica'`**: tamna, 4 kolone, `border-left 1px rgb(247 245 240/.15)`, ikonice `scale .8→1`; telefon karusel sa crticama.
17. **Sitnice**: `oznaka.kvadrat` (`::before` 0.5rem kvadrat, `margin-right .75rem`); `kontejner` (100 %, 3rem/1.25rem, sekcija 5.5rem/3rem); meni 4rem/lh 1/`-0.04em` bez verzala; polja radius 0, okvir `currentColor/.15`, fokus `border-color: currentColor`.

**(c) Šta trenutna `palma` radi pogrešno**

- Verzal je obrnut: naslovi treba `none`, a tekst `uppercase` 12 px `0.04em`.
- `visina .9 × skala 1.18` daje h2 ≈61 px (treba 70.5) i h1 ≈85 px (treba 99.5); nedostaje `lh .8`.
- `oznaka .72rem` → `.75rem`, fali kvadrat. Dugme: razmak treba 0, visina ≈45 px umesto 48, padding širi.
- Header `pun` + `pt-[76px]` → treba providan preko heroja, 80/46 px, bez senke/blura i bez pill CTA.
- Hero: kvadrati `min(62%,26rem)` umesto 57 % × .835; pogrešne boje polja; reč max 88 px umesto ≈118. Polovine `100svh−76px` umesto 720/761. Višak su paralaksa, hover-zum i h1 blok ispod.
- `usluge: 'lista'` umesto velikih centriranih linkova; `gasi-ostale` gasi nav (nav se kod njih podvlači).
- `reveal: 'skala'` svuda (referenca ga nema); `paralaksa 60` na heroju umesto na ćelijama.
- `hoverSlika 1.05` bez rotacije i filtera; svetao footer umesto tamnog sa ogromnim logom; nema tamnih sekcija, izjave koja se pali ni marquee imena.
- Logo Inter 16–20 px → Oswald 600 ≈28 px; meni `naslov-2` verzal → 64 px normalna slova; akcenat `#F4D5D0` → `#F7D5D0`; `srednje .2s` → `.3s`.
