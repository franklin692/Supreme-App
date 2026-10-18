import React from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, CheckCircle2, Lock, Users, Rocket } from "lucide-react";
import { api } from "@/lib/api";
import { serviceIcon } from "@/lib/icons";
import { LeadDialog } from "@/components/common/LeadDialog";
import { DemoGestionaleDialog } from "@/components/home/DemoGestionaleDialog";

export default function ServiceDetail() {
  const { id } = useParams();
  const { data: s, isLoading } = useQuery({ queryKey: ["service", id], queryFn: async () => (await api.get(`/services/${id}`)).data });

  if (isLoading) return <div className="max-w-4xl mx-auto px-5 py-20 text-center text-muted-foreground">Caricamento...</div>;
  if (!s) return <div className="max-w-4xl mx-auto px-5 py-20 text-center">Servizio non trovato.</div>;
  const Icon = serviceIcon(s.icon);

  return (
    <div className="max-w-4xl mx-auto px-5 lg:px-8 py-8 lg:py-12">
      <Link to="/servizi" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-gold mb-6 transition-colors">
        <ArrowLeft size={16} /> Tutti i servizi
      </Link>

      <div className="flex items-start gap-4 mb-8">
        <div className="w-16 h-16 rounded-2xl metallic flex items-center justify-center shrink-0 gold-glow"><Icon size={28} /></div>
        <div>
          <span className="text-xs uppercase tracking-[0.3em] text-gold">Servizio Supreme House</span>
          <h1 className="font-display text-3xl lg:text-4xl font-bold text-white mt-1 leading-tight">{s.title}</h1>
        </div>
      </div>

      <div className="glass-gold rounded-2xl p-7 mb-8">
        <p className="text-gray-200 leading-relaxed text-base">{s.full}</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-8">
        {["Interlocutore unico", "Massima riservatezza", "Dati Osservatorio reali"].map((v) => (
          <div key={v} className="glass rounded-xl p-4 flex items-center gap-2 text-sm text-gray-200">
            <CheckCircle2 size={16} className="text-emerald shrink-0" /> {v}
          </div>
        ))}
      </div>

      {s.demo_link && (
        <DemoGestionaleDialog
          trigger={
            <button data-testid="svc-demo-btn" className="w-full mb-6 py-4 rounded-full border border-gold/40 text-gold hover:bg-gold/10 transition-colors duration-300 font-medium flex items-center justify-center gap-2">
              <Rocket size={18} /> Prova la Demo Live del Gestionale
            </button>
          }
        />
      )}

      {/* Request forms */}
      {s.dual_forms ? (
        <div className="grid md:grid-cols-2 gap-5">
          <div className="glass-gold rounded-2xl p-6">
            <div className="flex items-center gap-2 text-gold mb-2"><Lock size={18} /><span className="font-display text-lg">Modulo Proprietari</span></div>
            <p className="text-sm text-muted-foreground mb-4">Vendi o affitta in Off-Market, senza pubblicare nulla online.</p>
            <LeadDialog testId="svc-off-owner" requestType="Off-Market — Proprietario" service={s.title}
              title="Vendi/Affitta in Off-Market" description="Proporremo il tuo immobile solo ai clienti selezionati."
              trigger={<button data-testid="svc-off-owner-btn" className="w-full py-3 rounded-full metallic font-semibold hover:brightness-110 transition-all duration-300">Vendi in Off-Market</button>} />
          </div>
          <div className="glass-gold rounded-2xl p-6">
            <div className="flex items-center gap-2 text-gold mb-2"><Users size={18} /><span className="font-display text-lg">Modulo Investitori</span></div>
            <p className="text-sm text-muted-foreground mb-4">Iscriviti alla Lista Riservata e ricevi le opportunità in anteprima.</p>
            <LeadDialog testId="svc-off-investor" requestType="Off-Market — Investitore" service={s.title}
              title="Lista Riservata Off-Market" description="Ricevi in anteprima gli immobili a più alto rendimento." showTimeSlot={false}
              trigger={<button data-testid="svc-off-investor-btn" className="w-full py-3 rounded-full metallic font-semibold hover:brightness-110 transition-all duration-300">Iscriviti alla Lista</button>} />
          </div>
        </div>
      ) : (
        <div className="glass-gold rounded-2xl p-7 text-center">
          <h3 className="font-display text-2xl text-white mb-2">Richiedi questo servizio</h3>
          <p className="text-sm text-muted-foreground mb-5 max-w-lg mx-auto">Lascia i tuoi dati e scegli quando preferisci essere contattato: un Responsabile Supreme House ti seguirà passo passo.</p>
          <LeadDialog testId="svc-request" requestType={`Richiesta Servizio: ${s.title}`} service={s.title}
            title={s.title} description="Scegli la fascia oraria per essere ricontattato."
            trigger={<button data-testid="svc-request-btn" className="px-8 py-3.5 rounded-full metallic font-semibold hover:brightness-110 transition-all duration-300 gold-glow">Richiedi Informazioni</button>} />
        </div>
      )}
    </div>
  );
}
