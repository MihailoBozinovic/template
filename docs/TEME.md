# Teme — šta je izvučeno sa referentnih sajtova

Svaka tema je napravljena po jednom referentnom sajtu. Vrednosti ispod su
**izmerene u browseru 23. 11. 2026.** (computed style, `document.fonts`,
`@keyframes` iz stilova, detekcija biblioteka) — ne procenjene sa slike.

Kod, slike i tekstovi tih sajtova **nisu kopirani**: tema ponavlja *dizajnerske
odluke* (paleta, tipografska hijerarhija, krive i trajanja animacija, raspored),
a sve je napisano iznova. Licencirani fontovi su zamenjeni najbližim besplatnim
(kolona „Zamena”), koji se isporučuju sa sajtom (`@fontsource`, bez Google
Fonts poziva — bolje za privatnost i brzinu).

Teme su definisane u `src/config/teme.js`; bira se jednim klikom (birač tema u
uglu, dok je `demo: true` ili u `npm run dev`) ili upisom `tema: 'ime'` u
`src/config/salon.js`.

| Tema | Po uzoru na | Platforma i biblioteke |
|---|---|---|
| `menhetn` | Yukie Natori NY | WordPress + Elementor, Swiper (fade), Ken Burns |
| `palma` | Palm Sunday | Shopify (tema sa scroll-driven paralaksom) |
| `soho` | Salon 64 London | Webflow + **GSAP ScrollTrigger + Lenis**, Splide |
| `istsajd` | Fringe NY | custom React, reveal/fade/slide klase |
| `zaliv` | Barrow SF | Squarespace (animacije `data-animation-role`) |
| `holivud` | Nine Zero One | Shopify, Swiper, CSS marquee |
| `hjuston` | The Upper Hand | WordPress, lightSlider, `fadeInUp` |
| `volstrit` | Fabio Doti | Squarespace (fluid image animations) |
| `noar` | — (tamna berbernica, izvedena iz `volstrit` + `holivud`) | — |

---

## menhetn — Yukie Natori New York

- **Fontovi:** Manrope 400 / 600 za sve (naslovi 42 px / 600 / lh 1.0, h3 36 px / 600). Zamena: nije potrebna.
- **Boje:** maslinasta `#3C391C` (header, dugmad, 27 pozadina), krem `#E8E3BE`, bela `#FFFFFF`, tekst `#000` / `#393939` / `#505050`.
- **Dugme:** pill `border-radius: 30px`, padding `2px 2px 2px 30px` — tekst levo, **bela kružna strelica desno** u dugmetu.
- **Nav:** stavke sa `rgba(255,255,255,.1)` pozadinom, padding `10px 20px`; header se lepi pri skrolu (maslinast).
- **Tranzicije:** `background, border, border-radius, box-shadow .3s ease`, `transform .4s ease`; `all .3s/.4s ease`.
- **Animacije:** hero = pozadinski slideshow sa **Ken Burns** (`transform 10s linear`, zum ka unutra), `swiper-fade`; **marquee** logotipa (`translateX(0 → -50%) 10s linear infinite`); `fadeInDown 20px`.
- **Raspored:** hero preko cele širine (foto + tamni veo), naslov i opis levo; sekcije: mali nadnaslov levo + veliki naslov + paragraf desno; visoke kartice usluga (naslov gore levo, „Read more” pill dole); traka „As seen in”.

## palma — Palm Sunday

- **Fontovi:** Inter 400 (tekst **velikim slovima**, `letter-spacing: .04em`, 11–12 px nadnaslovi), naslovi `system-ui` 400 **~100 px, `letter-spacing: -0.04em`, `line-height: .9`**. Zamena: Inter za oba.
- **Boje:** tinta `#252523`, papir `#FAFAF8`, krem `#F7F5F0`; providni pravougaonici u roze `rgba(247,213,208,.75)` i sivo-bež tonu preko fotografija.
- **Dugme:** obris `0.8px solid`, pill `30px`, 12 px velikim slovima.
- **Tranzicije:** sve `0.2s ease-in-out` (boja, opacity, transform), `cubic-bezier(.4,0,.2,1)` za opacity+transform.
- **Animacije:** `link-faded-reverse` — **hover na jednu stavku gasi ostale**; `cell-vertical-parallax` (scroll-driven, ±offset); `zoom-image` na hover; `textWithIconsItemsScale` (opacity 0→1, scale .8→1).
- **Raspored:** logo **u sredini** headera; hero od **dve fotografije** sa ogromnim rečima (SHOP / BOOK) u providnim kvadratima; tamne sekcije sa ogromnim tankim naslovom i rasutim fotografijama koje plutaju (paralaksa).

## soho — Salon 64 London

