/*
 * RASPORED SMENA — nedelja po radniku, kao AllSeasons „Raspored”.
 * Ćelija = smena (sa popunjenošću), odobreno odsustvo ili slobodan dan.
 * Administrator i menadžer menjaju smene (klik na ćeliju, šabloni po redu,
 * kopiranje prethodne nedelje); ostali vide raspored samo za čitanje.
 */
import React, { useCallback, useMemo, useState } from 'react';
import { AlertTriangle, CalendarClock, ChevronLeft, ChevronRight, Clock, Copy, Gauge, Sunrise, Sunset, Umbrella, Users } from 'lucide-react';
import { usePanel, useDozvole, useIndeksi } from '../podaci/Skladiste.jsx';
import { AKTIVNI, zauzetostDana } from '../podaci/analitika.js';
import { DANI_KRATKO, MESECI, danUNedelji, danas as danasF, datumSaDanom, datumSaDanomDugo, dodajDane, mnozina, opsegDana, pocetakMeseca, pocetakNedelje, procenat, uSate } from '../format.js';
import { radnoVremeDana } from '../../lib/vreme.js';
import { Avatar, Dugme, Izbor, Kartica, Merac, Modal, MrezaPlocica, Polje, Prazno, StatPlocica, ZaglavljeStrane, Znacka, cx } from '../ui.jsx';

const VRSTE = { godisnji: { naziv: 'Godišnji', ton: 'info' }, bolovanje: { naziv: 'Bolovanje', ton: 'greska' }, slobodan: { naziv: 'Slobodan', ton: 'akc' } };
const DUZINA_SMENE = 8 * 60;

const sati = (min) => `${(min / 60).toFixed(1).replace('.0', '').replace('.', ',')} h`;
const delovi = (iso) => iso.split('-').map(Number);
const oznakaNedelje = (od, doD, danas) => {
    const [g1, m1, d1] = delovi(od);
    const [g2, m2, d2] = delovi(doD);
    const god = g2 !== Number(danas.slice(0, 4)) ? ` ${g2}.` : '';
    return m1 === m2 ? `${d1}–${d2}. ${MESECI[m2 - 1]}${god}` : `${d1}. ${MESECI[m1 - 1]} – ${d2}. ${MESECI[m2 - 1]}${god}`;
};
const krajMeseca = (iso) => { const [g, m] = delovi(iso); return `${iso.slice(0, 8)}${String(new Date(Date.UTC(g, m, 0)).getUTCDate()).padStart(2, '0')}`; };
const termina = (n) => `${n} ${mnozina(n, 'termin', 'termina', 'termina')}`;

/** Termini radnika tog dana koji ne staju u smenu (ili svi, kad smene nema). */
const vanSmene = (termini, radnikId, datum, smena) => termini.filter((t) => t.radnikId === radnikId && t.datum === datum && AKTIVNI.has(t.status) && (!smena || t.od < smena.od || t.od + t.trajanje > smena.do)).length;

const odsustvoNaDan = (odsustva, radnikId, datum, status = 'odobreno') => odsustva.find((o) => o.radnikId === radnikId && o.status === status && datum >= o.od && datum <= o.do) ?? null;

/** Šablon smene u okviru radnog vremena salona. */
const sablon = (vrsta, [o, z]) => (vrsta === 'prepodne' ? { od: o, do: Math.min(z, o + DUZINA_SMENE) } : { od: Math.max(o, z - DUZINA_SMENE), do: z });

