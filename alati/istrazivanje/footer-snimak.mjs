import { chromium } from 'playwright-core';
import { spawn } from 'node:child_process';
import path from 'node:path';
const koren = process.cwd();
const server = spawn(process.execPath, [path.join(koren, 'node_modules/vite/bin/vite.js'), 'preview', '--port', '4180', '--strictPort'], { cwd: koren, stdio: 'ignore' });
process.on('exit', () => server.kill());
for (let i = 0; i < 240; i++) { try { if ((await fetch('http://localhost:4180/')).ok) break; } catch {} await new Promise((r) => setTimeout(r, 500)); }
const b = await chromium.launch({ executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
for (const [tema, ekran] of [['noar', 'desktop'], ['holivud', 'telefon'], ['soho', 'desktop'], ['hjuston', 'telefon']]) {
  const c = await b.newContext(ekran === 'telefon' ? { viewport: { width: 390, height: 844 }, isMobile: true, deviceScaleFactor: 2, reducedMotion: 'reduce' } : { viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
  const p = await c.newPage();
  await p.goto(`http://localhost:4180/?tema=${tema}`, { waitUntil: 'networkidle' });
  await p.waitForTimeout(800);
  await p.addStyleTag({ content: '[data-izuzmi-kontrast]{display:none!important}' });
  await p.locator('footer').last().screenshot({ path: `alati/istrazivanje/izlaz/delovi/${tema}-${ekran}-footer-ceo.jpg`, type: 'jpeg', quality: 70 });
  await c.close();
}
await b.close(); process.exit(0);
