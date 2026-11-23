/*
 * Naslov podstranica teme „holivud”: oznaka (Helvetica 12 px, 2 px), h1 u
 * ručno crtanom fontu, uvod 14 px verzal. Header je u toku stranice (lepljiv),
 * pa zaglavlje ima samo ritam sekcije iznad sebe.
 */
import React from 'react';
import { Foto, Kontejner, Nadnaslov, Naslov, Pojava, cx } from '../../components/primitivi.jsx';

export default function ZaglavljeStranice({ nadnaslov, naslov, akcenat, uvod, slika, children, className }) {
    return (
        <header className={cx('hv-zaglavlje', className)}>
            <Kontejner className={cx('grid gap-10', slika && 'lg:grid-cols-12 lg:items-end')}>
                <div className={slika ? 'lg:col-span-7' : 'max-w-4xl'}>
                    {nadnaslov && <Nadnaslov className="ulaz-odmah mb-4 !opacity-100">{nadnaslov}</Nadnaslov>}
                    <Naslov as="h1" nivo={1} tekst={naslov} akcenat={akcenat} odmah />
                    {uvod && <Pojava as="p" className="tekst-uvod m-0 mt-5 max-w-2xl">{uvod}</Pojava>}
                    {children}
                </div>
                {slika && (
                    <Pojava className="lg:col-span-5">
                        <Foto src={slika} alt="" okvirKlasa="aspect-[4/3]" prioritet />
                    </Pojava>
                )}
            </Kontejner>
        </header>
    );
}
