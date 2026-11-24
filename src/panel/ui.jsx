/*
 * UI KOMPLET PANELA — dugmad, kartice, pločice, tabele, polja, modal, fioka.
 * Sve boje su tokeni iz panel.css (bg-p-karta, text-p-tiho…), pa svetla i
 * tamna verzija rade bez ijedne izmene u stranicama.
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { ArrowDown, ArrowUp, ChevronLeft, ChevronsUpDown, Info, Search, X } from 'lucide-react';
import { inicijali } from './format.js';
import { javno } from '../lib/baza.js';

export const cx = (...k) => k.filter(Boolean).join(' ');

/* ── Dugme ── */
const VARIJANTE = {
    glavno: 'bg-p-akc text-p-naakc hover:bg-p-akc/90 shadow-sm',
    obicno: 'bg-p-karta text-p-ink border border-p-ivica hover:bg-p-meko',
    tiho: 'text-p-ink hover:bg-p-meko',
    opasno: 'bg-p-greska text-white hover:bg-p-greska/90',
    opasnoTiho: 'text-p-greska hover:bg-p-greskabg',
};
const VELICINE = { sm: 'h-8 px-2.5 text-[13px] gap-1.5 rounded-lg', md: 'h-10 px-3.5 text-sm gap-2 rounded-[10px]', ikona: 'h-9 w-9 justify-center rounded-lg', ikonaSm: 'h-8 w-8 justify-center rounded-lg' };

export const Dugme = React.forwardRef(({ varijanta = 'obicno', velicina = 'md', ikona: Ikona, to, href, className, children, kratko, ...o }, ref) => {
    const k = cx('inline-flex shrink-0 select-none items-center font-medium transition-colors disabled:pointer-events-none disabled:opacity-50', VARIJANTE[varijanta], VELICINE[velicina], className);
    const sadrzaj = (
        <>
            {Ikona && <Ikona className={velicina === 'sm' || velicina === 'ikonaSm' ? 'h-4 w-4' : 'h-[18px] w-[18px]'} strokeWidth={1.9} aria-hidden="true" />}
            {kratko ? <><span className="hidden sm:inline">{children}</span><span className="sm:hidden">{kratko}</span></> : children}
        </>
    );
    if (to) return <Link ref={ref} to={to} className={k} {...o}>{sadrzaj}</Link>;
    if (href) return <a ref={ref} href={href} className={k} {...o}>{sadrzaj}</a>;
    return <button ref={ref} type="button" className={k} {...o}>{sadrzaj}</button>;
});

/* ── Zaglavlje stranice ── */
export const ZaglavljeStrane = ({ naslov, opis, akcije, nazad, children }) => (
    <header className="mb-4 flex flex-col gap-3 sm:mb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
            {nazad && (
                <Link to={nazad.to} className="mb-1.5 inline-flex items-center gap-1 text-[13px] text-p-tiho hover:text-p-ink">
                    <ChevronLeft className="h-4 w-4" aria-hidden="true" /> {nazad.naziv}
                </Link>
            )}
            <h1 className="text-[22px] font-semibold leading-tight text-p-ink sm:text-[26px]">{naslov}</h1>
            {opis && <p className="mt-1 max-w-2xl text-sm text-p-tiho">{opis}</p>}
            {children}
        </div>
        {akcije && <div className="flex flex-wrap items-center gap-2">{akcije}</div>}
    </header>
);

/* ── Kartica ── */
export const Kartica = ({ naslov, opis, akcije, children, className, telo = 'p-4 sm:p-5', as: Tag = 'section', ...o }) => (
    <Tag className={cx('min-w-0 rounded-2xl border border-p-ivica bg-p-karta shadow-[0_1px_2px_rgb(0_0_0/.03)]', className)} {...o}>
        {(naslov || akcije) && (
            <div className="flex items-start justify-between gap-3 border-b border-p-ivica/70 px-4 py-3 sm:px-5">
                <div className="min-w-0">
                    {naslov && <h2 className="text-[15px] font-semibold text-p-ink">{naslov}</h2>}
                    {opis && <p className="mt-0.5 text-[13px] text-p-tiho">{opis}</p>}
                </div>
                {akcije && <div className="flex shrink-0 items-center gap-1.5">{akcije}</div>}
            </div>
        )}
        <div className={telo}>{children}</div>
    </Tag>
);

