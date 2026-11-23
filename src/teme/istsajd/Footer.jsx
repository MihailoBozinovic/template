/*
 * Footer teme „istsajd”: koral pozadina, ≈120px vazduha gore. Prvi red: naslov +
 * podnaslov levo, a desno pilula-okvir (kao polje newslettera na referenci) —
 * kod nas je to PRAVI link na Instagram, jer newsletter nema backend. Linija,
 * crna pilula sa lokacijom (link na mape), kolone Kontakt / Meni / Info,
 * mreže i logo na beloj pločici, crna traka na dnu (jezik).
 */
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Send } from 'lucide-react';
import { useSajt } from '../../kontekst/Sajt.jsx';
import { kljucIzPutanje } from '../../i18n/jezici.js';
import { zaboraviPristanak } from '../../lib/pristanak.js';
import { IkonaFacebook, IkonaInstagram, IkonaTikTok, Kontejner, cx } from '../../components/primitivi.jsx';
import { IzborJezika, KarticePlacanja } from '../../components/delovi.jsx';
import { useZakaziLink } from '../../components/Header.jsx';
import { useTekst } from './tekstovi.js';
import { linkMape, usePoklonLink } from './pomocno.jsx';

const MENI = ['pocetna', 'cenovnik', 'oNama', 'tim', 'galerija', 'kontakt', 'pitanja'];

