/*
 * Komponente teme „zaliv” (po uzoru na Barrow Salon). Sve što se ovde izveze
 * zamenjuje podrazumevanu komponentu, samo kad je ova tema aktivna
 * (src/teme/registar.js).
 *
 * Raspored: header NIJE fiksiran (odlazi sa stranom, ne vraća se pri skrolu
 * nagore) — levo ogroman uzani wordmark (naziv salona), desno tanak nav,
 * ikonica Instagrama i crni CTA u verzalu. Početna: fotografija / tekst-traka
 * naizmenično — fotografije visine ekrana uvučene 3vw, trake sa h2 ili
 * paragrafom levo i crnim dugmetom desno. Footer: tri kolone na sivoj podlozi.
 * Nema animacija (reveal je isključen u tema.css), meni je čist fade.
 */
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '@fontsource/sofia-sans-extra-condensed/600.css';
import '@fontsource/onest/600.css';
import { useSajt } from '../../kontekst/Sajt.jsx';
import { Dugme, Foto, Naslov, cx, IkonaFacebook, IkonaInstagram, IkonaTikTok } from '../../components/primitivi.jsx';
import { NavLinkovi, STAVKE, STAVKE_MENIJA, useMeni, useZakaziLink } from '../../components/Header.jsx';
import { IzborJezika, KarticePlacanja, LogotipiBrendova } from '../../components/delovi.jsx';
import { brendoviSalona } from '../../lib/brendovi.js';
import { zaboraviPristanak } from '../../lib/pristanak.js';
import { grupisanoRadnoVreme } from '../../lib/vreme.js';
import { cena } from '../../lib/format.js';
import { javno } from '../../lib/baza.js';
import { tekstovi } from './tekstovi.js';
import './tema.css';

/* ── Wordmark ───────────────────────────────────────────────────────────── */
/*
 * Širine verzala „Sofia Sans Extra Condensed” 600 (u hiljaditim delovima em,
 * izmereno). Iz njih se, već na serveru, zna širina naziva u em, pa CSS
 * (container query) postavlja veličinu slova tako da naziv uvek stane u
 * prostor koji mu ostaje — i dugačak naziv na telefonu od 390px — bez
 * merenja u browseru i bez skoka posle hidratacije.
 */
const SIRINE = {
    A: 384, B: 389, C: 417, D: 422, E: 354, F: 344, G: 428, H: 434, I: 184, J: 184, K: 399, L: 322, M: 517,
    N: 435, O: 423, P: 369, Q: 423, R: 399, S: 363, T: 351, U: 425, V: 398, W: 566, X: 375, Y: 377, Z: 356,
    Č: 417, Ć: 417, Š: 363, Ž: 356, Đ: 425, ' ': 125, '&': 426, '.': 190, '-': 308, '\'': 154, '’': 154,
    А: 384, Б: 384, В: 389, Г: 309, Д: 435, Е: 354, Ё: 354, Ж: 577, З: 379, И: 433, Й: 433, К: 397, Л: 378,
    М: 517, Н: 434, О: 423, П: 432, Р: 369, С: 417, Т: 351, У: 383, Ф: 542, Х: 375, Ц: 443, Ч: 417, Ш: 584,
    Щ: 598, Ъ: 437, Ы: 562, Ь: 378, Э: 404, Ю: 583, Я: 394,
    0: 387, 1: 317, 2: 353, 3: 362, 4: 378, 5: 354, 6: 383, 7: 350, 8: 381, 9: 384,
};
const sirinaEm = (tekst) => Math.max(1, [...String(tekst).toUpperCase()].reduce((s, z) => s + (SIRINE[z] ?? 440), 0) / 1000);

export const Wordmark = ({ className }) => {
    const { salon, p } = useSajt();
    return (
        <div className={cx('zaliv-logo-okvir', className)}>
            <Link to={p('pocetna')} className="zaliv-logo" style={{ '--logo-em': sirinaEm(salon.naziv).toFixed(3) }}>
                {salon.logo
                    ? <img src={javno(salon.logo)} alt={salon.naziv} className="zaliv-logo-slika" />
                    : <span className="zaliv-logo-tekst">{salon.naziv}</span>}
            </Link>
        </div>
    );
};

