/*
 * PROMO KODOVI — popust koji klijent upisuje pri online zakazivanju.
 * Status se računa iz perioda i prekidača: Aktivan / Zakazan / Istekao / Isključen.
 */
import React, { useMemo, useState } from 'react';
import { BadgePercent, CalendarRange, Info, Pencil, Plus, Trash2 } from 'lucide-react';
import { usePanel } from '../podaci/Skladiste.jsx';
import { broj, danas as danasF, datumBrojevi, datumKratko, dodajDane, mnozina, procenat, razlikaDana } from '../format.js';
import { Dugme, Kartica, Merac, Modal, Polje, Prazno, Prekidac, Tabovi, Unos, ZaglavljeStrane, Znacka, cx } from '../ui.jsx';

const STATUSI = {
    aktivan: { naziv: 'Aktivan', ton: 'ok' },
    zakazan: { naziv: 'Zakazan', ton: 'info' },
    istekao: { naziv: 'Istekao', ton: 'tiho' },
    iskljucen: { naziv: 'Isključen', ton: 'upoz' },
    potrosen: { naziv: 'Limit dostignut', ton: 'tiho' },
};

const statusKoda = (p, d) => {
    if (!p.aktivan) return 'iskljucen';
    if (p.do < d) return 'istekao';
    if (p.od > d) return 'zakazan';
    if (p.limit && p.iskorisceno >= p.limit) return 'potrosen';
    return 'aktivan';
};
const popustTekst = (p) => (p.vrsta === 'procenat' ? `−${p.popust}%` : `−${broj(p.popust)} RSD`);

function FormaKoda({ kod, onClose }) {
    const { podaci, dodaj, izmeni, noviId, obavesti, zapisi } = usePanel();
    const d = danasF();
    const [f, setF] = useState(() => (kod ? { ...kod, popust: String(kod.popust), limit: kod.limit ? String(kod.limit) : '' } : { kod: '', vrsta: 'procenat', popust: '10', opis: '', od: d, do: dodajDane(d, 30), limit: '', aktivan: true, iskorisceno: 0 }));
    const postavi = (k, v) => setF((s) => ({ ...s, [k]: v }));
    const popust = Number(f.popust) || 0;
    const zauzet = podaci.promoKodovi.some((p) => p.kod === f.kod && p.id !== kod?.id);
    const greska = !f.kod ? 'Upišite kod.' : f.kod.length < 3 ? 'Kod mora imati bar 3 znaka.' : zauzet ? 'Ovaj kod već postoji.'
        : popust <= 0 ? 'Popust mora biti veći od nule.' : f.vrsta === 'procenat' && popust > 90 ? 'Najviše 90%.' : f.do < f.od ? 'Kraj je pre početka.' : null;

    const sacuvaj = () => {
        if (greska) return;
        const stavka = { kod: f.kod, vrsta: f.vrsta, popust, opis: f.opis.trim(), od: f.od, do: f.do, limit: Number(f.limit) || 0, aktivan: f.aktivan };
        if (kod) {
            izmeni('promoKodovi', kod.id, stavka);
            zapisi('promo', 'Izmenio promo kod', `${f.kod} · ${popustTekst(stavka)}`);
            obavesti(`Kod ${f.kod} je sačuvan.`);
        } else {
            dodaj('promoKodovi', { id: noviId('p'), iskorisceno: 0, ...stavka });
            zapisi('promo', 'Dodao promo kod', `${f.kod} · ${popustTekst(stavka)}`);
            obavesti(`Kod ${f.kod} je dodat.`);
        }
        onClose();
    };

    return (
        <Modal otvoren onClose={onClose} naslov={kod ? `Izmena koda ${kod.kod}` : 'Novi promo kod'} opis="Klijent upisuje kod u poslednjem koraku online zakazivanja."
            podnozje={<><Dugme onClick={onClose}>Odustani</Dugme><Dugme varijanta="glavno" disabled={!!greska} onClick={sacuvaj}>{kod ? 'Sačuvaj' : 'Dodaj kod'}</Dugme></>}>
            <div className="space-y-4">
                <Polje oznaka="Kod" pomoc="Velika slova i brojevi, bez razmaka.">
                    <Unos value={f.kod} onChange={(e) => postavi('kod', e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 16))} placeholder="npr. PROLECE15" className="font-mono tracking-[.08em]" />
                </Polje>
                <div className="grid gap-4 sm:grid-cols-2">
                    <Polje oznaka="Vrsta popusta">
                        <Tabovi stavke={[{ id: 'procenat', naziv: 'Procenat' }, { id: 'iznos', naziv: 'Iznos (RSD)' }]} aktivan={f.vrsta} onChange={(v) => postavi('vrsta', v)} className="w-full" />
                    </Polje>
                    <Polje oznaka={f.vrsta === 'procenat' ? 'Popust (%)' : 'Popust (RSD)'}>
                        <Unos inputMode="numeric" value={f.popust} onChange={(e) => postavi('popust', e.target.value.replace(/\D/g, '').slice(0, 6))} />
                    </Polje>
                </div>
                <Polje oznaka="Opis" pomoc="Za osoblje — klijent vidi samo kod i popust.">
                    <Unos value={f.opis} onChange={(e) => postavi('opis', e.target.value)} placeholder="npr. Prolećna akcija na boju" />
                </Polje>
                <div className="grid grid-cols-2 gap-4">
                    <Polje oznaka="Važi od"><Unos type="date" value={f.od} onChange={(e) => postavi('od', e.target.value)} /></Polje>
                    <Polje oznaka="Važi do"><Unos type="date" value={f.do} onChange={(e) => postavi('do', e.target.value)} /></Polje>
                </div>
                <Polje oznaka="Limit korišćenja" pomoc="Prazno = bez limita.">
                    <Unos inputMode="numeric" value={f.limit} onChange={(e) => postavi('limit', e.target.value.replace(/\D/g, '').slice(0, 5))} placeholder="bez limita" />
                </Polje>
                <Prekidac oznaka="Kod je uključen" opis="Isključen kod ne prolazi ni u periodu važenja." ukljuceno={f.aktivan} onChange={(v) => postavi('aktivan', v)} />
                {greska && f.kod && <p className="text-[13px] text-p-greska">{greska}</p>}
            </div>
        </Modal>
    );
}

