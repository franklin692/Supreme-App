import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Map as MapIcon, SlidersHorizontal, X } from "lucide-react";
import { api } from "@/lib/api";
import { SectionTitle } from "@/components/common/Primitives";
import { Seo } from "@/components/common/Seo";
import { PropertyCard } from "@/components/property/PropertyCard";
import { DarkMap } from "@/components/property/DarkMap";
import { cn } from "@/lib/utils";

const QUICK = [
  { id: "tutti", label: "Tutti" },
  { id: "asta", label: "Aste Giudiziarie" },
  { id: "offmarket", label: "Off-Market 🔒" },
  { id: "conclusa", label: "Operazioni Concluse 🏆" },
];

export default function Immobili() {
  const [sale, setSale] = useState(null);
  const [quick, setQuick] = useState("tutti");
  const [mapOpen, setMapOpen] = useState(false);

  const { data: props = [] } = useQuery({ queryKey: ["properties"], queryFn: async () => (await api.get("/properties")).data });
  const { data: home } = useQuery({ queryKey: ["home"], queryFn: async () => (await api.get("/content/home")).data });
  const { data: settings } = useQuery({ queryKey: ["settings"], queryFn: async () => (await api.get("/content/settings")).data });
  const neighborhoods = home?.neighborhoods || [];
  const pg = settings?.pages?.immobili || {};
  const seo = settings?.seo?.pages?.immobili || {};

  const filtered = props
    .filter((p) => {
      if (quick === "asta") return p.type === "asta";
      if (quick === "offmarket") return p.type === "offmarket";
      if (quick === "conclusa") return p.type === "conclusa";
      let base = p.type !== "conclusa";
      if (sale) base = base && p.sale_type === sale && p.type !== "offmarket";
      return base;
    })
    .sort((a, b) => (b.views || 0) - (a.views || 0));

  const mapMarkers = props.filter((p) => p.lat && p.type !== "conclusa");

  return (
    <div className="max-w-7xl mx-auto px-5 lg:px-8 py-10 lg:py-14">
      <Seo title={seo.title} description={seo.description} />
      <SectionTitle eyebrow={pg.eyebrow || "Catalogo & Mappa"} title={pg.title || "Immobili, Aste e Opportunità"}
        subtitle={pg.subtitle || "Esplora gli immobili sulla mappa dei quartieri di Potenza o nel catalogo filtrabile."} />

      {/* Map banner */}
      <button data-testid="open-map-btn" onClick={() => setMapOpen((v) => !v)}
        className="w-full glass-gold rounded-2xl overflow-hidden relative group mb-6 hover-lift">
        <div className="h-40 lg:h-48 relative bg-gradient-to-br from-[#efe7d6] to-[#e4d9c0] flex items-center justify-center">
          <div className="absolute inset-0 opacity-40"
            style={{ backgroundImage: "radial-gradient(circle at 30% 40%, rgba(212,175,55,0.3), transparent 20%), radial-gradient(circle at 60% 60%, rgba(212,175,55,0.25), transparent 15%), radial-gradient(circle at 75% 35%, rgba(16,185,129,0.25), transparent 18%)" }} />
          <div className="relative text-center">
            <div className="w-14 h-14 rounded-full metallic flex items-center justify-center mx-auto mb-3 gold-glow"><MapIcon size={24} /></div>
            <div className="font-display text-xl lg:text-2xl font-bold text-neutral-900">
              {mapOpen ? "Chiudi Mappa" : "Apri Mappa Interattiva"}
            </div>
            <div className="text-sm text-muted-foreground">Quartieri & Immobili di Potenza</div>
          </div>
        </div>
      </button>

      {mapOpen && (
        <div className="mb-8" data-testid="map-wrap">
          <DarkMap markers={mapMarkers} neighborhoods={neighborhoods} height="440px" />
        </div>
      )}

      {/* Sale selectors */}
      <div className="grid grid-cols-2 gap-4 mb-5">
        {[{ id: "vendita", label: "VENDITA" }, { id: "affitto", label: "AFFITTO" }].map((s) => (
          <button key={s.id} data-testid={`sale-${s.id}`} onClick={() => setSale(sale === s.id ? null : s.id)}
            className={cn("py-5 rounded-2xl font-display text-lg lg:text-xl font-bold tracking-wide transition-all duration-300 border",
              sale === s.id ? "metallic border-transparent gold-glow" : "glass-gold text-neutral-900 hover:border-gold/60")}>
            {s.label}
          </button>
        ))}
      </div>

      {/* Quick filters */}
      <div className="flex items-center gap-2 flex-wrap mb-8">
        <span className="flex items-center gap-1.5 text-xs text-muted-foreground mr-1"><SlidersHorizontal size={14} /> Filtri:</span>
        {QUICK.map((q) => (
          <button key={q.id} data-testid={`quick-${q.id}`} onClick={() => setQuick(q.id)}
            className={cn("px-4 py-2 rounded-full text-sm border transition-all duration-300",
              quick === q.id ? "border-gold text-gold bg-gold/10" : "border-black/10 text-neutral-600 hover:border-gold/40")}>
            {q.label}
          </button>
        ))}
        {(sale || quick !== "tutti") && (
          <button onClick={() => { setSale(null); setQuick("tutti"); }} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-gold ml-1">
            <X size={13} /> Azzera
          </button>
        )}
        <span className="ml-auto text-xs font-mono text-gold">Ordina per: Più Visti · {filtered.length} risultati</span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
        {filtered.map((p, i) => <PropertyCard key={p.id} property={p} testId={`cat-prop-${i}`} />)}
      </div>
      {filtered.length === 0 && (
        <div className="text-center py-20 text-muted-foreground">Nessun immobile per questi filtri.</div>
      )}
    </div>
  );
}
