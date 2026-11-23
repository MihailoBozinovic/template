/* Tekstovi interfejsa koje uvodi tema „volstrit” (ostalo je iz src/i18n). */
export const TEKSTOVI = {
    brziKontakt: { sr: 'Brzi kontakt', en: 'Quick contact', ru: 'Быстрая связь' },
    kategorije: { sr: 'Kategorije usluga', en: 'Service categories', ru: 'Категории услуг' },
};

/** Tekst teme na aktivnom jeziku (rezerva: srpski). */
export const tekstTeme = (kljuc, jezik) => TEKSTOVI[kljuc]?.[jezik] ?? TEKSTOVI[kljuc]?.sr ?? kljuc;
