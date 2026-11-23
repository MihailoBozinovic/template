/*
 * Tekstovi interfejsa teme „holivud” (sr / en / ru). Tekstovi o salonu su u
 * src/config/salon.js, a opšti tekstovi u src/i18n/*.js.
 */
import { useSajt } from '../../kontekst/Sajt.jsx';

const TEKSTOVI = {
    sr: {
        najava: 'Online zakazivanje za par minuta',
        najavaKratko: 'Online zakazivanje',
        najavaLink: 'Zakaži termin',
        pozovite: 'Pozovite salon',
        lokacija: 'Lokacija salona',
        zakaziIkona: 'Zakaži termin',
        radovi: 'Naši radovi',
        nasaPrica: 'Naša priča',
        cene: 'Cene i termini',
        upoznajteTim: 'Upoznajte tim',
        izdvajamo: 'Izdvajamo',
        pogledajCene: 'Pogledajte cene',
        zakaziOnline: 'Zakažite online',
        kakoDoNas: 'Kako do nas',
        pratite: 'Pratite nas',
        porukaNaslov: 'Pišite nam',
        porukaPolje: 'Vaša poruka salonu',
        posalji: 'Pošalji',
        porukaNapomena: 'Poruka se otvara u aplikaciji za razmenu poruka.',
        jezik: 'Jezik',
        brendovi: 'Profesionalne linije sa kojima radimo',
        utisak: 'Utisak klijenta',
    },
    en: {
        najava: 'Book online in a couple of minutes',
        najavaKratko: 'Online booking',
        najavaLink: 'Book now',
        pozovite: 'Call the salon',
        lokacija: 'Salon location',
        zakaziIkona: 'Book an appointment',
        radovi: 'Our work',
        nasaPrica: 'Our story',
        cene: 'Prices & booking',
        upoznajteTim: 'Meet the team',
        izdvajamo: 'Our pick',
        pogledajCene: 'See prices',
        zakaziOnline: 'Book online',
        kakoDoNas: 'Getting here',
        pratite: 'Follow us',
        porukaNaslov: 'Write to us',
        porukaPolje: 'Your message to the salon',
        posalji: 'Send',
        porukaNapomena: 'The message opens in your messaging app.',
        jezik: 'Language',
        brendovi: 'Professional brands we use',
        utisak: 'Client review',
    },
    ru: {
        najava: 'Онлайн-запись за пару минут',
        najavaKratko: 'Онлайн-запись',
        najavaLink: 'Записаться',
        pozovite: 'Позвонить в салон',
        lokacija: 'Адрес салона',
        zakaziIkona: 'Записаться',
        radovi: 'Наши работы',
        nasaPrica: 'Наша история',
        cene: 'Цены и запись',
        upoznajteTim: 'Познакомьтесь с командой',
        izdvajamo: 'Мы рекомендуем',
        pogledajCene: 'Смотреть цены',
        zakaziOnline: 'Записаться онлайн',
        kakoDoNas: 'Как добраться',
        pratite: 'Мы в соцсетях',
        porukaNaslov: 'Напишите нам',
        porukaPolje: 'Ваше сообщение салону',
        posalji: 'Отправить',
        porukaNapomena: 'Сообщение откроется в мессенджере.',
        jezik: 'Язык',
        brendovi: 'Профессиональные марки, с которыми мы работаем',
        utisak: 'Отзыв клиента',
    },
};

export const useTekstovi = () => {
    const { jezik } = useSajt();
    return TEKSTOVI[jezik] ?? TEKSTOVI.sr;
};

export default TEKSTOVI;