/* ── Pločica sa brojem ── */
const TONOVI_IKONE = { akc: 'bg-p-staza text-p-akc', ok: 'bg-p-okbg text-p-ok', upoz: 'bg-p-upozbg text-p-upoz', greska: 'bg-p-greskabg text-p-greska', info: 'bg-p-infobg text-p-info', tiho: 'bg-p-meko text-p-tiho' };

export const StatPlocica = ({ ikona: Ikona, oznaka, vrednost, napomena, trend, ton = 'akc', to, className, info }) => {
    const telo = (
        <>
            <div className="flex items-center justify-between gap-2">
                <span className="text-[13px] font-medium text-p-tiho">{oznaka}</span>
                {Ikona && <span className={cx('grid h-8 w-8 place-items-center rounded-lg', TONOVI_IKONE[ton])}><Ikona className="h-4 w-4" strokeWidth={2} aria-hidden="true" /></span>}
            </div>
            <div className="mt-2 text-[20px] font-semibold leading-tight tracking-tight text-p-ink tabularno sm:text-[26px] sm:leading-none">{vrednost}</div>
            <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[12.5px] text-p-tiho">
                {trend != null && Number.isFinite(trend) && (
                    <span className={cx('inline-flex items-center gap-0.5 font-medium', trend >= 0 ? 'text-p-ok' : 'text-p-greska')}>
                        {trend >= 0 ? <ArrowUp className="h-3.5 w-3.5" aria-hidden="true" /> : <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />}
                        {Math.abs(Math.round(trend * 100))}%
                    </span>
                )}
                {napomena && <span>{napomena}</span>}
                {info && <span title={info} className="inline-flex"><Info className="h-3.5 w-3.5" aria-label={info} /></span>}
            </div>
        </>
    );
    const k = cx('block min-w-0 rounded-2xl border border-p-ivica bg-p-karta p-4 shadow-[0_1px_2px_rgb(0_0_0/.03)]', to && 'transition-colors hover:border-p-akc/50', className);
    return to ? <Link to={to} className={k}>{telo}</Link> : <div className={k}>{telo}</div>;
};

/* ── Značka ── */
const ZNACKE = { ok: 'bg-p-okbg text-p-ok', upoz: 'bg-p-upozbg text-p-upoz', greska: 'bg-p-greskabg text-p-greska', info: 'bg-p-infobg text-p-info', tiho: 'bg-p-meko text-p-tiho', akc: 'bg-p-staza text-p-akc' };
export const Znacka = ({ ton = 'tiho', children, className, tacka }) => (
    <span className={cx('inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2 py-0.5 text-[12px] font-medium leading-5', ZNACKE[ton], className)}>
        {tacka && <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />}
        {children}
    </span>
);

export const STATUSI_TERMINA = {
    potvrdjen: { naziv: 'Potvrđen', ton: 'info' },
    zahtev: { naziv: 'Čeka odobrenje', ton: 'upoz' },
    zavrsen: { naziv: 'Naplaćen', ton: 'ok' },
    otkazan: { naziv: 'Otkazan', ton: 'tiho' },
    'nije-dosao': { naziv: 'Nije došao', ton: 'greska' },
};
export const StatusTermina = ({ status }) => { const s = STATUSI_TERMINA[status] ?? { naziv: status, ton: 'tiho' }; return <Znacka ton={s.ton} tacka>{s.naziv}</Znacka>; };
export const NACINI_PLACANJA = { kartica: 'Kartica', gotovina: 'Gotovina', vaucer: 'Vaučer' };

/* ── Avatar ── */
export const Avatar = ({ ime, slika, boja, velicina = 36, className }) => (
    <span className={cx('relative inline-grid shrink-0 place-items-center overflow-hidden rounded-full text-[12px] font-semibold text-white', className)} style={{ width: velicina, height: velicina, background: boja ?? 'rgb(var(--p-tiho))', fontSize: Math.max(10, velicina * 0.36) }} aria-hidden="true">
        {slika ? <img src={javno(slika)} alt="" className="h-full w-full object-cover" loading="lazy" /> : inicijali(ime)}
    </span>
);

