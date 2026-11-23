/*
 * Aktivna tema u browseru.
 *
 * Tema sajta je ona iz salon.js. Birač tema (vidljiv dok je `demo: true` ili u
 * `npm run dev`) menja izgled ODMAH, bez ponovnog učitavanja: prepisuje
 * <style id="tema"> i atribute na <html>, a izbor pamti u ovom browseru
 * (localStorage) i u adresi (?tema=soho — link za slanje klijentu).
 */
import { salon } from '../config/salon.js';
import { TEME, resiTemu, cssTeme, atributiTeme } from '../config/teme.js';

const KLJUC = 'tema.pregled.v1';

export const biracUkljucen = () => Boolean(salon.demo) || Boolean(import.meta.env?.DEV);

/** Zapis teme iz salon.js (string ili objekat sa izmenama). */
export const temaSajta = () => salon.tema;
export const idTemeSajta = () => resiTemu(salon.tema).id;

/** Tema za ovaj prikaz: ?tema=… → zapamćeni pregled → tema sajta. */
export const pocetnaTema = () => {
    if (typeof window === 'undefined' || !biracUkljucen()) return resiTemu(temaSajta());
    let id = null;
    try {
        id = new URLSearchParams(window.location.search).get('tema') || localStorage.getItem(KLJUC);
    } catch { /* privatni prozor */ }
    return id && TEME[id] ? zaId(id) : resiTemu(temaSajta());
};

/** Za id koji je i tema sajta vraća verziju SA izmenama iz salon.js. */
export const zaId = (id) => (id === idTemeSajta() ? resiTemu(temaSajta()) : resiTemu(id));

export const primeniTemu = (tema) => {
    if (typeof document === 'undefined') return;
    let stil = document.getElementById('tema');
    if (!stil) {
        stil = document.createElement('style');
        stil.id = 'tema';
        document.head.appendChild(stil);
    }
    stil.textContent = cssTeme(tema);
    const html = document.documentElement;
    for (const [k, v] of Object.entries(atributiTeme(tema))) html.setAttribute(k, v);
    const boja = document.querySelector('meta[name="theme-color"]');
    if (boja) boja.setAttribute('content', tema.boje.paper);
};

export const zapamtiPregled = (id) => {
    try {
        if (id === idTemeSajta()) localStorage.removeItem(KLJUC);
        else localStorage.setItem(KLJUC, id);
        const url = new URL(window.location.href);
        if (url.searchParams.has('tema')) {
            url.searchParams.set('tema', id);
            window.history.replaceState(null, '', url);
        }
    } catch { /* privatni prozor */ }
};

/** U `npm run dev`: upisuje temu u salon.js (Vite middleware u vite.config.js). */
export const sacuvajUKonfiguraciju = async (id) => {
    const odg = await fetch('/__tema', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tema: id }) });
    if (!odg.ok) throw new Error(await odg.text());
    try { localStorage.removeItem(KLJUC); } catch { /* */ }
};
