/*
 * SKLADIŠTE PANELA — stanje demo panela, bez servera.
 *
 * Sve izmene (novi termin, cena, smena, vaučer…) ostaju u ovom browseru
 * (localStorage) dok se ne klikne „Vrati demo podatke” ili ne promeni dan:
 * tada se podaci prave iznova oko novog današnjeg dana.
 *
 * Kad se panel bude vezivao za pravi API, ovaj fajl je jedino mesto koje se
 * menja: stranice čitaju `usePanel()` i zovu `dodaj / izmeni / obrisi`.
 */
import React, { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import { salon } from '../../config/salon.js';
import { napraviPodatke, VERZIJA_PODATAKA } from './generator.js';
import { danas as danasDatum } from '../format.js';

const KLJUC = 'panel-demo-podaci';
const KLJUC_SESIJE = 'panel-demo-sesija';
const KLJUC_TAMNO = 'panel-tamno';

const citaj = (k) => { try { return JSON.parse(localStorage.getItem(k) || 'null'); } catch { return null; } };
const pisi = (k, v) => { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, JSON.stringify(v)); } catch { /* pun ili zabranjen */ } };

const pocetniPodaci = () => {
    const sacuvano = citaj(KLJUC);
    if (sacuvano?.verzija === VERZIJA_PODATAKA && sacuvano.datum === danasDatum()) return sacuvano;
    return napraviPodatke(salon);
};

const reducer = (stanje, a) => {
    switch (a.tip) {
        case 'dodaj': return { ...stanje, [a.kolekcija]: [a.stavka, ...stanje[a.kolekcija]] };
        case 'izmeni': return { ...stanje, [a.kolekcija]: stanje[a.kolekcija].map((x) => (x.id === a.id ? { ...x, ...(typeof a.izmena === 'function' ? a.izmena(x) : a.izmena) } : x)) };
        case 'obrisi': return { ...stanje, [a.kolekcija]: stanje[a.kolekcija].filter((x) => x.id !== a.id) };
        case 'postavi': return { ...stanje, [a.kljuc]: typeof a.vrednost === 'function' ? a.vrednost(stanje[a.kljuc]) : a.vrednost };
        case 'zameni': return a.podaci;
        default: return stanje;
    }
};

/* Uloge: isto kao u AllSeasons panelu. */
export const ULOGE = {
    administrator: { naziv: 'Administrator', opis: 'Vlasnik salona: sve stranice, novac, podešavanja i nalozi.' },
    menadzer: { naziv: 'Menadžer', opis: 'Vodi smenu i kasu: kalendar, raspored, dnevni promet, magacin.' },
    recepcija: { naziv: 'Recepcija', opis: 'Pult: kalendar, zahtevi, klijenti i vaučeri — bez analitike.' },
    zaposleni: { naziv: 'Zaposleni', opis: 'Stilista: svoj dan, svoji termini, raspored i odsustva.' },
};

const Kontekst = createContext(null);

