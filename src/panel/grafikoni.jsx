/*
 * GRAFIKONI PANELA — ručno crtan SVG, bez biblioteke.
 *
 * Jedna nijansa (zlato, --p-graf) za veličinu, staza --p-staza za pozadinu,
 * tekst uvek u bojama teksta. Svaki grafikon ima tooltip na prelazu mišem
 * (ili dodirom), a pored grafikona stranica daje i tabelu ili brojeve.
 * Kategorijske boje (najviše 3 serije) su provereni redosled plava/narandžasta/
 * tirkizna za svetlu i tamnu podlogu.
 */
import React, { useEffect, useRef, useState } from 'react';
import { cx } from './ui.jsx';

export const SERIJE = ['#2a78d6', '#eb6834', '#1baf7a'];
export const SERIJE_TAMNO = ['#3987e5', '#d95926', '#199e70'];
export const bojaSerije = (i) => (typeof document !== 'undefined' && document.documentElement.classList.contains('tamno') ? SERIJE_TAMNO : SERIJE)[i % 3];

const useSirina = () => {
    const ref = useRef(null);
    const [s, setS] = useState(600);
    useEffect(() => {
        if (!ref.current) return undefined;
        const ro = new ResizeObserver(([e]) => setS(Math.max(200, e.contentRect.width)));
        ro.observe(ref.current);
        return () => ro.disconnect();
    }, []);
    return [ref, s];
};

/** „Lepi” korak ose: 1, 2, 2.5, 5 × 10^n. */
const korakOse = (max, n = 4) => {
    if (max <= 0) return 1;
    const sirov = max / n;
    const e = 10 ** Math.floor(Math.log10(sirov));
    return [1, 2, 2.5, 5, 10].map((k) => k * e).find((k) => k >= sirov) ?? e * 10;
};

/** Leva margina po najdužoj oznaci ose (11px font ≈ 6.4px po znaku). */
const levaMargina = (vrh, korak, format) => {
    let n = 0;
    for (let v = 0; v <= vrh + 1e-9; v += korak) n = Math.max(n, String(format(v)).length);
    return Math.max(28, Math.ceil(n * 6.4) + 14);
};

const Tooltip = ({ x, y, sirina, children }) => {
    if (x == null) return null;
    const levo = x > sirina - 150;
    return <div className="p-tooltip" style={{ left: levo ? undefined : x + 12, right: levo ? sirina - x + 12 : undefined, top: Math.max(0, y - 10) }}>{children}</div>;
};

/**
 * Trend kroz vreme (površina + linija). tacke: [{ oznaka, vrednost, opis? }].
 * `poredjenje` (opciono): ista dužina, prethodni period — tanka isprekidana linija.
 */
