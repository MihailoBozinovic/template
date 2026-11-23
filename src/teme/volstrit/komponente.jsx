/*
 * Komponente teme „volstrit” (po uzoru na Fabio Doti Salon, NYC).
 * Specifikacija: docs/teme/volstrit.md · stilovi: ./tema.css
 *
 *   Header             — statičan (ne prati skrol), logo levo, nav u sredini sa
 *                        padajućom fasciklom usluga, ikonice mreža desno;
 *                        telefon: logo u sredini, tanak hamburger, meni preko
 *                        celog ekrana koji se pretapa (fascikla → podpanel)
 *   InfoTraka          — telefon, početna: fiksna traka na dnu (e-mail, poziv, radno vreme)
 *   Hero               — crno-bela fotografija ispod headera, kosa donja ivica
 *   pocetna            — pločice usluga u boji · izjava u dve kolone + brendovi
 *   Footer             — tamna minimalna traka sa podvučenim linkovima
 *   ZaglavljeStranice  — veliki verzalni naslov podstranica, bez nadnaslova
 *
 * Sajt je statičan: bez reveal-a, zuma i paralakse (pokret u tema.js).
 */
import '@fontsource/jost/500.css';
import './tema.css';
import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Clock, Mail, Smartphone } from 'lucide-react';
import { useSajt } from '../../kontekst/Sajt.jsx';
import { kljucIzPutanje } from '../../i18n/jezici.js';
import { javno } from '../../lib/baza.js';
import { zaboraviPristanak } from '../../lib/pristanak.js';
import { Foto, Kontejner, Naslov, cx, IkonaFacebook, IkonaInstagram, IkonaTikTok } from '../../components/primitivi.jsx';
import { DugmeMenija, useMeni, useSkrol, useZakaziLink } from '../../components/Header.jsx';
import { IzborJezika, LogoBrenda, KarticePlacanja } from '../../components/delovi.jsx';
import { brendoviSalona } from '../../lib/brendovi.js';
import { tekstTeme } from './tekstovi.js';

/* Redosled kao u referenci: fascikla usluga, pa ostale strane, zakazivanje kao običan link. */
const NAV = ['oNama', 'tim', 'galerija', 'kontakt'];
const MENI = ['oNama', 'tim', 'galerija', 'kontakt', 'pitanja'];

/* ── Sitni delovi ──────────────────────────────────────────────────────── */
const LogoVS = ({ className }) => {
    const { salon, p } = useSajt();
    return (
        <Link to={p('pocetna')} className={cx('vs-logo logo-tekst', className)} aria-label={salon.naziv}>
            {salon.logo ? <img src={javno(salon.logo)} alt="" className="vs-logo-slika" /> : <span aria-hidden="true">{salon.naziv}</span>}
        </Link>
    );
};

/** Link na zakazivanje (stranica ili spoljni sistem) kao običan link. */
const ZakaziLink = ({ className, children, ...o }) => {
    const z = useZakaziLink();
    return z.to
        ? <Link to={z.to} className={className} {...o}>{children}</Link>
        : <a href={z.href} target={z.target} rel={z.rel} className={className} {...o}>{children}</a>;
};

/** Ikonice mreža bez okvira (~20px, korak ~41px). */
const MrezeVS = ({ className, velicina = 20 }) => {
    const { salon, t } = useSajt();
    const k = salon.kontakt;
    const st = [
        k.instagram && { href: k.instagram, ime: t.opste.instagram, Ikona: IkonaInstagram },
        k.facebook && { href: k.facebook, ime: t.opste.facebook, Ikona: IkonaFacebook },
        k.tiktok && { href: k.tiktok, ime: t.opste.tiktok, Ikona: IkonaTikTok },
    ].filter(Boolean);
    if (!st.length) return null;
    return (
        <ul className={cx('vs-mreze', className)} aria-label={t.kontakt.mreze}>
            {st.map(({ href, ime, Ikona }) => (
                <li key={href}>
                    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={ime}><Ikona size={velicina} /></a>
                </li>
            ))}
        </ul>
    );
};

/* Tanke linije kao u referenci (hamburger 35px, X ~21px). */
const Hamburger = () => (
    <svg width="36" height="20" viewBox="0 0 36 20" fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden="true">
        <path d="M0 1h36M0 10h36M0 19h36" />
    </svg>
);
const Iks = () => (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.25" aria-hidden="true">
        <path d="M1 1l20 20M21 1L1 21" />
    </svg>
);

