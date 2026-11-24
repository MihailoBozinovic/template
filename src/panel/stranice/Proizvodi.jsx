/*
 * PROIZVODI I MAGACIN — zalihe za prodaju, kao AllSeasons „Magacin”.
 * Prijem robe, prodaja i otpis menjaju stanje; „pri kraju” je sve ispod
 * minimuma, a porudžbenica predlaže količinu do dvostrukog minimuma.
 */
import React, { useCallback, useMemo, useState } from 'react';
import { AlertTriangle, ClipboardList, Globe, Package, PackageMinus, PackagePlus, Plus, Send, ShoppingBag, Wallet } from 'lucide-react';
import { usePanel } from '../podaci/Skladiste.jsx';
import { broj, mnozina, procenat, rsd } from '../format.js';
import { Dugme, Izbor, Kartica, Modal, MrezaPlocica, Polje, Prazno, Prekidac, Pretraga, StatPlocica, Tabela, Tabovi, Unos, ZaglavljeStrane, Znacka, cx } from '../ui.jsx';

const kom = (n) => `${broj(n)} kom`;
const proizvoda = (n) => `${n} ${mnozina(n, 'proizvod', 'proizvoda', 'proizvoda')}`;
const marza = (p) => (p.cena > 0 ? (p.cena - p.nabavna) / p.cena : 0);
const predlog = (p) => Math.max(1, p.minimum * 2 - p.stanje);
const RAZLOZI_OTPISA = ['Oštećeno pakovanje', 'Istekao rok', 'Potrošeno u salonu', 'Tester', 'Ostalo'];

function MaliPrekidac({ ukljuceno, onChange, oznaka }) {
    return (
        <button type="button" role="switch" aria-checked={!!ukljuceno} aria-label={oznaka} title={oznaka}
            onClick={(e) => { e.stopPropagation(); onChange(!ukljuceno); }}
            className={cx('relative h-5 w-9 shrink-0 rounded-full transition-colors', ukljuceno ? 'bg-p-akc' : 'bg-p-polje/60')}>
            <span className={cx('absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-[left]', ukljuceno ? 'left-[18px]' : 'left-0.5')} />
        </button>
    );
}

/* ── Prijem / prodaja / otpis ── */
const KRETANJA = {
    prijem: { naslov: 'Prijem robe', dugme: 'Primi na stanje', znak: 1 },
    prodaja: { naslov: 'Prodaja', dugme: 'Prodaj', znak: -1 },
    otpis: { naslov: 'Otpis', dugme: 'Otpiši', znak: -1 },
};

