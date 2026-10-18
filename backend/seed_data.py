"""Seed data for Supreme House — Potenza & Basilicata."""
import uuid
from datetime import datetime, timezone, timedelta


def _id():
    return str(uuid.uuid4())


def _iso(days_ago=0):
    return (datetime.now(timezone.utc) - timedelta(days=days_ago)).isoformat()


def _today():
    return datetime.now(timezone.utc).strftime("%Y-%m-%d")


def _tomorrow():
    return (datetime.now(timezone.utc) + timedelta(days=1)).strftime("%Y-%m-%d")


IMG = {
    "living1": "https://images.pexels.com/photos/13722888/pexels-photo-13722888.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    "living2": "https://images.unsplash.com/photo-1757924461488-ef9ad0670978?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
    "living3": "https://images.unsplash.com/photo-1541194577687-8c63bf9e7ee3?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
    "living4": "https://images.unsplash.com/photo-1724582586529-62622e50c0b3?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
    "living5": "https://images.pexels.com/photos/13722886/pexels-photo-13722886.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    "living6": "https://images.unsplash.com/photo-1564078516393-cf04bd966897?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
    "kitchen1": "https://images.unsplash.com/photo-1630699293784-9f977570255a?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
    "kitchen2": "https://images.unsplash.com/photo-1630699144641-72fa7a6b8aa1?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
    "kitchen3": "https://images.unsplash.com/photo-1560448075-cbc16bb4af8e?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
    "kitchen4": "https://images.unsplash.com/photo-1630699376289-b62375a35505?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
    "stone1": "https://images.unsplash.com/photo-1788624932351-ee8fcd3fdc3e?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
    "stone2": "https://images.unsplash.com/photo-1764172356965-906969e29fcb?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
    "stone3": "https://images.pexels.com/photos/20422675/pexels-photo-20422675.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    "bnb1": "https://images.unsplash.com/photo-1761470371217-a4de0ff0e8df?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
    "bnb2": "https://images.pexels.com/photos/7745929/pexels-photo-7745929.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
    "bnb3": "https://images.unsplash.com/photo-1611234688667-76b6d8fadd75?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
    "maratea": "https://images.unsplash.com/photo-1627024362067-b7698910b0b7?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
    "matera": "https://images.unsplash.com/photo-1573068884363-19f439beb95a?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
    "floorplan": "https://images.unsplash.com/photo-1460317442991-0ec209397118?crop=entropy&cs=srgb&fm=jpg&q=85&w=1200",
}

VERIFY_CHECKS = [
    "Visura Ipotecaria e Catastale controllata",
    "Planimetria e Conformità verificate dallo Studio Tecnico Partner",
    "Idoneità Mutuo / Rendita certificata",
]


def _prop(**kw):
    base = {
        "id": _id(),
        "views": 0,
        "whatsapp_shares": 0,
        "observing_now": False,
        "observing_count": 3,
        "last_request_hours": 4,
        "status_badges": [],
        "photos": [],
        "before_photo": None,
        "after_photo": None,
        "floorplan_photo": IMG["floorplan"],
        "pre_verified": True,
        "verification_checks": VERIFY_CHECKS,
        "elevator": True,
        "garage": "Posto auto",
        "energy_class": "C",
        "condo_fee": "25€/mese",
        "heating": "Termoautonomo",
        "created_at": _iso(),
    }
    base.update(kw)
    return base


