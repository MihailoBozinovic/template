/*
 * Tema „holivud” — podaci (boje, fontovi, tipografija, raspored, pokret).
 * Specifikacija po referentnom sajtu: docs/teme/holivud.md
 * Komponente koje tema menja: ./komponente.jsx · stilovi samo za ovu temu: ./tema.css
 *
 * Naslovni font: ručno crtan monolinijski small caps (Amatic SC, ima ćirilicu)
 * sa razmakom slova od 3 px. Amatic je uži od reference, pa su naslovi oko 10 %
 * veći od izmerenih (60 → 66 px, 40 → 44 px, 15 → 17 px).
 */
const NASLOV = '"Amatic SC", "Cormorant SC", cursive';
const HELVETICA = 'Helvetica, Arial, sans-serif';

export default {
    naziv: 'Holivud',
    inspiracija: 'Nine Zero One',
    opis: 'LA salon: ručno crtan small-caps naslov sa razmakom 3 px, sitan Helvetica verzal, papir, crno i nude sa kiselo žutim akcentom, paneli od ivice do ivice.',
    tamna: false,
    boje: {
        paper: '#FFFEFC', ink: '#111111', mist: '#F5EBDF', povrsina: '#FFFFFF',
        brand: '#000000', naBrand: '#FFFFFF', linija: '#222222', tamna: '#000000', akcenat: '#FFFB00',
        sivaSvetla: '#E6E2E1', sivaTamna: '#333232', karamel: '#CD9B77', najava: '#000000',
    },
    fontovi: {
        naslov: NASLOV,
        tekst: HELVETICA,
        oznaka: HELVETICA,
        logo: 'Jost, "Helvetica Neue", Arial, sans-serif',
        nav: NASLOV,
    },
    naslov: { tezina: 400, transform: 'none', razmak: '3px', visina: 1.1, skala: 0.65, akcenat: 'nista' },
    oznaka: { transform: 'uppercase', razmak: '2px', velicina: '12px', tezina: 700 },
    tekst: { tezina: 400, velicina: '14px', transform: 'none' },

    // Tačne veličine po nivou: [desktop, telefon] (prelom 768 px)
    tipografija: {
        hero: { velicina: ['66px', '44px'], visina: ['72px', '52px'], razmak: '3px', tezina: 400, transform: 'none', font: 'naslov' },
        h1: { velicina: ['66px', '44px'], visina: ['72px', '52px'], razmak: ['1px', '3px'], tezina: 400, transform: 'none', font: 'naslov' },
        h2: { velicina: ['35px', '31px'], visina: ['46px', '41px'], razmak: '3px', tezina: 400, transform: 'none', font: 'naslov' },
        h3: { velicina: '21px', visina: '28px', razmak: '3px', tezina: 400, transform: 'none', font: 'naslov' },
        // dugi tekst (cenovnik, pravne strane) ostaje 14 px običnim pismom; kratki tekst je u klasama teme (12 px verzal)
        telo: { velicina: '14px', visina: '22.4px', razmak: 'normal', transform: 'none' },
        uvod: { velicina: '14px', visina: '21.7px', razmak: 'normal', transform: 'uppercase', font: 'tekst' },
        oznaka: { velicina: '12px', visina: '15.6px', razmak: '2px', tezina: 700, transform: 'uppercase', font: 'oznaka' },
        nav: { velicina: '17px', visina: '19px', razmak: '3px', tezina: 400, transform: 'none', font: 'naslov' },
        dugme: { velicina: '10px', visina: '15px', razmak: '2px', tezina: 400, transform: 'uppercase', font: 'oznaka' },
        meni: { velicina: '36px', visina: '48px', razmak: '3px', tezina: 400, transform: 'none', font: 'naslov' },
        footer: { velicina: '14px', visina: '22.4px', razmak: 'normal', tezina: 400, transform: 'none', font: 'tekst' },
        logo: { velicina: ['26px', '21px'], visina: 1, razmak: '0.04em', tezina: 400, transform: 'uppercase', font: 'logo' },
    },
    razmaci: { kontejner: '1440px', gutter: ['56px', '24px'], sekcija: ['96px', '40px'], header: ['124px', '56px'] },

    dugme: { oblik: 'pravo', stil: 'obris', foto: 'belo-u-crno', trajanje: '0.4s' },
    radius: { kartica: '0px', slika: '0px' },
    najava: { visina: ['45px', '37px'] },
    header: { tip: 'providan', logo: 'centar', posleSkrola: 'paper', linija: 'uvucena', senka: false, blur: false, sakrijNaSkrol: false, telefon: 'meni-levo', zakazi: 'tekst' },
    hero: 'puna-desno',
    heroOpcije: { slajdovi: false, visinaTelefon: '624px', dugmad: 1, podnaslovFont: 'naslov' },
    usluge: 'paneli',
    slike: { filter: 'none', hoverProvidnost: 0.7, ulaz: '0.6s' },
    futer: { pozadina: 'paper', harmonikaTelefon: true },
    pokret: {
        easing: 'ease', brzo: '0.2s', srednje: '0.3s', sporo: '0.6s',
        reveal: 'fade', revealPomak: '0px', revealTrajanje: '0.8s', stagger: 0,
        heroEfekat: 'nista', heroTrajanje: '0s', heroPrelaz: 600,
        hoverSlika: 1, linkHover: 'podvuci', marquee: 110, marqueePauza: true,
        marqueeMaska: false, marqueeRazdvajac: '', marqueeRazmak: '80px',
        paralaksa: 0, glatkiSkrol: false, prelazStranice: 'nista',
    },
};
