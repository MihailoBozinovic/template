/*
 * TEME
 *
 * Svaka tema je po jednom referentnom sajtu; izmerene vrednosti i izvori su u
 * docs/TEME.md. Tema nije samo paleta: određuje fontove, tipografiju naslova,
 * oblik dugmadi, raspored heroja i usluga, header, filter fotografija i sve
 * pokrete (krive, trajanja, reveal, Ken Burns, marquee, paralaksu, glatki skrol).
 *
 * Bira se jednim klikom (birač u uglu ekrana) ili u src/config/salon.js:
 *   tema: 'soho'
 *   tema: { osnova: 'soho', boje: { brand: '#9C6B3F' } }   // sa izmenama
 *
 * Fontovi bez ćirilice (Bodoni Moda, DM Sans, Poppins) imaju u nizu rezervni
 * font sa ćirilicom, pa ruska verzija sajta ostaje u istom duhu.
 */

const SERIF_BODONI = '"Bodoni Moda", "Playfair Display", Georgia, serif';
const SERIF_CORMORANT = '"Cormorant Garamond", Georgia, serif';
const SANS_INTER = 'Inter, system-ui, sans-serif';

export const TEME = {
    menhetn: {
        naziv: 'Menhetn',
        inspiracija: 'Yukie Natori New York',
        opis: 'Luksuzni spa-salon: maslinasta i krem, Manrope, pill dugmad sa strelicom, Ken Burns hero.',
        tamna: false,
        boje: {
            paper: '#FFFFFF', ink: '#1D1C12', mist: '#F4F1E1', povrsina: '#FFFFFF',
            brand: '#3C391C', naBrand: '#FFFFFF', linija: '#1D1C12', tamna: '#3C391C', akcenat: '#E8E3BE',
        },
        fontovi: { naslov: 'Manrope, system-ui, sans-serif', tekst: 'Manrope, system-ui, sans-serif', oznaka: 'Manrope, system-ui, sans-serif', logo: SERIF_CORMORANT },
        naslov: { tezina: 600, transform: 'none', razmak: '-0.01em', visina: 1.05, skala: 0.82, akcenat: 'boja' },
        oznaka: { transform: 'none', razmak: '0', velicina: '0.9rem', tezina: 500 },
        tekst: { tezina: 400 },
        dugme: { oblik: 'pill', stil: 'strelica' },
        radius: { kartica: '18px', slika: '18px' },
        header: { tip: 'providan', logo: 'levo', posleSkrola: 'brand' },
        hero: 'puna-levo',
        usluge: 'visoke-kartice',
        slike: { filter: 'none' },
        pokret: {
            easing: 'ease', brzo: '0.3s', srednje: '0.4s', sporo: '0.8s',
            reveal: 'fade-up', revealPomak: '20px', revealTrajanje: '0.9s', stagger: 0.08,
            heroEfekat: 'ken-burns', heroTrajanje: '10s', heroPrelaz: 1200,
            hoverSlika: 1.06, linkHover: 'pozadina', marquee: 10, marqueePauza: false,
            paralaksa: 0, glatkiSkrol: false, prelazStranice: 'fade',
        },
    },

    palma: {
        naziv: 'Palma',
        inspiracija: 'Palm Sunday',
        opis: 'Savremeni minimalizam: Inter, ogromni tanki naslovi, roze kvadrati, logo u sredini, paralaksa.',
        tamna: false,
        boje: {
            paper: '#FAFAF8', ink: '#252523', mist: '#F7F5F0', povrsina: '#FFFFFF',
            brand: '#252523', naBrand: '#FAFAF8', linija: '#252523', tamna: '#252523', akcenat: '#F4D5D0',
        },
        fontovi: { naslov: SANS_INTER, tekst: SANS_INTER, oznaka: SANS_INTER, logo: SANS_INTER },
        naslov: { tezina: 400, transform: 'uppercase', razmak: '-0.04em', visina: 0.9, skala: 1.18, akcenat: 'nista' },
        oznaka: { transform: 'uppercase', razmak: '0.04em', velicina: '0.72rem', tezina: 400 },
        tekst: { tezina: 400, transform: 'none' },
        dugme: { oblik: 'pill', stil: 'obris' },
        radius: { kartica: '0px', slika: '0px' },
        header: { tip: 'pun', logo: 'centar', posleSkrola: 'paper' },
        hero: 'dupla',
        usluge: 'lista',
        slike: { filter: 'none' },
        pokret: {
            easing: 'ease-in-out', brzo: '0.2s', srednje: '0.2s', sporo: '0.6s',
            reveal: 'skala', revealPomak: '0px', revealTrajanje: '0.7s', stagger: 0.06,
            heroEfekat: 'nista', heroTrajanje: '0s', heroPrelaz: 800,
            hoverSlika: 1.05, linkHover: 'gasi-ostale', marquee: 30, marqueePauza: false,
            paralaksa: 60, glatkiSkrol: false, prelazStranice: 'fade',
        },
    },

    soho: {
        naziv: 'Soho',
        inspiracija: 'Salon 64 London',
        opis: 'Londonski „super salon”: kurziv + verzal u naslovu, krem #FFFCF5, Lenis glatki skrol, reči koje izranjaju.',
        tamna: false,
        boje: {
            paper: '#FFFCF5', ink: '#1E1E1E', mist: '#F0F0F0', povrsina: '#FFFFFF',
            brand: '#1E1E1E', naBrand: '#FFFCF5', linija: '#1E1E1E', tamna: '#1E1E1E', akcenat: '#E2C6A9',
        },
        fontovi: { naslov: SERIF_BODONI, tekst: SANS_INTER, oznaka: SANS_INTER, logo: SERIF_BODONI },
        naslov: { tezina: 400, transform: 'none', razmak: '-0.01em', visina: 1.08, skala: 1.12, akcenat: 'kurziv-verzal' },
        oznaka: { transform: 'uppercase', razmak: '0.1em', velicina: '0.78rem', tezina: 500 },
        tekst: { tezina: 400 },
        dugme: { oblik: 'blago', stil: 'puno' },
        radius: { kartica: '4px', slika: '4px' },
        header: { tip: 'providan', logo: 'levo', posleSkrola: 'paper' },
        hero: 'puna-levo',
        usluge: 'kartice',
        slike: { filter: 'none' },
        pokret: {
            easing: 'cubic-bezier(0.525, 0, 0, 1)', brzo: '0.2s', srednje: '0.45s', sporo: '1s',
            reveal: 'reci', revealPomak: '105%', revealTrajanje: '1s', stagger: 0.04,
            heroEfekat: 'blagi-zum', heroTrajanje: '9s', heroPrelaz: 1400,
            hoverSlika: 1.04, linkHover: 'strelica', marquee: 41, marqueePauza: false,
            paralaksa: 50, glatkiSkrol: true, prelazStranice: 'fade',
        },
    },

    istsajd: {
        naziv: 'Ist Sajd',
        inspiracija: 'Fringe Salon NY',
        opis: 'Topao i razigran: koral, menta i tamnoljubičasta, Cormorant + Onest, zaobljene kartice.',
        tamna: false,
        boje: {
            paper: '#FFFFFF', ink: '#292145', mist: '#CEE5DC', povrsina: '#FFFFFF',
            brand: '#F6AFA1', naBrand: '#292145', linija: '#292145', tamna: '#292145', akcenat: '#F6AFA1',
        },
        fontovi: { naslov: SERIF_CORMORANT, tekst: 'Onest, system-ui, sans-serif', oznaka: 'Onest, system-ui, sans-serif', logo: SERIF_CORMORANT },
        naslov: { tezina: 500, transform: 'none', razmak: '0', visina: 1.0, skala: 1.0, akcenat: 'kurziv' },
        oznaka: { transform: 'none', razmak: '0.02em', velicina: '0.95rem', tezina: 500 },
        tekst: { tezina: 300 },
        dugme: { oblik: 'pill', stil: 'puno' },
        radius: { kartica: '18px', slika: '16px' },
        header: { tip: 'pun', logo: 'levo', posleSkrola: 'paper' },
        hero: 'split',
        usluge: 'kartice',
        slike: { filter: 'none' },
        pokret: {
            easing: 'ease', brzo: '0.25s', srednje: '0.5s', sporo: '0.75s',
            reveal: 'slide', revealPomak: '40px', revealTrajanje: '0.9s', stagger: 0.1,
            heroEfekat: 'nista', heroTrajanje: '0s', heroPrelaz: 1000,
            hoverSlika: 1.04, linkHover: 'boja', marquee: 25, marqueePauza: true,
            paralaksa: 0, glatkiSkrol: false, prelazStranice: 'fade',
        },
    },

    zaliv: {
        naziv: 'Zaliv',
        inspiracija: 'Barrow Salon',
        opis: 'Galerijski minimalizam: crno-belo, Bodoni + lagani grotesk, ogroman logotip, uvučene fotografije.',
        tamna: false,
        boje: {
            paper: '#FFFFFF', ink: '#000000', mist: '#F1F1EF', povrsina: '#FFFFFF',
            brand: '#000000', naBrand: '#FFFFFF', linija: '#000000', tamna: '#000000', akcenat: '#F1F1EF',
        },
        fontovi: { naslov: SERIF_BODONI, tekst: '"DM Sans", Manrope, system-ui, sans-serif', oznaka: '"DM Sans", Manrope, system-ui, sans-serif', logo: 'Oswald, "Arial Narrow", sans-serif' },
        naslov: { tezina: 500, transform: 'none', razmak: '0', visina: 1.3, skala: 0.85, akcenat: 'kurziv' },
        oznaka: { transform: 'uppercase', razmak: '0.19em', velicina: '0.74rem', tezina: 500 },
        tekst: { tezina: 300 },
        dugme: { oblik: 'pravo', stil: 'puno' },
        radius: { kartica: '0px', slika: '0px' },
        header: { tip: 'pun', logo: 'levo-veliki', posleSkrola: 'paper' },
        hero: 'uvuceno',
        usluge: 'lista',
        slike: { filter: 'none' },
        pokret: {
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)', brzo: '0.25s', srednje: '0.6s', sporo: '0.6s',
            reveal: 'fade-up', revealPomak: '12px', revealTrajanje: '0.6s', stagger: 0.06,
            heroEfekat: 'nista', heroTrajanje: '0s', heroPrelaz: 900,
            hoverSlika: 1, linkHover: 'podvuci', marquee: 40, marqueePauza: false,
            paralaksa: 0, glatkiSkrol: false, prelazStranice: 'fade',
        },
    },

    holivud: {
        naziv: 'Holivud',
        inspiracija: 'Nine Zero One',
        opis: 'Glamur Zapadnog Holivuda: nude i crno, široki small-caps naslovi, providan meni preko fotografije, marquee.',
        tamna: false,
        boje: {
            paper: '#FFFEFC', ink: '#111111', mist: '#F5EBDF', povrsina: '#FFFFFF',
            brand: '#111111', naBrand: '#FFFFFF', linija: '#111111', tamna: '#111111', akcenat: '#F5EBDF',
        },
        fontovi: { naslov: '"Cormorant SC", "Cormorant Garamond", Georgia, serif', tekst: 'Helvetica, Arial, sans-serif', oznaka: 'Helvetica, Arial, sans-serif', logo: '"Cormorant SC", Georgia, serif' },
        naslov: { tezina: 500, transform: 'none', razmak: '0.08em', visina: 1.05, skala: 1.0, akcenat: 'nista' },
        oznaka: { transform: 'uppercase', razmak: '0.08em', velicina: '0.72rem', tezina: 400 },
        tekst: { tezina: 400 },
        dugme: { oblik: 'pravo', stil: 'obris' },
        radius: { kartica: '0px', slika: '0px' },
        header: { tip: 'providan', logo: 'centar', posleSkrola: 'paper' },
        hero: 'puna-levo',
        usluge: 'plocice',
        slike: { filter: 'none' },
        pokret: {
            easing: 'ease', brzo: '0.3s', srednje: '0.4s', sporo: '0.8s',
            reveal: 'fade', revealPomak: '30px', revealTrajanje: '0.8s', stagger: 0.08,
            heroEfekat: 'blagi-zum', heroTrajanje: '8s', heroPrelaz: 1000,
            hoverSlika: 1.03, linkHover: 'boja', marquee: 110, marqueePauza: true,
            paralaksa: 0, glatkiSkrol: false, prelazStranice: 'fade',
        },
    },

    hjuston: {
        naziv: 'Hjuston',
        inspiracija: 'The Upper Hand',
        opis: 'Nagrađivani salon: crno-bele fotografije, centriran Cormorant, crveni akcenti i zvezdice, fadeInUp.',
        tamna: false,
        boje: {
            paper: '#FFFFFF', ink: '#222222', mist: '#F5F5F5', povrsina: '#FFFFFF',
            brand: '#D22630', naBrand: '#FFFFFF', linija: '#222222', tamna: '#222222', akcenat: '#D22630',
        },
        fontovi: { naslov: SERIF_CORMORANT, tekst: SERIF_CORMORANT, oznaka: 'Raleway, system-ui, sans-serif', logo: 'Raleway, system-ui, sans-serif' },
        naslov: { tezina: 400, transform: 'none', razmak: '-0.02em', visina: 1.15, skala: 1.05, akcenat: 'kurziv-boja' },
        oznaka: { transform: 'uppercase', razmak: '0.2em', velicina: '0.68rem', tezina: 700 },
        tekst: { tezina: 400, velicina: '1.2rem' },
        dugme: { oblik: 'pravo', stil: 'puno' },
        radius: { kartica: '0px', slika: '0px' },
        header: { tip: 'providan', logo: 'levo', posleSkrola: 'paper' },
        hero: 'puna-centar',
        usluge: 'plocice',
        slike: { filter: 'grayscale' },
        pokret: {
            easing: 'ease-in-out', brzo: '0.2s', srednje: '0.5s', sporo: '1.2s',
            reveal: 'fade-up', revealPomak: '20px', revealTrajanje: '1s', stagger: 0.12,
            heroEfekat: 'blagi-zum', heroTrajanje: '12s', heroPrelaz: 1200,
            hoverSlika: 1.03, linkHover: 'boja', marquee: 40, marqueePauza: false,
            paralaksa: 0, glatkiSkrol: false, prelazStranice: 'fade',
        },
    },

    volstrit: {
        naziv: 'Volstrit',
        inspiracija: 'Fabio Doti',
        opis: 'Njujorški klasik: Bodoni verzal, Jost sa širokim razmakom, crno-beli hero, pločice usluga.',
        tamna: false,
        boje: {
            paper: '#F5F5F5', ink: '#3B3B3B', mist: '#EAEAE6', povrsina: '#FFFFFF',
            brand: '#C0BFAA', naBrand: '#1C1C1C', linija: '#3B3B3B', tamna: '#1C1C1C', akcenat: '#C0BFAA',
        },
        fontovi: { naslov: SERIF_BODONI, tekst: 'Poppins, Jost, system-ui, sans-serif', oznaka: 'Jost, system-ui, sans-serif', logo: SERIF_BODONI },
        naslov: { tezina: 400, transform: 'uppercase', razmak: '0.02em', visina: 1.13, skala: 1.0, akcenat: 'nista' },
        oznaka: { transform: 'uppercase', razmak: '0.3em', velicina: '0.7rem', tezina: 600 },
        tekst: { tezina: 400 },
        dugme: { oblik: 'pravo', stil: 'puno' },
        radius: { kartica: '0px', slika: '0px' },
        header: { tip: 'pun', logo: 'levo', posleSkrola: 'paper' },
        hero: 'puna-centar',
        usluge: 'plocice',
        slike: { filter: 'grayscale' },
        pokret: {
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)', brzo: '0.25s', srednje: '0.6s', sporo: '0.6s',
            reveal: 'fade', revealPomak: '0px', revealTrajanje: '0.6s', stagger: 0.08,
            heroEfekat: 'nista', heroTrajanje: '0s', heroPrelaz: 900,
            hoverSlika: 1.04, linkHover: 'podvuci', marquee: 40, marqueePauza: false,
            paralaksa: 0, glatkiSkrol: false, prelazStranice: 'fade',
        },
    },

    noar: {
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
    },
};

