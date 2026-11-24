/*
 * PODACI SALONA — naziv, kontakt, adresa i podaci firme. Ista polja na sajtu
 * idu u header, footer, kontakt, JSON-LD i pravne strane (src/config/salon.js).
 */
import React, { useEffect, useMemo, useState } from 'react';
import { Building2, Info, MapPin, Phone, RotateCcw, Save, Store } from 'lucide-react';
import { usePanel, useDozvole } from '../podaci/Skladiste.jsx';
import { mnozina } from '../format.js';
import { Dugme, Kartica, Polje, TekstPolje, Unos, ZaglavljeStrane, Znacka } from '../ui.jsx';

const SEKCIJE = [
    {
        id: 'osnovno', naslov: 'Osnovno', opis: 'Kako se salon predstavlja na sajtu', ikona: Store, polja: [
            { k: 'naziv', oznaka: 'Naziv salona', sirok: true },
            { k: 'kratkiNaziv', oznaka: 'Kratki naziv', pomoc: 'Za ikonicu aplikacije i SMS — do ~12 slova.', max: 16 },
            { k: 'slogan', oznaka: 'Slogan' },
            { k: 'opis', oznaka: 'Opis', tekst: true, sirok: true, pomoc: 'Prikazuje se u Google rezultatima — 1 do 2 rečenice.' },
        ],
    },
    {
        id: 'kontakt', naslov: 'Kontakt', opis: 'Telefon i mreže u headeru, footeru i na kontaktu', ikona: Phone, polja: [
            { k: 'telefon', oznaka: 'Telefon', tip: 'tel', placeholder: '011 123 4567' },
            { k: 'email', oznaka: 'E-pošta', tip: 'email', placeholder: 'kontakt@salon.rs' },
            { k: 'instagram', oznaka: 'Instagram', placeholder: 'https://instagram.com/…' },
            { k: 'facebook', oznaka: 'Facebook', placeholder: 'https://facebook.com/…' },
        ],
    },
    {
        id: 'adresa', naslov: 'Adresa', opis: 'Za mapu, Google i kontakt stranu', ikona: MapPin, polja: [
            { k: 'adresa', oznaka: 'Ulica i broj', sirok: true },
            { k: 'grad', oznaka: 'Grad' },
            { k: 'postanskiBroj', oznaka: 'Poštanski broj', mod: 'numeric', max: 5 },
        ],
    },
    {
        id: 'firma', naslov: 'Firma', opis: 'Pravni podaci — footer, uslovi korišćenja i računi', ikona: Building2, polja: [
            { k: 'firma', oznaka: 'Naziv firme', sirok: true, placeholder: 'Salon, Ime Prezime PR, Beograd' },
            { k: 'pib', oznaka: 'PIB', mod: 'numeric', max: 9, pomoc: '9 cifara' },
            { k: 'maticniBroj', oznaka: 'Matični broj', mod: 'numeric', max: 8, pomoc: '8 cifara' },
            { k: 'adresaFirme', oznaka: 'Adresa sedišta', sirok: true },
        ],
    },
];
const KLJUCEVI = SEKCIJE.flatMap((s) => s.polja.map((p) => p.k));

const proveri = (f) => {
    const g = {};
    if (!f.naziv?.trim()) g.naziv = 'Naziv je obavezan.';
    if (f.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email)) g.email = 'Proverite adresu e-pošte.';
    if (f.pib && !/^\d{9}$/.test(f.pib)) g.pib = 'PIB ima 9 cifara.';
    if (f.maticniBroj && !/^\d{8}$/.test(f.maticniBroj)) g.maticniBroj = 'Matični broj ima 8 cifara.';
    if (f.postanskiBroj && !/^\d{5}$/.test(f.postanskiBroj)) g.postanskiBroj = 'Poštanski broj ima 5 cifara.';
    return g;
};

