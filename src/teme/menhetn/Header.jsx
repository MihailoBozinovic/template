/*
 * Header teme „menhetn”: uvek maslinast i lepljiv (ne providi se, ne krije se),
 * 80 / 70 px, vertikalne pregrade od 1 px. Desktop: logo | nav (centar) | belo
 * pill dugme. Telefon: logo | pill dugme | hamburger, a meni je maslinast
 * panel koji se spušta ispod headera.
 */
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CalendarDays } from 'lucide-react';
import { useSajt } from '../../kontekst/Sajt.jsx';
import { kljucIzPutanje } from '../../i18n/jezici.js';
import { javno } from '../../lib/baza.js';
import { cx } from '../../components/primitivi.jsx';
import { DugmeMenija, NavLinkovi, STAVKE_MENIJA, useMeni, useZakaziLink } from '../../components/Header.jsx';

/** Link ili spoljni link — po onome što vrati useZakaziLink(). */
export const Veza = ({ to, href, children, ...o }) => (to ? <Link to={to} {...o}>{children}</Link> : <a href={href} {...o}>{children}</a>);

/** Tekstualni logo u dva reda (naziv + grad), kao znak sa slikom; ili slika iz salon.js. */
export const LogoMenhetn = ({ veliki = false, className }) => {
    const { salon, p, tx } = useSajt();
    return (
        <Link to={p('pocetna')} className={cx('mh-logo no-underline', veliki && 'mh-logo-veliki', className)} aria-label={salon.naziv}>
            {salon.logo ? (
                <img src={javno(salon.logo)} alt={salon.naziv} className={veliki ? 'h-[63px] w-auto' : 'h-[34px] w-auto md:h-[51px]'} />
            ) : (
                <>
                    <span className="mh-logo-ime logo-tekst">{salon.naziv}</span>
                    <span className="mh-logo-grad" aria-hidden="true">{tx(salon.lokacija?.grad)}</span>
                </>
            )}
        </Link>
    );
};

/** Belo pill dugme u headeru: tekst | crtica | ikonica. */
const PillZakazi = ({ className }) => {
    const { t } = useSajt();
    const zakazi = useZakaziLink();
    return (
        <Veza {...zakazi} className={cx('mh-pill', className)}>
            <span>{t.nav.zakazi}</span>
            <span className="mh-pill-crta" aria-hidden="true" />
            <CalendarDays size={16} strokeWidth={1.6} aria-hidden="true" />
        </Veza>
    );
};

const IkonaMeni = () => (
    <svg width="28" height="20" viewBox="0 0 28 20" fill="currentColor" aria-hidden="true">
        <rect y="0" width="28" height="3.6" rx="1.8" /><rect y="8.2" width="28" height="3.6" rx="1.8" /><rect y="16.4" width="28" height="3.6" rx="1.8" />
    </svg>
);
const IkonaZatvori = () => (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" aria-hidden="true">
        <path d="M2.5 2.5l17 17M19.5 2.5l-17 17" />
    </svg>
);

/** Padajući maslinasti panel ispod headera; stavke centrirane, aktivna sa svetlom pozadinom. */
const MeniMenhetn = ({ meni }) => {
    const { t, p } = useSajt();
    const aktivna = kljucIzPutanje(useLocation().pathname);
    return (
        <div
            id="mobilni-meni"
            className={cx('mh-meni fixed inset-x-0 z-40 bg-brand text-white lg:hidden', meni.otvoren && 'otvoren')}
            aria-hidden={!meni.otvoren}
            inert={!meni.otvoren ? '' : undefined}
        >
            <nav aria-label={t.nav.meni}>
                <ul className="m-0 list-none px-0 pb-10 pt-12">
                    {STAVKE_MENIJA.map((k) => (
                        <li key={k}>
                            <Link to={p(k)} aria-current={aktivna === k ? 'page' : undefined} className="mh-meni-link" onClick={() => meni.setOtvoren(false)}>
                                {t.nav[k]}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    );
};

export default function HeaderMenhetn() {
    const { t } = useSajt();
    const meni = useMeni();
    return (
        <>
            <a href="#sadrzaj" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-paper focus:px-4 focus:py-2 focus:text-ink">
                {t.opste.preskoci}
            </a>
            <header className="mh-header fixed inset-x-0 top-0 z-50 bg-brand text-white">
                <div className="kontejner flex h-[var(--header-h)] items-stretch">
                    <div className="order-0 flex shrink-0 items-center pr-[14px] lg:pl-[18px] lg:pr-10">
                        <LogoMenhetn />
                    </div>
                    <span className="mh-pregrada order-1" aria-hidden="true" />
                    <nav aria-label={t.nav.meni} className="hidden min-w-0 flex-1 items-center justify-center lg:order-2 lg:flex">
                        <NavLinkovi stavke={STAVKE_MENIJA} className="gap-5" klasaLinka="link-nav mh-nav-link" />
                    </nav>
                    <div className="order-2 flex min-w-0 flex-1 items-center justify-center lg:order-4 lg:flex-none lg:pl-7">
                        <PillZakazi />
                    </div>
                    <span className="mh-pregrada order-3" aria-hidden="true" />
                    <div className="order-4 flex w-[70px] shrink-0 items-center justify-end lg:hidden">
                        <DugmeMenija meni={meni} className="mh-dugme-menija !h-full !w-[56px]" ikonaOtvori={<IkonaMeni />} ikonaZatvori={<IkonaZatvori />} />
                    </div>
                </div>
            </header>
            <MeniMenhetn meni={meni} />
        </>
    );
}
