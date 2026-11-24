/*
 * ANALITIKA SALONA (vlasnik) — promet, usluge, radnici i klijenti za izabrani
 * period, uvek uz poređenje sa prethodnim periodom iste dužine. Gledaju se
 * samo prošli dani (do danas); budući termini nisu promet.
 */
import React, { useMemo, useState } from 'react';
import { Banknote, CalendarCheck, Download, Receipt, UserPlus } from 'lucide-react';
import { usePanel, useIndeksi, imeKlijenta, naziviUsluga } from '../podaci/Skladiste.jsx';
import { naplaceni, poUslugama, prethodniPeriod, prometPoDanu, promena, zauzetostDana, zbir } from '../podaci/analitika.js';
import { DANI_PUNO, DANI_KRATKO, DANI_REDOM, broj, danas as danasF, danUNedelji, datumDugo, datumKratko, datumSaDanomDugo, dodajDane, opsegDana, pocetakMeseca, pocetakNedelje, procenat, razlikaDana, rsd, rsdKratko, termina, uSate, klijenata } from '../format.js';
import { Avatar, Dugme, Kartica, MrezaPlocica, NACINI_PLACANJA, Prazno, StatPlocica, Tabela, Tabovi, ZaglavljeStrane } from '../ui.jsx';
import { NaslaganaTraka, RangLista, Stubici, TrendGrafikon } from '../grafikoni.jsx';

const PERIODI = [
    { id: '7', naziv: '7 dana' },
    { id: '30', naziv: '30 dana' },
    { id: '90', naziv: '90 dana' },
    { id: 'mesec', naziv: 'Ovaj mesec' },
    { id: 'prosli', naziv: 'Prošli mesec' },
];

const IZVORI = { online: 'Online zakazivanje', telefon: 'Telefon', pult: 'Na pultu', instagram: 'Instagram' };

const dvaMesta = (n) => String(n).padStart(2, '0');
const ocenaTekst = (x) => (x ? x.toFixed(2).replace('.', ',') : '—');

/** Od–do izabranog perioda i prethodni period za poređenje. */
function opsegPerioda(id, d) {
    if (id === 'mesec') {
        const od = pocetakMeseca(d);
        const pm = dodajDane(od, -1);
        const pDo = `${pm.slice(0, 8)}${dvaMesta(Math.min(Number(d.slice(8)), Number(pm.slice(8))))}`;
        return { od, do: d, pOd: pocetakMeseca(pm), pDo, pNaziv: 'isti deo prošlog meseca' };
    }
    if (id === 'prosli') {
        const doD = dodajDane(pocetakMeseca(d), -1);
        const od = pocetakMeseca(doD);
        const pDo = dodajDane(od, -1);
        return { od, do: doD, pOd: pocetakMeseca(pDo), pDo, pNaziv: 'mesec ranije' };
    }
    const n = Number(id);
    const od = dodajDane(d, -(n - 1));
    const [pOd, pDo] = prethodniPeriod(od, d);
    return { od, do: d, pOd, pDo, pNaziv: `prethodnih ${n} dana` };
}

