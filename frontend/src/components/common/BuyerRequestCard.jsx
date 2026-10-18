import React from "react";
import { BadgeCheck, Search, Wallet, MapPin } from "lucide-react";
import { LeadDialog } from "@/components/common/LeadDialog";

export const BuyerRequestCard = ({ request: r, testId }) => (
  <div data-testid={testId} className="glass-gold rounded-2xl p-5 hover-lift flex flex-col h-full min-w-[300px]">
    <div className="flex items-center justify-between mb-3">
      <span className="text-xs font-mono text-gold">Richiesta #{r.ref_code}</span>
      {r.verified && (
        <span className="flex items-center gap-1 text-[11px] text-emerald border border-emerald/30 bg-emerald/10 px-2 py-0.5 rounded-full">
          <BadgeCheck size={13} /> Verificata
        </span>
      )}
    </div>
    <div className="space-y-2.5 flex-1">
      <div>
        <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Profilo</div>
        <div className="text-sm font-semibold text-neutral-900">{r.profile}</div>
      </div>
      <div className="flex items-start gap-2">
        <Search size={14} className="text-gold mt-0.5 shrink-0" />
        <div className="text-sm text-neutral-700">{r.searching}</div>
      </div>
      <div className="flex items-start gap-2">
        <MapPin size={14} className="text-gold mt-0.5 shrink-0" />
        <div className="text-sm text-neutral-600">{r.zone}</div>
      </div>
      <div className="flex items-start gap-2">
        <Wallet size={14} className="text-emerald mt-0.5 shrink-0" />
        <div className="text-sm text-emerald font-medium">Budget pronto: {r.budget}</div>
      </div>
    </div>
    <LeadDialog
      testId={`propose-${r.ref_code}`}
      requestType="Proposta Immobile per Cliente Chi Cerca"
      property={{ ref_code: r.ref_code, title: `Cliente: ${r.profile}` }}
      title="Ho un immobile adatto"
      description={`Proponi il tuo immobile al cliente #${r.ref_code}. Ti ricontatteremo per la verifica.`}
      successMessage="Proposta inviata. Verificheremo la compatibilità e ti ricontatteremo."
      trigger={
        <button data-testid={`propose-btn-${r.ref_code}`} className="w-full mt-4 py-2.5 rounded-full metallic text-sm font-semibold hover:brightness-110 transition-all duration-300">
          Ho un immobile adatto → Proponilo
        </button>
      }
    />
  </div>
);
