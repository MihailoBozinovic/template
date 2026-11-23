import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Gift, Star } from 'lucide-react';
import { useSajt } from '../kontekst/Sajt.jsx';
import { cena } from '../lib/format.js';
import { Dugme, Foto, Kontejner, LinkStrelica, Nadnaslov, Naslov, Pojava, Sekcija, cx } from '../components/primitivi.jsx';
import { useZakaziLink } from '../components/Header.jsx';
import { Marquee } from '../components/delovi.jsx';

/** Najniža cena u kategoriji („od 1.600 RSD”). */
const najnizaCena = (k) => Math.min(...k.usluge.map((u) => u.cena));

/* ── Izjava i brojevi ─────────────────────────────────────────────────── */
export const Izjava = () => {
    const { salon, tx } = useSajt();
    const brojevi = (salon.pocetna.brojevi ?? []).map((b) => ({
        ...b,
        vrednost: b.vrednost === 'godine' ? String(new Date().getFullYear() - salon.osnovan) : b.vrednost,
    }));
    return (
        <Sekcija>
            <Kontejner>
                <Naslov as="p" nivo={2} tekst={tx(salon.pocetna.izjava)} className="max-w-5xl" />
                {brojevi.length > 0 && (
                    <dl className="m-0 mt-16 grid gap-10 border-t pt-10 sm:grid-cols-3" style={{ borderColor: 'rgb(var(--c-linija) / .15)' }}>
                        {brojevi.map((b, i) => (
                            <Pojava key={i} i={i}>
                                <dd className="naslov naslov-1 m-0">{b.vrednost}</dd>
                                <dt className="nadnaslov mt-3 opacity-70">{tx(b.oznaka)}</dt>
                            </Pojava>
                        ))}
                    </dl>
                )}
            </Kontejner>
        </Sekcija>
    );
};

/* ── Zaglavlje sekcije: nadnaslov levo, naslov, opcioni tekst i link desno ── */
export const ZaglavljeSekcije = ({ nadnaslov, naslov, akcenat, uvod, link, className, centar = false }) => (
    <div className={cx('mb-12 grid gap-6 md:mb-16', centar ? 'justify-items-center text-center' : 'md:grid-cols-12 md:items-end', className)}>
        <div className={centar ? 'max-w-3xl' : 'md:col-span-7'}>
            {nadnaslov && <Nadnaslov className="mb-4">{nadnaslov}</Nadnaslov>}
            <Naslov nivo={2} tekst={naslov} akcenat={akcenat} />
        </div>
        {(uvod || link) && (
            <Pojava className={cx('space-y-5', centar ? 'max-w-2xl' : 'md:col-span-5 md:col-start-8')}>
                {uvod && <p className="tekst-telo m-0 opacity-75">{uvod}</p>}
                {link}
            </Pojava>
        )}
    </div>
);

