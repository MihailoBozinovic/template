/*
 * Hero, sekcije početne i zaglavlje podstranica teme „soho” (redosled po
 * referenci, docs/teme/soho.md §3): hero → uvod + dve pločice → usluge u
 * ogromnim redovima → galerija-slajder → tim-slajder → split „zašto mi” →
 * split „koraci” (ogledalo) → citati → profesionalne linije → poziv preko
 * fotografije → Instagram → monogram + marquee → footer.
 */
import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useSajt } from '../../kontekst/Sajt.jsx';
import { Dugme, Foto, Kontejner, cx } from '../../components/primitivi.jsx';
import { useZakaziLink } from '../../components/Header.jsx';
import { LogoBrenda } from '../../components/delovi.jsx';
import { brendoviSalona } from '../../lib/brendovi.js';
import { NaslovS, Oznaka, Strelica, Strelice, TekstLink, TrakaS, monogram, useSlajder, useT } from './delovi.jsx';

const Linija = ({ className }) => <hr className={cx('soho-linija', className)} />;

/* ── Hero: 100vh, jedna fotografija, ravan veo, tekst dole levo ─────────── */
export const HeroS = () => {
    const { salon, t, tx, p } = useSajt();
    const zakazi = useZakaziLink();
    const h = salon.pocetna.hero;
    return (
        <section className="soho-hero">
            <Foto src={h.slike?.[0] ?? ''} alt={tx(salon.slogan)} prioritet okvirKlasa="soho-hero-foto" sizes="100vw" />
            <div className="soho-hero-veo" aria-hidden="true" />
            <div className="soho-hero-sadrzaj kontejner">
                <Oznaka odmah>{tx(h.nadnaslov)}</Oznaka>
                <NaslovS as="h1" nivo="hero" tekst={tx(h.naslov)} akcenat={tx(h.akcenat)} odmah kasnjenje={0.15} className="soho-hero-naslov" />
                <div className="soho-hero-linkovi">
                    <TekstLink {...zakazi}>{t.nav.zakazi}</TekstLink>
                    <TekstLink to={p('cenovnik')}>{t.nav.cenovnik}</TekstLink>
                </div>
            </div>
        </section>
    );
};

/* ── Uvod (nadnaslov levo, h2 56px desno, dugme) + dve pločice ─────────── */
export const UvodS = () => {
    const { salon, tx, p } = useSajt();
    const T = useT();
    const kat = salon.kategorije;
    const zena = kat.find((k) => k.za?.includes('zene'));
    const muski = kat.find((k) => k.za?.includes('muskarci'));
    const ploce = zena && muski && zena !== muski
        ? [{ k: zena, kurziv: T.zaNju }, { k: muski, kurziv: T.zaNjega }]
        : kat.slice(0, 2).map((k) => ({ k, kurziv: null }));
    const izjava = tx(salon.pocetna.izjava);

    return (
        <section className="soho-sekcija soho-uvod">
            {izjava && (
                <Kontejner className="soho-dve-kolone">
                    <Oznaka>{T.uvodNadnaslov}</Oznaka>
                    <div>
                        <NaslovS as="h2" nivo={1} tekst={izjava} auto="recenica" />
                        <Dugme to={p('oNama')} varijanta="sekundarno" strelica={false} className="soho-uvod-dugme">{T.uvodDugme}</Dugme>
                    </div>
                </Kontejner>
            )}
            {ploce.length > 0 && (
                <Kontejner className="soho-ploce">
                    {ploce.map(({ k, kurziv }) => {
                        const naziv = tx(k.naziv);
                        const [prva, ...ostale] = naziv.split(/\s+/);
                        const gore = kurziv ?? (ostale.length ? prva : null);
                        const dole = kurziv ? naziv : (ostale.length ? ostale.join(' ') : naziv);
                        return (
                            <Link key={k.id} to={`${p('cenovnik')}#${k.id}`} className="soho-ploca">
                                <Foto src={k.slika} alt="" okvirKlasa="soho-ploca-foto" sizes="(min-width: 768px) 50vw, 100vw" />
                                <span className="soho-ploca-veo" aria-hidden="true" />
                                <span className="soho-ploca-sadrzaj">
                                    <span className="naslov naslov-3 soho-ploca-naslov">
                                        {gore && <span className="block">{gore}</span>}
                                        <span className="akcenat block">{dole}</span>
                                    </span>
                                    <span className="soho-ploca-strelica" aria-hidden="true"><Strelica sirina={60} /><Strelica sirina={60} /></span>
                                </span>
                            </Link>
                        );
                    })}
                </Kontejner>
            )}
        </section>
    );
};

