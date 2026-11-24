/*
 * NOVI TERMIN — stranica iz menija: forma se otvara sama, a ispod nje su
 * „Prvi slobodni termini” za danas i narednih 6 dana, po radniku. Klik na
 * vreme otvara formu sa već izabranim danom, vremenom i radnikom.
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CalendarDays, CalendarPlus, Clock, Sparkles } from 'lucide-react';
import { usePanel, useIndeksi, useDozvole } from '../podaci/Skladiste.jsx';
import { slobodniProzori } from '../podaci/analitika.js';
import { danas, datumKratko, datumRelativno, datumSaDanomDugo, dodajDane, sadaMinut, trajanje as fTrajanje, uSate } from '../format.js';
import { Avatar, Dugme, Izbor, Kartica, Polje, Prazno, ZaglavljeStrane, Znacka, cx } from '../ui.jsx';
import { useTermini } from '../termini.jsx';
import { P } from '../Ljuska.jsx';

const PO_RADNIKU = 4;

export default function NoviTerminStrana() {
    const { podaci } = usePanel();
    const indeks = useIndeksi();
    const { samoSvoje, radnikId: mojId } = useDozvole();
    const { otvoriNovi } = useTermini();
    const [uslugaId, setUslugaId] = useState('');
    const otvoreno = useRef(false);

    // Forma se otvara jednom, pri dolasku na stranicu (i u StrictMode-u).
    useEffect(() => {
        if (otvoreno.current) return;
        otvoreno.current = true;
        otvoriNovi(samoSvoje && mojId ? { radnikId: mojId } : {});
    }, [otvoriNovi, samoSvoje, mojId]);

    const usluga = indeks.usluga[uslugaId];
    const traje = usluga?.trajanje ?? 30;
    const d = danas();

    const dani = useMemo(() => {
        const m = sadaMinut();
        return Array.from({ length: 7 }, (_, i) => {
            const datum = dodajDane(d, i);
            const radnici = podaci.radnici
                .filter((r) => r.aktivan && (!samoSvoje || r.id === mojId) && (!usluga || r.usluge.includes(usluga.id)))
                .map((r) => {
                    const smena = podaci.smene[`${r.id}|${datum}`];
                    if (!smena) return null;
                    const prozori = slobodniProzori(podaci, datum, r.id, i === 0 ? m : 0, traje);
                    return { r, smena, prozori: prozori.slice(0, PO_RADNIKU), slobodnoMin: prozori.reduce((s, p) => s + p.do - p.od, 0) };
                })
                .filter(Boolean);
            return { datum, radnici };
        });
    }, [podaci, d, samoSvoje, mojId, usluga, traje]);

    const prvo = useMemo(() => {
        for (const dan of dani) {
            const kand = dan.radnici.flatMap((x) => (x.prozori[0] ? [{ datum: dan.datum, od: x.prozori[0].od, r: x.r }] : [])).sort((a, b) => a.od - b.od)[0];
            if (kand) return kand;
        }
        return null;
    }, [dani]);

    const otvori = (predlog) => otvoriNovi({ ...predlog, ...(uslugaId ? { usluge: [uslugaId] } : {}) });

    return (
        <div className="flex flex-col gap-4">
            <ZaglavljeStrane naslov="Novi termin" opis="Zakazivanje sa pulta ili telefonom. Izaberite slobodno vreme ispod ili otvorite praznu formu."
                akcije={(
                    <>
                        <Dugme to={`${P}/kalendar`} ikona={CalendarDays}>Kalendar</Dugme>
                        <Dugme varijanta="glavno" ikona={CalendarPlus} onClick={() => otvori(samoSvoje && mojId ? { radnikId: mojId } : {})}>Otvori formu</Dugme>
                    </>
                )} />

            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
                <Kartica telo="p-4 sm:p-5">
                    <Polje oznaka="Za uslugu" pomoc={usluga ? `Prikazana su vremena u koja staje ${fTrajanje(traje)}.` : 'Bez izbora prikazuju se prozori od bar 30 min.'}>
                        <Izbor value={uslugaId} onChange={(e) => setUslugaId(e.target.value)}>
                            <option value="">Bilo koja usluga</option>
                            {podaci.kategorije.map((kat) => {
                                const lista = podaci.usluge.filter((u) => u.kategorija === kat.id && u.aktivna && (!samoSvoje || indeks.radnik[mojId]?.usluge.includes(u.id)));
                                return lista.length ? <optgroup key={kat.id} label={kat.naziv}>{lista.map((u) => <option key={u.id} value={u.id}>{u.naziv} · {u.trajanje} min</option>)}</optgroup> : null;
                            })}
                        </Izbor>
                    </Polje>
                </Kartica>
                <div className="flex min-w-0 items-center gap-4 rounded-2xl border border-p-akc/30 bg-p-staza/60 p-4 sm:p-5">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-p-karta text-p-akc"><Sparkles className="h-5 w-5" aria-hidden="true" /></span>
                    {prvo ? (
                        <>
                            <div className="min-w-0 flex-1">
                                <div className="text-[13px] text-p-tiho">Prvo slobodno vreme</div>
                                <div className="truncate text-lg font-semibold tabularno">{datumRelativno(prvo.datum)} u {uSate(prvo.od)}</div>
                                <div className="truncate text-[13px] text-p-tiho">{prvo.r.ime}{usluga ? ` · ${usluga.naziv}` : ''}</div>
                            </div>
                            <Dugme varijanta="glavno" velicina="sm" onClick={() => otvori({ datum: prvo.datum, od: prvo.od, radnikId: prvo.r.id })}>Zakaži</Dugme>
                        </>
                    ) : <div className="text-sm text-p-tiho">U narednih 7 dana nema slobodnog vremena{usluga ? ` za ${usluga.naziv}` : ''}.</div>}
                </div>
            </div>

            <div>
                <h2 className="mb-1 text-[15px] font-semibold">Prvi slobodni termini</h2>
                <p className="mb-3 text-[13px] text-p-tiho">Danas i narednih 6 dana · do {PO_RADNIKU} vremena po radniku · klik otvara formu</p>
                <div className="grid gap-4 lg:grid-cols-2">
                    {dani.map(({ datum, radnici }) => (
                        <Kartica key={datum} telo="p-2"
                            naslov={<span className="flex items-center gap-2">{datumRelativno(datum).includes(',') ? datumSaDanomDugo(datum).replace(/^./, (c) => c.toUpperCase()) : `${datumRelativno(datum)} · ${datumKratko(datum)}`}</span>}
                            opis={radnici.length ? `${radnici.length} ${radnici.length === 1 ? 'radnik u smeni' : 'radnika u smeni'}` : 'Salon ne radi'}
                            akcije={datum === d ? <Znacka ton="akc" tacka>danas</Znacka> : null}>
                            {radnici.length ? (
                                <ul>
                                    {radnici.map(({ r, smena, prozori, slobodnoMin }) => (
                                        <li key={r.id} className="flex flex-col gap-2 rounded-xl px-3 py-2.5 sm:flex-row sm:items-center sm:gap-3">
                                            <div className="flex min-w-0 items-center gap-2.5 sm:w-[170px] sm:shrink-0">
                                                <Avatar ime={r.ime} slika={r.slika} boja={r.boja} velicina={30} />
                                                <div className="min-w-0">
                                                    <div className="truncate text-sm font-medium">{r.ime}</div>
                                                    <div className="text-[12px] text-p-tiho tabularno">{uSate(smena.od)}–{uSate(smena.do)}{slobodnoMin ? ` · ${fTrajanje(slobodnoMin)} slobodno` : ''}</div>
                                                </div>
                                            </div>
                                            {prozori.length ? (
                                                <div className="flex flex-wrap gap-1.5">
                                                    {prozori.map((p) => (
                                                        <button key={p.od} type="button" onClick={() => otvori({ datum, od: p.od, radnikId: r.id })} title={`Slobodno ${uSate(p.od)}–${uSate(p.do)}`}
                                                            className={cx('inline-flex items-center gap-1 rounded-lg border border-p-ivica px-2.5 py-1 text-[13px] font-medium tabularno transition-colors hover:border-p-akc hover:bg-p-staza')}>
                                                            {uSate(p.od)}<span className="text-[11.5px] font-normal text-p-tiho">–{uSate(p.do)}</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            ) : <span className="inline-flex items-center gap-1.5 text-[13px] text-p-tiho"><Clock className="h-3.5 w-3.5" aria-hidden="true" />{datum === d ? 'Nema više slobodnog vremena danas' : 'Popunjeno'}</span>}
                                        </li>
                                    ))}
                                </ul>
                            ) : <Prazno naslov={samoSvoje ? 'Ne radite ovog dana' : 'Niko ne radi'} opis="Neradni dan, slobodan dan ili odsustvo." className="py-6" />}
                        </Kartica>
                    ))}
                </div>
            </div>
        </div>
    );
}
