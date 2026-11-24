/*
 * KALENDAR — dan po radnicima (kolone), nedelja i lista, kao AllSeasons
 * „termini-salon”. Klik na prazno polje zakazuje u to vreme, klik na termin
 * otvara detalj, a termin se prevlači mišem ili prstom na drugo vreme ili
 * drugog radnika (provera preklapanja pre upisa).
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { CalendarPlus, ChevronLeft, ChevronRight, Check, Eye, EyeOff } from 'lucide-react';
import { usePanel, useIndeksi, imeKlijenta, naziviUsluga, useDozvole } from '../podaci/Skladiste.jsx';
import { AKTIVNI, preklapanje, zbir } from '../podaci/analitika.js';
import { DANI_KRATKO, danas as danasF, danUNedelji, datumKratko, datumSaDanomDugo, dodajDane, MESECI, pocetakNedelje, rsd, sadaMinut, termina, uSate } from '../format.js';
import { Avatar, Dugme, Kartica, Prazno, Tabovi, Unos, ZaglavljeStrane, cx } from '../ui.jsx';
import { RedTermina, useTermini } from '../termini.jsx';

const PX_SAT = 72; // visina jednog sata u dnevnom prikazu
const PX_MIN = PX_SAT / 60;
const KORAK = 15;

const opsegNedelje = (d) => { const p = pocetakNedelje(d); return Array.from({ length: 7 }, (_, i) => dodajDane(p, i)); };
const nazivNedelje = (d) => {
    const [a, b] = [opsegNedelje(d)[0], opsegNedelje(d)[6]];
    const [, ma, da] = a.split('-').map(Number); const [, mb, db] = b.split('-').map(Number);
    return ma === mb ? `${da}–${db}. ${MESECI[ma - 1]}` : `${da}. ${MESECI[ma - 1].slice(0, 3)} – ${db}. ${MESECI[mb - 1].slice(0, 3)}`;
};

/* Radno vreme salona za dan (iz Podaci salona → Radno vreme), sa rezervom 9–20. */
const okvirDana = (podaci, datum, radnici) => {
    const rv = podaci.podaciSalona.radnoVreme?.[danUNedelji(datum)];
    let od = rv ? Number(rv[0].slice(0, 2)) * 60 : 9 * 60;
    let doM = rv ? Math.ceil(Number(rv[1].slice(0, 2)) + Number(rv[1].slice(3)) / 60) * 60 : 20 * 60;
    radnici.forEach((r) => { const s = podaci.smene[`${r.id}|${datum}`]; if (s) { od = Math.min(od, Math.floor(s.od / 60) * 60); doM = Math.max(doM, Math.ceil(s.do / 60) * 60); } });
    return { od, do: doM, zatvoreno: !rv };
};