SEED_PROPERTIES = [
    _prop(
        ref_code="SH-PZ-412", type="affitto", sale_type="affitto",
        title="Trilocale Luminoso Macchia Romana", neighborhood="Macchia Romana", city="Potenza",
        price=720, price_period="mese", old_price=None, discount_pct=None,
        views=1420, whatsapp_shares=24, observing_now=True, observing_count=3, last_request_hours=4,
        status_badges=["🔥 IL PIÙ VISTO DELLA SETTIMANA", "💎 ESCLUSIVA SUPREME HOUSE"],
        lat=40.6492, lng=15.8041,
        photos=[IMG["living1"], IMG["living2"], IMG["kitchen1"]],
        before_photo=IMG["living6"], after_photo=IMG["living1"],
        mq=95, rooms=3, bathrooms=2, floor="3°",
        rendita_stimata="720€/mese · B&B stimato +940€/mese",
        distances={"ospedale": 6, "unibas": 4, "scale_mobili": 120, "gallitello": 8},
        advisor_note="Immobile in zona a più alta richiesta di Potenza. Domanda affitti universitari e sanitari costante: consigliato per reddito stabile con tempi di locazione sotto i 21 giorni.",
    ),
    _prop(
        ref_code="SH-PZ-205", type="vendita", sale_type="vendita",
        title="Bilocale Ristrutturato Centro Storico", neighborhood="Centro Storico", city="Potenza",
        price=122000, price_period=None, old_price=135000, discount_pct=-9.6,
        views=980, whatsapp_shares=15, observing_now=True, observing_count=2, last_request_hours=2,
        status_badges=["💎 ESCLUSIVA SUPREME HOUSE"],
        lat=40.6410, lng=15.8055,
        photos=[IMG["stone1"], IMG["living3"], IMG["kitchen2"]],
        before_photo=IMG["living5"], after_photo=IMG["living3"],
        mq=65, rooms=2, bathrooms=1, floor="2°", elevator=False, energy_class="D", condo_fee="30€/mese",
        rendita_stimata="Affitto stimato 520€/mese",
        distances={"ospedale": 9, "unibas": 10, "scale_mobili": 50, "gallitello": 6},
        advisor_note="Prezzo ribassato del 9,6% per vendita rapida. Posizione nel cuore di Via Pretoria, ideale per primo investimento o affitto breve turistico.",
    ),
    _prop(
        ref_code="SH-PZ-318", type="asta", sale_type="vendita",
        title="Appartamento 4 Vani — Asta Giudiziaria", neighborhood="Poggio Tre Galli", city="Potenza",
        price=88000, price_period=None, old_price=142000, discount_pct=-38.0,
        views=2100, whatsapp_shares=41, observing_now=True, observing_count=5, last_request_hours=1,
        status_badges=["🔨 ASTA AD ALTO RENDIMENTO (-42%)", "🔥 IL PIÙ VISTO DELLA SETTIMANA"],
        lat=40.6351, lng=15.7952,
        photos=[IMG["living4"], IMG["kitchen4"], IMG["living2"]],
        before_photo=IMG["living4"], after_photo=IMG["living2"],
        mq=105, rooms=4, bathrooms=2, floor="4°", energy_class="E", condo_fee="40€/mese",
        rendita_stimata="Rendita post-ristrutturazione +820€/mese",
        distances={"ospedale": 12, "unibas": 8, "scale_mobili": 400, "gallitello": 10},
        advisor_note="Asta con base d'asta -38% sul valore di mercato. Assistenza Supreme House per saldo e stralcio e valutazione mutuo. Rendimento stimato 11% post-intervento.",
    ),
    _prop(
        ref_code="SH-PZ-276", type="vendita", sale_type="vendita",
        title="Attico Panoramico Zona Gallitello", neighborhood="Gallitello", city="Potenza",
        price=210000, price_period=None, old_price=None, discount_pct=None,
        views=1650, whatsapp_shares=29, observing_now=False, observing_count=4, last_request_hours=6,
        status_badges=["⏳ TRATTATIVA IN CORSO (Affrettati)"],
        lat=40.6378, lng=15.8151,
        photos=[IMG["living2"], IMG["kitchen3"], IMG["living1"]],
        before_photo=IMG["living5"], after_photo=IMG["living2"],
        mq=140, rooms=5, bathrooms=2, floor="7° (Attico)", garage="Box auto doppio", energy_class="B", condo_fee="55€/mese",
        rendita_stimata="Affitto stimato 850€/mese",
        distances={"ospedale": 8, "unibas": 12, "scale_mobili": 300, "gallitello": 2},
        advisor_note="Attico con terrazzo panoramico e doppio box. Trattativa già avviata con un cliente verificato: finestra d'opportunità molto breve per chi vuole subentrare.",
    ),
    _prop(
        ref_code="SH-PZ-149", type="affitto", sale_type="affitto",
        title="Monolocale Arredato Zona Ospedale", neighborhood="Zona Verdi/Ospedale", city="Potenza",
        price=480, price_period="mese", old_price=None, discount_pct=None,
        views=760, whatsapp_shares=11, observing_now=False, observing_count=2, last_request_hours=9,
        status_badges=["💎 ESCLUSIVA SUPREME HOUSE"],
        lat=40.6451, lng=15.7981,
        photos=[IMG["bnb3"], IMG["living6"], IMG["kitchen1"]],
        before_photo=IMG["bnb3"], after_photo=IMG["bnb2"],
        mq=42, rooms=1, bathrooms=1, floor="1°", elevator=False, energy_class="C", condo_fee="20€/mese",
        rendita_stimata="480€/mese · domanda sanitaria costante",
        distances={"ospedale": 2, "unibas": 9, "scale_mobili": 600, "gallitello": 7},
        advisor_note="Monolocale a pochi passi dall'Ospedale San Carlo: target perfetto per personale medico in trasferta. Locazione garantita tutto l'anno.",
    ),
    _prop(
        ref_code="SH-PZ-330", type="vendita", sale_type="vendita",
        title="Villa a Schiera Macchia Romana", neighborhood="Macchia Romana", city="Potenza",
        price=265000, price_period=None, old_price=289000, discount_pct=-8.3,
        views=1340, whatsapp_shares=22, observing_now=False, observing_count=3, last_request_hours=5,
        status_badges=["💎 ESCLUSIVA SUPREME HOUSE"],
        lat=40.6505, lng=15.8075,
        photos=[IMG["living4"], IMG["kitchen2"], IMG["living3"]],
        before_photo=IMG["living5"], after_photo=IMG["living4"],
        mq=160, rooms=6, bathrooms=3, floor="Villa su 2 livelli", garage="Garage + giardino", energy_class="A", condo_fee="Nessuno",
        rendita_stimata="Affitto stimato 1.050€/mese",
        distances={"ospedale": 7, "unibas": 3, "scale_mobili": 250, "gallitello": 9},
        advisor_note="Villa in classe A con giardino privato nella zona più richiesta. Prezzo appena ribassato: opportunità del mese per famiglie e investitori long-term.",
    ),
    # ---- Operazioni concluse ----
    _prop(
        ref_code="SH-PZ-098", type="conclusa", sale_type="vendita",
        title="Bilocale Via Pretoria — VENDUTO", neighborhood="Centro Storico", city="Potenza",
        price=118000, views=640, whatsapp_shares=9,
        concluded_badge="✔️ VENDUTO IN 18 GIORNI", lat=40.6412, lng=15.8050,
        photos=[IMG["stone1"]], advisor_note="",
    ),
    _prop(
        ref_code="SH-PZ-101", type="conclusa", sale_type="affitto",
        title="Trilocale Macchia Romana — AFFITTATO", neighborhood="Macchia Romana", city="Potenza",
        price=690, price_period="mese", views=520, whatsapp_shares=7,
        concluded_badge="✔️ AFFITTATO IN 48 ORE", lat=40.6488, lng=15.8038,
        photos=[IMG["living1"]], advisor_note="",
    ),
    _prop(
        ref_code="SH-PZ-077", type="conclusa", sale_type="vendita",
        title="Asta Poggio Tre Galli — AGGIUDICATA", neighborhood="Poggio Tre Galli", city="Potenza",
        price=79000, views=880, whatsapp_shares=18,
        concluded_badge="✔️ ASTA AGGIUDICATA AL -38%", lat=40.6349, lng=15.7948,
        photos=[IMG["living4"]], advisor_note="",
    ),
    _prop(
        ref_code="SH-MT-012", type="conclusa", sale_type="vendita",
        title="Casa Vacanza Maratea — TRASFORMATA IN B&B", neighborhood="Maratea", city="Maratea",
        price=175000, views=910, whatsapp_shares=26,
        concluded_badge="✔️ TRASFORMATO IN B&B (+1.150€/mese)", lat=39.9936, lng=15.7108,
        photos=[IMG["maratea"]], advisor_note="",
    ),
    # ---- Off-Market riservato ----
    _prop(
        ref_code="SH-PZ-OFF", type="offmarket", sale_type="vendita",
        title="Opportunità Riservata Off-Market", neighborhood="Riservato", city="Potenza",
        price=0, views=1180, whatsapp_shares=33,
        rendimento="11% annuo", lat=40.6418, lng=15.8086,
        photos=[IMG["living2"]], pre_verified=True,
        advisor_note="Immobile a reddito fuori mercato riservato alla lista investitori Supreme House. Dati completi disponibili solo dopo verifica del contatto.",
    ),
]


