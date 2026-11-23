/*
 * Header teme „palma” (Palm Sunday): nav levo (prelama se u dva reda), logo
 * tačno u sredini, desno jezik + tanka crta + ikonice. Nikad se ne sakriva.
 * Na početnoj je providan dok je ispod njega hero (tekst krem), posle heroja
 * pun papir — bez senke, blura i donje linije. Telefon: 46 px, dve crte +
 * telefon levo, logo u sredini, kalendar (zakazivanje) desno.
 */
import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CalendarDays, Phone } from 'lucide-react';
import { useSajt } from '../../kontekst/Sajt.jsx';
import { SVI_JEZICI, kljucIzPutanje, putanja } from '../../i18n/jezici.js';
import { aktivniJezici } from '../../lib/seo.js';
import { javno } from '../../lib/baza.js';
import { cx } from '../../components/primitivi.jsx';
import { DugmeMenija, useMeni, useZakaziLink } from '../../components/Header.jsx';
import { Mreze } from '../../components/delovi.jsx';
import { tekstovi } from './tekstovi.js';

/** Stavke navigacije: „Zakaži” je prva (kao „Book” na referenci), bez pill CTA. */
const STAVKE = ['cenovnik', 'tim', 'galerija', 'oNama', 'kontakt', 'pitanja'];

/** Link „Zakaži” kao <Link> ili spoljni <a>, zavisno od načina zakazivanja. */
export const ZakaziVeza = ({ className, children, ...o }) => {
    const z = useZakaziLink();
    return z.to
        ? <Link to={z.to} className={className} {...o}>{children}</Link>
        : <a href={z.href} target={z.target} rel={z.rel} className={className} {...o}>{children}</a>;
};

export const PalmaLogo = ({ className }) => {
    const { salon, p } = useSajt();
    return (
        <Link to={p('pocetna')} className={cx('p-logo logo-tekst', className)} aria-label={salon.naziv}>
            {salon.logo ? <img src={javno(salon.logo)} alt="" className="h-[21px] w-auto md:h-[23px]" /> : <span>{salon.naziv}</span>}
        </Link>
    );
};

