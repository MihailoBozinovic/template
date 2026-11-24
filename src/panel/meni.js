/*
 * MENI PANELA — stranice i grupe po ulozi, po uzoru na AllSeasons panel
 * (components/shared/MenuContent.js): grupe idu redom kojim ta uloga radi
 * kroz dan, a stavke u grupi od najkorišćenije.
 */
import {
    House, CalendarDays, BellRing, Hourglass, CalendarPlus, ReceiptText, ChartColumn, Armchair, Star, Users, IdCard, Ban,
    Clock, Umbrella, UserCog, Banknote, Scissors, Package, Gift, BadgePercent, MessageSquareText, Palette, Images,
    Store, CalendarClock, Settings, History, User, Sun,
} from 'lucide-react';

export const STAVKE = {
    pocetna: { naziv: 'Početna', ruta: '', ikona: House, opis: 'Pregled dana: šta čeka, promet, ko radi i kako posluje salon.' },
    mojDan: { naziv: 'Moj dan', ruta: '', ikona: Sun, opis: 'Vaši današnji termini, zarada i ocene.' },
    kalendar: { naziv: 'Kalendar', ruta: 'kalendar', ikona: CalendarDays, opis: 'Termini po danu i radniku, nedeljni pregled, izmene i naplata.' },
    mojiTermini: { naziv: 'Moji termini', ruta: 'kalendar', ikona: CalendarDays, opis: 'Kalendar salona, vaši termini istaknuti.' },
    zahtevi: { naziv: 'Zahtevi za termin', ruta: 'zahtevi', ikona: BellRing, opis: 'Online rezervacije sa sajta koje čekaju odobrenje.', znacka: 'zahtevi' },
    listaCekanja: { naziv: 'Lista čekanja', ruta: 'lista-cekanja', ikona: Hourglass, opis: 'Klijenti koji čekaju da se oslobodi termin.' },
    noviTermin: { naziv: 'Novi termin', ruta: 'novi-termin', ikona: CalendarPlus, opis: 'Zakazivanje sa pulta ili telefonom.' },
    dnevniPromet: { naziv: 'Dnevni promet', ruta: 'dnevni-promet', ikona: ReceiptText, opis: 'Naplata dana po načinu plaćanja i po radniku.' },

    analitika: { naziv: 'Analitika salona', ruta: 'analitika', ikona: ChartColumn, opis: 'Prihod, usluge, radnici i klijenti za izabrani period.' },
    popunjenost: { naziv: 'Popunjenost', ruta: 'popunjenost', ikona: Armchair, opis: 'Koliko su radnici bili zauzeti po danima i satima.' },
    ocene: { naziv: 'Ocene zaposlenih', ruta: 'ocene', ikona: Star, opis: 'Ocene klijenata posle termina, sa komentarima.' },

    klijenti: { naziv: 'Klijenti', ruta: 'klijenti', ikona: Users, opis: 'Imenik klijenata: kontakt, posete, potrošnja i napomene.' },
    kartoteka: { naziv: 'Kartoteka', ruta: 'kartoteka', ikona: IdCard, opis: 'Tehnički karton: formule boja i tretmani.' },
    otkazivanja: { naziv: 'Otkazivanja i blokade', ruta: 'otkazivanja', ikona: Ban, opis: 'Otkazani termini, nedolasci i blokirani brojevi.' },

    raspored: { naziv: 'Raspored smena', ruta: 'raspored', ikona: Clock, opis: 'Ko radi kog dana i u koje vreme.' },
    mojRaspored: { naziv: 'Moj raspored', ruta: 'raspored', ikona: Clock, opis: 'Raspored salona i vaše smene.' },
    odsustva: { naziv: 'Odsustva', ruta: 'odsustva', ikona: Umbrella, opis: 'Godišnji odmori, slobodni dani i bolovanja.' },
    osoblje: { naziv: 'Osoblje', ruta: 'osoblje', ikona: UserCog, opis: 'Nalozi osoblja, uloge i pristup.' },
    zarade: { naziv: 'Zarade', ruta: 'zarade', ikona: Banknote, opis: 'Plata i provizija po radniku za mesec.' },

    usluge: { naziv: 'Usluge i cene', ruta: 'usluge', ikona: Scissors, opis: 'Cenovnik: usluge, cene, trajanja i kategorije.' },
    proizvodi: { naziv: 'Proizvodi i magacin', ruta: 'proizvodi', ikona: Package, opis: 'Proizvodi za prodaju, stanje i niske zalihe.' },

    vauceri: { naziv: 'Vaučeri', ruta: 'vauceri', ikona: Gift, opis: 'Poklon vaučeri: izdavanje, iskorišćenje i rok.' },
    promoKodovi: { naziv: 'Promo kodovi', ruta: 'promo-kodovi', ikona: BadgePercent, opis: 'Kodovi za popust pri online zakazivanju.' },
    sms: { naziv: 'SMS kampanje', ruta: 'sms', ikona: MessageSquareText, opis: 'Poruke izabranim klijentima i istorija kampanja.' },

    izgled: { naziv: 'Izgled sajta', ruta: 'izgled-sajta', ikona: Palette, opis: 'Tema sajta jednim klikom — 9 tema po premium salonima.' },
    galerija: { naziv: 'Galerija', ruta: 'galerija', ikona: Images, opis: 'Fotografije radova na sajtu.' },

    podaciSalona: { naziv: 'Podaci salona', ruta: 'podaci-salona', ikona: Store, opis: 'Naziv, kontakt, adresa i podaci firme.' },
    radnoVreme: { naziv: 'Radno vreme', ruta: 'radno-vreme', ikona: CalendarClock, opis: 'Radno vreme po danima i neradni dani.' },
    podesavanja: { naziv: 'Podešavanja', ruta: 'podesavanja', ikona: Settings, opis: 'Online zakazivanje, podsetnici i obaveštenja.' },
    dnevnik: { naziv: 'Dnevnik izmena', ruta: 'dnevnik', ikona: History, opis: 'Ko je šta promenio u panelu i kada.' },

    profil: { naziv: 'Moj profil', ruta: 'profil', ikona: User, opis: 'Vaš nalog, lozinka i obaveštenja.' },
};

