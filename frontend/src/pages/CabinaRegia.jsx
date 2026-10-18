import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Rocket, Map, Settings2, Crown, UserCog, Mail, DatabaseBackup, HelpCircle, FileText, Plug, ArrowLeft, LogOut, Palette, LayoutGrid, Menu, PanelBottom } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { HypeSection } from "@/components/dashboard/HypeSection";
import { RegionSection } from "@/components/dashboard/RegionSection";
import { SiteSection } from "@/components/dashboard/SiteSection";
import { VipSection } from "@/components/dashboard/VipSection";
import { UsersSection } from "@/components/dashboard/UsersSection";
import { BackupSection, NewsletterSection } from "@/components/dashboard/AdminExtraSections";
import { FaqSection, SettingsSection, ConfigSection } from "@/components/dashboard/ContentSections";
import { ThemeSection } from "@/components/dashboard/ThemeSection";
import { HomeEditorSection } from "@/components/dashboard/HomeEditor";
import { NavbarSection, FooterSection } from "@/components/dashboard/LayoutSections";

export default function CabinaRegia() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [active, setActive] = useState("settings");

  useEffect(() => {
    if (!loading && (!user || user.role !== "admin")) navigate("/accedi");
  }, [user, loading, navigate]);

  if (loading || !user) return <div className="py-20 text-center text-neutral-500">Caricamento Cabina di Regia...</div>;

  const groups = [
    { title: "Aspetto & Tema", items: [
      { id: "theme", label: "Aspetto & Tema", icon: Palette },
    ]},
    { title: "Contenuti & Editoriale", items: [
      { id: "home", label: "Sezioni Home", icon: LayoutGrid },
      { id: "navbar", label: "Menu & Logo", icon: Menu },
      { id: "footer", label: "Footer & Contatti", icon: PanelBottom },
      { id: "settings", label: "Contenuti Sito", icon: FileText },
      { id: "site", label: "Ticker · Statistiche · Servizi · Bacheca", icon: Settings2 },
      { id: "faq", label: "FAQ", icon: HelpCircle },
      { id: "region", label: "Quartieri & Poli", icon: Map },
    ]},
    { title: "Marketing & Crescita", items: [
      { id: "hype", label: "Motore Hype & Boost", icon: Rocket },
      { id: "vip", label: "Link VIP Proprietario", icon: Crown },
      { id: "newsletter", label: "Newsletter", icon: Mail },
    ]},
    { title: "Sistema", items: [
      { id: "config", label: "Integrazioni & Config", icon: Plug },
      { id: "users", label: "Gestione Utenti", icon: UserCog },
      { id: "backup", label: "Backup Sito", icon: DatabaseBackup },
    ]},
  ];

  const Section = {
    theme: ThemeSection,
    home: HomeEditorSection, navbar: NavbarSection, footer: FooterSection,
    settings: SettingsSection, site: SiteSection, faq: FaqSection, region: RegionSection,
    hype: HypeSection, vip: VipSection, newsletter: NewsletterSection,
    config: ConfigSection, users: UsersSection, backup: BackupSection,
  }[active];

  return (
    <div className="max-w-7xl mx-auto px-5 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <button onClick={() => navigate("/dashboard")} className="inline-flex items-center gap-2 text-xs text-neutral-500 hover:text-gold mb-1 transition-colors"><ArrowLeft size={14} /> Torna al Gestionale</button>
          <h1 className="font-display text-3xl font-bold text-neutral-900 flex items-center gap-2"><Crown className="text-gold" size={26} /> Cabina di Regia</h1>
          <p className="text-sm text-neutral-500 mt-1">Modifica qualsiasi contenuto del sito, in autonomia.</p>
        </div>
        <button data-testid="cabina-logout" onClick={() => { logout(); navigate("/"); }}
          className="flex items-center gap-2 px-4 py-2 rounded-full border border-black/10 text-neutral-700 text-sm hover:bg-neutral-100 transition-colors"><LogOut size={15} /> Esci</button>
      </div>

      <div className="grid lg:grid-cols-[260px_1fr] gap-6">
        <aside className="space-y-5">
          {groups.map((g) => (
            <div key={g.title}>
              <div className="text-[11px] uppercase tracking-[0.18em] text-neutral-400 mb-2 px-1">{g.title}</div>
              <div className="space-y-1">
                {g.items.map((s) => {
                  const Icon = s.icon; const on = active === s.id;
                  return (
                    <button key={s.id} data-testid={`cabina-tab-${s.id}`} onClick={() => setActive(s.id)}
                      className={cn("w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium text-left transition-all",
                        on ? "btn-dark" : "text-neutral-600 hover:bg-neutral-100")}>
                      <Icon size={16} className={on ? "text-gold" : "text-neutral-400"} /> {s.label}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </aside>
        <main className="min-w-0 glass rounded-3xl p-5 lg:p-7"><Section /></main>
      </div>
    </div>
  );
}
