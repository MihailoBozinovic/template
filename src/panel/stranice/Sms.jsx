/*
 * SMS KAMPANJE — poruka izabranoj grupi klijenata (samo onima koji su dali
 * pristanak za SMS) i istorija poslatih kampanja sa klikovima i zakazivanjima.
 *
 * Brojanje delova kao kod operatera: GSM 7-bit 160 znakova (153 po delu kad
 * je poruka duža), a čim se pojavi znak van GSM skupa (č ć š ž đ, emotikon…)
 * cela poruka ide kao Unicode: 70 znakova (67 po delu).
 */
import React, { useMemo, useState } from 'react';
import { CalendarClock, Eraser, MessageSquareText, Send, Smartphone, Users } from 'lucide-react';
import { usePanel } from '../podaci/Skladiste.jsx';
import { broj, danas as danasF, datumBrojevi, datumKratko, dodajDane, mnozina, procenat, razlikaDana, rsd } from '../format.js';
import { Dugme, Kartica, Izbor, Modal, Polje, Prazno, Tabela, Tabovi, TekstPolje, Unos, ZaglavljeStrane, Znacka, cx } from '../ui.jsx';

const CENA_DELA = 4.5;
const GSM = new Set('@£$¥èéùìòÇ\nØø\rÅåΔ_ΦΓΛΩΠΨΣΘΞÆæßÉ !"#¤%&\'()*+,-./0123456789:;<=>?¡ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÑÜ§¿abcdefghijklmnopqrstuvwxyzäöñüà');
const GSM_DODATNI = new Set('^{}\\[~]|€');

/** { znakova, delova, unicode, poDelu, ostalo } */
const brojiSms = (tekst) => {
    const nizovi = Array.from(tekst);
    const unicode = nizovi.some((c) => !GSM.has(c) && !GSM_DODATNI.has(c));
    if (unicode) {
        const n = tekst.length; // UTF-16 jedinice: emotikon troši 2
        const poDelu = n <= 70 ? 70 : 67;
        const delova = n ? Math.ceil(n / poDelu) : 0;
        return { znakova: n, delova, unicode, poDelu, ostalo: delova * poDelu - n };
    }
    const n = nizovi.reduce((s, c) => s + (GSM_DODATNI.has(c) ? 2 : 1), 0);
    const poDelu = n <= 160 ? 160 : 153;
    const delova = n ? Math.ceil(n / poDelu) : 0;
    return { znakova: n, delova, unicode, poDelu, ostalo: delova * poDelu - n };
};

const KVACICE = { č: 'c', ć: 'c', š: 's', ž: 'z', đ: 'dj', Č: 'C', Ć: 'C', Š: 'S', Ž: 'Z', Đ: 'Dj', '„': '"', '“': '"', '”': '"', '‘': "'", '’': "'", '–': '-', '—': '-', '…': '...' };
const ukloniKvacice = (t) => t.replace(/[čćšžđČĆŠŽĐ„“”‘’–—…]/g, (c) => KVACICE[c]);

const SEGMENTI = [
    { id: 'svi', naziv: 'Svi sa pristankom' },
    { id: 'neaktivni', naziv: 'Nisu dolazili 60+ dana' },
    { id: 'stalni', naziv: 'Stalni klijenti (4+ dolaska)' },
    { id: 'zene', naziv: 'Žene' },
    { id: 'muskarci', naziv: 'Muškarci' },
    { id: 'rodjendan', naziv: 'Rođendan ovog meseca' },
];

function TelefonPregled({ posiljalac, tekst, vreme }) {
    return (
        <div className="mx-auto w-full max-w-[280px] rounded-[34px] border border-p-ivica bg-p-meko p-2.5 shadow-sm">
            <div className="rounded-[26px] bg-p-karta px-3 pb-6 pt-3">
                <div className="mx-auto mb-3 h-1.5 w-16 rounded-full bg-p-ivica" aria-hidden="true" />
                <div className="flex flex-col items-center border-b border-p-ivica/70 pb-2.5">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-p-staza text-[13px] font-semibold text-p-akc">{(posiljalac || 'S').slice(0, 1)}</span>
                    <span className="mt-1 text-[12.5px] font-medium">{posiljalac}</span>
                </div>
                <div className="mt-3 text-center text-[10.5px] text-p-tiho">{vreme}</div>
                <div className="mt-1.5 max-w-[88%] whitespace-pre-wrap break-words rounded-2xl rounded-bl-md bg-p-meko px-3 py-2 text-[13px] leading-snug">
                    {tekst || <span className="text-p-tiho">Ovde se vidi poruka…</span>}
                </div>
            </div>
        </div>
    );
}

