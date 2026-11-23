import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useSajt } from '../kontekst/Sajt.jsx';
import { kljucIzPutanje } from '../i18n/jezici.js';
import { javno } from '../lib/baza.js';
import { Dugme, cx } from './primitivi.jsx';
import { IzborJezika, KontaktDugmad, Mreze, StatusOtvoreno } from './delovi.jsx';

export const STAVKE = ['cenovnik', 'tim', 'galerija', 'oNama', 'kontakt'];
export const STAVKE_MENIJA = ['pocetna', ...STAVKE, 'pitanja'];
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

export const NavLinkovi = ({ className, onKlik, stavke = STAVKE, klasaLinka = 'link-nav nadnaslov inline-flex min-h-[2.5rem] items-center whitespace-nowrap' }) => {
    const { t, p } = useSajt();
    const { pathname } = useLocation();
    const aktivna = kljucIzPutanje(pathname);
    return (
        <ul className={cx('grupa-linkova m-0 flex list-none items-center p-0', className)}>
            {stavke.map((k) => (
                <li key={k}>
                    <Link to={p(k)} onClick={onKlik} aria-current={aktivna === k ? 'page' : undefined} className={klasaLinka}>
                        {t.nav[k]}
                    </Link>
                </li>
            ))}
        </ul>
    );
};

/**
 * Stanje skrola za header: `skrolovano` (posle praga), `smer` ('gore'|'dole')
 * i `sakrij` — true kad se skroluje nadole posle `pragSakrivanja` (za headere
 * koji se sklanjaju pri skrolu nadole i vraćaju pri skrolu nagore).
 */
export const useSkrol = ({ prag = 30, pragSakrivanja = 400 } = {}) => {
    const [stanje, setStanje] = useState({ skrolovano: false, smer: 'gore', sakrij: false, y: 0 });
    useEffect(() => {
        let pre = window.scrollY;
        let ceka = false;
        const izracunaj = () => {
            ceka = false;
            const y = window.scrollY;
            const smer = y > pre + 2 ? 'dole' : y < pre - 2 ? 'gore' : null;
            pre = y;
            setStanje((s) => {
                const nSmer = smer ?? s.smer;
                const n = { skrolovano: y > prag, smer: nSmer, sakrij: nSmer === 'dole' && y > pragSakrivanja, y };
                return n.skrolovano === s.skrolovano && n.smer === s.smer && n.sakrij === s.sakrij ? s : n;
            });
        };
        const naSkrol = () => { if (!ceka) { ceka = true; requestAnimationFrame(izracunaj); } };
        izracunaj();
        window.addEventListener('scroll', naSkrol, { passive: true });
        return () => window.removeEventListener('scroll', naSkrol);
    }, [prag, pragSakrivanja]);
    return stanje;
};

/** Otvaranje menija: zatvara se pri promeni stranice i na Esc, zaključava skrol stranice. */
export const useMeni = () => {
    const { pathname } = useLocation();
    const [otvoren, setOtvoren] = useState(false);
    const dugmeRef = useRef(null);
    useEffect(() => { setOtvoren(false); }, [pathname]);
    useEffect(() => {
        document.documentElement.classList.toggle('bez-skrola', otvoren);
        // Glatki skrol (Lenis) ne sme da pomera stranicu ispod otvorenog menija.
        if (otvoren) window.__lenis?.stop(); else window.__lenis?.start();
        if (!otvoren) return undefined;
        const esc = (e) => { if (e.key === 'Escape') { setOtvoren(false); dugmeRef.current?.focus(); } };
        window.addEventListener('keydown', esc);
        return () => { window.removeEventListener('keydown', esc); document.documentElement.classList.remove('bez-skrola'); };
    }, [otvoren]);
    return { otvoren, setOtvoren, prebaci: () => setOtvoren((o) => !o), dugmeRef };
};

/** Dugme menija (hamburger / X) — vezano za useMeni(). */
export const DugmeMenija = ({ meni, className, ikonaOtvori, ikonaZatvori, kontrolise = 'mobilni-meni' }) => {
    const { t } = useSajt();
    return (
        <button
            ref={meni.dugmeRef}
            type="button"
            className={cx('inline-flex h-11 w-11 items-center justify-center', className)}
            aria-expanded={meni.otvoren}
            aria-controls={kontrolise}
            aria-label={meni.otvoren ? t.nav.zatvori : t.nav.meni}
            onClick={meni.prebaci}
        >
            {meni.otvoren ? (ikonaZatvori ?? <X size={24} strokeWidth={1.5} />) : (ikonaOtvori ?? <Menu size={24} strokeWidth={1.5} />)}
        </button>
    );
};

/**
 * Podrazumevani mobilni meni preko celog ekrana; stavke ulaze kaskadno.
 * `className` menja izgled panela, `klasaLinka` izgled stavki.
 */
export const MobilniMeni = ({ meni, className, klasaLinka = 'naslov naslov-2 block py-1.5', dodatak = true, id = 'mobilni-meni' }) => {
    const { t, p } = useSajt();
    const zakazi = useZakaziLink();
    return (
        <div
            id={id}
            className={cx('fixed inset-0 z-40 flex flex-col bg-paper text-ink transition-opacity', meni.otvoren ? 'meni-otvoren opacity-100' : 'pointer-events-none opacity-0', className)}
            style={{ transitionDuration: 'var(--t-srednje)' }}
            aria-hidden={!meni.otvoren}
            inert={!meni.otvoren ? '' : undefined}
        >
            <div className="flex flex-1 flex-col overflow-y-auto px-6 pb-10 pt-28">
                <nav aria-label={t.nav.meni}>
                    <ul className="m-0 list-none space-y-1 p-0">
                        {STAVKE_MENIJA.map((k, i) => (
                            <li key={k} className="meni-stavka" style={{ '--i': i }}>
                                <Link to={p(k)} className={klasaLinka}>{t.nav[k]}</Link>
                            </li>
                        ))}
                    </ul>
                </nav>
                {dodatak && (
                    <div className="meni-stavka mt-10 space-y-6" style={{ '--i': 8 }}>
                        <Dugme {...zakazi} className="w-full">{t.nav.zakazi}</Dugme>
                        <StatusOtvoreno className="nadnaslov" />
                        <KontaktDugmad />
                        <div className="flex items-center justify-between">
                            <IzborJezika puno />
                            <Mreze />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default function Header() {
    const { t, tema, p } = useSajt();
    const { pathname } = useLocation();
    const { skrolovano } = useSkrol();
    const meni = useMeni();
    const { otvoren } = meni;
    const zakazi = useZakaziLink();
    const kljuc = kljucIzPutanje(pathname);

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
                        <DugmeMenija meni={meni} className={raspored === 'centar' ? 'xl:hidden' : 'lg:hidden'} />
                    </div>
                </div>
            </header>

            <MobilniMeni meni={meni} className={raspored === 'centar' ? 'xl:hidden' : 'lg:hidden'} />
        </>
    );
}