function Kretanje({ cilj, onClose }) {
    const { izmeni, obavesti, zapisi } = usePanel();
    const { p, vrsta } = cilj;
    const k = KRETANJA[vrsta];
    const [kol, setKol] = useState(vrsta === 'prijem' ? String(predlog(p)) : '1');
    const [razlog, setRazlog] = useState(RAZLOZI_OTPISA[0]);
    const n = Math.floor(Number(kol));
    const posle = p.stanje + k.znak * (Number.isFinite(n) ? n : 0);
    const ispravno = Number.isFinite(n) && n > 0 && posle >= 0;
    const iznos = n * (vrsta === 'prijem' ? p.nabavna : p.cena);

    const potvrdi = () => {
        izmeni('proizvodi', p.id, (x) => ({ stanje: x.stanje + k.znak * n, ...(vrsta === 'prodaja' ? { prodato30: x.prodato30 + n } : {}) }));
        const opis = `${p.brend} ${p.naziv}: ${k.znak > 0 ? '+' : '−'}${n} kom${vrsta === 'otpis' ? ` (${razlog.toLowerCase()})` : ''}`;
        zapisi('magacin', k.naslov, opis);
        obavesti(vrsta === 'prodaja' ? `Prodato ${n} × ${p.naziv} — ${rsd(iznos)}.` : vrsta === 'prijem' ? `Primljeno ${kom(n)} — na stanju ${kom(posle)}.` : `Otpisano ${kom(n)} — na stanju ${kom(posle)}.`);
        onClose();
    };

    return (
        <Modal otvoren onClose={onClose} naslov={k.naslov} opis={`${p.brend} · ${p.naziv}`}
            podnozje={<><Dugme onClick={onClose}>Otkaži</Dugme><Dugme varijanta={vrsta === 'otpis' ? 'opasno' : 'glavno'} onClick={potvrdi} disabled={!ispravno}>{k.dugme}</Dugme></>}>
            <div className="space-y-4">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3">
                    <Polje oznaka="Količina (kom)">
                        <Unos type="number" inputMode="numeric" min={1} step={1} value={kol} onChange={(e) => setKol(e.target.value)} className="tabularno" />
                    </Polje>
                    <div className="flex gap-1 pb-0.5">
                        {[1, 2, 5, 10].map((x) => <Dugme key={x} velicina="sm" varijanta={n === x ? 'glavno' : 'obicno'} onClick={() => setKol(String(x))}>{x}</Dugme>)}
                    </div>
                </div>
                {vrsta === 'otpis' && (
                    <Polje oznaka="Razlog">
                        <Izbor value={razlog} onChange={(e) => setRazlog(e.target.value)}>{RAZLOZI_OTPISA.map((r) => <option key={r}>{r}</option>)}</Izbor>
                    </Polje>
                )}
                <div className="divide-y divide-p-ivica/60 rounded-xl bg-p-meko/70 px-3 text-sm">
                    <div className="flex justify-between py-2"><span className="text-p-tiho">Na stanju sada</span><span className="font-medium tabularno">{kom(p.stanje)}</span></div>
                    <div className="flex justify-between py-2"><span className="text-p-tiho">Posle</span><span className={cx('font-semibold tabularno', posle < 0 ? 'text-p-greska' : posle < p.minimum ? 'text-p-upoz' : '')}>{kom(posle)}</span></div>
                    {vrsta !== 'otpis' && <div className="flex justify-between py-2"><span className="text-p-tiho">{vrsta === 'prijem' ? 'Po nabavnoj ceni' : 'Za naplatu'}</span><span className="font-semibold tabularno">{rsd(ispravno ? iznos : 0)}</span></div>}
                </div>
                {posle < 0 && <p className="text-[13px] text-p-greska">Na stanju nema toliko komada.</p>}
                {posle >= 0 && posle < p.minimum && vrsta !== 'prijem' && <p className="text-[13px] text-p-upoz">Stanje pada ispod minimuma ({p.minimum}) — proizvod ide na porudžbenicu.</p>}
            </div>
        </Modal>
    );
}

