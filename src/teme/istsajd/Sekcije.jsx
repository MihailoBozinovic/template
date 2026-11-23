/*
 * Sekcije početne teme „istsajd”, redom kao na referenci:
 * Usluge (bela) → O nama (menta) → Recenzije (preko fotografije) → Tim (bela,
 * vodoravni niz) → Instagram / radovi (menta) → Lokacija (bela).
 * Sav sadržaj je iz salon.js (useSajt), tekstovi interfejsa iz ./tekstovi.js.
 */
import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ChevronDown, Star } from 'lucide-react';
import { useSajt } from '../../kontekst/Sajt.jsx';
import { Dugme, Foto, IkonaFacebook, IkonaInstagram, IkonaTikTok, Kontejner, Nadnaslov, Naslov, Pojava, Sekcija, cx } from '../../components/primitivi.jsx';
import { useZakaziLink } from '../../components/Header.jsx';
import { useNaKlijentu } from '../../components/delovi.jsx';
import { grupisanoRadnoVreme, sadaUSalonu } from '../../lib/vreme.js';
import { useTekst } from './tekstovi.js';
import { Strelica, Traka, linkMape, useKarusel, useVidljivo } from './pomocno.jsx';

/* ── Usluge: centriran naslov, uvod do 700px, kvadratne kartice sa prstenom ── */
export const UslugeIst = () => {
    const { salon, t, tx, p } = useSajt();
    const kat = salon.kategorije;
    if (!kat.length) return null;
    const naslov = [t.pocetna.uslugeNaslov, t.pocetna.uslugeAkcenat].filter(Boolean).join(' ');
    return (
        <Sekcija className="ist-usluge">
            <Kontejner>
                <div className="mx-auto max-w-[700px] text-center">
                    <Naslov nivo={2} tekst={naslov} />
                    <Pojava as="p" className="ist-tekst tekst-telo m-0 mt-[30px]">{t.pocetna.uslugeUvod}</Pojava>
                </div>
                <ul className="ist-kartice m-0 mt-12 list-none p-0 md:mt-[50px]">
                    {kat.map((k) => (
                        <Pojava as="li" key={k.id} className="ist-kartica-omot">
                            <Link to={`${p('cenovnik')}#${k.id}`} className="ist-kartica group">
                                <span className="ist-kartica-foto">
                                    <Foto src={k.slika} alt="" okvirKlasa="!absolute inset-0" sizes="(min-width: 1024px) 25vw, 100vw" />
                                    <span className="ist-kartica-sloj" aria-hidden="true">
                                        <span className="ist-tekst tekst-telo">{tx(k.opis)}</span>
                                    </span>
                                </span>
                                <span className="ist-kartica-dno">
                                    <span className="naslov naslov-3">{tx(k.naziv)}</span>
                                    <ArrowRight size={20} strokeWidth={2.25} aria-hidden="true" className="shrink-0" />
                                </span>
                            </Link>
                        </Pojava>
                    ))}
                </ul>
                <Pojava className="mt-[60px] flex justify-center">
                    <Dugme to={p('cenovnik')}>{t.opste.saznajVise}</Dugme>
                </Pojava>
            </Kontejner>
        </Sekcija>
    );
};

