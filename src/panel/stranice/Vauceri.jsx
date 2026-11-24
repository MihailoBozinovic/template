/*
 * VAUČERI — poklon vaučeri: izdavanje, delimično iskorišćenje, produženje
 * roka i poništavanje. Preostalo = iznos − iskorišćeno; vaučer koji je
 * istekao po datumu prikazuje se kao istekao i kad u podacima piše „aktivan”.
 */
import React, { useMemo, useState } from 'react';
import { CalendarClock, CalendarPlus, Check, Gift, Plus, Send, Ticket, Wallet, XCircle } from 'lucide-react';
import { imeKlijenta, useIndeksi, usePanel } from '../podaci/Skladiste.jsx';
import { broj, danas as danasF, datumBrojevi, datumKratko, dodajDane, mnozina, razlikaDana, rsd } from '../format.js';
import { Dugme, Fioka, Kartica, Merac, Modal, MrezaPlocica, Polje, Prazno, Pretraga, RedDetalja, StatPlocica, Tabela, Tabovi, TekstPolje, Unos, ZaglavljeStrane, Znacka, cx } from '../ui.jsx';

const ZNAKOVI = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const IZNOSI = [2000, 3000, 5000, 10000];
const STATUSI = {
    aktivan: { naziv: 'Aktivan', ton: 'ok' },
    iskoriscen: { naziv: 'Iskorišćen', ton: 'tiho' },
    istekao: { naziv: 'Istekao', ton: 'greska' },
    ponisten: { naziv: 'Poništen', ton: 'tiho' },
};

/** Status po stanju i datumu, ne samo po zapisu. */
const statusVaucera = (v, d) => {
    if (v.ponisten) return 'ponisten';
    if (v.iskorisceno >= v.iznos) return 'iskoriscen';
    if (v.vaziDo < d) return 'istekao';
    return 'aktivan';
};
const preostalo = (v) => Math.max(0, v.iznos - v.iskorisceno);

/** Prefiks koda: inicijali kratkog naziva (2+ reči) ili prva dva slova. */
const prefiksKoda = (ps) => {
    const ime = (ps?.kratkiNaziv || ps?.naziv || 'Salon').normalize('NFD').replace(/[^A-Za-z\s]/g, '');
    const reci = ime.trim().split(/\s+/).filter(Boolean);
    return (reci.length > 1 ? reci.map((r) => r[0]).join('') : reci[0] ?? 'SV').slice(0, 2).toUpperCase().padEnd(2, 'V');
};
const noviKod = (pref, postojeci) => {
    for (let i = 0; i < 50; i++) {
        const k = `${pref}-${Array.from({ length: 4 }, () => ZNAKOVI[Math.floor(Math.random() * ZNAKOVI.length)]).join('')}`;
        if (!postojeci.has(k)) return k;
    }
    return `${pref}-${Date.now().toString(36).slice(-4).toUpperCase()}`;
};

/* ── Izgled vaučera (pregled kartice) ── */
function KarticaVaucera({ naziv, iznos, kod, vaziDo, poruka, primalac, status }) {
    return (
        <div className="relative overflow-hidden rounded-2xl bg-p-sidebar p-5 text-p-sidebarink shadow-lg">
            <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full border border-p-zlato/25" aria-hidden="true" />
            <div className="pointer-events-none absolute -right-2 top-12 h-24 w-24 rounded-full border border-p-zlato/15" aria-hidden="true" />
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <div className="text-[11px] font-semibold uppercase tracking-[.18em] text-p-zlato">Poklon vaučer</div>
                    <div className="mt-1 truncate text-[15px] font-medium">{naziv}</div>
                </div>
                <Gift className="h-5 w-5 shrink-0 text-p-zlato" aria-hidden="true" />
            </div>
            <div className="mt-6 text-[34px] font-semibold leading-none tracking-tight tabularno">{broj(iznos)} <span className="text-base font-medium text-p-sidebarink/70">RSD</span></div>
            {primalac && <div className="mt-2 text-[13px] text-p-sidebarink/75">za: {primalac}</div>}
            {poruka && <p className="mt-3 text-[13.5px] italic leading-snug text-p-sidebarink/90">„{poruka}”</p>}
            <div className="mt-5 flex items-end justify-between gap-3 border-t border-dashed border-p-sidebarink/20 pt-3">
                <div>
                    <div className="text-[10.5px] uppercase tracking-[.14em] text-p-sidebarink/55">Kod</div>
                    <div className="font-mono text-[17px] font-semibold tracking-[.12em]">{kod}</div>
                </div>
                <div className="text-right">
                    <div className="text-[10.5px] uppercase tracking-[.14em] text-p-sidebarink/55">Važi do</div>
                    <div className="text-[13.5px] font-medium tabularno">{vaziDo ? datumBrojevi(vaziDo) : '—'}</div>
                </div>
            </div>
            {status && status !== 'aktivan' && (
                <div className="absolute right-4 top-1/2 -translate-y-1/2 rotate-[-12deg] rounded-md border-2 border-p-zlato/70 px-2 py-0.5 text-[13px] font-bold uppercase tracking-[.14em] text-p-zlato/90">{STATUSI[status].naziv}</div>
            )}
        </div>
    );
}

