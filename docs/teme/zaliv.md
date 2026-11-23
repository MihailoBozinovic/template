# zaliv — spec po uzoru na Barrow Salon (Squarespace 7.1)

Izvor: `alati/istrazivanje/izlaz/zaliv/{desktop,telefon}` (1440×900 i 390×844). Vrednosti su computed style / Squarespace tweak JSON; „(procena sa snimka)” = izmereno sa slike.

## 1. Karakter

Galerija, ne salon-brošura: bela stranica, čista crna, a stranicu nose fotografije **visine ekrana**, uvučene u ravnomeran beli okvir od 3vw. Jedini „glas” je ogroman uzani grotesk wordmark u headeru; tekst je tih (Bodoni naslovi srednje veličine, tanki grotesk 300 sa proredom 1.8). Nema animacija, paralakse ni karusela — mirnoća je sama odluka.

## 2. Tokeni

### Boje
| Uloga | Vrednost |
|---|---|
| papir / površina | `#FFFFFF` |
| tekst, naslovi, linkovi | `#000000` (sve, bez sivih tonova) |
| dugme pozadina / tekst | `#000000` / `#FFFFFF` |
| footer podloga | `rgb(241,241,239)` = `#F1F1EF` |
| wordmark | ≈ `#333333` — logo je slika (procena sa snimka) |
| linije | nema (nijedan border, senka ni separator) |

### Fontovi
| Uloga | Referenca | Zamena (ćirilica) |
|---|---|---|
| naslovi | LTC Bodoni 175; traži se 500, ali je učitan **samo 400** (+400 italic) → vidljivo **400** | **Bodoni Moda 400** (nema ćirilicu → rezerva Playfair Display, ima) |
| tekst, nav, dugmad | Proxima Nova 300/500/600 | **Onest** 300/500/600 (ima ćirilicu; DM Sans je **nema**) |
| wordmark | uzan grotesk, slika 499×177 | **preporuka: `@fontsource/sofia-sans-extra-condensed` 600** — ima `cyrillic`, `cyrillic-ext`; uži je od Oswalda, bliži proporciji (slovo ≈ 0.51 visine verzala). Rezerva: Oswald 500. |

Bodoni kurziv je učitan, ali se na početnoj ne koristi.

### Tipografska skala
| Element | Desktop 1440 | Telefon 390 |
|---|---|---|
| hero tekst | nema H1 — „hero” je wordmark: verzal ≈ 154 px visok, ≈ 473 px širok (procena sa snimka) | wordmark max **30 px** visine |
| h2 (sekcija; ref. h3) | Bodoni **36.736px** / lh **48.96px** (1.333) / ls normal / 500→400 / none / normal | **28.154px** / **37.52px** |
| h3 (ref. h4, footer) | **26.368px** / **36.03px** (1.366) | **22.077px** / **30.17px** |
| tekst | Proxima **17.728px** / 300 / lh **31.91px** (1.8) | **17.013px** / 300 / **30.62px** |
| nav | **17.728px** / 300 / none / ls normal / `#000` | — (meni: **33.15px** / lh 1 / 300) |
| dugme (sadržaj) | **16px / 600** / ls **0.32px** (0.02em) / none | isto |
| dugme (header CTA) = eyebrow | **12.544px / 500 / uppercase / ls 2.383px** (0.19em) | **13.974px** / ls **2.655px**; u meniju **19.2px** / ls **3.648px** |
| footer | naslovi 26.368px Bodoni, linkovi 17.728px/300 podvučeni | 22.077px / 17.013px |

### Razmaci
- Header padding: `header-vert-padding: 3vw` (43.2px), telefon `6vw` (23.4px); `header-width: Full`.
- Kontejner: **bez max-širine**, gutter **3vw** (sadržaj 1354px na 1440). Telefon: tekst gutter **6vw** (23.4px), fotografije **3vw** (11.7px).
- Uvučene fotografije: sekcija `100vh`, padding **3vw** sa svih strana (43.2px / 11.7px) → foto = širina − 6vw, visina = 100vh − 6vw (1354×814; telefon 367×821).
- Tekst-trake: desktop h2+dugme ≈ 97px visine, ~14px vertikalno (procena sa snimka); „o nama” traka 298px: ~44px gore / ~100px dole (procena sa snimka). Telefon: 265px i 632px.
- Footer: 297px desktop (~90px gore, ~85px dole — procena sa snimka), 528px telefon.

### Radijusi i slike
Sve `0px`. Slike `object-fit: cover`, `filter: none`, bez hover zuma, bez okvira/senke. Odnos zavisi od ekrana (2.28 / 1.66 desktop, 0.49 / 0.45 telefon) — fotografija prati viewport, ne fiksni aspect.