/* ── Blok termina u dnevnom prikazu ── */
function Blok({ t, pocetak, indeks, mojId, onPomeri, onKlik }) {
    const r = indeks.radnik[t.radnikId];
    const ref = useRef(null);
    const vuci = useRef(null);
    const [pomak, setPomak] = useState(null);
    const visina = Math.max(22, t.trajanje * PX_MIN - 2);
    const kratko = visina < 44;
    const pomerljiv = t.status === 'potvrdjen' || t.status === 'zahtev';

    const dole = (e) => {
        if (e.button !== undefined && e.button !== 0) return;
        vuci.current = { x: e.clientX, y: e.clientY, aktivno: false, id: e.pointerId };
    };
    const pomeri = (e) => {
        const v = vuci.current;
        if (!v || !pomerljiv) return;
        const dx = e.clientX - v.x; const dy = e.clientY - v.y;
        if (!v.aktivno && Math.hypot(dx, dy) > 6) { v.aktivno = true; ref.current?.setPointerCapture?.(v.id); }
        if (v.aktivno) { e.preventDefault(); setPomak({ dx, dy: Math.round(dy / (KORAK * PX_MIN)) * KORAK * PX_MIN }); }
    };
    const gore = (e) => {
        const v = vuci.current; vuci.current = null;
        if (v?.aktivno) {
            const kolona = document.elementsFromPoint(e.clientX, e.clientY).find((el) => el.dataset?.radnik)?.dataset.radnik;
            const novoOd = t.od + Math.round((e.clientY - v.y) / (KORAK * PX_MIN)) * KORAK;
            setPomak(null);
            if (kolona && (kolona !== t.radnikId || novoOd !== t.od)) onPomeri(t, kolona, novoOd);
            return;
        }
        setPomak(null);
        onKlik(t);
    };

    return (
        <button ref={ref} type="button" onPointerDown={dole} onPointerMove={pomeri} onPointerUp={gore} onPointerCancel={() => { vuci.current = null; setPomak(null); }}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onKlik(t); } }}
            aria-label={`${uSate(t.od)} ${imeKlijenta(indeks.klijent[t.klijentId])}, ${naziviUsluga(t.usluge, indeks)}`}
            className={cx('absolute inset-x-1 z-[2] flex flex-col justify-start overflow-hidden rounded-lg border text-left text-[12px] leading-tight shadow-[0_1px_2px_rgb(0_0_0/.06)] transition-shadow hover:shadow-md',
                pomerljiv && 'cursor-grab touch-none active:cursor-grabbing',
                t.status === 'zahtev' ? 'border-dashed border-p-upoz/70 bg-p-upozbg' : t.status === 'zavrsen' ? 'border-p-ivica bg-p-meko' : t.status === 'nije-dosao' ? 'border-p-greska/40 bg-p-greskabg' : t.status === 'otkazan' ? 'border-p-ivica bg-p-karta opacity-50' : 'border-p-ivica bg-p-karta',
                mojId && t.radnikId !== mojId && 'opacity-60',
                pomak && 'z-20 opacity-90 shadow-xl ring-2 ring-p-akc')}
            style={{ top: (t.od - pocetak) * PX_MIN + 1, height: visina, transform: pomak ? `translate(${pomak.dx}px, ${pomak.dy}px)` : undefined }}>
            <span className="absolute inset-y-0 left-0 w-[3px]" style={{ background: r?.boja }} aria-hidden="true" />
            <span className={cx('block pl-2.5 pr-1.5', kratko ? 'py-0.5' : 'py-1.5')}>
                <span className={cx('flex items-center gap-1 font-semibold text-p-ink', kratko && 'truncate')}>
                    <span className="tabularno">{uSate(pomak ? t.od + Math.round(pomak.dy / PX_MIN) : t.od)}</span>
                    {kratko && <span className="truncate font-medium"> {imeKlijenta(indeks.klijent[t.klijentId])}</span>}
                    {t.status === 'zavrsen' && <Check className="ml-auto h-3.5 w-3.5 shrink-0 text-p-ok" aria-label="naplaćeno" />}
                </span>
                {!kratko && <span className="mt-0.5 block truncate font-medium text-p-ink">{imeKlijenta(indeks.klijent[t.klijentId])}</span>}
                {visina > 60 && <span className="mt-0.5 block truncate text-p-tiho">{naziviUsluga(t.usluge, indeks)}</span>}
                {visina > 86 && t.status === 'zahtev' && <span className="mt-1 inline-block rounded bg-p-karta/70 px-1 text-[11px] font-medium text-p-upoz">čeka odobrenje</span>}
            </span>
        </button>
    );
}

