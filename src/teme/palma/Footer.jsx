/*
 * Footer teme „palma”: tamna traka prednosti (4 kolone sa vertikalnim
 * linijama; telefon: karusel sa crticama), zatim tri kolone, ogroman logo
 * preko cele širine kontejnera i red sa © i pravnim linkovima (12.8 px).
 */
import React, { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CalendarCheck, Clock, MessageCircle, Sparkles } from 'lucide-react';
import { useSajt } from '../../kontekst/Sajt.jsx';
import { kljucIzPutanje } from '../../i18n/jezici.js';
import { zaboraviPristanak } from '../../lib/pristanak.js';
import { javno } from '../../lib/baza.js';
import { Dugme, Kontejner, Pojava, cx } from '../../components/primitivi.jsx';
import { RadnoVremeTabela, StatusOtvoreno, KarticePlacanja } from '../../components/delovi.jsx';
import { useZakaziLink } from '../../components/Header.jsx';
import { tekstovi } from './tekstovi.js';

const IKONE = [MessageCircle, Sparkles, Clock, CalendarCheck];

/* ── Traka prednosti ─────────────────────────────────────────────────── */
export const TrakaPrednosti = () => {
    const { salon, tx, jezik } = useSajt();
    const tk = tekstovi(jezik);
    const listaRef = useRef(null);
    const [aktivna, setAktivna] = useState(0);
    const stavke = [
        ...(salon.pocetna.zastoMi ?? []).slice(0, 3).map((s) => ({ naslov: tx(s.naslov), tekst: tx(s.tekst) })),
        tk.prednostZakazivanje,
    ];
    useEffect(() => {
        const el = listaRef.current;
        if (!el) return undefined;
        const naSkrol = () => setAktivna(Math.round(el.scrollLeft / Math.max(1, el.clientWidth)));
        el.addEventListener('scroll', naSkrol, { passive: true });
        return () => el.removeEventListener('scroll', naSkrol);
    }, []);
    const idi = (i) => {
        const el = listaRef.current;
        if (el) el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' });
    };
    return (
        <section className="p-traka" aria-label={tk.prednosti}>
            <ul ref={listaRef} className="p-traka-lista skriven-skrol m-0 list-none p-0">
                {stavke.map((s, i) => {
                    const Ikona = IKONE[i % IKONE.length];
                    return (
                        <li key={i} className="p-traka-stavka" aria-label={tk.stavka(i + 1, stavke.length)}>
                            <Pojava i={i} className="p-ikonica"><Ikona size={24} strokeWidth={1} aria-hidden="true" /></Pojava>
                            <h3 className="p-traka-naslov m-0">{s.naslov}</h3>
                            <p className="p-traka-tekst m-0">{s.tekst}</p>
                        </li>
                    );
                })}
            </ul>
            <div className="p-crtice md:hidden">
                {stavke.map((_, i) => (
                    <button key={i} type="button" className={cx('p-crtica', i === aktivna && 'aktivna')} aria-label={tk.stavka(i + 1, stavke.length)} aria-current={i === aktivna ? 'true' : undefined} onClick={() => idi(i)} />
                ))}
            </div>
        </section>
    );
};

/* ── Logo preko cele širine kontejnera (tekst se meri i razvlači do ivica) ── */
const VelikiLogo = () => {
    const { salon } = useSajt();
    const ref = useRef(null);
    useEffect(() => {
        const okvir = ref.current;
        const tekst = okvir?.querySelector('span');
        if (!okvir || !tekst) return undefined;
        const uklopi = () => {
            tekst.style.fontSize = '100px';
            const w = tekst.getBoundingClientRect().width;
            if (w > 0) tekst.style.fontSize = `${(100 * okvir.clientWidth / w).toFixed(2)}px`;
        };
        uklopi();
        document.fonts?.ready?.then(uklopi);
        const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(uklopi) : null;
        ro?.observe(okvir);
        return () => ro?.disconnect();
    }, [salon.naziv]);
    if (salon.logo) return <img src={javno(salon.logo)} alt="" className="p-veliki-logo-slika" aria-hidden="true" />;
    return (
        <div ref={ref} className="p-veliki-logo" aria-hidden="true" style={{ '--slova': [...salon.naziv].length }}>
            <span>{salon.naziv}</span>
        </div>
    );
};