/* ── O nama (menta): tekst levo, karusel fotografija desno ── */
export const ONamaIst = () => {
    const { salon, t, tx, p } = useSajt();
    const T = useTekst();
    const o = salon.oNama;
    const slike = [o.slika, ...salon.galerija.map((g) => g.slika)].filter(Boolean).slice(0, 5);
    const k = useKarusel(slike.length, 1);
    if (!o) return null;
    return (
        <Sekcija className="ist-menta">
            <Kontejner className="grid gap-10 lg:grid-cols-2">
                <div className="lg:pt-[5px]">
                    <Pojava><Nadnaslov className="ist-nadnaslov">{t.oNama.nadnaslov}</Nadnaslov></Pojava>
                    <Naslov nivo={1} tekst={tx(o.naslov)} className="mt-[22px]" />
                    <Pojava className="ist-tekst tekst-telo mt-[25px] space-y-[25.6px]">
                        {(o.tekst ?? []).slice(0, 2).map((pp, i) => <p key={i} className="m-0">{tx(pp)}</p>)}
                    </Pojava>
                    <Pojava className="mt-8"><Dugme to={p('oNama')}>{T.oNamaDugme}</Dugme></Pojava>
                </div>
                <Pojava className="ist-karusel relative overflow-hidden" role="region" aria-roledescription="carousel" aria-label={T.fotografijeSalona}>
                    <Traka i={k.i} vidljivo={1}>
                        {slike.map((s, i) => (
                            <div key={s} className="ist-stavka" aria-hidden={i !== k.i} role="group" aria-label={`${i + 1} / ${slike.length}`}>
                                <Foto src={s} alt={i === 0 ? tx(o.naslov) : ''} okvirKlasa="aspect-[652/702]" sizes="(min-width: 1024px) 50vw, 100vw" />
                            </div>
                        ))}
                    </Traka>
                    {slike.length > 1 && (
                        <>
                            <Strelica smer="nazad" onClick={k.nazad} label={t.opste.prethodna} className="absolute left-2 top-1/2 -translate-y-1/2" />
                            <Strelica smer="napred" onClick={k.napred} label={t.opste.sledeca} className="absolute right-2 top-1/2 -translate-y-1/2" />
                        </>
                    )}
                </Pojava>
            </Kontejner>
        </Sekcija>
    );
};

/* ── Recenzije: jedna centrirana recenzija preko fotografije sa velom ── */
export const RecenzijeIst = () => {
    const { salon, t, tx } = useSajt();
    const T = useTekst();
    const zakazi = useZakaziLink();
    const r = salon.recenzije;
    const lista = r?.lista ?? [];
    const k = useKarusel(lista.length, 1);
    if (!lista.length) return null;
    const pozadina = salon.pocetna.poziv?.slika || salon.galerija[0]?.slika;
    const ostavi = salon.kontakt.googleRecenzija;
    return (
        <section className="ist-recenzije sekcija relative overflow-hidden text-white">
            <Foto src={pozadina} alt="" okvirKlasa="!absolute inset-0" sizes="100vw" />
            <div className="ist-recenzije-veo absolute inset-0" aria-hidden="true" />
            <Kontejner className="na-foto relative">
                <Naslov nivo={2} tekst={t.pocetna.recenzijeNaslov} className="text-center" />
                <div className="relative mt-12 md:mt-[100px]" role="region" aria-roledescription="carousel" aria-label={t.pocetna.recenzijeNaslov}>
                    <div className="mx-auto overflow-hidden md:max-w-[780px]">
                        <Traka i={k.i} vidljivo={1} aria-live="polite">
                            {lista.map((rv, i) => (
                                <figure key={i} className="ist-stavka m-0 px-2 text-center" aria-hidden={i !== k.i} role="group" aria-roledescription="slide" aria-label={T.recenzija(i + 1, lista.length)}>
                                    <blockquote className="ist-recenzija-tekst m-0">{tx(rv.tekst)}</blockquote>
                                    <p className="m-0 mt-3 inline-flex items-center gap-4" aria-label={`${rv.ocena}/5`}>
                                        <span className="inline-flex gap-[7px]" aria-hidden="true">
                                            {Array.from({ length: rv.ocena }, (_, z) => <Star key={z} size={18} fill="currentColor" strokeWidth={0} />)}
                                        </span>
                                        <span aria-hidden="true">{T.od5(rv.ocena)}</span>
                                    </p>
                                    <figcaption className="ist-recenzija-autor mt-[30px]">{rv.autor}</figcaption>
                                </figure>
                            ))}
                        </Traka>
                    </div>
                    {lista.length > 1 && (
                        <>
                            <Strelica smer="nazad" onClick={k.nazad} label={t.opste.prethodna} className="ist-strelica-tamna absolute left-0 top-[80%] -translate-y-1/2 md:left-[24px] md:top-[44%]" />
                            <Strelica smer="napred" onClick={k.napred} label={t.opste.sledeca} className="ist-strelica-tamna absolute right-0 top-[80%] -translate-y-1/2 md:right-[24px] md:top-[44%]" />
                            <div className="mt-24 flex justify-center gap-[5px] md:mt-[100px]" role="group" aria-label={T.izRecenzija}>
                                {lista.map((_, i) => (
                                    <button key={i} type="button" className="ist-tackica" aria-label={T.recenzija(i + 1, lista.length)} aria-current={i === k.i ? 'true' : undefined} onClick={() => k.setI(i)} />
                                ))}
                            </div>
                        </>
                    )}
                </div>
                <div className="mt-[60px] flex justify-center">
                    {ostavi
                        ? <Dugme href={ostavi} target="_blank" rel="noopener noreferrer" varijanta="foto">{T.ostaviRecenziju}</Dugme>
                        : <Dugme {...zakazi} varijanta="foto">{t.nav.zakazi}</Dugme>}
                </div>
            </Kontejner>
        </section>
    );
};

