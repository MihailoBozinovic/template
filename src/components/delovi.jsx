import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Phone, Mail, Banknote } from 'lucide-react';
import { useSajt } from '../kontekst/Sajt.jsx';
import { SVI_JEZICI, kljucIzPutanje, putanja } from '../i18n/jezici.js';
import { aktivniJezici } from '../lib/seo.js';
import { grupisanoRadnoVreme, statusSalona, neradanDan, sadaUSalonu, dodajDane } from '../lib/vreme.js';
import { datumDugo } from '../lib/format.js';
import { brendoviSalona, naciniPlacanja } from '../lib/brendovi.js';
import { javno } from '../lib/baza.js';
import { cx, IkonaFacebook, IkonaInstagram, IkonaTikTok, IkonaViber, IkonaWhatsApp } from './primitivi.jsx';

/** Posle hidratacije — za sve što zavisi od trenutnog vremena. */
export const useNaKlijentu = () => {
    const [da, setDa] = useState(false);
    useEffect(() => setDa(true), []);
    return da;
};

/** „Otvoreno do 20:00” / „Otvaramo sutra u 09:00” — u zoni salona. */
export const StatusOtvoreno = ({ className }) => {
    const { salon, t } = useSajt();
    const klijent = useNaKlijentu();
    const [s, setS] = useState(null);
    useEffect(() => {
        if (!klijent) return undefined;
        const osvezi = () => setS(statusSalona(salon));
        osvezi();
        const id = setInterval(osvezi, 60_000);
        return () => clearInterval(id);
    }, [klijent, salon]);
    if (!s) return <span className={cx('inline-block h-5', className)} aria-hidden="true" />;
    let tekst = t.opste.zatvoreno;
    if (s.otvoreno) tekst = t.opste.otvorenoDo(s.do);
    else if (s.sledece) {
        const dan = s.sledece.za === 0 ? t.opste.danas : s.sledece.za === 1 ? t.opste.sutra : t.dani.uDan[s.sledece.dan];
        tekst = t.opste.otvaraU(dan, s.sledece.od);
    }
    return (
        <span className={cx('inline-flex items-center gap-2', className)}>
            <span className={cx('h-2 w-2 rounded-full', s.otvoreno ? 'bg-emerald-500' : 'bg-current opacity-40')} aria-hidden="true" />
            {tekst}
        </span>
    );
};

/** Radno vreme u redovima (uzastopni dani spojeni), sa današnjim istaknutim. */
export const RadnoVremeTabela = ({ className }) => {
    const { salon, t } = useSajt();
    const klijent = useNaKlijentu();
    const danas = klijent ? ['ned', 'pon', 'uto', 'sre', 'cet', 'pet', 'sub'][new Date(`${sadaUSalonu().datum}T12:00:00Z`).getUTCDay()] : null;
    return (
        <dl className={cx('m-0 grid gap-2', className)}>
            {grupisanoRadnoVreme(salon).map((g) => {
                const dani = g.dani.length > 2 ? `${t.dani.kratko[g.dani[0]]} – ${t.dani.kratko[g.dani[g.dani.length - 1]]}` : g.dani.map((d) => t.dani.kratko[d]).join(', ');
                const aktivan = danas && g.dani.includes(danas);
                return (
                    <div key={g.dani.join()} className={cx('flex justify-between gap-6', aktivan && 'font-semibold')}>
                        <dt>{dani}</dt>
                        <dd className="m-0 tabular-nums">{g.vreme ? `${g.vreme[0]} – ${g.vreme[1]}` : t.opste.neradi}</dd>
                    </div>
                );
            })}
        </dl>
    );
};

/** Predstojeći neradni dani (sledećih 60 dana). */
export const NeradniDani = ({ className }) => {
    const { salon, t, tx, jezik } = useSajt();
    const klijent = useNaKlijentu();
    if (!klijent) return null;
    const { datum } = sadaUSalonu();
    const do_ = dodajDane(datum, 60);
    const lista = (salon.neradniDani ?? []).filter((n) => n.datum >= datum && n.datum <= do_ && neradanDan(n.datum, salon));
    if (!lista.length) return null;
    return (
        <div className={className}>
            <p className="nadnaslov m-0 mb-2 opacity-70">{t.kontakt.neradniDani}</p>
            <ul className="m-0 list-none space-y-1 p-0 text-sm">
                {lista.map((n) => <li key={n.datum}>{datumDugo(n.datum, t, jezik)} — {tx(n.opis)}</li>)}
            </ul>
        </div>
    );
};

