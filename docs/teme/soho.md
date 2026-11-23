# soho — specifikacija (po uzoru na Salon 64 London)

Izvor: `alati/istrazivanje/izlaz/soho/{desktop,telefon}/podaci.json` + snimci (1440×900, 390×844).
„(procena sa snimka)” = izmereno okom sa snimka, ne iz computed style. Tekst, logo, fotografije i kod reference se ne kopiraju.

## 1. Karakter

Londonski „super salon” u maniru modnog časopisa: krem papir, skoro crna tinta, nijedno zaobljenje, nijedna senka. Naslovi su ogroman tanak serif u kojem se **kurzivne rečenice sudaraju sa uspravnim VERZALOM**, a sve ostalo je sitan Inter verzal sa razmakom i pune 1 px linije. Pokret je spor i „skup”: linije naslova izranjaju iz maske, slike se blago uvećavaju, a između sekcija nema boja — samo linije.

## 2. Tokeni

**Boje** (CSS promenljive sajta): papir `#FFFCF5` (`--white`), tinta/linije/footer `#1E1E1E` (`--black`), siva `#898989` (`--grey`), traka sa kontaktom `#E2C6A9`, hover na formi `#696969`, podloga proizvoda breskva ≈`#F3DCC2` (procena sa snimka), veo preko fotografije ≈`rgb(0 0 0 / .35)` (procena), veo kartice na hover `rgba(0,0,0,.7)`.

**Fontovi:** Saol Display 400 normal+italic (licenciran) → zadržati **Bodoni Moda** (latinica) + **Playfair Display** (ćirilica, ima kurziv). Nijedan drugi @fontsource nije jasno bolji; Bodoni Moda **nema ćirilicu**, pa ruska verzija ide na Playfair. Tekst: **Inter** 300–700 (ima ćirilicu).

**Tipografija** (veličina / line-height; ls = letter-spacing):

| Element | Desktop | Telefon |
|---|---|---|
| Hero h1 | 144 / 158.4 (1.1), italic; VERZAL deo 144 | 54.6 / 60.06; VERZAL 54.6 / 54.6 |
| h2 „displej” (usluge) | 128 / 134.4, uppercase | 48 / 48 |
| h2 poziv (CTA) | 88 / 96.8 | 40 / 44 |
| h2 sekcije | 64 / 67.2 | 48 / 57.6 (kurziv), 50.4 (verzal) |
| h2 uvod | 56 / 58.8 | 40 / 48 |
| Naslov pločice | 48 / 52.8 | 40 / 44 |
| Newsletter h2 | 56 / 56, uppercase | 48 / 52.8 |
| Instagram naslov | 28.8 / 28.8 italic | isto |
| Naziv proizvoda / „View more” | 25 / 30 roman; 25 / 25 italic | 22 / 26.4 |
| Telo | Inter 16 / 24, 400 | 16 / 22.4–24 |
| Citat | Inter 20 / 26 italic | 18 / 25.2 |
| Nadnaslov | Inter 14 / 14, 400, uppercase, ls 1.4px (0.1em) | isto |
| Nav link | Inter 16 / 16, 400, uppercase, ls 0.8px | (meni, v. §3) |
| Hero tekst-link | Inter 16 / 24, uppercase, ls normal | 14 / 16.8 |
| Dugme | Inter 14, 400, uppercase, ls 1.4px | isto (submit 16, ls 1.6px) |
| Traka kontakta | Inter 14, 500, uppercase, ls 1.4px | 10px, 500, ls 1.4px |
| Footer tekst | Inter 14 / 19.6 | 16 / 22.4 |

Svi naslovi: težina 400, ls normal. **Mešanje:** kurziv je osnovno stanje (`font-style: italic`, mala slova), a „udarne” reči su **uspravne, verzal, ista veličina**, u istom redu. Redosled je slobodan: kurziv→VERZAL („…to *the* SALON”, „What our / CLIENTS SAY”), VERZAL→kurziv („STYLING *Services*”), i VERZAL usred kurzivne rečenice (uvod). Verzal je nekad `text-transform: uppercase`, nekad otkucan velikim slovima (transform none) — vizuelno isto. Pločice: kurziv reč u prvom redu, VERZAL u drugom.

