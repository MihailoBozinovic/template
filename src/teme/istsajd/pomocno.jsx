/*
 * Zajednički delovi teme „istsajd”: karusel (klizanje 1s ease-in-out iz teme),
 * okrugle strelice, broj vidljivih stavki po širini ekrana, poklon-link.
 */
import React, { useCallback, useEffect, useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useSajt } from '../../kontekst/Sajt.jsx';
import { cx } from '../../components/primitivi.jsx';

/** Koliko stavki karusel prikazuje: { telefon, tablet, desktop } → broj (posle hidratacije). */
export const useVidljivo = ({ telefon = 1, tablet = telefon, desktop = tablet } = {}) => {
    const [v, setV] = useState(desktop);
    useEffect(() => {
        const md = window.matchMedia('(min-width: 768px)');
        const lg = window.matchMedia('(min-width: 1024px)');
        const racunaj = () => setV(lg.matches ? desktop : md.matches ? tablet : telefon);
        racunaj();
        md.addEventListener('change', racunaj);
        lg.addEventListener('change', racunaj);
        return () => { md.removeEventListener('change', racunaj); lg.removeEventListener('change', racunaj); };
    }, [telefon, tablet, desktop]);
    return v;
};

/** Indeks karusela sa kruženjem: posle poslednjeg ide prvi. */
export const useKarusel = (broj, vidljivo = 1) => {
    const max = Math.max(0, broj - vidljivo);
    const [i, setI] = useState(0);
    useEffect(() => { setI((x) => Math.min(x, max)); }, [max]);
    const napred = useCallback(() => setI((x) => (x >= max ? 0 : x + 1)), [max]);
    const nazad = useCallback(() => setI((x) => (x <= 0 ? max : x - 1)), [max]);
    return { i, setI, napred, nazad, max };
};

/** Okrugla strelica karusela: rgba(0,0,0,.64), bela ikona, krug od 34px (36 sa okvirom). */
export const Strelica = ({ smer = 'napred', onClick, className, label, ...o }) => (
    <button type="button" onClick={onClick} aria-label={label} className={cx('ist-strelica', className)} {...o}>
        {smer === 'napred' ? <ArrowRight size={18} strokeWidth={2.25} aria-hidden="true" /> : <ArrowLeft size={18} strokeWidth={2.25} aria-hidden="true" />}
    </button>
);

/**
 * Traka karusela: stavke iste širine (`vidljivo` u kadru, razmak `razmak` px),
 * pomera se za `i` stavki. Klizanje: transform u trajanju i krivoj iz teme.
 */
export const Traka = ({ i, vidljivo, razmak = 0, className, children, ...o }) => (
    <div
        className={cx('ist-traka flex', className)}
        style={{ '--v': vidljivo, '--razmak': `${razmak}px`, '--i': i, gap: `${razmak}px` }}
        {...o}
    >
        {children}
    </div>
);

/** Poklon vaučer: poruka salonu (WhatsApp) ili poziv — kao podrazumevana sekcija Vaucer. */
export const usePoklonLink = () => {
    const { salon, t } = useSajt();
    if (!salon.poklonVaucer?.tekst) return null;
    const k = salon.kontakt;
    return k.whatsapp
        ? { href: `https://wa.me/${k.whatsapp}?text=${encodeURIComponent(t.pocetna.vaucerNaslov)}`, target: '_blank', rel: 'noopener noreferrer' }
        : { href: `tel:${k.telefon}` };
};

/** Link ka lokaciji na mapama (iz salon.lokacija). */
export const linkMape = (l) => l.googleMape || `https://www.google.com/maps/search/?api=1&query=${l.koordinate.lat},${l.koordinate.lng}`;