/* ── Usluge — četiri rasporeda, bira tema ─────────────────────────────── */
export const Usluge = () => {
    const { salon, t, tx, p, tema, jezik } = useSajt();
    const kat = salon.kategorije;
    const za = (k) => `${p('cenovnik')}#${k.id}`;
    const od = (k) => `${t.opste.od} ${cena(najnizaCena(k), jezik)}`;
    const zaglavlje = (
        <ZaglavljeSekcije
            nadnaslov={t.pocetna.uslugeNadnaslov}
            naslov={t.pocetna.uslugeNaslov}
            akcenat={t.pocetna.uslugeAkcenat}
            uvod={t.pocetna.uslugeUvod}
            centar={tema.id === 'hjuston'}
            link={<LinkStrelica to={p('cenovnik')}>{t.pocetna.cenovnikDugme}</LinkStrelica>}
        />
    );

    // Visoke kartice: naslov gore levo, pill dole (Yukie Natori)
    if (tema.usluge === 'visoke-kartice') {
        return (
            <Sekcija>
                <Kontejner>
                    {zaglavlje}
                    <div className="skriven-skrol -mx-5 flex snap-x gap-4 overflow-x-auto px-5 md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:px-0">
                        {kat.map((k, i) => (
                            <Pojava key={k.id} i={i} className="w-[78vw] shrink-0 snap-start md:w-auto">
                                <Link to={za(k)} className="hover-zum group relative block aspect-[3/4] overflow-hidden text-white" style={{ borderRadius: 'var(--r-kartica)' }}>
                                    <Foto src={k.slika} alt={tx(k.naziv)} okvirKlasa="!absolute inset-0" sizes="(min-width: 768px) 33vw, 78vw" />
                                    <span className="veo-dole absolute inset-0" aria-hidden="true" />
                                    <span className="absolute inset-x-6 top-6 naslov naslov-2">{tx(k.naziv)}</span>
                                    <span className="absolute bottom-6 left-6 inline-flex items-center gap-3 rounded-full bg-white/15 py-1.5 pl-4 pr-1.5 text-sm backdrop-blur-md">
                                        {od(k)}
                                        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white text-brand transition-transform duration-300 group-hover:-rotate-45"><ArrowRight size={16} /></span>
                                    </span>
                                </Link>
                            </Pojava>
                        ))}
                    </div>
                </Kontejner>
            </Sekcija>
        );
    }

    // Pločice: kvadrati sa natpisom preko fotografije (Fabio Doti, 901, Upper Hand, Noar)
    if (tema.usluge === 'plocice') {
        // Kolone po broju kategorija, da nijedan red ne ostane sa jednom pločicom (5 → 5, 3/6 → 3…).
        const plocice = kat.slice(0, 8);
        const n = plocice.length;
        const kolone = n === 5 ? 'lg:grid-cols-5' : n === 3 || n === 6 ? 'lg:grid-cols-3' : n <= 2 ? 'lg:grid-cols-2' : 'lg:grid-cols-4';
        return (
            <Sekcija className={tema.id === 'noar' ? '' : 'bg-mist'}>
                <Kontejner>
                    {zaglavlje}
                    <div className={cx('grid grid-cols-2 gap-2 md:gap-3', kolone)}>
                        {plocice.map((k, i) => (
                            // Neparan broj na telefonu (2 kolone): poslednja pločica ide preko cele širine.
                            <Pojava key={k.id} i={i} className={n % 2 === 1 && i === n - 1 ? 'col-span-2 lg:col-span-1' : undefined}>
                                <Link to={za(k)} className={cx('hover-zum group relative block overflow-hidden text-white', n % 2 === 1 && i === n - 1 ? 'aspect-[2/1] lg:aspect-square' : 'aspect-square')}>
                                    <Foto src={k.slika} alt={tx(k.naziv)} okvirKlasa="!absolute inset-0" sizes="(min-width: 1024px) 25vw, 50vw" />
                                    <span className="absolute inset-0 bg-black/40 transition-colors group-hover:bg-black/55" style={{ transitionDuration: 'var(--t-srednje)' }} aria-hidden="true" />
                                    <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4 text-center">
                                        <span className="naslov naslov-3">{tx(k.naziv)}</span>
                                        <span className="nadnaslov opacity-0 transition-opacity group-hover:opacity-90" style={{ transitionDuration: 'var(--t-srednje)' }}>{od(k)}</span>
                                    </span>
                                </Link>
                            </Pojava>
                        ))}
                    </div>
                </Kontejner>
            </Sekcija>
        );
    }

    // Lista: urednički spisak sa rednim brojem i cenom (Palm Sunday, Barrow)
    if (tema.usluge === 'lista') {
        return (
            <Sekcija>
                <Kontejner>
                    {zaglavlje}
                    <ul className="grupa-linkova m-0 list-none border-t p-0" style={{ borderColor: 'rgb(var(--c-linija) / .9)' }}>
                        {kat.map((k, i) => (
                            <Pojava as="li" key={k.id} i={i} className="border-b" style={{ borderColor: 'rgb(var(--c-linija) / .18)' }}>
                                <Link to={za(k)} className="link-nav group grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-4 py-7 md:grid-cols-[4rem_1fr_1fr_auto] md:py-9">
                                    <span className="nadnaslov opacity-60">{String(i + 1).padStart(2, '0')}</span>
                                    <span className="naslov naslov-2">{tx(k.naziv)}</span>
                                    <span className="tekst-telo hidden opacity-70 md:block">{tx(k.opis)}</span>
                                    <span className="nadnaslov inline-flex items-center gap-3 whitespace-nowrap">
                                        {od(k)}
                                        <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                                    </span>
                                </Link>
                            </Pojava>
                        ))}
                    </ul>
                </Kontejner>
            </Sekcija>
        );
    }

    // Kartice: fotografija, ispod naziv, opis i cena (Salon 64, Fringe)
    return (
        <Sekcija>
            <Kontejner>
                {zaglavlje}
                <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                    {kat.map((k, i) => (
                        <Pojava key={k.id} i={i % 3}>
                            <Link to={za(k)} className="hover-zum group block">
                                <Foto src={k.slika} alt={tx(k.naziv)} okvirKlasa="aspect-[4/5]" paralaksa={i % 2 === 1} />
                                <div className="mt-5 flex items-baseline justify-between gap-4">
                                    <h3 className="naslov naslov-3 m-0">{tx(k.naziv)}</h3>
                                    <span className="nadnaslov whitespace-nowrap opacity-70">{od(k)}</span>
                                </div>
                                <p className="tekst-telo m-0 mt-2 opacity-70">{tx(k.opis)}</p>
                            </Link>
                        </Pojava>
                    ))}
                </div>
            </Kontejner>
        </Sekcija>
    );
};