**Razmaci:** bočna margina 48px (desktop) / 20px (telefon); sadržaj 1344px pri 1440 (pun ekran minus margine, bez max-širine — procena). Mreža 2 kolone, razmak 16px (pločice 664+16+664). Između sekcija ≈96–104px sa svake strane 1px linije, odnosno ≈140px bez linije (procena sa snimka); telefon ≈40–120px (procena). Footer padding 88px / 64px (izmereno).

**Radijusi:** 0px svuda (dugmad, polja, slike). **Senke:** nema (samo `.nav__btn:hover` `rgba(0,0,0,.24) 0 1px 4px`). **Slike:** `object-fit: cover`, bez filtera; formati 1.25 (pločice), 0.76 i 1.36 (galerija), 0.71 (proizvodi, velike slike), 1.0 (Instagram).

## 3. Komponente

**Header.** Traka kontakta 32px, bg `#E2C6A9`, tekst `#1E1E1E` centriran, dva podatka razdvojena „|”. Ispod red navigacije 79px (desktop) / 63px (telefon): logo levo (≈200×38, procena), nav desno — 6 linkova, vertikalna crta, pa SHOP i „BOOK APPOINTMENT” sa chevron-om (padajući meni, ne dugme). Na vrhu: providan preko heroja, tekst `#FFFCF5`, donja linija 1px krem. Posle skrola: puna podloga `#FFFCF5`, tekst `#1E1E1E`, donja linija 1px `#1E1E1E`, bez blur-a i senke; na desktopu traka kontakta odlazi, na telefonu ostaje. Skrol nagore: isto stanje (ne sakriva se). Hover nav: podvlaka `::after` `scale(0,1)→(1,1)`, `transform-origin: left center`. Dropdown: `opacity/visibility` + stavke iz pomaka u `translate(0)`, chevron `rotate(180deg)`, slika u meniju `scale(1.1)`, veo `opacity 0`.

**Mobilni meni.** Hamburger od 2 linije (≈28px, procena) → X. Panel preko celog ekrana ispod headera, bg `#FFFCF5`; `transition: 0.45s cubic-bezier(0.525,0,0,1) 0.1s, opacity 0.2s cubic-bezier(0.525,0,0,1) 0.1s`. Stavke: Inter ≈20px uppercase, ls ≈0.1em (procena; computed je dao 16/22.4 tt none za unutrašnji element), redovi ≈53px, razdvojeni 1px `#1E1E1E` linijama **od ivice do ivice**; linije se iscrtavaju s leva posle teksta (snimak tokom otvaranja). Podmeniji = harmonika sa chevron-om desno.

**Hero.** 100vh, jedna statična fotografija (video 0), ravan tamni veo. Dole levo (48px): nadnaslov + crtica 24×1px (procena), h1 u dva reda, pa **dva tekst-linka** sa tankom strelicom (≈18px, razmak 56px). Bez uvodnog pasusa, bez dugmadi, bez slajdova.

