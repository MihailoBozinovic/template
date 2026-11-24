/*
 * Boje su CSS promenljive (src/index.css), a vrednosti im daje tema iz
 * src/config/teme.js. Zato `bg-paper` ili `text-brand` rade u svakoj temi:
 * tema menja promenljive, klase ostaju iste.
 */
const boja = (ime) => `rgb(var(--c-${ime}) / <alpha-value>)`;
/* Panel (src/panel) ima svoje boje, nezavisne od teme sajta — src/panel/panel.css. */
const pb = (ime) => `rgb(var(--p-${ime}) / <alpha-value>)`;
const PANEL = Object.fromEntries(['bg', 'karta', 'ink', 'tiho', 'meko', 'ivica', 'polje', 'akc', 'naakc', 'zlato', 'graf', 'staza', 'ok', 'okbg', 'upoz', 'upozbg', 'greska', 'greskabg', 'info', 'infobg', 'sidebar', 'sidebarink'].map((k) => [k, pb(k)]));

export default {
    content: ['./index.html', './src/**/*.{js,jsx}'],
    theme: {
        extend: {
            colors: {
                paper: boja('paper'),
                ink: boja('ink'),
                mist: boja('mist'),
                povrsina: boja('povrsina'),
                brand: boja('brand'),
                naBrand: boja('na-brand'),
                linija: boja('linija'),
                tamna: boja('tamna'),
                p: PANEL,
            },
            fontFamily: {
                naslov: ['var(--font-naslov)', 'Georgia', 'serif'],
                tekst: ['var(--font-tekst)', 'system-ui', 'sans-serif'],
            },
            maxWidth: {
                sajt: '84rem',
            },
            keyframes: {
                'fade-up': {
                    from: { opacity: '0', transform: 'translateY(14px)' },
                    to: { opacity: '1', transform: 'none' },
                },
                'blagi-zum': {
                    from: { transform: 'scale(1)' },
                    to: { transform: 'scale(1.06)' },
                },
            },
            animation: {
                'fade-up': 'fade-up 0.8s cubic-bezier(0.22, 1, 0.36, 1) both',
                'blagi-zum': 'blagi-zum 7.5s ease-out both',
            },
        },
    },
    plugins: [],
};
