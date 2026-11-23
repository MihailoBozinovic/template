# holivud — specifikacija po uzoru na Nine Zero One

Izvor: `alati/istrazivanje/izlaz/holivud/{desktop,telefon}/podaci.json` i snimci (1440×900, 390×844).
Merene vrednosti su napisane bez oznake. Ono što je procenjeno sa snimka nosi oznaku „(procena sa snimka)”.
Prodavnica, akademija, korpa, nalog i načini plaćanja su izostavljeni. Obrasci su prevedeni na salon.

## 1. Karakter

Losanđeleski „cool-girl” salon: fotografije su od ivice do ivice i dele ih tanki šavovi papira, a tekst je sitan Helvetica verzal (10–14 px).
Jedini dekor je ručno crtan monolinijski small-caps naslov sa razmakom slova od 3 px.
Paleta je crna, bela, topli papir i nude. Jedan šok-akcenat je kiselo žuta pločica.

## 2. Tokeni

### Boje

| Uloga | Vrednost |
|---|---|
| papir (body) | `#FFFEFC` |
| tekst / naslovi / linija headera | `#111111` |
| nude (pozadina slike/sekcije) | `#F5EBDF` |
| crni paneli, najava, okvir dugmeta | `#000000` |
| belo dugme, kartice | `#FFFFFF` |
| okviri polja i elemenata | `#222222` |
| akcenat (prva pločica) | `#FFFB00` |
| sporedne | svetla `#E6E2E1`, tamna/link `#333232`, karamel `#CD9B77` |
| veo preko fotografije | `linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,.25) 100%)`; horizontalni `rgba(0,0,0,.2)` |
| zatamnjenje modala | `rgba(0,0,0,.5)` |

### Fontovi

- **Tekst, oznake i dugmad:** `Helvetica, Arial, sans-serif` (sistemski font, ima ćirilicu).
- **Naslovi i nav:** prilagođeno pismo „riawna”. Ono **nije** široki grotesk. To je ručno crtan, tanak, monolinijski font, samo verzal, gde se mala slova crtaju kao manji verzal (small caps). Uvek 400, sem 700 kod sitne oznake.
- **Zamena:** `@fontsource/amatic-sc` (400/700). Ovo je ručno crtan small-caps font **sa ćirilicom**: cyrillic, latin, latin-ext (provereno u Fontsource API-ju). Od instaliranih fontova ni jedan nije ručno crtan. Cormorant SC je klasičan serif i odaje potpuno drugi karakter. Amatic je uži od riawne, pa razmak od 3 px ostaje obavezan, a po potrebi naslove treba uvećati za oko 10% (procena sa snimka).
- **Logo:** tanak geometrijski grotesk sa širokim razmakom (procena sa snimka). Zamena je **Jost 400** (ima ćirilicu).

### Tipografska skala (veličina / visina reda / razmak slova / težina / transform)

| Uloga | Desktop | Telefon |
|---|---|---|
| hero naslov (riawna) | 60 / 66 / 3px / 400 / none | 40 / 48 / 3px |
| naslov sekcije h1 (riawna) | 60 / 66 / 0.5px | 40 / 48 / 3px |
| naslov h1, grotesk varijanta | Helvetica 40 / 44 / −1.5px / 700 / uppercase | 35 / 42 |
| h2 na crnom panelu (riawna) | 32 / 42.67 / 3px | 28 / 37.33 |
| h2 na fotografiji (Helvetica) | 28.8 / 31.1 / 0.576px / 400 / none | 24 / 25.92 / 0.48px |
| h3 pločice (riawna) | 19.2 / 25.6 / 3px | isto |
| h5 u futeru (riawna) | 20 / 33.33 / 3px | isto |
| podnaslov heroja (riawna) | 15 / 26.25 / 3px / uppercase | isto |
| nav (riawna) | 15 / 17.25 / 3px / none | iza hamburgera |
| tekst 1 | Helvetica 12 / 21 / normal / 400 / uppercase | isto |
| tekst 2 (paneli) | 14 / 21.7 / uppercase | isto |
| linkovi u futeru | 14 / 22.4 / none | 14 (summary 14.4 / 23.04) |
| oznaka | 12 / 15.6 / 2px / 700 / uppercase; 11 / 15.4 / 1.76px / 400 (bela); riawna 12 / 15.6 / 3px / 700 („od 2009.”) | isto |
| dugme | 10 / 15 / 2px / 400 / uppercase | isto |
| tekst-link u pločici (riawna) | 12 / 15.6 / 3px / uppercase, podvučen | isto |
| najava | 12 / 21 / 1px / 400 / uppercase; link 700, podvučen | isto |
| labela polja | 10 / 11.5 / 1px / uppercase | isto |

