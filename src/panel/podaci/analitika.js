/*
 * Računanje nad demo podacima: promet, popunjenost, klijenti. Sve čiste
 * funkcije (podaci ulaze, brojevi izlaze), da ih koriste i Početna i Analitika.
 */
import { dodajDane, opsegDana } from '../format.js';

export const AKTIVNI = new Set(['potvrdjen', 'zahtev', 'zavrsen']);
export const uOpsegu = (t, od, doDatuma) => t.datum >= od && t.datum <= doDatuma;

/** Naplaćeni termini u periodu (opciono samo jednog radnika). */
export const naplaceni = (termini, od, doDatuma, radnikId = null) => termini.filter((t) => t.status === 'zavrsen' && uOpsegu(t, od, doDatuma) && (!radnikId || t.radnikId === radnikId));
export const zbir = (niz, f = (x) => x.cena) => niz.reduce((s, x) => s + f(x), 0);

/** Promet po danu: [{ datum, iznos, broj }]. */
export const prometPoDanu = (termini, od, doDatuma, radnikId = null) => {
    const mapa = Object.fromEntries(opsegDana(od, doDatuma).map((d) => [d, { datum: d, iznos: 0, broj: 0 }]));
    naplaceni(termini, od, doDatuma, radnikId).forEach((t) => { mapa[t.datum].iznos += t.cena; mapa[t.datum].broj += 1; });
    return Object.values(mapa);
};

/** Isti broj dana, neposredno pre perioda — za poređenje. */
export const prethodniPeriod = (od, doDatuma) => {
    const dana = opsegDana(od, doDatuma).length;
    return [dodajDane(od, -dana), dodajDane(od, -1)];
};

export const promena = (sada, pre) => (pre > 0 ? (sada - pre) / pre : null);

/** Zauzetost radnika na dan: zakazani minuti / minuti smene (0..1), ili null kad ne radi. */
export const zauzetostDana = (podaci, datum, radnikId) => {
    const s = podaci.smene[`${radnikId}|${datum}`];
    if (!s) return null;
    const zauzeto = podaci.termini.filter((t) => t.datum === datum && t.radnikId === radnikId && AKTIVNI.has(t.status)).reduce((x, t) => x + t.trajanje, 0);
    return Math.min(1, zauzeto / (s.do - s.od));
};

/** Slobodni prozori radnika na dan (min. `najmanje` minuta), posle `odMinuta`. */
export const slobodniProzori = (podaci, datum, radnikId, odMinuta = 0, najmanje = 30) => {
    const s = podaci.smene[`${radnikId}|${datum}`];
    if (!s) return [];
    const zauzeti = podaci.termini.filter((t) => t.datum === datum && t.radnikId === radnikId && AKTIVNI.has(t.status)).sort((a, b) => a.od - b.od);
    const prozori = [];
    let t = Math.max(s.od, Math.ceil(odMinuta / 15) * 15);
    for (const z of zauzeti) {
        if (z.od - t >= najmanje) prozori.push({ od: t, do: z.od });
        t = Math.max(t, z.od + z.trajanje);
    }
    if (s.do - t >= najmanje) prozori.push({ od: t, do: s.do });
    return prozori;
};

/** Da li se novi termin preklapa sa postojećim kod istog radnika. */
export const preklapanje = (termini, { datum, od, trajanje, radnikId, id }) => termini.find((t) => t.id !== id && t.datum === datum && t.radnikId === radnikId && AKTIVNI.has(t.status) && t.od < od + trajanje && od < t.od + t.trajanje) ?? null;

/** Posete i potrošnja po klijentu: { [klijentId]: { posete, potroseno, poslednja, sledeca, otkazano, nijeDosao } }. */
export const statistikaKlijenata = (termini, danas) => {
    const s = {};
    for (const t of termini) {
        const k = (s[t.klijentId] ??= { posete: 0, potroseno: 0, poslednja: null, sledeca: null, otkazano: 0, nijeDosao: 0, radnici: {} });
        if (t.status === 'zavrsen') {
            k.posete += 1; k.potroseno += t.cena;
            if (!k.poslednja || t.datum > k.poslednja) k.poslednja = t.datum;
            k.radnici[t.radnikId] = (k.radnici[t.radnikId] ?? 0) + 1;
        } else if (t.status === 'otkazan') k.otkazano += 1;
        else if (t.status === 'nije-dosao') k.nijeDosao += 1;
        else if (t.datum >= danas && (!k.sledeca || t.datum < k.sledeca)) k.sledeca = t.datum;
    }
    return s;
};

/** Promet po usluzi (prva usluga termina nosi ceo iznos ako ih je više — dovoljno za pregled). */
export const poUslugama = (termini) => {
    const m = {};
    for (const t of termini) for (const id of t.usluge) {
        const x = (m[id] ??= { id, broj: 0, iznos: 0 });
        x.broj += 1; x.iznos += t.cena / t.usluge.length;
    }
    return Object.values(m).sort((a, b) => b.iznos - a.iznos);
};

export const poRadnicima = (termini) => {
    const m = {};
    for (const t of termini) { const x = (m[t.radnikId] ??= { id: t.radnikId, broj: 0, iznos: 0 }); x.broj += 1; x.iznos += t.cena; }
    return Object.values(m).sort((a, b) => b.iznos - a.iznos);
};