## 3. Komponente

**Header** — visina **263px** = 43.2 + logo **177px** (`header-logo-height`) + 43.2. Levo wordmark, desno u istom redu (vertikalni centar y=132): nav linkovi (razmak ≈ 19px), Instagram ikonica ≈ 18px, ≈ 30px praznine, crni CTA 159×53 (procena sa snimka). Aktivna stavka: podvučena 1px, ≈ 15px ispod sredine teksta (procena sa snimka); hover nav bez promene (izmereno: nema razlike). Bela pozadina, bez senke/bordera/blura. `tweak-fixed-header: false` → header je `position: absolute` i **odlazi sa skrolom**; pri skrolu nagore se **ne vraća**. Wordmark se ne smanjuje (nema stanja „posle skrola”). Telefon: 84px, wordmark 30px levo, ikonica „dve linije” desno (≈ 35px široke, razmak 12px, potez 1px — procena sa snimka).

**Mobilni meni** — `fixed`, ceo ekran 390×844, bela, gore isti header sa tankim X (≈ 20px, potez 1px — procena sa snimka). Stavke **centrirane**, 33.15px/33.15px/300, bez verzala, korak ≈ 57px (procena sa snimka); podmeniji sa tankom strelicom `>` desno. Ispod: Instagram ikonica centrirana, pa crni CTA ≈ 244×82 (procena sa snimka), 19.2px/500/verzal/3.648px. Prelaz: `visibility 0.6s cubic-bezier(0.4,0,0.2,1), opacity 0.4s cubic-bezier(0.4,0,0.2,1)` — čist fade, bez klizanja i bez kaskade.

**Hero** — samo fotografija, bez teksta preko nje. Sekcija `100vh`, padding-top = visina headera (263.36px / 83.78px), strane i dno 3vw → foto 1354×593 (desktop), 367×749 (telefon). Ispod, posebna traka: h2 levo (jedna rečenica), crno dugme desno, u istoj liniji; na telefonu dugme ispod, poravnato **desno**.

**Redosled početne:** header → hero foto → traka (h2 + dugme) → foto 100vh → traka „o nama” (paragraf ≈ 9/12 kolona levo, dugme desno poravnato sa prvim redom) → foto 100vh → footer. Obrazac: **foto-ploča / tekst-traka naizmenično**; nema nadnaslova, kartica, ni linija.

**Dugmad** — oba pravougaona, `radius 0`, `border 0`, padding **1.4em 2.338em**:
1. sadržaj: crno, 16px/600, ls 0.02em, bez verzala, visina **68px**;
2. header CTA: crno, 12.544px/500/verzal/0.19em, visina **53px**.
Hover: **opacity 1 → 0.8**, `transition: opacity 0.1s linear`. Ništa drugo se ne menja.

**Linkovi** — u tekstu i footeru stalno podvučeni (1px, boja teksta); nav samo aktivna stavka podvučena.

**Footer** — puna širina, `#F1F1EF`, 3 kolone na x = 43 / 853 / 1084px (procena sa snimka ≈ 12 kolona: 1–6, 7–8, 9–12). Naslov kolone Bodoni h3, ispod linkovi 17.728px/300 podvučeni. Telefon: jedna kolona, grupe jedna ispod druge (≈ 60px između — procena sa snimka). Bez donje trake, bez logotipa.

**Forme** — na početnoj nema polja; tweak klase: `form-field-style-outline`, `form-field-hover-focus-opacity`, `checkbox/radio-fill-outline` → polja sa obrisom 1px, radius 0, hover/fokus menja providnost obrisa (vrednosti nisu izmerene).

## 4. Pokret
- Squarespace globalne animacije **isključene**: `tweak-global-animations-enabled: false`, `animation-type: none` (podešeno bi bilo fade 0.1s / delay 0.1s / ease, ali se ne koristi). `data-animation-role` postoji samo na header elementima i dugmadi, bez efekta. → **nema reveal-a.**
- Prelazi: dugmad `opacity 0.1s linear`; header `transform 0.14s ease-in-out` (neaktivno jer header nije fiksiran); meni kao gore.
- Paralaksa: 0. Karuseli: 0. Keyframes: samo `fonts-loading` (tekst providan dok se font ne učita).
- Telefon: isto, jedina animacija je fade menija.

## 5. Telefon (390px)
- Header 84px, padding 6vw, wordmark max 30px, hamburger „dve linije”; nav i CTA samo u meniju.
- Fotografije uspravne (0.49 / 0.45), margine 3vw = 11.7px; tekst gutter 6vw = 23.4px.
- h2 28.154px, h3 22.077px, tekst 17.013px; eyebrow/CTA **raste** na 13.974px.
- Trake: dugme ispod teksta, desno poravnato, iste mere (16px/600, 68px).
- Footer jedna kolona, 528px.