/* ── Detalj vaučera ── */
function DetaljVaucera({ v, onClose }) {
    const { podaci, izmeni, obavesti, zapisi } = usePanel();
    const indeks = useIndeksi();
    const d = danasF();
    const [iznos, setIznos] = useState('');
    const [ponisti, setPonisti] = useState(false);
    if (!v) return null;
    const st = statusVaucera(v, d);
    const ostalo = preostalo(v);
    const kupac = indeks.klijent[v.kupacId];
    const unos = Math.round(Number(String(iznos).replace(/\./g, '').replace(',', '.')) || 0);
    const ispravno = unos > 0 && unos <= ostalo;

    const iskoristi = () => {
        if (!ispravno) return;
        const novo = v.iskorisceno + unos;
        izmeni('vauceri', v.id, { iskorisceno: novo, status: novo >= v.iznos ? 'iskoriscen' : 'aktivan' });
        zapisi('vaucer', 'Iskoristio vaučer', `${v.kod} · ${rsd(unos)}`);
        obavesti(novo >= v.iznos ? `Vaučer ${v.kod} je iskorišćen do kraja.` : `Skinuto ${rsd(unos)} — ostaje ${rsd(v.iznos - novo)}.`);
        setIznos('');
    };
    const produzi = () => {
        const vaziDo = dodajDane(v.vaziDo > d ? v.vaziDo : d, 90);
        izmeni('vauceri', v.id, { vaziDo, status: ostalo > 0 ? 'aktivan' : 'iskoriscen', ponisten: false });
        zapisi('vaucer', 'Produžio rok vaučera', `${v.kod} · do ${datumBrojevi(vaziDo)}`);
        obavesti(`Rok produžen do ${datumBrojevi(vaziDo)}.`);
    };
    const ponistiVaucer = () => {
        izmeni('vauceri', v.id, { status: 'istekao', ponisten: true });
        zapisi('vaucer', 'Poništio vaučer', v.kod);
        obavesti(`Vaučer ${v.kod} je poništen.`, 'info');
        setPonisti(false);
    };

    return (
        <Fioka otvoren onClose={onClose} naslov={`Vaučer ${v.kod}`} podnaslov={`Izdat ${datumBrojevi(v.izdat)} · ${v.vrsta === 'poklon' ? 'poklon salona' : 'plaćen'}`}
            podnozje={(
                <>
                    {st !== 'ponisten' && st !== 'iskoriscen' && <Dugme varijanta="opasnoTiho" ikona={XCircle} onClick={() => setPonisti(true)} className="mr-auto">Poništi</Dugme>}
                    <Dugme onClick={onClose}>Zatvori</Dugme>
                </>
            )}>
            <KarticaVaucera naziv={podaci.podaciSalona?.naziv} iznos={v.iznos} kod={v.kod} vaziDo={v.vaziDo} poruka={v.poruka} primalac={v.primalac} status={st} />

            <div className="mt-5">
                <div className="flex items-baseline justify-between text-sm">
                    <span className="text-p-tiho">Preostalo</span>
                    <span className="font-semibold tabularno">{rsd(ostalo)} <span className="font-normal text-p-tiho">od {rsd(v.iznos)}</span></span>
                </div>
                <Merac className="mt-2" vrednost={v.iznos ? ostalo / v.iznos : 0} ton={ostalo ? 'graf' : 'ok'} oznaka="Preostalo na vaučeru" />
            </div>

            <div className="mt-4">
                <RedDetalja oznaka="Status"><Znacka ton={STATUSI[st].ton} tacka>{STATUSI[st].naziv}</Znacka></RedDetalja>
                <RedDetalja oznaka="Primalac">{v.primalac || '—'}</RedDetalja>
                <RedDetalja oznaka="Kupac">{kupac ? <>{imeKlijenta(kupac)}<div className="text-[12.5px] font-normal text-p-tiho tabularno">{kupac.telefon}</div></> : '—'}</RedDetalja>
                <RedDetalja oznaka="Važi do"><span className="tabularno">{datumBrojevi(v.vaziDo)}</span>{st === 'aktivan' && <div className="text-[12.5px] font-normal text-p-tiho">još {razlikaDana(d, v.vaziDo)} {mnozina(razlikaDana(d, v.vaziDo), 'dan', 'dana', 'dana')}</div>}</RedDetalja>
            </div>

            {st === 'aktivan' && (
                <div className="mt-5 rounded-xl border border-p-ivica bg-p-meko/50 p-4">
                    <div className="text-sm font-semibold">Iskoristi vaučer</div>
                    <p className="mt-0.5 text-[13px] text-p-tiho">Unesite iznos računa koji se plaća vaučerom.</p>
                    <div className="mt-3 flex gap-2">
                        <Unos inputMode="numeric" value={iznos} onChange={(e) => setIznos(e.target.value.replace(/[^\d.,]/g, ''))} placeholder={`do ${broj(ostalo)}`} aria-label="Iznos za iskorišćenje" onKeyDown={(e) => e.key === 'Enter' && iskoristi()} />
                        <Dugme varijanta="glavno" ikona={Check} disabled={!ispravno} onClick={iskoristi}>Iskoristi</Dugme>
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1.5">
                        <button type="button" onClick={() => setIznos(String(ostalo))} className="rounded-lg border border-p-ivica bg-p-karta px-2 py-1 text-[12px] font-medium hover:border-p-akc">Ceo iznos · {broj(ostalo)}</button>
                        {unos > ostalo && <span className="self-center text-[12px] text-p-greska">Više od preostalog iznosa.</span>}
                    </div>
                </div>
            )}

            <div className="mt-4 grid grid-cols-2 gap-2">
                <Dugme ikona={CalendarPlus} onClick={produzi} disabled={st === 'iskoriscen'} className="justify-center">Produži rok</Dugme>
                <Dugme ikona={Send} onClick={() => obavesti(`Vaučer je poslat porukom${kupac ? ` na ${kupac.telefon}` : ''} (demo).`, 'info')} className="justify-center">Pošalji porukom</Dugme>
            </div>
            <p className="mt-2 text-[12px] text-p-tiho">Produženje dodaje 90 dana na rok (ili od danas, ako je već istekao).</p>

            <Modal otvoren={ponisti} onClose={() => setPonisti(false)} naslov="Poništiti vaučer?" opis={`${v.kod} · preostalo ${rsd(ostalo)}`}
                podnozje={<><Dugme onClick={() => setPonisti(false)}>Odustani</Dugme><Dugme varijanta="opasno" onClick={ponistiVaucer} data-fokus>Poništi vaučer</Dugme></>}>
                <p className="text-sm text-p-tiho">Vaučer više neće moći da se iskoristi ni na pultu ni pri online zakazivanju. Zapis ostaje u evidenciji.</p>
            </Modal>
        </Fioka>
    );
}