/* ── Sitni delovi ───────────────────────────────────────────────────────── */
const DveLinije = () => (
    <span className="zaliv-ikona-meni" aria-hidden="true"><span /><span /></span>
);
const TankiX = () => (
    <span className="zaliv-ikona-x" aria-hidden="true"><span /><span /></span>
);

/** Ikonica glavne mreže (Instagram, inače prva popunjena) — bez kruga, kao u referenci. */
const MrezaIkona = ({ className, velicina = 18 }) => {
    const { salon, t } = useSajt();
    const k = salon.kontakt;
    const m = (k.instagram && { href: k.instagram, ime: t.opste.instagram, Ikona: IkonaInstagram })
        || (k.facebook && { href: k.facebook, ime: t.opste.facebook, Ikona: IkonaFacebook })
        || (k.tiktok && { href: k.tiktok, ime: t.opste.tiktok, Ikona: IkonaTikTok });
    if (!m) return null;
    return (
        <a href={m.href} target="_blank" rel="noopener noreferrer" aria-label={m.ime} className={cx('zaliv-mreza', className)}>
            <m.Ikona size={velicina} />
        </a>
    );
};

/* ── Header ─────────────────────────────────────────────────────────────── */
export const Header = () => {
    const { t, jezik } = useSajt();
    const tz = tekstovi(jezik);
    const meni = useMeni();
    const zakazi = useZakaziLink();
    return (
        <>
            <a href="#sadrzaj" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-paper focus:px-4 focus:py-2 focus:text-ink">
                {t.opste.preskoci}
            </a>
            <header className="zaliv-header">
                <div className="zaliv-header-red">
                    <Wordmark />
                    <div className="zaliv-header-desno">
                        <nav aria-label={t.nav.meni}>
                            <NavLinkovi stavke={STAVKE} className="zaliv-nav" klasaLinka="zaliv-nav-link" />
                        </nav>
                        <MrezaIkona className="zaliv-header-mreza" velicina={22} />
                        <Dugme {...zakazi} className="zaliv-cta" strelica={false}>{t.nav.zakazi}</Dugme>
                    </div>
                    <button
                        ref={meni.dugmeRef}
                        type="button"
                        className="zaliv-dugme-meni"
                        aria-expanded={meni.otvoren}
                        aria-controls="zaliv-meni"
                        aria-label={tz.otvoriMeni}
                        onClick={() => meni.setOtvoren(true)}
                    >
                        <DveLinije />
                    </button>
                </div>
            </header>
            <MobilniMeni meni={meni} />
        </>
    );
};

/* ── Mobilni meni: ceo ekran, bela, stavke centrirane, čist fade ─────────── */
const MobilniMeni = ({ meni }) => {
    const { t, p } = useSajt();
    const zakazi = useZakaziLink();
    const zatvoriRef = useRef(null);
    const { otvoren, setOtvoren, dugmeRef } = meni;

    useEffect(() => {
        if (otvoren) zatvoriRef.current?.focus({ preventScroll: true });
    }, [otvoren]);

    const zatvori = () => { setOtvoren(false); dugmeRef.current?.focus({ preventScroll: true }); };

    return (
        <div
            id="zaliv-meni"
            className={cx('zaliv-meni', otvoren && 'otvoren')}
            role="dialog"
            aria-modal="true"
            aria-label={t.nav.meni}
            aria-hidden={!otvoren}
            inert={!otvoren ? '' : undefined}
        >
            <div className="zaliv-header-red">
                <Wordmark />
                <button ref={zatvoriRef} type="button" className="zaliv-dugme-meni zaliv-dugme-meni-uvek" aria-label={t.nav.zatvori} onClick={zatvori}>
                    <TankiX />
                </button>
            </div>
            <div className="zaliv-meni-telo">
                <nav aria-label={t.nav.meni} className="zaliv-meni-nav">
                    <NavLinkovi stavke={STAVKE_MENIJA} className="zaliv-meni-lista" klasaLinka="zaliv-meni-link" />
                </nav>
                <div className="zaliv-meni-dno">
                    <div className="zaliv-meni-red">
                        <IzborJezika className="zaliv-meni-jezik" />
                        <MrezaIkona velicina={24} />
                    </div>
                    <Dugme {...zakazi} className="zaliv-cta zaliv-cta-meni" strelica={false}>{t.nav.zakazi}</Dugme>
                </div>
            </div>
        </div>
    );
};

