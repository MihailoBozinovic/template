/*
 * DEMO PODACI PANELA
 *
 * Panel je samo front: sve što prikazuje pravi ovaj fajl, iz src/config/salon.js
 * (usluge, cene, tim, radno vreme) i izmišljenih klijenata. Termini se ređaju
 * oko današnjeg dana (90 dana unazad, 3 nedelje unapred), pa demo uvek izgleda
 * „živo”. Isti seed daje iste podatke, a izmene iz panela čuva Skladiste.jsx.
 */
import { danUNedelji, dodajDane, radnoVremeDana, sadaUSalonu, uMinute } from '../../lib/vreme.js';

export const VERZIJA_PODATAKA = 3;

/* ── Pseudo-slučajni brojevi (mulberry32) — isti seed, isti podaci ── */
const rng = (seed) => () => {
    seed |= 0; seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const tekst = (v) => (v && typeof v === 'object' ? v.sr ?? Object.values(v)[0] : v ?? '');

const ZENSKA = ['Milica', 'Jovana', 'Ana', 'Marija', 'Teodora', 'Katarina', 'Jelena', 'Ivana', 'Tamara', 'Sara', 'Nevena', 'Dragana', 'Mina', 'Aleksandra', 'Snežana', 'Tijana', 'Kristina', 'Maja', 'Sofija', 'Nina', 'Danica', 'Jasmina', 'Vesna', 'Bojana', 'Andrea', 'Isidora', 'Lena', 'Marta', 'Olivera', 'Gordana', 'Hana', 'Petra', 'Natalija', 'Biljana', 'Ljiljana', 'Valentina'];
const MUSKA = ['Marko', 'Nikola', 'Stefan', 'Luka', 'Aleksa', 'Lazar', 'Filip', 'Miloš', 'Nemanja', 'Dušan', 'Vuk', 'Đorđe', 'Petar', 'Uroš', 'Bogdan', 'Ognjen', 'Vladimir', 'Igor', 'Dejan', 'Milan', 'Strahinja', 'Andrej', 'Mihajlo', 'Pavle', 'Vasilije', 'Relja', 'Boris', 'Zoran'];
const PREZIMENA = ['Jovanović', 'Petrović', 'Nikolić', 'Marković', 'Đorđević', 'Stojanović', 'Ilić', 'Stanković', 'Pavlović', 'Milošević', 'Popović', 'Kostić', 'Lazić', 'Živković', 'Tomić', 'Ristić', 'Savić', 'Mitrović', 'Kovačević', 'Todorović', 'Simić', 'Radovanović', 'Vasić', 'Obradović', 'Lukić', 'Petković', 'Milenković', 'Božović', 'Antić', 'Filipović', 'Novaković', 'Janković', 'Radić', 'Bogdanović', 'Vuković', 'Zdravković'];
const ASCII = { č: 'c', ć: 'c', š: 's', ž: 'z', đ: 'dj', Č: 'c', Ć: 'c', Š: 's', Ž: 'z', Đ: 'dj' };
const ascii = (s) => s.replace(/[čćšžđČĆŠŽĐ]/g, (c) => ASCII[c]).toLowerCase();

const KOMENTARI = [
    'Kao i uvek — savršeno!', 'Najbolji fade u gradu.', 'Ljubazni, tačni i precizni.', 'Boja je ispala tačno kako sam zamislila.',
    'Prijatna atmosfera, kafa odlična.', 'Malo sam čekala, ali vredelo je.', 'Preporuka za balayage!', 'Brzo i kvalitetno, vidimo se za mesec dana.',
    'Konačno frizer koji sluša šta tražiš.', 'Sin je oduševljen šišanjem.', 'Topli peškir i brijanje — doživljaj.', 'Kosa mi nikad nije bila zdravija.',
];
const NAPOMENE_KLIJENATA = ['Alergična na amonijak — koristiti bez-amonijačne boje.', 'Voli kraće sa strane, duže gore.', 'Uvek kafa bez šećera.', 'Osetljivo teme, blago pranje.', 'Dolazi sa ćerkom subotom.', 'Ne voli lak za kosu.', 'Preferira Marka.', 'Kasni 5–10 min, ostaviti rezervu.'];
const FORMULE = ['Igora Royal 7-1 + 6% (1:1), 35 min', 'Majirel 6.0 + 7.1 (1:1), oksidant 6%, 30 min', 'Koleston 8/0 + 9% na izrastku, 40 min', 'Blondor + 6%, folije, 45 min; toner Shinefinity 09/02', 'Inoa 5.3 + 6%, 35 min', 'Illumina 8/36 + 6%, 30 min; Olaplex br. 1 u smeši', 'Freelights + 9%, balayage tehnika, 50 min; gloss 10/16'];

/** Težina usluge pri izboru — kraće usluge se rade češće. */
const tezina = (u) => Math.max(0.5, 6 - u.trajanje / 40);

export function napraviPodatke(salon, { danas = sadaUSalonu().datum, minutSada = sadaUSalonu().minut, seed = 20261124 } = {}) {
    const r = rng(seed);
    const izaberi = (niz) => niz[Math.floor(r() * niz.length)];
    const izaberiTezinski = (niz, tez) => {
        const ukupno = niz.reduce((s, x) => s + tez(x), 0);
        let x = r() * ukupno;
        for (const e of niz) { x -= tez(e); if (x <= 0) return e; }
        return niz[niz.length - 1];
    };
    const verovatno = (p) => r() < p;
    const zaokruzi = (n, k = 100) => Math.round(n / k) * k;

    /* ── Usluge i kategorije (iz salon.js) ── */
    const kategorije = salon.kategorije.map((k, i) => ({ id: k.id, naziv: tekst(k.naziv), za: k.za ?? [], redosled: i, slika: k.slika ?? '' }));
    const usluge = salon.kategorije.flatMap((k) => k.usluge.map((u) => ({
        id: u.id, kategorija: k.id, naziv: tekst(u.naziv), opis: tekst(u.opis), trajanje: u.trajanje, cena: u.cena,
        cenaOd: !!u.cenaOd, aktivna: true, online: true, za: k.za ?? [],
    })));
    const uslugaPoId = Object.fromEntries(usluge.map((u) => [u.id, u]));

    /* ── Radnici (iz tima) ── */
    const BOJE = ['#B8893E', '#4E7AC7', '#3A9A72', '#C2577A', '#7A62C9', '#C9772E'];
    const radnici = salon.tim.map((t, i) => {
        const moze = usluge.filter((u) => !t.usluge?.length || t.usluge.includes(u.kategorija) || t.usluge.includes(u.id)).map((u) => u.id);
        return {
            id: t.id, ime: t.ime, uloga: tekst(t.uloga), slika: t.slika ?? '', boja: BOJE[i % BOJE.length], usluge: moze,
            radniDani: t.radniDani ?? [], aktivan: true, online: true,
            plata: i === 0 ? 0 : 65000 + i * 5000, provizija: i === 0 ? 0 : [0, 30, 35, 30][i % 4] || 30,
            telefon: `06${3 + (i % 6)} ${100 + i * 37} ${1000 + i * 413}`.slice(0, 13), email: `${ascii(t.ime.split(' ')[0])}@${(salon.domen || 'salon.rs').replace(/^https?:\/\//, '').replace(/\/.*$/, '')}`,
        };
    });

    /* ── Odsustva (pre smena, da tih dana nema termina) ── */
    const odsustva = [];
    if (radnici[1]) odsustva.push({ id: 'o1', radnikId: radnici[1].id, vrsta: 'godisnji', od: dodajDane(danas, 12), do: dodajDane(danas, 16), status: 'na-cekanju', napomena: 'Putovanje', kreiran: dodajDane(danas, -2) });
    if (radnici[2]) odsustva.push({ id: 'o2', radnikId: radnici[2].id, vrsta: 'bolovanje', od: dodajDane(danas, -23), do: dodajDane(danas, -21), status: 'odobreno', napomena: 'Grip', kreiran: dodajDane(danas, -23) });
    if (radnici[0]) odsustva.push({ id: 'o3', radnikId: radnici[0].id, vrsta: 'slobodan', od: dodajDane(danas, 6), do: dodajDane(danas, 6), status: 'odobreno', napomena: 'Seminar boje — Milano', kreiran: dodajDane(danas, -9) });
    if (radnici[3]) odsustva.push({ id: 'o4', radnikId: radnici[3].id, vrsta: 'godisnji', od: dodajDane(danas, -52), do: dodajDane(danas, -46), status: 'odobreno', napomena: '', kreiran: dodajDane(danas, -70) });
    const odsutan = (radnikId, d) => odsustva.some((o) => o.radnikId === radnikId && o.status === 'odobreno' && d >= o.od && d <= o.do);

    /* ── Smene: prepodne/popodne naizmenično po nedeljama ── */
    const smene = {};
    const OD = -90; const DO = 35;
    for (let n = OD; n <= DO; n++) {
        const d = dodajDane(danas, n);
        const rv = radnoVremeDana(d, salon);
        if (!rv) continue;
        const dan = danUNedelji(d);
        const nedelja = Math.floor((n + 1000) / 7);
        radnici.forEach((rad, i) => {
            if (rad.radniDani.length && !rad.radniDani.includes(dan)) return;
            if (!rad.radniDani.length && i > 0 && dan === ['pon', 'uto', 'sre', 'cet', 'pet'][(i + nedelja) % 5]) return; // jedan slobodan dan u nedelji
            if (odsutan(rad.id, d)) return;
            const [o, z] = rv;
            const duzina = 8 * 60;
            let od = o; let doM = z;
            if (z - o > duzina + 60) {
                const prepodne = i === 0 || (i + nedelja) % 2 === 0;
                od = prepodne ? o : z - duzina; doM = prepodne ? o + duzina : z;
            }
            smene[`${rad.id}|${d}`] = { od, do: doM };
        });
    }

    /* ── Klijenti ── */
    const klijenti = [];
    const domeni = ['gmail.com', 'gmail.com', 'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com'];
    for (let i = 0; i < 170; i++) {
        const pol = i % 9 < 5 ? 'z' : 'm';
        const ime = izaberi(pol === 'z' ? ZENSKA : MUSKA);
        const prezime = izaberi(PREZIMENA);
        const kreiranPre = i < 22 ? Math.floor(r() * 85) : 90 + Math.floor(r() * 900);
        klijenti.push({
            id: `k${1001 + i}`, ime, prezime, pol,
            telefon: `06${izaberi([0, 1, 2, 3, 4, 5, 6, 9])} ${String(Math.floor(r() * 900) + 100)} ${String(Math.floor(r() * 9000) + 1000)}`,
            email: verovatno(0.75) ? `${ascii(ime)}.${ascii(prezime)}${verovatno(0.3) ? Math.floor(r() * 90 + 10) : ''}@${izaberi(domeni)}` : '',
            kreiran: dodajDane(danas, -kreiranPre),
            izvor: izaberi(['online', 'online', 'telefon', 'pult', 'instagram', 'preporuka']),
            napomena: verovatno(0.12) ? izaberi(NAPOMENE_KLIJENATA) : '',
            oznake: [], smsPristanak: verovatno(0.8), rodjendan: `${String(1 + Math.floor(r() * 12)).padStart(2, '0')}-${String(1 + Math.floor(r() * 28)).padStart(2, '0')}`,
            blokiran: false,
        });
    }
    const zene = klijenti.filter((k) => k.pol === 'z');
    const muskarci = klijenti.filter((k) => k.pol === 'm');
    // Stalni klijenti dolaze češće: težina opada sa indeksom (Zipf).
    const izaberiKlijenta = (pol, datum) => {
        const skup = (pol === 'm' ? muskarci : pol === 'z' ? zene : klijenti).filter((k) => k.kreiran <= datum);
        return izaberiTezinski(skup, (k) => 1 / (1 + (klijenti.indexOf(k) % 60) * 0.18));
    };

    /* ── Termini ── */
    const termini = [];
    const kartoteka = [];
    let idTermina = 5000;
    const DODACI = ['maska', 'olaplex', 'brada', 'toniranje'];
    for (let n = OD; n <= 21; n++) {
        const d = dodajDane(danas, n);
        const dan = danUNedelji(d);
        for (const rad of radnici) {
            const smena = smene[`${rad.id}|${d}`];
            if (!smena) continue;
            const osnovnaP = n <= 0 ? (dan === 'sub' ? 0.9 : dan === 'pet' ? 0.86 : 0.74) : 0.12 + 0.72 * Math.exp(-n / 6);
            let t = smena.od;
            while (t < smena.do - 20) {
                if (!verovatno(osnovnaP)) { t += izaberi([15, 30, 30, 45, 60]); continue; }
                const stane = rad.usluge.map((id) => uslugaPoId[id]).filter((u) => u && u.trajanje <= smena.do - t);
                const mogu = stane.some((u) => !DODACI.includes(u.id)) ? stane.filter((u) => !DODACI.includes(u.id)) : stane;
                if (!mogu.length) break;
                const glavna = izaberiTezinski(mogu, tezina);
                const stavke = [glavna.id];
                let traje = glavna.trajanje;
                const dodatak = rad.usluge.filter((id) => DODACI.includes(id) && id !== glavna.id).map((id) => uslugaPoId[id]).find((u) => u && verovatno(0.12) && t + traje + u.trajanje <= smena.do);
                if (dodatak) { stavke.push(dodatak.id); traje += dodatak.trajanje; }
                const pol = glavna.za.includes('muskarci') ? 'm' : glavna.za.includes('zene') ? 'z' : null;
                const klijent = izaberiKlijenta(pol, d);
                const cena = stavke.reduce((s, id) => { const u = uslugaPoId[id]; return s + (u.cenaOd ? zaokruzi(u.cena * (1 + r() * 0.35)) : u.cena); }, 0);
                const prosao = n < 0 || (n === 0 && t + traje <= minutSada);
                let status = 'potvrdjen';
                if (prosao) status = verovatno(0.035) ? 'nije-dosao' : verovatno(0.05) ? 'otkazan' : 'zavrsen';
                else if (n > 0 && verovatno(0.05)) status = 'otkazan';
                else if (n > 0 && n < 9 && verovatno(0.085)) status = 'zahtev';
                const izvor = status === 'zahtev' ? 'online' : izaberi(['online', 'online', 'online', 'telefon', 'telefon', 'pult', 'instagram']);
                const placanje = status === 'zavrsen' ? izaberiTezinski(['kartica', 'gotovina', 'vaucer'], (x) => ({ kartica: 55, gotovina: 38, vaucer: 7 })[x]) : null;
                const kreiranPre = status === 'zahtev' ? r() * 2.5 : 1 + r() * 20;
                termini.push({
                    id: ++idTermina, datum: d, od: t, trajanje: traje, radnikId: rad.id, usluge: stavke, klijentId: klijent.id, cena,
                    status, placanje, izvor, napomena: verovatno(0.06) ? izaberi(['Prvi put kod nas', 'Doneti sliku željene boje', 'Hitno — svadba u subotu', 'Sa detetom']) : '',
                    kreiran: status === 'zahtev' ? Date.now() - kreiranPre * 864e5 : Math.min(Date.now() - 6e5, Date.parse(`${d}T08:00:00Z`) - kreiranPre * 864e5),
                    razlogOtkazivanja: status === 'otkazan' ? izaberi(['Klijent otkazao telefonom', 'Bolest', 'Promena plana', 'Otkazano preko linka iz poruke']) : '',
                });
                if (status === 'zavrsen' && glavna.kategorija === 'boja' && verovatno(0.7)) {
                    kartoteka.push({ id: `kt${kartoteka.length + 1}`, klijentId: klijent.id, datum: d, radnikId: rad.id, uslugaId: glavna.id, formula: izaberi(FORMULE), napomena: verovatno(0.3) ? izaberi(['Ostaviti 2 cm na izrastku', 'Sledeći put hladniji ton', 'Kosa porozna na krajevima', 'Zadovoljna nijansom']) : '' });
                }
                t += traje + izaberi([0, 0, 0, 15, 15, 30]);
            }
        }
    }
    // Uvek nekoliko zahteva u redu čekanja, da red ne bude prazan.
    const buduci = termini.filter((x) => x.datum > danas && x.status === 'potvrdjen');
    for (let i = 0; termini.filter((x) => x.status === 'zahtev').length < 5 && i < buduci.length; i += 7) {
        Object.assign(buduci[i], { status: 'zahtev', izvor: 'online', kreiran: Date.now() - r() * 864e5 * 1.5 });
    }

    /* ── Ocene ── */
    const ocene = [];
    termini.filter((x) => x.status === 'zavrsen' && x.datum >= dodajDane(danas, -75)).forEach((x) => {
        if (!verovatno(0.32)) return;
        const ocena = izaberiTezinski([5, 4, 3, 2], (o) => ({ 5: 78, 4: 17, 3: 4, 2: 1 })[o]);
        ocene.push({ id: `oc${ocene.length + 1}`, terminId: x.id, radnikId: x.radnikId, klijentId: x.klijentId, datum: x.datum, ocena, komentar: verovatno(0.35) ? (ocena >= 4 ? izaberi(KOMENTARI) : izaberi(['Malo sam čekala.', 'Nije baš ono što sam tražila.', 'Kasnili ste 20 minuta.'])) : '' });
    });

    /* ── Lista čekanja ── */
    const listaCekanja = Array.from({ length: 7 }, (_, i) => {
        const u = izaberi(usluge);
        const pol = u.za.includes('muskarci') ? 'm' : 'z';
        const k = izaberiKlijenta(pol, danas);
        const od = dodajDane(danas, i % 3);
        return { id: `lc${i + 1}`, klijentId: k.id, uslugaId: u.id, radnikId: verovatno(0.5) ? izaberi(radnici.filter((x) => x.usluge.includes(u.id)))?.id ?? null : null, od, do: dodajDane(od, 3 + (i % 5)), deoDana: izaberi(['prepodne', 'popodne', 'bilo kad']), napomena: verovatno(0.3) ? 'Može i u kratkom roku' : '', kreiran: dodajDane(danas, -(i % 4)), status: i === 1 ? 'ponudjeno' : 'ceka' };
    });

    /* ── Vaučeri, promo kodovi ── */
    const kod = (pref) => `${pref}-${Array.from({ length: 4 }, () => 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[Math.floor(r() * 32)]).join('')}`;
    const pref = (salon.kratkiNaziv || salon.naziv).replace(/[^A-Za-z]/g, '').slice(0, 2).toUpperCase() || 'SV';
    const vauceri = Array.from({ length: 16 }, (_, i) => {
        const izdat = dodajDane(danas, -Math.floor(r() * 200));
        const iznos = izaberi([2000, 3000, 5000, 5000, 8000, 10000]);
        const vaziDo = dodajDane(izdat, 180);
        const iskorisceno = vaziDo < danas ? (verovatno(0.6) ? iznos : 0) : verovatno(0.35) ? iznos : verovatno(0.2) ? Math.floor(iznos / 2) : 0;
        const status = iskorisceno >= iznos ? 'iskoriscen' : vaziDo < danas ? 'istekao' : 'aktivan';
        const kupac = izaberi(klijenti);
        return { id: `v${i + 1}`, kod: kod(pref), iznos, iskorisceno, izdat, vaziDo, status, vrsta: verovatno(0.85) ? 'placen' : 'poklon', kupacId: kupac.id, primalac: `${izaberi(ZENSKA)} ${izaberi(PREZIMENA)}`, poruka: verovatno(0.5) ? 'Srećan rođendan! ❤' : '' };
    });
    const promoKodovi = [
        { id: 'p1', kod: 'DOBRODOSLI10', popust: 10, vrsta: 'procenat', opis: 'Prvi termin za nove klijente', od: dodajDane(danas, -120), do: dodajDane(danas, 60), limit: 0, iskorisceno: 37, aktivan: true },
        { id: 'p2', kod: 'PONEDELJAK', popust: 15, vrsta: 'procenat', opis: 'Ponedeljkom pre 12h', od: dodajDane(danas, -40), do: dodajDane(danas, 20), limit: 100, iskorisceno: 22, aktivan: true },
        { id: 'p3', kod: 'BLACKFRIDAY', popust: 20, vrsta: 'procenat', opis: 'Black Friday nedelja', od: dodajDane(danas, 3), do: dodajDane(danas, 7), limit: 60, iskorisceno: 0, aktivan: true },
        { id: 'p4', kod: 'LETO500', popust: 500, vrsta: 'iznos', opis: 'Letnja akcija', od: dodajDane(danas, -150), do: dodajDane(danas, -60), limit: 200, iskorisceno: 143, aktivan: false },
        { id: 'p5', kod: 'INSTA', popust: 10, vrsta: 'procenat', opis: 'Pratioci sa Instagrama', od: dodajDane(danas, -30), do: dodajDane(danas, 90), limit: 0, iskorisceno: 18, aktivan: true },
    ];

    /* ── Proizvodi (po brendovima sa sajta) ── */
    const brendovi = (salon.brendovi ?? []).map((b) => (typeof b === 'string' ? b : b.naziv));
    const PROIZVODI = [
        ['Kérastase', 'Elixir Ultime ulje 100 ml', 5900], ['Kérastase', 'Nutritive šampon 250 ml', 3900], ['Kérastase', 'Genesis serum 90 ml', 6400],
        ['Olaplex', 'No.3 Hair Perfector 100 ml', 4200], ['Olaplex', 'No.7 Bonding Oil 30 ml', 3600], ['Wella Professionals', 'Oil Reflections 100 ml', 2900],
        ['Wella Professionals', 'Fusion šampon 250 ml', 2400], ['L’Oréal Professionnel', 'Absolut Repair maska 250 ml', 3300], ['L’Oréal Professionnel', 'Metal Detox šampon 300 ml', 2900],
        ['American Crew', 'Fiber pasta 85 g', 2100], ['American Crew', 'Forming Cream 85 g', 2000], ['Reuzel', 'Blue Pomade 113 g', 2300], ['Reuzel', 'Beard Balm 35 g', 1900], ['Reuzel', 'Daily šampon 350 ml', 2100],
    ].filter(([b]) => !brendovi.length || brendovi.includes(b));
    const proizvodi = PROIZVODI.map(([brend, naziv, cena], i) => {
        const minimum = izaberi([3, 4, 5]);
        const stanje = i % 5 === 2 ? Math.floor(r() * minimum) : minimum + Math.floor(r() * 14);
        return { id: `pr${i + 1}`, brend, naziv, cena, nabavna: zaokruzi(cena * 0.55, 10), stanje, minimum, prodato30: Math.floor(r() * 18), naSajtu: verovatno(0.7), sifra: `${String(3600000 + Math.floor(r() * 999999))}` };
    });

    /* ── Osoblje (nalozi) ── */
    const domen = (salon.domen || 'salon.rs').replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    const vlasnik = (salon.firma?.naziv?.match(/,\s*([^,]+?)\s+PR/) ?? [])[1] ?? 'Vlasnik salona';
    const osoblje = [
        { id: 'n1', ime: vlasnik, email: `vlasnik@${domen}`, uloga: 'administrator', radnikId: null, aktivan: true, poslednjaPrijava: Date.now() - 3600e3 * 2 },
        ...radnici.map((rad, i) => ({ id: `n${i + 2}`, ime: rad.ime, email: rad.email, uloga: i === 0 ? 'menadzer' : 'zaposleni', radnikId: rad.id, aktivan: true, poslednjaPrijava: Date.now() - 3600e3 * (5 + i * 19) })),
        { id: `n${radnici.length + 2}`, ime: 'Milica Pavlović', email: `recepcija@${domen}`, uloga: 'recepcija', radnikId: null, aktivan: true, poslednjaPrijava: Date.now() - 3600e3 * 0.5 },
    ];

    /* ── SMS kampanje, dnevnik ── */
    const smsKampanje = [
        { id: 's1', naziv: 'Black Friday najava', tekst: `${salon.kratkiNaziv || salon.naziv}: od petka -20% na sve usluge uz kod BLACKFRIDAY. Zakažite na sajtu.`, primalaca: 412, poslato: dodajDane(danas, -1), status: 'poslata', klikova: 63, zakazano: 19 },
        { id: 's2', naziv: 'Podsetnik — 6 nedelja od šišanja', tekst: 'Vreme je za osvežavanje! Slobodni termini ove nedelje — rezervišite online.', primalaca: 88, poslato: dodajDane(danas, -9), status: 'poslata', klikova: 21, zakazano: 11 },
        { id: 's3', naziv: 'Novogodišnji vaučeri', tekst: 'Poklonite termin za praznike — vaučeri u salonu i porukom.', primalaca: 0, poslato: dodajDane(danas, 8), status: 'zakazana', klikova: 0, zakazano: 0 },
        { id: 's4', naziv: 'Leto — nega posle mora', tekst: 'Olaplex tretman -15% do kraja avgusta.', primalaca: 356, poslato: dodajDane(danas, -95), status: 'poslata', klikova: 40, zakazano: 23 },
    ];
    const RADNJE = [
        ['Milica Pavlović', 'termin', 'Zakazala termin'], ['Milica Pavlović', 'termin', 'Pomerila termin'], [radnici[0]?.ime, 'naplata', 'Naplatila termin'],
        [vlasnik, 'usluga', 'Izmenio cenu usluge'], ['Online zakazivanje', 'zahtev', 'Novi zahtev za termin'], [radnici[1]?.ime, 'odsustvo', 'Zatražila godišnji odmor'],
        [radnici[2]?.ime, 'naplata', 'Naplatio termin'], ['Milica Pavlović', 'klijent', 'Dodala klijenta'], [vlasnik, 'raspored', 'Izmenio raspored smena'],
    ];
    const dnevnik = Array.from({ length: 40 }, (_, i) => {
        const [ko, vrsta, radnja] = izaberi(RADNJE);
        const k = izaberi(klijenti);
        return { id: `d${i + 1}`, ts: Date.now() - (i * 3.7 + r() * 3) * 3600e3, ko: ko ?? vlasnik, vrsta, radnja, opis: `${k.ime} ${k.prezime}` };
    });

    /* ── Galerija i podešavanja (kopija iz salon.js, menja se lokalno) ── */
    const galerija = (salon.galerija ?? []).map((g, i) => ({ id: `g${i + 1}`, slika: g.slika, kategorija: g.kategorija, opis: tekst(g.opis), naSajtu: true }));
    const podaciSalona = {
        naziv: salon.naziv, kratkiNaziv: salon.kratkiNaziv ?? '', slogan: tekst(salon.slogan), opis: tekst(salon.opis),
        telefon: salon.kontakt?.telefonPrikaz ?? '', email: salon.kontakt?.email ?? '', instagram: salon.kontakt?.instagram ?? '', facebook: salon.kontakt?.facebook ?? '',
        adresa: salon.lokacija?.adresa ?? '', grad: tekst(salon.lokacija?.grad), postanskiBroj: salon.lokacija?.postanskiBroj ?? '',
        firma: salon.firma?.naziv ?? '', pib: salon.firma?.pib ?? '', maticniBroj: salon.firma?.maticniBroj ?? '', adresaFirme: salon.firma?.adresa ?? '',
        radnoVreme: { ...salon.radnoVreme }, neradniDani: (salon.neradniDani ?? []).map((n) => ({ datum: n.datum, opis: tekst(n.opis) })),
    };
    const podesavanja = {
        onlineZakazivanje: true, nacin: salon.zakazivanje?.nacin ?? 'zahtev', korakMinuta: salon.zakazivanje?.korakMinuta ?? 15,
        najranijeSati: salon.zakazivanje?.najranijeSati ?? 2, danaUnapred: salon.zakazivanje?.danaUnapred ?? 30, otkazivanjeSati: salon.zakazivanje?.otkazivanjeSati ?? 24,
        maksUsluga: salon.zakazivanje?.maksUsluga ?? 3, podsetnikSms: true, podsetnikSati: 24, podsetnikEmail: true, potvrdaEmail: true, ocenaPosle: true,
        obavestiTelegram: true, obavestiEmail: false, depozit: false, listaCekanja: true,
    };

    return {
        verzija: VERZIJA_PODATAKA, datum: danas,
        kategorije, usluge, radnici, smene, klijenti, termini, kartoteka, ocene, odsustva, listaCekanja, vauceri, promoKodovi,
        proizvodi, osoblje, smsKampanje, dnevnik, galerija, podaciSalona, podesavanja,
        blokirani: [{ id: 'b1', telefon: '064 000 1122', razlog: 'Tri nedolaska bez otkazivanja', datum: dodajDane(danas, -40) }],
    };
}

/** Vreme 'HH:MM' u minute — za forme. */
export { uMinute };
