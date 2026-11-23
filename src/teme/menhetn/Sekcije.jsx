/*
 * Sekcije početne za temu „menhetn”, redom kao na referenci (prevedeno na salon):
 *   uvod u usluge + pločice 3×2 → brendovi + marquee → krem traka + foto salona →
 *   karusel tima → dve podeljene sekcije 50/50 → utisci u redovima →
 *   krem CTA traka → forma zahteva sa kontakt podacima.
 * Bez reveal animacija (referenca ih nema). Podaci salona iz useSajt().
 */
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Star } from 'lucide-react';
import { useSajt } from '../../kontekst/Sajt.jsx';
import { Dugme, Foto, Kontejner, Naslov, Sekcija, cx } from '../../components/primitivi.jsx';
import { useZakaziLink } from '../../components/Header.jsx';
import { LogoBrenda, RadnoVremeTabela } from '../../components/delovi.jsx';
import { brendoviSalona } from '../../lib/brendovi.js';
import { tekstovi } from './tekstovi.js';

/* ── Zaglavlje u tri kolone: nadnaslov | H2 (+ dugme) | uvod ─────────── */
export const ZaglavljeTriKolone = ({ nadnaslov, naslov, uvod, akcija, className }) => (
    <div className={cx('mh-tri-kolone grid items-start gap-y-4 md:grid-cols-[228fr_496fr_416fr] md:gap-y-0', className)}>
        <p className="nadnaslov mh-blag m-0">{nadnaslov}</p>
        <div className="md:pr-10">
            <Naslov nivo={2} tekst={naslov} animiraj={false} />
            {akcija && <div className="mt-5">{akcija}</div>}
        </div>
        {uvod && <div className="tekst-telo mh-blag mt-2 md:mt-0">{uvod}</div>}
    </div>
);

