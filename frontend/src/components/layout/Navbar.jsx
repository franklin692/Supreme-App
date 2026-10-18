import React, { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Landmark, Building2, Users, Zap, User, LayoutDashboard, Menu as MenuIcon, X, Phone, MessageCircle, Mail, LogOut, ChevronRight } from "lucide-react";
import { api, waLink } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent } from "@/components/ui/sheet";

const ICONS = { "/": Landmark, "/immobili": Building2, "/chi-cerca": Users, "/servizi": Zap };

const DEFAULT_ITEMS = [
  { label: "Hub", to: "/", visible: true },
  { label: "Immobili", to: "/immobili", visible: true },
  { label: "Chi Cerca", to: "/chi-cerca", visible: true },
  { label: "Servizi", to: "/servizi", visible: true },
];

const accountTab = (user) => {
  if (!user) return { to: "/accedi", label: "Accedi" };
  if (user.role === "admin" || user.role === "agent") return { to: "/dashboard", label: "Gestionale" };
  return { to: "/pannello", label: "Profilo" };
};

const useNav = () => {
  const { data: settings } = useQuery({ queryKey: ["settings"], queryFn: async () => (await api.get("/content/settings")).data });
  const nav = settings?.navbar || {};
  const items = (nav.items || DEFAULT_ITEMS).filter((i) => i.visible !== false);
  return {
    brand: settings?.brand_name || "SUPREME HOUSE",
    tagline: settings?.brand_tagline || "Real Estate · Basilicata",
    logoLetter: nav.logo_letter || "S",
    logoImage: nav.logo_image || "",
    items,
    footer: settings?.footer || {},
  };
};

const Logo = ({ letter, image }) =>
  image
    ? <img src={image} alt="logo" className="w-9 h-9 rounded-md object-cover" />
    : <div className="w-9 h-9 rounded-md metallic flex items-center justify-center font-display font-black text-lg">{letter}</div>;

export const TopNav = () => {
  const { user } = useAuth();
  const { brand, tagline, logoLetter, logoImage, items } = useNav();
  const acct = accountTab(user);
  return (
    <header className="hidden lg:block sticky top-0 z-40 glass border-b border-gold/20">
      <div className="max-w-7xl mx-auto px-8 h-[72px] flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group" data-testid="brand-logo">
          <Logo letter={logoLetter} image={logoImage} />
          <div className="leading-none">
            <div className="font-display text-xl font-bold text-gold-gradient tracking-tight">{brand}</div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mt-0.5">{tagline}</div>
          </div>
        </Link>
        <nav className="flex items-center gap-1">
          {items.map((t) => (
            <NavLink key={t.to} to={t.to} end={t.to === "/"} data-testid={`nav-${t.to === "/" ? "hub" : t.to.slice(1)}`}
              className={({ isActive }) => cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300",
                isActive ? "text-gold bg-gold/10" : "text-neutral-600 hover:text-gold"
              )}>
              {t.label}
            </NavLink>
          ))}
          <NavLink to={acct.to} data-testid="nav-accedi"
            className="ml-3 px-5 py-2.5 rounded-full metallic text-sm hover:brightness-110 transition-all duration-300">
            {acct.label}
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

/* Curated bottom nav (mobile): Home, Immobili, Servizi, Profilo + Menu drawer */
const BOTTOM = [
  { to: "/", label: "Home", icon: Landmark },
  { to: "/immobili", label: "Immobili", icon: Building2 },
  { to: "/servizi", label: "Servizi", icon: Zap },
];

export const BottomNav = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const acct = accountTab(user);

  return (
    <>
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 glass border-t border-gold/25" data-testid="bottom-nav">
        <div className="grid grid-cols-5 h-[74px]">
          {BOTTOM.map((t) => {
            const Icon = t.icon;
            return (
              <NavLink key={t.to} to={t.to} end={t.to === "/"} data-testid={`bottom-nav-${t.to === "/" ? "hub" : t.to.slice(1)}`}
                className={({ isActive }) => cn("flex flex-col items-center justify-center gap-1 transition-colors duration-300", isActive ? "text-gold" : "text-neutral-500")}>
                {({ isActive }) => (<><Icon size={21} className={isActive ? "drop-shadow-[0_0_8px_rgba(212,175,55,0.6)]" : ""} /><span className="text-[10px] font-medium tracking-tight">{t.label}</span></>)}
              </NavLink>
            );
          })}
          <NavLink to={acct.to} data-testid="bottom-nav-profilo"
            className={({ isActive }) => cn("flex flex-col items-center justify-center gap-1 transition-colors duration-300", isActive ? "text-gold" : "text-neutral-500")}>
            {({ isActive }) => (<><User size={21} className={isActive ? "drop-shadow-[0_0_8px_rgba(212,175,55,0.6)]" : ""} /><span className="text-[10px] font-medium tracking-tight">Profilo</span></>)}
          </NavLink>
          <button data-testid="bottom-nav-menu" onClick={() => setOpen(true)}
            className="flex flex-col items-center justify-center gap-1 text-neutral-500 active:text-gold transition-colors">
            <MenuIcon size={21} /><span className="text-[10px] font-medium tracking-tight">Menu</span>
          </button>
        </div>
      </nav>
      <SideMenu open={open} setOpen={setOpen} />
    </>
  );
};

