/*
 * Header teme „soho”: traka kontakta (32px, breskva) + red navigacije
 * (79px / 63px). Na vrhu početne providan preko heroja (krem tekst, krem
 * linija), posle skrola pun papir sa linijom tinte; na desktopu traka odlazi,
 * na telefonu ostaje. „Zakaži” je nav link sa padajućim menijem (načini
 * zakazivanja), ne dugme. Mobilni meni: redovi razdvojeni linijama od ivice
 * do ivice. Zavesa (crni panel) pri promeni stranice.
 */
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronDown } from 'lucide-react';
import { useSajt } from '../../kontekst/Sajt.jsx';
import { kljucIzPutanje } from '../../i18n/jezici.js';
import { NavLinkovi, STAVKE, STAVKE_MENIJA, useMeni, useSkrol, useZakaziLink } from '../../components/Header.jsx';
import { IzborJezika } from '../../components/delovi.jsx';
import { cx } from '../../components/primitivi.jsx';
import { LogoS, Veza, useT } from './delovi.jsx';

const useIzoLayout = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/** Načini zakazivanja: online, poziv, WhatsApp, Viber — šta salon ima. */
export const useNacini = () => {
    const { salon, t } = useSajt();
    const T = useT();
    const zakazi = useZakaziLink();
    const k = salon.kontakt;
    return [
        { ...zakazi, tekst: T.zakaziOnline },
        k.telefon && { href: `tel:${k.telefon}`, tekst: `${t.opste.pozovite} · ${k.telefonPrikaz}` },
        k.whatsapp && { href: `https://wa.me/${k.whatsapp}`, target: '_blank', rel: 'noopener noreferrer', tekst: t.opste.whatsapp },
        k.viber && { href: `viber://chat?number=%2B${k.viber}`, tekst: t.opste.viber },
    ].filter(Boolean);
};

