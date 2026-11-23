/*
 * Tema „menhetn” — podaci (boje, fontovi, tipografija, raspored, pokret).
 * Specifikacija po referentnom sajtu: docs/teme/menhetn.md
 * Komponente koje tema menja: ./komponente.jsx · stilovi samo za ovu temu: ./tema.css
 */
import { SERIF_CORMORANT } from '../fontovi-stekovi.js';

const MANROPE = 'Manrope, system-ui, sans-serif';

export default {
    naziv: 'Menhetn',
    inspiracija: 'Yukie Natori New York',
    opis: 'Spa-salon iz Midtauna: maslinasti header uvek vidljiv, Manrope 600, pill dugmad sa belim krugom i strelicom, sporo pretapanje sa Ken Burns zumom, oštre pločice.',
    tamna: false,
    boje: {
        paper: '#FFFFFF', ink: '#000000', mist: '#E8E3BE', povrsina: '#FFFFFF',
        brand: '#3C391C', naBrand: '#FFFFFF', linija: '#505050', tamna: '#3C391C', akcenat: '#E8E3BE',
        // dodatne → --c-tekst-blag, --c-tekst-bledi, --c-okvir, --c-crta
        tekstBlag: '#505050', tekstBledi: '#6E6E6E', okvir: '#E6E6E6', crta: '#333333',
    },
    fontovi: { naslov: MANROPE, tekst: MANROPE, oznaka: MANROPE, logo: SERIF_CORMORANT },
    naslov: { tezina: 600, transform: 'none', razmak: 'normal', visina: 1.1, skala: 1, akcenat: 'nista' },
    oznaka: { transform: 'none', razmak: 'normal', velicina: '1rem', tezina: 400 },
    tekst: { tezina: 400, velicina: '1rem' },

    /* Tačne veličine po nivou: [desktop, telefon] (prelom 768px). */
    tipografija: {
        hero: { velicina: ['62px', '36px'], visina: ['62px', '36px'], razmak: 'normal', tezina: 600, transform: 'none', font: 'naslov' },
        h1: { velicina: ['62px', '36px'], visina: ['62px', '36px'], razmak: 'normal', tezina: 600, transform: 'none', font: 'naslov' },
        h2: { velicina: ['42px', '32px'], visina: ['46px', '36px'], razmak: 'normal', tezina: 600, transform: 'none', font: 'naslov' },
        h3: { velicina: ['18px', '16px'], visina: ['24px', '20px'], razmak: 'normal', tezina: 700, transform: 'none', font: 'naslov' },
        telo: { velicina: '16px', visina: ['24px', '20px'], razmak: 'normal', tezina: 400 },
        uvod: { velicina: '16px', visina: ['24px', '20px'], razmak: 'normal', tezina: 400 },
        oznaka: { velicina: '16px', visina: ['24px', '20px'], razmak: 'normal', tezina: 400, transform: 'none', font: 'oznaka' },
        nav: { velicina: '16px', visina: ['24px', '20px'], razmak: 'normal', tezina: 400, transform: 'none', font: 'tekst' },
        dugme: { velicina: '16px', visina: '20px', razmak: 'normal', tezina: 400, transform: 'none', font: 'tekst' },
        meni: { velicina: '16px', visina: '20px', razmak: 'normal', tezina: 400, transform: 'none', font: 'tekst' },
        footer: { velicina: ['24px', '22px'], visina: '28px', razmak: 'normal', tezina: 400, transform: 'none', font: 'tekst' },
        vest: { velicina: ['24px', '22px'], visina: '28px', razmak: 'normal', tezina: 400, transform: 'none', font: 'naslov' },
        logo: { velicina: ['28px', '23px'], visina: '1', razmak: '0.01em', tezina: 500, transform: 'none', font: 'logo' },
    },
    /* Kontejner 1140 px sadržaja (+ 2 × 20 px ivice), sekcije 130 / 60 px, header 80 / 70 px. */
    razmaci: { kontejner: '1180px', gutter: ['20px', '20px'], sekcija: ['130px', '60px'], header: ['80px', '70px'] },

    dugme: { oblik: 'pill', stil: 'strelica', visina: '38px', krug: '34px', hover: 'nista' },
    radius: { kartica: '0px', slika: '0px', polje: '3px' },
    header: { tip: 'pun', logo: 'levo', posleSkrola: 'brand', visina: 80, visinaTelefon: 70, pregrade: true, ctaNaTelefonu: true, meni: 'padajuci' },
    hero: 'ispod-headera',
    usluge: 'visoke-kartice',
    zaglavlje: 'tri-kolone',
    zavrsniPoziv: 'traka',
    footer: 'kompaktan',
    razmak: { sekcija: '130px', sekcijaTelefon: '60px', kontejner: '1140px' },
    slike: { filter: 'none' },
    pokret: {
        easing: 'ease', brzo: '0.3s', srednje: '0.3s', sporo: '0.5s',
        reveal: 'nista', revealPomak: '0px', revealTrajanje: '0s', stagger: 0,
        heroEfekat: 'ken-burns', heroTrajanje: '20s', heroPrelaz: 2500, heroInterval: 3000, heroZum: 1.3, heroKontrole: 'nista',
        hoverSlika: 1, linkHover: 'podvuci-fade', marquee: 10, marqueePauza: false, marqueeMaska: false,
        karusel: { poPrikazu: [3, 2, 1], razmak: 10, brzina: 500, autoplay: 5000 },
        paralaksa: 0, glatkiSkrol: false, prelazStranice: 'nista',
    },
};
