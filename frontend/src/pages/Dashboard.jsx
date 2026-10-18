import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Users2, Building, LogOut, Crown, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { AgendaSection } from "@/components/dashboard/AgendaSection";
import { LeadsSection } from "@/components/dashboard/LeadsSection";
import { PropertiesSection } from "@/components/dashboard/PropertiesSection";

export default function Dashboard() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [active, setActive] = useState("agenda");

  useEffect(() => {
    if (!loading && (!user || (user.role !== "admin" && user.role !== "agent"))) navigate("/accedi");
  }, [user, loading, navigate]);

  if (loading || !user) return <div className="py-20 text-center text-neutral-500">Caricamento gestionale...</div>;
  const isAdmin = user.role === "admin";

  const tabs = [
    { id: "agenda", label: "Agenda & Calendario", icon: Calendar },
    { id: "leads", label: "Archivio Clienti & Lead", icon: Users2 },
    { id: "properties", label: "Gestione Immobili", icon: Building },
  ];
  const Section = { agenda: AgendaSection, leads: LeadsSection, properties: PropertiesSection }[active];

  return (
    <div className="max-w-7xl mx-auto px-5 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-xs uppercase tracking-[0.25em] text-gold">Gestionale Agenti · CRM</div>
          <h1 className="font-display text-3xl font-bold text-neutral-900 mt-1">Ciao, {user.name}</h1>
        </div>
        <button data-testid="dash-logout" onClick={() => { logout(); navigate("/"); }}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-black/10 text-neutral-700 text-sm hover:bg-neutral-100 transition-colors"><LogOut size={15} /> Esci</button>
      </div>

      {isAdmin && (
        <button data-testid="open-cabina-btn" onClick={() => navigate("/cabina-di-regia")}
          className="w-full mb-6 rounded-2xl btn-dark px-6 py-5 flex items-center justify-between group">
          <span className="flex items-center gap-3"><Crown className="text-gold" size={22} /><span className="text-left"><span className="block font-display text-lg font-bold">Cabina di Regia</span><span className="block text-xs text-white/60">Controllo totale del sito: contenuti, hype, quartieri, servizi, FAQ, integrazioni, backup</span></span></span>
          <ArrowRight className="text-gold group-hover:translate-x-1 transition-transform" size={22} />
        </button>
      )}

      <div className="flex gap-2 flex-wrap mb-7">
        {tabs.map((s) => {
          const Icon = s.icon; const on = active === s.id;
          return (
            <button key={s.id} data-testid={`dash-tab-${s.id}`} onClick={() => setActive(s.id)}
              className={cn("flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium border transition-all",
                on ? "btn-dark border-transparent" : "border-black/10 text-neutral-600 hover:border-gold/40")}>
              <Icon size={15} /> {s.label}
            </button>
          );
        })}
      </div>

      <Section />
    </div>
  );
}
