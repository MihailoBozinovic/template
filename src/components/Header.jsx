import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useSajt } from '../kontekst/Sajt.jsx';
import { kljucIzPutanje } from '../i18n/jezici.js';
import { javno } from '../lib/baza.js';
import { Dugme, cx } from './primitivi.jsx';
import { IzborJezika, KontaktDugmad, Mreze, StatusOtvoreno } from './delovi.jsx';

const STAVKE = ['cenovnik', 'tim', 'galerija', 'oNama', 'kontakt'];
export const HEROJ_ISPOD_HEADERA = ['puna-levo', 'puna-centar'];

/** Link „Zakaži”: na stranicu zakazivanja, ili na spoljni sistem kad je nacin 'link'. */
export const useZakaziLink = () => {
    const { salon, p } = useSajt();
    const z = salon.zakazivanje;
    return z.nacin === 'link' && z.link ? { href: z.link, target: '_blank', rel: 'noopener noreferrer' } : { to: p('zakazivanje') };
};

export const Logo = ({ veliki = false, className }) => {
    const { salon, p, tema } = useSajt();
    const verzal = ['zaliv', 'noar', 'volstrit', 'palma', 'hjuston'].includes(tema.id);
    return (
        <Link to={p('pocetna')} className={cx('logo-tekst inline-flex items-center leading-none no-underline', className)} aria-label={salon.naziv}>
            {salon.logo ? (
                <img src={javno(salon.logo)} alt={salon.naziv} className={cx('w-auto', veliki ? 'h-14 md:h-20' : 'h-8 md:h-9')} />
            ) : (
                <span
                    className={cx(
                        'whitespace-nowrap transition-all duration-500',
                        verzal && 'uppercase',
                        tema.id === 'zaliv' ? (veliki ? 'text-5xl font-medium tracking-tight md:text-7xl' : 'text-3xl font-medium tracking-tight') : 'text-[1.55rem] md:text-[1.7rem]',
                        tema.id === 'hjuston' && 'text-base font-bold tracking-[0.12em] md:text-lg',
                        tema.id === 'palma' && 'text-base font-semibold tracking-[0.04em] md:text-xl',
                        tema.id === 'holivud' && 'tracking-[0.18em]',
                        tema.id === 'noar' && 'tracking-[0.08em]',
                        tema.id === 'volstrit' && 'tracking-[0.06em]',
                    )}
                >
                    {salon.naziv}
                </span>
            )}
        </Link>
    );
};

const NavLinkovi = ({ className, onKlik }) => {
    const { t, p } = useSajt();
    const { pathname } = useLocation();
    const aktivna = kljucIzPutanje(pathname);
    return (
        <ul className={cx('grupa-linkova m-0 flex list-none items-center p-0', className)}>
            {STAVKE.map((k) => (
                <li key={k}>
                    <Link to={p(k)} onClick={onKlik} aria-current={aktivna === k ? 'page' : undefined} className="link-nav nadnaslov inline-flex min-h-[2.5rem] items-center whitespace-nowrap">
                        {t.nav[k]}
                    </Link>
                </li>
            ))}
        </ul>
    );
};