/* ── Novi proizvod / izmena ── */
function UrediProizvod({ cilj, brendovi, onClose }) {
    const { dodaj, izmeni, obavesti, zapisi, noviId } = usePanel();
    const nov = !cilj.id;
    const [f, setF] = useState(() => ({
        brend: cilj.brend ?? brendovi[0] ?? '', naziv: cilj.naziv ?? '', sifra: cilj.sifra ?? '', cena: String(cilj.cena ?? ''), nabavna: String(cilj.nabavna ?? ''),
        stanje: String(cilj.stanje ?? 0), minimum: String(cilj.minimum ?? 3), naSajtu: cilj.naSajtu ?? true,
    }));
    const p = (k) => (e) => setF((x) => ({ ...x, [k]: e.target.value }));
    const br = (k) => Math.max(0, Math.round(Number(f[k]) || 0));
    const ispravno = f.brend.trim() && f.naziv.trim() && f.cena !== '' && Number(f.cena) >= 0 && Number(f.nabavna) >= 0;
    const m = br('cena') > 0 ? (br('cena') - br('nabavna')) / br('cena') : 0;

    const sacuvaj = () => {
        const zapis = { brend: f.brend.trim(), naziv: f.naziv.trim(), sifra: f.sifra.trim(), cena: br('cena'), nabavna: br('nabavna'), stanje: br('stanje'), minimum: br('minimum'), naSajtu: f.naSajtu };
        if (nov) dodaj('proizvodi', { id: noviId('pr'), prodato30: 0, ...zapis });
        else izmeni('proizvodi', cilj.id, zapis);
        zapisi('magacin', nov ? 'Dodao proizvod' : 'Izmenio proizvod', `${zapis.brend} ${zapis.naziv}`);
        obavesti(nov ? `Proizvod „${zapis.naziv}” je dodat.` : 'Proizvod je sačuvan.');
        onClose();
    };

    return (
        <Modal otvoren onClose={onClose} naslov={nov ? 'Novi proizvod' : 'Izmena proizvoda'} opis={nov ? undefined : `${cilj.brend} · ${cilj.naziv}`}
            podnozje={<><Dugme onClick={onClose}>Otkaži</Dugme><Dugme varijanta="glavno" onClick={sacuvaj} disabled={!ispravno}>Sačuvaj</Dugme></>}>
            <div className="space-y-4">
                <div className="grid gap-3 sm:grid-cols-2">
                    <Polje oznaka="Brend">
                        <Unos value={f.brend} onChange={p('brend')} list="brendovi-proizvoda" placeholder="Npr. Olaplex" />
                        <datalist id="brendovi-proizvoda">{brendovi.map((b) => <option key={b} value={b} />)}</datalist>
                    </Polje>
                    <Polje oznaka="Šifra (barkod)"><Unos value={f.sifra} onChange={p('sifra')} inputMode="numeric" className="tabularno" /></Polje>
                </div>
                <Polje oznaka="Naziv"><Unos value={f.naziv} onChange={p('naziv')} placeholder="Npr. No.3 Hair Perfector 100 ml" /></Polje>
                <div className="grid grid-cols-2 gap-3">
                    <Polje oznaka="Prodajna cena (RSD)"><Unos type="number" inputMode="numeric" min={0} step={10} value={f.cena} onChange={p('cena')} className="tabularno" /></Polje>
                    <Polje oznaka="Nabavna cena (RSD)" pomoc={br('cena') ? `Marža ${procenat(m)}` : undefined}><Unos type="number" inputMode="numeric" min={0} step={10} value={f.nabavna} onChange={p('nabavna')} className="tabularno" /></Polje>
                    <Polje oznaka="Na stanju (kom)"><Unos type="number" inputMode="numeric" min={0} value={f.stanje} onChange={p('stanje')} className="tabularno" /></Polje>
                    <Polje oznaka="Minimum (kom)" pomoc="Ispod ovoga ide na porudžbenicu."><Unos type="number" inputMode="numeric" min={0} value={f.minimum} onChange={p('minimum')} className="tabularno" /></Polje>
                </div>
                <div className="rounded-xl border border-p-ivica px-3">
                    <Prekidac oznaka="Prikaži na sajtu" opis="U delu „Proizvodi koje koristimo”." ukljuceno={f.naSajtu} onChange={(v) => setF((x) => ({ ...x, naSajtu: v }))} />
                </div>
            </div>
        </Modal>
    );
}

