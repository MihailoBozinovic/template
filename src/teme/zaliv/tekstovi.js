/* Tekstovi interfejsa samo za temu „zaliv” (sve ostalo iz src/i18n). */
const TEKSTOVI = {
    sr: {
        lokacija: 'Lokacija',
        salon: 'Salon',
        radnoVreme: 'Radno vreme',
        oNamaDugme: 'Saznajte više',
        timDugme: 'Upoznajte tim',
        cenovnikDugme: 'Kompletan cenovnik',
        uslugeNaslov: 'Usluge i cene',
        recenzijeNaslov: 'Šta kažu klijenti',
        otvoriMapu: 'Otvori lokaciju u mapama',
        otvoriMeni: 'Otvori meni',
    },
    en: {
        lokacija: 'Location',
        salon: 'Salon',
        radnoVreme: 'Opening hours',
        oNamaDugme: 'Learn more',
        timDugme: 'Meet the team',
        cenovnikDugme: 'Full price list',
        uslugeNaslov: 'Services & prices',
        recenzijeNaslov: 'What clients say',
        otvoriMapu: 'Open location in maps',
        otvoriMeni: 'Open menu',
    },
    ru: {
        lokacija: 'Адрес',
        salon: 'Салон',
        radnoVreme: 'Часы работы',
        oNamaDugme: 'Подробнее',
        timDugme: 'Наша команда',
        cenovnikDugme: 'Полный прайс-лист',
        uslugeNaslov: 'Услуги и цены',
        recenzijeNaslov: 'Отзывы клиентов',
        otvoriMapu: 'Открыть адрес на карте',
        otvoriMeni: 'Открыть меню',
    },
};

export const tekstovi = (jezik) => TEKSTOVI[jezik] ?? TEKSTOVI.sr;
