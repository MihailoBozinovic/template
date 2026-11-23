# hjuston — specifikacija (po uzoru na The Upper Hand)

Izvor: `alati/istrazivanje/izlaz/hjuston/{desktop,telefon}` (1440×900 i 390×844). Sve vrednosti su izmerene (computed style), osim onih označenih **(procena sa snimka)**. Preuzimaju se samo dizajnerske odluke — ne tekst, logo, fotografije ni kod.

## 1. Karakter

Klasičan, „uredničko-nagradni” salon: crno-bele portretne fotografije preko cele širine smenjuju se sa čistim belim sekcijama, a sav sadržaj je centriran. Glas nosi Cormorant Garamond (i za tekst — krupan, 22 px, kurzivni uvodi), dok je Raleway 700 verzal sveden na sitne oznake i mala crvena dugmad. Jedina boja na sajtu je crvena `#D22630` — dugmad, linkovi, naslovi pločica — sve ostalo je crno, belo i sivo.

## 2. Tokeni

### Boje
| Uloga | Vrednost | Gde |
|---|---|---|
| Papir | `#FFFFFF` | sve svetle sekcije, header posle skrola, footer, meni |
| Tekst | `#000000` (rgb 0,0,0 — ne `#222`) | naslovi, tekst, footer linkovi |
| Akcenat/brand | `#D22630` | pozadina dugmadi, svi `a` (kurzivni link u uvodu, linkovi u pločicama), naslovi pločica, stavke menija, X za zatvaranje |
| Hover nav | `#D43C67` | ikonica menija, footer linkovi |
| Hover na fotografiji | `#CCCCCC` + `border-bottom: 1px solid #CCC` | linkovi u foto-sekcijama |
| Pločice / ikonice mreža | `#F5F5F5` | pozadina pločica usluga i kvadrata društvenih mreža |
| Linija headera | `#EEEEEE` | `border-bottom: 1px` posle skrola (pre skrola `rgba(0,0,0,0)`) |
| Rezerva foto-sekcije | `#666666` | `background-color` ispod slike |
| Slajder | tačke ~`#222` (procena sa snimka), aktivna `#428BCA`; zvezdice zlatne ~`#F5C242` (procena sa snimka) | recenzije |

### Fontovi
- **Cormorant Garamond** 400, 400 italic, 700 — naslovi I tekst. U `fontovi.js` fali **700** (i 700-italic za podebljana imena u recenzijama).
- **Raleway** 700 — logo, dugmad, naslovi pločica, footer meni (instaliran samo 700, dovoljno).
- Ćirilica: oba `@fontsource` paketa imaju `cyrillic` + `cyrillic-ext` → rezervni font nije potreban.

### Tipografska skala (desktop / telefon)
| Element | Font | Veličina / lh | ls | Težina, stil |
|---|---|---|---|---|
| Hero h1 | Cormorant | 96/115.2 px · 60/72 px | −2px | 400 |
| Naslov sekcije (h2) | Cormorant | 48/57.6 px (isto na telefonu) | normal | 400 |
| Uvod (kurziv) | Cormorant | 30/52.5 px · 24/42 px | normal | 400 italic |
| Hero podnaslov | Cormorant | 22/38.5 px | 2px | 400, verzal |
| Tekst / linkovi | Cormorant | 22/38.5 px (lh 1.75) | normal | 400 |
| Tekst pločice | Cormorant | 18/29.25 px | normal | 400 |
| Tekst lokacija (`small`) | Cormorant | 24/42 · 19.2/33.6 px | normal | 400 |
| Citat recenzije | Cormorant | 22/38.5 px | normal | 400 italic; ime 700 italic |
| Naslov pločice | Raleway | 14/16.8 px | 2px | 700 verzal, `#D22630` |
| Logo | Raleway | 18/18 px | 1px | 700 verzal |
| Dugme | Raleway | 10/10 px | 2px | 700 verzal |
| Footer meni | Raleway | 10/10 px | 2px | 700 verzal |
| Footer potpis | Cormorant | 18/18 px | normal | 400 |
| Stavka menija | Cormorant | 22/38.5 px | normal | 400, `#D22630` |
| Nadnaslov (eyebrow) | — | **ne postoji** | | |

