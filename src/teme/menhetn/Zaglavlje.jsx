/*
 * Naslov podstranica u temi „menhetn”: isti ritam kao zaglavlja sekcija na
 * početnoj — tri kolone (nadnaslov | h1 | uvod), poravnate po vrhu, ispod
 * maslinastog headera. Bez animacije ulaza (referenca je nema).
 */
import React from 'react';
import { Foto, Kontejner, Naslov, cx } from '../../components/primitivi.jsx';

export default function ZaglavljeStraniceMenhetn({ nadnaslov, naslov, akcenat, uvod, slika, children, className }) {
    return (
        <header className={cx('mh-zaglavlje', className)}>
            <Kontejner className="grid items-start gap-y-4 pb-10 md:grid-cols-[228fr_496fr_416fr] md:gap-y-0 md:pb-[70px]">
                <p className="nadnaslov mh-blag m-0">{nadnaslov}</p>
                <div className="md:pr-10">
                    <Naslov as="h1" nivo={1} tekst={naslov} akcenat={akcenat} animiraj={false} />
                </div>
                {(uvod || children) && (
                    <div className="mt-2 md:mt-[6px]">
                        {uvod && <p className="tekst-telo mh-blag m-0">{uvod}</p>}
                        {children}
                    </div>
                )}
            </Kontejner>
            {slika && (
                <Kontejner className="pb-10 md:pb-[70px]">
                    <Foto src={slika} alt="" okvirKlasa="aspect-[16/7]" prioritet />
                </Kontejner>
            )}
        </header>
    );
}