### Razmaci

- **Širina stranice:** `1440px`.
- **Bočna margina (gutter):** desktop `56px` (5.6rem uz koren od 10 px), telefon `24px` (procena sa snimka).
- **Uži kontejner (izdvojene sekcije):** `1216px`.
- **Vertikalni padding sekcije:** desktop `96px`, telefon `40px` (izdvojena sekcija: 4454 → slika na 4550; telefon 5291 → 5331).
- **Šavovi između panela od ivice do ivice:** `16px` (1909 → 1925, 3442 → 3458) ili `32px` (2690 → 2722). Između dva panela u istom redu: `0–1px`.
- **Jedinica razmaka:** desktop `16px`, telefon `12px`.
- **Futer:** desktop `96px / 48px`, telefon `40px / 40px`.

### Zaobljenja i slike

- **Zaobljenja:** sva su `0` (dugmad, polja, slike).
- **Slike:** `object-fit: cover`, bez filtera. Pojavljuju se kroz `opacity .6s, visibility .6s`.
- **Pozadina dok se slika učitava:** `#F5EBDF`. Odnos slike kartice: `136.54%`.
- **Fotografije proizvoda:** `contain` na nude ili beloj podlozi.

## 3. Komponente

**Najava:** traka visine `45px` (telefon `37px`), crna, tekst bele boje i centriran. Ona je Swiper sa 1 slajdom (`speed 300`, bez autoplay-a). Odlazi sa skrolom.

**Header:**

- **Raspored na desktopu (visina `124px`):** nav levo, u riawni 15px. Pri 1440 px se prelama u 2 reda (procena sa snimka). Logo je u centru, `200×19px`. Desno je @nalog (riawna 15px) i tri ikonice od 24px sa korakom od 48px (procena sa snimka).
- **Na vrhu:** providan, preko heroja, odmah ispod najave (`top 45px`). Tekst i ikonice su beli.
- **Posle skrola:** lepljiv na `top 0`, puna pozadina `#FFFEFC`, boja `#111111`. Tranzicija `background-color .3s, color .3s`. **Bez senke i bez blura.** Ima tanku liniju 1px `#111111` uvučenu na gutter (56/24px).
- **Pri skrolu nagore i nadole:** ostaje vidljiv, ne sakriva se.
- **Hover:** logo dobija opacity `.7`. Pretraga se uvećava na `scale(1.2)`.

**Mobilni meni:**

- **Header na telefonu (`56px`):** hamburger sa tri linije **levo**, logo `160×15` u centru, jedna ikonica desno.
- **Linija ispod headera na heroju:** prozirna bela, oko `rgba(255,255,255,.35)` (procena sa snimka).
- **Otvoren meni nije snimljen,** jer posle klika nisu pronađeni novi linkovi. Predlog: preko celog ekrana, papir, stavke u riawni (procena).

**Hero:**

- **Veličina:** preko cele širine. Visina je `100vh` minus najava (855px). Na telefonu je `624px` (≈74svh), sa posebnim kadrom za telefon.
- **Pozadina:** jedna statična slika. Nema slajdova ni zuma. Veo je samo gradijent od 0 do .25.
- **Tekst:** blok je **dole desno**, poravnat desno, sa marginom od 56px.
  - oznaka: riawna 12px, 700
  - naslov: riawna 60px
  - podnaslov: riawna 15px, verzal
  - jedno dugme: belo, puno
