/*
 * Tema „volstrit” — podaci (boje, fontovi, tipografija, raspored, pokret).
 * Specifikacija po referentnom sajtu: docs/teme/volstrit.md
 * Komponente koje tema menja: ./komponente.jsx · stilovi samo za ovu temu: ./tema.css
 */
import { SERIF_BODONI } from '../fontovi-stekovi.js';

/* Fluidne veličine iz specifikacije (linearno 390 → 1440 px). */
const NASLOV_VELIKI = 'clamp(3.048rem, 2.488rem + 2.299vw, 4.557rem)'; // 48.77 → 72.91 px
const NASLOV_SREDNJI = 'clamp(1.506rem, 1.351rem + 0.64vw, 1.927rem)'; // 24.10 → 30.82 px
const PODNASLOV = 'clamp(1.127rem, 1.07rem + 0.231vw, 1.279rem)'; // 18.03 → 20.46 px

export default {
    naziv: 'Volstrit',
    inspiracija: 'Fabio Doti',
    opis: 'Njujorški klasik: sivobela podloga, Bodoni verzal, crno-beli hero sa kosom ivicom, pločice u boji, statičan sajt.',
    tamna: false,
    boje: {
        paper: '#F5F5F5', ink: '#3B3B3B', mist: '#EAEAEA', povrsina: '#FFFFFF',
        brand: '#C0BFAA', naBrand: '#000000', linija: '#3B3B3B', tamna: '#1C1C1C', akcenat: '#C0BFAA',
        // dodatne uloge → --c-telo, --c-na-foto, --c-footer-tekst, --c-meni, --c-info-traka
        telo: '#626262', naFoto: '#F5F5F5', footerTekst: '#A0A0A0', meni: '#575757', infoTraka: '#222222',
    },
    fontovi: { naslov: SERIF_BODONI, tekst: 'Poppins, Jost, system-ui, sans-serif', oznaka: 'Jost, system-ui, sans-serif', logo: SERIF_BODONI },
    naslov: { tezina: 400, transform: 'uppercase', razmak: '0.02em', visina: 1.1317, skala: 1, akcenat: 'nista' },
    oznaka: { transform: 'uppercase', razmak: '0.3em', velicina: '0.681rem', tezina: 500 },
    tekst: { tezina: 400, velicina: '0.95rem' },
    dugme: { oblik: 'pravo', stil: 'puno', hover: 'providnost', hoverProvidnost: 0.8 },
    radius: { kartica: '0px', slika: '0px' },

    /* Tačna tipografija po nivou: [desktop, telefon] (prelom 768px). */
    tipografija: {
        hero: { velicina: NASLOV_VELIKI, visina: 1.1317, razmak: '0.02em', tezina: 400, transform: 'uppercase', font: 'naslov' },
        h1: { velicina: NASLOV_VELIKI, visina: 1.1317, razmak: '0.02em', tezina: 400, transform: 'uppercase', font: 'naslov' },
        h2: { velicina: NASLOV_SREDNJI, visina: 1.258, razmak: '0.02em', tezina: 400, transform: 'uppercase', font: 'naslov' },
        h3: { velicina: NASLOV_SREDNJI, visina: 1.258, razmak: '0.02em', tezina: 400, transform: 'uppercase', font: 'naslov' },
        uvod: { velicina: PODNASLOV, visina: 1.6, razmak: '0.015em', tezina: 400, font: 'tekst' },
        telo: { velicina: ['0.9545rem', '0.9367rem'], visina: 1.6, razmak: '0.02em', tezina: 400 },
        oznaka: { velicina: '0.681rem', visina: 1.4, razmak: '0.3em', tezina: 500, transform: 'uppercase', font: 'oznaka' },
        nav: { velicina: '0.808rem', visina: 1.8, razmak: '0.06em', tezina: 600, transform: 'uppercase', font: 'oznaka' },
        dugme: { velicina: ['0.681rem', '0.777rem'], visina: 1.2, razmak: '0.3em', tezina: 500, transform: 'uppercase', font: 'oznaka' },
        meni: { velicina: '2.072rem', visina: 1, razmak: '0.0326em', tezina: 600, transform: 'uppercase', font: 'oznaka' },
        footer: { velicina: ['0.9545rem', '0.9367rem'], visina: 1.6, razmak: '0.02em', tezina: 400, font: 'tekst' },
        logo: { velicina: ['2rem', '1.5rem'], visina: 1, razmak: '0', tezina: 400, transform: 'uppercase', font: 'logo' },
    },
    /* Pun raspored („Full”): bočni rub 37px na 1440 (2.57vw), 6vw na telefonu. */
    razmaci: { kontejner: '110rem', gutter: ['2.57vw', '6vw'], sekcija: ['6rem', '3.5rem'], header: ['61px', '84px'] },

    header: {
        tip: 'staticki', logo: 'levo', logoTelefon: 'centar', posleSkrola: 'nista', nav: 'centar',
        mreze: true, dugmeZakazi: false, prelaz: 'transform .14s ease-in-out',
    },
    hero: 'puna-centar',
    heroOpcije: { ispodHeadera: true, nadnaslov: false, dugmad: false, kosaIvica: '5.8vw', kosaIvicaTelefon: '5.4vw', linijaIvice: '3px' },
    usluge: 'plocice',
    plocice: { odnos: '333 / 312', odnosTelefon: '343 / 374', razmak: '11px', kolonaTelefon: 1, zaglavlje: false, hover: 'nista' },
    izjava: 'dve-kolone',
    brendovi: 'tekst-red',
    footer: 'minimalan',
    slike: { filter: 'none', heroFilter: 'grayscale' },
    mobilniMeni: { poravnanje: 'centar', prelaz: 'opacity .4s cubic-bezier(.4,0,.2,1), visibility .6s cubic-bezier(.4,0,.2,1)' },
    infoTraka: { telefon: true, stavke: ['email', 'poziv', 'radnoVreme'], sakrijNaSkrol: true },

    /* Sajt je statičan: bez reveal-a, hovera, paralakse i prelaza stranica. */
    pokret: {
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)', brzo: '0.1s', srednje: '0.4s', sporo: '0.6s',
        reveal: 'nista', revealPomak: '0px', revealTrajanje: '0s', stagger: 0,
        heroEfekat: 'nista', heroTrajanje: '0s', heroPrelaz: 0,
        hoverSlika: 1, linkHover: 'nista', marquee: 0, marqueePauza: false,
        paralaksa: 0, glatkiSkrol: false, prelazStranice: 'nista',
    },
};