/* ── Polja ── */
export const Polje = ({ oznaka, pomoc, children, className, id }) => (
    <label className={cx('block', className)} htmlFor={id}>
        {oznaka && <span className="mb-1.5 block text-[13px] font-medium text-p-ink">{oznaka}</span>}
        {children}
        {pomoc && <span className="mt-1 block text-[12px] text-p-tiho">{pomoc}</span>}
    </label>
);
export const Unos = React.forwardRef(({ className, ...o }, ref) => <input ref={ref} className={cx('p-polje', className)} {...o} />);
export const Izbor = ({ className, children, ...o }) => <select className={cx('p-polje', className)} {...o}>{children}</select>;
export const TekstPolje = ({ className, ...o }) => <textarea className={cx('p-polje min-h-[84px] resize-y', className)} {...o} />;

export const Pretraga = ({ vrednost, onChange, placeholder = 'Pretraga…', className, autoFocus }) => (
    <div className={cx('relative', className)}>
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-p-tiho" aria-hidden="true" />
        <input type="search" value={vrednost} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} aria-label={placeholder} autoFocus={autoFocus} className="p-polje pl-9" />
    </div>
);

export const Prekidac = ({ ukljuceno, onChange, oznaka, opis, disabled }) => (
    <div className="flex items-start justify-between gap-4 py-3">
        <div className="min-w-0">
            <div className="text-sm font-medium text-p-ink">{oznaka}</div>
            {opis && <div className="mt-0.5 text-[13px] text-p-tiho">{opis}</div>}
        </div>
        <button type="button" role="switch" aria-checked={!!ukljuceno} aria-label={oznaka} disabled={disabled} onClick={() => onChange(!ukljuceno)}
            className={cx('relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors disabled:opacity-50', ukljuceno ? 'bg-p-akc' : 'bg-p-polje/60')}>
            <span className={cx('absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-[left]', ukljuceno ? 'left-[22px]' : 'left-0.5')} />
        </button>
    </div>
);

/* ── Tabovi (segmentirani izbor) ── */
export const Tabovi = ({ stavke, aktivan, onChange, className, mali }) => (
    <div role="tablist" className={cx('inline-flex max-w-full overflow-x-auto rounded-xl border border-p-ivica bg-p-meko p-1 p-skrol', className)}>
        {stavke.map((s) => (
            <button key={s.id} type="button" role="tab" aria-selected={aktivan === s.id} onClick={() => onChange(s.id)}
                className={cx('inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-lg font-medium transition-colors', mali ? 'px-2.5 py-1 text-[12.5px]' : 'px-3 py-1.5 text-[13px]', aktivan === s.id ? 'bg-p-karta text-p-ink shadow-sm' : 'text-p-tiho hover:text-p-ink')}>
                {s.naziv}
                {s.broj != null && <span className={cx('rounded-full px-1.5 text-[11px] leading-[18px] tabularno', aktivan === s.id ? 'bg-p-staza text-p-akc' : 'bg-p-karta/70')}>{s.broj}</span>}
            </button>
        ))}
    </div>
);

/* ── Prazno stanje ── */
export const Prazno = ({ ikona: Ikona, naslov, opis, akcija, className }) => (
    <div className={cx('flex flex-col items-center px-4 py-10 text-center', className)}>
        {Ikona && <span className="mb-3 grid h-11 w-11 place-items-center rounded-full bg-p-meko text-p-tiho"><Ikona className="h-5 w-5" aria-hidden="true" /></span>}
        <div className="text-sm font-semibold text-p-ink">{naslov}</div>
        {opis && <p className="mt-1 max-w-sm text-[13px] text-p-tiho">{opis}</p>}
        {akcija && <div className="mt-4">{akcija}</div>}
    </div>
);

/* ── Merač (traka napretka) ── */
export const Merac = ({ vrednost, ton = 'graf', className, oznaka }) => (
    <div className={cx('h-2 w-full overflow-hidden rounded-full bg-p-staza', className)} role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(vrednost * 100)} aria-label={oznaka}>
        <div className={cx('h-full rounded-full', ton === 'graf' ? 'bg-p-graf' : ton === 'ok' ? 'bg-p-ok' : ton === 'upoz' ? 'bg-p-upoz' : 'bg-p-greska')} style={{ width: `${Math.max(0, Math.min(1, vrednost)) * 100}%` }} />
    </div>
);