SEED_NEIGHBORHOODS = [
    {"id": _id(), "position": 1, "name": "Macchia Romana", "demand_index": 96, "demand_trend": "+12%",
     "price_sqm": "1.450 €/mq", "avg_yield": "Affitto 720€ · B&B 940€/mese", "avg_time": "21 giorni",
     "clients_waiting": 19, "lat": 40.6492, "lng": 15.8041},
    {"id": _id(), "position": 2, "name": "Poggio Tre Galli", "demand_index": 91, "demand_trend": "+8%",
     "price_sqm": "1.320 €/mq", "avg_yield": "Affitto 640€/mese", "avg_time": "27 giorni",
     "clients_waiting": 14, "lat": 40.6351, "lng": 15.7952},
    {"id": _id(), "position": 3, "name": "Centro Storico", "demand_index": 88, "demand_trend": "+15%",
     "price_sqm": "1.280 €/mq", "avg_yield": "Affitto breve 1.100€/mese", "avg_time": "24 giorni",
     "clients_waiting": 12, "lat": 40.6410, "lng": 15.8055},
    {"id": _id(), "position": 4, "name": "Gallitello", "demand_index": 82, "demand_trend": "+6%",
     "price_sqm": "1.150 €/mq", "avg_yield": "Affitto 580€/mese", "avg_time": "33 giorni",
     "clients_waiting": 9, "lat": 40.6378, "lng": 15.8151},
    {"id": _id(), "position": 5, "name": "Zona Verdi/Ospedale", "demand_index": 79, "demand_trend": "+9%",
     "price_sqm": "1.390 €/mq", "avg_yield": "Affitto sanitario 650€/mese", "avg_time": "19 giorni",
     "clients_waiting": 11, "lat": 40.6451, "lng": 15.7981},
    {"id": _id(), "position": 6, "name": "Rione Lucania", "demand_index": 74, "demand_trend": "+4%",
     "price_sqm": "1.080 €/mq", "avg_yield": "Affitto 520€/mese", "avg_time": "38 giorni",
     "clients_waiting": 7, "lat": 40.6500, "lng": 15.8100},
]