- **Fontovi:** Saol Display 400 **kurziv + verzal** u istom naslovu („Welcome to *the* SALON”), 144 px / lh 1.1; Inter 300–700 za tekst; nav Inter 500 14 px, verzal, `letter-spacing: 1.4px`. Zamena za Saol: **Bodoni Moda** (visok kontrast, ima kurziv).
- **Boje (CSS promenljive sajta):** `--black #1e1e1e`, `--white #fffcf5`, `--grey #898989`, siva `#F0F0F0`, peščana `#E2C6A9`.
- **Easing:** `--cubic-default: cubic-bezier(0.525, 0, 0, 1)`, `--duration-fast: .2s`, `--duration-normal: .45s`; boje `cubic-bezier(.625,.05,0,1) .2s`.
- **Animacije:** **Lenis** glatki skrol; GSAP **split-text** (linije naslova izranjaju); `parallax-item` / `parallax-scroll-img` (30 elemenata); `arrow-hover` (strelica klizi desno); marquee `translateX(-100%) 40.96s linear infinite`; galerija-slajder sa strelicama.
- **Dugme:** `border-radius: 4px`, 12 px verzal, `0.8px` okvir.
- **Raspored:** hero preko celog ekrana (fotografija), ogroman naslov dole levo, dva tekst-linka sa strelicom; pločice lokacija sa centriranim naslovom kurziv+verzal.

## istsajd — Fringe NY

- **Fontovi:** Cormorant Infant 400–800, `text-transform: capitalize` (h1 64 px, h2 34 px / 800); Onest 300/400/700 za tekst. Zamena: **Cormorant Garamond** + Onest.
- **Boje:** tamnoljubičasta `#292145` (tekst), koral `#F6AFA1` (dugmad), menta `#CEE5DC` (sekcije), bela.
- **Dugme:** koral pill `40px`, padding `4px 24px`, okvir iste boje.
- **Kartice:** `border-radius: 16–18px`.
- **Tranzicije:** `all .5s ease`; boja/pozadina `.25s` i `.75s`; slajder `left 1s cubic-bezier(.42,0,.58,1)`.
- **Animacije:** klase `reveal fade slide` na 73 elementa — postepeno pojavljivanje sa klizanjem.

## zaliv — Barrow Salon

- **Fontovi:** LTC Bodoni 175 500 (h3 37 px); Proxima Nova **300** za tekst (17.7 px / lh 1.8); nav 12.5 px / 500 / verzal / `letter-spacing: .19em`. Zamena: **Bodoni Moda** + **DM Sans 300**; logo: ogroman uzan grotesk → **Oswald**.
- **Boje:** čista crna i bela, `#F1F1EF` za podloge.
- **Dugme:** crni pravougaonik, bez zaobljenja, verzal sa razmakom.
- **Tranzicije (Squarespace):** `opacity .25s` i `transform .6s cubic-bezier(.4,0,.2,1)`, `visibility, opacity .6s`.
- **Raspored:** ogroman wordmark levo, mali meni desno, fotografije uvučene sa belim marginama.

## holivud — Nine Zero One

- **Fontovi:** Helvetica (tekst 12 px verzal za sitne oznake; h1 40 px / 700 / `-1.5px`), dekorativni naslovi u širokom small-caps pismu sa `letter-spacing: 3px`. Zamena: sistemski Helvetica/Arial + **Cormorant SC**.
- **Boje:** `#111111`, bela, `#FFFEFC`, nude `#F5EBDF`.
- **Dugme:** obris, pravougaono, padding `16px 40px`.
- **Animacije:** `fade-in .8s ease` (11 elemenata), `slideUp` (`translateY(30px)`, `.4s`), **marquee 110s linear infinite, pauza na hover**.
- **Tranzicije:** boja `.3s ease`, pozadina `.2s`, opacity/visibility `.6s`.
- **Raspored:** hero preko celog ekrana, providan nav preko fotografije (beli tekst), naslov dole levo; dvokolonski paneli slika/video.

## hjuston — The Upper Hand

- **Fontovi:** Cormorant Garamond 400 (hero 96 px, `letter-spacing: -2px`; tekst 22 px / lh 1.75), Raleway **700** verzal za logo i dugmad (10 px, `letter-spacing: 2px`).
- **Boje:** crvena `#D22630` (dugmad i reči-akcenti u kurzivu), `#222`, `#F5F5F5`, bela; fotografije **crno-bele**.
- **Dugme:** malo crveno pravougaono (`12px 20px`); okrugle ikonice društvenih mreža.
- **Animacije:** `fadeInUp` (`translateY(20px)`, **1s ease-in-out**), `fadein 1s ease`; tranzicije `all .2s ease-in-out`, `.5s linear`.
- **Raspored:** fiksiran providan header, **centriran** hero preko cele širine, pet zvezdica ispod naslova, centrirane sekcije sa kurzivnim crvenim akcentima.

## volstrit — Fabio Doti

- **Fontovi:** Bodoni Moda 400 **verzal** (h1 73 px, `letter-spacing: .02em`), Futura PT 500/600 verzal sa `letter-spacing: .3em` za meni i dugmad, Poppins 400 za tekst. Zamena za Futuru: **Jost**.
- **Boje:** grafit `#3B3B3B`, `#F5F5F5`, `#1C1C1C`, kaki `#C0BFAA` (dugme).
- **Animacije (Squarespace):** `opacity .25s cubic-bezier(.4,0,.2,1)`, `transform .6s cubic-bezier(.4,0,.2,1)`, fluid image reveal.
- **Raspored:** **crno-beli** hero preko cele širine, centriran verzalni serif; četiri pločice usluga sa natpisom preko fotografije; dvokolonski blok — ogroman verzalni naslov levo, tekst desno.

## noar — tamna berbernica

Izvedena: paleta i verzal iz `volstrit`, marquee i oznake iz `holivud`, uz
**Oswald** za naslove (uzan grotesk, tipičan za berbernice) i mesingani akcent
`#C29A5B` na grafitu `#101011`.
