import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ShieldHalf, Users, Check } from "lucide-react";
import { api } from "@/lib/api";
import { LeadDialog } from "@/components/common/LeadDialog";

export default function VipPage() {
  const { token } = useParams();
  const { data, isLoading } = useQuery({ queryKey: ["vip", token], queryFn: async () => (await api.get(`/vip/${token}`)).data });

  if (isLoading) return <div className="min-h-screen bg-obsidian flex items-center justify-center text-gold">Caricamento dossier riservato...</div>;
  if (!data) return <div className="min-h-screen bg-obsidian flex items-center justify-center text-white">Dossier non trovato o scaduto.</div>;

  return (
    <div className="min-h-screen bg-obsidian relative flex items-center justify-center px-5 py-16">
      <div className="absolute inset-0"
        style={{ backgroundImage: "radial-gradient(800px circle at 50% 0%, rgba(212,175,55,0.15), transparent 50%), radial-gradient(600px circle at 50% 100%, rgba(212,175,55,0.08), transparent 50%)" }} />
      <div className="relative max-w-xl w-full text-center" data-testid="vip-page">
        <div className="w-16 h-16 rounded-2xl metallic flex items-center justify-center mx-auto mb-6 gold-glow"><ShieldHalf size={30} /></div>
        <div className="text-xs uppercase tracking-[0.4em] text-gold mb-4">Dossier di Valutazione Riservata</div>
        <h1 className="font-display text-3xl sm:text-5xl font-bold text-white leading-tight">
          Preparato per:<br /><span className="text-gold-gradient">{data.owner_name}</span>
        </h1>

        <div className="glass-gold rounded-3xl p-8 mt-10">
          <div className="flex items-center justify-center gap-3 text-emerald mb-3"><Users size={24} /></div>
          <p className="text-lg text-gray-200 leading-relaxed">
            Vi sono <span className="font-mono text-3xl font-bold text-gold-gradient">{data.compatible_buyers}</span> acquirenti
            compatibili nel quartiere <span className="text-gold font-semibold">{data.neighborhood}</span> pronti a valutare
            il Vostro immobile.
          </p>
          <div className="mt-6 space-y-2 text-left max-w-sm mx-auto">
            {["Valutazione gratuita e riservata", "Accesso diretto ai clienti compatibili", "Nessuna pubblicazione pubblica (Off-Market)"].map((c) => (
              <div key={c} className="flex items-start gap-2 text-sm text-gray-200"><Check size={16} className="text-emerald mt-0.5 shrink-0" /> {c}</div>
            ))}
          </div>
          <LeadDialog testId="vip-sign" requestType="Firma/Prenotazione Incarico VIP"
            property={{ ref_code: "VIP", title: `${data.owner_name} · ${data.neighborhood}` }}
            title="Prenota l'incarico riservato" description="Un Private Advisor Vi contatterà per la firma dell'incarico."
            trigger={<button data-testid="vip-sign-btn" className="mt-8 w-full py-4 rounded-full metallic font-semibold text-base hover:brightness-110 transition-all duration-300 gold-glow">Firma / Prenota l'Incarico</button>} />
        </div>
        <div className="font-display text-xl text-gold-gradient mt-10">SUPREME HOUSE</div>
        <div className="text-xs text-muted-foreground mt-1">Private Banking del Real Estate</div>
      </div>
    </div>
  );
}