export default function PalmaFooter() {
    const { salon, t, tx, p, jezik } = useSajt();
    const tk = tekstovi(jezik);
    const zakazi = useZakaziLink();
    const f = salon.firma;
    const l = salon.lokacija;
    const k = salon.kontakt;
    const godina = new Date().getFullYear();
    const naZakazivanju = kljucIzPutanje(useLocation().pathname) === 'zakazivanje';
    const pravno = (kljuc) => t.seo[kljuc]({ naziv: '' }).replace(/ — $/, '');

    return (
        <footer className="p-footer mt-auto">
            <TrakaPrednosti />
            <Kontejner className="p-footer-kolone">
                <div className="p-footer-prijava">
                    <p className="m-0">{tk.footerTekst}</p>
                    <div className="p-footer-forma">
                        <a href={`tel:${k.telefon}`} className="p-polje" aria-label={`${tk.footerTelefon}: ${k.telefonPrikaz}`}>{k.telefonPrikaz}</a>
                        {!naZakazivanju && <Dugme {...zakazi} varijanta="foto" strelica={false}>{t.nav.zakazi}</Dugme>}
                    </div>
                    <p className="p-prigusen m-0">{tk.footerNapomena}</p>
                </div>
                <nav aria-label={t.footer.navigacija} className="p-footer-kolona">
                    <p className="p-prigusen m-0">{t.footer.navigacija}</p>
                    <ul className="p-gasi m-0 list-none p-0">
                        {['cenovnik', 'tim', 'galerija', 'oNama', 'zakazivanje', 'kontakt', 'pitanja'].map((kl) => (
                            <li key={kl}><Link to={p(kl)} className="p-footer-link">{kl === 'zakazivanje' ? t.nav.zakazi : t.nav[kl]}</Link></li>
                        ))}
                    </ul>
                </nav>
                <div className="p-footer-kolona">
                    <p className="p-prigusen m-0">{t.kontakt.nadnaslov}</p>
                    <ul className="p-gasi m-0 list-none p-0">
                        <li><a href={l.googleMape || `https://www.google.com/maps/search/?api=1&query=${l.koordinate.lat},${l.koordinate.lng}`} target="_blank" rel="noopener noreferrer" className="p-footer-link">{l.adresa}, {tx(l.grad)}</a></li>
                        <li><a href={`tel:${k.telefon}`} className="p-footer-link">{k.telefonPrikaz}</a></li>
                        {k.email && <li><a href={`mailto:${k.email}`} className="p-footer-link break-all">{k.email}</a></li>}
                        {k.instagram && <li><a href={k.instagram} target="_blank" rel="noopener noreferrer" className="p-footer-link">{t.opste.instagram}</a></li>}
                        {k.facebook && <li><a href={k.facebook} target="_blank" rel="noopener noreferrer" className="p-footer-link">{t.opste.facebook}</a></li>}
                        {k.tiktok && <li><a href={k.tiktok} target="_blank" rel="noopener noreferrer" className="p-footer-link">{t.opste.tiktok}</a></li>}
                    </ul>
                </div>
                <div className="p-footer-kolona">
                    <p className="p-prigusen m-0">{t.kontakt.radnoVreme}</p>
                    <RadnoVremeTabela className="p-radno-vreme" />
                    <StatusOtvoreno className="p-prigusen" />
                </div>
            </Kontejner>

            <Kontejner className="p-footer-logo">
                <VelikiLogo />
            </Kontejner>

            <Kontejner className="p-footer-dno">
                <KarticePlacanja className="placanje-footer" />
                <p className="m-0">
                    © {godina} {salon.naziv}. {t.footer.prava}
                    <span className="p-prigusen block">
                        {f.naziv} · {f.adresa} · {t.footer.pib} {f.pib} · {t.footer.mb} {f.maticniBroj}
                        {f.sifraDelatnosti && <> · {t.footer.delatnost} {f.sifraDelatnosti}</>}
                        {!f.pdvObveznik && <> · {t.footer.nijePdv}</>}
                    </span>
                </p>
                <ul className="p-gasi m-0 flex list-none flex-wrap gap-x-6 gap-y-2 p-0">
                    <li><Link to={p('privatnost')} className="p-footer-link">{pravno('privatnost')}</Link></li>
                    <li><Link to={p('uslovi')} className="p-footer-link">{pravno('uslovi')}</Link></li>
                    <li><Link to={p('kolacici')} className="p-footer-link">{pravno('kolacici')}</Link></li>
                    <li><button type="button" className="p-footer-link" onClick={zaboraviPristanak}>{t.footer.podesavanjaKolacica}</button></li>
                </ul>
            </Kontejner>
        </footer>
    );
}
