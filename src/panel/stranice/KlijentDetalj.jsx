/*
 * KARTON KLIJENTA — sve o jednom klijentu na jednom mestu: kontakt,
 * sledeći termini, istorija poseta, kartoteka (formule), ocene i napomene
 * osoblja. Odavde se zakazuje, zove, menja i blokira.
 */
import React, { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Ban, CalendarCheck, CalendarPlus, Check, History, IdCard, Pencil, Phone, Plus, Receipt, Scissors, ShieldCheck, Star, UserRound, UserX, Wallet } from 'lucide-react';
import { usePanel, useIndeksi, imeKlijenta, naziviUsluga } from '../podaci/Skladiste.jsx';
import { statistikaKlijenata } from '../podaci/analitika.js';
import { MESECI, danas as danasF, datumDugo, datumKratko, datumSaDanom, dodajDane, rsd, termina } from '../format.js';
import { Avatar, Dugme, Izbor, Kartica, Modal, MrezaPlocica, NACINI_PLACANJA, Polje, Prazno, Prekidac, RedDetalja, StatPlocica, StatusTermina, Tabela, TekstPolje, Unos, ZaglavljeStrane, cx } from '../ui.jsx';
import { RedTermina, useTermini } from '../termini.jsx';
import { P } from '../Ljuska.jsx';
import { IZVORI, OZNAKE, ZnackeKlijenta } from './Klijenti.jsx';
import { BrisanjeZapisa, KarticaZapisa, ZapisKartoteke } from './Kartoteka.jsx';

const cifre = (s = '') => s.replace(/\D/g, '');
const rodjendanTekst = (r) => { if (!r) return null; const [m, d] = r.split('-').map(Number); return `${d}. ${MESECI[m - 1]}`; };

/* ── Izmena kontakta i oznaka ── */
function IzmenaKlijenta({ k, onClose }) {
    const { izmeni, obavesti, zapisi } = usePanel();
    const [f, setF] = useState({ ime: k.ime, prezime: k.prezime, telefon: k.telefon, email: k.email, pol: k.pol, napomena: k.napomena, oznake: k.oznake ?? [], rDan: k.rodjendan ? String(Number(k.rodjendan.slice(3))) : '', rMesec: k.rodjendan ? String(Number(k.rodjendan.slice(0, 2))) : '' });
    const [greska, setGreska] = useState('');
    const p = (x) => (e) => { setF({ ...f, [x]: e.target.value }); setGreska(''); };
    const oznaka = (o) => setF({ ...f, oznake: f.oznake.includes(o) ? f.oznake.filter((x) => x !== o) : [...f.oznake, o] });

    const sacuvaj = () => {
        if (!f.ime.trim()) { setGreska('Upišite ime.'); return; }
        if (cifre(f.telefon).length < 8) { setGreska('Upišite ispravan broj telefona.'); return; }
        if (f.email && !/^\S+@\S+\.\S+$/.test(f.email.trim())) { setGreska('E-pošta nije ispravna.'); return; }
        if (!!f.rDan !== !!f.rMesec) { setGreska('Za rođendan izaberite i dan i mesec.'); return; }
        const rodjendan = f.rDan ? `${f.rMesec.padStart(2, '0')}-${f.rDan.padStart(2, '0')}` : '';
        izmeni('klijenti', k.id, { ime: f.ime.trim(), prezime: f.prezime.trim(), telefon: f.telefon.trim(), email: f.email.trim(), pol: f.pol, napomena: f.napomena.trim(), oznake: f.oznake, rodjendan });
        zapisi('klijent', 'Izmenio podatke klijenta', `${f.ime.trim()} ${f.prezime.trim()}`);
        obavesti('Podaci klijenta su sačuvani.');
        onClose();
    };

    return (
        <Modal otvoren onClose={onClose} naslov="Izmena klijenta" opis={imeKlijenta(k)} sirina="max-w-xl"
            podnozje={(
                <>
                    {greska && <p role="alert" className="mr-auto self-center text-[13px] font-medium text-p-greska">{greska}</p>}
                    <Dugme varijanta="tiho" onClick={onClose}>Odustani</Dugme>
                    <Dugme varijanta="glavno" ikona={Check} onClick={sacuvaj}>Sačuvaj</Dugme>
                </>
            )}>
            <div className="grid gap-3 sm:grid-cols-2">
                <Polje oznaka="Ime"><Unos value={f.ime} onChange={p('ime')} /></Polje>
                <Polje oznaka="Prezime"><Unos value={f.prezime} onChange={p('prezime')} /></Polje>
                <Polje oznaka="Telefon"><Unos inputMode="tel" value={f.telefon} onChange={p('telefon')} /></Polje>
                <Polje oznaka="E-pošta"><Unos type="email" inputMode="email" value={f.email} onChange={p('email')} /></Polje>
                <Polje oznaka="Pol"><Izbor value={f.pol} onChange={p('pol')}><option value="z">Žensko</option><option value="m">Muško</option></Izbor></Polje>
                <div>
                    <span className="mb-1.5 block text-[13px] font-medium text-p-ink">Rođendan</span>
                    <div className="grid grid-cols-[minmax(0,.8fr)_minmax(0,1.4fr)] gap-2">
                        <Izbor value={f.rDan} onChange={p('rDan')} aria-label="Dan rođendana"><option value="">Dan</option>{Array.from({ length: 31 }, (_, i) => <option key={i} value={i + 1}>{i + 1}.</option>)}</Izbor>
                        <Izbor value={f.rMesec} onChange={p('rMesec')} aria-label="Mesec rođendana"><option value="">Mesec</option>{MESECI.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}</Izbor>
                    </div>
                </div>
                <div className="sm:col-span-2">
                    <span className="mb-1.5 block text-[13px] font-medium text-p-ink">Oznake</span>
                    <div className="flex flex-wrap gap-1.5">
                        {Object.keys(OZNAKE).map((o) => (
                            <button key={o} type="button" aria-pressed={f.oznake.includes(o)} onClick={() => oznaka(o)}
                                className={cx('inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-[13px] font-medium transition-colors', f.oznake.includes(o) ? 'border-p-akc bg-p-staza text-p-ink' : 'border-p-ivica text-p-tiho hover:text-p-ink')}>
                                {f.oznake.includes(o) && <Check className="h-3.5 w-3.5" aria-hidden="true" />}{o}
                            </button>
                        ))}
                    </div>
                </div>
                <Polje oznaka="Napomena osoblja" className="sm:col-span-2"><TekstPolje value={f.napomena} onChange={p('napomena')} /></Polje>
            </div>
        </Modal>
    );
}