### Razmaci
- Sekcije: desktop `170px` gore / `180px` dole; telefon `100px / 100px`. Hero: `72px / 73px` (desktop), `60px / 100px` (telefon). Footer: `60px / 60px` · `40px / 40px`.
- Visine (desktop): hero 900 (=100vh), misija 688, strast 741, usluge 1153, lokacije 801, recenzije 962, kontakt 801, footer 191.
- Širina teksta ~900px (procena sa snimka); mreža pločica 1220px (x 110–1330), razmak pločica `20px` u oba smera; footer sadržaj 1280px.
- Telefon: bočni razmak teksta ~24px, pločica ~20px (procena sa snimka; izmerena širina pločice 351px).
- Header 30px od ivica (procena sa snimka). Ikonice mreža 36×36, razmak 12px.

### Zaobljenja
Dugmad 0, pločice 0, slike 0; kvadrati društvenih mreža **3px**.

### Fotografije
Crno-bele (same fotografije — CSS filter nije izmeren); `background-size: cover` na sekciji. **Bez vela** — beli tekst direktno na svetlo-sivoj fotografiji, bez senke (procena sa snimka). Nema hover efekta na slikama (nema kartica sa slikama).

## 3. Komponente

**Header.** Desktop: `position: fixed`, visina **73px**, levo logo, desno samo ikonica „tri tačke” (Raleway 20px) — **nema menija u liniji ni dugmeta Zakaži**. Na vrhu: providan, logo beo. Posle skrola (već na 810px, praktično čim se pomeri): `#FFFFFF`, `border-bottom: 1px solid #EEEEEE`, logo crn, bez senke i zamućenja; prelaz `0.2s ease-in-out`. Na skrol nagore — isto (ne krije se). Hover ikonice → `#D43C67`.

**Meni (svi ekrani).** Ikonica otvara meni preko celog ekrana (izmeren na telefonu: bela `#FFF`, `position: fixed`, 390×844; na desktopu ista „offscreen” komponenta — procena), sve centrirano; oznaka „MENI” Raleway ~12px verzal crna (procena sa snimka), zatim 8 stavki Cormorant 22/38.5 crvene, razmak ~20px između (procena sa snimka). Crveni tanki X na mestu ikonice. Otvaranje je **čist fade providnosti** celog panela (snimak tokom otvaranja), bez kaskade i klizanja; verovatno `opacity 0.4s ease-in-out` (iz liste tranzicija — procena).

**Hero.** Jedna fotografija preko cele širine (bez slajdova i zuma), sadržaj centriran po obe ose: h1 → 5 belih zvezdica (~22px, procena sa snimka) → podnaslov Cormorant verzal → **jedno** crveno dugme → red od 6 kvadrata mreža (`#F5F5F5`, crna ikonica 18px, padding 9px, radius 3px; hover: crna pozadina, bela ikonica). Razmaci (procena sa snimka): naslov→zvezde ~10px, zvezde→podnaslov ~15px, podnaslov→dugme ~45px, dugme→mreže ~40px.

**Redosled početne i obrasci** (smenjuju se belo / fotografija):
1. Hero (foto).
2. **Misija** (belo): h2 + kurzivni uvod 30px sa crvenom kurzivnom rečju-linkom + dugme.
3. **Strast** (foto-traka): isto, beo tekst + dugme.
4. **Usluge** (belo): h2 + mreža 3×2 tekstualnih pločica `#F5F5F5` — crna ikonica srca (~28px, procena sa snimka), naslov Raleway 14px crven, tekst 18px, crveni serifni link 22px; sve centrirano, bez fotografija.
5. **Lokacije** (foto): h2 + tekst 24px (ne kurziv) + **3 dugmeta jedno ispod drugog**, razmak ~48px (procena sa snimka).
6. **Recenzije** (belo): h2 + slajder, 2 po ekranu (desktop) / 1 (telefon), bez kartica i okvira: zlatne zvezdice ~14px, kurzivni citat 22px, ime autora 22px normalno; ispod tačke (9).
7. **Kontakt** (foto): h2 + kurzivni red 30px + 3 dugmeta u koloni.
8. Footer.

**Dugmad.** Jedna vrsta: `#D22630`, beo tekst, Raleway 10px/700/verzal/ls 2px, padding `12px 20px`, visina **34px**, radius 0, bez okvira, `transition: 0.2s ease-in-out`. Hover zavisi od podloge: na beloj sekciji → `#000` + beo tekst; na fotografiji → `#FFF` + crn tekst. Dugme je crveno i na fotografiji (nema belih/obris varijanti).