/* ── Porudžbenica za dobavljače ── */
function Porudzbenica({ onClose }) {
    const { podaci, obavesti, zapisi } = usePanel();
    const nisko = useMemo(() => podaci.proizvodi.filter((p) => p.stanje < p.minimum), [podaci.proizvodi]);
    const [kol, setKol] = useState(() => Object.fromEntries(nisko.map((p) => [p.id, String(predlog(p))])));
    const n = (p) => Math.max(0, Math.floor(Number(kol[p.id]) || 0));
    const grupe = useMemo(() => {
        const m = {};
        for (const p of nisko) (m[p.brend] ??= []).push(p);
        return Object.entries(m).sort(([a], [b]) => a.localeCompare(b, 'sr'));
    }, [nisko]);
    const ukupnoKom = nisko.reduce((s, p) => s + n(p), 0);
    const ukupno = nisko.reduce((s, p) => s + n(p) * p.nabavna, 0);
    const brendova = grupe.filter(([, l]) => l.some((p) => n(p) > 0)).length;

    const posalji = () => {
        zapisi('magacin', 'Poslao porudžbenicu', `${brendova} ${mnozina(brendova, 'dobavljač', 'dobavljača', 'dobavljača')} · ${kom(ukupnoKom)} · ${rsd(ukupno)}`);
        obavesti(`Porudžbenica je poslata (demo): ${brendova} ${mnozina(brendova, 'dobavljaču', 'dobavljača', 'dobavljača')}, ${kom(ukupnoKom)}, ${rsd(ukupno)}.`);
        onClose();
    };

    return (
        <Modal otvoren onClose={onClose} naslov="Porudžbenica" opis="Proizvodi ispod minimuma; predlog dopunjuje do dvostrukog minimuma." sirina="max-w-2xl"
            podnozje={nisko.length ? <><Dugme onClick={onClose}>Zatvori</Dugme><Dugme varijanta="glavno" ikona={Send} onClick={posalji} disabled={!ukupnoKom}>Pošalji dobavljaču</Dugme></> : <Dugme onClick={onClose}>Zatvori</Dugme>}>
            {!nisko.length ? <Prazno ikona={Package} naslov="Sve je na stanju" opis="Nijedan proizvod nije ispod minimuma." /> : (
                <div className="space-y-4">
                    {grupe.map(([brend, lista]) => {
                        const zbirB = lista.reduce((s, p) => s + n(p) * p.nabavna, 0);
                        return (
                            <section key={brend} className="overflow-hidden rounded-xl border border-p-ivica">
                                <div className="flex items-center justify-between gap-3 bg-p-meko px-3 py-2">
                                    <span className="text-[13.5px] font-semibold">{brend}</span>
                                    <span className="text-[13px] font-medium tabularno">{rsd(zbirB)}</span>
                                </div>
                                <ul className="divide-y divide-p-ivica/60">
                                    {lista.map((p) => (
                                        <li key={p.id} className="grid grid-cols-[minmax(0,1fr)_76px] items-center gap-x-3 gap-y-1 px-3 py-2 sm:grid-cols-[minmax(0,1fr)_92px_76px_96px]">
                                            <div className="min-w-0">
                                                <div className="truncate text-[13.5px] font-medium">{p.naziv}</div>
                                                <div className="text-[12px] text-p-tiho tabularno">{p.sifra} · {rsd(p.nabavna)}/kom</div>
                                            </div>
                                            <span className="hidden text-[12.5px] text-p-tiho tabularno sm:block">stanje <b className="text-p-greska">{p.stanje}</b> / {p.minimum}</span>
                                            <Unos type="number" inputMode="numeric" min={0} value={kol[p.id] ?? ''} onChange={(e) => setKol((x) => ({ ...x, [p.id]: e.target.value }))} className="h-9 text-right tabularno" aria-label={`Količina: ${p.naziv}`} />
                                            <span className="col-span-2 text-right text-[13px] font-medium tabularno sm:col-span-1">{rsd(n(p) * p.nabavna)}</span>
                                        </li>
                                    ))}
                                </ul>
                            </section>
                        );
                    })}
                    <div className="flex items-center justify-between rounded-xl bg-p-staza px-3 py-2.5">
                        <span className="text-[13px] text-p-tiho">Ukupno po nabavnim cenama · <span className="tabularno">{kom(ukupnoKom)}</span></span>
                        <span className="text-base font-semibold text-p-akc tabularno">{rsd(ukupno)}</span>
                    </div>
                </div>
            )}
        </Modal>
    );
}

