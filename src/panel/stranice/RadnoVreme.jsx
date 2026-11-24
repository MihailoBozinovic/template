/*
 * RADNO VREME — nedeljno radno vreme salona i neradni dani (praznici,
 * kolektivni odmor). Sa ovim se računaju slobodni termini online zakazivanja
 * i „Otvoreno do …” na sajtu.
 */
import React, { useEffect, useMemo, useState } from 'react';
import { CalendarOff, Clock, Copy, Plus, RotateCcw, Save, Trash2 } from 'lucide-react';
import { usePanel, useDozvole } from '../podaci/Skladiste.jsx';
import { DANI_PUNO, DANI_REDOM, danUNedelji, danas as danasF, datumBrojevi, datumSaDanom, dodajDane, mnozina, razlikaDana, sadaMinut, uSate } from '../format.js';
import { Dugme, Izbor, Kartica, Polje, Prazno, Prekidac, Unos, ZaglavljeStrane, Znacka, cx } from '../ui.jsx';

const VREMENA = Array.from({ length: 37 }, (_, i) => uSate(5 * 60 + i * 30)); // 05:00–23:00
const uMin = (s) => { const [h, m] = s.split(':').map(Number); return h * 60 + m; };
const RADNI = ['uto', 'sre', 'cet', 'pet'];
const opcije = (r) => [...new Set([...VREMENA, ...r])].sort();

/** „Danas: otvoreno do 20:00” po (nesačuvanom) rasporedu. */
const danasOpis = (rv, neradni, d, m) => {
    const sledeciOtvoren = () => {
        for (let i = 1; i <= 14; i++) {
            const dd = dodajDane(d, i);
            const r = rv[danUNedelji(dd)];
            if (r && !neradni.some((n) => n.datum === dd)) return `${i === 1 ? 'sutra' : DANI_PUNO[danUNedelji(dd)]} od ${r[0]}`;
        }
        return null;
    };
    const nr = neradni.find((n) => n.datum === d);
    if (nr) return { ton: 'greska', tekst: `Danas: neradni dan${nr.opis ? ` (${nr.opis})` : ''}`, dalje: sledeciOtvoren() };
    const r = rv[danUNedelji(d)];
    if (!r) return { ton: 'tiho', tekst: 'Danas: zatvoreno', dalje: sledeciOtvoren() };
    const [od, doV] = r.map(uMin);
    if (m < od) return { ton: 'info', tekst: `Danas: otvara se u ${r[0]}`, dalje: `radi do ${r[1]}` };
    if (m < doV) return { ton: 'ok', tekst: `Danas: otvoreno do ${r[1]}`, dalje: doV - m <= 60 ? `zatvara se za ${doV - m} min` : null };
    return { ton: 'tiho', tekst: `Danas: zatvoreno od ${r[1]}`, dalje: sledeciOtvoren() };
};