**Linkovi.** Podrazumevano crveni `#D22630`, bez podvlačenja; hover na belom → `#000`; hover na foto-sekciji → `#CCC` + donja linija 1px `#CCC`. Akcenat u uvodu = link u kurzivu (nasleđuje kurziv, menja samo boju).

**Footer.** Beo, centriran: red linkova Raleway 10px (razmak ~46px, procena sa snimka), ispod jedan red Cormorant 18px. Hover linka → `#D43C67`. Nema kolona, radnog vremena ni velikog poziva.

**Forme.** Na početnoj ih nema (`polja: []`).

## 4. Pokret
- Easing: `ease-in-out` svuda; brzo `0.2s` (dugmad, header), srednje `0.4s` (`opacity/transform 0.4s ease-in-out`), sporo `1s`.
- **fadeInUp**: `opacity 0→1`, `translateY(20px→0)`, `1s ease-in-out` (`fadeup-effect` → `fadeInUp`, 7 elemenata = po jedan blok sadržaja svake sekcije). Okida se pri ulasku u ekran (snimak: sadržaj usluga prazan pre ulaska). **Bez stagger-a** — blok se pojavljuje odjednom. Takođe `fadein 1s ease`.
- Slajder recenzija: lightSlider (9 `lslide`), automatski menja slajd (aktivna tačka se menjala između snimaka); brzina/pauza nisu izmerene — podrazumevano za lightSlider `speed 400`, `pause 2000` (procena).
- Paralaksa: nije izmerena (`paralaksa: []`), pozadine skroluju normalno; nema glatkog skrola, preloadera ni prilagođenog kursora.

## 5. Telefon (390px)
- Header **nije fiksiran** (`position: static`), visina **61px**, beo, logo **centriran** crn, tri tačke desno; hero počinje ispod njega (y=61).
- Pri skrolu ostaje samo ikonica menija: fiksiran beli kvadrat ~46×40px gore desno (procena sa snimka).
- Hero 673px visok (~80svh), h1 60px u 3 reda, podnaslov 22px u 2 reda.
- Uvodi 24/42, lokacije 19.2/33.6; h2 ostaje 48px.
- Pločice u jednoj koloni, pune širine (351px), razmak ~20px.
- Recenzije: 1 po ekranu. Footer linkovi se lome u 2 reda.

## 6. Mapiranje na naš template

### (a) Objekat teme