export default function Proizvodi() {
    const { podaci, izmeni, obavesti, zapisi } = usePanel();
    const [tab, setTab] = useState('svi');
    const [upit, setUpit] = useState('');
    const [brend, setBrend] = useState('');
    const [kretanje, setKretanje] = useState(null);
    const [uredi, setUredi] = useState(null);
    const [porudzbenica, setPorudzbenica] = useState(false);
    const zatvoriKretanje = useCallback(() => setKretanje(null), []);
    const zatvoriUredi = useCallback(() => setUredi(null), []);
    const zatvoriPor = useCallback(() => setPorudzbenica(false), []);

    const sve = podaci.proizvodi;
    const brendovi = useMemo(() => [...new Set(sve.map((p) => p.brend))].sort((a, b) => a.localeCompare(b, 'sr')), [sve]);
    const nisko = sve.filter((p) => p.stanje < p.minimum);
    const vrednost = sve.reduce((s, p) => s + p.stanje * p.nabavna, 0);
    const komada = sve.reduce((s, p) => s + p.stanje, 0);
    const prodato = sve.reduce((s, p) => s + p.prodato30, 0);
    const prodatoIznos = sve.reduce((s, p) => s + p.prodato30 * p.cena, 0);

    const redovi = useMemo(() => {
        const q = upit.trim().toLowerCase();
        return sve.filter((p) => (tab === 'svi' || (tab === 'nisko' && p.stanje < p.minimum) || (tab === 'sajt' && p.naSajtu))
            && (!brend || p.brend === brend)
            && (!q || `${p.brend} ${p.naziv} ${p.sifra}`.toLowerCase().includes(q)));
    }, [sve, tab, brend, upit]);

    const naSajtu = (p, v) => {
        izmeni('proizvodi', p.id, { naSajtu: v });
        zapisi('magacin', v ? 'Prikazao proizvod na sajtu' : 'Sklonio proizvod sa sajta', `${p.brend} ${p.naziv}`);
        obavesti(`${p.naziv}: ${v ? 'vidi se na sajtu' : 'sklonjen sa sajta'}.`);
    };

    const kolone = [
        { kljuc: 'naziv', naslov: 'Proizvod', className: 'min-w-[220px]', sortVrednost: (p) => `${p.brend} ${p.naziv}`, render: (p) => (
            <button type="button" onClick={() => setUredi(p)} className="block min-w-0 text-left hover:text-p-akc" title="Izmeni proizvod">
                <span className="block font-medium">{p.naziv}</span>
                <span className="block text-[12.5px] text-p-tiho">{p.brend}</span>
            </button>
        ) },
        { kljuc: 'sifra', naslov: 'Šifra', render: (p) => <span className="text-[12.5px] text-p-tiho tabularno">{p.sifra}</span> },
        { kljuc: 'cena', naslov: 'Cena', desno: true, render: (p) => <span className="whitespace-nowrap font-medium">{rsd(p.cena)}</span> },
        { kljuc: 'nabavna', naslov: 'Nabavna', desno: true, render: (p) => <span className="whitespace-nowrap text-p-tiho">{rsd(p.nabavna)}</span> },
        { kljuc: 'marza', naslov: 'Marža', desno: true, sortVrednost: marza, render: (p) => procenat(marza(p)) },
        { kljuc: 'stanje', naslov: 'Stanje', desno: true, render: (p) => (p.stanje < p.minimum ? <Znacka ton="greska">{p.stanje}</Znacka> : <span className="font-medium">{p.stanje}</span>) },
        { kljuc: 'minimum', naslov: 'Min.', desno: true, render: (p) => <span className="text-p-tiho">{p.minimum}</span> },
        { kljuc: 'prodato30', naslov: 'Prodato 30d', desno: true },
        { kljuc: 'naSajtu', naslov: 'Sajt', sortVrednost: (p) => (p.naSajtu ? 1 : 0), render: (p) => <MaliPrekidac ukljuceno={p.naSajtu} oznaka={`Na sajtu: ${p.naziv}`} onChange={(v) => naSajtu(p, v)} /> },
        { kljuc: 'akcije', naslov: '', sort: false, desno: true, render: (p) => (
            <span className="inline-flex gap-0.5">
                <Dugme velicina="ikonaSm" varijanta="tiho" ikona={PackagePlus} title="Prijem robe" aria-label={`Prijem robe: ${p.naziv}`} onClick={() => setKretanje({ p, vrsta: 'prijem' })} />
                <Dugme velicina="ikonaSm" varijanta="tiho" ikona={ShoppingBag} title="Prodaja" aria-label={`Prodaja: ${p.naziv}`} onClick={() => setKretanje({ p, vrsta: 'prodaja' })} disabled={p.stanje < 1} />
                <Dugme velicina="ikonaSm" varijanta="tiho" ikona={PackageMinus} title="Otpis" aria-label={`Otpis: ${p.naziv}`} onClick={() => setKretanje({ p, vrsta: 'otpis' })} disabled={p.stanje < 1} />
            </span>
        ) },
    ];

    return (
        <div className="flex flex-col gap-4">
            <ZaglavljeStrane naslov="Proizvodi i magacin" opis="Zalihe za prodaju u salonu: prijem, prodaja, otpis i porudžbenica za dobavljače."
                akcije={(
                    <>
                        <Dugme ikona={ClipboardList} onClick={() => setPorudzbenica(true)} kratko="Porudžbenica">Napravi porudžbenicu{nisko.length ? ` (${nisko.length})` : ''}</Dugme>
                        <Dugme varijanta="glavno" ikona={Plus} onClick={() => setUredi({})} kratko="Novi">Novi proizvod</Dugme>
                    </>
                )} />

            <MrezaPlocica>
                <StatPlocica ikona={Wallet} oznaka="Vrednost zaliha" vrednost={rsd(vrednost)} napomena="po nabavnoj ceni" />
                <StatPlocica ikona={Package} ton="info" oznaka="Artikala" vrednost={sve.length} napomena={`${kom(komada)} na stanju`} />
                <StatPlocica ikona={AlertTriangle} ton={nisko.length ? 'greska' : 'ok'} oznaka="Pri kraju" vrednost={nisko.length} napomena={nisko.length ? 'ispod minimuma' : 'sve je na stanju'} />
                <StatPlocica ikona={ShoppingBag} ton="ok" oznaka="Prodato u 30 dana" vrednost={kom(prodato)} napomena={rsd(prodatoIznos)} />
            </MrezaPlocica>

            <Kartica telo="p-0">
                <div className="flex flex-col gap-2 border-b border-p-ivica/70 px-4 py-3 sm:px-5 lg:flex-row lg:items-center">
                    <Tabovi aktivan={tab} onChange={setTab} stavke={[
                        { id: 'svi', naziv: 'Svi', broj: sve.length },
                        { id: 'nisko', naziv: 'Pri kraju', broj: nisko.length },
                        { id: 'sajt', naziv: 'Na sajtu', broj: sve.filter((p) => p.naSajtu).length },
                    ]} />
                    <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,.8fr)] gap-2 lg:ml-auto lg:w-[460px]">
                        <Pretraga vrednost={upit} onChange={setUpit} placeholder="Naziv, brend, šifra…" />
                        <Izbor value={brend} onChange={(e) => setBrend(e.target.value)} aria-label="Brend">
                            <option value="">Svi brendovi</option>
                            {brendovi.map((b) => <option key={b} value={b}>{b}</option>)}
                        </Izbor>
                    </div>
                </div>
                {tab === 'nisko' && nisko.length > 0 && (
                    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-p-ivica/70 bg-p-greskabg px-4 py-2.5 text-[13px] text-p-greska sm:px-5">
                        <span className="flex items-center gap-2"><AlertTriangle className="h-4 w-4" aria-hidden="true" />{proizvoda(nisko.length)} ispod minimuma</span>
                        <Dugme velicina="sm" ikona={ClipboardList} onClick={() => setPorudzbenica(true)}>Napravi porudžbenicu</Dugme>
                    </div>
                )}
                <Tabela kolone={kolone} redovi={redovi} gusto pocetnoSort={{ kljuc: 'naziv', smer: 'rastuce' }}
                    prazno={<Prazno ikona={tab === 'sajt' ? Globe : Package} naslov={upit || brend ? 'Nema proizvoda za ovu pretragu' : tab === 'nisko' ? 'Ništa nije pri kraju' : 'Nema proizvoda'} />} />
            </Kartica>

            {kretanje && <Kretanje key={`${kretanje.p.id}-${kretanje.vrsta}`} cilj={kretanje} onClose={zatvoriKretanje} />}
            {uredi && <UrediProizvod key={uredi.id ?? 'novi'} cilj={uredi} brendovi={brendovi} onClose={zatvoriUredi} />}
            {porudzbenica && <Porudzbenica onClose={zatvoriPor} />}
        </div>
    );
}