/** CSV naplaćenih termina — pravi se u browseru, ništa ne ide na server. */
function preuzmiCsv(termini, indeks, od, doDatuma) {
    const esc = (v) => { const s = String(v ?? ''); return /[";\r\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
    const redovi = [
        ['Datum', 'Vreme', 'Klijent', 'Radnik', 'Usluge', 'Trajanje (min)', 'Cena (RSD)', 'Plaćanje', 'Izvor'],
        ...[...termini].sort((a, b) => a.datum.localeCompare(b.datum) || a.od - b.od).map((t) => [
            t.datum, uSate(t.od), imeKlijenta(indeks.klijent[t.klijentId]), indeks.radnik[t.radnikId]?.ime ?? t.radnikId,
            naziviUsluga(t.usluge, indeks), t.trajanje, t.cena, NACINI_PLACANJA[t.placanje] ?? '', IZVORI[t.izvor] ?? t.izvor ?? '',
        ]),
    ];
    const csv = `﻿${redovi.map((r) => r.map(esc).join(';')).join('\r\n')}`;
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = `promet-${od}-do-${doDatuma}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
}

export default function Analitika() {
    const { podaci, obavesti } = usePanel();
    const indeks = useIndeksi();
    const [period, setPeriod] = useState('30');
    const d = danasF();

    const a = useMemo(() => {
        const { od, do: doD, pOd, pDo, pNaziv } = opsegPerioda(period, d);
        const pocetakPodataka = podaci.termini.reduce((m, t) => (t.datum < m ? t.datum : m), d);
        const poredi = pOd >= pocetakPodataka;

        const nap = naplaceni(podaci.termini, od, doD);
        const preNap = poredi ? naplaceni(podaci.termini, pOd, pDo) : [];
        const promet = zbir(nap);
        const prePromet = zbir(preNap);
        const prosek = nap.length ? promet / nap.length : 0;
        const preProsek = preNap.length ? prePromet / preNap.length : 0;
        const novi = podaci.klijenti.filter((k) => k.kreiran >= od && k.kreiran <= doD).length;
        const preNovi = podaci.klijenti.filter((k) => k.kreiran >= pOd && k.kreiran <= pDo).length;

        // Dnevni promet (ili nedeljni za 90 dana).
        // Dani kad salon ne radi se ne crtaju — nula bi izgledala kao pad prometa.
        const radiDan = (x) => !!podaci.podaciSalona.radnoVreme?.[danUNedelji(x.datum)];
        const dani = prometPoDanu(podaci.termini, od, doD).filter(radiDan);
        const preDani = poredi ? prometPoDanu(podaci.termini, pOd, pDo).filter(radiDan).slice(0, dani.length) : null;
        const nedelje = [];
        if (period === '90') {
            const mapa = {};
            dani.forEach((x) => { const n = pocetakNedelje(x.datum); const e = (mapa[n] ??= { od: n, iznos: 0, broj: 0, dana: 0 }); e.iznos += x.iznos; e.broj += x.broj; e.dana += 1; });
            Object.values(mapa).sort((x, y) => x.od.localeCompare(y.od)).forEach((e) => nedelje.push(e));
        }

        // Prosek po danu u nedelji (samo dani kad salon radi).
        const rv = podaci.podaciSalona.radnoVreme ?? {};
        const poDanu = Object.fromEntries(DANI_REDOM.map((x) => [x, { iznos: 0, dana: 0 }]));
        dani.forEach((x) => { const dan = danUNedelji(x.datum); if (!rv[dan] && !x.iznos) return; poDanu[dan].iznos += x.iznos; poDanu[dan].dana += 1; });
        const daniNedelje = DANI_REDOM.filter((x) => poDanu[x].dana > 0).map((x) => ({ dan: x, prosek: poDanu[x].iznos / poDanu[x].dana, dana: poDanu[x].dana }));
        const najjaciDan = daniNedelje.reduce((m, x) => (!m || x.prosek > m.prosek ? x : m), null);

        // Usluge i kategorije.
        const usluge = poUslugama(nap).map((u) => ({ id: u.id, naziv: indeks.usluga[u.id]?.naziv ?? u.id, broj: u.broj, iznos: Math.round(u.iznos), udeo: promet ? u.iznos / promet : 0, prosecna: u.broj ? u.iznos / u.broj : 0 }));
        const kat = {};
        usluge.forEach((u) => { const k = indeks.usluga[u.id]?.kategorija ?? 'ostalo'; const e = (kat[k] ??= { id: k, iznos: 0, broj: 0 }); e.iznos += u.iznos; e.broj += u.broj; });
        const kategorije = Object.values(kat).sort((x, y) => y.iznos - x.iznos);

        // Radnici.
        const daniPerioda = opsegDana(od, doD);
        const radnici = podaci.radnici.map((r) => {
            const t = nap.filter((x) => x.radnikId === r.id);
            const iznos = zbir(t);
            const z = daniPerioda.map((x) => zauzetostDana(podaci, x, r.id)).filter((v) => v != null);
            const oc = podaci.ocene.filter((o) => o.radnikId === r.id && o.datum >= od && o.datum <= doD);
            return {
                id: r.id, ime: r.ime, slika: r.slika, boja: r.boja, broj: t.length, iznos, prosek: t.length ? iznos / t.length : 0,
                popunjenost: z.length ? z.reduce((s, v) => s + v, 0) / z.length : null, smena: z.length,
                ocena: oc.length ? oc.reduce((s, o) => s + o.ocena, 0) / oc.length : null, brojOcena: oc.length,
            };
        });

        // Klijenti: novi (prva poseta u periodu) ili povratni (bili su i ranije).
        const sveNap = podaci.termini.filter((t) => t.status === 'zavrsen').sort((x, y) => x.datum.localeCompare(y.datum));
        const posete = {};
        sveNap.forEach((t) => (posete[t.klijentId] ??= []).push(t.datum));
        const klijentiPerioda = [...new Set(nap.map((t) => t.klijentId))];
        let noviK = 0; let povratniK = 0; let vratiliSe60 = 0;
        klijentiPerioda.forEach((id) => {
            const lista = posete[id] ?? [];
            const prvaUPeriodu = lista.find((x) => x >= od);
            const ranije = lista.filter((x) => x < prvaUPeriodu);
            // Klijent upisan pre početka demo podataka sigurno je dolazio i ranije.
            const stari = (indeks.klijent[id]?.kreiran ?? d) < pocetakPodataka;
            if (ranije.length || stari) povratniK += 1; else noviK += 1;
            const poslednjaRanije = ranije[ranije.length - 1];
            if (poslednjaRanije && razlikaDana(poslednjaRanije, prvaUPeriodu) <= 60) vratiliSe60 += 1;
        });

        const izvori = Object.keys(IZVORI).map((k) => ({ id: k, broj: nap.filter((t) => t.izvor === k).length })).filter((x) => x.broj > 0).sort((x, y) => y.broj - x.broj);
        const placanje = Object.keys(NACINI_PLACANJA).map((k) => ({ oznaka: NACINI_PLACANJA[k], vrednost: zbir(nap.filter((t) => t.placanje === k)) }));

        return {
            od, doD, pOd, pDo, pNaziv, poredi, nap, promet, prePromet, prosek, preProsek, novi, preNovi, preBroj: preNap.length,
            dani, preDani, nedelje, daniNedelje, najjaciDan, usluge, kategorije, radnici,
            klijentiPerioda: klijentiPerioda.length, noviK, povratniK, vratiliSe60, izvori, placanje,
        };
    }, [podaci, indeks, period, d]);

    const t = (sada, pre) => (a.poredi ? promena(sada, pre) : null);
    const napomena = (tekst) => (a.poredi ? `${a.pNaziv}: ${tekst}` : 'nema podataka za poređenje');
    const uslugaKolone = [
        { kljuc: 'naziv', naslov: 'Usluga', render: (r) => <span className="font-medium">{r.naziv}</span> },
        { kljuc: 'broj', naslov: 'Broj', desno: true },
        { kljuc: 'iznos', naslov: 'Promet', desno: true, mobilno: 'istaknuto', render: (r) => rsd(r.iznos) },
        { kljuc: 'udeo', naslov: 'Udeo', desno: true, render: (r) => procenat(r.udeo, 1) },
        { kljuc: 'prosecna', naslov: 'Prosečna cena', desno: true, render: (r) => rsd(r.prosecna) },
    ];
    const radnikKolone = [
        { kljuc: 'ime', naslov: 'Radnik', render: (r) => <span className="flex items-center gap-2.5"><Avatar ime={r.ime} slika={r.slika} boja={r.boja} velicina={30} /><span className="font-medium">{r.ime}</span></span> },
        { kljuc: 'broj', naslov: 'Termina', desno: true },
        { kljuc: 'iznos', naslov: 'Promet', desno: true, mobilno: 'istaknuto', render: (r) => rsd(r.iznos) },
        { kljuc: 'prosek', naslov: 'Prosečan račun', desno: true, render: (r) => (r.broj ? rsd(r.prosek) : '—') },
        { kljuc: 'popunjenost', naslov: 'Popunjenost', desno: true, render: (r) => (r.popunjenost == null ? '—' : <span title={`Prosek ${r.smena} ${r.smena === 1 ? 'dan' : 'dana'} u smeni`}>{procenat(r.popunjenost)}</span>) },
        { kljuc: 'ocena', naslov: 'Ocena', desno: true, render: (r) => (r.ocena == null ? '—' : <span title={`${r.brojOcena} ocena`}><span className="text-p-zlato" aria-hidden="true">★ </span>{ocenaTekst(r.ocena)}</span>) },
    ];

    const opisPerioda = `${datumDugo(a.od, a.od.slice(0, 4) !== a.doD.slice(0, 4))} – ${datumDugo(a.doD)}`;
    const ukupnoKlijenata = a.noviK + a.povratniK;

    return (
        <div className="flex flex-col gap-4">
            <ZaglavljeStrane naslov="Analitika salona" opis={`${opisPerioda} · naplaćeni termini · poređenje: ${a.poredi ? a.pNaziv : 'nema starijih podataka'}`}
                akcije={(
                    <>
                        <Tabovi stavke={PERIODI} aktivan={period} onChange={setPeriod} />
                        <Dugme ikona={Download} disabled={!a.nap.length} kratko="CSV"
                            onClick={() => { preuzmiCsv(a.nap, indeks, a.od, a.doD); obavesti(`CSV je preuzet (${termina(a.nap.length)}).`); }}>Preuzmi CSV</Dugme>
                    </>
                )} />

            <MrezaPlocica>
                <StatPlocica ikona={Banknote} ton="ok" oznaka="Promet" vrednost={rsd(a.promet)} trend={t(a.promet, a.prePromet)} napomena={napomena(rsdKratko(a.prePromet))} />
                <StatPlocica ikona={CalendarCheck} oznaka="Naplaćeni termini" vrednost={broj(a.nap.length)} trend={t(a.nap.length, a.preBroj)} napomena={napomena(broj(a.preBroj))} />
                <StatPlocica ikona={Receipt} ton="info" oznaka="Prosečan račun" vrednost={rsd(a.prosek)} trend={t(a.prosek, a.preProsek)} napomena={napomena(rsd(a.preProsek))} />
                <StatPlocica ikona={UserPlus} ton="akc" oznaka="Novi klijenti" vrednost={broj(a.novi)} trend={t(a.novi, a.preNovi)} napomena={napomena(broj(a.preNovi))} info="Klijenti upisani u kartoteku u ovom periodu." />
            </MrezaPlocica>

            {!a.nap.length ? (
                <Kartica><Prazno ikona={CalendarCheck} naslov="Nema naplaćenih termina u periodu" opis="Izaberite duži period." /></Kartica>
            ) : (
                <>
                    <div className="grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
                        {period === '90' ? (
                            <Kartica naslov="Promet po nedeljama" opis={`${rsd(a.promet)} · ${termina(a.nap.length)} · prosečno ${rsd(a.promet / Math.max(1, a.nedelje.length))} nedeljno`}>
                                <Stubici stavke={a.nedelje.map((n) => ({ oznaka: datumKratko(n.od), vrednost: n.iznos, opis: `Nedelja od ${datumKratko(n.od)}${n.dana < 7 ? ` (${n.dana} ${n.dana === 1 ? 'dan' : 'dana'})` : ''} · ${termina(n.broj)}`, istaknut: n.dana === 7 ? undefined : false }))} visina={240} format={rsd} formatOse={rsdKratko} oznakaSerije="Promet" />
                            </Kartica>
                        ) : (
                            <Kartica naslov="Promet po danu" opis={`${rsd(a.promet)}${a.poredi ? ` · ${a.pNaziv} ${rsd(a.prePromet)}` : ''}`}>
                                <TrendGrafikon tacke={a.dani.map((x) => ({ oznaka: datumKratko(x.datum), vrednost: x.iznos, opis: `${datumSaDanomDugo(x.datum)} · ${termina(x.broj)}` }))}
                                    poredjenje={a.preDani?.map((x) => ({ vrednost: x.iznos }))} visina={240} format={rsd} formatOse={rsdKratko} oznakaSerije="Promet" oznakaPoredjenja={a.pNaziv.charAt(0).toUpperCase() + a.pNaziv.slice(1)} />
                            </Kartica>
                        )}
                        <Kartica naslov="Po danu u nedelji" opis={a.najjaciDan ? `Najjači dan: ${DANI_PUNO[a.najjaciDan.dan]} · prosečno ${rsd(a.najjaciDan.prosek)}` : 'Prosečan promet po danu'}>
                            <Stubici stavke={a.daniNedelje.map((x) => ({ oznaka: DANI_KRATKO[x.dan], vrednost: Math.round(x.prosek), opis: `${DANI_PUNO[x.dan]} · prosek od ${x.dana} ${x.dana === 1 ? 'dana' : 'dana'}`, istaknut: x.dan === a.najjaciDan?.dan ? undefined : false }))} visina={240} format={rsd} formatOse={rsdKratko} oznakaSerije="Prosečno" />
                        </Kartica>
                    </div>

                    <div className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
                        <Kartica naslov="Najprodavanije usluge" opis="Ako termin ima više usluga, iznos se deli na jednake delove." telo="py-1">
                            <Tabela kolone={uslugaKolone} redovi={a.usluge} pocetnoSort={{ kljuc: 'iznos', smer: 'opadajuce' }} poStrani={8} gusto />
                        </Kartica>
                        <Kartica naslov="Promet po kategoriji" opis="Iznos i udeo u prometu perioda">
                            <RangLista stavke={a.kategorije.map((k) => ({ oznaka: indeks.kategorija[k.id]?.naziv ?? 'Ostalo', vrednost: Math.round(k.iznos), dodatak: procenat(a.promet ? k.iznos / a.promet : 0) }))} format={rsd} />
                        </Kartica>
                    </div>

                    <Kartica naslov="Radnici" opis="Popunjenost je prosek dana u smeni; ocena je prosek ocena iz perioda." telo="py-1">
                        <Tabela kolone={radnikKolone} redovi={a.radnici} pocetnoSort={{ kljuc: 'iznos', smer: 'opadajuce' }} />
                    </Kartica>

                    <div className="grid gap-4 lg:grid-cols-3">
                        <Kartica naslov="Klijenti" opis={`${klijenata(a.klijentiPerioda)} sa naplaćenim terminom`}>
                            <NaslaganaTraka delovi={[{ oznaka: 'Povratni', vrednost: a.povratniK }, { oznaka: 'Novi (prva poseta)', vrednost: a.noviK }]} format={broj} />
                            <div className="mt-5 flex items-center justify-between gap-3 rounded-xl bg-p-meko/70 px-3 py-2.5 text-[13px]" title="Klijenti iz perioda kojima je prethodna poseta bila najviše 60 dana ranije.">
                                <span className="text-p-tiho">Vratilo se u 60 dana</span>
                                <span className="font-semibold text-p-ink tabularno">{procenat(ukupnoKlijenata ? a.vratiliSe60 / ukupnoKlijenata : 0)} <span className="font-normal text-p-tiho">· {broj(a.vratiliSe60)} od {broj(ukupnoKlijenata)}</span></span>
                            </div>
                        </Kartica>
                        <Kartica naslov="Odakle dolaze termini" opis="Kanal zakazivanja naplaćenih termina">
                            <RangLista stavke={a.izvori.map((x) => ({ oznaka: IZVORI[x.id], vrednost: x.broj, dodatak: procenat(x.broj / a.nap.length) }))} format={broj} />
                        </Kartica>
                        <Kartica naslov="Način plaćanja" opis="Naplaćeno u periodu">
                            <NaslaganaTraka delovi={a.placanje} format={rsd} />
                        </Kartica>
                    </div>
                </>
            )}
        </div>
    );
}
