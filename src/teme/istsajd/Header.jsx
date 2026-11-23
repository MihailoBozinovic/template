/*
 * Header teme „istsajd” (Fringe Salon NY): pun beo, 110px (telefon 100px), isti
 * na vrhu, posle skrola i pri skrolu nagore. Logo levo, nav uz desnu ivicu sa
 * mega-menijem usluga, dve koral pilule (Zakaži, Poklon vaučer). Na telefonu:
 * ikonice telefona i zakazivanja + hamburger; meni preko celog ekrana bez animacije.
 */
import React, { useEffect, useId, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CalendarPlus, ChevronDown, ChevronRight, Menu, Phone, X } from 'lucide-react';
import { useSajt } from '../../kontekst/Sajt.jsx';
import { kljucIzPutanje } from '../../i18n/jezici.js';
import { javno } from '../../lib/baza.js';
import { Dugme, cx } from '../../components/primitivi.jsx';
import { DugmeMenija, useMeni, useZakaziLink } from '../../components/Header.jsx';
import { IzborJezika, StatusOtvoreno } from '../../components/delovi.jsx';
import { useTekst } from './tekstovi.js';
import { usePoklonLink } from './pomocno.jsx';

const NAV = ['pocetna', 'cenovnik', 'oNama', 'tim', 'galerija', 'kontakt'];
const MENI = ['pocetna', 'cenovnik', 'oNama', 'tim', 'galerija', 'kontakt', 'pitanja'];

export const LogoIst = ({ className }) => {
    const { salon, p } = useSajt();
    const T = useTekst();
    return (
        <Link to={p('pocetna')} className={cx('ist-logo logo-tekst inline-flex items-center no-underline', className)} aria-label={`${salon.naziv} — ${T.logoPocetna}`}>
            {salon.logo
                ? <img src={javno(salon.logo)} alt={salon.naziv} className="h-[72px] w-auto" />
                : <span className="whitespace-nowrap">{salon.naziv}</span>}
        </Link>
    );
};

/** Stavke mega-menija usluga: kategorije iz salon.js + ceo cenovnik. */
const useStavkeUsluga = () => {
    const { salon, tx, p } = useSajt();
    const T = useTekst();
    return [
        ...salon.kategorije.map((k) => ({ kljuc: k.id, to: `${p('cenovnik')}#${k.id}`, naziv: tx(k.naziv) })),
        { kljuc: 'sve', to: p('cenovnik'), naziv: T.sveUsluge },
    ];
};

