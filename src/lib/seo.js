/*
 * SEO — naslov, opis, canonical, hreflang, Open Graph i JSON-LD za svaku
 * stranicu na svakom jeziku. Isti kod koristi prerender (statički <head> u
 * dist/) i browser (pri promeni stranice), pa se nikad ne raziđu.
 */
import { salon } from '../config/salon.js';
import { SVI_JEZICI, putanja, tx, RUTE } from '../i18n/jezici.js';
import { recnik } from '../i18n/index.js';
import { DANI_PO_INDEKSU } from './vreme.js';
import { sveUsluge } from './zakazivanje.js';
import { DOMEN, apsolutno } from './baza.js';

export const aktivniJezici = () => (salon.jezici?.length ? salon.jezici : ['sr']).filter((j) => SVI_JEZICI[j]);

/** Stranice koje idu u sitemap (pravne su indeksirane, ali niskog prioriteta). */
export const INDEKSIRANE = Object.keys(RUTE);

const DAN_SCHEMA = { pon: 'Monday', uto: 'Tuesday', sre: 'Wednesday', cet: 'Thursday', pet: 'Friday', sub: 'Saturday', ned: 'Sunday' };


const podaciZaTekst = (jezik) => ({
    naziv: salon.naziv,
    slogan: tx(salon.slogan, jezik),
    grad: tx(salon.lokacija.grad, jezik),
    adresa: salon.lokacija.adresa,
});

const naslovOpis = (kljuc, jezik) => {
    const t = recnik(jezik).seo;
    const s = podaciZaTekst(jezik);
    const pravno = ['privatnost', 'uslovi', 'kolacici'].includes(kljuc);
    const podr = {
        naslov: t[kljuc] ? t[kljuc](s) : salon.naziv,
        opis: kljuc === 'pocetna' ? tx(salon.opis, jezik) : pravno ? t.pravnoOpis(s) : (t[`${kljuc}Opis`]?.(s) ?? tx(salon.opis, jezik)),
    };
    const pregaz = salon.seo?.stranice?.[kljuc] ?? {};
    return {
        naslov: tx(pregaz.naslov, jezik) || podr.naslov,
        opis: tx(pregaz.opis, jezik) || podr.opis,
    };
};

const schemaPreduzeca = (jezik) => {
    const id = `${DOMEN}/#salon`;
    const k = salon.kontakt;
    const l = salon.lokacija;
    const sameAs = [k.instagram, k.facebook, k.tiktok].filter(Boolean);
    const sati = Object.entries(salon.radnoVreme)
        .filter(([, v]) => v)
        .map(([dan, [od, do_]]) => ({ '@type': 'OpeningHoursSpecification', dayOfWeek: `https://schema.org/${DAN_SCHEMA[dan]}`, opens: od, closes: do_ }));
    const specijalni = (salon.neradniDani ?? []).map((n) => ({
        '@type': 'OpeningHoursSpecification', validFrom: n.datum, validThrough: n.datum, opens: '00:00', closes: '00:00',
    }));
    const cene = sveUsluge(salon).map((u) => u.cena).filter(Boolean);
    return {
        '@type': salon.tip === 'berbernica' ? 'BarberShop' : 'HairSalon',
        '@id': id,
        name: salon.naziv,
        description: tx(salon.opis, jezik),
        url: apsolutno(putanja('pocetna', jezik)),
        telephone: k.telefon,
        email: k.email || undefined,
        image: apsolutno(salon.seo?.slikaZaDeljenje || '/og-slika.jpg'),
        logo: apsolutno('/ikona-512.png'),
        priceRange: cene.length ? `${Math.min(...cene)}–${Math.max(...cene)} RSD` : undefined,
        currenciesAccepted: 'RSD',
        paymentAccepted: (salon.placanje ?? []).join(', ') || undefined,
        foundingDate: salon.osnovan ? String(salon.osnovan) : undefined,
        address: {
            '@type': 'PostalAddress',
            streetAddress: l.adresa,
            postalCode: l.postanskiBroj,
            addressLocality: tx(l.grad, jezik),
            addressCountry: l.drzava || 'RS',
        },
        geo: l.koordinate ? { '@type': 'GeoCoordinates', latitude: l.koordinate.lat, longitude: l.koordinate.lng } : undefined,
        hasMap: l.googleMape || (l.koordinate ? `https://www.google.com/maps?q=${l.koordinate.lat},${l.koordinate.lng}` : undefined),
        openingHoursSpecification: [...sati, ...specijalni],
        sameAs: sameAs.length ? sameAs : undefined,
    };
};

