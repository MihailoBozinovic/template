/*
 * KARTOTEKA — tehnički karton salona: formule boja, oksidanti, vreme
 * delovanja i napomene za sledeći put. Isti zapisi se vide i u kartonu
 * klijenta; modal za zapis (ZapisKartoteke) koristi i KlijentDetalj.
 */
import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, FlaskConical, IdCard, Pencil, Plus, Trash2 } from 'lucide-react';
import { usePanel, useIndeksi, imeKlijenta } from '../podaci/Skladiste.jsx';
import { danas as danasF, datumDugo, datumSaDanom } from '../format.js';
import { Avatar, Dugme, Izbor, Kartica, Modal, Polje, Prazno, Pretraga, TekstPolje, Unos, ZaglavljeStrane, Znacka } from '../ui.jsx';
import { P } from '../Ljuska.jsx';

const NA_STRANI = 24;
const bezKvacica = (s = '') => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/đ/g, 'dj');

/** Izbor usluge grupisan po kategorijama. */
export function IzborUsluge({ value, onChange }) {
    const { podaci } = usePanel();
    return (
        <Izbor value={value} onChange={onChange}>
            <option value="">Izaberite…</option>
            {podaci.kategorije.map((kat) => {
                const lista = podaci.usluge.filter((u) => u.kategorija === kat.id);
                return lista.length ? <optgroup key={kat.id} label={kat.naziv}>{lista.map((u) => <option key={u.id} value={u.id}>{u.naziv}</option>)}</optgroup> : null;
            })}
        </Izbor>
    );
}

