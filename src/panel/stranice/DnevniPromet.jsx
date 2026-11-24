/*
 * DNEVNI PROMET — naplata dana po načinu plaćanja i po radniku, kao u
 * AllSeasons panelu, plus „Zatvori dan”: poređenje sa fiskalnom kasom i
 * zaključavanje dana. Zaposleni vidi samo svoje termine i svoj promet.
 */
import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Banknote, CalendarCheck, ChevronLeft, ChevronRight, CreditCard, Gift, Lock, LockOpen, Printer, ReceiptText, Scale, Wallet } from 'lucide-react';
import { usePanel, useIndeksi, useDozvole, imeKlijenta, naziviUsluga } from '../podaci/Skladiste.jsx';
import { naplaceni, poRadnicima, promena, zbir } from '../podaci/analitika.js';
import { danas, datumKratko, datumSaDanomDugo, dodajDane, preKoliko, rsd, sadaMinut, termina, uSate } from '../format.js';
import { Avatar, Dugme, Kartica, NACINI_PLACANJA, Polje, Prazno, StatPlocica, StatusTermina, Tabela, Unos, ZaglavljeStrane, Znacka, cx } from '../ui.jsx';
import { NaslaganaTraka, RangLista } from '../grafikoni.jsx';
import { useTermini } from '../termini.jsx';
import { P } from '../Ljuska.jsx';

function ZatvoriDan({ datum, gotovina, kartica, vaucer, nenaplaceno }) {
    const { podaci, postavi, obavesti, zapisi, sesija } = usePanel();
    const { uloga } = useDozvole();
    const [fiskalno, setFiskalno] = useState('');
    const zatvoren = (podaci.zatvoreniDani ?? {})[datum];
    const ocekivano = gotovina + kartica;
    const unos = fiskalno === '' ? null : Number(fiskalno);
    const razlika = unos == null || !Number.isFinite(unos) ? null : unos - ocekivano;
    const buduci = datum > danas();

    const zakljuci = () => {
        postavi('zatvoreniDani', (z) => ({ ...(z ?? {}), [datum]: { fiskalno: unos, ocekivano, razlika, gotovina, kartica, vaucer, ko: sesija?.ime ?? '', ts: Date.now() } }));
        zapisi('naplata', 'Zaključio dan', `${datumSaDanomDugo(datum)} — kasa ${rsd(unos)}, razlika ${rsd(razlika)}`);
        obavesti(razlika === 0 ? `Dan je zaključen — kasa se slaže (${rsd(ocekivano)}).` : `Dan je zaključen uz razliku od ${rsd(razlika)}.`, razlika === 0 ? 'ok' : 'greska');
        setFiskalno('');
    };
    const otvoriPonovo = () => {
        postavi('zatvoreniDani', (z) => { const x = { ...(z ?? {}) }; delete x[datum]; return x; });
        zapisi('naplata', 'Ponovo otvorio dan', datumSaDanomDugo(datum));
        obavesti('Dan je ponovo otvoren.');
    };

    if (zatvoren) {
        return (
            <Kartica naslov="Zatvaranje dana" opis={`Zaključio ${zatvoren.ko || '—'} · ${preKoliko(zatvoren.ts)}`} akcije={<Znacka ton="ok"><Lock className="h-3 w-3" aria-hidden="true" />Zaključen</Znacka>}>
                <dl className="space-y-2 text-sm">
                    <div className="flex justify-between gap-3"><dt className="text-p-tiho">Fiskalna kasa</dt><dd className="font-semibold tabularno">{rsd(zatvoren.fiskalno)}</dd></div>
                    <div className="flex justify-between gap-3"><dt className="text-p-tiho">Gotovina + kartica u panelu</dt><dd className="font-semibold tabularno">{rsd(zatvoren.ocekivano)}</dd></div>
                    <div className="flex justify-between gap-3"><dt className="text-p-tiho">Razlika</dt><dd className={cx('font-semibold tabularno', zatvoren.razlika === 0 ? 'text-p-ok' : 'text-p-upoz')}>{zatvoren.razlika > 0 ? '+' : ''}{rsd(zatvoren.razlika)}</dd></div>
                </dl>
                {zatvoren.ocekivano !== ocekivano && <p className="mt-3 rounded-lg bg-p-upozbg px-3 py-2 text-[13px] text-p-upoz">Promet se promenio posle zaključenja (sada {rsd(ocekivano)}).</p>}
                {(uloga === 'administrator' || uloga === 'menadzer') && <Dugme varijanta="tiho" velicina="sm" ikona={LockOpen} className="mt-3 print:hidden" onClick={otvoriPonovo}>Otvori dan ponovo</Dugme>}
            </Kartica>
        );
    }

    return (
        <Kartica naslov="Zatvori dan" opis="Upišite ukupan iznos sa fiskalne kase (presek) i uporedite sa naplatom u panelu." className="print:hidden">
            <div className="space-y-3">
                <div className="flex items-center justify-between rounded-xl bg-p-meko/70 px-3 py-2.5 text-sm">
                    <span className="text-p-tiho">Gotovina + kartica</span>
                    <span className="font-semibold tabularno">{rsd(ocekivano)}</span>
                </div>
                <Polje oznaka="Fiskalna kasa — ukupno (RSD)" pomoc={vaucer ? `Vaučeri (${rsd(vaucer)}) ne idu kroz kasu.` : undefined}>
                    <Unos type="number" inputMode="numeric" min={0} value={fiskalno} onChange={(e) => setFiskalno(e.target.value)} placeholder={String(ocekivano)} disabled={buduci} />
                </Polje>
                {razlika != null && (
                    <div className={cx('flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium', razlika === 0 ? 'bg-p-okbg text-p-ok' : 'bg-p-upozbg text-p-upoz')} role="status">
                        <span className="inline-flex items-center gap-2"><Scale className="h-4 w-4" aria-hidden="true" />{razlika === 0 ? 'Kasa se slaže' : razlika > 0 ? 'Višak u kasi' : 'Manjak u kasi'}</span>
                        <span className="tabularno">{razlika > 0 ? '+' : ''}{rsd(razlika)}</span>
                    </div>
                )}
                {nenaplaceno > 0 && !buduci && <p className="text-[13px] text-p-upoz">Još {termina(nenaplaceno)} nije naplaćeno — naplatite ili otkažite pre zaključenja.</p>}
                {buduci && <p className="text-[13px] text-p-tiho">Dan još nije počeo.</p>}
                <Dugme varijanta="glavno" ikona={Lock} className="w-full justify-center" disabled={razlika == null || buduci} onClick={zakljuci}>Zaključi dan</Dugme>
            </div>
        </Kartica>
    );
}

