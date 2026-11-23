/*
 * PROVERA KONTRASTA — svaka tema × stranica × telefon/desktop.
 *
 *   (u korenu projekta) npm run build
 *   node alati/istrazivanje/proveri-kontrast.mjs            → sve teme
 *   node alati/istrazivanje/proveri-kontrast.mjs noar soho  → samo te teme
 *
 * Kako meri: stranica se slika dva puta — normalno i sa providnim tekstom.
 * Za svaki vidljiv tekst, iz drugog snimka se uzme STVARNA pozadina ispod njega
 * (i fotografija, veo, gradijent), pa se računa WCAG kontrast boje teksta
 * (uz providnost teksta i predaka) prema najgorem delu te pozadine (10. / 90.
 * percentil osvetljenosti). Prag: 4.5:1, a 3:1 za veliki tekst (≥ 24px ili
 * ≥ 18.66px bold). Pokreti su isključeni (reduced motion), pa je sve u
 * krajnjem stanju.
 *
 * Izveštaj: alati/istrazivanje/izlaz/kontrast.md (+ .json).
 */
import fs from 'node:fs';
import path from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';
import sharp from 'sharp';

const koren = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const izlaz = path.join(path.dirname(fileURLToPath(import.meta.url)), 'izlaz');
const { TEME } = await import(`file:///${path.join(koren, 'src/config/teme.js').replace(/\\/g, '/')}`);
const izabrane = process.argv.slice(2).filter((t) => TEME[t]);
const sufiks = process.argv.slice(2).filter((t) => TEME[t]).join('-');
const teme = izabrane.length ? izabrane : Object.keys(TEME);
const STRANE = ['/', '/cenovnik', '/tim', '/galerija', '/o-nama', '/zakazivanje', '/kontakt', '/pitanja', '/uslovi-koriscenja', '/ru/'];
const EKRANI = { telefon: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 1 }, desktop: { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 } };
const CHROME = ['C:/Program Files/Google/Chrome/Application/chrome.exe', 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'].find((p) => fs.existsSync(p));
// --dev <port>: proverava Vite dev server (bez builda) — za rad na jednoj temi.
const devI = process.argv.indexOf('--dev');
const DEV = devI > 0;
const PORT = DEV ? Number(process.argv[devI + 1]) || 5190 : 4180;

// Preview servera gotovog sajta (dist/)
const server = spawn(process.execPath, [path.join(koren, 'node_modules/vite/bin/vite.js'), ...(DEV ? [] : ['preview']), '--port', String(PORT), '--strictPort'], { cwd: koren, stdio: 'ignore' });
for (let i = 0; ; i++) {
    try { if ((await fetch(`http://localhost:${PORT}/`)).ok) break; } catch { /* još nije gore */ }
    if (i > 60) throw new Error('preview nije krenuo');
    await new Promise((r) => setTimeout(r, 500));
}

const lum = (r, g, b) => {
    const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; };
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
};
const odnos = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

// Tekstovi koji su CELI u trenutnom ekranu i još nisu izmereni (koordinate u ekranu).
const TEKSTOVI = () => {
    const rez = [];
    const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = w.nextNode())) {
        const t = n.textContent.trim();
        if (!t || t.length < 2) continue;
        const el = n.parentElement;
        if (!el || el.hasAttribute('data-kmer') || el.closest('[data-izuzmi-kontrast], script, style, noscript, [aria-hidden=true], .sr-only, iframe')) continue;
        const s = getComputedStyle(el);
        if (s.visibility === 'hidden' || s.display === 'none') continue;
        const range = document.createRange(); range.selectNodeContents(n);
        const r = range.getBoundingClientRect();
        if (r.width < 4 || r.height < 4 || r.top < 0 || r.bottom > innerHeight || r.left < 0 || r.right > innerWidth) continue;
        // Prekriven (lepljivi header, traka na dnu…)? Meri se kasnije, kad je slobodan.
        const tacke = [[r.left + 2, r.top + r.height / 2], [r.left + r.width / 2, r.top + r.height / 2], [r.right - 2, r.top + r.height / 2]];
        if (tacke.some(([x, y]) => { const e = document.elementFromPoint(x, y); return e && !el.contains(e) && !e.contains(el); })) continue;
        let op = 1;
        for (let x = el; x; x = x.parentElement) op *= parseFloat(getComputedStyle(x).opacity);
        if (op < 0.05) continue;
        el.setAttribute('data-kmer', '1');
        const m = s.color.match(/[\d.]+/g).map(Number);
        rez.push({
            tekst: t.slice(0, 50), x: r.left, y: r.top, w: r.width, h: r.height, yStrane: Math.round(r.top + scrollY),
            boja: [m[0], m[1], m[2], (m[3] ?? 1) * op], velicina: parseFloat(s.fontSize), tezina: parseInt(s.fontWeight, 10),
            put: `${el.tagName.toLowerCase()}.${String(el.className).split(/\s+/).slice(0, 3).join('.')}`.slice(0, 70),
        });
    }
    return rez;
};

const SAKRIJ_TEKST = '*, *::before, *::after { color: transparent !important; text-shadow: none !important; -webkit-text-stroke: 0 !important; caret-color: transparent !important; } svg { visibility: hidden !important; }';

