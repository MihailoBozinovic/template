/*
 * Početna teme „holivud” — obrasci Nine Zero One prevedeni na salon:
 *   hero (dole desno) → traka brendova (marquee) → dva panela 100vh (radovi)
 *   → urednički paneli (o nama + utisak) → usluge u parovima od ivice do ivice
 *   → fotografija + crni panel (tim) → izdvojena usluga (slika desno)
 *   → poklon vaučer (slika levo) → tri pločice (zakaži / lokacija / mreže).
 * Paneli od ivice do ivice dele tanki šavovi papira (16 / 32 px).
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { Gift, Heart, MapPin, Scissors } from 'lucide-react';
import { useSajt } from '../../kontekst/Sajt.jsx';
import { cena } from '../../lib/format.js';
import { Dugme, Foto, Naslov, Pojava, cx } from '../../components/primitivi.jsx';
import { useZakaziLink } from '../../components/Header.jsx';
import { VezaZakazi, instagramIme } from './Header.jsx';
import { useTekstovi } from './tekstovi.js';
import { LogoBrenda } from '../../components/delovi.jsx';
import { brendoviSalona } from '../../lib/brendovi.js';

const najnizaCena = (k) => Math.min(...k.usluge.map((u) => u.cena));
const slikaIz = (...kandidati) => kandidati.find(Boolean) ?? '';

/* ── Hero: jedna fotografija, tekst dole desno, jedno belo dugme ─────── */
export const Hero = () => {
    const { salon, t, tx } = useSajt();
    const h = salon.pocetna.hero;
    const zakazi = useZakaziLink();
    const podnaslov = tx(salon.pocetna.poziv?.tekst) || tx(salon.slogan);
    return (
        <section className="hv-hero relative flex items-end overflow-hidden bg-tamna text-white">
            <Foto src={h.slike?.[0] ?? ''} alt={tx(salon.slogan)} prioritet okvirKlasa="!absolute inset-0 !rounded-none" sizes="100vw" />
            <div className="hv-hero-veo absolute inset-0 z-[1]" aria-hidden="true" />
            <div className="na-foto hv-hero-tekst relative z-[2] flex w-full flex-col items-end text-right">
                {tx(h.nadnaslov) && <p className="hv-oznaka-naslov ulaz-odmah m-0">{tx(h.nadnaslov)}</p>}
                <Naslov as="h1" nivo="hero" tekst={tx(h.naslov)} akcenat={tx(h.akcenat)} odmah className="hv-hero-naslov" />
                {podnaslov && <p className="hv-hero-podnaslov ulaz-odmah m-0">{podnaslov}</p>}
                <div className="hv-hero-dugme ulaz-odmah">
                    <Dugme {...zakazi} varijanta="foto" strelica={false}>{t.nav.zakazi}</Dugme>
                </div>
            </div>
        </section>
    );
};

/* ── Traka brendova: marquee bez naslova, razdvajača i maske ─────────── */
export const TrakaBrendova = () => {
    const { salon } = useSajt();
    const tk = useTekstovi();
    const brendovi = brendoviSalona(salon);
    if (!brendovi.length) return null;
    // Svaka kopija mora biti šira od ekrana; brzina ≈ 36 px/s kao kod reference.
    let niz = brendovi;
    while (niz.length < 12) niz = [...niz, ...brendovi];
    return (
        <section aria-label={tk.brendovi} className="hv-brendovi">
            <div className="hv-marquee" style={{ '--hv-marquee-t': `${niz.length * 5}s` }}>
                {[0, 1].map((k) => (
                    <ul key={k} className="hv-marquee-traka" aria-hidden={k === 1 ? 'true' : undefined}>
                        {niz.map((b, i) => <li key={`${k}-${i}`}><LogoBrenda brend={b} tabIndex={k === 1 || i >= brendovi.length ? -1 : undefined} /></li>)}
                    </ul>
                ))}
            </div>
        </section>
    );
};

/* ── Dva panela 100vh: radovi + zakazivanje, obris dugme pri dnu ─────── */
export const PaneliRad = () => {
    const { salon, t, p, tx } = useSajt();
    const tk = useTekstovi();
    const g = salon.galerija ?? [];
    if (!g.length) return null;
    const paneli = [
        { s: g[0], dugme: <Dugme to={p('galerija')} varijanta="foto" strelica={false}>{tk.radovi}</Dugme> },
        { s: g[5] ?? g[1] ?? g[0], dugme: <VezaZakazi className="dugme dugme-foto">{t.nav.zakazi}</VezaZakazi> },
    ];
    return (
        <section aria-label={tk.radovi} className="hv-red-panela grid md:grid-cols-2">
            {paneli.map(({ s, dugme }, i) => (
                <div key={i} className="hv-panel-pun relative overflow-hidden bg-mist">
                    <Foto src={s.slika} alt={tx(s.opis)} okvirKlasa="!absolute inset-0" sizes="(min-width: 768px) 50vw, 100vw" />
                    <Pojava className="absolute inset-x-0 bottom-[56px] flex justify-center px-6">{dugme}</Pojava>
                </div>
            ))}
        </section>
    );
};