## 6. Mapiranje na naš template

### (a) Objekat teme
```js
zaliv: {
    naziv: 'Zaliv',
    inspiracija: 'Barrow Salon',
    opis: 'Galerijski minimalizam: crno-belo, ogroman uzani wordmark, fotografije visine ekrana uvučene 3vw, Bodoni + tanki grotesk, bez animacija.',
    tamna: false,
    boje: {
        paper: '#FFFFFF', ink: '#000000', mist: '#F1F1EF', povrsina: '#FFFFFF',
        brand: '#000000', naBrand: '#FFFFFF', linija: '#000000', tamna: '#000000', akcenat: '#F1F1EF',
        logo: '#333333',
    },
    fontovi: {
        naslov: SERIF_BODONI,
        tekst: 'Onest, system-ui, sans-serif',
        oznaka: 'Onest, system-ui, sans-serif',
        logo: '"Sofia Sans Extra Condensed", Oswald, "Arial Narrow", sans-serif',
    },
    naslov: {
        tezina: 400, transform: 'none', razmak: '0', visina: 1.333, skala: 1, akcenat: 'nista',
        velicine: {
            h1: 'clamp(1.76rem, 1.56rem + 0.818vw, 2.296rem)',
            h2: 'clamp(1.76rem, 1.56rem + 0.818vw, 2.296rem)',
            h3: 'clamp(1.38rem, 1.28rem + 0.409vw, 1.648rem)',
        },
    },
    oznaka: { transform: 'uppercase', razmak: '0.19em', velicina: '0.784rem', velicinaTelefon: '0.873rem', tezina: 500 },
    tekst: { tezina: 300, velicina: 'clamp(1.063rem, 1.047rem + 0.068vw, 1.108rem)', visina: 1.8 },
    nav: { font: 'tekst', velicina: '1.108rem', tezina: 300, transform: 'none', razmak: '0', razmakStavki: '19px' },
    dugme: {
        oblik: 'pravo', stil: 'puno',
        tipografija: { velicina: '1rem', tezina: 600, transform: 'none', razmak: '0.02em' },
        padding: '1.4em 2.338em', hover: 'providnost', hoverProvidnost: 0.8, prelaz: 'opacity 0.1s linear',
    },
    radius: { kartica: '0px', slika: '0px' },
    header: {
        tip: 'pun', logo: 'levo-veliki', posleSkrola: 'paper',
        fiksiran: false, senka: false, padding: '3vw', paddingTelefon: '6vw',
        logoVisina: '177px', logoVisinaTelefon: '30px', mreze: true, meniIkona: 'dve-linije',
    },
    hero: 'uvuceno',
    heroOpcije: { visina: '100svh', margina: '3vw', tekst: 'traka', nadnaslov: false, uvod: false },
    kontejner: { sirina: 'none', gutter: '3vw', gutterTelefon: '6vw' },
    ritam: { fotoPloce: true, fotoVisina: '100svh', fotoMargina: '3vw' },
    usluge: 'lista',
    slike: { filter: 'none' },
    footer: { stil: 'kolone', linkovi: 'podvuceni', poziv: false },
    mobilniMeni: {
        poravnanje: 'centar', velicina: '2.072rem', tezina: 300, visina: 1, font: 'tekst',
        prelaz: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1), visibility 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
        kaskada: false,
    },
    pokret: {
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)', brzo: '0.1s', srednje: '0.4s', sporo: '0.6s',
        reveal: 'nista', revealPomak: '0px', revealTrajanje: '0s', stagger: 0,
        heroEfekat: 'nista', heroTrajanje: '0s', heroPrelaz: 600,
        hoverSlika: 1, linkHover: 'samo-aktivan', marquee: 0, marqueePauza: false,
        paralaksa: 0, glatkiSkrol: false, prelazStranice: 'nista',
    },
},
```
`heroPrelaz: 600` nema uporište (referenca ima jednu sliku) — samo da eventualni slajdovi ne seku naglo.

