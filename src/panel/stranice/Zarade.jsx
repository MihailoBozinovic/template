/*
 * ZARADE (vlasnik) — obračun za mesec: osnovna plata + provizija na promet
 * naplaćenih termina. Provizija se menja u redu; „Označi kao isplaćeno” čuva
 * se u podaci.isplate pod ključem `${radnikId}|YYYY-MM`.
 */
import React, { useEffect, useMemo, useState } from 'react';
import { Banknote, CheckCircle2, Percent, Undo2, Users, Wallet } from 'lucide-react';
import { usePanel } from '../podaci/Skladiste.jsx';
import { naplaceni, zbir } from '../podaci/analitika.js';
import { MESECI, danas as danasF, datumKratko, dodajDane, pocetakMeseca, procenat, rsd, rsdKratko } from '../format.js';
import { Avatar, Dugme, Izbor, Kartica, MrezaPlocica, StatPlocica, Tabela, Unos, ZaglavljeStrane, Znacka } from '../ui.jsx';
import { Stubici } from '../grafikoni.jsx';

const nazivMeseca = (ym) => { const [g, m] = ym.split('-').map(Number); const n = MESECI[m - 1]; return `${n.charAt(0).toUpperCase()}${n.slice(1)} ${g}.`; };
const krajMeseca = (ym) => { const [g, m] = ym.split('-').map(Number); return dodajDane(m === 12 ? `${g + 1}-01-01` : `${g}-${String(m + 1).padStart(2, '0')}-01`, -1); };
const jeVlasnik = (r) => !r.plata && !r.provizija;

/** Provizija u redu tabele: menja se lokalno, čuva se na Enter ili izlazak iz polja. */
function ProvizijaUnos({ radnik }) {
    const { izmeni, obavesti, zapisi } = usePanel();
    const [v, setV] = useState(String(radnik.provizija));
    useEffect(() => setV(String(radnik.provizija)), [radnik.provizija]);
    const sacuvaj = () => {
        const n = Math.max(0, Math.min(100, Math.round(Number(v.replace(',', '.')) || 0)));
        setV(String(n));
        if (n === radnik.provizija) return;
        izmeni('radnici', radnik.id, { provizija: n });
        zapisi('zarade', 'Izmenio proviziju', `${radnik.ime}: ${radnik.provizija}% → ${n}%`);
        obavesti(`Provizija za ${radnik.ime.split(' ')[0]} je sada ${n}%.`);
    };
    return (
        <span className="inline-flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
            <Unos type="number" inputMode="numeric" min={0} max={100} step={1} value={v} aria-label={`Provizija ${radnik.ime}`}
                onChange={(e) => setV(e.target.value)} onBlur={sacuvaj} onKeyDown={(e) => { if (e.key === 'Enter') e.currentTarget.blur(); if (e.key === 'Escape') { setV(String(radnik.provizija)); } }}
                className="h-8 w-[68px] px-2 py-0 text-right text-[13px] tabularno" />
            <span className="text-p-tiho">%</span>
        </span>
    );
}

