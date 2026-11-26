# Template Frizeri

Sajt za frizerske salone i berbernice koji se za novog klijenta pravi
**popunjavanjem jednog fajla** (`src/config/salon.js`) i ubacivanjem
fotografija — bez diranja koda. Izlaz je statički sajt (`dist/`) koji radi na
bilo kom hostingu.

Logika je preneta iz AllSeasons Estetik platforme (jedan izvor podataka o
salonu, vođeno zakazivanje sa imenovanim koracima, prerender za SEO, podaci
firme po zakonu), a izgled iz 8 referentnih salona — svaki je jedna **tema**
koja se bira jednim klikom.

| | |
|---|---|
| Stack | React 18 · Vite 6 · Tailwind 3 · react-router 6 |
| Jezici | srpski (`/`), engleski (`/en/…`), ruski (`/ru/…`) — prevedene adrese, `hreflang` |
| Stranice | Početna, Usluge i cene, Tim, Galerija, O nama, Zakazivanje, Kontakt, Pitanja, Politika privatnosti, Uslovi, Kolačići, 404 |
| SEO | svaka stranica unapred iscrtana (sadržaj u HTML-u), title/opis/canonical/hreflang/Open Graph, JSON-LD (`HairSalon`/`BarberShop`, radno vreme, cenovnik, FAQ), sitemap, robots |
| Teme | 9 — vidi [docs/TEME.md](docs/TEME.md) |
| Zakazivanje | pravljeno prvo za telefon: koraci sa trakom napretka, lepljiva traka sa cenom i dugmetom, izbor frizera i vremena sam vodi dalje |
| Mapa | MapLibre + OpenFreeMap (bez API ključa i kolačića), u bojama teme, nazivi ulica na jeziku sajta |
| Fotografije | 4K WebP + 640/1280/1920 varijante (`npm run slike`), `srcset` bira veličinu |

---

## Brzi start

```bash
npm install
npm run dev          # http://localhost:3000
```

U uglu ekrana je **birač tema**: klik menja ceo izgled odmah (boje, fontove,
raspored, animacije). U `npm run dev` dugme **„Postavi kao temu sajta”**
upisuje izbor u `salon.js`.

| Komanda | Šta radi |
|---|---|
| `npm run dev` | razvojni server sa birač tema |
| `npm run slike` | originalne fotografije iz `slike-izvor/` → 4K WebP + manje verzije u `public/slike/` |
| `npm run provera` | kaže šta je u `salon.js` ostalo demo ili nepopunjeno (prekida ako ima grešaka) |
| `npm run build` | gotov sajt u `dist/` (provera → build → prerender svih stranica na svim jezicima) |
| `npm run preview` | lokalni pregled `dist/` na http://localhost:4173 |

---

## Novi klijent — redosled rada

1. **Kopiraj ceo projekat** u novu fasciklu (npr. `Salon-Ime`), `npm install`.
2. **Popuni `src/config/salon.js`** — sve je komentarisano u samom fajlu:
   - naziv, slogan, opis, `domen` (puna https adresa), godina osnivanja;
   - kontakt (telefon u formatu `+381…`, WhatsApp/Viber, e-mail, mreže);
   - adresa i koordinate (Google Maps → desni klik na lokaciju);
   - radno vreme po danima i neradni dani;
   - **podaci firme** (naziv, PIB, matični broj, šifra delatnosti, PDV) — zakon traži da budu na sajtu;
   - kategorije i usluge sa trajanjem i cenom (`cenaOd: true` za „od …”), `za: ['zene' | 'muskarci' | 'deca']`;
   - tim (ko radi koje usluge i kojim danima — zakazivanje to poštuje);
   - galerija, tekstovi početne i „O nama”, pitanja, recenzije (samo prave!), brendovi, poklon vaučer.
   Tekst može biti običan string ili `{ sr: '…', en: '…', ru: '…' }`; kad prevod fali, prikazuje se srpski.
3. **Fotografije:** originale (bilo koja veličina, JPG/PNG/WebP) stavi u
   `slike-izvor/` pod imenima iz `salon.js` (`hero-1.jpg`, `tim-1.jpg`,
   `usluga-boja.jpg`, `galerija-01.jpg`…) i pokreni `npm run slike`. Dobija se
   WebP do 3840 px (4K) + 640/1280/1920 px verzije; sajt sam bira veličinu po
   ekranu. Bez fotografije se prikazuje diskretna površina u bojama teme.
   Demo fotografije su sa Unsplash-a — **za klijenta ih zameni pravim**
   ([docs/SLIKE-IZVORI.md](docs/SLIKE-IZVORI.md)).
