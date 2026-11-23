/*
 * Tema „zaliv” — podaci (boje, fontovi, tipografija, raspored, pokret).
 * Specifikacija po referentnom sajtu: docs/teme/zaliv.md
 * Komponente koje tema menja: ./komponente.jsx · stilovi samo za ovu temu: ./tema.css
 *
 * Galerijski minimalizam: bela strana, čista crna, fotografije visine ekrana
 * uvučene u beli okvir od 3vw, između njih tanke tekst-trake. Jedini „glas” je
 * ogroman uzani wordmark u headeru (koji NIJE fiksiran — odlazi sa stranom).
 * Bez ikakvih animacija osim čistog fade-a menija i providnosti dugmadi.
 */
import { SERIF_BODONI } from '../fontovi-stekovi.js';

const ONEST = 'Onest, system-ui, sans-serif';

export default {
    naziv: 'Zaliv',
    inspiracija: 'Barrow Salon',
    opis: 'Galerijski minimalizam: crno-belo, ogroman uzani wordmark, fotografije visine ekrana uvučene 3vw, Bodoni + tanki grotesk, bez animacija.',
    tamna: false,
    boje: {
        paper: '#FFFFFF', ink: '#000000', mist: '#F1F1EF', povrsina: '#FFFFFF',
        brand: '#000000', naBrand: '#FFFFFF', linija: '#000000', tamna: '#000000', akcenat: '#F1F1EF',
        // Wordmark (u referenci slika, ≈ #333) i podloga footera.
        logo: '#333333', footer: '#F1F1EF',
    },
    fontovi: {
        naslov: SERIF_BODONI,
        tekst: ONEST,
        oznaka: ONEST,
        logo: '"Sofia Sans Extra Condensed", Oswald, "Arial Narrow", sans-serif',
    },
    naslov: { tezina: 400, transform: 'none', razmak: 'normal', visina: 1.333, skala: 1, akcenat: 'nista' },
    oznaka: { transform: 'uppercase', razmak: '0.19em', velicina: '0.784rem', tezina: 500 },
    tekst: { tezina: 300, velicina: '1.108rem' },

    /* Tačne veličine po nivou: [desktop, telefon] (prelom 768px). */
    tipografija: {
        // Nema H1 preko fotografije — „hero” je wordmark; nivo postoji samo radi celovitosti.
        hero: { velicina: ['36.736px', '28.154px'], visina: ['48.96px', '37.52px'], razmak: 'normal', tezina: 400, transform: 'none', font: 'naslov' },
        h1: { velicina: ['36.736px', '28.154px'], visina: ['48.96px', '37.52px'], razmak: 'normal', tezina: 400, transform: 'none', font: 'naslov' },
        h2: { velicina: ['36.736px', '28.154px'], visina: ['48.96px', '37.52px'], razmak: 'normal', tezina: 400, transform: 'none', font: 'naslov' },
        h3: { velicina: ['26.368px', '22.077px'], visina: ['36.03px', '30.17px'], razmak: 'normal', tezina: 400, transform: 'none', font: 'naslov' },
        telo: { velicina: ['17.728px', '17.013px'], visina: 1.8, razmak: 'normal', tezina: 300, transform: 'none' },
        uvod: { velicina: ['17.728px', '17.013px'], visina: 1.8, razmak: 'normal', tezina: 300, stil: 'normal', transform: 'none' },
        // Eyebrow = header CTA: na telefonu RASTE (13.974px).
        oznaka: { velicina: ['12.544px', '13.974px'], visina: 1.45, razmak: '0.19em', tezina: 500, transform: 'uppercase', font: 'oznaka' },
        nav: { velicina: '17.728px', visina: 1.4, razmak: 'normal', tezina: 300, transform: 'none', font: 'tekst' },
        dugme: { velicina: '16px', visina: 1.45, razmak: '0.02em', tezina: 600, transform: 'none', font: 'tekst' },
        meni: { velicina: '33.15px', visina: 1, razmak: 'normal', tezina: 300, transform: 'none', font: 'tekst' },
        footer: { velicina: ['17.728px', '17.013px'], visina: 1.8, tezina: 300 },
        logo: { tezina: 600, transform: 'uppercase', razmak: '0', visina: 1, font: 'logo' },
    },

    /* Bez max-širine: gutter 3vw (telefon 6vw za tekst; fotografije uvek 3vw). */
    razmaci: {
        kontejner: 'none',
        gutter: ['3vw', '6vw'],
        sekcija: ['6rem', '4rem'],
        // 3vw + logo 177px + 3vw; telefon 84px (logo 30px).
        header: ['calc(177px + 6vw)', '84px'],
    },

    dugme: { oblik: 'pravo', stil: 'puno' },
    radius: { kartica: '0px', slika: '0px' },
    header: { tip: 'pun', logo: 'levo-veliki', posleSkrola: 'paper', fiksiran: false },
    hero: 'uvuceno',
    usluge: 'lista',
    slike: { filter: 'none' },
    pokret: {
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)', brzo: '0.1s', srednje: '0.4s', sporo: '0.6s',
        reveal: 'nista', revealPomak: '0px', revealTrajanje: '0s', stagger: 0,
        heroEfekat: 'nista', heroTrajanje: '0s', heroPrelaz: 600,
        hoverSlika: 1, linkHover: 'samo-aktivan', marquee: 0, marqueePauza: false,
        paralaksa: 0, glatkiSkrol: false, prelazStranice: 'nista',
    },
};