export const Mreze = ({ className, velicina = 18 }) => {
    const { salon, t } = useSajt();
    const k = salon.kontakt;
    const stavke = [
        k.instagram && { href: k.instagram, ime: t.opste.instagram, Ikona: IkonaInstagram },
        k.facebook && { href: k.facebook, ime: t.opste.facebook, Ikona: IkonaFacebook },
        k.tiktok && { href: k.tiktok, ime: t.opste.tiktok, Ikona: IkonaTikTok },
    ].filter(Boolean);
    if (!stavke.length) return null;
    return (
        <ul className={cx('m-0 flex list-none gap-2 p-0', className)}>
            {stavke.map(({ href, ime, Ikona }) => (
                <li key={href}>
                    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={ime}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-current/20 transition-colors hover:bg-ink hover:text-paper"
                        style={{ borderColor: 'color-mix(in srgb, currentColor 25%, transparent)' }}>
                        <Ikona size={velicina} />
                    </a>
                </li>
            ))}
        </ul>
    );
};

/** Poziv, WhatsApp, Viber, e-mail — šta je popunjeno u salon.js. */
export const KontaktDugmad = ({ className, tekst = null }) => {
    const { salon, t } = useSajt();
    const k = salon.kontakt;
    const st = [
        k.telefon && { href: `tel:${k.telefon}`, ime: `${t.opste.pozovite} · ${k.telefonPrikaz}`, Ikona: Phone },
        k.whatsapp && { href: `https://wa.me/${k.whatsapp}${tekst ? `?text=${encodeURIComponent(tekst)}` : ''}`, ime: t.opste.whatsapp, Ikona: IkonaWhatsApp, spolja: true },
        k.viber && { href: `viber://chat?number=%2B${k.viber}${tekst ? `&draft=${encodeURIComponent(tekst)}` : ''}`, ime: t.opste.viber, Ikona: IkonaViber },
        k.email && { href: `mailto:${k.email}`, ime: k.email, Ikona: Mail },
    ].filter(Boolean);
    return (
        <div className={cx('flex flex-wrap gap-2', className)}>
            {st.map(({ href, ime, Ikona, spolja }) => (
                <a key={href} href={href} className="cip" {...(spolja ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                    <Ikona size={16} aria-hidden="true" /> {ime}
                </a>
            ))}
        </div>
    );
};

/** SR · EN · RU — ista stranica na drugom jeziku. */
export const IzborJezika = ({ className, puno = false, onIzbor }) => {
    const { jezik, t } = useSajt();
    const { pathname } = useLocation();
    const jezici = aktivniJezici();
    if (jezici.length < 2) return null;
    const kljuc = kljucIzPutanje(pathname) ?? 'pocetna';
    return (
        <nav aria-label={t.nav.jezik} className={className}>
            <ul className="m-0 flex list-none items-center gap-1 p-0">
                {jezici.map((j) => (
                    <li key={j}>
                        <Link
                            to={putanja(kljuc, j)}
                            hrefLang={j}
                            lang={j}
                            onClick={onIzbor}
                            aria-current={j === jezik ? 'true' : undefined}
                            className={cx('nadnaslov inline-flex min-h-[2.25rem] items-center px-1.5 transition-opacity', j === jezik ? 'opacity-100 underline underline-offset-4' : 'opacity-70 hover:opacity-100')}
                        >
                            {puno ? SVI_JEZICI[j].naziv : SVI_JEZICI[j].kratko}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
};

/** Beskonačna traka (marquee) — brzina i pauza na hover iz teme. */
export const Marquee = ({ stavke, className, razdvajac = '✦' }) => {
    const niz = [...stavke, ...stavke];
    return (
        <div className={cx('marquee', className)} aria-label={stavke.join(', ')}>
            <div className="marquee-traka" aria-hidden="true">
                {[0, 1].map((k) => (
                    <div key={k} className="flex shrink-0 items-center">
                        {niz.map((s, i) => (
                            <span key={`${k}-${i}`} className="flex items-center">
                                <span className="px-8 md:px-12">{s}</span>
                                <span className="text-brand opacity-70">{razdvajac}</span>
                            </span>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

/* ── Brendovi (logotipi sa linkovima) i načini plaćanja ─────────────────── */

/** Jedan brend: logotip (ili naziv) koji vodi na zvanični sajt brenda. */
export const LogoBrenda = ({ brend, className, ...o }) => {
    const { t } = useSajt();
    const sadrzaj = brend.logo
        ? <img src={javno(brend.logo)} alt={brend.naziv} className="logo-brenda" loading="lazy" decoding="async" />
        : <span className="logo-brenda-tekst">{brend.naziv}</span>;
    if (!brend.url) return <span className={cx('brend', className)}>{sadrzaj}</span>;
    // eslint-disable-next-line react/jsx-props-no-spreading
    return (
        <a href={brend.url} target="_blank" rel="noopener noreferrer" className={cx('brend', className)} title={brend.naziv} aria-label={`${brend.naziv} (${t.opste.noviProzor})`} {...o}>
            {sadrzaj}
        </a>
    );
};

/**
 * Logotipi brendova iz salon.js — u redu (`raspored="red"`) ili kao beskonačna
 * traka (`raspored="traka"`, brzina i pauza na hover iz teme). Duplikat trake
 * je skriven za čitače ekrana i tastaturu.
 */
export const LogotipiBrendova = ({ raspored = 'red', className, klasaStavke }) => {
    const { salon, t } = useSajt();
    const brendovi = brendoviSalona(salon);
    if (!brendovi.length) return null;
    if (raspored === 'traka') {
        let niz = brendovi;
        while (niz.length < 8) niz = [...niz, ...brendovi];
        return (
            <div className={cx('marquee logotipi-traka', className)}>
                <div className="marquee-traka">
                    {[0, 1].map((kopija) => (
                        <ul key={kopija} className="m-0 flex shrink-0 list-none items-center p-0" aria-hidden={kopija === 1 ? 'true' : undefined} aria-label={kopija === 0 ? t.pocetna.brendoviNaslov : undefined}>
                            {niz.map((b, i) => (
                                <li key={`${kopija}-${i}`} className={cx('logotipi-stavka', klasaStavke)} aria-hidden={kopija === 0 && i >= brendovi.length ? 'true' : undefined}>
                                    <LogoBrenda brend={b} {...((kopija === 1 || i >= brendovi.length) ? { tabIndex: -1 } : {})} />
                                </li>
                            ))}
                        </ul>
                    ))}
                </div>
            </div>
        );
    }
    return (
        <ul className={cx('logotipi-red m-0 flex list-none flex-wrap items-center p-0', className)} aria-label={t.pocetna.brendoviNaslov}>
            {brendovi.map((b) => <li key={b.naziv} className={cx('logotipi-stavka', klasaStavke)}><LogoBrenda brend={b} /></li>)}
        </ul>
    );
};

/** Ikonice kartica (zvanični logotipi) i gotovina — za footer i kontakt. */
export const KarticePlacanja = ({ className, naslov = false }) => {
    const { salon, t, tx } = useSajt();
    const nacini = naciniPlacanja(salon);
    if (!nacini.length) return null;
    return (
        <div className={cx('kartice-placanja', className)}>
            {naslov && <p className="nadnaslov m-0 mb-2">{t.kontakt.placanje}</p>}
            <ul className="m-0 flex list-none flex-wrap items-center gap-2 p-0" aria-label={t.kontakt.placanje}>
                {nacini.map((n) => (
                    <li key={n.kljuc} className="kartica-placanja" title={tx(n.naziv)}>
                        {n.logo
                            ? <img src={javno(n.logo)} alt={tx(n.naziv)} loading="lazy" decoding="async" />
                            : <span className="kartica-placanja-tekst"><Banknote size={15} strokeWidth={1.6} aria-hidden="true" />{tx(n.naziv)}</span>}
                    </li>
                ))}
            </ul>
        </div>
    );
};
