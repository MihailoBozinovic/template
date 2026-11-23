import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { salon } from '../config/salon.js';
import { recnik } from '../i18n/index.js';
import { putanja, tx } from '../i18n/jezici.js';
import { primeniTemu, zapamtiPregled, zaId } from '../lib/tema.js';

const SajtKontekst = createContext(null);

export function SajtProvider({ jezik, tema: pocetna, children }) {
    const [tema, setTema] = useState(pocetna);

    const postaviTemu = useCallback((id) => {
        const nova = zaId(id);
        primeniTemu(nova);
        zapamtiPregled(id);
        setTema(nova);
    }, []);

    const vrednost = useMemo(() => ({
        salon,
        jezik,
        t: recnik(jezik),
        tx: (v) => tx(v, jezik),
        p: (kljuc) => putanja(kljuc, jezik),
        tema,
        postaviTemu,
    }), [jezik, tema, postaviTemu]);

    return <SajtKontekst.Provider value={vrednost}>{children}</SajtKontekst.Provider>;
}

export const useSajt = () => useContext(SajtKontekst);
