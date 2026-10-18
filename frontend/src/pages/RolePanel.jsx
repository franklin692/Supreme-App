import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Heart, Unlock, Send, Building2, FileText, AlertTriangle, Wrench } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { BnbDashboardView } from "@/components/home/BnbDashboardView";
import { LeadDialog } from "@/components/common/LeadDialog";
import { cn } from "@/lib/utils";

const STAGES = [
  { id: "inviata", label: "Segnalazione inviata" },
  { id: "verifica", label: "Verifica in corso" },
  { id: "incarico", label: "Incarico Acquisito" },
  { id: "compenso", label: "💰 Compenso Sbloccato" },
];

export default function RolePanel() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate("/accedi");
    if (!loading && user && (user.role === "admin" || user.role === "agent")) navigate("/dashboard");
  }, [user, loading, navigate]);

  if (loading || !user) return <div className="py-20 text-center text-muted-foreground">Caricamento...</div>;
  const pd = user.profile_data || {};

  return (
    <div className="max-w-4xl mx-auto px-5 lg:px-8 py-10 lg:py-14">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-gold">Area Riservata</div>
          <h1 className="font-display text-3xl font-bold text-white mt-1">Ciao, {user.name}</h1>
        </div>
        <button data-testid="logout-btn" onClick={() => { logout(); navigate("/"); }}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-gold/30 text-gold text-sm hover:bg-gold/10 transition-colors">
          <LogOut size={15} /> Esci
        </button>
      </div>

      {/* USER */}
      {user.role === "user" && (
        <div className="grid sm:grid-cols-3 gap-4" data-testid="panel-user">
          <StatCard icon={Heart} label="Immobili salvati" value={(pd.saved || []).length} />
          <StatCard icon={Unlock} label="Dossier sbloccati" value={(pd.unlocked || []).length} />
          <StatCard icon={Send} label="Richieste inviate" value={pd.requests || 0} />
          <div className="sm:col-span-3 glass-gold rounded-2xl p-6">
            <h3 className="font-display text-xl text-white mb-2">I tuoi immobili salvati</h3>
            <p className="text-sm text-muted-foreground">{(pd.saved || []).join(", ") || "Nessun immobile salvato ancora."}</p>
          </div>
        </div>
      )}

      {/* BNB OWNER */}
      {user.role === "bnb_owner" && (
        <div data-testid="panel-bnb">
          <div className="glass-gold rounded-2xl p-5 mb-5">
            <div className="text-xs uppercase tracking-[0.2em] text-gold">Immobile gestito</div>
            <div className="font-display text-xl text-white">{pd.property_name}</div>
          </div>
          <BnbDashboardView data={pd} />
        </div>
      )}

      {/* CONDOMINO */}
      {user.role === "condomino" && (
        <div className="space-y-5" data-testid="panel-condo">
          <div className="glass-gold rounded-2xl p-5 flex items-center gap-3">
            <Building2 className="text-gold" size={22} />
            <div><div className="text-xs text-muted-foreground">Condominio</div><div className="font-display text-xl text-white">{pd.condo_name}</div></div>
          </div>
          <div className="grid md:grid-cols-2 gap-5">
            <div className="glass rounded-2xl p-5">
              <h3 className="font-display text-lg text-white mb-3 flex items-center gap-2"><AlertTriangle size={16} className="text-gold" /> Avvisi</h3>
              {(pd.notices || []).map((n, i) => (
                <div key={i} className="mb-3 last:mb-0"><div className="text-sm text-gray-100 font-medium">{n.title}</div><div className="text-xs text-muted-foreground">{n.date} · {n.detail}</div></div>
              ))}
            </div>
            <div className="glass rounded-2xl p-5">
              <h3 className="font-display text-lg text-white mb-3 flex items-center gap-2"><FileText size={16} className="text-gold" /> Rate Condominiali</h3>
              {(pd.installments || []).map((r, i) => (
                <div key={i} className="flex items-center justify-between text-sm mb-2.5 last:mb-0">
                  <span className="text-gray-200">{r.label}</span>
                  <span className={cn("font-mono", r.status.includes("Pagata") ? "text-emerald" : "text-amber")}>{r.amount}€ · {r.status}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="glass-gold rounded-2xl p-6 text-center">
            <Wrench className="text-gold mx-auto mb-2" size={22} />
            <h3 className="font-display text-xl text-white mb-2">Segnala un guasto</h3>
            <LeadDialog testId="condo-guasto" requestType="Segnalazione Guasto Condominiale" showTimeSlot={false}
              title="Segnala un guasto" description="Descrivi il problema: l'amministratore interverrà al più presto."
              trigger={<button data-testid="condo-guasto-btn" className="px-6 py-3 rounded-full metallic font-semibold hover:brightness-110 transition-all duration-300">Apri segnalazione</button>} />
          </div>
        </div>
      )}

      {/* COLLABORATOR */}
      {user.role === "collaborator" && (
        <div className="space-y-5" data-testid="panel-collab">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-xl text-white">Le tue segnalazioni</h3>
            <LeadDialog testId="collab-segnala" requestType="Segnalazione Immobile (Collaboratore)"
              title="Nuova segnalazione" description="Inserisci i dati dell'immobile da segnalare." showTimeSlot={false}
              trigger={<button data-testid="collab-segnala-btn" className="px-5 py-2.5 rounded-full metallic text-sm font-semibold hover:brightness-110 transition-all duration-300">+ Nuova segnalazione</button>} />
          </div>
          {(pd.referrals || []).map((ref, i) => (
            <div key={i} className="glass-gold rounded-2xl p-5" data-testid={`collab-ref-${i}`}>
              <div className="flex items-center justify-between mb-4">
                <span className="font-medium text-white">{ref.property}</span>
                <span className="text-sm font-mono text-emerald">{ref.reward !== "—" ? `Compenso: ${ref.reward}` : "In lavorazione"}</span>
              </div>
              <StageBar current={ref.stage} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const StatCard = ({ icon: Icon, label, value }) => (
  <div className="glass-gold rounded-2xl p-6">
    <Icon className="text-gold mb-2" size={22} />
    <div className="font-mono text-3xl font-bold text-gold-gradient">{value}</div>
    <div className="text-sm text-muted-foreground mt-1">{label}</div>
  </div>
);

const StageBar = ({ current }) => {
  const idx = STAGES.findIndex((s) => s.id === current);
  return (
    <div className="flex items-center">
      {STAGES.map((s, i) => (
        <React.Fragment key={s.id}>
          <div className="flex flex-col items-center text-center" style={{ flex: "0 0 auto" }}>
            <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-2",
              i <= idx ? "metallic border-transparent" : "border-white/15 text-muted-foreground")}>{i + 1}</div>
            <span className={cn("text-[10px] mt-1.5 max-w-[80px] leading-tight", i <= idx ? "text-gold" : "text-muted-foreground")}>{s.label}</span>
          </div>
          {i < STAGES.length - 1 && <div className={cn("h-0.5 flex-1 mx-1", i < idx ? "bg-gold" : "bg-white/10")} />}
        </React.Fragment>
      ))}
    </div>
  );
};