/* ── Modal: smena jednog radnika za jedan dan ── */
function UrediSmenu({ cilj, onClose }) {
    const { podaci, postavi, obavesti, zapisi } = usePanel();
    const indeks = useIndeksi();
    const { radnikId, datum } = cilj;
    const r = indeks.radnik[radnikId];
    const rv = radnoVremeDana(datum, podaci.podaciSalona);
    const kljuc = `${radnikId}|${datum}`;
    const postojeca = podaci.smene[kljuc];
    const [o, z] = rv;
    const [od, setOd] = useState(postojeca?.od ?? o);
    const [doM, setDo] = useState(postojeca?.do ?? Math.min(z, o + DUZINA_SMENE));
    const koraci = useMemo(() => { const x = []; for (let m = o; m <= z; m += 30) x.push(m); return x; }, [o, z]);
    const ispravno = doM > od;
    const van = ispravno ? vanSmene(podaci.termini, radnikId, datum, { od, do: doM }) : 0;
    const svi = vanSmene(podaci.termini, radnikId, datum, null);
    const odsustvo = odsustvoNaDan(podaci.odsustva, radnikId, datum);
    const opis = `${r?.ime} · ${datumSaDanom(datum)}`;

    const sacuvaj = () => {
        postavi('smene', (s) => ({ ...s, [kljuc]: { od, do: doM } }));
        zapisi('raspored', 'Izmenio smenu', `${opis}: ${uSate(od)}–${uSate(doM)}`);
        obavesti(van ? `Smena sačuvana — ${termina(van)} van smene treba prebaciti.` : 'Smena je sačuvana.', van ? 'upoz' : 'ok');
        onClose();
    };
    const slobodan = () => {
        postavi('smene', (s) => { const n = { ...s }; delete n[kljuc]; return n; });
        zapisi('raspored', 'Slobodan dan', opis);
        obavesti(svi ? `Slobodan dan upisan — ${termina(svi)} treba prebaciti.` : 'Slobodan dan je upisan.', svi ? 'upoz' : 'ok');
        onClose();
    };
    const brzo = (vrsta) => { const s = vrsta === 'ceo' ? { od: o, do: z } : sablon(vrsta, rv); setOd(s.od); setDo(s.do); };

    return (
        <Modal otvoren onClose={onClose} naslov="Smena" opis={`${r?.ime} · ${datumSaDanomDugo(datum)} · salon radi ${uSate(o)}–${uSate(z)}`}
            podnozje={(
                <>
                    <Dugme varijanta="opasnoTiho" className="mr-auto" onClick={slobodan}>Slobodan dan</Dugme>
                    <Dugme onClick={onClose}>Otkaži</Dugme>
                    <Dugme varijanta="glavno" onClick={sacuvaj} disabled={!ispravno}>Sačuvaj</Dugme>
                </>
            )}>
            <div className="space-y-4">
                {odsustvo && (
                    <div className="flex items-start gap-2 rounded-xl bg-p-infobg px-3 py-2.5 text-[13px] text-p-info">
                        <Umbrella className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                        Ovog dana je odobreno odsustvo ({VRSTE[odsustvo.vrsta]?.naziv.toLowerCase()}). Smena će važiti tek ako se odsustvo povuče.
                    </div>
                )}
                <div className="flex flex-wrap gap-2">
                    <Dugme velicina="sm" ikona={Sunrise} onClick={() => brzo('prepodne')}>Prepodne</Dugme>
                    <Dugme velicina="sm" ikona={Sunset} onClick={() => brzo('popodne')}>Popodne</Dugme>
                    <Dugme velicina="sm" ikona={Clock} onClick={() => brzo('ceo')}>Ceo dan</Dugme>
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <Polje oznaka="Od">
                        <Izbor value={od} onChange={(e) => { const v = Number(e.target.value); setOd(v); if (doM <= v) setDo(Math.min(z, v + 30)); }}>
                            {koraci.slice(0, -1).map((m) => <option key={m} value={m}>{uSate(m)}</option>)}
                        </Izbor>
                    </Polje>
                    <Polje oznaka="Do">
                        <Izbor value={doM} onChange={(e) => setDo(Number(e.target.value))}>
                            {koraci.filter((m) => m > od).map((m) => <option key={m} value={m}>{uSate(m)}</option>)}
                        </Izbor>
                    </Polje>
                </div>
                <div className="flex items-center justify-between rounded-xl bg-p-meko/70 px-3 py-2.5 text-[13px]">
                    <span className="text-p-tiho">Trajanje smene</span>
                    <span className="font-semibold tabularno">{ispravno ? sati(doM - od) : '—'}</span>
                </div>
                {van > 0 && (
                    <div className="flex items-start gap-2 rounded-xl bg-p-upozbg px-3 py-2.5 text-[13px] text-p-upoz">
                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                        <span><b>{termina(van)}</b> {mnozina(van, 'ostaje', 'ostaju', 'ostaje')} van nove smene — treba ih prebaciti ili dodeliti drugom radniku.</span>
                    </div>
                )}
                {svi > 0 && <p className="text-[12.5px] text-p-tiho">Ovog dana {r?.ime.split(' ')[0]} ima {termina(svi)}. Slobodan dan ih ostavlja bez radnika.</p>}
            </div>
        </Modal>
    );
}

