/*
 * Brendovi s kojima salon radi i načini plaćanja — normalizacija podataka iz
 * salon.js, da komponente ne moraju da znaju u kom obliku su upisani.
 *
 *   brendovi: [{ naziv: 'Olaplex', logo: '/brendovi/olaplex.svg', url: 'https://olaplex.com' }, 'Davines', …]
 *   placanje: ['gotovina', 'visa', 'mastercard', 'maestro', 'dinacard']
 *
 * Logotip: SVG/PNG u public/brendovi/ (crn ili u boji na providnoj podlozi —
 * tema ga sama oboji u jednu boju). Bez logotipa prikazuje se naziv.
 */

/** [{ naziv, logo?, url? }] — prihvata i obične nazive (stari oblik). */
export const brendoviSalona = (salon) => (salon?.brendovi ?? [])
    .map((b) => (typeof b === 'string' ? { naziv: b } : b))
    .filter((b) => b && b.naziv);

/** Zvanični logotipi kartica (public/placanje/) i gotovina. */
export const NACINI_PLACANJA = {
    gotovina: { naziv: { sr: 'Gotovina', en: 'Cash', ru: 'Наличные' } },
    visa: { naziv: 'Visa', logo: '/placanje/visa.png' },
    mastercard: { naziv: 'Mastercard', logo: '/placanje/mastercard.png' },
    maestro: { naziv: 'Maestro', logo: '/placanje/maestro.png' },
    dinacard: { naziv: 'DinaCard', logo: '/placanje/dinacard.png' },
};

const ALIASI = { dina: 'dinacard', 'master card': 'mastercard', 'master': 'mastercard', cash: 'gotovina', keš: 'gotovina', kes: 'gotovina' };

/** [{ kljuc, naziv, logo? }] za načine plaćanja iz salon.js (nepoznati se preskaču). */
export const naciniPlacanja = (salon) => (salon?.placanje ?? [])
    .map((p) => {
        const k = String(p).trim().toLowerCase().replace(/[\s_-]+/g, ' ');
        return ALIASI[k] ?? k.replace(/\s/g, '');
    })
    .filter((k, i, niz) => NACINI_PLACANJA[k] && niz.indexOf(k) === i)
    .map((k) => ({ kljuc: k, ...NACINI_PLACANJA[k] }));
