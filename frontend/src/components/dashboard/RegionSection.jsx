import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Map, Save } from "lucide-react";
import { api } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export const RegionSection = () => {
  const qc = useQueryClient();
  const { data: home } = useQuery({ queryKey: ["home"], queryFn: async () => (await api.get("/content/home")).data });

  return (
    <div data-testid="section-region" className="space-y-8">
      <div className="flex items-center gap-2 text-gold"><Map size={20} /><h2 className="font-display text-2xl text-neutral-900">Classifica Quartieri & 6 Poli Regionali</h2></div>

      <div>
        <h3 className="font-display text-lg text-neutral-900 mb-3">Quartieri di Potenza</h3>
        <div className="space-y-3">
          {(home?.neighborhoods || []).map((n) => <NeighRow key={n.id} n={n} onDone={() => qc.invalidateQueries({ queryKey: ["home"] })} />)}
        </div>
      </div>

      <div>
        <h3 className="font-display text-lg text-neutral-900 mb-3">I 6 Poli della Basilicata</h3>
        <div className="grid md:grid-cols-2 gap-3">
          {(home?.poles || []).map((p) => <PoleRow key={p.id} p={p} onDone={() => qc.invalidateQueries({ queryKey: ["home"] })} />)}
        </div>
      </div>
    </div>
  );
};

const inp = "bg-white border-gold/20 focus-visible:ring-gold text-sm h-9";

const NeighRow = ({ n, onDone }) => {
  const [f, setF] = useState(n);
  useEffect(() => setF(n), [n]);
  const save = async () => {
    await api.put(`/admin/neighborhoods/${n.id}`, {
      position: Number(f.position), demand_index: Number(f.demand_index), demand_trend: f.demand_trend,
      price_sqm: f.price_sqm, avg_yield: f.avg_yield, avg_time: f.avg_time, clients_waiting: Number(f.clients_waiting),
    });
    toast.success(`${f.name} aggiornato`); onDone();
  };
  return (
    <div className="glass-gold rounded-xl p-4" data-testid={`region-neigh-${n.position}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-neutral-900">{n.name}</span>
        <button data-testid={`neigh-save-${n.id}`} onClick={save} className="flex items-center gap-1 text-xs text-gold hover:scale-105 transition-transform"><Save size={13} /> Salva</button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
        <L label="Pos"><Input value={f.position} onChange={(e) => setF({ ...f, position: e.target.value })} className={inp} /></L>
        <L label="Indice"><Input data-testid={`neigh-index-${n.id}`} value={f.demand_index} onChange={(e) => setF({ ...f, demand_index: e.target.value })} className={inp} /></L>
        <L label="Trend"><Input value={f.demand_trend} onChange={(e) => setF({ ...f, demand_trend: e.target.value })} className={inp} /></L>
        <L label="€/mq"><Input value={f.price_sqm} onChange={(e) => setF({ ...f, price_sqm: e.target.value })} className={inp} /></L>
        <L label="Rendita"><Input value={f.avg_yield} onChange={(e) => setF({ ...f, avg_yield: e.target.value })} className={inp} /></L>
        <L label="Tempo"><Input value={f.avg_time} onChange={(e) => setF({ ...f, avg_time: e.target.value })} className={inp} /></L>
        <L label="Clienti"><Input data-testid={`neigh-clients-${n.id}`} value={f.clients_waiting} onChange={(e) => setF({ ...f, clients_waiting: e.target.value })} className={inp} /></L>
      </div>
    </div>
  );
};

const PoleRow = ({ p, onDone }) => {
  const [f, setF] = useState(p);
  useEffect(() => setF(p), [p]);
  const save = async () => {
    await api.put(`/admin/poles/${p.id}`, { subtitle: f.subtitle, dossiers: Number(f.dossiers), active: f.active });
    toast.success(`${f.name} aggiornato`); onDone();
  };
  return (
    <div className="glass-gold rounded-xl p-4" data-testid={`region-pole-${p.order}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-neutral-900 text-sm">{p.name}</span>
        <button onClick={save} className="flex items-center gap-1 text-xs text-gold"><Save size={13} /> Salva</button>
      </div>
      <Input value={f.subtitle} onChange={(e) => setF({ ...f, subtitle: e.target.value })} className={inp + " mb-2"} />
      <div className="flex items-center gap-3">
        <L label="Dossier"><Input data-testid={`pole-dossiers-${p.id}`} value={f.dossiers} onChange={(e) => setF({ ...f, dossiers: e.target.value })} className={inp + " w-24"} /></L>
        <label className="flex items-center gap-2 text-xs text-neutral-600 mt-4"><Switch checked={f.active} onCheckedChange={(v) => setF({ ...f, active: v })} /> Attivo</label>
      </div>
    </div>
  );
};

const L = ({ label, children }) => (<div><label className="text-[10px] text-muted-foreground block mb-0.5">{label}</label>{children}</div>);
