# menhetn — po uzoru na Yukie Natori New York

Izvor: `alati/istrazivanje/izlaz/menhetn/{desktop,telefon}` (1440×900 i 390×844). Platforma: WordPress + Elementor, Swiper. Bez GSAP-a, Lenis-a i AOS-a. Oznaka „(procena)” znači procena sa snimka, sve ostalo je izmereno.

## 1. Karakter

Miran, „hotelski” spa sajt: maslinasti header je uvek vidljiv, a ispod njega ide slideshow koji se dugo pretapa. Ritam drže velike oštre fotografije bez zaobljenja, krem i maslinaste trake i jedno pill dugme sa belim krugom i strelicom. Nema animacija pri skrolu. Sav pokret je u heroju (Ken Burns i fade od 2,5 s) i u traci logotipa.

## 2. Tokeni

**Boje**
| Uloga | Vrednost |
|---|---|
| Pozadina stranice | `#FFFFFF` |
| Druga pozadina (trake CTA, 360°) | `#E8E3BE` (krem) |
| Tamne sekcije, header, footer, primarno dugme | `#3C391C` (maslinasta) |
| Naslovi | `#000000`; na krem traci i za naslove vesti `#3C391C` |
| Tekst (osnovni) | `#505050`; osnovna boja dokumenta `#333333` |
| Bledi tekst (opisi proizvoda) | `rgba(0,0,0,.25)` |
| Tekst na tamnom | `#FFFFFF` |
| Okvir polja | `1px solid #505050` |
| Okvir kartice proizvoda | ~`#E6E6E6` (procena) |
| Linije između vesti | ~`#333` (procena) |
| Pregrade u headeru | ~`rgba(255,255,255,.3)` (procena) |

**Fontovi:** Manrope 400 / 600 (podebljano u tekstu 700). Font je besplatan, instaliran i ima ćirilicu, pa zamena nije potrebna. Logo je slika (didonski serif); za tekstualni logo predlažem Cormorant Garamond 500 (ima ćirilicu).

**Tipografija**
| Element | Desktop | Telefon |
|---|---|---|
| Hero h1 | 62/62 px, 600 | 36/36, 600 |
| H2 sekcije | 42/46, 600 | 32/36, 600 |
| H3 na pločici | 42/46, 600, bela | 32/36 |
| CTA naslov („Book…”) | 62/62, 600, `#3C391C` | 36/36 |
| Naslov vesti | 24/28, 400, `#3C391C` | 22/28 |
| Naslov kartice proizvoda | 18/24, 700 | 16/20, 700 |
| Telo | 16/24, 400 | **16/20**, 400 |
| Nadnaslov (eyebrow) | 16/24, 400, `#505050`, bez verzala | 16/20 |
| Nav link | 16/24, 400, bela | (meni) 16/20 |
| Dugme | 16/20, 400 | 16/20 |
| Naslov kolone u footeru | 24/28, 400, bela | 22/28 |
| Copyright | 16 px | 12/20 |

Svuda je `letter-spacing: normal` i `text-transform: none`. Kurziv se ne koristi.

**Razmaci:** kontejner 1140 px (centriran, pri 1440 levo i desno ostaje po 150 px), na telefonu 350 px uz bočne ivice od 20 px. Vertikalni padding sekcija je ≈130 px na desktopu i ≈60 px na telefonu (procena). Pločice su razmaknute 10 px vertikalno i ~12 px horizontalno, karusel 10 px, nav stavke 20 px. Zaglavlje sekcije ima tri kolone (x = 150 / 378 / 874 → ≈20% / 43% / 37%).

**Zaobljenja:** dugmad `30px`, polja `3px`, slike i pločice `0`. **Senke:** nema ih. **Slike:** bez filtera, `object-fit: cover`. Preko pločica ide tamni veo ~`rgba(0,0,0,.25)` (procena).

## 3. Komponente

**Header:** Elementor sticky `top`, offset 0, na svim uređajima. Visina je 80 px (telefon 70). Pozadina je **uvek** `#3C391C`: ne providi se preko heroja, ne krije se pri skrolu nadole i ne menja se pri skrolu nagore (snimak potvrđuje). Raspored desktopa: logo 132×51 levo, vertikalna pregrada od 1 px, nav centriran (16 px, beo, razmak 20 px; „Hair” i „More” imaju ▾), pregrada, pa desno belo pill dugme 103×34 (maslinast tekst, unutrašnja crtica i ikonica torbe). Hover na nav: Elementor `e--pointer-underline e--animation-fade`, podvlaka koja se pojavljuje kroz opacity za 0.3s. Na snimku se ne vidi (procena).

