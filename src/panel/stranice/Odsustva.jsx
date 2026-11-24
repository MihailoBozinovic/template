/*
 * ODSUSTVA — godišnji, slobodni dani i bolovanja, kao AllSeasons „Odsustva”.
 * Zaposleni traži odsustvo (čeka odobrenje), administrator i menadžer
 * odobravaju ili odbijaju. Odobreno odsustvo briše smene tih dana, pa radnik
 * nestaje iz online zakazivanja.
 */
import React, { useCallback, useMemo, useState } from 'react';
import { AlertTriangle, CalendarRange, Check, ChevronLeft, ChevronRight, Clock, Plus, Umbrella, UserX, X } from 'lucide-react';
import { usePanel, useDozvole, useIndeksi } from '../podaci/Skladiste.jsx';
import { AKTIVNI } from '../podaci/analitika.js';
import { DANI_KRATKO, MESECI, danUNedelji, danas as danasF, datumKratko, datumSaDanom, dodajDane, mnozina, opsegDana, pocetakMeseca, pocetakNedelje, razlikaDana } from '../format.js';
import { radnoVremeDana } from '../../lib/vreme.js';
import { Avatar, Dugme, Izbor, Kartica, Merac, Modal, MrezaPlocica, Polje, Prazno, StatPlocica, Tabovi, TekstPolje, Unos, ZaglavljeStrane, Znacka, cx } from '../ui.jsx';

const VRSTE_ODSUSTVA = { godisnji: { naziv: 'Godišnji', ton: 'info' }, slobodan: { naziv: 'Slobodan dan', ton: 'akc' }, bolovanje: { naziv: 'Bolovanje', ton: 'greska' } };
const STATUSI = { 'na-cekanju': { naziv: 'Na čekanju', ton: 'upoz' }, odobreno: { naziv: 'Odobreno', ton: 'ok' }, odbijeno: { naziv: 'Odbijeno', ton: 'tiho' } };
const GODISNJI_DANA = 20;

const dana = (n) => `${n} ${mnozina(n, 'dan', 'dana', 'dana')}`;
const termina = (n) => `${n} ${mnozina(n, 'termin', 'termina', 'termina')}`;
const period = (o) => (o.od === o.do ? datumSaDanom(o.od) : `${datumKratko(o.od)} – ${datumKratko(o.do)}`);
const krajMeseca = (iso) => { const [g, m] = iso.split('-').map(Number); return `${iso.slice(0, 8)}${String(new Date(Date.UTC(g, m, 0)).getUTCDate()).padStart(2, '0')}`; };

/** Aktivni termini radnika u periodu — to treba prebaciti ako odsustvo prođe. */
const terminiUPeriodu = (termini, radnikId, od, doD) => termini.filter((t) => t.radnikId === radnikId && t.datum >= od && t.datum <= doD && AKTIVNI.has(t.status) && t.datum >= danasF()).length;
const radniDani = (salon, od, doD) => (doD < od ? 0 : opsegDana(od, doD).filter((d) => radnoVremeDana(d, salon)).length);

/** Odobreno odsustvo: smene tih dana se brišu. */
const bezSmena = (smene, radnikId, od, doD) => {
    const n = { ...smene };
    for (const d of opsegDana(od, doD)) delete n[`${radnikId}|${d}`];
    return n;
};

