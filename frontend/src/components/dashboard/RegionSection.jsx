import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Map, Save, Plus, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

export const RegionSection = () => {
  const qc = useQueryClient();
  const { data: home } = useQuery({ queryKey: ["home"], queryFn: async () => (await api.get("/content/home")).data });
  const refresh = () => qc.invalidateQueries({ queryKey: ["home"] });

  const addNeigh = async () => {
    const count = (home?.neighborhoods || []).length;
    await api.post("/admin/neighborhoods", {
      name: "Nuovo Quartiere", position: count + 1, demand_index: 50, demand_trend: "+0%",
      price_sqm: "€ 0/mq", avg_yield: "0%", avg_time: "0 gg", clients_waiting: 0, lat: 40.6418, lng: 15.8086,
    });
    toast.success("Quartiere aggiunto"); refresh();
  };
  const addPole = async () => {
    const count = (home?.poles || []).length;
    await api.post("/admin/poles", { name: "Nuovo Polo", subtitle: "Presidio", order: count + 1, dossiers: 0, active: true });
    toast.success("Polo aggiunto"); refresh();
  };

  return (
    <div data-testid="section-region" className="space-y-8">
      <div className="flex items-center gap-2 text-gold"><Map size={20} /><h2 className="font-display text-2xl text-neutral-900">Quartieri & Poli Regionali</h2></div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-lg text-neutral-900">Quartieri di Potenza</h3>
          <button data-testid="neigh-add" onClick={addNeigh} className="flex items-center gap-1.5 px-4 py-2 rounded-full metallic text-sm font-semibold"><Plus size={14} /> Aggiungi quartiere</button>
        </div>
        <p className="text-xs text-neutral-400 mb-3">L'ordine in classifica segue il campo "Pos" (posizione).</p>
        <div className="space-y-3">
          {(home?.neighborhoods || []).map((n) => <NeighRow key={n.id} n={n} onDone={refresh} />)}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-lg text-neutral-900">Poli della Basilicata</h3>
          <button data-testid="pole-add" onClick={addPole} className="flex items-center gap-1.5 px-4 py-2 rounded-full metallic text-sm font-semibold"><Plus size={14} /> Aggiungi polo</button>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          {(home?.poles || []).map((p) => <PoleRow key={p.id} p={p} onDone={refresh} />)}
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
      name: f.name, position: Number(f.position), demand_index: Number(f.demand_index), demand_trend: f.demand_trend,
      price_sqm: f.price_sqm, avg_yield: f.avg_yield, avg_time: f.avg_time, clients_waiting: Number(f.clients_waiting),
    });
    toast.success(`${f.name} aggiornato`); onDone();
  };
  const del = async () => { await api.delete(`/admin/neighborhoods/${n.id}`); toast.success("Quartiere eliminato"); onDone(); };
  return (
    <div className="glass-gold rounded-xl p-4" data-testid={`region-neigh-${n.position}`}>
      <div className="flex items-center justify-between mb-2 gap-2">
        <Input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} className={inp + " max-w-[220px] font-semibold"} data-testid={`neigh-name-${n.id}`} />
        <div className="flex items-center gap-3">
          <button data-testid={`neigh-save-${n.id}`} onClick={save} className="flex items-center gap-1 text-xs text-gold hover:scale-105 transition-transform"><Save size={13} /> Salva</button>
          <button data-testid={`neigh-del-${n.id}`} onClick={del} className="text-red-400"><Trash2 size={14} /></button>
        </div>
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
    await api.put(`/admin/poles/${p.id}`, { name: f.name, subtitle: f.subtitle, order: Number(f.order), dossiers: Number(f.dossiers), active: f.active });
    toast.success(`${f.name} aggiornato`); onDone();
  };
  const del = async () => { await api.delete(`/admin/poles/${p.id}`); toast.success("Polo eliminato"); onDone(); };
  return (
    <div className="glass-gold rounded-xl p-4" data-testid={`region-pole-${p.order}`}>
      <div className="flex items-center justify-between mb-2 gap-2">
        <Input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} className={inp + " font-semibold"} data-testid={`pole-name-${p.id}`} />
        <div className="flex items-center gap-3 shrink-0">
          <button onClick={save} className="flex items-center gap-1 text-xs text-gold"><Save size={13} /> Salva</button>
          <button data-testid={`pole-del-${p.id}`} onClick={del} className="text-red-400"><Trash2 size={14} /></button>
        </div>
      </div>
      <Input value={f.subtitle} onChange={(e) => setF({ ...f, subtitle: e.target.value })} className={inp + " mb-2"} />
      <div className="flex items-center gap-3 flex-wrap">
        <L label="Ordine"><Input value={f.order} onChange={(e) => setF({ ...f, order: e.target.value })} className={inp + " w-20"} /></L>
        <L label="Dossier"><Input data-testid={`pole-dossiers-${p.id}`} value={f.dossiers} onChange={(e) => setF({ ...f, dossiers: e.target.value })} className={inp + " w-24"} /></L>
        <label className="flex items-center gap-2 text-xs text-neutral-600 mt-4"><Switch checked={f.active} onCheckedChange={(v) => setF({ ...f, active: v })} /> Attivo</label>
      </div>
    </div>
  );
};

const L = ({ label, children }) => (<div><label className="text-[10px] text-muted-foreground block mb-0.5">{label}</label>{children}</div>);
