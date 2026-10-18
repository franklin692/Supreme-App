import React from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { TrendingUp, Percent, LogIn, Banknote, Wrench, FileText } from "lucide-react";

export const BnbDashboardView = ({ data }) => {
  const d = data || {};
  return (
    <div className="space-y-4" data-testid="bnb-dashboard-view">
      {/* KPI row */}
      <div className="grid grid-cols-2 gap-3">
        <div className="glass-gold rounded-xl p-4">
          <div className="flex items-center gap-2 text-emerald text-xs"><TrendingUp size={15} /> Incassi questo mese</div>
          <div className="font-mono text-2xl font-bold text-emerald mt-1">+{(d.monthly_income || 0).toLocaleString("it-IT")}€</div>
        </div>
        <div className="glass-gold rounded-xl p-4">
          <div className="flex items-center gap-2 text-gold text-xs"><Percent size={15} /> Tasso occupazione</div>
          <div className="font-mono text-2xl font-bold text-gold mt-1">{d.occupancy || 0}%</div>
        </div>
      </div>

      {/* Chart */}
      <div className="glass rounded-xl p-4">
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">Grafico Incassi Mensili</div>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={d.income_chart || []}>
              <defs>
                <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#D4AF37" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#D4AF37" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0d" vertical={false} />
              <XAxis dataKey="month" stroke="#6B7280" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#6B7280" fontSize={11} tickLine={false} axisLine={false} width={34} />
              <Tooltip contentStyle={{ background: "#111622", border: "1px solid rgba(212,175,55,0.4)", borderRadius: 8, color: "#fff" }} />
              <Area type="monotone" dataKey="value" stroke="#D4AF37" strokeWidth={2} fill="url(#g)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Check-ins */}
      <div className="glass rounded-xl p-4">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gold mb-2"><LogIn size={14} /> Stato Check-in Ospiti</div>
        <div className="space-y-2">
          {(d.upcoming_checkins || []).map((c, i) => (
            <div key={i} className="flex items-center justify-between text-sm">
              <span className="text-gray-200">{c.guest}</span>
              <span className="text-xs text-muted-foreground">{c.date} · <span className="text-emerald">{c.status}</span></span>
            </div>
          ))}
        </div>
      </div>

      {/* Transfers */}
      <div className="glass rounded-xl p-4">
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-emerald mb-2"><Banknote size={14} /> Storico Bonifici Ricevuti</div>
        <div className="space-y-2">
          {(d.transfers || []).map((t, i) => (
            <div key={i} className="flex items-center justify-between text-sm font-mono">
              <span className="text-gray-300">{t.date}</span>
              <span className="text-gray-200">Bonifico inviato: <span className="text-emerald font-bold">{t.amount.toLocaleString("it-IT")}€</span> ✔️</span>
            </div>
          ))}
        </div>
      </div>

      {/* Maintenance & bills */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gold mb-2"><Wrench size={14} /> Manutenzioni</div>
          {(d.maintenance || []).map((m, i) => (
            <div key={i} className="text-sm text-gray-200">{m.item} <span className="text-xs text-amber">· {m.status}</span></div>
          ))}
        </div>
        <div className="glass rounded-xl p-4">
          <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gold mb-2"><FileText size={14} /> Bollette</div>
          {(d.bills || []).map((b, i) => (
            <div key={i} className="text-sm text-gray-200">{b.item} <span className="text-xs text-emerald">· {b.status}</span></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export const DEMO_BNB_DATA = {
  property_name: "Casa Vacanza Macchia Romana",
  monthly_income: 1340,
  occupancy: 94,
  upcoming_checkins: [
    { guest: "Famiglia Esposito", date: "Oggi", status: "Check-in confermato" },
    { guest: "Mr. Johnson (UK)", date: "Domani", status: "In arrivo 14:00" },
  ],
  transfers: [
    { date: "15/10", amount: 1290, label: "Bonifico ✔️" },
    { date: "15/09", amount: 1180, label: "Bonifico ✔️" },
    { date: "15/08", amount: 1620, label: "Bonifico ✔️" },
  ],
  income_chart: [
    { month: "Mag", value: 980 }, { month: "Giu", value: 1180 },
    { month: "Lug", value: 1620 }, { month: "Ago", value: 1710 },
    { month: "Set", value: 1180 }, { month: "Ott", value: 1340 },
  ],
  maintenance: [{ item: "Caldaia — revisione annuale", status: "Programmata 22/10" }],
  bills: [{ item: "Enel + Acqua Ottobre", status: "Pagata da Supreme House ✔️" }],
};
