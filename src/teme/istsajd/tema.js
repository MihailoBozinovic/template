/*
 * Tema „istsajd” — podaci (boje, fontovi, tipografija, raspored, pokret).
 * Specifikacija po referentnom sajtu: docs/teme/istsajd.md
 * Komponente koje tema menja: ./komponente.jsx · stilovi samo za ovu temu: ./tema.css
 *
 * Tipografija i razmaci su TAČNE mere sa reference ([desktop, telefon], prelom 768px).
 */
const CORMORANT_INFANT = '"Cormorant Infant", "Cormorant Garamond", Georgia, serif';
const ONEST = 'Onest, system-ui, sans-serif';

export default {
    naziv: 'Ist Sajd',
    inspiracija: 'Fringe Salon NY',
    opis: 'Komšijski salon: bela, menta i koral, Cormorant Infant + Onest, oštre fotografije i pill dugmad, tiho pretapanje.',
    tamna: false,
    boje: {
        paper: '#FFFFFF', ink: '#292145', mist: '#CEE5DC', povrsina: '#FFFFFF',
        brand: '#F6AFA1', naBrand: '#292145', linija: '#292145', tamna: '#292145', akcenat: '#F6AFA1',
        // dodatne → --c-tekst, --c-link-hover, --c-kartica-aktivna, --c-prsten-kartice, --c-strelice
        tekst: '#000000', linkHover: '#FF765B', karticaAktivna: '#C4E0D5', prstenKartice: '#8D3E2B',
        strelice: '#F28772', footer: '#F6AFA1', traka: '#000000',
        veoHeroja: 'rgba(0,0,0,.35)',
    },
    fontovi: { naslov: CORMORANT_INFANT, tekst: ONEST, oznaka: ONEST, logo: CORMORANT_INFANT },
    naslov: { tezina: 400, transform: 'capitalize', razmak: '0', visina: 1.0, skala: 1, akcenat: 'nista' },
    oznaka: { transform: 'none', razmak: '0', velicina: '1rem', tezina: 400 },
    tekst: { tezina: 400, velicina: '1rem' },
    tipografija: {
        // h1 heroja: 64/57.14 → telefon 24/30
        hero: { velicina: ['64px', '24px'], visina: ['57.14px', '30px'], razmak: '0', tezina: 400, transform: 'capitalize', font: 'naslov' },
        // veliki naslov levo (O nama, Tim, Lokacije, podstranice): 48/48 i na telefonu
        h1: { velicina: ['48px', '40px'], visina: ['48px', '44px'], razmak: '0', tezina: 400, transform: 'capitalize', font: 'naslov' },
        // centriran naslov sekcije: 34.29/41.14, 800→700 → telefon 27.43
        h2: { velicina: ['34.29px', '27.43px'], visina: '41.14px', razmak: '0', tezina: 700, transform: 'capitalize', font: 'naslov' },
        // naziv usluge / ime u timu: 30 → 27, 500
        h3: { velicina: ['30px', '27px'], visina: 'normal', razmak: '0', tezina: 500, transform: 'capitalize', font: 'naslov' },
        telo: { velicina: '16px', visina: '25.6px', razmak: 'normal', tezina: 400 },
        uvod: { velicina: '16px', visina: '25.6px', razmak: 'normal', tezina: 400 },
        // capitalize samo na nadnaslovima sekcija (.ist-nadnaslov) — oznake u zakazivanju/cenovniku ostaju kako su napisane
        oznaka: { velicina: '16px', visina: '16px', razmak: '0', tezina: 400, transform: 'none', font: 'oznaka' },
        nav: { velicina: '16px', visina: '16px', razmak: '0', tezina: 400, transform: 'none', font: 'tekst' },
        dugme: { velicina: '16px', visina: '32px', razmak: '0', tezina: 400, transform: 'capitalize', font: 'tekst' },
        meni: { velicina: '16px', visina: '16px', razmak: '0', tezina: 400, transform: 'none', font: 'tekst' },
        footer: { velicina: '15px', visina: '25.6px', razmak: '0', tezina: 400 },
        logo: { velicina: ['30px', '26px'], visina: 1, razmak: '0', tezina: 500, transform: 'none', font: 'logo' },
    },
    razmaci: { kontejner: '1440px', gutter: ['48px', '16px'], sekcija: ['112px', '48px'], header: ['110px', '100px'] },
    dugme: { oblik: 'pill', stil: 'puno', padding: '4px 24px', prored: '32px', tezina: 400, hover: { pozadina: '#FFFFFF', okvir: '#CEE5DC', tekst: '#292145' } },
    radius: { kartica: '0px', slika: '0px', polje: '16px' },
    header: {
        tip: 'pun', logo: 'levo', posleSkrola: 'paper',
        visina: '110px', visinaTelefon: '100px', nav: 'desno', blur: false, zakaziPoLokaciji: true, ikoniceTelefon: true,
    },
    hero: 'puna-centar',
    heroIspodHeadera: true, heroVisina: 'calc(100svh - 90px)', heroOdnosTelefon: '16 / 9',
    usluge: 'kartice',
    uslugeRaspored: { kolone: 4, odnos: '1 / 1', prsten: true, centrirano: true },
    recenzije: 'karusel-foto',
    tim: 'vodoravno',
    footer: { pozadina: 'brand', newsletter: false },
    meni: { stil: 'tekst', kaskada: false },
    slike: { filter: 'none' },
    pokret: {
        easing: 'ease', brzo: '0.25s', srednje: '0.5s', sporo: '0.75s',
        reveal: 'fade', revealPomak: '0px', revealTrajanje: '0.5s', revealKasnjenje: '0.25s', stagger: 0,
        heroEfekat: 'nista', heroTrajanje: '7s', heroPrelaz: 1000,
        karusel: { trajanje: '1s', kriva: 'cubic-bezier(.42,0,.58,1)' },
        hoverSlika: 1, linkHover: 'podvuci', marquee: 40, marqueePauza: false,
        paralaksa: 0, glatkiSkrol: false, prelazStranice: 'nista',
    },
};