/* ── Tim: kolona teksta (383px) + vodoravni niz portreta sa strelicama ── */
export const TimIst = () => {
    const { salon, t, tx, p } = useSajt();
    const T = useTekst();
    const niz = useRef(null);
    if (!salon.tim.length) return null;
    const pomeri = (smer) => {
        const el = niz.current;
        if (!el) return;
        const kartica = el.querySelector('li');
        const korak = kartica ? kartica.getBoundingClientRect().width + 20 : el.clientWidth;
        el.scrollBy({ left: smer * korak, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    };
    const strelice = (
        <div className="flex items-center gap-[10px]">
            <button type="button" className="ist-strelica-koral" onClick={() => pomeri(-1)} aria-label={t.opste.prethodna}><ArrowLeft size={20} strokeWidth={2} aria-hidden="true" /></button>
            <button type="button" className="ist-strelica-koral" onClick={() => pomeri(1)} aria-label={t.opste.sledeca}><ArrowRight size={20} strokeWidth={2} aria-hidden="true" /></button>
        </div>
    );
    return (
        <Sekcija className="ist-tim">
            <Kontejner className="grid gap-8 lg:grid-cols-[383px_minmax(0,1fr)] lg:gap-[40px]">
                <div className="lg:pt-[5px]">
                    <Pojava><Nadnaslov className="ist-nadnaslov">{t.pocetna.timNadnaslov}</Nadnaslov></Pojava>
                    <Naslov nivo={1} tekst={t.pocetna.timNaslov} className="mt-[22px]" />
                    <Pojava as="p" className="ist-tekst tekst-telo m-0 mt-[25px]">{t.tim.uvod}</Pojava>
                    <Pojava className="mt-8 hidden lg:block">
                        <Dugme to={p('tim')}>{T.timDugme}</Dugme>
                        <div className="mt-[22px]">{strelice}</div>
                    </Pojava>
                </div>
                <div className="min-w-0">
                    <ul ref={niz} className="ist-tim-niz skriven-skrol m-0 flex list-none gap-5 overflow-x-auto p-0" aria-label={T.timNiz} tabIndex={0}>
                        {salon.tim.map((r) => (
                            <li key={r.id} className="ist-tim-kartica">
                                <Link to={p('tim')} className="group relative block h-full w-full overflow-hidden">
                                    <Foto src={r.slika} alt="" okvirKlasa="!absolute inset-0" sizes="(min-width: 1024px) 320px, 200px" />
                                    <span className="ist-tim-veo absolute inset-0" aria-hidden="true" />
                                    <span className="ist-tim-natpis">
                                        <span className="ist-tim-ime">{r.ime}</span>
                                        <span className="ist-tim-uloga">{tx(r.uloga)}</span>
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-12 flex items-center justify-between lg:hidden">
                        <Dugme to={p('tim')}>{T.timDugme}</Dugme>
                        {strelice}
                    </div>
                </div>
            </Kontejner>
        </Sekcija>
    );
};

/* ── Instagram / radovi (menta): 6 pločica u karuselu, mreže ispod ── */
export const InstagramIst = () => {
    const { salon, t, tx, p } = useSajt();
    const T = useTekst();
    const slike = salon.galerija.slice(0, 12);
    const v = useVidljivo({ telefon: 1, tablet: 3, desktop: 6 });
    const k = useKarusel(slike.length, v);
    if (!slike.length) return null;
    const kt = salon.kontakt;
    const pratite = kt.instagram || kt.facebook || kt.tiktok;
    const mreze = [
        kt.facebook && { href: kt.facebook, ime: t.opste.facebook, Ikona: IkonaFacebook },
        kt.instagram && { href: kt.instagram, ime: t.opste.instagram, Ikona: IkonaInstagram },
        kt.tiktok && { href: kt.tiktok, ime: t.opste.tiktok, Ikona: IkonaTikTok },
    ].filter(Boolean);
    return (
        <Sekcija className="ist-menta ist-insta">
            <Kontejner>
                <div className="flex flex-col items-center gap-6 md:flex-row md:items-baseline md:justify-between">
                    <Naslov nivo={2} tekst={pratite ? T.instagramNaslov : T.radovi} className="ist-insta-naslov text-center md:text-left" />
                    <Pojava className="self-end md:self-auto">
                        {pratite
                            ? <a href={pratite} target="_blank" rel="noopener noreferrer" className="ist-link-strelica">{T.instagramLink}<ArrowRight size={18} strokeWidth={2.25} aria-hidden="true" /></a>
                            : <Link to={p('galerija')} className="ist-link-strelica">{t.opste.pogledajSve}<ArrowRight size={18} strokeWidth={2.25} aria-hidden="true" /></Link>}
                    </Pojava>
                </div>
                <Pojava className="relative mt-8 md:mt-[30px]" role="region" aria-roledescription="carousel" aria-label={T.radovi}>
                    <div className="mx-[33px] overflow-hidden md:mx-[52px]">
                        <Traka i={k.i} vidljivo={v} razmak={20}>
                            {slike.map((g, i) => (
                                <Link key={g.slika} to={p('galerija')} className="ist-stavka ist-insta-plocica block" aria-hidden={i < k.i || i >= k.i + v ? 'true' : undefined} tabIndex={i < k.i || i >= k.i + v ? -1 : undefined}>
                                    <Foto src={g.slika} alt={tx(g.opis)} okvirKlasa="aspect-[190/260]" sizes="(min-width: 1024px) 190px, (min-width: 768px) 30vw, 80vw" />
                                </Link>
                            ))}
                        </Traka>
                    </div>
                    {k.max > 0 && (
                        <>
                            <Strelica smer="nazad" onClick={k.nazad} label={t.opste.prethodna} className="ist-strelica-velika absolute -left-[14px] top-1/2 -translate-y-1/2 md:-left-[22px]" />
                            <Strelica smer="napred" onClick={k.napred} label={t.opste.sledeca} className="ist-strelica-velika absolute -right-[14px] top-1/2 -translate-y-1/2 md:-right-[22px]" />
                        </>
                    )}
                </Pojava>
                {mreze.length > 0 && (
                    <ul className="m-0 mt-10 flex list-none justify-center gap-3 p-0">
                        {mreze.map(({ href, ime, Ikona }) => (
                            <li key={href}>
                                <a href={href} target="_blank" rel="noopener noreferrer" aria-label={ime} className="ist-mreza"><Ikona size={20} /></a>
                            </li>
                        ))}
                    </ul>
                )}
            </Kontejner>
        </Sekcija>
    );
};

/* ── Radno vreme kao padajuća pilula (dan u boldu) ── */
export const RadnoVremePilula = ({ className }) => {
    const { salon, t } = useSajt();
    const T = useTekst();
    const klijent = useNaKlijentu();
    const grupe = grupisanoRadnoVreme(salon);
    const danas = klijent ? ['ned', 'pon', 'uto', 'sre', 'cet', 'pet', 'sub'][new Date(`${sadaUSalonu().datum}T12:00:00Z`).getUTCDay()] : null;
    const rv = danas ? salon.radnoVreme[danas] : null;
    const opis = (g) => (g.dani.length > 2
        ? `${t.dani.kratko[g.dani[0]]} – ${t.dani.kratko[g.dani[g.dani.length - 1]]}`
        : g.dani.map((d) => t.dani.kratko[d]).join(', '));
    return (
        <details className={cx('ist-sati', className)}>
            <summary>
                <span className="font-bold">{danas ? T.radnoVremeDanas : t.kontakt.radnoVreme}</span>
                {danas && <span className="ml-2">{rv ? `${rv[0]} – ${rv[1]}` : t.opste.neradi}</span>}
                <ChevronDown size={18} strokeWidth={2.75} aria-hidden="true" className="ist-sati-strelica ml-auto" />
            </summary>
            <dl className="m-0 grid gap-1 px-4 pb-3 pt-1">
                {grupe.map((g) => (
                    <div key={g.dani.join()} className="flex justify-between gap-6">
                        <dt className={cx(danas && g.dani.includes(danas) && 'font-bold')}>{opis(g)}</dt>
                        <dd className="m-0 tabular-nums">{g.vreme ? `${g.vreme[0]} – ${g.vreme[1]}` : t.opste.neradi}</dd>
                    </div>
                ))}
            </dl>
        </details>
    );
};

/* ── Lokacija: fotografija levo, tekst i kartica lokacije desno ── */
export const LokacijaIst = () => {
    const { salon, t, tx, p } = useSajt();
    const T = useTekst();
    const l = salon.lokacija;
    if (!l) return null;
    const slika = salon.galerija.find((g) => !g.kategorija)?.slika ?? salon.oNama?.slika;
    return (
        <Sekcija className="ist-lokacija">
            <Kontejner className="grid gap-10 lg:grid-cols-2">
                <Pojava className="order-1">
                    <Foto src={slika} alt={tx(salon.slogan)} okvirKlasa="aspect-[358/400] lg:aspect-[652/700]" sizes="(min-width: 1024px) 50vw, 100vw" />
                </Pojava>
                <div className="order-2 flex flex-col">
                    <Pojava><Nadnaslov className="ist-nadnaslov">{T.lokacijaNadnaslov}</Nadnaslov></Pojava>
                    <Naslov nivo={1} tekst={T.lokacijaNaslov} className="mt-[22px]" />
                    {l.kakoDoNas && <Pojava as="p" className="ist-tekst tekst-telo m-0 mt-[25px]">{tx(l.kakoDoNas)}</Pojava>}
                    <Pojava className="mt-8"><Dugme to={p('kontakt')}>{T.lokacijaDugme}</Dugme></Pojava>
                    <Pojava className="mt-16 grid gap-10 sm:grid-cols-2 lg:mt-auto lg:pt-16">
                        <div className="ist-lokacija-kartica">
                            <h3 className="ist-lokacija-naziv m-0">{salon.naziv}</h3>
                            <address className="mt-[18px] not-italic">
                                <a href={linkMape(l)} target="_blank" rel="noopener noreferrer" className="ist-link">{l.adresa},<br />{l.postanskiBroj} {tx(l.grad)}</a>
                            </address>
                            <p className="m-0 mt-3"><a href={`tel:${salon.kontakt.telefon}`} className="ist-link">{salon.kontakt.telefonPrikaz}</a></p>
                            <RadnoVremePilula className="mt-4" />
                        </div>
                    </Pojava>
                </div>
            </Kontejner>
        </Sekcija>
    );
};

export const POCETNA_IST = [UslugeIst, ONamaIst, RecenzijeIst, TimIst, InstagramIst, LokacijaIst];

/** Za podstranice: kratko zaglavlje (nadnaslov, h1 48px, uvod) ispod headera od 110px. */
export const ZaglavljeStraniceIst = ({ nadnaslov, naslov, akcenat, uvod, slika, children, className }) => (
    <header className={cx('ist-zaglavlje', className)}>
        <Kontejner className={cx('grid gap-10 pb-10 md:pb-14', slika && 'lg:grid-cols-2 lg:items-end')}>
            <div className="max-w-[760px]">
                {nadnaslov && <Nadnaslov className="ist-nadnaslov ulaz-odmah mb-[22px]">{nadnaslov}</Nadnaslov>}
                <Naslov as="h1" nivo={1} tekst={[naslov, akcenat].filter(Boolean).join(' ')} odmah />
                {uvod && <p className="ist-tekst tekst-uvod ulaz-odmah m-0 mt-[25px] max-w-[700px]">{uvod}</p>}
                {children}
            </div>
            {slika && <Foto src={slika} alt="" okvirKlasa="aspect-[4/3]" prioritet />}
        </Kontejner>
    </header>
);