**Mobilni meni:** padajući panel ispod headera (`position: absolute`, 390×740), pozadina `#3C391C`, tranzicija `max-height .3s, transform .3s`. Header ostaje iznad, a hamburger (beo, ~28 px) postaje X. Iznad prve stavke je ~48 px praznine (procena). Stavke su centrirane, 16/20 400, bele, visine ~64 px (procena). Aktivna stavka ima pozadinu `rgba(255,255,255,.1)`. U meniju nema CTA ni jezika.

**Hero:** počinje ispod headera (y = 80) i visok je 900 px (= 100vh), na telefonu 760 px. Tekst je levo na ivici kontejnera i **vertikalno centriran**, redom:
- h1 (bez nadnaslova);
- jedno dugme 40 px ispod naslova;
- paragraf 16/24 beo, ~90 px ispod dugmeta, širine ~375 px.

Preko slike ide ravan veo ~`rgba(0,0,0,.45)` (procena). Slideshow (Swiper): `effect: fade`, `speed: 2500`, `autoplay: 3000`, `loop`, pa je ciklus 5500 ms. Ken Burns „in”: `scale(1) → scale(1.3)`, `transition 20s linear` na aktivnom slajdu (osnovni slajd 10s). Kontrola nema: bez tačkica, strelica i trake napretka.

**Početna, redom (desktop):**
1. Hero.
2. Uvod u usluge: tri kolone (nadnaslov | H2 | paragraf sa podebljanim delovima), poravnate po vrhu.
3. Pločice usluga: mreža 3×2, pločice 376×550, `radius 0`. Naslov 42 px gore levo, padding 40 px. Dole levo je dugme „obris-beli”. Fotografija nema zum na hover.
4. Štampa: isto zaglavlje u tri kolone, uz primarno dugme ispod H2. Ispod je **marquee logotipa** (visine 50 px, `translateX(0 → -50%)`, 10s linear, bez pauze i bez maske na ivicama).
5. Krem traka (410 px): centriran H2 u boji `#3C391C` i dugme. Odmah ispod je fotografija preko cele širine, 495 px.
6. Karusel kartica (proizvodi): centriran H2. Swiper ima 3/2/1 kartice po prikazu (prelomi 1024/767/0), `spaceBetween 10`, `speed 500`, `autoplay 5000`, `loop`. Kartica: okvir od 1 px, slika 364×350, padding 20 px, naslov, cena, dugme. Ispod su centrirane okrugle maslinaste strelice ~26 px (procena).
7. Dve podeljene sekcije 50/50: fotografija do ivice ekrana (720 px) i maslinasti panel sa belim H2 i tekstom, visine 675 / 663 px. Druga je u ogledalu i ima krem dugme.
8. Vesti: H2 levo, pa redovi odvojeni linijom od 1 px (slika 309×206 | naslov 24 px | izvod + dugme).
9. CTA traka `#E8E3BE` (404 px): centrirani nadnaslov, naslov 62 px maslinast i dva primarna dugmeta (razmak ~20 px).
10. Forma zahteva: levo H2, tekst i kontakt, desno polja.
11. Footer.

**Dugmad** (sva su `border-radius: 30px`, 16 px 400, `transition .3s`):
- *primarno-strelica*: pozadina `#3C391C`, beo tekst, visina 38 px, padding `2px 2px 2px 30px`. Desno je beli krug ~34 px sa maslinastom strelicom →, sa razmakom ~25 px od teksta. **Hover nema vidljivu promenu** (izmerena razlika je prazna).
- *krem-strelica*: pozadina `#E8E3BE`, crn tekst, beli krug.
- *obris-beli* (na fotografiji): providno, `1px solid #fff`, padding `5px 25px`, visina 38 px (telefon 34), bez strelice. Hover: pozadina `#fff`, tekst `#3C391C`, 0.3s.
- *header pill*: pozadina `#fff`, tekst `#3C391C`, visina 34 px.

