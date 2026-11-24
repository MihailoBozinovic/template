/*
 * LISTA ČEKANJA — klijenti koji čekaju da se oslobodi termin. Uz svakog se
 * odmah vide slobodna vremena koja odgovaraju (radnik, period, deo dana,
 * trajanje usluge); klik na vreme šalje SMS ponudu, „Zakaži” otvara formu.
 */
import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarPlus, Hourglass, MessageSquareText, Phone, Plus, Send, Trash2, UserRound, Users } from 'lucide-react';
import { usePanel, useIndeksi, imeKlijenta } from '../podaci/Skladiste.jsx';
import { slobodniProzori } from '../podaci/analitika.js';
import { danas, datumKratko, datumRelativno, datumSaDanom, datumSaDanomDugo, dodajDane, opsegDana, sadaMinut, trajanje as fTrajanje, uSate, klijenata } from '../format.js';
import { Avatar, Dugme, Izbor, Kartica, Modal, MrezaPlocica, Polje, Prazno, StatPlocica, Tabovi, TekstPolje, Unos, ZaglavljeStrane, Znacka, cx } from '../ui.jsx';
import { useTermini } from '../termini.jsx';
import { P } from '../Ljuska.jsx';

const DEO_DANA = { prepodne: 'Prepodne (do 12h)', popodne: 'Popodne (od 12h)', 'bilo kad': 'Bilo kad' };
const PODNE = 12 * 60;

/** Prvih `koliko` slobodnih vremena koja odgovaraju stavci liste čekanja. */
const predloziVremena = (podaci, stavka, usluga, koliko = 3) => {
    const d = danas();
    const m = sadaMinut();
    const traje = usluga?.trajanje ?? 30;
    const radnici = stavka.radnikId ? podaci.radnici.filter((r) => r.id === stavka.radnikId) : podaci.radnici.filter((r) => r.aktivan && (!usluga || r.usluge.includes(usluga.id)));
    const od = stavka.od < d ? d : stavka.od;
    if (stavka.do < od) return [];
    const x = [];
    for (const datum of opsegDana(od, stavka.do)) {
        const dan = [];
        for (const r of radnici) {
            for (const p of slobodniProzori(podaci, datum, r.id, datum === d ? m + 30 : 0, traje)) {
                let pocetak = p.od;
                if (stavka.deoDana === 'prepodne' && pocetak >= PODNE) continue;
                if (stavka.deoDana === 'popodne') pocetak = Math.max(pocetak, PODNE);
                if (p.do - pocetak < traje) continue;
                dan.push({ datum, od: pocetak, radnikId: r.id });
                break; // jedno vreme po radniku po danu — ponuda treba da bude raznovrsna
            }
        }
        x.push(...dan.sort((a, b) => a.od - b.od));
        if (x.length >= koliko) break;
    }
    return x.slice(0, koliko);
};

