/*
 * Komponente teme „menhetn” (po uzoru na Yukie Natori New York). Sve što se
 * ovde izveze zamenjuje podrazumevanu komponentu, samo kad je ova tema aktivna
 * (src/teme/registar.js). Specifikacija: docs/teme/menhetn.md
 */
import '@fontsource/manrope/700.css';
import './tema.css';
import Header from './Header.jsx';
import Hero from './Hero.jsx';
import Footer from './Footer.jsx';
import ZaglavljeStranice from './Zaglavlje.jsx';
import { BrendoviMenhetn, FormaZahteva, PodeljeneSekcije, PozivTraka, SalonTraka, TimKarusel, UslugeMenhetn, UtisciRedovi } from './Sekcije.jsx';

export default {
    Header,
    Hero,
    Footer,
    ZaglavljeStranice,
    pocetna: [UslugeMenhetn, BrendoviMenhetn, SalonTraka, TimKarusel, PodeljeneSekcije, UtisciRedovi, PozivTraka, FormaZahteva],
};
