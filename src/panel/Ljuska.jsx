/*
 * LJUSKA PANELA — bočni meni (sklopiv, na telefonu fioka), gornja traka
 * (pretraga, obaveštenja, tamni režim, nalog), demo traka i brze akcije.
 * Po uzoru na AllSeasons AdministratorLayout + SideMenu + AppNavbar.
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
    Bell, CalendarPlus, ChevronDown, ChevronsLeft, ChevronsRight, ExternalLink, LogOut, Menu, Moon, RotateCcw, Search, Sun, UserCircle2, X, ArrowRightLeft,
} from 'lucide-react';
import { salon } from '../config/salon.js';
import { BAZA } from '../lib/baza.js';
import { RASPORED_MENIJA, STAVKE } from './meni.js';
import { ULOGE, usePanel, useIndeksi, imeKlijenta } from './podaci/Skladiste.jsx';
import { useTermini } from './termini.jsx';
import { Avatar, Dugme, cx } from './ui.jsx';
import { danas, preKoliko, datumRelativno, uSate } from './format.js';

export const P = '/panel';
export const putanja = (ruta) => (ruta ? `${P}/${ruta}` : P);

const KLJUC_SKLOPLJEN = 'panel-meni-sklopljen-v2';
const KLJUC_GRUPE = 'panel-meni-grupe';
const citaj = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } };

/* ── Brojevi uz stavke menija (zahtevi na čekanju) ── */
const useZnacke = () => {
    const { podaci } = usePanel();
    return useMemo(() => ({ zahtevi: podaci.termini.filter((t) => t.status === 'zahtev').length }), [podaci.termini]);
};