/* ── Blokada ── */
function Blokada({ k, onClose }) {
    const { podaci, izmeni, dodaj, obrisi, obavesti, zapisi, noviId } = usePanel();
    const [razlog, setRazlog] = useState('');
    const odblokiraj = k.blokiran;
    const potvrdi = () => {
        if (odblokiraj) {
            izmeni('klijenti', k.id, { blokiran: false });
            podaci.blokirani.filter((b) => b.klijentId === k.id || cifre(b.telefon) === cifre(k.telefon)).forEach((b) => obrisi('blokirani', b.id));
            zapisi('klijent', 'Odblokirao klijenta', imeKlijenta(k));
            obavesti(`${imeKlijenta(k)} ponovo može da zakazuje online.`);
        } else {
            izmeni('klijenti', k.id, { blokiran: true });
            dodaj('blokirani', { id: noviId('b'), klijentId: k.id, telefon: k.telefon, razlog: razlog.trim() || 'Blokiran iz kartona klijenta', datum: danasF() });
            zapisi('klijent', 'Blokirao klijenta', `${imeKlijenta(k)}${razlog.trim() ? ` — ${razlog.trim()}` : ''}`);
            obavesti(`${imeKlijenta(k)} je blokiran — online zakazivanje sa ovog broja je zatvoreno.`, 'upoz');
        }
        onClose();
    };
    return (
        <Modal otvoren onClose={onClose} naslov={odblokiraj ? 'Odblokirati klijenta?' : 'Blokirati klijenta?'} opis={`${imeKlijenta(k)} · ${k.telefon}`}
            podnozje={(
                <>
                    <Dugme varijanta="tiho" onClick={onClose}>Odustani</Dugme>
                    {odblokiraj
                        ? <Dugme varijanta="glavno" ikona={ShieldCheck} onClick={potvrdi}>Odblokiraj</Dugme>
                        : <Dugme varijanta="opasno" ikona={Ban} onClick={potvrdi}>Blokiraj</Dugme>}
                </>
            )}>
            {odblokiraj ? <p className="text-sm text-p-tiho">Klijent će opet moći da zakazuje preko sajta.</p> : (
                <>
                    <p className="text-sm text-p-tiho">Broj ide na listu blokiranih: sajt neće primati online zahteve sa njega. Sa pulta i dalje možete zakazati.</p>
                    <Polje oznaka="Razlog (vidi samo osoblje)" className="mt-3"><Unos value={razlog} onChange={(e) => setRazlog(e.target.value)} placeholder="npr. tri nedolaska bez otkazivanja" /></Polje>
                </>
            )}
        </Modal>
    );
}

