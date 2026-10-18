import React from "react";
import { useNavigate } from "react-router-dom";
import { Eye, Share2, Lock, MapPin, TrendingDown, Trophy, Maximize2, BedDouble, Bath, ShieldCheck } from "lucide-react";
import { formatPrice } from "@/lib/api";
import { StatusBadge } from "@/components/common/Primitives";
import { LeadDialog } from "@/components/common/LeadDialog";

const TYPE_LABEL = {
  vendita: "VENDITA", affitto: "AFFITTO", asta: "ASTA GIUDIZIARIA",
  offmarket: "OFF-MARKET", conclusa: "CONCLUSA",
};

const MetaItem = ({ icon: Icon, value, suffix }) => (
  <span className="flex items-center gap-1.5 text-neutral-700">
    <Icon size={15} className="text-gold shrink-0" />
    <span className="font-medium">{value}{suffix}</span>
  </span>
);

export const PropertyCard = ({ property: p, testId }) => {
  const navigate = useNavigate();
  const isOff = p.type === "offmarket";
  const isConcluded = p.type === "conclusa";
  const cover = p.photos?.[0];

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
            <div className="relative aspect-[4/3] overflow-hidden shimmer">
              <img src={cover} alt="off-market" className="w-full h-full object-cover blur-md scale-110 brightness-[0.45]" />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                <div className="w-14 h-14 rounded-full metallic flex items-center justify-center mb-3 gold-glow"><Lock size={24} /></div>
                <div className="font-display text-lg font-bold text-white">Opportunità Riservata</div>
                <div className="text-emerald text-sm font-semibold mt-1">Rendimento stimato 11% annuo</div>
              </div>
            </div>
            <div className="p-5">
              <div className="text-[11px] uppercase tracking-[0.22em] text-gold mb-1.5 font-semibold">Off-Market · Riservato</div>
              <p className="text-sm text-neutral-600 leading-relaxed">Clicca per sbloccare gratuitamente le offerte off-market selezionate Supreme House.</p>
            </div>
          </div>
        }
      />
    );
  }

  const hasMeta = p.mq || p.rooms || p.bathrooms;

  return (
    <div data-testid={testId} onClick={() => !isConcluded && navigate(`/immobili/${p.id}`)}
      className="glass-gold rounded-2xl overflow-hidden hover-lift cursor-pointer relative group flex flex-col">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img src={cover} alt={p.title} className="w-full h-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.07]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/5" />

        {isConcluded ? (
          <div className="absolute top-3 left-3 right-3 flex justify-center">
            <StatusBadge label={p.concluded_badge} />
          </div>
        ) : (
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 max-w-[78%]">
            {(p.status_badges || []).slice(0, 2).map((b, i) => <StatusBadge key={i} label={b} />)}
          </div>
        )}

        <div className="absolute top-3 right-3">
          <span className="text-[10px] font-mono bg-black/55 backdrop-blur-sm border border-white/15 text-white/90 px-2 py-1 rounded-md">{p.ref_code}</span>
        </div>

        {!isConcluded && (
          <div className="absolute bottom-3 left-3 flex items-center gap-2 text-xs font-medium">
            <span className="flex items-center gap-1 bg-black/55 backdrop-blur-sm text-white/95 px-2 py-1 rounded-md"><Eye size={13} className="text-gold" /> {p.views?.toLocaleString("it-IT")}</span>
            <span className="flex items-center gap-1 bg-black/55 backdrop-blur-sm text-white/95 px-2 py-1 rounded-md"><Share2 size={13} className="text-emerald" /> {p.whatsapp_shares}</span>
          </div>
        )}
        {!isConcluded && p.observing_now && (
          <div className="absolute bottom-3 right-3">
            <span className="flex items-center gap-1.5 text-[11px] font-medium bg-black/55 backdrop-blur-sm text-white/95 px-2 py-1 rounded-md"><span className="live-dot" /> {p.observing_count} online</span>
          </div>
        )}
      </div>

      <div className="p-5 flex flex-col flex-1">
        <span className="text-[11px] uppercase tracking-[0.22em] text-gold font-semibold">{TYPE_LABEL[p.type]}</span>
        <h3 className="font-display text-xl font-semibold text-neutral-900 leading-snug mt-1.5 line-clamp-2">{p.title}</h3>
        <div className="flex items-center gap-1.5 text-sm text-neutral-600 mt-1.5">
          <MapPin size={14} className="text-gold shrink-0" /> {p.neighborhood}{p.city ? `, ${p.city}` : ""}
        </div>

        {!isConcluded && hasMeta && (
          <div className="flex items-center gap-4 text-sm mt-4 pt-4 border-t border-black/[0.07]">
            {p.mq ? <MetaItem icon={Maximize2} value={p.mq} suffix=" mq" /> : null}
            {p.rooms ? <MetaItem icon={BedDouble} value={p.rooms} suffix={p.rooms > 1 ? " locali" : " locale"} /> : null}
            {p.bathrooms ? <MetaItem icon={Bath} value={p.bathrooms} suffix={p.bathrooms > 1 ? " bagni" : " bagno"} /> : null}
          </div>
        )}

        {!isConcluded ? (
          <div className="mt-4 flex items-end justify-between gap-3">
            <div className="min-w-0">
              {p.old_price && (
                <div className="flex items-center gap-2">
                  <span className="text-sm line-through text-neutral-400 font-mono">{formatPrice(p.old_price)}</span>
                  <span className="flex items-center gap-0.5 text-xs text-red-500 font-semibold font-mono"><TrendingDown size={12} />{p.discount_pct}%</span>
                </div>
              )}
              <div className="font-display text-2xl font-bold text-neutral-900 leading-none truncate">{formatPrice(p.price, p.price_period)}</div>
            </div>
            {p.pre_verified && (
              <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald border border-emerald/30 bg-emerald/10 px-2.5 py-1.5 rounded-full shrink-0"><ShieldCheck size={13} /> Verificato</span>
            )}
          </div>
        ) : (
          <div className="mt-4 flex items-center gap-2 text-emerald text-sm font-semibold">
            <Trophy size={16} /> Operazione chiusa con successo
          </div>
        )}
      </div>
    </div>
  );
};
