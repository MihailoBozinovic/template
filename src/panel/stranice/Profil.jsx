/*
 * MOJ PROFIL — nalog prijavljene osobe: lični podaci, lozinka, dvofaktorska
 * zaštita, obaveštenja, izgled panela i aktivne sesije. Lozinka se u demo
 * verziji samo proverava (dužina, poklapanje) — nigde se ne čuva.
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, KeyRound, LogOut, Monitor, Smartphone, Tablet } from 'lucide-react';
import { usePanel, useIndeksi, ULOGE } from '../podaci/Skladiste.jsx';
import { preKoliko } from '../format.js';
import { Avatar, Dugme, Kartica, Polje, Prekidac, Unos, ZaglavljeStrane, Znacka } from '../ui.jsx';
import { P } from '../Ljuska.jsx';

const OBAVESTENJA = [
    ['noviZahtev', 'Novi zahtev za termin', 'Čim neko zakaže preko sajta.'],
    ['otkazivanje', 'Otkazivanje termina', 'Kad klijent otkaže ili ne dođe.'],
    ['dnevniIzvestaj', 'Dnevni izveštaj e-poštom', 'Promet i termini za sutra, svako veče u 21:00.'],
    ['push', 'Push obaveštenja na telefonu', 'Za podsetnike i nove zahteve dok niste u salonu.'],
];
const PODRAZUMEVANO = { noviZahtev: true, otkazivanje: true, dnevniIzvestaj: false, push: true, dvaFaktora: false };

function LicniPodaci({ pocetno, onSacuvaj }) {
    const [f, setF] = useState(pocetno);
    const [greska, setGreska] = useState('');
    const p = (k) => (e) => { setF({ ...f, [k]: e.target.value }); setGreska(''); };
    const promenjeno = ['ime', 'email', 'telefon'].some((k) => (f[k] ?? '') !== (pocetno[k] ?? ''));
    const sacuvaj = () => {
        if (!f.ime.trim()) { setGreska('Upišite ime.'); return; }
        if (!/^\S+@\S+\.\S+$/.test(f.email.trim())) { setGreska('E-pošta nije ispravna.'); return; }
        onSacuvaj({ ime: f.ime.trim(), email: f.email.trim(), telefon: f.telefon.trim() });
    };
    return (
        <Kartica naslov="Lični podaci" opis="Ime se vidi u dnevniku izmena i kod termina koje zakažete.">
            <div className="grid gap-3 sm:grid-cols-2">
                <Polje oznaka="Ime i prezime" className="sm:col-span-2"><Unos value={f.ime} onChange={p('ime')} autoComplete="name" /></Polje>
                <Polje oznaka="E-pošta"><Unos type="email" inputMode="email" value={f.email} onChange={p('email')} autoComplete="email" /></Polje>
                <Polje oznaka="Telefon"><Unos inputMode="tel" value={f.telefon} onChange={p('telefon')} autoComplete="tel" placeholder="06x xxx xxxx" /></Polje>
            </div>
            <div className="mt-4 flex items-center justify-end gap-2">
                {greska && <p role="alert" className="mr-auto text-[13px] font-medium text-p-greska">{greska}</p>}
                <Dugme varijanta="glavno" velicina="sm" ikona={Check} disabled={!promenjeno} onClick={sacuvaj}>Sačuvaj</Dugme>
            </div>
        </Kartica>
    );
}

function Lozinka() {
    const { obavesti } = usePanel();
    const [f, setF] = useState({ trenutna: '', nova: '', ponovo: '' });
    const [greska, setGreska] = useState('');
    const p = (k) => (e) => { setF({ ...f, [k]: e.target.value }); setGreska(''); };
    const promeni = () => {
        if (!f.trenutna) { setGreska('Upišite trenutnu lozinku.'); return; }
        if (f.nova.length < 8) { setGreska('Nova lozinka mora imati bar 8 znakova.'); return; }
        if (f.nova !== f.ponovo) { setGreska('Nove lozinke se ne poklapaju.'); return; }
        if (f.nova === f.trenutna) { setGreska('Nova lozinka mora biti drugačija od trenutne.'); return; }
        setF({ trenutna: '', nova: '', ponovo: '' }); // demo: ništa se ne čuva
        obavesti('Lozinka je promenjena.');
    };
    const jacina = f.nova.length === 0 ? null : f.nova.length < 8 ? ['Prekratka', 'greska'] : /[0-9]/.test(f.nova) && /[^A-Za-z0-9]/.test(f.nova) && f.nova.length >= 12 ? ['Jaka', 'ok'] : ['Dovoljna', 'upoz'];
    return (
        <Kartica naslov="Lozinka" opis="Najmanje 8 znakova; najbolje rečenica sa brojem i znakom.">
            <form className="grid gap-3" onSubmit={(e) => { e.preventDefault(); promeni(); }}>
                <input type="text" autoComplete="username" className="hidden" aria-hidden="true" tabIndex={-1} readOnly value="" />
                <Polje oznaka="Trenutna lozinka"><Unos type="password" value={f.trenutna} onChange={p('trenutna')} autoComplete="current-password" /></Polje>
                <div className="grid gap-3 sm:grid-cols-2">
                    <Polje oznaka="Nova lozinka"><Unos type="password" value={f.nova} onChange={p('nova')} autoComplete="new-password" /></Polje>
                    <Polje oznaka="Ponovite novu"><Unos type="password" value={f.ponovo} onChange={p('ponovo')} autoComplete="new-password" /></Polje>
                </div>
                <div className="flex flex-wrap items-center justify-end gap-2">
                    {greska ? <p role="alert" className="mr-auto text-[13px] font-medium text-p-greska">{greska}</p> : jacina && <span className="mr-auto"><Znacka ton={jacina[1]} tacka>{jacina[0]}</Znacka></span>}
                    <Dugme varijanta="obicno" velicina="sm" ikona={KeyRound} type="submit" disabled={!f.trenutna && !f.nova}>Promeni lozinku</Dugme>
                </div>
            </form>
        </Kartica>
    );
}

export default function Profil() {
    const { podaci, sesija, tamno, setTamno, postavi, izmeni, obavesti, zapisi, odjavi } = usePanel();
    const indeks = useIndeksi();
    const navigate = useNavigate();
    const kljuc = sesija?.email || sesija?.uloga || 'demo';
    const moje = { ...PODRAZUMEVANO, ...(podaci.profilPodesavanja?.[kljuc] ?? {}) };
    const nalog = podaci.osoblje.find((o) => o.email === sesija?.email);
    const radnik = indeks.radnik[sesija?.radnikId];
    const [sesije, setSesije] = useState([
        { id: 's2', ikona: Smartphone, naziv: 'iPhone · Safari', mesto: 'Beograd', ts: Date.now() - 864e5 * 2 },
        { id: 's3', ikona: Tablet, naziv: 'iPad na pultu · Chrome', mesto: 'Salon', ts: Date.now() - 3600e3 * 5 },
    ]);

    const sacuvajMoje = (izmena) => postavi('profilPodesavanja', (p) => ({ ...(p ?? {}), [kljuc]: { ...(p?.[kljuc] ?? {}), ...izmena } }));
    const prekidac = (k, poruka) => (v) => { sacuvajMoje({ [k]: v }); obavesti(poruka(v)); };

    const pocetno = { ime: moje.ime ?? sesija?.ime ?? '', email: moje.email ?? sesija?.email ?? '', telefon: moje.telefon ?? radnik?.telefon ?? '' };
    const sacuvajLicne = (f) => {
        sacuvajMoje(f);
        if (nalog) izmeni('osoblje', nalog.id, { ime: f.ime }); // e-pošta je ključ sesije — u demo verziji ostaje ista na nalogu
        zapisi('profil', 'Izmenio lične podatke', f.ime);
        obavesti('Lični podaci su sačuvani.');
    };

    return (
        <div className="flex flex-col gap-4">
            <ZaglavljeStrane naslov="Moj profil" opis="Vaš nalog, bezbednost i obaveštenja.">
                <div className="mt-3 flex items-center gap-3">
                    <Avatar ime={pocetno.ime} slika={radnik?.slika} boja={radnik?.boja} velicina={44} />
                    <div className="min-w-0">
                        <div className="truncate text-sm font-semibold">{pocetno.ime}</div>
                        <div className="flex flex-wrap items-center gap-2 text-[12.5px] text-p-tiho"><Znacka ton="akc">{ULOGE[sesija?.uloga]?.naziv ?? 'Demo'}</Znacka><span className="truncate">{pocetno.email}</span></div>
                    </div>
                </div>
            </ZaglavljeStrane>

            <div className="grid gap-4 lg:grid-cols-2">
                <div className="flex min-w-0 flex-col gap-4">
                    <LicniPodaci key={kljuc} pocetno={pocetno} onSacuvaj={sacuvajLicne} />
                    <Lozinka />
                    <Kartica naslov="Dvofaktorska zaštita" telo="px-4 py-1 sm:px-5">
                        <Prekidac ukljuceno={moje.dvaFaktora} oznaka="Kod iz aplikacije pri prijavi" opis={moje.dvaFaktora ? 'Uključeno — pri prijavi tražimo i šestocifreni kod.' : 'Pored lozinke traži i kod iz Google Authenticator-a.'}
                            onChange={prekidac('dvaFaktora', (v) => (v ? 'Dvofaktorska zaštita je uključena.' : 'Dvofaktorska zaštita je isključena.'))} />
                    </Kartica>
                </div>

                <div className="flex min-w-0 flex-col gap-4">
                    <Kartica naslov="Obaveštenja" telo="divide-y divide-p-ivica/60 px-4 py-1 sm:px-5">
                        {OBAVESTENJA.map(([k, naziv, opis]) => (
                            <Prekidac key={k} ukljuceno={moje[k]} oznaka={naziv} opis={opis} onChange={prekidac(k, (v) => `${naziv}: ${v ? 'uključeno' : 'isključeno'}.`)} />
                        ))}
                    </Kartica>

                    <Kartica naslov="Izgled" telo="px-4 py-1 sm:px-5">
                        <Prekidac ukljuceno={!!tamno} oznaka="Tamna tema" opis="Prijatnije za oči uveče; pamti se na ovom uređaju." onChange={(v) => setTamno(v)} />
                    </Kartica>

                    <Kartica naslov="Prijavljeni uređaji" opis="Odjavite uređaj koji ne prepoznajete." telo="p-2">
                        <ul>
                            <li className="flex items-center gap-3 rounded-xl px-3 py-2.5">
                                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-p-staza text-p-akc"><Monitor className="h-4 w-4" aria-hidden="true" /></span>
                                <span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium">Ovaj uređaj</span><span className="block text-[12.5px] text-p-tiho">aktivno sada</span></span>
                                <Znacka ton="ok" tacka>Trenutna</Znacka>
                            </li>
                            {sesije.map((s) => { const I = s.ikona; return (
                                <li key={s.id} className="flex items-center gap-3 rounded-xl px-3 py-2.5">
                                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-p-meko text-p-tiho"><I className="h-4 w-4" aria-hidden="true" /></span>
                                    <span className="min-w-0 flex-1"><span className="block truncate text-sm font-medium">{s.naziv}</span><span className="block text-[12.5px] text-p-tiho">{s.mesto} · {preKoliko(s.ts)}</span></span>
                                    <Dugme varijanta="opasnoTiho" velicina="sm" onClick={() => { setSesije((x) => x.filter((y) => y.id !== s.id)); obavesti(`Uređaj „${s.naziv}” je odjavljen.`); }}>Odjavi</Dugme>
                                </li>
                            ); })}
                        </ul>
                        {!sesije.length && <p className="px-3 pb-2 text-[12.5px] text-p-tiho">Prijavljeni ste samo na ovom uređaju.</p>}
                    </Kartica>

                    <Kartica className="border-p-greska/30" telo="p-4 sm:p-5">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="min-w-0">
                                <h2 className="text-[15px] font-semibold text-p-greska">Odjava</h2>
                                <p className="mt-0.5 text-[13px] text-p-tiho">Zatvara panel na ovom uređaju. Izmene u demo podacima ostaju.</p>
                            </div>
                            <Dugme varijanta="opasno" ikona={LogOut} onClick={() => { odjavi(); navigate(`${P}/prijava`); }}>Odjavi se</Dugme>
                        </div>
                    </Kartica>
                </div>
            </div>
        </div>
    );
}
