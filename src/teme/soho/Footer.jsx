/*
 * Footer teme „soho”: tamna tinta #1E1E1E, sve centrirano. Gore VERZAL naslov,
 * pasus i blok u obliku forme sa reference (polja sa krem okvirom = načini
 * kontakta, puno krem dugme = zakazivanje), ikone mreža; krem linija; četiri
 * centrirane kolone sa crticom; linija; donji red levo / sredina / desno.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import { useSajt } from '../../kontekst/Sajt.jsx';
import { zaboraviPristanak } from '../../lib/pristanak.js';
import { grupisanoRadnoVreme } from '../../lib/vreme.js';
import { IkonaFacebook, IkonaInstagram, IkonaTikTok, Kontejner } from '../../components/primitivi.jsx';
import { useZakaziLink } from '../../components/Header.jsx';
import { IzborJezika, KarticePlacanja } from '../../components/delovi.jsx';
import { Veza, useT } from './delovi.jsx';

const Kolona = ({ naslov, children }) => (
    <div className="soho-footer-kolona">
        <p className="soho-footer-kolona-naslov">{naslov}</p>
        {children}
    </div>
);

export default function FooterSoho() {
    const { salon, t, tx, p } = useSajt();
    const T = useT();
    const zakazi = useZakaziLink();
    const k = salon.kontakt;
    const l = salon.lokacija;
    const f = salon.firma;
    const godina = new Date().getFullYear();
    const mapa = l.googleMape || `https://www.google.com/maps/search/?api=1&query=${l.koordinate.lat},${l.koordinate.lng}`;
    const mreze = [
        k.facebook && { href: k.facebook, ime: t.opste.facebook, Ikona: IkonaFacebook },
        k.instagram && { href: k.instagram, ime: t.opste.instagram, Ikona: IkonaInstagram },
        k.tiktok && { href: k.tiktok, ime: t.opste.tiktok, Ikona: IkonaTikTok },
    ].filter(Boolean);
    const polja = [
        k.telefon && { href: `tel:${k.telefon}`, tekst: `${t.opste.pozovite} · ${k.telefonPrikaz}` },
        k.whatsapp ? { href: `https://wa.me/${k.whatsapp}`, target: '_blank', rel: 'noopener noreferrer', tekst: t.opste.whatsapp }
            : k.viber && { href: `viber://chat?number=%2B${k.viber}`, tekst: t.opste.viber },
    ].filter(Boolean);
    const dani = (g) => (g.dani.length > 2 ? `${t.dani.kratko[g.dani[0]]} – ${t.dani.kratko[g.dani[g.dani.length - 1]]}` : g.dani.map((d) => t.dani.kratko[d]).join(', '));

    return (
        <footer className="soho-footer">
            <Kontejner className="soho-footer-vrh">
                <h2 className="naslov soho-footer-naslov m-0">{t.footer.zakaziNaslov}</h2>
                <p className="soho-footer-uvod">{tx(salon.opis)}</p>
                <div className="soho-footer-forma">
                    {polja.map(({ tekst, ...v }) => <a key={tekst} {...v} className="soho-footer-polje">{tekst}</a>)}
                    {k.email && <a href={`mailto:${k.email}`} className="soho-footer-polje soho-footer-polje--puno">{k.email}</a>}
                    <Veza {...zakazi} className="soho-footer-posalji">{t.nav.zakazi}</Veza>
                </div>
                {mreze.length > 0 && (
                    <ul className="soho-footer-mreze">
                        {mreze.map(({ href, ime, Ikona }) => (
                            <li key={href}><a href={href} target="_blank" rel="noopener noreferrer" aria-label={ime}><Ikona size={22} /></a></li>
                        ))}
                    </ul>
                )}
            </Kontejner>

            <Kontejner>
                <div className="soho-footer-kolone">
                    <Kolona naslov={T.footerKontakt}>
                        <p>{T.footerOnline} <Veza {...zakazi} className="soho-footer-podvuceno">{T.footerOvde}</Veza>,<br />{T.footerIli}</p>
                        {k.telefon && <p><a href={`tel:${k.telefon}`} className="soho-footer-link">{T.tel}: {k.telefonPrikaz}</a></p>}
                        {k.email && <p><a href={`mailto:${k.email}`} className="soho-footer-link">{T.email}: {k.email}</a></p>}
                    </Kolona>
                    <Kolona naslov={T.footerAdresa}>
                        <address>{l.adresa},<br />{l.postanskiBroj} {tx(l.grad)}</address>
                        <p><a href={mapa} target="_blank" rel="noopener noreferrer" className="soho-footer-link">{T.footerKarta}</a></p>
                    </Kolona>
                    <Kolona naslov={t.kontakt.radnoVreme}>
                        <ul className="soho-footer-vreme">
                            {grupisanoRadnoVreme(salon).map((g) => (
                                <li key={g.dani.join()}>{dani(g)}: {g.vreme ? `${g.vreme[0]} – ${g.vreme[1]}` : t.opste.neradi}</li>
                            ))}
                        </ul>
                    </Kolona>
                    <nav aria-label={t.footer.navigacija}>
                        <Kolona naslov={t.footer.navigacija}>
                            <ul className="soho-footer-linkovi">
                                {['cenovnik', 'tim', 'galerija', 'oNama', 'kontakt', 'pitanja'].map((kl) => (
                                    <li key={kl}><Link to={p(kl)} className="soho-footer-link">{t.nav[kl]}</Link></li>
                                ))}
                            </ul>
                        </Kolona>
                    </nav>
                </div>

                <div className="soho-footer-dno">
                    <p>© {godina} {salon.naziv}. {t.footer.prava}</p>
                    <ul>
                        <li><Link to={p('uslovi')} className="soho-footer-link">{t.seo.uslovi({ naziv: '' }).replace(/ — $/, '')}</Link></li>
                        <li><Link to={p('privatnost')} className="soho-footer-link">{t.seo.privatnost({ naziv: '' }).replace(/ — $/, '')}</Link></li>
                        <li><Link to={p('kolacici')} className="soho-footer-link">{t.seo.kolacici({ naziv: '' }).replace(/ — $/, '')}</Link></li>
                        <li><button type="button" className="soho-footer-link" onClick={zaboraviPristanak}>{t.footer.podesavanjaKolacica}</button></li>
                    </ul>
                    <IzborJezika className="soho-footer-jezici" />
                    <KarticePlacanja className="placanje-footer" />
                    <p className="soho-footer-firma">
                        {f.naziv} · {f.adresa} · {t.footer.pib} {f.pib} · {t.footer.mb} {f.maticniBroj}
                        {f.sifraDelatnosti && <> · {t.footer.delatnost} {f.sifraDelatnosti}</>}
                        {!f.pdvObveznik && <> · {t.footer.nijePdv}</>}
                    </p>
                </div>
            </Kontejner>
        </footer>
    );
}
