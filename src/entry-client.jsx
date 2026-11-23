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
 * Stranice u dist/ su unapred iscrtane (prerender) u temi iz salon.js. Ako je
 * posetilac u biraču izabrao drugu temu, ista stranica se crta iznova umesto
 * hidratacije — markup teme se razlikuje (hero, raspored usluga…).
 */
const tema = pocetnaTema();
primeniTemu(tema);

const koren = document.getElementById('app');
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