SEED_POLES = [
    {"id": _id(), "order": 1, "name": "Polo Potenza Città", "subtitle": "Università & Ospedale · Sede Operativa Centrale",
     "dossiers": 142, "active": True},
    {"id": _id(), "order": 2, "name": "Polo Vulture-Melfese", "subtitle": "Area Industriale / Trasfertisti",
     "dossiers": 68, "active": True},
    {"id": _id(), "order": 3, "name": "Polo Val d'Agri", "subtitle": "Area Energia / Trasfertisti ENI",
     "dossiers": 54, "active": True},
    {"id": _id(), "order": 4, "name": "Polo Matera & Provincia", "subtitle": "Turismo & Investimenti",
     "dossiers": 97, "active": True},
    {"id": _id(), "order": 5, "name": "Polo Costa di Maratea & Pollino", "subtitle": "Case Vacanza & Luxury B&B",
     "dossiers": 61, "active": True},
    {"id": _id(), "order": 6, "name": "Polo Costa Ionica & Metapontino", "subtitle": "Investimenti Turistici & Residenziali",
     "dossiers": 73, "active": True},
]


SEED_STATS = [
    {"id": _id(), "order": 1, "value": 14.5, "prefix": "+", "suffix": "M €", "label": "Valore Immobili & Aste Analizzati"},
    {"id": _id(), "order": 2, "value": 340, "prefix": "", "suffix": "+", "label": "Clienti Referenziati & Investitori in Banca Dati"},
    {"id": _id(), "order": 3, "value": 94, "prefix": "", "suffix": "%", "label": "Tasso di Occupazione Media B&B Gestiti"},
    {"id": _id(), "order": 4, "value": 28, "prefix": "", "suffix": "+", "label": "B&B e Case Vacanza Gestiti"},
    {"id": _id(), "order": 5, "value": 45, "prefix": "", "suffix": "+", "label": "Condomini Amministrati e Supervisionati"},
    {"id": _id(), "order": 6, "value": 18, "prefix": "", "suffix": "", "label": "Comuni Presidiati in Basilicata"},
]