- **Razmaci:** naslov → podnaslov oko 30px, podnaslov → dugme oko 60px, dugme → dno oko 126px (procena sa snimka).

**Paneli (prevod „split image/video”):**

- **(a) Dva panela od ivice do ivice:** visina 100vh (900px), širine 719 + 720 sa šavom od 1px. Slika levo, video ili slika desno. Dugme je obris, crno, centrirano oko 56px od dna panela.
- **(b) Uredničke slike:** 720×765 i 720×619. Ispod je crni pojas sa belim dugmetom dole desno.
- **(c) Nude sekcija:** dve kvadratne slike 720×720 bez razmaka. Na dnu je centriran tekst preko fotografije: oznaka 11px, h2 Helvetica 28.8px, tekst 14px verzal, belo dugme `16px 25.5px`. Dno je na oko 32px.
- **(d) Video levo, crni panel desno:** u centru je h2 riawna 32px, tekst 14px verzal i belo dugme.

**Traka poverenja (Press):**

- **Raspored:** marquee logotipa odmah ispod heroja. Visina `109px`, pozadina papir. 22 logotipa ×2, u originalnim bojama.
- **Ritam:** korak oko 179px, razmak oko 80px (procena sa snimka).
- **Bez ovoga:** nema naslova, razdelnika ni maske na ivicama.

**Pločice poverenja:**

- **Desktop:** 3 kolone po 480px. Okviri su 1px `#111`: gore, dole i između kolona. Prva pločica je `#FFFB00`, ostale su papir.
- **Sadržaj, centriran:** crni krug od 64px sa belom ikonicom (procena sa snimka), naslov riawna 19.2px, link riawna 12px podvučen.
- **Telefon:** Swiper sa `slidesPerView 1.1`, `spaceBetween 1`, `speed 300`.

**Izdvojena sekcija:** kontejner 1216px, slika `544×650` (0.84). Kolona teksta je centrirana:

- oznaka 12px/2px
- naslov riawna 60px ili Helvetica 700 40px verzal
- tekst 12px verzal
- tekst-link 12px/700 podvučen

Sekcije se smenjuju: slika desno, pa slika levo.

**Dugmad:**

- **Zajedničko:** visina `50px`, okvir `1px`, radius `0`. Tranzicija `color .4s, background-color .4s, border-color .4s, opacity .3s`, easing `ease` (podrazumevan).
- **Belo puno (na fotografiji):** `#FFF`, tekst `#000`, okvir `#FFF`, padding `16px 40px`. Na hover: pozadina `#000`, tekst `#FFF` (izmereno).
- **Obris:** providno, okvir i tekst `#000`, padding `16px 25.5px`. Na hover: pozadina `#000`, tekst `#FFF`.
- **Tekst-dugme na hover:** podvlačenje sa `text-underline-offset: .4rem`.

**Linkovi:**

- **Nav:** `::before` linija od 1px širine teksta. `scaleX(0) → scaleX(1)`, `transform-origin: left`, opacity 0 → 1, `.3s`. Stoji oko 14px ispod teksta (procena sa snimka).
- **Link u pasusu:** podvučen. Na hover: `text-decoration-color: transparent`.
- **Linkovi u futeru:** boja `#111`.

**Kartice i slike:** na hover linka sa slikom `opacity .7`, **bez zuma**. Merenja kartica nisu pokazala nikakvu razliku.

**Futer:**

- **Raspored:** pozadina papir, 3 kolone.
  - kolona linkova: naslov riawna 20px, Helvetica 14px, red na svakih 30px
  - kolona mreža: ikonice od 24px na korak od 44px
  - kolona newslettera: naslov riawna, polje
- **Telefon:** newsletter je prvi, zatim harmonika (`—` / `+`), linija 1px, pa mreže.

