/*
 * USLUGE I CENE — cenovnik salona po kategorijama, kao AllSeasons „Usluge”.
 * Vlasnik menja naziv, trajanje, cenu, ko radi uslugu i da li se zakazuje
 * online; ostali vide cenovnik samo za čitanje. Grupna promena cena za X%
 * zaokružuje na 100 RSD i prvo pokazuje pregled.
 */
import React, { useCallback, useMemo, useState } from 'react';
import { AlertTriangle, CalendarCheck, Check, Globe, Info, Percent, Plus, Scissors, Tag, Trash2 } from 'lucide-react';
import { usePanel, useDozvole } from '../podaci/Skladiste.jsx';
import { AKTIVNI, naplaceni, poUslugama } from '../podaci/analitika.js';
import { broj, danas as danasF, dodajDane, mnozina, rsd, trajanje } from '../format.js';
import { Avatar, Dugme, Fioka, Izbor, Kartica, Modal, MrezaPlocica, Polje, Prazno, Prekidac, Pretraga, StatPlocica, Tabovi, TekstPolje, Unos, ZaglavljeStrane, Znacka, cx } from '../ui.jsx';

const usluga = (n) => `${n} ${mnozina(n, 'usluga', 'usluge', 'usluga')}`;
const cenaTekst = (u) => `${u.cenaOd ? 'od ' : ''}${rsd(u.cena)}`;
const zaokruzi100 = (n) => Math.max(0, Math.round(n / 100) * 100);
const TRAJANJA = Array.from({ length: 20 }, (_, i) => (i + 1) * 15);

/** Mali prekidač za red tabele (bez natpisa pored). */
function MaliPrekidac({ ukljuceno, onChange, oznaka, disabled }) {
    return (
        <button type="button" role="switch" aria-checked={!!ukljuceno} aria-label={oznaka} title={oznaka} disabled={disabled}
            onClick={(e) => { e.stopPropagation(); onChange(!ukljuceno); }}
            className={cx('relative h-5 w-9 shrink-0 rounded-full transition-colors disabled:cursor-not-allowed disabled:opacity-45', ukljuceno ? 'bg-p-akc' : 'bg-p-polje/60')}>
            <span className={cx('absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-[left]', ukljuceno ? 'left-[18px]' : 'left-0.5')} />
        </button>
    );
}

function Radnici({ lista }) {
    if (!lista.length) return <span className="text-[12px] text-p-greska">niko</span>;
    return (
        <span className="flex items-center" title={lista.map((r) => r.ime).join(', ')}>
            {lista.slice(0, 4).map((r, i) => <Avatar key={r.id} ime={r.ime} slika={r.slika} boja={r.boja} velicina={24} className={cx('ring-2 ring-p-karta', i > 0 && '-ml-1.5')} />)}
            {lista.length > 4 && <span className="ml-1 text-[11.5px] text-p-tiho tabularno">+{lista.length - 4}</span>}
        </span>
    );
}