function DodajNaListu({ onClose }) {
    const { podaci, dodaj, obavesti, zapisi, noviId } = usePanel();
    const indeks = useIndeksi();
    const d = danas();
    const [trazi, setTrazi] = useState('');
    const [f, setF] = useState({ klijentId: '', uslugaId: '', radnikId: '', od: d, do: dodajDane(d, 7), deoDana: 'bilo kad', napomena: '' });
    const [greska, setGreska] = useState('');
    const postavi = (k, v) => { setF((x) => ({ ...x, [k]: v })); setGreska(''); };

    const ponudjeni = useMemo(() => {
        const q = trazi.trim().toLowerCase();
        if (q.length < 2) return [];
        const brojevi = q.replace(/\D/g, '');
        return podaci.klijenti.filter((k) => `${k.ime} ${k.prezime}`.toLowerCase().includes(q) || (brojevi.length >= 3 && k.telefon.replace(/\D/g, '').includes(brojevi))).slice(0, 6);
    }, [trazi, podaci.klijenti]);
    const radnici = podaci.radnici.filter((r) => r.aktivan && (!f.uslugaId || r.usluge.includes(f.uslugaId)));
    const klijent = indeks.klijent[f.klijentId];

    const sacuvaj = () => {
        if (!f.klijentId) return setGreska('Izaberite klijenta.');
        if (!f.uslugaId) return setGreska('Izaberite uslugu.');
        if (!f.od || !f.do || f.do < f.od) return setGreska('Period nije ispravan — „do” mora biti posle „od”.');
        dodaj('listaCekanja', { id: noviId('lc'), klijentId: f.klijentId, uslugaId: f.uslugaId, radnikId: f.radnikId || null, od: f.od, do: f.do, deoDana: f.deoDana, napomena: f.napomena.trim(), kreiran: d, status: 'ceka' });
        zapisi('klijent', 'Dodao na listu čekanja', `${imeKlijenta(klijent)} — ${indeks.usluga[f.uslugaId]?.naziv}`);
        obavesti(`${imeKlijenta(klijent)} je na listi čekanja.`);
        onClose();
        return null;
    };

    return (
        <Modal otvoren onClose={onClose} naslov="Dodaj na listu čekanja" opis="Kad se oslobodi odgovarajuće vreme, videćete ga ovde i ponuditi SMS-om." sirina="max-w-xl"
            podnozje={(
                <>
                    {greska && <p role="alert" className="mr-auto self-center text-[13px] font-medium text-p-greska">{greska}</p>}
                    <Dugme varijanta="tiho" onClick={onClose}>Odustani</Dugme>
                    <Dugme varijanta="glavno" ikona={Plus} onClick={sacuvaj}>Dodaj na listu</Dugme>
                </>
            )}>
            <div className="grid gap-4">
                <div>
                    <span className="mb-1.5 block text-[13px] font-medium text-p-ink">Klijent</span>
                    {klijent ? (
                        <div className="flex items-center justify-between gap-3 rounded-xl border border-p-ivica bg-p-meko/50 px-3 py-2.5">
                            <div className="flex min-w-0 items-center gap-3"><Avatar ime={imeKlijenta(klijent)} velicina={32} /><div className="min-w-0"><div className="truncate text-sm font-medium">{imeKlijenta(klijent)}</div><div className="text-[12.5px] text-p-tiho tabularno">{klijent.telefon}</div></div></div>
                            <Dugme varijanta="tiho" velicina="sm" onClick={() => postavi('klijentId', '')}>Promeni</Dugme>
                        </div>
                    ) : (
                        <div className="relative">
                            <Unos value={trazi} onChange={(e) => setTrazi(e.target.value)} placeholder="Ime, prezime ili telefon…" aria-label="Pretraga klijenta" />
                            {ponudjeni.length > 0 && (
                                <ul className="absolute inset-x-0 top-full z-10 mt-1 overflow-hidden rounded-xl border border-p-ivica bg-p-karta shadow-lg">
                                    {ponudjeni.map((k) => (
                                        <li key={k.id}><button type="button" onClick={() => { postavi('klijentId', k.id); setTrazi(''); }} className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm hover:bg-p-meko"><span className="truncate">{imeKlijenta(k)}</span><span className="shrink-0 text-[12.5px] text-p-tiho tabularno">{k.telefon}</span></button></li>
                                    ))}
                                </ul>
                            )}
                            {trazi.trim().length >= 2 && !ponudjeni.length && <p className="mt-1.5 text-[12.5px] text-p-tiho">Nema takvog klijenta — dodajte ga prvo u imenik klijenata.</p>}
                        </div>
                    )}
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                    <Polje oznaka="Usluga">
                        <Izbor value={f.uslugaId} onChange={(e) => { postavi('uslugaId', e.target.value); if (f.radnikId && !indeks.radnik[f.radnikId]?.usluge.includes(e.target.value)) postavi('radnikId', ''); }}>
                            <option value="">Izaberite…</option>
                            {podaci.kategorije.map((kat) => {
                                const lista = podaci.usluge.filter((u) => u.kategorija === kat.id && u.aktivna);
                                return lista.length ? <optgroup key={kat.id} label={kat.naziv}>{lista.map((u) => <option key={u.id} value={u.id}>{u.naziv} · {u.trajanje} min</option>)}</optgroup> : null;
                            })}
                        </Izbor>
                    </Polje>
                    <Polje oznaka="Radnik">
                        <Izbor value={f.radnikId} onChange={(e) => postavi('radnikId', e.target.value)}>
                            <option value="">Bilo ko</option>
                            {radnici.map((r) => <option key={r.id} value={r.id}>{r.ime}</option>)}
                        </Izbor>
                    </Polje>
                    <Polje oznaka="Od"><Unos type="date" value={f.od} min={d} onChange={(e) => postavi('od', e.target.value)} /></Polje>
                    <Polje oznaka="Do"><Unos type="date" value={f.do} min={f.od || d} onChange={(e) => postavi('do', e.target.value)} /></Polje>
                    <div className="sm:col-span-2" role="group" aria-label="Deo dana">
                        <span className="mb-1.5 block text-[13px] font-medium text-p-ink">Deo dana</span>
                        <div className="grid grid-cols-3 gap-1.5">
                            {Object.entries(DEO_DANA).map(([k, naziv]) => (
                                <button key={k} type="button" aria-pressed={f.deoDana === k} onClick={() => postavi('deoDana', k)}
                                    className={cx('rounded-lg border px-2 py-2 text-[13px] font-medium transition-colors', f.deoDana === k ? 'border-p-akc bg-p-staza text-p-ink' : 'border-p-ivica text-p-ink hover:border-p-polje')}>{naziv}</button>
                            ))}
                        </div>
                    </div>
                </div>
                <Polje oznaka="Napomena"><TekstPolje value={f.napomena} onChange={(e) => postavi('napomena', e.target.value)} placeholder="npr. može i u kratkom roku, zvati posle 16h" /></Polje>
            </div>
        </Modal>
    );
}