**Forme:** `input` bela pozadina, okvir `1px solid #222222`, radius 0, padding `0 134px 0 24px`, 14px, visina oko 60px (procena sa snimka). „Pošalji” je tekst-dugme unutar polja, desno. Hover: `border-color: currentColor`. Fokus: `outline: currentColor 2px`, offset `3px`.

**Redosled početne, preveden na salon:**

1. najava
2. hero
3. marquee brendova
4. dva panela 100vh (galerija/rad)
5. urednički paneli (o nama, štampa)
6. nude: 2 kvadratna panela = usluge
7. video + crni panel = tim
8. izdvojena usluga (slika desno)
9. venčanja i vaučer (slika levo)
10. 3 pločice (Zakaži žuto / Lokacija / Poklon)
11. futer

## 4. Pokret

- **Trajanja:** `200 / 300 / 400 / 600 ms` (short, default, long, extra-long). Nema `cubic-bezier`, sve je `ease`.
- **Ulaz elemenata:** `.js-animation-fade-in` na 11 elemenata, `@keyframes fade-in` (opacity 0 → 1), `800ms forwards`. **Bez pomaka i bez kaskade.** Isto važi i na telefonu (`--theme-js-animations-on-mobile: fade-in 800ms forwards paused`).
- **`slideUp` (30px):** pripada chat vidžetu (uz `.chat-bubble`, `.salon-submit-button`), ne stranici. Ne prenosi se.
- **Marquee:** `@keyframes marquee` `translate(0) → translate(calc(-100% - var(--gap)))`, `linear infinite`, smer ulevo, pauza na hover (`.marquee--hover-pause`). Trajanje od 110s je iz `docs/TEME.md`. U `podaci.json` ga nema, pa ga treba proveriti.
- **Swiper:** `speed 300`, `effect slide`, `loop false`, bez autoplay-a. Pločice: 3 po prikazu od 750px naviše, na telefonu 1.1.
- **Paralaksa:** nema je. Pomeraj od −49px na 70px skrola (koeficijent 1.70) jednak je za header i sve stavke marquee-a. To je skok rasporeda kad se header zalepi, a ne paralaksa (procena).
- **Ostalo:** nema prelaza stranice, nema preloadera ni Lenisa. Header menja boju za `.3s`.

## 5. Telefon (390 px)

Pored onoga što je već navedeno uz komponente:

- **Hero:** naslov i podnaslov se prelamaju u 2, odnosno 3 reda, desno poravnati. Dugme je široko oko 217px.
- **Paneli:** slažu se jedan ispod drugog, puna širina:
  - urednički: 390×501, 390×496, 390×580
  - kvadratni: 390×488 (4:5)
  - šav: oko 24px (procena sa snimka)
- **Izdvojene slike:** 326×389.

## 6. Mapiranje na naš template

### (a) Objekat teme