export default function PodaciSalona() {
    const { podaci, postavi, obavesti, zapisi } = usePanel();
    const { podesavanja: moze } = useDozvole();
    const izvor = podaci.podaciSalona;
    const iz = (p) => Object.fromEntries(KLJUCEVI.map((k) => [k, p?.[k] ?? '']));
    const [f, setF] = useState(() => iz(izvor));
    useEffect(() => { setF(iz(izvor)); }, [izvor]); // eslint-disable-line react-hooks/exhaustive-deps

    const izmenjeno = useMemo(() => KLJUCEVI.filter((k) => (f[k] ?? '') !== (izvor?.[k] ?? '')), [f, izvor]);
    const greske = proveri(f);
    const imaGresaka = Object.keys(greske).length > 0;

    const sacuvaj = () => {
        if (!izmenjeno.length || imaGresaka) return;
        const novo = Object.fromEntries(KLJUCEVI.map((k) => [k, String(f[k] ?? '').trim()]));
        postavi('podaciSalona', (p) => ({ ...p, ...novo }));
        const nazivi = SEKCIJE.flatMap((s) => s.polja).filter((p) => izmenjeno.includes(p.k)).map((p) => p.oznaka.toLowerCase());
        zapisi('salon', 'Izmenio podatke salona', nazivi.join(', '));
        obavesti('Sačuvano — na sajtu se menja posle objave');
    };

    return (
        <div className="flex flex-col gap-4 pb-20 sm:pb-0">
            <ZaglavljeStrane naslov="Podaci salona" opis="Naziv, kontakt, adresa i podaci firme — isti podaci idu na sajt, u Google i na pravne strane."
                akcije={moze && (
                    <>
                        {izmenjeno.length > 0 && <Znacka ton="upoz" tacka>{izmenjeno.length} {mnozina(izmenjeno.length, 'izmena nije sačuvana', 'izmene nisu sačuvane', 'izmena nije sačuvano')}</Znacka>}
                        <Dugme ikona={RotateCcw} disabled={!izmenjeno.length} onClick={() => setF(iz(izvor))}>Poništi</Dugme>
                        <Dugme varijanta="glavno" ikona={Save} disabled={!izmenjeno.length || imaGresaka} onClick={sacuvaj}>Sačuvaj izmene</Dugme>
                    </>
                )} />

            {!moze && <p className="rounded-xl border border-p-upoz/30 bg-p-upozbg px-3 py-2.5 text-[13px] text-p-upoz">Samo za čitanje — podatke salona menja administrator.</p>}

            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_300px]">
                <form className="flex flex-col gap-4" onSubmit={(e) => { e.preventDefault(); sacuvaj(); }}>
                    {SEKCIJE.map((s) => {
                        const I = s.ikona;
                        return (
                            <Kartica key={s.id} naslov={<span className="flex items-center gap-2"><I className="h-4 w-4 text-p-tiho" aria-hidden="true" />{s.naslov}</span>} opis={s.opis}>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    {s.polja.map((p) => {
                                        const menjano = izmenjeno.includes(p.k);
                                        const props = {
                                            value: f[p.k] ?? '', disabled: !moze, placeholder: p.placeholder,
                                            onChange: (e) => { let v = e.target.value; if (p.mod === 'numeric') v = v.replace(/\D/g, ''); if (p.max) v = v.slice(0, p.max); setF((x) => ({ ...x, [p.k]: v })); },
                                        };
                                        return (
                                            <Polje key={p.k} className={p.sirok ? 'sm:col-span-2' : undefined}
                                                oznaka={<span className="flex items-center gap-1.5">{p.oznaka}{menjano && <span className="h-1.5 w-1.5 rounded-full bg-p-upoz" title="Izmenjeno" aria-label="izmenjeno" />}</span>}
                                                pomoc={greske[p.k] ? <span className="text-p-greska">{greske[p.k]}</span> : p.pomoc}>
                                                {p.tekst ? <TekstPolje {...props} /> : <Unos {...props} type={p.tip ?? 'text'} inputMode={p.mod} className={p.mod ? 'tabularno' : undefined} />}
                                            </Polje>
                                        );
                                    })}
                                </div>
                            </Kartica>
                        );
                    })}
                </form>

                <div className="flex flex-col gap-4 xl:sticky xl:top-20 xl:self-start">
                    <Kartica naslov="Kako izgleda na sajtu" telo="p-4">
                        <div className="rounded-xl border border-p-ivica bg-p-meko/50 p-4">
                            <div className="text-[15px] font-semibold">{f.naziv || 'Naziv salona'}</div>
                            {f.slogan && <div className="mt-0.5 text-[13px] italic text-p-tiho">{f.slogan}</div>}
                            <div className="mt-3 space-y-1 text-[13px] text-p-tiho">
                                <div className="tabularno">{f.telefon || '—'}</div>
                                <div className="truncate">{f.email || '—'}</div>
                                <div>{[f.adresa, [f.postanskiBroj, f.grad].filter(Boolean).join(' ')].filter(Boolean).join(', ') || '—'}</div>
                            </div>
                            <div className="mt-3 border-t border-p-ivica pt-2 text-[11.5px] text-p-tiho">{f.firma}{f.pib ? ` · PIB ${f.pib}` : ''}{f.maticniBroj ? ` · MB ${f.maticniBroj}` : ''}</div>
                        </div>
                    </Kartica>
                    <div className="flex gap-2.5 rounded-2xl border border-p-info/25 bg-p-infobg p-4 text-[13px] text-p-info">
                        <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                        <p>U produkciji su ove vrednosti u <code className="font-mono text-[12.5px]">src/config/salon.js</code> (naziv, kontakt, lokacija, firma). Posle izmene sajt se ponovo objavljuje, pa se sve menja na svim stranama odjednom.</p>
                    </div>
                </div>
            </div>

            {moze && izmenjeno.length > 0 && (
                <div className="fixed inset-x-0 bottom-0 z-[84] flex items-center justify-between gap-2 border-t border-p-ivica bg-p-karta py-3 pl-4 pr-24 pb-[max(.75rem,env(safe-area-inset-bottom))] shadow-[0_-4px_16px_rgb(0_0_0/.06)] sm:hidden">
                    <span className="text-[13px] font-medium text-p-upoz">{izmenjeno.length} nesačuvano</span>
                    <div className="flex gap-2">
                        <Dugme velicina="sm" onClick={() => setF(iz(izvor))}>Poništi</Dugme>
                        <Dugme velicina="sm" varijanta="glavno" disabled={imaGresaka} onClick={sacuvaj}>Sačuvaj</Dugme>
                    </div>
                </div>
            )}
        </div>
    );
}
