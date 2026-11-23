/*
 * Komponente teme „holivud”. Sve što se ovde izveze zamenjuje podrazumevanu
 * komponentu, samo kad je ova tema aktivna (src/teme/registar.js):
 *   Header, Footer, Hero, pocetna (niz sekcija početne strane, redom), ZaglavljeStranice
 * Specifikacija: docs/teme/holivud.md
 */
import '@fontsource/amatic-sc/400.css';
import '@fontsource/amatic-sc/700.css';
import './tema.css';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import ZaglavljeStranice from './ZaglavljeStranice.jsx';
import { Hero, POCETNA } from './Pocetna.jsx';

export default { Header, Footer, Hero, pocetna: POCETNA, ZaglavljeStranice };