**Početna, redom:**
1. Hero.
2. Uvod: nadnaslov u levoj koloni, h2 56px u desnoj (od x=732), ispod dugme obris.
3. Dve pločice lokacija 664×531, veo, centriran naslov (kurziv/VERZAL, krem) i strelica ≈60px.
4. Usluge: tri reda — broj „01” (Inter 16) gore levo, h2 128px „VERZAL *Kurziv*”, ispod 1px linija pune širine. Desktop: slika se otkriva na hover (`range-animation-img-wrapper`, `range-hover-line`; procena); telefon: slika 350×416 uvek ispod naslova.
5. Galerija-slajder: nadnaslov levo, strelice ←/→ (≈48px, tanke) desno; slajdovi 423×560 i 763×560, razmak 16, poslednji viri preko desne ivice. Ispod 1px linija.
6. Prodavnica: h2 64px levo, pasus + dugme desno, strelice levo, slajder kartica 400×560 (breskva podloga), naziv 25px serif, cena Inter 16; oznaka „novo” Inter 11px na krem pločici.
7. Split: slika levo 656×922, desno nadnaslov, h2 64px, **numerisana lista** (broj serif kurziv, stavka Inter 16, redovi ≈57px, 1px linije), dugme.
8. Isti split u ogledalu (tekst levo, slika 664×922 desno).
9. Recenzije: h2 levo; desna kolona (od x≈854) tri citata Inter 20 italic + ime Inter 14, razdvojeni 1px linijama. Bez kartica i zvezdica.
10. Štampa: h2 + mreža logotipa 4×4 (196×88).
11. Poziv: fotografija preko cele širine ≈700px (procena), centriran nadnaslov + crtica, h2 88px (red kurziv, red VERZAL), pasus, kontakti, dugme krem obris.
12. Instagram: naslov 28.8px kurziv, 5 kvadrata u redu (razmak 16, procena).
13. 1px linija, centriran monogram, pa marquee logotipa sa 1px gornjom linijom (traka ≈68px, procena).
14. Footer.

**Dugmad.** Osnovno: bg `#FFFCF5`, tekst `#1E1E1E`, okvir `1px solid #1E1E1E`, radius 0, padding `11.2px 21px`, visina 48px; hover bg `#1E1E1E`, tekst `#FFFCF5` (izmereno); `transition: background-color .3s, border-color .3s, color .3s` (ease). Na fotografiji: providno, tekst i okvir `#FFFCF5`; hover bg `#FFFCF5`, tekst `#1E1E1E`. Submit u footeru: krem pun; hover `#1E1E1E` + krem okvir.

**Linkovi.** Tekst + tanka strelica; hover `.button-arrow svg { transform: translateX(4px) }`, `transform .2s cubic-bezier(0.625,0.05,0,1)` (i `.35s` varijanta). `arrow-hover`: strelica u maski ulazi iz pomaka do `translate(0%)`. Footer linkovi: podvlaka `scaleX(0→1)`, origin `left bottom`. Kontakt link hover `opacity .55`, ikone mreža `opacity .4`.

**Kartice/slike.** Pločica: hover veo → `rgba(0,0,0,.7)`, slika `scale(1.06)` uz `transform .5s ease-in-out`, `background .5s ease-in-out`; strelica `translateX(0%)`. Proizvod: hover sloj sa „pogledaj” u serif kurzivu 25px, krem.

**Footer.** bg `#1E1E1E`, tekst `#FFFCF5`, padding 88/64. Centrirano: h2 56px VERZAL, pasus 15/21, forma, ikone; 1px krem linija; 4 centrirane kolone (naslov Inter 14 ls 1.4px verzal + crtica 24px, tekst 14/19.6); linija; donji red levo/sredina/desno.

**Forme.** Polja bg `#1E1E1E`, `1px solid #FFFCF5`, radius 0, padding `8px 12px`, 14px, visina ≈48 (procena); ime/prezime u 2 kolone (razmak 16), e-pošta i submit pune širine.

## 4. Pokret

