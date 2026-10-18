import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { Ticker } from "@/components/layout/Ticker";
import { TopNav, BottomNav } from "@/components/layout/Navbar";
import { NewsletterSignup } from "@/components/common/NewsletterSignup";

export const Layout = () => {
  const { pathname } = useLocation();
  return (
    <div className="min-h-screen flex flex-col">
      <Ticker />
      <TopNav />
      <main key={pathname} className="flex-1 pb-24 lg:pb-0 fade-up">
        <Outlet />
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
};

const Footer = () => (
  <footer className="border-t border-gold/15 mt-10 pb-28 lg:pb-10">
    <div className="max-w-7xl mx-auto px-5 lg:px-8 pt-12">
      <NewsletterSignup />
    </div>
    <div className="max-w-7xl mx-auto px-5 lg:px-8 pt-12 grid gap-8 md:grid-cols-4">
      <div className="md:col-span-2">
        <div className="font-display text-2xl text-gold-gradient font-bold tracking-tight">SUPREME HOUSE</div>
        <p className="text-sm text-muted-foreground mt-3 max-w-md leading-relaxed">
          Private Banking del Real Estate. Hub di servizi immobiliari, property management, aste e
          intermediazione d'élite. Sede centrale a Potenza, operatività in tutta la Basilicata.
        </p>
      </div>
      <div>
        <div className="text-xs uppercase tracking-[0.2em] text-gold mb-3">Presidi</div>
        <ul className="space-y-1.5 text-sm text-muted-foreground">
          <li>Potenza Città</li><li>Vulture-Melfese</li><li>Val d'Agri</li>
          <li>Matera</li><li>Maratea & Pollino</li><li>Metapontino</li>
        </ul>
      </div>
      <div>
        <div className="text-xs uppercase tracking-[0.2em] text-gold mb-3">Contatti</div>
        <ul className="space-y-1.5 text-sm text-muted-foreground">
          <li>Consulente a domicilio in 24h</li>
          <li>Video-Desk Direzionale</li>
          <li>Studio Tecnico Partner</li>
        </ul>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-5 lg:px-8 mt-10 pt-6 border-t border-black/5 text-xs text-muted-foreground flex flex-col md:flex-row justify-between gap-2">
      <span>© {new Date().getFullYear()} Supreme House · Tutti i diritti riservati</span>
      <span className="font-mono text-gold/70">Osservatorio Immobiliare Basilicata</span>
    </div>
  </footer>
);
