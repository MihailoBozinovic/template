/*
 * Komponente teme „hjuston” (po uzoru na The Upper Hand). Zamenjuju
 * podrazumevane samo dok je ova tema aktivna (src/teme/registar.js).
 *
 *   Header             logo + „tri tačke” → beli meni preko celog ekrana (svi ekrani);
 *                      desktop: fiksiran, providan na vrhu početne, beo sa linijom #EEE posle skrola;
 *                      telefon: u toku stranice, logo centriran, ikonica ostaje fiksirana u belom kvadratu.
 *   Hero               jedna fotografija, centrirano: h1 → zvezdice (iz salon.recenzije) → podnaslov → dugme → mreže.
 *   pocetna            misija (belo) → foto-traka → usluge (sive pločice) → lokacija (foto)
 *                      → recenzije (slajder) → poziv (foto).
 *   Footer             beo, centriran: red linkova, potpis, pravni podaci.
 *   ZaglavljeStranice  centriran naslov podstranice.
 *
 * Specifikacija: docs/teme/hjuston.md. Stilovi: ./tema.css. Tekstovi: ./tekstovi.js.
 */
import '@fontsource/cormorant-garamond/700.css';
import '@fontsource/cormorant-garamond/700-italic.css';
import './tema.css';

import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, Star, X } from 'lucide-react';
import { useSajt } from '../../kontekst/Sajt.jsx';
import { kljucIzPutanje } from '../../i18n/jezici.js';
import { cena } from '../../lib/format.js';
import { javno } from '../../lib/baza.js';
import { zaboraviPristanak } from '../../lib/pristanak.js';
import { Dugme, Foto, IkonaFacebook, IkonaInstagram, IkonaTikTok, IkonaViber, IkonaWhatsApp, Naslov, Pojava, cx } from '../../components/primitivi.jsx';
import { STAVKE_MENIJA, useMeni, useSkrol, useZakaziLink } from '../../components/Header.jsx';
import { IzborJezika, KarticePlacanja, LogotipiBrendova } from '../../components/delovi.jsx';
import { brendoviSalona } from '../../lib/brendovi.js';
import { tekstovi } from './tekstovi.js';

const useTekstovi = () => tekstovi(useSajt().jezik);

/* ── Sitni delovi ──────────────────────────────────────────────────────── */

const Logo = ({ className }) => {
    const { salon, p } = useSajt();
    return (
        <Link to={p('pocetna')} className={cx('hj-logo logo-tekst', className)} aria-label={salon.naziv}>
            {salon.logo ? <img src={javno(salon.logo)} alt={salon.naziv} className="h-8 w-auto md:h-9" /> : <span>{salon.naziv}</span>}
        </Link>
    );
};

/** Tri pune tačke (ikonica menija reference). */
const TriTacke = () => (
    <svg width="26" height="6" viewBox="0 0 26 6" fill="currentColor" aria-hidden="true">
        <circle cx="3" cy="3" r="2.75" /><circle cx="13" cy="3" r="2.75" /><circle cx="23" cy="3" r="2.75" />
    </svg>
);