const katalog = (jezik) => ({
    '@type': 'OfferCatalog',
    name: recnik(jezik).cenovnik.naslov,
    itemListElement: salon.kategorije.map((k) => ({
        '@type': 'OfferCatalog',
        name: tx(k.naziv, jezik),
        itemListElement: k.usluge.map((u) => ({
            '@type': 'Offer',
            price: u.cena,
            priceCurrency: 'RSD',
            ...(u.cenaOd ? { priceSpecification: { '@type': 'PriceSpecification', minPrice: u.cena, priceCurrency: 'RSD' } } : {}),
            itemOffered: { '@type': 'Service', name: tx(u.naziv, jezik), description: tx(u.opis, jezik) || undefined },
        })),
    })),
});

const mrvice = (kljuc, jezik, naslov) => ({
    '@type': 'BreadcrumbList',
    itemListElement: [
        { '@type': 'ListItem', position: 1, name: recnik(jezik).nav.pocetna, item: apsolutno(putanja('pocetna', jezik)) },
        { '@type': 'ListItem', position: 2, name: naslov, item: apsolutno(putanja(kljuc, jezik)) },
    ],
});

/** Kompletni meta podaci za stranicu. `kljuc` null = 404. */
export const metaStranice = (kljuc, jezik) => {
    const jezici = aktivniJezici();
    const lang = SVI_JEZICI[jezik];
    if (!kljuc) {
        const t = recnik(jezik).nijePronadjeno;
        return { lang: jezik, naslov: `${t.naslov} — ${salon.naziv}`, opis: t.tekst, robots: 'noindex, follow', alternativni: [], jsonLd: null };
    }
    const { naslov, opis } = naslovOpis(kljuc, jezik);
    const canonical = apsolutno(putanja(kljuc, jezik));
    const alternativni = jezici.map((j) => ({ hreflang: j, href: apsolutno(putanja(kljuc, j)) }));
    if (jezici.length > 1) alternativni.push({ hreflang: 'x-default', href: apsolutno(putanja(kljuc, jezici[0])) });

    const graf = [];
    const biz = schemaPreduzeca(jezik);
    if (kljuc === 'pocetna') {
        graf.push({ '@type': 'WebSite', '@id': `${DOMEN}/#sajt`, url: canonical, name: salon.naziv, inLanguage: lang.locale, publisher: { '@id': biz['@id'] } });
        graf.push(biz);
    } else if (kljuc === 'cenovnik') {
        graf.push({ ...biz, hasOfferCatalog: katalog(jezik) });
    } else if (kljuc === 'kontakt') {
        graf.push(biz);
    } else if (kljuc === 'pitanja' && salon.pitanja?.length) {
        graf.push({
            '@type': 'FAQPage',
            mainEntity: salon.pitanja.map((p) => ({ '@type': 'Question', name: tx(p.pitanje, jezik), acceptedAnswer: { '@type': 'Answer', text: tx(p.odgovor, jezik) } })),
        });
    } else if (kljuc === 'tim') {
        graf.push({ ...biz, employee: salon.tim.map((r) => ({ '@type': 'Person', name: r.ime, jobTitle: tx(r.uloga, jezik) })) });
    }
    if (kljuc !== 'pocetna') graf.push(mrvice(kljuc, jezik, naslov.split(' — ')[0]));

    return {
        lang: jezik,
        locale: lang.locale,
        naslov,
        opis,
        canonical,
        alternativni,
        robots: salon.demo ? 'noindex, nofollow' : 'index, follow, max-image-preview:large',
        og: {
            type: 'website', title: naslov, description: opis, url: canonical,
            image: apsolutno(salon.seo?.slikaZaDeljenje || '/og-slika.jpg'), locale: lang.og,
            alternate: jezici.filter((j) => j !== jezik).map((j) => SVI_JEZICI[j].og), siteName: salon.naziv,
        },
        jsonLd: graf.length ? { '@context': 'https://schema.org', '@graph': graf } : null,
    };
};

