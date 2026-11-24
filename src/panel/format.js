/*
 * Formati panela (samo srpski, kao AllSeasons panel): novac, datumi, vreme.
 * Datumi su 'YYYY-MM-DD', vreme minuti od ponoći — kao u src/lib/vreme.js.
 */
import { danUNedelji, dodajDane, sadaUSalonu, uSate } from '../lib/vreme.js';

export { dodajDane, danUNedelji, uSate };

export const MESECI = ['januar', 'februar', 'mart', 'april', 'maj', 'jun', 'jul', 'avgust', 'septembar', 'oktobar', 'novembar', 'decembar'];
export const MESECI_KRATKO = ['jan', 'feb', 'mar', 'apr', 'maj', 'jun', 'jul', 'avg', 'sep', 'okt', 'nov', 'dec'];
export const DANI_PUNO = { pon: 'ponedeljak', uto: 'utorak', sre: 'sreda', cet: 'četvrtak', pet: 'petak', sub: 'subota', ned: 'nedelja' };
export const DANI_KRATKO = { pon: 'pon', uto: 'uto', sre: 'sre', cet: 'čet', pet: 'pet', sub: 'sub', ned: 'ned' };
export const DANI_REDOM = ['pon', 'uto', 'sre', 'cet', 'pet', 'sub', 'ned'];

/** Broj sa tačkom za hiljade: 12.400 */
export const broj = (n) => String(Math.round(n ?? 0)).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
/** 12.400 RSD */
export const rsd = (n) => `${broj(n)} RSD`;
/** 12,4 hilj. — za ose grafikona */
export const rsdKratko = (n) => {
    const a = Math.abs(n);
    if (a >= 1e6) return `${(n / 1e6).toFixed(1).replace('.', ',').replace(',0', '')} mil`;
    if (a >= 1e3) return `${Math.round(n / 1e3)} hilj.`;
    return String(Math.round(n));
};
export const procenat = (x, decimale = 0) => `${(x * 100).toFixed(decimale).replace('.', ',')}%`;

export const danas = () => sadaUSalonu().datum;
export const sadaMinut = () => sadaUSalonu().minut;

const delovi = (iso) => iso.split('-').map(Number);
/** 24. novembar 2026. */
export const datumDugo = (iso, saGodinom = true) => { const [g, m, d] = delovi(iso); return `${d}. ${MESECI[m - 1]}${saGodinom ? ` ${g}.` : ''}`; };
/** 24. nov */
export const datumKratko = (iso) => { const [, m, d] = delovi(iso); return `${d}. ${MESECI_KRATKO[m - 1]}`; };
/** 24.11.2026. */
export const datumBrojevi = (iso) => { const [g, m, d] = delovi(iso); return `${String(d).padStart(2, '0')}.${String(m).padStart(2, '0')}.${g}.`; };
/** pon, 24. nov */
export const datumSaDanom = (iso) => `${DANI_KRATKO[danUNedelji(iso)]}, ${datumKratko(iso)}`;
/** ponedeljak, 24. novembar */
export const datumSaDanomDugo = (iso) => `${DANI_PUNO[danUNedelji(iso)]}, ${datumDugo(iso, false)}`;
/** Danas / Sutra / Juče / pon, 24. nov */
export const datumRelativno = (iso) => {
    const d = danas();
    if (iso === d) return 'Danas';
    if (iso === dodajDane(d, 1)) return 'Sutra';
    if (iso === dodajDane(d, -1)) return 'Juče';
    return datumSaDanom(iso);
};
export const razlikaDana = (a, b) => Math.round((Date.UTC(...delovi(b).map((x, i) => (i === 1 ? x - 1 : x))) - Date.UTC(...delovi(a).map((x, i) => (i === 1 ? x - 1 : x)))) / 864e5);
/** Ponedeljak nedelje kojoj datum pripada. */
export const pocetakNedelje = (iso) => dodajDane(iso, -DANI_REDOM.indexOf(danUNedelji(iso)));
export const pocetakMeseca = (iso) => `${iso.slice(0, 8)}01`;
export const opsegDana = (od, doDatuma) => { const x = []; for (let d = od; d <= doDatuma; d = dodajDane(d, 1)) x.push(d); return x; };

/** 10:30–11:15 */
export const vremeOdDo = (od, trajanje) => `${uSate(od)}–${uSate(od + trajanje)}`;
export const trajanje = (min) => { const h = Math.floor(min / 60); const m = min % 60; return h ? (m ? `${h} h ${m} min` : `${h} h`) : `${m} min`; };

/** Srpski oblici: 1 termin, 2 termina, 5 termina. */
export const mnozina = (n, jedan, dva, pet) => {
    const d = Math.abs(n) % 100; const j = d % 10;
    if (d >= 11 && d <= 14) return pet;
    if (j === 1) return jedan;
    if (j >= 2 && j <= 4) return dva;
    return pet;
};
export const termina = (n) => `${n} ${mnozina(n, 'termin', 'termina', 'termina')}`;
export const klijenata = (n) => `${n} ${mnozina(n, 'klijent', 'klijenta', 'klijenata')}`;

export const inicijali = (ime = '') => ime.trim().split(/\s+/).map((r) => r[0]).join('').slice(0, 2).toUpperCase();

/** Pre 5 min / pre 2 h / juče u 14:20 — za dnevnik i obaveštenja (ts u ms). */
export const preKoliko = (ts) => {
    const s = Math.max(0, (Date.now() - ts) / 1000);
    if (s < 60) return 'upravo';
    if (s < 3600) return `pre ${Math.floor(s / 60)} min`;
    if (s < 86400) return `pre ${Math.floor(s / 3600)} h`;
    const dana = Math.floor(s / 86400);
    return dana === 1 ? 'juče' : `pre ${dana} ${mnozina(dana, 'dan', 'dana', 'dana')}`;
};