_MONTHS = ["Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
           "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"]
_now = datetime.now(timezone.utc)
_MONTH_LABEL = f"{_MONTHS[_now.month - 1]} {_now.year}"

SEED_TICKER = {
    "updated_label": _MONTH_LABEL,
    "items": [
        "📈 Macchia Romana: richiesta affitti +14%",
        "🔨 8 Nuove Aste selezionate a Potenza",
        "⚡ Via Pretoria: Bilocale locato in 3 giorni",
        "🏨 Rendita media B&B gestiti Supreme House: +940€/mese",
        f"🛡️ Data ultimo aggiornamento Osservatorio: {_MONTH_LABEL}",
    ],
}


SEED_SERVICES = [
    {"id": _id(), "order": 1, "active": True, "icon": "Lock", "title": "Off-Market & Privacy VIP",
     "short": "Vendi o affitta senza pubblicare nulla online, solo ai nostri clienti selezionati.",
     "full": "Il servizio Off-Market consente al proprietario di proporre il proprio immobile esclusivamente alla rete riservata di clienti e investitori verificati Supreme House, senza alcuna pubblicazione pubblica di foto o indirizzo. Massima riservatezza, nessun curioso, trattativa diretta tra parti selezionate. Gli investitori iscritti alla Lista Riservata ricevono in anteprima le opportunità a più alto rendimento prima che arrivino sul mercato.",
     "dual_forms": True},
    {"id": _id(), "order": 2, "active": True, "icon": "Building2", "title": "Property Management & Gestione B&B Chiavi in Mano",
     "short": "Gestione completa di B&B, case vacanza e immobili a reddito. Tu incassi, pensiamo a tutto noi.",
     "full": "Gestiamo il tuo immobile a 360°: pubblicazione sui portali, pricing dinamico, check-in e check-out ospiti, pulizie, manutenzioni, assistenza e rendicontazione mensile trasparente. Monitori tutto dal telefono con la nostra Demo Gestionale. Tasso di occupazione medio dei nostri immobili: 94%.",
     "dual_forms": False, "demo_link": True},
    {"id": _id(), "order": 3, "active": True, "icon": "ClipboardCheck", "title": "Amministrazione Condominiale Digitale",
     "short": "Gestione trasparente del condominio con portale digitale per i condòmini.",
     "full": "Amministrazione condominiale moderna e trasparente: rendicontazione digitale, avvisi in tempo reale, verbali assembleari online, gestione rate e segnalazione guasti direttamente dall'app. Ogni condòmino accede al proprio pannello personale.",
     "dual_forms": False},
    {"id": _id(), "order": 4, "active": True, "icon": "TrendingUp", "title": "Vendita & Locazione Garantita ad Alto Rendimento",
     "short": "Vendiamo o affittiamo il tuo immobile ai migliori valori di mercato, in tempi record.",
     "full": "Strategia di valorizzazione, home staging virtuale, servizio fotografico professionale e accesso diretto alla nostra banca dati di 340+ clienti referenziati. Tempi medi di vendita sotto i 25 giorni e locazione garantita per gli immobili idonei.",
     "dual_forms": False},
    {"id": _id(), "order": 5, "active": True, "icon": "Gavel", "title": "Assistenza Aste Giudiziarie & Saldo e Stralcio",
     "short": "Ti accompagniamo in tutte le fasi dell'asta e nelle procedure di saldo e stralcio.",
     "full": "Analisi della perizia, valutazione del rendimento, assistenza alla presentazione dell'offerta, supporto per il mutuo e gestione delle procedure di saldo e stralcio. Accedi a immobili fino al -42% del valore di mercato con la nostra consulenza tecnica dedicata.",
     "dual_forms": False},
    {"id": _id(), "order": 6, "active": True, "icon": "FileSearch", "title": "Consulenze Immobiliari, Perizie e Valutazioni",
     "short": "Valutazioni certificate e consulenza strategica sul tuo patrimonio immobiliare.",
     "full": "Perizie di valore, analisi di mercato comparata, consulenza per compravendita e investimento. Ricevi una valutazione professionale del tuo immobile basata sui dati reali dell'Osservatorio Supreme House.",
     "dual_forms": False},
    {"id": _id(), "order": 7, "active": True, "icon": "ScrollText", "title": "Ispezioni Ipotecarie, Visure e Verifiche Catastali",
     "short": "Visure ipotecarie e catastali complete per acquistare in totale sicurezza.",
     "full": "Eseguiamo ispezioni ipotecarie, visure catastali, verifiche di conformità urbanistica e planimetrica tramite il nostro Studio Tecnico Partner. Nessuna sorpresa prima del rogito.",
     "dual_forms": False},
    {"id": _id(), "order": 8, "active": True, "icon": "FileSignature", "title": "Registrazione e Gestione Contratti di Locazione",
     "short": "Registrazione, rinnovo e gestione fiscale dei contratti d'affitto.",
     "full": "Ci occupiamo della stesura, registrazione telematica, rinnovo e risoluzione dei contratti di locazione, oltre agli adempimenti fiscali (cedolare secca, imposta di registro). Il tuo affitto sempre in regola.",
     "dual_forms": False},
    {"id": _id(), "order": 9, "active": True, "icon": "Landmark", "title": "Accesso Atti Comunali & Recupero Titoli Urbanistici",
     "short": "Recuperiamo titoli abilitativi, concessioni e pratiche edilizie negli archivi comunali.",
     "full": "Accesso agli atti presso gli uffici comunali, recupero di concessioni edilizie, permessi di costruire, SCIA e sanatorie. Ricostruiamo la storia urbanistica del tuo immobile per sbloccare compravendite ferme.",
     "dual_forms": False},
]


