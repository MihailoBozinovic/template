/*
 * Početna teme „palma” — redosled kao na referenci, prevedeno na salon:
 *   Hero (dupla: USLUGE | ZAKAŽI) → istaknute usluge (4 kolone, prva tamna =
 *   vaučer) → veliki linkovi kategorija → „klub” mreža (galerija sa paralaksom)
 *   → tim (split + vertikalni marquee imena) → recenzije (urednička lista) →
 *   izjava koja se pali reč po reč. Traka prednosti i footer su u Footer.jsx.
 */
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { useSajt } from '../../kontekst/Sajt.jsx';
import { cena } from '../../lib/format.js';
import { Dugme, Foto, Kontejner, cx } from '../../components/primitivi.jsx';
import { LogotipiBrendova } from '../../components/delovi.jsx';
import { brendoviSalona } from '../../lib/brendovi.js';
import { useZakaziLink } from '../../components/Header.jsx';
import { tekstovi } from './tekstovi.js';

const ugasenPokret = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── Hero „dupla” ──────────────────────────────────────────────────────── */
export const PalmaHero = () => {
    const { salon, tx, p, jezik } = useSajt();
    const tk = tekstovi(jezik);
    const zakazi = useZakaziLink();
    const slike = salon.pocetna.hero.slike?.length ? salon.pocetna.hero.slike : [''];
    const polja = [
        { slika: slike[0], rec: tk.heroUsluge, veza: { to: p('cenovnik') } },
        { slika: slike[1] ?? slike[0], rec: tk.heroZakazi, veza: zakazi },
    ];
    return (
        <section data-palma-hero className="p-hero">
            <h1 className="sr-only">{salon.naziv} — {tx(salon.slogan)}</h1>
            {polja.map((pl, i) => {
                const Tag = pl.veza.to ? Link : 'a';
                const slova = [...String(pl.rec)].length;
                return (
                    <Tag key={i} {...pl.veza} className={cx('p-hero-pola', `p-hero-pola-${i + 1}`)}>
                        <Foto src={pl.slika} alt="" prioritet okvirKlasa="!absolute inset-0" sizes="(min-width: 768px) 50vw, 100vw" />
                        <span className="p-hero-veo" aria-hidden="true" />
                        <span className={cx('p-hero-polje', `p-hero-polje-${i + 1}`)}>
                            <span className="p-hero-rec" style={{ '--slova': Math.max(4, slova) }}>{pl.rec}</span>
                        </span>
                    </Tag>
                );
            })}
        </section>
    );
};

/* ── Istaknute usluge: 4 kolone, prva ćelija tamna promo kartica ───────── */
const izaberiUsluge = (kategorije, n) => {
    const izbor = [];
    for (let red = 0; izbor.length < n; red++) {
        let ima = false;
        for (const k of kategorije) {
            if (k.usluge[red] && izbor.length < n) { izbor.push({ k, u: k.usluge[red], red }); ima = true; }
        }
        if (!ima) break;
    }
    return izbor;
};

const Promo = () => {
    const { salon, t, tx } = useSajt();
    const zakazi = useZakaziLink();
    const tekst = tx(salon.poklonVaucer?.tekst);
    const k = salon.kontakt;
    if (!tekst) {
        return (
            <div className="p-promo">
                <h3 className="naslov naslov-3 m-0">{t.nav.zakazi}</h3>
                <p className="tekst-telo m-0">{t.zakazivanje.uvod}</p>
                <Dugme {...zakazi} varijanta="fotoObris" strelica={false}>{t.nav.zakazi}</Dugme>
            </div>
        );
    }
    const prva = tekst.split(/(?<=[.!?])\s/)[0];
    const href = k.whatsapp ? `https://wa.me/${k.whatsapp}?text=${encodeURIComponent(t.pocetna.vaucerNaslov)}` : `tel:${k.telefon}`;
    return (
        <div className="p-promo">
            <h3 className="naslov naslov-3 m-0">{t.pocetna.vaucerNaslov}</h3>
            <p className="tekst-telo m-0"><span className="md:hidden">{prva}</span><span className="hidden md:inline">{tekst}</span></p>
            <Dugme href={href} varijanta="fotoObris" strelica={false} target={k.whatsapp ? '_blank' : undefined} rel="noopener noreferrer">{t.pocetna.vaucerDugme}</Dugme>
        </div>
    );
};