/** Modal za novi zapis ili izmenu. `klijentId` zaključava klijenta (karton). */
export function ZapisKartoteke({ zapis, klijentId: fiksniKlijent, onClose }) {
    const { podaci, sesija, dodaj, izmeni, obavesti, zapisi, noviId } = usePanel();
    const indeks = useIndeksi();
    const [f, setF] = useState(() => zapis ?? {
        klijentId: fiksniKlijent ?? '', datum: danasF(), uslugaId: podaci.usluge.find((u) => u.kategorija === 'boja')?.id ?? '',
        radnikId: sesija?.radnikId ?? '', formula: '', napomena: '',
    });
    const [trazi, setTrazi] = useState('');
    const [greska, setGreska] = useState('');
    const p = (k) => (e) => { setF({ ...f, [k]: e.target.value }); setGreska(''); };
    const klijent = indeks.klijent[f.klijentId];

    const ponudjeni = useMemo(() => {
        const q = bezKvacica(trazi.trim());
        if (q.length < 2) return [];
        const cif = q.replace(/\D/g, '');
        return podaci.klijenti.filter((k) => (cif.length >= 3 && k.telefon.replace(/\D/g, '').includes(cif)) || bezKvacica(`${k.ime} ${k.prezime}`).includes(q)).slice(0, 6);
    }, [trazi, podaci.klijenti]);

    const sacuvaj = () => {
        if (!f.klijentId) { setGreska('Izaberite klijenta.'); return; }
        if (!f.uslugaId) { setGreska('Izaberite uslugu.'); return; }
        if (!f.formula.trim()) { setGreska('Upišite formulu.'); return; }
        const podatak = { klijentId: f.klijentId, datum: f.datum || danasF(), uslugaId: f.uslugaId, radnikId: f.radnikId, formula: f.formula.trim(), napomena: f.napomena.trim() };
        if (zapis) {
            izmeni('kartoteka', zapis.id, podatak);
            zapisi('kartoteka', 'Izmenio zapis u kartoteci', imeKlijenta(klijent));
            obavesti('Zapis u kartoteci je izmenjen.');
        } else {
            dodaj('kartoteka', { id: noviId('kt'), ...podatak });
            zapisi('kartoteka', 'Dodao zapis u kartoteku', `${imeKlijenta(klijent)} — ${indeks.usluga[f.uslugaId]?.naziv ?? ''}`);
            obavesti(`Formula je sačuvana u kartonu: ${imeKlijenta(klijent)}.`);
        }
        onClose();
    };

    return (
        <Modal otvoren onClose={onClose} naslov={zapis ? 'Izmena zapisa' : 'Novi zapis u kartoteci'} opis="Formula, oksidant i vreme delovanja — da sledeći put bude isto." sirina="max-w-xl"
            podnozje={(
                <>
                    {greska && <p role="alert" className="mr-auto self-center text-[13px] font-medium text-p-greska">{greska}</p>}
                    <Dugme varijanta="tiho" onClick={onClose}>Odustani</Dugme>
                    <Dugme varijanta="glavno" ikona={Check} onClick={sacuvaj}>{zapis ? 'Sačuvaj izmene' : 'Sačuvaj zapis'}</Dugme>
                </>
            )}>
            <div className="grid gap-3 sm:grid-cols-2">
                <div className="sm:col-span-2">
                    <span className="mb-1.5 block text-[13px] font-medium text-p-ink">Klijent</span>
                    {klijent ? (
                        <div className="flex items-center justify-between gap-3 rounded-xl border border-p-ivica bg-p-meko/50 px-3 py-2">
                            <span className="flex min-w-0 items-center gap-2.5"><Avatar ime={imeKlijenta(klijent)} velicina={30} /><span className="min-w-0"><span className="block truncate text-sm font-medium">{imeKlijenta(klijent)}</span><span className="block text-[12px] text-p-tiho tabularno">{klijent.telefon}</span></span></span>
                            {!fiksniKlijent && <Dugme varijanta="tiho" velicina="sm" onClick={() => setF({ ...f, klijentId: '' })}>Promeni</Dugme>}
                        </div>
                    ) : (
                        <div className="relative">
                            <Unos value={trazi} onChange={(e) => setTrazi(e.target.value)} placeholder="Ime, prezime ili telefon…" aria-label="Pretraga klijenta" />
                            {ponudjeni.length > 0 && (
                                <ul className="absolute inset-x-0 top-full z-10 mt-1 overflow-hidden rounded-xl border border-p-ivica bg-p-karta shadow-lg">
                                    {ponudjeni.map((k) => (
                                        <li key={k.id}><button type="button" onClick={() => { setF({ ...f, klijentId: k.id }); setTrazi(''); setGreska(''); }} className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm hover:bg-p-meko"><span className="truncate">{imeKlijenta(k)}</span><span className="shrink-0 text-[12.5px] text-p-tiho tabularno">{k.telefon}</span></button></li>
                                    ))}
                                </ul>
                            )}
                            {trazi.trim().length >= 2 && !ponudjeni.length && <p className="mt-1.5 text-[12.5px] text-p-tiho">Nema klijenta „{trazi}”. Prvo ga dodajte u imenik.</p>}
                        </div>
                    )}
                </div>
                <Polje oznaka="Usluga"><IzborUsluge value={f.uslugaId} onChange={p('uslugaId')} /></Polje>
                <Polje oznaka="Radnik">
                    <Izbor value={f.radnikId} onChange={p('radnikId')}>
                        <option value="">—</option>
                        {podaci.radnici.map((r) => <option key={r.id} value={r.id}>{r.ime}</option>)}
                    </Izbor>
                </Polje>
                <Polje oznaka="Datum"><Unos type="date" value={f.datum} max={danasF()} onChange={p('datum')} /></Polje>
                <div className="hidden sm:block" />
                <Polje oznaka="Formula" className="sm:col-span-2" pomoc="Nijansa + oksidant (odnos), vreme delovanja, toner.">
                    <TekstPolje value={f.formula} onChange={p('formula')} className="font-mono text-[13px]" placeholder="npr. Igora Royal 7-1 + 6% (1:1), 35 min" />
                </Polje>
                <Polje oznaka="Napomena (opciono)" className="sm:col-span-2"><Unos value={f.napomena} onChange={p('napomena')} placeholder="npr. sledeći put hladniji ton" /></Polje>
            </div>
        </Modal>
    );
}

