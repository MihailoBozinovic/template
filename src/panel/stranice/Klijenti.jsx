/*
 * KLIJENTI — imenik salona: pretraga po imenu, telefonu i e-pošti, brzi
 * filteri (stalni, novi, nisu dolazili, rođendan), potrošnja i poslednja
 * poseta. Klik na red otvara karton klijenta (/panel/klijenti/:id).
 */
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cake, Check, Download, Repeat, UserPlus, Users, Wallet } from 'lucide-react';
import { usePanel, imeKlijenta } from '../podaci/Skladiste.jsx';
import { statistikaKlijenata } from '../podaci/analitika.js';
import { danas as danasF, datumKratko, datumRelativno, dodajDane, klijenata, pocetakMeseca, pocetakNedelje, procenat, razlikaDana, rsd } from '../format.js';
import { Avatar, Dugme, Izbor, Kartica, Modal, MrezaPlocica, Polje, Prazno, Prekidac, Pretraga, StatPlocica, Tabela, Tabovi, TekstPolje, Unos, ZaglavljeStrane, Znacka, cx } from '../ui.jsx';
import { P } from '../Ljuska.jsx';

export const IZVORI = { online: 'Online', telefon: 'Telefon', pult: 'Pult', instagram: 'Instagram', preporuka: 'Preporuka' };
export const OZNAKE = { VIP: 'akc', Alergija: 'greska', 'Ne zove se': 'upoz' };
const STALNI = 5;
const NA_STRANI = 25;

const bezKvacica = (s = '') => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'dj');
const cifre = (s = '') => s.replace(/\D/g, '');

/** Pre koliko dana: „pre 12 dana”, za poslednju posetu. */
const pre = (iso, d) => {
    if (!iso) return null;
    const n = razlikaDana(iso, d);
    if (n <= 1) return datumRelativno(iso);
    if (n < 60) return `pre ${n} dana`;
    if (n < 365) return `pre ${Math.round(n / 30)} mes.`;
    return `pre ${(n / 365).toFixed(1).replace('.', ',').replace(',0', '')} god.`;
};

export function ZnackeKlijenta({ k, className }) {
    if (!k.blokiran && !k.oznake?.length) return null;
    return (
        <span className={cx('inline-flex flex-wrap gap-1', className)}>
            {k.blokiran && <Znacka ton="greska">Blokiran</Znacka>}
            {(k.oznake ?? []).map((o) => <Znacka key={o} ton={OZNAKE[o] ?? 'tiho'}>{o}</Znacka>)}
        </span>
    );
}

