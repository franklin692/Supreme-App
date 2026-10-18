import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Users2, Building, Rocket, Map, Settings2, Crown, UserCog, LogOut, Mail, DatabaseBackup } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { AgendaSection } from "@/components/dashboard/AgendaSection";
import { LeadsSection } from "@/components/dashboard/LeadsSection";
import { PropertiesSection } from "@/components/dashboard/PropertiesSection";
import { HypeSection } from "@/components/dashboard/HypeSection";
import { RegionSection } from "@/components/dashboard/RegionSection";
import { SiteSection } from "@/components/dashboard/SiteSection";
import { VipSection } from "@/components/dashboard/VipSection";
import { UsersSection } from "@/components/dashboard/UsersSection";
import { BackupSection, NewsletterSection } from "@/components/dashboard/AdminExtraSections";

export default function Dashboard() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [active, setActive] = useState("agenda");

  useEffect(() => {
    if (!loading && (!user || (user.role !== "admin" && user.role !== "agent"))) navigate("/accedi");
  }, [user, loading, navigate]);

  if (loading || !user) return <div className="py-20 text-center text-muted-foreground">Caricamento gestionale...</div>;
  const isAdmin = user.role === "admin";

  const area1 = [
    { id: "agenda", label: "Agenda & Calendario", icon: Calendar },
    { id: "leads", label: "Archivio Clienti & Lead", icon: Users2 },
    { id: "properties", label: "Gestione Immobili", icon: Building },
  ];
  const area2 = [
    { id: "hype", label: "Motore Hype & Boost", icon: Rocket },
    { id: "region", label: "Quartieri & Poli", icon: Map },
    { id: "site", label: "Gestione Sito", icon: Settings2 },
    { id: "vip", label: "Link VIP Proprietario", icon: Crown },
    { id: "users", label: "Gestione Utenti", icon: UserCog },
    { id: "newsletter", label: "Newsletter", icon: Mail },
    { id: "backup", label: "Backup Sito", icon: DatabaseBackup },
  ];

  const Section = {
    agenda: AgendaSection, leads: LeadsSection, properties: PropertiesSection,
    hype: HypeSection, region: RegionSection, site: SiteSection, vip: VipSection, users: UsersSection,
    newsletter: NewsletterSection, backup: BackupSection,
  }[active];

  return (
    <div className="max-w-7xl mx-auto px-5 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-xs uppercase tracking-[0.3em] text-gold">{isAdmin ? "Cabina di Regia · Super-Admin" : "Gestionale Agenti · CRM"}</div>
          <h1 className="font-display text-3xl font-bold text-neutral-900 mt-1">Benvenuto, {user.name}</h1>
        </div>
        <button data-testid="dash-logout" onClick={() => { logout(); navigate("/"); }}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-gold/30 text-gold text-sm hover:bg-gold/10 transition-colors">
          <LogOut size={15} /> Esci
        </button>
      </div>

      {/* Nav chips */}
      <div className="mb-7">
        <div className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground mb-2">Gestionale Interno Agenti</div>
        <div className="flex gap-2 flex-wrap mb-4">
          {area1.map((s) => <Chip key={s.id} s={s} active={active} setActive={setActive} />)}
        </div>
        {isAdmin && (
          <>
            <div className="text-[11px] uppercase tracking-[0.2em] text-gold mb-2 flex items-center gap-1.5"><Crown size={13} /> Cabina di Regia (Super-Admin)</div>
            <div className="flex gap-2 flex-wrap">
              {area2.map((s) => <Chip key={s.id} s={s} active={active} setActive={setActive} gold />)}
            </div>
          </>
        )}
      </div>

      <Section />
    </div>
  );
}

const Chip = ({ s, active, setActive, gold }) => {
  const Icon = s.icon;
  const on = active === s.id;
  return (
    <button data-testid={`dash-tab-${s.id}`} onClick={() => setActive(s.id)}
      className={cn("flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium border transition-all duration-300",
        on ? "metallic border-transparent" : gold ? "border-gold/25 text-gold hover:bg-gold/10" : "border-black/10 text-neutral-600 hover:border-gold/40")}>
      <Icon size={15} /> {s.label}
    </button>
  );
};