/* ── Novo odsustvo ── */
function NovoOdsustvo({ onClose }) {
    const { podaci, dodaj, postavi, obavesti, zapisi, noviId } = usePanel();
    const { samoSvoje, radnikId: mojId } = useDozvole();
    const indeks = useIndeksi();
    const d = danasF();
    const [f, setF] = useState(() => ({ radnikId: samoSvoje ? mojId : podaci.radnici[0]?.id, vrsta: 'godisnji', od: dodajDane(d, 7), do: dodajDane(d, 7), napomena: '', status: samoSvoje ? 'na-cekanju' : 'odobreno' }));
    const p = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value, ...(k === 'od' && x.do < e.target.value ? { do: e.target.value } : {}) }));
    const ispravno = f.radnikId && f.od && f.do && f.do >= f.od;
    const sukob = ispravno ? terminiUPeriodu(podaci.termini, f.radnikId, f.od, f.do) : 0;
    const preklapa = ispravno && podaci.odsustva.some((o) => o.radnikId === f.radnikId && o.status !== 'odbijeno' && o.od <= f.do && f.od <= o.do);
    const r = indeks.radnik[f.radnikId];

    const sacuvaj = () => {
        const stavka = { id: noviId('o'), radnikId: f.radnikId, vrsta: f.vrsta, od: f.od, do: f.do, status: f.status, napomena: f.napomena.trim(), kreiran: d };
        dodaj('odsustva', stavka);
        if (f.status === 'odobreno') postavi('smene', (s) => bezSmena(s, f.radnikId, f.od, f.do));
        zapisi('odsustvo', samoSvoje ? 'Zatražio odsustvo' : 'Upisao odsustvo', `${r?.ime} · ${VRSTE_ODSUSTVA[f.vrsta].naziv} · ${period(stavka)}`);
        obavesti(samoSvoje ? 'Zahtev je poslat — čeka odobrenje.' : `Odsustvo je upisano${f.status === 'odobreno' && sukob ? ` — ${termina(sukob)} treba prebaciti` : ''}.`);
        onClose();
    };

    return (
        <Modal otvoren onClose={onClose} naslov={samoSvoje ? 'Zatraži odsustvo' : 'Novo odsustvo'} opis={samoSvoje ? 'Zahtev ide menadžeru na odobrenje.' : 'Odobreno odsustvo uklanja smene tih dana.'}
            podnozje={<><Dugme onClick={onClose}>Otkaži</Dugme><Dugme varijanta="glavno" onClick={sacuvaj} disabled={!ispravno}>{samoSvoje ? 'Pošalji zahtev' : 'Sačuvaj'}</Dugme></>}>
            <div className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                    <Polje oznaka="Radnik">
                        <Izbor value={f.radnikId ?? ''} onChange={p('radnikId')} disabled={samoSvoje}>
                            {podaci.radnici.map((x) => <option key={x.id} value={x.id}>{x.ime}</option>)}
                        </Izbor>
                    </Polje>
                    <Polje oznaka="Vrsta">
                        <Izbor value={f.vrsta} onChange={p('vrsta')}>
                            {Object.entries(VRSTE_ODSUSTVA).map(([k, v]) => <option key={k} value={k}>{v.naziv}</option>)}
                        </Izbor>
                    </Polje>
                    <Polje oznaka="Od"><Unos type="date" value={f.od} onChange={p('od')} /></Polje>
                    <Polje oznaka="Do"><Unos type="date" value={f.do} min={f.od} onChange={p('do')} /></Polje>
                </div>
                {ispravno && <p className="text-[13px] text-p-tiho tabularno">{dana(razlikaDana(f.od, f.do) + 1)} · {radniDani(podaci.podaciSalona, f.od, f.do)} radnih dana salona</p>}
                <Polje oznaka="Napomena"><TekstPolje value={f.napomena} onChange={p('napomena')} placeholder="Npr. putovanje, seminar, lekarsko…" className="min-h-[64px]" /></Polje>
                {!samoSvoje && (
                    <Polje oznaka="Status">
                        <Izbor value={f.status} onChange={p('status')}>
                            <option value="odobreno">Odobreno odmah</option>
                            <option value="na-cekanju">Na čekanju</option>
                        </Izbor>
                    </Polje>
                )}
                {sukob > 0 && (
                    <div className="flex items-start gap-2 rounded-xl bg-p-upozbg px-3 py-2.5 text-[13px] text-p-upoz">
                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                        <span>{r?.ime.split(' ')[0]} u tom periodu ima <b>{termina(sukob)}</b> — {mnozina(sukob, 'treba ga', 'treba ih', 'treba ih')} prebaciti.</span>
                    </div>
                )}
                {preklapa && <p className="text-[13px] text-p-greska">Ovaj period se preklapa sa postojećim odsustvom.</p>}
            </div>
        </Modal>
    );
}