export default function RadnoVreme() {
    const { podaci, postavi, obavesti, zapisi } = usePanel();
    const { podesavanja: moze } = useDozvole();
    const d = danasF();
    const izvor = podaci.podaciSalona;
    const [rv, setRv] = useState(() => ({ ...izvor.radnoVreme }));
    const [neradni, setNeradni] = useState(() => [...(izvor.neradniDani ?? [])]);
    const [novi, setNovi] = useState({ datum: dodajDane(d, 7), opis: '' });
    useEffect(() => { setRv({ ...izvor.radnoVreme }); setNeradni([...(izvor.neradniDani ?? [])]); }, [izvor]);

    const izmenjeno = JSON.stringify(rv) !== JSON.stringify(izvor.radnoVreme) || JSON.stringify(neradni) !== JSON.stringify(izvor.neradniDani ?? []);
    const losiDani = DANI_REDOM.filter((dan) => rv[dan] && uMin(rv[dan][0]) >= uMin(rv[dan][1]));
    const sati = DANI_REDOM.reduce((s, dan) => s + (rv[dan] && !losiDani.includes(dan) ? (uMin(rv[dan][1]) - uMin(rv[dan][0])) / 60 : 0), 0);
    const status = danasOpis(rv, neradni, d, sadaMinut());

    const postaviDan = (dan, v) => setRv((x) => ({ ...x, [dan]: v }));
    const kopiraj = () => {
        if (!rv.pon) return;
        setRv((x) => ({ ...x, ...Object.fromEntries(RADNI.map((dan) => [dan, [...x.pon]])) }));
        obavesti('Ponedeljak je kopiran na utorak–petak.', 'info');
    };
    const dodajNeradni = () => {
        if (!novi.datum || neradni.some((n) => n.datum === novi.datum)) return;
        setNeradni((x) => [...x, { datum: novi.datum, opis: novi.opis.trim() }].sort((a, b) => a.datum.localeCompare(b.datum)));
        setNovi({ datum: dodajDane(novi.datum, 1), opis: '' });
    };
    const sacuvaj = () => {
        if (losiDani.length) return;
        postavi('podaciSalona', (p) => ({ ...p, radnoVreme: rv, neradniDani: neradni }));
        zapisi('salon', 'Izmenio radno vreme', `${Math.round(sati)} h nedeljno · ${neradni.length} neradnih dana`);
        obavesti('Radno vreme je sačuvano — online zakazivanje odmah prati nove sate.');
    };
    const ponisti = () => { setRv({ ...izvor.radnoVreme }); setNeradni([...(izvor.neradniDani ?? [])]); };

    const sortirani = useMemo(() => [...neradni].sort((a, b) => a.datum.localeCompare(b.datum)), [neradni]);
    const buduci = sortirani.filter((n) => n.datum >= d);
    const prosli = sortirani.filter((n) => n.datum < d);
    const zauzet = neradni.some((n) => n.datum === novi.datum);

    return (
        <div className="flex flex-col gap-4">
            <ZaglavljeStrane naslov="Radno vreme" opis="Po ovim satima se nude slobodni termini online i piše „Otvoreno do …” na sajtu."
                akcije={moze && (
                    <>
                        {izmenjeno && <Znacka ton="upoz" tacka>Nesačuvane izmene</Znacka>}
                        <Dugme ikona={RotateCcw} disabled={!izmenjeno} onClick={ponisti}>Poništi</Dugme>
                        <Dugme varijanta="glavno" ikona={Save} disabled={!izmenjeno || losiDani.length > 0} onClick={sacuvaj}>Sačuvaj</Dugme>
                    </>
                )} />

            {!moze && <p className="rounded-xl border border-p-upoz/30 bg-p-upozbg px-3 py-2.5 text-[13px] text-p-upoz">Samo za čitanje — radno vreme menja administrator.</p>}

            <div className={cx('flex flex-wrap items-center gap-x-3 gap-y-1 rounded-2xl border px-4 py-3', status.ton === 'ok' ? 'border-p-ok/25 bg-p-okbg' : status.ton === 'greska' ? 'border-p-greska/25 bg-p-greskabg' : status.ton === 'info' ? 'border-p-info/25 bg-p-infobg' : 'border-p-ivica bg-p-karta')}>
                <span className={cx('flex items-center gap-2 text-[15px] font-semibold', status.ton === 'ok' ? 'text-p-ok' : status.ton === 'greska' ? 'text-p-greska' : status.ton === 'info' ? 'text-p-info' : 'text-p-ink')}>
                    <span className="h-2 w-2 rounded-full bg-current" aria-hidden="true" />{status.tekst}
                </span>
                {status.dalje && <span className="text-[13px] text-p-tiho">· {status.dalje}</span>}
                <span className="ml-auto text-[13px] text-p-tiho tabularno">{String(Math.round(sati * 10) / 10).replace('.', ',')} h nedeljno</span>
            </div>

            <div className="grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
                <Kartica naslov="Nedeljno radno vreme" opis="Koraci od 30 minuta"
                    akcije={moze && <Dugme varijanta="tiho" velicina="sm" ikona={Copy} disabled={!rv.pon} onClick={kopiraj}><span className="hidden sm:inline">Kopiraj ponedeljak na radne dane</span><span className="sm:hidden">Pon → uto–pet</span></Dugme>}
                    telo="px-4 py-1 sm:px-5">
                    <ul>
                        {DANI_REDOM.map((dan) => {
                            const r = rv[dan];
                            const los = losiDani.includes(dan);
                            const jeDanas = danUNedelji(d) === dan;
                            return (
                                <li key={dan} className="flex flex-col gap-2 border-b border-p-ivica/60 py-2 last:border-0 sm:flex-row sm:items-center sm:gap-4">
                                    <div className="flex flex-1 items-center justify-between sm:max-w-[220px]">
                                        <div className="-my-2 flex-1">
                                            <Prekidac oznaka={DANI_PUNO[dan][0].toUpperCase() + DANI_PUNO[dan].slice(1)}
                                                opis={[r ? null : 'Zatvoreno', jeDanas ? 'danas' : null].filter(Boolean).join(' · ') || null} ukljuceno={!!r} disabled={!moze}
                                                onChange={(v) => postaviDan(dan, v ? (izvor.radnoVreme[dan] ?? rv.pon ?? ['09:00', '17:00']) : null)} />
                                        </div>
                                    </div>
                                    {r ? (
                                        <div className="flex items-center gap-2">
                                            <Izbor aria-label={`${DANI_PUNO[dan]} od`} value={r[0]} disabled={!moze} onChange={(e) => postaviDan(dan, [e.target.value, r[1]])} className={cx('w-[104px] tabularno', los && 'border-p-greska')}>
                                                {opcije(r).map((v) => <option key={v} value={v}>{v}</option>)}
                                            </Izbor>
                                            <span className="text-p-tiho">–</span>
                                            <Izbor aria-label={`${DANI_PUNO[dan]} do`} value={r[1]} disabled={!moze} onChange={(e) => postaviDan(dan, [r[0], e.target.value])} className={cx('w-[104px] tabularno', los && 'border-p-greska')}>
                                                {opcije(r).map((v) => <option key={v} value={v}>{v}</option>)}
                                            </Izbor>
                                            <span className={cx('hidden w-14 text-right text-[12.5px] tabularno sm:block', los ? 'text-p-greska' : 'text-p-tiho')}>{los ? 'greška' : `${String((uMin(r[1]) - uMin(r[0])) / 60).replace('.', ',')} h`}</span>
                                        </div>
                                    ) : <div className="hidden text-[13px] text-p-tiho sm:block">Salon ne radi</div>}
                                </li>
                            );
                        })}
                    </ul>
                    {losiDani.length > 0 && <p className="pb-3 text-[13px] text-p-greska">Kraj mora biti posle početka: {losiDani.map((x) => DANI_PUNO[x]).join(', ')}.</p>}
                </Kartica>

                <Kartica naslov="Neradni dani" opis="Praznici i kolektivni odmor — tih dana nema online zakazivanja" telo="p-0">
                    {moze && (
                        <div className="flex flex-col gap-2 border-b border-p-ivica/70 p-4 sm:flex-row sm:items-end sm:px-5">
                            <Polje oznaka="Datum" className="sm:w-40"><Unos type="date" min={d} value={novi.datum} onChange={(e) => setNovi((x) => ({ ...x, datum: e.target.value }))} /></Polje>
                            <Polje oznaka="Opis" className="flex-1"><Unos value={novi.opis} placeholder="npr. Božić" onChange={(e) => setNovi((x) => ({ ...x, opis: e.target.value }))} onKeyDown={(e) => e.key === 'Enter' && dodajNeradni()} /></Polje>
                            <Dugme ikona={Plus} disabled={!novi.datum || zauzet} onClick={dodajNeradni} title={zauzet ? 'Taj dan je već na spisku' : undefined}>Dodaj</Dugme>
                        </div>
                    )}
                    {buduci.length ? (
                        <ul className="p-2">
                            {buduci.map((n) => {
                                const za = razlikaDana(d, n.datum);
                                return (
                                    <li key={n.datum} className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-p-meko/50">
                                        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-p-staza text-center leading-none text-p-akc">
                                            <span><span className="block text-[15px] font-semibold tabularno">{Number(n.datum.slice(8))}</span><span className="text-[10px] uppercase">{datumSaDanom(n.datum).split(' ').pop()}</span></span>
                                        </span>
                                        <div className="min-w-0 flex-1">
                                            <div className="truncate text-sm font-medium">{n.opis || 'Neradni dan'}</div>
                                            <div className="text-[12.5px] text-p-tiho tabularno">{datumSaDanom(n.datum)} · {za === 0 ? 'danas' : `za ${za} ${mnozina(za, 'dan', 'dana', 'dana')}`}</div>
                                        </div>
                                        {moze && <Dugme varijanta="opasnoTiho" velicina="ikonaSm" ikona={Trash2} aria-label={`Ukloni ${datumBrojevi(n.datum)}`} onClick={() => setNeradni((x) => x.filter((y) => y.datum !== n.datum))} />}
                                    </li>
                                );
                            })}
                        </ul>
                    ) : <Prazno ikona={CalendarOff} naslov="Nema neradnih dana" opis="Dodajte praznike i dane kad salon ne radi." />}
                    {prosli.length > 0 && (
                        <details className="border-t border-p-ivica/70 px-4 py-3 sm:px-5">
                            <summary className="cursor-pointer text-[13px] font-medium text-p-tiho">Prošli neradni dani ({prosli.length})</summary>
                            <ul className="mt-2 space-y-1 text-[13px] text-p-tiho">
                                {prosli.map((n) => <li key={n.datum} className="flex justify-between gap-2"><span className="tabularno">{datumBrojevi(n.datum)}</span><span className="truncate">{n.opis}</span></li>)}
                            </ul>
                        </details>
                    )}
                </Kartica>
            </div>
            <p className="flex items-center gap-2 text-[12.5px] text-p-tiho"><Clock className="h-4 w-4 shrink-0" aria-hidden="true" />U produkciji su ovi podaci u src/config/salon.js (radnoVreme, neradniDani). Smene radnika se uređuju u Rasporedu smena.</p>
        </div>
    );
}