**Linkovi:** `color .3s`. Nav ima podvlaku koja se pojavljuje kroz fade (procena). **Kartice i slike:** bez zuma i bez senke.

**Footer:** pozadina `#3C391C`, beli tekst, visina 307 px (telefon 500). Četiri kolone na x = 150 / 378 / 606, plus logo desno (164×63) i copyright dole desno. Naslovi kolona su 24 px 400, linkovi 16/24. Footer nema CTA blok.

**Forme:** labela 16 px 600 crna sa „ *”. Polje: pozadina `#fff`, `1px solid #505050`, `radius 3px`, `padding 8px 16px`, 16 px, visina ~42 px. Datum i vreme stoje u redu ~2:1. Ispod su checkbox saglasnosti i primarno dugme.

## 4. Pokret

- Kriva je CSS `ease` (podrazumevana). Trajanja: `.3s` za dugmad, boje i meni, `.5s` za opšte (41 element). Ken Burns ide `linear`. Krive `cubic-bezier(.795,-.035,0,1) .5s` i `(.58,.3,.005,1) .3s` imaju po jedan element (dodatak), pa ih ne prenosimo.
- Reveal pri skrolu **ne postoji** (`atributiAnimacija: []`, Elementor `animation: none`).
- Paralaksa: 0. Izmereni pomaci od ±3–7 px odnose se na header, nije paralaksa.
- Bez glatkog skrola, bez prelaza stranica, bez posebnog kursora. Zastavica `preloader` je postavljena, ali na prvom ekranu preloader se ne vidi, pa ga ne pravimo.
- Marquee i hero: kao u 3. Na telefonu je pokret isti.

## 5. Telefon (390)

- Header 70 px, tri ćelije odvojene pregradama: logo (visina 34) | pill dugme u sredini | hamburger. **CTA je vidljiv na telefonu.**
- Hero: 760 px, h1 36/36, dugme 38 px, paragraf 16/20.
- Veličine naslova i teksta su u tabeli. Telo ima `line-height: 20px`.
- Sve ide u jednu kolonu. Pločice su 350×550, razmak 10 px, padding 30 px, poređane jedna ispod druge (ne horizontalni skrol).
- Podeljene sekcije: prvo fotografija preko cele širine (~435 px, procena), pa maslinasti panel.
- Vesti: slika 350×233, pa naslov, izvod i dugme. Footer ima dve kolone.
- Nema lepljivog CTA dugmeta na dnu ekrana.

## 6. Mapiranje na naš template

### (a) Objekat teme

```js
menhetn: {
    naziv: 'Menhetn',
    inspiracija: 'Yukie Natori New York',
    opis: 'Spa-salon iz Midtauna: maslinasti header uvek vidljiv, Manrope 600, pill dugmad sa belim krugom i strelicom, sporo pretapanje sa Ken Burns zumom, oštre pločice.',
    tamna: false,
    boje: {
        paper: '#FFFFFF', ink: '#000000', mist: '#E8E3BE', povrsina: '#FFFFFF',
        brand: '#3C391C', naBrand: '#FFFFFF', linija: '#505050', tamna: '#3C391C', akcenat: '#E8E3BE',
        tekstBlag: '#505050',
    },
    fontovi: { naslov: 'Manrope, system-ui, sans-serif', tekst: 'Manrope, system-ui, sans-serif', oznaka: 'Manrope, system-ui, sans-serif', logo: SERIF_CORMORANT },
    naslov: {
        tezina: 600, transform: 'none', razmak: '0', visina: 1.1, skala: 1, akcenat: 'nista',
        velicine: { hero: 'clamp(2.25rem, 4.3vw, 3.875rem)', h1: 'clamp(2.25rem, 4.3vw, 3.875rem)', h2: 'clamp(2rem, 2.92vw, 2.625rem)', h3: 'clamp(1rem, 1.25vw, 1.125rem)' },
        visinaHero: 1.0,
    },
    oznaka: { transform: 'none', razmak: '0', velicina: '1rem', tezina: 400 },
    tekst: { tezina: 400, velicina: '1rem', visina: 1.5, visinaTelefon: 1.25 },
    dugme: { oblik: 'pill', stil: 'strelica', visina: '38px', krug: '34px', hover: 'nista' },
    radius: { kartica: '0px', slika: '0px', polje: '3px' },
    header: { tip: 'pun', logo: 'levo', posleSkrola: 'brand', visina: 80, visinaTelefon: 70, pregrade: true, ctaNaTelefonu: true, meni: 'padajuci' },
    hero: 'ispod-headera',
    usluge: 'visoke-kartice',
    zaglavlje: 'tri-kolone',
    zavrsniPoziv: 'traka',
    razmak: { sekcija: '130px', sekcijaTelefon: '60px', kontejner: '1140px' },
    slike: { filter: 'none' },
    pokret: {
        easing: 'ease', brzo: '0.3s', srednje: '0.3s', sporo: '0.5s',
        reveal: 'nista', revealPomak: '0px', revealTrajanje: '0s', stagger: 0,
        heroEfekat: 'ken-burns', heroTrajanje: '20s', heroPrelaz: 2500, heroInterval: 3000, heroZum: 1.3, heroKontrole: 'nista',
        hoverSlika: 1, linkHover: 'podvuci-fade', marquee: 10, marqueePauza: false, marqueeMaska: false,
        paralaksa: 0, glatkiSkrol: false, prelazStranice: 'nista',
    },
},
```

