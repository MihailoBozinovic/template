/*
 * REGISTAR KOMPONENTI TEMA
 *
 * Svaka tema u src/teme/<id>/komponente.jsx izvozi objekat sa komponentama
 * koje zamenjuju podrazumevane, samo dok je ta tema aktivna:
 *
 *   Header              — ceo header (i mobilni meni)
 *   Footer              — ceo footer
 *   Hero                — prvi ekran početne
 *   pocetna             — niz komponenti sekcija početne, redom (posle Hero-a)
 *   ZaglavljeStranice   — naslov podstranica (cenovnik, tim, kontakt…)
 *
 * Gradivni blokovi za to su u src/components (primitivi, delovi, Header:
 * Logo, NavLinkovi, useMeni, useSkrol, MobilniMeni, useZakaziLink) i
 * src/sekcije (Hero, Sekcije). Podaci salona uvek iz useSajt().salon.
 */
import menhetn from './menhetn/komponente.jsx';
import palma from './palma/komponente.jsx';
import soho from './soho/komponente.jsx';
import istsajd from './istsajd/komponente.jsx';
import zaliv from './zaliv/komponente.jsx';
import holivud from './holivud/komponente.jsx';
import hjuston from './hjuston/komponente.jsx';
import volstrit from './volstrit/komponente.jsx';
import noar from './noar/komponente.jsx';

const REGISTAR = { menhetn, palma, soho, istsajd, zaliv, holivud, hjuston, volstrit, noar };

export const komponenteTeme = (id) => REGISTAR[id] ?? {};