export default function Sms() {
    const { podaci, dodaj, noviId, obavesti, zapisi, sesija } = usePanel();
    const d = danasF();
    const kratko = podaci.podaciSalona?.kratkiNaziv || podaci.podaciSalona?.naziv || 'Salon';
    const [naziv, setNaziv] = useState('');
    const [tekst, setTekst] = useState('');
    const [segment, setSegment] = useState('svi');
    const [kada, setKada] = useState('odmah');
    const [datum, setDatum] = useState(dodajDane(d, 1));
    const [sat, setSat] = useState('10:00');
    const [potvrda, setPotvrda] = useState(false);

    /* Posete po klijentu (samo naplaćeni termini). */
    const posete = useMemo(() => {
        const m = {};
        for (const t of podaci.termini) {
            if (t.status !== 'zavrsen') continue;
            const x = m[t.klijentId] ?? (m[t.klijentId] = { broj: 0, poslednja: '' });
            x.broj += 1;
            if (t.datum > x.poslednja) x.poslednja = t.datum;
        }
        return m;
    }, [podaci.termini]);

    const grupe = useMemo(() => {
        const sa = podaci.klijenti.filter((k) => k.smsPristanak && !k.blokiran);
        const mesec = d.slice(5, 7);
        const granica = dodajDane(d, -60);
        return {
            svi: sa,
            neaktivni: sa.filter((k) => posete[k.id] && posete[k.id].poslednja < granica),
            stalni: sa.filter((k) => (posete[k.id]?.broj ?? 0) >= 4),
            zene: sa.filter((k) => k.pol === 'z'),
            muskarci: sa.filter((k) => k.pol === 'm'),
            rodjendan: sa.filter((k) => k.rodjendan?.slice(0, 2) === mesec),
        };
    }, [podaci.klijenti, posete, d]);

    const primalaca = grupe[segment].length;
    const sms = brojiSms(tekst);
    const kvacice = /[čćšžđČĆŠŽĐ]/.test(tekst);
    const cena = primalaca * sms.delova * CENA_DELA;
    const spremno = naziv.trim() && tekst.trim() && primalaca > 0 && (kada === 'odmah' || datum >= d);
    const ukupnoSaPristankom = grupe.svi.length;

    const posalji = () => {
        const zakazano = kada === 'zakazi';
        dodaj('smsKampanje', {
            id: noviId('s'), naziv: naziv.trim(), tekst: tekst.trim(), primalaca, poslato: zakazano ? datum : d,
            vreme: zakazano ? sat : null, segment, status: zakazano ? 'zakazana' : 'poslata', klikova: 0, zakazano: 0,
        });
        zapisi('sms', zakazano ? 'Zakazao SMS kampanju' : 'Poslao SMS kampanju', `${naziv.trim()} · ${primalaca} primalaca`);
        obavesti(zakazano ? `Kampanja „${naziv.trim()}” je zakazana za ${datumBrojevi(datum)} u ${sat}.` : `Kampanja „${naziv.trim()}” je poslata na ${broj(primalaca)} brojeva (demo).`);
        setPotvrda(false); setNaziv(''); setTekst('');
    };

    const istorija = useMemo(() => [...podaci.smsKampanje].sort((a, b) => b.poslato.localeCompare(a.poslato)), [podaci.smsKampanje]);
    const poslate = istorija.filter((k) => k.status === 'poslata');
    const ukupnoZakazano = poslate.reduce((s, k) => s + (k.zakazano || 0), 0);

    const kolone = [
        { kljuc: 'naziv', naslov: 'Kampanja', className: 'min-w-[220px]', render: (k) => <div><div className="font-medium">{k.naziv}</div><div className="max-w-[360px] truncate text-[12.5px] text-p-tiho">{k.tekst}</div></div> },
        {
            kljuc: 'poslato', naslov: 'Datum', render: (k) => (
                <div className="whitespace-nowrap">
                    <div className="tabularno">{datumKratko(k.poslato)}{k.vreme ? ` · ${k.vreme}` : ''}</div>
                    {k.status === 'zakazana' ? <Znacka ton="info" className="mt-0.5">za {Math.max(0, razlikaDana(d, k.poslato))} d</Znacka> : <span className="text-[12px] text-p-tiho">poslata</span>}
                </div>
            ),
        },
        { kljuc: 'primalaca', naslov: 'Primalaca', desno: true, render: (k) => (k.primalaca ? broj(k.primalaca) : <span className="text-p-tiho">—</span>) },
        { kljuc: 'klikova', naslov: 'Klikova', desno: true, render: (k) => (k.status === 'poslata' ? broj(k.klikova) : <span className="text-p-tiho">—</span>) },
        { kljuc: 'zakazano', naslov: 'Zakazano', desno: true, render: (k) => (k.status === 'poslata' ? broj(k.zakazano) : <span className="text-p-tiho">—</span>) },
        {
            kljuc: 'konverzija', naslov: 'Konverzija', desno: true, sortVrednost: (k) => (k.primalaca ? k.zakazano / k.primalaca : 0),
            render: (k) => (k.status === 'poslata' && k.primalaca ? <span className="font-medium">{procenat(k.zakazano / k.primalaca, 1)}</span> : <span className="text-p-tiho">—</span>),
        },
    ];

    return (
        <div className="flex flex-col gap-4">
            <ZaglavljeStrane naslov="SMS kampanje" opis={`${broj(ukupnoSaPristankom)} klijenata sa pristankom · ${poslate.length} ${mnozina(poslate.length, 'poslata kampanja', 'poslate kampanje', 'poslatih kampanja')} · ${broj(ukupnoZakazano)} ${mnozina(ukupnoZakazano, 'zakazan termin', 'zakazana termina', 'zakazanih termina')} iz poruka`} />

            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
                <Kartica naslov="Nova poruka" opis="Šalje se samo klijentima koji su dali pristanak za SMS.">
                    <div className="space-y-4">
                        <Polje oznaka="Naziv kampanje" pomoc="Vidi ga samo osoblje.">
                            <Unos value={naziv} onChange={(e) => setNaziv(e.target.value)} placeholder="npr. Decembarski termini" />
                        </Polje>
                        <Polje oznaka="Tekst poruke">
                            <TekstPolje value={tekst} onChange={(e) => setTekst(e.target.value.slice(0, 918))} placeholder={`${kratko}: slobodni termini ove nedelje — zakažite online.`} className="min-h-[110px]" />
                        </Polje>
                        <div className="-mt-2 flex flex-wrap items-center justify-between gap-2 text-[12.5px]">
                            <span className="text-p-tiho tabularno">
                                {broj(sms.znakova)} {mnozina(sms.znakova, 'znak', 'znaka', 'znakova')} · <span className={cx('font-medium', sms.delova > 1 ? 'text-p-upoz' : 'text-p-ink')}>{sms.delova || 0} {mnozina(sms.delova, 'SMS', 'SMS-a', 'SMS-ova')}</span>
                                {sms.delova > 0 && ` · još ${sms.ostalo} do sledećeg`}
                            </span>
                            <Znacka ton={sms.unicode ? 'upoz' : 'tiho'}>{sms.unicode ? 'Unicode · 70 po SMS-u' : 'GSM · 160 po SMS-u'}</Znacka>
                        </div>
                        {kvacice && (
                            <div className="flex flex-col gap-2 rounded-xl border border-p-upoz/30 bg-p-upozbg px-3 py-2.5 text-[13px] text-p-upoz sm:flex-row sm:items-center sm:justify-between">
                                <span>Poruka sa č/ć/š/ž/đ ima 70 znakova po SMS-u. Bez kvačica staje 160.</span>
                                <Dugme velicina="sm" ikona={Eraser} onClick={() => setTekst(ukloniKvacice(tekst))}>Ukloni kvačice</Dugme>
                            </div>
                        )}
                        {!kvacice && sms.unicode && <p className="text-[12.5px] text-p-tiho">Emotikoni i posebni navodnici prebacuju poruku na 70 znakova po SMS-u.</p>}

                        <div className="grid gap-4 sm:grid-cols-2">
                            <Polje oznaka="Kome">
                                <Izbor value={segment} onChange={(e) => setSegment(e.target.value)}>
                                    {SEGMENTI.map((s) => <option key={s.id} value={s.id}>{s.naziv} ({grupe[s.id].length})</option>)}
                                </Izbor>
                            </Polje>
                            <Polje oznaka="Kada">
                                <Tabovi stavke={[{ id: 'odmah', naziv: 'Odmah' }, { id: 'zakazi', naziv: 'Zakaži' }]} aktivan={kada} onChange={setKada} className="w-full" />
                            </Polje>
                        </div>
                        {kada === 'zakazi' && (
                            <div className="grid grid-cols-2 gap-4">
                                <Polje oznaka="Datum"><Unos type="date" min={d} value={datum} onChange={(e) => setDatum(e.target.value)} /></Polje>
                                <Polje oznaka="Vreme"><Unos type="time" step={900} value={sat} onChange={(e) => setSat(e.target.value)} /></Polje>
                            </div>
                        )}

                        <div className="flex flex-col gap-3 rounded-xl bg-p-meko/70 px-3 py-3 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-2.5 text-sm">
                                <Users className="h-4 w-4 text-p-tiho" aria-hidden="true" />
                                <span className="tabularno"><span className="font-semibold">Primalaca: {broj(primalaca)}</span><span className="text-p-tiho"> · cena ≈ {broj(primalaca)} × {sms.delova || 1} × 4,5 RSD = </span><span className="font-semibold">{rsd(primalaca * (sms.delova || 1) * CENA_DELA)}</span></span>
                            </div>
                        </div>

                        <div className="flex flex-wrap justify-end gap-2">
                            <Dugme ikona={Smartphone} disabled={!tekst.trim()} onClick={() => obavesti(`Test poruka je poslata na vaš broj${sesija?.ime ? ` (${sesija.ime})` : ''} — demo.`, 'info')}>Pošalji test sebi</Dugme>
                            <Dugme varijanta="glavno" ikona={kada === 'zakazi' ? CalendarClock : Send} disabled={!spremno} onClick={() => setPotvrda(true)}>{kada === 'zakazi' ? 'Zakaži' : 'Pošalji'}</Dugme>
                        </div>
                    </div>
                </Kartica>

                <div className="flex flex-col gap-4">
                    <Kartica naslov="Pregled na telefonu" telo="p-4">
                        <TelefonPregled posiljalac={kratko} tekst={tekst.trim()} vreme={kada === 'zakazi' ? `${datumKratko(datum)} · ${sat}` : 'Sada'} />
                    </Kartica>
                    <Kartica telo="p-4">
                        <ul className="space-y-2 text-[13px] text-p-tiho">
                            <li>Kratko i konkretno: ponuda, rok i kako se zakazuje.</li>
                            <li>Naziv salona na početku — poruka se prepoznaje bez broja u imeniku.</li>
                            <li>Najbolji odziv: utorak–četvrtak, 10–12 h.</li>
                        </ul>
                    </Kartica>
                </div>
            </div>

            <Kartica naslov="Istorija kampanja" opis="Klikovi na link i termini zakazani u 7 dana posle poruke" telo="p-0">
                <Tabela kolone={kolone} redovi={istorija} pocetnoSort={{ kljuc: 'poslato', smer: 'opadajuce' }}
                    prazno={<Prazno ikona={MessageSquareText} naslov="Još nema kampanja" opis="Prva poruka se šalje iz forme iznad." />} />
            </Kartica>

            <Modal otvoren={potvrda} onClose={() => setPotvrda(false)} naslov={kada === 'zakazi' ? 'Zakazati kampanju?' : 'Poslati kampanju?'}
                opis={kada === 'zakazi' ? `${datumBrojevi(datum)} u ${sat}` : 'Poruka odlazi odmah.'}
                podnozje={<><Dugme onClick={() => setPotvrda(false)}>Odustani</Dugme><Dugme varijanta="glavno" data-fokus ikona={kada === 'zakazi' ? CalendarClock : Send} onClick={posalji}>{kada === 'zakazi' ? 'Zakaži' : `Pošalji na ${broj(primalaca)}`}</Dugme></>}>
                <div className="space-y-3 text-sm">
                    <div className="rounded-xl bg-p-meko/70 px-3 py-2.5 whitespace-pre-wrap">{tekst.trim()}</div>
                    <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="rounded-xl border border-p-ivica px-2 py-2"><div className="text-[12px] text-p-tiho">Primalaca</div><div className="font-semibold tabularno">{broj(primalaca)}</div></div>
                        <div className="rounded-xl border border-p-ivica px-2 py-2"><div className="text-[12px] text-p-tiho">SMS po poruci</div><div className="font-semibold tabularno">{sms.delova}</div></div>
                        <div className="rounded-xl border border-p-ivica px-2 py-2"><div className="text-[12px] text-p-tiho">Cena ≈</div><div className="font-semibold tabularno">{rsd(cena)}</div></div>
                    </div>
                    <p className="text-[12.5px] text-p-tiho">{SEGMENTI.find((s) => s.id === segment)?.naziv}. Demo: poruke se ne šalju zaista.</p>
                </div>
            </Modal>
        </div>
    );
}