/* ── Dnevni prikaz ── */
function DanPrikaz({ datum, radnici, prikaziOtkazane }) {
    const { podaci, izmeni, obavesti, zapisi } = usePanel();
    const indeks = useIndeksi();
    const { otvoriNovi, otvoriDetalj } = useTermini();
    const { samoSvoje, radnikId: mojId } = useDozvole();
    const okvir = okvirDana(podaci, datum, radnici);
    const visina = (okvir.do - okvir.od) * PX_MIN;
    const sati = Array.from({ length: (okvir.do - okvir.od) / 60 }, (_, i) => okvir.od + i * 60);
    const jeDanas = datum === danasF();
    const [sada, setSada] = useState(sadaMinut());
    useEffect(() => { const t = setInterval(() => setSada(sadaMinut()), 60000); return () => clearInterval(t); }, []);
    const skrol = useRef(null);
    useEffect(() => { // na otvaranju: danas skroluj do sadašnjeg vremena
        if (skrol.current && jeDanas) skrol.current.scrollTop = Math.max(0, (sada - okvir.od - 60) * PX_MIN);
    }, [datum]); // eslint-disable-line react-hooks/exhaustive-deps

    const termini = podaci.termini.filter((t) => t.datum === datum && (prikaziOtkazane || t.status !== 'otkazan'));

    const pomeriTermin = (t, radnikId, od) => {
        if (samoSvoje && (t.radnikId !== mojId || radnikId !== mojId)) { obavesti('Možete pomerati samo svoje termine.', 'greska'); return; }
        const r = indeks.radnik[radnikId];
        if (!t.usluge.every((u) => r?.usluge.includes(u))) { obavesti(`${r?.ime} ne radi ovu uslugu.`, 'greska'); return; }
        const s = podaci.smene[`${radnikId}|${datum}`];
        if (!s || od < s.od || od + t.trajanje > s.do) { obavesti(`Van smene: ${r?.ime} ${s ? `radi ${uSate(s.od)}–${uSate(s.do)}` : 'tog dana ne radi'}.`, 'greska'); return; }
        const sudar = preklapanje(podaci.termini, { datum, od, trajanje: t.trajanje, radnikId, id: t.id });
        if (sudar) { obavesti(`Zauzeto: ${uSate(sudar.od)} — ${imeKlijenta(indeks.klijent[sudar.klijentId])}.`, 'greska'); return; }
        izmeni('termini', t.id, { radnikId, od });
        zapisi('termin', 'Pomerio termin', `${imeKlijenta(indeks.klijent[t.klijentId])} → ${uSate(od)}, ${r?.ime}`);
        obavesti(`Termin pomeren na ${uSate(od)}${radnikId !== t.radnikId ? ` kod ${r?.ime.split(' ')[0]}` : ''} — klijent dobija SMS.`);
    };

    const klikPolje = (e, r) => {
        if (e.target !== e.currentTarget) return;
        const y = e.nativeEvent.offsetY;
        const od = okvir.od + Math.floor(y / PX_MIN / KORAK) * KORAK;
        if (samoSvoje && r.id !== mojId) return;
        otvoriNovi({ datum, od, radnikId: r.id });
    };

    if (!radnici.length) return <Prazno naslov="Nijedan radnik nije izabran" opis="Uključite bar jednog radnika iznad kalendara." />;

    return (
        <div ref={skrol} className="max-h-[calc(100svh-260px)] min-h-[420px] overflow-auto rounded-2xl border border-p-ivica bg-p-karta p-skrol">
            <div className="relative grid" style={{ gridTemplateColumns: `56px repeat(${radnici.length}, minmax(150px, 1fr))`, minWidth: 56 + radnici.length * 150 }}>
                {/* Zaglavlja kolona */}
                <div className="sticky left-0 top-0 z-[6] border-b border-p-ivica bg-p-karta" />
                {radnici.map((r) => {
                    const s = podaci.smene[`${r.id}|${datum}`];
                    const n = termini.filter((t) => t.radnikId === r.id && AKTIVNI.has(t.status));
                    return (
                        <div key={r.id} className={cx('sticky top-0 z-[5] flex items-center gap-2.5 border-b border-l border-p-ivica bg-p-karta px-3 py-2.5', samoSvoje && r.id === mojId && 'bg-p-staza')}>
                            <Avatar ime={r.ime} slika={r.slika} boja={r.boja} velicina={30} />
                            <div className="min-w-0">
                                <div className="truncate text-[13px] font-semibold">{r.ime}</div>
                                <div className="text-[11.5px] text-p-tiho tabularno">{s ? `${uSate(s.od)}–${uSate(s.do)} · ${termina(n.length)}` : 'ne radi'}</div>
                            </div>
                        </div>
                    );
                })}

                {/* Osa vremena */}
                <div className="sticky left-0 z-[4] border-r border-p-ivica bg-p-karta" style={{ height: visina }}>
                    {sati.map((h) => <div key={h} className="absolute right-2 -translate-y-1/2 text-[11px] text-p-tiho tabularno" style={{ top: (h - okvir.od) * PX_MIN }}>{h > okvir.od ? uSate(h) : ''}</div>)}
                    {jeDanas && sada >= okvir.od && sada <= okvir.do && <div className="absolute right-0 z-[5] -translate-y-1/2 rounded-l bg-p-greska px-1 text-[10.5px] font-semibold text-white tabularno" style={{ top: (sada - okvir.od) * PX_MIN }}>{uSate(sada)}</div>}
                </div>

                {/* Kolone radnika */}
                {radnici.map((r) => {
                    const s = podaci.smene[`${r.id}|${datum}`];
                    return (
                        <div key={r.id} data-radnik={r.id} onClick={(e) => klikPolje(e, r)} className="relative cursor-copy border-l border-p-ivica" style={{ height: visina, backgroundImage: `repeating-linear-gradient(to bottom, rgb(var(--p-ivica)) 0 1px, transparent 1px ${PX_SAT}px), repeating-linear-gradient(to bottom, rgb(var(--p-ivica) / .45) 0 1px, transparent 1px ${PX_SAT / 2}px)` }}>
                            {/* van smene */}
                            {(!s ? [[okvir.od, okvir.do]] : [[okvir.od, s.od], [s.do, okvir.do]]).filter(([a, b]) => b > a).map(([a, b]) => (
                                <div key={a} className="pointer-events-none absolute inset-x-0 bg-[repeating-linear-gradient(135deg,rgb(var(--p-meko))_0_6px,transparent_6px_12px)]" style={{ top: (a - okvir.od) * PX_MIN, height: (b - a) * PX_MIN }} aria-hidden="true" />
                            ))}
                            {jeDanas && sada >= okvir.od && sada <= okvir.do && <div className="pointer-events-none absolute inset-x-0 z-[3] h-[2px] bg-p-greska/80" style={{ top: (sada - okvir.od) * PX_MIN }} aria-hidden="true" />}
                            {termini.filter((t) => t.radnikId === r.id).map((t) => (
                                <Blok key={t.id} t={t} pocetak={okvir.od} indeks={indeks} mojId={samoSvoje ? mojId : null} onKlik={(x) => otvoriDetalj(x.id)} onPomeri={pomeriTermin} />
                            ))}
                        </div>
                    );
                })}

            </div>
        </div>
    );
}

