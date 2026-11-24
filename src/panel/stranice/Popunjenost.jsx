/*
 * POPUNJENOST — koliko su radnici bili zauzeti po danima i satima.
 * Polje mape = zakazani minuti / minuti smene u tom satu, zbirno za sve
 * radnike i sve iste dane u nedelji iz perioda. Prazno (šrafirano) = niko ne radi.
 */
import React, { useMemo, useState } from 'react';
import { BadgePercent, CalendarClock, Clock, Gauge, TrendingUp } from 'lucide-react';
import { usePanel } from '../podaci/Skladiste.jsx';
import { AKTIVNI, prethodniPeriod, promena, slobodniProzori } from '../podaci/analitika.js';
import { uMinute } from '../podaci/generator.js';
import { DANI_KRATKO, DANI_PUNO, DANI_REDOM, danas as danasF, danUNedelji, datumDugo, datumSaDanom, dodajDane, opsegDana, pocetakNedelje, procenat, sadaMinut, trajanje } from '../format.js';
import { Avatar, Dugme, Kartica, Merac, MrezaPlocica, Prazno, StatPlocica, Tabovi, ZaglavljeStrane } from '../ui.jsx';
import { Stubici, ToplotnaMapa } from '../grafikoni.jsx';
import { P } from '../Ljuska.jsx';

const PERIODI = [
    { id: 'ova', naziv: 'Ova nedelja' },
    { id: 'prosla', naziv: 'Prošla nedelja' },
    { id: '4', naziv: '4 nedelje' },
];

const preklop = (a1, a2, b1, b2) => Math.max(0, Math.min(a2, b2) - Math.max(a1, b1));
const sati = (min) => `${(min / 60).toFixed(1).replace('.', ',').replace(',0', '')} h`;
const udeo = (x) => (x && x.s ? x.z / x.s : null);

function opsegPerioda(id, d) {
    const ponedeljak = pocetakNedelje(d);
    if (id === 'ova') return { od: ponedeljak, do: dodajDane(ponedeljak, 6), opis: 'Ova nedelja, sa već zakazanim terminima do nedelje' };
    if (id === 'prosla') return { od: dodajDane(ponedeljak, -7), do: dodajDane(ponedeljak, -1), opis: 'Prošla nedelja' };
    return { od: dodajDane(d, -27), do: d, opis: 'Poslednje 4 nedelje, do danas' };
}

/** Zbir zauzetih (z) i raspoloživih (s) minuta po danu × satu, radniku, danu i satu. */
function racunaj(podaci, poKljucu, od, doDatuma, satiDana) {
    const celije = {}; const poRadniku = {}; const poDanu = {}; const poSatu = {}; const ukupno = { z: 0, s: 0 };
    const dodaj = (o, k, z, s) => { const e = (o[k] ??= { z: 0, s: 0 }); e.z += z; e.s += s; };
    for (const datum of opsegDana(od, doDatuma)) {
        const dan = danUNedelji(datum);
        for (const r of podaci.radnici) {
            const sm = podaci.smene[`${r.id}|${datum}`];
            if (!sm) continue;
            const termini = poKljucu[`${r.id}|${datum}`] ?? [];
            for (const h of satiDana) {
                const hOd = h * 60; const hDo = hOd + 60;
                const s = preklop(sm.od, sm.do, hOd, hDo);
                if (!s) continue;
                const z = Math.min(s, termini.reduce((x, t) => x + preklop(Math.max(t.od, sm.od), Math.min(t.od + t.trajanje, sm.do), hOd, hDo), 0));
                dodaj((celije[dan] ??= {}), h, z, s);
                dodaj(poRadniku, r.id, z, s);
                dodaj(poDanu, dan, z, s);
                dodaj(poSatu, h, z, s);
                ukupno.z += z; ukupno.s += s;
            }
        }
    }
    return { celije, poRadniku, poDanu, poSatu, ukupno };
}

