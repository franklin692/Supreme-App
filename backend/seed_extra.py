"""Extra seed data: FAQ + editable site settings (content, theme, layout, home sections)."""

SEED_FAQ = [
    {"order": 1, "active": True,
     "question": "Supreme House ha un ufficio fisico dove posso venire?",
     "answer": "Operiamo con un modello moderno: sono i nostri Private Advisor a venire da te, direttamente presso il tuo immobile, in video-desk o presso lo studio tecnico/notarile partner. Copriamo tutta la Basilicata con consulenti a domicilio entro 24h."},
    {"order": 2, "active": True,
     "question": "Quanto costa affidarvi la vendita o la gestione del mio immobile?",
     "answer": "La valutazione e il primo incontro sono gratuiti. Le condizioni dipendono dal servizio scelto (vendita, locazione garantita, property management, gestione B&B). Ti presentiamo sempre tutto in modo trasparente prima di qualsiasi incarico."},
    {"order": 3, "active": True,
     "question": "Cosa significa immobile 'Off-Market'?",
     "answer": "È un immobile che vendiamo o affittiamo senza pubblicarlo online, proponendolo solo ai clienti e investitori selezionati della nostra lista riservata. Massima privacy per il proprietario e opportunità in anteprima per gli investitori."},
    {"order": 4, "active": True,
     "question": "Come funziona il gestionale per i proprietari di B&B?",
     "answer": "Gestiamo il tuo immobile chiavi in mano e tu monitori tutto dal telefono come un conto corrente: incassi, tasso di occupazione, check-in ospiti, bonifici, manutenzioni e bollette. Prova la Demo Live dalla home."},
    {"order": 5, "active": True,
     "question": "Posso guadagnare segnalando un immobile?",
     "answer": "Sì. Chiunque segnali un immobile in vendita, affitto o vuoto riceve un compenso tracciato (200€–500€+). Puoi seguire lo stato della tua segnalazione direttamente dal tuo profilo Segnalatore."},
    {"order": 6, "active": True,
     "question": "Gli immobili sono verificati?",
     "answer": "Gli immobili con lo scudo dorato 'Pre-Verificato Supreme House' hanno visura ipotecaria e catastale controllate, planimetria e conformità verificate dallo Studio Tecnico Partner e idoneità mutuo/rendita certificata."},
]

# Default editable theme (brand look). Managed from Cabina di Regia -> Aspetto & Tema.
DEFAULT_THEME = {
    "mode": "light",
    "color_gold": "#BE9E5E",
    "color_gold_strong": "#A5823F",
    "color_ink": "#16150F",
    "color_bg": "#F6F4EE",
    "color_surface": "#FFFFFF",
    "color_text": "#16150F",
    "color_emerald": "#10B981",
    "color_amber": "#F59E0B",
    "font_display": "Sora",
    "font_body": "Manrope",
    "radius": 20,
}

# Navigation (menu + logo). Routes (`to`) are fixed; label/visibility/order editable.
DEFAULT_NAVBAR = {
    "logo_letter": "S",
    "logo_image": "",
    "items": [
        {"label": "Hub", "to": "/", "visible": True},
        {"label": "Immobili", "to": "/immobili", "visible": True},
        {"label": "Chi Cerca", "to": "/chi-cerca", "visible": True},
        {"label": "Servizi", "to": "/servizi", "visible": True},
    ],
}

DEFAULT_FOOTER = {
    "col1_title": "Presidi",
    "col1_items": ["Potenza Città", "Vulture-Melfese", "Val d'Agri", "Matera", "Maratea & Pollino", "Metapontino"],
    "col2_title": "Contatti",
    "col2_items": ["Consulente a domicilio in 24h", "Video-Desk Direzionale", "Studio Tecnico Partner"],
    "phone": "+39 0971 000000",
    "whatsapp": "+39 0971 000000",
    "email": "info@supremehouse.it",
    "address": "Potenza, Basilicata",
    "socials": [
        {"platform": "Instagram", "url": ""},
        {"platform": "Facebook", "url": ""},
    ],
    "copyright_suffix": "Osservatorio Immobiliare Basilicata",
}