/* ── Modal: kopiranje prethodne nedelje ── */
function KopirajNedelju({ dani, onClose }) {
    const { podaci, postavi, obavesti, zapisi } = usePanel();
    const plan = useMemo(() => {
        const nove = {};
        let smena = 0; let sukob = 0;
        for (const r of podaci.radnici) for (const d of dani) {
            const k = `${r.id}|${d}`;
            const pre = podaci.smene[`${r.id}|${dodajDane(d, -7)}`];
            const rv = radnoVremeDana(d, podaci.podaciSalona);
            const s = pre && rv && !odsustvoNaDan(podaci.odsustva, r.id, d) ? { od: Math.max(pre.od, rv[0]), do: Math.min(pre.do, rv[1]) } : null;
            nove[k] = s && s.do > s.od ? s : null;
            if (nove[k]) smena += 1;
            sukob += vanSmene(podaci.termini, r.id, d, nove[k]);
        }
        return { nove, smena, sukob };
    }, [podaci, dani]);
    const potvrdi = () => {
        postavi('smene', (s) => {
            const n = { ...s };
            for (const [k, v] of Object.entries(plan.nove)) { if (v) n[k] = v; else delete n[k]; }
            return n;
        });
        zapisi('raspored', 'Kopirao prethodnu nedelju', `${datumSaDanom(dani[0])} – ${datumSaDanom(dani[6])}`);
        obavesti(plan.sukob ? `Raspored kopiran — ${termina(plan.sukob)} van smena.` : 'Raspored prethodne nedelje je kopiran.', plan.sukob ? 'upoz' : 'ok');
        onClose();
    };
    return (
        <Modal otvoren onClose={onClose} naslov="Kopiraj prethodnu nedelju" opis={`${datumSaDanom(dodajDane(dani[0], -7))} – ${datumSaDanom(dodajDane(dani[6], -7))} → ova nedelja`}
            podnozje={<><Dugme onClick={onClose}>Otkaži</Dugme><Dugme varijanta="glavno" ikona={Copy} onClick={potvrdi}>Kopiraj</Dugme></>}>
            <div className="space-y-3 text-sm">
                <p>Smene ove nedelje biće zamenjene smenama iz prethodne: <b className="tabularno">{plan.smena} {mnozina(plan.smena, 'smena', 'smene', 'smena')}</b>.</p>
                <p className="text-[13px] text-p-tiho">Dani sa odobrenim odsustvom i dani kad salon ne radi ostaju slobodni.</p>
                {plan.sukob > 0 && (
                    <div className="flex items-start gap-2 rounded-xl bg-p-upozbg px-3 py-2.5 text-[13px] text-p-upoz">
                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                        <span><b>{termina(plan.sukob)}</b> ove nedelje ne bi stalo u nove smene.</span>
                    </div>
                )}
            </div>
        </Modal>
    );
}