const grupa = (id, naziv, stavke, otvoreno = false) => ({ id, naziv, stavke, otvoreno });
const fiksna = (id, stavke) => ({ id, fiksno: true, stavke, otvoreno: true });

export const RASPORED_MENIJA = {
    administrator: [
        fiksna('pocetna', ['pocetna']),
        grupa('danas', 'Danas', ['kalendar', 'zahtevi', 'listaCekanja', 'noviTermin', 'dnevniPromet'], true),
        grupa('analitika', 'Analitika', ['analitika', 'popunjenost', 'ocene'], true),
        grupa('klijenti', 'Klijenti', ['klijenti', 'kartoteka', 'otkazivanja']),
        grupa('tim', 'Tim i raspored', ['raspored', 'odsustva', 'osoblje', 'zarade']),
        grupa('usluge', 'Usluge i prodavnica', ['usluge', 'proizvodi']),
        grupa('marketing', 'Marketing', ['vauceri', 'promoKodovi', 'sms']),
        grupa('sajt', 'Sajt', ['izgled', 'galerija']),
        grupa('podesavanja', 'Podešavanja', ['podaciSalona', 'radnoVreme', 'podesavanja', 'dnevnik']),
        grupa('pomoc', 'Nalog', ['profil'], true),
    ],
    menadzer: [
        fiksna('pocetna', ['pocetna']),
        grupa('danas', 'Danas', ['kalendar', 'zahtevi', 'listaCekanja', 'noviTermin', 'dnevniPromet'], true),
        grupa('tim', 'Tim i raspored', ['raspored', 'odsustva'], true),
        grupa('klijenti', 'Klijenti', ['klijenti', 'kartoteka']),
        grupa('usluge', 'Usluge i prodavnica', ['usluge', 'proizvodi']),
        grupa('marketing', 'Marketing', ['vauceri', 'promoKodovi']),
        grupa('pomoc', 'Nalog', ['profil'], true),
    ],
    recepcija: [
        fiksna('pocetna', ['pocetna']),
        grupa('danas', 'Danas', ['kalendar', 'zahtevi', 'listaCekanja', 'noviTermin', 'dnevniPromet'], true),
        grupa('klijenti', 'Klijenti', ['klijenti', 'kartoteka', 'otkazivanja'], true),
        grupa('tim', 'Tim i raspored', ['raspored', 'odsustva', 'osoblje'], true),
        grupa('usluge', 'Usluge', ['usluge', 'vauceri'], true),
        grupa('pomoc', 'Nalog', ['profil'], true),
    ],
    zaposleni: [
        fiksna('pocetna', ['mojDan']),
        grupa('danas', 'Danas', ['mojiTermini', 'noviTermin', 'dnevniPromet'], true),
        grupa('raspored', 'Raspored', ['mojRaspored', 'odsustva'], true),
        grupa('pomoc', 'Nalog', ['profil'], true),
    ],
};

/** Rute koje uloga sme da otvori (i kroz adresu, ne samo kroz meni). */
export const ruteUloge = (uloga) => new Set((RASPORED_MENIJA[uloga] ?? []).flatMap((g) => g.stavke.map((k) => STAVKE[k].ruta)));

/** Sve rute panela — za prerender praznih stranica (scripts/prerender.mjs). */
export const SVE_RUTE = [...new Set(Object.values(STAVKE).map((s) => s.ruta).filter(Boolean)), 'prijava'];