# Home page: ordered, toggleable sections with editable content.
DEFAULT_HOME = {
    "order": ["hero", "buyers", "featured", "bnb", "neighborhoods", "poles", "stats", "concluded", "faq", "network"],
    "sections": {
        "hero": {
            "visible": True,
            "eyebrow": "Immobiliare di nuova generazione",
            "title": "Il modo moderno di vivere, vendere e gestire casa",
            "title_accent": "in Basilicata.",
            "subtitle": "Hub di servizi immobiliari, property management, aste e intermediazione. Nessun ufficio da raggiungere: i nostri advisor vengono da te.",
            "card_top": "Non ci limitiamo a vendere immobili.",
            "card_bottom": "Creiamo Valore.",
            "cta_primary": "Prenota un Private Advisor",
            "cta_secondary": "Esplora gli Immobili",
            "image": "https://images.unsplash.com/photo-1611416457332-946853cc75d6?crop=entropy&cs=srgb&fm=jpg&q=85&w=2000",
            "trust_badges": ["Immobili Pre-Verificati", "Consulente a domicilio in 24h", "18 Comuni presidiati"],
        },
        "buyers": {
            "visible": True,
            "eyebrow": "Mercato Rovesciato · Live",
            "title": "Chi cerca casa ORA",
            "subtitle": "Clienti verificati pronti a comprare o affittare. Hai un immobile adatto? Proponilo subito.",
        },
        "featured": {
            "visible": True,
            "eyebrow": "Vetrina · Ordinati per visualizzazioni",
            "title": "Immobili & Aste più visti",
            "subtitle": "Le opportunità che stanno catturando l'attenzione dei nostri clienti in questo momento.",
        },
        "bnb": {
            "visible": True,
            "eyebrow": "Esclusiva Proprietari",
            "title": "Il Gestionale che fa sembrare il tuo B&B un conto di Home Banking",
            "body": "Monitora dal telefono incassi mensili, tasso di occupazione, check-in ospiti, storico bonifici, manutenzioni e bollette. I proprietari Supreme House non pensano a nulla: incassano e basta.",
            "cta_demo": "Prova Ora la Demo Live del Gestionale",
            "cta_affida": "Affida il tuo immobile",
            "cards": [
                {"k": "+1.340€", "v": "Incassi questo mese"},
                {"k": "94%", "v": "Tasso occupazione"},
                {"k": "1.290€", "v": "Ultimo bonifico ✔️"},
                {"k": "100%", "v": "Gestione chiavi in mano"},
            ],
        },
        "neighborhoods": {
            "visible": True,
            "eyebrow": "Osservatorio Live Potenza",
            "title": "I quartieri più richiesti",
            "subtitle": "Dove cercano i nostri clienti verificati, in tempo reale.",
        },
        "poles": {
            "visible": True,
            "eyebrow": "Copertura Regionale",
            "title": "I 6 Poli strategici della Basilicata",
            "subtitle": "Presidi operativi attivi, consulenti a domicilio in 24h, dossier gestiti in ogni area.",
        },
        "stats": {
            "visible": True,
            "eyebrow": "Il Gruppo in numeri",
            "title": "Statistiche Globali del Gruppo",
        },
        "concluded": {
            "visible": True,
            "eyebrow": "Track Record",
            "title": "Operazioni Concluse",
            "subtitle": "Risultati reali. Ogni operazione chiusa è una promessa mantenuta.",
        },
        "faq": {
            "visible": True,
            "eyebrow": "Domande frequenti",
            "title": "Tutto quello che vuoi sapere",
        },
        "network": {
            "visible": True,
            "eyebrow": "Entra nel network",
            "title": "Cresci con Supreme House",
            "cards": [
                {"kind": "segnala", "title": "Segnala un Immobile e Guadagna", "amount": "200€ – 500€+",
                 "desc": "Chiunque segnali un immobile in vendita, affitto o vuoto riceve un compenso tracciato nel proprio profilo."},
                {"kind": "lavora", "title": "Lavora con Noi", "amount": "Diventa Agente",
                 "desc": "Candidati per diventare Agente o Consulente Supreme House e opera nel tuo territorio."},
                {"kind": "partner", "title": "Collabora / Accreditamento Partner", "amount": "Rete Partner",
                 "desc": "Professionisti del settore: entra nella rete accreditata Supreme House."},
            ],
        },
    },
}