/* ── Ćelija mreže ── */
function Celija({ r, d, podaci, rv, danasD, mojRed, moze, onKlik }) {
    const s = podaci.smene[`${r.id}|${d}`];
    const ods = odsustvoNaDan(podaci.odsustva, r.id, d);
    const ceka = !ods && odsustvoNaDan(podaci.odsustva, r.id, d, 'na-cekanju');
    const osnova = cx('relative flex min-h-[68px] w-full min-w-0 flex-col justify-center gap-1.5 rounded-xl px-2.5 py-2 text-left', d === danasD && 'ring-1 ring-p-akc/30');
    if (!rv) return <div className={cx(osnova, 'items-center bg-p-meko/80 text-[12px] text-p-tiho')}>Ne radi</div>;
    const z = s ? zauzetostDana(podaci, d, r.id) ?? 0 : null;
    const sadrzaj = ods ? (
        <Znacka ton={VRSTE[ods.vrsta]?.ton ?? 'tiho'}>{VRSTE[ods.vrsta]?.naziv ?? ods.vrsta}</Znacka>
    ) : s ? (
        <>
            <span className={cx('inline-flex w-fit whitespace-nowrap rounded-lg px-2 py-0.5 text-[12.5px] font-semibold tabularno', mojRed ? 'bg-p-akc text-p-naakc' : 'bg-p-staza text-p-akc')}>{uSate(s.od)}–{uSate(s.do)}</span>
            <span className="flex items-center gap-1.5">
                <Merac vrednost={z} oznaka={`Popunjenost ${r.ime}, ${datumSaDanom(d)}`} />
                <span className="w-8 shrink-0 text-right text-[11px] text-p-tiho tabularno">{procenat(z)}</span>
            </span>
        </>
    ) : <span className="text-[12.5px] text-p-tiho">Slobodan</span>;
    const dodatak = ceka && <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-p-upoz" title="Zahtev za odsustvo čeka odobrenje" aria-label="Zahtev za odsustvo čeka odobrenje" />;
    const pozadina = s && !ods ? 'bg-p-karta border border-p-ivica' : 'border border-dashed border-p-ivica bg-transparent';
    if (!moze) return <div className={cx(osnova, pozadina)}>{sadrzaj}{dodatak}</div>;
    return (
        <button type="button" onClick={onKlik} className={cx(osnova, pozadina, 'transition-colors hover:border-p-akc/60 hover:bg-p-meko/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-p-akc')}
            aria-label={`${r.ime}, ${datumSaDanom(d)}: ${s ? `${uSate(s.od)}–${uSate(s.do)}` : 'slobodan'} — izmeni`}>
            {sadrzaj}{dodatak}
        </button>
    );
}

/* ── Moje smene (zaposleni) ── */
function MojeSmene({ radnikId }) {
    const { podaci } = usePanel();
    const d = danasF();
    const dani = opsegDana(pocetakMeseca(d), krajMeseca(d));
    const stavke = dani.map((x) => ({ d: x, s: podaci.smene[`${radnikId}|${x}`], o: odsustvoNaDan(podaci.odsustva, radnikId, x), t: vanSmene(podaci.termini, radnikId, x, null) })).filter((x) => x.s || x.o);
    const ukupno = stavke.reduce((a, x) => a + (x.s && !x.o ? x.s.do - x.s.od : 0), 0);
    return (
        <Kartica naslov="Moje smene ovog meseca" opis={`${MESECI[Number(d.slice(5, 7)) - 1]} · ${stavke.filter((x) => x.s && !x.o).length} smena · ${sati(ukupno)}`} telo="p-2">
            {stavke.length ? (
                <ul className="divide-y divide-p-ivica/60">
                    {stavke.map(({ d: x, s, o, t }) => (
                        <li key={x} className={cx('flex items-center gap-3 px-3 py-2.5', x < d && 'opacity-55')}>
                            <span className={cx('w-24 shrink-0 text-[13px] font-medium sm:w-32', x === d && 'text-p-akc')}>{x === d ? 'Danas' : datumSaDanom(x)}</span>
                            {o ? <Znacka ton={VRSTE[o.vrsta]?.ton}>{VRSTE[o.vrsta]?.naziv}</Znacka> : <span className="text-sm font-semibold tabularno">{uSate(s.od)}–{uSate(s.do)}</span>}
                            <span className="ml-auto text-right text-[12.5px] text-p-tiho tabularno">{o ? '' : `${sati(s.do - s.od)} · ${termina(t)}`}</span>
                        </li>
                    ))}
                </ul>
            ) : <Prazno ikona={CalendarClock} naslov="Nema smena ovog meseca" />}
        </Kartica>
    );
}