### (b) Nove mogućnosti (po vizuelnom uticaju)

1. **`hero: 'ispod-headera'`.** Sekcija ima `margin-top: var(--header-visina)` i `min-height: calc(100svh - var(--header-visina))` (telefon 760 px ≈ `90svh`). Sadržaj je `items-center` i počinje na levoj ivici kontejnera, redom: h1 → jedno primarno dugme (`mt: 40px`) → paragraf (`mt: 90px`, `max-width: 375px`). Bez nadnaslova i drugog dugmeta. Veo je ravan `rgba(0,0,0,.45)`. `'ispod-headera'` ne sme biti u `HEROJ_ISPOD_HEADERA`.
2. **Tempo slideshow-a.** Smena na `heroInterval + heroPrelaz` = 5500 ms (sada je `heroTrajanje × 0.75`), bez pauze na hover. `--hero-zum` ide u `@keyframes ken-burns { to { transform: scale(var(--hero-zum)) } }`, trajanje 20s linear. `heroKontrole: 'nista'` skriva traku napretka.
3. **Header.** Polja `visina` / `visinaTelefon` postavljaju `--header-visina` (80 / 70 px). `pregrade: true` daje vertikalne linije od 1 px (`rgba(255,255,255,.3)`) desno od logoa i levo od CTA, preko cele visine. Na telefonu tri ćelije: logo | CTA (vidljiv, `ctaNaTelefonu`) | hamburger. CTA u headeru je belo pill dugme sa maslinastim tekstom, visine 34 px.
4. **Pločice usluga** (`visoke-kartice`, menhetn varijanta). Grid od 3 kolone, `gap: 10px 12px`, visina 550 px, `radius 0`. Na telefonu su jedna ispod druge, 550 px, `gap 10px`. Naslov `naslov-2` beo na `top/left: 40px` (telefon 30). Dole levo je dugme *obris-beli* („Saznaj više”), bez cene i bez blur stakla. Hover na dugme: beli fill i maslinast tekst za .3s. Zum fotografije je isključen.
5. **Eksplicitne veličine naslova.** `naslov.velicine.*` ide u `--naslov-hero-v`, `--naslov-2-v` itd., a `.naslov-hero { font-size: var(--naslov-hero-v, calc(...)) }`. `visinaHero` je line-height za hero. `tekst.visina` / `visinaTelefon` važe za `.tekst-telo` i `.tekst-uvod` (`@media (max-width: 767px)`).
6. **Razmaci.** `--sekcija-py` (130 / 60 px) u `Sekcija`, `--kontejner` (1140 px) u `Kontejner`, sa bočnim ivicama od 20 px na telefonu.
7. **`zaglavlje: 'tri-kolone'`.** `ZaglavljeSekcije` dobija mrežu `md:grid-cols-[1fr_2.2fr_1.85fr]`, poravnatu po vrhu (`items-start`): nadnaslov | H2 | uvod. Link ili dugme ide ispod H2.
8. **`zavrsniPoziv: 'traka'`.** Pozadina `--c-mist` (#E8E3BE), visina ~404 px. Centrirani nadnaslov (crn), naslov `naslov-hero` u boji brand i dva primarna dugmeta sa razmakom 20 px. Bez fotografije.
9. **`reveal: 'nista'`.** `.js [data-reveal='nista'] .pojava { opacity: 1; transform: none; transition: none }`.
10. **Podeljena sekcija 50/50** (`Izjava` ili najava „O nama”). Fotografija ide do ivice ekrana, preko pola širine. Panel je `bg-tamna`, beli H2 i tekst, `padding-left: 90px`, visina ~670 px. Druga instanca je u ogledalu i ima krem dugme. Na telefonu: prvo foto (~435 px), pa tekst.
11. **`header.meni: 'padajuci'`.** Panel ispod headera (`top: var(--header-visina)`), `bg-brand`, `max-height 0 → 100svh` i `transform: scaleY(.95→1)`, `.3s ease`. Bez kaskade stavki. Stavke su centrirane, 16 px, visine 64 px; aktivna ima `rgba(255,255,255,.1)`.
12. **`linkHover: 'podvuci-fade'`.** `::after` visine 2 px (procena) ispod linka, `opacity 0 → 1`, `.3s`.
13. **Dugme strelica.** Visina 38 px, krug 34 px, `padding 2px 2px 2px 30px`, `gap 25px`. Uz `dugme.hover: 'nista'` nema rotacije strelice i nema promene boje. Nova varijanta `krem` (pozadina `--c-akcenat`, crn tekst).
14. **Marquee logotipa.** Stavke su slike visine 50 px sa razmakom ~90 px (procena). `marqueeMaska: false` uklanja `mask-image`. Bez `border-y`.
15. **Footer `kompaktan`.** Bez CTA bloka, četiri kolone: naslovi kolona 24 px 400, logo desno, copyright dole desno.
16. **Polja.** `radius.polje` daje `--r-polje` (3px). Okvir je `1px solid rgb(var(--c-linija))` bez providnosti, `padding: 8px 16px`.
17. *(Opciono)* Karusel kartica 3/2/1, `gap 10`, 500 ms, autoplay 5000, loop, okrugle strelice ispod. Primena: tim ili vaučeri.

### (c) Šta sadašnja `menhetn` tema radi pogrešno

| Kod nas | U referenci |
|---|---|
| `header.tip: 'providan'`, header providan preko heroja; visina 76, bez pregrada, CTA skriven na telefonu | header uvek maslinast, hero ispod njega; visina 80/70, pregrade, CTA vidljiv |
| `hero: 'puna-levo'`: tekst dole levo, nadnaslov, dva dugmeta, traka napretka | vertikalno centrirano, h1 → dugme → paragraf |
| slideshow: prelaz 1200 ms, smena ~7,5 s, zum 1→1.12 za 10s | 2500 ms, 5,5 s, 1→1.3 za 20s |
| zaobljenja `18px` | `0` (polja `3px`) |
| `mist: '#F4F1E1'`, `ink: '#1D1C12'`, tekst kroz providnost | `#E8E3BE`, `#000`, tekst `#505050` |
| `skala: 0.82`: hero ~75 px na 1440, H2 na telefonu ~25 px | hero 62 px, H2 na telefonu 32 px |
| `akcenat: 'boja'` + pravilo `[data-tema='menhetn'] .na-foto .akcenat` | nema akcentovane reči; pravilo ukloniti |
| `oznaka` 0.9rem / 500 | 1rem / 400 |
| `reveal: 'fade-up'`, `prelazStranice: 'fade'` | ni jedno ni drugo |
| `linkHover: 'pozadina'` | podvlaka kroz fade; pozadina samo na aktivnoj stavci mobilnog menija |
| hover rotira strelicu za −45° | hover nema efekat |
| usluge: aspect 3/4, horizontalni skrol na telefonu, staklena pill sa cenom, zum 1.06 | 550 px, jedna ispod druge, obris-pill, bez zuma |
| brendovi: imena kao tekst, maska, linije | logotipi, bez maske i linija |
| mobilni meni preko celog ekrana na `paper` pozadini, veliki kaskadni naslovi | maslinast padajući panel, stavke 16 px centrirane |
| `ZavrsniPoziv` sa fotografijom; footer sa CTA blokom | krem traka; footer bez CTA |