/** Red kvadrata društvenih mreža i poruka (36×36, #F5F5F5, radius 3px). */
const MrezeKvadrati = ({ className }) => {
    const { salon, t } = useSajt();
    const k = salon.kontakt;
    const stavke = [
        k.facebook && { href: k.facebook, ime: t.opste.facebook, Ikona: IkonaFacebook, spolja: true },
        k.instagram && { href: k.instagram, ime: t.opste.instagram, Ikona: IkonaInstagram, spolja: true },
        k.tiktok && { href: k.tiktok, ime: t.opste.tiktok, Ikona: IkonaTikTok, spolja: true },
        k.whatsapp && { href: `https://wa.me/${k.whatsapp}`, ime: t.opste.whatsapp, Ikona: IkonaWhatsApp, spolja: true },
        k.viber && { href: `viber://chat?number=%2B${k.viber}`, ime: t.opste.viber, Ikona: IkonaViber },
    ].filter(Boolean);
    if (!stavke.length) return null;
    return (
        <ul className={cx('hj-mreze', className)}>
            {stavke.map(({ href, ime, Ikona, spolja }) => (
                <li key={href}>
                    <a href={href} aria-label={ime} className="hj-mreza" {...(spolja ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                        <Ikona size={18} />
                    </a>
                </li>
            ))}
        </ul>
    );
};

/** Pet zvezdica — samo iz stvarne ocene salona (salon.recenzije.prosek), nikad izmišljena nagrada. */
const ZvezdiceOcene = ({ className, velicina = 22 }) => {
    const { salon, jezik } = useSajt();
    const tt = useTekstovi();
    const r = salon.recenzije;
    if (!r?.prosek || !r?.lista?.length) return null;
    const pune = Math.round(r.prosek);
    const ocena = jezik === 'en' ? String(r.prosek) : String(r.prosek).replace('.', ',');
    return (
        <span className={cx('hj-zvezdice', className)} role="img" aria-label={tt.ocenaZvezdice(ocena, r.broj, r.izvor)}>
            {Array.from({ length: 5 }, (_, i) => (
                <Star key={i} size={velicina} fill={i < pune ? 'currentColor' : 'none'} strokeWidth={i < pune ? 0 : 1.25} aria-hidden="true" />
            ))}
        </span>
    );
};

/* ── Header + meni preko celog ekrana ──────────────────────────────────── */

const Meni = ({ meni }) => {
    const { t, p } = useSajt();
    const { pathname } = useLocation();
    const aktivna = kljucIzPutanje(pathname);
    const zakazi = useZakaziLink();
    const prviLink = useRef(null);
    const zatvori = () => meni.setOtvoren(false);

    useEffect(() => {
        if (!meni.otvoren) return undefined;
        const id = setTimeout(() => prviLink.current?.focus({ preventScroll: true }), 60);
        return () => clearTimeout(id);
    }, [meni.otvoren]);

    const stavke = STAVKE_MENIJA.flatMap((k) => (k === 'cenovnik' ? [k, 'zakazivanje'] : [k]));
    return (
        <div
            id="hj-meni"
            className={cx('hj-meni', meni.otvoren && 'hj-meni--otvoren')}
            role="dialog"
            aria-modal="true"
            aria-label={t.nav.meni}
            aria-hidden={!meni.otvoren}
            inert={!meni.otvoren ? '' : undefined}
        >
            <nav aria-label={t.nav.meni} className="hj-meni-sadrzaj">
                <p className="hj-meni-oznaka" aria-hidden="true">{t.nav.meni}</p>
                <ul className="hj-meni-lista">
                    {stavke.map((k, i) => {
                        const veza = k === 'zakazivanje' ? zakazi : { to: p(k) };
                        const Tag = veza.to ? Link : 'a';
                        return (
                            <li key={k}>
                                <Tag
                                    {...veza}
                                    ref={i === 0 ? prviLink : undefined}
                                    onClick={zatvori}
                                    aria-current={aktivna === k ? 'page' : undefined}
                                    className="hj-meni-link"
                                >
                                    {k === 'zakazivanje' ? t.nav.zakazi : t.nav[k]}
                                </Tag>
                            </li>
                        );
                    })}
                </ul>
                <IzborJezika className="hj-meni-jezici" onIzbor={zatvori} />
            </nav>
        </div>
    );
};

export const Header = () => {
    const { t, tema } = useSajt();
    const { pathname } = useLocation();
    const { skrolovano } = useSkrol({ prag: tema.header?.prag ?? 10 });
    const meni = useMeni();
    const providan = kljucIzPutanje(pathname) === 'pocetna' && !skrolovano;

    return (
        <>
            <a href="#sadrzaj" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-paper focus:px-4 focus:py-2 focus:text-ink">
                {t.opste.preskoci}
            </a>
            <header className={cx('hj-header', providan && 'hj-header--providan', meni.otvoren && 'hj-header--meni')}>
                <div className="hj-header-red">
                    <Logo />
                    <button
                        ref={meni.dugmeRef}
                        type="button"
                        className="hj-dugme-menija"
                        aria-expanded={meni.otvoren}
                        aria-controls="hj-meni"
                        aria-label={meni.otvoren ? t.nav.zatvori : t.nav.meni}
                        onClick={meni.prebaci}
                    >
                        {meni.otvoren ? <X size={30} strokeWidth={1.25} aria-hidden="true" /> : <TriTacke />}
                    </button>
                </div>
            </header>
            <Meni meni={meni} />
        </>
    );
};

/* ── Hero ──────────────────────────────────────────────────────────────── */

export const Hero = () => {
    const { salon, t, tx, tema } = useSajt();
    const h = salon.pocetna.hero;
    const zakazi = useZakaziLink();
    const naslov = [tx(h.naslov), tx(h.akcenat)].filter(Boolean).join(' ');
    const veo = tema.heroOpcije?.veo ?? 0.42;
    return (
        <section className="hj-hero hj-na-foto">
            <Foto src={h.slike?.[0]} alt={tx(salon.slogan)} prioritet okvirKlasa="hj-pozadina" sizes="100vw" />
            <div className="hj-veo" style={{ '--hj-veo': veo }} aria-hidden="true" />
            <div className="hj-hero-sadrzaj">
                <h1 className="naslov naslov-hero m-0">{naslov}</h1>
                <ZvezdiceOcene className="hj-hero-zvezdice" />
                {tx(h.nadnaslov) && <p className="hj-podnaslov">{tx(h.nadnaslov)}</p>}
                <Dugme {...zakazi} varijanta="foto" strelica={false} className="hj-hero-dugme">{t.nav.zakazi}</Dugme>
                <MrezeKvadrati className="hj-hero-mreze" />
            </div>
        </section>
    );
};

/* ── Sekcije početne ───────────────────────────────────────────────────── */

/** Bela sekcija: ceo sadržaj je JEDAN blok koji ulazi (fadeInUp 20px, 1s). */
const BelaSekcija = ({ children, siroko = false, className, ...o }) => (
    <section className={cx('hj-sekcija', className)} {...o}>
        <Pojava className={cx('hj-blok', siroko && 'hj-blok--siroko')}>{children}</Pojava>
    </section>
);

/** Traka preko fotografije (crno-bela, veo samo koliko traži kontrast). */
const FotoSekcija = ({ slika, children, className, ...o }) => {
    const { tema } = useSajt();
    return (
        <section className={cx('hj-sekcija hj-foto-sekcija hj-na-foto', className)} {...o}>
            <Foto src={slika} alt="" okvirKlasa="hj-pozadina" sizes="100vw" />
            <div className="hj-veo" style={{ '--hj-veo': tema.sekcija?.veoFoto ?? 0.5 }} aria-hidden="true" />
            <Pojava className="hj-blok">{children}</Pojava>
        </section>
    );
};

const Dugmad = ({ children }) => <div className="hj-dugmad">{children}</div>;

/** 1. Misija: h2, kurzivni uvod sa crvenom kurzivnom rečju-linkom, dugme. */
const Misija = () => {
    const { salon, t, tx, p } = useSajt();
    const tt = useTekstovi();
    const izjava = tx(salon.pocetna.izjava);
    if (!izjava) return null;
    return (
        <BelaSekcija aria-labelledby="hj-misija">
            <h2 id="hj-misija" className="naslov naslov-2 m-0">{tt.misijaNaslov}</h2>
            <p className="tekst-uvod hj-uvod">
                {izjava}{' '}
                {salon.galerija?.length > 0 && <Link to={p('galerija')} className="hj-link">{tt.misijaLink}</Link>}
            </p>
            <Dugmad><Dugme to={p('oNama')} strelica={false}>{t.nav.oNama}</Dugme></Dugmad>
        </BelaSekcija>
    );
};

/** 2. Foto-traka: naslov i kurzivni uvod preko fotografije, dugme. */
const FotoTraka = () => {
    const { salon, t, tx, p } = useSajt();
    const o = salon.oNama;
    const tekst = tx(o?.tekst?.[2] ?? o?.tekst?.[0]);
    if (!o || !tekst) return null;
    const imaTim = salon.tim?.length > 0;
    return (
        <FotoSekcija slika={o.slika || salon.pocetna.hero.slike?.[1]} aria-labelledby="hj-traka">
            <h2 id="hj-traka" className="naslov naslov-2 m-0">{tx(o.naslov)}</h2>
            <p className="tekst-uvod hj-uvod">{tekst}</p>
            <Dugmad><Dugme to={p(imaTim ? 'tim' : 'oNama')} varijanta="foto" strelica={false}>{imaTim ? t.nav.tim : t.nav.oNama}</Dugme></Dugmad>
        </FotoSekcija>
    );
};

/** 3. Usluge: sive tekstualne pločice sa srcem, nazivom, opisom i cenom-linkom. */
const Usluge = () => {
    const { salon, t, tx, p, jezik } = useSajt();
    const kat = salon.kategorije ?? [];
    if (!kat.length) return null;
    return (
        <BelaSekcija siroko aria-labelledby="hj-usluge">
            <h2 id="hj-usluge" className="naslov naslov-2 m-0">{t.pocetna.uslugeNaslov} {t.pocetna.uslugeAkcenat}</h2>
            <ul className="hj-plocice">
                {kat.map((k) => (
                    <li key={k.id} className="hj-plocica">
                        <Heart size={30} fill="currentColor" strokeWidth={0} className="hj-plocica-ikona" aria-hidden="true" />
                        <h3 className="hj-plocica-naslov">{tx(k.naziv)}</h3>
                        <p className="hj-plocica-tekst">{tx(k.opis)}</p>
                        <Link to={`${p('cenovnik')}#${k.id}`} className="hj-link hj-plocica-link">
                            {t.opste.od} {cena(Math.min(...k.usluge.map((u) => u.cena)), jezik)}
                        </Link>
                    </li>
                ))}
            </ul>
        </BelaSekcija>
    );
};

/** 4. Lokacija: naslov, tekst 24px (ne kurziv), tri dugmeta jedno ispod drugog. */
const Lokacija = () => {
    const { salon, t, tx, p } = useSajt();
    const tt = useTekstovi();
    const l = salon.lokacija;
    const mapa = l.googleMape || `https://www.google.com/maps/search/?api=1&query=${l.koordinate.lat},${l.koordinate.lng}`;
    const slike = salon.pocetna.hero.slike ?? [];
    return (
        <FotoSekcija slika={slike[1] ?? slike[0]} aria-labelledby="hj-lokacija">
            <h2 id="hj-lokacija" className="naslov naslov-2 m-0">{tt.lokacijeNaslov}</h2>
            <p className="hj-lokacija-tekst">
                {l.adresa}, {tx(l.grad)}.{tx(l.kakoDoNas) ? ` ${tx(l.kakoDoNas)}` : ''}
            </p>
            <Dugmad>
                <Dugme href={mapa} target="_blank" rel="noopener noreferrer" varijanta="foto" strelica={false}>{t.kontakt.otvoriMapu}</Dugme>
                <Dugme to={p('kontakt')} varijanta="foto" strelica={false}>{t.nav.kontakt}</Dugme>
                <Dugme to={p('cenovnik')} varijanta="foto" strelica={false}>{t.nav.cenovnik}</Dugme>
            </Dugmad>
        </FotoSekcija>
    );
};

/** 5. Recenzije: slajder bez kartica — 2 po ekranu (desktop) / 1 (telefon), tačke, automatska smena. */
const Recenzije = () => {
    const { salon, t, tx, tema } = useSajt();
    const tt = useTekstovi();
    const lista = salon.recenzije?.lista ?? [];
    const n = lista.length;
    const op = tema.recenzijeOpcije ?? {};
    const [poEkranu, setPoEkranu] = useState(Math.min(op.poEkranu?.[0] ?? 2, n || 1));
    const [i, setI] = useState(0);
    const [pauza, setPauza] = useState(false);
    const pozicija = Math.max(1, n - poEkranu + 1);

    useEffect(() => {
        const mq = window.matchMedia('(max-width: 767.98px)');
        const osvezi = () => setPoEkranu(Math.min(mq.matches ? (op.poEkranu?.[1] ?? 1) : (op.poEkranu?.[0] ?? 2), n || 1));
        osvezi();
        mq.addEventListener('change', osvezi);
        return () => mq.removeEventListener('change', osvezi);
    }, [n, op.poEkranu]);

    useEffect(() => { if (i > pozicija - 1) setI(0); }, [i, pozicija]);

    useEffect(() => {
        if (!op.auto || pauza || pozicija < 2) return undefined;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
        const id = setTimeout(() => setI((x) => (x + 1) % pozicija), (op.pauza ?? 2000) + (op.brzina ?? 400));
        return () => clearTimeout(id);
    }, [i, pauza, pozicija, op.auto, op.pauza, op.brzina]);

    if (!n) return null;
    return (
        <BelaSekcija aria-labelledby="hj-recenzije">
            <h2 id="hj-recenzije" className="naslov naslov-2 m-0">{t.pocetna.recenzijeNaslov}</h2>
            <div
                className="hj-slajder"
                role="region"
                aria-roledescription="carousel"
                aria-label={t.pocetna.recenzijeNaslov}
                onMouseEnter={() => setPauza(true)}
                onMouseLeave={() => setPauza(false)}
                onFocus={() => setPauza(true)}
                onBlur={() => setPauza(false)}
            >
                <ul className="hj-slajder-traka" style={{ '--hj-i': i, transitionDuration: `${op.brzina ?? 400}ms` }} aria-live={pauza ? 'polite' : 'off'}>
                    {lista.map((rv, k) => {
                        const vidljiv = k >= i && k < i + poEkranu;
                        return (
                            <li key={k} className="hj-slajd" role="group" aria-roledescription="slide" aria-label={tt.recenzija(k + 1, n)} aria-hidden={!vidljiv}>
                                <figure className="m-0">
                                    <span className="hj-slajd-zvezdice" role="img" aria-label={`${rv.ocena}/5`}>
                                        {Array.from({ length: rv.ocena }, (_, z) => <Star key={z} size={14} fill="currentColor" strokeWidth={0} aria-hidden="true" />)}
                                    </span>
                                    <blockquote className="hj-citat">{tx(rv.tekst)}</blockquote>
                                    <figcaption className="hj-autor">{rv.autor}</figcaption>
                                </figure>
                            </li>
                        );
                    })}
                </ul>
            </div>
            {pozicija > 1 && (
                <div className="hj-tacke" role="group" aria-label={tt.recenzijeKontrole}>
                    {Array.from({ length: pozicija }, (_, k) => (
                        <button key={k} type="button" className="hj-tacka" aria-label={tt.slajd(k + 1)} aria-current={k === i ? 'true' : undefined} onClick={() => setI(k)} />
                    ))}
                </div>
            )}
        </BelaSekcija>
    );
};

/** 6. Poziv: naslov, kurzivni red, tri dugmeta u koloni (zakazivanje, poziv, poruka). */
/** Brendovi: centriran naslov i red logotipa (linkovi ka brendovima). */
const Brendovi = () => {
    const { salon, t } = useSajt();
    if (!brendoviSalona(salon).length) return null;
    return (
        <BelaSekcija aria-labelledby="hj-brendovi">
            <h2 id="hj-brendovi" className="naslov naslov-2 m-0">{t.pocetna.brendoviNaslov}</h2>
            <LogotipiBrendova className="hj-brendovi" />
        </BelaSekcija>
    );
};

const Poziv = () => {
    const { salon, t, tx } = useSajt();
    const zakazi = useZakaziLink();
    const pz = salon.pocetna.poziv;
    const k = salon.kontakt;
    if (!pz) return null;
    const poruka = k.whatsapp
        ? { href: `https://wa.me/${k.whatsapp}`, target: '_blank', rel: 'noopener noreferrer', tekst: t.opste.whatsapp }
        : k.viber ? { href: `viber://chat?number=%2B${k.viber}`, tekst: t.opste.viber }
            : k.email ? { href: `mailto:${k.email}`, tekst: t.opste.pisite } : null;
    return (
        <FotoSekcija slika={pz.slika} aria-labelledby="hj-poziv">
            <h2 id="hj-poziv" className="naslov naslov-2 m-0">{tx(pz.naslov)}</h2>
            {tx(pz.tekst) && <p className="tekst-uvod hj-uvod">{tx(pz.tekst)}</p>}
            <Dugmad>
                <Dugme {...zakazi} varijanta="foto" strelica={false}>{t.nav.zakazi}</Dugme>
                {k.telefon && <Dugme href={`tel:${k.telefon}`} varijanta="foto" strelica={false}>{t.opste.pozovite} · {k.telefonPrikaz}</Dugme>}
                {poruka && (
                    <Dugme href={poruka.href} target={poruka.target} rel={poruka.rel} varijanta="foto" strelica={false}>
                        {poruka.tekst}
                    </Dugme>
                )}
            </Dugmad>
        </FotoSekcija>
    );
};

/* ── Footer ────────────────────────────────────────────────────────────── */

export const Footer = () => {
    const { salon, t, tx, p } = useSajt();
    const f = salon.firma;
    const l = salon.lokacija;
    const godina = new Date().getFullYear();
    const pravno = (fn) => fn({ naziv: '' }).replace(/ — $/, '');
    return (
        <footer className="hj-footer">
            <nav aria-label={t.footer.navigacija}>
                <ul className="hj-footer-linkovi">
                    {['cenovnik', 'tim', 'galerija', 'oNama', 'kontakt', 'pitanja'].map((k) => (
                        <li key={k}><Link to={p(k)} className="hj-footer-link">{t.nav[k]}</Link></li>
                    ))}
                </ul>
            </nav>
            <p className="hj-potpis">
                © {godina} {salon.naziv} · {l.adresa}, {tx(l.grad)} · <a href={`tel:${salon.kontakt.telefon}`} className="hj-potpis-link">{salon.kontakt.telefonPrikaz}</a>
            </p>
            <KarticePlacanja className="placanje-footer" />
            <p className="hj-pravno">
                {f.naziv} · {f.adresa} · {t.footer.pib} {f.pib} · {t.footer.mb} {f.maticniBroj}
                {f.sifraDelatnosti && <> · {t.footer.delatnost} {f.sifraDelatnosti}</>}
                {!f.pdvObveznik && <> · {t.footer.nijePdv}</>} · {t.footer.prava}
            </p>
            <div className="hj-footer-dno">
                <ul className="hj-footer-pravno">
                    <li><Link to={p('privatnost')} className="hj-footer-mali">{pravno(t.seo.privatnost)}</Link></li>
                    <li><Link to={p('uslovi')} className="hj-footer-mali">{pravno(t.seo.uslovi)}</Link></li>
                    <li><Link to={p('kolacici')} className="hj-footer-mali">{pravno(t.seo.kolacici)}</Link></li>
                    <li><button type="button" className="hj-footer-mali" onClick={zaboraviPristanak}>{t.footer.podesavanjaKolacica}</button></li>
                </ul>
                <IzborJezika className="hj-footer-jezici" />
            </div>
        </footer>
    );
};

/* ── Naslov podstranice ────────────────────────────────────────────────── */

export const ZaglavljeStranice = ({ naslov, akcenat, uvod, slika, children, className }) => (
    <header className={cx('hj-zaglavlje', className)}>
        <div className="hj-zaglavlje-blok">
            <Naslov as="h1" nivo={1} tekst={naslov} akcenat={akcenat} odmah />
            {uvod && <Pojava as="p" className="tekst-uvod hj-uvod">{uvod}</Pojava>}
            {children}
        </div>
        {slika && (
            <Pojava className="hj-zaglavlje-slika">
                <Foto src={slika} alt="" okvirKlasa="aspect-[16/9]" prioritet />
            </Pojava>
        )}
    </header>
);

export default {
    Header,
    Footer,
    Hero,
    pocetna: [Misija, FotoTraka, Usluge, Lokacija, Recenzije, Brendovi, Poziv],
    ZaglavljeStranice,
};