/* ── Urednički paneli: o nama (720×765 + 720×619 i crni pojas) ────────── */
export const UrednickiPaneli = () => {
    const { salon, p, tx } = useSajt();
    const tk = useTekstovi();
    const o = salon.oNama;
    const g = salon.galerija ?? [];
    const utisak = salon.recenzije?.lista?.[0];
    if (!o) return null;
    return (
        <section aria-label={tx(o.naslov)} className="hv-sav-32 grid md:grid-cols-2">
            <Link to={p('oNama')} className="hv-slika-link hv-urednicki-levo relative block overflow-hidden bg-mist" aria-label={tx(o.naslov)}>
                <Foto src={o.slika} alt="" okvirKlasa="!absolute inset-0" sizes="(min-width: 768px) 50vw, 100vw" />
            </Link>
            <div className="flex flex-col">
                <div className="hv-urednicki-desno relative overflow-hidden bg-mist md:flex-1">
                    <Foto src={slikaIz(g[3]?.slika, g[1]?.slika, o.slika)} alt={tx(g[3]?.opis) || ''} okvirKlasa="!absolute inset-0" sizes="(min-width: 768px) 50vw, 100vw" />
                </div>
                <div className="hv-pojas flex flex-col items-start gap-6 bg-tamna text-white md:flex-row md:items-end md:justify-between">
                    {utisak ? (
                        <figure className="m-0 max-w-[30rem]">
                            <blockquote className="hv-tekst-panel m-0">„{tx(utisak.tekst)}”</blockquote>
                            <figcaption className="hv-oznaka-bela mt-2">{utisak.autor} · {tk.utisak}</figcaption>
                        </figure>
                    ) : <span />}
                    <Dugme to={p('oNama')} varijanta="foto" strelica={false} className="shrink-0 self-end">{tk.nasaPrica}</Dugme>
                </div>
            </div>
        </section>
    );
};

/* ── Usluge: kategorije u parovima 50/50, natpis pri dnu fotografije ─── */
export const UslugePaneli = () => {
    const { salon, t, p, tx, jezik } = useSajt();
    const kat = salon.kategorije ?? [];
    if (!kat.length) return null;
    return (
        <section aria-label={t.pocetna.uslugeNaslov} className="hv-sav-16 hv-usluge grid md:grid-cols-2">
            <h2 className="sr-only">{t.pocetna.uslugeNaslov}</h2>
            {kat.map((k, i) => {
                const sam = kat.length % 2 === 1 && i === kat.length - 1;
                return (
                    <Link
                        key={k.id}
                        to={`${p('cenovnik')}#${k.id}`}
                        className={cx('hv-slika-link hv-usluga group relative flex items-end justify-center overflow-hidden bg-mist text-white', sam && 'hv-usluga-sama md:col-span-2')}
                    >
                        <Foto src={k.slika} alt="" okvirKlasa="!absolute inset-0" sizes={sam ? '100vw' : '(min-width: 768px) 50vw, 100vw'} />
                        <span className="hv-usluga-veo absolute inset-0" aria-hidden="true" />
                        <Pojava className="na-foto relative flex max-w-[34rem] flex-col items-center px-6 text-center">
                            <span className="hv-oznaka-bela">{t.opste.od} {cena(najnizaCena(k), jezik)}</span>
                            <h3 className="hv-h2-foto m-0 mt-2">{tx(k.naziv)}</h3>
                            <span className="hv-tekst-panel mt-2.5">{tx(k.opis)}</span>
                            <span className="dugme dugme-foto hv-dugme-uze mt-6">{t.opste.saznajVise}</span>
                        </Pojava>
                    </Link>
                );
            })}
        </section>
    );
};

/* ── Fotografija levo, crni panel desno: tim ─────────────────────────── */
export const TimPanel = () => {
    const { salon, t, p } = useSajt();
    const tk = useTekstovi();
    if (!salon.tim?.length) return null;
    return (
        <section className="hv-sav-16 grid md:grid-cols-2">
            <Link to={p('tim')} className="hv-slika-link hv-tim-slika relative block overflow-hidden bg-mist" aria-label={tk.upoznajteTim}>
                <Foto src={salon.tim[0].slika} alt="" okvirKlasa="!absolute inset-0" sizes="(min-width: 768px) 50vw, 100vw" />
            </Link>
            <div className="hv-crni-panel flex flex-col items-center justify-center bg-tamna text-center text-white">
                <Pojava className="flex flex-col items-center">
                    <h2 className="naslov naslov-2 m-0">{t.pocetna.timNaslov}</h2>
                    <p className="hv-tekst-panel m-0 mt-5 max-w-[30rem]">{t.tim.uvod}</p>
                    <Dugme to={p('tim')} varijanta="foto" strelica={false} className="mt-9">{tk.upoznajteTim}</Dugme>
                </Pojava>
            </div>
        </section>
    );
};

