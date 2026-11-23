import fs from 'node:fs';
import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { TEME } from './src/config/teme.js';

/*
 * „Postavi kao temu sajta” iz biraca tema (samo u `npm run dev`): upisuje
 * izabranu temu u src/config/salon.js. Vite zatim sam osveži stranicu.
 */
const upisTeme = () => ({
    name: 'upis-teme',
    apply: 'serve',
    configureServer(server) {
        server.middlewares.use('/__tema', (req, res) => {
            if (req.method !== 'POST') { res.statusCode = 405; return res.end(); }
            let telo = '';
            req.on('data', (d) => { telo += d; if (telo.length > 1000) req.destroy(); });
            req.on('end', () => {
                try {
                    const { tema } = JSON.parse(telo || '{}');
                    if (!TEME[tema]) throw new Error(`Nepoznata tema: ${tema}`);
                    const fajl = path.resolve('src/config/salon.js');
                    const izvor = fs.readFileSync(fajl, 'utf8');
                    let novo = izvor.replace(/^(\s*tema:\s*)(['"])[a-z]+\2(\s*,)/m, `$1'${tema}'$3`);
                    if (novo === izvor) novo = izvor.replace(/(^\s*tema:\s*\{[^\n]*?osnova:\s*)(['"])[a-z]+\2/m, `$1'${tema}'`);
                    if (novo === izvor && !new RegExp(`tema:\\s*['"]${tema}['"]`).test(izvor)) throw new Error('U salon.js nije pronađena linija `tema: ...`.');
                    fs.writeFileSync(fajl, novo);
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ ok: true, tema }));
                } catch (e) {
                    res.statusCode = 400;
                    res.end(String(e.message || e));
                }
            });
        });
    },
});

export default defineConfig({
    plugins: [react(), upisTeme()],
    server: { port: 3000 },
    // Podfolder (npr. GitHub Pages: BAZA=/template-demo/); podrazumevano koren domena.
    base: process.env.BAZA || '/',
    build: { outDir: 'dist', emptyOutDir: true },
    ssr: { noExternal: ['lucide-react'] },
});
