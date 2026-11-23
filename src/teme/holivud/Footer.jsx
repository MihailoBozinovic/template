/*
 * Footer teme „holivud”: papir, tri kolone (stranice · mreže i kontakt ·
 * poruka salonu umesto newslettera), naslovi kolona u ručno crtanom fontu.
 * Telefon: polje za poruku prvo, pa harmonika (— / +), linija, mreže.
 * Ispod: podaci firme i pravne strane (obavezni po zakonu).
 */
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSajt } from '../../kontekst/Sajt.jsx';
import { zaboraviPristanak } from '../../lib/pristanak.js';
import { IkonaFacebook, IkonaInstagram, IkonaTikTok, cx } from '../../components/primitivi.jsx';
import { RadnoVremeTabela, StatusOtvoreno, KarticePlacanja } from '../../components/delovi.jsx';
import { HvJezici, VezaZakazi } from './Header.jsx';
import { useTekstovi } from './tekstovi.js';

const STRANICE = ['cenovnik', 'tim', 'galerija', 'oNama', 'kontakt', 'pitanja'];

const HvMreze = ({ className }) => {
    const { salon, t } = useSajt();
    const k = salon.kontakt;
    const stavke = [
        k.instagram && { href: k.instagram, ime: t.opste.instagram, Ikona: IkonaInstagram },
        k.facebook && { href: k.facebook, ime: t.opste.facebook, Ikona: IkonaFacebook },
        k.tiktok && { href: k.tiktok, ime: t.opste.tiktok, Ikona: IkonaTikTok },
    ].filter(Boolean);
    if (!stavke.length) return null;
    return (
        <ul className={cx('m-0 flex list-none gap-5 p-0', className)}>
            {stavke.map(({ href, ime, Ikona }) => (
                <li key={href}>
                    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={ime} className="hv-mreza">
                        <Ikona size={24} />
                    </a>
                </li>
            ))}
        </ul>
    );
};

const ListaStranica = () => {
    const { t, p } = useSajt();
    return (
        <ul className="hv-footer-lista m-0 list-none p-0">
            <li><VezaZakazi className="hv-footer-link">{t.nav.zakazi}</VezaZakazi></li>
            {STRANICE.map((k) => <li key={k}><Link to={p(k)} className="hv-footer-link">{t.nav[k]}</Link></li>)}
        </ul>
    );
};

const KontaktPodaci = () => {
    const { salon, tx } = useSajt();
    const l = salon.lokacija;
    const k = salon.kontakt;
    return (
        <div className="hv-footer-lista">
            <address className="not-italic">{l.adresa}<br />{l.postanskiBroj} {tx(l.grad)}</address>
            <p className="m-0 mt-2"><a href={`tel:${k.telefon}`} className="hv-footer-link">{k.telefonPrikaz}</a></p>
            {k.email && <p className="m-0"><a href={`mailto:${k.email}`} className="hv-footer-link break-all">{k.email}</a></p>}
        </div>
    );
};

const RadnoVreme = () => (
    <div className="hv-footer-lista">
        <RadnoVremeTabela className="max-w-[17rem] !gap-1" />
        <StatusOtvoreno className="mt-3" />
    </div>
);

/** Poruka salonu: otvara WhatsApp (ili e-mail) sa upisanim tekstom. */
const PorukaForma = () => {
    const { salon } = useSajt();
    const tk = useTekstovi();
    const [tekst, setTekst] = useState('');
    const k = salon.kontakt;
    const posalji = (e) => {
        e.preventDefault();
        const poruka = tekst.trim();
        if (!poruka) return;
        const url = k.whatsapp
            ? `https://wa.me/${k.whatsapp}?text=${encodeURIComponent(poruka)}`
            : k.email ? `mailto:${k.email}?body=${encodeURIComponent(poruka)}` : `tel:${k.telefon}`;
        window.open(url, '_blank', 'noopener');
    };
    return (
        <form onSubmit={posalji} className="hv-poruka relative" aria-describedby="hv-poruka-napomena">
            <label htmlFor="hv-poruka-polje" className="sr-only">{tk.porukaPolje}</label>
            <input
                id="hv-poruka-polje"
                type="text"
                value={tekst}
                onChange={(e) => setTekst(e.target.value)}
                placeholder={tk.porukaPolje}
                autoComplete="off"
                className="hv-poruka-polje"
            />
            <button type="submit" className="hv-poruka-dugme">{tk.posalji}</button>
            <p id="hv-poruka-napomena" className="sr-only">{tk.porukaNapomena}</p>
        </form>
    );
};

