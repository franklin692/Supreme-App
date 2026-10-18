import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { useInView } from "framer-motion";
import {
  Flame, TrendingUp, ArrowRight, Sparkles, MapPin, Rocket,
  Gift, Briefcase, Handshake, Trophy, CheckCircle2, ChevronRight,
} from "lucide-react";
import { api, currentMonthLabel } from "@/lib/api";
import { SectionTitle, StatusBadge } from "@/components/common/Primitives";
import { AnimatedCounter } from "@/components/common/AnimatedCounter";
import { PropertyCard } from "@/components/property/PropertyCard";
import { BuyerRequestCard } from "@/components/common/BuyerRequestCard";
import { PrivateAdvisorDialog } from "@/components/home/PrivateAdvisorDialog";
import { DemoGestionaleDialog } from "@/components/home/DemoGestionaleDialog";
import { LeadDialog } from "@/components/common/LeadDialog";
import { PartnerDialog } from "@/components/home/PartnerDialog";

const HERO_IMG = "https://images.unsplash.com/photo-1611416457332-946853cc75d6?crop=entropy&cs=srgb&fm=jpg&q=85&w=2000";

export default function Hub() {
  const { data } = useQuery({ queryKey: ["home"], queryFn: async () => (await api.get("/content/home")).data });
  const d = data || {};
  const featured = (d.featured || []);
  const month = currentMonthLabel();

  return (
    <div>
      {/* ===== A) HERO ===== */}
      <section className="relative min-h-[88vh] flex items-center">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0" style={{ background: "radial-gradient(1100px circle at 82% 0%, rgba(190,158,94,0.18), transparent 48%)" }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-5 lg:px-8 w-full py-20">
          <div className="max-w-3xl">
            <div className="flex items-center gap-2 mb-6">
              <span className="h-px w-10 bg-gold" />
              <span className="text-xs uppercase tracking-[0.35em] text-gold">Private Banking del Real Estate</span>
            </div>
            <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tighter leading-[1.05] text-neutral-900">
              Il tuo patrimonio immobiliare,<br />
              <span className="text-gold-gradient">gestito come un grande capitale.</span>
            </h1>
            <div className="mt-8 inline-block rounded-2xl bg-[#141310] px-8 py-6 border border-gold/30 gold-glow">
              <div className="text-white font-semibold tracking-[0.15em] text-xs sm:text-sm uppercase">Non ci limitiamo a vendere immobili.</div>
              <div className="font-display text-3xl sm:text-4xl text-gold-gradient mt-1.5">Creiamo Valore.</div>
            </div>
            <p className="mt-6 text-lg text-neutral-600 leading-relaxed max-w-2xl">
              Hub di servizi immobiliari, property management, aste e intermediazione d'élite.
              Sede centrale a Potenza, consulenti a domicilio in tutta la Basilicata. Nessun ufficio da raggiungere: siamo noi a venire da te.
            </p>
            <div className="mt-9 flex flex-col sm:flex-row gap-4">
              <PrivateAdvisorDialog
                trigger={
                  <button data-testid="hero-advisor-btn" className="px-8 py-4 rounded-full metallic font-semibold text-base hover:brightness-110 transition-all duration-300 flex items-center justify-center gap-2 gold-glow">
                    <Sparkles size={18} /> Prenota un Private Advisor
                  </button>
                }
              />
              <Link to="/immobili" data-testid="hero-immobili-btn" className="px-8 py-4 rounded-full border border-gold/40 text-gold hover:bg-gold/10 transition-colors duration-300 font-medium flex items-center justify-center gap-2">
                Esplora gli Immobili <ArrowRight size={18} />
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted-foreground">
              <span className="flex items-center gap-2"><CheckCircle2 size={15} className="text-emerald" /> Immobili Pre-Verificati</span>
              <span className="flex items-center gap-2"><CheckCircle2 size={15} className="text-emerald" /> Consulente a domicilio in 24h</span>
              <span className="flex items-center gap-2"><CheckCircle2 size={15} className="text-emerald" /> 18 Comuni presidiati</span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== B) CHI CERCA CASA ORA (carousel) ===== */}
      <section className="py-16 border-t border-gold/10">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <SectionTitle eyebrow="Mercato Rovesciato · Live" title="Chi cerca casa ORA"
            subtitle="Clienti verificati pronti a comprare o affittare. Hai un immobile adatto? Proponilo subito." />
        </div>
        <div className="relative overflow-hidden">
          <div className="flex gap-5 w-max auto-scroll px-5">
            {[...(d.buyer_requests || []), ...(d.buyer_requests || [])].map((r, i) => (
              <div key={i} className="w-[320px]"><BuyerRequestCard request={r} testId={`hub-buyer-${i}`} /></div>
            ))}
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-5 lg:px-8 mt-8">
          <Link to="/chi-cerca" className="inline-flex items-center gap-2 text-gold hover:gap-3 transition-all duration-300 text-sm font-medium">
            Vedi tutta la Borsa Acquirenti <ChevronRight size={16} />
          </Link>
        </div>
      </section>

      {/* ===== C) VETRINA PIÙ VISTI + OFF-MARKET ===== */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <SectionTitle eyebrow="Vetrina · Ordinati per visualizzazioni" title="Immobili & Aste più visti"
            subtitle="Le opportunità che stanno catturando l'attenzione dei nostri clienti in questo momento." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {featured.map((p, i) => (
              <PropertyCard key={p.id} property={p} testId={`hub-prop-${i}`} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/immobili" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-gold/40 text-gold hover:bg-gold/10 transition-colors duration-300 font-medium">
              Apri il Catalogo completo <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== D) SPONSOR GESTIONALE B&B ===== */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="glass-gold rounded-3xl p-8 lg:p-14 relative overflow-hidden">
            <div className="absolute -right-20 -top-20 w-80 h-80 bg-gold/10 rounded-full blur-3xl" />
            <div className="relative grid lg:grid-cols-2 gap-10 items-center">
              <div>
                <span className="text-xs uppercase tracking-[0.3em] text-gold">Esclusiva Proprietari</span>
                <h2 className="font-display text-3xl lg:text-4xl font-bold text-neutral-900 mt-3 leading-tight">
                  Il Gestionale che fa sembrare il tuo B&B un conto di Home Banking
                </h2>
                <p className="mt-4 text-neutral-600 leading-relaxed">
                  Monitora dal telefono incassi mensili, tasso di occupazione, check-in ospiti, storico bonifici,
                  manutenzioni e bollette. I proprietari Supreme House non pensano a nulla: incassano e basta.
                </p>
                <div className="mt-7 flex flex-col sm:flex-row gap-4">
                  <DemoGestionaleDialog
                    trigger={
                      <button data-testid="demo-live-btn" className="px-7 py-3.5 rounded-full metallic font-semibold hover:brightness-110 transition-all duration-300 flex items-center justify-center gap-2 gold-glow">
                        <Rocket size={18} /> Prova Ora la Demo Live del Gestionale
                      </button>
                    }
                  />
                  <LeadDialog testId="affida-main" requestType="Affida il tuo immobile" title="Affida il tuo immobile a Supreme House"
                    description="Ti mostreremo quanto può rendere il tuo immobile."
                    trigger={<button className="px-7 py-3.5 rounded-full border border-gold/40 text-gold hover:bg-gold/10 transition-colors duration-300 font-medium">Affida il tuo immobile</button>} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { k: "+1.340€", v: "Incassi questo mese", c: "text-emerald" },
                  { k: "94%", v: "Tasso occupazione", c: "text-gold" },
                  { k: "1.290€", v: "Ultimo bonifico ✔️", c: "text-emerald" },
                  { k: "100%", v: "Gestione chiavi in mano", c: "text-gold" },
                ].map((x, i) => (
                  <div key={i} className="glass rounded-2xl p-5">
                    <div className={`font-mono text-2xl font-bold ${x.c}`}>{x.k}</div>
                    <div className="text-xs text-muted-foreground mt-1">{x.v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== E) CLASSIFICA QUARTIERI ===== */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <div className="flex items-center gap-2 text-xs font-mono text-emerald mb-4">
            <span className="live-dot" /> Dati Osservatorio Supreme House aggiornati a: {month}
          </div>
          <SectionTitle eyebrow="Osservatorio Live Potenza" title="I quartieri più richiesti"
            subtitle="Dove cercano i nostri clienti verificati, in tempo reale." />
          <div className="space-y-4">
            {(d.neighborhoods || []).map((n) => (
              <div key={n.id} data-testid={`neigh-${n.position}`} className="glass-gold rounded-2xl p-5 lg:p-6 hover-lift">
                <div className="flex flex-col lg:flex-row lg:items-center gap-5">
                  <div className="flex items-center gap-4 lg:w-64 shrink-0">
                    <div className="w-12 h-12 rounded-xl metallic flex items-center justify-center font-display text-xl font-black">{n.position}°</div>
                    <div>
                      <div className="font-display text-xl font-semibold text-neutral-900">{n.name}</div>
                      <div className="flex items-center gap-1.5 text-sm">
                        <span className="text-gold font-mono">{n.demand_index}/100</span>
                        <Flame size={13} className="text-amber" />
                        <span className="text-emerald font-mono text-xs">{n.demand_trend} questo mese</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 flex-1 text-sm">
                    <Metric label="Prezzo medio" value={n.price_sqm} />
                    <Metric label="Rendita media" value={n.avg_yield} />
                    <Metric label="Tempo medio" value={n.avg_time} />
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-black/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <span className="flex items-center gap-2 text-sm text-neutral-700">
                    🎯 <span className="text-gold font-semibold">{n.clients_waiting} clienti verificati</span> cercano casa qui in questo momento
                  </span>
                  <LeadDialog testId={`neigh-propose-${n.position}`} requestType="Proposta Immobile per Quartiere"
                    property={{ ref_code: n.name, title: `Quartiere ${n.name}` }}
                    title={`Hai un immobile a ${n.name}?`}
                    description="Proponilo ai nostri clienti verificati in attesa in questo quartiere."
                    trigger={<button data-testid={`neigh-propose-btn-${n.position}`} className="px-5 py-2.5 rounded-full border border-gold/40 text-gold hover:bg-gold/10 transition-colors duration-300 text-sm font-medium whitespace-nowrap">Hai un immobile qui? Proponilo</button>} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== F) 6 POLI BASILICATA ===== */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <SectionTitle eyebrow="Copertura Regionale" title="I 6 Poli strategici della Basilicata" align="center"
            subtitle="Presidi operativi attivi, consulenti a domicilio in 24h, dossier gestiti in ogni area." className="mx-auto text-center" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(d.poles || []).map((p) => (
              <div key={p.id} data-testid={`pole-${p.order}`} className="glass rounded-2xl p-6 hover-lift">
                <div className="flex items-center gap-2 text-xs text-emerald mb-3">
                  <span className="live-dot" /> Presidio Attivo
                </div>
                <h3 className="font-display text-xl font-semibold text-neutral-900">{p.name}</h3>
                <p className="text-sm text-muted-foreground mt-1">{p.subtitle}</p>
                <div className="mt-4 pt-4 border-t border-black/5 flex items-center justify-between text-sm">
                  <span className="text-neutral-600">Consulente a domicilio in 24h</span>
                  <span className="font-mono text-gold">{p.dossiers} Dossier</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== G) STATISTICHE GLOBALI ===== */}
      <section className="py-20 relative">
        <div className="absolute inset-0 bg-[#efe7d6]/70" />
        <div className="relative max-w-7xl mx-auto px-5 lg:px-8">
          <SectionTitle eyebrow="Il Gruppo in numeri" title="Statistiche Globali del Gruppo" align="center" className="mx-auto text-center" />
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {(d.stats || []).map((s) => (
              <div key={s.id} data-testid={`stat-${s.order}`} className="glass-gold rounded-2xl p-7 text-center hover-lift">
                <div className="font-display text-4xl lg:text-5xl font-bold text-gold-gradient">
                  {s.prefix}<AnimatedCounter value={s.value} decimals={s.value % 1 !== 0 ? 1 : 0} />{s.suffix}
                </div>
                <div className="text-sm text-muted-foreground mt-3 leading-snug">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== H) OPERAZIONI CONCLUSE ===== */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <SectionTitle eyebrow="Track Record" title="Operazioni Concluse"
            subtitle="Risultati reali. Ogni operazione chiusa è una promessa mantenuta." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(d.concluded || []).map((p, i) => (
              <div key={p.id} data-testid={`concluded-${i}`} className="relative glass-gold rounded-2xl overflow-hidden hover-lift">
                <div className="relative h-44">
                  <img src={p.photos?.[0]} alt={p.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/30 to-transparent" />
                  <div className="absolute top-3 left-3 right-3 flex justify-center">
                    <StatusBadge label={p.concluded_badge} />
                  </div>
                  <Trophy size={18} className="absolute bottom-3 right-3 text-gold" />
                </div>
                <div className="p-4">
                  <div className="text-sm font-semibold text-neutral-900">{p.title}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{p.neighborhood}, {p.city}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== I) SEGNALA / LAVORA / COLLABORA ===== */}
      <section className="py-16 pb-24">
        <div className="max-w-7xl mx-auto px-5 lg:px-8">
          <SectionTitle eyebrow="Entra nel network" title="Cresci con Supreme House" align="center" className="mx-auto text-center" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <ActionCard icon={Gift} title="Segnala un Immobile e Guadagna"
              amount="200€ – 500€+"
              desc="Chiunque segnali un immobile in vendita, affitto o vuoto riceve un compenso tracciato nel proprio profilo.">
              <LeadDialog testId="segnala" requestType="Segnalazione Immobile" title="Segnala un Immobile"
                description="Inserisci i tuoi dati e quelli dell'immobile: se andiamo a buon fine, guadagni."
                successMessage="Segnalazione registrata! La trovi nel tuo profilo Segnalatore con la barra di stato."
                trigger={<button data-testid="segnala-btn" className="w-full py-3 rounded-full metallic font-semibold hover:brightness-110 transition-all duration-300">Segnala ora</button>} />
            </ActionCard>
            <ActionCard icon={Briefcase} title="Lavora con Noi"
              amount="Diventa Agente"
              desc="Candidati per diventare Agente o Consulente Supreme House e opera nel tuo territorio.">
              <LeadDialog testId="lavora" requestType="Candidatura Lavora con Noi" title="Lavora con Noi"
                description="Inviaci la tua candidatura: ti ricontatteremo per un colloquio riservato." showEmail
                trigger={<button data-testid="lavora-btn" className="w-full py-3 rounded-full metallic font-semibold hover:brightness-110 transition-all duration-300">Candidati</button>} />
            </ActionCard>
            <ActionCard icon={Handshake} title="Collabora / Accreditamento Partner"
              amount="Rete Partner"
              desc="Professionisti del settore: entra nella rete accreditata Supreme House.">
              <PartnerDialog
                trigger={<button data-testid="partner-btn" className="w-full py-3 rounded-full metallic font-semibold hover:brightness-110 transition-all duration-300">Richiedi accreditamento</button>} />
            </ActionCard>
          </div>
        </div>
      </section>
    </div>
  );
}

const Metric = ({ label, value }) => (
  <div>
    <div className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">{label}</div>
    <div className="text-neutral-800 font-medium mt-0.5">{value}</div>
  </div>
);

const ActionCard = ({ icon: Icon, title, amount, desc, children }) => (
  <div className="glass-gold rounded-2xl p-7 hover-lift flex flex-col">
    <div className="w-12 h-12 rounded-xl metallic flex items-center justify-center mb-4"><Icon size={22} /></div>
    <div className="text-xs uppercase tracking-[0.2em] text-gold">{amount}</div>
    <h3 className="font-display text-xl font-semibold text-neutral-900 mt-1">{title}</h3>
    <p className="text-sm text-muted-foreground mt-2 leading-relaxed flex-1">{desc}</p>
    <div className="mt-5">{children}</div>
  </div>
);
