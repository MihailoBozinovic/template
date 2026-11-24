/*
 * ZAHTEVI ZA TERMIN — online rezervacije sa sajta koje čekaju odobrenje.
 * Kao u AllSeasons panelu: najnoviji gore, uz svaki zahtev istorija klijenta
 * i upozorenje kad se preklapa sa drugim terminom; odobri / odbij / pomeri.
 */
import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Ban, BellRing, CalendarClock, CalendarDays, Check, CheckCheck, Clock, Globe, Phone, ShieldAlert, Sparkles } from 'lucide-react';
import { usePanel, useIndeksi, imeKlijenta, naziviUsluga } from '../podaci/Skladiste.jsx';
import { preklapanje } from '../podaci/analitika.js';
import { danas, dodajDane, datumKratko, datumRelativno, datumSaDanomDugo, preKoliko, rsd, uSate, vremeOdDo, mnozina } from '../format.js';
import { Avatar, Dugme, Kartica, MrezaPlocica, Prazno, StatPlocica, StatusTermina, Tabovi, ZaglavljeStrane, Znacka } from '../ui.jsx';
import { useTermini } from '../termini.jsx';
import { P } from '../Ljuska.jsx';

const cifre = (s = '') => s.replace(/\D/g, '');
const zahteva = (n) => `${n} ${mnozina(n, 'zahtev', 'zahteva', 'zahteva')}`;

function KarticaZahteva({ t, istorija, sudar, blokiran, bezSmene, naCekanju, onOdobri, onOdbij }) {
    const indeks = useIndeksi();
    const { otvoriNovi, otvoriDetalj } = useTermini();
    const k = indeks.klijent[t.klijentId];
    const r = indeks.radnik[t.radnikId];
    const ime = imeKlijenta(k);
    return (
        <li className="rounded-2xl border border-p-ivica bg-p-karta p-4 shadow-[0_1px_2px_rgb(0_0_0/.03)] sm:p-5">
            <div className="flex items-start gap-3">
                <Avatar ime={ime} velicina={40} />
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                        {k ? <Link to={`${P}/klijenti/${k.id}`} className="truncate text-[15px] font-semibold text-p-ink hover:underline">{ime}</Link> : <span className="text-[15px] font-semibold">{ime}</span>}
                        {istorija.posete === 0
                            ? <Znacka ton="info"><Sparkles className="h-3 w-3" aria-hidden="true" />Prvi dolazak</Znacka>
                            : <Znacka ton={istorija.posete >= 5 ? 'akc' : 'tiho'}>{istorija.posete + 1}. poseta</Znacka>}
                        {istorija.nijeDosao > 0 && <Znacka ton="greska">{istorija.nijeDosao}× nije došao</Znacka>}
                        {blokiran && <Znacka ton="greska"><ShieldAlert className="h-3 w-3" aria-hidden="true" />Blokiran broj</Znacka>}
                    </div>
                    <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[13px] text-p-tiho">
                        {k?.telefon && <a href={`tel:${cifre(k.telefon)}`} className="inline-flex items-center gap-1 hover:text-p-ink"><Phone className="h-3.5 w-3.5" aria-hidden="true" /><span className="tabularno">{k.telefon}</span></a>}
                        <span className="inline-flex items-center gap-1"><Globe className="h-3.5 w-3.5" aria-hidden="true" />sa sajta · {preKoliko(t.kreiran)}</span>
                    </div>
                </div>
                {!naCekanju && <StatusTermina status={t.status} />}
            </div>

            <div className="mt-4 grid gap-3 rounded-xl bg-p-meko/60 p-3 sm:grid-cols-[minmax(0,180px)_minmax(0,1fr)] sm:p-4">
                <div className="min-w-0">
                    <div className="text-[12.5px] text-p-tiho">{datumRelativno(t.datum)}{datumRelativno(t.datum).includes(',') ? '' : ` · ${datumKratko(t.datum)}`}</div>
                    <div className="text-lg font-semibold tabularno">{vremeOdDo(t.od, t.trajanje)}</div>
                </div>
                <div className="min-w-0">
                    <div className="text-sm font-medium text-p-ink">{naziviUsluga(t.usluge, indeks)}</div>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-p-tiho">
                        <span className="inline-flex items-center gap-1.5"><Avatar ime={r?.ime} slika={r?.slika} boja={r?.boja} velicina={20} />{r?.ime ?? 'Bilo ko'}</span>
                        <span className="tabularno">{t.trajanje} min · {rsd(t.cena)}</span>
                    </div>
                </div>
            </div>

            {naCekanju && (sudar || bezSmene || k?.napomena || t.napomena) && (
                <div className="mt-3 space-y-1.5">
                    {sudar && <p className="flex items-start gap-2 rounded-lg bg-p-upozbg px-3 py-2 text-[13px] text-p-upoz"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />Preklapa se sa terminom {uSate(sudar.od)}–{uSate(sudar.od + sudar.trajanje)} ({imeKlijenta(indeks.klijent[sudar.klijentId])}{sudar.status === 'zahtev' ? ', takođe zahtev' : ''}).</p>}
                    {bezSmene && <p className="flex items-start gap-2 rounded-lg bg-p-upozbg px-3 py-2 text-[13px] text-p-upoz"><CalendarClock className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />{r?.ime.split(' ')[0]} tog dana nema smenu ili je termin van smene.</p>}
                    {t.napomena && <p className="rounded-lg bg-p-infobg px-3 py-2 text-[13px] text-p-info">Napomena klijenta: {t.napomena}</p>}
                    {k?.napomena && <p className="rounded-lg bg-p-meko px-3 py-2 text-[13px] text-p-tiho">Iz kartona: {k.napomena}</p>}
                </div>
            )}

            <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
                <Dugme varijanta="tiho" velicina="sm" onClick={() => otvoriDetalj(t.id)} className="mr-auto">Detalj</Dugme>
                {naCekanju && (
                    <>
                        <Dugme varijanta="opasnoTiho" velicina="sm" ikona={Ban} onClick={() => onOdbij(t)}>Odbij</Dugme>
                        <Dugme varijanta="obicno" velicina="sm" ikona={CalendarClock} onClick={() => otvoriNovi({ izmena: t })}>Pomeri</Dugme>
                        <Dugme varijanta="glavno" velicina="sm" ikona={Check} onClick={() => onOdobri(t)}>Odobri</Dugme>
                    </>
                )}
            </div>
        </li>
    );
}