/* ── Traka galerije (horizontalni niz) ────────────────────────────────── */
export const GalerijaTraka = () => {
    const { salon, t, tx, p } = useSajt();
    const slike = salon.galerija.slice(0, 8);
    if (!slike.length) return null;
    return (
        <Sekcija className="overflow-hidden">
            <Kontejner>
                <ZaglavljeSekcije
                    nadnaslov={t.pocetna.galerijaNadnaslov}
                    naslov={t.pocetna.galerijaNaslov}
                    link={<LinkStrelica to={p('galerija')}>{t.opste.pogledajSve}</LinkStrelica>}
                />
            </Kontejner>
            <div className="skriven-skrol flex snap-x gap-3 overflow-x-auto px-5 md:gap-4 md:px-10">
                {slike.map((g, i) => (
                    <Pojava key={g.slika} i={i} className="w-[68vw] shrink-0 snap-start sm:w-[42vw] lg:w-[24vw]">
                        <Link to={p('galerija')} className="hover-zum block">
                            <Foto src={g.slika} alt={tx(g.opis)} okvirKlasa={i % 2 ? 'aspect-[4/5]' : 'aspect-[3/4]'} sizes="(min-width: 1024px) 24vw, (min-width: 640px) 42vw, 68vw" />
                        </Link>
                    </Pojava>
                ))}
            </div>
        </Sekcija>
    );
};

/* ── Tim (pregled) ────────────────────────────────────────────────────── */
export const TimPregled = () => {
    const { salon, t, tx, p } = useSajt();
    if (!salon.tim.length) return null;
    return (
        <Sekcija className="bg-mist">
            <Kontejner>
                <ZaglavljeSekcije nadnaslov={t.pocetna.timNadnaslov} naslov={t.pocetna.timNaslov} link={<LinkStrelica to={p('tim')}>{t.opste.pogledajSve}</LinkStrelica>} />
                <div className="grid grid-cols-2 gap-x-4 gap-y-10 md:gap-x-6 lg:grid-cols-4">
                    {salon.tim.map((r, i) => (
                        <Pojava key={r.id} i={i}>
                            <Link to={p('tim')} className="hover-zum block">
                                <Foto src={r.slika} alt={r.ime} okvirKlasa="aspect-[4/5]" sizes="(min-width: 1024px) 25vw, 50vw" />
                                <p className="naslov naslov-3 m-0 mt-4">{r.ime}</p>
                                <p className="nadnaslov m-0 mt-1.5 opacity-70">{tx(r.uloga)}</p>
                            </Link>
                        </Pojava>
                    ))}
                </div>
            </Kontejner>
        </Sekcija>
    );
};

