import React from 'react';
import { useSajt } from '../kontekst/Sajt.jsx';
import { Foto, Kontejner, LinkStrelica, Pojava, Sekcija, IkonaInstagram } from '../components/primitivi.jsx';
import ZaglavljeStranice from '../components/ZaglavljeStranice.jsx';
import { useZakaziLink } from '../components/Header.jsx';

export default function Tim() {
    const { salon, t, tx, p } = useSajt();
    const zakazi = useZakaziLink();
    return (
        <>
            <ZaglavljeStranice nadnaslov={t.tim.nadnaslov} naslov={t.tim.naslov} uvod={t.tim.uvod} />
            <Sekcija className="!pt-4">
                <Kontejner className="grid gap-x-6 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
                    {salon.tim.map((r, i) => (
                        <Pojava as="article" key={r.id} i={i % 3}>
                            <Foto src={r.slika} alt={r.ime} okvirKlasa="aspect-[4/5]" paralaksa={i % 3 === 1} />
                            <div className="mt-6 flex items-start justify-between gap-4">
                                <div>
                                    <h2 className="naslov naslov-3 m-0">{r.ime}</h2>
                                    <p className="nadnaslov m-0 mt-2 opacity-70">{tx(r.uloga)}</p>
                                </div>
                                {r.instagram && (
                                    <a href={r.instagram} target="_blank" rel="noopener noreferrer" aria-label={`Instagram — ${r.ime}`} className="opacity-70 hover:opacity-100">
                                        <IkonaInstagram size={20} />
                                    </a>
                                )}
                            </div>
                            {r.opis && <p className="tekst-telo m-0 mt-4 opacity-75">{tx(r.opis)}</p>}
                            <div className="mt-5">
                                {zakazi.to ? (
                                    <LinkStrelica to={`${p('zakazivanje')}?stilista=${r.id}`}>{t.tim.zakaziKod(r.ime.split(' ')[0])}</LinkStrelica>
                                ) : (
                                    <LinkStrelica href={zakazi.href} target="_blank" rel="noopener noreferrer">{t.nav.zakazi}</LinkStrelica>
                                )}
                            </div>
                        </Pojava>
                    ))}
                </Kontejner>
            </Sekcija>
        </>
    );
}
