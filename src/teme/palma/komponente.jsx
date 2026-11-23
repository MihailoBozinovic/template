/*
 * Komponente teme „palma” (po uzoru na Palm Sunday). Sve što se ovde izveze
 * zamenjuje podrazumevanu komponentu, samo kad je ova tema aktivna
 * (src/teme/registar.js): Header, Footer, Hero, pocetna, ZaglavljeStranice.
 */
import React from 'react';
import '@fontsource/oswald/600.css';
import './tema.css';
import { Foto, Kontejner, Naslov, Pojava, cx } from '../../components/primitivi.jsx';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import { PalmaHero, SEKCIJE } from './Pocetna.jsx';

/** Naslov podstranice: nadnaslov sa kvadratom, h1 u „prikaz L”, sitan verzal uvod. */
function ZaglavljeStranice({ nadnaslov, naslov, akcenat, uvod, slika, children, className }) {
    return (
        <header className={cx('p-zaglavlje', className)}>
            <Kontejner className={cx('grid gap-10', slika && 'lg:grid-cols-12 lg:items-end')}>
                <div className={slika ? 'lg:col-span-7' : 'max-w-5xl'}>
                    {nadnaslov && <p className="nadnaslov p-kvadrat m-0 mb-6 md:mb-8">{nadnaslov}</p>}
                    <Naslov as="h1" nivo={1} tekst={naslov} akcenat={akcenat} odmah />
                    {uvod && <Pojava as="p" className="tekst-uvod m-0 mt-6 max-w-xl md:mt-8">{uvod}</Pojava>}
                    {children}
                </div>
                {slika && (
                    <Pojava className="lg:col-span-5">
                        <Foto src={slika} alt="" okvirKlasa="aspect-[4/5]" prioritet />
                    </Pojava>
                )}
            </Kontejner>
        </header>
    );
}

export default { Header, Footer, Hero: PalmaHero, pocetna: SEKCIJE, ZaglavljeStranice };