function KarticaKoda({ p, d, onIzmeni, onBrisi }) {
    const { izmeni, obavesti, zapisi } = usePanel();
    const st = statusKoda(p, d);
    const doKraja = razlikaDana(d, p.do);
    return (
        <article className={cx('flex min-w-0 flex-col rounded-2xl border border-p-ivica bg-p-karta p-4 shadow-[0_1px_2px_rgb(0_0_0/.03)] sm:p-5', (st === 'istekao' || st === 'iskljucen') && 'opacity-75')}>
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <div className="truncate font-mono text-[20px] font-semibold tracking-[.08em] sm:text-[22px]">{p.kod}</div>
                    <div className="mt-0.5 truncate text-[13px] text-p-tiho">{p.opis || 'Bez opisa'}</div>
                </div>
                <div className="shrink-0 rounded-xl bg-p-staza px-2.5 py-1.5 text-[17px] font-semibold leading-none text-p-akc tabularno">{popustTekst(p)}</div>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[13px]">
                <Znacka ton={STATUSI[st].ton} tacka>{STATUSI[st].naziv}</Znacka>
                <span className="inline-flex items-center gap-1.5 text-p-tiho tabularno"><CalendarRange className="h-3.5 w-3.5" aria-hidden="true" />{datumKratko(p.od)} – {datumBrojevi(p.do)}</span>
                {st === 'aktivan' && doKraja <= 14 && <span className="text-[12.5px] font-medium text-p-upoz">još {doKraja} {mnozina(doKraja, 'dan', 'dana', 'dana')}</span>}
                {st === 'zakazan' && <span className="text-[12.5px] text-p-info">počinje za {razlikaDana(d, p.od)} d</span>}
            </div>
            <div className="mt-4">
                <div className="flex items-baseline justify-between text-[13px]">
                    <span className="text-p-tiho">Iskorišćeno</span>
                    <span className="font-medium tabularno">{broj(p.iskorisceno)}{p.limit ? <span className="text-p-tiho"> / {broj(p.limit)}</span> : <span className="font-normal text-p-tiho"> · bez limita</span>}</span>
                </div>
                {p.limit > 0 && <Merac className="mt-1.5" vrednost={p.iskorisceno / p.limit} ton={p.iskorisceno >= p.limit ? 'upoz' : 'graf'} oznaka={`Iskorišćenost ${p.kod}`} />}
                {p.limit > 0 && <div className="mt-1 text-right text-[11.5px] text-p-tiho tabularno">{procenat(Math.min(1, p.iskorisceno / p.limit))}</div>}
            </div>
            <div className="mt-auto flex items-center justify-between gap-2 border-t border-p-ivica/70 pt-1">
                <div className="-my-1">
                    <Prekidac oznaka="Uključen" ukljuceno={p.aktivan} onChange={(v) => {
                        izmeni('promoKodovi', p.id, { aktivan: v });
                        zapisi('promo', v ? 'Uključio promo kod' : 'Isključio promo kod', p.kod);
                        obavesti(v ? `Kod ${p.kod} je uključen.` : `Kod ${p.kod} je isključen.`, v ? 'ok' : 'info');
                    }} />
                </div>
                <div className="flex gap-1">
                    <Dugme varijanta="tiho" velicina="ikonaSm" ikona={Pencil} aria-label={`Izmeni ${p.kod}`} title="Izmeni" onClick={onIzmeni} />
                    <Dugme varijanta="opasnoTiho" velicina="ikonaSm" ikona={Trash2} aria-label={`Obriši ${p.kod}`} title="Obriši" onClick={onBrisi} />
                </div>
            </div>
        </article>
    );
}