DEFAULT_PAGES = {
    "immobili": {"eyebrow": "Catalogo & Mappa", "title": "Immobili, Aste e Opportunità",
                 "subtitle": "Esplora gli immobili sulla mappa dei quartieri di Potenza o nel catalogo filtrabile."},
    "servizi": {"eyebrow": "Hub Multiservizi", "title": "I Servizi Supreme House",
                "subtitle": "Un unico interlocutore per l'intero ciclo di vita del tuo immobile: dalla valorizzazione alla gestione, dalle aste agli adempimenti."},
    "chi_cerca": {"eyebrow": "Borsa Acquirenti · Mercato Rovesciato", "title": "Richieste Attive & Investitori in Attesa",
                  "subtitle": "Clienti verificati pronti all'acquisto o alla locazione. Qui sono gli immobili a cercare i proprietari."},
}

DEFAULT_SEO = {
    "site_title": "Supreme House — Immobiliare Potenza & Basilicata",
    "default_description": "Hub immobiliare moderno: vendita, affitto, aste, property management e intermediazione a Potenza e in tutta la Basilicata.",
    "og_image": "",
    "pages": {
        "home": {"title": "Supreme House — Casa, Investimenti e Property Management in Basilicata",
                 "description": "Scopri immobili pre-verificati, aste e servizi immobiliari d'élite a Potenza e in Basilicata."},
        "immobili": {"title": "Immobili & Aste — Supreme House",
                     "description": "Catalogo immobili in vendita e affitto, aste giudiziarie e opportunità off-market a Potenza e in Basilicata."},
        "servizi": {"title": "Servizi Immobiliari — Supreme House",
                    "description": "Property management, valorizzazione, aste, off-market e adempimenti. Un unico interlocutore in Basilicata."},
        "chi_cerca": {"title": "Chi Cerca Casa — Borsa Acquirenti Supreme House",
                      "description": "Clienti e investitori verificati in cerca di immobili a Potenza e in Basilicata."},
    },
}

SEED_SETTINGS = {
    "id": "site",
    "brand_name": "SUPREME HOUSE",
    "brand_tagline": "Real Estate · Potenza & Basilicata",
    "hero_eyebrow": "Immobiliare di nuova generazione",
    "hero_title": "Il modo moderno di vivere, vendere e gestire casa",
    "hero_title_accent": "in Basilicata.",
    "hero_subtitle": "Hub di servizi immobiliari, property management, aste e intermediazione. Nessun ufficio da raggiungere: i nostri advisor vengono da te, in tutta la regione.",
    "hero_card_top": "Non ci limitiamo a vendere immobili.",
    "hero_card_bottom": "Creiamo Valore.",
    "agency_phone": "+390971000000",
    "agency_whatsapp": "+390971000000",
    "footer_desc": "Hub immobiliare moderno: servizi, property management, aste e intermediazione d'élite. Sede a Potenza, operatività in tutta la Basilicata.",
    "theme": DEFAULT_THEME,
    "navbar": DEFAULT_NAVBAR,
    "footer": DEFAULT_FOOTER,
    "home": DEFAULT_HOME,
    "pages": DEFAULT_PAGES,
    "seo": DEFAULT_SEO,
}