export default function Zarade() {
    const { podaci, postavi, obavesti, zapisi } = usePanel();
    const d = danasF();
    const meseci = useMemo(() => {
        const x = [];
        let m = pocetakMeseca(d);
        for (let i = 0; i < 4; i++) { x.push(m.slice(0, 7)); m = pocetakMeseca(dodajDane(m, -1)); }
        return x;
    }, [d]);
    const [mesec, setMesec] = useState(meseci[0]);
    const tekuci = mesec === meseci[0];
    const isplate = podaci.isplate ?? {};

    const redovi = useMemo(() => {
        const od = `${mesec}-01`;
        const doD = krajMeseca(mesec);
        const nap = naplaceni(podaci.termini, od, doD);
        const smeneKljucevi = Object.keys(podaci.smene);
        return podaci.radnici.map((r) => {
            const t = nap.filter((x) => x.radnikId === r.id);
            const promet = zbir(t);
            const vlasnik = jeVlasnik(r);
            const provizijaIznos = vlasnik ? 0 : Math.round((promet * r.provizija) / 100);
            const dana = smeneKljucevi.filter((k) => k.startsWith(`${r.id}|${mesec}`)).length;
            return { id: r.id, r, ime: r.ime, vlasnik, plata: r.plata, promet, provizija: r.provizija, provizijaIznos, ukupno: vlasnik ? 0 : r.plata + provizijaIznos, termina: t.length, dana, isplata: isplate[`${r.id}|${mesec}`] ?? null };
        });
    }, [podaci.termini, podaci.smene, podaci.radnici, mesec, isplate]);

    const obracun = redovi.filter((x) => !x.vlasnik);
    const trosak = zbir(obracun, (x) => x.ukupno);
    const promet = zbir(redovi, (x) => x.promet);
    const isplaceno = obracun.filter((x) => x.isplata).length;

    const oznaci = (x) => {
        const kljuc = `${x.id}|${mesec}`;
        postavi('isplate', (s) => ({ ...(s ?? {}), [kljuc]: { datum: d, iznos: x.ukupno } }));
        zapisi('zarade', 'Označio isplatu', `${x.ime} — ${nazivMeseca(mesec)}, ${rsd(x.ukupno)}`);
        obavesti(`${x.ime.split(' ')[0]}: ${nazivMeseca(mesec).toLowerCase()} označen kao isplaćen.`);
    };
    const ponisti = (x) => {
        const kljuc = `${x.id}|${mesec}`;
        postavi('isplate', (s) => { const n = { ...(s ?? {}) }; delete n[kljuc]; return n; });
        zapisi('zarade', 'Poništio isplatu', `${x.ime} — ${nazivMeseca(mesec)}`);
        obavesti('Oznaka isplate je uklonjena.', 'info');
    };

    const kolone = [
        { kljuc: 'ime', naslov: 'Radnik', render: (x) => (
            <span className="flex items-center gap-2.5">
                <Avatar ime={x.ime} slika={x.r.slika} boja={x.r.boja} velicina={30} />
                <span className="min-w-0"><span className="block font-medium">{x.ime}</span>{x.vlasnik && <span className="block text-[12px] text-p-tiho">Vlasnik — bez obračuna</span>}</span>
            </span>
        ) },
        { kljuc: 'plata', naslov: 'Osnovna plata', desno: true, render: (x) => (x.vlasnik ? '—' : rsd(x.plata)) },
        { kljuc: 'promet', naslov: 'Promet', desno: true, render: (x) => rsd(x.promet) },
        { kljuc: 'provizija', naslov: 'Provizija', desno: true, render: (x) => (x.vlasnik ? '—' : <ProvizijaUnos radnik={x.r} />) },
        { kljuc: 'provizijaIznos', naslov: 'Iznos provizije', desno: true, render: (x) => (x.vlasnik ? '—' : rsd(x.provizijaIznos)) },
        { kljuc: 'ukupno', naslov: 'Za isplatu', desno: true, render: (x) => (x.vlasnik ? <span className="text-p-tiho">bez obračuna</span> : <b className="font-semibold">{rsd(x.ukupno)}</b>) },
        { kljuc: 'termina', naslov: 'Termina', desno: true },
        { kljuc: 'dana', naslov: 'Radnih dana', desno: true },
        { kljuc: 'isplata', naslov: 'Isplata', sort: false, render: (x) => {
            if (x.vlasnik) return null;
            if (x.isplata) return (
                <span className="inline-flex items-center gap-1 whitespace-nowrap">
                    <Znacka ton="ok"><CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />Isplaćeno {datumKratko(x.isplata.datum)}</Znacka>
                    <Dugme varijanta="tiho" velicina="ikonaSm" ikona={Undo2} onClick={() => ponisti(x)} aria-label={`Poništi isplatu — ${x.ime}`} title={`Isplaćeno ${rsd(x.isplata.iznos)} · poništi oznaku`} />
                </span>
            );
            return <Dugme velicina="sm" onClick={() => oznaci(x)} className="whitespace-nowrap">Označi kao isplaćeno</Dugme>;
        } },
    ];

    return (
        <div className="flex flex-col gap-4">
            <ZaglavljeStrane naslov="Zarade" opis={`Osnovna plata + provizija na naplaćene termine.${tekuci ? ' Tekući mesec — iznosi rastu do kraja meseca.' : ''}`}
                akcije={(
                    <Izbor value={mesec} onChange={(e) => setMesec(e.target.value)} aria-label="Mesec obračuna" className="w-auto min-w-[200px]">
                        {meseci.map((m, i) => <option key={m} value={m}>{nazivMeseca(m)}{i === 0 ? ' (do danas)' : ''}</option>)}
                    </Izbor>
                )} />

            <MrezaPlocica>
                <StatPlocica ikona={Wallet} oznaka="Ukupan trošak zarada" vrednost={rsd(trosak)} napomena={`${isplaceno} od ${obracun.length} isplaćeno`} />
                <StatPlocica ikona={Banknote} ton="ok" oznaka="Promet" vrednost={rsd(promet)} napomena={`${zbir(redovi, (x) => x.termina)} naplaćenih termina`} />
                <StatPlocica ikona={Percent} ton="info" oznaka="Udeo zarada u prometu" vrednost={promet ? procenat(trosak / promet, 1) : '—'} napomena="trošak / promet" />
                <StatPlocica ikona={Users} ton="akc" oznaka="Prosečna zarada" vrednost={rsd(obracun.length ? trosak / obracun.length : 0)} napomena={`${obracun.length} ${obracun.length === 1 ? 'radnik' : 'radnika'} u obračunu`} />
            </MrezaPlocica>

            <Kartica naslov={`Obračun — ${nazivMeseca(mesec).toLowerCase()}`} opis="Proviziju menjate direktno u tabeli (Enter čuva)." telo="py-1">
                <Tabela kolone={kolone} redovi={redovi} pocetnoSort={{ kljuc: 'ukupno', smer: 'opadajuce' }} />
                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-p-ivica/60 px-4 py-3 text-[13px] sm:px-5">
                    <span className="text-p-tiho">Ukupno za isplatu</span>
                    <span className="font-semibold text-p-ink tabularno">{rsd(trosak)}</span>
                </div>
            </Kartica>

            <Kartica naslov="Isplata po radniku" opis={`${nazivMeseca(mesec)} · plata + provizija`}>
                <Stubici stavke={obracun.map((x) => ({ oznaka: x.ime.split(' ')[0], vrednost: x.ukupno, opis: `${x.ime} · plata ${rsdKratko(x.plata)} + provizija ${rsdKratko(x.provizijaIznos)}` }))} visina={220} format={rsd} formatOse={rsdKratko} oznakaSerije="Za isplatu" />
            </Kartica>
        </div>
    );
}
