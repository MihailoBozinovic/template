/*
 * Tema „noar” — podaci (boje, fontovi, tipografija, raspored, pokret).
 * Specifikacija po referentnom sajtu: docs/teme/noar.md
 * Komponente koje tema menja: ./komponente.jsx · stilovi samo za ovu temu: ./tema.css
 */
import { SANS_INTER } from '../fontovi-stekovi.js';

export default {
    naziv: 'Noar',
    inspiracija: 'tamna berbernica',
    opis: 'Za berbernice: grafit i mesing, Oswald verzal, oštri uglovi, marquee usluga.',
    tamna: true,
    boje: {
        paper: '#101011', ink: '#ECE7DF', mist: '#18181A', povrsina: '#1C1C1F',
        brand: '#C29A5B', naBrand: '#101011', linija: '#ECE7DF', tamna: '#08080A', akcenat: '#C29A5B',
    },
    fontovi: { naslov: 'Oswald, "Arial Narrow", sans-serif', tekst: SANS_INTER, oznaka: SANS_INTER, logo: 'Oswald, "Arial Narrow", sans-serif' },
    naslov: { tezina: 500, transform: 'uppercase', razmak: '0.01em', visina: 1.0, skala: 1.05, akcenat: 'boja' },
    oznaka: { transform: 'uppercase', razmak: '0.22em', velicina: '0.7rem', tezina: 500 },
    tekst: { tezina: 400 },
    dugme: { oblik: 'pravo', stil: 'puno' },
    radius: { kartica: '0px', slika: '0px' },
    header: { tip: 'providan', logo: 'levo', posleSkrola: 'paper' },
    hero: 'puna-levo',
    usluge: 'plocice',
    slike: { filter: 'none' },
    pokret: {
        easing: 'cubic-bezier(0.22, 1, 0.36, 1)', brzo: '0.25s', srednje: '0.5s', sporo: '0.9s',
        reveal: 'fade-up', revealPomak: '24px', revealTrajanje: '0.9s', stagger: 0.08,
        heroEfekat: 'ken-burns', heroTrajanje: '10s', heroPrelaz: 1200,
        hoverSlika: 1.05, linkHover: 'podvuci', marquee: 35, marqueePauza: true,
        paralaksa: 30, glatkiSkrol: false, prelazStranice: 'fade',
    },
};
