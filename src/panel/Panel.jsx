/*
 * PANEL — rute administrativnog panela (/panel/*). Učitava se zasebno od
 * sajta (src/entry-client.jsx), samo kad se otvori /panel.
 */
import React, { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import './panel.css';
import { salon } from '../config/salon.js';
import { PanelProvider, usePanel } from './podaci/Skladiste.jsx';
import { TerminiProvider } from './termini.jsx';
import { ruteUloge, STAVKE } from './meni.js';
import Ljuska, { P } from './Ljuska.jsx';
import Prijava from './Prijava.jsx';
import { Prazno, Dugme } from './ui.jsx';
import { ShieldOff } from 'lucide-react';

import Pocetna from './stranice/Pocetna.jsx';
import Kalendar from './stranice/Kalendar.jsx';
import Zahtevi from './stranice/Zahtevi.jsx';
import ListaCekanja from './stranice/ListaCekanja.jsx';
import NoviTerminStrana from './stranice/NoviTerminStrana.jsx';
import DnevniPromet from './stranice/DnevniPromet.jsx';
import Analitika from './stranice/Analitika.jsx';
import Popunjenost from './stranice/Popunjenost.jsx';
import Ocene from './stranice/Ocene.jsx';
import Klijenti from './stranice/Klijenti.jsx';
import KlijentDetalj from './stranice/KlijentDetalj.jsx';
import Kartoteka from './stranice/Kartoteka.jsx';
import Otkazivanja from './stranice/Otkazivanja.jsx';
import Raspored from './stranice/Raspored.jsx';
import Odsustva from './stranice/Odsustva.jsx';
import Osoblje from './stranice/Osoblje.jsx';
import Zarade from './stranice/Zarade.jsx';
import Usluge from './stranice/Usluge.jsx';
import Proizvodi from './stranice/Proizvodi.jsx';
import Vauceri from './stranice/Vauceri.jsx';
import PromoKodovi from './stranice/PromoKodovi.jsx';
import Sms from './stranice/Sms.jsx';
import IzgledSajta from './stranice/IzgledSajta.jsx';
import Galerija from './stranice/Galerija.jsx';
import PodaciSalona from './stranice/PodaciSalona.jsx';
import RadnoVreme from './stranice/RadnoVreme.jsx';
import Podesavanja from './stranice/Podesavanja.jsx';
import Dnevnik from './stranice/Dnevnik.jsx';
import Profil from './stranice/Profil.jsx';

const STRANICE = {
    kalendar: Kalendar, zahtevi: Zahtevi, 'lista-cekanja': ListaCekanja, 'novi-termin': NoviTerminStrana, 'dnevni-promet': DnevniPromet,
    analitika: Analitika, popunjenost: Popunjenost, ocene: Ocene, klijenti: Klijenti, kartoteka: Kartoteka, otkazivanja: Otkazivanja,
    raspored: Raspored, odsustva: Odsustva, osoblje: Osoblje, zarade: Zarade, usluge: Usluge, proizvodi: Proizvodi,
    vauceri: Vauceri, 'promo-kodovi': PromoKodovi, sms: Sms, 'izgled-sajta': IzgledSajta, galerija: Galerija,
    'podaci-salona': PodaciSalona, 'radno-vreme': RadnoVreme, podesavanja: Podesavanja, dnevnik: Dnevnik, profil: Profil,
};

// Prva stavka sa tom rutom daje naslov („Kalendar”, ne „Moji termini”).
const NASLOVI = Object.fromEntries(Object.values(STAVKE).reverse().map((s) => [s.ruta, s.naziv]));

/** Naslov taba i noindex — panel nikad ne ide u pretraživače. */
function Naslov() {
    const { pathname } = useLocation();
    useEffect(() => {
        const ruta = pathname.replace(/^\/panel\/?/, '').split('/')[0];
        document.title = `${ruta === 'prijava' ? 'Prijava' : NASLOVI[ruta] ?? 'Panel'} · Panel · ${salon.naziv}`;
        let m = document.querySelector('meta[name="robots"]');
        if (!m) { m = document.createElement('meta'); m.name = 'robots'; document.head.appendChild(m); }
        m.content = 'noindex, nofollow';
    }, [pathname]);
    return null;
}

const NemaPristupa = () => (
    <Prazno ikona={ShieldOff} naslov="Ova stranica nije za vašu ulogu" opis="U pravom panelu svaka uloga vidi samo svoje stranice. Promenite ulogu u meniju naloga (gore desno)." akcija={<Dugme varijanta="glavno" to={P}>Na početnu</Dugme>} className="py-20" />
);

function Zasticeno({ ruta, children }) {
    const { sesija } = usePanel();
    if (!sesija) return <Navigate to={`${P}/prijava`} replace />;
    if (ruta && !ruteUloge(sesija.uloga).has(ruta) && ruta !== 'profil') return <Ljuska><NemaPristupa /></Ljuska>;
    return <Ljuska>{children}</Ljuska>;
}

function Rute() {
    useEffect(() => {
        document.documentElement.classList.add('panel');
        return () => document.documentElement.classList.remove('panel');
    }, []);
    return (
        <>
            <Naslov />
            <Routes>
                <Route path={`${P}/prijava`} element={<Prijava />} />
                <Route path={P} element={<Zasticeno><Pocetna /></Zasticeno>} />
                <Route path={`${P}/klijenti/:id`} element={<Zasticeno ruta="klijenti"><KlijentDetalj /></Zasticeno>} />
                {Object.entries(STRANICE).map(([ruta, S]) => <Route key={ruta} path={`${P}/${ruta}`} element={<Zasticeno ruta={ruta}><S /></Zasticeno>} />)}
                <Route path="*" element={<Navigate to={P} replace />} />
            </Routes>
        </>
    );
}

export default function Panel() {
    return (
        <PanelProvider>
            <TerminiProvider>
                <Rute />
            </TerminiProvider>
        </PanelProvider>
    );
}
