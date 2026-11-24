/*
 * OSOBLJE — nalozi za panel: ko ima pristup, sa kojom ulogom i kada se
 * poslednji put prijavio. Menja samo administrator; recepcija vidi spisak.
 * „Pogledaj kao” je pomoć za demo: panel se otvara očima te uloge.
 */
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, Eye, Lock, Mail, Send, ShieldCheck, UserCog, UserPlus, Users } from 'lucide-react';
import { usePanel, useIndeksi, useDozvole, ULOGE } from '../podaci/Skladiste.jsx';
import { preKoliko } from '../format.js';
import { Avatar, Dugme, Izbor, Kartica, Modal, MrezaPlocica, Polje, Prekidac, StatPlocica, Tabela, Unos, ZaglavljeStrane, Znacka } from '../ui.jsx';
import { P } from '../Ljuska.jsx';

const TON_ULOGE = { administrator: 'akc', menadzer: 'info', recepcija: 'ok', zaposleni: 'tiho' };
const ZnackaUloge = ({ uloga }) => <Znacka ton={TON_ULOGE[uloga]}>{ULOGE[uloga]?.naziv ?? uloga}</Znacka>;

function Nalog({ nalog, onClose }) {
    const { podaci, sesija, dodaj, izmeni, obavesti, zapisi, noviId } = usePanel();
    const novi = !nalog;
    const [f, setF] = useState(() => nalog ?? { ime: '', email: '', uloga: 'recepcija', radnikId: '', aktivan: true });
    const [greska, setGreska] = useState('');
    const p = (k) => (e) => { setF({ ...f, [k]: e.target.value }); setGreska(''); };
    const ja = !novi && nalog.email === sesija?.email;
    const zauzeti = new Set(podaci.osoblje.filter((o) => o.radnikId && o.id !== nalog?.id).map((o) => o.radnikId));
    const admina = podaci.osoblje.filter((o) => o.uloga === 'administrator' && o.aktivan).length;
    const poslednjiAdmin = !novi && nalog.uloga === 'administrator' && admina <= 1;

    const sacuvaj = () => {
        const email = f.email.trim().toLowerCase();
        if (!f.ime.trim()) { setGreska('Upišite ime i prezime.'); return; }
        if (!/^\S+@\S+\.\S+$/.test(email)) { setGreska('E-pošta nije ispravna.'); return; }
        if (podaci.osoblje.some((o) => o.email.toLowerCase() === email && o.id !== nalog?.id)) { setGreska('Nalog sa ovom e-poštom već postoji.'); return; }
        if (f.uloga === 'zaposleni' && !f.radnikId) { setGreska('Povežite nalog sa radnikom iz tima.'); return; }
        if (poslednjiAdmin && (f.uloga !== 'administrator' || !f.aktivan)) { setGreska('Salon mora imati bar jednog aktivnog administratora.'); return; }
        const podatak = { ime: f.ime.trim(), email, uloga: f.uloga, radnikId: f.uloga === 'zaposleni' ? f.radnikId : (f.radnikId || null), aktivan: f.aktivan };
        if (novi) {
            dodaj('osoblje', { id: noviId('n'), ...podatak, poslednjaPrijava: null });
            zapisi('osoblje', 'Dodao nalog', `${podatak.ime} — ${ULOGE[podatak.uloga].naziv}`);
            obavesti(`Pozivnica je poslata na ${email}.`);
        } else {
            izmeni('osoblje', nalog.id, podatak);
            const opis = nalog.uloga !== podatak.uloga ? `${podatak.ime}: ${ULOGE[nalog.uloga].naziv} → ${ULOGE[podatak.uloga].naziv}` : nalog.aktivan !== podatak.aktivan ? `${podatak.ime}: ${podatak.aktivan ? 'nalog uključen' : 'nalog ugašen'}` : podatak.ime;
            zapisi('osoblje', 'Izmenio nalog', opis);
            obavesti('Nalog je sačuvan.');
        }
        onClose();
    };

    return (
        <Modal otvoren onClose={onClose} naslov={novi ? 'Novi nalog' : 'Izmena naloga'} opis={novi ? 'Osoba dobija pozivnicu e-poštom i sama postavlja lozinku.' : nalog.email}
            podnozje={(
                <>
                    {greska && <p role="alert" className="mr-auto self-center text-[13px] font-medium text-p-greska">{greska}</p>}
                    {!novi && !nalog.poslednjaPrijava && <Dugme varijanta="tiho" ikona={Send} onClick={() => obavesti(`Pozivnica je ponovo poslata na ${nalog.email}.`)}>Pošalji ponovo</Dugme>}
                    <Dugme varijanta="tiho" onClick={onClose}>Odustani</Dugme>
                    <Dugme varijanta="glavno" ikona={novi ? Send : Check} onClick={sacuvaj}>{novi ? 'Pošalji pozivnicu' : 'Sačuvaj'}</Dugme>
                </>
            )}>
            <div className="grid gap-3 sm:grid-cols-2">
                <Polje oznaka="Ime i prezime"><Unos value={f.ime} onChange={p('ime')} autoComplete="off" /></Polje>
                <Polje oznaka="E-pošta"><Unos type="email" inputMode="email" value={f.email} onChange={p('email')} autoComplete="off" /></Polje>
                <Polje oznaka="Uloga" className="sm:col-span-2" pomoc={ja ? 'Svoju ulogu ne možete menjati.' : ULOGE[f.uloga]?.opis}>
                    <Izbor value={f.uloga} onChange={p('uloga')} disabled={ja}>
                        {Object.entries(ULOGE).map(([k, u]) => <option key={k} value={k}>{u.naziv}</option>)}
                    </Izbor>
                </Polje>
                {(f.uloga === 'zaposleni' || f.uloga === 'menadzer') && (
                    <Polje oznaka={f.uloga === 'zaposleni' ? 'Povezan radnik' : 'Povezan radnik (opciono)'} className="sm:col-span-2" pomoc="Zaposleni vidi samo termine, raspored i promet ovog radnika.">
                        <Izbor value={f.radnikId ?? ''} onChange={p('radnikId')}>
                            <option value="">{f.uloga === 'zaposleni' ? 'Izaberite…' : 'Bez radnika'}</option>
                            {podaci.radnici.map((r) => <option key={r.id} value={r.id} disabled={zauzeti.has(r.id)}>{r.ime}{zauzeti.has(r.id) ? ' — već ima nalog' : ''}</option>)}
                        </Izbor>
                    </Polje>
                )}
                {!novi && (
                    <div className="border-t border-p-ivica/70 sm:col-span-2">
                        <Prekidac ukljuceno={f.aktivan} onChange={(v) => setF({ ...f, aktivan: v })} disabled={ja} oznaka="Nalog je aktivan"
                            opis={ja ? 'Svoj nalog ne možete ugasiti.' : f.aktivan ? 'Osoba može da se prijavi.' : 'Prijava je zaključana; istorija ostaje.'} />
                    </div>
                )}
            </div>
        </Modal>
    );
}