```js
holivud: {
    naziv: 'Holivud',
    inspiracija: 'Nine Zero One',
    opis: 'LA salon: ručno crtan small-caps naslov sa razmakom 3 px, sitan Helvetica verzal, papir, crno i nude sa kiselo žutim akcentom, paneli od ivice do ivice.',
    tamna: false,
    boje: {
        paper: '#FFFEFC', ink: '#111111', mist: '#F5EBDF', povrsina: '#FFFFFF',
        brand: '#000000', naBrand: '#FFFFFF', linija: '#222222', tamna: '#000000', akcenat: '#FFFB00',
        sivaSvetla: '#E6E2E1', sivaTamna: '#333232', karamel: '#CD9B77',
    },
    fontovi: {
        naslov: '"Amatic SC", "Cormorant SC", cursive',
        tekst: 'Helvetica, Arial, sans-serif',
        oznaka: 'Helvetica, Arial, sans-serif',
        logo: 'Jost, "Helvetica Neue", Arial, sans-serif',
        nav: '"Amatic SC", "Cormorant SC", cursive',
    },
    naslov: {
        tezina: 400, transform: 'none', razmak: '3px', visina: 1.1, skala: 0.65, akcenat: 'nista',
        velicine: { hero: ['40px', '60px'], h1: ['40px', '60px'], h2: ['28px', '32px'], h3: ['19.2px', '19.2px'] },
        grotesk: { font: 'Helvetica, Arial, sans-serif', tezina: 700, transform: 'uppercase', razmak: '-1.5px', visina: 1.1, velicine: ['35px', '40px'] },
    },
    oznaka: { transform: 'uppercase', razmak: '2px', velicina: '0.75rem', tezina: 400 },
    tekst: { tezina: 400, velicina: '0.75rem', transform: 'uppercase', visina: 1.75 },
    nav: { velicina: '15px', razmak: '3px', transform: 'none', visina: 1.15 },
    dugme: {
        oblik: 'pravo', stil: 'obris', foto: 'belo-u-crno',
        velicina: '10px', razmak: '2px', padding: '16px 40px', paddingTelefon: '16px 12px', visina: '50px', trajanje: '0.4s',
    },
    radius: { kartica: '0px', slika: '0px' },
    najava: { pozadina: '#000000', boja: '#FFFFFF', visina: ['37px', '45px'], velicina: '12px', razmak: '1px', linkTezina: 700 },
    header: {
        tip: 'providan', logo: 'centar', posleSkrola: 'paper',
        visina: ['56px', '124px'], linija: 'uvucena', senka: false, blur: false, sakrijNaSkrol: false,
        telefon: 'meni-levo', zakazi: 'tekst',
    },
    hero: 'puna-desno',
    heroOpcije: { slajdovi: false, visinaTelefon: '624px', dugmad: 1, podnaslovFont: 'naslov',
        veo: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,.25) 100%)' },
    usluge: 'paneli',
    raspored: { gutter: ['24px', '56px'], sirina: '1440px', uzak: '1216px', sekcija: ['40px', '96px'], sav: '16px' },
    slike: { filter: 'none', hoverProvidnost: 0.7, ulaz: '0.6s' },
    futer: { pozadina: 'paper', harmonikaTelefon: true },
    pokret: {
        easing: 'ease', brzo: '0.2s', srednje: '0.3s', sporo: '0.6s',
        reveal: 'fade', revealPomak: '0px', revealTrajanje: '0.8s', stagger: 0,
        heroEfekat: 'nista', heroTrajanje: '0s', heroPrelaz: 600,
        hoverSlika: 1, linkHover: 'podvuci', marquee: 110, marqueePauza: true,
        marqueeMaska: false, marqueeRazdvajac: '', marqueeRazmak: '80px',
        paralaksa: 0, glatkiSkrol: false, prelazStranice: 'nista',
    },
},
```

`skala: 0.65` daje tačno 60px (hero) i oko 33px (h2) pri 1440 px dok se `velicine` ne uvede. Na telefonu daje samo 27px umesto 40px.

### (b) Nove mogućnosti (po vizuelnom uticaju)