/* ── Zašto mi + koraci zakazivanja ────────────────────────────────────── */
export const ZastoMi = () => {
    const { salon, t, tx } = useSajt();
    const zakazi = useZakaziLink();
    const stavke = salon.pocetna.zastoMi ?? [];
    return (
        <Sekcija>
            <Kontejner>
                <ZaglavljeSekcije nadnaslov={t.pocetna.zastoNadnaslov} naslov={t.pocetna.zastoNaslov} akcenat={t.pocetna.zastoAkcenat} />
                {stavke.length > 0 && (
                    <div className="grid gap-10 md:grid-cols-3">
                        {stavke.map((s, i) => (
                            <Pojava key={i} i={i} className="border-t pt-6" style={{ borderColor: 'rgb(var(--c-linija) / .2)' }}>
                                <p className="nadnaslov m-0 mb-4 opacity-60">{String(i + 1).padStart(2, '0')}</p>
                                <h3 className="naslov naslov-3 m-0">{tx(s.naslov)}</h3>
                                <p className="tekst-telo m-0 mt-3 opacity-75">{tx(s.tekst)}</p>
                            </Pojava>
                        ))}
                    </div>
                )}
                <div className="kartica mt-20 grid gap-8 p-8 md:grid-cols-12 md:p-12">
                    <div className="md:col-span-4">
                        <Naslov nivo={3} tekst={t.pocetna.koraciNaslov} />
                        <Dugme {...zakazi} className="mt-8">{t.nav.zakazi}</Dugme>
                    </div>
                    <ol className="m-0 grid list-none gap-8 p-0 md:col-span-8 md:grid-cols-3">
                        {t.pocetna.koraci.map((k, i) => (
                            <Pojava as="li" key={i} i={i}>
                                <span className="naslov naslov-2 block text-brand">{i + 1}</span>
                                <p className="m-0 mt-3 font-medium">{k.naslov}</p>
                                <p className="m-0 mt-2 text-sm leading-relaxed opacity-70">{k.tekst}</p>
                            </Pojava>
                        ))}
                    </ol>
                </div>
            </Kontejner>
        </Sekcija>
    );
};

/* ── Recenzije ────────────────────────────────────────────────────────── */
export const Recenzije = () => {
    const { salon, t, tx, tema } = useSajt();
    const r = salon.recenzije;
    if (!r?.lista?.length) return null;
    const centar = ['hjuston', 'volstrit', 'holivud'].includes(tema.id);
    return (
        <Sekcija className="border-t" style={{ borderColor: 'rgb(var(--c-linija) / .12)' }}>
            <Kontejner>
                <ZaglavljeSekcije
                    nadnaslov={t.pocetna.recenzijeNadnaslov}
                    naslov={t.pocetna.recenzijeNaslov}
                    centar={centar}
                    uvod={r.prosek ? `${t.opste.ocena(String(r.prosek).replace('.', ','), r.broj)} · ${r.izvor}` : null}
                    link={salon.kontakt.googleRecenzija ? <LinkStrelica href={salon.kontakt.googleRecenzija} target="_blank" rel="noopener noreferrer">Google</LinkStrelica> : null}
                />
                <div className="grid gap-6 md:grid-cols-3">
                    {r.lista.map((rv, i) => (
                        <Pojava as="figure" key={i} i={i} className={cx('kartica m-0 flex flex-col p-8', centar && 'text-center')}>
                            <span className={cx('flex gap-1 text-brand', centar && 'justify-center')} aria-label={`${rv.ocena}/5`}>
                                {Array.from({ length: rv.ocena }, (_, k) => <Star key={k} size={15} fill="currentColor" strokeWidth={0} />)}
                            </span>
                            <blockquote className="naslov m-0 mt-6 flex-1 text-[1.35rem] leading-snug" style={{ textTransform: 'none' }}>„{tx(rv.tekst)}”</blockquote>
                            <figcaption className="nadnaslov mt-6 opacity-70">{rv.autor}</figcaption>
                        </Pojava>
                    ))}
                </div>
            </Kontejner>
        </Sekcija>
    );
};