```js
hjuston: {
    naziv: 'Hjuston',
    inspiracija: 'The Upper Hand',
    opis: 'Nagrađivani salon: crno-bele trake fotografija, centriran Cormorant, mala crvena dugmad, meni preko ekrana.',
    tamna: false,
    boje: {
        paper: '#FFFFFF', ink: '#000000', mist: '#F5F5F5', povrsina: '#F5F5F5',
        brand: '#D22630', naBrand: '#FFFFFF', linija: '#000000', tamna: '#666666', akcenat: '#D22630',
        hoverNav: '#D43C67', hoverNaFoto: '#CCCCCC', okvirHeadera: '#EEEEEE',
        zvezdice: '#F5C242', tackaAktivna: '#428BCA',
    },
    fontovi: { naslov: SERIF_CORMORANT, tekst: SERIF_CORMORANT, oznaka: 'Raleway, system-ui, sans-serif', logo: 'Raleway, system-ui, sans-serif' },
    naslov: { tezina: 400, transform: 'none', razmak: 'normal', razmakHero: '-2px', visina: 1.2, skala: 1, akcenat: 'nista' },
    tipografija: {
        hero: 'clamp(3.75rem, 2.91rem + 3.43vw, 6rem)',   // 60 → 96px
        h2: '3rem',                                        // 48px na svim širinama
        plocicaNaslov: '0.875rem', plocicaTekst: '1.125rem', plocicaTekstVisina: 1.625,
    },
    oznaka: { transform: 'uppercase', razmak: '2px', velicina: '0.625rem', tezina: 700 },
    tekst: {
        tezina: 400, velicina: '1.375rem', visina: 1.75,
        uvodVelicina: 'clamp(1.5rem, 1.36rem + 0.57vw, 1.875rem)', uvodVisina: 1.75, uvodKurziv: true, akcenat: 'boja',
    },
    dugme: { oblik: 'pravo', stil: 'puno', velicina: '0.625rem', padding: '12px 20px', visina: '34px', naFoto: 'brand', hoverNaFoto: 'bela' },
    radius: { kartica: '0px', slika: '0px', mreze: '3px' },
    header: {
        tip: 'providan', logo: 'levo', posleSkrola: 'paper', meni: 'preko-ekrana', ikonaMenija: 'tri-tacke',
        zakaziDugme: false, visina: '73px', visinaTelefon: '61px', telefon: 'staticki', logoTelefon: 'centar',
        okvir: true, zamucenje: false, prelaz: '0.2s',
    },
    meni: { poravnanje: 'centar', font: 'tekst', velicina: '1.375rem', boja: 'brand', oznaka: true, ulaz: 'fade', kaskada: false },
    hero: 'puna-centar',
    heroOpcije: { veo: 0, zvezdice: true, podnaslov: 'serif-verzal', dugmad: 1, mreze: 'kvadrati', visinaTelefon: '80svh' },
    pocetnaRaspored: ['hero', 'izjava', 'fotoTraka', 'usluge', 'lokacije', 'recenzije', 'poziv'],
    sekcija: { padding: '170px 0 180px', paddingTelefon: '100px 0', sirinaTeksta: '900px', smenaFoto: true, nadnaslov: false },
    usluge: 'tekst-plocice',
    uslugeOpcije: { kolone: 3, razmak: '20px', sirina: '1220px', ikona: 'srce' },
    recenzije: 'slajder',
    recenzijeOpcije: { poEkranu: [1, 2], tacke: true, auto: true, brzina: 400, pauza: 2000, kartica: false },
    footer: 'minimalan',
    slike: { filter: 'grayscale', veo: 0, hoverBoja: false },
    pokret: {
        easing: 'ease-in-out', brzo: '0.2s', srednje: '0.4s', sporo: '1s',
        reveal: 'fade-up', revealPomak: '20px', revealTrajanje: '1s', stagger: 0, revealJedinica: 'blok',
        heroEfekat: 'nista', heroTrajanje: '0s', heroPrelaz: 0,
        hoverSlika: 1, linkHover: 'boja', marquee: 40, marqueePauza: false,
        paralaksa: 0, glatkiSkrol: false, prelazStranice: 'fade',
    },
},
```

### (b) Nove mogućnosti (po vizuelnom uticaju)

1. **`pocetnaRaspored` + `sekcija.smenaFoto`** — tema bira niz sekcija početne; nova sekcija `fotoTraka` (centrirani h2 + kurzivni uvod + dugme preko fotografije, padding iz `sekcija.padding`) i `lokacije` (foto + tekst + 1–3 dugmeta u koloni, razmak 48px). `Pocetna.jsx` mapira ključeve na komponente.
2. **`header.meni: 'preko-ekrana'`** — sakrij `NavLinkovi` i `Zakaži` na svim širinama, prikaži samo ikonicu (`ikonaMenija: 'tri-tacke'` = tri tačke 20px); isti panel na desktopu. `meni.*`: centrirane stavke u `--font-tekst` 22px `brand`, oznaka „Meni”, fade `var(--t-srednje)` bez `.meni-stavka` kaskade.
3. **`dugme.velicina/padding/visina/naFoto`** — CSS promenljive `--dugme-velicina`, `--dugme-padding`, `--dugme-visina`; `naFoto: 'brand'` → `.dugme-foto` u ovoj temi je crveno, hover `#FFF`/`#000`; na belom hover `ink`.
4. **`usluge: 'tekst-plocice'`** — pločice `#F5F5F5` bez slike: ikonica (lucide `Heart` puna), naziv u `.nadnaslov` 14px `brand`, opis 18/1.625, link „od X RSD” u serifu 22px `brand`; `grid-cols-1 lg:grid-cols-3`, `gap: 20px`, `max-width: 1220px`.
5. **`tipografija.*`, `naslov.razmakHero`, `tekst.visina/uvodVelicina/uvodKurziv`** — fiksne veličine umesto `clamp × skala` (h2 mora biti 48px i na telefonu); `.tekst-uvod` kurziv; `.akcenat` u uvodu = boja bez promene stila.
6. **`heroOpcije`** — `veo: 0` (klasa `veo-ravan` isključena ili po vrednosti), zvezdice bez uslova o recenzijama, ~22px bele; podnaslov u `--font-tekst` verzal ls 2px; jedno dugme; red `Mreze` kao kvadrati 36×36 `#F5F5F5`, radius 3px, hover crno.
7. **`recenzije: 'slajder'`** — bez kartica; 2/1 po ekranu, tačke ispod, auto 2000ms, prelaz 400ms; zvezdice `boje.zvezdice`, aktivna tačka `boje.tackaAktivna` (podrazumevana boja lightSlidera — razumna zamena je `brand`).
8. **`header.telefon: 'staticki'` + `logoTelefon: 'centar'`** — na <768px header u toku (61px), fiksirana ostaje samo ikonica u belom kvadratu; `visina` 73px na desktopu, okvir `1px #EEE` umesto senke/zamućenja, prelaz 0.2s.
9. **`footer: 'minimalan'`** — beo, centriran red linkova (`.nadnaslov` 10px) + jedan red potpisa 18px; hover `boje.hoverNav`.
10. **`pokret.revealJedinica: 'blok'` + `stagger: 0`** — ceo blok sadržaja sekcije je jedna `Pojava`.
11. **Hover linkova po podlozi** — `.na-foto a:hover { color: #CCC; border-bottom: 1px solid #CCC }`, inače `a:hover { color: ink }`.
12. **`sekcija.nadnaslov: false`** — `ZaglavljeSekcije` bez nadnaslova; **fontovi**: dodati `cormorant-garamond/700.css` i `700-italic.css`.