const SideMenu = ({ open, setOpen }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { brand, tagline, logoLetter, logoImage, items, footer } = useNav();
  const acct = accountTab(user);
  const go = (to) => { setOpen(false); navigate(to); };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent side="right" className="w-[86%] max-w-sm p-0 border-l border-gold/20 bg-[color:var(--sh-surface)]" data-testid="side-menu">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between px-5 py-4 border-b border-black/5">
            <div className="flex items-center gap-3">
              <Logo letter={logoLetter} image={logoImage} />
              <div className="leading-none">
                <div className="font-display text-lg font-bold text-gold-gradient tracking-tight">{brand}</div>
                <div className="text-[9px] uppercase tracking-[0.28em] text-muted-foreground mt-0.5">{tagline}</div>
              </div>
            </div>
            <button onClick={() => setOpen(false)} data-testid="side-menu-close" className="w-9 h-9 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-500"><X size={18} /></button>
          </div>

          <div className="flex-1 overflow-y-auto px-3 py-4">
            <div className="text-[11px] uppercase tracking-[0.18em] text-neutral-400 px-3 mb-1">Esplora</div>
            {items.map((t) => {
              const Icon = ICONS[t.to] || Landmark;
              return (
                <button key={t.to} onClick={() => go(t.to)} data-testid={`side-link-${t.to === "/" ? "hub" : t.to.slice(1)}`}
                  className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-neutral-800 hover:bg-gold/10 transition-colors">
                  <Icon size={19} className="text-gold" /><span className="font-medium">{t.label}</span>
                  <ChevronRight size={16} className="ml-auto text-neutral-300" />
                </button>
              );
            })}

            <div className="text-[11px] uppercase tracking-[0.18em] text-neutral-400 px-3 mt-5 mb-1">Area personale</div>
            <button onClick={() => go(acct.to)} data-testid="side-account"
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-neutral-800 hover:bg-gold/10 transition-colors">
              {user ? <LayoutDashboard size={19} className="text-gold" /> : <User size={19} className="text-gold" />}
              <span className="font-medium">{acct.label}</span>
              <ChevronRight size={16} className="ml-auto text-neutral-300" />
            </button>
            {user && (
              <button onClick={() => { logout(); setOpen(false); navigate("/"); }} data-testid="side-logout"
                className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-colors">
                <LogOut size={19} /><span className="font-medium">Esci</span>
              </button>
            )}

            {(footer.phone || footer.whatsapp || footer.email) && (
              <>
                <div className="text-[11px] uppercase tracking-[0.18em] text-neutral-400 px-3 mt-5 mb-1">Contatti</div>
                {footer.whatsapp && <a href={waLink(footer.whatsapp)} target="_blank" rel="noreferrer" className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-neutral-800 hover:bg-emerald/10 transition-colors"><MessageCircle size={19} className="text-emerald" /><span className="font-medium">WhatsApp</span></a>}
                {footer.phone && <a href={`tel:${footer.phone.replace(/\s/g, "")}`} className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-neutral-800 hover:bg-gold/10 transition-colors"><Phone size={19} className="text-gold" /><span className="font-medium">{footer.phone}</span></a>}
                {footer.email && <a href={`mailto:${footer.email}`} className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-neutral-800 hover:bg-gold/10 transition-colors"><Mail size={19} className="text-gold" /><span className="font-medium truncate">{footer.email}</span></a>}
              </>
            )}
          </div>

          <div className="px-5 py-3 border-t border-black/5 text-center">
            <button onClick={() => go(acct.to)} className="w-full py-3 rounded-full metallic font-semibold text-sm">{user ? "Vai alla mia area" : "Accedi / Registrati"}</button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
