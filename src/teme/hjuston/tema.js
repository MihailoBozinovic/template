/*
 * Tema „hjuston” — podaci (boje, fontovi, tipografija, raspored, pokret).
 * Specifikacija po referentnom sajtu: docs/teme/hjuston.md
 * Komponente koje tema menja: ./komponente.jsx · stilovi samo za ovu temu: ./tema.css
 *
 * Vrednosti su izmerene na referenci (1440×900 i 390×844). Gde je niz, prva
 * vrednost je desktop, druga telefon (prelom 768px).
 */
import { SERIF_CORMORANT } from '../fontovi-stekovi.js';

export default {
    naziv: 'Hjuston',
    inspiracija: 'The Upper Hand',
    opis: 'Nagrađivani salon: crno-bele trake fotografija, centriran Cormorant, mala crvena dugmad, meni preko ekrana.',
    tamna: false,
    boje: {
        paper: '#FFFFFF', ink: '#000000', mist: '#F5F5F5', povrsina: '#FFFFFF',
        brand: '#D22630', naBrand: '#FFFFFF', linija: '#000000', tamna: '#666666', akcenat: '#D22630',
        // → --c-hover-nav, --c-hover-na-foto, --c-okvir-headera, --c-plocica, --c-zvezdice, --c-tacka, --c-tacka-aktivna
        hoverNav: '#D43C67', hoverNaFoto: '#CCCCCC', okvirHeadera: '#EEEEEE', plocica: '#F5F5F5',
        zvezdice: '#F5C242', tacka: '#222222', tackaAktivna: '#428BCA',
    },
    fontovi: { naslov: SERIF_CORMORANT, tekst: SERIF_CORMORANT, oznaka: 'Raleway, system-ui, sans-serif', logo: 'Raleway, system-ui, sans-serif' },
    naslov: { tezina: 400, transform: 'none', razmak: 'normal', visina: 1.2, skala: 1, akcenat: 'nista' },
    oznaka: { transform: 'uppercase', razmak: '2px', velicina: '10px', tezina: 700 },
    tekst: { tezina: 400, velicina: '22px' },

    /* Tačna skala (desktop, telefon) — docs/teme/hjuston.md §2 */
    tipografija: {
        hero: { velicina: ['96px', '60px'], visina: ['115.2px', '72px'], razmak: '-2px', tezina: 400, transform: 'none', font: 'naslov' },
        h1: { velicina: ['72px', '48px'], visina: 1.2, razmak: '-1px', tezina: 400, transform: 'none', font: 'naslov' },
        h2: { velicina: '48px', visina: '57.6px', razmak: 'normal', tezina: 400, transform: 'none', font: 'naslov' },
        h3: { velicina: ['30px', '26px'], visina: 1.3, razmak: 'normal', tezina: 400, transform: 'none', font: 'naslov' },
        telo: { velicina: '22px', visina: '38.5px', razmak: 'normal', tezina: 400 },
        uvod: { velicina: ['30px', '24px'], visina: ['52.5px', '42px'], razmak: 'normal', tezina: 400, stil: 'italic', font: 'tekst' },
        podnaslov: { velicina: '22px', visina: '38.5px', razmak: '2px', tezina: 400, transform: 'uppercase', font: 'tekst' },
        lokacija: { velicina: ['24px', '19.2px'], visina: ['42px', '33.6px'], tezina: 400, font: 'tekst' },
        citat: { velicina: '22px', visina: '38.5px', tezina: 400, stil: 'italic', font: 'tekst' },
        plocicaNaslov: { velicina: '14px', visina: '16.8px', razmak: '2px', tezina: 700, transform: 'uppercase', font: 'oznaka' },
        plocicaTekst: { velicina: '18px', visina: '29.25px', tezina: 400, font: 'tekst' },
        oznaka: { velicina: '10px', visina: 1.4, razmak: '2px', tezina: 700, transform: 'uppercase', font: 'oznaka' },
        nav: { velicina: '10px', visina: '10px', razmak: '2px', tezina: 700, transform: 'uppercase', font: 'oznaka' },
        dugme: { velicina: '10px', visina: '10px', razmak: '2px', tezina: 700, transform: 'uppercase', font: 'oznaka' },
        meni: { velicina: '22px', visina: '38.5px', razmak: 'normal', tezina: 400, font: 'tekst' },
        meniOznaka: { velicina: '12px', visina: 1, razmak: '3px', tezina: 700, transform: 'uppercase', font: 'oznaka' },
        footer: { velicina: '10px', visina: '10px', razmak: '2px', tezina: 700, transform: 'uppercase', font: 'oznaka' },
        potpis: { velicina: '18px', visina: 1.6, tezina: 400, font: 'tekst' },
        logo: { velicina: '18px', visina: '18px', razmak: '1px', tezina: 700, transform: 'uppercase', font: 'logo' },
    },
    razmaci: { kontejner: '1300px', gutter: ['40px', '20px'], sekcija: ['120px', '80px'], header: ['73px', '61px'] },

    dugme: { oblik: 'pravo', stil: 'puno', naFoto: 'brand', hoverNaFoto: 'bela' },
    radius: { kartica: '0px', slika: '0px', mreze: '3px' },
    header: {
        tip: 'providan', logo: 'levo', posleSkrola: 'paper', meni: 'preko-ekrana', ikonaMenija: 'tri-tacke',
        zakaziDugme: false, telefon: 'staticki', logoTelefon: 'centar', okvir: true, zamucenje: false, prelaz: '0.2s', prag: 10,
    },
    meni: { poravnanje: 'centar', boja: 'brand', oznaka: true, ulaz: 'fade', kaskada: false },
    hero: 'puna-centar',
    heroOpcije: { veo: 0.4, zvezdice: true, podnaslov: 'serif-verzal', dugmad: 1, mreze: 'kvadrati', visinaTelefon: '80svh' },
    // Redosled početne (komponente u ./komponente.jsx): belo / fotografija naizmenično.
    pocetnaRaspored: ['hero', 'misija', 'fotoTraka', 'usluge', 'lokacije', 'recenzije', 'poziv'],
    sekcija: { padding: ['170px 0 180px', '100px 0'], sirinaTeksta: '900px', smenaFoto: true, nadnaslov: false, veoFoto: 0.5 },
    usluge: 'tekst-plocice',
    uslugeOpcije: { kolone: 3, razmak: '20px', sirina: '1220px', ikona: 'srce' },
    recenzije: 'slajder',
    // Referenca (lightSlider): prelaz 400 ms, pauza 2000 ms — pauza produžena da bi citat mogao da se pročita.
    recenzijeOpcije: { poEkranu: [2, 1], tacke: true, auto: true, brzina: 400, pauza: 4000, kartica: false },
    footer: 'minimalan',
    slike: { filter: 'grayscale', heroFilter: 'grayscale' },
    pokret: {
        easing: 'ease-in-out', brzo: '0.2s', srednje: '0.4s', sporo: '1s',
        reveal: 'fade-up', revealPomak: '20px', revealTrajanje: '1s', stagger: 0, revealJedinica: 'blok',
        heroEfekat: 'nista', heroTrajanje: '0s', heroPrelaz: 0,
        hoverSlika: 1, linkHover: 'boja', marquee: 40, marqueePauza: false,
        paralaksa: 0, glatkiSkrol: false, prelazStranice: 'fade',
    },
};