/* ── Napomena osoblja, izmena na licu mesta ── */
function Napomena({ k }) {
    const { izmeni, obavesti, zapisi } = usePanel();
    const [tekst, setTekst] = useState(k.napomena ?? '');
    const promenjeno = tekst.trim() !== (k.napomena ?? '').trim();
    return (
        <Kartica naslov="Napomene osoblja" opis="Vidi samo osoblje — alergije, želje, navike.">
            <TekstPolje value={tekst} onChange={(e) => setTekst(e.target.value)} placeholder="npr. uvek kafa bez šećera, osetljivo teme" aria-label="Napomena osoblja" />
            <div className="mt-2 flex items-center justify-end gap-2">
                {promenjeno && <Dugme varijanta="tiho" velicina="sm" onClick={() => setTekst(k.napomena ?? '')}>Vrati</Dugme>}
                <Dugme varijanta={promenjeno ? 'glavno' : 'obicno'} velicina="sm" ikona={Check} disabled={!promenjeno}
                    onClick={() => { izmeni('klijenti', k.id, { napomena: tekst.trim() }); zapisi('klijent', 'Izmenio napomenu klijenta', imeKlijenta(k)); obavesti('Napomena je sačuvana.'); }}>Sačuvaj napomenu</Dugme>
            </div>
        </Kartica>
    );
}