SEED_BUYER_REQUESTS = [
    {"id": _id(), "ref_code": "SH-108", "verified": True, "approved": True,
     "profile": "Dirigente Medico Ospedale San Carlo",
     "searching": "Trilocale in affitto o acquisto", "zone": "Macchia Romana / Verdi",
     "budget": "Fino a 700€/mese o 160.000€", "created_at": _iso(1)},
    {"id": _id(), "ref_code": "SH-112", "verified": True, "approved": True,
     "profile": "Giovane coppia prima casa",
     "searching": "Bilocale in acquisto", "zone": "Centro Storico / Gallitello",
     "budget": "Fino a 130.000€ (mutuo pre-approvato)", "created_at": _iso(2)},
    {"id": _id(), "ref_code": "SH-115", "verified": True, "approved": True,
     "profile": "Investitore immobiliare",
     "searching": "Immobile a reddito o da trasformare in B&B", "zone": "Potenza Città",
     "budget": "Fino a 250.000€ liquidi", "created_at": _iso(3)},
    {"id": _id(), "ref_code": "SH-119", "verified": True, "approved": True,
     "profile": "Famiglia trasfertista ENI",
     "searching": "Casa in affitto 4 vani arredata", "zone": "Val d'Agri / Viggiano",
     "budget": "Fino a 900€/mese", "created_at": _iso(4)},
    {"id": _id(), "ref_code": "SH-124", "verified": True, "approved": True,
     "profile": "Studente fuori sede UNIBAS",
     "searching": "Monolocale/stanza in affitto", "zone": "Macchia Romana",
     "budget": "Fino a 400€/mese", "created_at": _iso(5)},
]