/* ── Jedno odsustvo ── */
function RedOdsustva({ o, upravlja, mojId }) {
    const { podaci, izmeni, obrisi, postavi, obavesti, zapisi } = usePanel();
    const indeks = useIndeksi();
    const r = indeks.radnik[o.radnikId];
    const ukupno = razlikaDana(o.od, o.do) + 1;
    const sukob = o.status !== 'odbijeno' ? terminiUPeriodu(podaci.termini, o.radnikId, o.od, o.do) : 0;
    const v = VRSTE_ODSUSTVA[o.vrsta] ?? { naziv: o.vrsta, ton: 'tiho' };
    const s = STATUSI[o.status] ?? { naziv: o.status, ton: 'tiho' };
    const opis = `${r?.ime} · ${v.naziv} · ${period(o)}`;

    const odobri = () => {
        izmeni('odsustva', o.id, { status: 'odobreno' });
        postavi('smene', (x) => bezSmena(x, o.radnikId, o.od, o.do));
        zapisi('odsustvo', 'Odobrio odsustvo', opis);
        obavesti(sukob ? `Odobreno — ${termina(sukob)} treba prebaciti.` : `Odobreno: ${r?.ime.split(' ')[0]}, ${period(o)}.`);
    };
    const odbij = () => {
        izmeni('odsustva', o.id, { status: 'odbijeno' });
        zapisi('odsustvo', 'Odbio odsustvo', opis);
        obavesti('Zahtev je odbijen.');
    };
    const povuci = () => {
        obrisi('odsustva', o.id);
        zapisi('odsustvo', 'Povukao zahtev', opis);
        obavesti('Zahtev je povučen.');
    };

    return (
        <li className="flex flex-col gap-3 px-4 py-3.5 sm:flex-row sm:items-center sm:px-5">
            <div className="flex min-w-0 flex-1 items-start gap-3">
                <span className="relative shrink-0">
                    <Avatar ime={r?.ime} slika={r?.slika} boja={r?.boja} velicina={38} />
                </span>
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        <span className="text-sm font-semibold">{r?.ime ?? 'Radnik'}</span>
                        <Znacka ton={v.ton}>{v.naziv}</Znacka>
                        <Znacka ton={s.ton} tacka>{s.naziv}</Znacka>
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-2 text-[13px] text-p-tiho">
                        <span className="font-medium text-p-ink tabularno">{period(o)}</span>
                        <span className="tabularno">· {dana(ukupno)}</span>
                        {o.kreiran && <span>· zatraženo {datumKratko(o.kreiran)}</span>}
                    </div>
                    {o.napomena && <p className="mt-1 text-[13px]">„{o.napomena}”</p>}
                    {sukob > 0 && (
                        <div className="mt-1.5 inline-flex items-center gap-1.5 rounded-lg bg-p-upozbg px-2 py-1 text-[12.5px] font-medium text-p-upoz">
                            <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />{termina(sukob)} treba prebaciti
                        </div>
                    )}
                </div>
            </div>
            {o.status === 'na-cekanju' && (upravlja || o.radnikId === mojId) && (
                <div className="flex shrink-0 gap-2 pl-[50px] sm:pl-0">
                    {upravlja ? (
                        <>
                            <Dugme velicina="sm" varijanta="opasnoTiho" ikona={X} onClick={odbij}>Odbij</Dugme>
                            <Dugme velicina="sm" varijanta="glavno" ikona={Check} onClick={odobri}>Odobri</Dugme>
                        </>
                    ) : <Dugme velicina="sm" varijanta="opasnoTiho" onClick={povuci}>Povuci zahtev</Dugme>}
                </div>
            )}
        </li>
    );
}

