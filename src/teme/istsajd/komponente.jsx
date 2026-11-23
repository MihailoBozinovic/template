/*
 * Komponente teme „istsajd” (po uzoru na Fringe Salon NY). Sve što se ovde
 * izveze zamenjuje podrazumevanu komponentu samo kad je ova tema aktivna
 * (src/teme/registar.js). Specifikacija: docs/teme/istsajd.md
 */
import '@fontsource/cormorant-infant/400.css';
import '@fontsource/cormorant-infant/500.css';
import '@fontsource/cormorant-infant/700.css';
import '@fontsource/onest/700.css';
import './tema.css';
import Header from './Header.jsx';
import Hero from './Hero.jsx';
import Footer from './Footer.jsx';
import { POCETNA_IST, ZaglavljeStraniceIst } from './Sekcije.jsx';

export default {
    Header,
    Hero,
    Footer,
    pocetna: POCETNA_IST,
    ZaglavljeStranice: ZaglavljeStraniceIst,
};