export function PanelProvider({ children }) {
    const [podaci, posalji] = useReducer(reducer, undefined, pocetniPodaci);
    const [sesija, setSesija] = useState(() => citaj(KLJUC_SESIJE));
    const [tamno, setTamno] = useState(() => citaj(KLJUC_TAMNO) ?? (typeof matchMedia !== 'undefined' && matchMedia('(prefers-color-scheme: dark)').matches));
    const [poruke, setPoruke] = useState([]);
    const brojac = useRef(0);

    // Čuvanje sa malim zakašnjenjem: kucanje u polju ne piše 500 KB na svaki taster.
    useEffect(() => { const t = setTimeout(() => pisi(KLJUC, podaci), 400); return () => clearTimeout(t); }, [podaci]);
    useEffect(() => { pisi(KLJUC_SESIJE, sesija); }, [sesija]);
    useEffect(() => { pisi(KLJUC_TAMNO, tamno); document.documentElement.classList.toggle('tamno', !!tamno); }, [tamno]);

    const obavesti = useCallback((tekst, vrsta = 'ok') => {
        const id = ++brojac.current;
        setPoruke((p) => [...p, { id, tekst, vrsta }]);
        setTimeout(() => setPoruke((p) => p.filter((x) => x.id !== id)), 3800);
    }, []);

    const imeKorisnika = sesija?.ime ?? 'Demo';
    const zapisi = useCallback((vrsta, radnja, opis = '') => {
        posalji({ tip: 'postavi', kljuc: 'dnevnik', vrednost: (d) => [{ id: `d${Date.now()}`, ts: Date.now(), ko: imeKorisnika, vrsta, radnja, opis }, ...d].slice(0, 300) });
    }, [imeKorisnika]);

    const api = useMemo(() => ({
        podaci,
        sesija,
        tamno,
        setTamno,
        poruke,
        obavesti,
        zapisi,
        prijavi: (uloga, radnikId = null) => {
            const nalog = uloga === 'zaposleni'
                ? podaci.osoblje.find((o) => o.radnikId === radnikId) ?? podaci.osoblje.find((o) => o.uloga === 'zaposleni')
                : podaci.osoblje.find((o) => o.uloga === uloga) ?? podaci.osoblje[0];
            setSesija({ uloga, radnikId: uloga === 'zaposleni' ? (nalog?.radnikId ?? radnikId) : null, ime: nalog?.ime ?? ULOGE[uloga].naziv, email: nalog?.email ?? '' });
        },
        odjavi: () => setSesija(null),
        dodaj: (kolekcija, stavka) => posalji({ tip: 'dodaj', kolekcija, stavka }),
        izmeni: (kolekcija, id, izmena) => posalji({ tip: 'izmeni', kolekcija, id, izmena }),
        obrisi: (kolekcija, id) => posalji({ tip: 'obrisi', kolekcija, id }),
        postavi: (kljuc, vrednost) => posalji({ tip: 'postavi', kljuc, vrednost }),
        vratiDemo: () => { posalji({ tip: 'zameni', podaci: napraviPodatke(salon) }); obavesti('Demo podaci su vraćeni na početne.'); },
        noviId: (pref = 'x') => `${pref}${Date.now().toString(36)}${Math.floor(Math.random() * 1e3)}`,
    }), [podaci, sesija, tamno, poruke, obavesti, zapisi]);

    return <Kontekst.Provider value={api}>{children}</Kontekst.Provider>;
}

export const usePanel = () => useContext(Kontekst);

/* ── Česti upiti nad podacima ── */
export const useIndeksi = () => {
    const { podaci } = usePanel();
    return useMemo(() => ({
        usluga: Object.fromEntries(podaci.usluge.map((u) => [u.id, u])),
        radnik: Object.fromEntries(podaci.radnici.map((r) => [r.id, r])),
        klijent: Object.fromEntries(podaci.klijenti.map((k) => [k.id, k])),
        kategorija: Object.fromEntries(podaci.kategorije.map((k) => [k.id, k])),
    }), [podaci.usluge, podaci.radnici, podaci.klijenti, podaci.kategorije]);
};

export const imeKlijenta = (k) => (k ? `${k.ime} ${k.prezime}`.trim() : 'Nepoznat klijent');
export const naziviUsluga = (ids, indeks) => ids.map((id) => indeks.usluga[id]?.naziv ?? id).join(' + ');

/** Šta korisnik sme da vidi. Zaposleni vidi samo svoje termine i svoj promet. */
export const useDozvole = () => {
    const { sesija } = usePanel();
    const u = sesija?.uloga;
    return {
        uloga: u,
        radnikId: sesija?.radnikId ?? null,
        novac: u === 'administrator',
        promet: u !== undefined,
        podesavanja: u === 'administrator',
        osoblje: u === 'administrator' || u === 'recepcija',
        menjaUsluge: u === 'administrator',
        menjaRaspored: u === 'administrator' || u === 'menadzer',
        samoSvoje: u === 'zaposleni',
    };
};
