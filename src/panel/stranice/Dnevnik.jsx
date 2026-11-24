/*
 * DNEVNIK IZMENA — ko je šta promenio u panelu i kada, najnovije prvo,
 * grupisano po danima. Upisuje ga zapisi() iz Skladista na svaku bitnu izmenu.
 */
import React, { useMemo, useState } from 'react';
import { Activity, CalendarRange, History, Trophy } from 'lucide-react';
import { usePanel } from '../podaci/Skladiste.jsx';
import { ZONA } from '../../lib/vreme.js';
import { danas as danasF, datumSaDanomDugo, dodajDane, mnozina, pocetakNedelje } from '../format.js';
import { Avatar, Dugme, Izbor, Kartica, Prazno, Pretraga, StatPlocica, Tabovi, ZaglavljeStrane, Znacka } from '../ui.jsx';

const NA_STRANI = 60;

const GRUPE = {
    termini: { naziv: 'Termini', vrste: ['termin', 'zahtev'], ton: 'info' },
    naplata: { naziv: 'Naplata', vrste: ['naplata'], ton: 'ok' },
    usluge: { naziv: 'Usluge', vrste: ['usluga', 'proizvod', 'vaucer', 'promo'], ton: 'akc' },
    raspored: { naziv: 'Raspored', vrste: ['raspored', 'odsustvo', 'smena', 'radno-vreme'], ton: 'upoz' },
    klijenti: { naziv: 'Klijenti', vrste: ['klijent', 'kartoteka', 'blokada', 'lista-cekanja'], ton: 'tiho' },
};
const grupaVrste = (v) => Object.keys(GRUPE).find((g) => GRUPE[g].vrste.includes(v)) ?? 'ostalo';
const NAZIV_VRSTE = { termin: 'Termin', zahtev: 'Zahtev', naplata: 'Naplata', usluga: 'Usluga', proizvod: 'Proizvod', vaucer: 'Vaučer', promo: 'Promo kod', raspored: 'Raspored', odsustvo: 'Odsustvo', smena: 'Smena', klijent: 'Klijent', kartoteka: 'Kartoteka', blokada: 'Blokada', osoblje: 'Osoblje', podesavanja: 'Podešavanja', profil: 'Profil', sajt: 'Sajt' };

