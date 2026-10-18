import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { HelpCircle, Plus, Trash2, X, Save, FileText, Plug, Sparkles } from "lucide-react";
import { api } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

const inp = "bg-white border-black/10 focus-visible:ring-gold text-sm";

/* ---------------- FAQ ---------------- */
const emptyFaq = { question: "", answer: "", active: true };
export const FaqSection = () => {
  const qc = useQueryClient();
  const { data: faqs = [] } = useQuery({ queryKey: ["faq-admin"], queryFn: async () => (await api.get("/admin/faq")).data });
  const [editing, setEditing] = useState(null);
  const refresh = () => { qc.invalidateQueries({ queryKey: ["faq-admin"] }); qc.invalidateQueries({ queryKey: ["faq"] }); };
  const del = async (id) => { await api.delete(`/admin/faq/${id}`); toast.success("FAQ eliminata"); refresh(); };
  const save = async () => {
    if (!editing.question) { toast.error("Inserisci la domanda"); return; }
    if (editing.id) await api.put(`/admin/faq/${editing.id}`, editing);
    else await api.post("/admin/faq", editing);
    toast.success("FAQ salvata"); setEditing(null); refresh();
  };
  return (
    <div data-testid="section-faq">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2 text-gold"><HelpCircle size={20} /><h2 className="font-display text-2xl text-neutral-900">Gestione FAQ</h2></div>
        <button data-testid="faq-new" onClick={() => setEditing(emptyFaq)} className="flex items-center gap-1.5 px-4 py-2 rounded-full metallic text-sm font-semibold"><Plus size={14} /> Nuova FAQ</button>
      </div>
      <div className="space-y-3">
        {faqs.map((f) => (
          <div key={f.id} className="glass-gold rounded-xl p-4 flex items-start justify-between gap-3" data-testid={`faq-item-${f.id}`}>
            <div><div className="font-semibold text-neutral-900 text-sm">{f.question} {!f.active && <span className="text-amber-600 text-xs">(nascosta)</span>}</div><div className="text-xs text-neutral-500 mt-1 line-clamp-2">{f.answer}</div></div>
            <div className="flex items-center gap-2 shrink-0"><button onClick={() => setEditing(f)} className="text-gold text-xs">Modifica</button><button onClick={() => del(f.id)} className="text-red-400"><Trash2 size={14} /></button></div>
          </div>
        ))}
      </div>
      {editing && (
        <div className="glass-gold rounded-2xl p-5 mt-4" data-testid="faq-editor">
          <div className="flex items-center justify-between mb-3"><h3 className="font-display text-lg text-neutral-900">{editing.id ? "Modifica FAQ" : "Nuova FAQ"}</h3><button onClick={() => setEditing(null)}><X size={18} /></button></div>
          <div className="space-y-3">
            <Input data-testid="faq-q" placeholder="Domanda" value={editing.question} onChange={(e) => setEditing({ ...editing, question: e.target.value })} className={inp} />
            <Textarea data-testid="faq-a" placeholder="Risposta" value={editing.answer} onChange={(e) => setEditing({ ...editing, answer: e.target.value })} className={inp + " min-h-[100px]"} />
            <label className="flex items-center gap-2 text-sm text-neutral-700"><Switch checked={editing.active} onCheckedChange={(v) => setEditing({ ...editing, active: v })} /> Visibile sul sito</label>
            <button data-testid="faq-save" onClick={save} className="w-full py-3 rounded-full metallic font-semibold">Salva FAQ</button>
          </div>
        </div>
      )}
    </div>
  );
};