/** Jedan zapis kao kartica. `bezKlijenta` u kartonu klijenta. */
export function KarticaZapisa({ z, bezKlijenta, onIzmeni, onObrisi }) {
    const indeks = useIndeksi();
    const k = indeks.klijent[z.klijentId];
    const r = indeks.radnik[z.radnikId];
    return (
        <article className="flex min-w-0 flex-col rounded-2xl border border-p-ivica bg-p-karta p-4 shadow-[0_1px_2px_rgb(0_0_0/.03)]">
            <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                    {!bezKlijenta && (k ? <Link to={`${P}/klijenti/${k.id}`} className="block truncate text-sm font-semibold hover:text-p-akc hover:underline">{imeKlijenta(k)}</Link> : <span className="text-sm font-semibold">Nepoznat klijent</span>)}
                    <div className={bezKlijenta ? 'text-sm font-semibold' : 'mt-0.5 text-[12.5px] text-p-tiho'}>{datumSaDanom(z.datum)} {z.datum.slice(0, 4)}.</div>
                </div>
                {(onIzmeni || onObrisi) && (
                    <div className="-mr-1.5 -mt-1 flex shrink-0">
                        {onIzmeni && <Dugme varijanta="tiho" velicina="ikonaSm" ikona={Pencil} aria-label="Izmeni zapis" onClick={() => onIzmeni(z)} />}
                        {onObrisi && <Dugme varijanta="tiho" velicina="ikonaSm" ikona={Trash2} aria-label="Obriši zapis" onClick={() => onObrisi(z)} className="hover:text-p-greska" />}
                    </div>
                )}
            </div>
            <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <Znacka ton="akc">{indeks.usluga[z.uslugaId]?.naziv ?? 'Usluga'}</Znacka>
                {r && <span className="inline-flex items-center gap-1.5 text-[12.5px] text-p-tiho"><Avatar ime={r.ime} slika={r.slika} boja={r.boja} velicina={18} />{r.ime}</span>}
            </div>
            <pre className="mt-3 whitespace-pre-wrap break-words rounded-lg bg-p-meko p-2.5 font-mono text-[13px] leading-relaxed text-p-ink">{z.formula}</pre>
            {z.napomena && <p className="mt-2 text-[13px] text-p-tiho">{z.napomena}</p>}
        </article>
    );
}

export function BrisanjeZapisa({ z, onClose }) {
    const { obrisi, obavesti, zapisi } = usePanel();
    const indeks = useIndeksi();
    return (
        <Modal otvoren onClose={onClose} naslov="Obrisati zapis?" opis={`${imeKlijenta(indeks.klijent[z.klijentId])} · ${datumDugo(z.datum)}`}
            podnozje={(
                <>
                    <Dugme varijanta="tiho" onClick={onClose}>Odustani</Dugme>
                    <Dugme varijanta="opasno" ikona={Trash2} onClick={() => { obrisi('kartoteka', z.id); zapisi('kartoteka', 'Obrisao zapis iz kartoteke', imeKlijenta(indeks.klijent[z.klijentId])); obavesti('Zapis je obrisan iz kartoteke.'); onClose(); }}>Obriši</Dugme>
                </>
            )}>
            <p className="text-sm text-p-tiho">Formula se više neće videti ni u kartonu klijenta.</p>
            <pre className="mt-3 whitespace-pre-wrap break-words rounded-lg bg-p-meko p-2.5 font-mono text-[13px]">{z.formula}</pre>
        </Modal>
    );
}

