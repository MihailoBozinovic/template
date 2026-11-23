/*
 * Header teme „holivud” (po uzoru na Nine Zero One):
 *   crna najava (45 / 37 px) → header 124 / 56 px.
 *   Desktop: nav u ručno crtanom fontu levo (prelama se u dva reda), logo u
 *   centru, desno @instagram, jezici i tri ikonice od 24 px.
 *   Telefon: hamburger levo, logo u centru, ikonica „Zakaži” desno.
 *   Na početnoj je providan preko heroja (linija ispod je bela .35), posle
 *   skrola je pun papir sa tankom linijom #111 uvučenom na gutter — bez senke,
 *   bez blura, ne sakriva se. Najava odlazi sa skrolom, header se lepi na vrh.
 */
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CalendarDays, MapPin, Menu, Phone, X } from 'lucide-react';
import { useSajt } from '../../kontekst/Sajt.jsx';
import { SVI_JEZICI, kljucIzPutanje, putanja } from '../../i18n/jezici.js';
import { aktivniJezici } from '../../lib/seo.js';
import { javno } from '../../lib/baza.js';
import { cx } from '../../components/primitivi.jsx';
import { STAVKE, DugmeMenija, MobilniMeni, useMeni, useSkrol, useZakaziLink } from '../../components/Header.jsx';
import { useTekstovi } from './tekstovi.js';

/** Link na zakazivanje (stranica ili spoljni sistem) sa proizvoljnim izgledom. */
export const VezaZakazi = ({ className, children, ...o }) => {
    const z = useZakaziLink();
    return z.to
        ? <Link to={z.to} className={className} {...o}>{children}</Link>
        : <a href={z.href} target={z.target} rel={z.rel} className={className} {...o}>{children}</a>;
};

/** „@ateljemakaze” iz adrese Instagram profila. */
export const instagramIme = (url) => {
    const m = String(url || '').match(/instagram\.com\/([^/?#]+)/i);
    return m ? `@${m[1]}` : '';
};

export const HvLogo = ({ className }) => {
    const { salon, p } = useSajt();
    return (
        <Link to={p('pocetna')} className={cx('hv-logo logo-tekst inline-flex items-center no-underline', className)} aria-label={salon.naziv}>
            {salon.logo
                ? <img src={javno(salon.logo)} alt={salon.naziv} className="h-6 w-auto md:h-8" />
                : <span className="whitespace-nowrap">{salon.naziv}</span>}
        </Link>
    );
};

/** SR · EN · RU u fontu naslova (bez prigušenih stavki — kontrast). */
export const HvJezici = ({ className, klasaLinka = 'hv-nav-link' }) => {
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
                        <Link
                            to={putanja(kljuc, j)}
                            hrefLang={j}
                            lang={j}
                            aria-current={j === jezik ? 'true' : undefined}
                            aria-label={SVI_JEZICI[j].naziv}
                            className={klasaLinka}
                        >
                            {SVI_JEZICI[j].kratko}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

/** Crna traka iznad headera — poziv na online zakazivanje, odlazi sa skrolom. */
export const Najava = () => {
    const tk = useTekstovi();
    return (
        <div className="hv-najava">
            <p className="m-0 truncate">
                <span className="hidden sm:inline">{tk.najava}</span>
                <span className="sm:hidden">{tk.najavaKratko}</span>
                <span aria-hidden="true"> | </span>
                <VezaZakazi className="hv-najava-link">{tk.najavaLink}</VezaZakazi>
            </p>
        </div>
    );
};

const Ikona = ({ Komponenta }) => <Komponenta size={24} strokeWidth={1.25} aria-hidden="true" />;

export default function Header() {
    const { salon, t, p } = useSajt();
    const tk = useTekstovi();
    const { pathname } = useLocation();
    const kljuc = kljucIzPutanje(pathname);
    const { skrolovano } = useSkrol({ prag: 12 });
    const meni = useMeni();
    const pocetna = kljuc === 'pocetna';
    const providan = pocetna && !skrolovano && !meni.otvoren;
    const insta = instagramIme(salon.kontakt.instagram);

    return (
        <>
            <a href="#sadrzaj" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-paper focus:px-4 focus:py-2 focus:text-ink">
                {t.opste.preskoci}
            </a>
            <Najava />
            <header className={cx('hv-header sticky top-0 z-50', providan ? 'hv-providan' : 'hv-pun', pocetna && 'hv-preko')}>
                <div className="hv-header-red mx-auto flex max-w-[1440px] items-center">
                    {/* Levo: hamburger (telefon, tablet) ili nav (desktop) */}
                    <div className="flex flex-1 items-center min-[1200px]:hidden">
                        <DugmeMenija
                            meni={meni}
                            className="-ml-2.5"
                            ikonaOtvori={<Menu size={26} strokeWidth={1} />}
                            ikonaZatvori={<X size={26} strokeWidth={1} />}
                        />
                    </div>
                    <nav aria-label={t.nav.meni} className="hidden flex-1 min-[1200px]:block">
                        <ul className="hv-nav m-0 list-none p-0">
                            <li><VezaZakazi className="hv-nav-link">{t.nav.zakazi}</VezaZakazi></li>
                            {STAVKE.map((k) => (
                                <li key={k}>
                                    <Link to={p(k)} aria-current={kljuc === k ? 'page' : undefined} className="hv-nav-link">{t.nav[k]}</Link>
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <HvLogo className="shrink-0" />

                    {/* Desno: @instagram, jezici, ikonice (desktop) · ikonica Zakaži (telefon) */}
                    <div className="flex flex-1 items-center justify-end">
                        <div className="hidden items-center min-[1200px]:flex">
                            {insta && (
                                <a href={salon.kontakt.instagram} target="_blank" rel="noopener noreferrer" className="hv-nav-link mr-7" aria-label={`${t.opste.instagram} ${insta}`}>
                                    {insta}
                                </a>
                            )}
                            <HvJezici className="mr-5" />
                            <ul className="m-0 flex list-none items-center gap-2 p-0">
                                <li>
                                    <a href={`tel:${salon.kontakt.telefon}`} className="hv-ikona" aria-label={`${tk.pozovite} · ${salon.kontakt.telefonPrikaz}`}><Ikona Komponenta={Phone} /></a>
                                </li>
                                <li>
                                    <Link to={p('kontakt')} className="hv-ikona" aria-label={tk.lokacija}><Ikona Komponenta={MapPin} /></Link>
                                </li>
                                <li>
                                    <VezaZakazi className="hv-ikona -mr-2" aria-label={tk.zakaziIkona}><Ikona Komponenta={CalendarDays} /></VezaZakazi>
                                </li>
                            </ul>
                        </div>
                        <span className="min-[1200px]:hidden">
                            <VezaZakazi className="hv-ikona -mr-2" aria-label={tk.zakaziIkona}><Ikona Komponenta={CalendarDays} /></VezaZakazi>
                        </span>
                    </div>
                </div>
            </header>

            <MobilniMeni meni={meni} className="hv-meni min-[1200px]:hidden" klasaLinka="hv-meni-link block py-1" />
        </>
    );
}
