# SUPREME HOUSE — PRD

## Problem Statement (originale)
Build 1.0 completa della Web App + Piattaforma Gestionale per "SUPREME HOUSE": hub di servizi immobiliari, property management, aste e intermediazione d'élite con sede a Potenza e operatività in tutta la Basilicata. Estetica "Private Banking Luxury Dark Mode" (nero ossidiana/blu notte, oro champagne, ambra, verde smeraldo, glassmorphism). Tutto modificabile dalla "Cabina di Regia" (Super-Admin) senza toccare il codice. Dati realistici precaricati su Potenza/Basilicata.

## Stack & Architettura
- Frontend: React 19 + Tailwind + shadcn/ui + framer-motion + recharts + react-leaflet (CartoDB dark, key-free) + react-fast-marquee. Alias `@` → src.
- Backend: FastAPI, tutte le route sotto `/api`, auth JWT Bearer (token in localStorage `sh_token`).
- DB: MongoDB (collections: users, properties, neighborhoods, poles, stats, ticker, services, buyer_requests, leads, appointments, vip_links). Documenti con `id` uuid, proiezione `{_id:0}`.
- Seed idempotente in `seed_data.py` (eseguito a startup).

## Scelte utente
- Auth JWT username/password: admin/admin123 (super-admin), agente/agente123 (agente) + demo 1-click per utente/bnb/condomino/collaboratore.
- Foto stock reali. Mappa Leaflet dark. Lead SOLO salvati nell'Archivio Admin + link wa.me (NESSUN invio WhatsApp reale).

## Ruoli / Autorizzazioni
- public: contenuti, lead, buyer-request pubblica, vip/{token}.
- staff (admin+agent): agenda, archivio lead, CRUD immobili.
- admin only: motore hype/boost, quartieri/poli, ticker/stats/servizi/bacheca, link VIP, utenti. (agent → 403).

## Implementato (2026-10-18)
- 5 sezioni nav: Hub, Immobili (+mappa), Chi Cerca, Servizi, Accedi. Top-nav desktop + bottom-nav mobile + ticker Wall Street.
- HUB: hero + modale Private Advisor (3 opzioni+fascia), carosello Chi Cerca, vetrina Più Visti + card Off-Market sfocata, sponsor Gestionale B&B + Demo Live (recharts), classifica 6 quartieri (Osservatorio), 6 Poli, 6 contatori animati, Operazioni Concluse, Segnala/Lavora/Collabora (Partner con selettore categoria).
- IMMOBILI: bottone mappa → Leaflet dark con pin oro + cerchi quartieri; selettori VENDITA/AFFITTO; filtri rapidi; card con RIF, doppio contatore hype, pillola osservazione, badge status, prezzo barrato, scudo pre-verificato.
- DETTAGLIO: gallery, before/after trascinabile, Iper-Potentini, termometro spese, scudo 3 spunte, Nota Advisor, planimetria sfocata che si sblocca con lead, mappa esatta, CTA con fascia oraria, alert ribasso prezzo.
- CHI CERCA: card stile banca privata + "Proponilo" + inserimento nuova richiesta.
- SERVIZI: 9 servizi con pagina dedicata; Off-Market con 2 moduli (proprietari/investitori); Property Management con Demo.
- ACCEDI: ACCEDI/REGISTRATI, 5 ruoli, login admin/agente, demo 1-click; register.
- GESTIONALE (AREA 1): Agenda per fascia oraria + stato + nuovo appuntamento; Archivio Lead unificato (ricerca/filtro, wa.me, note/stato); CRUD Immobili/Aste/Concluse con tutti i campi speciali.
- CABINA DI REGIA (AREA 2, admin): Motore Hype (+50/+100/+500 views, +5 shares, input libero, switch osservazione, bollini, Auto-Boost Globale); Quartieri & Poli editabili; Gestione Sito (ticker, 6 contatori, servizi CRUD, bacheca CRUD/approva); Generatore Link VIP (pagina nera/oro /vip/{token}); Gestione Utenti (provvigioni segnalatori).
- PANNELLI RUOLO: utente, proprietario B&B (dashboard home-banking), condòmino (avvisi/rate/verbali/guasti), collaboratore (barra 4 step).
- Seed: 6 immobili+1 off-market+4 concluse, 6 quartieri, 6 poli, 6 stats, 5 richieste bacheca, 9 servizi, 5 appuntamenti+lead, demo users.

## Note / MOCKED
- WhatsApp/alert prezzo: NESSUN invio reale — i contatti sono SOLO salvati nei Lead con link wa.me (scelta utente confermata).
- Nessuna integrazione LLM/pagamenti in Build 1.0.

## Testing
- Backend: 34/34 pytest PASS. Frontend: ~95% (tutti i flussi verificati dal testing agent; tile mappa spostati su CartoDB key-free verificato 200).