export default function Kartoteka() {
    const { podaci } = usePanel();
    const indeks = useIndeksi();
    const [q, setQ] = useState('');
    const [radnik, setRadnik] = useState('');
    const [usluga, setUsluga] = useState('');
    const [koliko, setKoliko] = useState(NA_STRANI);
    const [modal, setModal] = useState(null); // { zapis? } | null
    const [brisanje, setBrisanje] = useState(null);

    const sortirano = useMemo(() => [...podaci.kartoteka].sort((a, b) => b.datum.localeCompare(a.datum) || String(b.id).localeCompare(String(a.id))), [podaci.kartoteka]);
    const uslugeUKartoteci = useMemo(() => [...new Set(podaci.kartoteka.map((z) => z.uslugaId))].map((id) => indeks.usluga[id]).filter(Boolean).sort((a, b) => a.naziv.localeCompare(b.naziv, 'sr')), [podaci.kartoteka, indeks]);

    const lista = useMemo(() => {
        const t = bezKvacica(q.trim());
        return sortirano.filter((z) => {
            if (radnik && z.radnikId !== radnik) return false;
            if (usluga && z.uslugaId !== usluga) return false;
            if (!t) return true;
            const k = indeks.klijent[z.klijentId];
            return bezKvacica(`${k?.ime ?? ''} ${k?.prezime ?? ''} ${z.formula} ${z.napomena}`).includes(t);
        });
    }, [sortirano, q, radnik, usluga, indeks]);

    const brojKlijenata = new Set(podaci.kartoteka.map((z) => z.klijentId)).size;
    const filtrirano = q || radnik || usluga;
    const reset = (fn) => (v) => { fn(v); setKoliko(NA_STRANI); };

    return (
        <div className="flex flex-col gap-4">
            <ZaglavljeStrane naslov="Kartoteka" opis={`${podaci.kartoteka.length} zapisa za ${brojKlijenata} klijenata · formule boja i tretmani, najnoviji prvi`}
                akcije={<Dugme varijanta="glavno" ikona={Plus} onClick={() => setModal({})} kratko="Novi">Novi zapis</Dugme>} />

            <Kartica telo="p-3 sm:p-4">
                <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-[minmax(0,1fr)_220px_220px]">
                    <Pretraga vrednost={q} onChange={reset(setQ)} placeholder="Klijent ili deo formule (npr. 7-1, Olaplex)…" className="sm:col-span-2 lg:col-span-1" />
                    <Izbor value={radnik} onChange={(e) => reset(setRadnik)(e.target.value)} aria-label="Radnik">
                        <option value="">Svi radnici</option>
                        {podaci.radnici.map((r) => <option key={r.id} value={r.id}>{r.ime}</option>)}
                    </Izbor>
                    <Izbor value={usluga} onChange={(e) => reset(setUsluga)(e.target.value)} aria-label="Usluga">
                        <option value="">Sve usluge</option>
                        {uslugeUKartoteci.map((u) => <option key={u.id} value={u.id}>{u.naziv}</option>)}
                    </Izbor>
                </div>
                {filtrirano && (
                    <div className="mt-2.5 flex items-center justify-between gap-2 text-[13px] text-p-tiho">
                        <span className="tabularno">{lista.length} od {podaci.kartoteka.length} zapisa</span>
                        <button type="button" className="font-medium text-p-akc hover:underline" onClick={() => { setQ(''); setRadnik(''); setUsluga(''); setKoliko(NA_STRANI); }}>Poništi filtere</button>
                    </div>
                )}
            </Kartica>

            {lista.length ? (
                <>
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                        {lista.slice(0, koliko).map((z) => <KarticaZapisa key={z.id} z={z} onIzmeni={(x) => setModal({ zapis: x })} onObrisi={setBrisanje} />)}
                    </div>
                    {lista.length > koliko && (
                        <div className="text-center"><Dugme varijanta="obicno" velicina="sm" onClick={() => setKoliko((k) => k + NA_STRANI)}>Prikaži još ({lista.length - koliko})</Dugme></div>
                    )}
                </>
            ) : (
                <Kartica>
                    <Prazno ikona={filtrirano ? FlaskConical : IdCard} naslov={filtrirano ? 'Nema zapisa za ovu pretragu' : 'Kartoteka je prazna'}
                        opis={filtrirano ? 'Probajte drugi deo formule ili poništite filtere.' : 'Posle bojenja upišite formulu — sledeći put je dovoljan jedan pogled.'}
                        akcija={<Dugme varijanta="obicno" velicina="sm" ikona={Plus} onClick={() => setModal({})}>Novi zapis</Dugme>} />
                </Kartica>
            )}

            {modal && <ZapisKartoteke zapis={modal.zapis} onClose={() => setModal(null)} />}
            {brisanje && <BrisanjeZapisa z={brisanje} onClose={() => setBrisanje(null)} />}
        </div>
    );
}
