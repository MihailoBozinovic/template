/*
 * TERMINI — „Novi termin” (i izmena) i detalj termina, dostupni sa svake
 * stranice panela: useTermini().otvoriNovi({ datum, od, radnikId }) i
 * useTermini().otvoriDetalj(id). Kao u AllSeasons panelu: naplata sa načinom
 * plaćanja, odobravanje online zahteva, otkazivanje i „nije došao”.
 */
import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Ban, Check, CheckCircle2, Clock, CreditCard, Pencil, Phone, UserX } from 'lucide-react';
import { usePanel, useIndeksi, imeKlijenta, naziviUsluga, useDozvole } from './podaci/Skladiste.jsx';
import { AKTIVNI, preklapanje } from './podaci/analitika.js';
import { danas, datumSaDanomDugo, rsd, trajanje as fTrajanje, uSate, vremeOdDo, sadaMinut } from './format.js';
import { Avatar, Dugme, Fioka, Izbor, Modal, NACINI_PLACANJA, Polje, RedDetalja, StatusTermina, TekstPolje, Unos, Znacka, cx } from './ui.jsx';

const Kontekst = createContext({ otvoriNovi: () => {}, otvoriDetalj: () => {} });
export const useTermini = () => useContext(Kontekst);

export function TerminiProvider({ children }) {
    const [novi, setNovi] = useState(null);
    const [detalj, setDetalj] = useState(null);
    const otvoriNovi = useCallback((predlog = {}) => { setDetalj(null); setNovi(predlog); }, []);
    const otvoriDetalj = useCallback((id) => setDetalj(id), []);
    const api = useMemo(() => ({ otvoriNovi, otvoriDetalj }), [otvoriNovi, otvoriDetalj]);
    return (
        <Kontekst.Provider value={api}>
            {children}
            {novi && <NoviTermin predlog={novi} onClose={() => setNovi(null)} />}
            {detalj != null && <DetaljTermina id={detalj} onClose={() => setDetalj(null)} onIzmeni={(t) => otvoriNovi({ izmena: t })} />}
        </Kontekst.Provider>
    );
}