/* ── Fioka: izmena ili nova usluga ── */
function UrediUslugu({ cilj, onClose, onObrisi }) {
    const { podaci, dodaj, izmeni, postavi, obavesti, zapisi, noviId } = usePanel();
    const nova = !cilj.id;
    const [f, setF] = useState(() => ({
        naziv: cilj.naziv ?? '', opis: cilj.opis ?? '', kategorija: cilj.kategorija ?? podaci.kategorije[0]?.id, trajanje: cilj.trajanje ?? 30,
        cena: String(cilj.cena ?? ''), cenaOd: !!cilj.cenaOd, online: cilj.online ?? true, aktivna: cilj.aktivna ?? true,
    }));
    const [izabrani, setIzabrani] = useState(() => podaci.radnici.filter((r) => cilj.id && r.usluge.includes(cilj.id)).map((r) => r.id));
    const p = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }));
    const cena = Number(f.cena);
    const ispravno = f.naziv.trim() && f.cena !== '' && Number.isFinite(cena) && cena >= 0;

    const sacuvaj = () => {
        const id = cilj.id ?? noviId('u');
        const kat = podaci.kategorije.find((k) => k.id === f.kategorija);
        const zapis = { kategorija: f.kategorija, naziv: f.naziv.trim(), opis: f.opis.trim(), trajanje: Number(f.trajanje), cena: zaokruzi100(cena), cenaOd: f.cenaOd, online: f.online, aktivna: f.aktivna, za: kat?.za ?? [] };
        if (nova) dodaj('usluge', { id, ...zapis });
        else izmeni('usluge', id, zapis);
        postavi('radnici', (rs) => rs.map((r) => {
            const ima = r.usluge.includes(id); const treba = izabrani.includes(r.id);
            if (ima === treba) return r;
            return { ...r, usluge: treba ? [...r.usluge, id] : r.usluge.filter((x) => x !== id) };
        }));
        if (nova) zapisi('usluga', 'Dodao uslugu', `${zapis.naziv} · ${cenaTekst(zapis)}`);
        else if (zapis.cena !== cilj.cena) zapisi('usluga', 'Izmenio cenu usluge', `${zapis.naziv}: ${rsd(cilj.cena)} → ${rsd(zapis.cena)}`);
        else zapisi('usluga', 'Izmenio uslugu', zapis.naziv);
        obavesti(nova ? `Usluga „${zapis.naziv}” je dodata u cenovnik.` : 'Usluga je sačuvana — cenovnik na sajtu je ažuriran.');
        onClose();
    };

    return (
        <Fioka otvoren onClose={onClose} naslov={nova ? 'Nova usluga' : f.naziv || 'Usluga'} podnaslov={nova ? 'Pojaviće se u cenovniku na sajtu.' : `${trajanje(Number(f.trajanje))} · ${f.cenaOd ? 'od ' : ''}${rsd(cena || 0)}`}
            podnozje={(
                <>
                    {!nova && <Dugme varijanta="opasnoTiho" className="mr-auto" ikona={Trash2} onClick={() => onObrisi(cilj)}>Obriši</Dugme>}
                    <Dugme onClick={onClose}>Otkaži</Dugme>
                    <Dugme varijanta="glavno" onClick={sacuvaj} disabled={!ispravno}>Sačuvaj</Dugme>
                </>
            )}>
            <div className="space-y-4">
                <Polje oznaka="Naziv"><Unos value={f.naziv} onChange={p('naziv')} placeholder="Npr. Muško šišanje" /></Polje>
                <Polje oznaka="Opis" pomoc="Kratko, jedna rečenica — vidi se ispod naziva u cenovniku."><TekstPolje value={f.opis} onChange={p('opis')} className="min-h-[64px]" /></Polje>
                <Polje oznaka="Kategorija">
                    <Izbor value={f.kategorija} onChange={p('kategorija')}>
                        {podaci.kategorije.slice().sort((a, b) => a.redosled - b.redosled).map((k) => <option key={k.id} value={k.id}>{k.naziv}</option>)}
                    </Izbor>
                </Polje>
                <div className="grid grid-cols-2 gap-3">
                    <Polje oznaka="Trajanje">
                        <Izbor value={f.trajanje} onChange={p('trajanje')}>
                            {TRAJANJA.map((m) => <option key={m} value={m}>{trajanje(m)}</option>)}
                        </Izbor>
                    </Polje>
                    <Polje oznaka="Cena (RSD)" pomoc="Zaokružuje se na 100.">
                        <Unos type="number" inputMode="numeric" min={0} step={100} value={f.cena} onChange={p('cena')} className="tabularno" />
                    </Polje>
                </div>
                <div className="divide-y divide-p-ivica/60 rounded-xl border border-p-ivica px-3">
                    <Prekidac oznaka="Cena „od”" opis="Konačna cena zavisi od dužine i gustine kose." ukljuceno={f.cenaOd} onChange={(v) => setF((x) => ({ ...x, cenaOd: v }))} />
                    <Prekidac oznaka="Online zakazivanje" opis="Klijenti mogu da je izaberu na sajtu." ukljuceno={f.online} onChange={(v) => setF((x) => ({ ...x, online: v }))} />
                    <Prekidac oznaka="Aktivna" opis="Isključena usluga se ne vidi u cenovniku." ukljuceno={f.aktivna} onChange={(v) => setF((x) => ({ ...x, aktivna: v }))} />
                </div>
                <div>
                    <div className="mb-1.5 flex items-baseline justify-between">
                        <span className="text-[13px] font-medium">Ko radi uslugu</span>
                        <span className="text-[12px] text-p-tiho tabularno">{izabrani.length} od {podaci.radnici.length}</span>
                    </div>
                    <div className="grid gap-2 sm:grid-cols-2">
                        {podaci.radnici.map((r) => {
                            const da = izabrani.includes(r.id);
                            return (
                                <button key={r.id} type="button" aria-pressed={da} onClick={() => setIzabrani((x) => (da ? x.filter((y) => y !== r.id) : [...x, r.id]))}
                                    className={cx('flex items-center gap-2.5 rounded-xl border px-2.5 py-2 text-left transition-colors', da ? 'border-p-akc/60 bg-p-staza' : 'border-p-ivica hover:bg-p-meko')}>
                                    <Avatar ime={r.ime} slika={r.slika} boja={r.boja} velicina={28} />
                                    <span className="min-w-0 flex-1 truncate text-[13px] font-medium">{r.ime}</span>
                                    <span className={cx('grid h-5 w-5 shrink-0 place-items-center rounded-md border', da ? 'border-p-akc bg-p-akc text-p-naakc' : 'border-p-polje')}>{da && <Check className="h-3.5 w-3.5" strokeWidth={3} aria-hidden="true" />}</span>
                                </button>
                            );
                        })}
                    </div>
                    {izabrani.length === 0 && <p className="mt-1.5 text-[12.5px] text-p-upoz">Bez radnika usluga ne može da se zakaže.</p>}
                </div>
            </div>
        </Fioka>
    );
}

