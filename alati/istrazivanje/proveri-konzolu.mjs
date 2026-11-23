/*
 * GREŠKE U KONZOLI + snimci delova — gotov sajt (dist/), sve teme.
 *
 *   npm run build && node alati/istrazivanje/proveri-konzolu.mjs
 *
 * Za svaku temu otvara početnu, cenovnik, zakazivanje i rusku početnu na
 * telefonu i desktopu, beleži greške konzole (i hidratacije), i snima traku
 * brendova i footer (izlaz/delovi/<tema>-*.jpg).
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chromium } from 'playwright-core';

const koren = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const { TEME } = await import(pathToFileURL(path.join(koren, 'src/config/teme.js')).href);
const PORT = 4180;
const izlaz = path.join(koren, 'alati/istrazivanje/izlaz/delovi');
fs.mkdirSync(izlaz, { recursive: true });
const CHROME = ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find((p) => fs.existsSync(p));
const server = spawn(process.execPath, [path.join(koren, 'node_modules/vite/bin/vite.js'), 'preview', '--port', String(PORT), '--strictPort'], { cwd: koren, stdio: 'ignore' });
process.on("exit", () => { try { server.kill(); } catch { /* */ } });
for (let i = 0; ; i++) { try { if ((await fetch(`http://localhost:${PORT}/`)).ok) break; } catch { /* */ } if (i > 240) throw new Error("preview nije krenuo"); await new Promise((r) => setTimeout(r, 500)); }

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const izvestaj = [];
for (const tema of Object.keys(TEME)) {
    for (const [ekran, o] of Object.entries({ desktop: { viewport: { width: 1440, height: 900 } }, telefon: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } })) {
        const ctx = await browser.newContext(o);
        const page = await ctx.newPage();
        const greske = [];
        page.on('console', (m) => { if (m.type() === 'error') greske.push(m.text().slice(0, 200)); });
        page.on('pageerror', (e) => greske.push(String(e.message).slice(0, 200)));
        for (const strana of ['/', '/cenovnik/', '/zakazivanje/', '/ru/']) {
            await page.goto(`http://localhost:${PORT}${strana}?tema=${tema}`, { waitUntil: 'networkidle' }).catch(() => {});
            await page.waitForTimeout(900);
            if (strana === '/') {
                const brend = await page.$('.brend');
                if (brend) { await brend.evaluate((e) => e.scrollIntoView({ block: "center" })); await page.waitForTimeout(700); await page.screenshot({ path: path.join(izlaz, `${tema}-${ekran}-brendovi.jpg`), type: 'jpeg', quality: 65 }); }
                const kartice = await page.$('.placanje-footer');
                if (kartice) { await kartice.evaluate((e) => e.scrollIntoView({ block: "center" })); await page.waitForTimeout(500); await page.screenshot({ path: path.join(izlaz, `${tema}-${ekran}-footer.jpg`), type: 'jpeg', quality: 65 }); }
                const n = await page.evaluate(() => ({ brendova: document.querySelectorAll('a.brend').length, logo: document.querySelectorAll('img.logo-brenda').length, kartica: document.querySelectorAll('.placanje-footer .kartica-placanja').length }));
                izvestaj.push(`${tema} ${ekran}: ${n.brendova} linkova brendova, ${n.logo} logotipa, ${n.kartica} kartica u footeru`);
            }
        }
        izvestaj.push(`${tema} ${ekran}: ${greske.length ? `GREŠKE (${greske.length}): ${[...new Set(greske)].slice(0, 3).join(' | ')}` : 'bez grešaka'}`);
        await ctx.close();
    }
}
await browser.close();
server.kill();
fs.writeFileSync(path.join(izlaz, 'izvestaj.txt'), izvestaj.join('\n'));
console.log(izvestaj.join('\n'));
process.exit(0);
