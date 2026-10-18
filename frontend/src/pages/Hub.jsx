import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  Flame, ArrowRight, Sparkles, Rocket, Gift, Briefcase, Handshake,
  Trophy, CheckCircle2, ChevronRight, ChevronDown,
} from "lucide-react";
import { api, currentMonthLabel } from "@/lib/api";
import { SectionTitle, StatusBadge } from "@/components/common/Primitives";
import { Seo } from "@/components/common/Seo";
import { AnimatedCounter } from "@/components/common/AnimatedCounter";
import { PropertyCard } from "@/components/property/PropertyCard";
import { BuyerRequestCard } from "@/components/common/BuyerRequestCard";
import { PrivateAdvisorDialog } from "@/components/home/PrivateAdvisorDialog";
import { DemoGestionaleDialog } from "@/components/home/DemoGestionaleDialog";
import { LeadDialog } from "@/components/common/LeadDialog";
import { PartnerDialog } from "@/components/home/PartnerDialog";

const DEFAULT_ORDER = ["hero", "buyers", "featured", "bnb", "neighborhoods", "poles", "stats", "concluded", "faq", "network"];

export default function Hub() {
  const { data } = useQuery({ queryKey: ["home"], queryFn: async () => (await api.get("/content/home")).data });
  const { data: settings } = useQuery({ queryKey: ["settings"], queryFn: async () => (await api.get("/content/settings")).data });
  const { data: faqs = [] } = useQuery({ queryKey: ["faq"], queryFn: async () => (await api.get("/faq")).data });

  const home = settings?.home || {};
  const S = home.sections || {};
  const order = home.order?.length ? home.order : DEFAULT_ORDER;
  const sec = (id) => S[id] || {};
  const visible = (id) => (S[id] ? S[id].visible !== false : true);
  const d = data || {};
  const month = currentMonthLabel();
  const seo = settings?.seo?.pages?.home || {};

  const renderers = {
    hero: () => <Hero s={sec("hero")} />,
    buyers: () => <Buyers s={sec("buyers")} requests={d.buyer_requests || []} />,
    featured: () => <Featured s={sec("featured")} featured={d.featured || []} />,
    bnb: () => <Bnb s={sec("bnb")} />,
    neighborhoods: () => <Neighborhoods s={sec("neighborhoods")} items={d.neighborhoods || []} month={month} />,
    poles: () => <Poles s={sec("poles")} items={d.poles || []} />,
    stats: () => <Stats s={sec("stats")} items={d.stats || []} />,
    concluded: () => <Concluded s={sec("concluded")} items={d.concluded || []} />,
    faq: () => (faqs.length > 0 ? <Faq s={sec("faq")} faqs={faqs} /> : null),
    network: () => <Network s={sec("network")} />,
  };

  return (
    <div>
      <Seo title={seo.title} description={seo.description} />
      {order.map((id) => (visible(id) && renderers[id] ? <React.Fragment key={id}>{renderers[id]()}</React.Fragment> : null))}
    </div>
  );
}

/* ====================== SECTION COMPONENTS ====================== */

