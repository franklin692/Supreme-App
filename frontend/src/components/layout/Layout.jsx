import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Instagram, Facebook, Linkedin, Youtube, Twitter, Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { api, waLink } from "@/lib/api";
import { TopNav, BottomNav } from "@/components/layout/Navbar";
import { NewsletterSignup } from "@/components/common/NewsletterSignup";

export const Layout = () => {
  const { pathname } = useLocation();
  return (
    <div className="min-h-screen flex flex-col">
      <TopNav />
      <main key={pathname} className="flex-1 pb-24 lg:pb-0 fade-up">
        <Outlet />
      </main>
      <Footer />
      <BottomNav />
    </div>
  );
};

const SOCIAL_ICON = { Instagram, Facebook, Linkedin, Youtube, Twitter, X: Twitter };

const Footer = () => {
  const { data: settings } = useQuery({ queryKey: ["settings"], queryFn: async () => (await api.get("/content/settings")).data });
  const brand = settings?.brand_name || "SUPREME HOUSE";
  const desc = settings?.footer_desc || "Immobiliare di nuova generazione. Hub di servizi immobiliari, property management, aste e intermediazione. Sede a Potenza, operatività in tutta la Basilicata.";
  const f = settings?.footer || {};
  const col1Items = f.col1_items || ["Potenza Città", "Vulture-Melfese", "Val d'Agri", "Matera", "Maratea & Pollino", "Metapontino"];
  const col2Items = f.col2_items || ["Consulente a domicilio in 24h", "Video-Desk Direzionale", "Studio Tecnico Partner"];
  const socials = (f.socials || []).filter((s) => s.url);
  const hasContacts = f.phone || f.whatsapp || f.email || f.address;

  return (
    <footer className="border-t border-gold/15 mt-10 pb-28 lg:pb-10" data-testid="site-footer">
      <div className="max-w-7xl mx-auto px-5 lg:px-8 pt-12">
        <NewsletterSignup />
      </div>
      <div className="max-w-7xl mx-auto px-5 lg:px-8 pt-12 grid gap-8 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="font-display text-2xl text-gold-gradient font-bold tracking-tight">{brand}</div>
          <p className="text-sm text-muted-foreground mt-3 max-w-md leading-relaxed">{desc}</p>
          {hasContacts && (
            <ul className="mt-4 space-y-1.5 text-sm text-muted-foreground" data-testid="footer-contacts">
              {f.phone && <li className="flex items-center gap-2"><Phone size={14} className="text-gold" /> <a href={`tel:${f.phone.replace(/\s/g, "")}`} className="hover:text-gold transition-colors">{f.phone}</a></li>}
              {f.whatsapp && <li className="flex items-center gap-2"><MessageCircle size={14} className="text-emerald" /> <a href={waLink(f.whatsapp)} target="_blank" rel="noreferrer" className="hover:text-gold transition-colors">WhatsApp</a></li>}
              {f.email && <li className="flex items-center gap-2"><Mail size={14} className="text-gold" /> <a href={`mailto:${f.email}`} className="hover:text-gold transition-colors">{f.email}</a></li>}
              {f.address && <li className="flex items-center gap-2"><MapPin size={14} className="text-gold" /> {f.address}</li>}
            </ul>
          )}
          {socials.length > 0 && (
            <div className="mt-4 flex items-center gap-3" data-testid="footer-socials">
              {socials.map((s, i) => {
                const Icon = SOCIAL_ICON[s.platform] || Instagram;
                return <a key={i} href={s.url} target="_blank" rel="noreferrer" aria-label={s.platform}
                  className="w-9 h-9 rounded-full border border-gold/30 flex items-center justify-center text-gold hover:bg-gold/10 transition-colors"><Icon size={16} /></a>;
              })}
            </div>
          )}
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-gold mb-3">{f.col1_title || "Presidi"}</div>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            {col1Items.map((x, i) => <li key={i}>{x}</li>)}
          </ul>
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-gold mb-3">{f.col2_title || "Contatti"}</div>
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            {col2Items.map((x, i) => <li key={i}>{x}</li>)}
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-5 lg:px-8 mt-10 pt-6 border-t border-black/5 text-xs text-muted-foreground flex flex-col md:flex-row justify-between gap-2">
        <span>© {new Date().getFullYear()} {brand.replace(/\b\w/g, (c) => c.toUpperCase())} · Tutti i diritti riservati</span>
        <span className="font-mono text-gold/70">{f.copyright_suffix || "Osservatorio Immobiliare Basilicata"}</span>
      </div>
    </footer>
  );
};