export default function DnevniPromet() {
    const { podaci } = usePanel();
    const indeks = useIndeksi();
    const { samoSvoje, radnikId: mojId } = useDozvole();
    const { otvoriDetalj } = useTermini();
    const [datum, setDatum] = useState(danas());
    const d = danas();

    const x = useMemo(() => {
        const moje = (t) => !samoSvoje || t.radnikId === mojId;
        const dana = podaci.termini.filter((t) => t.datum === datum && moje(t));
        const nap = dana.filter((t) => t.status === 'zavrsen');
        const nenap = dana.filter((t) => t.status === 'potvrdjen');
        const otkazano = dana.filter((t) => t.status === 'otkazan' || t.status === 'nije-dosao').length;
        const po = (k) => zbir(nap.filter((t) => t.placanje === k));
        const ukupno = zbir(nap);
        // Za danas: prošla nedelja do istog sata (ceo dan bi uvek izgledao kao pad).
        const doMinuta = datum === danas() ? sadaMinut() : 24 * 60;
        const proslaNedelja = zbir(naplaceni(podaci.termini, dodajDane(datum, -7), dodajDane(datum, -7), samoSvoje ? mojId : null).filter((t) => t.od + t.trajanje <= doMinuta));
        const redovi = [...nap.sort((a, b) => a.od - b.od), ...nenap.sort((a, b) => a.od - b.od)];
        return { nap, nenap, otkazano, ukupno, kartica: po('kartica'), gotovina: po('gotovina'), vaucer: po('vaucer'), proslaNedelja, redovi, radnici: poRadnicima(nap) };
    }, [podaci.termini, datum, samoSvoje, mojId]);

    const zatvoren = !!(podaci.zatvoreniDani ?? {})[datum];
    const prosek = x.nap.length ? x.ukupno / x.nap.length : 0;

    const kolone = [
        { kljuc: 'od', naslov: 'Vreme', render: (t) => <span className="font-medium tabularno">{uSate(t.od)}</span> },
        {
            kljuc: 'klijent', naslov: 'Klijent', sortVrednost: (t) => imeKlijenta(indeks.klijent[t.klijentId]),
            render: (t) => (samoSvoje
                ? <span className="font-medium">{imeKlijenta(indeks.klijent[t.klijentId])}</span>
                : <Link to={`${P}/klijenti/${t.klijentId}`} onClick={(e) => e.stopPropagation()} className="font-medium hover:underline">{imeKlijenta(indeks.klijent[t.klijentId])}</Link>),
        },
        { kljuc: 'usluge', naslov: 'Usluge', sort: false, className: 'max-w-[240px]', render: (t) => <span className="line-clamp-2 text-p-tiho">{naziviUsluga(t.usluge, indeks)}</span> },
        ...(samoSvoje ? [] : [{
            kljuc: 'radnik', naslov: 'Radnik', sortVrednost: (t) => indeks.radnik[t.radnikId]?.ime ?? '',
            render: (t) => { const r = indeks.radnik[t.radnikId]; return <span className="inline-flex items-center gap-2 whitespace-nowrap"><Avatar ime={r?.ime} slika={r?.slika} boja={r?.boja} velicina={22} />{r?.ime.split(' ')[0]}</span>; },
        }]),
        { kljuc: 'placanje', naslov: 'Plaćanje', sortVrednost: (t) => t.placanje ?? 'zz', render: (t) => (t.placanje ? NACINI_PLACANJA[t.placanje] : <Znacka ton="upoz">Nenaplaćeno</Znacka>) },
        { kljuc: 'cena', naslov: 'Iznos', desno: true, render: (t) => <span className={cx('font-semibold', t.status !== 'zavrsen' && 'text-p-tiho')}>{rsd(t.cena)}</span> },
        {
            kljuc: 'status', naslov: '', sort: false, desno: true,
            render: (t) => (t.status === 'potvrdjen'
                ? <Dugme varijanta="obicno" velicina="sm" ikona={CreditCard} className="print:hidden" onClick={(e) => { e.stopPropagation(); otvoriDetalj(t.id); }}>Naplati</Dugme>
                : <StatusTermina status={t.status} />),
        },
    ];

    return (
        <div className="flex flex-col gap-4">
            <ZaglavljeStrane naslov={samoSvoje ? 'Moj dnevni promet' : 'Dnevni promet'} opis={`${datumSaDanomDugo(datum).replace(/^./, (c) => c.toUpperCase())} · naplata po načinu plaćanja${samoSvoje ? '' : ' i po radniku'}.`}
                akcije={(
                    <div className="flex flex-wrap items-center gap-2 print:hidden">
                        <div className="flex items-center gap-1">
                            <Dugme velicina="ikona" ikona={ChevronLeft} aria-label="Prethodni dan" onClick={() => setDatum((v) => dodajDane(v, -1))} />
                            <Unos type="date" value={datum} onChange={(e) => e.target.value && setDatum(e.target.value)} aria-label="Datum" className="h-9 w-[150px] py-1" />
                            <Dugme velicina="ikona" ikona={ChevronRight} aria-label="Sledeći dan" onClick={() => setDatum((v) => dodajDane(v, 1))} />
                        </div>
                        <Dugme velicina="sm" className="h-9" disabled={datum === d} onClick={() => setDatum(d)}>Danas</Dugme>
                        <Dugme velicina="sm" className="h-9" ikona={Printer} onClick={() => window.print()}>Štampaj</Dugme>
                    </div>
                )}>
                {zatvoren && <div className="mt-2"><Znacka ton="ok"><Lock className="h-3 w-3" aria-hidden="true" />Dan je zaključen</Znacka></div>}
            </ZaglavljeStrane>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
                <StatPlocica ikona={Wallet} ton="ok" oznaka="Ukupno naplaćeno" vrednost={rsd(x.ukupno)} trend={x.proslaNedelja ? promena(x.ukupno, x.proslaNedelja) : null} napomena={`pr. ned. ${rsd(x.proslaNedelja)}`} info="Poređenje sa istim danom prošle nedelje (za danas — do ovog sata)." />
                <StatPlocica ikona={CreditCard} ton="info" oznaka="Kartica" vrednost={rsd(x.kartica)} napomena={`${x.nap.filter((t) => t.placanje === 'kartica').length}×`} />
                <StatPlocica ikona={Banknote} ton="akc" oznaka="Gotovina" vrednost={rsd(x.gotovina)} napomena={`${x.nap.filter((t) => t.placanje === 'gotovina').length}×`} />
                <StatPlocica ikona={Gift} ton="tiho" oznaka="Vaučer" vrednost={rsd(x.vaucer)} napomena={`${x.nap.filter((t) => t.placanje === 'vaucer').length}×`} />
                <StatPlocica ikona={CalendarCheck} ton="tiho" oznaka="Naplaćeni termini" vrednost={x.nap.length} napomena={x.nenap.length ? `+ ${x.nenap.length} nenaplaćeno` : x.otkazano ? `${x.otkazano} otkazano` : 'sve naplaćeno'} />
                <StatPlocica ikona={ReceiptText} ton="tiho" oznaka="Prosečan račun" vrednost={rsd(prosek)} napomena="po naplaćenom terminu" />
            </div>

            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)]">
                <Kartica naslov="Termini dana" opis={`${termina(x.nap.length)} naplaćeno${x.nenap.length ? ` · ${x.nenap.length} čeka naplatu (${rsd(zbir(x.nenap))})` : ''}${x.otkazano ? ` · ${x.otkazano} otkazano / nije došlo` : ''}`} telo="p-0">
                    <Tabela kolone={kolone} redovi={x.redovi} onRed={(t) => otvoriDetalj(t.id)} gusto poStrani={40}
                        prazno={<Prazno ikona={ReceiptText} naslov="Nema termina za ovaj dan" opis={datum > d ? 'Dan još nije došao.' : 'Salon nije radio ili nema naplaćenih termina.'} />} />
                    {x.nap.length > 0 && (
                        <div className="flex items-center justify-between gap-3 border-t border-p-ivica px-4 py-3 text-sm sm:px-5">
                            <span className="text-p-tiho">Ukupno naplaćeno</span>
                            <span className="font-semibold tabularno">{rsd(x.ukupno)}</span>
                        </div>
                    )}
                </Kartica>

                <div className="flex min-w-0 flex-col gap-4">
                    <Kartica naslov="Način plaćanja" opis={x.ukupno ? `Od ukupno ${rsd(x.ukupno)}` : 'Još nema naplate'}>
                        <NaslaganaTraka format={rsd} delovi={[
                            { oznaka: 'Kartica', vrednost: x.kartica },
                            { oznaka: 'Gotovina', vrednost: x.gotovina },
                            { oznaka: 'Vaučer', vrednost: x.vaucer },
                        ]} />
                    </Kartica>
                    {!samoSvoje && (
                        <Kartica naslov="Po radniku" opis="Naplaćeno ovog dana">
                            {x.radnici.length
                                ? <RangLista format={rsd} stavke={x.radnici.map((r) => ({ oznaka: indeks.radnik[r.id]?.ime ?? r.id, vrednost: r.iznos, dodatak: termina(r.broj) }))} />
                                : <p className="text-[13px] text-p-tiho">Još nema naplaćenih termina.</p>}
                        </Kartica>
                    )}
                    {!samoSvoje && <ZatvoriDan datum={datum} gotovina={x.gotovina} kartica={x.kartica} vaucer={x.vaucer} nenaplaceno={x.nenap.length} />}
                    {samoSvoje && x.nap.length > 0 && <p className="text-[12.5px] text-p-tiho">Provizija se računa na kraju meseca od naplaćenog prometa — vidi „Moj dan”.</p>}
                </div>
            </div>
            <p className="hidden text-[12px] text-p-tiho print:block">Odštampano {datumKratko(d)} u {uSate(sadaMinut())}</p>
        </div>
    );
}