export default function Raspored() {
    const { podaci, postavi, obavesti, zapisi } = usePanel();
    const { menjaRaspored, samoSvoje, radnikId } = useDozvole();
    const danasD = danasF();
    const [pocetak, setPocetak] = useState(() => pocetakNedelje(danasD));
    const [uredi, setUredi] = useState(null);
    const [kopiraj, setKopiraj] = useState(false);
    const zatvoriUredi = useCallback(() => setUredi(null), []);
    const zatvoriKopiraj = useCallback(() => setKopiraj(false), []);

    const dani = useMemo(() => opsegDana(pocetak, dodajDane(pocetak, 6)), [pocetak]);
    const rv = useMemo(() => Object.fromEntries(dani.map((d) => [d, radnoVremeDana(d, podaci.podaciSalona)])), [dani, podaci.podaciSalona]);
    const neradni = useMemo(() => Object.fromEntries((podaci.podaciSalona.neradniDani ?? []).map((n) => [n.datum, n.opis])), [podaci.podaciSalona]);
    const radnici = useMemo(() => {
        const svi = podaci.radnici.filter((r) => r.aktivan !== false);
        return samoSvoje ? [...svi].sort((a, b) => (b.id === radnikId) - (a.id === radnikId)) : svi;
    }, [podaci.radnici, samoSvoje, radnikId]);

    const smenaRadi = (r, d) => { const s = podaci.smene[`${r.id}|${d}`]; return s && rv[d] && !odsustvoNaDan(podaci.odsustva, r.id, d) ? s : null; };
    const satiNedelje = (r) => dani.reduce((a, d) => { const s = smenaRadi(r, d); return a + (s ? s.do - s.od : 0); }, 0);
    const poDanu = dani.map((d) => { const rad = radnici.map((r) => smenaRadi(r, d)).filter(Boolean); return { d, broj: rad.length, min: rad.reduce((a, s) => a + s.do - s.od, 0) }; });

    const brojke = useMemo(() => {
        const ja = samoSvoje ? radnici.filter((r) => r.id === radnikId) : radnici;
        let smena = 0; let min = 0; let zbirZ = 0; let odsutno = 0;
        for (const r of ja) for (const d of dani) {
            const s = podaci.smene[`${r.id}|${d}`];
            if (odsustvoNaDan(podaci.odsustva, r.id, d) && rv[d]) { odsutno += 1; continue; }
            if (!s || !rv[d]) continue;
            smena += 1; min += s.do - s.od; zbirZ += zauzetostDana(podaci, d, r.id) ?? 0;
        }
        return { smena, min, popunjenost: smena ? zbirZ / smena : 0, odsutno };
    }, [podaci, dani, rv, radnici, samoSvoje, radnikId]);

    const primeniSablon = (r, vrsta) => {
        const radniDani = dani.filter((d) => rv[d] && !odsustvoNaDan(podaci.odsustva, r.id, d));
        const sa = radniDani.filter((d) => podaci.smene[`${r.id}|${d}`]);
        const cilj = sa.length ? sa : radniDani.filter((d) => danUNedelji(d) !== 'ned');
        if (!cilj.length) { obavesti('Ove nedelje nema dana za smenu.', 'upoz'); return; }
        const nove = Object.fromEntries(cilj.map((d) => [`${r.id}|${d}`, sablon(vrsta, rv[d])]));
        const sukob = cilj.reduce((a, d) => a + vanSmene(podaci.termini, r.id, d, nove[`${r.id}|${d}`]), 0);
        postavi('smene', (s) => ({ ...s, ...nove }));
        const naziv = vrsta === 'prepodne' ? 'prepodne' : 'popodne';
        zapisi('raspored', `Šablon „${naziv}”`, `${r.ime} · ${oznakaNedelje(dani[0], dani[6], danasD)}`);
        obavesti(sukob ? `${r.ime.split(' ')[0]}: ${naziv} cele nedelje — ${termina(sukob)} van smene.` : `${r.ime.split(' ')[0]}: ${naziv} cele nedelje (${cilj.length} ${mnozina(cilj.length, 'dan', 'dana', 'dana')}).`, sukob ? 'upoz' : 'ok');
    };

    // Telefon: jedan dan nedelje (dan iz trake iznad liste radnika).
    const [izabran, setIzabran] = useState(danasD);
    const danTel = dani.includes(izabran) ? izabran : (dani.includes(danasD) ? danasD : dani[0]);

    const ovaNedelja = pocetak === pocetakNedelje(danasD);
    const kolone = { gridTemplateColumns: 'var(--prva) repeat(7, minmax(124px, 1fr))' };

    return (
        <div className="flex flex-col gap-4">
            <ZaglavljeStrane naslov="Raspored smena" opis={samoSvoje ? 'Vaše smene i ko još radi te nedelje. Za izmene se obratite menadžeru.' : 'Smene po radniku za izabranu nedelju. Kliknite ćeliju da promenite smenu.'}
                akcije={menjaRaspored && <Dugme ikona={Copy} onClick={() => setKopiraj(true)} kratko="Kopiraj">Kopiraj prethodnu nedelju</Dugme>} />

            <MrezaPlocica>
                <StatPlocica ikona={CalendarClock} oznaka={samoSvoje ? 'Moje smene' : 'Smena ove nedelje'} vrednost={brojke.smena} napomena={oznakaNedelje(dani[0], dani[6], danasD)} />
                <StatPlocica ikona={Clock} ton="info" oznaka={samoSvoje ? 'Moji sati' : 'Ukupno sati'} vrednost={sati(brojke.min)} napomena={samoSvoje ? 'ove nedelje' : `${radnici.length} ${mnozina(radnici.length, 'radnik', 'radnika', 'radnika')}`} />
                <StatPlocica ikona={Gauge} ton="ok" oznaka="Popunjenost smena" vrednost={procenat(brojke.popunjenost)} napomena="zakazano / vreme smene" />
                <StatPlocica ikona={Umbrella} ton="upoz" oznaka="Dani odsustva" vrednost={brojke.odsutno} napomena="odobreno, ove nedelje" />
            </MrezaPlocica>

            <Kartica telo="p-0">
                <div className="flex flex-wrap items-center gap-2 border-b border-p-ivica/70 px-2 py-2.5 sm:px-5 sm:py-3">
                    <div className="flex items-center gap-1">
                        <Dugme velicina="ikonaSm" varijanta="tiho" ikona={ChevronLeft} onClick={() => setPocetak((p) => dodajDane(p, -7))} aria-label="Prethodna nedelja" />
                        <Dugme velicina="ikonaSm" varijanta="tiho" ikona={ChevronRight} onClick={() => setPocetak((p) => dodajDane(p, 7))} aria-label="Sledeća nedelja" />
                    </div>
                    <h2 className="text-[15px] font-semibold tabularno">{oznakaNedelje(dani[0], dani[6], danasD)}</h2>
                    {!ovaNedelja && <Dugme velicina="sm" onClick={() => setPocetak(pocetakNedelje(danasD))}>Ova nedelja</Dugme>}
                    <div className="ml-auto hidden items-center gap-3 text-[12px] text-p-tiho md:flex">
                        <span className="flex items-center gap-1.5"><span className="h-3 w-5 rounded bg-p-staza" />smena</span>
                        <span className="flex items-center gap-1.5"><span className="h-3 w-5 rounded border border-dashed border-p-ivica" />slobodan</span>
                        <span className="flex items-center gap-1.5"><span className="h-3 w-5 rounded bg-p-meko" />salon ne radi</span>
                        <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-p-upoz" />zahtev za odsustvo</span>
                    </div>
                </div>

                {/* Telefon: traka dana + radnici za izabrani dan */}
                <div className="md:hidden">
                    <div className="grid grid-cols-7 gap-1 border-b border-p-ivica/70 p-2" role="tablist" aria-label="Dan u nedelji">
                        {poDanu.map(({ d, broj: b }) => (
                            <button key={d} type="button" role="tab" aria-selected={d === danTel} onClick={() => setIzabran(d)}
                                className={cx('flex flex-col items-center rounded-xl py-1.5 transition-colors', d === danTel ? 'bg-p-akc text-p-naakc' : d === danasD ? 'bg-p-staza text-p-akc' : 'text-p-ink')}>
                                <span className={cx('text-[10.5px] font-semibold uppercase', d === danTel ? 'opacity-85' : 'text-p-tiho')}>{DANI_KRATKO[danUNedelji(d)]}</span>
                                <span className="text-[15px] font-semibold tabularno">{Number(d.slice(8))}</span>
                                <span className={cx('text-[10.5px] tabularno', d === danTel ? 'opacity-85' : 'text-p-tiho')}>{rv[d] ? `${b} rad.` : '—'}</span>
                            </button>
                        ))}
                    </div>
                    <div className="px-4 pb-1 pt-3 text-[13px] text-p-tiho">
                        <b className="font-semibold text-p-ink">{datumSaDanom(danTel)}</b> · {rv[danTel] ? `salon ${uSate(rv[danTel][0])}–${uSate(rv[danTel][1])}` : neradni[danTel] ?? 'salon ne radi'}
                    </div>
                    <ul className="divide-y divide-p-ivica/60">
                        {radnici.map((r) => {
                            const moj = samoSvoje && r.id === radnikId;
                            return (
                                <li key={r.id} className={cx('flex items-center gap-3 px-4 py-2.5', moj && 'bg-p-staza/50')}>
                                    <div className="flex w-[38%] min-w-0 items-center gap-2.5">
                                        <Avatar ime={r.ime} slika={r.slika} boja={r.boja} velicina={32} />
                                        <div className="min-w-0">
                                            <div className="truncate text-[13.5px] font-medium">{r.ime.split(' ')[0]}{moj && <span className="text-p-akc"> · vi</span>}</div>
                                            <div className="text-[11.5px] text-p-tiho tabularno">{sati(satiNedelje(r))} ned.</div>
                                        </div>
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <Celija r={r} d={danTel} podaci={podaci} rv={rv[danTel]} danasD={danasD} mojRed={moj} moze={menjaRaspored && !!rv[danTel]} onKlik={() => setUredi({ radnikId: r.id, datum: danTel })} />
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                    {menjaRaspored && <p className="px-4 pb-3 pt-1 text-[12px] text-p-tiho">Dodirnite smenu da je promenite.</p>}
                </div>

                <div className="hidden overflow-x-auto p-skrol md:block">
                    <div className="min-w-[1016px] text-sm [--prva:148px] sm:min-w-[1084px] sm:[--prva:216px]" role="table" aria-label="Raspored smena">
                        {/* Zaglavlje: dani */}
                        <div className="grid border-b border-p-ivica" style={kolone} role="row">
                            <div className="sticky left-0 z-[2] border-r border-p-ivica/70 bg-p-karta px-3 py-2.5 text-[12px] font-medium uppercase tracking-[.04em] text-p-tiho sm:px-5" role="columnheader">Radnik</div>
                            {dani.map((d) => (
                                <div key={d} role="columnheader" className={cx('px-2 py-2 text-center', d === danasD && 'bg-p-staza')}>
                                    <div className={cx('text-[11px] font-semibold uppercase tracking-[.08em]', d === danasD ? 'text-p-akc' : 'text-p-tiho')}>{d === danasD ? 'Danas' : DANI_KRATKO[danUNedelji(d)]}</div>
                                    <div className={cx('text-[15px] font-semibold tabularno', d === danasD ? 'text-p-akc' : 'text-p-ink')}>{Number(d.slice(8))}.</div>
                                    <div className="truncate text-[11px] text-p-tiho tabularno">{rv[d] ? `${uSate(rv[d][0])}–${uSate(rv[d][1])}` : neradni[d] ?? 'zatvoreno'}</div>
                                </div>
                            ))}
                        </div>

                        {radnici.length === 0 && <Prazno ikona={Users} naslov="Nema aktivnih radnika" />}
                        {radnici.map((r) => {
                            const moj = samoSvoje && r.id === radnikId;
                            return (
                                <div key={r.id} className={cx('grid border-b border-p-ivica/60', moj && 'bg-p-staza/50')} style={kolone} role="row">
                                    <div className={cx('sticky left-0 z-[1] flex min-w-0 flex-col justify-center gap-1.5 border-r border-p-ivica/70 px-3 py-2.5 sm:px-5', moj ? 'bg-p-staza' : 'bg-p-karta')} role="rowheader">
                                        <div className="flex min-w-0 items-center gap-2.5">
                                            <span className="relative shrink-0">
                                                <Avatar ime={r.ime} slika={r.slika} boja={r.boja} velicina={32} />
                                                <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-p-karta" style={{ background: r.boja }} aria-hidden="true" />
                                            </span>
                                            <div className="min-w-0">
                                                <div className="truncate text-[13.5px] font-medium">{r.ime}{moj && <span className="text-p-akc"> · vi</span>}</div>
                                                <div className="text-[12px] text-p-tiho tabularno">{sati(satiNedelje(r))} nedeljno</div>
                                            </div>
                                        </div>
                                        {menjaRaspored && (
                                            <div className="hidden gap-1 sm:flex">
                                                <button type="button" onClick={() => primeniSablon(r, 'prepodne')} title="Prepodnevna smena cele nedelje" className="inline-flex items-center gap-1 rounded-md border border-p-ivica px-1.5 py-0.5 text-[11px] font-medium text-p-tiho hover:border-p-akc/60 hover:text-p-akc"><Sunrise className="h-3 w-3" aria-hidden="true" />Prepodne</button>
                                                <button type="button" onClick={() => primeniSablon(r, 'popodne')} title="Popodnevna smena cele nedelje" className="inline-flex items-center gap-1 rounded-md border border-p-ivica px-1.5 py-0.5 text-[11px] font-medium text-p-tiho hover:border-p-akc/60 hover:text-p-akc"><Sunset className="h-3 w-3" aria-hidden="true" />Popodne</button>
                                            </div>
                                        )}
                                    </div>
                                    {dani.map((d) => (
                                        <div key={d} className={cx('p-1.5', d === danasD && !moj && 'bg-p-staza/30')} role="cell">
                                            <Celija r={r} d={d} podaci={podaci} rv={rv[d]} danasD={danasD} mojRed={moj} moze={menjaRaspored && !!rv[d]} onKlik={() => setUredi({ radnikId: r.id, datum: d })} />
                                        </div>
                                    ))}
                                </div>
                            );
                        })}

                        {/* Zbir po danu */}
                        <div className="grid bg-p-meko/50" style={kolone} role="row">
                            <div className="sticky left-0 z-[1] flex flex-col justify-center border-r border-p-ivica/70 bg-p-meko px-3 py-2.5 sm:px-5" role="rowheader">
                                <span className="text-[13px] font-semibold">Radi</span>
                                <span className="text-[12px] text-p-tiho tabularno">{sati(poDanu.reduce((a, x) => a + x.min, 0))} ukupno</span>
                            </div>
                            {poDanu.map(({ d, broj: b, min }) => (
                                <div key={d} className="px-2 py-2.5 text-center" role="cell">
                                    {rv[d] ? (
                                        <>
                                            <div className={cx('text-[13px] font-semibold tabularno', b === 0 ? 'text-p-greska' : b === 1 ? 'text-p-upoz' : 'text-p-ink')}>{b} {mnozina(b, 'radnik', 'radnika', 'radnika')}</div>
                                            <div className="text-[11.5px] text-p-tiho tabularno">{sati(min)}</div>
                                        </>
                                    ) : <span className="text-[12px] text-p-tiho">—</span>}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Kartica>

            {samoSvoje && radnikId && <MojeSmene radnikId={radnikId} />}

            {uredi && <UrediSmenu key={`${uredi.radnikId}|${uredi.datum}`} cilj={uredi} onClose={zatvoriUredi} />}
            {kopiraj && <KopirajNedelju dani={dani} onClose={zatvoriKopiraj} />}
        </div>
    );
}