const korisnik = (url) => {
    const m = String(url).match(/(?:instagram|facebook|tiktok)\.com\/@?([^/?#]+)/i);
    return m ? `@${m[1]}` : url.replace(/^https?:\/\/(www\.)?/, '');
};

export default function FooterIst() {
    const { salon, t, tx, p } = useSajt();
    const T = useTekst();
    const zakazi = useZakaziLink();
    const poklon = usePoklonLink();
    const { pathname } = useLocation();
    const aktivna = kljucIzPutanje(pathname);
    const f = salon.firma;
    const l = salon.lokacija;
    const k = salon.kontakt;
    const godina = new Date().getFullYear();
    const pratite = k.instagram || k.facebook || k.tiktok;
    const mreze = [
        k.facebook && { href: k.facebook, ime: t.opste.facebook, Ikona: IkonaFacebook },
        k.instagram && { href: k.instagram, ime: t.opste.instagram, Ikona: IkonaInstagram },
        k.tiktok && { href: k.tiktok, ime: t.opste.tiktok, Ikona: IkonaTikTok },
    ].filter(Boolean);
    const pravno = [
        ['privatnost', t.seo.privatnost({ naziv: '' }).replace(/ — $/, '')],
        ['uslovi', t.seo.uslovi({ naziv: '' }).replace(/ — $/, '')],
        ['kolacici', t.seo.kolacici({ naziv: '' }).replace(/ — $/, '')],
    ];

    const logoPlocica = (
        <Link to={p('pocetna')} className="ist-footer-logo" aria-label={`${salon.naziv} — ${T.logoPocetna}`}>
            <span className="logo-tekst">{salon.naziv}</span>
        </Link>
    );

    return (
        <footer className="ist-footer mt-auto">
            <Kontejner className="ist-footer-telo">
                <div className="mb-[70px] lg:hidden">{logoPlocica}</div>

                {pratite && (
                    <>
                        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                            <div>
                                <h2 className="ist-footer-naslov m-0">{T.footerNaslov}</h2>
                                <p className="m-0 mt-[18px]">{T.footerPodnaslov}</p>
                            </div>
                            <a href={pratite} target="_blank" rel="noopener noreferrer" className="ist-footer-polje">
                                <span className="truncate">{korisnik(pratite)}</span>
                                <Send size={18} strokeWidth={2} fill="currentColor" aria-hidden="true" />
                            </a>
                        </div>
                        <hr className="ist-footer-linija" />
                    </>
                )}

                <a href={linkMape(l)} target="_blank" rel="noopener noreferrer" className="ist-footer-lokacija" aria-label={`${salon.naziv}, ${l.adresa} — ${T.footerMapa}`}>
                    {salon.naziv}
                </a>

                <div className="mt-[34px] grid gap-12 lg:grid-cols-[268px_252px_minmax(0,1fr)_auto] lg:gap-0">
                    <div>
                        <h2 className="ist-footer-naslov m-0">{t.kontakt.nadnaslov}</h2>
                        <address className="mt-[18px] not-italic">
                            <p className="m-0"><a href={linkMape(l)} target="_blank" rel="noopener noreferrer" className="ist-footer-link">{l.adresa}, {tx(l.grad)}</a></p>
                            <p className="m-0 mt-[9px]"><a href={`tel:${k.telefon}`} className="ist-footer-link">{k.telefonPrikaz}</a></p>
                            {k.email && <p className="m-0 mt-[9px]"><a href={`mailto:${k.email}`} className="ist-footer-link break-all">{k.email}</a></p>}
                        </address>
                    </div>
                    <nav aria-label={t.footer.navigacija}>
                        <h2 className="ist-footer-naslov m-0">{t.nav.meni}</h2>
                        <ul className="ist-footer-meni m-0 mt-[18px] list-none p-0">
                            {MENI.map((kl) => (
                                <li key={kl}><Link to={p(kl)} className="ist-footer-link" aria-current={aktivna === kl ? 'page' : undefined}>{t.nav[kl]}</Link></li>
                            ))}
                            <li>{zakazi.to ? <Link to={zakazi.to} className="ist-footer-link">{t.nav.zakazi}</Link> : <a {...zakazi} className="ist-footer-link">{t.nav.zakazi}</a>}</li>
                            {poklon && <li><a {...poklon} className="ist-footer-link">{T.poklon}</a></li>}
                        </ul>
                    </nav>
                    <div>
                        <h2 className="ist-footer-naslov m-0">{T.footerInfo}</h2>
                        <p className="m-0 mt-[18px]">© {godina} {salon.naziv}. {t.footer.prava}</p>
                        <ul className="m-0 mt-1 flex list-none flex-wrap gap-x-[9px] gap-y-1 p-0">
                            {pravno.map(([kl, naziv]) => <li key={kl}><Link to={p(kl)} className="ist-footer-pravno">{naziv}</Link></li>)}
                            <li><button type="button" className="ist-footer-pravno" onClick={zaboraviPristanak}>{t.footer.podesavanjaKolacica}</button></li>
                        </ul>
                        <KarticePlacanja className="placanje-footer" />
                        <p className="ist-footer-firma m-0 mt-5 max-w-[34rem]">
                            {f.naziv} · {f.adresa} · {t.footer.pib} {f.pib} · {t.footer.mb} {f.maticniBroj}
                            {f.sifraDelatnosti && <> · {t.footer.delatnost} {f.sifraDelatnosti}</>}
                            {!f.pdvObveznik && <> · {t.footer.nijePdv}</>}
                        </p>
                    </div>
                    <div className="flex flex-col items-center justify-between gap-12 lg:items-end">
                        {mreze.length > 0 && (
                            <ul className={cx('m-0 flex list-none gap-[10px] p-0 lg:mt-[44px]')}>
                                {mreze.map(({ href, ime, Ikona }) => (
                                    <li key={href}><a href={href} target="_blank" rel="noopener noreferrer" aria-label={ime} className="ist-mreza ist-mreza-footer"><Ikona size={22} /></a></li>
                                ))}
                            </ul>
                        )}
                        <div className="hidden lg:block">{logoPlocica}</div>
                    </div>
                </div>
            </Kontejner>
            <div className="ist-footer-traka">
                <Kontejner className="flex h-full flex-wrap items-center justify-center gap-x-6 gap-y-1">
                    <IzborJezika className="ist-jezik ist-jezik-traka" />
                </Kontejner>
            </div>
        </footer>
    );
}