## Iterazione 2 (2026-10-18) — Restyle chiaro + feature
- Re-theme completo in LIGHT luxury (avorio/oro/nero) come sito di riferimento: index.css (card bianche, .metallic oro, .btn-dark), flip className dark→light su tutti i componenti (Ticker e /vip restano scuri di proposito). Hero con card nera "Creiamo Valore".
- Scheda immobile ridisegnata (ricca e grafica): gallery con dots, pill RIF+status, prezzo grande, griglia 6 feature card, Descrizione+Nota Advisor, Caratteristiche checklist, Iper-Potentini, scudo, planimetria sfocata sbloccabile, mappa Posizione, barra CTA sticky (Richiedi info + WhatsApp + telefono).
- Mappa: provider OpenStreetMap key-free (risolto "API KEY REQUIRED"). 18 tile caricate, nessuna chiave.
- Admin: sezione Backup (export JSON / import ripristino) — endpoint /api/admin/backup/export|import.
- Newsletter: form nel footer + endpoint /api/newsletter + sezione admin elenco iscritti.
- Testing agent iter2: backend 42 test PASS, frontend 100%, bug mappa confermato risolto.

## Iterazione 3 (2026-10-18) — Modern minimal + Cabina di Regia potenziata
- Restyle moderno/minimalista: font display Sora, palette avorio/oro/nero raffinata, card flat, bottoni solidi (metallic oro + btn-dark nero), rimossi riferimenti "private banking".
- Sezione FAQ in Home (accordion) + CRUD FAQ dalla Cabina di Regia (backend /api/faq, /api/admin/faq).
- Cabina di Regia SEPARATA: /dashboard (agenti: agenda, lead, immobili) con pulsante "Cabina di Regia" → /cabina-di-regia (solo admin) con sidebar a gruppi. Editabile praticamente tutto: Contenuti Sito (hero/brand/contatti/footer via /content/settings), Ticker/Statistiche/Servizi/Bacheca, FAQ, Quartieri&Poli, Hype, Link VIP, Newsletter, Utenti, Backup + INTEGRAZIONI/Config generiche (key-value) per aggiungere qualsiasi servizio in autonomia.
- Mappa: scura + elegante tramite OpenStreetMap (key-free) con filtro CSS (CartoDB richiedeva API key). Click su immobile apre una mini-scheda popup (foto, prezzo, "Vedi annuncio") senza lasciare la mappa; zone quartieri con cerchi/etichette oro.
- Registrazione: solo come Utente (altri ruoli creati dall'admin con credenziali dedicate).
- Testing agent iter3: backend 52/52 PASS, frontend ok; fix mappa verificato (iter4): tile OSM senza watermark, popup funzionante.

## Backlog / Prossimi (P1/P2)
- P1: Ricerca avanzata catalogo (prezzo/mq/locali), notifica email agente su nuovo lead (Resend), vista agenda settimanale drag&drop.
- P2: Dossier PDF brandizzato per immobile, heatmap quartieri sulla mappa, salvataggio immobili preferiti lato utente reale, upload foto via object storage.

## REVISIONE CMS CABINA DI REGIA — Lavoro multi-fase (avviato 2026-10-18)
Obiettivo utente: rendere gestibile dalla Cabina di Regia TUTTO il sito (contenuti, sezioni, presentazione, SEO, media, stili/colori/font) senza codice.

### Audit copertura (sintesi)
- Già gestibile+persistente: immobili (CRUD), servizi, bacheca, ticker/stats, FAQ, hero/brand/footer-text (settings), quartieri/poli (solo edit), VIP/utenti/newsletter/backup/config.
- Hardcoded da sistemare: Navbar (brand/menu), Footer (colonne/social/recapiti), quasi tutte le sezioni Home (titoli, card B&B, card network, badge hero, immagine), testi pagine Immobili/Servizi/ChiCerca, filtri catalogo. Mancano del tutto: editor tema/colori, SEO, media library/upload, create/delete/reorder quartieri&poli.

### Piano a fasi (modalità: fase per fase, confermata dall'utente)
- FASE 1 ✅ Tema dinamico (colori/font/raggio) editabile dalla Cabina + persistenza.
- FASE 2 ⏳ CMS contenuti globali: Navbar/Footer dinamici, Editor Sezioni Home (mostra/nascondi, riordina, testi, card), testi pagine.
- FASE 3 ⏳ Catalogo+Media+SEO: quartieri/poli CRUD+reorder, Media Library con UPLOAD REALE (object storage, confermato), SEO per pagina e immobile.
- FASE 4 ⏳ Verifica reale end-to-end + testing agent completo.

### FASE 1 — COMPLETATA (2026-10-18)
- Backend: `settings.theme` (12 campi) con backfill non distruttivo su doc esistente; GET /content/settings, PUT /admin/settings ($set merge).
- Frontend: variabili CSS `--sh-*` in index.css consumate da body/.metallic/.btn-dark/.text-gold-gradient/.glass/radius; tailwind gold/amber/emerald = var(--sh-*). `ThemeInjector` applica il tema da DB su documentElement. Pannello Cabina "Aspetto & Tema" (`ThemeSection`): color picker, font titoli/testo, slider raggio, palette rapide, anteprima live, salva/ripristina; cleanup su unmount.
- Test: iteration_5.json — frontend 100%, persistenza E2E verificata (modifica→salva→reload Home riflette il colore; reset ai default confermato).
