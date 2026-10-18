import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Settings2, Save, Plus, Trash2, Check, X } from "lucide-react";
import { api, currentMonthLabel } from "@/lib/api";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const inp = "bg-night/70 border-gold/20 focus-visible:ring-gold text-sm";

export const SiteSection = () => {
  return (
    <div data-testid="section-site">
      <div className="flex items-center gap-2 text-gold mb-5"><Settings2 size={20} /><h2 className="font-display text-2xl text-white">Gestione Totale Sito</h2></div>
      <Tabs defaultValue="ticker">
        <TabsList className="bg-night/70 border border-gold/20 flex-wrap h-auto">
          <TabsTrigger value="ticker" data-testid="site-tab-ticker" className="data-[state=active]:bg-gold data-[state=active]:text-obsidian">Ticker & Statistiche</TabsTrigger>
          <TabsTrigger value="services" data-testid="site-tab-services" className="data-[state=active]:bg-gold data-[state=active]:text-obsidian">Servizi</TabsTrigger>
          <TabsTrigger value="bacheca" data-testid="site-tab-bacheca" className="data-[state=active]:bg-gold data-[state=active]:text-obsidian">Bacheca Chi Cerca</TabsTrigger>
        </TabsList>
        <TabsContent value="ticker" className="mt-5"><TickerStats /></TabsContent>
        <TabsContent value="services" className="mt-5"><ServicesManager /></TabsContent>
        <TabsContent value="bacheca" className="mt-5"><BachecaManager /></TabsContent>
      </Tabs>
    </div>
  );
};

