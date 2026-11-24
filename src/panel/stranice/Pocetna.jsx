/*
 * POČETNA PANELA — kao AllSeasons AdminDashboardPage: prvo ono što čeka
 * (zahtevi, lista čekanja, odsustva, zalihe), pa brojke dana, pa dan po
 * radniku, pa poslovanje (samo vlasnik), a indeks stranica na kraju.
 * Zaposleni umesto toga vidi „Moj dan”.
 */
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { AlertCircle, ArrowRight, Banknote, BellRing, CalendarCheck, CalendarDays, CalendarPlus, Gauge, Hourglass, Package, Star, Umbrella, UserPlus, Wallet } from 'lucide-react';
import { usePanel, useIndeksi, useDozvole } from '../podaci/Skladiste.jsx';
import { AKTIVNI, naplaceni, prethodniPeriod, prometPoDanu, promena, poUslugama, poRadnicima, slobodniProzori, zauzetostDana, zbir } from '../podaci/analitika.js';
import { danas as danasF, danUNedelji, datumKratko, datumSaDanomDugo, dodajDane, pocetakMeseca, procenat, rsd, rsdKratko, sadaMinut, termina, uSate } from '../format.js';
import { Avatar, Dugme, Kartica, Merac, MrezaPlocica, NACINI_PLACANJA, Prazno, StatPlocica, ZaglavljeStrane, cx } from '../ui.jsx';
import { NaslaganaTraka, RangLista, TrendGrafikon } from '../grafikoni.jsx';
import { RedTermina, useTermini } from '../termini.jsx';
import { RASPORED_MENIJA, STAVKE } from '../meni.js';
import { P, pozdrav } from '../Ljuska.jsx';

const ime = (s) => s?.split(' ')[0] ?? '';

/* ── Šta čeka ── */
function PotrebnaPaznja() {
    const { podaci } = usePanel();
    const { uloga } = useDozvole();
    const zahtevi = podaci.termini.filter((t) => t.status === 'zahtev').length;
    const cekanje = podaci.listaCekanja.filter((l) => l.status === 'ceka').length;
    const odsustva = podaci.odsustva.filter((o) => o.status === 'na-cekanju').length;
    const zalihe = podaci.proizvodi.filter((p) => p.stanje < p.minimum).length;
    const stavke = [
        zahtevi && { to: `${P}/zahtevi`, ikona: BellRing, tekst: `${zahtevi} ${zahtevi === 1 ? 'zahtev čeka' : 'zahteva čeka'} odobrenje`, ton: 'upoz' },
        cekanje && { to: `${P}/lista-cekanja`, ikona: Hourglass, tekst: `${cekanje} na listi čekanja`, ton: 'info' },
        odsustva && uloga !== 'recepcija' && { to: `${P}/odsustva`, ikona: Umbrella, tekst: `${odsustva} zahtev za odsustvo`, ton: 'info' },
        zalihe && uloga !== 'recepcija' && { to: `${P}/proizvodi`, ikona: Package, tekst: `${zalihe} ${zalihe === 1 ? 'proizvod' : 'proizvoda'} pri kraju`, ton: 'greska' },
    ].filter(Boolean);
    if (!stavke.length) return null;
    const TON = { upoz: 'border-p-upoz/30 bg-p-upozbg text-p-upoz', info: 'border-p-info/25 bg-p-infobg text-p-info', greska: 'border-p-greska/25 bg-p-greskabg text-p-greska' };
    return (
        <div className="flex flex-wrap gap-2" aria-label="Potrebna pažnja">
            {stavke.map((s) => { const I = s.ikona; return (
                <Link key={s.to} to={s.to} className={cx('inline-flex items-center gap-2 rounded-xl border px-2.5 py-1.5 text-[12.5px] font-medium transition-opacity hover:opacity-85 sm:px-3 sm:py-2 sm:text-[13.5px]', TON[s.ton])}>
                    <I className="h-4 w-4" aria-hidden="true" />{s.tekst}<ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
            ); })}
        </div>
    );
}

