/*
 * GALERIJA — fotografije radova koje sajt prikazuje na stranici Galerija.
 * Redosled ovde je redosled na sajtu; „Na sajtu” sklanja sliku bez brisanja.
 *
 * Demo: nova fotografija sa računara se prikazuje preko URL.createObjectURL —
 * postoji samo do osvežavanja stranice (pravi panel je šalje na server).
 */
import React, { useMemo, useRef, useState } from 'react';
import { ArrowDown, ArrowUp, Eye, EyeOff, ImageOff, ImagePlus, Images, Pencil, Trash2, Upload } from 'lucide-react';
import { usePanel, useDozvole } from '../podaci/Skladiste.jsx';
import { javno } from '../../lib/baza.js';
import { Dugme, Izbor, Modal, Polje, Prazno, Prekidac, Tabovi, Unos, ZaglavljeStrane, Znacka, cx } from '../ui.jsx';

const SLIKE_SAJTA = [
    ...Array.from({ length: 9 }, (_, i) => `/slike/galerija-0${i + 1}.webp`),
    '/slike/hero-1.webp', '/slike/hero-2.webp', '/slike/hero-3.webp', '/slike/o-nama.webp', '/slike/poziv.webp',
    '/slike/usluga-zensko.webp', '/slike/usluga-boja.webp', '/slike/usluga-berbernica.webp', '/slike/usluga-nega.webp', '/slike/usluga-deca.webp',
];

function Slika({ src, alt, className }) {
    const [greska, setGreska] = useState(false);
    if (greska) return <div className={cx('grid place-items-center bg-p-meko text-center text-[12px] text-p-tiho', className)}><span className="px-3"><ImageOff className="mx-auto mb-1 h-5 w-5" aria-hidden="true" />Privremena slika — nestala posle osvežavanja</span></div>;
    return <img src={javno(src)} alt={alt} loading="lazy" className={cx('object-cover', className)} onError={() => setGreska(true)} />;
}

