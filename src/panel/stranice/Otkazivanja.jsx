/*
 * OTKAZIVANJA I BLOKADE — otkazani termini, nedolasci i blokirani brojevi.
 * Klijenti sa najviše nedolazaka su odmah tu, sa „Blokiraj broj”: blokiran
 * broj ne može da zakaže online (zahtev stiže označen).
 */
import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Ban, CalendarX2, Percent, Phone, Plus, ShieldCheck, ShieldOff, TrendingDown, UserX } from 'lucide-react';
import { usePanel, useIndeksi, useDozvole, imeKlijenta, naziviUsluga } from '../podaci/Skladiste.jsx';
import { danas, datumKratko, datumSaDanom, dodajDane, klijenata, mnozina, procenat, rsd, termina, uSate } from '../format.js';
import { Avatar, Dugme, Kartica, MrezaPlocica, Polje, Prazno, StatPlocica, Tabela, Tabovi, Unos, ZaglavljeStrane, Znacka } from '../ui.jsx';
import { RangLista } from '../grafikoni.jsx';
import { useTermini } from '../termini.jsx';
import { P } from '../Ljuska.jsx';

const cifre = (s = '') => s.replace(/\D/g, '');

function BlokiraniBrojevi() {
    const { podaci, dodaj, obrisi, izmeni, obavesti, zapisi, noviId } = usePanel();
    const [f, setF] = useState({ telefon: '', razlog: '' });
    const [greska, setGreska] = useState('');
    const blokirani = podaci.blokirani ?? [];
    const poTelefonu = useMemo(() => Object.fromEntries(podaci.klijenti.map((k) => [cifre(k.telefon), k])), [podaci.klijenti]);

    const dodajBroj = (e) => {
        e.preventDefault();
        const c = cifre(f.telefon);
        if (c.length < 8) { setGreska('Upišite ceo broj telefona.'); return; }
        if (blokirani.some((b) => cifre(b.telefon) === c)) { setGreska('Taj broj je već blokiran.'); return; }
        dodaj('blokirani', { id: noviId('b'), telefon: f.telefon.trim(), razlog: f.razlog.trim() || 'Ručno blokiran', datum: danas(), klijentId: poTelefonu[c]?.id ?? null });
        if (poTelefonu[c]) izmeni('klijenti', poTelefonu[c].id, { blokiran: true });
        zapisi('klijent', 'Blokirao broj', f.telefon.trim());
        obavesti(`Broj ${f.telefon.trim()} je blokiran — više ne može da zakaže online.`);
        setF({ telefon: '', razlog: '' });
        setGreska('');
    };
    const odblokiraj = (b) => {
        obrisi('blokirani', b.id);
        const k = poTelefonu[cifre(b.telefon)];
        if (k) izmeni('klijenti', k.id, { blokiran: false });
        zapisi('klijent', 'Odblokirao broj', b.telefon);
        obavesti(`Broj ${b.telefon} je odblokiran.`);
    };

    const kolone = [
        { kljuc: 'telefon', naslov: 'Broj', render: (b) => <span className="inline-flex items-center gap-1.5 font-medium tabularno"><Phone className="h-3.5 w-3.5 text-p-tiho" aria-hidden="true" />{b.telefon}</span> },
        {
            kljuc: 'klijent', naslov: 'Klijent', sortVrednost: (b) => imeKlijenta(poTelefonu[cifre(b.telefon)]),
            render: (b) => { const k = poTelefonu[cifre(b.telefon)]; return k ? <Link to={`${P}/klijenti/${k.id}`} className="font-medium hover:underline">{imeKlijenta(k)}</Link> : <span className="text-p-tiho">nije u imeniku</span>; },
        },
        { kljuc: 'razlog', naslov: 'Razlog', render: (b) => <span className="text-p-tiho">{b.razlog || '—'}</span> },
        { kljuc: 'datum', naslov: 'Od', render: (b) => <span className="whitespace-nowrap tabularno">{datumKratko(b.datum)}</span> },
        { kljuc: 'akcija', naslov: '', sort: false, desno: true, render: (b) => <Dugme varijanta="tiho" velicina="sm" ikona={ShieldCheck} onClick={() => odblokiraj(b)}>Odblokiraj</Dugme> },
    ];

    return (
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,320px)]">
            <Kartica naslov="Blokirani brojevi" opis="Sa ovih brojeva online zakazivanje nije moguće — zakazuje se samo telefonom, uz proveru." telo="p-0">
                <Tabela kolone={kolone} redovi={blokirani} pocetnoSort={{ kljuc: 'datum', smer: 'opadajuce' }}
                    prazno={<Prazno ikona={ShieldCheck} naslov="Nema blokiranih brojeva" opis="Broj blokirajte posle ponovljenih nedolazaka bez otkazivanja." />} />
            </Kartica>
            <Kartica naslov="Dodaj broj" opis="Ručna blokada, npr. posle neprijatnog incidenta.">
                <form onSubmit={dodajBroj} className="space-y-3">
                    <Polje oznaka="Telefon"><Unos inputMode="tel" value={f.telefon} onChange={(e) => { setF({ ...f, telefon: e.target.value }); setGreska(''); }} placeholder="06x xxx xxxx" /></Polje>
                    <Polje oznaka="Razlog"><Unos value={f.razlog} onChange={(e) => setF({ ...f, razlog: e.target.value })} placeholder="npr. tri nedolaska bez javljanja" /></Polje>
                    {greska && <p role="alert" className="text-[13px] font-medium text-p-greska">{greska}</p>}
                    <Dugme type="submit" varijanta="glavno" ikona={Plus} className="w-full justify-center">Blokiraj broj</Dugme>
                </form>
            </Kartica>
        </div>
    );
}

