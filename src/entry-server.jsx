import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router-dom/server';
import App from './App.jsx';
import { BAZA, DOMEN, apsolutno } from './lib/baza.js';
import { salon } from './config/salon.js';
import { TEME, resiTemu, cssTeme, atributiTeme } from './config/teme.js';
import { metaStranice, headHtml, aktivniJezici, INDEKSIRANE } from './lib/seo.js';
import { putanja, jezikIzPutanje, kljucIzPutanje, SVI_JEZICI } from './i18n/jezici.js';
import { SVE_RUTE } from './panel/meni.js';

/** Za scripts/prerender.mjs — sve što je potrebno da se napravi statički sajt. */
export const render = (url) => {
    const tema = resiTemu(salon.tema);
    const html = renderToString(
        <StaticRouter location={`${BAZA}${url}`} basename={BAZA || undefined}>
            <App tema={tema} />
        </StaticRouter>,
    );
    const jezik = jezikIzPutanje(url);
    const meta = metaStranice(kljucIzPutanje(url), jezik);
    return { html, head: headHtml(meta), lang: SVI_JEZICI[jezik].locale.split('-')[0], tema };
};

export { SVE_RUTE };
export { BAZA, DOMEN, apsolutno, salon, TEME, resiTemu, cssTeme, atributiTeme, aktivniJezici, INDEKSIRANE, putanja, metaStranice };
