import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './fontovi.js';
import './index.css';
import App from './App.jsx';
import { pocetnaTema, primeniTemu } from './lib/tema.js';
import { BAZA } from './lib/baza.js';

document.documentElement.classList.add('js');

/*
 * /panel/* je administrativni panel (src/panel) — posebna aplikacija koja se
 * učitava tek kad se otvori, da sajt ne nosi njen kod. Prerender za panel pravi
 * samo praznu ljusku (scripts/prerender.mjs), pa se ovde uvek crta iznova.
 */
const putanjaBezBaze = location.pathname.slice(BAZA.length) || '/';
const jePanel = /^\/panel(\/|$)/.test(putanjaBezBaze);

/*
 * Stranice u dist/ su unapred iscrtane (prerender) u temi iz salon.js. Ako je
 * posetilac u biraču izabrao drugu temu, ista stranica se crta iznova umesto
 * hidratacije — markup teme se razlikuje (hero, raspored usluga…).
 */
const koren = document.getElementById('app');

if (jePanel) {
    import('./panel/Panel.jsx').then(({ default: Panel }) => {
        koren.innerHTML = '';
        createRoot(koren).render(
            <React.StrictMode>
                <BrowserRouter basename={BAZA || undefined}>
                    <Panel />
                </BrowserRouter>
            </React.StrictMode>,
        );
    });
} else {
    const tema = pocetnaTema();
    primeniTemu(tema);
    const app = (
        <React.StrictMode>
            <BrowserRouter basename={BAZA || undefined}>
                <App tema={tema} />
            </BrowserRouter>
        </React.StrictMode>
    );
    if (koren.hasChildNodes() && koren.dataset.tema === tema.id) {
        hydrateRoot(koren, app);
    } else {
        koren.innerHTML = '';
        createRoot(koren).render(app);
    }
}