/* ── Usluge: ogromni tipografski redovi, slika prati kursor (desktop) ──── */
const RedUsluge = ({ k, i }) => {
    const { tx, p } = useSajt();
    const ref = useRef(null);
    const pomeri = (e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${Math.round(e.clientX - r.left)}px`);
        el.style.setProperty('--my', `${Math.round(e.clientY - r.top)}px`);
    };
    return (
        <li className="soho-usluga-red">
            <Link ref={ref} to={`${p('cenovnik')}#${k.id}`} className="soho-usluga" onMouseMove={pomeri}>
                <span className="soho-usluga-broj">{String(i + 1).padStart(2, '0')}</span>
                <NaslovS as="h3" nivo="displej" tekst={tx(k.naziv)} auto="pocetak" className="soho-usluga-naslov" />
                <span className="soho-usluga-slika">
                    <Foto src={k.slika} alt="" okvirKlasa="soho-usluga-foto" sizes="(min-width: 1024px) 300px, 100vw" />
                </span>
            </Link>
        </li>
    );
};

export const UslugeS = () => {
    const { salon, t } = useSajt();
    if (!salon.kategorije.length) return null;
    return (
        <section className="soho-sekcija soho-usluge">
            <Kontejner>
                <Oznaka as="h2">{t.pocetna.uslugeNadnaslov}</Oznaka>
                <ul className="soho-usluge-lista">
                    {salon.kategorije.map((k, i) => <RedUsluge key={k.id} k={k} i={i} />)}
                </ul>
            </Kontejner>
        </section>
    );
};

/* ── Galerija-slajder: strelice u redu nadnaslova, mešane širine ───────── */
export const GalerijaS = () => {
    const { salon, tx, p } = useSajt();
    const T = useT();
    const slajder = useSlajder();
    const slike = salon.galerija.slice(0, 9);
    if (!slike.length) return null;
    return (
        <section className="soho-sekcija soho-galerija">
            <Kontejner className="soho-red-strelica">
                <Oznaka as="h2">{T.galerijaNadnaslov}</Oznaka>
                <Strelice slajder={slajder} kontrolise="soho-galerija-traka" />
            </Kontejner>
            <div ref={slajder.ref} id="soho-galerija-traka" className="soho-slajder skriven-skrol">
                {slike.map((g, i) => (
                    <Link key={g.slika} to={p('galerija')} className={cx('soho-slajd hover-zum', i % 3 === 1 && 'soho-slajd--sirok')}>
                        <Foto src={g.slika} alt={tx(g.opis)} okvirKlasa="soho-slajd-foto" sizes="(min-width: 768px) 55vw, 90vw" />
                    </Link>
                ))}
            </div>
            <Kontejner><Linija className="soho-linija--sekcija" /></Kontejner>
        </section>
    );
};

/* ── Tim kao „prodavnica” reference: h2 levo, pasus + dugme desno, kartice ── */
export const TimS = () => {
    const { salon, t, tx, p } = useSajt();
    const T = useT();
    const slajder = useSlajder();
    if (!salon.tim.length) return null;
    return (
        <section className="soho-sekcija soho-tim">
            <Kontejner className="soho-tim-glava">
                <div>
                    <Oznaka>{t.pocetna.timNadnaslov}</Oznaka>
                    <NaslovS nivo={2} tekst={T.timNaslov} />
                </div>
                <div className="soho-tim-tekst">
                    <p className="tekst-telo m-0">{t.tim.uvod}</p>
                    <Dugme to={p('tim')} varijanta="sekundarno" strelica={false}>{T.timDugme}</Dugme>
                </div>
            </Kontejner>
            <Kontejner><Strelice slajder={slajder} kontrolise="soho-tim-traka" className="soho-strelice--levo" /></Kontejner>
            <div ref={slajder.ref} id="soho-tim-traka" className="soho-slajder skriven-skrol">
                {salon.tim.map((r) => (
                    <Link key={r.id} to={p('tim')} className="soho-kartica">
                        <span className="soho-kartica-foto">
                            <Foto src={r.slika} alt={r.ime} okvirKlasa="soho-kartica-okvir" sizes="(min-width: 768px) 400px, 80vw" />
                            <span className="soho-kartica-sloj" aria-hidden="true"><span>{T.timVise}</span></span>
                        </span>
                        <span className="soho-kartica-ime">{r.ime}</span>
                        <span className="soho-kartica-uloga">{tx(r.uloga)}</span>
                    </Link>
                ))}
            </div>
            <Kontejner><Linija className="soho-linija--sekcija" /></Kontejner>
        </section>
    );
};

