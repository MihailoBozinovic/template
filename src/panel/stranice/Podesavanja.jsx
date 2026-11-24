/*
 * PODEŠAVANJA — pravila online zakazivanja, podsetnici, obaveštenja osoblju,
 * depozit i integracije. Svaka promena se čuva odmah (bez dugmeta „Sačuvaj”).
 */
import React, { useState } from 'react';
import { AlertTriangle, BellRing, CalendarCheck, CalendarDays, CreditCard, Database, Link2, MessageSquareText, Plug, Receipt, Send, Smartphone } from 'lucide-react';
import { usePanel, useDozvole } from '../podaci/Skladiste.jsx';
import { Dugme, Izbor, Kartica, Modal, Prekidac, Tabovi, ZaglavljeStrane, Znacka, cx } from '../ui.jsx';

const satiTekst = (n) => (n >= 24 && n % 24 === 0 ? `${n / 24} ${n === 24 ? 'dan' : 'dana'}` : `${n} h`);

/** Red sa oznakom levo i kontrolom desno (za Izbor), u stilu Prekidača. */
const RedIzbora = ({ oznaka, opis, children, iskljucen }) => (
    <div className={cx('flex flex-col gap-2 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4', iskljucen && 'opacity-50')}>
        <div className="min-w-0">
            <div className="text-sm font-medium text-p-ink">{oznaka}</div>
            {opis && <div className="mt-0.5 text-[13px] text-p-tiho">{opis}</div>}
        </div>
        <div className="shrink-0 sm:w-56">{children}</div>
    </div>
);

const Sekcija = ({ ikona: I, naslov, opis, children }) => (
    <Kartica naslov={<span className="flex items-center gap-2"><I className="h-4 w-4 text-p-tiho" aria-hidden="true" />{naslov}</span>} opis={opis} telo="px-4 py-1 sm:px-5">
        <div className="divide-y divide-p-ivica/60">{children}</div>
    </Kartica>
);

const INTEGRACIJE = [
    { id: 'kalendar', naziv: 'Google Calendar', opis: 'Termini svakog radnika u njegovom kalendaru.', ikona: CalendarDays, pocetno: false },
    { id: 'telegram', naziv: 'Telegram bot', opis: 'Novi zahtevi i otkazivanja stižu osoblju odmah.', ikona: Send, pocetno: true },
    { id: 'sms', naziv: 'SMS gateway', opis: 'Podsetnici i kampanje preko domaćeg operatera.', ikona: Smartphone, pocetno: true },
    { id: 'fiskal', naziv: 'Fiskalna kasa', opis: 'Naplata iz panela ide pravo na fiskalni račun (ESIR).', ikona: Receipt, pocetno: false },
];