export default function Otkazivanja() {
    const { podaci, dodaj, izmeni, obavesti, zapisi, noviId } = usePanel();
    const indeks = useIndeksi();
    const { novac } = useDozvole();
    const { otvoriDetalj } = useTermini();
    const [tab, setTab] = useState('otkazani');
    const [period, setPeriod] = useState('30');
    const d = danas();
    const od = dodajDane(d, -(Number(period) - 1));

    const x = useMemo(() => {
        // Period: termini zakazani za poslednjih N dana i nadalje (otkazivanja za buduće termine su se već desila).
        const uPeriodu = podaci.termini.filter((t) => t.datum >= od && t.status !== 'zahtev');
        const otkazani = uPeriodu.filter((t) => t.status === 'otkazan').sort((a, b) => b.datum.localeCompare(a.datum) || b.od - a.od);
        const nisuDosli = uPeriodu.filter((t) => t.status === 'nije-dosao').sort((a, b) => b.datum.localeCompare(a.datum) || b.od - a.od);
        const razlozi = {};
        otkazani.forEach((t) => { const r = t.razlogOtkazivanja || 'Bez razloga'; razlozi[r] = (razlozi[r] ?? 0) + 1; });
        // Nedolasci po klijentu: u periodu i ukupno.
        const poKlijentu = {};
        podaci.termini.forEach((t) => {
            if (t.status !== 'nije-dosao') return;
            const k = (poKlijentu[t.klijentId] ??= { id: t.klijentId, ukupno: 0, uPeriodu: 0, poslednji: '' });
            k.ukupno += 1;
            if (t.datum >= od) k.uPeriodu += 1;
            if (t.datum > k.poslednji) k.poslednji = t.datum;
        });
        return {
            otkazani, nisuDosli, svih: uPeriodu.length,
            izgubljeno: [...otkazani, ...nisuDosli].reduce((s, t) => s + t.cena, 0),
            razlozi: Object.entries(razlozi).map(([oznaka, vrednost]) => ({ oznaka, vrednost })).sort((a, b) => b.vrednost - a.vrednost),
            top: Object.values(poKlijentu).filter((k) => k.uPeriodu > 0).sort((a, b) => b.uPeriodu - a.uPeriodu || b.ukupno - a.ukupno).slice(0, 8),
        };
    }, [podaci.termini, od]);

    const blokirani = useMemo(() => new Set((podaci.blokirani ?? []).map((b) => cifre(b.telefon))), [podaci.blokirani]);
    const stopa = x.svih ? (x.otkazani.length + x.nisuDosli.length) / x.svih : 0;

    const blokiraj = (kId, broj) => {
        const k = indeks.klijent[kId];
        if (!k) return;
        dodaj('blokirani', { id: noviId('b'), telefon: k.telefon, razlog: `${broj} ${mnozina(broj, 'nedolazak', 'nedolaska', 'nedolazaka')} bez otkazivanja`, datum: d, klijentId: k.id });
        izmeni('klijenti', k.id, { blokiran: true });
        zapisi('klijent', 'Blokirao broj', `${imeKlijenta(k)} — ${k.telefon}`);
        obavesti(`${imeKlijenta(k)} (${k.telefon}) je blokiran/a za online zakazivanje.`);
    };

    const klijentKolona = {
        kljuc: 'klijent', naslov: 'Klijent', sortVrednost: (t) => imeKlijenta(indeks.klijent[t.klijentId]),
        render: (t) => <Link to={`${P}/klijenti/${t.klijentId}`} onClick={(e) => e.stopPropagation()} className="font-medium hover:underline">{imeKlijenta(indeks.klijent[t.klijentId])}</Link>,
    };
    const kolone = (sa) => [
        { kljuc: 'datum', naslov: 'Termin', sortVrednost: (t) => `${t.datum}${String(t.od).padStart(4, '0')}`, render: (t) => <span className="whitespace-nowrap tabularno">{datumSaDanom(t.datum)} <span className="text-p-tiho">{uSate(t.od)}</span></span> },
        klijentKolona,
        { kljuc: 'usluge', naslov: 'Usluge', sort: false, className: 'max-w-[220px]', render: (t) => <span className="line-clamp-2 text-p-tiho">{naziviUsluga(t.usluge, indeks)}</span> },
        { kljuc: 'radnik', naslov: 'Radnik', sortVrednost: (t) => indeks.radnik[t.radnikId]?.ime ?? '', render: (t) => { const r = indeks.radnik[t.radnikId]; return <span className="inline-flex items-center gap-2 whitespace-nowrap"><Avatar ime={r?.ime} slika={r?.slika} boja={r?.boja} velicina={22} />{r?.ime.split(' ')[0]}</span>; } },
        ...(sa === 'razlog' ? [{ kljuc: 'razlogOtkazivanja', naslov: 'Razlog', render: (t) => <span className="text-p-tiho">{t.razlogOtkazivanja || '—'}</span> }] : []),
        { kljuc: 'cena', naslov: 'Vrednost', desno: true, render: (t) => rsd(t.cena) },
    ];

    return (
        <div className="flex flex-col gap-4">
            <ZaglavljeStrane naslov="Otkazivanja i blokade" opis="Otkazani termini, nedolasci i brojevi kojima je zabranjeno online zakazivanje."
                akcije={<Tabovi mali aktivan={period} onChange={setPeriod} stavke={[{ id: '30', naziv: '30 dana' }, { id: '90', naziv: '90 dana' }]} />} />

            <MrezaPlocica>
                <StatPlocica ikona={CalendarX2} ton="tiho" oznaka="Otkazano" vrednost={x.otkazani.length} napomena={`od ${datumKratko(od)}`} />
                <StatPlocica ikona={UserX} ton="greska" oznaka="Nisu došli" vrednost={x.nisuDosli.length} napomena={klijenata(x.top.length)} />
                <StatPlocica ikona={Percent} ton="upoz" oznaka="Stopa otkazivanja" vrednost={procenat(stopa, 1)} napomena={`od ${termina(x.svih)}`} info="Otkazani i nedolasci kroz sve termine u periodu (bez zahteva na čekanju)." />
                {novac
                    ? <StatPlocica ikona={TrendingDown} ton="greska" oznaka="Izgubljen promet" vrednost={rsd(x.izgubljeno)} napomena="vrednost otkazanih i propuštenih" />
                    : <StatPlocica ikona={ShieldOff} ton="tiho" oznaka="Blokirani brojevi" vrednost={(podaci.blokirani ?? []).length} napomena="bez online zakazivanja" />}
            </MrezaPlocica>

            <Tabovi aktivan={tab} onChange={setTab} stavke={[
                { id: 'otkazani', naziv: 'Otkazani', broj: x.otkazani.length },
                { id: 'nisuDosli', naziv: 'Nisu došli', broj: x.nisuDosli.length },
                { id: 'blokirani', naziv: 'Blokirani brojevi', broj: (podaci.blokirani ?? []).length },
            ]} />

            {tab === 'otkazani' && (
                <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,320px)]">
                    <Kartica naslov="Otkazani termini" opis={`Od ${datumKratko(od)} · klik na red otvara termin`} telo="p-0">
                        <Tabela kolone={kolone('razlog')} redovi={x.otkazani} onRed={(t) => otvoriDetalj(t.id)} gusto
                            prazno={<Prazno ikona={CalendarX2} naslov="Nema otkazanih termina" opis="U izabranom periodu niko nije otkazao." />} />
                    </Kartica>
                    <Kartica naslov="Razlozi otkazivanja" opis={termina(x.otkazani.length)}>
                        {x.razlozi.length ? <RangLista stavke={x.razlozi} format={(v) => `${v}×`} /> : <p className="text-[13px] text-p-tiho">Nema podataka za period.</p>}
                    </Kartica>
                </div>
            )}

            {tab === 'nisuDosli' && (
                <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)]">
                    <Kartica naslov="Nedolasci" opis={`Od ${datumKratko(od)} · termin nije otkazan, klijent nije došao`} telo="p-0">
                        <Tabela kolone={kolone()} redovi={x.nisuDosli} onRed={(t) => otvoriDetalj(t.id)} gusto
                            prazno={<Prazno ikona={UserX} naslov="Nema nedolazaka" opis="Svi klijenti su došli ili otkazali na vreme." />} />
                    </Kartica>
                    <Kartica naslov="Najčešći nedolasci" opis="U periodu · ukupno od početka" telo="p-2">
                        {x.top.length ? (
                            <ul>
                                {x.top.map((s) => {
                                    const k = indeks.klijent[s.id];
                                    const jeBlokiran = !!k && blokirani.has(cifre(k.telefon));
                                    return (
                                        <li key={s.id} className="flex items-center gap-3 rounded-xl px-3 py-2.5">
                                            <Avatar ime={imeKlijenta(k)} velicina={32} />
                                            <div className="min-w-0 flex-1">
                                                <Link to={`${P}/klijenti/${s.id}`} className="block truncate text-sm font-medium hover:underline">{imeKlijenta(k)}</Link>
                                                <div className="text-[12.5px] text-p-tiho tabularno">{s.uPeriodu}× u periodu · {s.ukupno}× ukupno</div>
                                            </div>
                                            {jeBlokiran
                                                ? <Znacka ton="greska"><Ban className="h-3 w-3" aria-hidden="true" />Blokiran</Znacka>
                                                : <Dugme varijanta={s.ukupno >= 2 ? 'opasnoTiho' : 'tiho'} velicina="sm" ikona={Ban} onClick={() => blokiraj(s.id, s.ukupno)}>Blokiraj broj</Dugme>}
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : <Prazno ikona={ShieldCheck} naslov="Nema ponovljenih nedolazaka" className="py-6" />}
                    </Kartica>
                </div>
            )}

            {tab === 'blokirani' && <BlokiraniBrojevi />}
        </div>
    );
}