/* ── Mobilni meni: preko celog ekrana, pretapanje bez pomeranja ─────────── */
const MeniVS = ({ meni }) => {
    const { t, p, tx, salon, jezik } = useSajt();
    const [podmeni, setPodmeni] = useState(false);
    const nazadRef = useRef(null);
    const fasciklaRef = useRef(null);
    const prvi = useRef(true);
    const zatvori = () => meni.setOtvoren(false);

    useEffect(() => { if (!meni.otvoren) setPodmeni(false); }, [meni.otvoren]);
    // Fokus prati podpanel (napred → „Nazad”, nazad → fascikla).
    useEffect(() => {
        if (prvi.current) { prvi.current = false; return; }
        if (!meni.otvoren) return;
        (podmeni ? nazadRef : fasciklaRef).current?.focus();
    }, [podmeni]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div id="vs-meni" className={cx('vs-meni', meni.otvoren && 'otvoren')} aria-hidden={!meni.otvoren} inert={!meni.otvoren ? '' : undefined}>
            <nav aria-label={t.nav.meni} className="vs-meni-nav">
                {!podmeni ? (
                    <ul className="vs-meni-lista">
                        <li>
                            <button ref={fasciklaRef} type="button" className="vs-meni-link" aria-expanded="false" onClick={() => setPodmeni(true)}>
                                {t.nav.cenovnik}
                                <ChevronRight className="vs-meni-strelica" size={30} strokeWidth={0.9} aria-hidden="true" />
                            </button>
                        </li>
                        {MENI.map((k) => (
                            <li key={k}><Link to={p(k)} className="vs-meni-link" onClick={zatvori}>{t.nav[k]}</Link></li>
                        ))}
                        <li><ZakaziLink className="vs-meni-link" onClick={zatvori}>{t.nav.zakazi}</ZakaziLink></li>
                    </ul>
                ) : (
                    <ul className="vs-meni-lista vs-podmeni" aria-label={tekstTeme('kategorije', jezik)}>
                        <li>
                            <button ref={nazadRef} type="button" className="vs-meni-nazad" aria-expanded="true" onClick={() => setPodmeni(false)}>
                                <ChevronLeft size={20} strokeWidth={1} aria-hidden="true" />{t.opste.nazad}
                            </button>
                        </li>
                        <li><Link to={p('cenovnik')} className="vs-meni-link vs-meni-link--manji" onClick={zatvori}>{t.pocetna.cenovnikDugme}</Link></li>
                        {salon.kategorije.map((k) => (
                            <li key={k.id}>
                                <Link to={`${p('cenovnik')}#${k.id}`} className="vs-meni-link vs-meni-link--manji" onClick={zatvori}>{tx(k.naziv)}</Link>
                            </li>
                        ))}
                    </ul>
                )}
            </nav>
            <div className="vs-meni-dno">
                <IzborJezika puno className="vs-jezici" onIzbor={zatvori} />
                <MrezeVS velicina={22} />
            </div>
        </div>
    );
};

/* ── Info-traka na dnu (telefon) ───────────────────────────────────────── */
export const InfoTraka = ({ meniOtvoren = false }) => {
    const { salon, t, p, jezik } = useSajt();
    const { skrolovano } = useSkrol({ prag: 10 });
    const { pathname } = useLocation();
    /*
     * Samo na početnoj, gde je prvi ekran fotografija heroja: na podstranicama
     * bi traka na vrhu prekrivala donje redove teksta (a zakazivanje ima svoju
     * lepljivu traku na dnu). Kontakt i radno vreme su tamo u sadržaju.
     */
    if (kljucIzPutanje(pathname) !== 'pocetna') return null;
    const k = salon.kontakt;
    const st = [
        k.email && { href: `mailto:${k.email}`, ime: t.kontakt.email, Ikona: Mail },
        k.telefon && { href: `tel:${k.telefon}`, ime: t.opste.pozovite, Ikona: Smartphone },
        { to: p('kontakt'), ime: t.kontakt.radnoVreme, Ikona: Clock },
    ].filter(Boolean);
    const sakrivena = skrolovano && !meniOtvoren;
    return (
        <nav aria-label={tekstTeme('brziKontakt', jezik)} className={cx('vs-info', sakrivena && 'sakrivena')} inert={sakrivena ? '' : undefined}>
            <ul>
                {st.map(({ href, to, ime, Ikona }) => {
                    const sadrzaj = <><Ikona size={22} strokeWidth={1} aria-hidden="true" /><span>{ime}</span></>;
                    return <li key={ime}>{to ? <Link to={to}>{sadrzaj}</Link> : <a href={href}>{sadrzaj}</a>}</li>;
                })}
            </ul>
        </nav>
    );
};

