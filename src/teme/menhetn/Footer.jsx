/*
 * Footer teme „menhetn” (`footer: 'kompaktan'`): maslinast, bez CTA bloka.
 * Kolone na 150 / 378 / 606 / 834 px (po 228 px): mreže | stranice | pravne
 * stranice | kontakt, logo desno; ispod podaci o firmi, jezik i copyright desno.
 */
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSajt } from '../../kontekst/Sajt.jsx';
import { zaboraviPristanak } from '../../lib/pristanak.js';
import { kljucIzPutanje } from '../../i18n/jezici.js';
import { Kontejner, cx } from '../../components/primitivi.jsx';
import { IzborJezika, KarticePlacanja } from '../../components/delovi.jsx';
import { LogoMenhetn } from './Header.jsx';
import { tekstovi } from './tekstovi.js';

const Kolona = ({ naslov, children, className, as: Tag = 'div', ...o }) => (
    <Tag className={className} {...o}>
        {naslov ? <p className="mh-footer-naslov m-0">{naslov}</p> : <span className="mh-footer-naslov hidden lg:block" aria-hidden="true">&nbsp;</span>}
        <ul className="m-0 mt-[18px] list-none space-y-[2px] p-0">{children}</ul>
    </Tag>
);

export default function FooterMenhetn() {
    const { salon, t, tx, p, jezik } = useSajt();
    const tt = tekstovi(jezik);
    const k = salon.kontakt;
    const l = salon.lokacija;
    const f = salon.firma;
    const godina = new Date().getFullYear();
    // Na zakazivanju (telefon) dno ekrana drži fiksna traka koraka — footer mora da se vidi iznad nje.
    const naZakazivanju = kljucIzPutanje(useLocation().pathname) === 'zakazivanje';
    const mreze = [
        k.instagram && { href: k.instagram, ime: t.opste.instagram },
        k.facebook && { href: k.facebook, ime: t.opste.facebook },
        k.tiktok && { href: k.tiktok, ime: t.opste.tiktok },
    ].filter(Boolean);
    const pravno = (kljuc) => t.seo[kljuc]({ naziv: '' }).replace(/ — $/, '');

    return (
        <footer className="mh-footer mt-auto bg-tamna text-white">
            <Kontejner className={cx('pt-[60px] md:pt-[80px]', naZakazivanju ? 'pb-[120px] lg:pb-10' : 'pb-10')}>
                <div className="grid grid-cols-2 gap-x-5 gap-y-[60px] lg:grid-cols-5 lg:gap-x-0 lg:gap-y-10">
                    {mreze.length > 0 && (
                        <Kolona naslov={tt.pratite}>
                            {mreze.map((m) => <li key={m.href}><a href={m.href} target="_blank" rel="noopener noreferrer" className="mh-footer-link">{m.ime}</a></li>)}
                        </Kolona>
                    )}
                    <Kolona as="nav" naslov={tt.stranice} aria-label={t.footer.navigacija}>
                        {['cenovnik', 'tim', 'galerija', 'oNama', 'kontakt', 'pitanja'].map((kl) => (
                            <li key={kl}><Link to={p(kl)} className="mh-footer-link">{t.nav[kl]}</Link></li>
                        ))}
                    </Kolona>
                    <Kolona>
                        <li><Link to={p('privatnost')} className="mh-footer-link">{pravno('privatnost')}</Link></li>
                        <li><Link to={p('uslovi')} className="mh-footer-link">{pravno('uslovi')}</Link></li>
                        <li><Link to={p('kolacici')} className="mh-footer-link">{pravno('kolacici')}</Link></li>
                        <li><button type="button" className="mh-footer-link text-left" onClick={zaboraviPristanak}>{t.footer.podesavanjaKolacica}</button></li>
                    </Kolona>
                    <Kolona naslov={tt.kontakt}>
                        <li>{l.adresa}, {l.postanskiBroj} {tx(l.grad)}</li>
                        <li><a href={`tel:${k.telefon}`} className="mh-footer-link">{k.telefonPrikaz}</a></li>
                        {k.email && <li><a href={`mailto:${k.email}`} className="mh-footer-link break-all">{k.email}</a></li>}
                    </Kolona>
                    <div className="col-span-2 flex lg:col-span-1 lg:justify-end">
                        <LogoMenhetn veliki />
                    </div>
                </div>

                <div className="mt-12 flex flex-col gap-6 lg:mt-10 lg:flex-row lg:items-end lg:justify-between">
                    <div className="mh-footer-sitno max-w-[640px] space-y-3">
                        <KarticePlacanja className="placanje-footer" />
                        <p className="m-0">
                            {f.naziv} · {f.adresa} · {t.footer.pib} {f.pib} · {t.footer.mb} {f.maticniBroj}
                            {f.sifraDelatnosti && <> · {t.footer.delatnost} {f.sifraDelatnosti}</>}
                            {!f.pdvObveznik && <> · {t.footer.nijePdv}</>}
                        </p>
                        <IzborJezika className="-ml-1.5" />
                    </div>
                    <p className="mh-copyright m-0 lg:text-right">© {godina} {salon.naziv}. {t.footer.prava}</p>
                </div>
            </Kontejner>
        </footer>
    );
}
