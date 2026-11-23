/*
 * Gradivni blokovi teme „soho”: naslov kurziv + VERZAL sa otkrivanjem po
 * redovima, nadnaslov sa crticom, tanke strelice, tekst-link, slajder sa
 * strelicama, logo i marquee.
 */
import { LogoBrenda } from '../../components/delovi.jsx';
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSajt } from '../../kontekst/Sajt.jsx';
import { cx, usePojava } from '../../components/primitivi.jsx';
import { javno } from '../../lib/baza.js';
import { tekstovi } from './tekstovi.js';

export const useT = () => tekstovi(useSajt().jezik);

/* ── Oznake u tekstu naslova ───────────────────────────────────────────── */
/**
 * Tekst naslova sa oznakama: {…} = uspravan VERZAL, ostalo kurziv, „\n” = prelom.
 * Kad tekst nema oznaka (podaci iz salon.js), VERZAL se zadaje:
 *   akcenat  — drugi deo naslova (salon.js: naslov + akcenat) ide na kraj kao VERZAL;
 *   auto     — 'kraj' (poslednja reč), 'pocetak' (prva reč), 'recenica' (prva rečenica).
 * `prelom` — VERZAL deo počinje u novom redu.
 */
export const oznaci = (tekst, { akcenat, auto, prelom } = {}) => {
    let s = String(tekst ?? '').trim();
    if (!s) return '';
    if (!s.includes('{')) {
        if (akcenat) s = `${s} {${akcenat}}`;
        else if (auto === 'recenica') {
            const m = s.match(/^([^.!?]+[.!?])(\s+)([\s\S]+)$/);
            s = m ? `{${m[1]}}${m[2]}${m[3]}` : oznaci(s, { auto: 'kraj' });
        } else if (auto === 'pocetak') {
            s = s.replace(/^(\S+)/, '{$1}');
        } else if (auto === 'kraj') {
            const reci = s.split(/\s+/);
            if (reci.length > 1) s = s.replace(/(\S+)$/, '{$1}');
        }
    }
    if (prelom) s = s.replace(/\s*\{/, '\n{');
    return s;
};

/** Segmenti teksta: [{ caps, tekst } | { br: true }]. */
const segmenti = (s) => {
    const out = [];
    String(s).split(/(\{[^}]*\})/).forEach((deo) => {
        if (!deo) return;
        const caps = deo.startsWith('{') && deo.endsWith('}');
        const tekst = caps ? deo.slice(1, -1) : deo;
        tekst.split('\n').forEach((x, i) => {
            if (i > 0) out.push({ br: true });
            if (x) out.push({ caps, tekst: x });
        });
    });
    return out;
};

/** Reči u maskama; reč u VERZALU nosi klasu .akcenat (uspravno, uppercase). */
const reciNaslova = (s) => {
    const deca = [];
    segmenti(s).forEach((seg, si) => {
        if (seg.br) { deca.push(<br key={`b${si}`} />); return; }
        seg.tekst.split(/(\s+)/).forEach((r, ri) => {
            if (!r) return;
            if (/^\s+$/.test(r)) { deca.push(' '); return; }
            deca.push(
                <span key={`${si}-${ri}`} className={cx('rec', seg.caps && 'akcenat')}>
                    <span>{r}</span>
                </span>,
            );
        });
    });
    return deca;
};

const KLASA_NIVOA = { hero: 'naslov-hero', 1: 'naslov-1', 2: 'naslov-2', 3: 'naslov-3', displej: 'soho-naslov-displej', poziv: 'soho-naslov-poziv', footer: 'soho-footer-naslov' };

/**
 * Naslov teme: kurziv + VERZAL, redovi izranjaju iz maske jedan za drugim
 * (GSAP SplitText po redovima na referenci). Redovi se mere posle učitavanja
 * fontova i ponovo pri promeni širine; svaka reč dobija --l (redni broj reda),
 * pa sve reči istog reda kreću zajedno. `odmah` — prvi ekran (ne čeka skrol).
 */
export const NaslovS = ({ as: Tag = 'h2', nivo = 2, tekst, akcenat, auto, prelom, odmah = false, kasnjenje = 0, className }) => {
    const ref = useRef(null);
    const vidljivo = usePojava(ref);
    const [izmereno, setIzmereno] = useState(false);
    const s = oznaci(tekst, { akcenat, auto, prelom });

    useEffect(() => {
        const el = ref.current;
        if (!el) return undefined;
        let ziv = true;
        let sirina = 0;
        const izmeri = () => {
            if (!ziv) return;
            let red = -1;
            let pre = null;
            el.querySelectorAll(':scope > .rec').forEach((r) => {
                const y = r.offsetTop;
                if (pre === null || Math.abs(y - pre) > 4) { red += 1; pre = y; }
                r.style.setProperty('--l', red);
            });
            setIzmereno(true);
        };
        const rezerva = setTimeout(izmeri, 1500);
        (document.fonts?.ready ?? Promise.resolve()).then(() => { clearTimeout(rezerva); izmeri(); });
        let ro;
        if (typeof ResizeObserver !== 'undefined') {
            ro = new ResizeObserver(([u]) => {
                const w = Math.round(u.contentRect.width);
                if (w !== sirina) { sirina = w; izmeri(); }
            });
            ro.observe(el);
        }
        return () => { ziv = false; clearTimeout(rezerva); ro?.disconnect(); };
    }, [s]);

    return (
        <Tag
            ref={ref}
            className={cx('naslov soho-naslov linije-anim m-0', KLASA_NIVOA[nivo], izmereno && (odmah || vidljivo) && 'vidljivo', className)}
            style={{ '--kasnjenje': `${kasnjenje}s` }}
        >
            {reciNaslova(s)}
        </Tag>
    );
};