SEED_APPOINTMENTS = [
    {"id": _id(), "title": "Sopralluogo a domicilio", "client_name": "Antonio Ferri", "phone": "+393401234567",
     "type": "Sopralluogo Diretto a Domicilio", "property_ref": "SH-PZ-412",
     "property_title": "Trilocale Macchia Romana", "time_slot": "Oggi 15:00-18:00", "date": _today(),
     "status": "fissato", "notes": "Cliente molto interessato, valutare incarico esclusivo.", "created_at": _iso(0)},
    {"id": _id(), "title": "Video-Desk Direzionale", "client_name": "Maria Lovallo", "phone": "+393452233445",
     "type": "Video-Desk Direzionale", "property_ref": "SH-PZ-205",
     "property_title": "Bilocale Centro Storico", "time_slot": "Oggi 15:00-18:00", "date": _today(),
     "status": "da_chiamare", "notes": "Richiesto dossier completo.", "created_at": _iso(0)},
    {"id": _id(), "title": "Richiesta info asta", "client_name": "Giuseppe Lauria", "phone": "+393336677889",
     "type": "Sblocco Dossier Asta", "property_ref": "SH-PZ-318",
     "property_title": "Asta Poggio Tre Galli", "time_slot": "Domani Mattina", "date": _tomorrow(),
     "status": "da_chiamare", "notes": "Interessato a saldo e stralcio.", "created_at": _iso(0)},
    {"id": _id(), "title": "Incontro studio notarile", "client_name": "Rosa Di Gilio", "phone": "+393481122334",
     "type": "Incontro presso Studio Tecnico/Notarile", "property_ref": "SH-PZ-330",
     "property_title": "Villa Macchia Romana", "time_slot": "Domani Pomeriggio", "date": _tomorrow(),
     "status": "fissato", "notes": "Firma incarico di vendita.", "created_at": _iso(0)},
    {"id": _id(), "title": "Alert ribasso prezzo", "client_name": "Carmine Santarsiere", "phone": "+393395566778",
     "type": "Avvisami se scende di prezzo", "property_ref": "SH-PZ-276",
     "property_title": "Attico Gallitello", "time_slot": "Domani Mattina", "date": _tomorrow(),
     "status": "da_chiamare", "notes": "Vuole essere avvisato su WhatsApp.", "created_at": _iso(0)},
]


SEED_LEADS = [
    {"id": _id(), "name": "Antonio Ferri", "phone": "+393401234567", "email": "a.ferri@email.it",
     "request_type": "Prenotazione Private Advisor", "property_ref": "SH-PZ-412",
     "property_title": "Trilocale Macchia Romana", "service": None, "time_slot": "Oggi 15:00-18:00",
     "notes": "Sopralluogo a domicilio", "status": "nuovo", "stage": "verifica", "agent_notes": "Cliente caldo", "created_at": _iso(0)},
    {"id": _id(), "name": "Maria Lovallo", "phone": "+393452233445", "email": None,
     "request_type": "Sblocco Planimetria & Dossier", "property_ref": "SH-PZ-205",
     "property_title": "Bilocale Centro Storico", "service": None, "time_slot": "Oggi 15:00-18:00",
     "notes": "", "status": "nuovo", "stage": "inviata", "agent_notes": "", "created_at": _iso(0)},
    {"id": _id(), "name": "Giuseppe Lauria", "phone": "+393336677889", "email": "g.lauria@email.it",
     "request_type": "Sblocco Off-Market", "property_ref": "SH-PZ-OFF",
     "property_title": "Opportunità Off-Market", "service": "Off-Market & Privacy VIP", "time_slot": "Domani Mattina",
     "notes": "Investitore lista riservata", "status": "nuovo", "stage": "inviata", "agent_notes": "", "created_at": _iso(1)},
    {"id": _id(), "name": "Rosa Di Gilio", "phone": "+393481122334", "email": None,
     "request_type": "Candidatura Lavora con Noi", "property_ref": None,
     "property_title": None, "service": None, "time_slot": "Domani Pomeriggio",
     "notes": "Ex agente immobiliare, 5 anni esperienza", "status": "nuovo", "stage": "verifica", "agent_notes": "", "created_at": _iso(2)},
    {"id": _id(), "name": "Carmine Santarsiere", "phone": "+393395566778", "email": "carmine.s@email.it",
     "request_type": "Avvisami se scende di prezzo", "property_ref": "SH-PZ-276",
     "property_title": "Attico Gallitello", "service": None, "time_slot": "Domani Mattina",
     "notes": "Budget max 190.000€", "status": "nuovo", "stage": "inviata", "agent_notes": "", "created_at": _iso(2)},
]


