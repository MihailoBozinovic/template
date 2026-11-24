/*
 * IZGLED SAJTA — izbor teme sajta jednim klikom.
 *
 * Koristi isti mehanizam kao birač tema na sajtu (src/lib/tema.js): izbor se
 * pamti u ovom browseru (localStorage 'tema.pregled.v1'), pa javni sajt u
 * ovom browseru odmah izgleda u izabranoj temi. Trajno se tema menja u
 * src/config/salon.js (polje `tema`).
 */
import React, { useState } from 'react';
import { Check, ExternalLink, Info, Moon, Palette, RotateCcw, Sun } from 'lucide-react';
import { usePanel, useDozvole } from '../podaci/Skladiste.jsx';
import { TEME } from '../../config/teme.js';
import { idTemeSajta, zapamtiPregled } from '../../lib/tema.js';
import { BAZA } from '../../lib/baza.js';
import { Dugme, Kartica, ZaglavljeStrane, Znacka, cx } from '../ui.jsx';

const KLJUC_PREGLEDA = 'tema.pregled.v1';
const citajPregled = () => { try { return localStorage.getItem(KLJUC_PREGLEDA); } catch { return null; } };
const imeFonta = (stek = '') => stek.split(',')[0].replace(/["']/g, '').trim();
const BOJE_PRIKAZ = [['paper', 'Podloga'], ['ink', 'Tekst'], ['brand', 'Brend'], ['akcenat', 'Akcenat'], ['mist', 'Magla'], ['tamna', 'Tamna']];

function MiniSajt({ tema, naziv }) {
    const b = tema.boje;
    const oblik = tema.dugme?.oblik === 'pill' ? '999px' : tema.dugme?.oblik === 'blago' ? '4px' : '0px';
    return (
        <div className="relative h-36 overflow-hidden rounded-t-2xl border-b border-p-ivica" style={{ background: b.paper, color: b.ink }} aria-hidden="true">
            <div className="flex items-center justify-between px-4 pt-3 text-[9px] uppercase tracking-[.2em]" style={{ fontFamily: tema.fontovi.logo }}>
                <span className="truncate font-semibold">{naziv}</span>
                <span className="flex gap-2 opacity-70"><span>Usluge</span><span>Tim</span></span>
            </div>
            <div className="px-4 pt-4">
                <div className="text-[26px] leading-[1.02]" style={{ fontFamily: tema.fontovi.naslov, fontWeight: tema.naslov?.tezina ?? 400, textTransform: tema.naslov?.transform ?? 'none' }}>
                    Kosa <em style={{ fontStyle: 'italic', color: b.brand === b.ink ? undefined : b.brand }}>sa stavom</em>
                </div>
                <div className="mt-3 flex items-center gap-2">
                    <span className="px-3 py-1.5 text-[9px] font-medium uppercase tracking-[.14em]" style={{ background: b.brand, color: b.naBrand, borderRadius: oblik, fontFamily: tema.fontovi.tekst }}>Zakaži</span>
                    <span className="h-px w-10" style={{ background: b.linija }} />
                </div>
            </div>
            <div className="absolute bottom-0 right-0 h-16 w-24" style={{ background: `linear-gradient(135deg, ${b.mist}, ${b.akcenat})`, borderTopLeftRadius: tema.radius?.slika ?? 0 }} />
        </div>
    );
}

export default function IzgledSajta() {
    const { podaci, obavesti, zapisi } = usePanel();
    const { podesavanja: moze } = useDozvole();
    const temaSajta = idTemeSajta();
    const [pregled, setPregled] = useState(() => citajPregled());
    const aktivna = pregled && TEME[pregled] ? pregled : temaSajta;
    const naziv = podaci.podaciSalona?.kratkiNaziv || podaci.podaciSalona?.naziv || 'Salon';
    const ids = Object.keys(TEME);

    const postavi = (id) => {
        zapamtiPregled(id);
        setPregled(citajPregled());
        zapisi('sajt', 'Promenio temu sajta', TEME[id].naziv);
        obavesti(`Tema „${TEME[id].naziv}” je postavljena — u produkciji se menja u salon.js`);
    };

    return (
        <div className="flex flex-col gap-4">
            <ZaglavljeStrane naslov="Izgled sajta" opis={`Tema sajta jednim klikom: ${ids.length} tema po uzoru na premium salone — svaka sa svojim fontovima, bojama, rasporedom i pokretom.`}
                akcije={(
                    <>
                        {aktivna !== temaSajta && moze && <Dugme ikona={RotateCcw} onClick={() => postavi(temaSajta)}>Vrati temu iz salon.js</Dugme>}
                        <Dugme varijanta="glavno" ikona={ExternalLink} href={`${BAZA}/`} target="_blank" rel="noopener">Pogledaj sajt</Dugme>
                    </>
                )} />

            <div className="flex flex-col gap-2 rounded-2xl border border-p-info/25 bg-p-infobg px-4 py-3 text-[13.5px] text-p-info sm:flex-row sm:items-center sm:justify-between">
                <span className="flex items-start gap-2"><Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                    <span>Trenutno: <b className="font-semibold">{TEME[aktivna]?.naziv}</b>{aktivna !== temaSajta ? ` (pregled u ovom browseru; u salon.js je „${TEME[temaSajta]?.naziv}”)` : ' — tema iz salon.js'}. „Postavi” menja sajt odmah u ovom browseru; za sve posetioce tema se upisuje u <code className="font-mono text-[12.5px]">src/config/salon.js</code>.</span>
                </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {ids.map((id) => {
                    const t = TEME[id];
                    const je = id === aktivna;
                    return (
                        <article key={id} className={cx('flex min-w-0 flex-col rounded-2xl border bg-p-karta shadow-[0_1px_2px_rgb(0_0_0/.03)] transition-colors', je ? 'border-p-akc ring-2 ring-p-akc/25' : 'border-p-ivica')}>
                            <MiniSajt tema={t} naziv={naziv} />
                            <div className="flex flex-1 flex-col p-4">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0">
                                        <h2 className="text-[15px] font-semibold">{t.naziv}</h2>
                                        <div className="text-[12.5px] text-p-tiho">po uzoru na {t.inspiracija}</div>
                                    </div>
                                    <div className="flex shrink-0 flex-wrap justify-end gap-1">
                                        {je && <Znacka ton="akc"><Check className="h-3 w-3" aria-hidden="true" />Trenutna</Znacka>}
                                        {id === temaSajta && !je && <Znacka>u salon.js</Znacka>}
                                        <span title={t.tamna ? 'Tamna tema' : 'Svetla tema'} className="grid h-6 w-6 place-items-center rounded-full bg-p-meko text-p-tiho">{t.tamna ? <Moon className="h-3.5 w-3.5" aria-label="Tamna tema" /> : <Sun className="h-3.5 w-3.5" aria-label="Svetla tema" />}</span>
                                    </div>
                                </div>
                                <p className="mt-2 line-clamp-3 text-[13px] text-p-tiho">{t.opis}</p>
                                <div className="mt-3 flex items-center gap-1.5" aria-label="Boje teme">
                                    {BOJE_PRIKAZ.filter(([k]) => t.boje[k]).map(([k, oz]) => (
                                        <span key={k} title={`${oz} ${t.boje[k]}`} className="h-6 w-6 rounded-full border border-p-ivica shadow-inner" style={{ background: t.boje[k] }} />
                                    ))}
                                </div>
                                <dl className="mt-3 grid grid-cols-2 gap-2 text-[12.5px]">
                                    <div className="min-w-0 rounded-lg bg-p-meko/70 px-2.5 py-1.5"><dt className="text-p-tiho">Naslovi</dt><dd className="truncate font-medium">{imeFonta(t.fontovi.naslov)}</dd></div>
                                    <div className="min-w-0 rounded-lg bg-p-meko/70 px-2.5 py-1.5"><dt className="text-p-tiho">Tekst</dt><dd className="truncate font-medium">{imeFonta(t.fontovi.tekst)}</dd></div>
                                </dl>
                                <div className="mt-4 flex gap-2 pt-1">
                                    <Dugme velicina="sm" ikona={ExternalLink} href={`${BAZA}/?tema=${id}`} target="_blank" rel="noopener" className="flex-1 justify-center">Pogledaj</Dugme>
                                    <Dugme velicina="sm" varijanta={je ? 'obicno' : 'glavno'} ikona={je ? Check : Palette} disabled={je || !moze} onClick={() => postavi(id)} className="flex-1 justify-center">{je ? 'Postavljena' : 'Postavi'}</Dugme>
                                </div>
                            </div>
                        </article>
                    );
                })}
            </div>

            <Kartica telo="p-4 sm:p-5">
                <div className="grid gap-4 text-[13px] text-p-tiho sm:grid-cols-3">
                    <div><div className="mb-1 font-semibold text-p-ink">Sadržaj ostaje isti</div>Usluge, cene, tim, galerija i tekstovi se ne menjaju — tema menja samo izgled i pokret.</div>
                    <div><div className="mb-1 font-semibold text-p-ink">Pregled pre odluke</div>„Pogledaj” otvara sajt u novom tabu u toj temi, bez menjanja trenutne.</div>
                    <div><div className="mb-1 font-semibold text-p-ink">Za sve posetioce</div>U produkciji se tema upisuje u <code className="font-mono">salon.js</code> (<code className="font-mono">tema: &apos;{aktivna}&apos;</code>) i sajt se ponovo objavljuje.</div>
                </div>
                {!moze && <p className="mt-4 text-[12.5px] text-p-upoz">Temu može da promeni samo administrator.</p>}
            </Kartica>
        </div>
    );
}