4. **Tema:** u `npm run dev` izaberi u biraču i klikni „Postavi kao temu sajta”
   (ili upiši `tema: 'soho'`). Boje/fontove možeš i da pregaziš:
   `tema: { osnova: 'soho', boje: { brand: '#9C6B3F' } }`.
5. **Jezici:** `jezici: ['sr', 'en', 'ru']` — izbaci one koji ne trebaju.
6. **Zakazivanje** (`zakazivanje` u `salon.js`):
   - `nacin: 'zahtev'` — klijent bira uslugu → frizera (samo ako uslugu radi ≥ 2 osobe) → dan i vreme (mreža od 15 min, u beogradskom vremenu, usluga mora da se završi pre zatvaranja) → podatke → potvrdu. Salon potvrđuje termin. Zahtev stiže preko `kanal.tip`:
     - `'webhook'` + `kanal.url` — POST JSON (Formspree, Make, n8n, Google Apps Script, sopstveni API). **Preporučeno.** Ako ne uspe, klijentu se odmah nude WhatsApp/Viber/poziv.
     - `'whatsapp'` / `'viber'` / `'email'` — otvara aplikaciju sa popunjenom porukom.
   - `nacin: 'link'` + `link` — sve „Zakaži” vodi na spoljni sistem (SrediMe, Fresha…).
   Posle slanja klijent može da doda termin u kalendar (.ics).
7. **Analitika** (opciono): `analitika.ga4` / `analitika.metaPixel` — učitavaju se tek kad posetilac prihvati kolačiće; bez njih se traka za kolačiće ni ne prikazuje.
8. **`demo: false`** — tek kad su podaci pravi. Dok je `true`: sajt je `noindex`, robots.txt zatvara sve, a birač tema se vidi i na objavljenom sajtu (zgodno za pokazivanje klijentu: link `…/?tema=palma` otvara tu temu).
9. `npm run provera` → ispravi sve ✗ → `npm run build` → objavi `dist/`.

---

## Objava (`dist/` na hosting)

Sajt je statičan: svaka stranica je `…/index.html`, plus `404.html`,
`sitemap.xml`, `robots.txt`, ikone, `site.webmanifest` i slika za deljenje
(`og-slika.jpg`, napravljena iz prve hero fotografije ako ne postoji u `public/`).

**Apache / cPanel** — `public/.htaccess` se kopira u `dist/` i već sadrži:
HTTPS preusmerenje, adrese bez kose crte na kraju, `ErrorDocument 404 /404.html`,
ljusku panela za adrese `/panel/…` koje nemaju svoj HTML,
keširanje (`assets/` godinu dana — imaju heš u imenu) i bezbednosna zaglavlja.
Samo prebaci sadržaj `dist/` u `public_html/`.

**Nginx:**

```nginx
server {
    server_name www.salon.rs;
    root /var/www/salon/dist;
    index index.html;
    error_page 404 /404.html;

    location / {
        try_files $uri $uri/index.html $uri/ =404;
    }
    # Panel: adrese bez svog HTML-a (karton klijenta /panel/klijenti/…) → ljuska panela
    location /panel/ {
        try_files $uri $uri/index.html /panel/index.html;
    }
    location /assets/ {
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
    location ~* \.(webp|jpg|png|svg)$ {
        add_header Cache-Control "public, max-age=2592000";
    }
}
```

**Netlify:** Build command `npm run build`, Publish directory `dist`.
**Vercel:** Framework „Other”, Output `dist`, u `vercel.json` `{ "cleanUrls": true, "trailingSlash": false }`.
Oba sama služe `404.html`.

**GitHub Pages (demo):** `.github/workflows/pages.yml` na svaki push na `main`
pravi sajt i objavljuje ga na `https://<korisnik>.github.io/<repo>/`. Podfolder
i adresu računa sam iz imena repo-a (`BAZA`, `VITE_DOMEN`), pa radi i u kopiji
template-a pod drugim imenom. Jednom treba uključiti Settings → Pages → Source:
„GitHub Actions”. Besplatni nalog: samo za javne repo-e. Isti podfolder lokalno:
`BAZA=/template/ npm run build`.

Posle objave: dodaj sajt u Google Search Console, pošalji `sitemap.xml`, i
proveri Google profil salona (adresa i radno vreme isti kao u `salon.js`).

---

## Teme

| Tema | Po uzoru na | Karakter |
|---|---|---|
| `menhetn` | Yukie Natori NY | maslinasta i krem, Manrope, pill dugmad sa strelicom, Ken Burns |
| `palma` | Palm Sunday | minimalizam, ogromni tanki naslovi, logo u sredini, paralaksa |
| `soho` | Salon 64 London | kurziv + verzal, Lenis glatki skrol, reči izranjaju |
| `istsajd` | Fringe NY | koral/menta/ljubičasta, Cormorant + Onest, zaobljeno |
| `zaliv` | Barrow SF | crno-belo, Bodoni, ogroman logotip, uvučene fotografije |
| `holivud` | Nine Zero One | nude i crno, široki small-caps, marquee |
| `hjuston` | The Upper Hand | crno-bele fotografije, centrirano, crveni akcenti |
| `volstrit` | Fabio Doti | Bodoni verzal, Jost sa razmakom, pločice usluga |
| `noar` | (tamna berbernica) | grafit i mesing, Oswald |