### (b) Nove mogućnosti (po vizuelnom uticaju)
1. **`header.fiksiran: false` + `header.logoVisina`** — header `position:absolute` (ne `fixed`), bez blura/senke (`senka:false`), visina `calc(177px + 2×3vw)`; wordmark visok 177px (verzal ≈ 154px) bez smanjivanja; telefon 30px. `Logo` čita `--logo-visina` umesto `text-7xl`; boja `--c-logo`.
2. **`ritam.fotoPloce`** — na početnoj, između sekcija, ubaciti uvučenu fotografiju `height:100svh; padding:3vw` (slike iz galerije), naizmenično sa tekst-trakama.
3. **`heroOpcije`** — `uvuceno` hero: visina `calc(100svh - var(--header-h) - 3vw)`, margine 3vw; ispod jedna traka `flex justify-between items-center` (h2 + dugme), bez nadnaslova i uvoda (`nadnaslov:false`, `uvod:false`); telefon: kolona, dugme `self-end`.
4. **`kontejner`** — `--kontejner-max: none`, `--gutter: 3vw` (telefon `6vw`) umesto `max-w-sajt px-5 md:px-10`.
5. **`naslov.velicine`** — eksplicitni `clamp` po nivou (`--naslov-h1/h2/h3`) umesto `skala`; `.naslov-3` da poštuje `--naslov-visina` (sada fiksno 1.2).
6. **`dugme.tipografija`, `padding`, `hover:'providnost'`, `prelaz`** — sadržajno dugme bez verzala 16/600/0.02em, `padding:1.4em 2.338em`, hover `opacity:.8` u `0.1s linear`; header CTA ostaje na tokenima `oznaka` sa istim paddingom.
7. **`nav`** — nav linkovi koriste font teksta 17.728px/300 bez verzala (sada `.nadnaslov`).
8. **`reveal:'nista'`** — `[data-reveal='nista'] .pojava{opacity:1;transform:none;transition:none}`.
9. **`linkHover:'samo-aktivan'`** — podvlaka 1px samo na `aria-current`, bez hover animacije.
10. **`footer.stil:'kolone'`, `poziv:false`** — bez velikog „zakaži” naslova i linije; 3 kolone (6/2/4 od 12), naslovi Bodoni h3, linkovi `.tekst-telo` stalno podvučeni.
11. **`mobilniMeni`** — centrirane stavke 33.15px/300 lh 1 u fontu teksta, čist fade (`opacity .4s`, `visibility .6s`, `cubic-bezier(.4,0,.2,1)`), `kaskada:false`; CTA ispod ikonice mreža; ikonica „dve linije” (2×1px, razmak 12px, širina 35px) i tanki X.
12. **`tekst.visina`** — `--tekst-visina: 1.8` za `.tekst-telo` / `.tekst-uvod`.
13. **`oznaka.velicinaTelefon`** — `@media (max-width:767px){--oznaka-velicina:0.873rem}`.
14. **`header.mreze`** — Instagram ikonica (≈18px) između nava i CTA.
15. **`marquee: 0`** — `Brendovi` kao statičan red (referenca nema pokretnih traka).
16. Font: dodati `@fontsource/sofia-sans-extra-condensed/600.css` i `@fontsource/onest/600.css`.

### (c) Šta trenutni `zaliv` radi pogrešno
- Header je **fiksiran**, sa blurom i senkom, 136px, wordmark ~72px (`text-7xl`) koji se smanjuje na skrolu — referenca: 263px, wordmark 177px, header odlazi sa stranom.
- Nav je u verzalu 0.74rem/0.19em (`.nadnaslov`) — to je stil CTA dugmeta; nav je 17.7px/300 bez verzala. I `docs/TEME.md` to pogrešno navodi.
- Hero foto je `72svh` sa `px-10`; treba do dna ekrana sa 3vw okvirom, a ispod skromna traka umesto nadnaslova + h1 + uvoda u mreži `py-20`.
- Fotografije visine ekrana između sekcija ne postoje — a one su suština izgleda.
- Kontejner `84rem` + 40px; referenca je fluidna sa 3vw.
- Naslov `tezina 500` (vidljivo je 400), `visina 1.3` (treba 1.333), `akcenat 'kurziv'` (referenca ga ne koristi), `skala 0.85` daje ~44px h2 na desktopu i ~26px na telefonu umesto 36.7 / 28.2.
- `DM Sans` nema ćirilicu → ruski pada na Manrope; Onest drži isti izgled.
- Dugme u verzalu (sa `oznaka`), hover crno→crno = nevidljiv; treba 16px/600 bez verzala i `opacity .8`, `0.1s linear`.
- `reveal 'fade-up' 12px/0.6s` i `marquee 40` — referenca nema nikakvu animaciju; `prelazStranice 'fade'` takođe višak.
- `tekst.tezina 300` je tačno, ali `lh 1.75` umesto 1.8 i 16px umesto 17.7px.
- Footer ima veliki „zakaži” naslov, liniju i sitan tekst (`text-sm`); referenca: samo tri kolone sa Bodoni naslovima i podvučenim linkovima u punoj veličini teksta.
- Mobilni meni: stavke levo, Bodoni `naslov-2`, kaskada 45ms — referenca: centrirano, tanki grotesk 33px, čist fade.
