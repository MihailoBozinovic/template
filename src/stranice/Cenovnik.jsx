import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { useSajt } from '../kontekst/Sajt.jsx';
import { cena, trajanje } from '../lib/format.js';
import { Kontejner, Pojava, Sekcija, cx } from '../components/primitivi.jsx';
import ZaglavljeStranice from '../components/ZaglavljeStranice.jsx';
import { useZakaziLink } from '../components/Header.jsx';

const FILTERI = ['svi', 'zene', 'muskarci', 'deca'];

/** Ključ filtera → da li usluga/kategorija pripada (prazno `za` = svima). */
const pripada = (za, filter) => filter === 'svi' || !za?.length || za.includes(filter);

export default function Cenovnik() {
    const { salon, t, tx, jezik, p } = useSajt();
    const [filter, setFilter] = useState('svi');
    const zakazi = useZakaziLink();
    const linkUsluge = (u) => (zakazi.to ? `${p('zakazivanje')}?usluga=${u.id}` : null);

    // Filter se nudi samo kad salon ima usluge za različite grupe.
    const grupe = new Set(salon.kategorije.flatMap((k) => k.za ?? []));
    const nudiFilter = grupe.size > 1;
    const kategorije = salon.kategorije
        .map((k) => ({ ...k, usluge: k.usluge.filter((u) => pripada(u.za ?? k.za, filter)) }))
        .filter((k) => k.usluge.length);

    return (
        <>
            <ZaglavljeStranice nadnaslov={t.cenovnik.nadnaslov} naslov={t.cenovnik.naslov} uvod={t.cenovnik.uvod} />
            <Kontejner className="sticky top-[76px] z-20 -mt-2 bg-paper/90 py-3 backdrop-blur-md">
                <div className="skriven-skrol flex items-center gap-2 overflow-x-auto">
                    {nudiFilter && (
                        <>
                            <span className="nadnaslov mr-2 shrink-0 opacity-70">{t.cenovnik.zaKoga}</span>
                            {FILTERI.filter((f) => f === 'svi' || grupe.has(f)).map((f) => (
                                <button key={f} type="button" className="cip" aria-pressed={filter === f} onClick={() => setFilter(f)}>{t.cenovnik[f]}</button>
                            ))}
                            <span className="mx-2 h-5 w-px shrink-0 bg-ink/20" aria-hidden="true" />
                        </>
                    )}
                    {kategorije.map((k) => (
                        <a key={k.id} href={`#${k.id}`} className="nadnaslov shrink-0 px-2 py-2 opacity-70 hover:opacity-100">{tx(k.naziv)}</a>
                    ))}
                </div>
            </Kontejner>

            <Sekcija className="!pt-10">
                <Kontejner className="space-y-20 md:space-y-28">
                    {!kategorije.length && <p className="tekst-uvod">{t.cenovnik.prazno}</p>}
                    {kategorije.map((k) => (
                        <section key={k.id} id={k.id} className="grid scroll-mt-40 gap-8 lg:grid-cols-12">
                            <div className="lg:col-span-4">
                                <div className="lg:sticky lg:top-44">
                                    <h2 className="naslov naslov-2 m-0">{tx(k.naziv)}</h2>
                                    <p className="tekst-telo m-0 mt-4 max-w-sm opacity-70">{tx(k.opis)}</p>
                                </div>
                            </div>
                            <ul className="m-0 list-none border-t p-0 lg:col-span-8" style={{ borderColor: 'rgb(var(--c-linija) / .8)' }}>
                                {k.usluge.map((u, i) => {
                                    const l = linkUsluge(u);
                                    return (
                                        <Pojava as="li" key={u.id} i={i % 4} className="grid grid-cols-[1fr_auto] gap-x-6 gap-y-2 border-b py-6" style={{ borderColor: 'rgb(var(--c-linija) / .15)' }}>
                                            <div>
                                                <h3 className="m-0 text-lg font-medium" style={{ fontFamily: 'var(--font-tekst)' }}>{tx(u.naziv)}</h3>
                                                {u.opis && <p className="m-0 mt-1 text-sm leading-relaxed opacity-70">{tx(u.opis)}</p>}
                                                <p className="nadnaslov m-0 mt-3 inline-flex items-center gap-1.5 opacity-70"><Clock size={13} aria-hidden="true" /> {trajanje(u.trajanje, jezik)}</p>
                                            </div>
                                            <div className="flex flex-col items-end justify-between gap-3 text-right">
                                                <p className="m-0 whitespace-nowrap text-lg tabular-nums">
                                                    {u.cenaOd && <span className="mr-1 text-sm opacity-70">{t.opste.od}</span>}
                                                    {cena(u.cena, jezik)}
                                                </p>
                                                {l ? (
                                                    <Link to={l} className={cx('cip !py-1.5')}>{t.cenovnik.zakazi}</Link>
                                                ) : (
                                                    <a {...zakazi} className="cip !py-1.5">{t.cenovnik.zakazi}</a>
                                                )}
                                            </div>
                                        </Pojava>
                                    );
                                })}
                            </ul>
                        </section>
                    ))}
                    <p className="nadnaslov m-0 opacity-70">{salon.firma.pdvObveznik ? t.cenovnik.pdvDa : t.cenovnik.pdvNe}</p>
                </Kontejner>
            </Sekcija>
        </>
    );
}