/* ── Gradivni delovi početne ────────────────────────────────────────────── */
/** Fotografija visine ekrana, uvučena 3vw sa svih strana. */
const Ploca = ({ src, alt = '' }) => {
    if (!src) return null;
    return (
        <section className="zaliv-ploca" aria-label={alt || undefined}>
            <div className="zaliv-ploca-foto">
                <Foto src={src} alt={alt} okvirKlasa="!absolute inset-0" sizes="94vw" />
            </div>
        </section>
    );
};

/**
 * Tekst-traka: sadržaj levo, crno dugme desno (poravnato sa prvim redom).
 * `vrsta`: 'uska' (h2 + dugme, ~14px gore/dole) ili 'siroka' (paragraf, ~44 / 100px).
 * Na telefonu dugme ide ispod teksta, poravnato desno.
 */
const Traka = ({ vrsta = 'siroka', dugme, children, ...o }) => (
    <section className={cx('zaliv-traka', `zaliv-traka-${vrsta}`)} {...o}>
        <div className="zaliv-traka-tekst">{children}</div>
        {dugme && <div className="zaliv-traka-dugme">{dugme}</div>}
    </section>
);

/** Fotografije za ploče između traka: iz podataka salona, bez ponavljanja. */
const useFotografije = () => {
    const { salon, tx } = useSajt();
    const h = salon.pocetna.hero.slike ?? [];
    const g = salon.galerija ?? [];
    const opis = (src) => tx(g.find((x) => x.slika === src)?.opis) || '';
    const niz = [h[1], salon.oNama?.slika, h[2], g.find((x) => !x.kategorija)?.slika, salon.pocetna.poziv?.slika, ...g.map((x) => x.slika)];
    return [...new Set(niz.filter(Boolean))].map((src) => ({ src, alt: opis(src) }));
};
const PlocaBr = (i) => {
    const K = () => {
        const f = useFotografije()[i];
        return f ? <Ploca src={f.src} alt={f.alt} /> : null;
    };
    K.displayName = `ZalivPloca${i + 1}`;
    return K;
};

/* ── Hero: samo fotografija (do dna ekrana, okvir 3vw), ispod traka h1 + dugme ── */
export const Hero = () => {
    const { salon, t, tx } = useSajt();
    const h = salon.pocetna.hero;
    const zakazi = useZakaziLink();
    const recenica = [tx(h.naslov), tx(h.akcenat)].filter(Boolean).join(' ').trim();
    const naslov = /[.!?…]$/.test(recenica) ? recenica : `${recenica}.`;
    return (
        <>
            <section className="zaliv-hero">
                <div className="zaliv-hero-foto">
                    <Foto src={h.slike?.[0] || ''} alt={tx(salon.slogan)} prioritet okvirKlasa="!absolute inset-0" sizes="94vw" />
                </div>
            </section>
            <Traka vrsta="uska" dugme={<Dugme {...zakazi} strelica={false}>{t.nav.zakazi}</Dugme>}>
                <Naslov as="h1" nivo={2} tekst={naslov} animiraj={false} />
            </Traka>
        </>
    );
};

/* ── Traka „o nama”: paragraf levo, dugme desno ─────────────────────────── */
const TrakaONama = () => {
    const { salon, tx, p, jezik } = useSajt();
    const pasusi = (salon.oNama?.tekst ?? []).slice(0, 2).map((x) => tx(x)).filter(Boolean);
    const tekst = pasusi.length ? pasusi.join(' ') : tx(salon.pocetna.hero.uvod);
    if (!tekst) return null;
    return (
        <Traka dugme={<Dugme to={p('oNama')} strelica={false}>{tekstovi(jezik).oNamaDugme}</Dugme>}>
            <p className="tekst-telo m-0">{tekst}</p>
        </Traka>
    );
};

