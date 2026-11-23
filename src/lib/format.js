/** Cena u dinarima po običaju jezika: 2.800 RSD · 2,800 RSD · 2 800 RSD. */
export const cena = (iznos, jezik = 'sr') => {
    const sep = jezik === 'en' ? ',' : jezik === 'ru' ? ' ' : '.';
    const broj = String(Math.round(iznos)).replace(/\B(?=(\d{3})+(?!\d))/g, sep);
    return `${broj} RSD`;
};

const JEDINICE = {
    sr: { h: 'h', min: 'min' },
    en: { h: 'h', min: 'min' },
    ru: { h: 'ч', min: 'мин' },
};

/** Trajanje: 45 min · 1 h 30 min · 1 ч 30 мин. */
export const trajanje = (minuti, jezik = 'sr') => {
    const j = JEDINICE[jezik] ?? JEDINICE.sr;
    const h = Math.floor(minuti / 60);
    const m = minuti % 60;
    if (!h) return `${m} ${j.min}`;
    return m ? `${h} ${j.h} ${m} ${j.min}` : `${h} ${j.h}`;
};

/** Datum 'YYYY-MM-DD' kao „12. decembar” / „12 December” / „12 декабря”. */
export const datumDugo = (iso, t, jezik = 'sr') => {
    const [, m, d] = iso.split('-').map(Number);
    if (jezik === 'en') return `${d} ${t.meseci[m - 1]}`;
    if (jezik === 'ru') return `${d} ${t.meseciGen[m - 1]}`;
    return `${d}. ${t.meseciGen[m - 1]}`;
};

export const godinaSada = () => new Date().getFullYear();