function izveziCsv(redovi) {
    const polja = [['Ime', (r) => r.k.ime], ['Prezime', (r) => r.k.prezime], ['Telefon', (r) => r.k.telefon], ['E-pošta', (r) => r.k.email], ['Posete', (r) => r.s.posete], ['Potrošeno (RSD)', (r) => r.s.potroseno], ['Poslednja poseta', (r) => r.s.poslednja ?? ''], ['Sledeći termin', (r) => r.s.sledeca ?? ''], ['Izvor', (r) => IZVORI[r.k.izvor] ?? r.k.izvor], ['SMS pristanak', (r) => (r.k.smsPristanak ? 'da' : 'ne')], ['Klijent od', (r) => r.k.kreiran], ['Napomena', (r) => r.k.napomena]];
    const polje = (v) => { const s = String(v ?? ''); return /[;"\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
    const tekst = [polja.map(([n]) => n).join(';'), ...redovi.map((r) => polja.map(([, f]) => polje(f(r))).join(';'))].join('\r\n');
    const url = URL.createObjectURL(new Blob(['﻿', tekst], { type: 'text/csv;charset=utf-8' }));
    const a = document.createElement('a');
    a.href = url; a.download = `klijenti-${danasF()}.csv`;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

const PRAZAN = { ime: '', prezime: '', telefon: '', email: '', pol: 'z', napomena: '', smsPristanak: true };

function NoviKlijent({ onClose }) {
    const { podaci, dodaj, obavesti, zapisi, noviId } = usePanel();
    const navigate = useNavigate();
    const [f, setF] = useState(PRAZAN);
    const [greska, setGreska] = useState('');
    const p = (k) => (e) => { setF({ ...f, [k]: e.target.value }); setGreska(''); };
    const postojeci = cifre(f.telefon).length >= 6 ? podaci.klijenti.find((k) => cifre(k.telefon) === cifre(f.telefon)) : null;

    const sacuvaj = () => {
        if (!f.ime.trim()) { setGreska('Upišite ime.'); return; }
        if (cifre(f.telefon).length < 8) { setGreska('Upišite ispravan broj telefona.'); return; }
        if (f.email && !/^\S+@\S+\.\S+$/.test(f.email.trim())) { setGreska('E-pošta nije ispravna.'); return; }
        const id = noviId('k');
        const k = { id, ime: f.ime.trim(), prezime: f.prezime.trim(), pol: f.pol, telefon: f.telefon.trim(), email: f.email.trim(), kreiran: danasF(), izvor: 'pult', napomena: f.napomena.trim(), oznake: [], smsPristanak: f.smsPristanak, rodjendan: '', blokiran: false };
        dodaj('klijenti', k);
        zapisi('klijent', 'Dodao klijenta', imeKlijenta(k));
        obavesti(`${imeKlijenta(k)} je dodat${f.pol === 'z' ? 'a' : ''} u imenik.`);
        onClose();
        navigate(`${P}/klijenti/${id}`);
    };

    return (
        <Modal otvoren onClose={onClose} naslov="Novi klijent" opis="Upisuje se u imenik; termin možete zakazati odmah iz kartona."
            podnozje={(
                <>
                    {greska && <p role="alert" className="mr-auto self-center text-[13px] font-medium text-p-greska">{greska}</p>}
                    <Dugme varijanta="tiho" onClick={onClose}>Odustani</Dugme>
                    <Dugme varijanta="glavno" ikona={Check} onClick={sacuvaj}>Sačuvaj klijenta</Dugme>
                </>
            )}>
            <div className="grid gap-3 sm:grid-cols-2">
                <Polje oznaka="Ime"><Unos value={f.ime} onChange={p('ime')} autoComplete="off" /></Polje>
                <Polje oznaka="Prezime"><Unos value={f.prezime} onChange={p('prezime')} autoComplete="off" /></Polje>
                <Polje oznaka="Telefon" pomoc={postojeci ? `Ovaj broj već ima ${imeKlijenta(postojeci)}.` : undefined}><Unos inputMode="tel" value={f.telefon} onChange={p('telefon')} placeholder="06x xxx xxxx" /></Polje>
                <Polje oznaka="E-pošta (opciono)"><Unos type="email" inputMode="email" value={f.email} onChange={p('email')} /></Polje>
                <Polje oznaka="Pol">
                    <Izbor value={f.pol} onChange={p('pol')}><option value="z">Žensko</option><option value="m">Muško</option></Izbor>
                </Polje>
                <div className="hidden sm:block" />
                <Polje oznaka="Napomena (vidi samo osoblje)" className="sm:col-span-2"><TekstPolje value={f.napomena} onChange={p('napomena')} placeholder="npr. alergija na amonijak, voli kraće sa strane" /></Polje>
                <div className="sm:col-span-2">
                    <Prekidac ukljuceno={f.smsPristanak} onChange={(v) => setF({ ...f, smsPristanak: v })} oznaka="SMS pristanak" opis="Podsetnici za termin i povremene ponude salona." />
                </div>
            </div>
        </Modal>
    );
}

export default function Klijenti() {
    const { podaci } = usePanel();
    const navigate = useNavigate();
    const d = danasF();
    const [q, setQ] = useState('');
    const [filter, setFilter] = useState('svi');
    const [novi, setNovi] = useState(false);
    const [koliko, setKoliko] = useState(NA_STRANI);

    const stat = useMemo(() => statistikaKlijenata(podaci.termini, d), [podaci.termini, d]);
    const svi = useMemo(() => podaci.klijenti.map((k) => ({ id: k.id, k, s: stat[k.id] ?? { posete: 0, potroseno: 0, poslednja: null, sledeca: null, otkazano: 0, nijeDosao: 0 } })), [podaci.klijenti, stat]);

    const rodjendaniNedelje = useMemo(() => { const p = pocetakNedelje(d); return new Set(Array.from({ length: 7 }, (_, i) => dodajDane(p, i).slice(5))); }, [d]);
    const FILTERI = useMemo(() => ({
        svi: () => true,
        stalni: (r) => r.s.posete >= STALNI,
        novi: (r) => razlikaDana(r.k.kreiran, d) <= 30,
        nisu: (r) => r.s.posete > 0 && r.s.poslednja && razlikaDana(r.s.poslednja, d) >= 60 && !r.s.sledeca,
        rodjendan: (r) => r.k.rodjendan && rodjendaniNedelje.has(r.k.rodjendan),
    }), [d, rodjendaniNedelje]);

    const redovi = useMemo(() => {
        const t = bezKvacica(q.trim());
        const brojevi = cifre(q);
        return svi.filter((r) => {
            if (!FILTERI[filter](r)) return false;
            if (!t) return true;
            if (brojevi.length >= 3 && cifre(r.k.telefon).includes(brojevi)) return true;
            return bezKvacica(`${r.k.ime} ${r.k.prezime} ${r.k.prezime} ${r.k.ime} ${r.k.email}`).includes(t);
        });
    }, [svi, q, filter, FILTERI]);

    const brojke = useMemo(() => {
        const sPosetama = svi.filter((r) => r.s.posete > 0);
        const stalni = svi.filter((r) => r.s.posete >= STALNI).length;
        const mOd = pocetakMeseca(d);
        const proslog = pocetakMeseca(dodajDane(mOd, -1));
        return {
            ukupno: svi.length,
            aktivni: svi.filter((r) => r.s.poslednja && razlikaDana(r.s.poslednja, d) <= 90).length,
            noviMesec: svi.filter((r) => r.k.kreiran >= mOd).length,
            noviProsli: svi.filter((r) => r.k.kreiran >= proslog && r.k.kreiran < mOd).length,
            prosek: sPosetama.length ? sPosetama.reduce((x, r) => x + r.s.potroseno, 0) / sPosetama.length : 0,
            stalni,
            udeoStalnih: svi.length ? stalni / svi.length : 0,
        };
    }, [svi, d]);

    const broj = (id) => svi.filter(FILTERI[id]).length;
    const promeniFilter = (id) => { setFilter(id); setKoliko(NA_STRANI); };
    const otvori = (r) => navigate(`${P}/klijenti/${r.id}`);

    const kolone = [
        { kljuc: 'ime', naslov: 'Klijent', sortVrednost: (r) => `${r.k.ime} ${r.k.prezime}`, render: (r) => (
            <span className="flex min-w-0 items-center gap-3">
                <Avatar ime={imeKlijenta(r.k)} velicina={32} />
                <span className="min-w-0">
                    <span className="flex flex-wrap items-center gap-1.5"><span className="truncate font-medium">{imeKlijenta(r.k)}</span><ZnackeKlijenta k={r.k} /></span>
                    {r.k.email && <span className="block max-w-[220px] truncate text-[12.5px] text-p-tiho">{r.k.email}</span>}
                </span>
            </span>
        ) },
        { kljuc: 'telefon', naslov: 'Telefon', sort: false, className: 'whitespace-nowrap tabularno', render: (r) => r.k.telefon },
        { kljuc: 'posete', naslov: 'Posete', desno: true, sortVrednost: (r) => r.s.posete, render: (r) => r.s.posete || <span className="text-p-tiho">—</span> },
        { kljuc: 'potroseno', naslov: 'Potrošeno', desno: true, className: 'whitespace-nowrap', sortVrednost: (r) => r.s.potroseno, render: (r) => (r.s.potroseno ? rsd(r.s.potroseno) : <span className="text-p-tiho">—</span>) },
        { kljuc: 'poslednja', naslov: 'Poslednja poseta', className: 'whitespace-nowrap', sortVrednost: (r) => r.s.poslednja ?? '', render: (r) => (r.s.poslednja ? <span title={datumKratko(r.s.poslednja)}>{pre(r.s.poslednja, d)}</span> : <span className="text-p-tiho">nije dolazio</span>) },
        { kljuc: 'sledeca', naslov: 'Sledeći termin', className: 'whitespace-nowrap', sortVrednost: (r) => r.s.sledeca ?? '9999', render: (r) => (r.s.sledeca ? <span className="font-medium text-p-akc">{datumRelativno(r.s.sledeca)}</span> : <span className="text-p-tiho">—</span>) },
        { kljuc: 'izvor', naslov: 'Izvor', sortVrednost: (r) => r.k.izvor, render: (r) => <span className="text-p-tiho">{IZVORI[r.k.izvor] ?? r.k.izvor}</span> },
    ];

    const prazno = (
        <Prazno ikona={Users} naslov={q ? `Nema klijenata za „${q}”` : 'Nema klijenata u ovom filteru'} opis="Proverite pravopis ili pretražite po broju telefona."
            akcija={<Dugme varijanta="obicno" velicina="sm" ikona={UserPlus} onClick={() => setNovi(true)}>Novi klijent</Dugme>} />
    );

    return (
        <div className="flex flex-col gap-4">
            <ZaglavljeStrane naslov="Klijenti" opis={`${klijenata(brojke.ukupno)} u imeniku · ${brojke.aktivni} dolazilo u poslednja 3 meseca`}
                akcije={(
                    <>
                        <Dugme ikona={Download} onClick={() => izveziCsv(redovi)} kratko="CSV">Izvezi CSV</Dugme>
                        <Dugme varijanta="glavno" ikona={UserPlus} onClick={() => setNovi(true)} kratko="Novi">Novi klijent</Dugme>
                    </>
                )} />

            <MrezaPlocica>
                <StatPlocica ikona={Users} oznaka="Ukupno klijenata" vrednost={brojke.ukupno} napomena={`${brojke.aktivni} aktivnih (90 dana)`} />
                <StatPlocica ikona={UserPlus} ton="ok" oznaka="Novi ovog meseca" vrednost={brojke.noviMesec} napomena={`prošlog meseca ${brojke.noviProsli}`} />
                <StatPlocica ikona={Wallet} ton="info" oznaka="Prosečna potrošnja" vrednost={rsd(brojke.prosek)} napomena="po klijentu, ukupno" info="Ukupno naplaćeno podeljeno sa brojem klijenata koji su bar jednom dolazili." />
                <StatPlocica ikona={Repeat} oznaka="Stalni klijenti" vrednost={procenat(brojke.udeoStalnih)} napomena={`${brojke.stalni} sa ${STALNI}+ poseta`} />
            </MrezaPlocica>

            <Kartica telo="p-0">
                <div className="flex flex-col gap-3 border-b border-p-ivica/70 p-3 sm:p-4 lg:flex-row lg:items-center lg:justify-between">
                    <Pretraga vrednost={q} onChange={(v) => { setQ(v); setKoliko(NA_STRANI); }} placeholder="Ime, prezime, telefon ili e-pošta…" className="w-full lg:max-w-sm" />
                    <Tabovi mali aktivan={filter} onChange={promeniFilter} stavke={[
                        { id: 'svi', naziv: 'Svi', broj: svi.length },
                        { id: 'stalni', naziv: 'Stalni', broj: broj('stalni') },
                        { id: 'novi', naziv: 'Novi', broj: broj('novi') },
                        { id: 'nisu', naziv: 'Nisu dolazili 60+ dana', broj: broj('nisu') },
                        { id: 'rodjendan', naziv: <span className="inline-flex items-center gap-1"><Cake className="h-3.5 w-3.5" aria-hidden="true" />Rođendan ove nedelje</span>, broj: broj('rodjendan') },
                    ]} />
                </div>

                {/* Telefon: kartice umesto široke tabele */}
                <div className="md:hidden">
                    {redovi.length ? (
                        <>
                            <ul className="divide-y divide-p-ivica/60">
                                {redovi.slice(0, koliko).map((r) => (
                                    <li key={r.id}>
                                        <button type="button" onClick={() => otvori(r)} className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-p-meko/60">
                                            <Avatar ime={imeKlijenta(r.k)} velicina={38} />
                                            <span className="min-w-0 flex-1">
                                                <span className="flex flex-wrap items-center gap-1.5"><span className="truncate text-sm font-medium">{imeKlijenta(r.k)}</span><ZnackeKlijenta k={r.k} /></span>
                                                <span className="block text-[12.5px] text-p-tiho tabularno">{r.k.telefon}</span>
                                                <span className="mt-0.5 block text-[12px] text-p-tiho">
                                                    {r.s.posete ? `${r.s.posete}× · ${pre(r.s.poslednja, d)}` : 'Još nije dolazio'}
                                                    {r.s.sledeca && <span className="font-medium text-p-akc"> · termin {datumRelativno(r.s.sledeca).toLowerCase()}</span>}
                                                </span>
                                            </span>
                                            <span className="shrink-0 text-right text-[13px] font-semibold tabularno">{r.s.potroseno ? rsd(r.s.potroseno) : ''}</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            {redovi.length > koliko && (
                                <div className="border-t border-p-ivica/60 p-3 text-center">
                                    <Dugme varijanta="tiho" velicina="sm" onClick={() => setKoliko((k) => k + NA_STRANI)}>Prikaži još ({redovi.length - koliko})</Dugme>
                                </div>
                            )}
                        </>
                    ) : prazno}
                </div>

                <div className="hidden md:block">
                    <Tabela kolone={kolone} redovi={redovi} onRed={otvori} prazno={prazno} pocetnoSort={{ kljuc: 'poslednja', smer: 'opadajuce' }} poStrani={NA_STRANI} />
                </div>
            </Kartica>

            {novi && <NoviKlijent onClose={() => setNovi(false)} />}
        </div>
    );
}