const TickerStats = () => {
  const qc = useQueryClient();
  const { data: home } = useQuery({ queryKey: ["home"], queryFn: async () => (await api.get("/content/home")).data });
  const [items, setItems] = useState("");
  const [stats, setStats] = useState([]);
  useEffect(() => {
    if (home?.ticker?.items) setItems(home.ticker.items.join("\n"));
    if (home?.stats) setStats(home.stats);
  }, [home]);

  const saveTicker = async () => {
    await api.put("/admin/ticker", { items: items.split("\n").map((s) => s.trim()).filter(Boolean), updated_label: currentMonthLabel() });
    toast.success("Ticker aggiornato"); qc.invalidateQueries({ queryKey: ["home"] });
  };
  const saveStat = async (s) => {
    await api.put(`/admin/stats/${s.id}`, { value: Number(s.value), label: s.label, prefix: s.prefix, suffix: s.suffix });
    toast.success("Statistica aggiornata"); qc.invalidateQueries({ queryKey: ["home"] });
  };

  return (
    <div className="space-y-6">
      <div className="glass-gold rounded-2xl p-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-display text-lg text-white">Barra Ticker Scorrevole (una voce per riga)</h3>
          <button data-testid="ticker-save" onClick={saveTicker} className="flex items-center gap-1.5 px-4 py-2 rounded-full metallic text-sm font-semibold"><Save size={14} /> Salva Ticker</button>
        </div>
        <Textarea data-testid="ticker-textarea" value={items} onChange={(e) => setItems(e.target.value)} className={inp + " min-h-[140px] font-mono"} />
      </div>

      <div className="glass-gold rounded-2xl p-5">
        <h3 className="font-display text-lg text-white mb-3">6 Contatori Statistiche del Gruppo</h3>
        <div className="grid sm:grid-cols-2 gap-3">
          {stats.map((s, i) => (
            <div key={s.id} className="glass rounded-xl p-3 flex items-end gap-2" data-testid={`stat-edit-${i}`}>
              <div className="w-16"><label className="text-[10px] text-muted-foreground">Pre</label><Input value={s.prefix} onChange={(e) => setStats(stats.map((x) => x.id === s.id ? { ...x, prefix: e.target.value } : x))} className={inp + " h-8"} /></div>
              <div className="w-20"><label className="text-[10px] text-muted-foreground">Valore</label><Input value={s.value} onChange={(e) => setStats(stats.map((x) => x.id === s.id ? { ...x, value: e.target.value } : x))} className={inp + " h-8"} /></div>
              <div className="w-16"><label className="text-[10px] text-muted-foreground">Suf</label><Input value={s.suffix} onChange={(e) => setStats(stats.map((x) => x.id === s.id ? { ...x, suffix: e.target.value } : x))} className={inp + " h-8"} /></div>
              <div className="flex-1"><label className="text-[10px] text-muted-foreground">Etichetta</label><Input value={s.label} onChange={(e) => setStats(stats.map((x) => x.id === s.id ? { ...x, label: e.target.value } : x))} className={inp + " h-8"} /></div>
              <button data-testid={`stat-save-${i}`} onClick={() => saveStat(s)} className="h-8 px-3 rounded-full metallic text-xs"><Save size={13} /></button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const emptyService = { icon: "Sparkles", title: "", short: "", full: "", active: true };

const ServicesManager = () => {
  const qc = useQueryClient();
  const { data: services = [] } = useQuery({ queryKey: ["services-admin"], queryFn: async () => (await api.get("/services")).data });
  const [editing, setEditing] = useState(null);
  const refresh = () => { qc.invalidateQueries({ queryKey: ["services-admin"] }); qc.invalidateQueries({ queryKey: ["services"] }); };

  const toggle = async (s) => { await api.put(`/admin/services/${s.id}`, { active: !s.active }); refresh(); };
  const del = async (id) => { await api.delete(`/admin/services/${id}`); toast.success("Servizio eliminato"); refresh(); };
  const save = async () => {
    if (!editing.title) { toast.error("Inserisci il titolo"); return; }
    if (editing.id) await api.put(`/admin/services/${editing.id}`, editing);
    else await api.post("/admin/services", editing);
    toast.success("Servizio salvato"); setEditing(null); refresh();
  };

  return (
    <div>
      <div className="flex justify-end mb-3">
        <button data-testid="service-new" onClick={() => setEditing(emptyService)} className="flex items-center gap-1.5 px-4 py-2 rounded-full metallic text-sm font-semibold"><Plus size={14} /> Nuovo servizio</button>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {services.map((s) => (
          <div key={s.id} className="glass-gold rounded-xl p-4" data-testid={`service-manage-${s.id}`}>
            <div className="flex items-start justify-between gap-2">
              <div><div className="font-semibold text-white text-sm">{s.title}</div><div className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{s.short}</div></div>
              <div className="flex items-center gap-2 shrink-0">
                <Switch checked={s.active} onCheckedChange={() => toggle(s)} data-testid={`service-toggle-${s.id}`} />
                <button onClick={() => setEditing(s)} className="text-gold text-xs">Modifica</button>
                <button onClick={() => del(s.id)} className="text-red-400"><Trash2 size={14} /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {editing && (
        <div className="glass-gold rounded-2xl p-5 mt-4" data-testid="service-editor">
          <div className="flex items-center justify-between mb-3"><h3 className="font-display text-lg text-white">{editing.id ? "Modifica servizio" : "Nuovo servizio"}</h3><button onClick={() => setEditing(null)} className="text-muted-foreground"><X size={18} /></button></div>
          <div className="space-y-3">
            <Input placeholder="Icona lucide (es. Lock, Building2)" value={editing.icon} onChange={(e) => setEditing({ ...editing, icon: e.target.value })} className={inp} />
            <Input data-testid="service-title" placeholder="Titolo" value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className={inp} />
            <Input placeholder="Descrizione breve" value={editing.short} onChange={(e) => setEditing({ ...editing, short: e.target.value })} className={inp} />
            <Textarea placeholder="Testo completo pagina interna" value={editing.full} onChange={(e) => setEditing({ ...editing, full: e.target.value })} className={inp + " min-h-[100px]"} />
            <button data-testid="service-save" onClick={save} className="w-full py-3 rounded-full metallic font-semibold">Salva servizio</button>
          </div>
        </div>
      )}
    </div>
  );
};

const emptyReq = { profile: "", searching: "", zone: "", budget: "", verified: true, approved: true };

const BachecaManager = () => {
  const qc = useQueryClient();
  const { data: reqs = [] } = useQuery({ queryKey: ["buyer-admin"], queryFn: async () => (await api.get("/admin/buyer-requests")).data });
  const [editing, setEditing] = useState(null);
  const refresh = () => { qc.invalidateQueries({ queryKey: ["buyer-admin"] }); qc.invalidateQueries({ queryKey: ["buyer-requests"] }); qc.invalidateQueries({ queryKey: ["home"] }); };

  const approve = async (r) => { await api.put(`/admin/buyer-requests/${r.id}`, { approved: !r.approved }); refresh(); };
  const del = async (id) => { await api.delete(`/admin/buyer-requests/${id}`); toast.success("Richiesta eliminata"); refresh(); };
  const save = async () => {
    if (!editing.searching) { toast.error("Inserisci cosa cerca"); return; }
    if (editing.id) await api.put(`/admin/buyer-requests/${editing.id}`, editing);
    else await api.post("/admin/buyer-requests", editing);
    toast.success("Richiesta salvata"); setEditing(null); refresh();
  };

  return (
    <div>
      <div className="flex justify-end mb-3">
        <button data-testid="bacheca-new" onClick={() => setEditing(emptyReq)} className="flex items-center gap-1.5 px-4 py-2 rounded-full metallic text-sm font-semibold"><Plus size={14} /> Nuova richiesta</button>
      </div>
      <div className="space-y-3">
        {reqs.map((r) => (
          <div key={r.id} className="glass-gold rounded-xl p-4 flex items-center justify-between gap-3" data-testid={`bacheca-item-${r.id}`}>
            <div className="min-w-0">
              <div className="text-xs font-mono text-gold">#{r.ref_code} {r.approved ? <span className="text-emerald">· Pubblicata</span> : <span className="text-amber">· In attesa</span>}</div>
              <div className="font-semibold text-white text-sm">{r.profile}</div>
              <div className="text-xs text-muted-foreground truncate">{r.searching} · {r.zone} · {r.budget}</div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button data-testid={`bacheca-approve-${r.id}`} onClick={() => approve(r)} className={`px-3 py-1.5 rounded-full text-xs ${r.approved ? "border border-amber/40 text-amber" : "metallic"}`}>{r.approved ? "Nascondi" : "Approva"}</button>
              <button onClick={() => setEditing(r)} className="text-gold text-xs">Modifica</button>
              <button onClick={() => del(r.id)} className="text-red-400"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
      {editing && (
        <div className="glass-gold rounded-2xl p-5 mt-4" data-testid="bacheca-editor">
          <div className="flex items-center justify-between mb-3"><h3 className="font-display text-lg text-white">{editing.id ? "Modifica richiesta" : "Nuova richiesta"}</h3><button onClick={() => setEditing(null)} className="text-muted-foreground"><X size={18} /></button></div>
          <div className="space-y-3">
            <Input placeholder="Profilo (es. Dirigente Medico)" value={editing.profile} onChange={(e) => setEditing({ ...editing, profile: e.target.value })} className={inp} />
            <Input data-testid="bacheca-searching" placeholder="Cosa cerca" value={editing.searching} onChange={(e) => setEditing({ ...editing, searching: e.target.value })} className={inp} />
            <Input placeholder="Zona" value={editing.zone} onChange={(e) => setEditing({ ...editing, zone: e.target.value })} className={inp} />
            <Input placeholder="Budget" value={editing.budget} onChange={(e) => setEditing({ ...editing, budget: e.target.value })} className={inp} />
            <label className="flex items-center gap-2 text-sm text-gray-300"><Switch checked={editing.approved} onCheckedChange={(v) => setEditing({ ...editing, approved: v })} /> Pubblicata</label>
            <button data-testid="bacheca-save" onClick={save} className="w-full py-3 rounded-full metallic font-semibold">Salva richiesta</button>
          </div>
        </div>
      )}
    </div>
  );
};
