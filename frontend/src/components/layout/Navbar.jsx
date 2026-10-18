import React from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { Landmark, Building2, Users, Zap, User, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

const TABS = [
  { to: "/", label: "Hub", icon: Landmark, testid: "nav-hub", end: true },
  { to: "/immobili", label: "Immobili", icon: Building2, testid: "nav-immobili" },
  { to: "/chi-cerca", label: "Chi Cerca", icon: Users, testid: "nav-chi-cerca" },
  { to: "/servizi", label: "Servizi", icon: Zap, testid: "nav-servizi" },
];

const accountTab = (user) => {
  if (!user) return { to: "/accedi", label: "Accedi", icon: User, testid: "nav-accedi" };
  if (user.role === "admin" || user.role === "agent")
    return { to: "/dashboard", label: "Gestionale", icon: LayoutDashboard, testid: "nav-accedi" };
  return { to: "/pannello", label: "Profilo", icon: User, testid: "nav-accedi" };
};

export const TopNav = () => {
  const { user } = useAuth();
  const acct = accountTab(user);
  return (
    <header className="hidden lg:block sticky top-0 z-40 glass border-b border-gold/20">
      <div className="max-w-7xl mx-auto px-8 h-[72px] flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group" data-testid="brand-logo">
          <div className="w-9 h-9 rounded-md metallic flex items-center justify-center font-display font-black text-lg">S</div>
          <div className="leading-none">
            <div className="font-display text-xl font-bold text-gold-gradient tracking-tight">SUPREME HOUSE</div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground mt-0.5">Real Estate · Basilicata</div>
          </div>
        </Link>
        <nav className="flex items-center gap-1">
          {TABS.map((t) => (
            <NavLink key={t.to} to={t.to} end={t.end} data-testid={t.testid}
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
  const acct = accountTab(user);
  const items = [...TABS, acct];
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 glass border-t border-gold/25" data-testid="bottom-nav">
      <div className="grid grid-cols-5 h-[74px]">
        {items.map((t) => {
          const Icon = t.icon;
          return (
            <NavLink key={t.to} to={t.to} end={t.end} data-testid={`bottom-${t.testid}`}
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
