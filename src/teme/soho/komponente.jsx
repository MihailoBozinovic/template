/*
 * Komponente teme „soho”. Sve što se ovde izveze zamenjuje podrazumevanu
 * komponentu, samo kad je ova tema aktivna (src/teme/registar.js):
 *   Header, Footer, Hero, pocetna (niz sekcija početne strane, redom), ZaglavljeStranice
 *
 * Fontovi (Bodoni Moda 400 + kurziv, Playfair Display za ćirilicu, Inter)
 * već su uvezeni u src/fontovi.js.
 */
import './tema.css';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import {
    BrendoviS, GalerijaS, HeroS, InstagramS, KoraciS, MonogramS, PozivS, RecenzijeS, TimS, UslugeS, UvodS, ZastoS, ZaglavljeStraniceS,
} from './Sekcije.jsx';

export default {
    Header,
    Footer,
    Hero: HeroS,
    pocetna: [UvodS, UslugeS, GalerijaS, TimS, ZastoS, KoraciS, RecenzijeS, BrendoviS, PozivS, InstagramS, MonogramS],
    ZaglavljeStranice: ZaglavljeStraniceS,
};