export default function Zahtevi() {
    const { podaci, izmeni, obavesti, zapisi } = usePanel();
    const indeks = useIndeksi();
    const [tab, setTab] = useState('ceka');
    const d = danas();

    const { naCekanju, odobreni, odbijeni, istorija, blokirani } = useMemo(() => {
        const pre7 = Date.now() - 7 * 864e5;
        const ist = {};
        for (const t of podaci.termini) {
            const x = (ist[t.klijentId] ??= { posete: 0, nijeDosao: 0 });
            if (t.status === 'zavrsen') x.posete += 1;
            else if (t.status === 'nije-dosao') x.nijeDosao += 1;
        }
        const poKreiranju = (a, b) => b.kreiran - a.kreiran;
        return {
            naCekanju: podaci.termini.filter((t) => t.status === 'zahtev').sort(poKreiranju),
            odobreni: podaci.termini.filter((t) => t.izvor === 'online' && t.status === 'potvrdjen' && t.kreiran >= pre7).sort(poKreiranju),
            odbijeni: podaci.termini.filter((t) => t.status === 'otkazan' && t.razlogOtkazivanja === 'Zahtev odbijen').sort(poKreiranju),
            istorija: ist,
            blokirani: new Set((podaci.blokirani ?? []).map((b) => cifre(b.telefon))),
        };
    }, [podaci.termini, podaci.blokirani]);

    const proveri = (t) => {
        const s = podaci.smene[`${t.radnikId}|${t.datum}`];
        return {
            sudar: preklapanje(podaci.termini, t),
            bezSmene: !s || t.od < s.od || t.od + t.trajanje > s.do,
        };
    };

    const opisTermina = (t) => `${imeKlijenta(indeks.klijent[t.klijentId])} — ${datumSaDanomDugo(t.datum)} u ${uSate(t.od)}`;
    const odobri = (t) => {
        izmeni('termini', t.id, { status: 'potvrdjen' });
        zapisi('zahtev', 'Odobrio zahtev', opisTermina(t));
        obavesti(`Zahtev je odobren — ${imeKlijenta(indeks.klijent[t.klijentId])} dobija SMS potvrdu.`);
    };
    const odbij = (t) => {
        izmeni('termini', t.id, { status: 'otkazan', razlogOtkazivanja: 'Zahtev odbijen' });
        zapisi('zahtev', 'Odbio zahtev', opisTermina(t));
        obavesti('Zahtev je odbijen — klijent dobija poruku sa linkom za novo zakazivanje.');
    };
    const odobriSve = () => {
        // Preskaču se zahtevi koji se preklapaju — njih treba proveriti ručno.
        const bezSudara = naCekanju.filter((t) => !preklapanje(podaci.termini, t));
        bezSudara.forEach((t) => izmeni('termini', t.id, { status: 'potvrdjen' }));
        if (bezSudara.length) zapisi('zahtev', 'Odobrio sve zahteve', zahteva(bezSudara.length));
        const ostalo = naCekanju.length - bezSudara.length;
        if (!bezSudara.length) obavesti('Nijedan zahtev nije odobren — svi se preklapaju sa drugim terminima.', 'greska');
        else obavesti(`Odobreno: ${zahteva(bezSudara.length)}.${ostalo ? ` ${ostalo} sa preklapanjem čeka proveru.` : ' Klijenti dobijaju SMS potvrdu.'}`);
    };

    const najstariji = naCekanju.length ? Math.min(...naCekanju.map((t) => t.kreiran)) : null;
    const uskoro = naCekanju.filter((t) => t.datum <= dodajDane(d, 1)).length;
    const saSudarom = naCekanju.filter((t) => preklapanje(podaci.termini, t)).length;
    const lista = tab === 'ceka' ? naCekanju : tab === 'odobreni' ? odobreni : odbijeni;

    return (
        <div className="flex flex-col gap-4">
            <ZaglavljeStrane naslov="Zahtevi za termin" opis="Online rezervacije sa sajta. Odobrite ih što pre — klijent tek tada dobija potvrdu."
                akcije={(
                    <>
                        <Dugme to={`${P}/kalendar`} ikona={CalendarDays}>Kalendar</Dugme>
                        {naCekanju.length > 0 && <Dugme varijanta="glavno" ikona={CheckCheck} onClick={odobriSve} kratko="Odobri sve">Odobri sve ({naCekanju.length})</Dugme>}
                    </>
                )} />

            <MrezaPlocica>
                <StatPlocica ikona={BellRing} ton="upoz" oznaka="Čeka odobrenje" vrednost={naCekanju.length} napomena={zahteva(naCekanju.length)} />
                <StatPlocica ikona={Clock} ton="info" oznaka="Najstariji zahtev" vrednost={najstariji ? preKoliko(najstariji).replace(/^pre /, '') : '—'} napomena={najstariji ? 'od slanja sa sajta' : 'nema zahteva'} />
                <StatPlocica ikona={CalendarClock} ton="akc" oznaka="Za danas i sutra" vrednost={uskoro} napomena="hitno za odobriti" />
                <StatPlocica ikona={AlertTriangle} ton={saSudarom ? 'greska' : 'tiho'} oznaka="Sa preklapanjem" vrednost={saSudarom} napomena={`${odobreni.length} odobreno za 7 dana`} />
            </MrezaPlocica>

            <Tabovi aktivan={tab} onChange={setTab} stavke={[
                { id: 'ceka', naziv: 'Na čekanju', broj: naCekanju.length },
                { id: 'odobreni', naziv: 'Odobreni (7 dana)', broj: odobreni.length },
                { id: 'odbijeni', naziv: 'Odbijeni', broj: odbijeni.length },
            ]} />

            {lista.length ? (
                <ul className="grid gap-3 xl:grid-cols-2">
                    {lista.map((t) => {
                        const k = indeks.klijent[t.klijentId];
                        const { sudar, bezSmene } = tab === 'ceka' ? proveri(t) : {};
                        return (
                            <KarticaZahteva key={t.id} t={t} istorija={istorija[t.klijentId] ?? { posete: 0, nijeDosao: 0 }} sudar={sudar} bezSmene={bezSmene}
                                blokiran={!!k && blokirani.has(cifre(k.telefon))} naCekanju={tab === 'ceka'} onOdobri={odobri} onOdbij={odbij} />
                        );
                    })}
                </ul>
            ) : (
                <Kartica>
                    <Prazno ikona={tab === 'ceka' ? CheckCheck : tab === 'odobreni' ? Check : Ban}
                        naslov={tab === 'ceka' ? 'Svi zahtevi su obrađeni' : tab === 'odobreni' ? 'Nema odobrenih online termina' : 'Nema odbijenih zahteva'}
                        opis={tab === 'ceka' ? 'Novi zahtevi sa sajta stižu ovde i u obaveštenja (zvonce gore desno).' : tab === 'odobreni' ? 'Ovde su online rezervacije potvrđene u poslednjih 7 dana.' : 'Odbijeni zahtevi ostaju ovde, da se zna kome je ponuđeno drugo vreme.'} />
                </Kartica>
            )}
            {tab === 'ceka' && naCekanju.length > 0 && (
                <p className="text-[12.5px] text-p-tiho">„Odobri sve” preskače zahteve koji se preklapaju sa drugim terminom — njih pomerite ili odbijte ručno.</p>
            )}
        </div>
    );
}