function FormaSlike({ stavka, kategorije, onClose }) {
    const { dodaj, izmeni, noviId, obavesti, zapisi } = usePanel();
    const nova = !stavka;
    const [slika, setSlika] = useState(stavka?.slika ?? '');
    const [privremeno, setPrivremeno] = useState(!!stavka?.privremeno);
    const [opis, setOpis] = useState(stavka?.opis ?? '');
    const [kategorija, setKategorija] = useState(stavka?.kategorija ?? '');
    const [izvor, setIzvor] = useState('racunar');
    const fajl = useRef(null);

    const izaberiFajl = (e) => {
        const f = e.target.files?.[0];
        if (!f) return;
        if (!f.type.startsWith('image/')) { obavesti('Izaberite fotografiju (JPG, PNG, WebP).', 'greska'); return; }
        setSlika(URL.createObjectURL(f));
        setPrivremeno(true);
        if (!opis) setOpis(f.name.replace(/\.[^.]+$/, '').replace(/[-_]+/g, ' '));
    };
    const sacuvaj = () => {
        if (!slika) return;
        if (nova) {
            dodaj('galerija', { id: noviId('g'), slika, kategorija, opis: opis.trim(), naSajtu: true, ...(privremeno ? { privremeno: true } : {}) });
            zapisi('sajt', 'Dodao fotografiju u galeriju', opis.trim());
            obavesti(privremeno ? 'Fotografija je dodata — u demu ostaje samo do osvežavanja.' : 'Fotografija je dodata u galeriju.');
        } else {
            izmeni('galerija', stavka.id, { opis: opis.trim(), kategorija });
            zapisi('sajt', 'Izmenio opis fotografije', opis.trim());
            obavesti('Sačuvano.');
        }
        onClose();
    };

    return (
        <Modal otvoren onClose={onClose} naslov={nova ? 'Dodaj fotografiju' : 'Izmena fotografije'} sirina={nova ? 'max-w-2xl' : 'max-w-lg'}
            podnozje={<><Dugme onClick={onClose}>Odustani</Dugme><Dugme varijanta="glavno" disabled={!slika} onClick={sacuvaj}>{nova ? 'Dodaj u galeriju' : 'Sačuvaj'}</Dugme></>}>
            <div className="space-y-4">
                {nova && (
                    <>
                        <Tabovi stavke={[{ id: 'racunar', naziv: 'Sa računara' }, { id: 'sajt', naziv: 'Sa sajta' }]} aktivan={izvor} onChange={setIzvor} />
                        {izvor === 'racunar' ? (
                            <div>
                                <input ref={fajl} type="file" accept="image/*" className="sr-only" onChange={izaberiFajl} aria-label="Izaberite fotografiju" />
                                <button type="button" onClick={() => fajl.current?.click()} className="flex w-full flex-col items-center gap-2 rounded-2xl border-2 border-dashed border-p-ivica px-4 py-8 text-center hover:border-p-akc/60">
                                    <Upload className="h-6 w-6 text-p-tiho" aria-hidden="true" />
                                    <span className="text-sm font-medium">Izaberite fotografiju</span>
                                    <span className="text-[12.5px] text-p-tiho">Uspravna 4:5 izgleda najbolje · JPG, PNG ili WebP</span>
                                </button>
                                <p className="mt-2 text-[12.5px] text-p-upoz">Demo: fotografija se prikazuje samo u ovom browseru i nestaje posle osvežavanja stranice.</p>
                            </div>
                        ) : (
                            <div className="grid max-h-[300px] grid-cols-4 gap-2 overflow-y-auto p-skrol sm:grid-cols-5">
                                {SLIKE_SAJTA.map((s) => (
                                    <button key={s} type="button" onClick={() => { setSlika(s); setPrivremeno(false); }} aria-label={s} aria-pressed={slika === s}
                                        className={cx('overflow-hidden rounded-lg ring-offset-2 ring-offset-p-karta', slika === s ? 'ring-2 ring-p-akc' : 'opacity-85 hover:opacity-100')}>
                                        <img src={javno(s)} alt="" loading="lazy" className="aspect-[4/5] w-full object-cover" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </>
                )}
                <div className={cx('grid gap-4', slika && 'sm:grid-cols-[120px_minmax(0,1fr)]')}>
                    {slika && <Slika src={slika} alt="" className="aspect-[4/5] w-full rounded-xl" />}
                    <div className="space-y-4">
                        <Polje oznaka="Opis" pomoc="Kratko: šta je urađeno. Ide i u alt tekst za Google.">
                            <Unos value={opis} onChange={(e) => setOpis(e.target.value)} placeholder="npr. Balayage u toplim tonovima" />
                        </Polje>
                        <Polje oznaka="Kategorija" pomoc="Za filter na stranici Galerija.">
                            <Izbor value={kategorija} onChange={(e) => setKategorija(e.target.value)}>
                                <option value="">Bez kategorije (salon, atmosfera)</option>
                                {kategorije.map((k) => <option key={k.id} value={k.id}>{k.naziv}</option>)}
                            </Izbor>
                        </Polje>
                    </div>
                </div>
            </div>
        </Modal>
    );
}

export default function Galerija() {
    const { podaci, izmeni, obrisi, postavi, obavesti, zapisi } = usePanel();
    const { podesavanja: moze } = useDozvole();
    const [filter, setFilter] = useState('sve');
    const [forma, setForma] = useState(null); // null | 'nova' | stavka
    const [brisanje, setBrisanje] = useState(null);
    const lista = podaci.galerija;
    const katIndeks = useMemo(() => Object.fromEntries(podaci.kategorije.map((k) => [k.id, k])), [podaci.kategorije]);

    const tabovi = useMemo(() => {
        const ids = [...new Set(lista.map((g) => g.kategorija || ''))];
        return [
            { id: 'sve', naziv: 'Sve', broj: lista.length },
            ...podaci.kategorije.filter((k) => ids.includes(k.id)).map((k) => ({ id: k.id, naziv: k.naziv, broj: lista.filter((g) => g.kategorija === k.id).length })),
            ...(ids.includes('') ? [{ id: '', naziv: 'Salon', broj: lista.filter((g) => !g.kategorija).length }] : []),
        ];
    }, [lista, podaci.kategorije]);
    const aktivanFilter = tabovi.some((t) => t.id === filter) ? filter : 'sve';
    const prikaz = aktivanFilter === 'sve' ? lista : lista.filter((g) => (g.kategorija || '') === aktivanFilter);
    const naSajtu = lista.filter((g) => g.naSajtu).length;

    const pomeri = (g, smer) => {
        const i = prikaz.indexOf(g);
        const sused = prikaz[i + smer];
        if (!sused) return;
        const a = lista.indexOf(g); const b = lista.indexOf(sused);
        const novo = [...lista];
        [novo[a], novo[b]] = [novo[b], novo[a]];
        postavi('galerija', novo);
    };

    return (
        <div className="flex flex-col gap-4">
            <ZaglavljeStrane naslov="Galerija" opis={`${lista.length} fotografija · ${naSajtu} na sajtu. Redosled ovde je redosled na sajtu.`}
                akcije={moze && <Dugme varijanta="glavno" ikona={ImagePlus} onClick={() => setForma('nova')} kratko="Dodaj">Dodaj fotografiju</Dugme>} />
            {tabovi.length > 2 && <Tabovi stavke={tabovi} aktivan={aktivanFilter} onChange={setFilter} className="self-start" />}

            {prikaz.length ? (
                <ul className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-4">
                    {prikaz.map((g, i) => (
                        <li key={g.id} className={cx('group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-p-ivica bg-p-karta shadow-[0_1px_2px_rgb(0_0_0/.03)]', !g.naSajtu && 'opacity-70')}>
                            <div className="relative p-2 pb-0">
                                <Slika src={g.slika} alt={g.opis} className={cx('aspect-[4/5] w-full rounded-xl', !g.naSajtu && 'grayscale')} />
                                <div className="absolute left-4 top-4 flex flex-wrap gap-1">
                                    <Znacka ton="tiho" className="bg-p-karta/90 shadow-sm backdrop-blur">{katIndeks[g.kategorija]?.naziv ?? 'Salon'}</Znacka>
                                    {g.privremeno && <Znacka ton="upoz" className="shadow-sm">demo</Znacka>}
                                </div>
                                {!g.naSajtu && <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-p-karta/90 px-2 py-0.5 text-[11.5px] font-medium text-p-tiho shadow-sm"><EyeOff className="h-3 w-3" aria-hidden="true" />skriveno</span>}
                            </div>
                            <div className="flex flex-1 flex-col px-3 pb-2 pt-2.5">
                                <p className="line-clamp-2 min-h-[2.5em] text-[13px] leading-[1.25em]">{g.opis || <span className="text-p-tiho">Bez opisa</span>}</p>
                                <div className="-my-1.5">
                                    <Prekidac oznaka="Na sajtu" ukljuceno={g.naSajtu} disabled={!moze} onChange={(v) => {
                                        izmeni('galerija', g.id, { naSajtu: v });
                                        zapisi('sajt', v ? 'Prikazao fotografiju na sajtu' : 'Sklonio fotografiju sa sajta', g.opis);
                                        obavesti(v ? 'Fotografija se prikazuje na sajtu.' : 'Fotografija je sklonjena sa sajta.', v ? 'ok' : 'info');
                                    }} />
                                </div>
                                {moze && (
                                    <div className="mt-auto flex items-center justify-between gap-1 border-t border-p-ivica/70 pt-1.5">
                                        <div className="flex">
                                            <Dugme varijanta="tiho" velicina="ikonaSm" ikona={ArrowUp} aria-label="Pomeri napred" title="Pomeri napred" disabled={i === 0} onClick={() => pomeri(g, -1)} />
                                            <Dugme varijanta="tiho" velicina="ikonaSm" ikona={ArrowDown} aria-label="Pomeri nazad" title="Pomeri nazad" disabled={i === prikaz.length - 1} onClick={() => pomeri(g, 1)} />
                                        </div>
                                        <div className="flex">
                                            <Dugme varijanta="tiho" velicina="ikonaSm" ikona={Pencil} aria-label="Izmeni" title="Izmeni" onClick={() => setForma(g)} />
                                            <Dugme varijanta="opasnoTiho" velicina="ikonaSm" ikona={Trash2} aria-label="Obriši" title="Obriši" onClick={() => setBrisanje(g)} />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="rounded-2xl border border-p-ivica bg-p-karta"><Prazno ikona={Images} naslov="Galerija je prazna" opis="Dodajte prve fotografije radova." akcija={moze && <Dugme varijanta="glavno" ikona={ImagePlus} onClick={() => setForma('nova')}>Dodaj fotografiju</Dugme>} /></div>
            )}

            <p className="flex items-center gap-2 text-[12.5px] text-p-tiho"><Eye className="h-4 w-4" aria-hidden="true" />U produkciji su fotografije u public/slike/, a spisak u src/config/salon.js (galerija). Najbolje izgledaju uspravne 4:5, bar 1280 px.</p>

            {forma && <FormaSlike key={forma === 'nova' ? 'nova' : forma.id} stavka={forma === 'nova' ? null : forma} kategorije={podaci.kategorije} onClose={() => setForma(null)} />}
            <Modal otvoren={!!brisanje} onClose={() => setBrisanje(null)} naslov="Obrisati fotografiju?" opis={brisanje?.opis}
                podnozje={<><Dugme onClick={() => setBrisanje(null)}>Odustani</Dugme><Dugme varijanta="opasno" data-fokus onClick={() => { obrisi('galerija', brisanje.id); zapisi('sajt', 'Obrisao fotografiju iz galerije', brisanje.opis); obavesti('Fotografija je obrisana.', 'info'); setBrisanje(null); }}>Obriši</Dugme></>}>
                {brisanje && (
                    <div className="flex gap-3">
                        <Slika src={brisanje.slika} alt="" className="aspect-[4/5] w-20 shrink-0 rounded-lg" />
                        <p className="text-sm text-p-tiho">Fotografija nestaje sa sajta i iz panela. Ako hoćete samo da je sakrijete, isključite „Na sajtu”.</p>
                    </div>
                )}
            </Modal>
        </div>
    );
}
