import React, { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { LayoutGrid, Save, Plus, Trash2, ArrowUp, ArrowDown, Eye, EyeOff, ChevronDown } from "lucide-react";
import { api } from "@/lib/api";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const inp = "bg-white border-black/10 focus-visible:ring-gold text-sm";

// [key, label, isTextarea?]
const E = "eyebrow", T = "title", SUB = "subtitle";
const eyebrow = [E, "Eyebrow"], title = [T, "Titolo"], subtitle = [SUB, "Sottotitolo", 1];

const SCHEMA = {
  hero: {
    name: "Hero (intestazione)",
    text: [eyebrow, title, ["title_accent", "Titolo · accento (oro)"], subtitle,
      ["card_top", "Riquadro · riga 1"], ["card_bottom", "Riquadro · riga 2"],
      ["cta_primary", "Bottone principale"], ["cta_secondary", "Bottone secondario"], ["image", "Immagine di sfondo (URL)"]],
    strlist: [["trust_badges", "Badge di fiducia"]],
  },
  buyers: { name: "Chi cerca casa ORA", text: [eyebrow, title, subtitle] },
  featured: { name: "Immobili & Aste più visti", text: [eyebrow, title, subtitle] },
  bnb: {
    name: "Gestionale B&B", text: [eyebrow, title, ["body", "Testo", 1], ["cta_demo", "Bottone demo"], ["cta_affida", "Bottone affida"]],
    cards: { key: "cards", label: "Card statistiche", fields: [["k", "Valore"], ["v", "Etichetta"]], blank: { k: "", v: "" } },
  },
  neighborhoods: { name: "Osservatorio quartieri", text: [eyebrow, title, subtitle] },
  poles: { name: "Poli Basilicata", text: [eyebrow, title, subtitle] },
  stats: { name: "Statistiche del gruppo", text: [eyebrow, title] },
  concluded: { name: "Operazioni concluse", text: [eyebrow, title, subtitle] },
  faq: { name: "FAQ", text: [eyebrow, title] },
  network: {
    name: "Cresci con noi (network)", text: [eyebrow, title],
    cards: { key: "cards", label: "Card azioni", fields: [["title", "Titolo"], ["amount", "Etichetta"], ["desc", "Descrizione", 1]], blank: { kind: "segnala", title: "", amount: "", desc: "" } },
  },
};

const move = (arr, i, dir) => {
  const j = i + dir;
  if (j < 0 || j >= arr.length) return arr;
  const c = [...arr];
  [c[i], c[j]] = [c[j], c[i]];
  return c;
};

export const HomeEditorSection = () => {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["settings"], queryFn: async () => (await api.get("/content/settings")).data });
  const [order, setOrder] = useState([]);
  const [sections, setSections] = useState({});
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    if (data?.home) {
      setOrder(data.home.order || Object.keys(SCHEMA));
      setSections(data.home.sections || {});
    }
  }, [data]);

  const setField = (id, k, v) => setSections((p) => ({ ...p, [id]: { ...p[id], [k]: v } }));

  const save = async () => {
    try {
      await api.put("/admin/settings", { home: { order, sections } });
      toast.success("Home salvata e aggiornata"); qc.invalidateQueries({ queryKey: ["settings"] });
    } catch { toast.error("Errore nel salvataggio"); }
  };

  return (
    <div data-testid="section-home">
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div className="flex items-center gap-2 text-gold"><LayoutGrid size={20} /><h2 className="font-display text-2xl text-neutral-900">Sezioni Home</h2></div>
        <button data-testid="home-save" onClick={save} className="flex items-center gap-1.5 px-4 py-2 rounded-full metallic text-sm font-semibold"><Save size={14} /> Salva Home</button>
      </div>
      <p className="text-sm text-neutral-500 mb-5">Accendi/spegni, riordina e modifica ogni blocco della Home. Premi <span className="text-gold font-medium">Salva Home</span> per pubblicare.</p>

      <div className="space-y-3">
        {order.map((id, i) => {
          const schema = SCHEMA[id];
          if (!schema) return null;
          const s = sections[id] || {};
          const open = openId === id;
          const vis = s.visible !== false;
          return (
            <div key={id} className="glass-gold rounded-2xl overflow-hidden" data-testid={`home-row-${id}`}>
              <div className="flex items-center gap-2 p-3">
                <div className="flex flex-col">
                  <button onClick={() => setOrder(move(order, i, -1))} className="text-neutral-400 hover:text-gold" data-testid={`home-up-${id}`}><ArrowUp size={15} /></button>
                  <button onClick={() => setOrder(move(order, i, 1))} className="text-neutral-400 hover:text-gold" data-testid={`home-down-${id}`}><ArrowDown size={15} /></button>
                </div>
                <button onClick={() => setOpenId(open ? null : id)} className="flex-1 flex items-center gap-2 text-left">
                  <span className="font-semibold text-neutral-900 text-sm">{schema.name}</span>
                  {!vis && <span className="text-[10px] uppercase tracking-wide text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">nascosta</span>}
                </button>
                <button onClick={() => setField(id, "visible", !vis)} data-testid={`home-visible-${id}`}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${vis ? "text-emerald bg-emerald-50" : "text-neutral-400 bg-neutral-100"}`}>
                  {vis ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
                <button onClick={() => setOpenId(open ? null : id)} className="w-9 h-9 flex items-center justify-center text-neutral-400">
                  <ChevronDown size={18} className={`transition-transform ${open ? "rotate-180" : ""}`} />
                </button>
              </div>

              {open && (
                <div className="px-4 pb-4 pt-1 border-t border-black/5 space-y-3" data-testid={`home-editor-${id}`}>
                  <div className="grid sm:grid-cols-2 gap-3 pt-3">
                    {schema.text.map(([k, label, area]) => (
                      <div key={k} className={area ? "sm:col-span-2" : ""}>
                        <label className="text-[11px] text-neutral-500 mb-1 block">{label}</label>
                        {area
                          ? <Textarea data-testid={`home-${id}-${k}`} value={s[k] || ""} onChange={(e) => setField(id, k, e.target.value)} className={inp + " min-h-[64px]"} />
                          : <Input data-testid={`home-${id}-${k}`} value={s[k] || ""} onChange={(e) => setField(id, k, e.target.value)} className={inp} />}
                      </div>
                    ))}
                  </div>

                  {(schema.strlist || []).map(([k, label]) => (
                    <StrList key={k} label={label} items={s[k] || []} onChange={(v) => setField(id, k, v)} testPrefix={`home-${id}-${k}`} />
                  ))}

                  {schema.cards && (
                    <CardsEditor cfg={schema.cards} items={s[schema.cards.key] || []} onChange={(v) => setField(id, schema.cards.key, v)} idPrefix={`home-${id}`} />
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const StrList = ({ label, items, onChange, testPrefix }) => (
  <div>
    <label className="text-[11px] text-neutral-500 mb-1 block">{label}</label>
    <div className="space-y-2">
      {items.map((x, i) => (
        <div key={i} className="flex items-center gap-2">
          <Input value={x} onChange={(e) => onChange(items.map((it, idx) => (idx === i ? e.target.value : it)))} className={inp + " flex-1"} data-testid={`${testPrefix}-${i}`} />
          <button onClick={() => onChange(items.filter((_, idx) => idx !== i))} className="text-red-400"><Trash2 size={14} /></button>
        </div>
      ))}
      <button onClick={() => onChange([...items, ""])} className="flex items-center gap-1 text-gold text-sm" data-testid={`${testPrefix}-add`}><Plus size={14} /> Aggiungi</button>
    </div>
  </div>
);

const CardsEditor = ({ cfg, items, onChange, idPrefix }) => (
  <div>
    <div className="flex items-center justify-between mb-2">
      <label className="text-[11px] text-neutral-500">{cfg.label}</label>
      <button onClick={() => onChange([...items, { ...cfg.blank }])} className="flex items-center gap-1 text-gold text-sm" data-testid={`${idPrefix}-card-add`}><Plus size={14} /> Aggiungi card</button>
    </div>
    <div className="space-y-3">
      {items.map((card, i) => (
        <div key={i} className="bg-white rounded-xl border border-black/5 p-3 grid sm:grid-cols-2 gap-2 relative" data-testid={`${idPrefix}-card-${i}`}>
          {cfg.fields.map(([k, label, area]) => (
            <div key={k} className={area ? "sm:col-span-2" : ""}>
              <label className="text-[10px] text-neutral-400 mb-1 block">{label}</label>
              {area
                ? <Textarea value={card[k] || ""} onChange={(e) => onChange(items.map((c, idx) => (idx === i ? { ...c, [k]: e.target.value } : c)))} className={inp + " min-h-[52px]"} />
                : <Input value={card[k] || ""} onChange={(e) => onChange(items.map((c, idx) => (idx === i ? { ...c, [k]: e.target.value } : c)))} className={inp} />}
            </div>
          ))}
          <button onClick={() => onChange(items.filter((_, idx) => idx !== i))} className="absolute top-2 right-2 text-red-400"><Trash2 size={14} /></button>
        </div>
      ))}
    </div>
  </div>
);