export default function Header() {
    const { t, tema, p } = useSajt();
    const { pathname } = useLocation();
    const [skrolovano, setSkrolovano] = useState(false);
    const [otvoren, setOtvoren] = useState(false);
    const dugmeRef = useRef(null);
    const zakazi = useZakaziLink();
    const kljuc = kljucIzPutanje(pathname);

    useEffect(() => {
        const naSkrol = () => setSkrolovano(window.scrollY > 30);
        naSkrol();
        window.addEventListener('scroll', naSkrol, { passive: true });
        return () => window.removeEventListener('scroll', naSkrol);
    }, []);

    useEffect(() => { setOtvoren(false); }, [pathname]);

    useEffect(() => {
        document.documentElement.classList.toggle('bez-skrola', otvoren);
        if (!otvoren) return undefined;
        const esc = (e) => { if (e.key === 'Escape') { setOtvoren(false); dugmeRef.current?.focus(); } };
        window.addEventListener('keydown', esc);
        return () => window.removeEventListener('keydown', esc);
    }, [otvoren]);

    const prekoHeroja = kljuc === 'pocetna' && HEROJ_ISPOD_HEADERA.includes(tema.hero);
    const providan = tema.header.tip === 'providan' && prekoHeroja && !skrolovano && !otvoren;
    const stil = providan ? 'header-providan' : tema.header.posleSkrola === 'brand' ? 'header-brand' : 'header-pun';
    const fotoDugme = providan || stil === 'header-brand';
    const raspored = tema.header.logo;
    const velikiLogo = raspored === 'levo-veliki' && kljuc === 'pocetna' && !skrolovano;

    return (
        <>
            <a href="#sadrzaj" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-paper focus:px-4 focus:py-2 focus:text-ink">
                {t.opste.preskoci}
            </a>
            <header className={cx('header fixed inset-x-0 top-0 z-50', stil)}>
                <div className={cx('mx-auto flex max-w-[110rem] items-center gap-6 px-5 md:px-10', velikiLogo ? 'h-[112px] md:h-[136px]' : 'h-[76px]')}>
                    {raspored === 'centar' ? (
                        <>
                            <nav aria-label={t.nav.meni} className="hidden flex-1 xl:block"><NavLinkovi className="gap-6" /></nav>
                            <div className="flex flex-1 xl:flex-none xl:justify-center"><Logo /></div>
                        </>
                    ) : (
                        <>
                            <Logo veliki={velikiLogo} />
                            <nav aria-label={t.nav.meni} className="hidden flex-1 justify-center lg:flex">
                                <NavLinkovi className={tema.header.posleSkrola === 'brand' || tema.pokret.linkHover === 'pozadina' ? 'gap-0 xl:gap-1' : 'gap-5 xl:gap-7'} />
                            </nav>
                        </>
                    )}
                    <div className={cx('flex items-center justify-end gap-3', raspored === 'centar' ? 'flex-1' : 'ml-auto lg:ml-0')}>
                        <IzborJezika className="hidden md:block" />
                        <Dugme {...zakazi} varijanta={fotoDugme ? 'foto' : 'primarno'} className="hidden !min-h-[2.6rem] !py-2.5 sm:inline-flex">
                            {t.nav.zakazi}
                        </Dugme>
                        <button
                            ref={dugmeRef}
                            type="button"
                            className={cx('inline-flex h-11 w-11 items-center justify-center', raspored === 'centar' ? 'xl:hidden' : 'lg:hidden')}
                            aria-expanded={otvoren}
                            aria-controls="mobilni-meni"
                            aria-label={otvoren ? t.nav.zatvori : t.nav.meni}
                            onClick={() => setOtvoren((o) => !o)}
                        >
                            {otvoren ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
                        </button>
                    </div>
                </div>
            </header>

            {/* Mobilni meni preko celog ekrana; stavke ulaze kaskadno. */}
            <div
                id="mobilni-meni"
                className={cx('fixed inset-0 z-40 flex flex-col bg-paper text-ink transition-opacity', raspored === 'centar' ? 'xl:hidden' : 'lg:hidden', otvoren ? 'meni-otvoren opacity-100' : 'pointer-events-none opacity-0')}
                style={{ transitionDuration: 'var(--t-srednje)' }}
                aria-hidden={!otvoren}
                inert={!otvoren ? '' : undefined}
            >
                <div className="flex flex-1 flex-col overflow-y-auto px-6 pb-10 pt-28">
                    <nav aria-label={t.nav.meni}>
                        <ul className="m-0 list-none space-y-1 p-0">
                            {['pocetna', ...STAVKE, 'pitanja'].map((k, i) => (
                                <li key={k} className="meni-stavka" style={{ '--i': i }}>
                                    <Link to={p(k)} className="naslov naslov-2 block py-1.5">{t.nav[k]}</Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                    <div className="meni-stavka mt-10 space-y-6" style={{ '--i': 8 }}>
                        <Dugme {...zakazi} className="w-full">{t.nav.zakazi}</Dugme>
                        <StatusOtvoreno className="nadnaslov" />
                        <KontaktDugmad />
                        <div className="flex items-center justify-between">
                            <IzborJezika puno />
                            <Mreze />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