const Harmonika = ({ naslov, children }) => (
    <details className="hv-harmonika">
        <summary>
            <span>{naslov}</span>
            <span className="hv-znak" aria-hidden="true" />
        </summary>
        <div className="pb-6">{children}</div>
    </details>
);

export default function Footer() {
    const { salon, t } = useSajt();
    const tk = useTekstovi();
    const f = salon.firma;
    const godina = new Date().getFullYear();
    const p = useSajt().p;

    return (
        <footer className="hv-footer mt-auto bg-paper text-ink">
            <div className="kontejner hv-footer-gore">
                <div className="hv-footer-mreza grid">
                    {/* Desktop kolona 1: stranice */}
                    <nav aria-label={t.footer.navigacija} className="hidden md:block">
                        <h2 className="hv-footer-naslov">{t.footer.navigacija}</h2>
                        <ListaStranica />
                    </nav>
                    {/* Desktop kolona 2: mreže, kontakt, radno vreme */}
                    <div className="hidden md:block">
                        <h2 className="hv-footer-naslov">{tk.pratite}</h2>
                        <HvMreze />
                        <div className="mt-8"><KontaktPodaci /></div>
                        <div className="mt-6"><RadnoVreme /></div>
                    </div>
                    {/* Kolona 3 (na telefonu prva): poruka salonu + jezik */}
                    <div className="order-first md:order-none">
                        <h2 className="hv-footer-naslov">{tk.porukaNaslov}</h2>
                        <PorukaForma />
                        <div className="hv-footer-jezik mt-8">
                            <span>{tk.jezik}:</span>
                            <HvJezici klasaLinka="hv-jezik-link" />
                        </div>
                    </div>
                    {/* Telefon: harmonika, linija, mreže */}
                    <div className="hv-footer-telefon md:hidden">
                        <Harmonika naslov={t.footer.navigacija}><ListaStranica /></Harmonika>
                        <Harmonika naslov={t.kontakt.nadnaslov}><KontaktPodaci /></Harmonika>
                        <Harmonika naslov={t.kontakt.radnoVreme}><RadnoVreme /></Harmonika>
                        <HvMreze className="hv-footer-mreze-telefon" />
                    </div>
                </div>
            </div>

            <div className="kontejner hv-footer-dno">
                <KarticePlacanja className="placanje-footer" />
                <p className="m-0 max-w-3xl">
                    {f.naziv} · {f.adresa} · {t.footer.pib} {f.pib} · {t.footer.mb} {f.maticniBroj}
                    {f.sifraDelatnosti && <> · {t.footer.delatnost} {f.sifraDelatnosti}</>}
                    {!f.pdvObveznik && <> · {t.footer.nijePdv}</>}
                    <br />© {godina} {salon.naziv}. {t.footer.prava}
                </p>
                <ul className="m-0 flex list-none flex-wrap gap-x-5 gap-y-2 p-0">
                    <li><Link to={p('privatnost')} className="hv-footer-link">{t.seo.privatnost({ naziv: '' }).replace(/ — $/, '')}</Link></li>
                    <li><Link to={p('uslovi')} className="hv-footer-link">{t.seo.uslovi({ naziv: '' }).replace(/ — $/, '')}</Link></li>
                    <li><Link to={p('kolacici')} className="hv-footer-link">{t.seo.kolacici({ naziv: '' }).replace(/ — $/, '')}</Link></li>
                    <li><button type="button" className="hv-footer-link" onClick={zaboraviPristanak}>{t.footer.podesavanjaKolacica}</button></li>
                </ul>
            </div>
        </footer>
    );
}
