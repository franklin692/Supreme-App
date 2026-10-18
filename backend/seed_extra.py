"""Extra seed data: FAQ + editable site settings (content + theme)."""

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
    "color_gold": "#BE9E5E",          # primary / accent (gold)
    "color_gold_strong": "#A5823F",   # heading gradient / strong gold text
    "color_ink": "#16150F",           # dark buttons / ink
    "color_bg": "#F6F4EE",            # page background
    "color_surface": "#FFFFFF",       # cards / panels
    "color_text": "#16150F",          # body text
    "color_emerald": "#10B981",       # positive / live accent
    "color_amber": "#F59E0B",         # warning / highlight accent
    "font_display": "Sora",           # headings
    "font_body": "Manrope",           # body text
    "radius": 20,                      # card corner radius (px)
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
}
