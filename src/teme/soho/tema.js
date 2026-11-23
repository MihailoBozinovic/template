/*
 * Tema „soho” — podaci (boje, fontovi, tipografija, raspored, pokret).
 * Specifikacija po referentnom sajtu: docs/teme/soho.md
 * Komponente koje tema menja: ./komponente.jsx · stilovi samo za ovu temu: ./tema.css
 */
import { SERIF_BODONI, SANS_INTER } from '../fontovi-stekovi.js';

export default {
    naziv: 'Soho',
    inspiracija: 'Salon 64 London',
    opis: 'Londonski „super salon”: kurziv + VERZAL u istom naslovu, krem #FFFCF5, oštri uglovi, pune linije, redovi naslova izranjaju.',
    tamna: false,
    boje: {
        paper: '#FFFCF5', ink: '#1E1E1E', mist: '#F3DCC2', povrsina: '#FFFCF5',
        brand: '#1E1E1E', naBrand: '#FFFCF5', linija: '#1E1E1E', tamna: '#1E1E1E', akcenat: '#E2C6A9',
        siva: '#898989', hoverForma: '#696969',
    },
    fontovi: { naslov: SERIF_BODONI, tekst: SANS_INTER, oznaka: SANS_INTER, logo: SERIF_BODONI },
    naslov: { tezina: 400, transform: 'none', razmak: 'normal', visina: 1.05, skala: 1, akcenat: 'kurziv-verzal' },
    oznaka: { transform: 'uppercase', razmak: '0.1em', velicina: '0.875rem', tezina: 400 },
    tekst: { tezina: 400, velicina: '1rem' },

    /* Tačne veličine [desktop, telefon] — izmereno na referenci (docs/teme/soho.md §2). */
    tipografija: {
        hero: { velicina: ['144px', '54.6px'], visina: ['158.4px', '60.06px'], razmak: 'normal', tezina: 400 },
        displej: { velicina: ['128px', '48px'], visina: ['134.4px', '48px'], razmak: 'normal', tezina: 400 },
        poziv: { velicina: ['88px', '40px'], visina: ['96.8px', '44px'], razmak: 'normal', tezina: 400 },
        h1: { velicina: ['56px', '40px'], visina: ['58.8px', '48px'], razmak: 'normal', tezina: 400 },
        h2: { velicina: ['64px', '48px'], visina: ['67.2px', '54px'], razmak: 'normal', tezina: 400 },
        h3: { velicina: ['48px', '40px'], visina: ['52.8px', '44px'], razmak: 'normal', tezina: 400 },
        footerNaslov: { velicina: ['56px', '48px'], visina: ['56px', '52.8px'] },
        instagram: { velicina: '28.8px', visina: '28.8px' },
        kartica: { velicina: ['25px', '22px'], visina: ['30px', '26.4px'] },
        telo: { velicina: '16px', visina: ['24px', '22.4px'], razmak: 'normal' },
        uvod: { velicina: '16px', visina: '24px', razmak: 'normal' },
        citat: { velicina: ['20px', '18px'], visina: ['26px', '25.2px'] },
        oznaka: { velicina: '14px', visina: '1.3', razmak: '0.1em', tezina: 400, transform: 'uppercase' },
        nav: { velicina: '16px', visina: '16px', razmak: '0.05em', tezina: 400, transform: 'uppercase' },
        heroLink: { velicina: ['16px', '14px'], visina: ['24px', '16.8px'] },
        dugme: { velicina: '14px', visina: '1.2', razmak: '0.1em', tezina: 400, transform: 'uppercase' },
        traka: { velicina: ['14px', '10px'], razmak: '0.1em', tezina: 500 },
        meni: { velicina: '20px', visina: '24px', razmak: '0.1em', tezina: 400, transform: 'uppercase' },
        footer: { velicina: ['14px', '16px'], visina: ['19.6px', '22.4px'] },
        logo: { velicina: ['22px', '19px'], visina: 1, razmak: '0.2em', tezina: 400, transform: 'uppercase', font: 'logo' },
    },
    razmaci: {
        kontejner: 'none', // pun ekran minus bočne margine (1344px pri 1440)
        gutter: ['48px', '20px'],
        sekcija: ['100px', '64px'],
        header: ['111px', '95px'], // traka 32 + red 79 / 32 + 63
    },

    dugme: { oblik: 'pravo', stil: 'obris' },
    radius: { kartica: '0px', slika: '0px' },
    header: { tip: 'providan', logo: 'levo', posleSkrola: 'paper' },
    hero: 'puna-levo',
    usluge: 'velika-lista',
    slike: { filter: 'none' },
    pokret: {
        easing: 'cubic-bezier(0.525, 0, 0, 1)', easingDetalj: 'cubic-bezier(0.625, 0.05, 0, 1)',
        brzo: '0.2s', srednje: '0.45s', sporo: '0.6s',
        reveal: 'linije', revealPomak: '100%', revealTrajanje: '1s', stagger: 0.1,
        heroEfekat: 'nista', heroTrajanje: '0s', heroPrelaz: 1000,
        hoverSlika: 1.06, linkHover: 'podvuci',
        marquee: 40.96, marqueePauza: false,
        paralaksa: 60, glatkiSkrol: true,
        prelazStranice: 'zavesa', prelazTrajanje: '0.5s', prelazKasnjenje: '0.2s',
        prelazEasing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    },
};
