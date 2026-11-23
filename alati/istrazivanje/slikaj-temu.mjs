/*
 * SNIMCI NAŠE TEME — za poređenje sa referencom (izlaz/<tema>/…).
 *
 *   node alati/istrazivanje/slikaj-temu.mjs <tema> <port>
 *   node alati/istrazivanje/slikaj-temu.mjs soho 5181 --strane pocetna,cenovnik,ru:pocetna --samo telefon
 *
 * Pokreće SOPSTVENI Vite dev server na zadatom portu (više tema može paralelno,
 * svaka na svom portu), otvara stranice sa ?tema=<tema> i snima ih ekran po
 * ekran na desktopu (1440×900) i telefonu (390×844), plus header posle skrola i
 * otvoren mobilni meni. Izlaz: alati/istrazivanje/izlaz/nas/<tema>/<ekran>/…
 * Konzolne greške stranice idu u greske.txt.
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright-core';

const koren = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const [tema, portArg] = process.argv.slice(2);
const port = Number(portArg) || 5180;
const arg = (ime) => { const i = process.argv.indexOf(ime); return i > 0 ? process.argv[i + 1] : null; };
// Stranice po KLJUČU (Git Bash pretvara '/…' argumente u Windows putanje): pocetna, cenovnik, en:cenovnik, ru:pocetna…
const { putanja } = await import(pathToFileURL(path.join(koren, 'src/i18n/jezici.js')).href);
const STRANE = (arg('--strane') || 'pocetna,cenovnik,kontakt,tim').split(',').map((k) => { const [j, kl] = k.includes(':') ? k.split(':') : ['sr', k]; return putanja(kl, j); });
const samo = arg('--samo');
const EKRANI = {
    desktop: { viewport: { width: 1440, height: 900 } },
    telefon: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
};
if (!tema) { console.error('node slikaj-temu.mjs <tema> <port>'); process.exit(1); }
const CHROME = ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find((p) => fs.existsSync(p));

const server = spawn(process.execPath, [path.join(koren, 'node_modules/vite/bin/vite.js'), '--port', String(port), '--strictPort'], { cwd: koren, stdio: 'ignore' });
const zaustavi = () => { try { server.kill(); } catch { /* */ } };
process.on('exit', zaustavi);
for (let i = 0; ; i++) {
    try { if ((await fetch(`http://localhost:${port}/`)).ok) break; } catch { /* */ }
    if (i > 80) { console.error('dev server nije krenuo'); process.exit(1); }
    await new Promise((r) => setTimeout(r, 500));
}

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const greske = [];
for (const [ekran, opcije] of Object.entries(EKRANI)) {
    if (samo && samo !== ekran) continue;
    const dir = path.join(koren, 'alati/istrazivanje/izlaz/nas', tema, ekran);
    fs.rmSync(dir, { recursive: true, force: true });
    fs.mkdirSync(dir, { recursive: true });
    const ctx = await browser.newContext(opcije);
    const page = await ctx.newPage();
    page.on('console', (m) => { if (m.type() === 'error') greske.push(`[${ekran}] ${m.text().slice(0, 300)}`); });
    page.on('pageerror', (e) => greske.push(`[${ekran}] ${String(e.message).slice(0, 300)}`));
    for (const strana of STRANE) {
        const ime = strana === '/' ? 'pocetna' : strana.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '');
        await page.goto(`http://localhost:${port}${strana}?tema=${tema}`, { waitUntil: 'networkidle' }).catch(() => {});
        await page.waitForTimeout(2200);
        await page.addStyleTag({ content: '[data-izuzmi-kontrast]{display:none!important}' });
        const visina = await page.evaluate(() => document.documentElement.scrollHeight);
        const vh = opcije.viewport.height;
        let n = 0;
        for (let y = 0; y < visina && n < (strana === '/' ? 16 : 5); y += Math.round(vh * 0.9), n++) {
            await page.evaluate((yy) => window.scrollTo(0, yy), y);
            await page.waitForTimeout(1100);
            await page.screenshot({ path: path.join(dir, `${ime}-${String(n).padStart(2, '0')}.jpg`), type: 'jpeg', quality: 68 });
        }
        if (strana === '/') {
            await page.evaluate(() => window.scrollBy(0, -300));
            await page.waitForTimeout(700);
            await page.screenshot({ path: path.join(dir, 'header-skrol-nagore.jpg'), type: 'jpeg', quality: 68 });
            if (ekran === 'telefon') {
                await page.evaluate(() => window.scrollTo(0, 0));
                await page.waitForTimeout(500);
                const dugme = await page.$('button[aria-controls][aria-expanded="false"]');
                if (dugme) {
                    await dugme.click();
                    await page.waitForTimeout(1200);
                    await page.screenshot({ path: path.join(dir, 'meni-otvoren.jpg'), type: 'jpeg', quality: 70 });
                    await page.keyboard.press('Escape');
                }
            }
        }
    }
    await ctx.close();
}
await browser.close();
zaustavi();
fs.writeFileSync(path.join(koren, 'alati/istrazivanje/izlaz/nas', tema, 'greske.txt'), greske.join('\n') || 'nema grešaka');
console.log(`✓ ${tema}: izlaz/nas/${tema}/ (${greske.length} grešaka u konzoli)`);
process.exit(0);