/* ── 2–3. Uvod u usluge i pločice ─────────────────────────────────────── */
export const UslugeMenhetn = () => {
    const { salon, t, tx, p } = useSajt();
    const plocice = salon.kategorije.map((k) => ({ id: k.id, naziv: tx(k.naziv), slika: k.slika, to: `${p('cenovnik')}#${k.id}` }));
    // Pet kategorija u mreži 3×2: šesta pločica vodi u galeriju, da red ne ostane prazan.
    if (plocice.length % 3 === 2 && salon.galerija?.length) {
        const g = salon.galerija.find((x) => !x.kategorija) ?? salon.galerija[0];
        plocice.push({ id: 'galerija', naziv: t.nav.galerija, slika: g.slika, to: p('galerija') });
    }
    return (
        <Sekcija className="mh-usluge">
            <Kontejner>
                <ZaglavljeTriKolone
                    nadnaslov={t.pocetna.uslugeNadnaslov}
                    naslov={`${t.pocetna.uslugeNaslov} ${t.pocetna.uslugeAkcenat}`}
                    uvod={<p className="m-0">{tx(salon.opis)} <strong>{t.pocetna.uslugeUvod}</strong></p>}
                />
                <ul className="mh-plocice m-0 mt-[75px] grid list-none gap-[10px] p-0 md:mt-[130px] md:grid-cols-3 md:gap-x-3 md:gap-y-[10px]">
                    {plocice.map((pl) => (
                        <li key={pl.id} className="relative h-[550px]">
                            <Link to={pl.to} className="mh-plocica group absolute inset-0 block overflow-hidden text-white">
                                <Foto src={pl.slika} alt="" okvirKlasa="!absolute inset-0" sizes="(min-width: 768px) 33vw, 100vw" />
                                <span className="mh-veo-plocica absolute inset-0" aria-hidden="true" />
                                <h3 className="naslov naslov-2 absolute inset-x-[30px] top-[30px] m-0 md:inset-x-10 md:top-10">{pl.naziv}</h3>
                                <span className="mh-obris absolute bottom-[30px] left-[30px] md:bottom-10 md:left-10">{t.opste.saznajVise}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </Kontejner>
        </Sekcija>
    );
};


export const BrendoviMenhetn = () => {
    const { salon, t, jezik } = useSajt();
    const tt = tekstovi(jezik);
    const zakazi = useZakaziLink();
    const brendovi = brendoviSalona(salon);
    if (!brendovi.length) return null;
    // Jedna kopija mora biti šira od ekrana, da traka nikad ne ostane prazna.
    const niz = brendovi.length < 6 ? [...brendovi, ...brendovi, ...brendovi].slice(0, Math.max(6, brendovi.length)) : brendovi;
    return (
        <Sekcija className="mh-brendovi overflow-hidden">
            <Kontejner>
                <ZaglavljeTriKolone
                    nadnaslov={tt.brendoviNadnaslov}
                    naslov={t.pocetna.brendoviNaslov}
                    uvod={<p className="m-0">{tt.brendoviUvod}</p>}
                    akcija={<Dugme {...zakazi}>{t.nav.zakazi}</Dugme>}
                />
            </Kontejner>
            <div className="mh-marquee marquee mt-[60px] md:mt-[125px]">
                <div className="marquee-traka">
                    {[0, 1].map((kopija) => (
                        <ul key={kopija} className="m-0 flex shrink-0 list-none items-center p-0" aria-hidden={kopija === 1 ? 'true' : undefined} aria-label={kopija === 0 ? t.pocetna.brendoviNaslov : undefined}>
                            {niz.map((b, i) => (
                                <li key={`${kopija}-${i}`} className="mh-marka"><LogoBrenda brend={b} tabIndex={kopija === 1 || i >= brendovi.length ? -1 : undefined} /></li>
                            ))}
                        </ul>
                    ))}
                </div>
            </div>
        </Sekcija>
    );
};

/* ── 5. Krem traka sa naslovom i dugmetom, ispod fotografija salona ──── */
export const SalonTraka = () => {
    const { salon, p, jezik, tx } = useSajt();
    const tt = tekstovi(jezik);
    const g = salon.galerija?.find((x) => !x.kategorija) ?? salon.galerija?.[0];
    return (
        <>
            <section className="mh-krem bg-mist text-center">
                <Kontejner className="py-[60px] md:py-[120px]">
                    <h2 className="naslov naslov-2 mx-auto m-0 max-w-[600px] text-brand">{tt.salonNaslov}</h2>
                    <div className="mt-10 flex justify-center">
                        <Dugme to={p('galerija')}>{tt.salonDugme}</Dugme>
                    </div>
                </Kontejner>
            </section>
            {g && (
                <div className="relative h-[300px] md:h-[495px]">
                    <Foto src={g.slika} alt={tx(g.opis)} okvirKlasa="!absolute inset-0" sizes="100vw" />
                </div>
            )}
        </>
    );
};

/* ── 6. Karusel tima: 3 / 2 / 1 kartice, razmak 10, 500 ms, autoplay 5 s, petlja ── */
export const TimKarusel = () => {
    const { salon, t, tx, p, jezik, tema } = useSajt();
    const tt = tekstovi(jezik);
    const zakazi = useZakaziLink();
    const tim = salon.tim ?? [];
    const n = tim.length;
    const k = tema.pokret.karusel ?? {};
    const petlja = n > 1;
    const lista = petlja ? [...tim, ...tim, ...tim] : tim;
    const [indeks, setIndeks] = useState(petlja ? n : 0);
    const [glatko, setGlatko] = useState(true);
    const [pauza, setPauza] = useState(false);
    // Kartica po prikazu (3 / 2 / 1, prelomi 1024 / 767) — širine su u CSS-u; ovo služi za aria-hidden.
    const [pp, setPp] = useState(3);
    const trakaRef = useRef(null);

    useEffect(() => {
        const sirok = window.matchMedia('(min-width: 1024px)');
        const srednji = window.matchMedia('(min-width: 767px)');
        const izracunaj = () => setPp(sirok.matches ? 3 : srednji.matches ? 2 : 1);
        izracunaj();
        sirok.addEventListener('change', izracunaj);
        srednji.addEventListener('change', izracunaj);
        return () => { sirok.removeEventListener('change', izracunaj); srednji.removeEventListener('change', izracunaj); };
    }, []);

    // Posle skoka sa klona na original (bez prelaza) vraća prelaz u sledećem kadru.
    useEffect(() => {
        if (glatko) return undefined;
        let b;
        const a = requestAnimationFrame(() => { b = requestAnimationFrame(() => setGlatko(true)); });
        return () => { cancelAnimationFrame(a); cancelAnimationFrame(b); };
    }, [glatko]);

    useEffect(() => {
        if (!petlja || pauza || !k.autoplay) return undefined;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
        const id = setTimeout(() => setIndeks((i) => i + 1), k.autoplay);
        return () => clearTimeout(id);
    }, [indeks, pauza, petlja, k.autoplay]);

    if (!n) return null;

    const krajPrelaza = (e) => {
        if (e.target !== trakaRef.current || e.propertyName !== 'transform') return;
        if (indeks >= 2 * n) { setGlatko(false); setIndeks(indeks - n); }
        else if (indeks < n) { setGlatko(false); setIndeks(indeks + n); }
    };
    const pomeri = (d) => { setGlatko(true); setIndeks((i) => Math.min(Math.max(i + d, 0), 3 * n - 1)); };
    const linkZa = (r) => (zakazi.to ? { to: `${p('zakazivanje')}?stilista=${r.id}` } : zakazi);

    return (
        <Sekcija className="mh-tim !pb-10">
            <Kontejner>
                <Naslov nivo={2} tekst={tt.timNaslov} animiraj={false} className="text-center text-brand" />
                <div
                    className="mh-karusel mt-[55px] overflow-hidden"
                    role="region"
                    aria-roledescription="carousel"
                    aria-label={tt.karusel}
                    onMouseEnter={() => setPauza(true)}
                    onMouseLeave={() => setPauza(false)}
                    onFocus={() => setPauza(true)}
                    onBlur={() => setPauza(false)}
                >
                    <ul
                        ref={trakaRef}
                        className="mh-karusel-traka m-0 flex list-none p-0"
                        style={{ '--i': indeks, '--razmak': `${k.razmak ?? 10}px`, transitionDuration: glatko ? `${k.brzina ?? 500}ms` : '0ms' }}
                        onTransitionEnd={krajPrelaza}
                    >
                        {lista.map((r, i) => {
                            // Van vidljivog prozora (klonovi i kartice odsečene ivicom) — skriveno od čitača i tastature.
                            const klon = i < indeks || i >= indeks + pp;
                            return (
                                <li
                                    key={`${r.id}-${i}`}
                                    className="mh-karusel-stavka"
                                    role="group"
                                    aria-roledescription="slide"
                                    aria-label={tt.slajd((i % n) + 1, n)}
                                    aria-hidden={klon ? 'true' : undefined}
                                    inert={klon ? '' : undefined}
                                >
                                    <article className="mh-kartica flex h-full flex-col">
                                        <Foto src={r.slika} alt={klon ? '' : r.ime} okvirKlasa="h-[350px] shrink-0" sizes="(min-width: 1024px) 380px, (min-width: 767px) 50vw, 100vw" />
                                        <div className="flex flex-1 flex-col items-start p-5">
                                            <h3 className="naslov naslov-3 m-0">{r.ime}</h3>
                                            {r.opis && <p className="tekst-telo mh-bledi m-0 mt-5">{tx(r.opis)}</p>}
                                            <p className="tekst-telo m-0 mt-5 text-ink">{tx(r.uloga)}</p>
                                            <div className="mt-8">
                                                <Dugme {...linkZa(r)} tabIndex={klon ? -1 : undefined}>{tt.zakazi}</Dugme>
                                            </div>
                                        </div>
                                    </article>
                                </li>
                            );
                        })}
                    </ul>
                </div>
                {petlja && (
                    <div className="mt-[40px] flex justify-center gap-[5px] md:mt-[57px]">
                        <button type="button" className="mh-strelica-karusela" onClick={() => pomeri(-1)} aria-label={t.opste.prethodna}>
                            <ArrowLeft size={13} strokeWidth={2} aria-hidden="true" />
                        </button>
                        <button type="button" className="mh-strelica-karusela" onClick={() => pomeri(1)} aria-label={t.opste.sledeca}>
                            <ArrowRight size={13} strokeWidth={2} aria-hidden="true" />
                        </button>
                    </div>
                )}
            </Kontejner>
        </Sekcija>
    );
};

/* ── 7. Podeljena sekcija 50/50: fotografija do ivice + maslinasti panel ── */
const Podeljena = ({ slika, alt = '', naslov, ogledalo = false, dugme, children }) => (
    <section className="mh-podeljena grid bg-tamna text-white md:grid-cols-2">
        <div className={cx('relative h-[435px] md:h-auto', ogledalo ? 'md:order-2 md:min-h-[663px]' : 'md:min-h-[675px]')}>
            <Foto src={slika} alt={alt} okvirKlasa="!absolute inset-0" sizes="(min-width: 768px) 50vw, 100vw" />
        </div>
        <div className={cx('flex flex-col justify-center px-5 py-[60px] md:py-[100px]', ogledalo ? 'mh-panel-levo' : 'mh-panel-desno')}>
            <Naslov nivo={2} tekst={naslov} animiraj={false} />
            <div className="tekst-telo mh-tekst-panel mt-[25px] space-y-[15px]">{children}</div>
            {dugme && <div className="mt-10">{dugme}</div>}
        </div>
    </section>
);

export const PodeljeneSekcije = () => {
    const { salon, t, tx, p, jezik } = useSajt();
    const tt = tekstovi(jezik);
    const o = salon.oNama;
    const zasto = salon.pocetna.zastoMi ?? [];
    return (
        <>
            {o && (
                <Podeljena slika={o.slika} naslov={tx(o.naslov)}>
                    {(o.tekst ?? []).slice(0, 2).map((pasus, i) => <p key={i} className="m-0">{tx(pasus)}</p>)}
                </Podeljena>
            )}
            {zasto.length > 0 && (
                <Podeljena
                    ogledalo
                    slika={salon.pocetna.poziv?.slika ?? salon.galerija?.[0]?.slika}
                    naslov={`${t.pocetna.zastoNaslov} ${t.pocetna.zastoAkcenat}`}
                    dugme={<Dugme to={p('oNama')} varijanta="krem" className="dugme-krem">{tt.oNamaDugme}</Dugme>}
                >
                    {zasto.map((s, i) => <p key={i} className="m-0"><strong>{tx(s.naslov)}.</strong> {tx(s.tekst)}</p>)}
                </Podeljena>
            )}
        </>
    );
};

/* ── 8. Utisci u redovima (obrazac „vesti”): foto | citat | autor i ocena ── */
export const UtisciRedovi = () => {
    const { salon, tx, jezik } = useSajt();
    const tt = tekstovi(jezik);
    const r = salon.recenzije;
    if (!r?.lista?.length) return null;
    const galerija = salon.galerija ?? [];
    return (
        <Sekcija className="mh-utisci !pb-[60px] md:!pb-[120px]">
            <Kontejner>
                <Naslov nivo={2} tekst={tt.recenzijeNaslov} animiraj={false} />
                <ul className="mh-redovi m-0 mt-[40px] list-none p-0 md:mt-[50px]">
                    {r.lista.map((rv, i) => {
                        const g = galerija.length ? galerija[(i * 3 + 1) % galerija.length] : null;
                        return (
                            <li key={i} className="mh-red grid gap-y-5 py-[30px] md:grid-cols-[309px_minmax(0,1fr)_260px] md:items-center md:py-[13px]">
                                <Foto src={g?.slika} alt={g ? tx(g.opis) : ''} okvirKlasa="aspect-[3/2] md:aspect-auto md:h-[206px]" sizes="(min-width: 768px) 309px, 100vw" />
                                <blockquote className="mh-vest m-0 text-brand md:pl-[60px] md:pr-10">„{tx(rv.tekst)}”</blockquote>
                                <div className="tekst-telo">
                                    <p className="m-0 font-semibold text-ink">{rv.autor}</p>
                                    <p className="m-0 mt-2 flex gap-1 text-brand" role="img" aria-label={tt.ocena(rv.ocena)}>
                                        {Array.from({ length: rv.ocena }, (_, k) => <Star key={k} size={15} fill="currentColor" strokeWidth={0} aria-hidden="true" />)}
                                    </p>
                                    {r.izvor && <p className="mh-blag m-0 mt-2">{r.izvor}</p>}
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </Kontejner>
        </Sekcija>
    );
};

/* ── 9. Krem CTA traka: nadnaslov, veliki maslinasti naslov, dva dugmeta ── */
export const PozivTraka = () => {
    const { salon, t, tx, p, jezik } = useSajt();
    const tt = tekstovi(jezik);
    const zakazi = useZakaziLink();
    const pz = salon.pocetna.poziv;
    return (
        <section className="mh-poziv bg-mist text-center">
            <Kontejner className="py-[60px] md:py-[120px]">
                <p className="nadnaslov m-0 text-ink">{tt.ctaNadnaslov}</p>
                <h2 className="naslov naslov-hero m-0 mt-1 text-brand">{tx(pz?.naslov) || t.footer.zakaziNaslov}</h2>
                <div className="mt-10 flex flex-wrap justify-center gap-5">
                    <Dugme {...zakazi}>{t.nav.zakazi}</Dugme>
                    <Dugme to={p('cenovnik')}>{t.nav.cenovnik}</Dugme>
                </div>
            </Kontejner>
        </section>
    );
};

/* ── 10. Forma zahteva: levo naslov i kontakt, desno polja ────────────── */
const TELEFON = /^\+?[\d\s/().-]{6,}$/;

export const FormaZahteva = () => {
    const { salon, t, tx, p, jezik } = useSajt();
    const tt = tekstovi(jezik);
    const z = t.zakazivanje;
    const k = salon.kontakt;
    const l = salon.lokacija;
    const [v, setV] = useState({ ime: '', telefon: '', email: '', datum: '', vreme: '', usluge: [], poruka: '', saglasnost: false });
    const [greske, setGreske] = useState({});
    const [poslato, setPoslato] = useState(false);
    const postavi = (polje) => (e) => {
        const x = e.target.type === 'checkbox' ? e.target.checked
            : e.target.multiple ? Array.from(e.target.selectedOptions).map((o) => o.value) : e.target.value;
        setV((s) => ({ ...s, [polje]: x }));
    };

    const posalji = (e) => {
        e.preventDefault();
        const g = {};
        if (v.ime.trim().length < 2) g.ime = z.greske.ime;
        if (!TELEFON.test(v.telefon.trim())) g.telefon = z.greske.telefon;
        if (v.email && !/^\S+@\S+\.\S+$/.test(v.email)) g.email = z.greske.email;
        if (!v.saglasnost) g.saglasnost = z.greske.saglasnost;
        setGreske(g);
        if (Object.keys(g).length) {
            e.currentTarget.querySelector(`[name="${Object.keys(g)[0]}"]`)?.focus();
            return;
        }
        const nazivi = v.usluge.map((id) => tx(salon.kategorije.find((x) => x.id === id)?.naziv)).filter(Boolean);
        const tekst = [
            z.poruka.naslov,
            `${z.poruka.ime}: ${v.ime.trim()}`,
            `${z.poruka.telefon}: ${v.telefon.trim()}`,
            v.email && `${z.poruka.email}: ${v.email.trim()}`,
            nazivi.length && `${z.poruka.usluge}: ${nazivi.join(', ')}`,
            (v.datum || v.vreme) && `${z.poruka.termin}: ${[v.datum, v.vreme].filter(Boolean).join(' ')}`,
            v.poruka.trim() && `${z.poruka.napomena}: ${v.poruka.trim()}`,
            `${z.poruka.izvor}: ${salon.domen}`,
        ].filter(Boolean).join('\n');
        if (k.whatsapp) window.open(`https://wa.me/${k.whatsapp}?text=${encodeURIComponent(tekst)}`, '_blank', 'noopener');
        else if (k.viber) window.location.href = `viber://chat?number=%2B${k.viber}&draft=${encodeURIComponent(tekst)}`;
        else if (k.email) window.location.href = `mailto:${k.email}?subject=${encodeURIComponent(z.poruka.naslov)}&body=${encodeURIComponent(tekst)}`;
        setPoslato(true);
    };

    const Labela = ({ za, children, obavezno }) => (
        <label htmlFor={za} className="mh-labela">
            {children}{obavezno && <> <span aria-hidden="true">*</span><span className="sr-only"> ({tt.obavezno})</span></>}
        </label>
    );
    const Greska = ({ polje }) => (greske[polje] ? <p id={`mh-g-${polje}`} className="m-0 mt-1 text-sm text-[#b42318]">{greske[polje]}</p> : null);
    const opisGreske = (polje) => (greske[polje] ? { 'aria-invalid': 'true', 'aria-describedby': `mh-g-${polje}` } : {});

    return (
        <Sekcija className="mh-forma">
            <Kontejner className="grid gap-12 md:grid-cols-2 md:gap-x-5">
                <div className="md:pr-[140px]">
                    <Naslov nivo={2} tekst={tt.formaNaslov} animiraj={false} />
                    <div className="tekst-telo mh-blag mt-[45px] space-y-[14px]">
                        <p className="m-0">{tt.formaUvod}</p>
                        <p className="m-0">{tt.formaPozovite} <a href={`tel:${k.telefon}`} className="text-ink hover:underline">{k.telefonPrikaz}</a>.</p>
                        <p className="m-0"><Link to={p('zakazivanje')} className="podvucen text-ink">{tt.formaOnline}</Link></p>
                    </div>
                    <div className="tekst-telo mh-blag mt-[45px]">
                        <p className="m-0 mb-5 font-semibold text-ink">{tt.kontaktPodaci}</p>
                        <address className="not-italic">
                            {l.adresa}<br />{l.postanskiBroj} {tx(l.grad)}<br />
                            <a href={`tel:${k.telefon}`} className="hover:underline">{k.telefonPrikaz}</a>
                        </address>
                        {k.email && <p className="m-0 mt-[35px]"><a href={`mailto:${k.email}`} className="break-all hover:underline">{k.email}</a></p>}
                        <RadnoVremeTabela className="mt-5 max-w-[260px] !gap-0" />
                    </div>
                </div>

                <form className="mh-polja space-y-[14px]" noValidate onSubmit={posalji} aria-label={tt.formaNaslov}>
                    <div>
                        <Labela za="mh-ime" obavezno>{z.ime}</Labela>
                        <input id="mh-ime" name="ime" className="polje" autoComplete="name" value={v.ime} onChange={postavi('ime')} required {...opisGreske('ime')} />
                        <Greska polje="ime" />
                    </div>
                    <div>
                        <Labela za="mh-telefon" obavezno>{z.telefon}</Labela>
                        <input id="mh-telefon" name="telefon" type="tel" className="polje" autoComplete="tel" inputMode="tel" value={v.telefon} onChange={postavi('telefon')} required {...opisGreske('telefon')} />
                        <Greska polje="telefon" />
                    </div>
                    <div>
                        <Labela za="mh-email">{z.email} <span className="font-normal text-[rgb(var(--c-tekst-blag))]">({z.opciono})</span></Labela>
                        <input id="mh-email" name="email" type="email" className="polje" autoComplete="email" value={v.email} onChange={postavi('email')} {...opisGreske('email')} />
                        <Greska polje="email" />
                    </div>
                    <div className="grid grid-cols-[2fr_1fr] gap-3">
                        <div>
                            <Labela za="mh-datum">{tt.datum}</Labela>
                            <input id="mh-datum" name="datum" type="date" className="polje" value={v.datum} onChange={postavi('datum')} />
                        </div>
                        <div>
                            <Labela za="mh-vreme">{tt.vreme}</Labela>
                            <input id="mh-vreme" name="vreme" type="time" className="polje" value={v.vreme} onChange={postavi('vreme')} />
                        </div>
                    </div>
                    <div>
                        <Labela za="mh-usluge">{tt.usluga}</Labela>
                        <select id="mh-usluge" name="usluge" multiple size={Math.min(4, salon.kategorije.length)} className="polje mh-lista" value={v.usluge} onChange={postavi('usluge')}>
                            {salon.kategorije.map((kat) => <option key={kat.id} value={kat.id}>{tx(kat.naziv)}</option>)}
                        </select>
                    </div>
                    <div>
                        <Labela za="mh-poruka">{tt.poruka}</Labela>
                        <textarea id="mh-poruka" name="poruka" rows={4} className="polje" placeholder={tt.porukaPlaceholder} value={v.poruka} onChange={postavi('poruka')} />
                    </div>
                    <div>
                        <label className="flex items-start gap-2 text-ink">
                            <input type="checkbox" name="saglasnost" className="mt-1 h-4 w-4 shrink-0 accent-[rgb(var(--c-brand))]" checked={v.saglasnost} onChange={postavi('saglasnost')} {...opisGreske('saglasnost')} />
                            <span>{z.saglasnost} <Link to={p('privatnost')} className="podvucen">{z.politika}</Link>. <span aria-hidden="true">*</span></span>
                        </label>
                        <Greska polje="saglasnost" />
                    </div>
                    <div className="pt-[26px]">
                        <Dugme type="submit">{z.posalji}</Dugme>
                    </div>
                    <p className="m-0 text-ink" aria-live="polite">{poslato ? z.uspehKanal : ''}</p>
                </form>
            </Kontejner>
        </Sekcija>
    );
};
