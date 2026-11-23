/*
 * Hero teme „istsajd”: fotografija (ili video, kad salon.pocetna.hero.video
 * postoji) preko cele širine, ISPOD belog headera. Visina calc(100svh − 90px) na
 * desktopu, 16:9 na telefonu. U sredini h1, kratak podnaslov i koral pilula.
 * Bez nadnaslova i bez slajdera sa trakom — slike se samo tiho pretapaju.
 */
import React from 'react';
import { useSajt } from '../../kontekst/Sajt.jsx';
import { Dugme, Naslov } from '../../components/primitivi.jsx';
import { useZakaziLink } from '../../components/Header.jsx';
import { HeroSlajdovi } from '../../sekcije/Hero.jsx';
import { javno } from '../../lib/baza.js';

export default function HeroIst() {
    const { salon, t, tx } = useSajt();
    const h = salon.pocetna.hero;
    const zakazi = useZakaziLink();
    const slike = h.slike?.length ? h.slike : [''];
    const naslov = [tx(h.naslov), tx(h.akcenat)].filter(Boolean).join(' ');

    return (
        <section className="ist-hero relative flex items-center justify-center overflow-hidden bg-tamna text-white">
            {h.video ? (
                <video className="absolute inset-0 h-full w-full object-cover" src={javno(h.video)} poster={slike[0] ? javno(slike[0]) : undefined} autoPlay muted loop playsInline aria-hidden="true" />
            ) : (
                <HeroSlajdovi slike={slike} alt={tx(salon.slogan)} />
            )}
            <div className="ist-hero-veo absolute inset-0 z-[2]" aria-hidden="true" />
            <div className="na-foto relative z-[3] flex max-w-[1100px] flex-col items-center px-4 text-center">
                <Naslov as="h1" nivo="hero" tekst={naslov} odmah />
                <p className="ist-hero-pod ulaz-odmah m-0">{tx(salon.slogan)}</p>
                <div className="ulaz-odmah ist-hero-dugme">
                    <Dugme {...zakazi}>{t.nav.zakazi}</Dugme>
                </div>
            </div>
        </section>
    );
}