const MegaMeni = ({ aktivna }) => {
    const { t, p } = useSajt();
    const T = useTekst();
    const stavke = useStavkeUsluga();
    const [otvoren, setOtvoren] = useState(false);
    const { pathname, hash } = useLocation();
    const id = useId();
    useEffect(() => { setOtvoren(false); }, [pathname, hash]);
    useEffect(() => {
        if (!otvoren) return undefined;
        const esc = (e) => { if (e.key === 'Escape') setOtvoren(false); };
        window.addEventListener('keydown', esc);
        return () => window.removeEventListener('keydown', esc);
    }, [otvoren]);
    // Tri kolone, popunjavaju se red po red (kao na referenci).
    const kolone = [0, 1, 2].map((k) => stavke.filter((_, i) => i % 3 === k));
    return (
        <li className="flex h-full items-center" onMouseEnter={() => setOtvoren(true)} onMouseLeave={() => setOtvoren(false)}>
            <Link to={p('cenovnik')} aria-current={aktivna ? 'page' : undefined} className="ist-nav-link">{T.uslugeMeni}</Link>
            <button
                type="button"
                className="ist-nav-strelica"
                aria-expanded={otvoren}
                aria-haspopup="true"
                aria-label={T.prikaziUsluge}
                onClick={() => setOtvoren((o) => !o)}
            >
                {otvoren ? <X size={16} strokeWidth={2.5} aria-hidden="true" /> : <ChevronDown size={18} strokeWidth={2.5} aria-hidden="true" />}
            </button>
            {otvoren && (
                <div id={id} className="ist-mega absolute inset-x-0 top-full grid grid-cols-3" role="region" aria-label={t.nav.cenovnik}>
                    {kolone.map((kol, k) => (
                        <ul key={k} className="m-0 list-none px-4 pb-2.5 pt-0">
                            {kol.map((s) => (
                                <li key={s.kljuc}>
                                    <Link to={s.to} className="ist-mega-link" onClick={() => setOtvoren(false)}>
                                        <span>{s.naziv}</span>
                                        <ChevronRight size={18} strokeWidth={2.25} aria-hidden="true" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    ))}
                </div>
            )}
        </li>
    );
};

/** Mobilni meni: ceo ekran, belo, bez animacije; „Usluge” je harmonika. */
const MobilniMeniIst = ({ meni }) => {
    const { t, p } = useSajt();
    const { pathname } = useLocation();
    const T = useTekst();
    const zakazi = useZakaziLink();
    const poklon = usePoklonLink();
    const stavkeUsluga = useStavkeUsluga();
    const [usluge, setUsluge] = useState(false);
    const aktivna = kljucIzPutanje(pathname);
    const idUsluga = useId();
    return (
        <div id="mobilni-meni" className={cx('ist-meni fixed inset-0 z-40 flex-col overflow-y-auto bg-paper xl:hidden', meni.otvoren ? 'flex' : 'hidden')}>
            <nav aria-label={t.nav.meni} className="px-5 pb-10" style={{ paddingTop: 'calc(var(--header-h) + 4px)' }}>
                <ul className="m-0 list-none p-0">
                    {MENI.map((k) => (k === 'cenovnik' ? (
                        <li key={k}>
                            <div className="flex items-center gap-3">
                                <Link to={p('cenovnik')} className="ist-meni-link" aria-current={aktivna === k ? 'page' : undefined}>{T.uslugeMeni}</Link>
                                <button type="button" className="ist-meni-strelica" aria-expanded={usluge} aria-controls={idUsluga} aria-label={T.prikaziUsluge} onClick={() => setUsluge((u) => !u)}>
                                    <ChevronDown size={20} strokeWidth={2.5} aria-hidden="true" style={{ transform: usluge ? 'rotate(180deg)' : 'none' }} />
                                </button>
                            </div>
                            <ul id={idUsluga} className={cx('m-0 list-none py-0 pl-4 pr-0', usluge ? 'block' : 'hidden')}>
                                {stavkeUsluga.map((s) => (
                                    <li key={s.kljuc}>
                                        <Link to={s.to} className="ist-meni-link ist-meni-pod" onClick={() => meni.setOtvoren(false)}>{s.naziv}</Link>
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ) : (
                        <li key={k}>
                            <Link to={p(k)} className="ist-meni-link" aria-current={aktivna === k ? 'page' : undefined}>{t.nav[k]}</Link>
                        </li>
                    )))}
                </ul>
                <div className="mt-8 flex flex-col items-start gap-8">
                    <Dugme {...zakazi} onClick={() => meni.setOtvoren(false)}>
                        {t.nav.zakazi}
                        <ChevronRight size={20} strokeWidth={2.25} aria-hidden="true" className="-mr-1 ml-3 inline-block align-[-4px]" />
                    </Dugme>
                    {poklon && <Dugme {...poklon}>{T.poklon}</Dugme>}
                </div>
                <div className="mt-12 space-y-5 border-t pt-8" style={{ borderColor: 'rgb(var(--c-ink) / .15)' }}>
                    <StatusOtvoreno className="ist-meni-info" />
                    <IzborJezika puno className="ist-jezik -ml-1.5" />
                </div>
            </nav>
        </div>
    );
};

export default function HeaderIst() {
    const { salon, t, p } = useSajt();
    const T = useTekst();
    const { pathname } = useLocation();
    const meni = useMeni();
    const zakazi = useZakaziLink();
    const poklon = usePoklonLink();
    const aktivna = kljucIzPutanje(pathname);

    return (
        <>
            <a href="#sadrzaj" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-paper focus:px-4 focus:py-2 focus:text-ink">
                {t.opste.preskoci}
            </a>
            <header className="ist-header fixed inset-x-0 top-0 z-50">
                <div className="flex h-full items-center pl-5 pr-4 xl:pl-8 xl:pr-5">
                    <LogoIst />

                    {/* Telefon i tablet: poziv, zakazivanje, hamburger (prvi u DOM-u među dugmadima sa aria-controls) */}
                    <div className="ml-auto flex items-center gap-2.5 xl:hidden">
                        {!meni.otvoren && (
                            <>
                                <a href={`tel:${salon.kontakt.telefon}`} className="ist-ikonica" aria-label={`${t.opste.pozovite} · ${salon.kontakt.telefonPrikaz}`}>
                                    <Phone size={24} strokeWidth={2.25} fill="currentColor" aria-hidden="true" />
                                </a>
                                {zakazi.to ? (
                                    <Link to={zakazi.to} className="ist-ikonica" aria-label={t.nav.zakazi}><CalendarPlus size={24} strokeWidth={2.25} aria-hidden="true" /></Link>
                                ) : (
                                    <a {...zakazi} className="ist-ikonica" aria-label={t.nav.zakazi}><CalendarPlus size={24} strokeWidth={2.25} aria-hidden="true" /></a>
                                )}
                            </>
                        )}
                        <DugmeMenija
                            meni={meni}
                            className="ist-ikonica"
                            ikonaOtvori={<Menu size={28} strokeWidth={2.75} aria-hidden="true" />}
                            ikonaZatvori={<X size={28} strokeWidth={3} aria-hidden="true" />}
                        />
                    </div>

                    {/* Desktop: nav uz desnu ivicu + dve pilule */}
                    <nav aria-label={t.nav.meni} className="ml-auto hidden h-full xl:block">
                        <ul className="m-0 flex h-full list-none items-center gap-6 p-0 min-[1440px]:gap-10">
                            {NAV.map((k) => (k === 'cenovnik'
                                ? <MegaMeni key={k} aktivna={aktivna === k} />
                                : (
                                    <li key={k} className="flex h-full items-center">
                                        <Link to={p(k)} aria-current={aktivna === k ? 'page' : undefined} className="ist-nav-link">{t.nav[k]}</Link>
                                    </li>
                                )))}
                        </ul>
                    </nav>
                    <div className="ml-6 hidden items-center gap-6 xl:flex min-[1440px]:ml-10 min-[1440px]:gap-10">
                        <Dugme {...zakazi} className="ist-dugme-header">{t.nav.zakazi}</Dugme>
                        {poklon && <Dugme {...poklon} className="ist-dugme-header">{T.poklon}</Dugme>}
                        <IzborJezika className="ist-jezik -ml-5 -mr-1 hidden min-[1440px]:block" />
                    </div>
                </div>
            </header>
            <MobilniMeniIst meni={meni} />
        </>
    );
}
