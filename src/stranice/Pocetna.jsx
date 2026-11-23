import React from 'react';
import { useSajt } from '../kontekst/Sajt.jsx';
import { komponenteTeme } from '../teme/registar.js';
import Hero from '../sekcije/Hero.jsx';
import { Brendovi, GalerijaTraka, Izjava, Recenzije, TimPregled, Usluge, Vaucer, ZastoMi, ZavrsniPoziv } from '../sekcije/Sekcije.jsx';

/*
 * Početna, odozgo nadole (podrazumevano): hero → izjava i brojevi → usluge →
 * brendovi (marquee) → traka galerije → tim → zašto mi i koraci zakazivanja →
 * recenzije → vaučer → završni poziv. Sekcija bez podataka u salon.js se ne
 * prikazuje. Tema može da zameni hero i ceo redosled (src/teme/<id>/komponente.jsx).
 */
export const PODRAZUMEVANE_SEKCIJE = [Izjava, Usluge, Brendovi, GalerijaTraka, TimPregled, ZastoMi, Recenzije, Vaucer, ZavrsniPoziv];

export default function Pocetna() {
    const { tema } = useSajt();
    const k = komponenteTeme(tema.id);
    const H = k.Hero ?? Hero;
    const sekcije = k.pocetna ?? PODRAZUMEVANE_SEKCIJE;
    return (
        <>
            <H />
            {sekcije.map((S, i) => <S key={i} />)}
        </>
    );
}