/* ── Split: slika + nadnaslov, h2, numerisana lista, dugme ─────────────── */
const Split = ({ slika, nadnaslov, naslov, stavke, dugme, ogledalo = false }) => (
    <section className={cx('soho-sekcija soho-split', ogledalo && 'soho-split--ogledalo')}>
        <Kontejner className="soho-split-mreza">
            <div className="soho-split-slika">
                <Foto src={slika} alt="" okvirKlasa="soho-split-foto" paralaksa sizes="(min-width: 768px) 50vw, 100vw" />
            </div>
            <div className="soho-split-tekst">
                <Oznaka>{nadnaslov}</Oznaka>
                {naslov}
                <ol className="soho-lista">
                    {stavke.map((s, i) => (
                        <li key={i}>
                            <span className="soho-lista-broj">{String(i + 1).padStart(2, '0')}</span>
                            <span>{s}</span>
                        </li>
                    ))}
                </ol>
                {dugme}
            </div>
        </Kontejner>
    </section>
);

export const ZastoS = () => {
    const { salon, t, tx, p } = useSajt();
    const T = useT();
    const stavke = (salon.pocetna.zastoMi ?? []).map((s) => tx(s.naslov));
    if (!stavke.length) return null;
    return (
        <Split
            slika={salon.oNama?.slika ?? salon.galerija[0]?.slika}
            nadnaslov={T.zastoNadnaslov}
            naslov={<NaslovS nivo={2} tekst={t.pocetna.zastoNaslov} akcenat={t.pocetna.zastoAkcenat} />}
            stavke={stavke}
            dugme={<Dugme to={p('oNama')} varijanta="sekundarno" strelica={false}>{T.zastoDugme}</Dugme>}
        />
    );
};

export const KoraciS = () => {
    const { salon, t } = useSajt();
    const T = useT();
    const zakazi = useZakaziLink();
    return (
        <Split
            ogledalo
            slika={salon.pocetna.hero.slike?.[1] ?? salon.galerija[1]?.slika}
            nadnaslov={T.koraciNadnaslov}
            naslov={<NaslovS nivo={2} tekst={T.koraciNaslov} />}
            stavke={t.pocetna.koraci.map((k) => k.naslov)}
            dugme={<Dugme {...zakazi} varijanta="sekundarno" strelica={false}>{t.nav.zakazi}</Dugme>}
        />
    );
};

/* ── Recenzije: naslov levo, citati desno, razdvojeni linijama ─────────── */
export const RecenzijeS = () => {
    const { salon, t, tx } = useSajt();
    const T = useT();
    const r = salon.recenzije;
    if (!r?.lista?.length) return null;
    return (
        <section className="soho-sekcija soho-recenzije">
            <Kontejner className="soho-recenzije-mreza">
                <div>
                    <Oznaka>{t.pocetna.recenzijeNadnaslov}</Oznaka>
                    <NaslovS nivo={2} tekst={T.recenzijeNaslov} />
                </div>
                <div className="soho-citati">
                    {r.lista.map((rv, i) => (
                        <figure key={i} className="soho-citat">
                            <blockquote>{T.navodi[0]}{tx(rv.tekst)}{T.navodi[1]}</blockquote>
                            <figcaption>{rv.autor}</figcaption>
                        </figure>
                    ))}
                </div>
            </Kontejner>
            <Kontejner><Linija className="soho-linija--sekcija" /></Kontejner>
        </section>
    );
};