const html = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

/** <head> deo kao HTML (za prerender). */
export const headHtml = (m) => {
    const r = [
        `<title>${html(m.naslov)}</title>`,
        `<meta name="description" content="${html(m.opis)}">`,
        `<meta name="robots" content="${m.robots}">`,
    ];
    if (m.canonical) r.push(`<link rel="canonical" href="${m.canonical}">`);
    for (const a of m.alternativni) r.push(`<link rel="alternate" hreflang="${a.hreflang}" href="${a.href}">`);
    if (m.og) {
        const o = m.og;
        r.push(
            `<meta property="og:type" content="${o.type}">`, `<meta property="og:site_name" content="${html(o.siteName)}">`,
            `<meta property="og:title" content="${html(o.title)}">`, `<meta property="og:description" content="${html(o.description)}">`,
            `<meta property="og:url" content="${o.url}">`, `<meta property="og:image" content="${o.image}">`,
            `<meta property="og:image:width" content="1200">`, `<meta property="og:image:height" content="630">`,
            `<meta property="og:locale" content="${o.locale}">`,
            ...o.alternate.map((a) => `<meta property="og:locale:alternate" content="${a}">`),
            `<meta name="twitter:card" content="summary_large_image">`,
        );
    }
    if (m.jsonLd) r.push(`<script type="application/ld+json">${JSON.stringify(m.jsonLd).replace(/</g, '\\u003c')}</script>`);
    return r.join('\n    ');
};

/** U browseru: osvežava <head> pri promeni stranice. */
export const primeniMeta = (m) => {
    document.title = m.naslov;
    document.documentElement.lang = m.lang;
    const meta = (sel, attr, val) => {
        let el = document.head.querySelector(sel);
        if (!el) {
            el = document.createElement('meta');
            const [, k, v] = /\[(\w+(?::\w+)?)="([^"]+)"\]/.exec(sel) ?? [];
            if (k) el.setAttribute(k, v);
            document.head.appendChild(el);
        }
        el.setAttribute(attr, val);
    };
    meta('meta[name="description"]', 'content', m.opis);
    meta('meta[name="robots"]', 'content', m.robots);
    if (m.og) {
        meta('meta[property="og:title"]', 'content', m.og.title);
        meta('meta[property="og:description"]', 'content', m.og.description);
        meta('meta[property="og:url"]', 'content', m.og.url);
    }
    let can = document.head.querySelector('link[rel="canonical"]');
    if (m.canonical) {
        if (!can) { can = document.createElement('link'); can.rel = 'canonical'; document.head.appendChild(can); }
        can.href = m.canonical;
    }
    document.head.querySelectorAll('link[rel="alternate"][hreflang]').forEach((e) => e.remove());
    for (const a of m.alternativni) {
        const l = document.createElement('link');
        l.rel = 'alternate'; l.hreflang = a.hreflang; l.href = a.href;
        document.head.appendChild(l);
    }
    document.head.querySelectorAll('script[type="application/ld+json"]').forEach((e) => e.remove());
    if (m.jsonLd) {
        const s = document.createElement('script');
        s.type = 'application/ld+json';
        s.textContent = JSON.stringify(m.jsonLd);
        document.head.appendChild(s);
    }
};

export { DANI_PO_INDEKSU };