/* ── Mesec: ko je odsutan kog dana ── */
function MesecOdsustava({ radnici }) {
    const { podaci } = usePanel();
    const d = danasF();
    const [mesec, setMesec] = useState(() => pocetakMeseca(d));
    const dani = opsegDana(mesec, krajMeseca(mesec));
    const ods = podaci.odsustva.filter((o) => o.status !== 'odbijeno' && o.do >= mesec && o.od <= dani[dani.length - 1]);
    const naDan = (x) => ods.filter((o) => x >= o.od && x <= o.do).map((o) => ({ o, r: radnici.find((r) => r.id === o.radnikId) })).filter((y) => y.r);
    const [g, m] = mesec.split('-').map(Number);
    const pomeri = (n) => setMesec((x) => { const [gg, mm] = x.split('-').map(Number); const nm = new Date(Date.UTC(gg, mm - 1 + n, 1)); return `${nm.getUTCFullYear()}-${String(nm.getUTCMonth() + 1).padStart(2, '0')}-01`; });
    const prisutni = radnici.filter((r) => ods.some((o) => o.radnikId === r.id));

    return (
        <Kartica naslov="Ko je odsutan" opis="Odobrena odsustva i zahtevi na čekanju" telo="p-0"
            akcije={(
                <div className="flex items-center gap-1">
                    <Dugme velicina="ikonaSm" varijanta="tiho" ikona={ChevronLeft} onClick={() => pomeri(-1)} aria-label="Prethodni mesec" />
                    <span className="min-w-[96px] text-center text-[13px] font-semibold">{MESECI[m - 1]} {g !== Number(d.slice(0, 4)) ? g : ''}</span>
                    <Dugme velicina="ikonaSm" varijanta="tiho" ikona={ChevronRight} onClick={() => pomeri(1)} aria-label="Sledeći mesec" />
                </div>
            )}>
            <div className="overflow-x-auto p-skrol">
                <div className="flex min-w-max gap-1 px-4 py-3 sm:px-5">
                    {dani.map((x) => {
                        const ko = naDan(x);
                        const zatvoreno = !radnoVremeDana(x, podaci.podaciSalona);
                        const pon = danUNedelji(x) === 'pon' && x !== dani[0];
                        return (
                            <div key={x} className={cx('flex w-[38px] shrink-0 flex-col items-center gap-1 rounded-lg py-1.5', x === d ? 'bg-p-staza ring-1 ring-p-akc/40' : zatvoreno ? 'bg-p-meko/70' : '', pon && 'ml-1.5')}
                                title={`${datumSaDanom(x)}${ko.length ? `: ${ko.map((y) => `${y.r.ime} (${VRSTE_ODSUSTVA[y.o.vrsta]?.naziv.toLowerCase()}${y.o.status === 'na-cekanju' ? ', čeka' : ''})`).join(', ')}` : ''}`}>
                                <span className={cx('text-[10px] font-semibold uppercase', x === d ? 'text-p-akc' : 'text-p-tiho')}>{DANI_KRATKO[danUNedelji(x)].slice(0, 2)}</span>
                                <span className={cx('text-[13px] font-semibold tabularno', x === d ? 'text-p-akc' : zatvoreno ? 'text-p-tiho' : 'text-p-ink')}>{Number(x.slice(8))}</span>
                                <span className="flex min-h-[26px] flex-col items-center gap-[3px]">
                                    {ko.slice(0, 4).map(({ o, r }) => (
                                        <span key={o.id} className="h-[7px] w-[7px] rounded-full" style={o.status === 'odobreno' ? { background: r.boja } : { boxShadow: `inset 0 0 0 1.5px ${r.boja}` }} aria-hidden="true" />
                                    ))}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-p-ivica/70 px-4 py-3 text-[12.5px] text-p-tiho sm:px-5">
                {(prisutni.length ? prisutni : radnici).map((r) => (
                    <span key={r.id} className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: r.boja }} aria-hidden="true" />{r.ime}</span>
                ))}
                <span className="inline-flex items-center gap-1.5 sm:ml-auto"><span className="h-2 w-2 rounded-full bg-p-tiho" aria-hidden="true" />odobreno</span>
                <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full ring-[1.5px] ring-inset ring-p-tiho" aria-hidden="true" />čeka odobrenje</span>
            </div>
        </Kartica>
    );
}

/* ── Godišnji odmor po radniku ── */
function GodisnjiPregled({ radnici }) {
    const { podaci } = usePanel();
    const d = danasF();
    const god = d.slice(0, 4);
    const [pocetak, kraj] = [`${god}-01-01`, `${god}-12-31`];
    const redovi = radnici.map((r) => {
        const moja = podaci.odsustva.filter((o) => o.radnikId === r.id && o.vrsta === 'godisnji' && o.do >= pocetak && o.od <= kraj);
        const u = (o, a, b) => radniDani(podaci.podaciSalona, a > o.od ? a : o.od, b < o.do ? b : o.do);
        const odobreno = moja.filter((o) => o.status === 'odobreno');
        const iskorisceno = odobreno.reduce((s, o) => s + u(o, pocetak, d), 0);
        const planirano = odobreno.reduce((s, o) => s + u(o, dodajDane(d, 1), kraj), 0);
        const ceka = moja.filter((o) => o.status === 'na-cekanju').reduce((s, o) => s + u(o, pocetak, kraj), 0);
        return { r, iskorisceno, planirano, ceka, ukupno: iskorisceno + planirano };
    });
    return (
        <Kartica naslov={`Godišnji odmor ${god}.`} opis={`${GODISNJI_DANA} radnih dana po radniku`}>
            <ul className="space-y-4">
                {redovi.map(({ r, iskorisceno, planirano, ceka, ukupno }) => {
                    const ostalo = GODISNJI_DANA - ukupno;
                    return (
                        <li key={r.id}>
                            <div className="mb-1.5 flex items-center gap-2.5">
                                <Avatar ime={r.ime} slika={r.slika} boja={r.boja} velicina={26} />
                                <span className="min-w-0 flex-1 truncate text-[13.5px] font-medium">{r.ime}</span>
                                <span className="shrink-0 text-[13px] font-semibold tabularno">{ukupno}<span className="font-normal text-p-tiho"> / {GODISNJI_DANA}</span></span>
                            </div>
                            <Merac vrednost={ukupno / GODISNJI_DANA} ton={ukupno > GODISNJI_DANA ? 'greska' : ukupno >= GODISNJI_DANA * 0.8 ? 'upoz' : 'graf'} oznaka={`Godišnji ${r.ime}`} />
                            <div className="mt-1 flex flex-wrap gap-x-2 text-[12px] text-p-tiho tabularno">
                                <span>iskorišćeno {iskorisceno}</span>
                                {planirano > 0 && <span>· planirano {planirano}</span>}
                                {ceka > 0 && <span className="text-p-upoz">· čeka {ceka}</span>}
                                <span className={cx('ml-auto', ostalo < 0 && 'text-p-greska')}>{ostalo >= 0 ? `ostalo ${ostalo}` : `prekoračeno ${-ostalo}`}</span>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </Kartica>
    );
}

export default function Odsustva() {
    const { podaci } = usePanel();
    const { uloga, samoSvoje, radnikId } = useDozvole();
    const upravlja = uloga === 'administrator' || uloga === 'menadzer';
    const d = danasF();
    const [tab, setTab] = useState('ceka');
    const [novo, setNovo] = useState(false);
    const zatvori = useCallback(() => setNovo(false), []);

    const radnici = useMemo(() => podaci.radnici.filter((r) => r.aktivan !== false), [podaci.radnici]);
    const vidljiva = useMemo(() => podaci.odsustva.filter((o) => !samoSvoje || o.radnikId === radnikId), [podaci.odsustva, samoSvoje, radnikId]);
    const grupe = useMemo(() => ({
        ceka: vidljiva.filter((o) => o.status === 'na-cekanju').sort((a, b) => a.od.localeCompare(b.od)),
        buduca: vidljiva.filter((o) => o.status !== 'na-cekanju' && o.do >= d).sort((a, b) => a.od.localeCompare(b.od)),
        prosla: vidljiva.filter((o) => o.status !== 'na-cekanju' && o.do < d).sort((a, b) => b.od.localeCompare(a.od)),
    }), [vidljiva, d]);

    const odobrena = podaci.odsustva.filter((o) => o.status === 'odobreno');
    const odsutniDanas = radnici.filter((r) => odobrena.some((o) => o.radnikId === r.id && d >= o.od && d <= o.do));
    const pn = pocetakNedelje(d);
    const ovaNedelja = new Set(odobrena.filter((o) => o.od <= dodajDane(pn, 6) && o.do >= pn).map((o) => o.radnikId)).size;
    const zaPrebaciti = grupe.ceka.reduce((s, o) => s + terminiUPeriodu(podaci.termini, o.radnikId, o.od, o.do), 0);
    const lista = grupe[tab];

    return (
        <div className="flex flex-col gap-4">
            <ZaglavljeStrane naslov="Odsustva" opis={samoSvoje ? 'Vaši godišnji odmori, slobodni dani i bolovanja. Zahtev odobrava menadžer.' : 'Godišnji odmori, slobodni dani i bolovanja. Odobreno odsustvo skida radnika sa online zakazivanja.'}
                akcije={<Dugme varijanta="glavno" ikona={Plus} onClick={() => setNovo(true)}>{samoSvoje ? 'Zatraži odsustvo' : 'Novo odsustvo'}</Dugme>} />

            <MrezaPlocica>
                <StatPlocica ikona={Clock} ton="upoz" oznaka="Na čekanju" vrednost={grupe.ceka.length} napomena={zaPrebaciti ? `${termina(zaPrebaciti)} u tim danima` : 'nema sukoba sa terminima'} />
                <StatPlocica ikona={UserX} ton="greska" oznaka="Odsutni danas" vrednost={odsutniDanas.length} napomena={odsutniDanas.length ? odsutniDanas.map((r) => r.ime.split(' ')[0]).join(', ') : 'ceo tim je tu'} />
                <StatPlocica ikona={CalendarRange} ton="info" oznaka="Odsutni ove nedelje" vrednost={ovaNedelja} napomena={`od ${radnici.length} ${mnozina(radnici.length, 'radnika', 'radnika', 'radnika')}`} />
                <StatPlocica ikona={Umbrella} oznaka="Predstojeća" vrednost={grupe.buduca.filter((o) => o.status === 'odobreno').length} napomena="odobrena odsustva" />
            </MrezaPlocica>

            <MesecOdsustava radnici={radnici} />

            <div className="grid gap-4 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
                <Kartica telo="p-0">
                    <div className="border-b border-p-ivica/70 px-4 py-3 sm:px-5">
                        <Tabovi aktivan={tab} onChange={setTab} stavke={[
                            { id: 'ceka', naziv: 'Na čekanju', broj: grupe.ceka.length },
                            { id: 'buduca', naziv: 'Predstojeća', broj: grupe.buduca.length },
                            { id: 'prosla', naziv: 'Prošla', broj: grupe.prosla.length },
                        ]} />
                    </div>
                    {lista.length ? (
                        <ul className="divide-y divide-p-ivica/60">
                            {lista.map((o) => <RedOdsustva key={o.id} o={o} upravlja={upravlja} mojId={radnikId} />)}
                        </ul>
                    ) : (
                        <Prazno ikona={Umbrella} naslov={tab === 'ceka' ? 'Nema zahteva na čekanju' : tab === 'buduca' ? 'Nema predstojećih odsustava' : 'Nema prošlih odsustava'}
                            opis={tab === 'ceka' ? 'Novi zahtevi zaposlenih pojaviće se ovde.' : undefined} />
                    )}
                </Kartica>
                <GodisnjiPregled radnici={samoSvoje ? radnici.filter((r) => r.id === radnikId) : radnici} />
            </div>

            {novo && <NovoOdsustvo onClose={zatvori} />}
        </div>
    );
}