/* ── Nedeljni prikaz ── */
function NedeljaPrikaz({ datum, radnici, onDan, prikaziOtkazane }) {
    const { podaci } = usePanel();
    const indeks = useIndeksi();
    const { otvoriDetalj } = useTermini();
    const { novac } = useDozvole();
    const dani = opsegNedelje(datum);
    const ids = new Set(radnici.map((r) => r.id));
    return (
        <div className="overflow-x-auto rounded-2xl border border-p-ivica bg-p-karta p-skrol">
            <div className="grid min-w-[980px] grid-cols-7 divide-x divide-p-ivica">
                {dani.map((d) => {
                    const lista = podaci.termini.filter((t) => t.datum === d && ids.has(t.radnikId) && (prikaziOtkazane || t.status !== 'otkazan')).sort((a, b) => a.od - b.od);
                    const aktivni = lista.filter((t) => AKTIVNI.has(t.status));
                    const zatvoreno = !podaci.podaciSalona.radnoVreme?.[danUNedelji(d)];
                    return (
                        <div key={d} className={cx('min-w-0', d === danasF() && 'bg-p-staza/40')}>
                            <button type="button" onClick={() => onDan(d)} className="sticky top-0 block w-full border-b border-p-ivica px-3 py-2.5 text-left hover:bg-p-meko/60">
                                <div className="text-[11.5px] font-semibold uppercase tracking-[.06em] text-p-tiho">{DANI_KRATKO[danUNedelji(d)]}</div>
                                <div className="flex items-baseline justify-between"><span className={cx('text-lg font-semibold tabularno', d === danasF() && 'text-p-akc')}>{Number(d.slice(8))}</span><span className="text-[11.5px] text-p-tiho">{zatvoreno ? 'zatvoreno' : termina(aktivni.length)}</span></div>
                                {novac && !zatvoreno && <div className="text-[11.5px] text-p-tiho tabularno">{rsd(zbir(aktivni))}</div>}
                            </button>
                            <ul className="space-y-1 p-1.5">
                                {lista.map((t) => {
                                    const r = indeks.radnik[t.radnikId];
                                    return (
                                        <li key={t.id}>
                                            <button type="button" onClick={() => otvoriDetalj(t.id)} className={cx('relative w-full overflow-hidden rounded-md border py-1 pl-2.5 pr-1.5 text-left text-[11.5px] leading-tight hover:shadow-sm', t.status === 'zahtev' ? 'border-dashed border-p-upoz/70 bg-p-upozbg' : t.status === 'otkazan' ? 'border-p-ivica opacity-50' : t.status === 'zavrsen' ? 'border-p-ivica bg-p-meko' : 'border-p-ivica bg-p-karta')}>
                                                <span className="absolute inset-y-0 left-0 w-[3px]" style={{ background: r?.boja }} aria-hidden="true" />
                                                <span className="font-semibold tabularno">{uSate(t.od)}</span> <span className="text-p-ink">{imeKlijenta(indeks.klijent[t.klijentId])}</span>
                                                <span className="block truncate text-p-tiho">{naziviUsluga(t.usluge, indeks)}</span>
                                            </button>
                                        </li>
                                    );
                                })}
                                {!lista.length && <li className="px-1 py-3 text-center text-[12px] text-p-tiho">—</li>}
                            </ul>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

/* ── Lista (narednih 14 dana) ── */
function ListaPrikaz({ datum, radnici }) {
    const { podaci } = usePanel();
    const ids = new Set(radnici.map((r) => r.id));
    const dani = Array.from({ length: 14 }, (_, i) => dodajDane(datum, i));
    const grupe = dani.map((d) => ({ d, lista: podaci.termini.filter((t) => t.datum === d && ids.has(t.radnikId) && AKTIVNI.has(t.status)).sort((a, b) => a.od - b.od) })).filter((g) => g.lista.length);
    if (!grupe.length) return <Kartica><Prazno naslov="Nema zakazanih termina" opis="U naredne dve nedelje nema termina za izabrane radnike." /></Kartica>;
    return (
        <div className="space-y-4">
            {grupe.map(({ d, lista }) => (
                <Kartica key={d} naslov={datumSaDanomDugo(d)} opis={termina(lista.length)} telo="p-2">
                    <ul>{lista.map((t) => <li key={t.id}><RedTermina t={t} /></li>)}</ul>
                </Kartica>
            ))}
        </div>
    );
}

export default function Kalendar() {
    const { podaci } = usePanel();
    const { otvoriNovi } = useTermini();
    const { samoSvoje, radnikId: mojId } = useDozvole();
    const [datum, setDatum] = useState(danasF());
    const [prikaz, setPrikaz] = useState('dan');
    const [iskljuceni, setIskljuceni] = useState(() => new Set());
    const [otkazani, setOtkazani] = useState(false);

    const radniciDana = useMemo(() => {
        const svi = podaci.radnici.filter((r) => r.aktivan && !iskljuceni.has(r.id));
        if (prikaz !== 'dan') return svi;
        const rade = svi.filter((r) => podaci.smene[`${r.id}|${datum}`] || podaci.termini.some((t) => t.datum === datum && t.radnikId === r.id && AKTIVNI.has(t.status)));
        const lista = rade.length ? rade : svi;
        // zaposleni: svoja kolona prva
        return samoSvoje ? [...lista].sort((a, b) => (a.id === mojId ? -1 : b.id === mojId ? 1 : 0)) : lista;
    }, [podaci.radnici, podaci.smene, podaci.termini, iskljuceni, prikaz, datum, samoSvoje, mojId]);

    const korak = prikaz === 'dan' ? 1 : prikaz === 'nedelja' ? 7 : 14;
    const naslov = prikaz === 'nedelja' ? nazivNedelje(datum) : prikaz === 'lista' ? `Od ${datumKratko(datum)}, 14 dana` : datumSaDanomDugo(datum);
    const danTermini = podaci.termini.filter((t) => t.datum === datum && AKTIVNI.has(t.status));
    const zahtevaDanas = danTermini.filter((t) => t.status === 'zahtev').length;

    return (
        <div className="flex flex-col gap-4">
            <ZaglavljeStrane naslov={samoSvoje ? 'Moji termini' : 'Kalendar'} opis="Klik na prazno polje zakazuje, klik na termin otvara detalje. Termin se prevlači na drugo vreme ili drugog radnika."
                akcije={<Dugme varijanta="glavno" ikona={CalendarPlus} onClick={() => otvoriNovi({ datum, radnikId: samoSvoje ? mojId : undefined })}>Novi termin</Dugme>} />

            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center rounded-[10px] border border-p-ivica bg-p-karta">
                        <Dugme varijanta="tiho" velicina="ikona" ikona={ChevronLeft} aria-label="Prethodno" onClick={() => setDatum(dodajDane(datum, -korak))} />
                        <Dugme varijanta="tiho" velicina="sm" onClick={() => setDatum(danasF())} className="h-9">Danas</Dugme>
                        <Dugme varijanta="tiho" velicina="ikona" ikona={ChevronRight} aria-label="Sledeće" onClick={() => setDatum(dodajDane(datum, korak))} />
                    </div>
                    <h2 className="min-w-0 text-[17px] font-semibold first-letter:uppercase">{naslov}</h2>
                    <Unos type="date" value={datum} onChange={(e) => e.target.value && setDatum(e.target.value)} className="!w-auto !py-1.5" aria-label="Izaberi datum" />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <Tabovi stavke={[{ id: 'dan', naziv: 'Dan' }, { id: 'nedelja', naziv: 'Nedelja' }, { id: 'lista', naziv: 'Lista' }]} aktivan={prikaz} onChange={setPrikaz} />
                    <Dugme varijanta="tiho" velicina="sm" ikona={otkazani ? EyeOff : Eye} onClick={() => setOtkazani((o) => !o)} aria-pressed={otkazani}>{otkazani ? 'Sakrij otkazane' : 'Prikaži otkazane'}</Dugme>
                </div>
            </div>

            {/* Radnici: filter i legenda */}
            <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Radnici">
                {podaci.radnici.filter((r) => r.aktivan).map((r) => {
                    const ukljucen = !iskljuceni.has(r.id);
                    return (
                        <button key={r.id} type="button" aria-pressed={ukljucen} onClick={() => setIskljuceni((s) => { const n = new Set(s); n.has(r.id) ? n.delete(r.id) : n.add(r.id); return n; })}
                            className={cx('inline-flex items-center gap-2 rounded-full border py-1 pl-1 pr-3 text-[13px] transition-colors', ukljucen ? 'border-p-ivica bg-p-karta' : 'border-dashed border-p-ivica text-p-tiho opacity-60')}>
                            <span className="h-6 w-6 rounded-full" style={{ background: r.boja, opacity: ukljucen ? 1 : 0.35 }} aria-hidden="true" />
                            {r.ime.split(' ')[0]}{samoSvoje && r.id === mojId ? ' (vi)' : ''}
                        </button>
                    );
                })}
                {prikaz === 'dan' && (
                    <span className="ml-auto text-[13px] text-p-tiho">
                        {termina(danTermini.length)}{zahtevaDanas ? ` · ${zahtevaDanas} čeka odobrenje` : ''}
                    </span>
                )}
            </div>

            {prikaz === 'dan' && <DanPrikaz datum={datum} radnici={radniciDana} prikaziOtkazane={otkazani} />}
            {prikaz === 'nedelja' && <NedeljaPrikaz datum={datum} radnici={radniciDana} prikaziOtkazane={otkazani} onDan={(d) => { setDatum(d); setPrikaz('dan'); }} />}
            {prikaz === 'lista' && <ListaPrikaz datum={datum} radnici={radniciDana} />}

            <div className="flex flex-wrap gap-x-5 gap-y-2 text-[12px] text-p-tiho" aria-label="Legenda">
                <span className="inline-flex items-center gap-1.5"><span className="h-3 w-5 rounded border border-p-ivica bg-p-karta" />Potvrđen</span>
                <span className="inline-flex items-center gap-1.5"><span className="h-3 w-5 rounded border border-dashed border-p-upoz/70 bg-p-upozbg" />Čeka odobrenje</span>
                <span className="inline-flex items-center gap-1.5"><span className="h-3 w-5 rounded border border-p-ivica bg-p-meko" />Naplaćen</span>
                <span className="inline-flex items-center gap-1.5"><span className="h-3 w-5 rounded border border-p-greska/40 bg-p-greskabg" />Nije došao</span>
                <span className="inline-flex items-center gap-1.5"><span className="h-3 w-5 rounded bg-[repeating-linear-gradient(135deg,rgb(var(--p-meko))_0_4px,transparent_4px_8px)] ring-1 ring-p-ivica" />Van smene</span>
            </div>
        </div>
    );
}