function StavkaListe({ s }) {
    const { podaci, izmeni, obrisi, obavesti, zapisi } = usePanel();
    const indeks = useIndeksi();
    const { otvoriNovi } = useTermini();
    const k = indeks.klijent[s.klijentId];
    const u = indeks.usluga[s.uslugaId];
    const r = s.radnikId ? indeks.radnik[s.radnikId] : null;
    const ime = imeKlijenta(k);
    const predlozi = useMemo(() => predloziVremena(podaci, s, u), [podaci, s, u]);
    const istekao = s.do < danas();

    const ponudi = (v) => {
        izmeni('listaCekanja', s.id, { status: 'ponudjeno', ponuda: v });
        zapisi('klijent', 'Ponudio termin sa liste čekanja', `${ime} — ${datumSaDanomDugo(v.datum)} u ${uSate(v.od)}`);
        obavesti(`SMS ponuda poslata: ${datumSaDanom(v.datum)} u ${uSate(v.od)} kod ${indeks.radnik[v.radnikId]?.ime.split(' ')[0]}.`);
    };
    const zakazi = () => {
        const v = s.ponuda ?? predlozi[0] ?? { datum: s.od < danas() ? danas() : s.od, radnikId: s.radnikId ?? undefined };
        otvoriNovi({ datum: v.datum, od: v.od, radnikId: v.radnikId, klijentId: s.klijentId, usluge: [s.uslugaId] });
        obrisi('listaCekanja', s.id);
        zapisi('klijent', 'Zakazao sa liste čekanja', `${ime} — ${u?.naziv ?? ''}`);
        obavesti(`${ime} je skinut/a sa liste čekanja — potvrdite termin u formi.`);
    };
    const ukloni = () => {
        obrisi('listaCekanja', s.id);
        zapisi('klijent', 'Uklonio sa liste čekanja', `${ime} — ${u?.naziv ?? ''}`);
        obavesti(`${ime} je uklonjen/a sa liste čekanja.`);
    };
    const isto = (a, b) => a && b && a.datum === b.datum && a.od === b.od && a.radnikId === b.radnikId;

    return (
        <li className="rounded-2xl border border-p-ivica bg-p-karta p-4 shadow-[0_1px_2px_rgb(0_0_0/.03)] sm:p-5">
            <div className="flex items-start gap-3">
                <Avatar ime={ime} velicina={40} />
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        {k ? <Link to={`${P}/klijenti/${k.id}`} className="truncate text-[15px] font-semibold hover:underline">{ime}</Link> : <span className="text-[15px] font-semibold">{ime}</span>}
                        {s.status === 'ponudjeno' ? <Znacka ton="info" tacka>Ponuđeno</Znacka> : <Znacka ton="upoz" tacka>Čeka</Znacka>}
                        {istekao && <Znacka ton="greska">Period je prošao</Znacka>}
                    </div>
                    {k?.telefon && <a href={`tel:${k.telefon.replace(/\D/g, '')}`} className="mt-0.5 inline-flex items-center gap-1 text-[13px] text-p-tiho hover:text-p-ink"><Phone className="h-3.5 w-3.5" aria-hidden="true" /><span className="tabularno">{k.telefon}</span></a>}
                </div>
                <span className="shrink-0 text-[12px] text-p-tiho">dodato {datumRelativno(s.kreiran).toLowerCase()}</span>
            </div>

            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 rounded-xl bg-p-meko/60 p-3 text-[13px] sm:grid-cols-4 sm:p-4">
                <div className="col-span-2 min-w-0 sm:col-span-1"><dt className="text-p-tiho">Usluga</dt><dd className="mt-0.5 truncate font-medium">{u?.naziv ?? s.uslugaId}{u && <span className="font-normal text-p-tiho"> · {fTrajanje(u.trajanje)}</span>}</dd></div>
                <div className="min-w-0"><dt className="text-p-tiho">Radnik</dt><dd className="mt-0.5 flex items-center gap-1.5 truncate font-medium">{r ? <><Avatar ime={r.ime} slika={r.slika} boja={r.boja} velicina={18} />{r.ime.split(' ')[0]}</> : <><Users className="h-3.5 w-3.5 text-p-tiho" aria-hidden="true" />Bilo ko</>}</dd></div>
                <div className="min-w-0"><dt className="text-p-tiho">Period</dt><dd className="mt-0.5 font-medium tabularno">{datumKratko(s.od)} – {datumKratko(s.do)}</dd></div>
                <div className="min-w-0"><dt className="text-p-tiho">Deo dana</dt><dd className="mt-0.5 font-medium">{s.deoDana === 'bilo kad' ? 'Bilo kad' : s.deoDana === 'prepodne' ? 'Prepodne' : 'Popodne'}</dd></div>
            </dl>
            {s.napomena && <p className="mt-2 text-[13px] text-p-tiho">„{s.napomena}”</p>}

            <div className="mt-4">
                <div className="mb-2 text-[12px] font-semibold uppercase tracking-[.06em] text-p-tiho">Slobodna vremena koja odgovaraju</div>
                {predlozi.length ? (
                    <div className="flex flex-wrap gap-1.5">
                        {predlozi.map((v) => {
                            const ponudjeno = isto(v, s.ponuda);
                            return (
                                <button key={`${v.datum}${v.od}${v.radnikId}`} type="button" onClick={() => ponudi(v)} title="Pošalji SMS ponudu za ovo vreme"
                                    className={cx('group inline-flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-[13px] transition-colors', ponudjeno ? 'border-p-akc bg-p-staza' : 'border-p-ivica hover:border-p-akc')}>
                                    <span className="font-medium tabularno">{datumRelativno(v.datum)} {uSate(v.od)}</span>
                                    <span className="text-p-tiho">{indeks.radnik[v.radnikId]?.ime.split(' ')[0]}</span>
                                    <span className="inline-flex items-center gap-1 text-[12px] font-medium text-p-akc"><Send className="h-3 w-3" aria-hidden="true" />{ponudjeno ? 'Ponuđeno' : 'Ponudi'}</span>
                                </button>
                            );
                        })}
                    </div>
                ) : <p className="text-[13px] text-p-tiho">{istekao ? 'Period je prošao — produžite ga ili uklonite klijenta sa liste.' : 'Trenutno nema slobodnog vremena u traženom periodu.'}</p>}
                {s.status === 'ponudjeno' && s.ponuda && !predlozi.some((v) => isto(v, s.ponuda)) && (
                    <p className="mt-2 flex items-center gap-1.5 text-[12.5px] text-p-info"><MessageSquareText className="h-3.5 w-3.5" aria-hidden="true" />Ponuđeno: {datumSaDanom(s.ponuda.datum)} u {uSate(s.ponuda.od)}</p>
                )}
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-end gap-2 border-t border-p-ivica/70 pt-3">
                <Dugme varijanta="opasnoTiho" velicina="sm" ikona={Trash2} onClick={ukloni} className="mr-auto">Ukloni</Dugme>
                <Dugme varijanta="glavno" velicina="sm" ikona={CalendarPlus} onClick={zakazi}>Zakaži</Dugme>
            </div>
        </li>
    );
}