/* ---------------- Settings / Contenuti ---------------- */
const FIELDS = [
  ["brand_name", "Nome Brand"], ["brand_tagline", "Sottotitolo Brand"],
  ["agency_phone", "Telefono agenzia"], ["agency_whatsapp", "WhatsApp agenzia"], ["footer_desc", "Footer · Descrizione", true],
];
export const SettingsSection = () => {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["settings"], queryFn: async () => (await api.get("/content/settings")).data });
  const [f, setF] = useState({});
  useEffect(() => { if (data) setF(data); }, [data]);
  const save = async () => { await api.put("/admin/settings", f); toast.success("Contenuti salvati"); qc.invalidateQueries({ queryKey: ["settings"] }); };
  return (
    <div data-testid="section-settings">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2 text-gold"><FileText size={20} /><h2 className="font-display text-2xl text-neutral-900">Contenuti del Sito</h2></div>
        <button data-testid="settings-save" onClick={save} className="flex items-center gap-1.5 px-4 py-2 rounded-full metallic text-sm font-semibold"><Save size={14} /> Salva contenuti</button>
      </div>
      <div className="glass-gold rounded-2xl p-5 grid sm:grid-cols-2 gap-3">
        {FIELDS.map(([key, label, big]) => (
          <div key={key} className={big ? "sm:col-span-2" : ""}>
            <label className="text-[11px] text-neutral-500 mb-1 block">{label}</label>
            {big
              ? <Textarea data-testid={`set-${key}`} value={f[key] || ""} onChange={(e) => setF({ ...f, [key]: e.target.value })} className={inp + " min-h-[70px]"} />
              : <Input data-testid={`set-${key}`} value={f[key] || ""} onChange={(e) => setF({ ...f, [key]: e.target.value })} className={inp} />}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ---------------- Integrazioni / Config ---------------- */
const emptyCfg = { label: "", key: "", value: "", category: "Integrazione", enabled: true };
export const ConfigSection = () => {
  const qc = useQueryClient();
  const { data: items = [] } = useQuery({ queryKey: ["config"], queryFn: async () => (await api.get("/admin/config")).data });
  const [editing, setEditing] = useState(null);
  const refresh = () => qc.invalidateQueries({ queryKey: ["config"] });
  const del = async (id) => { await api.delete(`/admin/config/${id}`); refresh(); };
  const save = async () => {
    if (!editing.label) { toast.error("Inserisci un'etichetta"); return; }
    if (editing.id) await api.put(`/admin/config/${editing.id}`, editing);
    else await api.post("/admin/config", editing);
    toast.success("Integrazione salvata"); setEditing(null); refresh();
  };
  return (
    <div data-testid="section-config">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 text-gold"><Plug size={20} /><h2 className="font-display text-2xl text-neutral-900">Integrazioni & Configurazioni</h2></div>
        <button data-testid="config-new" onClick={() => setEditing(emptyCfg)} className="flex items-center gap-1.5 px-4 py-2 rounded-full metallic text-sm font-semibold"><Plus size={14} /> Nuova integrazione</button>
      </div>
      <p className="text-sm text-neutral-500 mb-5 flex items-center gap-1.5"><Sparkles size={14} className="text-gold" /> Aggiungi in autonomia chiavi, token o parametri di qualsiasi servizio esterno (es. Google Analytics, Pixel, API, Webhook, Social).</p>
      <div className="space-y-3">
        {items.map((c) => (
          <div key={c.id} className="glass-gold rounded-xl p-4 flex items-center justify-between gap-3" data-testid={`config-item-${c.id}`}>
            <div className="min-w-0">
              <div className="text-xs text-gold">{c.category} {c.enabled ? <span className="text-emerald">· attiva</span> : <span className="text-neutral-400">· disattiva</span>}</div>
              <div className="font-semibold text-neutral-900 text-sm">{c.label}</div>
              <div className="text-xs text-neutral-500 font-mono truncate">{c.key}: {c.value}</div>
            </div>
            <div className="flex items-center gap-2 shrink-0"><button onClick={() => setEditing(c)} className="text-gold text-xs">Modifica</button><button onClick={() => del(c.id)} className="text-red-400"><Trash2 size={14} /></button></div>
          </div>
        ))}
        {items.length === 0 && <div className="text-sm text-neutral-500 text-center py-8">Nessuna integrazione configurata.</div>}
      </div>
      {editing && (
        <div className="glass-gold rounded-2xl p-5 mt-4" data-testid="config-editor">
          <div className="flex items-center justify-between mb-3"><h3 className="font-display text-lg text-neutral-900">{editing.id ? "Modifica" : "Nuova integrazione"}</h3><button onClick={() => setEditing(null)}><X size={18} /></button></div>
          <div className="grid sm:grid-cols-2 gap-3">
            <Input data-testid="cfg-label" placeholder="Etichetta (es. Google Analytics)" value={editing.label} onChange={(e) => setEditing({ ...editing, label: e.target.value })} className={inp} />
            <Input placeholder="Categoria" value={editing.category} onChange={(e) => setEditing({ ...editing, category: e.target.value })} className={inp} />
            <Input data-testid="cfg-key" placeholder="Chiave / Parametro" value={editing.key} onChange={(e) => setEditing({ ...editing, key: e.target.value })} className={inp} />
            <Input data-testid="cfg-value" placeholder="Valore / Token" value={editing.value} onChange={(e) => setEditing({ ...editing, value: e.target.value })} className={inp} />
            <label className="flex items-center gap-2 text-sm text-neutral-700 sm:col-span-2"><Switch checked={editing.enabled} onCheckedChange={(v) => setEditing({ ...editing, enabled: v })} /> Attiva</label>
            <button data-testid="cfg-save" onClick={save} className="sm:col-span-2 w-full py-3 rounded-full metallic font-semibold">Salva integrazione</button>
          </div>
        </div>
      )}
    </div>
  );
};