1. **`fontovi.nav` + `nav{}`:** nav linkovi dobijaju sopstveni font, veličinu i razmak, umesto klase `.nadnaslov`. Treba dodati `@fontsource/amatic-sc` 400/700 i dozvoliti `naslov.razmak` u px.
2. **`hero: 'puna-desno'` + `heroOpcije`:** blok poravnat dole desno, jedno dugme (`foto`), podnaslov u fontu naslova (15px, verzal, 3px). `slajdovi: false` znači jedna slika, bez trake napretka. `veo` menja `.veo-dole` lakšim gradijentom (alati/proveri-kontrast i dalje traži ≥ 4.5:1, pa veo pojačati samo koliko je nužno). `visinaTelefon: 624px`.
3. **`najava{}`:** nova komponenta iznad headera (45/37px). Header na vrhu dobija `top = visina najave`, a lepi se na `top 0`.
4. **Header:** `senka:false` i `blur:false` znače `.header-pun` = puno `rgb(var(--c-paper))`, bez `backdrop-filter` i senke. `linija:'uvucena'` je `::after` 1px `--c-ink`, uvučena na gutter (na heroju bela, oko .35). `visina` po širini ekrana. `telefon:'meni-levo'` stavlja hamburger levo, logo u centar, a dugme Zakaži desno kao ikonicu. `zakazi:'tekst'` znači link u nav fontu, ne dugme.
5. **`usluge: 'paneli'`:** kategorije u parovima 50/50 od ivice do ivice (1:1 na desktopu, 4:5 na telefonu), `bg-mist`, tekst centriran pri dnu. Naslov je u Helvetica 28.8px (varijanta `h2-foto`), uz belo dugme.
6. **`dugme.foto: 'belo-u-crno'` + mere:** `.dugme-foto` je belo puno, a na hover `#000` i bela slova sa belim okvirom. Za `.dugme` važi font 10px, razmak 2px, padding 16/40, visina 50, tranzicija `dugme.trajanje`.
7. **Pločice poverenja (`TrakaPoverenja`):** 3 kolone sa okvirima od 1px. Prva je `--c-akcenat`, sa krugom od 64px, naslovom h3 i podvučenim linkom. Na telefonu je to horizontalni snap sa 1.1 kartica.
8. **Marquee:** `marqueeMaska:false` uklanja `mask-image`. `marqueeRazdvajac:''` uklanja ✦. `marqueeRazmak` postavlja `--gap`. Animacija je `translate(calc(-100% - var(--gap)))`. Brendovi su bez naslova, odmah ispod heroja, visine 109px.
9. **`naslov.velicine` i `naslov.grotesk`:** tačne veličine `[telefon, desktop]` preko `clamp()` umesto `skala`. Grotesk varijanta (Helvetica 700, verzal, −1.5px) služi za izdvojenu uslugu.
10. **`raspored{}`:** gutter 24/56, uski kontejner 1216, padding sekcije 40/96, šav od 16px između punih panela.
11. **`slike.hoverProvidnost`:** hover = `opacity .7`, bez skaliranja. `slike.ulaz` je fade slike od 0.6s po učitavanju.
12. **`futer{}`:** pozadina papir umesto mist. Na telefonu harmonika sa `—` / `+`. Naslovi kolona su u fontu naslova, 20px.
13. **`tekst.visina` + `transform`:** kratki tekstovi idu 12px verzal sa visinom reda 1.75. Dugi tekst (cenovnik, pravne stranice) treba da ostane 14px u običnom pismu.
14. **`prelazStranice: 'nista'`:** ova vrednost je već podržana, jer se sve osim `'fade'` ignoriše.

### (c) Šta trenutna tema `holivud` radi pogrešno

Ispravka za svaku stavku je u (a) i (b).

- **Naslov:** Cormorant SC 500 sa `0.08em` je klasičan serif, a referenca je ručno crtan small caps sa razmakom od 3px.
- **Logo:** Cormorant SC, a referenca je tanak geometrijski grotesk.
- **Boje:** `akcenat` samo ponavlja nude. Nedostaju `#FFFB00` i `#000`.
- **Hero:** tekst je dole levo, sa dva dugmeta, slajdovima, trakom napretka, zumom i velom do .78.
- **Dugme na fotografiji:** kod nas je obris koji se puni belim, a kod reference je obrnuto. Font je oko 11.5px umesto 10px, tranzicija `.2s` umesto `.4s`.
- **Nav:** `linkHover:'boja'` uz brand `#111` znači da hover nije vidljiv.
- **Header:** proziran sa blurom i senkom, visok 76px, bez najave. Na telefonu su logo i hamburger obrnuti.
- **Usluge:** pločice na mist podlozi sa velom od 55%, umesto panela od ivice do ivice.
- **Slike i ulaz:** slika se zumira (1.03), a `stagger .08` i `revealPomak 30px` nemaju osnovu u podacima.
- **Marquee:** ima ✦, masku, naslov i font naslova.
- **Trajanja i prelaz:** `srednje` i `sporo` su .4s i .8s umesto .3s i .6s. Prelaz stranice je fade.
- **Futer i tekst:** futer je mist umesto papira. Telo teksta je 16px običnim pismom umesto 12px verzala.