/* ── Novi vaučer ── */
function NoviVaucer({ otvoren, onClose, onKreiran }) {
    const { podaci, dodaj, noviId, obavesti, zapisi } = usePanel();
    const d = danasF();
    const prazno = { iznos: 5000, drugi: '', vrsta: 'placen', kupacId: null, pretraga: '', primalac: '', poruka: '' };
    const [f, setF] = useState(prazno);
    const postavi = (k, v) => setF((s) => ({ ...s, [k]: v }));
    const iznos = f.drugi ? Math.round(Number(f.drugi.replace(/\./g, '')) || 0) : f.iznos;
    const vaziDo = dodajDane(d, 182);
    const pref = prefiksKoda(podaci.podaciSalona);
    const [kod, setKod] = useState('');
    const kodPrikaz = kod || `${pref}-····`;

    const kupac = podaci.klijenti.find((k) => k.id === f.kupacId);
    const pogodci = useMemo(() => {
        const q = f.pretraga.trim().toLowerCase();
        if (q.length < 2) return [];
        const cifre = q.replace(/\D/g, '');
        return podaci.klijenti.filter((k) => `${k.ime} ${k.prezime}`.toLowerCase().includes(q) || (cifre.length >= 3 && k.telefon.replace(/\D/g, '').includes(cifre))).slice(0, 6);
    }, [f.pretraga, podaci.klijenti]);

    const zatvori = () => { setF(prazno); setKod(''); onClose(); };
    const sacuvaj = () => {
        if (iznos < 500) return;
        const k = kod || noviKod(pref, new Set(podaci.vauceri.map((x) => x.kod)));
        const stavka = { id: noviId('v'), kod: k, iznos, iskorisceno: 0, izdat: d, vaziDo, status: 'aktivan', vrsta: f.vrsta, kupacId: f.kupacId, primalac: f.primalac.trim(), poruka: f.poruka.trim() };
        dodaj('vauceri', stavka);
        zapisi('vaucer', 'Izdao vaučer', `${k} · ${rsd(iznos)}`);
        obavesti(`Vaučer ${k} na ${rsd(iznos)} je izdat.`);
        setF(prazno); setKod('');
        onKreiran?.(stavka);
    };

    return (
        <Modal otvoren={otvoren} onClose={zatvori} naslov="Novi vaučer" opis="Važi 6 meseci od danas" sirina="max-w-2xl"
            podnozje={<><Dugme onClick={zatvori}>Odustani</Dugme><Dugme varijanta="glavno" ikona={Gift} disabled={iznos < 500} onClick={sacuvaj}>Izdaj vaučer · {rsd(iznos)}</Dugme></>}>
            <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_260px]">
                <div className="space-y-4">
                    <Polje oznaka="Iznos">
                        <div className="flex flex-wrap gap-2">
                            {IZNOSI.map((x) => (
                                <button key={x} type="button" onClick={() => setF((s) => ({ ...s, iznos: x, drugi: '' }))}
                                    className={cx('rounded-xl border px-3 py-2 text-sm font-medium tabularno transition-colors', !f.drugi && f.iznos === x ? 'border-p-akc bg-p-staza text-p-akc' : 'border-p-ivica hover:border-p-akc/60')}>
                                    {broj(x)}
                                </button>
                            ))}
                            <Unos className="w-32" inputMode="numeric" placeholder="Drugi iznos" value={f.drugi} onChange={(e) => postavi('drugi', e.target.value.replace(/[^\d.]/g, ''))} aria-label="Drugi iznos" />
                        </div>
                        {f.drugi && iznos < 500 && <span className="mt-1 block text-[12px] text-p-greska">Najmanje 500 RSD.</span>}
                    </Polje>
                    <Polje oznaka="Vrsta">
                        <Tabovi stavke={[{ id: 'placen', naziv: 'Plaćen' }, { id: 'poklon', naziv: 'Poklon salona' }]} aktivan={f.vrsta} onChange={(v) => postavi('vrsta', v)} />
                    </Polje>
                    <Polje oznaka="Kupac" pomoc="Klijent koji plaća vaučer (nije obavezno).">
                        {kupac ? (
                            <div className="flex items-center justify-between gap-2 rounded-[10px] border border-p-ivica bg-p-meko/50 px-3 py-2">
                                <span className="min-w-0 truncate text-sm font-medium">{imeKlijenta(kupac)} <span className="font-normal text-p-tiho tabularno">· {kupac.telefon}</span></span>
                                <button type="button" className="text-[12.5px] font-medium text-p-akc hover:underline" onClick={() => setF((s) => ({ ...s, kupacId: null, pretraga: '' }))}>Promeni</button>
                            </div>
                        ) : (
                            <div className="relative">
                                <Pretraga vrednost={f.pretraga} onChange={(v) => postavi('pretraga', v)} placeholder="Ime ili telefon klijenta" />
                                {pogodci.length > 0 && (
                                    <ul className="absolute inset-x-0 top-full z-10 mt-1 overflow-hidden rounded-xl border border-p-ivica bg-p-karta shadow-lg">
                                        {pogodci.map((k) => (
                                            <li key={k.id}>
                                                <button type="button" onClick={() => setF((s) => ({ ...s, kupacId: k.id, pretraga: '', primalac: s.primalac }))} className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm hover:bg-p-meko">
                                                    <span>{imeKlijenta(k)}</span><span className="text-[12.5px] text-p-tiho tabularno">{k.telefon}</span>
                                                </button>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        )}
                    </Polje>
                    <Polje oznaka="Primalac" pomoc="Ime osobe kojoj se vaučer poklanja.">
                        <Unos value={f.primalac} onChange={(e) => postavi('primalac', e.target.value)} placeholder="npr. Jelena Petrović" />
                    </Polje>
                    <Polje oznaka="Poruka na vaučeru">
                        <TekstPolje value={f.poruka} onChange={(e) => postavi('poruka', e.target.value.slice(0, 140))} placeholder="Srećan rođendan!" className="min-h-[64px]" />
                        <span className="mt-1 block text-right text-[11.5px] text-p-tiho tabularno">{f.poruka.length}/140</span>
                    </Polje>
                </div>
                <div>
                    <div className="mb-1.5 text-[13px] font-medium">Pregled</div>
                    <KarticaVaucera naziv={podaci.podaciSalona?.naziv} iznos={iznos} kod={kodPrikaz} vaziDo={vaziDo} poruka={f.poruka.trim()} primalac={f.primalac.trim()} />
                    <button type="button" onClick={() => setKod(noviKod(pref, new Set(podaci.vauceri.map((x) => x.kod))))} className="mt-2 text-[12.5px] font-medium text-p-akc hover:underline">{kod ? 'Drugi kod' : 'Napravi kod sada'}</button>
                    <p className="mt-1 text-[12px] text-p-tiho">Kod se pravi sam pri izdavanju, ako ga ne napravite ovde.</p>
                </div>
            </div>
        </Modal>
    );
}

export default function Vauceri() {
    const { podaci } = usePanel();
    const indeks = useIndeksi();
    const d = danasF();
    const [tab, setTab] = useState('aktivan');
    const [q, setQ] = useState('');
    const [izabranId, setIzabranId] = useState(null);
    const [novi, setNovi] = useState(false);

    const sa = useMemo(() => podaci.vauceri.map((v) => ({ ...v, st: statusVaucera(v, d), ostalo: preostalo(v) })), [podaci.vauceri, d]);
    const brojke = useMemo(() => {
        const aktivni = sa.filter((v) => v.st === 'aktivan');
        const mOd = `${d.slice(0, 8)}01`;
        const prodato = sa.filter((v) => v.vrsta === 'placen' && v.izdat >= mOd && !v.ponisten);
        const istice = aktivni.filter((v) => razlikaDana(d, v.vaziDo) <= 30);
        return { aktivni: aktivni.length, vrednost: aktivni.reduce((s, v) => s + v.ostalo, 0), prodato: prodato.reduce((s, v) => s + v.iznos, 0), prodatoBroj: prodato.length, istice: istice.length, isticeIznos: istice.reduce((s, v) => s + v.ostalo, 0) };
    }, [sa, d]);

    const poTabu = (id) => (id === 'svi' ? sa : id === 'istekao' ? sa.filter((v) => v.st === 'istekao' || v.st === 'ponisten') : sa.filter((v) => v.st === id));
    const upit = q.trim().toLowerCase();
    const redovi = poTabu(tab).filter((v) => !upit || v.kod.toLowerCase().includes(upit) || v.primalac.toLowerCase().includes(upit) || imeKlijenta(indeks.klijent[v.kupacId]).toLowerCase().includes(upit));
    const izabran = podaci.vauceri.find((v) => v.id === izabranId);

    const kolone = [
        { kljuc: 'kod', naslov: 'Kod', render: (v) => <span className="whitespace-nowrap font-mono text-[13px] font-semibold tracking-[.06em]">{v.kod}</span> },
        { kljuc: 'iznos', naslov: 'Iznos', desno: true, render: (v) => rsd(v.iznos) },
        {
            kljuc: 'ostalo', naslov: 'Preostalo', className: 'min-w-[150px]', render: (v) => (
                <div>
                    <div className="text-[13px] font-medium tabularno">{rsd(v.ostalo)}</div>
                    <Merac className="mt-1 h-1.5" vrednost={v.iznos ? v.ostalo / v.iznos : 0} oznaka={`Preostalo ${v.kod}`} />
                </div>
            ),
        },
        { kljuc: 'primalac', naslov: 'Primalac', render: (v) => v.primalac || <span className="text-p-tiho">—</span> },
        { kljuc: 'kupac', naslov: 'Kupac', sortVrednost: (v) => imeKlijenta(indeks.klijent[v.kupacId]), render: (v) => (v.kupacId ? imeKlijenta(indeks.klijent[v.kupacId]) : <span className="text-p-tiho">{v.vrsta === 'poklon' ? 'poklon salona' : '—'}</span>) },
        { kljuc: 'izdat', naslov: 'Izdat', render: (v) => <span className="whitespace-nowrap text-p-tiho tabularno">{datumKratko(v.izdat)}</span> },
        {
            kljuc: 'vaziDo', naslov: 'Važi do', render: (v) => {
                const dana = razlikaDana(d, v.vaziDo);
                const blizu = v.st === 'aktivan' && dana <= 30;
                return (
                    <span className={cx('inline-flex items-center gap-1 whitespace-nowrap tabularno', blizu && 'font-medium text-p-upoz')}>
                        {blizu && <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" />}
                        {datumBrojevi(v.vaziDo)}
                        {blizu && <span className="text-[12px]">· {dana} d</span>}
                    </span>
                );
            },
        },
        { kljuc: 'st', naslov: 'Status', render: (v) => <Znacka ton={STATUSI[v.st].ton} tacka>{STATUSI[v.st].naziv}</Znacka> },
    ];

    return (
        <div className="flex flex-col gap-4">
            <ZaglavljeStrane naslov="Vaučeri" opis="Poklon vaučeri: izdavanje, iskorišćenje na pultu i rok važenja."
                akcije={<Dugme varijanta="glavno" ikona={Plus} onClick={() => setNovi(true)} kratko="Novi">Novi vaučer</Dugme>} />
            <MrezaPlocica>
                <StatPlocica ikona={Ticket} oznaka="Aktivnih vaučera" vrednost={brojke.aktivni} napomena="mogu da se iskoriste" />
                <StatPlocica ikona={Wallet} ton="info" oznaka="Vrednost aktivnih" vrednost={rsd(brojke.vrednost)} napomena="preostalo za iskorišćenje" info="Zbir iznosa umanjenih za već iskorišćeno — obaveza salona prema klijentima." />
                <StatPlocica ikona={Gift} ton="ok" oznaka="Prodato ovog meseca" vrednost={rsd(brojke.prodato)} napomena={`${brojke.prodatoBroj} ${mnozina(brojke.prodatoBroj, 'vaučer', 'vaučera', 'vaučera')}, bez poklona`} />
                <StatPlocica ikona={CalendarClock} ton={brojke.istice ? 'upoz' : 'tiho'} oznaka="Ističe u 30 dana" vrednost={brojke.istice} napomena={brojke.istice ? `${rsd(brojke.isticeIznos)} neiskorišćeno` : 'nijedan uskoro'} />
            </MrezaPlocica>
            <Kartica telo="p-0">
                <div className="flex flex-col gap-3 border-b border-p-ivica/70 p-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                    <Tabovi aktivan={tab} onChange={setTab} stavke={[
                        { id: 'aktivan', naziv: 'Aktivni', broj: poTabu('aktivan').length },
                        { id: 'iskoriscen', naziv: 'Iskorišćeni', broj: poTabu('iskoriscen').length },
                        { id: 'istekao', naziv: 'Istekli', broj: poTabu('istekao').length },
                        { id: 'svi', naziv: 'Svi', broj: sa.length },
                    ]} />
                    <Pretraga vrednost={q} onChange={setQ} placeholder="Kod, primalac ili kupac" className="sm:w-72" />
                </div>
                <Tabela kolone={kolone} redovi={redovi} onRed={(v) => setIzabranId(v.id)} pocetnoSort={{ kljuc: 'izdat', smer: 'opadajuce' }}
                    prazno={<Prazno ikona={Ticket} naslov={upit ? 'Nema vaučera za ovu pretragu' : 'Nema vaučera u ovoj grupi'} opis={upit ? 'Proverite kod ili ime primaoca.' : 'Novi vaučer se izdaje dugmetom gore desno.'} />} />
            </Kartica>
            {izabran && <DetaljVaucera key={izabran.id} v={izabran} onClose={() => setIzabranId(null)} />}
            <NoviVaucer otvoren={novi} onClose={() => setNovi(false)} onKreiran={(v) => { setNovi(false); setTab('aktivan'); setIzabranId(v.id); }} />
        </div>
    );
}
