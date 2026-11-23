/*
 * ═══════════════════════════════════════════════════════════════════════════
 *  PODACI SALONA — JEDINI FAJL KOJI SE MENJA ZA NOVOG KLIJENTA
 * ═══════════════════════════════════════════════════════════════════════════
 *
 *  Sve što sajt prikazuje — naziv, telefon, radno vreme, usluge i cene, tim,
 *  galerija, tekstovi, SEO, pravni podaci firme — čita se odavde. Isti podaci
 *  idu u footer, kontakt, zakazivanje, strukturirane podatke za Google
 *  (JSON-LD), sitemap i pravne strane, pa nigde ne mogu da se raziđu.
 *
 *  Redosled rada za novog klijenta (detaljno u README.md):
 *    1. popuni ovaj fajl,
 *    2. stavi fotografije u public/slike/ (nazivi kao ispod),
 *    3. `npm run provera` — pokazuje šta je ostalo nepopunjeno,
 *    4. `npm run build` — gotov sajt je u dist/.
 *
 *  PREVODI: svako tekstualno polje može biti običan tekst (isti na svim
 *  jezicima) ili { sr: '…', en: '…', ru: '…' }. Kad prevod fali, prikazuje
 *  se srpski.
 *
 *  Dok je `demo: true`, sajt je zaključan za pretraživače (noindex), vidi se
 *  birač tema, a `npm run provera` ne prolazi. Prebaci na `false` tek kad su
 *  podaci pravi.
 *
 *  Prazan niz ili prazan string sakriva tu sekciju (bez recenzija nema bloka
 *  recenzija, bez TikTok-a nema ikonice itd.).
 */