const fmt = new Intl.DateTimeFormat('en-CA', { timeZone: ZONA, year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
/** ts → { datum: 'YYYY-MM-DD', vreme: 'HH:MM' } u zoni salona. */
const uSalonu = (ts) => { const d = Object.fromEntries(fmt.formatToParts(new Date(ts)).map((p) => [p.type, p.value])); return { datum: `${d.year}-${d.month}-${d.day}`, vreme: `${d.hour}:${d.minute}` }; };
const bezKvacica = (s = '') => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'dj');
const naslovDana = (iso, d) => (iso === d ? 'Danas' : iso === dodajDane(d, -1) ? 'Juče' : datumSaDanomDugo(iso));
const izmena = (n) => `${n} ${mnozina(n, 'izmena', 'izmene', 'izmena')}`;

export default function Dnevnik() {
    const { podaci } = usePanel();
    const [grupa, setGrupa] = useState('sve');
    const [ko, setKo] = useState('');
    const [q, setQ] = useState('');
    const [koliko, setKoliko] = useState(NA_STRANI);
    const d = danasF();

    const svi = useMemo(() => [...(podaci.dnevnik ?? [])].sort((a, b) => b.ts - a.ts).map((x) => ({ ...x, ...uSalonu(x.ts), grupa: grupaVrste(x.vrsta) })), [podaci.dnevnik]);
    const ljudi = useMemo(() => [...new Set(svi.map((x) => x.ko))].sort((a, b) => a.localeCompare(b, 'sr')), [svi]);

    const brojke = useMemo(() => {
        const nedelja = pocetakNedelje(d);
        const ove = svi.filter((x) => x.datum >= nedelja);
        const po = {};
        ove.forEach((x) => { po[x.ko] = (po[x.ko] ?? 0) + 1; });
        const [najIme, najBroj] = Object.entries(po).sort((a, b) => b[1] - a[1])[0] ?? [];
        return { danas: svi.filter((x) => x.datum === d).length, nedelja: ove.length, najIme, najBroj };
    }, [svi, d]);

    const lista = useMemo(() => {
        const t = bezKvacica(q.trim());
        return svi.filter((x) => (grupa === 'sve' || x.grupa === grupa) && (!ko || x.ko === ko) && (!t || bezKvacica(`${x.ko} ${x.radnja} ${x.opis}`).includes(t)));
    }, [svi, grupa, ko, q]);

    const dani = useMemo(() => {
        const m = [];
        lista.slice(0, koliko).forEach((x) => { const posl = m[m.length - 1]; if (posl?.datum === x.datum) posl.stavke.push(x); else m.push({ datum: x.datum, stavke: [x] }); });
        return m;
    }, [lista, koliko]);

    const brojGrupe = (g) => svi.filter((x) => (g === 'sve' || x.grupa === g) && (!ko || x.ko === ko)).length;
    const tabovi = [{ id: 'sve', naziv: 'Sve' }, ...Object.entries(GRUPE).map(([id, g]) => ({ id, naziv: g.naziv })), { id: 'ostalo', naziv: 'Ostalo' }].map((s) => ({ ...s, broj: brojGrupe(s.id) }));
    const reset = (fn) => (v) => { fn(v); setKoliko(NA_STRANI); };
    const filtrirano = grupa !== 'sve' || ko || q;

    return (
        <div className="flex flex-col gap-4">
            <ZaglavljeStrane naslov="Dnevnik izmena" opis="Ko je šta promenio u panelu i kada — termini, naplata, cene, raspored i klijenti." />

            <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
                <StatPlocica ikona={Activity} oznaka="Izmena danas" vrednost={brojke.danas} napomena={datumSaDanomDugo(d)} />
                <StatPlocica ikona={CalendarRange} ton="info" oznaka="Ove nedelje" vrednost={brojke.nedelja} napomena="od ponedeljka" />
                <StatPlocica className="col-span-2 lg:col-span-1" ikona={Trophy} ton="ok" oznaka="Najaktivniji ove nedelje"
                    vrednost={<span className="flex min-w-0 items-center gap-2.5">{brojke.najIme && <Avatar ime={brojke.najIme} velicina={28} />}<span className="truncate text-[20px] sm:text-[22px]">{brojke.najIme ?? '—'}</span></span>}
                    napomena={brojke.najBroj ? izmena(brojke.najBroj) : 'nema izmena'} />
            </div>

            <Kartica telo="p-0">
                <div className="flex flex-col gap-3 border-b border-p-ivica/70 p-3 sm:p-4">
                    <Tabovi mali stavke={tabovi} aktivan={grupa} onChange={reset(setGrupa)} />
                    <div className="grid gap-2.5 sm:grid-cols-[minmax(0,1fr)_240px]">
                        <Pretraga vrednost={q} onChange={reset(setQ)} placeholder="Radnja, klijent ili osoba…" />
                        <Izbor value={ko} onChange={(e) => reset(setKo)(e.target.value)} aria-label="Osoba">
                            <option value="">Sve osobe</option>
                            {ljudi.map((x) => <option key={x} value={x}>{x}</option>)}
                        </Izbor>
                    </div>
                </div>

                {dani.length ? (
                    <div className="px-3 pb-3 sm:px-5">
                        {dani.map((dan) => (
                            <section key={dan.datum} aria-label={naslovDana(dan.datum, d)}>
                                <h2 className="flex items-baseline justify-between gap-2 pb-2 pt-4">
                                    <span className="text-[13px] font-semibold text-p-ink">{naslovDana(dan.datum, d)}</span>
                                    <span className="text-[12px] text-p-tiho tabularno">{izmena(dan.stavke.length)}</span>
                                </h2>
                                <ol className="relative ml-[54px] border-l border-p-ivica">
                                    {dan.stavke.map((x) => (
                                        <li key={x.id} className="relative py-2.5 pl-5">
                                            <span className="absolute -left-[54px] top-3 w-[42px] text-right text-[12.5px] font-medium text-p-tiho tabularno">{x.vreme}</span>
                                            <span className="absolute -left-[5px] top-[15px] h-[9px] w-[9px] rounded-full border-2 border-p-karta bg-p-polje" aria-hidden="true" />
                                            <div className="flex min-w-0 items-start gap-2.5">
                                                <Avatar ime={x.ko} velicina={26} className="mt-px" />
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-[13.5px]">
                                                        <span className="font-semibold">{x.ko}</span>
                                                        <span className="text-p-ink">{x.radnja.charAt(0).toLowerCase() + x.radnja.slice(1)}</span>
                                                        <Znacka ton={GRUPE[x.grupa]?.ton ?? 'tiho'} className="!text-[11px] !leading-[18px]">{NAZIV_VRSTE[x.vrsta] ?? x.vrsta}</Znacka>
                                                    </div>
                                                    {x.opis && <p className="mt-0.5 break-words text-[13px] text-p-tiho">{x.opis}</p>}
                                                </div>
                                            </div>
                                        </li>
                                    ))}
                                </ol>
                            </section>
                        ))}
                        {lista.length > koliko && (
                            <div className="pt-3 text-center"><Dugme varijanta="tiho" velicina="sm" onClick={() => setKoliko((k) => k + NA_STRANI)}>Prikaži još ({lista.length - koliko})</Dugme></div>
                        )}
                    </div>
                ) : (
                    <Prazno ikona={History} naslov={filtrirano ? 'Nema izmena za ovaj filter' : 'Dnevnik je prazan'} opis={filtrirano ? 'Probajte drugu vrstu ili osobu.' : 'Svaka izmena u panelu upisuje se ovde.'}
                        akcija={filtrirano ? <Dugme varijanta="obicno" velicina="sm" onClick={() => { setGrupa('sve'); setKo(''); setQ(''); }}>Poništi filtere</Dugme> : undefined} />
                )}
            </Kartica>
        </div>
    );
}