/* ── Nadnaslov sa crticom (otkriva se s leva na desno) ─────────────────── */
export const Oznaka = ({ as: Tag = 'p', odmah = false, centar = false, className, children, ...o }) => {
    const ref = useRef(null);
    const vidljivo = usePojava(ref);
    return (
        <Tag ref={ref} className={cx('nadnaslov soho-oznaka m-0', centar && 'soho-oznaka--centar', odmah ? 'soho-oznaka--odmah' : vidljivo && 'vidljivo', className)} {...o}>
            <span className="soho-oznaka-tekst">{children}</span>
        </Tag>
    );
};

/* ── Tanka strelica (kao na referenci: duga linija, mali vrh) ───────────── */
export const Strelica = ({ sirina = 20, levo = false, className }) => (
    <svg
        className={cx('soho-strelica', className)}
        width={sirina}
        height="14"
        viewBox={`0 0 ${sirina} 14`}
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        aria-hidden="true"
        style={levo ? { transform: 'scaleX(-1)' } : undefined}
    >
        <path d={`M0 7H${sirina - 1}M${sirina - 8} 0.5C${sirina - 7} 3.5 ${sirina - 4} 6.2 ${sirina - 0.5} 7C${sirina - 4} 7.8 ${sirina - 7} 10.5 ${sirina - 8} 13.5`} vectorEffect="non-scaling-stroke" />
    </svg>
);

/** Link ili spoljna adresa (useZakaziLink daje { to } ili { href, target, rel }). */
export const Veza = ({ to, href, children, ...o }) => (to ? <Link to={to} {...o}>{children}</Link> : <a href={href} {...o}>{children}</a>);

/** Tekst-link sa strelicom (hero, „pogledaj sve”). */
export const TekstLink = ({ className, children, ...o }) => (
    <Veza className={cx('soho-tekst-link', className)} {...o}>
        <span>{children}</span>
        <Strelica sirina={20} />
    </Veza>
);

/* ── Horizontalni slajder sa strelicama (Splide na referenci) ──────────── */
export const useSlajder = () => {
    const ref = useRef(null);
    const [kraj, setKraj] = useState({ levo: true, desno: false });
    useEffect(() => {
        const el = ref.current;
        if (!el) return undefined;
        const proveri = () => setKraj({ levo: el.scrollLeft <= 2, desno: el.scrollLeft + el.clientWidth >= el.scrollWidth - 2 });
        proveri();
        el.addEventListener('scroll', proveri, { passive: true });
        window.addEventListener('resize', proveri);
        return () => { el.removeEventListener('scroll', proveri); window.removeEventListener('resize', proveri); };
    }, []);
    const pomeri = (smer) => {
        const el = ref.current;
        if (!el) return;
        const pocetak = parseFloat(getComputedStyle(el).scrollPaddingLeft) || 0;
        const x = el.scrollLeft + pocetak;
        const slajdovi = [...el.children];
        const cilj = smer > 0
            ? slajdovi.find((c) => c.offsetLeft > x + 2)
            : [...slajdovi].reverse().find((c) => c.offsetLeft < x - 2);
        if (!cilj) return;
        el.scrollTo({ left: cilj.offsetLeft - pocetak, behavior: 'smooth' });
    };
    return { ref, kraj, pomeri };
};

export const Strelice = ({ slajder, kontrolise, className }) => {
    const T = useT();
    return (
        <div className={cx('soho-strelice', className)}>
            <button type="button" aria-controls={kontrolise} aria-label={T.prethodni} disabled={slajder.kraj.levo} onClick={() => slajder.pomeri(-1)}>
                <Strelica sirina={48} levo />
            </button>
            <button type="button" aria-controls={kontrolise} aria-label={T.sledeci} disabled={slajder.kraj.desno} onClick={() => slajder.pomeri(1)}>
                <Strelica sirina={48} />
            </button>
        </div>
    );
};

/* ── Logo (tekst u Bodoni verzalu sa razmakom, ili slika iz salon.js) ───── */
export const LogoS = ({ className, onClick }) => {
    const { salon, p } = useSajt();
    return (
        <Link to={p('pocetna')} onClick={onClick} className={cx('logo-tekst soho-logo', className)} aria-label={salon.naziv}>
            {salon.logo ? <img src={javno(salon.logo)} alt="" /> : <span aria-hidden="true">{salon.naziv}</span>}
        </Link>
    );
};

/** Monogram: inicijali naziva salona (kao „64” na referenci). */
export const monogram = (naziv) => String(naziv).split(/\s+/).filter(Boolean).slice(0, 2).map((r) => r[0]).join('');

/* ── Marquee: dve iste liste, svaka putuje -100% (40.96 s, bez pauze) ──── */
export const TrakaS = ({ stavke, className }) => {
    if (!stavke?.length) return null;
    const niz = stavke.length < 8 ? [...stavke, ...stavke] : stavke;
    return (
        <div className={cx('soho-marquee', className)}>
            {[0, 1].map((k) => (
                <ul key={k} className="soho-marquee-lista" aria-hidden={k === 1 ? 'true' : undefined}>
                    {niz.map((s, i) => (
                        <li key={`${k}-${i}`}>
                            {typeof s === 'string' ? s : <LogoBrenda brend={s} tabIndex={k === 1 || i >= stavke.length ? -1 : undefined} />}
                        </li>
                    ))}
                </ul>
            ))}
        </div>
    );
};