const ZakaziPadajuci = () => {
    const { t } = useSajt();
    const T = useT();
    const zakazi = useZakaziLink();
    const nacini = useNacini();
    const { pathname } = useLocation();
    const [otvoren, setOtvoren] = useState(false);
    const ref = useRef(null);

    useEffect(() => { setOtvoren(false); }, [pathname]);
    useEffect(() => {
        if (!otvoren) return undefined;
        const van = (e) => { if (!ref.current?.contains(e.target)) setOtvoren(false); };
        const esc = (e) => { if (e.key === 'Escape') setOtvoren(false); };
        document.addEventListener('pointerdown', van);
        window.addEventListener('keydown', esc);
        return () => { document.removeEventListener('pointerdown', van); window.removeEventListener('keydown', esc); };
    }, [otvoren]);

    return (
        <div
            ref={ref}
            className={cx('soho-zakazi', otvoren && 'otvoren')}
            onMouseEnter={() => setOtvoren(true)}
            onMouseLeave={() => setOtvoren(false)}
            onBlur={(e) => { if (!ref.current?.contains(e.relatedTarget)) setOtvoren(false); }}
        >
            <Veza {...zakazi} className="link-nav nadnaslov soho-nav-link">{t.nav.zakazi}</Veza>
            <button
                type="button"
                className="soho-zakazi-chevron"
                aria-expanded={otvoren}
                aria-haspopup="true"
                aria-label={T.zakaziMeni}
                onClick={() => setOtvoren((o) => !o)}
            >
                <ChevronDown size={18} strokeWidth={1.25} aria-hidden="true" />
            </button>
            <ul className="soho-padajuci" inert={!otvoren ? '' : undefined}>
                {nacini.map(({ tekst, ...veza }, i) => (
                    <li key={tekst} style={{ '--i': i }}>
                        <Veza {...veza} className="soho-padajuci-link">{tekst}</Veza>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const MeniS = ({ meni }) => {
    const { t, p } = useSajt();
    const T = useT();
    const zakazi = useZakaziLink();
    const nacini = useNacini();
    const { pathname } = useLocation();
    const aktivna = kljucIzPutanje(pathname);
    const [podmeni, setPodmeni] = useState(false);
    useEffect(() => { if (!meni.otvoren) setPodmeni(false); }, [meni.otvoren]);
    const zatvori = () => meni.setOtvoren(false);
    const n = STAVKE_MENIJA.length;

    return (
        <div id="mobilni-meni" className={cx('soho-meni', meni.otvoren && 'otvoren')} aria-hidden={!meni.otvoren} inert={!meni.otvoren ? '' : undefined}>
            <nav aria-label={t.nav.meni}>
                <ul className="soho-meni-lista">
                    {STAVKE_MENIJA.map((k, i) => (
                        <li key={k} style={{ '--i': i }}>
                            <Link to={p(k)} onClick={zatvori} aria-current={aktivna === k ? 'page' : undefined} className="soho-meni-link">{t.nav[k]}</Link>
                        </li>
                    ))}
                    <li style={{ '--i': n }}>
                        <div className="soho-meni-red">
                            <Veza {...zakazi} onClick={zatvori} className="soho-meni-link">{t.nav.zakazi}</Veza>
                            <button
                                type="button"
                                className={cx('soho-meni-chevron', podmeni && 'otvoren')}
                                aria-expanded={podmeni}
                                aria-label={T.zakaziMeni}
                                onClick={() => setPodmeni((x) => !x)}
                            >
                                <ChevronDown size={22} strokeWidth={1.25} aria-hidden="true" />
                            </button>
                        </div>
                        <ul className={cx('soho-meni-pod', podmeni && 'otvoren')} inert={!podmeni ? '' : undefined}>
                            {nacini.map(({ tekst, ...veza }) => (
                                <li key={tekst}><Veza {...veza} onClick={zatvori} className="soho-meni-pod-link">{tekst}</Veza></li>
                            ))}
                        </ul>
                    </li>
                </ul>
            </nav>
            <div className="soho-meni-dno" style={{ '--i': n + 1 }}>
                <IzborJezika puno onIzbor={zatvori} />
            </div>
        </div>
    );
};

/** Crni panel preko ekrana koji odlazi udesno posle promene stranice (0.5 s, kašnjenje 0.2 s). */
const Zavesa = () => {
    const { pathname } = useLocation();
    const pre = useRef(pathname);
    const [n, setN] = useState(0);
    useIzoLayout(() => {
        if (pre.current === pathname) return;
        pre.current = pathname;
        setN((x) => x + 1);
    }, [pathname]);
    return n ? <div key={n} className="soho-zavesa" aria-hidden="true" /> : null;
};

export default function HeaderSoho() {
    const { t, salon } = useSajt();
    const T = useT();
    const { pathname } = useLocation();
    const { skrolovano } = useSkrol({ prag: 10 });
    const meni = useMeni();
    const k = salon.kontakt;
    const providan = kljucIzPutanje(pathname) === 'pocetna' && !skrolovano && !meni.otvoren;

    // Lenis ne sme da skroluje stranicu ispod otvorenog menija.
    useEffect(() => {
        const l = window.__lenis;
        if (!l) return;
        if (meni.otvoren) l.stop(); else l.start();
    }, [meni.otvoren]);

    return (
        <>
            <a href="#sadrzaj" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-paper focus:px-4 focus:py-2 focus:text-ink">
                {t.opste.preskoci}
            </a>
            <header className={cx('soho-header', providan ? 'soho-header--providan' : 'soho-header--pun', skrolovano && 'soho-header--skrol', meni.otvoren && 'soho-header--meni')}>
                <div className="soho-traka">
                    {k.telefon && <a href={`tel:${k.telefon}`}>{T.tel}:{k.telefonPrikaz}</a>}
                    {k.telefon && k.email && <span className="soho-traka-crta" aria-hidden="true" />}
                    {k.email && <a href={`mailto:${k.email}`}>{T.email}:{k.email}</a>}
                </div>
                <div className="soho-header-red">
                    <LogoS onClick={() => meni.setOtvoren(false)} />
                    <button
                        ref={meni.dugmeRef}
                        type="button"
                        className={cx('soho-hamburger', meni.otvoren && 'otvoren')}
                        aria-expanded={meni.otvoren}
                        aria-controls="mobilni-meni"
                        aria-label={meni.otvoren ? t.nav.zatvori : t.nav.meni}
                        onClick={meni.prebaci}
                    >
                        <span /><span />
                    </button>
                    <nav aria-label={t.nav.meni} className="soho-nav">
                        <NavLinkovi stavke={STAVKE} className="soho-nav-lista" klasaLinka="link-nav nadnaslov soho-nav-link" />
                        <span className="soho-nav-crta" aria-hidden="true" />
                        <IzborJezika className="soho-jezici" />
                        <ZakaziPadajuci />
                    </nav>
                </div>
            </header>
            <MeniS meni={meni} />
            <Zavesa />
        </>
    );
}