/* ── Tabela sa sortiranjem i „Prikaži još” ── */
export function Tabela({ kolone, redovi, kljucReda = (r) => r.id, onRed, prazno, pocetnoSort, poStrani = 25, className, gusto }) {
    const [sort, setSort] = useState(pocetnoSort ?? null);
    const [koliko, setKoliko] = useState(poStrani);
    useEffect(() => setKoliko(poStrani), [redovi, poStrani]);
    const sortirano = useMemo(() => {
        if (!sort) return redovi;
        const kol = kolone.find((k) => k.kljuc === sort.kljuc);
        const v = kol?.sortVrednost ?? ((r) => r[sort.kljuc]);
        return [...redovi].sort((a, b) => { const x = v(a); const y = v(b); const c = typeof x === 'string' ? x.localeCompare(y, 'sr') : (x ?? 0) - (y ?? 0); return sort.smer === 'opadajuce' ? -c : c; });
    }, [redovi, sort, kolone]);
    const prikazano = sortirano.slice(0, koliko);
    const klikSort = (k) => setSort((s) => (s?.kljuc === k ? { kljuc: k, smer: s.smer === 'rastuce' ? 'opadajuce' : 'rastuce' } : { kljuc: k, smer: 'opadajuce' }));

    if (!redovi.length) return prazno ?? <Prazno naslov="Nema podataka" />;
    return (
        <div className={className}>
            <div className="overflow-x-auto p-skrol">
                <table className="w-full min-w-[640px] border-collapse text-left text-sm">
                    <thead>
                        <tr className="border-b border-p-ivica">
                            {kolone.map((k) => (
                                <th key={k.kljuc} scope="col" className={cx('whitespace-nowrap px-3 py-2.5 text-[12px] font-medium uppercase tracking-[.04em] text-p-tiho first:pl-4 last:pr-4 sm:first:pl-5 sm:last:pr-5', k.desno && 'text-right', k.className)}>
                                    {k.sort !== false && k.naslov ? (
                                        <button type="button" onClick={() => klikSort(k.kljuc)} className={cx('inline-flex items-center gap-1 uppercase hover:text-p-ink', k.desno && 'flex-row-reverse')}>
                                            {k.naslov}
                                            {sort?.kljuc === k.kljuc ? (sort.smer === 'rastuce' ? <ArrowUp className="h-3 w-3" aria-hidden="true" /> : <ArrowDown className="h-3 w-3" aria-hidden="true" />) : <ChevronsUpDown className="h-3 w-3 opacity-40" aria-hidden="true" />}
                                        </button>
                                    ) : k.naslov}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {prikazano.map((r) => (
                            <tr key={kljucReda(r)} onClick={onRed ? () => onRed(r) : undefined} className={cx('border-b border-p-ivica/60 last:border-0', onRed && 'cursor-pointer hover:bg-p-meko/60')}>
                                {kolone.map((k) => (
                                    <td key={k.kljuc} className={cx('px-3 first:pl-4 last:pr-4 sm:first:pl-5 sm:last:pr-5', gusto ? 'py-2' : 'py-3', k.desno && 'whitespace-nowrap text-right tabularno', k.className)}>
                                        {k.render ? k.render(r) : r[k.kljuc]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {sortirano.length > koliko && (
                <div className="border-t border-p-ivica/60 p-3 text-center">
                    <Dugme varijanta="tiho" velicina="sm" onClick={() => setKoliko((k) => k + poStrani)}>Prikaži još ({sortirano.length - koliko})</Dugme>
                </div>
            )}
        </div>
    );
}

/* ── Modal i fioka (portal u body, Esc zatvara, fokus ostaje unutra) ── */
const useZatvaranje = (otvoren, onClose) => {
    const ref = useRef(null);
    // onClose u ref-u: stranice često daju novu funkciju na svaki render, a efekat
    // ne sme da se ponovi (vratio bi fokus na prvo polje usred kucanja).
    const zatvori = useRef(onClose);
    zatvori.current = onClose;
    useEffect(() => {
        if (!otvoren) return undefined;
        const prethodni = document.activeElement;
        const esc = (e) => { if (e.key === 'Escape') zatvori.current?.(); };
        document.addEventListener('keydown', esc);
        document.documentElement.style.overflow = 'hidden';
        requestAnimationFrame(() => ref.current?.querySelector('input:not([type=hidden]), select, textarea, button[data-fokus]')?.focus());
        return () => { document.removeEventListener('keydown', esc); document.documentElement.style.overflow = ''; prethodni?.focus?.(); };
    }, [otvoren]);
    return ref;
};

export function Modal({ otvoren, onClose, naslov, opis, children, podnozje, sirina = 'max-w-lg' }) {
    const ref = useZatvaranje(otvoren, onClose);
    if (!otvoren) return null;
    return createPortal(
        <div className="panel-koren fixed inset-0 z-[200] flex items-end justify-center sm:items-center sm:p-4">
            <div className="p-anim-veo absolute inset-0 bg-black/45" onClick={onClose} aria-hidden="true" />
            <div ref={ref} role="dialog" aria-modal="true" aria-label={naslov} className={cx('p-anim-modal relative flex max-h-[92svh] w-full flex-col rounded-t-2xl border border-p-ivica bg-p-karta text-p-ink shadow-2xl sm:rounded-2xl', sirina)}>
                <div className="flex items-start justify-between gap-3 border-b border-p-ivica px-5 py-4">
                    <div><h2 className="text-base font-semibold">{naslov}</h2>{opis && <p className="mt-0.5 text-[13px] text-p-tiho">{opis}</p>}</div>
                    <Dugme varijanta="tiho" velicina="ikonaSm" onClick={onClose} aria-label="Zatvori" ikona={X} />
                </div>
                <div className="overflow-y-auto px-5 py-4 p-skrol">{children}</div>
                {podnozje && <div className="flex flex-wrap justify-end gap-2 border-t border-p-ivica px-5 py-3 pb-[max(.75rem,env(safe-area-inset-bottom))]">{podnozje}</div>}
            </div>
        </div>,
        document.body,
    );
}

export function Fioka({ otvoren, onClose, naslov, podnaslov, children, podnozje, sirina = 'sm:max-w-md' }) {
    const ref = useZatvaranje(otvoren, onClose);
    if (!otvoren) return null;
    return createPortal(
        <div className="panel-koren fixed inset-0 z-[200] flex justify-end">
            <div className="p-anim-veo absolute inset-0 bg-black/40" onClick={onClose} aria-hidden="true" />
            <aside ref={ref} role="dialog" aria-modal="true" aria-label={naslov} className={cx('p-anim-fioka relative flex h-full w-full flex-col border-l border-p-ivica bg-p-karta text-p-ink shadow-2xl', sirina)}>
                <div className="flex items-start justify-between gap-3 border-b border-p-ivica px-5 py-4">
                    <div className="min-w-0"><h2 className="truncate text-base font-semibold">{naslov}</h2>{podnaslov && <div className="mt-0.5 text-[13px] text-p-tiho">{podnaslov}</div>}</div>
                    <Dugme varijanta="tiho" velicina="ikonaSm" onClick={onClose} aria-label="Zatvori" ikona={X} />
                </div>
                <div className="flex-1 overflow-y-auto px-5 py-4 p-skrol">{children}</div>
                {podnozje && <div className="flex flex-wrap justify-end gap-2 border-t border-p-ivica px-5 py-3 pb-[max(.75rem,env(safe-area-inset-bottom))]">{podnozje}</div>}
            </aside>
        </div>,
        document.body,
    );
}

/** Red „oznaka — vrednost” u detaljima (fioka, kartica). */
export const RedDetalja = ({ oznaka, children }) => (
    <div className="flex items-start justify-between gap-4 border-b border-p-ivica/60 py-2.5 text-sm last:border-0">
        <span className="shrink-0 text-p-tiho">{oznaka}</span>
        <span className="min-w-0 text-right font-medium text-p-ink">{children}</span>
    </div>
);

/** Mreža pločica: 2 kolone na telefonu, 4 na desktopu. */
export const MrezaPlocica = ({ children, className }) => <div className={cx('grid grid-cols-2 gap-3 lg:grid-cols-4', className)}>{children}</div>;