export default function Podesavanja() {
    const { podaci, postavi, obavesti, zapisi, vratiDemo } = usePanel();
    const { podesavanja: moze } = useDozvole();
    const s = podaci.podesavanja;
    const [integracije, setIntegracije] = useState(() => Object.fromEntries(INTEGRACIJE.map((x) => [x.id, x.pocetno])));
    const [vracanje, setVracanje] = useState(false);

    const promeni = (kljuc, vrednost, poruka) => {
        if (!moze) return;
        postavi('podesavanja', (p) => ({ ...p, [kljuc]: vrednost }));
        zapisi('podesavanja', 'Promenio podešavanje', poruka);
        obavesti(`Sačuvano: ${poruka}`, 'info');
    };
    const da = (v) => (v ? 'uključeno' : 'isključeno');
    const online = s.onlineZakazivanje;

    return (
        <div className="flex flex-col gap-4">
            <ZaglavljeStrane naslov="Podešavanja" opis="Pravila online zakazivanja, podsetnici i obaveštenja. Svaka promena se čuva odmah." />
            {!moze && <p className="rounded-xl border border-p-upoz/30 bg-p-upozbg px-3 py-2.5 text-[13px] text-p-upoz">Samo za čitanje — podešavanja menja administrator.</p>}

            <div className="grid gap-4 xl:grid-cols-2">
                <div className="flex flex-col gap-4">
                    <Sekcija ikona={CalendarCheck} naslov="Online zakazivanje" opis="Kako klijenti zakazuju preko sajta">
                        <Prekidac oznaka="Online zakazivanje" opis={online ? 'Klijenti biraju uslugu, radnika i vreme na sajtu.' : 'Isključeno — sajt nudi samo poziv telefonom.'} ukljuceno={online} disabled={!moze}
                            onChange={(v) => promeni('onlineZakazivanje', v, `online zakazivanje ${da(v)}`)} />
                        <RedIzbora oznaka="Potvrda termina" opis={s.nacin === 'zahtev' ? 'Osoblje odobrava svaki zahtev (stranica Zahtevi).' : 'Termin je potvrđen čim ga klijent zakaže.'} iskljucen={!online}>
                            <Tabovi className="w-full" stavke={[{ id: 'zahtev', naziv: 'Zahtev' }, { id: 'odmah', naziv: 'Odmah' }]} aktivan={s.nacin}
                                onChange={(v) => moze && online && promeni('nacin', v, v === 'zahtev' ? 'osoblje odobrava zahteve' : 'trenutna potvrda termina')} />
                        </RedIzbora>
                        <RedIzbora oznaka="Korak termina" opis="Na koliko minuta se nude početna vremena." iskljucen={!online}>
                            <Izbor value={s.korakMinuta} disabled={!moze || !online} onChange={(e) => promeni('korakMinuta', Number(e.target.value), `korak ${e.target.value} min`)}>
                                {[15, 30].map((x) => <option key={x} value={x}>na {x} min</option>)}
                            </Izbor>
                        </RedIzbora>
                        <RedIzbora oznaka="Najranije" opis="Koliko pre početka klijent još može da zakaže." iskljucen={!online}>
                            <Izbor value={s.najranijeSati} disabled={!moze || !online} onChange={(e) => promeni('najranijeSati', Number(e.target.value), `najranije ${satiTekst(Number(e.target.value))} unapred`)}>
                                {[0, 1, 2, 3, 4, 12, 24].map((x) => <option key={x} value={x}>{x ? `${satiTekst(x)} unapred` : 'bilo kad'}</option>)}
                            </Izbor>
                        </RedIzbora>
                        <RedIzbora oznaka="Najkasnije" opis="Koliko dana unapred je kalendar otvoren." iskljucen={!online}>
                            <Izbor value={s.danaUnapred} disabled={!moze || !online} onChange={(e) => promeni('danaUnapred', Number(e.target.value), `do ${e.target.value} dana unapred`)}>
                                {[7, 14, 30, 60, 90].map((x) => <option key={x} value={x}>do {x} dana unapred</option>)}
                            </Izbor>
                        </RedIzbora>
                        <RedIzbora oznaka="Otkazivanje" opis="Do kada klijent sam otkazuje preko linka iz poruke." iskljucen={!online}>
                            <Izbor value={s.otkazivanjeSati} disabled={!moze || !online} onChange={(e) => promeni('otkazivanjeSati', Number(e.target.value), `otkazivanje najkasnije ${satiTekst(Number(e.target.value))} pre`)}>
                                {[2, 4, 12, 24, 48].map((x) => <option key={x} value={x}>najkasnije {satiTekst(x)} pre</option>)}
                            </Izbor>
                        </RedIzbora>
                        <RedIzbora oznaka="Usluga po terminu" opis="Npr. šišanje + feniranje + maska u jednom dolasku." iskljucen={!online}>
                            <Izbor value={s.maksUsluga} disabled={!moze || !online} onChange={(e) => promeni('maksUsluga', Number(e.target.value), `najviše ${e.target.value} usluge po terminu`)}>
                                {[1, 2, 3, 4, 5].map((x) => <option key={x} value={x}>najviše {x}</option>)}
                            </Izbor>
                        </RedIzbora>
                        <Prekidac oznaka="Lista čekanja" opis="Kad nema slobodnog vremena, klijent ostavlja broj; javljate mu se kad se termin oslobodi." ukljuceno={s.listaCekanja} disabled={!moze || !online}
                            onChange={(v) => promeni('listaCekanja', v, `lista čekanja ${da(v)}`)} />
                    </Sekcija>

                    <Sekcija ikona={CreditCard} naslov="Depozit za zakazivanje" opis="Smanjuje nedolaske kod dugih usluga">
                        <Prekidac oznaka="Traži depozit" opis="Klijent plaća karticom deo cene pri zakazivanju (npr. 20% za boju i pramenove). Demo — bez pravog plaćanja." ukljuceno={s.depozit} disabled={!moze}
                            onChange={(v) => promeni('depozit', v, `depozit ${da(v)}`)} />
                        {s.depozit && <p className="py-3 text-[13px] text-p-tiho">U pravom panelu ovde se bira procenat i usluge, a uplata ide preko banke (npr. Raiffeisen e-commerce ili Stripe).</p>}
                    </Sekcija>
                </div>

                <div className="flex flex-col gap-4">
                    <Sekcija ikona={BellRing} naslov="Podsetnici klijentima" opis="Manje zaboravljenih termina">
                        <Prekidac oznaka="SMS podsetnik" opis="Kratka poruka sa vremenom i linkom za otkazivanje." ukljuceno={s.podsetnikSms} disabled={!moze}
                            onChange={(v) => promeni('podsetnikSms', v, `SMS podsetnik ${da(v)}`)} />
                        <RedIzbora oznaka="Kada se šalje" opis="Koliko pre termina." iskljucen={!s.podsetnikSms && !s.podsetnikEmail}>
                            <Izbor value={s.podsetnikSati} disabled={!moze || (!s.podsetnikSms && !s.podsetnikEmail)} onChange={(e) => promeni('podsetnikSati', Number(e.target.value), `podsetnik ${satiTekst(Number(e.target.value))} pre termina`)}>
                                {[2, 24, 48].map((x) => <option key={x} value={x}>{satiTekst(x)} pre</option>)}
                            </Izbor>
                        </RedIzbora>
                        <Prekidac oznaka="Podsetnik e-poštom" opis="Isti podsetnik i na e-poštu, ako je klijent ostavio adresu." ukljuceno={s.podsetnikEmail} disabled={!moze}
                            onChange={(v) => promeni('podsetnikEmail', v, `podsetnik e-poštom ${da(v)}`)} />
                        <Prekidac oznaka="Potvrda e-poštom" opis="Odmah po zakazivanju: usluga, radnik, vreme i adresa." ukljuceno={s.potvrdaEmail} disabled={!moze}
                            onChange={(v) => promeni('potvrdaEmail', v, `potvrda e-poštom ${da(v)}`)} />
                        <Prekidac oznaka="Zahtev za ocenu" opis="Dva sata posle termina: ocena od 1 do 5 i komentar (stranica Ocene)." ukljuceno={s.ocenaPosle} disabled={!moze}
                            onChange={(v) => promeni('ocenaPosle', v, `zahtev za ocenu ${da(v)}`)} />
                    </Sekcija>

                    <Sekcija ikona={MessageSquareText} naslov="Obaveštenja osoblju" opis="Novi zahtevi, otkazivanja i lista čekanja">
                        <Prekidac oznaka="Telegram" opis="Poruka u grupu salona čim stigne zahtev ili otkazivanje." ukljuceno={s.obavestiTelegram} disabled={!moze}
                            onChange={(v) => promeni('obavestiTelegram', v, `Telegram obaveštenja ${da(v)}`)} />
                        <Prekidac oznaka="E-pošta" opis="Pregled dana svako jutro i svaki novi zahtev." ukljuceno={s.obavestiEmail} disabled={!moze}
                            onChange={(v) => promeni('obavestiEmail', v, `obaveštenja e-poštom ${da(v)}`)} />
                    </Sekcija>

                    <Kartica naslov={<span className="flex items-center gap-2"><Plug className="h-4 w-4 text-p-tiho" aria-hidden="true" />Integracije</span>} opis="Veze sa spoljnim servisima" telo="p-2">
                        <ul>
                            {INTEGRACIJE.map((x) => {
                                const I = x.ikona;
                                const povezano = integracije[x.id];
                                return (
                                    <li key={x.id} className="flex items-center gap-3 rounded-xl px-3 py-3">
                                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-p-meko text-p-tiho"><I className="h-[18px] w-[18px]" aria-hidden="true" /></span>
                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-2"><span className="text-sm font-medium">{x.naziv}</span><Znacka ton={povezano ? 'ok' : 'tiho'} tacka>{povezano ? 'Povezano' : 'Nije povezano'}</Znacka></div>
                                            <div className="mt-0.5 text-[12.5px] text-p-tiho">{x.opis}</div>
                                        </div>
                                        <Dugme velicina="sm" varijanta={povezano ? 'tiho' : 'obicno'} ikona={povezano ? undefined : Link2} disabled={!moze}
                                            onClick={() => {
                                                setIntegracije((m) => ({ ...m, [x.id]: !povezano }));
                                                zapisi('podesavanja', povezano ? 'Prekinuo integraciju' : 'Povezao integraciju', x.naziv);
                                                obavesti(povezano ? `${x.naziv} je isključen (demo).` : `${x.naziv} je povezan (demo).`, povezano ? 'info' : 'ok');
                                            }}>
                                            {povezano ? 'Prekini' : 'Poveži'}
                                        </Dugme>
                                    </li>
                                );
                            })}
                        </ul>
                    </Kartica>
                </div>
            </div>

            <section className="rounded-2xl border border-p-greska/30 bg-p-greskabg/40 p-4 sm:p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex gap-3">
                        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-p-greskabg text-p-greska"><Database className="h-[18px] w-[18px]" aria-hidden="true" /></span>
                        <div>
                            <h2 className="text-[15px] font-semibold">Demo podaci</h2>
                            <p className="mt-0.5 text-[13px] text-p-tiho">Briše sve izmene iz ovog browsera (termini, klijenti, cene, vaučeri, podešavanja) i vraća početne demo podatke oko današnjeg dana.</p>
                        </div>
                    </div>
                    <Dugme varijanta="opasno" disabled={!moze} onClick={() => setVracanje(true)}>Vrati demo podatke</Dugme>
                </div>
            </section>

            <Modal otvoren={vracanje} onClose={() => setVracanje(false)} naslov="Vratiti demo podatke?"
                podnozje={<><Dugme onClick={() => setVracanje(false)}>Odustani</Dugme><Dugme varijanta="opasno" data-fokus onClick={() => { vratiDemo(); setVracanje(false); }}>Vrati početne</Dugme></>}>
                <p className="flex gap-2.5 text-sm text-p-tiho"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-p-greska" aria-hidden="true" />Sve što je promenjeno u panelu u ovom browseru biće zamenjeno početnim podacima. Ovo ne može da se vrati.</p>
            </Modal>
        </div>
    );
}