export const PODRAZUMEVANA_TEMA = 'soho';

const spoji = (osnova, izmene) => {
    if (!izmene || typeof izmene !== 'object') return osnova;
    const rez = { ...osnova };
    for (const [k, v] of Object.entries(izmene)) {
        rez[k] = v && typeof v === 'object' && !Array.isArray(v) ? { ...osnova[k], ...v } : v;
    }
    return rez;
};

/** Tema po id-ju, ili po zapisu iz salon.js (string ili { osnova, ...izmene }). */
export const resiTemu = (zapis) => {
    if (typeof zapis === 'string') {
        return { id: TEME[zapis] ? zapis : PODRAZUMEVANA_TEMA, ...(TEME[zapis] ?? TEME[PODRAZUMEVANA_TEMA]) };
    }
    if (zapis && typeof zapis === 'object') {
        const id = TEME[zapis.osnova] ? zapis.osnova : PODRAZUMEVANA_TEMA;
        const { osnova: _o, ...izmene } = zapis;
        return { id, ...spoji(TEME[id], izmene) };
    }
    return { id: PODRAZUMEVANA_TEMA, ...TEME[PODRAZUMEVANA_TEMA] };
};

const rgb = (hex) => {
    const h = hex.replace('#', '');
    const n = parseInt(h.length === 3 ? h.split('').map((c) => c + c).join('') : h, 16);
    return `${(n >> 16) & 255} ${(n >> 8) & 255} ${n & 255}`;
};