Izmerene vrednosti (fontovi, boje, krive, trajanja, biblioteke) i šta je čime
zamenjeno: [docs/TEME.md](docs/TEME.md). Kod, slike i tekstovi tih sajtova nisu
kopirani — teme ponavljaju dizajnerske odluke, napisane iznova. Fontovi se
isporučuju sa sajta (`@fontsource`, bez Google Fonts poziva); fontovi bez
ćirilice imaju rezervni font sa ćirilicom za rusku verziju.

---

## Panel salona (demo)

Na `/panel` je administrativni panel po uzoru na AllSeasons panel — **samo
front, sa izmišljenim podacima**, za prezentaciju klijentu. Na demo sajtu se
otvara dugmetom „Panel” pored birača tema, ili direktno: `/panel/prijava`.

- **Prijava bez lozinke:** bira se uloga — Administrator (vlasnik), Menadžer,
  Recepcija ili Zaposleni (stilista). Svaka uloga ima svoj meni, kao u pravom
  panelu, a uloga se menja i iz menija naloga (gore desno).
- **Stranice:** Početna (šta čeka, promet, ko radi, poslovanje), Kalendar (dan po
  radnicima, nedelja, lista; prevlačenje termina), Zahtevi za termin, Lista
  čekanja, Novi termin, Dnevni promet, Analitika, Popunjenost, Ocene, Klijenti +
  karton klijenta, Kartoteka, Otkazivanja, Raspored smena, Odsustva, Osoblje,
  Zarade, Usluge i cene, Proizvodi i magacin, Vaučeri, Promo kodovi, SMS
  kampanje, Izgled sajta (teme), Galerija, Podaci salona, Radno vreme,
  Podešavanja, Dnevnik izmena, Moj profil. Svetla i tamna tema, radi i na telefonu.
- **Podaci:** `src/panel/podaci/generator.js` pravi ih iz `salon.js` (usluge,
  cene, tim, radno vreme) plus izmišljene klijente i termine oko današnjeg dana.
  Izmene iz panela ostaju u tom browseru (localStorage) do „Vrati podatke”.
- **Kod:** `src/panel/` — učitava se zasebno, samo na `/panel`, pa sajt ne nosi
  njegov kod. Panel nikad ne ide u pretraživače (noindex, `Disallow: /panel/`).
  Za pravi rad se `src/panel/podaci/Skladiste.jsx` veže za API; stranice se ne menjaju.

---

## Pravni tekstovi

Politika privatnosti, uslovi korišćenja i stranica o kolačićima se generišu iz
podataka firme u `salon.js` (`src/i18n/pravno.js`), prema Zakonu o zaštiti
podataka o ličnosti i Zakonu o zaštiti potrošača. **To je šablon, ne pravni
savet** — pre objave za klijenta neka ga pogleda pravnik, naročito ako salon
koristi analitiku, newsletter ili prodaje online. Engleska i ruska verzija su
prevodi; merodavna je srpska.

---

## Struktura

```
src/
  config/salon.js        ← PODACI KLIJENTA (jedini fajl koji se menja)
  config/teme.js         ← 9 tema: boje, fontovi, raspored, pokret
  config/slike.json      ← dimenzije i varijante fotografija (piše `npm run slike`)
  i18n/                  ← sr/en/ru tekstovi interfejsa, adrese stranica, pravni tekstovi
  lib/                   ← radno vreme i termini, zakazivanje, SEO/JSON-LD, tema, kolačići, .ics
  components/ sekcije/   ← header, footer, birač tema, hero (5 rasporeda), sekcije početne
  stranice/              ← stranice sajta
  panel/                 ← demo panel salona (/panel): ljuska, UI, grafikoni, podaci, stranice
  entry-client.jsx       ← hidratacija (ili novo iscrtavanje kad je u biraču druga tema)
  entry-server.jsx       ← render za prerender
scripts/
  prerender.mjs          ← dist/: sve stranice × jezici, 404, sitemap, robots, ikone, og-slika
  provera.mjs            ← provera salon.js pre objave
  slike.mjs              ← originali → 4K WebP + varijante
public/                  ← fotografije (slike/), .htaccess; sve se kopira u dist/
docs/TEME.md             ← istraživanje referentnih sajtova
docs/SLIKE-IZVORI.md     ← izvori i licenca demo fotografija
```
