/*
 * DEMO PRIJAVA — bez lozinke: bira se uloga i ulazi se u panel sa izmišljenim
 * podacima. U pravom panelu ovde je prijava e-poštom i lozinkom (+ 2FA).
 */
import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { ArrowRight, Moon, ShieldCheck, Sun } from 'lucide-react';
import { salon } from '../config/salon.js';
import { BAZA } from '../lib/baza.js';
import { javno } from '../lib/baza.js';
import { ULOGE, usePanel } from './podaci/Skladiste.jsx';
import { Avatar, Dugme, cx } from './ui.jsx';
import { P } from './Ljuska.jsx';

export default function Prijava() {
    const { sesija, prijavi, podaci, tamno, setTamno } = usePanel();
    const navigate = useNavigate();
    const [radnik, setRadnik] = useState(podaci.radnici[1]?.id ?? podaci.radnici[0]?.id);
    if (sesija) return <Navigate to={P} replace />;
    const udji = (uloga) => { prijavi(uloga, uloga === 'zaposleni' ? radnik : null); navigate(P); };
    const slika = salon.pocetna?.hero?.slike?.[0];

    return (
        <div className="panel-koren grid min-h-screen bg-p-bg text-p-ink lg:grid-cols-[1.05fr_1fr]">
            <div className="relative hidden overflow-hidden bg-[#16151a] lg:block">
                {slika && <img src={javno(slika)} alt="" className="absolute inset-0 h-full w-full object-cover opacity-55" />}
                <div className="absolute inset-0 bg-gradient-to-t from-[#16151a] via-[#16151a]/40 to-transparent" />
                <div className="relative flex h-full flex-col justify-between p-12 text-white">
                    <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-p-zlato font-semibold text-[#16151a]">{(salon.kratkiNaziv || salon.naziv)[0]}</span><span className="text-lg font-semibold">{salon.naziv}</span></div>
                    <div>
                        <p className="max-w-md text-[28px] font-semibold leading-tight">Ceo salon na jednom mestu — kalendar, klijenti, tim i promet.</p>
                        <ul className="mt-6 space-y-2 text-[15px] text-white/80">
                            <li>· Online zakazivanje sa sajta stiže pravo u kalendar</li>
                            <li>· Raspored smena, odsustva i zarade tima</li>
                            <li>· Dnevni promet, analitika i ocene klijenata</li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="flex flex-col px-5 py-8 sm:px-10">
                <div className="flex items-center justify-between">
                    <a href={`${BAZA}/`} className="text-[13px] font-medium text-p-tiho hover:text-p-ink">← Nazad na sajt</a>
                    <Dugme varijanta="tiho" velicina="ikona" onClick={() => setTamno(!tamno)} aria-label={tamno ? 'Svetla tema' : 'Tamna tema'}>{tamno ? <Sun className="h-[18px] w-[18px]" aria-hidden="true" /> : <Moon className="h-[18px] w-[18px]" aria-hidden="true" />}</Dugme>
                </div>
                <div className="mx-auto my-auto w-full max-w-md py-10">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-p-staza px-2.5 py-1 text-[12px] font-semibold text-p-akc"><ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />DEMO PANEL</span>
                    <h1 className="mt-4 text-[28px] font-semibold leading-tight">Prijava u panel</h1>
                    <p className="mt-2 text-[15px] text-p-tiho">Ovo je demo bez lozinke: izaberite ulogu i pogledajte panel onako kako ga vidi vlasnik, menadžer, recepcija ili stilista. Podaci su izmišljeni.</p>

                    <ul className="mt-7 space-y-2.5">
                        {Object.entries(ULOGE).map(([id, u]) => (
                            <li key={id}>
                                <div className={cx('rounded-2xl border border-p-ivica bg-p-karta transition-colors hover:border-p-akc/60', id === 'administrator' && 'ring-1 ring-p-akc/30')}>
                                    <button type="button" onClick={() => udji(id)} className="flex w-full items-center gap-4 px-4 py-3.5 text-left">
                                        <span className="min-w-0 flex-1">
                                            <span className="flex items-center gap-2 text-[15px] font-semibold">{u.naziv}{id === 'administrator' && <span className="rounded-full bg-p-staza px-2 text-[11px] font-semibold leading-5 text-p-akc">preporuka</span>}</span>
                                            <span className="mt-0.5 block text-[13px] text-p-tiho">{u.opis}</span>
                                        </span>
                                        <ArrowRight className="h-5 w-5 shrink-0 text-p-tiho" aria-hidden="true" />
                                    </button>
                                    {id === 'zaposleni' && (
                                        <div className="flex flex-wrap gap-1.5 border-t border-p-ivica/70 px-4 py-3" role="radiogroup" aria-label="Stilista">
                                            {podaci.radnici.map((r) => (
                                                <button key={r.id} type="button" role="radio" aria-checked={radnik === r.id} onClick={() => setRadnik(r.id)}
                                                    className={cx('inline-flex items-center gap-2 rounded-full border py-1 pl-1 pr-3 text-[13px]', radnik === r.id ? 'border-p-akc bg-p-staza font-medium' : 'border-p-ivica')}>
                                                    <Avatar ime={r.ime} slika={r.slika} boja={r.boja} velicina={24} />{r.ime.split(' ')[0]}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                    <p className="mt-6 text-[12.5px] text-p-tiho">Izmene u demo panelu (novi termini, cene, smene…) čuvaju se samo u ovom browseru i mogu se vratiti na početne.</p>
                </div>
            </div>
        </div>
    );
}