/* ── Header ────────────────────────────────────────────────────────────── */
export function Header() {
    const { t, p, tx, salon, jezik } = useSajt();
    const meni = useMeni();
    const { pathname } = useLocation();
    const aktivna = kljucIzPutanje(pathname);
    const klasa = 'link-nav nadnaslov vs-nav-link';

    return (
        <>
            <a href="#sadrzaj" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-paper focus:px-4 focus:py-2 focus:text-ink">
                {t.opste.preskoci}
            </a>
            <header className={cx('vs-header', meni.otvoren && 'vs-header--meni')}>
                <div className="vs-header-red">
                    <LogoVS className="vs-header-logo" />
                    <nav aria-label={t.nav.meni} className="vs-nav">
                        <ul>
                            <li className="vs-fascikla">
                                <Link to={p('cenovnik')} className={klasa} aria-current={aktivna === 'cenovnik' ? 'page' : undefined}>{t.nav.cenovnik}</Link>
                                <ul className="vs-padajuci" aria-label={tekstTeme('kategorije', jezik)}>
                                    {salon.kategorije.map((k) => (
                                        <li key={k.id}><Link to={`${p('cenovnik')}#${k.id}`} className="vs-padajuci-link">{tx(k.naziv)}</Link></li>
                                    ))}
                                </ul>
                            </li>
                            {NAV.map((k) => (
                                <li key={k}><Link to={p(k)} className={klasa} aria-current={aktivna === k ? 'page' : undefined}>{t.nav[k]}</Link></li>
                            ))}
                            <li><ZakaziLink className={klasa} aria-current={aktivna === 'zakazivanje' ? 'page' : undefined}>{t.nav.zakazi}</ZakaziLink></li>
                        </ul>
                    </nav>
                    <div className="vs-header-desno">
                        <IzborJezika className="vs-jezici vs-samo-desktop" />
                        <MrezeVS className="vs-samo-desktop" />
                        <DugmeMenija meni={meni} kontrolise="vs-meni" className="vs-dugme-menija" ikonaOtvori={<Hamburger />} ikonaZatvori={<Iks />} />
                    </div>
                </div>
            </header>
            <MeniVS meni={meni} />
            <InfoTraka meniOtvoren={meni.otvoren} />
        </>
    );
}

/* ── Hero: crno-bela fotografija ispod headera, kosa donja ivica ───────── */
export function Hero() {
    const { salon, tx, tema } = useSajt();
    const h = salon.pocetna.hero;
    const o = tema.heroOpcije ?? {};
    return (
        <section
            className="vs-hero"
            style={{ '--kosa': o.kosaIvica, '--kosa-tel': o.kosaIvicaTelefon, '--linija-ivice': o.linijaIvice }}
        >
            <div className="vs-hero-foto">
                <Foto src={h.slike?.[0]} alt="" prioritet okvirKlasa="!absolute inset-0 !rounded-none" sizes="100vw" />
                <div className="vs-hero-veo" aria-hidden="true" />
                <div className="vs-hero-tekst na-foto">
                    <Naslov as="h1" nivo="hero" tekst={tx(h.naslov)} akcenat={tx(h.akcenat)} animiraj={false} />
                    <p className="tekst-uvod vs-hero-podnaslov">{tx(salon.slogan)}</p>
                </div>
            </div>
        </section>
    );
}