- Krive: `--cubic-default: cubic-bezier(0.525, 0, 0, 1)` (glavna), `cubic-bezier(0.625, 0.05, 0, 1)` (strelice, boje, opacity), `ease-in-out` (slike/veo), GSAP `power1.out` ≈ `cubic-bezier(0.25, 0.46, 0.45, 0.94)`.
- Trajanja: `--duration-fast .2s`, `--duration-normal .45s`, dugmad `.3s`, slike `.5s`, još `.35s`, `.4s`, `.6s`.
- Split-text: klase `split-text`(7), `line`, `gsap_split_line-mask` → **po redovima**, svaki red u maski. Pomak/stagger nisu uhvaćeni (GSAP serijalizacija pukla) — predlog: `yPercent 100→0`, 1s, stagger 0.1s, `--cubic-default` (procena).
- Nadnaslov: na snimku presečen („INTRODUCT”) → otkriva se s leva na desno (clip), procena.
- Paralaksa: `parallax-item` ×30, `parallax-scroll-img` ×19; brzine nisu izmerene → predlog ≈60px hoda, slika `scale(1.18)` u maski (procena).
- Lenis: u ovom merenju `lenis: false` (TEME.md ga beleži ranije) — zadržati naš glatki skrol.
- Marquee: `@keyframes translateX { 100% { transform: translateX(-100%) } }`, 2 liste, 40.96s linear infinite (TEME.md), bez pauze.
- Slajder: Splide (klase `splide__slide` ×22), samo strelice, bez tačaka; brzina nije izmerena (Splide podrazumevano 400ms `cubic-bezier(0.25,1,0.5,1)`).
- Prelaz stranice: fiksni crni panel (`.transition`, pun ekran) odlazi `x: 0→100%`, 0.5s `power1.out`, kašnjenje 0.2s.
- Preloader / prilagođen kursor: nema.

## 5. Telefon (390px)

Margine 20px; sve kolone se slažu. Traka kontakta ostaje (10px, dva podatka levo/desno). Header 63px + hamburger. Hero: tekst-linkovi jedan ispod drugog. Uvod: h2 40/48. Pločice 350×384 jedna ispod druge. Usluge: „STYLING” i „Services” se lome u dva reda, slika ispod svakog naslova. Slajderi: jedan slajd + vir sledećeg. Split sekcije: slika prva, pa tekst. Štampa: 2 kolone. Instagram: horizontalni niz 222×222. Marquee logotipa `filter: contrast(1.5)` (128×58). Footer: sve u jednoj koloni, visina 1820px.

## 6. Mapiranje na naš template

### (a) Tema