export default function KlijentDetalj() {
    const { id } = useParams();
    const { podaci, izmeni, obavesti, zapisi } = usePanel();
    const indeks = useIndeksi();
    const { otvoriNovi, otvoriDetalj } = useTermini();
    const d = danasF();
    const [modal, setModal] = useState(null); // 'izmena' | 'blokada' | { zapis? } kartoteka
    const [brisanje, setBrisanje] = useState(null);
    const k = podaci.klijenti.find((x) => x.id === id);

    const svi = useMemo(() => podaci.termini.filter((t) => t.klijentId === id), [podaci.termini, id]);
    const s = useMemo(() => statistikaKlijenata(svi, d)[id] ?? { posete: 0, potroseno: 0, poslednja: null, sledeca: null, otkazano: 0, nijeDosao: 0, radnici: {} }, [svi, d, id]);
    const sledeci = useMemo(() => svi.filter((t) => t.datum >= d && (t.status === 'potvrdjen' || t.status === 'zahtev')).sort((a, b) => a.datum.localeCompare(b.datum) || a.od - b.od), [svi, d]);
    const istorija = useMemo(() => svi.filter((t) => !sledeci.includes(t)).sort((a, b) => b.datum.localeCompare(a.datum) || b.od - a.od), [svi, sledeci]);
    const kartoteka = useMemo(() => podaci.kartoteka.filter((z) => z.klijentId === id).sort((a, b) => b.datum.localeCompare(a.datum)), [podaci.kartoteka, id]);
    const ocene = useMemo(() => podaci.ocene.filter((o) => o.klijentId === id).sort((a, b) => b.datum.localeCompare(a.datum)), [podaci.ocene, id]);

    const omiljeni = useMemo(() => {
        const [rId, broj] = Object.entries(s.radnici ?? {}).sort((a, b) => b[1] - a[1])[0] ?? [];
        const usluge = {};
        svi.filter((t) => t.status === 'zavrsen').forEach((t) => t.usluge.forEach((u) => { usluge[u] = (usluge[u] ?? 0) + 1; }));
        const [uId, uBroj] = Object.entries(usluge).sort((a, b) => b[1] - a[1])[0] ?? [];
        const ritam = (() => {
            const datumi = [...new Set(svi.filter((t) => t.status === 'zavrsen').map((t) => t.datum))].sort();
            if (datumi.length < 2) return null;
            const ms = (x) => Date.parse(`${x}T12:00:00Z`);
            return Math.round((ms(datumi[datumi.length - 1]) - ms(datumi[0])) / 864e5 / (datumi.length - 1));
        })();
        return { radnik: indeks.radnik[rId], broj, usluga: indeks.usluga[uId], uBroj, ritam };
    }, [s, svi, indeks]);

    if (!k) {
        return (
            <div className="flex flex-col gap-4">
                <ZaglavljeStrane naslov="Klijent nije pronađen" nazad={{ to: `${P}/klijenti`, naziv: 'Klijenti' }} />
                <Kartica><Prazno ikona={UserRound} naslov="Ovog klijenta nema u imeniku" opis="Možda je obrisan ili je link pogrešan." akcija={<Dugme to={`${P}/klijenti`}>Nazad na klijente</Dugme>} /></Kartica>
            </div>
        );
    }

    const ime = imeKlijenta(k);
    const prosek = s.posete ? s.potroseno / s.posete : 0;
    const kolone = [
        { kljuc: 'datum', naslov: 'Datum', className: 'whitespace-nowrap', sortVrednost: (t) => `${t.datum}${String(t.od).padStart(4, '0')}`, render: (t) => <span className="tabularno">{datumSaDanom(t.datum)} <span className="text-p-tiho">{t.datum.slice(0, 4)}.</span></span> },
        { kljuc: 'usluge', naslov: 'Usluge', sort: false, render: (t) => <span className="block max-w-[260px] truncate">{naziviUsluga(t.usluge, indeks)}</span> },
        { kljuc: 'radnik', naslov: 'Radnik', sortVrednost: (t) => indeks.radnik[t.radnikId]?.ime ?? '', render: (t) => { const r = indeks.radnik[t.radnikId]; return <span className="flex items-center gap-2 whitespace-nowrap"><Avatar ime={r?.ime} slika={r?.slika} boja={r?.boja} velicina={22} />{r?.ime.split(' ')[0]}</span>; } },
        { kljuc: 'cena', naslov: 'Iznos', desno: true, className: 'whitespace-nowrap', render: (t) => (t.status === 'zavrsen' ? rsd(t.cena) : <span className="text-p-tiho line-through">{rsd(t.cena)}</span>) },
        { kljuc: 'placanje', naslov: 'Plaćanje', sortVrednost: (t) => t.placanje ?? '', render: (t) => (t.placanje ? NACINI_PLACANJA[t.placanje] : <span className="text-p-tiho">—</span>) },
        { kljuc: 'status', naslov: 'Status', sortVrednost: (t) => t.status, render: (t) => <StatusTermina status={t.status} /> },
    ];

    return (
        <div className="flex flex-col gap-4">
            <ZaglavljeStrane naslov={ime} nazad={{ to: `${P}/klijenti`, naziv: 'Klijenti' }}
                opis={`Klijent od ${datumDugo(k.kreiran)} · ${IZVORI[k.izvor] ?? k.izvor}${s.poslednja ? ` · poslednji put ${datumKratko(s.poslednja)}` : ''}`}
                akcije={(
                    <>
                        <Dugme ikona={Phone} href={`tel:${cifre(k.telefon)}`} kratko="Pozovi">Pozovi</Dugme>
                        <Dugme ikona={Pencil} onClick={() => setModal('izmena')} kratko="Izmeni">Izmeni</Dugme>
                        <Dugme varijanta={k.blokiran ? 'obicno' : 'opasnoTiho'} ikona={k.blokiran ? ShieldCheck : Ban} onClick={() => setModal('blokada')}>{k.blokiran ? 'Odblokiraj' : 'Blokiraj'}</Dugme>
                        <Dugme varijanta="glavno" ikona={CalendarPlus} onClick={() => otvoriNovi({ klijentId: k.id })} kratko="Termin">Novi termin</Dugme>
                    </>
                )}>
                <ZnackeKlijenta k={k} className="mt-2" />
            </ZaglavljeStrane>

            {k.blokiran && (
                <div className="flex items-start gap-2.5 rounded-xl border border-p-greska/25 bg-p-greskabg px-3.5 py-2.5 text-[13.5px] text-p-greska">
                    <Ban className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                    <span>Klijent je blokiran{(() => { const b = podaci.blokirani.find((x) => x.klijentId === k.id || cifre(x.telefon) === cifre(k.telefon)); return b ? ` od ${datumKratko(b.datum)} — ${b.razlog}` : ''; })()}. Online zahtevi sa ovog broja se ne primaju.</span>
                </div>
            )}

            <MrezaPlocica>
                <StatPlocica ikona={CalendarCheck} oznaka="Posete" vrednost={s.posete} napomena={s.sledeca ? `sledeća ${datumKratko(s.sledeca)}` : 'nema zakazanog'} />
                <StatPlocica ikona={Wallet} ton="ok" oznaka="Potrošeno" vrednost={rsd(s.potroseno)} napomena="ukupno naplaćeno" />
                <StatPlocica ikona={Receipt} ton="info" oznaka="Prosečan račun" vrednost={rsd(prosek)} napomena={omiljeni.ritam ? `dolazi na ~${omiljeni.ritam} dana` : 'po poseti'} />
                <StatPlocica ikona={UserX} ton={s.nijeDosao ? 'greska' : 'tiho'} oznaka="Otkazano / nije došao" vrednost={<span>{s.otkazano} <span className="text-p-tiho">/</span> {s.nijeDosao}</span>} napomena={s.nijeDosao >= 2 ? 'razmislite o depozitu' : 'pouzdan klijent'} />
            </MrezaPlocica>

            <div className="grid gap-4 lg:grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)]">
                <div className="flex min-w-0 flex-col gap-4">
                    <Kartica naslov="Sledeći termini" opis={sledeci.length ? termina(sledeci.length) : undefined} telo="p-2"
                        akcije={<Dugme varijanta="tiho" velicina="sm" ikona={Plus} onClick={() => otvoriNovi({ klijentId: k.id })}>Zakaži</Dugme>}>
                        {sledeci.length ? <ul>{sledeci.map((t) => <li key={t.id}><RedTermina t={t} prikaziDatum /></li>)}</ul>
                            : <Prazno className="py-6" ikona={CalendarPlus} naslov="Nema zakazanih termina" opis={omiljeni.ritam && s.poslednja ? `Obično dolazi na ~${omiljeni.ritam} dana — sledeći bi bio oko ${datumKratko(dodajDane(s.poslednja, omiljeni.ritam))}.` : undefined} />}
                    </Kartica>

                    <Kartica naslov="Istorija poseta" opis={`${istorija.length} ${istorija.length === 1 ? 'termin' : 'termina'} · klik otvara termin`} telo="p-0">
                        <Tabela kolone={kolone} redovi={istorija} onRed={(t) => otvoriDetalj(t.id)} poStrani={10} gusto
                            prazno={<Prazno className="py-6" ikona={History} naslov="Još nema poseta" opis="Posle prvog naplaćenog termina ovde se vidi istorija." />} />
                    </Kartica>

                    <Kartica naslov="Kartoteka" opis="Formule boja i tretmani ovog klijenta" akcije={<Dugme varijanta="tiho" velicina="sm" ikona={Plus} onClick={() => setModal({})}>Dodaj zapis</Dugme>} telo={kartoteka.length ? 'p-3 sm:p-4' : 'p-0'}>
                        {kartoteka.length ? (
                            <div className="grid gap-3 sm:grid-cols-2">
                                {kartoteka.map((z) => <KarticaZapisa key={z.id} z={z} bezKlijenta onIzmeni={(x) => setModal({ zapis: x })} onObrisi={setBrisanje} />)}
                            </div>
                        ) : <Prazno className="py-6" ikona={IdCard} naslov="Nema zapisa" opis="Posle bojenja upišite formulu — sledeći put je dovoljan jedan pogled." />}
                    </Kartica>
                </div>

                <div className="flex min-w-0 flex-col gap-4">
                    <Kartica naslov="Kontakt" telo="px-4 pb-2 pt-1 sm:px-5">
                        <RedDetalja oznaka="Telefon"><a href={`tel:${cifre(k.telefon)}`} className="tabularno hover:text-p-akc hover:underline">{k.telefon}</a></RedDetalja>
                        <RedDetalja oznaka="E-pošta">{k.email ? <a href={`mailto:${k.email}`} className="break-all hover:text-p-akc hover:underline">{k.email}</a> : <span className="font-normal text-p-tiho">—</span>}</RedDetalja>
                        <RedDetalja oznaka="Rođendan">{rodjendanTekst(k.rodjendan) ?? <span className="font-normal text-p-tiho">—</span>}</RedDetalja>
                        <RedDetalja oznaka="Pol">{k.pol === 'm' ? 'Muško' : 'Žensko'}</RedDetalja>
                        <RedDetalja oznaka="Prvi put">{IZVORI[k.izvor] ?? k.izvor}</RedDetalja>
                        <div className="border-t border-p-ivica/60">
                            <Prekidac ukljuceno={k.smsPristanak} oznaka="SMS pristanak" opis={k.smsPristanak ? 'Prima podsetnike i ponude.' : 'Ne šaljemo mu SMS kampanje.'}
                                onChange={(v) => { izmeni('klijenti', k.id, { smsPristanak: v }); zapisi('klijent', v ? 'Uključio SMS pristanak' : 'Isključio SMS pristanak', ime); obavesti(v ? 'SMS pristanak je uključen.' : 'SMS pristanak je isključen.'); }} />
                        </div>
                    </Kartica>

                    <Napomena key={k.id + (k.napomena ?? '')} k={k} />

                    <Kartica naslov="Omiljeno" telo="p-2">
                        <ul>
                            <li className="flex items-center gap-3 rounded-xl px-3 py-2.5">
                                {omiljeni.radnik ? <Avatar ime={omiljeni.radnik.ime} slika={omiljeni.radnik.slika} boja={omiljeni.radnik.boja} velicina={36} /> : <span className="grid h-9 w-9 place-items-center rounded-full bg-p-meko text-p-tiho"><UserRound className="h-4 w-4" aria-hidden="true" /></span>}
                                <span className="min-w-0 flex-1"><span className="block text-[12.5px] text-p-tiho">Omiljeni radnik</span><span className="block truncate text-sm font-medium">{omiljeni.radnik?.ime ?? '—'}</span></span>
                                {omiljeni.broj && <span className="shrink-0 text-[12.5px] text-p-tiho tabularno">{omiljeni.broj} od {s.posete}</span>}
                            </li>
                            <li className="flex items-center gap-3 rounded-xl px-3 py-2.5">
                                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-p-staza text-p-akc"><Scissors className="h-4 w-4" aria-hidden="true" /></span>
                                <span className="min-w-0 flex-1"><span className="block text-[12.5px] text-p-tiho">Najčešća usluga</span><span className="block truncate text-sm font-medium">{omiljeni.usluga?.naziv ?? '—'}</span></span>
                                {omiljeni.uBroj && <span className="shrink-0 text-[12.5px] text-p-tiho tabularno">{omiljeni.uBroj}×</span>}
                            </li>
                        </ul>
                    </Kartica>

                    <Kartica naslov="Ocene koje je ostavio" opis={ocene.length ? `${ocene.length} · prosek ${(ocene.reduce((x, o) => x + o.ocena, 0) / ocene.length).toFixed(1).replace('.', ',')}` : undefined} telo="p-2">
                        {ocene.length ? (
                            <ul className="max-h-[360px] overflow-y-auto p-skrol">
                                {ocene.map((o) => (
                                    <li key={o.id} className="rounded-xl px-3 py-2.5">
                                        <div className="flex items-center justify-between gap-2 text-[12.5px] text-p-tiho">
                                            <span className="text-p-zlato" aria-label={`${o.ocena} od 5`}>{'★'.repeat(o.ocena)}<span className="text-p-ivica">{'★'.repeat(5 - o.ocena)}</span></span>
                                            <span className="tabularno">{indeks.radnik[o.radnikId]?.ime.split(' ')[0]} · {datumKratko(o.datum)}</span>
                                        </div>
                                        {o.komentar ? <p className="mt-1 text-[13.5px]">„{o.komentar}”</p> : <p className="mt-1 text-[12.5px] text-p-tiho">Bez komentara</p>}
                                    </li>
                                ))}
                            </ul>
                        ) : <Prazno className="py-6" ikona={Star} naslov="Još nije ocenjivao" />}
                    </Kartica>
                </div>
            </div>

            {modal === 'izmena' && <IzmenaKlijenta k={k} onClose={() => setModal(null)} />}
            {modal === 'blokada' && <Blokada k={k} onClose={() => setModal(null)} />}
            {modal && typeof modal === 'object' && <ZapisKartoteke zapis={modal.zapis} klijentId={k.id} onClose={() => setModal(null)} />}
            {brisanje && <BrisanjeZapisa z={brisanje} onClose={() => setBrisanje(null)} />}
        </div>
    );
}