export default function ListaCekanja() {
    const { podaci } = usePanel();
    const indeks = useIndeksi();
    const [tab, setTab] = useState('sve');
    const [dodavanje, setDodavanje] = useState(false);

    const sve = useMemo(() => [...podaci.listaCekanja].sort((a, b) => a.od.localeCompare(b.od) || a.kreiran.localeCompare(b.kreiran)), [podaci.listaCekanja]);
    const ceka = sve.filter((s) => s.status === 'ceka');
    const ponudjeno = sve.filter((s) => s.status === 'ponudjeno');
    const saVremenom = useMemo(() => sve.filter((s) => predloziVremena(podaci, s, indeks.usluga[s.uslugaId], 1).length).length, [sve, podaci, indeks]);
    const najduze = sve.length ? sve.reduce((a, b) => (b.kreiran < a.kreiran ? b : a)).kreiran : null;
    const lista = tab === 'ceka' ? ceka : tab === 'ponudjeno' ? ponudjeno : sve;

    return (
        <div className="flex flex-col gap-4">
            <ZaglavljeStrane naslov="Lista čekanja" opis="Klijenti koji čekaju da se oslobodi termin. Kad se neko otkaže, ovde odmah vidite kome da ponudite to vreme."
                akcije={<Dugme varijanta="glavno" ikona={Plus} onClick={() => setDodavanje(true)} kratko="Dodaj">Dodaj na listu</Dugme>} />

            <MrezaPlocica>
                <StatPlocica ikona={Hourglass} ton="upoz" oznaka="Na listi" vrednost={sve.length} napomena={klijenata(sve.length)} />
                <StatPlocica ikona={Send} ton="info" oznaka="Ponuđeno" vrednost={ponudjeno.length} napomena="čeka odgovor na SMS" />
                <StatPlocica ikona={CalendarPlus} ton="ok" oznaka="Ima slobodno vreme" vrednost={saVremenom} napomena="može da se ponudi odmah" />
                <StatPlocica ikona={UserRound} ton="tiho" oznaka="Najduže čeka" vrednost={najduze ? datumKratko(najduze) : '—'} napomena={najduze ? `dodato ${datumRelativno(najduze).toLowerCase()}` : 'lista je prazna'} />
            </MrezaPlocica>

            <Tabovi aktivan={tab} onChange={setTab} stavke={[
                { id: 'sve', naziv: 'Svi', broj: sve.length },
                { id: 'ceka', naziv: 'Čekaju', broj: ceka.length },
                { id: 'ponudjeno', naziv: 'Ponuđeno', broj: ponudjeno.length },
            ]} />

            {lista.length ? (
                <ul className="grid gap-3 xl:grid-cols-2">
                    {lista.map((s) => <StavkaListe key={s.id} s={s} />)}
                </ul>
            ) : (
                <Kartica>
                    <Prazno ikona={Hourglass} naslov={tab === 'ponudjeno' ? 'Nema poslatih ponuda' : 'Lista čekanja je prazna'}
                        opis="Kad je željeni termin zauzet, dodajte klijenta ovde — panel će pokazati čim se nešto oslobodi."
                        akcija={<Dugme varijanta="glavno" ikona={Plus} onClick={() => setDodavanje(true)}>Dodaj na listu</Dugme>} />
                </Kartica>
            )}

            {dodavanje && <DodajNaListu onClose={() => setDodavanje(false)} />}
        </div>
    );
}