const browser = await chromium.launch({ executablePath: CHROME, headless: true });
const nalazi = [];
let provereno = 0;
for (const tema of teme) {
    for (const [ekran, opcije] of Object.entries(EKRANI)) {
        const ctx = await browser.newContext({ ...opcije, reducedMotion: 'reduce' });
        const page = await ctx.newPage();
        for (const strana of STRANE) {
            const url = `http://localhost:${PORT}${strana}${strana.endsWith('/') ? '' : '/'}?tema=${tema}`;
            await page.goto(url, { waitUntil: 'load', timeout: 20000 }).catch(() => {});
            await page.evaluate(() => document.querySelectorAll('img[loading=lazy]').forEach((i) => { i.loading = 'eager'; }));
            await page.addStyleTag({ content: '[data-izuzmi-kontrast] { display: none !important; }' });
            await page.waitForTimeout(900);
            const visina = await page.evaluate(() => document.documentElement.scrollHeight);
            const vh = opcije.viewport.height;
            // Ekran po ekran: izmeri tekst, sakrij ga, snimi ISTI ekran, uporedi.
            for (let y = 0; y < Math.min(visina, 16000); y += Math.round(vh * 0.6)) {
                await page.evaluate((yy) => window.scrollTo(0, yy), y);
                await page.waitForTimeout(350);
                // Vite ponekad osveži stranicu (optimizacija zavisnosti) — tada ponovi merenje.
                let tekstovi;
                try { tekstovi = await page.evaluate(TEKSTOVI); } catch { await page.waitForTimeout(1500); await page.evaluate((yy) => window.scrollTo(0, yy), y).catch(() => {}); tekstovi = await page.evaluate(TEKSTOVI).catch(() => []); }
                if (!tekstovi.length) continue;
                const stil = await page.addStyleTag({ content: SAKRIJ_TEKST });
                await page.waitForTimeout(60);
                const slika = await page.screenshot({ type: 'png' });
                await stil.evaluate((e) => e.remove());
                const { data, info } = await sharp(slika).raw().toBuffer({ resolveWithObject: true });
                const sx = info.width / opcije.viewport.width;
                const px = (x, yy) => { const i = (Math.min(info.height - 1, Math.max(0, Math.round(yy * sx))) * info.width + Math.min(info.width - 1, Math.max(0, Math.round(x * sx)))) * info.channels; return [data[i], data[i + 1], data[i + 2]]; };
                for (const t of tekstovi) {
                    const uzorci = [];
                    for (let i = 0; i < 6; i++) for (let j = 0; j < 3; j++) uzorci.push(px(t.x + (t.w * (i + 0.5)) / 6, t.y + (t.h * (j + 0.5)) / 3));
                    const lums = uzorci.map(([r, g, b]) => ({ l: lum(r, g, b), c: [r, g, b] })).sort((a, b) => a.l - b.l);
                    const [r, g, b, a] = t.boja;
                    const najgori = (pozadina) => {
                        const [br, bg, bb] = pozadina.c;
                        const efektivna = [r * a + br * (1 - a), g * a + bg * (1 - a), b * a + bb * (1 - a)];
                        return odnos(lum(...efektivna), pozadina.l);
                    };
                    const k = Math.min(najgori(lums[Math.floor(lums.length * 0.1)]), najgori(lums[Math.floor(lums.length * 0.9)]));
                    const veliki = t.velicina >= 24 || (t.velicina >= 18.66 && t.tezina >= 700);
                    const prag = veliki ? 3 : 4.5;
                    provereno++;
                    if (k < prag) nalazi.push({ tema, ekran, strana, tekst: t.tekst, kontrast: +k.toFixed(2), prag, boja: `rgba(${t.boja.map((v, i) => (i === 3 ? v.toFixed(2) : Math.round(v))).join(',')})`, pozadina: `rgb(${lums[Math.floor(lums.length * 0.5)].c.join(',')})`, put: t.put, y: t.yStrane });
                }
            }
        }
        await ctx.close();
        console.log(`  ${tema} / ${ekran}: ${nalazi.filter((n) => n.tema === tema && n.ekran === ekran).length} problema`);
    }
}
await browser.close();
server.kill();

fs.mkdirSync(izlaz, { recursive: true });
fs.writeFileSync(path.join(izlaz, `kontrast${sufiks ? `-${sufiks}` : ''}.json`), JSON.stringify(nalazi, null, 1));
const grupe = {};
for (const n of nalazi) { const k = `${n.tema} | ${n.put} | ${n.tekst}`; (grupe[k] ||= { ...n, mesta: [] }).mesta.push(`${n.ekran} ${n.strana} (${n.kontrast})`); }
const md = [`# Kontrast — ${new Date().toISOString().slice(0, 16)}`, '', `Provereno tekstova: ${provereno}. Problema: ${nalazi.length} (${Object.keys(grupe).length} jedinstvenih).`, '',
    '| Tema | Tekst | Kontrast / prag | Boja teksta | Pozadina | Element | Gde |', '|---|---|---|---|---|---|---|',
    ...Object.values(grupe).sort((a, b) => a.kontrast - b.kontrast).map((g) => `| ${g.tema} | ${g.tekst.replace(/\|/g, '/')} | ${g.kontrast} / ${g.prag} | ${g.boja} | ${g.pozadina} | \`${g.put}\` | ${g.mesta.slice(0, 4).join(', ')}${g.mesta.length > 4 ? ` +${g.mesta.length - 4}` : ''} |`)].join('\n');
fs.writeFileSync(path.join(izlaz, `kontrast${sufiks ? `-${sufiks}` : ''}.md`), md);
console.log(`\nProvereno ${provereno} tekstova, ${nalazi.length} ispod praga → alati/istrazivanje/izlaz/kontrast${sufiks ? `-${sufiks}` : ''}.md`);
