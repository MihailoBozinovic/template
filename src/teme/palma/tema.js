/*
 * Tema „palma” — podaci (boje, fontovi, tipografija, raspored, pokret).
 * Specifikacija po referentnom sajtu: docs/teme/palma.md
 * Komponente koje tema menja: ./komponente.jsx · stilovi samo za ovu temu: ./tema.css
 *
 * Skala naslova je ista kao na referenci (clamp već uključuje × 0.9):
 *   prikaz XL (izjava)        114.92 px desktop / 51.31 px telefon
 *   prikaz L  (h1, veliki linkovi, tim)  99.47 / 49.32
 *   h2 sekcije                 70.50 / 43.58
 *   h3 kartice                 37.61 / 25.37
 */
import { SANS_INTER } from '../fontovi-stekovi.js';

const NASLOV = { tezina: 400, razmak: '-0.04em', transform: 'none', font: 'naslov' };
const SITNO = { velicina: ['0.75rem', '0.6875rem'], visina: 1.4, razmak: '0.04em', tezina: 400, transform: 'uppercase', font: 'tekst' };

export default {
    naziv: 'Palma',
    inspiracija: 'Palm Sunday',
    opis: 'Galerijski minimalizam: Inter sa lh .8, sitan verzal, providna polja preko dve fotografije, tamne sekcije, paralaksa ćelija.',
    tamna: false,
    boje: {
        paper: '#FAFAF8', ink: '#252523', mist: '#F7F5F0', povrsina: '#FFFFFF',
        brand: '#252523', naBrand: '#FAFAF8', linija: '#252523', tamna: '#252523', akcenat: '#F7D5D0',
        // Dodatne (→ --c-preko-foto, --c-polje-jedan…)
        prekoFoto: '#F7F5F0',
        poljeJedan: '#FDEDEC',
        // Referenca #DDA09C (1.9:1 na polju) — potamnjeno do ≥ 3:1 za veliki tekst.
        tekstJedan: '#B86E69',
        // Referenca rgba(178,158,152,.6) — potamnjeno (#806A64 / .74) da krem reč ima ≥ 3:1 preko fotografije.
        poljeDva: '#806A64',
    },
    fontovi: { naslov: SANS_INTER, tekst: SANS_INTER, oznaka: SANS_INTER, logo: 'Oswald, "Arial Narrow", sans-serif' },
    naslov: { tezina: 400, transform: 'none', razmak: '-0.04em', visina: 0.9, skala: 1, akcenat: 'nista', visinaPrikaz: 0.8, kvadrat: true },
    tipografija: {
        hero: { ...NASLOV, velicina: 'clamp(3.15rem, 1.73rem + 6.058vw, 9rem)', visina: [0.8, 0.9] },
        h1: { ...NASLOV, velicina: 'clamp(3.0375rem, 1.918rem + 4.777vw, 7.65rem)', visina: [0.8, 0.9] },
        h2: { ...NASLOV, velicina: 'clamp(2.7rem, 2.099rem + 2.563vw, 5.175rem)', visina: 0.9 },
        h3: { ...NASLOV, velicina: 'clamp(1.575rem, 1.302rem + 1.165vw, 2.7rem)', visina: 1 },
        telo: SITNO,
        uvod: SITNO,
        oznaka: SITNO,
        nav: { velicina: '0.75rem', visina: 'normal', razmak: '0.04em', tezina: 400, transform: 'uppercase', font: 'tekst' },
        dugme: { velicina: '0.75rem', visina: 'normal', razmak: '0', tezina: 400, transform: 'uppercase', font: 'tekst' },
        meni: { velicina: '4rem', visina: 1, razmak: '-0.04em', tezina: 400, transform: 'none', font: 'naslov' },
        footer: { velicina: '0.8rem', visina: 1.4, razmak: '0.04em', tezina: 400, transform: 'uppercase', font: 'tekst' },
        logo: { velicina: ['1.75rem', '1.5rem'], visina: 1, razmak: '0', tezina: 600, transform: 'uppercase', font: 'logo' },
    },
    razmaci: { kontejner: '100%', gutter: ['3rem', '1.25rem'], sekcija: ['5.5rem', '3rem'], header: ['80px', '46px'] },
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
};
