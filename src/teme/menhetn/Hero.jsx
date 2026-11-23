/*
 * Hero teme „menhetn” (`hero: 'ispod-headera'`): počinje ispod maslinastog
 * headera, 100svh − header na desktopu, 90svh na telefonu. Tekst je levo na
 * ivici kontejnera i vertikalno centriran: h1 → jedno dugme → paragraf.
 * Slideshow: pretapanje 2,5 s, smena na 3 s + 2,5 s, Ken Burns 1 → 1.3 za 20 s
 * linearno, bez pauze i bez kontrola.
 */
import React, { useEffect, useState } from 'react';
import { useSajt } from '../../kontekst/Sajt.jsx';
import { Dugme, Foto, Kontejner, Naslov, cx } from '../../components/primitivi.jsx';
import { useZakaziLink } from '../../components/Header.jsx';

export const SlajdoviMenhetn = ({ slike, alt }) => {
    const { tema } = useSajt();
    const pk = tema.pokret;
    const korak = (pk.heroInterval ?? 3000) + (pk.heroPrelaz ?? 2500);
    const [aktivan, setAktivan] = useState(0);
    // Zum kreće tek posle prvog iscrtavanja (CSS prelaz, kao Elementor Ken Burns).
    const [kreni, setKreni] = useState(false);

    useEffect(() => {
        const id = setTimeout(() => setKreni(true), 60);
        return () => clearTimeout(id);
    }, []);

    useEffect(() => {
        if (slike.length < 2) return undefined;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
        const id = setTimeout(() => setAktivan((a) => (a + 1) % slike.length), korak);
        return () => clearTimeout(id);
    }, [aktivan, slike.length, korak]);

    return (
        <div className="absolute inset-0 overflow-hidden" style={{ '--hero-zum': pk.heroZum ?? 1.3 }}>
            {slike.map((s, i) => (
                <div key={s || i} className={cx('slajd mh-slajd', i === aktivan && 'aktivan', kreni && i === aktivan && 'zumira')} aria-hidden={i !== aktivan}>
                    <Foto src={s} alt={i === 0 ? alt : ''} prioritet={i === 0} okvirKlasa="!absolute inset-0" sizes="100vw" />
                </div>
            ))}
        </div>
    );
};

export default function HeroMenhetn() {
    const { salon, t, tx } = useSajt();
    const h = salon.pocetna.hero;
    const zakazi = useZakaziLink();
    const slike = h.slike?.length ? h.slike : [''];
    return (
        <section className="mh-hero relative flex items-center overflow-hidden bg-tamna text-white">
            <SlajdoviMenhetn slike={slike} alt={tx(salon.slogan)} />
            <div className="mh-hero-veo absolute inset-0 z-[2]" aria-hidden="true" />
            <Kontejner className="na-foto relative z-[3] py-16">
                <Naslov as="h1" nivo="hero" tekst={tx(h.naslov)} akcenat={tx(h.akcenat)} animiraj={false} className="max-w-[620px]" />
                <div className="mt-10">
                    <Dugme {...zakazi}>{t.nav.zakazi}</Dugme>
                </div>
                <p className="tekst-uvod m-0 mt-[84px] max-w-[375px] md:mt-[90px]">{tx(h.uvod)}</p>
            </Kontejner>
        </section>
    );
}