/* ── Brendovi (marquee, kao „As seen in” traka) ───────────────────────── */
export const Brendovi = () => {
    const { salon, t } = useSajt();
    if (!salon.brendovi?.length) return null;
    return (
        <section className="border-y py-10 md:py-14" style={{ borderColor: 'rgb(var(--c-linija) / .12)' }}>
            <p className="nadnaslov m-0 mb-6 text-center opacity-60">{t.pocetna.brendoviNaslov}</p>
            <Marquee stavke={salon.brendovi} className="naslov text-2xl md:text-4xl" />
        </section>
    );
};

/* ── Poklon vaučer ────────────────────────────────────────────────────── */
export const Vaucer = () => {
    const { salon, t, tx } = useSajt();
    const tekst = tx(salon.poklonVaucer?.tekst);
    if (!tekst) return null;
    const k = salon.kontakt;
    const href = k.whatsapp ? `https://wa.me/${k.whatsapp}?text=${encodeURIComponent(t.pocetna.vaucerNaslov)}` : `tel:${k.telefon}`;
    return (
        <Sekcija className="!py-0">
            <Kontejner>
                <Pojava className="flex flex-col items-start gap-6 p-8 md:flex-row md:items-center md:justify-between md:p-12" style={{ background: 'rgb(var(--c-akcenat) / .35)', borderRadius: 'var(--r-kartica)' }}>
                    <div className="flex items-start gap-5">
                        <Gift size={28} strokeWidth={1.25} className="mt-1 shrink-0" aria-hidden="true" />
                        <div>
                            <Nadnaslov className="mb-2">{t.pocetna.vaucerNadnaslov}</Nadnaslov>
                            <h2 className="naslov naslov-3 m-0">{t.pocetna.vaucerNaslov}</h2>
                            <p className="tekst-telo m-0 mt-2 max-w-2xl opacity-80">{tekst}</p>
                        </div>
                    </div>
                    <Dugme href={href} varijanta="sekundarno" target={k.whatsapp ? '_blank' : undefined} rel="noopener noreferrer">{t.pocetna.vaucerDugme}</Dugme>
                </Pojava>
            </Kontejner>
        </Sekcija>
    );
};

/* ── Završni poziv preko fotografije ──────────────────────────────────── */
export const ZavrsniPoziv = () => {
    const { salon, tx, t } = useSajt();
    const zakazi = useZakaziLink();
    const pz = salon.pocetna.poziv;
    if (!pz) return null;
    return (
        <section className="relative mt-20 flex min-h-[70svh] items-center overflow-hidden bg-tamna text-white md:mt-28">
            <Foto src={pz.slika} alt="" okvirKlasa="!absolute inset-0 !rounded-none" paralaksa sizes="100vw" />
            <div className="veo-ravan absolute inset-0" aria-hidden="true" />
            <Kontejner className="na-foto relative py-24 text-center">
                <Naslov nivo={1} tekst={tx(pz.naslov)} className="mx-auto max-w-3xl" />
                <Pojava as="p" className="tekst-uvod mx-auto m-0 mt-6 max-w-xl opacity-90">{tx(pz.tekst)}</Pojava>
                <Pojava className="mt-10 flex justify-center"><Dugme {...zakazi} varijanta="foto">{t.nav.zakazi}</Dugme></Pojava>
            </Kontejner>
        </section>
    );
};
