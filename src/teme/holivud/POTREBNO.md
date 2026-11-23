# holivud — potrebne zajedničke izmene

Sve je privremeno rešeno u `src/teme/holivud/tema.css`, ali selektorima po Tailwind klasama, što je krhko.

## 1. Fiksna visina headera od 76 px u zajedničkim stranicama (važno)

Header teme holivud je lepljiv (`sticky`) i stoji u toku stranice: najava 45/37 px, pa header 124/56 px. Na početnoj ide preko heroja sa `margin-bottom: -var(--header-h)`. Zajedničke stranice pretpostavljaju fiksni header od 76 px:

| Fajl | Klasa | Problem |
|---|---|---|
| `src/stranice/Cenovnik.jsx` | `sticky top-[76px]` (traka filtera) | traka se lepi ispod headera od 124 px |
| `src/stranice/Cenovnik.jsx` | `scroll-mt-40`, `lg:top-44` | sidra i lepljiv naslov kategorije |
| `src/stranice/Zakazivanje.jsx` | `pt-[92px] md:pt-[140px]` (kompaktno zaglavlje) | višak prostora kad je header u toku stranice |
| `src/stranice/Zakazivanje.jsx` | `sticky top-[76px]` (čipovi, telefon), `sticky top-28` (sažetak) | isto |
| `src/stranice/Kontakt.jsx` | `lg:sticky lg:top-28` (mapa) | isto |
| `src/stranice/NijePronadjeno.jsx` | `pt-28` | isto |

**Predlog:** svuda koristiti promenljivu koju tema već postavlja (`razmaci.header` → `--header-h`):

- `top-[76px]` → `top-[var(--header-h,76px)]`
- `top-28` → `top-[calc(var(--header-h,76px)+2rem)]`
- `scroll-mt-40` → `scroll-mt-[calc(var(--header-h,76px)+5.5rem)]`
- gornji padding prve sekcije podstranice → `pt-[var(--sadrzaj-pt,92px)] md:pt-[var(--sadrzaj-pt,140px)]`, uz novo polje `razmaci.sadrzaj` u `cssTeme`. Za header u toku stranice tema bi zadala manju vrednost.

Kad se to uvede, iz `tema.css` treba obrisati blok „Podstranice → Header je u toku stranice…”.

## 2. `MobilniMeni` (src/components/Header.jsx): gornji padding je fiksan `pt-28`

Tema sa najavom iznad headera traži više prostora. **Predlog:** dodati prop `klasaSadrzaja` (ili `style={{ paddingTop: 'var(--meni-pt, 7rem)' }}`). Sada se to rešava sa `.hv-meni > div { padding-top: … }`.

## 3. `IzborJezika` (src/components/delovi.jsx): neaktivni jezik ima `opacity-55`

Na papiru to daje oko 4.3:1, ispod praga od 4.5. Alat za kontrast to ne meri, jer ne otvara meni. **Predlog:** `opacity-70`. Tema holivud ima sopstveni `HvJezici`, ali podrazumevani mobilni meni i dalje koristi `IzborJezika`.

## 4. `Marquee` (delovi.jsx) i `.marquee` (index.css): tema ne može da isključi masku, razdvajač i razmak

Spec traži `marqueeMaska:false`, `marqueeRazdvajac:''` i `marqueeRazmak:'80px'`, uz animaciju `translate(calc(-100% - var(--gap)))`. **Predlog:**

- `Marquee` da čita `tema.pokret.marqueeRazdvajac`, `marqueeMaska` i `marqueeRazmak`.
- `.marquee` da dobije `[data-marquee-maska='ne'] .marquee { mask-image: none }`, preko novog atributa u `atributiTeme`.

Holivud zasad ima sopstvenu traku (`TrakaBrendova`, klase `hv-marquee*`).

## 5. `Foto` (primitivi.jsx): nema ulaza slike po učitavanju (`slike.ulaz: '0.6s'`)

Referenca pokazuje slike kroz `opacity .6s` kad se učitaju. **Predlog:**

- stanje `ucitano` (`onLoad`, plus provera `img.complete` u `useEffect` zbog slika iz keša i SSR-a);
- atribut `data-ucitano` na okviru;
- CSS `.js .foto-okvir:not([data-ucitano]) .foto { opacity: 0 } .foto { transition: opacity var(--ulaz-slike, 0s) }`.

## 6. Sitnice (nisu hitne)

- `src/components/Header.jsx` → `Logo`: grana `tema.id === 'holivud' && 'tracking-[0.18em]'` se više ne koristi, jer holivud ima svoj `HvLogo`.
- `src/sekcije/Sekcije.jsx` → `Recenzije`: `'holivud'` u nizu `centar` se više ne koristi, jer holivud ne prikazuje tu sekciju.