export const Istaknuto = () => {
    const { salon, t, tx, p, jezik } = useSajt();
    const tk = tekstovi(jezik);
    const izbor = izaberiUsluge(salon.kategorije, 7);
    if (!izbor.length) return null;
    /*
     * Svaka kartica: prva fotografija iz njene kategorije (pa iz galerije),
     * druga (za pretapanje na hover) sledeća neiskorišćena — bez ponavljanja
     * dok ima dovoljno fotografija.
     */
    const galerija = (salon.galerija ?? []).map((g) => g.slika).filter(Boolean);
    const iskorisceno = new Set();
    const uzmi = (kandidati) => {
        const s = kandidati.find((x) => x && !iskorisceno.has(x)) ?? kandidati.find(Boolean);
        if (s) iskorisceno.add(s);
        return s;
    };
    const slike = izbor.map(({ k }) => uzmi([k.slika, ...(salon.galerija ?? []).filter((g) => g.kategorija === k.id).map((g) => g.slika), ...galerija]));
    const slikeHover = izbor.map(({ k }) => uzmi([...(salon.galerija ?? []).filter((g) => g.kategorija === k.id).map((g) => g.slika), ...galerija, k.slika]));
    const slikeZa = (_, i) => [slike[i], slikeHover[i] !== slike[i] ? slikeHover[i] : null];
    return (
        <section className="p-istaknuto" aria-labelledby="p-istaknuto-naslov">
            <h2 id="p-istaknuto-naslov" className="sr-only">{tk.istaknuto}</h2>
            <Kontejner>
                <ul className="p-istaknuto-mreza skriven-skrol m-0 list-none p-0">
                    <li className="p-istaknuto-celija"><Promo /></li>
                    {izbor.map((s, i) => {
                        const [prva, druga] = slikeZa(s, i);
                        return (
                            <li key={s.u.id} className="p-istaknuto-celija">
                                <Link to={`${p('cenovnik')}#${s.k.id}`} className="p-kartica">
                                    <span className="p-kartica-tekst">
                                        <span className="p-prigusen block">{tx(s.k.naziv)}</span>
                                        <span className="block">{tx(s.u.naziv)}</span>
                                        <span className="p-prigusen block">{s.u.cenaOd ? `${t.opste.od} ` : ''}{cena(s.u.cena, jezik)}</span>
                                    </span>
                                    <span className="p-kartica-slike">
                                        {druga && <Foto src={druga} alt="" okvirKlasa="!absolute inset-0 p-kartica-druga" sizes="(min-width: 768px) 25vw, 45vw" />}
                                        <Foto src={prva} alt={tx(s.u.naziv)} okvirKlasa="!absolute inset-0 p-kartica-prva" sizes="(min-width: 768px) 25vw, 45vw" />
                                    </span>
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </Kontejner>
        </section>
    );
};

/* ── Veliki linkovi kategorija (kao „Shop collections”) ─────────────────── */
export const VelikiLinkovi = () => {
    const { salon, t, tx, p } = useSajt();
    const kat = salon.kategorije;
    if (!kat.length) return null;
    return (
        <section className="sekcija p-linkovi" aria-labelledby="p-linkovi-naslov">
            <Kontejner>
                <h2 id="p-linkovi-naslov" className="nadnaslov p-kvadrat m-0 text-center">{t.pocetna.uslugeNadnaslov}</h2>
                <ul className="p-linkovi-lista m-0 list-none p-0">
                    {kat.map((k) => (
                        <li key={k.id} className="p-linkovi-stavka">
                            <Link to={`${p('cenovnik')}#${k.id}`} className="p-veliki-link">
                                <span className="p-veliki-tekst naslov naslov-1 verzal">{tx(k.naziv)}</span>
                                {k.slika && <Foto src={k.slika} alt="" okvirKlasa="p-veliki-foto" sizes="18rem" />}
                            </Link>
                        </li>
                    ))}
                </ul>
            </Kontejner>
        </section>
    );
};

/* ── Paralaksa ćelija: CSS scroll-timeline; rezerva u JS-u ─────────────── */
const useParalaksa = (ref) => {
    useEffect(() => {
        const koren = ref.current;
        if (!koren || ugasenPokret()) return undefined;
        if (typeof CSS !== 'undefined' && CSS.supports?.('animation-timeline: view()')) return undefined;
        const celije = [...koren.querySelectorAll('[data-pomak]')];
        let ceka = false;
        const pomeri = () => {
            ceka = false;
            const vh = window.innerHeight;
            for (const el of celije) {
                const r = el.parentElement.getBoundingClientRect();
                if (r.bottom < -200 || r.top > vh + 200) continue;
                const napredak = Math.min(1, Math.max(0, (vh - r.top) / (vh + r.height)));
                const pomak = parseFloat(el.dataset.pomak) || 0;
                el.style.transform = `translate3d(0, ${(-pomak + 2 * pomak * napredak).toFixed(1)}px, 0)`;
            }
        };
        const naSkrol = () => { if (!ceka) { ceka = true; requestAnimationFrame(pomeri); } };
        pomeri();
        window.addEventListener('scroll', naSkrol, { passive: true });
        window.addEventListener('resize', naSkrol);
        return () => { window.removeEventListener('scroll', naSkrol); window.removeEventListener('resize', naSkrol); };
    }, [ref]);
};

/* ── „Klub” mreža: mutna podloga, ogromne reči, rasute fotografije ─────── */
const KlubFoto = ({ g, i, tx }) => (
    <span className={cx('p-klub-foto', `p-klub-foto-${i + 1}`)}>
        <span className="p-paralaksa block" data-pomak={i % 2 ? 60 : 30} style={{ '--pomak': `${i % 2 ? 60 : 30}px` }}>
            <Foto src={g.slika} alt={tx(g.opis)} okvirKlasa="aspect-[4/5]" sizes="(min-width: 768px) 9vw, 20vw" />
        </span>
    </span>
);

export const GalerijaRasuta = () => {
    const { salon, t, tx, p, jezik } = useSajt();
    const tk = tekstovi(jezik);
    const zakazi = useZakaziLink();
    const ref = useRef(null);
    useParalaksa(ref);
    const g = (salon.galerija ?? []).slice(0, 6);
    if (g.length < 6) return null;
    const [r1, r2, r3] = tk.galerijaReci;
    const pozadina = salon.pocetna.hero.slike?.[2] ?? salon.pocetna.poziv?.slika ?? g[0].slika;
    return (
        <section ref={ref} className="p-klub" aria-labelledby="p-klub-naslov">
            <Foto src={pozadina} alt="" okvirKlasa="!absolute inset-0 p-klub-pozadina" sizes="50vw" />
            <span className="p-klub-veo" aria-hidden="true" />
            <h2 id="p-klub-naslov" className="sr-only">{tk.galerijaNaslov}</h2>
            <div className="p-klub-unutra">
                <div className="p-klub-red p-klub-red-1">
                    <span className="p-klub-rec" aria-hidden="true">{r1}</span>
                    <KlubFoto g={g[0]} i={0} tx={tx} />
                    <span className="p-klub-razmak" />
                    <KlubFoto g={g[1]} i={1} tx={tx} />
                </div>
                <div className="p-klub-red p-klub-red-2">
                    <KlubFoto g={g[2]} i={2} tx={tx} />
                    <span className="p-klub-rec" aria-hidden="true">{r2}</span>
                    <span className="p-klub-razmak" />
                    <KlubFoto g={g[3]} i={3} tx={tx} />
                </div>
                <div className="p-klub-red p-klub-red-3">
                    <span className="p-klub-uvlaka" />
                    <KlubFoto g={g[4]} i={4} tx={tx} />
                    <span className="p-klub-rec" aria-hidden="true">{r3}</span>
                    <span className="p-klub-dugmad">
                        <Dugme {...zakazi} varijanta="foto" strelica={false}>{t.nav.zakazi}</Dugme>
                        <Link to={p('galerija')} className="sr-only">{t.nav.galerija}</Link>
                    </span>
                    <span className="p-klub-razmak" />
                    <KlubFoto g={g[5]} i={5} tx={tx} />
                </div>
            </div>
        </section>
    );
};

/* ── Tim: fotografija + vertikalni marquee imena + naslov desno ─────────── */
export const TimSplit = () => {
    const { salon, t, p, jezik } = useSajt();
    const tk = tekstovi(jezik);
    const tim = salon.tim ?? [];
    if (!tim.length) return null;
    const imena = tim.map((r) => r.ime.split(' ')[0]);
    let niz = [...imena];
    while (niz.length < 12) niz = [...niz, ...imena];
    const traka = [...niz, ...niz];
    const cetiri = tim.length >= 4;
    return (
        <section className="p-tim" aria-labelledby="p-tim-naslov">
            <div className="kontejner p-tim-mreza">
                <div className={cx('p-tim-slika', cetiri && 'p-tim-slika-4')}>
                    {(cetiri ? tim.slice(0, 4) : tim.slice(0, 1)).map((r) => (
                        <Foto key={r.id} src={r.slika} alt={r.ime} okvirKlasa={cetiri ? 'p-tim-celija' : '!absolute inset-0'} sizes="(min-width: 768px) 25vw, 50vw" />
                    ))}
                </div>
                <div className="p-tim-imena" aria-hidden="true">
                    <div className="p-tim-traka">
                        {traka.map((ime, i) => <span key={i} className="p-tim-ime">{ime}</span>)}
                    </div>
                </div>
                <ul className="sr-only" aria-label={tk.timImena}>{tim.map((r) => <li key={r.id}>{r.ime}</li>)}</ul>
                <div className="p-tim-tekst">
                    <h2 id="p-tim-naslov" className="naslov naslov-1 verzal m-0">{t.tim.naslov}</h2>
                    <p className="tekst-telo m-0">{t.tim.uvod}</p>
                    <Dugme to={p('tim')} varijanta="fotoObris" strelica={false}>{tk.timDugme}</Dugme>
                </div>
            </div>
        </section>
    );
};

/* ── Recenzije kao urednička lista (kod reference blog) ─────────────────── */
export const RecenzijeUrednicke = () => {
    const { salon, t, tx, jezik } = useSajt();
    const tk = tekstovi(jezik);
    const zakazi = useZakaziLink();
    const r = salon.recenzije;
    if (!r?.lista?.length) return null;
    const galerija = salon.galerija ?? [];
    const google = salon.kontakt.googleRecenzija;
    const dugme = google
        ? <Dugme href={google} target="_blank" rel="noopener noreferrer" strelica={false} className="p-recenzije-dugme">{tk.recenzijeDugme}</Dugme>
        : <Dugme {...zakazi} strelica={false} className="p-recenzije-dugme">{t.nav.zakazi}</Dugme>;
    return (
        <section className="sekcija p-recenzije" aria-labelledby="p-recenzije-naslov">
            <Kontejner>
                <div className="p-recenzije-vrh">
                    <h2 id="p-recenzije-naslov" className="naslov naslov-2 p-kvadrat-naslov verzal m-0">{t.pocetna.recenzijeNaslov}</h2>
                    <div className="hidden md:block">{dugme}</div>
                </div>
                <ul className="p-unosi skriven-skrol m-0 list-none p-0">
                    {r.lista.map((rv, i) => (
                        <li key={i} className="p-unos">
                            <figure className="p-unos-telo m-0">
                                {galerija.length > 0 && (
                                    <Foto src={galerija[(i * 4 + 2) % galerija.length].slika} alt={tx(galerija[(i * 4 + 2) % galerija.length].opis)} okvirKlasa="p-unos-foto" sizes="(min-width: 768px) 18rem, 285px" />
                                )}
                                <div>
                                    <p className="nadnaslov p-kvadrat m-0">
                                        <cite className="not-italic">{rv.autor}</cite>
                                        <span className="p-zvezdice" role="img" aria-label={tk.ocena(rv.ocena)}>
                                            {Array.from({ length: rv.ocena }, (_, k) => <Star key={k} size={10} fill="currentColor" strokeWidth={0} aria-hidden="true" />)}
                                        </span>
                                    </p>
                                    <blockquote className="naslov naslov-3 p-unos-citat m-0">{tx(rv.tekst)}</blockquote>
                                </div>
                            </figure>
                        </li>
                    ))}
                </ul>
                <div className="mt-8 md:hidden">{dugme}</div>
            </Kontejner>
        </section>
    );
};

/* ── Izjava koja se pali reč po reč (sticky fotografija) ─────────────────── */
export const IzjavaSkrol = () => {
    const { salon, tx } = useSajt();
    const ref = useRef(null);
    const tekst = tx(salon.pocetna.izjava);
    useEffect(() => {
        const el = ref.current;
        if (!el) return undefined;
        if (ugasenPokret()) { el.style.setProperty('--p', '1'); return undefined; }
        let ceka = false;
        const izracunaj = () => {
            ceka = false;
            const r = el.getBoundingClientRect();
            const vh = window.innerHeight;
            const napredak = (vh * 0.5 - r.top) / Math.max(1, r.height - vh * 0.5);
            el.style.setProperty('--p', Math.min(1, Math.max(0, napredak)).toFixed(4));
        };
        const naSkrol = () => { if (!ceka) { ceka = true; requestAnimationFrame(izracunaj); } };
        izracunaj();
        window.addEventListener('scroll', naSkrol, { passive: true });
        window.addEventListener('resize', naSkrol);
        return () => { window.removeEventListener('scroll', naSkrol); window.removeEventListener('resize', naSkrol); };
    }, []);
    if (!tekst) return null;
    const reci = tekst.split(/\s+/).filter(Boolean);
    // Referenca ima ~45 znakova; duža izjava se smanjuje da stane u jedan ekran (ceo tekst vidljiv dok je lepljiv).
    const skala = Math.min(1, Math.sqrt(90 / Math.max(1, tekst.length))).toFixed(3);
    const slika = salon.pocetna.poziv?.slika ?? salon.oNama?.slika;
    return (
        <section ref={ref} className="p-izjava">
            <div className="p-izjava-lepljivo">
                <Foto src={slika} alt="" okvirKlasa="!absolute inset-0" sizes="100vw" />
                <span className="p-izjava-veo" aria-hidden="true" />
                <div className="p-izjava-sadrzaj">
                    <p className="naslov naslov-hero p-izjava-tekst m-0" style={{ '--n': reci.length, '--skala': skala }}>
                        {reci.map((r, i) => (
                            <React.Fragment key={i}>
                                <span className="p-rec" style={{ '--i': i }}>{r}</span>{i < reci.length - 1 ? ' ' : ''}
                            </React.Fragment>
                        ))}
                    </p>
                </div>
            </div>
        </section>
    );
};

/* ── Brendovi: oznaka sa kvadratom, traka logotipa između tankih linija ── */
export const BrendoviTraka = () => {
    const { salon, t } = useSajt();
    if (!brendoviSalona(salon).length) return null;
    return (
        <section className="p-brendovi" aria-labelledby="p-brendovi-naslov">
            <h2 id="p-brendovi-naslov" className="nadnaslov p-kvadrat m-0 text-center">{t.pocetna.brendoviNaslov}</h2>
            <LogotipiBrendova raspored="traka" className="p-brendovi-traka" />
        </section>
    );
};

export const SEKCIJE = [Istaknuto, VelikiLinkovi, BrendoviTraka, GalerijaRasuta, TimSplit, RecenzijeUrednicke, IzjavaSkrol];