/* ── Danas po radniku ── */
function KoRadiDanas() {
    const { podaci } = usePanel();
    const { otvoriNovi } = useTermini();
    const d = danasF();
    const m = sadaMinut();
    const radnici = podaci.radnici.map((r) => ({ r, s: podaci.smene[`${r.id}|${d}`], z: zauzetostDana(podaci, d, r.id), slobodno: slobodniProzori(podaci, d, r.id, m)[0] }));
    return (
        <Kartica naslov="Ko radi danas" opis="Smena, popunjenost i prvo slobodno vreme" akcije={<Dugme varijanta="tiho" velicina="sm" to={`${P}/raspored`}>Raspored</Dugme>} telo="p-2">
            <ul>
                {radnici.map(({ r, s, z, slobodno }) => (
                    <li key={r.id} className="flex items-center gap-3 rounded-xl px-3 py-3">
                        <Avatar ime={r.ime} slika={r.slika} boja={r.boja} velicina={38} />
                        <div className="min-w-0 flex-1">
                            <div className="flex items-baseline justify-between gap-2">
                                <span className="truncate text-sm font-medium">{r.ime}</span>
                                <span className="shrink-0 text-[12.5px] text-p-tiho tabularno">{s ? `${uSate(s.od)}–${uSate(s.do)}` : 'slobodan dan'}</span>
                            </div>
                            {s ? (
                                <div className="mt-1.5 flex items-center gap-2">
                                    <Merac vrednost={z ?? 0} oznaka={`Popunjenost ${r.ime}`} />
                                    <span className="w-9 shrink-0 text-right text-[12px] font-medium text-p-tiho tabularno">{procenat(z ?? 0)}</span>
                                </div>
                            ) : <div className="mt-1 text-[12.5px] text-p-tiho">Ne radi danas</div>}
                        </div>
                        {s && slobodno && (
                            <button type="button" onClick={() => otvoriNovi({ radnikId: r.id, datum: d, od: slobodno.od })} className="hidden shrink-0 rounded-lg border border-p-ivica px-2 py-1 text-[12px] font-medium text-p-akc hover:border-p-akc sm:block" title="Zakaži u prvo slobodno vreme">
                                slobodno {uSate(slobodno.od)}
                            </button>
                        )}
                    </li>
                ))}
            </ul>
        </Kartica>
    );
}

function ZahteviNaCekanju() {
    const { podaci } = usePanel();
    const lista = podaci.termini.filter((t) => t.status === 'zahtev').sort((a, b) => b.kreiran - a.kreiran);
    if (!lista.length) return null;
    return (
        <Kartica naslov="Čeka odobrenje" opis="Online zahtevi sa sajta, najnoviji prvi" akcije={<Dugme varijanta="tiho" velicina="sm" to={`${P}/zahtevi`}>Svi ({lista.length})</Dugme>} telo="p-2">
            <ul>{lista.slice(0, 4).map((t) => <li key={t.id}><RedTermina t={t} prikaziDatum /></li>)}</ul>
        </Kartica>
    );
}

function TerminiDanas({ radnikId = null }) {
    const { podaci } = usePanel();
    const d = danasF();
    const m = sadaMinut();
    const lista = podaci.termini.filter((t) => t.datum === d && AKTIVNI.has(t.status) && (!radnikId || t.radnikId === radnikId)).sort((a, b) => a.od - b.od || a.radnikId.localeCompare(b.radnikId));
    // Linija „sada” ide pre prvog termina koji još nije počeo; gotovi su prigušeni.
    const sledeci = lista.findIndex((t) => t.od > m);
    return (
        <Kartica naslov={radnikId ? 'Moji termini danas' : 'Termini danas'} opis={`${datumSaDanomDugo(d)} · ${termina(lista.length)}`} akcije={<Dugme varijanta="tiho" velicina="sm" to={`${P}/kalendar`} ikona={CalendarDays}>Kalendar</Dugme>} telo="p-2">
            {lista.length ? (
                <ul className="max-h-[460px] overflow-y-auto p-skrol">
                    {lista.map((t, i) => (
                        <li key={t.id} className={cx(t.od + t.trajanje <= m && 'opacity-60')}>
                            {i === sledeci && sledeci > 0 && <div className="mx-3 my-1 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[.08em] text-p-akc"><span className="h-px flex-1 bg-p-akc/40" />sada {uSate(m)}<span className="h-px flex-1 bg-p-akc/40" /></div>}
                            <RedTermina t={t} prikaziRadnika={!radnikId} />
                        </li>
                    ))}
                </ul>
            ) : <Prazno ikona={CalendarCheck} naslov="Danas nema termina" opis="Slobodan dan ili salon ne radi." />}
        </Kartica>
    );
}

