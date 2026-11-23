import React from 'react';
import Hero from '../sekcije/Hero.jsx';
import { Brendovi, GalerijaTraka, Izjava, Recenzije, TimPregled, Usluge, Vaucer, ZastoMi, ZavrsniPoziv } from '../sekcije/Sekcije.jsx';

/*
 * Početna, odozgo nadole: hero → izjava i brojevi → usluge → brendovi (marquee)
 * → traka galerije → tim → zašto mi i koraci zakazivanja → recenzije → vaučer
 * → završni poziv. Sekcija bez podataka u salon.js se ne prikazuje.
 */
export default function Pocetna() {
    return (
        <>
            <Hero />
            <Izjava />
            <Usluge />
            <Brendovi />
            <GalerijaTraka />
            <TimPregled />
            <ZastoMi />
            <Recenzije />
            <Vaucer />
            <ZavrsniPoziv />
        </>
    );
}
