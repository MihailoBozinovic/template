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

import menhetn from '../teme/menhetn/tema.js';
import palma from '../teme/palma/tema.js';
import soho from '../teme/soho/tema.js';
import istsajd from '../teme/istsajd/tema.js';
import zaliv from '../teme/zaliv/tema.js';
import holivud from '../teme/holivud/tema.js';
import hjuston from '../teme/hjuston/tema.js';
import volstrit from '../teme/volstrit/tema.js';
import noar from '../teme/noar/tema.js';

export const TEME = { menhetn, palma, soho, istsajd, zaliv, holivud, hjuston, volstrit, noar };

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
        '--filter-hero': t.slike.heroFilter === 'grayscale' ? 'grayscale(1) contrast(1.05)' : (t.slike.filter === 'grayscale' ? 'grayscale(1) contrast(1.05)' : 'none'),
        'color-scheme': t.tamna ? 'dark' : 'light',
        '--logo-brenda-filter': t.tamna ? 'brightness(0) invert(1)' : 'brightness(0)',
    };
    const telefon = {};

    /*
     * Dodatne boje (nije obavezno): telo (prigušen tekst), footer, header,
     * najavna traka… → --c-<ime> u rgb obliku, za `rgb(var(--c-telo))`.
     */
    for (const [ime, hex] of Object.entries(b)) {
        if (['paper', 'ink', 'mist', 'povrsina', 'brand', 'naBrand', 'linija', 'tamna', 'akcenat'].includes(ime)) continue;
        if (typeof hex === 'string' && /^#[0-9a-f]{3,8}$/i.test(hex)) v[`--c-${ime.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}`] = rgb(hex.slice(0, 7));
    }

    /*
     * Tipografija po nivoima, sa tačnim veličinama za desktop i telefon:
     *   tipografija: { hero: { velicina: ['144px', '54px'], visina: 1.1, razmak: '-0.02em',
     *                          tezina: 400, transform: 'none', stil: 'italic', font: 'naslov' }, … }
     * Ključevi: hero, h1, h2, h3, telo, uvod, oznaka, nav, dugme, meni, footer, logo.
     * Svaka vrednost može biti niz [desktop, telefon]. → --<ključ>-fs/-lh/-ls/-fw/-tt/-fst/-ff
     */
    const FONT = { naslov: 'var(--font-naslov)', tekst: 'var(--font-tekst)', oznaka: 'var(--font-oznaka)', logo: 'var(--font-logo)' };
    const POLJA = { velicina: 'fs', visina: 'lh', razmak: 'ls', tezina: 'fw', transform: 'tt', stil: 'fst', font: 'ff' };
    for (const [nivo, d] of Object.entries(t.tipografija ?? {})) {
        for (const [polje, kratko] of Object.entries(POLJA)) {
            if (d?.[polje] == null) continue;
            const [dv, tv] = Array.isArray(d[polje]) ? d[polje] : [d[polje], d[polje]];
            const vr = (x) => (polje === 'font' ? FONT[x] ?? x : x);
            v[`--${nivo}-${kratko}`] = vr(dv);
            if (tv !== dv) telefon[`--${nivo}-${kratko}`] = vr(tv);
        }
    }

    /*
     * Razmaci: { kontejner: '84rem', gutter: ['2.5rem', '1.25rem'], sekcija: ['7rem', '4rem'],
     *            header: ['76px', '64px'] } → --kontejner, --gutter, --sekcija-py, --header-h
     */
    const RAZMACI = { kontejner: '--kontejner', gutter: '--gutter', sekcija: '--sekcija-py', header: '--header-h' };
    for (const [ime, prom] of Object.entries(RAZMACI)) {
        const x = t.razmaci?.[ime];
        if (x == null) continue;
        const [dv, tv] = Array.isArray(x) ? x : [x, x];
        v[prom] = dv;
        if (tv !== dv) telefon[prom] = tv;
    }

    const blok = (o) => Object.entries(o).map(([k, val]) => `${k}:${val}`).join(';');
    return `:root{${blok(v)}}${Object.keys(telefon).length ? `@media (max-width:767.98px){:root{${blok(telefon)}}}` : ''}`;
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
