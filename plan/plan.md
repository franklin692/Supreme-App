# Supreme House — Piano di Ottimizzazione del Sito

Interventi mirati per rendere il sito più veloce, più visibile su Google e più efficace nel generare contatti, senza attivare servizi esterni in questa fase.
Il lavoro parte dalle basi tecniche e di conversione già presenti e le porta a livello "premium production".

## Per chi è
- **Agenti/Admin**: pubblicano annunci più rapidamente, con un caricamento foto moderno (trascina, riordina, scegli la copertina).
- **Visitatori / acquirenti / venditori**: pagine che aprono in fretta, immagini nitide, percorso chiaro verso il contatto.
- **Motori di ricerca (Google)**: contenuti leggibili, mappa del sito, dati strutturati per comparire meglio nei risultati.

## Cosa include e come cambia l'esperienza

### 1. Velocità e qualità delle immagini (priorità alta)
- Le foto degli immobili si caricano "a scorrimento" (lazy-load): si scaricano solo quando servono, così la pagina appare subito.
- Ogni immagine ha spazio riservato e un effetto di anteprima sfocata finché non è pronta: niente "salti" del layout.
- Le foto caricate vengono ridimensionate e compresse automaticamente (formato web leggero), mantenendo qualità alta ma peso ridotto.

### 2. Caricamento foto direttamente nell'annuncio (richiesto)
- Nella creazione/modifica dell'annuncio: area "trascina qui le foto" con caricamento multiplo e barra di avanzamento.
- Riordino delle foto con trascinamento, scelta della **foto di copertina**, eliminazione singola.
- Le foto restano collegate all'immobile e riutilizzabili dalla Libreria Media.

### 3. Sito più leggero e reattivo
- Le pagine pesanti (Cabina di Regia, Gestionale, Mappa) si caricano "su richiesta", riducendo il tempo della prima apertura.
- Caricamento solo dei caratteri effettivamente usati dal tema attivo, per un avvio più rapido.
- Stati di caricamento, "nessun risultato" ed errore curati e coerenti su tutte le pagine principali.

### 4. Fondamenta SEO (visibilità su Google)
- `robots.txt` e una **mappa del sito** aggiornata automaticamente con tutte le pagine e gli immobili pubblicati.
- **Dati strutturati** (azienda, annuncio immobiliare, breadcrumb) per anteprime più ricche nei risultati di ricerca.
- Tag canonici e immagine di anteprima social predefinita, oltre ai titoli/descrizioni già gestibili dalla Cabina.

### 5. Spinta ai contatti (conversione)
- Pulsante di contatto rapido sempre raggiungibile (usa i recapiti impostati nella Cabina).
- Micro-rifiniture ai moduli di richiesta: validazione chiara, conferma d'invio più rassicurante.

## Flusso d'uso
- **Agente**: apre "Nuovo annuncio" → trascina più foto → le riordina e sceglie la copertina → pubblica; le immagini risultano già ottimizzate.
- **Visitatore**: apre il catalogo o il dettaglio → le pagine compaiono rapidamente, le foto si caricano progressivamente → trova subito prezzo, info e pulsante di contatto.
- **Google**: legge la mappa del sito e i dati strutturati → indicizza immobili e pagine con anteprime più ricche.

## Aspetto e stile (UI/UX)
- Si mantiene l'identità attuale (nero/avorio/bianco/oro) e il tema modificabile dalla Cabina: nessun colore nuovo imposto.
- L'obiettivo percepito è "più veloce e più solido": niente salti di layout, transizioni morbide, coerenza tra le pagine.

## Fasi di realizzazione

### Fase 1 — MVP (si realizza ora)
- Ottimizzazione immagini: lazy-load, spazio riservato + anteprima sfocata, compressione/ridimensionamento automatico in upload.
- Nuovo caricamento foto nell'annuncio: multiplo con trascinamento, riordino, scelta copertina, eliminazione.
- Alleggerimento: caricamento su richiesta delle pagine pesanti e dei soli caratteri usati.
- SEO di base: robots.txt, mappa del sito automatica, dati strutturati (azienda + annuncio + breadcrumb), canonical e OG di default.
- Stati di caricamento/vuoto/errore curati sulle pagine principali.

### Fase 2 — Conversione ed engagement (dopo approvazione)
- Pulsante contatto rapido fisso e rifiniture ai moduli lead.
- Immobili "preferiti" e "visti di recente" (salvati sul dispositivo, senza account).
- Filtri catalogo avanzati (prezzo/mq) e ordinamenti; mini-grafico andamento richieste nella Panoramica.
- Condivisione annuncio e dossier PDF dell'immobile.

### Fase 3 — Avanzato (da valutare, può richiedere servizi esterni)
- Email reali (notifica agente a ogni lead, conferma all'utente) e newsletter — rinviate come da tua scelta.
- Statistiche di traffico rispettose della privacy e test sui pulsanti.
- Pre-rendering/SSR per la massima resa SEO, PWA/offline, CDN immagini, multilingua, clustering/heatmap sulla mappa.

## Assunzioni (decise senza chiedere)
- Priorità "mix equilibrato": in Fase 1 si bilanciano performance, SEO tecnico e immagini; la conversione pura (preferiti, PDF, filtri avanzati) va in Fase 2.
- Nessuna integrazione esterna in questa fase: email/newsletter reali restano in Fase 3.
- Compressione immagini verso un formato web leggero con larghezza massima ~1920px (qualità alta); gli URL/immagini esistenti restano validi.
- La mappa del sito include solo contenuti pubblici (pagine + immobili non conclusi/non riservati off-market).
- I dati strutturati usano i dati reali dell'immobile; eventuali valori promozionali non vengono dichiarati come dati certificati.
- Si mantengono intatti tema dinamico, Cabina di Regia e tutte le funzionalità attuali; nessun dato reale viene alterato per ragioni estetiche.
- Le "statistiche" mostrate restano quelle già presenti; non si inventano numeri.