const ZAOBLJENJE = { pill: '999px', blago: '4px', pravo: '0px' };

/** CSS promenljive teme — ide u <style id="tema"> u <head>. */
export const cssTeme = (t) => {
    const b = t.boje;
    const p = t.pokret;
    const v = {
        '--c-paper': rgb(b.paper), '--c-ink': rgb(b.ink), '--c-mist': rgb(b.mist),
        '--c-povrsina': rgb(b.povrsina), '--c-brand': rgb(b.brand), '--c-na-brand': rgb(b.naBrand),
        '--c-linija': rgb(b.linija), '--c-tamna': rgb(b.tamna), '--c-akcenat': rgb(b.akcenat),
        '--font-naslov': t.fontovi.naslov, '--font-tekst': t.fontovi.tekst,
        '--font-oznaka': t.fontovi.oznaka, '--font-logo': t.fontovi.logo,
        '--naslov-tezina': t.naslov.tezina, '--naslov-tt': t.naslov.transform,
        '--naslov-razmak': t.naslov.razmak, '--naslov-visina': t.naslov.visina, '--naslov-skala': t.naslov.skala,
        '--oznaka-tt': t.oznaka.transform, '--oznaka-razmak': t.oznaka.razmak,
        '--oznaka-velicina': t.oznaka.velicina, '--oznaka-tezina': t.oznaka.tezina,
        '--tekst-tezina': t.tekst.tezina, '--tekst-velicina': t.tekst.velicina ?? '1rem', '--tekst-tt': t.tekst.transform ?? 'none',
        '--r-dugme': ZAOBLJENJE[t.dugme.oblik] ?? '0px', '--r-kartica': t.radius.kartica, '--r-slika': t.radius.slika,
        '--ease': p.easing, '--t-brzo': p.brzo, '--t-srednje': p.srednje, '--t-sporo': p.sporo,
        '--reveal-pomak': p.revealPomak, '--reveal-trajanje': p.revealTrajanje,
        '--hero-trajanje': p.heroTrajanje, '--hero-prelaz': `${p.heroPrelaz}ms`,
        '--hover-slika': p.hoverSlika, '--marquee': `${p.marquee}s`,
        '--filter-slike': t.slike.filter === 'grayscale' ? 'grayscale(1) contrast(1.05)' : 'none',
        'color-scheme': t.tamna ? 'dark' : 'light',
    };
    return `:root{${Object.entries(v).map(([k, val]) => `${k}:${val}`).join(';')}}`;
};

/** Atributi na <html> po kojima CSS menja raspored i ponašanje. */
export const atributiTeme = (t) => ({
    'data-tema': t.id,
    'data-hero': t.hero,
    'data-dugme': t.dugme.stil,
    'data-link': t.pokret.linkHover,
    'data-reveal': t.pokret.reveal,
    'data-hero-efekat': t.pokret.heroEfekat,
    'data-akcenat': t.naslov.akcenat,
    'data-marquee-pauza': t.pokret.marqueePauza ? 'da' : 'ne',
});
