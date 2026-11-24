/*
 * PROVERA PANELA — sve stranice /panel za svaku ulogu, desktop i telefon,
 * svetla i tamna tema: greške u konzoli, prelivanje u širinu, snimci.
 *
 *   node alati/istrazivanje/proveri-panel.mjs [port=3000] [--snimci]
 *
 * Radi nad `npm run dev` (ili vite preview) na zadatom portu.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright-core';

const koren = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const { STAVKE, RASPORED_MENIJA } = await import(pathToFileURL(path.join(koren, 'src/panel/meni.js')).href);
const PORT = Number(process.argv.find((a) => /^\d+$/.test(a)) ?? 3000);
const SNIMCI = process.argv.includes('--snimci');
const izlaz = path.join(koren, 'alati/istrazivanje/izlaz/panel');
fs.mkdirSync(izlaz, { recursive: true });
const CHROME = ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find((p) => fs.existsSync(p));

const SESIJE = {
    administrator: { uloga: 'administrator', radnikId: null, ime: 'Petar Petrović', email: 'vlasnik@demo.rs' },
    menadzer: { uloga: 'menadzer', radnikId: null, ime: 'Jelena Marković', email: 'jelena@demo.rs' },
    recepcija: { uloga: 'recepcija', radnikId: null, ime: 'Milica Pavlović', email: 'recepcija@demo.rs' },
    zaposleni: { uloga: 'zaposleni', radnikId: 'ana', ime: 'Ana Ilić', email: 'ana@demo.rs' },
};
const EKRANI = { desktop: { viewport: { width: 1680, height: 1000 } }, telefon: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } };

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const izvestaj = [];
let problema = 0;
const SAMO = process.argv.find((a) => a.startsWith('--uloga='))?.slice(8);
for (const [uloga, sesija] of Object.entries(SESIJE).filter(([u]) => !SAMO || u === SAMO)) {
    const rute = [...new Set(RASPORED_MENIJA[uloga].flatMap((g) => g.stavke.map((k) => STAVKE[k].ruta)))];
    if (uloga === 'administrator') rute.push('klijenti/k1005');
    const SAMO_EKRAN = process.argv.find((a) => a.startsWith('--ekran='))?.slice(8);
    for (const [ekran, o] of Object.entries(EKRANI).filter(([e]) => !SAMO_EKRAN || e === SAMO_EKRAN)) {
        for (const tamno of uloga === 'administrator' && !process.argv.includes('--bez-tamne') ? [false, true] : [false]) {
            const ctx = await browser.newContext(o);
            await ctx.addInitScript(([s, t]) => { localStorage.setItem('panel-demo-sesija', JSON.stringify(s)); localStorage.setItem('panel-tamno', JSON.stringify(t)); }, [sesija, tamno]);
            const page = await ctx.newPage();
            let greske = [];
            page.on('console', (m) => { if (m.type() === 'error') greske.push(m.text().slice(0, 220)); });
            page.on('pageerror', (e) => greske.push(String(e.message).slice(0, 220)));
            for (const ruta of rute) {
                greske = [];
                await page.goto(`http://localhost:${PORT}/panel${ruta ? `/${ruta}` : ''}`, { waitUntil: 'networkidle' }).catch(() => {});
                await page.waitForTimeout(500);
                const stanje = await page.evaluate(() => ({
                    sirina: document.documentElement.scrollWidth - innerWidth,
                    h1: document.querySelector('main h1')?.textContent ?? '',
                    nemaPristupa: !!document.body.textContent.includes('nije za vašu ulogu'),
                    siroki: [...document.querySelectorAll('main *')].filter((e) => e.getBoundingClientRect().right > innerWidth + 2 && !e.closest('.overflow-x-auto, .overflow-auto')).slice(0, 3).map((e) => `${e.tagName}.${String(e.className).slice(0, 50)}`),
                }));
                const loše = greske.length || stanje.sirina > 2 || !stanje.h1 || stanje.nemaPristupa;
                if (loše) problema++;
                izvestaj.push(`${loše ? '✗' : '✓'} ${uloga} ${ekran}${tamno ? ' tamno' : ''} /${ruta}: ${stanje.h1 || '(bez naslova)'}${stanje.sirina > 2 ? ` · PRELIVA ${stanje.sirina}px ${stanje.siroki.join(', ')}` : ''}${stanje.nemaPristupa ? ' · NEMA PRISTUPA' : ''}${greske.length ? ` · GREŠKE: ${[...new Set(greske)].slice(0, 2).join(' | ')}` : ''}`);
                if (SNIMCI && !tamno && (uloga === 'administrator' || !ruta)) await page.screenshot({ path: path.join(izlaz, `${uloga}-${ekran}-${(ruta || 'pocetna').replace(/\//g, '_')}.jpg`), type: 'jpeg', quality: 60, fullPage: ekran === 'telefon' });
                if (SNIMCI && tamno && ['', 'kalendar', 'analitika'].includes(ruta)) await page.screenshot({ path: path.join(izlaz, `tamno-${ekran}-${ruta || 'pocetna'}.jpg`), type: 'jpeg', quality: 60 });
            }
            await ctx.close();
        }
    }
}
await browser.close();
fs.writeFileSync(path.join(izlaz, 'izvestaj.txt'), izvestaj.join('\n'));
console.log(izvestaj.filter((l) => l.startsWith('✗')).join('\n') || 'sve stranice bez problema');
console.log(`\n${izvestaj.length} provera, ${problema} sa problemom — izlaz/panel/izvestaj.txt`);