/** SR · EN · RU kao sitan verzal; trenutni je podvučen. */
export const Jezici = ({ className }) => {
    const { jezik, t } = useSajt();
    const { pathname } = useLocation();
    const jezici = aktivniJezici();
    if (jezici.length < 2) return null;
    const kljuc = kljucIzPutanje(pathname) ?? 'pocetna';
    return (
        <nav aria-label={t.nav.jezik} className={className}>
            <ul className="m-0 flex list-none items-center gap-3 p-0">
                {jezici.map((j) => (
                    <li key={j}>
                        <Link to={putanja(kljuc, j)} hrefLang={j} lang={j} aria-current={j === jezik ? 'true' : undefined} className="link-nav nadnaslov p-jezik">
                            {SVI_JEZICI[j].kratko}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

/**
 * Da li je header iznad heroja (početna): providan dok dno heroja nije prošlo
 * donju ivicu headera — ne na fiksnom pragu skrola.
 */
const usePrekoHeroja = (aktivno) => {
    const [preko, setPreko] = useState(aktivno);
    useEffect(() => {
        if (!aktivno) { setPreko(false); return undefined; }
        let ceka = false;
        const izracunaj = () => {
            ceka = false;
            const hero = document.querySelector('[data-palma-hero]');
            const header = document.querySelector('.p-header');
            if (!hero) { setPreko(false); return; }
            setPreko(hero.getBoundingClientRect().bottom > (header?.offsetHeight ?? 80));
        };
        const naSkrol = () => { if (!ceka) { ceka = true; requestAnimationFrame(izracunaj); } };
        izracunaj();
        window.addEventListener('scroll', naSkrol, { passive: true });
        window.addEventListener('resize', naSkrol);
        return () => { window.removeEventListener('scroll', naSkrol); window.removeEventListener('resize', naSkrol); };
    }, [aktivno]);
    return preko;
};

const IkonaMeni = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M2 7.5h16M2 12.5h16" stroke="currentColor" strokeWidth="1.25" /></svg>
);
const IkonaZatvori = () => (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="1.25" /></svg>
);

/** Mobilni meni ispod headera: ogromni linkovi (64 px), na dnu mreže i jezik. */
const PalmaMeni = ({ meni }) => {
    const { t, p, salon } = useSajt();
    const { pathname } = useLocation();
    const aktivna = kljucIzPutanje(pathname);
    return (
        <div
            id="mobilni-meni"
            className={cx('p-meni fixed inset-x-0 bottom-0 z-40 flex flex-col xl:hidden', meni.otvoren ? 'meni-otvoren' : 'pointer-events-none')}
            aria-hidden={!meni.otvoren}
            inert={!meni.otvoren ? '' : undefined}
        >
            <nav aria-label={t.nav.meni} className="flex-1 overflow-y-auto">
                <ul className="p-meni-lista m-0 list-none p-0">
                    <li className="meni-stavka" style={{ '--i': 0 }}>
                        <ZakaziVeza className="p-meni-link" aria-current={aktivna === 'zakazivanje' ? 'page' : undefined}>{t.nav.zakazi}</ZakaziVeza>
                    </li>
                    {STAVKE.map((k, i) => (
                        <li key={k} className="meni-stavka" style={{ '--i': i + 1 }}>
                            <Link to={p(k)} className="p-meni-link" aria-current={aktivna === k ? 'page' : undefined}>{t.nav[k]}</Link>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="meni-stavka p-meni-dno" style={{ '--i': STAVKE.length + 1 }}>
                <div className="p-meni-red"><Mreze velicina={18} className="p-mreze" /></div>
                <div className="p-meni-red flex items-center justify-between gap-4">
                    <Jezici />
                    <a href={`tel:${salon.kontakt.telefon}`} className="p-footer-link inline-flex items-center gap-2">
                        <Phone size={16} strokeWidth={1.25} aria-hidden="true" />{salon.kontakt.telefonPrikaz}
                    </a>
                </div>
            </div>
        </div>
    );
};

export default function PalmaHeader() {
    const { t, p, salon, jezik } = useSajt();
    const tk = tekstovi(jezik);
    const { pathname } = useLocation();
    const kljuc = kljucIzPutanje(pathname);
    const meni = useMeni();
    const prekoHeroja = usePrekoHeroja(kljuc === 'pocetna');
    const providan = prekoHeroja && !meni.otvoren;

    return (
        <>
            <a href="#sadrzaj" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-paper focus:px-4 focus:py-2 focus:text-ink">
                {t.opste.preskoci}
            </a>
            <header className={cx('p-header fixed inset-x-0 top-0 z-50', providan ? 'p-header-providan' : 'p-header-pun', meni.otvoren && 'p-header-meni')}>
                <div className="p-header-red">
                    <div className="flex min-w-0 items-center">
                        <nav aria-label={t.nav.meni} className="hidden xl:block">
                            <ul className="p-nav m-0 list-none p-0">
                                <li><ZakaziVeza className="link-nav nadnaslov" aria-current={kljuc === 'zakazivanje' ? 'page' : undefined}>{t.nav.zakazi}</ZakaziVeza></li>
                                {STAVKE.map((k) => (
                                    <li key={k}><Link to={p(k)} className="link-nav nadnaslov" aria-current={kljuc === k ? 'page' : undefined}>{t.nav[k]}</Link></li>
                                ))}
                            </ul>
                        </nav>
                        <div className="flex items-center xl:hidden">
                            <DugmeMenija meni={meni} className="p-ikona -ml-3" ikonaOtvori={<IkonaMeni />} ikonaZatvori={<IkonaZatvori />} />
                            <a href={`tel:${salon.kontakt.telefon}`} className="p-ikona" aria-label={`${tk.pozovi} ${salon.kontakt.telefonPrikaz}`}>
                                <Phone size={20} strokeWidth={1.25} aria-hidden="true" />
                            </a>
                        </div>
                    </div>
                    <PalmaLogo />
                    <div className="flex items-center justify-end">
                        <div className="hidden items-center xl:flex">
                            <Jezici />
                            <span className="p-crta" aria-hidden="true" />
                            <a href={`tel:${salon.kontakt.telefon}`} className="p-ikona" aria-label={`${tk.pozovi} ${salon.kontakt.telefonPrikaz}`}>
                                <Phone size={20} strokeWidth={1.25} aria-hidden="true" />
                            </a>
                        </div>
                        <ZakaziVeza className="p-ikona -mr-3 xl:mr-0" aria-label={t.nav.zakazi}>
                            <CalendarDays size={20} strokeWidth={1.25} aria-hidden="true" />
                        </ZakaziVeza>
                    </div>
                </div>
            </header>
            <PalmaMeni meni={meni} />
        </>
    );
}
