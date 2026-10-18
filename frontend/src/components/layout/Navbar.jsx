import React from "react";
import { NavLink, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Landmark, Building2, Users, Zap, User, LayoutDashboard } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

const ICONS = { "/": Landmark, "/immobili": Building2, "/chi-cerca": Users, "/servizi": Zap };

const DEFAULT_ITEMS = [
  { label: "Hub", to: "/", visible: true },
  { label: "Immobili", to: "/immobili", visible: true },
  { label: "Chi Cerca", to: "/chi-cerca", visible: true },
  { label: "Servizi", to: "/servizi", visible: true },
];

const accountTab = (user) => {
  if (!user) return { to: "/accedi", label: "Accedi", icon: User, testid: "nav-accedi" };
  if (user.role === "admin" || user.role === "agent")
    return { to: "/dashboard", label: "Gestionale", icon: LayoutDashboard, testid: "nav-accedi" };
  return { to: "/pannello", label: "Profilo", icon: User, testid: "nav-accedi" };
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
          <NavLink to={acct.to} data-testid={acct.testid}
            className="ml-3 px-5 py-2.5 rounded-full metallic text-sm hover:brightness-110 transition-all duration-300">
            {acct.label}
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export const BottomNav = () => {
  const { user } = useAuth();
  const { items } = useNav();
  const acct = accountTab(user);
  const navItems = [...items.map((i) => ({ ...i, icon: ICONS[i.to] || Landmark })), acct].slice(0, 5);
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 glass border-t border-gold/25" data-testid="bottom-nav">
      <div className="grid h-[74px]" style={{ gridTemplateColumns: `repeat(${navItems.length}, minmax(0, 1fr))` }}>
        {navItems.map((t) => {
          const Icon = t.icon;
          return (
            <NavLink key={t.to} to={t.to} end={t.to === "/"} data-testid={`bottom-nav-${t.to === "/" ? "hub" : t.to.slice(1)}`}
              className={({ isActive }) => cn(
                "flex flex-col items-center justify-center gap-1 transition-colors duration-300",
                isActive ? "text-gold" : "text-neutral-500"
              )}>
              {({ isActive }) => (
                <>
                  <Icon size={21} className={isActive ? "drop-shadow-[0_0_8px_rgba(212,175,55,0.6)]" : ""} />
                  <span className="text-[10px] font-medium tracking-tight">{t.label}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};
