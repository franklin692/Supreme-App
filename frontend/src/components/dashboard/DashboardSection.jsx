import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Inbox, Building2, Mail, Users, Trophy, ArrowUpRight, Gauge } from "lucide-react";
import { api } from "@/lib/api";

const StatCard = ({ icon: Icon, value, label, sub, accent = "gold", onClick, testId }) => (
  <button onClick={onClick} data-testid={testId}
    className="glass-gold rounded-2xl p-5 text-left hover-lift w-full group">
    <div className="flex items-start justify-between">
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${accent === "emerald" ? "bg-emerald/12 text-emerald" : accent === "amber" ? "bg-amber-500/12 text-amber-600" : "bg-gold/12 text-gold"}`}>
        <Icon size={20} />
      </div>
      {onClick && <ArrowUpRight size={16} className="text-neutral-300 group-hover:text-gold transition-colors" />}
    </div>
    <div className="font-display text-3xl font-bold text-neutral-900 mt-4 leading-none">{value}</div>
    <div className="text-sm font-medium text-neutral-700 mt-1.5">{label}</div>
    {sub && <div className="text-xs text-neutral-500 mt-0.5">{sub}</div>}
  </button>
);

export const DashboardSection = ({ onNavigate }) => {
  const navigate = useNavigate();
  const { data } = useQuery({ queryKey: ["admin-overview"], queryFn: async () => (await api.get("/admin/overview")).data });
  const d = data || {};
  const recent = d.recent_leads || [];

  return (
    <div data-testid="section-dashboard">
      <div className="flex items-center gap-2 text-gold mb-1"><Gauge size={20} /><h2 className="font-display text-2xl text-neutral-900">Panoramica</h2></div>
      <p className="text-sm text-neutral-500 mb-6">Il polso del sito in un colpo d'occhio.</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard testId="ov-leads" icon={Inbox} value={d.leads_total ?? "—"} label="Richieste ricevute"
          sub={d.leads_new ? `${d.leads_new} da gestire` : "tutte gestite"} accent="amber"
          onClick={() => navigate("/dashboard")} />
        <StatCard testId="ov-props" icon={Building2} value={d.properties_active ?? "—"} label="Immobili attivi"
          sub={`${d.properties_total ?? 0} totali`} accent="gold" onClick={() => onNavigate?.("region")} />
        <StatCard testId="ov-newsletter" icon={Mail} value={d.newsletter ?? "—"} label="Iscritti newsletter"
          accent="emerald" onClick={() => onNavigate?.("newsletter")} />
        <StatCard testId="ov-buyers" icon={Users} value={d.buyer_requests ?? "—"} label="Richieste acquirenti"
          sub={d.buyer_requests_pending ? `${d.buyer_requests_pending} in attesa` : "tutte approvate"} accent="gold"
          onClick={() => onNavigate?.("site")} />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mt-4">
        <div className="glass-gold rounded-2xl p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-gold/12 text-gold flex items-center justify-center"><Trophy size={20} /></div>
          <div>
            <div className="font-display text-2xl font-bold text-neutral-900 leading-none">{d.properties_concluded ?? "—"}</div>
            <div className="text-sm text-neutral-700 mt-1">Operazioni concluse</div>
          </div>
        </div>

        <div className="glass-gold rounded-2xl p-5 lg:col-span-2">
          <div className="text-xs uppercase tracking-[0.18em] text-neutral-400 mb-3">Ultime richieste</div>
          {recent.length === 0 ? (
            <div className="text-sm text-neutral-400 py-4 text-center">Nessuna richiesta ancora ricevuta.</div>
          ) : (
            <div className="space-y-2">
              {recent.map((l, i) => (
                <div key={i} className="flex items-center justify-between gap-3 py-2 border-b border-black/5 last:border-0" data-testid={`ov-recent-${i}`}>
                  <div className="min-w-0">
                    <div className="text-sm font-medium text-neutral-900 truncate">{l.name || "Contatto"}{l.request_type ? ` · ${l.request_type}` : ""}</div>
                    <div className="text-xs text-neutral-500 truncate">{l.whatsapp || l.phone || l.email || ""}</div>
                  </div>
                  <button onClick={() => navigate("/dashboard")} className="text-xs text-gold whitespace-nowrap hover:underline">Apri</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