function Meni({ sklopljen, onIzbor }) {
    const { sesija } = usePanel();
    const { pathname } = useLocation();
    const znacke = useZnacke();
    const grupe = RASPORED_MENIJA[sesija.uloga] ?? [];
    const [otvorene, setOtvorene] = useState(() => citaj(KLJUC_GRUPE, Object.fromEntries(grupe.map((g) => [g.id, g.otvoreno]))));
    useEffect(() => { try { localStorage.setItem(KLJUC_GRUPE, JSON.stringify(otvorene)); } catch { /* */ } }, [otvorene]);
    const aktivna = (st) => { const p = putanja(st.ruta); return st.ruta ? pathname === p || pathname.startsWith(`${p}/`) : pathname === P || pathname === `${P}/`; };

    return (
        <nav aria-label="Meni panela" className="flex-1 overflow-y-auto px-2.5 pb-4 p-skrol">
            {grupe.map((g) => {
                const imaAktivnu = g.stavke.some((k) => aktivna(STAVKE[k]));
                const otvoreno = g.fiksno || sklopljen || otvorene[g.id] || imaAktivnu;
                return (
                    <div key={g.id} className={cx(!g.fiksno && 'mt-3')}>
                        {!g.fiksno && !sklopljen && (
                            <button type="button" onClick={() => setOtvorene((o) => ({ ...o, [g.id]: !otvoreno }))} aria-expanded={otvoreno}
                                className="flex w-full items-center justify-between rounded-md px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-[.08em] text-p-sidebarink/50 hover:text-p-sidebarink/80">
                                {g.naziv}
                                <ChevronDown className={cx('h-3.5 w-3.5 transition-transform', !otvoreno && '-rotate-90')} aria-hidden="true" />
                            </button>
                        )}
                        {sklopljen && !g.fiksno && <div className="mx-3 my-2 h-px bg-white/10" />}
                        {otvoreno && (
                            <ul className="space-y-0.5">
                                {g.stavke.map((kljuc) => {
                                    const st = STAVKE[kljuc];
                                    const Ikona = st.ikona;
                                    const broj = st.znacka ? znacke[st.znacka] : 0;
                                    const akt = aktivna(st);
                                    return (
                                        <li key={kljuc}>
                                            <NavLink to={putanja(st.ruta)} end={!st.ruta} onClick={onIzbor} title={sklopljen ? st.naziv : undefined} aria-current={akt ? 'page' : undefined}
                                                className={cx('group relative flex items-center gap-3 rounded-lg px-2.5 py-2 text-[13.5px] transition-colors', sklopljen && 'justify-center',
                                                    akt ? 'bg-white/[.09] font-medium text-white' : 'text-p-sidebarink/75 hover:bg-white/[.05] hover:text-white')}>
                                                {akt && <span className="absolute left-0 top-1.5 h-[calc(100%-12px)] w-[3px] rounded-r bg-p-zlato" aria-hidden="true" />}
                                                <Ikona className={cx('h-[18px] w-[18px] shrink-0', akt ? 'text-p-zlato' : '')} strokeWidth={1.8} aria-hidden="true" />
                                                {!sklopljen && <span className="flex-1 truncate">{st.naziv}</span>}
                                                {broj > 0 && (sklopljen
                                                    ? <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-p-zlato" aria-label={`${broj} na čekanju`} />
                                                    : <span className="rounded-full bg-p-zlato px-1.5 text-[11px] font-semibold leading-[18px] text-[#16151a] tabularno">{broj}</span>)}
                                            </NavLink>
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                );
            })}
        </nav>
    );
}

const Logo = ({ sklopljen }) => (
    <Link to={P} className={cx('flex items-center gap-2.5 px-4 py-4', sklopljen && 'justify-center px-0')}>
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-p-zlato font-semibold text-[#16151a]">{(salon.kratkiNaziv || salon.naziv).slice(0, 1)}</span>
        {!sklopljen && (
            <span className="min-w-0 leading-tight">
                <span className="block truncate text-[15px] font-semibold text-white">{salon.naziv}</span>
                <span className="block text-[11.5px] text-p-sidebarink/55">Panel salona</span>
            </span>
        )}
    </Link>
);

/* ── Pretraga (Ctrl+K): stranice i klijenti ── */
function Pretraga() {
    const { sesija, podaci } = usePanel();
    const { otvoriDetalj } = useTermini();
    const navigate = useNavigate();
    const [otvoreno, setOtvoreno] = useState(false);
    const [q, setQ] = useState('');
    const ref = useRef(null);
    useEffect(() => {
        const taster = (e) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setOtvoreno(true); } };
        document.addEventListener('keydown', taster);
        return () => document.removeEventListener('keydown', taster);
    }, []);
    useEffect(() => { if (otvoreno) requestAnimationFrame(() => ref.current?.focus()); else setQ(''); }, [otvoreno]);

    const rezultati = useMemo(() => {
        const s = q.trim().toLowerCase();
        const stranice = (RASPORED_MENIJA[sesija.uloga] ?? []).flatMap((g) => g.stavke).map((k) => STAVKE[k]).filter((st) => !s || `${st.naziv} ${st.opis}`.toLowerCase().includes(s)).slice(0, s ? 6 : 8);
        const klijenti = s.length >= 2 && sesija.uloga !== 'zaposleni'
            ? podaci.klijenti.filter((k) => `${k.ime} ${k.prezime} ${k.telefon.replace(/\s/g, '')}`.toLowerCase().includes(s.replace(/\s+/g, s.match(/\d/) ? '' : ' '))).slice(0, 6) : [];
        const termin = /^#?\d{4,}$/.test(s) ? podaci.termini.find((t) => String(t.id) === s.replace('#', '')) : null;
        return { stranice, klijenti, termin };
    }, [q, sesija.uloga, podaci.klijenti, podaci.termini]);

    const idi = (to) => { setOtvoreno(false); navigate(to); };
    return (
        <>
            <button type="button" onClick={() => setOtvoreno(true)} className="flex h-10 min-w-0 flex-1 items-center gap-2 rounded-[10px] border border-p-ivica bg-p-karta px-3 text-left text-sm text-p-tiho transition-colors hover:border-p-polje md:max-w-sm">
                <Search className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span className="truncate">Pretraga stranica i klijenata…</span>
                <kbd className="ml-auto hidden rounded border border-p-ivica px-1.5 text-[11px] font-medium md:inline">Ctrl K</kbd>
            </button>
            {otvoreno && (
                <div className="panel-koren fixed inset-0 z-[210] flex items-start justify-center p-3 pt-[10vh]">
                    <div className="p-anim-veo absolute inset-0 bg-black/45" onClick={() => setOtvoreno(false)} aria-hidden="true" />
                    <div role="dialog" aria-modal="true" aria-label="Pretraga" className="p-anim-modal relative w-full max-w-xl overflow-hidden rounded-2xl border border-p-ivica bg-p-karta text-p-ink shadow-2xl" onKeyDown={(e) => e.key === 'Escape' && setOtvoreno(false)}>
                        <div className="flex items-center gap-2 border-b border-p-ivica px-4">
                            <Search className="h-4 w-4 text-p-tiho" aria-hidden="true" />
                            <input ref={ref} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Stranica, ime klijenta, telefon ili #broj termina" aria-label="Pretraga" className="h-14 flex-1 bg-transparent text-[15px] outline-none placeholder:text-p-tiho" />
                            <Dugme varijanta="tiho" velicina="ikonaSm" ikona={X} aria-label="Zatvori" onClick={() => setOtvoreno(false)} />
                        </div>
                        <div className="max-h-[60vh] overflow-y-auto p-2 p-skrol">
                            {rezultati.termin && (
                                <button type="button" onClick={() => { setOtvoreno(false); otvoriDetalj(rezultati.termin.id); }} className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm hover:bg-p-meko">
                                    <span>Termin #{rezultati.termin.id}</span><span className="text-p-tiho">{datumRelativno(rezultati.termin.datum)} {uSate(rezultati.termin.od)}</span>
                                </button>
                            )}
                            {rezultati.klijenti.length > 0 && <div className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-[.08em] text-p-tiho">Klijenti</div>}
                            {rezultati.klijenti.map((k) => (
                                <button key={k.id} type="button" onClick={() => idi(`${P}/klijenti/${k.id}`)} className="flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm hover:bg-p-meko">
                                    <span className="flex items-center gap-2.5"><Avatar ime={imeKlijenta(k)} velicina={26} />{imeKlijenta(k)}</span><span className="text-[12.5px] text-p-tiho">{k.telefon}</span>
                                </button>
                            ))}
                            {rezultati.stranice.length > 0 && <div className="px-3 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-[.08em] text-p-tiho">Stranice</div>}
                            {rezultati.stranice.map((st) => { const I = st.ikona; return (
                                <button key={st.naziv} type="button" onClick={() => idi(putanja(st.ruta))} className="flex w-full items-start gap-3 rounded-lg px-3 py-2 text-left hover:bg-p-meko">
                                    <I className="mt-0.5 h-4 w-4 shrink-0 text-p-tiho" aria-hidden="true" />
                                    <span><span className="block text-sm font-medium">{st.naziv}</span><span className="block text-[12.5px] text-p-tiho">{st.opis}</span></span>
                                </button>
                            ); })}
                            {!rezultati.stranice.length && !rezultati.klijenti.length && !rezultati.termin && <p className="px-3 py-6 text-center text-sm text-p-tiho">Nema rezultata za „{q}”.</p>}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

/* ── Padajući meni (obaveštenja, nalog) ── */
function Padajuci({ dugme, children, sirina = 'w-80' }) {
    const [otvoreno, setOtvoreno] = useState(false);
    const ref = useRef(null);
    const { pathname } = useLocation();
    useEffect(() => setOtvoreno(false), [pathname]);
    useEffect(() => {
        if (!otvoreno) return undefined;
        const klik = (e) => { if (!ref.current?.contains(e.target)) setOtvoreno(false); };
        const esc = (e) => e.key === 'Escape' && setOtvoreno(false);
        document.addEventListener('mousedown', klik); document.addEventListener('keydown', esc);
        return () => { document.removeEventListener('mousedown', klik); document.removeEventListener('keydown', esc); };
    }, [otvoreno]);
    return (
        <div ref={ref} className="relative">
            {dugme({ otvoreno, prebaci: () => setOtvoreno((o) => !o) })}
            {otvoreno && <div className={cx('p-anim-modal absolute right-0 top-full z-[120] mt-2 max-w-[calc(100vw-24px)] overflow-hidden rounded-2xl border border-p-ivica bg-p-karta text-p-ink shadow-xl', sirina)}>{children(() => setOtvoreno(false))}</div>}
        </div>
    );
}

function Obavestenja() {
    const { podaci, sesija } = usePanel();
    const indeks = useIndeksi();
    const { otvoriDetalj } = useTermini();
    const zahtevi = podaci.termini.filter((t) => t.status === 'zahtev').sort((a, b) => b.kreiran - a.kreiran);
    const niske = podaci.proizvodi.filter((p) => p.stanje < p.minimum);
    const odsustva = podaci.odsustva.filter((o) => o.status === 'na-cekanju');
    const stavke = [
        ...zahtevi.map((t) => ({ id: `z${t.id}`, ts: t.kreiran, naslov: 'Novi zahtev za termin', tekst: `${imeKlijenta(indeks.klijent[t.klijentId])} · ${datumRelativno(t.datum)} u ${uSate(t.od)}`, akcija: () => otvoriDetalj(t.id) })),
        ...(sesija.uloga === 'zaposleni' ? [] : odsustva.map((o) => ({ id: `o${o.id}`, ts: Date.now() - 864e5 * 2, naslov: 'Zahtev za odsustvo', tekst: `${indeks.radnik[o.radnikId]?.ime} · ${o.od}`, to: `${P}/odsustva` }))),
        ...(sesija.uloga === 'zaposleni' ? [] : niske.slice(0, 3).map((p) => ({ id: `p${p.id}`, ts: Date.now() - 864e5, naslov: 'Niske zalihe', tekst: `${p.brend} ${p.naziv} — još ${p.stanje} kom`, to: `${P}/proizvodi` }))),
    ];
    const navigate = useNavigate();
    return (
        <Padajuci sirina="w-[22rem]" dugme={({ prebaci, otvoreno }) => (
            <Dugme varijanta="tiho" velicina="ikona" onClick={prebaci} aria-expanded={otvoreno} aria-label={`Obaveštenja (${stavke.length})`} className="relative">
                <Bell className="h-[19px] w-[19px]" strokeWidth={1.8} aria-hidden="true" />
                {stavke.length > 0 && <span className="absolute right-1.5 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-p-greska px-1 text-[10px] font-semibold leading-none text-white">{stavke.length}</span>}
            </Dugme>
        )}>
            {(zatvori) => (
                <>
                    <div className="border-b border-p-ivica px-4 py-3 text-sm font-semibold">Obaveštenja</div>
                    <ul className="max-h-[60vh] overflow-y-auto p-1.5 p-skrol">
                        {stavke.map((s) => (
                            <li key={s.id}>
                                <button type="button" onClick={() => { zatvori(); s.akcija ? s.akcija() : navigate(s.to); }} className="w-full rounded-lg px-3 py-2.5 text-left hover:bg-p-meko">
                                    <span className="flex items-baseline justify-between gap-2"><span className="text-[13.5px] font-medium">{s.naslov}</span><span className="shrink-0 text-[11.5px] text-p-tiho">{preKoliko(s.ts)}</span></span>
                                    <span className="mt-0.5 block text-[12.5px] text-p-tiho">{s.tekst}</span>
                                </button>
                            </li>
                        ))}
                        {!stavke.length && <li className="px-3 py-6 text-center text-sm text-p-tiho">Sve je rešeno.</li>}
                    </ul>
                </>
            )}
        </Padajuci>
    );
}

function Nalog() {
    const { sesija, odjavi, prijavi, podaci } = usePanel();
    const navigate = useNavigate();
    return (
        <Padajuci sirina="w-72" dugme={({ prebaci, otvoreno }) => (
            <button type="button" onClick={prebaci} aria-expanded={otvoreno} aria-label="Nalog" className="flex items-center gap-2 rounded-xl p-1 pr-2 hover:bg-p-meko">
                <Avatar ime={sesija.ime} velicina={32} boja="rgb(var(--p-akc))" />
                <span className="hidden text-left leading-tight lg:block">
                    <span className="block max-w-[140px] truncate text-[13px] font-medium">{sesija.ime}</span>
                    <span className="block text-[11.5px] text-p-tiho">{ULOGE[sesija.uloga].naziv}</span>
                </span>
                <ChevronDown className="hidden h-4 w-4 text-p-tiho lg:block" aria-hidden="true" />
            </button>
        )}>
            {(zatvori) => (
                <div className="p-1.5">
                    <div className="px-3 py-2.5"><div className="text-sm font-semibold">{sesija.ime}</div><div className="text-[12.5px] text-p-tiho">{sesija.email}</div></div>
                    <div className="my-1 h-px bg-p-ivica" />
                    <div className="px-3 pb-1 pt-1.5 text-[11px] font-semibold uppercase tracking-[.08em] text-p-tiho">Demo: pogledaj kao</div>
                    {Object.entries(ULOGE).map(([id, u]) => (
                        <button key={id} type="button" onClick={() => { prijavi(id, id === 'zaposleni' ? podaci.radnici[1]?.id ?? podaci.radnici[0]?.id : null); zatvori(); navigate(P); }}
                            className={cx('flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[13.5px] hover:bg-p-meko', sesija.uloga === id && 'font-semibold text-p-akc')}>
                            <ArrowRightLeft className="h-4 w-4 text-p-tiho" aria-hidden="true" />{u.naziv}
                        </button>
                    ))}
                    <div className="my-1 h-px bg-p-ivica" />
                    <Link to={`${P}/profil`} onClick={zatvori} className="flex items-center gap-2 rounded-lg px-3 py-2 text-[13.5px] hover:bg-p-meko"><UserCircle2 className="h-4 w-4 text-p-tiho" aria-hidden="true" />Moj profil</Link>
                    <button type="button" onClick={() => { odjavi(); navigate(`${P}/prijava`); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-[13.5px] text-p-greska hover:bg-p-greskabg"><LogOut className="h-4 w-4" aria-hidden="true" />Odjava</button>
                </div>
            )}
        </Padajuci>
    );
}

/* ── Toast poruke ── */
function Poruke() {
    const { poruke } = usePanel();
    return (
        <div className="pointer-events-none fixed inset-x-0 bottom-[calc(5.5rem+env(safe-area-inset-bottom))] z-[300] flex flex-col items-center gap-2 px-4 md:bottom-6 md:items-end md:pr-6" aria-live="polite">
            {poruke.map((p) => (
                <div key={p.id} className={cx('p-anim-toast pointer-events-auto max-w-sm rounded-xl px-4 py-3 text-[13.5px] font-medium shadow-xl', p.vrsta === 'greska' ? 'bg-p-greska text-white' : p.vrsta === 'upoz' ? 'bg-[#8A5A00] text-white' : 'bg-[#16151a] text-[#f0ede6] ring-1 ring-white/10')}>{p.tekst}</div>
            ))}
        </div>
    );
}

export default function Ljuska({ children }) {
    const { tamno, setTamno, vratiDemo, sesija } = usePanel();
    const { otvoriNovi } = useTermini();
    // Ispod 1280px meni je podrazumevano samo ikonice, da sadržaj dobije širinu;
    // izbor korisnika (dugme „Skupi meni”) se pamti i ima prednost.
    const [sklopljen, setSklopljen] = useState(() => citaj(KLJUC_SKLOPLJEN, typeof window !== 'undefined' && window.innerWidth < 1280));
    const [mobilni, setMobilni] = useState(false);
    const { pathname } = useLocation();
    const prebaciMeni = () => setSklopljen((s) => { const n = !s; try { localStorage.setItem(KLJUC_SKLOPLJEN, JSON.stringify(n)); } catch { /* */ } return n; });
    useEffect(() => { setMobilni(false); window.scrollTo(0, 0); }, [pathname]);
    useEffect(() => { document.documentElement.style.overflow = mobilni ? 'hidden' : ''; }, [mobilni]);
    const sirina = sklopljen ? 'md:pl-[76px]' : 'md:pl-[264px]';

    return (
        <div className="panel-koren min-h-screen bg-p-bg text-p-ink">
            {/* Bočni meni — desktop */}
            <aside className={cx('p-sidebar fixed inset-y-0 left-0 z-[90] hidden flex-col bg-p-sidebar transition-[width] duration-200 md:flex', sklopljen ? 'w-[76px]' : 'w-[264px]')}>
                <Logo sklopljen={sklopljen} />
                <Meni sklopljen={sklopljen} />
                <div className="border-t border-white/10 p-2.5">
                    <button type="button" onClick={prebaciMeni} className={cx('flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-[13px] text-p-sidebarink/60 hover:bg-white/[.05] hover:text-white', sklopljen && 'justify-center')} aria-label={sklopljen ? 'Proširi meni' : 'Skupi meni'}>
                        {sklopljen ? <ChevronsRight className="h-[18px] w-[18px]" aria-hidden="true" /> : <><ChevronsLeft className="h-[18px] w-[18px]" aria-hidden="true" />Skupi meni</>}
                    </button>
                </div>
            </aside>

            {/* Bočni meni — telefon */}
            {mobilni && (
                <div className="fixed inset-0 z-[150] md:hidden">
                    <div className="p-anim-veo absolute inset-0 bg-black/50" onClick={() => setMobilni(false)} aria-hidden="true" />
                    <aside className="p-sidebar p-anim-fioka-levo absolute inset-y-0 left-0 flex w-[84%] max-w-[300px] flex-col bg-p-sidebar" aria-label="Meni">
                        <div className="flex items-center justify-between pr-2"><Logo /><Dugme varijanta="tiho" velicina="ikona" ikona={X} aria-label="Zatvori meni" onClick={() => setMobilni(false)} className="text-white hover:bg-white/10" /></div>
                        <Meni onIzbor={() => setMobilni(false)} />
                    </aside>
                </div>
            )}

            <div className={cx('transition-[padding] duration-200', sirina)}>
                {/* Demo traka */}
                <div className="flex items-center justify-center gap-x-3 gap-y-1 bg-p-zlato/90 px-4 py-1.5 text-center text-[12.5px] font-medium text-[#16151a]">
                    <span><b>DEMO</b> — podaci su izmišljeni<span className="hidden sm:inline">, izmene se čuvaju samo u ovom browseru</span>.</span>
                    <button type="button" onClick={vratiDemo} className="inline-flex items-center gap-1 underline underline-offset-2 hover:no-underline"><RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />Vrati podatke</button>
                </div>
                {/* Gornja traka */}
                <header className="sticky top-0 z-[80] border-b border-p-ivica bg-p-bg/85 backdrop-blur-md">
                    <div className="flex h-16 items-center gap-2 px-3 sm:gap-3 md:px-8">
                        <Dugme varijanta="tiho" velicina="ikona" ikona={Menu} aria-label="Otvori meni" onClick={() => setMobilni(true)} className="md:hidden" />
                        <Pretraga />
                        <div className="ml-auto flex items-center gap-1 sm:gap-1.5">
                            <Dugme varijanta="glavno" ikona={CalendarPlus} onClick={() => otvoriNovi({})} className="hidden md:inline-flex">Novi termin</Dugme>
                            <Dugme varijanta="tiho" velicina="ikona" href={`${BAZA}/`} target="_blank" rel="noopener" aria-label="Otvori sajt u novom prozoru" title="Otvori sajt" className="hidden sm:inline-flex"><ExternalLink className="h-[18px] w-[18px]" strokeWidth={1.8} aria-hidden="true" /></Dugme>
                            <Dugme varijanta="tiho" velicina="ikona" onClick={() => setTamno(!tamno)} aria-label={tamno ? 'Svetla tema' : 'Tamna tema'} title={tamno ? 'Svetla tema' : 'Tamna tema'}>
                                {tamno ? <Sun className="h-[18px] w-[18px]" strokeWidth={1.8} aria-hidden="true" /> : <Moon className="h-[18px] w-[18px]" strokeWidth={1.8} aria-hidden="true" />}
                            </Dugme>
                            <Obavestenja />
                            <Nalog />
                        </div>
                    </div>
                </header>
                <main id="sadrzaj" className="w-full px-4 pb-[calc(6rem+env(safe-area-inset-bottom))] pt-4 md:px-6 md:pb-12 md:pt-6 xl:px-8">{children}</main>
            </div>

            {/* Brze akcije — telefon */}
            {sesija && (
                <button type="button" onClick={() => otvoriNovi({})} aria-label="Novi termin"
                    className="fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom))] right-4 z-[85] grid h-14 w-14 place-items-center rounded-full bg-p-akc text-p-naakc shadow-[0_8px_24px_rgb(0_0_0/.25)] md:hidden">
                    <CalendarPlus className="h-6 w-6" aria-hidden="true" />
                </button>
            )}
            <Poruke />
        </div>
    );
}

/** Pozdrav po dobu dana — za Početnu. */
export const pozdrav = (minut) => (minut < 11 * 60 ? 'Dobro jutro' : minut < 18 * 60 ? 'Dobar dan' : 'Dobro veče');
export { danas };