export const salon = {
    demo: true,

    /*
     * Tema — jedna od: menhetn, palma, soho, istsajd, zaliv, holivud, hjuston,
     * volstrit, noar (opisi u src/config/teme.js i docs/TEME.md).
     * Najlakše: u `npm run dev` otvori birač tema i klikni „Postavi kao temu
     * sajta” — ova linija se sama prepiše.
     * Može i sa izmenama: tema: { osnova: 'soho', boje: { brand: '#9C6B3F' } }
     */
    tema: 'noar',

    // Jezici sajta. Prvi je glavni (na adresi /), ostali pod /en i /ru.
    jezici: ['sr', 'en', 'ru'],

    /*
     * 'salon'       — frizerski salon (Google: HairSalon)
     * 'berbernica'  — berbernica (Google: BarberShop)
     * 'oba'         — salon sa berbernicom (HairSalon)
     */
    tip: 'oba',

    naziv: 'Atelje Makaze',
    // Kraći naziv za ikonicu aplikacije (do ~12 slova).
    kratkiNaziv: 'Makaze',
    slogan: { sr: 'Frizerski studio i berbernica', en: 'Hair studio & barbershop', ru: 'Парикмахерская студия и барбершоп' },
    // Jedna rečenica za Google i deljenje linka (do ~155 karaktera).
    opis: {
        sr: 'Frizerski studio i berbernica u centru Beograda. Šišanje, farbanje, balayage, brijanje i nega brade. Zakažite termin online za par minuta.',
        en: 'Hair studio and barbershop in central Belgrade. Cuts, colour, balayage, shaves and beard care. Book online in a couple of minutes.',
        ru: 'Парикмахерская и барбершоп в центре Белграда. Стрижки, окрашивание, балаяж, бритьё и уход за бородой. Онлайн-запись за пару минут.',
    },

    // Puna adresa sajta, bez kose crte na kraju (canonical, sitemap, deljenje).
    domen: 'https://www.ateljemakaze.rs',
    osnovan: 2016,

    kontakt: {
        // E.164 za pozive (tel:) i kako se broj prikazuje.
        telefon: '+381601234567',
        telefonPrikaz: '060 123 4567',
        // Broj za WhatsApp i Viber, E.164 bez „+” (prazno = nema dugmeta).
        whatsapp: '381601234567',
        viber: '381601234567',
        email: 'zakazivanje@ateljemakaze.rs',
        instagram: 'https://www.instagram.com/ateljemakaze/',
        facebook: 'https://www.facebook.com/ateljemakaze',
        tiktok: '',
        // Link „Ostavite recenziju” na Google profilu (prazno = nema dugmeta).
        googleRecenzija: '',
    },

    lokacija: {
        adresa: 'Kneza Miloša 10',
        postanskiBroj: '11000',
        grad: { sr: 'Beograd', en: 'Belgrade', ru: 'Белград' },
        opstina: 'Savski venac',
        drzava: 'RS',
        // U Google Maps: desni klik na lokaciju → prve dve vrednosti.
        koordinate: { lat: 44.8084, lng: 20.4623 },
        // Link ka profilu na Google mapama (prazno = pravi se iz koordinata).
        googleMape: '',
        kakoDoNas: {
            sr: 'Parking zona 2 ispred salona, javna garaža na 200 m. Ulaz iz ulice, prizemlje.',
            en: 'Zone 2 street parking in front of the salon, public garage 200 m away. Street entrance, ground floor.',
            ru: 'Парковка зоны 2 перед салоном, общественный гараж в 200 м. Вход с улицы, первый этаж.',
        },
    },

    /*
     * Radno vreme po danima. null = ne radi. Zakazivanje nudi samo termine koji
     * se završavaju pre zatvaranja.
     */
    radnoVreme: {
        pon: ['09:00', '20:00'],
        uto: ['09:00', '20:00'],
        sre: ['09:00', '20:00'],
        cet: ['09:00', '20:00'],
        pet: ['09:00', '21:00'],
        sub: ['09:00', '17:00'],
        ned: null,
    },

    // Dani kad salon ne radi iako je inače radni dan (praznici, odmor).
    neradniDani: [
        { datum: '2026-12-31', opis: { sr: 'Doček Nove godine', en: 'New Year’s Eve', ru: 'Канун Нового года' } },
        { datum: '2027-01-01', opis: { sr: 'Nova godina', en: 'New Year', ru: 'Новый год' } },
        { datum: '2027-01-02', opis: { sr: 'Nova godina', en: 'New Year', ru: 'Новый год' } },
        { datum: '2027-01-07', opis: { sr: 'Božić', en: 'Orthodox Christmas', ru: 'Рождество' } },
    ],

    /*
     * Podaci privrednog društva / preduzetnika. Zakon o trgovini i Zakon o
     * elektronskoj trgovini traže da budu na sajtu — prikazuju se u footeru i
     * na pravnim stranama.
     */
    firma: {
        naziv: 'Atelje Makaze, Petar Petrović PR, Beograd',
        oblik: 'preduzetnik', // 'preduzetnik' | 'doo'
        adresa: 'Kneza Miloša 10, 11000 Beograd',
        pib: '000000000',
        maticniBroj: '00000000',
        sifraDelatnosti: '9602',
        pdvObveznik: false,
        // Kome se klijenti obraćaju za lične podatke i reklamacije.
        emailZaPodatke: 'zakazivanje@ateljemakaze.rs',
    },

    /*
     * ZAKAZIVANJE
     *
     *  nacin: 'zahtev' — klijent bira uslugu, frizera i termin, salon potvrđuje
     *                    (kao kod AllSeasons-a: online zahtev čeka odobrenje).
     *                    Zahtev stiže preko `kanal`.
     *         'link'   — dugme „Zakaži” vodi na spoljni sistem (SrediMe, Fresha…)
     *                    na adresi `link`; stranica /zakazivanje nudi taj link,
     *                    poziv i poruku.
     *
     *  kanal.tip: 'webhook'  — POST JSON na `kanal.url` (Formspree, Make, n8n,
     *                          Google Apps Script ili sopstveni API).
     *             'whatsapp' — otvara WhatsApp sa popunjenom porukom.
     *             'viber'    — otvara Viber sa popunjenom porukom.
     *             'email'    — otvara e-mail sa popunjenom porukom.
     *  Ako webhook ne uspe, odmah se nude WhatsApp/Viber/poziv — zahtev se nikad
     *  ne gubi u tišini.
     */
    zakazivanje: {
        nacin: 'zahtev',
        link: '',
        kanal: { tip: 'whatsapp', url: '' },
        korakMinuta: 15, // mreža termina
        najranijeSati: 2, // najraniji termin od sada
        danaUnapred: 30, // koliko dana unapred
        otkazivanjeSati: 24, // besplatno otkazivanje (piše u uslovima)
        maksUsluga: 3, // koliko usluga odjednom (šišanje + brada…)
    },

    /*
     * USLUGE I CENOVNIK
     *  za: 'zene', 'muskarci', 'deca' — prazno = svi. Filter „Za koga?”.
     *  trajanje: minuti.  cena: RSD.  cenaOd: true → „od 4.500”.
     *  slika: fotografija kategorije (public/slike/...).
     */
    kategorije: [
        {
            id: 'zensko',
            naziv: { sr: 'Žensko šišanje i styling', en: 'Women’s cuts & styling', ru: 'Женские стрижки и укладки' },
            opis: {
                sr: 'Šišanje po obliku lica, feniranje i svečane frizure.',
                en: 'Cuts tailored to your face shape, blow-dries and occasion styling.',
                ru: 'Стрижки по форме лица, укладки и вечерние причёски.',
            },
            za: ['zene'],
            slika: '/slike/usluga-zensko.webp',
            usluge: [
                { id: 'zensko-sisanje', naziv: { sr: 'Žensko šišanje', en: 'Women’s haircut', ru: 'Женская стрижка' }, opis: { sr: 'Konsultacija, pranje, šišanje i feniranje.', en: 'Consultation, wash, cut and blow-dry.', ru: 'Консультация, мытьё, стрижка и укладка.' }, trajanje: 60, cena: 2800 },
                { id: 'feniranje', naziv: { sr: 'Feniranje', en: 'Blow-dry', ru: 'Укладка феном' }, opis: { sr: 'Pranje, maska i feniranje — talasi ili ravno.', en: 'Wash, mask and blow-dry — waves or sleek.', ru: 'Мытьё, маска и укладка — волны или гладко.' }, trajanje: 45, cena: 1600, cenaOd: true },
                { id: 'krajevi', naziv: { sr: 'Skraćivanje krajeva', en: 'Trim', ru: 'Подравнивание кончиков' }, opis: { sr: 'Osvežavanje oblika bez promene dužine.', en: 'Refreshes the shape without losing length.', ru: 'Обновление формы без потери длины.' }, trajanje: 30, cena: 1800 },
                { id: 'svecana', naziv: { sr: 'Svečana frizura', en: 'Occasion styling', ru: 'Вечерняя причёска' }, opis: { sr: 'Punđe, pletenice i frizure za venčanja i proslave.', en: 'Updos, braids and styles for weddings and parties.', ru: 'Пучки, косы и причёски для свадеб и праздников.' }, trajanje: 75, cena: 4500, cenaOd: true },
            ],
        },
        {
            id: 'boja',
            naziv: { sr: 'Boja i pramenovi', en: 'Colour & highlights', ru: 'Окрашивание и мелирование' },
            opis: {
                sr: 'Od farbanja izrastka do balayage-a — uz zaštitu kose u svakom koraku.',
                en: 'From root touch-ups to balayage — with bond protection at every step.',
                ru: 'От окрашивания корней до балаяжа — с защитой волос на каждом этапе.',
            },
            za: ['zene'],
            slika: '/slike/usluga-boja.webp',
            usluge: [
                { id: 'izrastak', naziv: { sr: 'Farbanje izrastka', en: 'Root colour', ru: 'Окрашивание корней' }, opis: { sr: 'Boja na izrastku, pranje i feniranje.', en: 'Root colour, wash and blow-dry.', ru: 'Окрашивание корней, мытьё и укладка.' }, trajanje: 105, cena: 4800, cenaOd: true },
                { id: 'farbanje', naziv: { sr: 'Farbanje cele dužine', en: 'Full colour', ru: 'Окрашивание по всей длине' }, opis: { sr: 'Ujednačena boja od korena do krajeva.', en: 'Even colour from root to tip.', ru: 'Ровный цвет от корней до кончиков.' }, trajanje: 135, cena: 6500, cenaOd: true },
                { id: 'pramenovi', naziv: { sr: 'Pramenovi', en: 'Highlights', ru: 'Мелирование' }, opis: { sr: 'Klasični ili baby lights, sa toniranjem.', en: 'Classic or baby lights, with toning.', ru: 'Классическое или baby lights, с тонированием.' }, trajanje: 180, cena: 9000, cenaOd: true },
                { id: 'balayage', naziv: 'Balayage', opis: { sr: 'Ručno slikani prelazi, toner i nega.', en: 'Hand-painted blends, toner and care.', ru: 'Ручная растяжка цвета, тонер и уход.' }, trajanje: 240, cena: 13000, cenaOd: true },
                { id: 'toniranje', naziv: { sr: 'Toniranje', en: 'Toner / gloss', ru: 'Тонирование' }, opis: { sr: 'Osvežavanje nijanse plavih i posvetljenih tonova.', en: 'Refreshes blonde and lightened shades.', ru: 'Обновление оттенка блонда и осветлённых волос.' }, trajanje: 60, cena: 3200 },
            ],
        },
        {
            id: 'nega',
            naziv: { sr: 'Nega kose', en: 'Hair care', ru: 'Уход за волосами' },
            opis: {
                sr: 'Tretmani koji vraćaju sjaj, snagu i mekoću.',
                en: 'Treatments that bring back shine, strength and softness.',
                ru: 'Процедуры, возвращающие блеск, силу и мягкость.',
            },
            za: [],
            slika: '/slike/usluga-nega.webp',
            usluge: [
                { id: 'olaplex', naziv: { sr: 'Olaplex tretman', en: 'Olaplex treatment', ru: 'Процедура Olaplex' }, opis: { sr: 'Obnova veza u kosi posle posvetljivanja.', en: 'Rebuilds hair bonds after lightening.', ru: 'Восстановление связей волоса после осветления.' }, trajanje: 30, cena: 3000 },
                { id: 'keratin', naziv: { sr: 'Keratinsko ispravljanje', en: 'Keratin smoothing', ru: 'Кератиновое выпрямление' }, opis: { sr: 'Glatka kosa bez kovrdžanja do tri meseca.', en: 'Frizz-free, smooth hair for up to three months.', ru: 'Гладкие волосы без пушистости до трёх месяцев.' }, trajanje: 180, cena: 9500, cenaOd: true },
                { id: 'maska', naziv: { sr: 'Dubinska maska', en: 'Deep conditioning mask', ru: 'Глубокая маска' }, opis: { sr: 'Hidratacija i masaža skalpa.', en: 'Hydration and scalp massage.', ru: 'Увлажнение и массаж кожи головы.' }, trajanje: 20, cena: 1200 },
            ],
        },
        {
            id: 'berbernica',
            naziv: { sr: 'Berbernica', en: 'Barbershop', ru: 'Барбершоп' },
            opis: {
                sr: 'Klasično i moderno muško šišanje, brijanje britvom i nega brade.',
                en: 'Classic and modern men’s cuts, straight-razor shaves and beard care.',
                ru: 'Классические и современные мужские стрижки, бритьё опасной бритвой и уход за бородой.',
            },
            za: ['muskarci'],
            slika: '/slike/usluga-berbernica.webp',
            usluge: [
                { id: 'musko-sisanje', naziv: { sr: 'Muško šišanje', en: 'Men’s haircut', ru: 'Мужская стрижка' }, opis: { sr: 'Makaze i mašinica, pranje i styling.', en: 'Scissors and clippers, wash and styling.', ru: 'Ножницы и машинка, мытьё и укладка.' }, trajanje: 45, cena: 1600 },
                { id: 'fade', naziv: 'Skin fade', opis: { sr: 'Precizan prelaz do kože, oblikovanje gornjeg dela.', en: 'A precise fade to the skin, shaped on top.', ru: 'Точный переход до кожи, оформление верха.' }, trajanje: 50, cena: 1900 },
                { id: 'brada', naziv: { sr: 'Oblikovanje brade', en: 'Beard trim & shape', ru: 'Оформление бороды' }, opis: { sr: 'Konture, skraćivanje, topli peškir i ulje.', en: 'Lines, trim, hot towel and oil.', ru: 'Контуры, подравнивание, горячее полотенце и масло.' }, trajanje: 30, cena: 1100 },
                { id: 'sisanje-brada', naziv: { sr: 'Šišanje + brada', en: 'Haircut + beard', ru: 'Стрижка + борода' }, opis: { sr: 'Kompletan tretman: kosa i brada.', en: 'The full treatment: hair and beard.', ru: 'Комплекс: волосы и борода.' }, trajanje: 75, cena: 2500 },
                { id: 'brijanje', naziv: { sr: 'Klasično brijanje britvom', en: 'Straight-razor shave', ru: 'Бритьё опасной бритвой' }, opis: { sr: 'Topli peškir, pena, britva i balzam.', en: 'Hot towel, lather, razor and balm.', ru: 'Горячее полотенце, пена, бритва и бальзам.' }, trajanje: 40, cena: 1500 },
            ],
        },
        {
            id: 'deca',
            naziv: { sr: 'Dečije šišanje', en: 'Kids’ cuts', ru: 'Детские стрижки' },
            opis: { sr: 'Strpljivo i brzo, za decu do 12 godina.', en: 'Patient and quick, for kids up to 12.', ru: 'Терпеливо и быстро, для детей до 12 лет.' },
            za: ['deca'],
            slika: '/slike/usluga-deca.webp',
            usluge: [
                { id: 'decije', naziv: { sr: 'Dečije šišanje', en: 'Kids’ haircut', ru: 'Детская стрижка' }, opis: { sr: 'Šišanje i kratko feniranje.', en: 'Cut and a quick blow-dry.', ru: 'Стрижка и быстрая укладка.' }, trajanje: 30, cena: 1200 },
            ],
        },
    ],

    /*
     * TIM
     *  usluge: id-jevi kategorija ili pojedinačnih usluga koje radi (prazno = sve).
     *  radniDani: dani kad radi ('pon', 'uto'…) — prazno = svi dani salona.
     */
    tim: [
        {
            id: 'jelena', ime: 'Jelena Marković', slika: '/slike/tim-1.webp', instagram: '',
            uloga: { sr: 'Osnivač · koloristkinja', en: 'Founder · colourist', ru: 'Основатель · колорист' },
            opis: { sr: 'Petnaest godina uz boju — balayage i prirodni plavi tonovi su joj potpis.', en: 'Fifteen years in colour — balayage and natural blondes are her signature.', ru: 'Пятнадцать лет в окрашивании — балаяж и натуральный блонд её визитная карточка.' },
            usluge: ['zensko', 'boja', 'nega'], radniDani: [],
        },
        {
            id: 'ana', ime: 'Ana Ilić', slika: '/slike/tim-2.webp', instagram: '',
            uloga: { sr: 'Frizerka · styling', en: 'Stylist', ru: 'Стилист' },
            opis: { sr: 'Šišanja koja rastu lepo i svečane frizure koje traju celu noć.', en: 'Cuts that grow out beautifully and occasion styles that last all night.', ru: 'Стрижки, которые красиво отрастают, и причёски, которые держатся всю ночь.' },
            usluge: ['zensko', 'nega', 'deca'], radniDani: ['uto', 'sre', 'cet', 'pet', 'sub'],
        },
        {
            id: 'marko', ime: 'Marko Stojanović', slika: '/slike/tim-3.webp', instagram: '',
            uloga: { sr: 'Berberin', en: 'Barber', ru: 'Барбер' },
            opis: { sr: 'Fade, klasični rezovi i brijanje britvom — bez žurbe, sa pažnjom.', en: 'Fades, classic cuts and razor shaves — unhurried and precise.', ru: 'Фейды, классика и бритьё опасной бритвой — без спешки и аккуратно.' },
            usluge: ['berbernica', 'deca', 'maska'], radniDani: [],
        },
        {
            id: 'nikola', ime: 'Nikola Đorđević', slika: '/slike/tim-4.webp', instagram: '',
            uloga: { sr: 'Berberin', en: 'Barber', ru: 'Барбер' },
            opis: { sr: 'Moderni muški rezovi i oblikovanje brade.', en: 'Modern men’s cuts and beard shaping.', ru: 'Современные мужские стрижки и оформление бороды.' },
            usluge: ['berbernica'], radniDani: ['pon', 'sre', 'pet', 'sub'],
        },
    ],

    // GALERIJA — `kategorija` je id iz `kategorije` (za filter) ili prazno.
    galerija: [
        { slika: '/slike/galerija-01.webp', kategorija: 'boja', opis: { sr: 'Balayage u toplim tonovima', en: 'Warm-toned balayage', ru: 'Балаяж в тёплых тонах' } },
        { slika: '/slike/galerija-02.webp', kategorija: 'berbernica', opis: { sr: 'Precizno šišanje makazama', en: 'Precision scissor cut', ru: 'Точная стрижка ножницами' } },
        { slika: '/slike/galerija-03.webp', kategorija: 'boja', opis: { sr: 'Pramenovi u foliji', en: 'Foil highlights', ru: 'Мелирование в фольге' } },
        { slika: '/slike/galerija-04.webp', kategorija: '', opis: { sr: 'Enterijer salona', en: 'The salon', ru: 'Интерьер салона' } },
        { slika: '/slike/galerija-05.webp', kategorija: 'berbernica', opis: { sr: 'Oblikovanje brade', en: 'Beard shaping', ru: 'Оформление бороды' } },
        { slika: '/slike/galerija-06.webp', kategorija: 'boja', opis: { sr: 'Nanošenje boje', en: 'Colour application', ru: 'Нанесение краски' } },
        { slika: '/slike/galerija-07.webp', kategorija: '', opis: { sr: 'Alat zanata', en: 'Tools of the trade', ru: 'Инструменты мастера' } },
        { slika: '/slike/galerija-08.webp', kategorija: 'berbernica', opis: { sr: 'Klasičan muški rez', en: 'Classic men’s cut', ru: 'Классическая мужская стрижка' } },
        { slika: '/slike/galerija-09.webp', kategorija: 'nega', opis: { sr: 'Pranje i nega kose', en: 'Wash and care', ru: 'Мытьё и уход' } },
    ],

    // TEKSTOVI STRANICA
    pocetna: {
        hero: {
            nadnaslov: { sr: 'Beograd · od 2016.', en: 'Belgrade · since 2016', ru: 'Белград · с 2016 года' },
            // Naslov u dva dela: drugi deo dobija akcenat teme (kurziv, boja, verzal…).
            naslov: { sr: 'Kosa koja liči na vas,', en: 'Hair that looks like you,', ru: 'Волосы, похожие на вас,' },
            akcenat: { sr: 'samo bolje', en: 'only better', ru: 'только лучше' },
            uvod: {
                sr: 'Frizerski studio i berbernica pod istim krovom. Pažljiva konsultacija, precizan rez i boja koja se lepo nosi i šest nedelja kasnije.',
                en: 'A hair studio and barbershop under one roof. A careful consultation, a precise cut and colour that still looks good six weeks later.',
                ru: 'Парикмахерская и барбершоп под одной крышей. Внимательная консультация, точная стрижка и цвет, который хорошо смотрится и через шесть недель.',
            },
            slike: ['/slike/hero-1.webp', '/slike/hero-2.webp', '/slike/hero-3.webp'],
        },
        izjava: {
            sr: 'Ne žurimo. Svaki termin počinje razgovorom — o vašoj kosi, navikama i tome koliko vremena ujutru imate za nju.',
            en: 'We don’t rush. Every appointment starts with a conversation — about your hair, your habits and how much time you have for it in the morning.',
            ru: 'Мы не торопимся. Каждый визит начинается с разговора — о ваших волосах, привычках и о том, сколько времени у вас на них по утрам.',
        },
        // Prazan niz = nema trake sa brojevima. 'godine' se računa samo iz `osnovan`.
        brojevi: [
            { vrednost: 'godine', oznaka: { sr: 'godina iskustva', en: 'years of experience', ru: 'лет опыта' } },
            { vrednost: '12.000+', oznaka: { sr: 'zadovoljnih klijenata', en: 'happy clients', ru: 'довольных клиентов' } },
            { vrednost: '4,9', oznaka: { sr: 'prosečna ocena na Google-u', en: 'average Google rating', ru: 'средняя оценка в Google' } },
        ],
        zastoMi: [
            { naslov: { sr: 'Konsultacija pre svakog reza', en: 'A consultation before every cut', ru: 'Консультация перед каждой стрижкой' }, tekst: { sr: 'Pet minuta razgovora uštedi šest nedelja kajanja. Uvek pitamo pre nego što sečemo.', en: 'Five minutes of talking saves six weeks of regret. We always ask before we cut.', ru: 'Пять минут разговора экономят шесть недель сожалений. Мы всегда спрашиваем, прежде чем стричь.' } },
            { naslov: { sr: 'Profesionalna kozmetika', en: 'Professional products', ru: 'Профессиональная косметика' }, tekst: { sr: 'Radimo isključivo sa proverenim profesionalnim linijama za boju i negu.', en: 'We work only with proven professional colour and care lines.', ru: 'Работаем только с проверенными профессиональными линиями для окрашивания и ухода.' } },
            { naslov: { sr: 'Termin koji se poštuje', en: 'Your time, respected', ru: 'Время, которое уважают' }, tekst: { sr: 'Zakazano znači zakazano. Bez čekanja i bez preklapanja klijenata.', en: 'Booked means booked. No waiting, no double-booking.', ru: 'Запись — значит запись. Без ожидания и без накладок.' } },
        ],
        poziv: {
            naslov: { sr: 'Spremni za promenu?', en: 'Ready for a change?', ru: 'Готовы к переменам?' },
            tekst: { sr: 'Izaberite uslugu i termin — potvrdu dobijate porukom.', en: 'Choose a service and time — we’ll confirm by message.', ru: 'Выберите услугу и время — подтверждение придёт сообщением.' },
            slika: '/slike/poziv.webp',
        },
    },

    oNama: {
        naslov: { sr: 'Mali studio, velika pažnja', en: 'A small studio, great care', ru: 'Небольшая студия, большое внимание' },
        tekst: [
            {
                sr: 'Atelje Makaze je nastao 2016. godine iz jedne jednostavne ideje: da odlazak kod frizera bude sat koji je samo vaš. Bez žurbe, bez gužve i bez „uobičajenog”.',
                en: 'Atelje Makaze opened in 2016 with one simple idea: a visit to the hairdresser should be an hour that is entirely yours. No rush, no crowd and no “the usual”.',
                ru: 'Atelje Makaze открылся в 2016 году с простой идеей: визит к парикмахеру должен быть часом, который принадлежит только вам. Без спешки, без толпы и без «как обычно».',
            },
            {
                sr: 'Danas pod istim krovom radi frizerski studio i berbernica. Žene dolaze zbog boje i šišanja koja rastu lepo, muškarci zbog preciznog reza i brijanja britvom — a mnogi dolaze zajedno.',
                en: 'Today a hair studio and a barbershop share the same roof. Women come for colour and cuts that grow out beautifully, men for precise cuts and razor shaves — and many come together.',
                ru: 'Сегодня под одной крышей работают парикмахерская и барбершоп. Женщины приходят за цветом и стрижками, которые красиво отрастают, мужчины — за точной стрижкой и бритьём, а многие приходят вместе.',
            },
            {
                sr: 'Svaki član tima redovno se usavršava, a radimo isključivo sa profesionalnom kozmetikom. Ono što ne bismo stavili na svoju kosu, ne stavljamo ni na vašu.',
                en: 'Everyone on the team trains regularly, and we use only professional products. What we wouldn’t put on our own hair, we won’t put on yours.',
                ru: 'Каждый в команде регулярно повышает квалификацию, и мы используем только профессиональную косметику. Что не нанесли бы на свои волосы, не нанесём и на ваши.',
            },
        ],
        slika: '/slike/o-nama.webp',
        vrednosti: [
            { naslov: { sr: 'Iskrenost', en: 'Honesty', ru: 'Честность' }, tekst: { sr: 'Reći ćemo vam kad nešto neće izgledati kako zamišljate — i predložiti šta hoće.', en: 'We’ll tell you when something won’t look the way you imagine — and suggest what will.', ru: 'Скажем, если что-то не будет выглядеть так, как вы представляете, — и предложим, что подойдёт.' } },
            { naslov: { sr: 'Preciznost', en: 'Precision', ru: 'Точность' }, tekst: { sr: 'Rez, prelaz i nijansa rade se pažljivo, bez prečica.', en: 'Every cut, fade and shade is done carefully, without shortcuts.', ru: 'Стрижка, переход и оттенок — аккуратно, без компромиссов.' } },
            { naslov: { sr: 'Zdrava kosa', en: 'Healthy hair', ru: 'Здоровые волосы' }, tekst: { sr: 'Zaštita i nega u svakom tretmanu, ne kao dodatak.', en: 'Protection and care in every treatment, not as an extra.', ru: 'Защита и уход в каждой процедуре, а не как дополнение.' } },
        ],
    },

    /*
     * RECENZIJE — samo prave, objavljene recenzije (npr. sa Google profila),
     * uz dozvolu autora. Prazna lista = blok se ne prikazuje.
     * DEMO: zameniti pravim recenzijama klijenta pre objave.
     */
    recenzije: {
        prosek: 4.9,
        broj: 186,
        izvor: 'Google',
        lista: [
            { autor: 'Milica R.', ocena: 5, tekst: { sr: 'Prvi put da izađem od frizera tačno sa onim što sam tražila. Balayage je i posle dva meseca predivan.', en: 'The first time I left a salon with exactly what I asked for. The balayage still looks lovely two months on.', ru: 'Впервые вышла от парикмахера ровно с тем, что просила. Балаяж прекрасен и через два месяца.' } },
            { autor: 'Stefan P.', ocena: 5, tekst: { sr: 'Najbolji fade u gradu, a termin je uvek tačno na vreme. Preporuka za brijanje britvom.', en: 'Best fade in town, and always right on time. Highly recommend the razor shave.', ru: 'Лучший фейд в городе, и всегда точно вовремя. Рекомендую бритьё опасной бритвой.' } },
            { autor: 'Ivana K.', ocena: 5, tekst: { sr: 'Prijatna atmosfera, iskren savet i kosa koja se lako sređuje kod kuće.', en: 'Lovely atmosphere, honest advice and hair that’s easy to style at home.', ru: 'Приятная атмосфера, честный совет и волосы, которые легко уложить дома.' } },
        ],
    },

    // Profesionalne linije s kojima salon radi (tekst, bez logotipa). Prazno = nema trake.
    brendovi: ['Kérastase', 'Olaplex', 'Wella Professionals', 'L’Oréal Professionnel', 'American Crew', 'Reuzel'],

    // POKLON VAUČER — prazan tekst = nema bloka.
    poklonVaucer: {
        tekst: {
            sr: 'Poklonite termin. Vaučer u iznosu po izboru, važi šest meseci — preuzmite ga u salonu ili ga šaljemo porukom.',
            en: 'Give the gift of an appointment. A voucher for any amount, valid for six months — pick it up at the salon or we’ll send it by message.',
            ru: 'Подарите визит. Сертификат на любую сумму, действует шесть месяцев — заберите в салоне или получите сообщением.',
        },
    },

    // ČESTA PITANJA — stranica /pitanja i FAQ podaci za Google.
    pitanja: [
        { pitanje: { sr: 'Kako da zakažem termin?', en: 'How do I book?', ru: 'Как записаться?' }, odgovor: { sr: 'Najbrže online, na stranici Zakazivanje: izaberete uslugu, frizera i vreme, a mi vam potvrdu šaljemo porukom. Možete i da nas pozovete ili pišete na WhatsApp/Viber.', en: 'The quickest way is online on the Booking page: choose a service, stylist and time, and we’ll confirm by message. You can also call us or write on WhatsApp/Viber.', ru: 'Быстрее всего онлайн на странице «Запись»: выберите услугу, мастера и время, а мы пришлём подтверждение сообщением. Можно также позвонить или написать в WhatsApp/Viber.' } },
        { pitanje: { sr: 'Šta ako moram da otkažem?', en: 'What if I need to cancel?', ru: 'Что, если нужно отменить запись?' }, odgovor: { sr: 'Otkazivanje je besplatno do 24 sata pre termina — dovoljno je da nam se javite pozivom ili porukom.', en: 'Cancellation is free up to 24 hours before your appointment — just call or message us.', ru: 'Отмена бесплатна не позднее чем за 24 часа — просто позвоните или напишите нам.' } },
        { pitanje: { sr: 'Zašto je cena za boju „od”?', en: 'Why are colour prices “from”?', ru: 'Почему цена окрашивания указана «от»?' }, odgovor: { sr: 'Količina boje i vreme zavise od dužine i gustine kose. Tačnu cenu dobijate na konsultaciji, pre početka rada.', en: 'The amount of colour and time depend on hair length and density. You get the exact price at the consultation, before we start.', ru: 'Количество краски и время зависят от длины и густоты волос. Точную цену вы узнаете на консультации, до начала работы.' } },
        { pitanje: { sr: 'Da li radite konsultacije pre promene boje?', en: 'Do you offer consultations before a colour change?', ru: 'Проводите ли вы консультации перед сменой цвета?' }, odgovor: { sr: 'Da, kratka konsultacija je besplatna. Za veće promene preporučujemo test pramena dan ranije.', en: 'Yes, a short consultation is free. For bigger changes we recommend a strand test the day before.', ru: 'Да, короткая консультация бесплатна. Для серьёзных изменений рекомендуем тест пряди накануне.' } },
        { pitanje: { sr: 'Kako mogu da platim?', en: 'How can I pay?', ru: 'Как можно оплатить?' }, odgovor: { sr: 'Gotovinom i platnim karticama (Visa, Mastercard, Dina).', en: 'Cash and cards (Visa, Mastercard, Dina).', ru: 'Наличными и картами (Visa, Mastercard, Dina).' } },
        { pitanje: { sr: 'Da li šišate decu?', en: 'Do you cut children’s hair?', ru: 'Стрижёте ли вы детей?' }, odgovor: { sr: 'Da, decu do 12 godina, uz strpljenje i bez žurbe.', en: 'Yes, children up to 12, patiently and without rushing.', ru: 'Да, детей до 12 лет — терпеливо и без спешки.' } },
    ],

    placanje: ['Gotovina', 'Visa', 'Mastercard', 'Dina'],

    // ANALITIKA — učitava se tek kad posetilac prihvati kolačiće. Prazno = nema.
    analitika: {
        ga4: '', // npr. 'G-XXXXXXXXXX'
        metaPixel: '', // npr. '1234567890'
    },

    seo: {
        // Slika za deljenje linka (1200×630) u public/.
        slikaZaDeljenje: '/og-slika.jpg',
        /*
         * Naslov i opis po stranici, po želji po jeziku; prazno = podrazumevani
         * tekst iz src/i18n. Ključevi: pocetna, cenovnik, tim, galerija, oNama,
         * zakazivanje, kontakt, pitanja.
         *   cenovnik: { naslov: { sr: '…', en: '…' }, opis: '…' }
         */
        stranice: {},
    },
};