/* ── Poslovanje (vlasnik) ── */
function Poslovanje() {
    const { podaci } = usePanel();
    const indeks = useIndeksi();
    const d = danasF();
    // Četiri pune nedelje: prethodni period pada na iste dane u nedelji, a dani
    // kad salon ne radi se ne crtaju (nule bi izgledale kao pad prometa).
    // Do juče: današnji dan još traje i na kraju linije bi izgledao kao pad.
    const juce = dodajDane(d, -1);
    const od = dodajDane(d, -28);
    const [pOd, pDo] = prethodniPeriod(od, juce);
    const radi = (x) => !!podaci.podaciSalona.radnoVreme?.[danUNedelji(x.datum)];
    const dani = prometPoDanu(podaci.termini, od, juce).filter(radi);
    const preDani = prometPoDanu(podaci.termini, pOd, pDo).filter(radi);
    const nap = naplaceni(podaci.termini, od, juce);
    const usluge = poUslugama(nap).slice(0, 5);
    const radnici = poRadnicima(nap);
    const placanje = Object.keys(NACINI_PLACANJA).map((k) => ({ oznaka: NACINI_PLACANJA[k], vrednost: zbir(nap.filter((t) => t.placanje === k)) }));
    const ocene = podaci.ocene.filter((o) => o.datum >= od);
    const prosek = ocene.length ? ocene.reduce((s, o) => s + o.ocena, 0) / ocene.length : 0;
    return (
        <>
            <div className="grid gap-4 xl:grid-cols-3">
                <Kartica className="xl:col-span-2" naslov="Promet — poslednje 4 nedelje" opis={`${rsd(zbir(dani, (x) => x.iznos))} · prethodne 4 nedelje ${rsd(zbir(preDani, (x) => x.iznos))}`} akcije={<Dugme varijanta="tiho" velicina="sm" to={`${P}/analitika`}>Analitika</Dugme>}>
                    <TrendGrafikon tacke={dani.map((x) => ({ oznaka: datumKratko(x.datum), vrednost: x.iznos, opis: `${datumSaDanomDugo(x.datum)} · ${termina(x.broj)}` }))} poredjenje={preDani.map((x) => ({ vrednost: x.iznos }))} format={rsd} formatOse={rsdKratko} oznakaSerije="Promet" oznakaPoredjenja="Prethodne 4 nedelje" />
                </Kartica>
                <Kartica naslov="Način plaćanja" opis="Naplaćeno u poslednje 4 nedelje">
                    <NaslaganaTraka delovi={placanje} format={rsd} />
                    <div className="mt-5 flex items-center justify-between rounded-xl bg-p-meko/70 px-3 py-2.5">
                        <span className="flex items-center gap-2 text-[13px] text-p-tiho"><Star className="h-4 w-4 text-p-zlato" fill="currentColor" aria-hidden="true" />Prosečna ocena</span>
                        <Link to={`${P}/ocene`} className="text-sm font-semibold hover:underline">{prosek.toFixed(2).replace('.', ',')} <span className="font-normal text-p-tiho">· {ocene.length} ocena</span></Link>
                    </div>
                </Kartica>
            </div>
            <div className="grid gap-4 lg:grid-cols-2">
                <Kartica naslov="Najprodavanije usluge" opis="Poslednje 4 nedelje, po prometu">
                    <RangLista stavke={usluge.map((u) => ({ oznaka: indeks.usluga[u.id]?.naziv ?? u.id, vrednost: Math.round(u.iznos), dodatak: `${u.broj}×` }))} format={rsd} />
                </Kartica>
                <Kartica naslov="Promet po radniku" opis="Poslednje 4 nedelje">
                    <RangLista stavke={radnici.map((r) => ({ oznaka: indeks.radnik[r.id]?.ime ?? r.id, vrednost: r.iznos, dodatak: termina(r.broj) }))} format={rsd} />
                </Kartica>
            </div>
        </>
    );
}