export default function PromoKodovi() {
    const { podaci, obrisi, obavesti, zapisi } = usePanel();
    const d = danasF();
    const [forma, setForma] = useState(null); // null | 'novi' | kod
    const [brisanje, setBrisanje] = useState(null);
    const [filter, setFilter] = useState('svi');

    const lista = useMemo(() => {
        const red = { aktivan: 0, zakazan: 1, potrosen: 2, iskljucen: 3, istekao: 4 };
        return podaci.promoKodovi.map((p) => ({ p, st: statusKoda(p, d) })).sort((a, b) => red[a.st] - red[b.st] || b.p.od.localeCompare(a.p.od));
    }, [podaci.promoKodovi, d]);
    const prikaz = lista.filter((x) => filter === 'svi' || (filter === 'aktivni' ? x.st === 'aktivan' || x.st === 'zakazan' : x.st !== 'aktivan' && x.st !== 'zakazan'));
    const ukupnoIsk = podaci.promoKodovi.reduce((s, p) => s + p.iskorisceno, 0);

    return (
        <div className="flex flex-col gap-4">
            <ZaglavljeStrane naslov="Promo kodovi" opis={`${lista.filter((x) => x.st === 'aktivan').length} aktivnih · ukupno ${broj(ukupnoIsk)} korišćenja`}
                akcije={<Dugme varijanta="glavno" ikona={Plus} onClick={() => setForma('novi')} kratko="Novi">Novi kod</Dugme>} />
            <Tabovi aktivan={filter} onChange={setFilter} className="self-start" stavke={[
                { id: 'svi', naziv: 'Svi', broj: lista.length },
                { id: 'aktivni', naziv: 'Aktivni i zakazani', broj: lista.filter((x) => x.st === 'aktivan' || x.st === 'zakazan').length },
                { id: 'neaktivni', naziv: 'Neaktivni', broj: lista.filter((x) => x.st !== 'aktivan' && x.st !== 'zakazan').length },
            ]} />
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
                <div>
                    {prikaz.length ? (
                        <div className="grid gap-4 sm:grid-cols-2">
                            {prikaz.map(({ p }) => <KarticaKoda key={p.id} p={p} d={d} onIzmeni={() => setForma(p)} onBrisi={() => setBrisanje(p)} />)}
                        </div>
                    ) : (
                        <Kartica><Prazno ikona={BadgePercent} naslov="Nema kodova u ovoj grupi" opis="Novi kod se dodaje dugmetom gore desno." /></Kartica>
                    )}
                </div>
                <Kartica naslov="Kako rade promo kodovi" className="self-start">
                    <ul className="space-y-3 text-[13.5px] text-p-tiho">
                        {[
                            'Klijent upisuje kod u poslednjem koraku online zakazivanja, pre potvrde termina.',
                            'Popust se računa od cene usluga — procenat ili fiksan iznos, nikad ispod nule.',
                            'Kod važi samo u zadatom periodu i dok nije dostignut limit korišćenja.',
                            'Iskorišćenje se broji tek kad je termin naplaćen; otkazani termin ne troši kod.',
                            'Isključen kod prestaje odmah, i za termine koji su već u toku zakazivanja.',
                        ].map((t, i) => (
                            <li key={i} className="flex gap-2.5"><span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-p-staza text-[11px] font-semibold text-p-akc">{i + 1}</span><span>{t}</span></li>
                        ))}
                    </ul>
                    <p className="mt-4 flex gap-2 rounded-xl bg-p-infobg px-3 py-2.5 text-[12.5px] text-p-info"><Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />Kod iz SMS kampanje (npr. BLACKFRIDAY) najbolje radi sa kratkim periodom i limitom.</p>
                </Kartica>
            </div>
            {forma && <FormaKoda key={forma === 'novi' ? 'novi' : forma.id} kod={forma === 'novi' ? null : forma} onClose={() => setForma(null)} />}
            <Modal otvoren={!!brisanje} onClose={() => setBrisanje(null)} naslov={`Obrisati kod ${brisanje?.kod ?? ''}?`} opis={brisanje?.iskorisceno ? `Korišćen ${brisanje.iskorisceno} puta.` : undefined}
                podnozje={<><Dugme onClick={() => setBrisanje(null)}>Odustani</Dugme><Dugme varijanta="opasno" data-fokus onClick={() => { obrisi('promoKodovi', brisanje.id); zapisi('promo', 'Obrisao promo kod', brisanje.kod); obavesti(`Kod ${brisanje.kod} je obrisan.`, 'info'); setBrisanje(null); }}>Obriši</Dugme></>}>
                <p className="text-sm text-p-tiho">Klijenti više neće moći da ga upišu. Ako želite samo da ga privremeno zaustavite, isključite ga prekidačem.</p>
            </Modal>
        </div>
    );
}