export default function Osoblje() {
    const { podaci, sesija, prijavi, obavesti } = usePanel();
    const indeks = useIndeksi();
    const { uloga } = useDozvole();
    const navigate = useNavigate();
    const admin = uloga === 'administrator';
    const [modal, setModal] = useState(null); // { nalog? }

    const redovi = useMemo(() => [...podaci.osoblje].sort((a, b) => Object.keys(ULOGE).indexOf(a.uloga) - Object.keys(ULOGE).indexOf(b.uloga) || a.ime.localeCompare(b.ime, 'sr')), [podaci.osoblje]);
    const brojke = useMemo(() => ({
        ukupno: podaci.osoblje.length,
        aktivni: podaci.osoblje.filter((o) => o.aktivan).length,
        danas: podaci.osoblje.filter((o) => o.poslednjaPrijava && Date.now() - o.poslednjaPrijava < 864e5).length,
        pozvani: podaci.osoblje.filter((o) => !o.poslednjaPrijava).length,
        poUlozi: Object.fromEntries(Object.keys(ULOGE).map((u) => [u, podaci.osoblje.filter((o) => o.uloga === u).length])),
    }), [podaci.osoblje]);

    const pogledajKao = (o) => {
        prijavi(o.uloga, o.radnikId);
        obavesti(`Gledate panel kao: ${ULOGE[o.uloga].naziv}${o.uloga === 'zaposleni' ? ` (${o.ime})` : ''}.`, 'info');
        navigate(P);
    };

    const kolone = [
        { kljuc: 'ime', naslov: 'Ime', sortVrednost: (o) => o.ime, render: (o) => (
            <span className="flex items-center gap-3">
                <Avatar ime={o.ime} slika={indeks.radnik[o.radnikId]?.slika} boja={indeks.radnik[o.radnikId]?.boja} velicina={32} className={o.aktivan ? '' : 'opacity-50'} />
                <span className="min-w-0">
                    <span className="flex items-center gap-1.5 font-medium">{o.ime}{o.email === sesija?.email && <Znacka ton="akc">vi</Znacka>}</span>
                    <span className="block text-[12.5px] text-p-tiho lg:hidden">{o.email}</span>
                </span>
            </span>
        ) },
        { kljuc: 'email', naslov: 'E-pošta', mobilno: 'skriveno', className: 'hidden lg:table-cell', render: (o) => <span className="text-p-tiho">{o.email}</span> },
        { kljuc: 'uloga', naslov: 'Uloga', sortVrednost: (o) => Object.keys(ULOGE).indexOf(o.uloga), render: (o) => <ZnackaUloge uloga={o.uloga} /> },
        { kljuc: 'radnik', naslov: 'Povezan radnik', sortVrednost: (o) => indeks.radnik[o.radnikId]?.ime ?? '', render: (o) => { const r = indeks.radnik[o.radnikId]; return r ? <span className="flex items-center gap-2 whitespace-nowrap"><Avatar ime={r.ime} slika={r.slika} boja={r.boja} velicina={22} />{r.ime}</span> : <span className="text-p-tiho">—</span>; } },
        { kljuc: 'poslednjaPrijava', naslov: 'Poslednja prijava', className: 'whitespace-nowrap', sortVrednost: (o) => o.poslednjaPrijava ?? 0, render: (o) => (o.poslednjaPrijava ? <span title={new Date(o.poslednjaPrijava).toLocaleString('sr-Latn-RS')}>{preKoliko(o.poslednjaPrijava)}</span> : <Znacka ton="upoz"><Mail className="h-3 w-3" aria-hidden="true" />Pozivnica poslata</Znacka>) },
        { kljuc: 'aktivan', naslov: 'Status', sortVrednost: (o) => (o.aktivan ? 1 : 0), render: (o) => (o.aktivan ? <Znacka ton="ok" tacka>Aktivan</Znacka> : <Znacka ton="tiho" tacka>Ugašen</Znacka>) },
        ...(admin ? [{ kljuc: 'akcije', naslov: '', sort: false, desno: true, render: (o) => (
            <span className="inline-flex items-center gap-1">
                <Dugme varijanta="tiho" velicina="sm" ikona={Eye} disabled={!o.aktivan || o.email === sesija?.email} title="Otvori panel kao ova uloga (demo)"
                    onClick={(e) => { e.stopPropagation(); pogledajKao(o); }}>Pogledaj kao</Dugme>
            </span>
        ) }] : []),
    ];

    return (
        <div className="flex flex-col gap-4">
            <ZaglavljeStrane naslov="Osoblje" opis={admin ? 'Nalozi za panel, uloge i pristup. Klik na red menja nalog.' : 'Pregled naloga osoblja — izmene radi administrator.'}
                akcije={admin ? <Dugme varijanta="glavno" ikona={UserPlus} onClick={() => setModal({})} kratko="Novi">Novi nalog</Dugme> : <Znacka ton="tiho"><Lock className="h-3 w-3" aria-hidden="true" />Samo pregled</Znacka>} />

            <MrezaPlocica>
                <StatPlocica ikona={Users} oznaka="Nalozi" vrednost={brojke.ukupno} napomena={`${brojke.aktivni} aktivnih`} />
                <StatPlocica ikona={ShieldCheck} ton="ok" oznaka="Prijavljeni danas" vrednost={brojke.danas} napomena="u poslednja 24 h" />
                <StatPlocica ikona={UserCog} ton="info" oznaka="Zaposleni" vrednost={brojke.poUlozi.zaposleni} napomena={`${brojke.poUlozi.menadzer} menadžer · ${brojke.poUlozi.recepcija} recepcija`} />
                <StatPlocica ikona={Mail} ton={brojke.pozvani ? 'upoz' : 'tiho'} oznaka="Čekaju prvu prijavu" vrednost={brojke.pozvani} napomena="pozivnica poslata" />
            </MrezaPlocica>

            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_340px]">
                <Kartica naslov="Nalozi" opis={`${brojke.ukupno} naloga · ${brojke.ukupno - brojke.aktivni} ugašeno`} telo="p-0">
                    <Tabela kolone={kolone} redovi={redovi} onRed={admin ? (o) => setModal({ nalog: o }) : undefined} />
                </Kartica>

                <Kartica naslov="Šta koja uloga vidi" opis="Pristup se menja odmah, bez nove prijave.">
                    <ul className="space-y-3.5">
                        {Object.entries(ULOGE).map(([k, u]) => (
                            <li key={k} className="flex items-start gap-3">
                                <span className="mt-0.5 w-[104px] shrink-0"><ZnackaUloge uloga={k} /></span>
                                <span className="min-w-0 text-[13.5px]">
                                    <span className="block">{u.opis}</span>
                                    <span className="text-[12.5px] text-p-tiho tabularno">{brojke.poUlozi[k]} {brojke.poUlozi[k] === 1 ? 'nalog' : 'naloga'}</span>
                                </span>
                            </li>
                        ))}
                    </ul>
                    {admin && <p className="mt-4 rounded-xl bg-p-meko/70 px-3 py-2.5 text-[12.5px] text-p-tiho">„Pogledaj kao” otvara panel očima te uloge — da proverite šta osoba vidi. Nazad se vraćate kroz prijavu.</p>}
                </Kartica>
            </div>

            {modal && <Nalog nalog={modal.nalog} onClose={() => setModal(null)} />}
        </div>
    );
}