export function TrendGrafikon({ tacke, poredjenje, visina = 220, format = String, formatOse = format, oznakaSerije = 'Ovaj period', oznakaPoredjenja = 'Prethodni period' }) {
    const [ref, sirina] = useSirina();
    const [hover, setHover] = useState(null);
    const max = Math.max(1, ...tacke.map((t) => t.vrednost), ...(poredjenje ?? []).map((t) => t.vrednost));
    const korak = korakOse(max);
    const vrh = Math.ceil(max / korak) * korak;
    const L = levaMargina(vrh, korak, formatOse); const R = 12; const T = 12; const B = 26;
    const w = sirina - L - R; const h = visina - T - B;
    const x = (i) => L + (tacke.length < 2 ? w / 2 : (i / (tacke.length - 1)) * w);
    const y = (v) => T + h - (v / vrh) * h;
    const linija = (niz) => niz.map((t, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(t.vrednost).toFixed(1)}`).join('');
    const povrsina = `${linija(tacke)}L${x(tacke.length - 1)},${T + h}L${x(0)},${T + h}Z`;
    const svakaN = Math.max(1, Math.ceil(tacke.length / Math.max(2, Math.floor(w / 64))));
    const pomeri = (e) => {
        const box = e.currentTarget.getBoundingClientRect();
        const px = (e.touches?.[0]?.clientX ?? e.clientX) - box.left;
        const i = Math.round(((px - L) / w) * (tacke.length - 1));
        setHover(Math.max(0, Math.min(tacke.length - 1, i)));
    };
    const t = hover != null ? tacke[hover] : null;
    return (
        <div ref={ref} className="relative select-none">
            <svg width={sirina} height={visina} role="img" aria-label={`${oznakaSerije}: ${tacke.map((q) => `${q.oznaka} ${format(q.vrednost)}`).join(', ')}`} onMouseMove={pomeri} onMouseLeave={() => setHover(null)} onTouchStart={pomeri} onTouchMove={pomeri}>
                <defs>
                    <linearGradient id="p-trend-fill" x1="0" x2="0" y1="0" y2="1">
                        <stop offset="0%" stopColor="rgb(var(--p-graf))" stopOpacity=".22" />
                        <stop offset="100%" stopColor="rgb(var(--p-graf))" stopOpacity="0" />
                    </linearGradient>
                </defs>
                {Array.from({ length: Math.round(vrh / korak) + 1 }, (_, i) => i * korak).map((v) => (
                    <g key={v}>
                        <line x1={L} x2={L + w} y1={y(v)} y2={y(v)} stroke="rgb(var(--p-ivica))" strokeDasharray={v ? '3 4' : undefined} />
                        <text x={L - 8} y={y(v)} dy=".32em" textAnchor="end" fontSize="11" fill="rgb(var(--p-tiho))">{formatOse(v)}</text>
                    </g>
                ))}
                {tacke.map((q, i) => ((i % svakaN === 0 && tacke.length - 1 - i >= svakaN * 0.7) || i === tacke.length - 1) && (
                    <text key={i} x={x(i)} y={visina - 6} textAnchor={i === 0 ? 'start' : i === tacke.length - 1 ? 'end' : 'middle'} fontSize="11" fill="rgb(var(--p-tiho))">{q.oznaka}</text>
                ))}
                <path d={povrsina} fill="url(#p-trend-fill)" />
                {poredjenje && <path d={linija(poredjenje)} fill="none" stroke="rgb(var(--p-tiho))" strokeOpacity=".55" strokeWidth="1.5" strokeDasharray="4 4" />}
                <path d={linija(tacke)} fill="none" stroke="rgb(var(--p-graf))" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
                {t && (
                    <g>
                        <line x1={x(hover)} x2={x(hover)} y1={T} y2={T + h} stroke="rgb(var(--p-tiho))" strokeOpacity=".4" />
                        <circle cx={x(hover)} cy={y(t.vrednost)} r="5" fill="rgb(var(--p-graf))" stroke="rgb(var(--p-karta))" strokeWidth="2" />
                    </g>
                )}
            </svg>
            {t && (
                <Tooltip x={x(hover)} y={y(t.vrednost)} sirina={sirina}>
                    <div className="font-medium">{t.opis ?? t.oznaka}</div>
                    <div>{oznakaSerije}: <b>{format(t.vrednost)}</b></div>
                    {poredjenje?.[hover] && <div className="opacity-75">{oznakaPoredjenja}: {format(poredjenje[hover].vrednost)}</div>}
                </Tooltip>
            )}
            {poredjenje && (
                <div className="mt-1 flex flex-wrap gap-4 text-[12px] text-p-tiho">
                    <span className="inline-flex items-center gap-1.5"><span className="h-0.5 w-4 rounded bg-p-graf" />{oznakaSerije}</span>
                    <span className="inline-flex items-center gap-1.5"><span className="h-0 w-4 border-t-[1.5px] border-dashed border-p-tiho/70" />{oznakaPoredjenja}</span>
                </div>
            )}
        </div>
    );
}

/** Uspravni stubići. stavke: [{ oznaka, vrednost, opis?, istaknut? }]. */
export function Stubici({ stavke, visina = 200, format = String, formatOse = format, oznakaSerije = '' }) {
    const [ref, sirina] = useSirina();
    const [hover, setHover] = useState(null);
    const max = Math.max(1, ...stavke.map((s) => s.vrednost));
    const korak = korakOse(max);
    const vrh = Math.ceil(max / korak) * korak;
    const L = levaMargina(vrh, korak, formatOse); const R = 6; const T = 10; const B = 24;
    const w = sirina - L - R; const h = visina - T - B;
    const sl = w / stavke.length;
    const bw = Math.max(4, Math.min(40, sl - 2));
    const y = (v) => T + h - (v / vrh) * h;
    const svakaN = Math.max(1, Math.ceil(stavke.length / Math.max(2, Math.floor(w / 44))));
    const s = hover != null ? stavke[hover] : null;
    return (
        <div ref={ref} className="relative select-none">
            <svg width={sirina} height={visina} role="img" aria-label={stavke.map((q) => `${q.oznaka} ${format(q.vrednost)}`).join(', ')} onMouseLeave={() => setHover(null)}>
                {Array.from({ length: Math.round(vrh / korak) + 1 }, (_, i) => i * korak).map((v) => (
                    <g key={v}>
                        <line x1={L} x2={L + w} y1={y(v)} y2={y(v)} stroke="rgb(var(--p-ivica))" strokeDasharray={v ? '3 4' : undefined} />
                        <text x={L - 8} y={y(v)} dy=".32em" textAnchor="end" fontSize="11" fill="rgb(var(--p-tiho))">{formatOse(v)}</text>
                    </g>
                ))}
                {stavke.map((q, i) => {
                    const cx0 = L + sl * i + sl / 2;
                    const bh = Math.max(q.vrednost > 0 ? 2 : 0, (q.vrednost / vrh) * h);
                    const r = Math.min(4, bw / 2, bh);
                    const x0 = cx0 - bw / 2; const y0 = T + h - bh;
                    return (
                        <g key={i} onMouseEnter={() => setHover(i)} onTouchStart={() => setHover(i)}>
                            <rect x={L + sl * i} y={T} width={sl} height={h} fill="transparent" />
                            <path d={`M${x0},${T + h}V${y0 + r}Q${x0},${y0} ${x0 + r},${y0}H${x0 + bw - r}Q${x0 + bw},${y0} ${x0 + bw},${y0 + r}V${T + h}Z`}
                                fill="rgb(var(--p-graf))" fillOpacity={hover == null || hover === i ? (q.istaknut === false ? 0.45 : 1) : 0.45} />
                            {(i % svakaN === 0) && <text x={cx0} y={visina - 6} textAnchor="middle" fontSize="11" fill="rgb(var(--p-tiho))">{q.oznaka}</text>}
                        </g>
                    );
                })}
            </svg>
            {s && (
                <Tooltip x={L + sl * hover + sl / 2} y={y(s.vrednost)} sirina={sirina}>
                    <div className="font-medium">{s.opis ?? s.oznaka}</div>
                    <div>{oznakaSerije ? `${oznakaSerije}: ` : ''}<b>{format(s.vrednost)}</b></div>
                </Tooltip>
            )}
        </div>
    );
}

/** Vodoravni stubići sa nazivom i brojem (rang lista). stavke: [{ oznaka, vrednost, dodatak? }]. */
export function RangLista({ stavke, format = String, max: zadatiMax }) {
    const max = zadatiMax ?? Math.max(1, ...stavke.map((s) => s.vrednost));
    return (
        <ul className="space-y-3">
            {stavke.map((s) => (
                <li key={s.oznaka} title={`${s.oznaka}: ${format(s.vrednost)}`}>
                    <div className="mb-1 flex items-baseline justify-between gap-3 text-[13px]">
                        <span className="min-w-0 truncate font-medium text-p-ink">{s.oznaka}</span>
                        <span className="shrink-0 text-p-tiho tabularno"><b className="font-semibold text-p-ink">{format(s.vrednost)}</b>{s.dodatak ? ` · ${s.dodatak}` : ''}</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-p-staza"><div className="h-full rounded-full bg-p-graf" style={{ width: `${(s.vrednost / max) * 100}%` }} /></div>
                </li>
            ))}
        </ul>
    );
}

/**
 * Toplotna mapa (popunjenost): redovi × kolone, vrednost 0..1 → jedna nijansa,
 * od staze do pune zlatne. Prazna polja (null) su šrafirana: salon ne radi.
 */
export function ToplotnaMapa({ redovi, kolone, vrednost, opis, oznakaKolone = (k) => k }) {
    const [hover, setHover] = useState(null);
    return (
        <div className="relative overflow-x-auto p-skrol">
            <table className="w-full min-w-[560px] border-separate" style={{ borderSpacing: 2 }} onMouseLeave={() => setHover(null)}>
                <thead>
                    <tr>
                        <th className="w-12" />
                        {kolone.map((k, i) => <th key={k} scope="col" className="pb-1 text-center text-[11px] font-normal text-p-tiho">{i % 2 === 0 ? oznakaKolone(k) : ''}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {redovi.map((r) => (
                        <tr key={r}>
                            <th scope="row" className="pr-2 text-left text-[12px] font-medium text-p-tiho">{r}</th>
                            {kolone.map((k) => {
                                const v = vrednost(r, k);
                                const tekst = opis?.(r, k, v);
                                return (
                                    <td key={k} onMouseEnter={() => setHover({ r, k, tekst })} title={tekst}
                                        className={cx('h-7 rounded-[4px]', v == null && 'bg-[repeating-linear-gradient(135deg,rgb(var(--p-ivica))_0_2px,transparent_2px_6px)]')}
                                        style={v == null ? undefined : { background: v <= 0.001 ? 'rgb(var(--p-staza))' : `rgb(var(--p-graf) / ${0.15 + v * 0.85})` }} />
                                );
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-[12px] text-p-tiho">
                <div className="flex items-center gap-2">
                    <span>0%</span>
                    <span className="h-2.5 w-32 rounded-full" style={{ background: 'linear-gradient(90deg, rgb(var(--p-staza)), rgb(var(--p-graf)))' }} />
                    <span>100%</span>
                    <span className="ml-3 inline-flex items-center gap-1.5"><span className="h-2.5 w-4 rounded-sm bg-[repeating-linear-gradient(135deg,rgb(var(--p-ivica))_0_2px,transparent_2px_6px)]" /> ne radi</span>
                </div>
                {hover?.tekst && <span className="font-medium text-p-ink">{hover.tekst}</span>}
            </div>
        </div>
    );
}

/** Naslagana traka (npr. način plaćanja): delovi [{ oznaka, vrednost }], do 3 boje, sa legendom. */
export function NaslaganaTraka({ delovi, format = String }) {
    const ukupno = delovi.reduce((s, d) => s + d.vrednost, 0) || 1;
    return (
        <div>
            <div className="flex h-3 w-full gap-[2px] overflow-hidden rounded-full">
                {delovi.filter((d) => d.vrednost > 0).map((d) => (
                    <div key={d.oznaka} title={`${d.oznaka}: ${format(d.vrednost)}`} style={{ width: `${(d.vrednost / ukupno) * 100}%`, background: bojaSerije(delovi.indexOf(d)) }} />
                ))}
            </div>
            <ul className="mt-3 space-y-1.5">
                {delovi.map((d, i) => (
                    <li key={d.oznaka} className="flex items-center justify-between gap-3 text-[13px]">
                        <span className="inline-flex items-center gap-2 text-p-ink"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: bojaSerije(i) }} />{d.oznaka}</span>
                        <span className="text-p-tiho tabularno"><b className="font-semibold text-p-ink">{format(d.vrednost)}</b> · {Math.round((d.vrednost / ukupno) * 100)}%</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

/** Mala linija bez osa, za pločice. */
export function Iskra({ vrednosti, visina = 36, sirina = 120 }) {
    const max = Math.max(1, ...vrednosti);
    const d = vrednosti.map((v, i) => `${i ? 'L' : 'M'}${((i / Math.max(1, vrednosti.length - 1)) * sirina).toFixed(1)},${(visina - 2 - (v / max) * (visina - 4)).toFixed(1)}`).join('');
    return <svg width={sirina} height={visina} aria-hidden="true"><path d={d} fill="none" stroke="rgb(var(--p-graf))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>;
}