/* ── Izdvojena sekcija: kontejner 1216, slika 544×650, tekst centriran ── */
const Izdvojeno = ({ slika, alt, oznaka, naslov, grotesk = false, tekst, link, obrnuto = false }) => (
    <section className="hv-izdvojeno">
        <div className="hv-izdvojeno-red mx-auto grid max-w-[1216px] items-center md:grid-cols-2">
            <div className={cx('hv-izdvojeno-slika', obrnuto ? 'md:order-1 md:justify-self-end' : 'md:order-2 md:justify-self-start')}>
                <Pojava>
                    <Foto src={slika} alt={alt} okvirKlasa="aspect-[544/650] w-full" sizes="(min-width: 768px) 544px, 90vw" />
                </Pojava>
            </div>
            <Pojava className={cx('hv-izdvojeno-tekst flex flex-col items-center text-center', obrnuto ? 'md:order-2' : 'md:order-1')}>
                {oznaka && <p className="nadnaslov m-0">{oznaka}</p>}
                <h2 className={cx('m-0', grotesk ? 'hv-grotesk mt-4' : 'naslov naslov-1 mt-3')}>{naslov}</h2>
                {tekst && <p className="hv-tekst-1 m-0 mt-4 max-w-[27rem]">{tekst}</p>}
                {link}
            </Pojava>
        </div>
    </section>
);

export const IzdvojenaUsluga = () => {
    const { salon, p, tx } = useSajt();
    const tk = useTekstovi();
    const kat = salon.kategorije ?? [];
    const k = kat[1] ?? kat[0];
    if (!k) return null;
    return (
        <Izdvojeno
            slika={k.slika}
            alt={tx(k.naziv)}
            oznaka={tk.izdvajamo}
            naslov={tx(k.naziv)}
            grotesk
            tekst={tx(k.opis)}
            link={<Link to={`${p('cenovnik')}#${k.id}`} className="hv-tekst-link mt-5">{tk.pogledajCene}</Link>}
        />
    );
};

export const VaucerIzdvojeno = () => {
    const { salon, t, tx } = useSajt();
    const tekst = tx(salon.poklonVaucer?.tekst);
    if (!tekst) return null;
    const k = salon.kontakt;
    const href = k.whatsapp ? `https://wa.me/${k.whatsapp}?text=${encodeURIComponent(t.pocetna.vaucerNaslov)}` : `tel:${k.telefon}`;
    return (
        <Izdvojeno
            obrnuto
            slika={slikaIz(salon.pocetna.poziv?.slika, salon.galerija?.[1]?.slika)}
            alt=""
            oznaka={t.pocetna.vaucerNadnaslov}
            naslov={t.pocetna.vaucerNaslov}
            tekst={tekst}
            link={<a href={href} target={k.whatsapp ? '_blank' : undefined} rel="noopener noreferrer" className="hv-tekst-link mt-5">{t.pocetna.vaucerDugme}</a>}
        />
    );
};

/* ── Tri pločice poverenja: prva kiselo žuta ─────────────────────────── */
export const PlocicePoverenja = () => {
    const { salon, t, p } = useSajt();
    const tk = useTekstovi();
    const k = salon.kontakt;
    const insta = instagramIme(k.instagram);
    const plocice = [
        { Ikona: Scissors, naslov: t.nav.zakazi, link: <VezaZakazi className="hv-plocica-link">{tk.zakaziOnline}</VezaZakazi> },
        { Ikona: MapPin, naslov: salon.lokacija.adresa, link: <Link to={p('kontakt')} className="hv-plocica-link">{tk.kakoDoNas}</Link> },
        insta
            ? { Ikona: Heart, naslov: tk.pratite, link: <a href={k.instagram} target="_blank" rel="noopener noreferrer" className="hv-plocica-link">{insta}</a> }
            : { Ikona: Gift, naslov: t.pocetna.vaucerNaslov, link: <a href={`tel:${k.telefon}`} className="hv-plocica-link">{k.telefonPrikaz}</a> },
    ];
    return (
        <section className="hv-plocice" aria-label={tk.zakaziOnline}>
            <ul className="hv-plocice-niz skriven-skrol m-0 list-none p-0">
                {plocice.map(({ Ikona, naslov, link }, i) => (
                    <li key={i} className={cx('hv-plocica', i === 0 && 'hv-plocica-akcenat')}>
                        <span className="hv-krug" aria-hidden="true"><Ikona size={30} strokeWidth={1.5} /></span>
                        <h3 className="naslov naslov-3 m-0 mt-6">{naslov}</h3>
                        {link}
                    </li>
                ))}
            </ul>
        </section>
    );
};

export const POCETNA = [TrakaBrendova, PaneliRad, UrednickiPaneli, UslugePaneli, TimPanel, IzdvojenaUsluga, VaucerIzdvojeno, PlocicePoverenja];
