import React from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Share2, Lock, MapPin, TrendingDown, Flame } from "lucide-react";
import { formatPrice } from "@/lib/api";
import { StatusBadge } from "@/components/common/Primitives";
import { LeadDialog } from "@/components/common/LeadDialog";

export const PropertyCard = ({ property: p, testId }) => {
  const navigate = useNavigate();
  const isOff = p.type === "offmarket";
  const isConcluded = p.type === "conclusa";
  const cover = p.photos?.[0];

  const typeLabel = {
    vendita: "VENDITA", affitto: "AFFITTO", asta: "ASTA GIUDIZIARIA",
    offmarket: "OFF-MARKET", conclusa: "CONCLUSA",
  }[p.type];

  if (isOff) {
    return (
      <LeadDialog
        testId="offmarket"
        requestType="Sblocco Off-Market"
        property={p}
        title="🔒 Opportunità Riservata Off-Market"
        description="Inserisci Nome, Cognome e WhatsApp per sbloccare le offerte riservate con rendimento stimato 11% annuo."
        showTimeSlot={false}
        successMessage="Accesso alla lista riservata registrato. Ti invieremo i dettagli off-market su WhatsApp."
        trigger={
          <div data-testid={testId} className="glass-gold rounded-2xl overflow-hidden hover-lift cursor-pointer relative group">
            <div className="relative h-56 overflow-hidden shimmer">
              <img src={cover} alt="off-market" className="w-full h-full object-cover blur-md scale-110 brightness-50" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                <div className="w-14 h-14 rounded-full metallic flex items-center justify-center mb-3 gold-glow">
                  <Lock size={24} />
                </div>
                <div className="font-display text-lg font-bold text-neutral-900">Opportunità Riservata</div>
                <div className="text-emerald text-sm font-mono mt-1">Rendimento stimato 11% annuo</div>
              </div>
            </div>
            <div className="p-5">
              <div className="text-xs uppercase tracking-[0.2em] text-gold mb-1">Off-Market · Riservato</div>
              <p className="text-sm text-neutral-600">Clicca per sbloccare gratuitamente le offerte off-market selezionate Supreme House.</p>
            </div>
          </div>
        }
      />
    );
  }

  return (
    <div data-testid={testId} onClick={() => !isConcluded && navigate(`/immobili/${p.id}`)}
      className="glass-gold rounded-2xl overflow-hidden hover-lift cursor-pointer relative group">
      <div className="relative h-56 overflow-hidden">
        <img src={cover} alt={p.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/20 to-transparent" />

        {isConcluded ? (
          <div className="absolute top-3 left-3 right-3 flex justify-center">
            <StatusBadge label={p.concluded_badge} />
          </div>
        ) : (
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 max-w-[80%]">
            {(p.status_badges || []).slice(0, 2).map((b, i) => <StatusBadge key={i} label={b} />)}
          </div>
        )}

        <div className="absolute top-3 right-3">
          <span className="text-[10px] font-mono bg-obsidian/80 border border-gold/30 text-gold px-2 py-1 rounded">{p.ref_code}</span>
        </div>

        {!isConcluded && (
          <div className="absolute bottom-3 left-3 flex items-center gap-3 text-xs text-neutral-700 font-mono">
            <span className="flex items-center gap-1 bg-obsidian/70 px-2 py-1 rounded"><Eye size={13} className="text-gold" /> {p.views?.toLocaleString("it-IT")}</span>
            <span className="flex items-center gap-1 bg-obsidian/70 px-2 py-1 rounded"><Share2 size={13} className="text-emerald" /> {p.whatsapp_shares}</span>
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] uppercase tracking-[0.2em] text-gold">{typeLabel}</span>
          {p.observing_now && !isConcluded && (
            <span className="flex items-center gap-1.5 text-[11px] text-red-400"><span className="live-dot" /> {p.observing_count} stanno guardando</span>
          )}
        </div>
        <h3 className="font-display text-lg font-semibold text-neutral-900 leading-tight">{p.title}</h3>
        <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
          <MapPin size={13} className="text-gold" /> {p.neighborhood}, {p.city}
        </div>

        {!isConcluded && (
          <div className="mt-4 flex items-end justify-between">
            <div>
              {p.old_price && (
                <div className="flex items-center gap-2">
                  <span className="text-sm line-through text-muted-foreground font-mono">{formatPrice(p.old_price)}</span>
                  <span className="flex items-center gap-0.5 text-xs text-red-400 font-mono"><TrendingDown size={12} />{p.discount_pct}%</span>
                </div>
              )}
              <div className="font-mono text-2xl font-bold text-gold-gradient">{formatPrice(p.price, p.price_period)}</div>
            </div>
            {p.pre_verified && (
              <span className="text-[10px] text-emerald border border-emerald/30 bg-emerald/10 px-2 py-1 rounded-full">🛡️ Pre-Verificato</span>
            )}
          </div>
        )}
        {isConcluded && (
          <div className="mt-4 flex items-center gap-2 text-emerald text-sm font-medium">
            <Flame size={15} /> Operazione chiusa con successo
          </div>
        )}
      </div>
    </div>
  );
};