/* ── Pločice usluga u boji, bez zaglavlja i hovera ─────────────────────── */
export const UslugePlocice = () => {
    const { salon, t, tx, p, tema } = useSajt();
    const kat = salon.kategorije.slice(0, 8);
    if (!kat.length) return null;
    const pl = tema.plocice ?? {};
    return (
        <section className="vs-plocice-sekcija" aria-labelledby="vs-usluge-naslov" style={{ '--plocica-odnos': pl.odnos, '--plocica-odnos-tel': pl.odnosTelefon, '--plocica-razmak': pl.razmak }}>
            <h2 id="vs-usluge-naslov" className="sr-only">{t.pocetna.uslugeNadnaslov}</h2>
            <Kontejner>
                <ul className="vs-plocice" data-broj={kat.length}>
                    {kat.map((k) => (
                        <li key={k.id}>
                            <Link to={`${p('cenovnik')}#${k.id}`} className="vs-plocica">
                                <Foto src={k.slika} alt="" okvirKlasa="!absolute inset-0" sizes={`(min-width: 1024px) ${Math.round(100 / kat.length)}vw, (min-width: 768px) 50vw, 100vw`} />
                                <span className="vs-plocica-veo" aria-hidden="true" />
                                <span className="vs-plocica-natpis naslov naslov-2">{tx(k.naziv)}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </Kontejner>
        </section>
    );
};

/* ── Izjava u dve kolone; brendovi tipografski ispod leve kolone ───────── */
export const IzjavaDveKolone = () => {
    const { salon, t, tx } = useSajt();
    const pasusi = (salon.oNama?.tekst ?? []).slice(0, 2);
    const brendovi = brendoviSalona(salon);
    return (
        <section className="vs-izjava" aria-labelledby="vs-izjava-naslov">
            <Kontejner className="vs-dve-kolone">
                {/* Levo ogroman verzalni naslov, desno serifni „lead” u boji tela pa pasusi. */}
                <h2 id="vs-izjava-naslov" className="naslov naslov-1 vs-veliki m-0">{tx(salon.oNama?.naslov) || tx(salon.slogan)}</h2>
                <div className="vs-tekst">
                    {salon.pocetna.izjava && <p className="naslov naslov-2 vs-lead m-0">{tx(salon.pocetna.izjava)}</p>}
                    {pasusi.map((ps, i) => <p key={i} className="tekst-telo vs-pasus m-0">{tx(ps)}</p>)}
                </div>
                {brendovi.length > 0 && (
                    <ul className="vs-brendovi" aria-label={t.pocetna.brendoviNaslov}>
                        {brendovi.map((b) => <li key={b.naziv}><LogoBrenda brend={b} /></li>)}
                    </ul>
                )}
            </Kontejner>
        </section>
    );
};

/* ── Footer: tamna minimalna traka ─────────────────────────────────────── */
export function Footer() {
    const { salon, t, p } = useSajt();
    const f = salon.firma;
    const godina = new Date().getFullYear();
    const pravno = (fn) => fn({ naziv: '' }).replace(/ — $/, '');
    return (
        <footer className="vs-footer mt-auto">
            <nav aria-label={t.footer.navigacija}>
                <ul className="vs-footer-linkovi">
                    {['pocetna', 'cenovnik', 'tim', 'galerija', 'oNama', 'kontakt', 'pitanja'].map((k) => (
                        <li key={k}><Link to={p(k)}>{t.nav[k]}</Link></li>
                    ))}
                </ul>
            </nav>
            <p className="vs-footer-prava">© {godina} {salon.naziv}. {t.footer.prava}</p>
            <div className="vs-footer-pravno">
                <KarticePlacanja className="placanje-footer" />
                <p>
                    {f.naziv} · {f.adresa} · {t.footer.pib} {f.pib} · {t.footer.mb} {f.maticniBroj}
                    {f.sifraDelatnosti && <> · {t.footer.delatnost} {f.sifraDelatnosti}</>}
                    {!f.pdvObveznik && <> · {t.footer.nijePdv}</>}
                </p>
                <ul aria-label={t.footer.pravno}>
                    <li><Link to={p('privatnost')}>{pravno(t.seo.privatnost)}</Link></li>
                    <li><Link to={p('uslovi')}>{pravno(t.seo.uslovi)}</Link></li>
                    <li><Link to={p('kolacici')}>{pravno(t.seo.kolacici)}</Link></li>
                    <li><button type="button" onClick={zaboraviPristanak}>{t.footer.podesavanjaKolacica}</button></li>
                </ul>
            </div>
        </footer>
    );
}

/* ── Naslov podstranica ────────────────────────────────────────────────── */
export function ZaglavljeStranice({ naslov, akcenat, uvod, slika, children, className }) {
    return (
        <header className={cx('vs-zaglavlje', className)}>
            <Kontejner className={cx('vs-zaglavlje-red', slika && 'sa-slikom')}>
                <div className="vs-zaglavlje-tekst">
                    <Naslov as="h1" nivo={1} tekst={naslov} akcenat={akcenat} animiraj={false} />
                    {uvod && <p className="tekst-uvod vs-zaglavlje-uvod m-0">{uvod}</p>}
                    {children}
                </div>
                {slika && <Foto src={slika} alt="" okvirKlasa="aspect-[4/3]" prioritet />}
            </Kontejner>
        </header>
    );
}

export default {
    Header,
    Footer,
    Hero,
    pocetna: [UslugePlocice, IzjavaDveKolone],
    ZaglavljeStranice,
};