def build_demo_users(admin_u, admin_p, agent_u, agent_p, hasher):
    bnb_profile = {
        "property_name": "Casa Vacanza Macchia Romana",
        "monthly_income": 1340,
        "occupancy": 94,
        "upcoming_checkins": [
            {"guest": "Famiglia Esposito", "date": "Oggi", "status": "Check-in confermato"},
            {"guest": "Mr. Johnson (UK)", "date": "Domani", "status": "In arrivo 14:00"},
        ],
        "transfers": [
            {"date": "15/10", "amount": 1290, "label": "Bonifico inviato ✔️"},
            {"date": "15/09", "amount": 1180, "label": "Bonifico inviato ✔️"},
            {"date": "15/08", "amount": 1620, "label": "Bonifico inviato ✔️"},
        ],
        "income_chart": [
            {"month": "Mag", "value": 980}, {"month": "Giu", "value": 1180},
            {"month": "Lug", "value": 1620}, {"month": "Ago", "value": 1710},
            {"month": "Set", "value": 1180}, {"month": "Ott", "value": 1340},
        ],
        "maintenance": [{"item": "Caldaia — revisione annuale", "status": "Programmata 22/10"}],
        "bills": [{"item": "Enel + Acqua Ottobre", "status": "Pagata da Supreme House ✔️"}],
    }
    condo_profile = {
        "condo_name": "Condominio Via Pretoria 118",
        "notices": [
            {"title": "Assemblea ordinaria", "date": "28/10 ore 18:00", "detail": "Approvazione bilancio"},
            {"title": "Pulizia straordinaria vani scala", "date": "20/10", "detail": "Ditta incaricata"},
        ],
        "installments": [
            {"label": "Rata ordinaria 3° trim.", "amount": 180, "status": "Da pagare", "due": "31/10"},
            {"label": "Rata ordinaria 2° trim.", "amount": 180, "status": "Pagata ✔️", "due": "31/07"},
        ],
        "minutes": [{"title": "Verbale assemblea 12/06", "url": "#"}],
    }
    collab_profile = {
        "referrals": [
            {"property": "Bilocale Via Roma", "stage": "incarico", "reward": "300€"},
            {"property": "Terreno zona Gallitello", "stage": "verifica", "reward": "—"},
        ],
    }
    users = [
        {"id": str(uuid.uuid4()), "username": admin_u.lower(), "password_hash": hasher(admin_p),
         "name": "Direzione Supreme House", "email": "direzione@supremehouse.it", "role": "admin",
         "profile_data": {}, "created_at": _iso()},
        {"id": str(uuid.uuid4()), "username": agent_u.lower(), "password_hash": hasher(agent_p),
         "name": "Agente Supreme House", "email": "agente@supremehouse.it", "role": "agent",
         "profile_data": {}, "created_at": _iso()},
        {"id": str(uuid.uuid4()), "username": "demo_user", "password_hash": hasher("demo123"),
         "name": "Cliente Demo", "email": "cliente@demo.it", "role": "user",
         "profile_data": {"saved": ["SH-PZ-412"], "unlocked": ["SH-PZ-205"], "requests": 2}, "created_at": _iso()},
        {"id": str(uuid.uuid4()), "username": "demo_bnb", "password_hash": hasher("demo123"),
         "name": "Proprietario B&B Demo", "email": "bnb@demo.it", "role": "bnb_owner",
         "profile_data": bnb_profile, "created_at": _iso()},
        {"id": str(uuid.uuid4()), "username": "demo_condo", "password_hash": hasher("demo123"),
         "name": "Condòmino Demo", "email": "condo@demo.it", "role": "condomino",
         "profile_data": condo_profile, "created_at": _iso()},
        {"id": str(uuid.uuid4()), "username": "demo_collab", "password_hash": hasher("demo123"),
         "name": "Segnalatore Demo", "email": "collab@demo.it", "role": "collaborator",
         "commission_status": "2 segnalazioni attive", "profile_data": collab_profile, "created_at": _iso()},
    ]
    return users