/* ── Potvrda brisanja ── */
function ObrisiUslugu({ u, onClose }) {
    const { podaci, obrisi, postavi, obavesti, zapisi } = usePanel();
    const d = danasF();
    const zakazano = podaci.termini.filter((t) => t.datum >= d && AKTIVNI.has(t.status) && t.usluge.includes(u.id)).length;
    const potvrdi = () => {
        obrisi('usluge', u.id);
        postavi('radnici', (rs) => rs.map((r) => (r.usluge.includes(u.id) ? { ...r, usluge: r.usluge.filter((x) => x !== u.id) } : r)));
        zapisi('usluga', 'Obrisao uslugu', u.naziv);
        obavesti(`Usluga „${u.naziv}” je obrisana.`);
        onClose();
    };
    return (
        <Modal otvoren onClose={onClose} naslov="Obrisati uslugu?" opis={u.naziv}
            podnozje={<><Dugme onClick={onClose}>Otkaži</Dugme><Dugme varijanta="opasno" ikona={Trash2} onClick={potvrdi}>Obriši</Dugme></>}>
            <div className="space-y-3 text-sm">
                <p>Usluga nestaje iz cenovnika i online zakazivanja. Prošli termini i promet ostaju u izveštajima.</p>
                {zakazano > 0 && (
                    <div className="flex items-start gap-2 rounded-xl bg-p-upozbg px-3 py-2.5 text-[13px] text-p-upoz">
                        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                        <span>Usluga je u <b>{zakazano}</b> {mnozina(zakazano, 'zakazanom terminu', 'zakazana termina', 'zakazanih termina')} — oni ostaju kako su zakazani.</span>
                    </div>
                )}
                <p className="text-[13px] text-p-tiho">Ako je samo privremeno nema, bolje je isključiti „Aktivna”.</p>
            </div>
        </Modal>
    );
}