/* ── Profesionalne linije (mreža „štampe” na referenci) ─────────────────── */
export const BrendoviS = () => {
    const { salon } = useSajt();
    const T = useT();
    if (!salon.brendovi?.length) return null;
    return (
        <section className="soho-sekcija soho-brendovi">
            <Kontejner>
                <Oznaka>{T.brendoviNadnaslov}</Oznaka>
                <NaslovS nivo={2} tekst={T.brendoviNaslov} />
                <ul className="soho-brendovi-mreza">
                    {brendoviSalona(salon).map((b) => <li key={b.naziv} className="soho-brend"><LogoBrenda brend={b} /></li>)}
                </ul>
            </Kontejner>
        </section>
    );
};

/* ── Poziv preko fotografije ────────────────────────────────────────────── */
export const PozivS = () => {
    const { salon, tx, t } = useSajt();
    const T = useT();
    const zakazi = useZakaziLink();
    const pz = salon.pocetna.poziv;
    const k = salon.kontakt;
    if (!pz) return null;
    return (
        <section className="soho-poziv">
            <Foto src={pz.slika} alt="" okvirKlasa="soho-poziv-foto" sizes="100vw" />
            <div className="soho-poziv-veo" aria-hidden="true" />
            <Kontejner className="soho-poziv-sadrzaj">
                <Oznaka centar>{T.pozivNadnaslov}</Oznaka>
                <NaslovS nivo="poziv" tekst={tx(pz.naslov)} auto="kraj" prelom />
                {tx(pz.tekst) && <p className="soho-poziv-tekst">{tx(pz.tekst)}</p>}
                <p className="soho-poziv-kontakt">
                    {k.telefon && <a href={`tel:${k.telefon}`}>{T.tel}: {k.telefonPrikaz}</a>}
                    {k.email && <a href={`mailto:${k.email}`}>{T.email}: {k.email}</a>}
                </p>
                <Dugme {...zakazi} varijanta="foto" strelica={false}>{t.nav.zakazi}</Dugme>
            </Kontejner>
        </section>
    );
};

/* ── Instagram: naslov u kurzivu, pet kvadrata ─────────────────────────── */
export const InstagramS = () => {
    const { salon, tx } = useSajt();
    const T = useT();
    const url = salon.kontakt.instagram;
    const slike = salon.galerija.slice(-5);
    if (!url || !slike.length) return null;
    const ime = url.replace(/\/+$/, '').split('/').pop();
    return (
        <section className="soho-sekcija soho-instagram">
            <Kontejner>
                <h2 className="naslov soho-instagram-naslov m-0">
                    <a href={url} target="_blank" rel="noopener noreferrer">{T.instagram} @{ime}</a>
                </h2>
            </Kontejner>
            <div className="soho-instagram-mreza skriven-skrol">
                {slike.map((g) => (
                    <a key={g.slika} href={url} target="_blank" rel="noopener noreferrer" className="soho-instagram-slika hover-zum" aria-label={`${tx(g.opis)} — Instagram`}>
                        <Foto src={g.slika} alt="" okvirKlasa="soho-instagram-okvir" sizes="(min-width: 768px) 20vw, 60vw" />
                    </a>
                ))}
            </div>
        </section>
    );
};

/* ── Linija, monogram, marquee linija pred footerom ────────────────────── */
export const MonogramS = () => {
    const { salon } = useSajt();
    return (
        <section className="soho-monogram-sekcija" aria-label={salon.naziv}>
            <Kontejner><Linija /></Kontejner>
            <p className="soho-monogram" aria-hidden="true">{monogram(salon.naziv)}</p>
            <TrakaS stavke={brendoviSalona(salon)} />
        </section>
    );
};

/* ── Zaglavlje podstranica ─────────────────────────────────────────────── */
export const ZaglavljeStraniceS = ({ nadnaslov, naslov, akcenat, uvod, slika, children, className }) => (
    <header className={cx('soho-zaglavlje', className)}>
        <Kontejner className={cx('soho-zaglavlje-mreza', slika && 'soho-zaglavlje--slika')}>
            <div>
                {nadnaslov && <Oznaka odmah>{nadnaslov}</Oznaka>}
                <NaslovS as="h1" nivo="poziv" tekst={naslov} akcenat={akcenat} auto="kraj" odmah kasnjenje={0.1} />
                {uvod && <p className="tekst-uvod soho-zaglavlje-uvod">{uvod}</p>}
                {children}
            </div>
            {slika && <Foto src={slika} alt="" okvirKlasa="soho-zaglavlje-foto" prioritet />}
        </Kontejner>
    </header>
);
