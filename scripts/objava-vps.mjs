/*
 * OBJAVA NA VPS — build za domen, prenos preko SSH-a i zamena sajta bez prekida.
 *
 *   node scripts/objava-vps.mjs --host <ssh-alias> --putanja <folder na serveru> --domen <https://…>
 *   npm run objava:demo          (demo.nomi.rs — vidi package.json)
 *
 *   --host      SSH alias iz ~/.ssh/config (ili korisnik@server)
 *   --putanja   koren sajta na serveru, relativno na home (npr. htdocs/demo.nomi.rs)
 *   --domen     javna adresa sajta (canonical, sitemap, Open Graph)
 *   --bez-builda  pošalji postojeći dist/ bez novog builda
 *
 * Na serveru se nova verzija raspakuje pored stare (<putanja>.novo), preuzme
 * `.well-known` (SSL sertifikati) i dozvole starog foldera, pa se folderi
 * zamene jednim `mv` — posetilac nikad ne vidi poluprebačen sajt. Stara verzija
 * ostaje kao <putanja>.prethodna do sledeće objave (brz povratak: zameni nazad).
 *
 * Potrebno: ssh i tar (Windows 10+ i Git Bash ih imaju), SSH ključ za taj host.
 * `.htaccess` se ne šalje — na nginx serveru se pravila podešavaju u vhost-u.
 */
import { spawn, spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const koren = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const arg = (ime) => { const i = process.argv.indexOf(`--${ime}`); return i > -1 ? process.argv[i + 1] : undefined; };
const host = arg('host');
const putanja = arg('putanja')?.replace(/^\/+|\/+$/g, '');
const domen = arg('domen')?.replace(/\/+$/, '');
if (!host || !putanja || !domen) {
    console.error('Upotreba: node scripts/objava-vps.mjs --host <ssh-alias> --putanja <htdocs/domen> --domen <https://domen>');
    process.exit(1);
}
if (!/^[\w.@-]+$/.test(host) || !/^[\w./-]+$/.test(putanja) || putanja.includes('..')) {
    console.error('Neispravan --host ili --putanja.');
    process.exit(1);
}

const korak = (t) => console.log(`\n→ ${t}`);
const pokreni = (cmd, args, opcije = {}) => {
    const r = spawnSync(cmd, args, { stdio: 'inherit', shell: process.platform === 'win32' && cmd === 'npm', ...opcije });
    if (r.status !== 0) { console.error(`\n✗ ${cmd} ${args.join(' ')} — izlaz ${r.status ?? r.error?.message}`); process.exit(1); }
};

/* 1) Build za koren domena (bez BAZA podfoldera) */
if (!process.argv.includes('--bez-builda')) {
    korak(`Build za ${domen}`);
    const env = { ...process.env, VITE_DOMEN: domen };
    delete env.BAZA;
    pokreni('npm', ['run', 'build'], { cwd: koren, env });
}

/* 2) Provera veze */
korak(`Veza sa ${host}`);
pokreni('ssh', ['-o', 'BatchMode=yes', '-o', 'ConnectTimeout=15', host, `test -d $HOME/${putanja} || { echo "Nema foldera $HOME/${putanja}"; exit 1; }`]);

/* 3) Prenos: tar → ssh → raspakivanje u <putanja>.novo */
korak('Prenos dist/ na server');
const novo = `$HOME/${putanja}.novo`;
await new Promise((resolve, reject) => {
    const tar = spawn('tar', ['-czf', '-', '--exclude=.htaccess', '-C', 'dist', '.'], { cwd: koren, stdio: ['ignore', 'pipe', 'inherit'] });
    const ssh = spawn('ssh', ['-o', 'BatchMode=yes', host, `rm -rf ${novo} && mkdir -p ${novo} && tar -xzf - -C ${novo} && echo "  raspakovano: $(find ${novo} -type f | wc -l) fajlova"`], { stdio: ['pipe', 'inherit', 'inherit'] });
    tar.stdout.pipe(ssh.stdin);
    tar.on('exit', (k) => { if (k !== 0) reject(new Error(`tar izlaz ${k}`)); });
    ssh.on('exit', (k) => (k === 0 ? resolve() : reject(new Error(`ssh izlaz ${k}`))));
}).catch((e) => { console.error(`\n✗ ${e.message}`); process.exit(1); });

/* 4) Zamena: .well-known i dozvole iz starog, pa mv */
korak('Zamena sajta');
const staro = `$HOME/${putanja}`;
const prethodna = `$HOME/${putanja}.prethodna`;
pokreni('ssh', ['-o', 'BatchMode=yes', host, [
    'set -e',
    `[ -d ${staro}/.well-known ] && cp -a ${staro}/.well-known ${novo}/ || true`,
    `chmod --reference=${staro} ${novo}`,
    `rm -rf ${prethodna}`,
    `mv ${staro} ${prethodna} && mv ${novo} ${staro}`,
    'echo "  zamenjeno; prethodna verzija je u ' + `${putanja}.prethodna"`,
].join(' && ')]);

/* 5) Provera živog sajta */
korak(`Provera ${domen}`);
const PROVERE = [['/', 200], ['/cenovnik', 200], ['/panel/prijava', 200], ['/panel/klijenti/k1001', 200], ['/__ne-postoji', 404], ['/robots.txt', 200]];
let loše = 0;
for (const [p, ocekivano] of PROVERE) {
    let kod = 0;
    try { kod = (await fetch(`${domen}${p}`, { redirect: 'manual', headers: { 'cache-control': 'no-cache' } })).status; } catch { /* */ }
    const ok = kod === ocekivano;
    if (!ok) loše++;
    console.log(`  ${ok ? '✓' : '✗'} ${p.padEnd(24)} ${kod}${ok ? '' : ` (očekivano ${ocekivano})`}`);
}
console.log(loše ? `\n⚠ Objavljeno, ali ${loše} provera nije prošla — proveri vhost.` : `\n✓ Objavljeno: ${domen}`);
process.exit(loše ? 2 : 0);