/* ── Brzi pristup (indeks stranica) ── */
function BrziPristup() {
    const { sesija } = usePanel();
    const grupe = (RASPORED_MENIJA[sesija.uloga] ?? []).filter((g) => !g.fiksno && g.id !== 'pomoc');
    return (
        <Kartica naslov="Sve stranice" telo="p-4 sm:p-5">
            <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2 xl:grid-cols-4">
                {grupe.map((g) => (
                    <div key={g.id}>
                        <div className="mb-2 text-[11px] font-semibold uppercase tracking-[.08em] text-p-tiho">{g.naziv}</div>
                        <ul className="space-y-0.5">
                            {g.stavke.map((k) => { const st = STAVKE[k]; const I = st.ikona; return (
                                <li key={k}><Link to={`${P}/${st.ruta}`} className="-mx-2 flex items-center gap-2.5 rounded-lg px-2 py-1.5 text-[13.5px] hover:bg-p-meko"><I className="h-4 w-4 text-p-tiho" aria-hidden="true" />{st.naziv}</Link></li>
                            ); })}
                        </ul>
                    </div>
                ))}
            </div>
        </Kartica>
    );
}

/* ── Moj dan (zaposleni) ── */
function MojDan() {
    const { podaci, sesija } = usePanel();
    const indeks = useIndeksi();
    const { otvoriNovi } = useTermini();
    const d = danasF();
    const r = indeks.radnik[sesija.radnikId] ?? podaci.radnici[0];
    const s = podaci.smene[`${r.id}|${d}`];
    const danasNap = naplaceni(podaci.termini, d, d, r.id);
    const mesec = naplaceni(podaci.termini, pocetakMeseca(d), d, r.id);
    const ocene = podaci.ocene.filter((o) => o.radnikId === r.id);
    const prosek = ocene.length ? ocene.reduce((x, o) => x + o.ocena, 0) / ocene.length : 0;
    const slob = slobodniProzori(podaci, d, r.id, sadaMinut())[0];
    const sutra = podaci.termini.filter((t) => t.radnikId === r.id && t.datum === dodajDane(d, 1) && AKTIVNI.has(t.status)).length;
    return (
        <div className="flex flex-col gap-4">
            <ZaglavljeStrane naslov={`${pozdrav(sadaMinut())}, ${ime(r.ime)}`} opis={s ? `Danas radite ${uSate(s.od)}–${uSate(s.do)}.${slob ? ` Prvo slobodno vreme: ${uSate(slob.od)}.` : ' Dan je pun.'}` : 'Danas ne radite — uživajte!'}
                akcije={<Dugme varijanta="glavno" ikona={CalendarPlus} onClick={() => otvoriNovi({ radnikId: r.id })}>Novi termin</Dugme>} />
            <MrezaPlocica>
                <StatPlocica ikona={CalendarDays} oznaka="Termini danas" vrednost={podaci.termini.filter((t) => t.radnikId === r.id && t.datum === d && AKTIVNI.has(t.status)).length} napomena={`sutra ${termina(sutra)}`} />
                <StatPlocica ikona={Banknote} ton="ok" oznaka="Naplaćeno danas" vrednost={rsd(zbir(danasNap))} napomena={termina(danasNap.length)} />
                <StatPlocica ikona={Wallet} ton="info" oznaka="Moja provizija (mesec)" vrednost={rsd(zbir(mesec) * (r.provizija || 30) / 100)} napomena={`${r.provizija || 30}% od ${rsd(zbir(mesec))}`} />
                <StatPlocica ikona={Star} oznaka="Moja ocena" vrednost={prosek.toFixed(2).replace('.', ',')} napomena={`${ocene.length} ocena klijenata`} to={undefined} />
            </MrezaPlocica>
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
                <TerminiDanas radnikId={r.id} />
                <Kartica naslov="Poslednje ocene" telo="p-2">
                    <ul>
                        {ocene.slice().sort((a, b) => b.datum.localeCompare(a.datum)).filter((o) => o.komentar).slice(0, 6).map((o) => (
                            <li key={o.id} className="rounded-xl px-3 py-2.5">
                                <div className="flex items-center justify-between text-[12.5px] text-p-tiho"><span className="text-p-zlato" aria-label={`${o.ocena} od 5`}>{'★'.repeat(o.ocena)}<span className="text-p-ivica">{'★'.repeat(5 - o.ocena)}</span></span>{datumKratko(o.datum)}</div>
                                <p className="mt-1 text-[13.5px]">„{o.komentar}”</p>
                            </li>
                        ))}
                    </ul>
                </Kartica>
            </div>
        </div>
    );
}