/* ── Traka usluga: naslov, pa kategorije kao podvučeni redovi teksta ─────── */
const TrakaUsluge = () => {
    const { salon, t, tx, p, jezik } = useSajt();
    const tz = tekstovi(jezik);
    const kat = salon.kategorije ?? [];
    if (!kat.length) return null;
    return (
        <Traka dugme={<Dugme to={p('cenovnik')} strelica={false}>{tz.cenovnikDugme}</Dugme>}>
            <Naslov nivo={2} tekst={tz.uslugeNaslov} animiraj={false} className="zaliv-traka-h2" />
            <ul className="zaliv-redovi tekst-telo">
                {kat.map((k) => (
                    <li key={k.id}>
                        <Link to={`${p('cenovnik')}#${k.id}`} className="zaliv-link">{tx(k.naziv)}</Link>
                        {' '}<span className="whitespace-nowrap">— {t.opste.od} {cena(Math.min(...k.usluge.map((u) => u.cena)), jezik)}</span>
                    </li>
                ))}
            </ul>
        </Traka>
    );
};

/* ── Traka tima: imena i uloge ──────────────────────────────────────────── */
const TrakaTim = () => {
    const { salon, t, tx, p, jezik } = useSajt();
    if (!salon.tim?.length) return null;
    return (
        <Traka dugme={<Dugme to={p('tim')} strelica={false}>{tekstovi(jezik).timDugme}</Dugme>}>
            <Naslov nivo={2} tekst={t.pocetna.timNaslov} animiraj={false} className="zaliv-traka-h2" />
            <ul className="zaliv-redovi tekst-telo">
                {salon.tim.map((r) => (
                    <li key={r.id}>
                        <Link to={p('tim')} className="zaliv-link">{r.ime}</Link>{tx(r.uloga) ? `, ${tx(r.uloga)}` : ''}
                    </li>
                ))}
            </ul>
        </Traka>
    );
};

/* ── Traka utiska: jedna recenzija u Bodoniju, potpis tankim groteskom ──── */
const TrakaUtisak = () => {
    const { salon, t, tx, jezik } = useSajt();
    const r = salon.recenzije;
    const rv = r?.lista?.[0];
    if (!rv) return null;
    const ocena = r.prosek ? ` · ${t.opste.ocena(String(r.prosek).replace('.', jezik === 'en' ? '.' : ','), r.broj)}${r.izvor ? ` (${r.izvor})` : ''}` : '';
    return (
        <Traka>
            <h2 className="sr-only">{tekstovi(jezik).recenzijeNaslov}</h2>
            <figure className="m-0">
                <blockquote className="naslov naslov-2 m-0">„{tx(rv.tekst)}”</blockquote>
                <figcaption className="tekst-telo mt-6">{rv.autor}{ocena}</figcaption>
            </figure>
        </Traka>
    );
};
/* ── Traka brendova: naslov, pa statičan red logotipa (linkovi ka brendovima) ── */
const TrakaBrendova = () => {
    const { salon, t } = useSajt();
    if (!brendoviSalona(salon).length) return null;
    return (
        <Traka>
            <Naslov nivo={2} tekst={t.pocetna.brendoviNaslov} animiraj={false} className="zaliv-traka-h2" />
            <LogotipiBrendova className="zaliv-brendovi" />
        </Traka>
    );
};

const PlocaPosleUtiska = () => {
    const { salon } = useSajt();
    const f = useFotografije()[4];
    if (!salon.recenzije?.lista?.length || !f) return null;
    return <Ploca src={f.src} alt={f.alt} />;
};

export const pocetna = [PlocaBr(0), TrakaONama, PlocaBr(1), TrakaUsluge, PlocaBr(2), TrakaTim, PlocaBr(3), TrakaUtisak, PlocaPosleUtiska, TrakaBrendova];