```js
soho: {
    naziv: 'Soho',
    inspiracija: 'Salon 64 London',
    opis: 'Londonski „super salon”: kurziv + VERZAL u istom naslovu, krem #FFFCF5, oštri uglovi, pune linije, redovi naslova izranjaju.',
    tamna: false,
    boje: {
        paper: '#FFFCF5', ink: '#1E1E1E', mist: '#F3DCC2' /* breskva kartica, procena */, povrsina: '#FFFCF5',
        brand: '#1E1E1E', naBrand: '#FFFCF5', linija: '#1E1E1E', tamna: '#1E1E1E', akcenat: '#E2C6A9',
        siva: '#898989',
    },
    fontovi: { naslov: SERIF_BODONI, tekst: SANS_INTER, oznaka: SANS_INTER, logo: SERIF_BODONI },
    naslov: {
        tezina: 400, transform: 'none', razmak: '0', visina: 1.05, skala: 1, akcenat: 'kurziv-verzal',
        velicine: {
            hero: 'clamp(3.41rem, 1.34rem + 8.51vw, 9rem)',   // 54.6 → 144
            displej: 'clamp(3rem, 1.14rem + 7.62vw, 8rem)',    // 48 → 128
            poziv: 'clamp(2.5rem, 1.39rem + 4.57vw, 5.5rem)',  // 40 → 88
            1: 'clamp(2.5rem, 2.13rem + 1.52vw, 3.5rem)',      // 40 → 56
            2: 'clamp(3rem, 2.63rem + 1.52vw, 4rem)',          // 48 → 64
            3: 'clamp(2.5rem, 2.31rem + 0.76vw, 3rem)',        // 40 → 48
        },
        visine: { hero: 1.1, displej: 1.05, poziv: 1.1, 1: 1.05, 2: 1.05, 3: 1.1 },
    },
    oznaka: { transform: 'uppercase', razmak: '0.1em', velicina: '0.875rem', tezina: 400, crtica: '24px' },
    tekst: { tezina: 400, velicina: '1rem', visina: 1.5 },
    dugme: { oblik: 'pravo', stil: 'obris', okvir: '1px', padding: '11.2px 21px', visina: '48px', trajanje: '0.3s' },
    radius: { kartica: '0px', slika: '0px' },
    linije: { debljina: '1px', jacina: 1 },
    header: {
        tip: 'providan', logo: 'levo', posleSkrola: 'paper', visina: 79, visinaTelefon: 63,
        linija: true, zamucenje: false, navVelicina: '1rem', navRazmak: '0.05em', cta: 'link',
        traka: { boja: 'akcenat', visina: 32, posleSkrola: 'sakrij-desktop' },
    },
    meni: { stil: 'linije', velicina: '1.25rem', linkovi: 'uppercase' },
    hero: 'puna-levo',
    heroDugmad: 'tekst-strelica', heroUvod: false, heroVeo: 'rgb(0 0 0 / .35)',
    usluge: 'velika-lista',
    recenzije: 'citati',
    galerija: 'slajder-strelice',
    footer: 'tamni-centar',
    slike: { filter: 'none' },
    pokret: {
        easing: 'cubic-bezier(0.525, 0, 0, 1)', easingDetalj: 'cubic-bezier(0.625, 0.05, 0, 1)',
        brzo: '0.2s', srednje: '0.45s', sporo: '0.6s',
        reveal: 'linije', revealPomak: '100%', revealTrajanje: '1s', stagger: 0.1,
        heroEfekat: 'nista', heroTrajanje: '0s', heroPrelaz: 1000,
        hoverSlika: 1.06, hoverSlikaTrajanje: '0.5s', hoverSlikaEasing: 'ease-in-out', veoHover: 'rgb(0 0 0 / .7)',
        linkHover: 'podvuci', strelicaPomak: '4px',
        marquee: 40.96, marqueePauza: false,
        paralaksa: 60, glatkiSkrol: true,
        prelazStranice: 'zavesa', prelazTrajanje: '0.5s', prelazKasnjenje: '0.2s',
        prelazEasing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    },
},
```

### (b) Nove mogućnosti (po vizuelnom uticaju)