### (c) Šta sadašnja `hjuston` tema radi pogrešno

- **Header:** prikazuje meni u liniji i „Zakaži” na desktopu; referenca ima samo logo + tri tačke. Posle skrola `paper/.86` + blur + senka umesto čiste bele i `1px #EEE`; visina 76 umesto 73; prelaz 0.4s umesto 0.2s. Na telefonu je fiksiran i providan preko heroja — u referenci je statičan, beo, logo centriran.
- **Logo:** `tracking 0.12em` i 16px na telefonu → treba 18px i `1px` (0.055em).
- **Meni:** veliki naslovi `naslov-2` levo + kaskada, dugme, status, jezici → treba centriran, 22px crveni serif, čist fade.
- **Hero:** taman veo 0.5–0.58 (referenca bez vela); belo + obris dugme umesto jednog crvenog; nema reda kvadrata mreža; zvezdice 14px i samo uz recenzije; nadnaslov u Raleway umesto Cormorant verzala; `blagi-zum 12s` — referenca je statična. Na telefonu h1 ≈44px umesto 60px.
- **Naslovi:** `-0.02em` na svim nivoima (samo hero ima −2px); lh 1.15 umesto 1.2; h2 ≈54px desktop / ≈32px telefon umesto 48/48; `akcenat: 'kurziv-boja'` boji reč u naslovu, a u referenci su naslovi čisti — crveni kurziv je u uvodu.
- **Tekst:** 19.2px umesto 22px; uvod nije kurziv ni 30/24px.
- **Dugmad:** ~11.5px, `0.95rem 1.7rem`, min 48px → treba 10px, `12px 20px`, 34px; hover na fotografiji nije beo.
- **Usluge:** `plocice` = foto-kvadrati sa crnim velom na `bg-mist` sekciji → u referenci tekstualne sive pločice na beloj sekciji, 3 kolone, 20px razmak.
- **Redosled početne:** nema smene belo/foto-traka; postoje Brendovi, Galerija, Tim, Zašto mi, Vaučer — referenca ima 6 sekcija posle heroja.
- **Recenzije:** mreža 3 kartice sa okvirom i crvenim zvezdicama → slajder bez kartica, zlatne zvezdice, kurziv 22px.
- **Footer:** taman (`bg-tamna`) sa velikim pozivom i kolonama → beo, jedan centriran red.
- **Pokret:** `stagger 0.12` (treba 0), `srednje 0.5s` (0.4s), `sporo 1.2s` (1s), `hoverSlika 1.03` + skidanje filtera na hover (referenca nema hover na slikama).
- **Boje:** `ink #222` → `#000`; nedostaju `#D43C67`, `#CCC`, `#EEE`; `tamna #222` → `#666` (u referenci nema tamnih površina).
