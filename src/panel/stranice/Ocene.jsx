/*
 * OCENE ZAPOSLENIH — ocene klijenata posle termina, po radniku, sa
 * komentarima i odgovorom salona. Zaposleni vidi samo svoje ocene.
 */
import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, MessageSquareReply, Star, ThumbsUp } from 'lucide-react';
import { usePanel, useIndeksi, useDozvole, imeKlijenta } from '../podaci/Skladiste.jsx';
import { prethodniPeriod, promena } from '../podaci/analitika.js';
import { broj, danas as danasF, datumDugo, datumKratko, dodajDane, mnozina, pocetakNedelje, procenat } from '../format.js';
import { Avatar, Dugme, Izbor, Kartica, Modal, MrezaPlocica, Polje, Prazno, StatPlocica, Tabovi, TekstPolje, ZaglavljeStrane, cx } from '../ui.jsx';
import { Iskra, RangLista } from '../grafikoni.jsx';
import { P } from '../Ljuska.jsx';

const PERIODI = [{ id: 30, naziv: '30 dana' }, { id: 90, naziv: '90 dana' }];
const prosekOcena = (niz) => (niz.length ? niz.reduce((s, o) => s + o.ocena, 0) / niz.length : null);
const ocenaTekst = (x) => (x == null ? '—' : x.toFixed(2).replace('.', ','));
const ocena = (n) => `${broj(n)} ${mnozina(n, 'ocena', 'ocene', 'ocena')}`;

const Zvezdice = ({ n, className }) => (
    <span className={cx('tracking-[.08em]', className)} aria-label={`${n} od 5`} role="img">
        <span className="text-p-zlato">{'★'.repeat(n)}</span><span className="text-p-ivica">{'★'.repeat(5 - n)}</span>
    </span>
);