1. **`naslov.velicine` / `naslov.visine`** — `cssTeme` piše `--naslov-hero`, `--naslov-1..3`, `--naslov-displej`, `--naslov-poziv`; `.naslov-hero { font-size: var(--naslov-hero, calc(...)) }`. Bez ovoga hero je 118px umesto 144.
2. **Slobodan položaj VERZALA** — u tekstu naslova `{…}` = `.akcenat` (uspravno, uppercase) na bilo kom mestu: `'{STYLING} Services'`, `'Welcome to the {SALON}'`. `Naslov` deli tekst na segmente; ostalo ostaje kurziv.
3. **`usluge: 'velika-lista'`** — red: broj (Inter 16) gore levo, naziv `naslov-displej` sa uvlakom ≈36px, 1px linija ispod; na hover (≥1024px) slika kategorije (aspect 0.76, ≈300px) prati kursor / pojavljuje se uz `opacity 0→1` + `scale(.9→1)`, `.45s var(--ease)`; telefon: slika ispod naslova (aspect 0.84).
4. **`reveal: 'linije'`** — razbiti naslov po renderovanim redovima (merenje `offsetTop` posle `document.fonts.ready`, ponovo na resize), svaki red `overflow:hidden`, unutra `translateY(100%)→0`, `1s var(--ease)`, kašnjenje `i × 0.1s`.
5. **`header.traka`** — traka 32px `bg akcenat`, Inter 14/500, ls 0.1em, uppercase, telefon i e-pošta (telefon: 10px, levo/desno); `--header-visina` = 32+79. Desktop posle skrola `translateY(-32px)`, telefon ostaje.
6. **`header.linija` + `zamucenje:false`** — `border-bottom: 1px solid` (krem na heroju, `#1E1E1E` posle skrola), puna podloga bez `backdrop-filter`; visina 79/63; nav linkovi 16px ls 0.05em; `cta:'link'` = „Zakaži” kao nav link sa chevron-om umesto punog dugmeta.
7. **Dugme `obris` po meri** — `okvir`, `padding`, `visina`, `trajanje` u CSS promenljive; hover popuna tintom za `.3s ease`.
8. **`heroDugmad: 'tekst-strelica'`, `heroUvod:false`, `heroVeo`** — dva uppercase linka 16/24 sa strelicom (hover `translateX(4px)`, `.2s easingDetalj`), ravan veo, bez trake napretka.
9. **`linije.jacina`** — sve razdelne linije `rgb(var(--c-linija) / var(--linija-jacina))`; soho = 1 (sada .12–.18).
10. **`oznaka.crtica`** — `.nadnaslov::after` 24×1px `currentColor`, `margin-top: 10px` (procena); na pojavu `clip-path: inset(0 100% 0 0)→inset(0)`, `.45s var(--ease)`.
11. **Pločice sa natpisom u centru** (Izjava ili prve dve kategorije) — 2 kolone, razmak 16, aspect 1.25 (telefon 0.91), veo .35→.7 `.5s ease-in-out`, slika `scale(1.06)`, strelica 60px iz `translateX(-100%)` u 0 (procena početka).
12. **`recenzije: 'citati'`** — 2 kolone (naslov levo, citati desno od 7/12), Inter 20/26 italic, ime 14px, 1px linije, bez kartica/zvezdica.
13. **`galerija: 'slajder-strelice'`** — strelice 48px u redu nadnaslova, slajdovi visine 560 (telefon 463) mešanih širina, razmak 16, scroll-snap + `scrollBy` na klik.
14. **`footer: 'tamni-centar'`** — `#1E1E1E`, centriran VERZAL naslov 56px, 4 centrirane kolone sa crticom, polja sa krem okvirom (radius 0).
15. **`prelazStranice: 'zavesa'`** — fiksni `#1E1E1E` panel pokriva ekran, pa `translateX(0→100%)` 0.5s `prelazEasing`, kašnjenje 0.2s.
16. **`meni.stil: 'linije'`** — stavke Inter 20px uppercase, redovi 53px, 1px linije od ivice do ivice koje rastu `scaleX(0→1)` s leva (kaskada 45ms); hamburger od 2 linije koje postaju X (`rotate(±45deg)`, `.45s var(--ease)`).
17. **Marquee logotipa pred footerom** — 1px gornja linija, bez ✦ razdvajača i bez maske, logotipi 192px korak.

### (c) Šta trenutna `soho` tema radi pogrešno

- Radius 4px (dugme `blago`, kartice, slike) → **0px** svuda (TEME.md greši); dugme `puno` → **obris** 1px koji se puni tintom.
- `oznaka` 0.78rem/500 → **14px/400**, bez crtice; `tekst-telo` lh 1.75 → **1.5**.
- Hero naslov ≈118px umesto **144px**; `razmak -0.01em` → 0; VERZAL može samo na kraj naslova.
- `reveal: 'reci'` (reč po reč) → **redovi**.
- Hero: zum, slajdovi, traka napretka, pasus i puna dugmad → statična slika, ravan veo, dva tekst-linka.
- Header: nema trake kontakta ni 1px linije; posle skrola blur `.86` umesto pune krem podloge; „Zakaži” je dugme umesto nav linka.
- `usluge: 'kartice'` → tipografski redovi 128px; recenzije-kartice sa zvezdicama → citati sa linijama.
- Linije izbledele (.12–.18) → pune 1px `#1E1E1E`; svetao footer → tamni `#1E1E1E`.
- `hoverSlika 1.04` → **1.06**; prelaz `fade` → zavesa; marquee sa ✦ i maskom posle usluga → logotipi pred footerom.
