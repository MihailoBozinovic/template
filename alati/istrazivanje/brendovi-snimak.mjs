import { chromium } from 'playwright-core';
import { spawn } from 'node:child_process';
import path from 'node:path';
const koren = process.cwd();
const server = spawn(process.execPath, [path.join(koren, 'node_modules/vite/bin/vite.js'), 'preview', '--port', '4180', '--strictPort'], { cwd: koren, stdio: 'ignore' });
process.on('exit', () => server.kill());
for (let i = 0; i < 240; i++) { try { if ((await fetch('http://localhost:4180/')).ok) break; } catch {} await new Promise((r) => setTimeout(r, 500)); }
const b = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const teme = process.argv.slice(2);
for (const tema of teme) for (const ekran of ['desktop', 'telefon']) {
  const c = await b.newContext(ekran === 'telefon' ? { viewport: { width: 390, height: 844 }, isMobile: true, deviceScaleFactor: 2 } : { viewport: { width: 1440, height: 900 } });
  const p = await c.newPage();
  const greske = []; p.on('pageerror', (e) => greske.push(e.message)); p.on('console', (m) => m.type() === 'error' && greske.push(m.text()));
  await p.goto(`http://localhost:4180/?tema=${tema}`, { waitUntil: 'networkidle' });
  await p.waitForTimeout(800);
  await p.addStyleTag({ content: '[data-izuzmi-kontrast]{display:none!important} html{scroll-behavior:auto!important}' });
  const ok = await p.evaluate(() => { const e = document.querySelector('.logotipi-red, .logotipi-traka'); if (!e) return false; const s = e.closest('section') || e; window.scrollTo(0, s.getBoundingClientRect().top + scrollY - 40); return true; });
  await p.waitForTimeout(1800);
  if (ok) await p.screenshot({ path: `alati/istrazivanje/izlaz/delovi/${tema}-${ekran}-brendovi.jpg`, type: 'jpeg', quality: 70 });
  const n = await p.evaluate(() => [...document.querySelectorAll('a.brend img.logo-brenda')].filter((i) => i.complete && i.naturalWidth > 0).length);
  console.log(tema, ekran, ok ? 'sekcija ok' : 'NEMA SEKCIJE', n, 'logotipa učitano', greske.length ? 'GREŠKE: ' + greske.slice(0, 2).join(' | ') : 'bez grešaka');
  await c.close();
}
await b.close(); process.exit(0);
