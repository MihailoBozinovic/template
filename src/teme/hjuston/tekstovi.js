/* Tekstovi interfejsa teme „hjuston” (sr / en / ru). Podaci o salonu su u src/config/salon.js. */
export const TEKSTOVI = {
    sr: {
        misijaNaslov: 'Naša misija',
        misijaLink: 'Pogledajte naše radove.',
        lokacijeNaslov: 'Gde nas možete naći',
        otvoriMenu: 'Otvori meni',
        ocenaZvezdice: (o, n, izvor) => `Ocena ${o} od 5 na osnovu ${n} recenzija${izvor ? ` (${izvor})` : ''}`,
        recenzija: (i, n) => `Recenzija ${i} od ${n}`,
        slajd: (i) => `Prikaži recenziju ${i}`,
        recenzijeKontrole: 'Izbor recenzija',
    },
    en: {
        misijaNaslov: 'Our mission',
        misijaLink: 'See our work.',
        lokacijeNaslov: 'Where to find us',
        otvoriMenu: 'Open menu',
        ocenaZvezdice: (o, n, izvor) => `Rated ${o} out of 5 from ${n} reviews${izvor ? ` (${izvor})` : ''}`,
        recenzija: (i, n) => `Review ${i} of ${n}`,
        slajd: (i) => `Show review ${i}`,
        recenzijeKontrole: 'Choose a review',
    },
    ru: {
        misijaNaslov: 'Наша миссия',
        misijaLink: 'Посмотрите наши работы.',
        lokacijeNaslov: 'Где нас найти',
        otvoriMenu: 'Открыть меню',
        ocenaZvezdice: (o, n, izvor) => `Оценка ${o} из 5 по ${n} отзывам${izvor ? ` (${izvor})` : ''}`,
        recenzija: (i, n) => `Отзыв ${i} из ${n}`,
        slajd: (i) => `Показать отзыв ${i}`,
        recenzijeKontrole: 'Выбор отзыва',
    },
};

export const tekstovi = (jezik) => TEKSTOVI[jezik] ?? TEKSTOVI.sr;