/* ── Footer: tri kolone (6/2/4 od 12), Bodoni naslovi, podvučeni linkovi ── */
export const Footer = () => {
    const { salon, t, tx, p, jezik } = useSajt();
    const tz = tekstovi(jezik);
    const l = salon.lokacija;
    const k = salon.kontakt;
    const f = salon.firma;
    const mapa = l.googleMape || (l.koordinate ? `https://www.google.com/maps/search/?api=1&query=${l.koordinate.lat},${l.koordinate.lng}` : '');
    const godina = new Date().getFullYear();
    const sati = grupisanoRadnoVreme(salon);
    const dani = (g) => (g.dani.length > 2 ? `${t.dani.kratko[g.dani[0]]} – ${t.dani.kratko[g.dani[g.dani.length - 1]]}` : g.dani.map((d) => t.dani.kratko[d]).join(', '));
    const AdresaLink = ({ children }) => (mapa
        ? <a href={mapa} target="_blank" rel="noopener noreferrer" className="zaliv-link" title={tz.otvoriMapu}>{children}</a>
        : <>{children}</>);

    return (
        <footer className="zaliv-footer">
            <div className="zaliv-footer-kolone">
                <div>
                    <h2 className="naslov naslov-3 m-0">{tz.lokacija}</h2>
                    <address className="zaliv-footer-tekst not-italic">
                        <span className="block"><AdresaLink>{l.adresa}</AdresaLink></span>
                        <span className="block"><AdresaLink>{l.postanskiBroj} {tx(l.grad)}</AdresaLink></span>
                        {k.telefon && <span className="block"><a href={`tel:${k.telefon}`} className="zaliv-link">{k.telefonPrikaz}</a></span>}
                        {k.email && <span className="block"><a href={`mailto:${k.email}`} className="zaliv-link break-all">{k.email}</a></span>}
                    </address>
                </div>
                <nav aria-label={tz.salon}>
                    <h2 className="naslov naslov-3 m-0">{tz.salon}</h2>
                    <ul className="zaliv-footer-tekst m-0 list-none p-0">
                        {['oNama', 'kontakt', 'pitanja'].map((s) => (
                            <li key={s}><Link to={p(s)} className="zaliv-link">{t.nav[s]}</Link></li>
                        ))}
                    </ul>
                </nav>
                <div>
                    <h2 className="naslov naslov-3 m-0">{tz.radnoVreme}</h2>
                    <dl className="zaliv-footer-tekst m-0">
                        {sati.map((g) => (
                            <div key={g.dani.join()} className="zaliv-sati">
                                <dt>{dani(g)}</dt>
                                <dd className="m-0 tabular-nums">{g.vreme ? `${g.vreme[0]} – ${g.vreme[1]}` : t.opste.neradi}</dd>
                            </div>
                        ))}
                    </dl>
                </div>
            </div>

            {/* Podaci firme (zakonska obaveza) i pravne strane — tiho, bez linije. */}
            <div className="zaliv-footer-pravno">
                <KarticePlacanja className="placanje-footer" />
                <p className="m-0">
                    {f.naziv} · {f.adresa} · {t.footer.pib} {f.pib} · {t.footer.mb} {f.maticniBroj}
                    {f.sifraDelatnosti && <> · {t.footer.delatnost} {f.sifraDelatnosti}</>}
                    {!f.pdvObveznik && <> · {t.footer.nijePdv}</>}
                    <br />© {godina} {salon.naziv}. {t.footer.prava}
                </p>
                <div className="zaliv-footer-pravno-desno">
                    <ul className="m-0 flex list-none flex-wrap gap-x-5 gap-y-1 p-0">
                        <li><Link to={p('privatnost')} className="zaliv-link">{t.seo.privatnost({ naziv: '' }).replace(/ — $/, '')}</Link></li>
                        <li><Link to={p('uslovi')} className="zaliv-link">{t.seo.uslovi({ naziv: '' }).replace(/ — $/, '')}</Link></li>
                        <li><Link to={p('kolacici')} className="zaliv-link">{t.seo.kolacici({ naziv: '' }).replace(/ — $/, '')}</Link></li>
                        <li><button type="button" className="zaliv-link" onClick={zaboraviPristanak}>{t.footer.podesavanjaKolacica}</button></li>
                    </ul>
                    <IzborJezika className="zaliv-footer-jezik" />
                </div>
            </div>
        </footer>
    );
};

/* ── Naslov podstranica: tiha traka ispod headera (koji nije fiksiran) ──── */
export const ZaglavljeStranice = ({ naslov, akcenat, uvod, slika, children, className }) => (
    <header className={cx('zaliv-zaglavlje', className)}>
        <div className="zaliv-zaglavlje-tekst">
            <Naslov as="h1" nivo={1} tekst={naslov} akcenat={akcenat} animiraj={false} />
            {uvod && <p className="tekst-telo m-0 mt-4">{uvod}</p>}
            {children}
        </div>
        {slika && (
            <div className="zaliv-zaglavlje-foto">
                <Foto src={slika} alt="" prioritet okvirKlasa="!absolute inset-0" sizes="94vw" />
            </div>
        )}
    </header>
);

export default { Header, Footer, Hero, pocetna, ZaglavljeStranice };