/* ── Novi termin / izmena ── */
function NoviTermin({ predlog, onClose }) {
    const { podaci, dodaj, izmeni, obavesti, zapisi, noviId } = usePanel();
    const indeks = useIndeksi();
    const { samoSvoje, radnikId: mojId } = useDozvole();
    const izmena = predlog.izmena ?? null;

    const [klijentId, setKlijentId] = useState(izmena?.klijentId ?? predlog.klijentId ?? '');
    const [trazi, setTrazi] = useState('');
    const [noviKlijent, setNoviKlijent] = useState(null);
    const [usluge, setUsluge] = useState(izmena?.usluge ?? predlog.usluge ?? []);
    const [radnikId, setRadnikId] = useState(izmena?.radnikId ?? predlog.radnikId ?? (samoSvoje ? mojId : ''));
    const [datum, setDatum] = useState(izmena?.datum ?? predlog.datum ?? danas());
    const [od, setOd] = useState(izmena?.od ?? predlog.od ?? null);
    const [napomena, setNapomena] = useState(izmena?.napomena ?? '');
    const [greska, setGreska] = useState('');

    const trajanje = usluge.reduce((s, id) => s + (indeks.usluga[id]?.trajanje ?? 0), 0) || 30;
    const cena = usluge.reduce((s, id) => s + (indeks.usluga[id]?.cena ?? 0), 0);
    const radnici = podaci.radnici.filter((r) => r.aktivan && usluge.every((u) => r.usluge.includes(u)));
    const smena = radnikId ? podaci.smene[`${radnikId}|${datum}`] : null;

    const ponudjeni = useMemo(() => {
        const q = trazi.trim().toLowerCase();
        if (q.length < 2) return [];
        return podaci.klijenti.filter((k) => `${k.ime} ${k.prezime} ${k.telefon.replace(/\s/g, '')}`.toLowerCase().includes(q.replace(/\s/g, q.match(/\d/) ? '' : ' '))).slice(0, 6);
    }, [trazi, podaci.klijenti]);

    // Vremena u smeni, na 15 min; zauzeta su označena.
    const vremena = useMemo(() => {
        if (!smena) return [];
        const x = [];
        const minOd = datum === danas() ? Math.ceil(sadaMinut() / 15) * 15 : 0;
        for (let t = smena.od; t + trajanje <= smena.do; t += 15) {
            if (t < minOd && !(izmena && t === izmena.od)) continue;
            x.push({ t, zauzeto: !!preklapanje(podaci.termini, { datum, od: t, trajanje, radnikId, id: izmena?.id }) });
        }
        return x;
    }, [smena, datum, trajanje, radnikId, podaci.termini, izmena]);

    const sacuvaj = () => {
        let kId = klijentId;
        if (!kId && noviKlijent) {
            if (!noviKlijent.ime.trim() || !noviKlijent.telefon.trim()) { setGreska('Upišite ime i telefon novog klijenta.'); return; }
            kId = noviId('k');
            dodaj('klijenti', { id: kId, ime: noviKlijent.ime.trim(), prezime: noviKlijent.prezime.trim(), telefon: noviKlijent.telefon.trim(), email: '', pol: 'z', kreiran: danas(), izvor: 'pult', napomena: '', oznake: [], smsPristanak: true, rodjendan: '', blokiran: false });
        }
        if (!kId) { setGreska('Izaberite klijenta ili upišite novog.'); return; }
        if (!usluge.length) { setGreska('Izaberite bar jednu uslugu.'); return; }
        if (!radnikId) { setGreska('Izaberite radnika.'); return; }
        if (od == null) { setGreska('Izaberite vreme.'); return; }
        const sudar = preklapanje(podaci.termini, { datum, od, trajanje, radnikId, id: izmena?.id });
        if (sudar) { setGreska(`To vreme je zauzeto (${uSate(sudar.od)} — ${imeKlijenta(indeks.klijent[sudar.klijentId])}).`); return; }
        const k = indeks.klijent[kId] ?? { ime: noviKlijent?.ime, prezime: noviKlijent?.prezime ?? '' };
        if (izmena) {
            izmeni('termini', izmena.id, { klijentId: kId, usluge, radnikId, datum, od, trajanje, cena: izmena.cena && izmena.usluge.join() === usluge.join() ? izmena.cena : cena, napomena });
            zapisi('termin', 'Izmenio termin', `${imeKlijenta(k)} — ${datumSaDanomDugo(datum)} u ${uSate(od)}`);
            obavesti('Termin je izmenjen. Klijent dobija SMS sa novim vremenom.');
        } else {
            const id = Math.max(0, ...podaci.termini.map((t) => t.id)) + 1;
            dodaj('termini', { id, datum, od, trajanje, radnikId, usluge, klijentId: kId, cena, status: 'potvrdjen', placanje: null, izvor: 'pult', napomena, kreiran: Date.now(), razlogOtkazivanja: '' });
            zapisi('termin', 'Zakazao termin', `${imeKlijenta(k)} — ${datumSaDanomDugo(datum)} u ${uSate(od)}`);
            obavesti(`Termin je zakazan: ${datumSaDanomDugo(datum)} u ${uSate(od)}.`);
        }
        onClose();
    };

    const klijent = indeks.klijent[klijentId];
    const prekidUsluge = (id) => { setUsluge((u) => (u.includes(id) ? u.filter((x) => x !== id) : [...u, id])); setOd(null); setGreska(''); };

    return (
        <Modal otvoren onClose={onClose} naslov={izmena ? 'Izmena termina' : 'Novi termin'} opis={izmena ? `#${izmena.id}` : 'Zakazivanje sa pulta ili telefonom — klijent dobija potvrdu SMS-om.'} sirina="max-w-2xl"
            podnozje={(
                <>
                    {greska && <p role="alert" className="mr-auto flex items-center gap-1.5 self-center text-[13px] font-medium text-p-greska"><AlertTriangle className="h-4 w-4" aria-hidden="true" />{greska}</p>}
                    <Dugme varijanta="tiho" onClick={onClose}>Odustani</Dugme>
                    <Dugme varijanta="glavno" ikona={Check} onClick={sacuvaj}>{izmena ? 'Sačuvaj izmene' : 'Zakaži termin'}</Dugme>
                </>
            )}>
            <div className="grid gap-5">
                {/* Klijent */}
                <section>
                    <h3 className="mb-2 text-[13px] font-semibold uppercase tracking-[.05em] text-p-tiho">Klijent</h3>
                    {klijent ? (
                        <div className="flex items-center justify-between gap-3 rounded-xl border border-p-ivica bg-p-meko/50 px-3 py-2.5">
                            <div className="flex items-center gap-3"><Avatar ime={imeKlijenta(klijent)} velicina={34} /><div><div className="text-sm font-medium">{imeKlijenta(klijent)}</div><div className="text-[12.5px] text-p-tiho">{klijent.telefon}</div></div></div>
                            <Dugme varijanta="tiho" velicina="sm" onClick={() => setKlijentId('')}>Promeni</Dugme>
                        </div>
                    ) : noviKlijent ? (
                        <div className="grid gap-3 sm:grid-cols-3">
                            <Polje oznaka="Ime"><Unos value={noviKlijent.ime} onChange={(e) => setNoviKlijent({ ...noviKlijent, ime: e.target.value })} /></Polje>
                            <Polje oznaka="Prezime"><Unos value={noviKlijent.prezime} onChange={(e) => setNoviKlijent({ ...noviKlijent, prezime: e.target.value })} /></Polje>
                            <Polje oznaka="Telefon"><Unos inputMode="tel" value={noviKlijent.telefon} onChange={(e) => setNoviKlijent({ ...noviKlijent, telefon: e.target.value })} placeholder="06x xxx xxxx" /></Polje>
                            <button type="button" className="text-left text-[13px] font-medium text-p-akc sm:col-span-3" onClick={() => setNoviKlijent(null)}>← Izaberi postojećeg klijenta</button>
                        </div>
                    ) : (
                        <div className="relative">
                            <Unos value={trazi} onChange={(e) => setTrazi(e.target.value)} placeholder="Ime, prezime ili telefon…" aria-label="Pretraga klijenta" />
                            {ponudjeni.length > 0 && (
                                <ul className="absolute inset-x-0 top-full z-10 mt-1 overflow-hidden rounded-xl border border-p-ivica bg-p-karta shadow-lg">
                                    {ponudjeni.map((k) => (
                                        <li key={k.id}><button type="button" onClick={() => { setKlijentId(k.id); setTrazi(''); }} className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm hover:bg-p-meko"><span>{imeKlijenta(k)}</span><span className="text-[12.5px] text-p-tiho">{k.telefon}</span></button></li>
                                    ))}
                                </ul>
                            )}
                            <button type="button" className="mt-2 text-[13px] font-medium text-p-akc" onClick={() => setNoviKlijent({ ime: trazi.match(/\d/) ? '' : trazi.split(' ')[0] ?? '', prezime: trazi.match(/\d/) ? '' : trazi.split(' ').slice(1).join(' '), telefon: trazi.match(/\d/) ? trazi : '' })}>+ Novi klijent</button>
                        </div>
                    )}
                </section>

                {/* Usluge */}
                <section>
                    <h3 className="mb-2 text-[13px] font-semibold uppercase tracking-[.05em] text-p-tiho">Usluge {usluge.length > 0 && <span className="normal-case tracking-normal text-p-ink">· {fTrajanje(trajanje)} · {rsd(cena)}</span>}</h3>
                    <div className="max-h-56 space-y-3 overflow-y-auto pr-1 p-skrol">
                        {podaci.kategorije.map((kat) => {
                            const lista = podaci.usluge.filter((u) => u.kategorija === kat.id && u.aktivna && (!samoSvoje || indeks.radnik[mojId]?.usluge.includes(u.id)));
                            if (!lista.length) return null;
                            return (
                                <div key={kat.id}>
                                    <div className="mb-1.5 text-[12px] font-medium text-p-tiho">{kat.naziv}</div>
                                    <div className="flex flex-wrap gap-1.5">
                                        {lista.map((u) => (
                                            <button key={u.id} type="button" aria-pressed={usluge.includes(u.id)} onClick={() => prekidUsluge(u.id)}
                                                className={cx('rounded-lg border px-2.5 py-1.5 text-[13px] transition-colors', usluge.includes(u.id) ? 'border-p-akc bg-p-staza font-medium text-p-ink' : 'border-p-ivica text-p-ink hover:border-p-polje')}>
                                                {u.naziv} <span className="text-p-tiho">· {u.trajanje} min</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* Radnik, datum, vreme */}
                <section className="grid gap-3 sm:grid-cols-2">
                    <Polje oznaka="Radnik">
                        <Izbor value={radnikId} onChange={(e) => { setRadnikId(e.target.value); setOd(null); }} disabled={samoSvoje}>
                            <option value="">Izaberite…</option>
                            {(radnici.length ? radnici : podaci.radnici).map((r) => <option key={r.id} value={r.id}>{r.ime}</option>)}
                        </Izbor>
                    </Polje>
                    <Polje oznaka="Datum"><Unos type="date" value={datum} min={danas()} onChange={(e) => { setDatum(e.target.value); setOd(null); }} /></Polje>
                </section>
                <section>
                    <h3 className="mb-2 text-[13px] font-semibold uppercase tracking-[.05em] text-p-tiho">Vreme</h3>
                    {!radnikId ? <p className="text-[13px] text-p-tiho">Prvo izaberite radnika.</p>
                        : !smena ? <p className="text-[13px] text-p-tiho">{indeks.radnik[radnikId]?.ime} tog dana ne radi.</p>
                            : (
                                <div className="flex flex-wrap gap-1.5">
                                    {vremena.map(({ t, zauzeto }) => (
                                        <button key={t} type="button" disabled={zauzeto} aria-pressed={od === t} onClick={() => { setOd(t); setGreska(''); }}
                                            className={cx('w-[68px] rounded-lg border py-1.5 text-[13px] tabularno transition-colors', od === t ? 'border-p-akc bg-p-akc font-semibold text-p-naakc' : zauzeto ? 'cursor-not-allowed border-transparent bg-p-meko text-p-tiho/60 line-through' : 'border-p-ivica hover:border-p-akc')}>
                                            {uSate(t)}
                                        </button>
                                    ))}
                                    {!vremena.length && <p className="text-[13px] text-p-tiho">Nema slobodnog vremena za {fTrajanje(trajanje)}.</p>}
                                </div>
                            )}
                </section>
                <Polje oznaka="Napomena (vidi samo osoblje)"><TekstPolje value={napomena} onChange={(e) => setNapomena(e.target.value)} placeholder="npr. donosi sliku željene boje" /></Polje>
            </div>
        </Modal>
    );
}

/* ── Detalj termina ── */
function DetaljTermina({ id, onClose, onIzmeni }) {
    const { podaci, izmeni, obavesti, zapisi } = usePanel();
    const indeks = useIndeksi();
    const { samoSvoje, radnikId: mojId } = useDozvole();
    const t = podaci.termini.find((x) => x.id === id);
    const [naplata, setNaplata] = useState(null);
    if (!t) return null;
    const k = indeks.klijent[t.klijentId];
    const r = indeks.radnik[t.radnikId];
    const menja = !samoSvoje || t.radnikId === mojId;
    const istorija = podaci.termini.filter((x) => x.klijentId === t.klijentId && x.status === 'zavrsen').length;

    const promeni = (izmena, poruka, radnja) => { izmeni('termini', t.id, izmena); zapisi('termin', radnja, `${imeKlijenta(k)} — #${t.id}`); obavesti(poruka); };

    return (
        <Fioka otvoren onClose={onClose} naslov={imeKlijenta(k)} podnaslov={<span className="flex items-center gap-2"><StatusTermina status={t.status} /> <span>#{t.id}</span></span>}
            podnozje={menja && (
                <>
                    {t.status === 'zahtev' && (
                        <>
                            <Dugme varijanta="opasnoTiho" ikona={Ban} onClick={() => { promeni({ status: 'otkazan', razlogOtkazivanja: 'Zahtev odbijen' }, 'Zahtev je odbijen — klijent dobija poruku.', 'Odbio zahtev'); onClose(); }}>Odbij</Dugme>
                            <Dugme varijanta="glavno" ikona={Check} onClick={() => promeni({ status: 'potvrdjen' }, 'Zahtev je odobren — klijent dobija potvrdu.', 'Odobrio zahtev')}>Odobri</Dugme>
                        </>
                    )}
                    {t.status === 'potvrdjen' && (
                        <>
                            <Dugme varijanta="tiho" ikona={Pencil} onClick={() => onIzmeni(t)}>Pomeri</Dugme>
                            <Dugme varijanta="glavno" ikona={CreditCard} onClick={() => setNaplata({ placanje: 'kartica', cena: t.cena })}>Naplati</Dugme>
                        </>
                    )}
                    {t.status === 'zavrsen' && <Dugme varijanta="tiho" onClick={() => promeni({ status: 'potvrdjen', placanje: null }, 'Naplata je poništena.', 'Poništio naplatu')}>Poništi naplatu</Dugme>}
                    {(t.status === 'otkazan' || t.status === 'nije-dosao') && <Dugme varijanta="tiho" onClick={() => promeni({ status: 'potvrdjen', razlogOtkazivanja: '' }, 'Termin je vraćen.', 'Vratio termin')}>Vrati termin</Dugme>}
                </>
            )}>
            <div className="rounded-xl bg-p-meko/60 p-4">
                <div className="text-[13px] text-p-tiho">{datumSaDanomDugo(t.datum)}</div>
                <div className="mt-0.5 text-xl font-semibold tabularno">{vremeOdDo(t.od, t.trajanje)}</div>
                <div className="mt-2 text-sm">{naziviUsluga(t.usluge, indeks)}</div>
                <div className="mt-3 flex items-center gap-2 text-sm"><Avatar ime={r?.ime} slika={r?.slika} boja={r?.boja} velicina={24} /> {r?.ime}</div>
            </div>

            {naplata && (
                <div className="mt-4 rounded-xl border border-p-akc/40 p-4">
                    <h3 className="text-sm font-semibold">Naplata</h3>
                    <div className="mt-3 grid grid-cols-3 gap-1.5">
                        {Object.entries(NACINI_PLACANJA).map(([kljuc, naziv]) => (
                            <button key={kljuc} type="button" aria-pressed={naplata.placanje === kljuc} onClick={() => setNaplata({ ...naplata, placanje: kljuc })}
                                className={cx('rounded-lg border py-2 text-[13px] font-medium', naplata.placanje === kljuc ? 'border-p-akc bg-p-staza' : 'border-p-ivica')}>{naziv}</button>
                        ))}
                    </div>
                    <Polje oznaka="Iznos (RSD)" className="mt-3"><Unos type="number" inputMode="numeric" value={naplata.cena} onChange={(e) => setNaplata({ ...naplata, cena: Number(e.target.value) })} /></Polje>
                    <div className="mt-3 flex justify-end gap-2">
                        <Dugme varijanta="tiho" velicina="sm" onClick={() => setNaplata(null)}>Odustani</Dugme>
                        <Dugme varijanta="glavno" velicina="sm" ikona={CheckCircle2} onClick={() => { promeni({ status: 'zavrsen', placanje: naplata.placanje, cena: naplata.cena }, `Naplaćeno ${rsd(naplata.cena)} — ${NACINI_PLACANJA[naplata.placanje].toLowerCase()}.`, 'Naplatio termin'); setNaplata(null); }}>Potvrdi naplatu</Dugme>
                    </div>
                </div>
            )}

            <div className="mt-4">
                <RedDetalja oznaka="Cena">{rsd(t.cena)}</RedDetalja>
                <RedDetalja oznaka="Trajanje">{fTrajanje(t.trajanje)}</RedDetalja>
                {t.placanje && <RedDetalja oznaka="Plaćeno">{NACINI_PLACANJA[t.placanje]}</RedDetalja>}
                <RedDetalja oznaka="Zakazano">{t.izvor === 'online' ? 'Online, sa sajta' : t.izvor === 'telefon' ? 'Telefonom' : t.izvor === 'instagram' ? 'Instagram poruka' : 'Na pultu'}</RedDetalja>
                {t.razlogOtkazivanja && <RedDetalja oznaka="Razlog">{t.razlogOtkazivanja}</RedDetalja>}
                {t.napomena && <RedDetalja oznaka="Napomena">{t.napomena}</RedDetalja>}
            </div>

            {k && (
                <div className="mt-5 rounded-xl border border-p-ivica p-4">
                    <div className="flex items-center justify-between gap-3">
                        <div className="text-sm font-semibold">Klijent</div>
                        <Link to={`/panel/klijenti/${k.id}`} onClick={onClose} className="text-[13px] font-medium text-p-akc hover:underline">Karton klijenta →</Link>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-2 text-[13px]">
                        <a href={`tel:${k.telefon.replace(/\s/g, '')}`} className="inline-flex items-center gap-1.5 rounded-lg bg-p-meko px-2.5 py-1.5"><Phone className="h-3.5 w-3.5" aria-hidden="true" />{k.telefon}</a>
                        <Znacka ton={istorija > 5 ? 'akc' : 'tiho'}>{istorija ? `${istorija}. poseta` : 'Prvi dolazak'}</Znacka>
                    </div>
                    {k.napomena && <p className="mt-2 rounded-lg bg-p-upozbg px-3 py-2 text-[13px] text-p-upoz">{k.napomena}</p>}
                </div>
            )}

            {menja && t.status === 'potvrdjen' && (
                <div className="mt-5 flex flex-wrap gap-2 border-t border-p-ivica pt-4">
                    <Dugme varijanta="obicno" velicina="sm" ikona={UserX} onClick={() => promeni({ status: 'nije-dosao' }, 'Označeno: klijent nije došao.', 'Označio nedolazak')}>Nije došao</Dugme>
                    <Dugme varijanta="opasnoTiho" velicina="sm" ikona={Ban} onClick={() => promeni({ status: 'otkazan', razlogOtkazivanja: 'Otkazano iz panela' }, 'Termin je otkazan — klijent dobija poruku.', 'Otkazao termin')}>Otkaži termin</Dugme>
                </div>
            )}
        </Fioka>
    );
}

/** Kompaktan red termina (lista dana, zahtevi, karton klijenta). */
export function RedTermina({ t, prikaziDatum, prikaziRadnika = true, className }) {
    const indeks = useIndeksi();
    const { otvoriDetalj } = useTermini();
    const r = indeks.radnik[t.radnikId];
    const sada = t.datum === danas() && sadaMinut() >= t.od && sadaMinut() < t.od + t.trajanje && AKTIVNI.has(t.status);
    return (
        <button type="button" onClick={() => otvoriDetalj(t.id)} className={cx('flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-p-meko/70', className)}>
            <span className="w-[52px] shrink-0 text-right">
                <span className="block text-sm font-semibold tabularno">{uSate(t.od)}</span>
                <span className="block text-[11.5px] text-p-tiho tabularno">{t.trajanje} min</span>
            </span>
            <span className="h-9 w-[3px] shrink-0 rounded-full" style={{ background: r?.boja }} aria-hidden="true" />
            <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">{imeKlijenta(indeks.klijent[t.klijentId])}</span>
                <span className="block truncate text-[12.5px] text-p-tiho">{prikaziDatum ? `${datumSaDanomDugo(t.datum)} · ` : ''}{naziviUsluga(t.usluge, indeks)}{prikaziRadnika ? ` · ${r?.ime.split(' ')[0]}` : ''}</span>
            </span>
            {sada ? <Znacka ton="akc" tacka><Clock className="h-3 w-3" aria-hidden="true" />U toku</Znacka> : <StatusTermina status={t.status} />}
        </button>
    );
}
