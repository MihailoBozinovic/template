import React, { useEffect, useState } from 'react';
import { Check, LayoutDashboard, Palette, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { useSajt } from '../kontekst/Sajt.jsx';
import { kljucIzPutanje } from '../i18n/jezici.js';
import { TEME } from '../config/teme.js';
import { idTemeSajta, sacuvajUKonfiguraciju } from '../lib/tema.js';
import { cx } from './primitivi.jsx';
import { BAZA } from '../lib/baza.js';

/*
 * BIRAČ TEMA — jedan klik menja ceo izgled sajta (boje, fontove, raspored,
 * animacije), bez ponovnog učitavanja. Vidi se samo dok je `demo: true` ili u
 * `npm run dev`; na pravom sajtu ga nema.
 *
 * U `npm run dev` dugme „Postavi kao temu sajta” upisuje izbor u salon.js.
 * Na objavljenom demo sajtu izbor važi u tom browseru, a link sa ?tema=…
 * pokazuje klijentu tačno tu temu.
 */
export default function BiracTema() {
    const { t, tema, postaviTemu } = useSajt();
    // Na zakazivanju je na telefonu traka sa dugmetom na dnu — birač ide iznad nje.
    const naZakazivanju = kljucIzPutanje(useLocation().pathname) === 'zakazivanje';
    const [otvoren, setOtvoren] = useState(false);
    const [poruka, setPoruka] = useState('');
    const [temaSajta, setTemaSajta] = useState(idTemeSajta());
    const dev = Boolean(import.meta.env?.DEV);

    useEffect(() => {
        if (!otvoren) return undefined;
        const esc = (e) => e.key === 'Escape' && setOtvoren(false);
        window.addEventListener('keydown', esc);
        return () => window.removeEventListener('keydown', esc);
    }, [otvoren]);

    useEffect(() => setPoruka(''), [tema.id]);

    const sacuvaj = async () => {
        try {
            await sacuvajUKonfiguraciju(tema.id);
            setTemaSajta(tema.id);
            setPoruka(t.tema.sacuvano);
        } catch (e) {
            setPoruka(String(e.message || e));
        }
    };

    return (
        <div data-izuzmi-kontrast className={cx('fixed z-[60] font-[Inter,system-ui,sans-serif] text-[#1d1d1f]', naZakazivanju ? 'bottom-4 left-4 hidden lg:block' : 'bottom-4 left-4')} style={{ letterSpacing: 0, textTransform: 'none' }}>
            {otvoren && (
                <div
                    role="dialog"
                    aria-label={t.tema.naslov}
                    className="mb-3 w-[min(92vw,380px)] overflow-hidden rounded-2xl border border-black/10 bg-white/95 shadow-2xl backdrop-blur-xl"
                    style={{ animation: 'fade-up .35s cubic-bezier(.22,1,.36,1) both' }}
                >
                    <div className="flex items-start justify-between gap-3 border-b border-black/10 px-4 py-3">
                        <div>
                            <p className="m-0 text-sm font-semibold">{t.tema.naslov}</p>
                            <p className="m-0 text-xs text-black/55">{t.tema.podnaslov}</p>
                        </div>
                        <button type="button" onClick={() => setOtvoren(false)} aria-label={t.opste.zatvori} className="rounded-full p-1.5 hover:bg-black/5">
                            <X size={16} />
                        </button>
                    </div>
                    <ul className="m-0 max-h-[56vh] list-none space-y-1 overflow-y-auto p-2">
                        {Object.entries(TEME).map(([id, tm]) => {
                            const aktivna = tema.id === id;
                            return (
                                <li key={id}>
                                    <button
                                        type="button"
                                        onClick={() => postaviTemu(id)}
                                        aria-pressed={aktivna}
                                        className={cx('flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors', aktivna ? 'bg-black/[0.06]' : 'hover:bg-black/[0.035]')}
                                    >
                                        <span className="flex shrink-0 overflow-hidden rounded-md border border-black/10" aria-hidden="true">
                                            {[tm.boje.paper, tm.boje.ink, tm.boje.brand, tm.boje.akcenat].map((b, i) => (
                                                <span key={i} className="h-9 w-3.5" style={{ background: b }} />
                                            ))}
                                        </span>
                                        <span className="min-w-0 flex-1">
                                            <span className="flex items-center gap-2 text-sm font-semibold">
                                                <span style={{ fontFamily: tm.fontovi.naslov }}>{tm.naziv}</span>
                                                {id === temaSajta && <span className="rounded bg-black/[0.07] px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-black/60">{t.tema.aktivna}</span>}
                                            </span>
                                            <span className="block truncate text-xs text-black/55">{t.tema.po} {tm.inspiracija}</span>
                                        </span>
                                        {aktivna && <Check size={16} className="shrink-0" />}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                    <div className="space-y-2 border-t border-black/10 px-4 py-3 text-xs">
                        <p className="m-0 text-black/60">{TEME[tema.id]?.opis}</p>
                        {dev ? (
                            <button
                                type="button"
                                onClick={sacuvaj}
                                disabled={tema.id === temaSajta}
                                className="w-full rounded-lg bg-[#1d1d1f] px-3 py-2.5 text-sm font-medium text-white transition-opacity disabled:opacity-35"
                            >
                                {t.tema.sacuvaj}
                            </button>
                        ) : (
                            <p className="m-0 text-black/60">{t.tema.samoPregled} <code className="rounded bg-black/5 px-1">tema: &apos;{tema.id}&apos;</code></p>
                        )}
                        {poruka && <p className="m-0 font-medium text-emerald-700" role="status">{poruka}</p>}
                    </div>
                </div>
            )}
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    onClick={() => setOtvoren((o) => !o)}
                    aria-expanded={otvoren}
                    className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/95 px-3.5 py-2 text-[13px] font-medium shadow-lg backdrop-blur-xl transition-transform hover:-translate-y-0.5 sm:px-4 sm:py-2.5 sm:text-sm"
                >
                    <Palette size={16} /><span className={naZakazivanju ? 'hidden lg:inline' : ''}>{t.tema.otvori} · <span className="text-black/55">{TEME[tema.id]?.naziv}</span></span>
                </button>
                {/* Demo panel salona (src/panel) — samo na demo sajtu, kao i birač. */}
                <a
                    href={`${BAZA}/panel/prijava`}
                    title={t.tema.panel}
                    aria-label={t.tema.panel}
                    className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-[#1d1d1f] px-3.5 py-2 text-[13px] font-medium text-white shadow-lg ring-1 ring-black/10 transition-transform hover:-translate-y-0.5 sm:py-2.5 sm:text-sm"
                >
                    {/* Natpis i na telefonu — sama ikonica nije govorila šta je. */}
                    <LayoutDashboard size={16} /><span>Panel</span>
                </a>
            </div>
        </div>
    );
}
