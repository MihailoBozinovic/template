/*
 * ZAKAZIVANJE — logika koraka, preneta iz AllSeasons-a (lib/koraciZakazivanja.js):
 *
 *  - koraci imaju IMENA, ne brojeve, i idu redom kojim odgovori zavise jedan
 *    od drugog: usluga odlučuje trajanje i ko može da je radi → frizer → termin
 *    → podaci → potvrda;
 *  - korak „frizer” se prikazuje samo kad postoje bar DVA čoveka koja rade sve
 *    izabrano (sa jednim ili nijednim to je klik koji ništa ne odlučuje —
 *    „Bilo ko”);
 *  - `dozvoljeniKorak` samo SPUŠTA željeni korak do prvog bez odgovora (nikad
 *    ga ne diže) — to pokriva vraćeni nacrt, uslugu koju frizer više ne radi i
 *    termin koji je ispao iz mreže.
 */

export const KORACI = ['usluga', 'stilista', 'termin', 'podaci', 'potvrda'];

export const prikaziKorakStiliste = (stilisti) => (Array.isArray(stilisti) ? stilisti.length : Number(stilisti)) >= 2;

export const vidljiviKoraci = (brojStilista) => KORACI.filter((k) => k !== 'stilista' || prikaziKorakStiliste(brojStilista));

const ODGOVOR = {
    usluga: (s) => s.usluge.length > 0,
    stilista: () => true,
    termin: (s) => Boolean(s.datum && s.vreme),
    podaci: () => true,
    potvrda: () => true,
};

export const dozvoljeniKorak = (zeljeni, stanje, koraci) => {
    // Korak koji se trenutno ne prikazuje (npr. „frizer” kad ga radi samo jedan) → sledeći vidljivi.
    if (!koraci.includes(zeljeni)) zeljeni = KORACI.slice(KORACI.indexOf(zeljeni) + 1).find((k) => koraci.includes(k)) ?? koraci[0];
    const do_ = koraci.indexOf(zeljeni);
    for (let i = 0; i < do_; i++) {
        if (!ODGOVOR[koraci[i]](stanje)) return koraci[i];
    }
    return koraci.includes(zeljeni) ? zeljeni : koraci[0];
};

/** Sve usluge ravno, sa kategorijom. */
export const sveUsluge = (salon) => salon.kategorije.flatMap((k) => k.usluge.map((u) => ({ ...u, kategorija: k.id, za: u.za ?? k.za ?? [] })));

/** Da li radnik radi uslugu (po id-ju usluge ili kategorije; prazno = sve). */
export const radiUslugu = (radnik, usluga) => !radnik.usluge?.length || radnik.usluge.includes(usluga.id) || radnik.usluge.includes(usluga.kategorija);

/** Ko radi SVE izabrane usluge. */
export const stilistiZa = (izabrane, salon) => salon.tim.filter((r) => izabrane.every((u) => radiUslugu(r, u)));

/** Stilista koji izbor još sme da nosi (inače „Bilo ko” = null). */
export const vazeciStilista = (id, stilisti) => {
    if (id == null) return null;
    if (!prikaziKorakStiliste(stilisti)) return null;
    return stilisti.some((s) => s.id === id) ? id : null;
};

export const ukupnoTrajanje = (izabrane) => izabrane.reduce((a, u) => a + (u.trajanje || 0), 0);
export const ukupnaCena = (izabrane) => izabrane.reduce((a, u) => a + (u.cena || 0), 0);
export const imaCenuOd = (izabrane) => izabrane.some((u) => u.cenaOd);

/* ── Provera podataka ───────────────────────────────────────────────────── */

const cistTelefon = (t) => t.replace(/[\s\-/().]/g, '');

/**
 * Srpski mobilni/fiksni (060…, +381…, 00381…) ili međunarodni sa „+”.
 * Vraća E.164 ili null.
 */
export const normalizujTelefon = (unos) => {
    const t = cistTelefon(unos || '');
    if (/^0[1-9]\d{6,9}$/.test(t)) return `+381${t.slice(1)}`;
    if (/^00\d{8,14}$/.test(t)) return `+${t.slice(2)}`;
    if (/^\+\d{8,15}$/.test(t)) return t;
    if (/^381\d{7,10}$/.test(t)) return `+${t}`;
    return null;
};

export const ispravanEmail = (e) => !e || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e.trim());

export const greskePodataka = (p, g) => {
    const rez = {};
    if (!p.ime || p.ime.trim().length < 2) rez.ime = g.ime;
    if (!normalizujTelefon(p.telefon)) rez.telefon = g.telefon;
    if (!ispravanEmail(p.email)) rez.email = g.email;
    if (!p.saglasnost) rez.saglasnost = g.saglasnost;
    return rez;
};

/* ── Poruka za salon ───────────────────────────────────────────────────── */

export const tekstPoruke = ({ izabrane, stilista, datumTekst, vreme, podaci, nazivUsluge, cenaTekst, trajanjeTekst }, t) => {
    const p = t.zakazivanje.poruka;
    const redovi = [
        `${p.naslov}`,
        '',
        `${p.usluge}: ${izabrane.map(nazivUsluge).join(', ')} (${trajanjeTekst}, ${cenaTekst})`,
        `${p.stilista}: ${stilista ?? t.zakazivanje.biloKo}`,
        `${p.termin}: ${datumTekst} ${vreme}`,
        `${p.ime}: ${podaci.ime.trim()}`,
        `${p.telefon}: ${normalizujTelefon(podaci.telefon)}`,
    ];
    if (podaci.email) redovi.push(`${p.email}: ${podaci.email.trim()}`);
    if (podaci.napomena) redovi.push(`${p.napomena}: ${podaci.napomena.trim()}`);
    return redovi.join('\n');
};

export const linkKanala = (tip, salon, tekst) => {
    const k = salon.kontakt;
    const enc = encodeURIComponent(tekst);
    if (tip === 'whatsapp' && k.whatsapp) return `https://wa.me/${k.whatsapp}?text=${enc}`;
    if (tip === 'viber' && k.viber) return `viber://chat?number=%2B${k.viber}&draft=${enc}`;
    if (tip === 'email' && k.email) return `mailto:${k.email}?subject=${encodeURIComponent(tekst.split('\n')[0])}&body=${enc}`;
    return null;
};

/**
 * Šalje zahtev. Za 'webhook' radi POST i vraća { ok }; za ostale kanale vraća
 * { otvori: url } — stranica otvara aplikaciju.
 */
export const posaljiZahtev = async (salon, zahtev, tekst) => {
    const kanal = salon.zakazivanje?.kanal ?? { tip: 'whatsapp' };
    if (kanal.tip === 'webhook' && kanal.url) {
        try {
            const odg = await fetch(kanal.url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                body: JSON.stringify({ ...zahtev, poruka: tekst, salon: salon.naziv, izvor: 'sajt' }),
            });
            return { ok: odg.ok };
        } catch {
            return { ok: false };
        }
    }
    const url = linkKanala(kanal.tip, salon, tekst) ?? linkKanala('whatsapp', salon, tekst) ?? linkKanala('email', salon, tekst);
    return url ? { ok: true, otvori: url } : { ok: false };
};