const Hero = ({ s }) => (
  <section className="relative min-h-[88vh] flex items-center" data-testid="home-section-hero">
    <div className="absolute inset-0 -z-10">
      {s.image && <img src={s.image} alt="" className="absolute inset-0 w-full h-full object-cover opacity-10" />}
      <div className="absolute inset-0" style={{ background: "radial-gradient(1100px circle at 82% 0%, rgba(190,158,94,0.18), transparent 48%)" }} />
    </div>
    <div className="relative max-w-7xl mx-auto px-5 lg:px-8 w-full py-20">
      <div className="max-w-3xl">
        <div className="flex items-center gap-2 mb-6">
          <span className="h-px w-10 bg-gold" />
          <span className="text-xs uppercase tracking-[0.3em] text-gold">{s.eyebrow}</span>
        </div>
        <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold leading-[1.02] text-neutral-900">
          {s.title}{" "}<span className="text-gold-gradient">{s.title_accent}</span>
        </h1>
        <div className="mt-8 inline-block rounded-2xl bg-[#16150F] px-7 py-5">
          <div className="text-white/70 font-medium tracking-[0.12em] text-xs uppercase">{s.card_top}</div>
          <div className="font-display text-2xl sm:text-3xl text-gold-gradient mt-1">{s.card_bottom}</div>
        </div>
        <p className="mt-6 text-lg text-neutral-600 leading-relaxed max-w-2xl">{s.subtitle}</p>
        <div className="mt-9 flex flex-col sm:flex-row gap-4">
          <PrivateAdvisorDialog
            trigger={
              <button data-testid="hero-advisor-btn" className="px-8 py-4 rounded-full metallic font-semibold text-base hover:brightness-110 transition-all duration-300 flex items-center justify-center gap-2 gold-glow">
                <Sparkles size={18} /> {s.cta_primary || "Prenota un Private Advisor"}
              </button>
            }
          />
          <Link to="/immobili" data-testid="hero-immobili-btn" className="px-8 py-4 rounded-full border border-gold/40 text-gold hover:bg-gold/10 transition-colors duration-300 font-medium flex items-center justify-center gap-2">
            {s.cta_secondary || "Esplora gli Immobili"} <ArrowRight size={18} />
          </Link>
        </div>
        {(s.trust_badges || []).length > 0 && (
          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted-foreground">
            {s.trust_badges.map((b, i) => (
              <span key={i} className="flex items-center gap-2"><CheckCircle2 size={15} className="text-emerald" /> {b}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  </section>
);

const Buyers = ({ s, requests }) => (
  <section className="py-16 border-t border-gold/10" data-testid="home-section-buyers">
    <div className="max-w-7xl mx-auto px-5 lg:px-8">
      <SectionTitle eyebrow={s.eyebrow} title={s.title} subtitle={s.subtitle} />
    </div>
    <div className="relative overflow-hidden">
      <div className="flex gap-5 w-max auto-scroll px-5">
        {[...requests, ...requests].map((r, i) => (
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
);

const Featured = ({ s, featured }) => (
  <section className="py-16" data-testid="home-section-featured">
    <div className="max-w-7xl mx-auto px-5 lg:px-8">
      <SectionTitle eyebrow={s.eyebrow} title={s.title} subtitle={s.subtitle} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
        {featured.map((p, i) => <PropertyCard key={p.id} property={p} testId={`hub-prop-${i}`} />)}
      </div>
      <div className="text-center mt-10">
        <Link to="/immobili" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full border border-gold/40 text-gold hover:bg-gold/10 transition-colors duration-300 font-medium">
          Apri il Catalogo completo <ArrowRight size={17} />
        </Link>
      </div>
    </div>
  </section>
);

const Bnb = ({ s }) => {
  const cards = s.cards || [];
  const colors = ["text-emerald", "text-gold"];
  return (
    <section className="py-16" data-testid="home-section-bnb">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <div className="glass-gold rounded-3xl p-8 lg:p-14 relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-gold/10 rounded-full blur-3xl" />
          <div className="relative grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <span className="text-xs uppercase tracking-[0.3em] text-gold">{s.eyebrow}</span>
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-neutral-900 mt-3 leading-tight">{s.title}</h2>
              <p className="mt-4 text-neutral-600 leading-relaxed">{s.body}</p>
              <div className="mt-7 flex flex-col sm:flex-row gap-4">
                <DemoGestionaleDialog
                  trigger={
                    <button data-testid="demo-live-btn" className="px-7 py-3.5 rounded-full metallic font-semibold hover:brightness-110 transition-all duration-300 flex items-center justify-center gap-2 gold-glow">
                      <Rocket size={18} /> {s.cta_demo || "Prova la Demo Live"}
                    </button>
                  }
                />
                <LeadDialog testId="affida-main" requestType="Affida il tuo immobile" title="Affida il tuo immobile a Supreme House"
                  description="Ti mostreremo quanto può rendere il tuo immobile."
                  trigger={<button className="px-7 py-3.5 rounded-full border border-gold/40 text-gold hover:bg-gold/10 transition-colors duration-300 font-medium">{s.cta_affida || "Affida il tuo immobile"}</button>} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {cards.map((x, i) => (
                <div key={i} className="glass rounded-2xl p-5">
                  <div className={`font-mono text-2xl font-bold ${colors[i % 2]}`}>{x.k}</div>
                  <div className="text-xs text-muted-foreground mt-1">{x.v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Neighborhoods = ({ s, items, month }) => (
  <section className="py-16" data-testid="home-section-neighborhoods">
    <div className="max-w-7xl mx-auto px-5 lg:px-8">
      <div className="flex items-center gap-2 text-xs font-mono text-emerald mb-4">
        <span className="live-dot" /> Dati Osservatorio Supreme House aggiornati a: {month}
      </div>
      <SectionTitle eyebrow={s.eyebrow} title={s.title} subtitle={s.subtitle} />
      <div className="space-y-4">
        {items.map((n) => (
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
);

const Poles = ({ s, items }) => (
  <section className="py-16" data-testid="home-section-poles">
    <div className="max-w-7xl mx-auto px-5 lg:px-8">
      <SectionTitle eyebrow={s.eyebrow} title={s.title} align="center" subtitle={s.subtitle} className="mx-auto text-center" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((p) => (
          <div key={p.id} data-testid={`pole-${p.order}`} className="glass rounded-2xl p-6 hover-lift">
            <div className="flex items-center gap-2 text-xs text-emerald mb-3"><span className="live-dot" /> Presidio Attivo</div>
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
);

const Stats = ({ s, items }) => (
  <section className="py-20 relative" data-testid="home-section-stats">
    <div className="absolute inset-0 bg-[#efe7d6]/70" />
    <div className="relative max-w-7xl mx-auto px-5 lg:px-8">
      <SectionTitle eyebrow={s.eyebrow} title={s.title} align="center" className="mx-auto text-center" />
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((st) => (
          <div key={st.id} data-testid={`stat-${st.order}`} className="glass-gold rounded-2xl p-7 text-center hover-lift">
            <div className="font-display text-4xl lg:text-5xl font-bold text-gold-gradient">
              {st.prefix}<AnimatedCounter value={st.value} decimals={st.value % 1 !== 0 ? 1 : 0} />{st.suffix}
            </div>
            <div className="text-sm text-muted-foreground mt-3 leading-snug">{st.label}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const Concluded = ({ s, items }) => (
  <section className="py-16" data-testid="home-section-concluded">
    <div className="max-w-7xl mx-auto px-5 lg:px-8">
      <SectionTitle eyebrow={s.eyebrow} title={s.title} subtitle={s.subtitle} />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {items.map((p, i) => (
          <div key={p.id} data-testid={`concluded-${i}`} className="relative glass-gold rounded-2xl overflow-hidden hover-lift">
            <div className="relative h-44">
              <img src={p.photos?.[0]} alt={p.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/30 to-transparent" />
              <div className="absolute top-3 left-3 right-3 flex justify-center"><StatusBadge label={p.concluded_badge} /></div>
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
);

const Faq = ({ s, faqs }) => (
  <section className="py-16" data-testid="home-section-faq">
    <div className="max-w-3xl mx-auto px-5 lg:px-8">
      <SectionTitle eyebrow={s.eyebrow} title={s.title} align="center" className="mx-auto text-center" />
      <div className="space-y-3">
        {faqs.map((f, i) => <FaqItem key={f.id} f={f} testId={`faq-${i}`} />)}
      </div>
    </div>
  </section>
);

const Network = ({ s }) => {
  const cards = s.cards || [];
  const icons = { segnala: Gift, lavora: Briefcase, partner: Handshake };
  return (
    <section className="py-16 pb-24" data-testid="home-section-network">
      <div className="max-w-7xl mx-auto px-5 lg:px-8">
        <SectionTitle eyebrow={s.eyebrow} title={s.title} align="center" className="mx-auto text-center" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {cards.map((c, i) => (
            <ActionCard key={i} icon={icons[c.kind] || Gift} title={c.title} amount={c.amount} desc={c.desc}>
              {c.kind === "partner" ? (
                <PartnerDialog trigger={<button data-testid="partner-btn" className="w-full py-3 rounded-full metallic font-semibold hover:brightness-110 transition-all duration-300">Richiedi accreditamento</button>} />
              ) : c.kind === "lavora" ? (
                <LeadDialog testId="lavora" requestType="Candidatura Lavora con Noi" title="Lavora con Noi"
                  description="Inviaci la tua candidatura: ti ricontatteremo per un colloquio riservato." showEmail
                  trigger={<button data-testid="lavora-btn" className="w-full py-3 rounded-full metallic font-semibold hover:brightness-110 transition-all duration-300">Candidati</button>} />
              ) : (
                <LeadDialog testId="segnala" requestType="Segnalazione Immobile" title="Segnala un Immobile"
                  description="Inserisci i tuoi dati e quelli dell'immobile: se andiamo a buon fine, guadagni."
                  successMessage="Segnalazione registrata! La trovi nel tuo profilo Segnalatore con la barra di stato."
                  trigger={<button data-testid="segnala-btn" className="w-full py-3 rounded-full metallic font-semibold hover:brightness-110 transition-all duration-300">Segnala ora</button>} />
              )}
            </ActionCard>
          ))}
        </div>
      </div>
    </section>
  );
};

/* ====================== SMALL HELPERS ====================== */

const FaqItem = ({ f, testId }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="glass-gold rounded-2xl overflow-hidden" data-testid={testId}>
      <button onClick={() => setOpen((v) => !v)} className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left">
        <span className="font-semibold text-neutral-900">{f.question}</span>
        <ChevronDown size={18} className={`text-gold shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="px-5 pb-5 -mt-1 text-sm text-neutral-600 leading-relaxed">{f.answer}</div>}
    </div>
  );
};

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
