/*
 * PROVERA PRE OBJAVE — `npm run provera`
 *
 * Prolazi kroz src/config/salon.js i public/ i kaže šta je ostalo od demo
 * sadržaja ili nije popunjeno. Greške (✗) zaustavljaju `npm run provera`;
 * upozorenja (!) samo informišu. `npm run build` je pokreće u blagom režimu
 * (--blago): ispisuje sve, ali ne prekida build — da bi demo mogao da se gradi.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const koren = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const { salon } = await import(pathToFileURL(path.join(koren, 'src/config/salon.js')).href);
const { TEME } = await import(pathToFileURL(path.join(koren, 'src/config/teme.js')).href);
const blago = process.argv.includes('--blago');

const greske = [];
const upozorenja = [];
const g = (m) => greske.push(m);
const u = (m) => upozorenja.push(m);
const tekst = (v) => (v && typeof v === 'object' ? v.sr : v) || '';

if (salon.demo) g('`demo: true` — sajt je zaključan za Google (noindex) i prikazuje birač tema. Prebaci na `false` kad su podaci pravi.');
if (!/^https:\/\/[^/]+[^/]$/.test(salon.domen || '')) g('`domen` mora biti puna https adresa bez kose crte na kraju, npr. https://www.salon.rs');
if (/ateljemakaze|example|primer/i.test(salon.domen)) g(`\`domen\` je još demo (${salon.domen}).`);
const temaId = typeof salon.tema === 'string' ? salon.tema : salon.tema?.osnova;
if (!TEME[temaId]) g(`Nepoznata tema „${temaId}”. Postoje: ${Object.keys(TEME).join(', ')}.`);

const k = salon.kontakt;
if (!/^\+\d{9,15}$/.test(k.telefon || '')) g('`kontakt.telefon` mora biti u formatu +3816…');
if (/1234567/.test(k.telefon)) g('`kontakt.telefon` je demo broj.');
if (k.email && /ateljemakaze/.test(k.email)) g('`kontakt.email` je demo adresa.');
for (const m of ['instagram', 'facebook']) if (k[m] && /ateljemakaze/.test(k[m])) u(`\`kontakt.${m}\` je demo profil — upiši pravi ili ostavi prazno.`);

const f = salon.firma;
if (!/^\d{9}$/.test(f.pib) || /^0+$/.test(f.pib)) g('`firma.pib` — 9 cifara, pravi PIB (proveri na apr.gov.rs).');
if (!/^\d{8}$/.test(f.maticniBroj) || /^0+$/.test(f.maticniBroj)) g('`firma.maticniBroj` — 8 cifara, pravi matični broj.');
if (/Petar Petrović/.test(f.naziv)) g('`firma.naziv` je demo.');

const z = salon.zakazivanje;
if (z.nacin === 'link' && !/^https?:\/\//.test(z.link)) g('`zakazivanje.nacin: \'link\'` traži `zakazivanje.link` (npr. SrediMe ili Fresha adresu).');
if (z.nacin === 'zahtev') {
    if (z.kanal.tip === 'webhook' && !/^https:\/\//.test(z.kanal.url)) g('`zakazivanje.kanal.tip: \'webhook\'` traži https `kanal.url`.');
    if (z.kanal.tip === 'whatsapp' && !k.whatsapp) g('Kanal je WhatsApp, a `kontakt.whatsapp` je prazan.');
    if (z.kanal.tip === 'viber' && !k.viber) g('Kanal je Viber, a `kontakt.viber` je prazan.');
    if (z.kanal.tip === 'email' && !k.email) g('Kanal je e-mail, a `kontakt.email` je prazan.');
    if (z.kanal.tip !== 'webhook') u(`Zahtevi stižu preko „${z.kanal.tip}” — klijent mora da pošalje poruku iz aplikacije. Webhook (Formspree, Make, n8n…) je pouzdaniji.`);
}

const ids = new Set();
for (const kat of salon.kategorije) {
    for (const s of kat.usluge) {
        if (ids.has(s.id)) g(`Usluga „${s.id}” se ponavlja — id mora biti jedinstven.`);
        ids.add(s.id);
        if (!(s.trajanje > 0)) g(`Usluga „${s.id}” nema \`trajanje\`.`);
        if (!(s.cena > 0)) g(`Usluga „${s.id}” nema \`cenu\`.`);
    }
}
const katIds = new Set(salon.kategorije.map((x) => x.id));
for (const r of salon.tim) for (const id of r.usluge ?? []) if (!katIds.has(id) && !ids.has(id)) g(`Član tima „${r.id}” radi „${id}”, a takva kategorija/usluga ne postoji.`);
for (const gl of salon.galerija) if (gl.kategorija && !katIds.has(gl.kategorija)) u(`Galerija: kategorija „${gl.kategorija}” ne postoji.`);

for (const [dan, v] of Object.entries(salon.radnoVreme)) {
    if (v && (!/^\d\d:\d\d$/.test(v[0]) || !/^\d\d:\d\d$/.test(v[1]) || v[0] >= v[1])) g(`Radno vreme za „${dan}” nije ispravno (${v}).`);
}

// Fotografije
const slike = [
    ...(salon.pocetna.hero.slike ?? []), salon.pocetna.poziv?.slika, salon.oNama.slika,
    ...salon.kategorije.map((x) => x.slika), ...salon.tim.map((r) => r.slika), ...salon.galerija.map((x) => x.slika),
].filter((s) => s && s.startsWith('/'));
const nema = slike.filter((s) => !fs.existsSync(path.join(koren, 'public', s)));
if (nema.length) (salon.demo ? u : g)(`Nedostaje ${nema.length} fotografija u public/: ${nema.slice(0, 6).join(', ')}${nema.length > 6 ? '…' : ''} (do tada se prikazuje zamena u bojama teme).`);
if (!fs.existsSync(path.join(koren, 'public', (salon.seo?.slikaZaDeljenje || '/og-slika.jpg').replace(/^\//, '')))) u('Nema slike za deljenje (public/og-slika.jpg, 1200×630) — build je pravi iz prve fotografije heroja sa nazivom salona.');

// Prevodi
for (const j of salon.jezici ?? []) {
    if (j === 'sr') continue;
    const fale = [];
    const proveri = (v, gde) => { if (v && typeof v === 'object' && !Array.isArray(v) && 'sr' in v && !(j in v)) fale.push(gde); };
    proveri(salon.slogan, 'slogan'); proveri(salon.opis, 'opis');
    salon.kategorije.forEach((x) => { proveri(x.naziv, `kategorija ${x.id}`); x.usluge.forEach((s) => proveri(s.naziv, `usluga ${s.id}`)); });
    if (typeof salon.opis === 'string') fale.push('opis (običan tekst — isti na svim jezicima)');
    if (fale.length) u(`Jezik „${j}”: nema prevoda za ${fale.slice(0, 5).join(', ')}${fale.length > 5 ? ` i još ${fale.length - 5}` : ''} — prikazuje se srpski.`);
}
if ((salon.recenzije?.lista ?? []).some((r) => /Milica R\.|Stefan P\.|Ivana K\./.test(r.autor))) g('Recenzije su demo — zameni ih pravim (sa Google profila, uz dozvolu) ili isprazni listu.');

console.log('\nProvera salon.js\n');
for (const m of greske) console.log(`  ✗ ${m}`);
for (const m of upozorenja) console.log(`  ! ${m}`);
if (!greske.length && !upozorenja.length) console.log('  ✓ Sve je popunjeno.');
console.log(`\n  ${greske.length} grešaka, ${upozorenja.length} upozorenja.\n`);
if (greske.length && !blago) process.exit(1);