export default function Pocetna() {
    const { podaci, sesija } = usePanel();
    const { novac, uloga } = useDozvole();
    const { otvoriNovi } = useTermini();
    const brojke = useMemo(() => {
        const d = danasF();
        const danasT = podaci.termini.filter((t) => t.datum === d);
        const aktivni = danasT.filter((t) => AKTIVNI.has(t.status));
        const nap = danasT.filter((t) => t.status === 'zavrsen');
        const ocekivano = zbir(aktivni);
        // Isti dan prošle nedelje, do istog sata — ceo dan bi uvek izgledao kao pad.
        const juce = zbir(naplaceni(podaci.termini, dodajDane(d, -7), dodajDane(d, -7)).filter((t) => t.od + t.trajanje <= sadaMinut()));
        const rad = podaci.radnici.map((r) => zauzetostDana(podaci, d, r.id)).filter((z) => z != null);
        const mOd = pocetakMeseca(d);
        const dana = Number(d.slice(8));
        const proslog = dodajDane(mOd, -1);
        const pmOd = pocetakMeseca(proslog);
        const pmDo = `${proslog.slice(0, 8)}${String(Math.min(dana, Number(proslog.slice(8)))).padStart(2, '0')}`;
        const mesec = zbir(naplaceni(podaci.termini, mOd, d));
        const prosliMesec = zbir(naplaceni(podaci.termini, pmOd, pmDo));
        const noviKlijenti = podaci.klijenti.filter((k) => k.kreiran >= mOd).length;
        return { aktivni, nap, ocekivano, naplaceno: zbir(nap), juce, popunjenost: rad.length ? rad.reduce((a, b) => a + b, 0) / rad.length : 0, mesec, prosliMesec, noviKlijenti };
    }, [podaci]);

    if (uloga === 'zaposleni') return <MojDan />;

    return (
        <div className="flex flex-col gap-4">
            <ZaglavljeStrane naslov={`${pozdrav(sadaMinut())}, ${ime(sesija.ime)}`} opis={`${datumSaDanomDugo(danasF())} · ${termina(brojke.aktivni.length)} danas`}
                akcije={(
                    <>
                        <Dugme to={`${P}/kalendar`} ikona={CalendarDays}>Kalendar</Dugme>
                        <Dugme varijanta="glavno" ikona={CalendarPlus} onClick={() => otvoriNovi({})} kratko="Novi">Novi termin</Dugme>
                    </>
                )} />
            <PotrebnaPaznja />
            <MrezaPlocica>
                <StatPlocica ikona={Banknote} ton="ok" oznaka="Promet danas" vrednost={rsd(brojke.naplaceno)} napomena={`očekivano ${rsd(brojke.ocekivano)}`} to={`${P}/dnevni-promet`} trend={brojke.juce ? promena(brojke.naplaceno, brojke.juce) : null} info="Naplaćeni termini danas; strelica poredi sa istim danom prošle nedelje do ovog sata." />
                <StatPlocica ikona={CalendarDays} oznaka="Termini danas" vrednost={brojke.aktivni.length} napomena={`${brojke.nap.length} naplaćeno`} to={`${P}/kalendar`} />
                <StatPlocica ikona={Gauge} ton="info" oznaka="Popunjenost danas" vrednost={procenat(brojke.popunjenost)} napomena="prosek radnika u smeni" to={novac ? `${P}/popunjenost` : undefined} />
                {novac
                    ? <StatPlocica ikona={Wallet} ton="akc" oznaka="Promet ovog meseca" vrednost={rsd(brojke.mesec)} trend={promena(brojke.mesec, brojke.prosliMesec)} napomena="u odnosu na isti deo prošlog" to={`${P}/analitika`} />
                    : <StatPlocica ikona={UserPlus} ton="akc" oznaka="Novi klijenti (mesec)" vrednost={brojke.noviKlijenti} napomena="prvi dolazak ovog meseca" to={`${P}/klijenti`} />}
            </MrezaPlocica>
            <div className="grid items-start gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
                <TerminiDanas />
                <div className="flex min-w-0 flex-col gap-4">
                    <KoRadiDanas />
                    <ZahteviNaCekanju />
                </div>
            </div>
            {novac && <Poslovanje />}
            {!novac && brojke.aktivni.length === 0 && <p className="flex items-center gap-2 text-sm text-p-tiho"><AlertCircle className="h-4 w-4" aria-hidden="true" />Salon danas ne radi.</p>}
            <BrziPristup />
        </div>
    );
}