export default function Ocene() {
    const { podaci, izmeni, obavesti, zapisi } = usePanel();
    const indeks = useIndeksi();
    const { samoSvoje, radnikId } = useDozvole();
    const [period, setPeriod] = useState(30);
    const [filterRadnik, setFilterRadnik] = useState('');
    const [filterOcena, setFilterOcena] = useState('');
    const [koliko, setKoliko] = useState(12);
    const [odgovorZa, setOdgovorZa] = useState(null);
    const [tekst, setTekst] = useState('');
    const d = danasF();

    const v = useMemo(() => {
        const od = dodajDane(d, -(period - 1));
        const [pOd, pDo] = prethodniPeriod(od, d);
        const sve = podaci.ocene.filter((o) => !samoSvoje || o.radnikId === radnikId);
        const najstarija = podaci.ocene.reduce((m, o) => (o.datum < m ? o.datum : m), d);
        const poredi = pOd >= najstarija;
        const uPeriodu = sve.filter((o) => o.datum >= od && o.datum <= d);
        const pre = poredi ? sve.filter((o) => o.datum >= pOd && o.datum <= pDo) : [];
        const raspodela = [5, 4, 3, 2, 1].map((n) => ({ n, broj: uPeriodu.filter((o) => o.ocena === n).length }));
        const nedelje = [];
        for (let n = pocetakNedelje(od); n <= d; n = dodajDane(n, 7)) nedelje.push(n);
        const radnici = podaci.radnici.filter((r) => !samoSvoje || r.id === radnikId).map((r) => {
            const o = uPeriodu.filter((x) => x.radnikId === r.id);
            // Nedeljni prosek; nedelje bez ocena se preskaču. Iskra crta odstupanje iznad 3★ da se vidi kretanje.
            const tok = nedelje.map((n) => prosekOcena(o.filter((x) => pocetakNedelje(x.datum) === n))).filter((x) => x != null);
            return { r, broj: o.length, prosek: prosekOcena(o), pet: o.filter((x) => x.ocena === 5).length, tok };
        }).sort((a, b) => (b.prosek ?? 0) - (a.prosek ?? 0));
        return {
            od, poredi, uPeriodu, pre, raspodela, radnici,
            prosek: prosekOcena(uPeriodu), prosekPre: prosekOcena(pre),
            pet: uPeriodu.filter((o) => o.ocena === 5).length, petPre: pre.filter((o) => o.ocena === 5).length,
            komentara: uPeriodu.filter((o) => o.komentar).length, komentaraPre: pre.filter((o) => o.komentar).length,
        };
    }, [podaci.ocene, podaci.radnici, period, d, samoSvoje, radnikId]);

    const komentari = useMemo(() => v.uPeriodu
        .filter((o) => o.komentar && (!filterRadnik || o.radnikId === filterRadnik) && (!filterOcena || o.ocena === Number(filterOcena)))
        .sort((a, b) => b.datum.localeCompare(a.datum) || b.id.localeCompare(a.id)), [v.uPeriodu, filterRadnik, filterOcena]);

    const otvoriOdgovor = (o) => { setOdgovorZa(o); setTekst(o.odgovor ?? ''); };
    const sacuvaj = () => {
        const t = tekst.trim();
        izmeni('ocene', odgovorZa.id, { odgovor: t, odgovorDatum: t ? d : null });
        const k = imeKlijenta(indeks.klijent[odgovorZa.klijentId]);
        zapisi('ocena', t ? 'Odgovorio na ocenu' : 'Obrisao odgovor na ocenu', k);
        obavesti(t ? 'Odgovor je sačuvan.' : 'Odgovor je obrisan.');
        setOdgovorZa(null);
    };

    const t = (sada, pre) => (v.poredi && sada != null && pre != null ? promena(sada, pre) : null);
    const napomena = (tekstPre) => (v.poredi ? `prethodnih ${period} dana: ${tekstPre}` : 'nema starijih ocena');
    const udeoPet = v.uPeriodu.length ? v.pet / v.uPeriodu.length : 0;
    const udeoPetPre = v.pre.length ? v.petPre / v.pre.length : null;

    return (
        <div className="flex flex-col gap-4">
            <ZaglavljeStrane naslov={samoSvoje ? 'Moje ocene' : 'Ocene zaposlenih'} opis={`Ocene klijenata posle naplaćenog termina · ${datumDugo(v.od, false)} – danas`}
                akcije={<Tabovi stavke={PERIODI} aktivan={period} onChange={(x) => { setPeriod(x); setKoliko(12); }} />} />

            <MrezaPlocica>
                <StatPlocica ikona={Star} oznaka="Prosečna ocena" vrednost={ocenaTekst(v.prosek)} trend={t(v.prosek, v.prosekPre)} napomena={napomena(ocenaTekst(v.prosekPre))} />
                <StatPlocica ikona={MessageSquare} ton="info" oznaka="Broj ocena" vrednost={broj(v.uPeriodu.length)} trend={t(v.uPeriodu.length, v.pre.length)} napomena={napomena(broj(v.pre.length))} />
                <StatPlocica ikona={ThumbsUp} ton="ok" oznaka="Udeo 5★" vrednost={procenat(udeoPet)} trend={t(udeoPet, udeoPetPre)} napomena={`${broj(v.pet)} od ${broj(v.uPeriodu.length)}`} />
                <StatPlocica ikona={MessageSquareReply} ton="akc" oznaka="Komentari" vrednost={broj(v.komentara)} trend={t(v.komentara, v.komentaraPre)} napomena={`${broj(v.uPeriodu.filter((o) => o.komentar && o.odgovor).length)} sa odgovorom`} />
            </MrezaPlocica>

            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
                <Kartica naslov="Raspodela ocena" opis={ocena(v.uPeriodu.length)}>
                    <RangLista stavke={v.raspodela.map((x) => ({ oznaka: `${x.n} ★`, vrednost: x.broj, dodatak: procenat(v.uPeriodu.length ? x.broj / v.uPeriodu.length : 0) }))} format={broj} max={Math.max(1, v.uPeriodu.length)} />
                </Kartica>
                <Kartica naslov={samoSvoje ? 'Moj prosek' : 'Po radniku'} opis="Prosek, broj ocena i kretanje po nedeljama">
                    <ul className="grid gap-3 sm:grid-cols-2">
                        {v.radnici.map(({ r, broj: n, prosek, pet, tok }) => (
                            <li key={r.id} className="flex min-w-0 items-center gap-3 rounded-xl border border-p-ivica/70 p-3">
                                <Avatar ime={r.ime} slika={r.slika} boja={r.boja} velicina={40} />
                                <div className="min-w-0 flex-1">
                                    <div className="truncate text-sm font-medium">{r.ime}</div>
                                    <div className="mt-0.5 flex items-baseline gap-1.5">
                                        <span className="text-lg font-semibold leading-none tabularno">{ocenaTekst(prosek)}</span>
                                        <Star className="h-3.5 w-3.5 self-center text-p-zlato" fill="currentColor" aria-hidden="true" />
                                    </div>
                                    <div className="mt-1 text-[12px] text-p-tiho tabularno">{ocena(n)}{n ? ` · ${procenat(pet / n)} 5★` : ''}</div>
                                </div>
                                {tok.length > 1 && <span className="shrink-0" title="Nedeljni prosek ocena"><Iskra vrednosti={tok.map((x) => Math.max(0, x - 3))} sirina={84} visina={32} /></span>}
                            </li>
                        ))}
                    </ul>
                </Kartica>
            </div>

            <Kartica naslov="Komentari" opis={`${broj(komentari.length)} ${mnozina(komentari.length, 'komentar', 'komentara', 'komentara')}`}
                akcije={(
                    <div className="flex flex-wrap justify-end gap-2">
                        {!samoSvoje && (
                            <Izbor value={filterRadnik} onChange={(e) => { setFilterRadnik(e.target.value); setKoliko(12); }} aria-label="Radnik" className="h-8 w-auto py-0 text-[13px]">
                                <option value="">Svi radnici</option>
                                {podaci.radnici.map((r) => <option key={r.id} value={r.id}>{r.ime}</option>)}
                            </Izbor>
                        )}
                        <Izbor value={filterOcena} onChange={(e) => { setFilterOcena(e.target.value); setKoliko(12); }} aria-label="Ocena" className="h-8 w-auto py-0 text-[13px]">
                            <option value="">Sve ocene</option>
                            {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} ★</option>)}
                        </Izbor>
                    </div>
                )} telo="p-2">
                {komentari.length ? (
                    <>
                        <ul className="divide-y divide-p-ivica/60">
                            {komentari.slice(0, koliko).map((o) => {
                                const k = indeks.klijent[o.klijentId];
                                const r = indeks.radnik[o.radnikId];
                                return (
                                    <li key={o.id} className="px-3 py-3.5">
                                        <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
                                            <div className="flex min-w-0 flex-wrap items-baseline gap-x-2 text-[13px]">
                                                {samoSvoje
                                                    ? <span className="font-semibold text-p-ink">{imeKlijenta(k)}</span>
                                                    : <Link to={`${P}/klijenti/${o.klijentId}`} className="font-semibold text-p-ink hover:underline">{imeKlijenta(k)}</Link>}
                                                {!samoSvoje && <span className="text-p-tiho">kod {r?.ime ?? o.radnikId}</span>}
                                                <span className="text-p-tiho">· {datumKratko(o.datum)}</span>
                                            </div>
                                            <Zvezdice n={o.ocena} className="text-[14px]" />
                                        </div>
                                        <p className="mt-1.5 text-[14px] text-p-ink">„{o.komentar}”</p>
                                        {o.odgovor && (
                                            <div className="mt-2 rounded-lg border-l-2 border-p-akc/60 bg-p-meko/70 px-3 py-2 text-[13px]">
                                                <div className="text-[12px] font-medium text-p-tiho">Odgovor salona{o.odgovorDatum ? ` · ${datumKratko(o.odgovorDatum)}` : ''}</div>
                                                <p className="mt-0.5 text-p-ink">{o.odgovor}</p>
                                            </div>
                                        )}
                                        <div className="mt-2">
                                            <Dugme varijanta="tiho" velicina="sm" ikona={MessageSquareReply} onClick={() => otvoriOdgovor(o)} className="-ml-2.5 text-p-akc">{o.odgovor ? 'Izmeni odgovor' : 'Odgovori'}</Dugme>
                                        </div>
                                    </li>
                                );
                            })}
                        </ul>
                        {komentari.length > koliko && (
                            <div className="border-t border-p-ivica/60 p-2 text-center">
                                <Dugme varijanta="tiho" velicina="sm" onClick={() => setKoliko((x) => x + 12)}>Prikaži još ({komentari.length - koliko})</Dugme>
                            </div>
                        )}
                    </>
                ) : <Prazno ikona={MessageSquare} naslov="Nema komentara" opis="Promenite filter ili period." />}
            </Kartica>

            <Modal otvoren={!!odgovorZa} onClose={() => setOdgovorZa(null)} naslov="Odgovor na ocenu"
                opis={odgovorZa ? `${imeKlijenta(indeks.klijent[odgovorZa.klijentId])} · ${datumKratko(odgovorZa.datum)}` : ''}
                podnozje={(
                    <>
                        <Dugme onClick={() => setOdgovorZa(null)}>Odustani</Dugme>
                        <Dugme varijanta="glavno" onClick={sacuvaj} disabled={!tekst.trim() && !odgovorZa?.odgovor}>Sačuvaj</Dugme>
                    </>
                )}>
                {odgovorZa && (
                    <div className="space-y-4">
                        <div className="rounded-xl bg-p-meko/70 px-3 py-2.5 text-[13.5px]">
                            <Zvezdice n={odgovorZa.ocena} />
                            <p className="mt-1">„{odgovorZa.komentar}”</p>
                        </div>
                        <Polje oznaka="Vaš odgovor" pomoc="Klijent vidi odgovor uz svoju ocenu. Prazno polje briše odgovor.">
                            <TekstPolje value={tekst} onChange={(e) => setTekst(e.target.value)} placeholder="Hvala na oceni, vidimo se uskoro!" maxLength={500} />
                        </Polje>
                    </div>
                )}
            </Modal>
        </div>
    );
}