export default function Popunjenost() {
    const { podaci } = usePanel();
    const [period, setPeriod] = useState('ova');
    const d = danasF();

    // Aktivni termini po radniku i danu — mapa se pravi jednom.
    const poKljucu = useMemo(() => {
        const m = {};
        podaci.termini.forEach((t) => { if (AKTIVNI.has(t.status)) (m[`${t.radnikId}|${t.datum}`] ??= []).push(t); });
        return m;
    }, [podaci.termini]);

    // Raspon sati salona: od najranijeg otvaranja do najkasnijeg zatvaranja.
    const { dani, satiDana } = useMemo(() => {
        const rv = podaci.podaciSalona.radnoVreme ?? {};
        const otvoreni = DANI_REDOM.filter((x) => rv[x]);
        const pocetak = otvoreni.length ? Math.min(...otvoreni.map((x) => uMinute(rv[x][0]))) : 9 * 60;
        const kraj = otvoreni.length ? Math.max(...otvoreni.map((x) => uMinute(rv[x][1]))) : 20 * 60;
        const h = [];
        for (let x = Math.floor(pocetak / 60); x < Math.ceil(kraj / 60); x++) h.push(x);
        return { dani: otvoreni.length ? otvoreni : DANI_REDOM.slice(0, 6), satiDana: h };
    }, [podaci.podaciSalona]);

    const p = useMemo(() => opsegPerioda(period, d), [period, d]);
    const r = useMemo(() => racunaj(podaci, poKljucu, p.od, p.do, satiDana), [podaci, poKljucu, p, satiDana]);
    const pre = useMemo(() => { const [od, doD] = prethodniPeriod(p.od, p.do); return racunaj(podaci, poKljucu, od, doD, satiDana); }, [podaci, poKljucu, p, satiDana]);

    // Slobodno u narednih 7 dana (prozori od najmanje 30 min, od sada).
    const slobodno = useMemo(() => opsegDana(d, dodajDane(d, 6)).map((datum) => {
        const min = podaci.radnici.reduce((x, rad) => x + slobodniProzori(podaci, datum, rad.id, datum === d ? sadaMinut() : 0, 30).reduce((s, w) => s + (w.do - w.od), 0), 0);
        return { datum, min };
    }), [podaci, d]);
    const slobodnoUkupno = slobodno.reduce((s, x) => s + x.min, 0);

    const prosek = udeo(r.ukupno);
    const prosekPre = udeo(pre.ukupno);
    const najDan = dani.map((x) => ({ dan: x, v: udeo(r.poDanu[x]) })).filter((x) => x.v != null).sort((a, b) => b.v - a.v)[0];
    const najvecaPonuda = Math.max(0, ...Object.values(r.poSatu).map((x) => x.s));
    // Najslabiji sat: samo sati sa bar četvrtinom uobičajene ponude (rubni sati ne računaju).
    const slabSat = satiDana.map((h) => ({ h, x: r.poSatu[h] })).filter((e) => e.x && e.x.s >= najvecaPonuda * 0.25).sort((a, b) => a.x.z / a.x.s - b.x.z / b.x.s)[0];
    const rasponSata = (h) => `${h}–${h + 1}h`;

    const labela = Object.fromEntries(dani.map((x) => [DANI_KRATKO[x], x]));
    const vrednost = (red, h) => udeo(r.celije[labela[red]]?.[h]);
    const opis = (red, h, v) => {
        const c = r.celije[labela[red]]?.[h];
        return v == null ? `${red} ${h}h — niko ne radi` : `${red} ${h}h — ${procenat(v)} (zauzeto ${trajanje(c.z)} od ${trajanje(c.s)})`;
    };

    const radnici = podaci.radnici.map((rad) => ({ rad, x: r.poRadniku[rad.id] })).sort((a, b) => (udeo(b.x) ?? -1) - (udeo(a.x) ?? -1));

    return (
        <div className="flex flex-col gap-4">
            <ZaglavljeStrane naslov="Popunjenost" opis={`${p.opis} · ${datumDugo(p.od, false)} – ${datumDugo(p.do)} Zakazano vreme u odnosu na vreme u smeni.`}
                akcije={<Tabovi stavke={PERIODI} aktivan={period} onChange={setPeriod} />} />

            <MrezaPlocica>
                <StatPlocica ikona={Gauge} oznaka="Prosečna popunjenost" vrednost={prosek == null ? '—' : procenat(prosek)} trend={prosek != null && prosekPre != null ? promena(prosek, prosekPre) : null}
                    napomena={prosekPre != null ? `pre toga ${procenat(prosekPre)}` : 'nema smena u periodu'} info="Strelica poredi sa periodom iste dužine neposredno pre." />
                <StatPlocica ikona={TrendingUp} ton="ok" oznaka="Najpopunjeniji dan" vrednost={najDan ? DANI_PUNO[najDan.dan] : '—'} napomena={najDan ? `${procenat(najDan.v)} zauzeto` : ''} />
                <StatPlocica ikona={Clock} ton="upoz" oznaka="Najslabiji sat" vrednost={slabSat ? rasponSata(slabSat.h) : '—'} napomena={slabSat ? `${procenat(slabSat.x.z / slabSat.x.s)} · kandidat za popust` : ''} />
                <StatPlocica ikona={CalendarClock} ton="info" oznaka="Slobodno, narednih 7 dana" vrednost={sati(slobodnoUkupno)} napomena="prozori od 30+ min" to={`${P}/kalendar`} />
            </MrezaPlocica>

            <Kartica naslov="Po danu i satu" opis="Pređite mišem (ili dodirnite) polje za detalje. Zbir svih radnika u smeni.">
                {r.ukupno.s ? (
                    <ToplotnaMapa redovi={dani.map((x) => DANI_KRATKO[x])} kolone={satiDana} vrednost={vrednost} opis={opis} oznakaKolone={(h) => `${h}h`} />
                ) : <Prazno ikona={Gauge} naslov="Nema smena u periodu" opis="Za ovaj period nije unet raspored." />}
            </Kartica>

            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
                <Kartica naslov="Po radniku" opis="Prosek perioda · zakazano od vremena u smeni" telo="p-2">
                    <ul>
                        {radnici.map(({ rad, x }) => {
                            const v = udeo(x);
                            return (
                                <li key={rad.id} className="flex items-center gap-3 rounded-xl px-3 py-3">
                                    <Avatar ime={rad.ime} slika={rad.slika} boja={rad.boja} velicina={36} />
                                    <div className="min-w-0 flex-1">
                                        <div className="flex items-baseline justify-between gap-2">
                                            <span className="truncate text-sm font-medium">{rad.ime}</span>
                                            <span className="shrink-0 text-[12.5px] text-p-tiho tabularno">{x ? `${sati(x.z)} od ${sati(x.s)}` : 'bez smena'}</span>
                                        </div>
                                        <div className="mt-1.5 flex items-center gap-2">
                                            <Merac vrednost={v ?? 0} oznaka={`Popunjenost ${rad.ime}`} />
                                            <span className="w-10 shrink-0 text-right text-[12px] font-medium text-p-tiho tabularno">{v == null ? '—' : procenat(v)}</span>
                                        </div>
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </Kartica>

                <Kartica naslov="Slobodno u narednih 7 dana" opis={`${sati(slobodnoUkupno)} slobodno kod svih radnika`}>
                    <Stubici stavke={slobodno.map((x) => ({ oznaka: DANI_KRATKO[danUNedelji(x.datum)], vrednost: Math.round(x.min / 6) / 10, opis: `${datumSaDanom(x.datum)}${x.datum === d ? ' (od sada)' : ''}` }))}
                        visina={180} format={(v) => `${String(v).replace('.', ',')} h`} formatOse={(v) => `${String(v).replace('.', ',')} h`} oznakaSerije="Slobodno" />
                    <div className="mt-4 rounded-xl bg-p-meko/70 p-3 text-[13px]">
                        <p className="text-p-ink">
                            {slabSat
                                ? <>Najslabiji termin je <b className="font-semibold">{rasponSata(slabSat.h)}</b> ({procenat(slabSat.x.z / slabSat.x.s)} zauzeto). Popusti za termine u tom satu (npr. −15% pre podne) često popune rupe u rasporedu.</>
                                : 'Popusti za termine u slabijim satima često popune rupe u rasporedu.'}
                        </p>
                        <Dugme className="mt-3" velicina="sm" varijanta="glavno" ikona={BadgePercent} to={`${P}/promo-kodovi`}>Promo kodovi</Dugme>
                    </div>
                </Kartica>
            </div>
        </div>
    );
}
