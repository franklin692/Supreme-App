import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { api } from "@/lib/api";
import { SectionTitle } from "@/components/common/Primitives";
import { Seo } from "@/components/common/Seo";
import { serviceIcon } from "@/lib/icons";

export default function Servizi() {
  const { data: services = [] } = useQuery({ queryKey: ["services"], queryFn: async () => (await api.get("/services")).data });
  const { data: settings } = useQuery({ queryKey: ["settings"], queryFn: async () => (await api.get("/content/settings")).data });
  const pg = settings?.pages?.servizi || {};
  const seo = settings?.seo?.pages?.servizi || {};

  return (
    <div className="max-w-7xl mx-auto px-5 lg:px-8 py-10 lg:py-14">
      <Seo title={seo.title} description={seo.description} />
      <SectionTitle eyebrow={pg.eyebrow || "Hub Multiservizi"} title={pg.title || "I Servizi Supreme House"}
        subtitle={pg.subtitle || "Un unico interlocutore per l'intero ciclo di vita del tuo immobile: dalla valorizzazione alla gestione, dalle aste agli adempimenti."} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((s, i) => {
          const Icon = serviceIcon(s.icon);
          return (
            <Link key={s.id} to={`/servizi/${s.id}`} data-testid={`service-${i}`}
              className="relative glass-gold rounded-2xl p-7 hover-lift group flex flex-col overflow-hidden">
              <span className="absolute top-4 right-6 font-display text-5xl font-bold text-black/[0.045] group-hover:text-gold/20 transition-colors duration-300 select-none">{String(i + 1).padStart(2, "0")}</span>
              <div className="w-14 h-14 rounded-2xl metallic flex items-center justify-center mb-5 group-hover:scale-105 transition-transform duration-300"><Icon size={24} /></div>
              <h3 className="font-display text-xl font-semibold text-neutral-900 leading-snug">{s.title}</h3>
              <p className="text-sm text-neutral-600 mt-2 leading-relaxed flex-1">{s.short}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-gold text-sm font-semibold group-hover:gap-3 transition-all duration-300">
                Scopri di più <ArrowRight size={16} />
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