/* ── Grupna promena cena ── */
function PromeniCene({ onClose }) {
    const { podaci, postavi, obavesti, zapisi } = usePanel();
    const [kat, setKat] = useState('sve');
    const [proc, setProc] = useState('5');
    const x = Number(String(proc).replace(',', '.'));
    const ispravno = Number.isFinite(x) && x !== 0 && x > -90 && x <= 200;
    const kategorije = podaci.kategorije.slice().sort((a, b) => a.redosled - b.redosled);
    const pregled = useMemo(() => podaci.usluge
        .filter((u) => kat === 'sve' || u.kategorija === kat)
        .map((u) => ({ u, nova: ispravno ? zaokruzi100(u.cena * (1 + x / 100)) : u.cena }))
        .sort((a, b) => kategorije.findIndex((k) => k.id === a.u.kategorija) - kategorije.findIndex((k) => k.id === b.u.kategorija)), [podaci.usluge, kat, x, ispravno, kategorije]);
    const menja = pregled.filter((p) => p.nova !== p.u.cena);
    const naziv = kat === 'sve' ? 'Sve usluge' : kategorije.find((k) => k.id === kat)?.naziv;

    const primeni = () => {
        const nove = Object.fromEntries(menja.map((p) => [p.u.id, p.nova]));
        postavi('usluge', (us) => us.map((u) => (u.id in nove ? { ...u, cena: nove[u.id] } : u)));
        zapisi('usluga', 'Promenio cene', `${naziv}: ${x > 0 ? '+' : ''}${String(x).replace('.', ',')}% (${usluga(menja.length)})`);
        obavesti(`Nove cene za ${usluga(menja.length)} su na sajtu.`);
        onClose();
    };

    return (
        <Modal otvoren onClose={onClose} naslov="Promeni cene" opis="Procenat za sve usluge ili jednu kategoriju, zaokruženo na 100 RSD." sirina="max-w-2xl"
            podnozje={<><Dugme onClick={onClose}>Otkaži</Dugme><Dugme varijanta="glavno" onClick={primeni} disabled={!ispravno || !menja.length}>Primeni na {usluga(menja.length)}</Dugme></>}>
            <div className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_160px]">
                    <Polje oznaka="Usluge">
                        <Izbor value={kat} onChange={(e) => setKat(e.target.value)}>
                            <option value="sve">Sve usluge</option>
                            {kategorije.map((k) => <option key={k.id} value={k.id}>{k.naziv}</option>)}
                        </Izbor>
                    </Polje>
                    <Polje oznaka="Promena (%)" pomoc="Minus za sniženje.">
                        <Unos type="number" inputMode="decimal" step={1} value={proc} onChange={(e) => setProc(e.target.value)} className="tabularno" />
                    </Polje>
                </div>
                <div className="flex flex-wrap gap-1.5">
                    {[3, 5, 10, 15].map((n) => <Dugme key={n} velicina="sm" varijanta={x === n ? 'glavno' : 'obicno'} onClick={() => setProc(String(n))}>+{n}%</Dugme>)}
                </div>
                <div className="overflow-hidden rounded-xl border border-p-ivica">
                    <div className="max-h-[42svh] overflow-auto p-skrol">
                        <table className="w-full min-w-[420px] text-sm">
                            <thead className="sticky top-0 bg-p-meko">
                                <tr className="text-left text-[11.5px] uppercase tracking-[.04em] text-p-tiho">
                                    <th className="px-3 py-2 font-medium">Usluga</th>
                                    <th className="px-3 py-2 text-right font-medium">Sada</th>
                                    <th className="px-3 py-2 text-right font-medium">Nova</th>
                                    <th className="px-3 py-2 text-right font-medium">Razlika</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pregled.map(({ u, nova: n }) => (
                                    <tr key={u.id} className={cx('border-t border-p-ivica/60', n === u.cena && 'text-p-tiho')}>
                                        <td className="px-3 py-2"><span className="font-medium">{u.naziv}</span>{!u.aktivna && <span className="text-[12px] text-p-tiho"> · isključena</span>}</td>
                                        <td className="whitespace-nowrap px-3 py-2 text-right tabularno">{cenaTekst(u)}</td>
                                        <td className="whitespace-nowrap px-3 py-2 text-right font-semibold tabularno">{u.cenaOd ? 'od ' : ''}{rsd(n)}</td>
                                        <td className={cx('whitespace-nowrap px-3 py-2 text-right tabularno', n > u.cena ? 'text-p-ok' : n < u.cena ? 'text-p-greska' : '')}>{n === u.cena ? '—' : `${n > u.cena ? '+' : '−'}${broj(Math.abs(n - u.cena))}`}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                {ispravno && <p className="text-[13px] text-p-tiho">{usluga(menja.length)} menja cenu{pregled.length - menja.length > 0 ? `, ${pregled.length - menja.length} ostaje ista posle zaokruživanja` : ''}.</p>}
            </div>
        </Modal>
    );
}

export default function Usluge() {
    const { podaci, izmeni, obavesti, zapisi } = usePanel();
    const { menjaUsluge } = useDozvole();
    const [upit, setUpit] = useState('');
    const [filter, setFilter] = useState('sve');
    const [uredi, setUredi] = useState(null);
    const [brisi, setBrisi] = useState(null);
    const [cene, setCene] = useState(false);
    const zatvoriUredi = useCallback(() => setUredi(null), []);
    const zatvoriBrisi = useCallback(() => setBrisi(null), []);
    const zatvoriCene = useCallback(() => setCene(false), []);
    const otvoriBrisanje = useCallback((u) => { setUredi(null); setBrisi(u); }, []);

    const d = danasF();
    const uradjeno = useMemo(() => Object.fromEntries(poUslugama(naplaceni(podaci.termini, dodajDane(d, -29), d)).map((x) => [x.id, x.broj])), [podaci.termini, d]);
    const radniciUsluge = useMemo(() => {
        const m = {};
        for (const r of podaci.radnici) for (const id of r.usluge) (m[id] ??= []).push(r);
        return m;
    }, [podaci.radnici]);

    const q = upit.trim().toLowerCase();
    const prolazi = (u) => (!q || u.naziv.toLowerCase().includes(q) || u.opis?.toLowerCase().includes(q))
        && (filter === 'sve' || (filter === 'aktivne' && u.aktivna) || (filter === 'iskljucene' && !u.aktivna) || (filter === 'salon' && u.aktivna && !u.online));
    const grupe = podaci.kategorije.slice().sort((a, b) => a.redosled - b.redosled)
        .map((k) => ({ k, sve: podaci.usluge.filter((u) => u.kategorija === k.id), lista: podaci.usluge.filter((u) => u.kategorija === k.id && prolazi(u)) }))
        .filter((g) => g.lista.length || (!q && filter === 'sve' && menjaUsluge));

    const aktivne = podaci.usluge.filter((u) => u.aktivna);
    const ukupno30 = Object.values(uradjeno).reduce((a, b) => a + b, 0);
    const prosek = aktivne.length ? aktivne.reduce((a, u) => a + u.cena, 0) / aktivne.length : 0;

    const prebaci = (u, polje, v) => {
        izmeni('usluge', u.id, { [polje]: v });
        const tekst = polje === 'online' ? (v ? 'Uključio online zakazivanje' : 'Isključio online zakazivanje') : (v ? 'Aktivirao uslugu' : 'Isključio uslugu');
        zapisi('usluga', tekst, u.naziv);
        obavesti(polje === 'online' ? `${u.naziv}: ${v ? 'zakazuje se online' : 'samo u salonu'}.` : `${u.naziv}: ${v ? 'vidi se u cenovniku' : 'sklonjena iz cenovnika'}.`);
    };

    const KOLONE = 'md:grid-cols-[minmax(0,1fr)_88px_124px_70px_112px_60px_60px]';

    return (
        <div className="flex flex-col gap-4">
            <ZaglavljeStrane naslov="Usluge i cene" opis="Cenovnik salona po kategorijama: trajanje, cena, ko radi uslugu i da li se zakazuje online."
                akcije={menjaUsluge && (
                    <>
                        <Dugme ikona={Percent} onClick={() => setCene(true)}>Promeni cene</Dugme>
                        <Dugme varijanta="glavno" ikona={Plus} onClick={() => setUredi({})} kratko="Nova">Nova usluga</Dugme>
                    </>
                )}>
                <p className="mt-2 inline-flex items-center gap-1.5 rounded-lg bg-p-infobg px-2.5 py-1 text-[12.5px] font-medium text-p-info">
                    <Globe className="h-3.5 w-3.5" aria-hidden="true" />Cene se odmah vide na sajtu u cenovniku (demo)
                </p>
            </ZaglavljeStrane>

            <MrezaPlocica>
                <StatPlocica ikona={Scissors} oznaka="Aktivne usluge" vrednost={aktivne.length} napomena={`od ${podaci.usluge.length} u cenovniku`} />
                <StatPlocica ikona={Globe} ton="info" oznaka="Zakazuje se online" vrednost={aktivne.filter((u) => u.online).length} napomena={`${aktivne.filter((u) => !u.online).length} samo u salonu`} />
                <StatPlocica ikona={Tag} ton="ok" oznaka="Prosečna cena" vrednost={rsd(prosek)} napomena="aktivne usluge" />
                <StatPlocica ikona={CalendarCheck} ton="akc" oznaka="Urađeno (30 dana)" vrednost={broj(ukupno30)} napomena="naplaćene usluge" />
            </MrezaPlocica>

            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <Pretraga vrednost={upit} onChange={setUpit} placeholder="Pretraži usluge…" className="sm:w-72" />
                <Tabovi aktivan={filter} onChange={setFilter} stavke={[
                    { id: 'sve', naziv: 'Sve', broj: podaci.usluge.length },
                    { id: 'aktivne', naziv: 'Aktivne', broj: aktivne.length },
                    { id: 'salon', naziv: 'Samo u salonu', broj: aktivne.filter((u) => !u.online).length },
                    { id: 'iskljucene', naziv: 'Isključene', broj: podaci.usluge.length - aktivne.length },
                ]} />
            </div>

            {!menjaUsluge && <p className="flex items-center gap-2 text-[13px] text-p-tiho"><Info className="h-4 w-4" aria-hidden="true" />Cenovnik menja vlasnik salona.</p>}

            {grupe.length === 0 && <Kartica><Prazno ikona={Scissors} naslov="Nema usluga za ovu pretragu" opis="Probajte drugi naziv ili filter." /></Kartica>}

            {grupe.map(({ k, sve, lista }) => (
                <Kartica key={k.id} naslov={k.naziv} opis={`${usluga(sve.length)}${k.za?.length ? ` · ${k.za.map((z) => ({ zene: 'žene', muskarci: 'muškarci', deca: 'deca' })[z] ?? z).join(', ')}` : ''}`} telo="p-0"
                    akcije={menjaUsluge && <Dugme velicina="sm" varijanta="tiho" ikona={Plus} onClick={() => setUredi({ kategorija: k.id })} aria-label={`Nova usluga u kategoriji ${k.naziv}`}>Dodaj</Dugme>}>
                    <div className={cx('hidden gap-3 border-b border-p-ivica/70 px-5 py-2 text-[11.5px] font-medium uppercase tracking-[.04em] text-p-tiho md:grid', KOLONE)}>
                        <span>Usluga</span><span>Trajanje</span><span className="text-right">Cena</span><span className="text-right">30 dana</span><span>Radnici</span><span className="text-center">Online</span><span className="text-center">Aktivna</span>
                    </div>
                    {lista.length === 0 ? <p className="px-5 py-4 text-[13px] text-p-tiho">U ovoj kategoriji još nema usluga.</p> : (
                        <ul className="divide-y divide-p-ivica/60">
                            {lista.map((u) => {
                                const rad = radniciUsluge[u.id] ?? [];
                                const naziv = (
                                    <>
                                        <span className={cx('block truncate text-sm font-medium', !u.aktivna && 'text-p-tiho line-through decoration-p-tiho/50')}>{u.naziv}</span>
                                        {u.opis && <span className="block truncate text-[12.5px] text-p-tiho">{u.opis}</span>}
                                    </>
                                );
                                return (
                                    <li key={u.id} className={cx('grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-2 px-4 py-3 sm:px-5', KOLONE, !u.aktivna && 'bg-p-meko/40')}>
                                        <div className="min-w-0">
                                            {menjaUsluge ? <button type="button" onClick={() => setUredi(u)} className="block w-full min-w-0 rounded text-left hover:text-p-akc focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-p-akc">{naziv}</button> : naziv}
                                            <span className="mt-1 flex flex-wrap items-center gap-x-2 text-[12.5px] text-p-tiho md:hidden tabularno">{trajanje(u.trajanje)} · {uradjeno[u.id] ?? 0}× u 30 dana</span>
                                        </div>
                                        <span className="hidden text-[13px] text-p-tiho tabularno md:block">{trajanje(u.trajanje)}</span>
                                        <span className="text-right text-sm font-semibold tabularno">{u.cenaOd && <span className="font-normal text-p-tiho">od </span>}{rsd(u.cena)}</span>
                                        <span className="hidden text-right text-[13px] tabularno md:block">{uradjeno[u.id] ? `${uradjeno[u.id]}×` : <span className="text-p-tiho">—</span>}</span>
                                        <span className="col-span-2 flex items-center justify-between gap-3 md:contents">
                                            <span className="md:flex md:items-center"><Radnici lista={rad} /></span>
                                            <span className="flex items-center gap-4 md:contents">
                                                <span className="flex items-center gap-1.5 md:justify-center"><span className="text-[12px] text-p-tiho md:hidden">Online</span><MaliPrekidac ukljuceno={u.online && u.aktivna} disabled={!menjaUsluge || !u.aktivna} oznaka={`Online zakazivanje: ${u.naziv}`} onChange={(v) => prebaci(u, 'online', v)} /></span>
                                                <span className="flex items-center gap-1.5 md:justify-center"><span className="text-[12px] text-p-tiho md:hidden">Aktivna</span><MaliPrekidac ukljuceno={u.aktivna} disabled={!menjaUsluge} oznaka={`Aktivna: ${u.naziv}`} onChange={(v) => prebaci(u, 'aktivna', v)} /></span>
                                            </span>
                                        </span>
                                    </li>
                                );
                            })}
                        </ul>
                    )}
                </Kartica>
            ))}

            {uredi && <UrediUslugu key={uredi.id ?? `nova-${uredi.kategorija ?? ''}`} cilj={uredi} onClose={zatvoriUredi} onObrisi={otvoriBrisanje} />}
            {brisi && <ObrisiUslugu u={brisi} onClose={zatvoriBrisi} />}
            {cene && <PromeniCene onClose={zatvoriCene} />}
        </div>
    );
}
